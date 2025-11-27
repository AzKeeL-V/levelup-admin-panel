import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CreditCard,
  MapPin,
  ArrowLeft,
  Shield,
  CheckCircle,
  Mail,
  Phone
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useUsers } from "@/context/UserContext";
import { useProducts } from "@/context/ProductContext";
import ReceiptModal from "@/components/ReceiptModal";
import { OrderRepository } from "@/repositories/OrderRepository";
import { UserRepository } from "@/repositories/UserRepository";
import { ProductRepository } from "@/repositories/ProductRepository";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { users, currentUser, updateUser } = useUsers();
  const { refreshProducts } = useProducts();

  const regions = [
    "Arica y Parinacota",
    "Tarapacá",
    "Antofagasta",
    "Atacama",
    "Coquimbo",
    "Valparaíso",
    "Metropolitana de Santiago",
    "Libertador General Bernardo O'Higgins",
    "Maule",
    "Ñuble",
    "Biobío",
    "Araucanía",
    "Los Ríos",
    "Los Lagos",
    "Aysén del General Carlos Ibáñez del Campo",
    "Magallanes y de la Antártica Chilena"
  ];

  const normalizeRegion = (region: string) => {
    const mapping: Record<string, string> = {
      "Metropolitana": "Metropolitana de Santiago",
      "O'Higgins": "Libertador General Bernardo O'Higgins",
      "Aysén": "Aysén del General Carlos Ibáñez del Campo",
      "Magallanes": "Magallanes y de la Antártica Chilena"
    };
    return mapping[region] || region;
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    calle: "",
    numero: "",
    apartamento: "",
    ciudad: "",
    region: "",
    codigoPostal: "",
    notas: "",
    metodoPago: "tarjeta" as "tarjeta" | "transferencia" | "efectivo",
    usarPuntos: false,
    puntosUsar: 0,
    selectedAddressIndex: undefined as number | undefined,
    saveNewAddress: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customPaymentMethods, setCustomPaymentMethods] = useState<string[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState("");

  // Load user data if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        nombre: currentUser.nombre || "",
        email: currentUser.correo || "",
        telefono: currentUser.telefono || "",
        selectedAddressIndex: undefined,
        calle: "",
        numero: "",
        apartamento: "",
        ciudad: "",
        region: normalizeRegion(currentUser.region || ""),
        codigoPostal: ""
      }));
    }
  }, [currentUser]);

  // Redirect if cart is empty
  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0 && !showReceipt) {
      navigate("/carrito");
    }
  }, [cart.items.length, navigate, showReceipt]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  const subtotal = cart.subtotal;
  // Detectar si el usuario es estudiante DUOC
  const isDuocStudent = formData.email.toLowerCase().endsWith('@duocuc.cl');
  const duocDiscount = isDuocStudent ? Math.round(subtotal * 0.2) : 0; // 20% descuento
  const descuentoPuntos = formData.usarPuntos ? Math.min(formData.puntosUsar, subtotal - duocDiscount) : 0;
  const total = subtotal - duocDiscount - descuentoPuntos;
  const puntosGanados = cart.items.reduce((sum, item) => sum + (item.puntosGanados || 0) * item.quantity, 0);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
    if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es requerido";
    if (!formData.calle.trim()) newErrors.calle = "La calle es requerida";
    if (!formData.numero.trim()) newErrors.numero = "El número es requerido";
    if (!formData.ciudad.trim()) newErrors.ciudad = "La ciudad es requerida";
    if (!formData.region.trim()) newErrors.region = "La región es requerida";

    if (formData.usarPuntos && formData.puntosUsar > (currentUser?.puntos || 0)) {
      newErrors.puntosUsar = "No tienes suficientes puntos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePuntosChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      usarPuntos: checked,
      puntosUsar: checked ? Math.min(currentUser?.puntos || 0, subtotal) : 0
    }));
  };

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.trim()) {
      setCustomPaymentMethods((prev) => [...prev, newPaymentMethod.trim()]);
      setNewPaymentMethod("");
      setIsPaymentModalOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const orderData = {
        userId: currentUser?.id || "guest",
        userName: formData.nombre,
        userEmail: formData.email,
        items: cart.items.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          puntosGanados: item.puntosGanados || 0
        })),
        subtotal,
        descuentoDuoc: duocDiscount,
        descuentoPuntos: descuentoPuntos,
        total,
        puntosUsados: formData.usarPuntos ? formData.puntosUsar : 0,
        puntosGanados,
        estado: "pendiente" as const,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        direccionEnvio: {
          nombre: formData.nombre,
          calle: formData.calle,
          numero: formData.numero,
          apartamento: formData.apartamento || undefined,
          ciudad: formData.ciudad,
          region: formData.region,
          codigoPostal: formData.codigoPostal,
          pais: "Chile",
          telefono: formData.telefono
        },
        metodoPago: formData.metodoPago,
        notas: formData.notas || undefined,
        // Identificar que este pedido fue creado por un usuario
        creadoPor: "usuario" as const,
        adminId: undefined,
        adminNombre: undefined,
        datosPago: undefined
      };

      const savedOrder = await OrderRepository.create(orderData);

      if (currentUser) {
        const newPoints = (currentUser.puntos || 0) - (formData.usarPuntos ? formData.puntosUsar : 0) + puntosGanados;
        await updateUser(currentUser.id, { puntos: newPoints });

        // Save new address if checkbox is checked
        if (formData.saveNewAddress && formData.selectedAddressIndex === undefined) {
          const newAddress = {
            calle: formData.calle,
            numero: formData.numero,
            apartamento: formData.apartamento || undefined,
            ciudad: formData.ciudad,
            region: formData.region,
            codigoPostal: formData.codigoPostal || undefined
          };

          const updatedDirecciones = [...(currentUser.direcciones || []), newAddress];
          await updateUser(currentUser.id, { direcciones: updatedDirecciones });
        }
      }

      // Deduct stock for each item
      for (const item of cart.items) {
        try {
          if (item.productId) {
            await ProductRepository.updateStock(item.productId, item.quantity);
          }
        } catch (err) {
          console.error(`Error updating stock for item ${item.productName}:`, err);
        }
      }

      // Refresh products context to reflect new stock levels
      await refreshProducts();

      console.log("Order created successfully. Object:", savedOrder);

      console.log("Setting completedOrder...");
      setCompletedOrder(savedOrder);

      console.log("Setting showReceipt to true...");
      setShowReceipt(true);

      toast.success("¡Pedido realizado con éxito!");

      // Limpiar carrito
      clearCart();

    } catch (error) {
      console.error("Error processing order:", error);
      alert("Error al procesar el pedido. Por favor intenta nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  console.log("Checkout Render. showReceipt:", showReceipt, "completedOrder:", completedOrder);

  if (cart.items.length === 0 && !showReceipt) {
    console.log("Cart empty and no receipt, returning null");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />

      {/* Banner */}
      <div className="relative w-full max-h-48 overflow-hidden">
        <img
          src="/images/inicio/banner_carrito.png"
          alt="Banner Checkout"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/carrito")}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al carrito
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Información de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Address Selection */}
                {currentUser && (
                  <div className="space-y-3">
                    <Label className="text-slate-300">Seleccionar dirección de envío</Label>
                    <RadioGroup
                      value={formData.selectedAddressIndex?.toString() || "new"}
                      onValueChange={(value) => {
                        if (value === "new") {
                          setFormData(prev => ({
                            ...prev,
                            selectedAddressIndex: undefined,
                            calle: "",
                            numero: "",
                            apartamento: "",
                            ciudad: "",
                            region: "",
                            codigoPostal: ""
                          }));
                        } else {
                          const index = parseInt(value);
                          const address = currentUser.direcciones?.[index];
                          console.log("Seleccionada dirección:", address);
                          if (address) {
                            const regionValue = normalizeRegion(address.region || "");
                            if (!address.region) {
                              alert("Advertencia: La dirección seleccionada no tiene campo 'region'. Por favor revisa el JSON de usuarios.");
                            }
                            setFormData(prev => ({
                              ...prev,
                              selectedAddressIndex: index,
                              calle: address.calle,
                              numero: address.numero,
                              apartamento: address.apartamento || "",
                              ciudad: address.ciudad || address.comuna || "",
                              region: regionValue,
                              codigoPostal: address.codigoPostal || ""
                            }));
                          }
                        }
                      }}
                      className="space-y-2"
                    >
                      {currentUser.direcciones?.map((address, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 border border-slate-600 rounded-lg hover:bg-slate-700/50">
                          <RadioGroupItem value={index.toString()} id={`address-${index}`} />
                          <Label htmlFor={`address-${index}`} className="flex-1 cursor-pointer">
                            <div className="text-white text-sm">
                              <p className="font-medium">{address.calle} {address.numero}</p>
                              {address.apartamento && <p>{address.apartamento}</p>}
                              <p>{address.ciudad || address.comuna}, {normalizeRegion(address.region || "")}</p>
                              {address.codigoPostal && <p>Código Postal: {address.codigoPostal}</p>}
                            </div>
                          </Label>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2 p-3 border border-slate-600 rounded-lg hover:bg-slate-700/50">
                        <RadioGroupItem value="new" id="new-address" />
                        <Label htmlFor="new-address" className="flex-1 cursor-pointer">
                          <span className="text-white">+ Usar nueva dirección</span>
                        </Label>
                      </div>
                    </RadioGroup>

                    {/* Save New Address Option */}
                    {currentUser && (
                      <div className="flex items-center space-x-2 mt-3">
                        <Checkbox
                          id="saveNewAddress"
                          checked={formData.selectedAddressIndex !== undefined || formData.saveNewAddress}
                          onCheckedChange={(checked) => handleInputChange("saveNewAddress", checked)}
                        />
                        <Label htmlFor="saveNewAddress" className="text-slate-300 text-sm">
                          Guardar esta dirección para futuras compras
                        </Label>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="nombre" className="text-slate-300">Nombre completo *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange("nombre", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Tu nombre completo"
                    />
                    {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-slate-300 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="tu@email.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="telefono" className="text-slate-300 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Teléfono *
                    </Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange("telefono", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="+56 9 1234 5678"
                    />
                    {errors.telefono && <p className="text-red-400 text-sm mt-1">{errors.telefono}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="calle" className="text-slate-300">Calle *</Label>
                    <Input
                      id="calle"
                      value={formData.calle}
                      onChange={(e) => handleInputChange("calle", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Nombre de la calle"
                    />
                    {errors.calle && <p className="text-red-400 text-sm mt-1">{errors.calle}</p>}
                  </div>

                  <div>
                    <Label htmlFor="numero" className="text-slate-300">Número *</Label>
                    <Input
                      id="numero"
                      value={formData.numero}
                      onChange={(e) => handleInputChange("numero", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="123"
                    />
                    {errors.numero && <p className="text-red-400 text-sm mt-1">{errors.numero}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="apartamento" className="text-slate-300">Apartamento/Piso (opcional)</Label>
                    <Input
                      id="apartamento"
                      value={formData.apartamento}
                      onChange={(e) => handleInputChange("apartamento", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Depto 4B"
                    />
                  </div>

                  <div>
                    <Label htmlFor="codigoPostal" className="text-slate-300">Código Postal</Label>
                    <Input
                      id="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={(e) => handleInputChange("codigoPostal", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="1234567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="region" className="text-slate-300">Región *</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) => handleInputChange("region", value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Selecciona una región" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {regions.map((region) => (
                          <SelectItem key={region} value={region} className="text-white hover:bg-slate-600">
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.region && <p className="text-red-400 text-sm mt-1">{errors.region}</p>}
                  </div>

                  <div>
                    <Label htmlFor="ciudad" className="text-slate-300">Ciudad *</Label>
                    <Input
                      id="ciudad"
                      value={formData.ciudad}
                      onChange={(e) => handleInputChange("ciudad", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Santiago"
                    />
                    {errors.ciudad && <p className="text-red-400 text-sm mt-1">{errors.ciudad}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notas" className="text-slate-300">Notas adicionales (opcional)</Label>
                  <Textarea
                    id="notas"
                    value={formData.notas}
                    onChange={(e) => handleInputChange("notas", e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Instrucciones especiales de entrega..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Método de Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.metodoPago}
                  onValueChange={(value) => handleInputChange("metodoPago", value)}
                  className="space-y-3"
                >
                  {/* Saved Payment Methods */}
                  {currentUser?.metodosPago?.map((metodo, index) => (
                    <div
                      key={metodo.id}
                      className="flex items-center space-x-2 p-3 border border-slate-600 rounded-lg hover:bg-slate-700/50"
                    >
                      <RadioGroupItem value={`saved-${metodo.id}`} id={`saved-${metodo.id}`} />
                      <Label htmlFor={`saved-${metodo.id}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          {metodo.tipo === 'tarjeta' && <CreditCard className="w-4 h-4 text-purple-400" />}
                          {metodo.tipo === 'transferencia' && <Shield className="w-4 h-4 text-blue-400" />}
                          {metodo.tipo === 'paypal' && <span className="text-blue-400 font-bold text-xs">PP</span>}

                          <span className="text-white">
                            {metodo.tipo === 'tarjeta' && `Tarjeta terminada en •••• ${metodo.tarjeta?.numero.slice(-4)}`}
                            {metodo.tipo === 'transferencia' && `Banco ${metodo.banco} - ${metodo.cuenta}`}
                            {metodo.tipo === 'paypal' && `PayPal (${metodo.emailPaypal})`}
                          </span>
                          {metodo.esPredeterminado && (
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                              Predeterminado
                            </span>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}

                  <div className="flex items-center space-x-2 p-3 border border-slate-600 rounded-lg hover:bg-slate-700/50">
                    <RadioGroupItem value="tarjeta" id="tarjeta" />
                    <Label htmlFor="tarjeta" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-white">Nueva Tarjeta de Crédito/Débito</span>
                      </div>
                      <p className="text-slate-400 text-sm">Pago seguro con WebPay</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 border border-slate-600 rounded-lg hover:bg-slate-700/50">
                    <RadioGroupItem value="transferencia" id="transferencia" />
                    <Label htmlFor="transferencia" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span className="text-white">Nueva Transferencia Bancaria</span>
                      </div>
                      <p className="text-slate-400 text-sm">Pago directo a cuenta bancaria</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 border border-slate-600 rounded-lg hover:bg-slate-700/50">
                    <RadioGroupItem value="efectivo" id="efectivo" />
                    <Label htmlFor="efectivo" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-white">Pago en Efectivo</span>
                      </div>
                      <p className="text-slate-400 text-sm">Pago contra entrega</p>
                    </Label>
                  </div>

                  {customPaymentMethods.map((method, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-3 border border-slate-600 rounded-lg hover:bg-slate-700/50"
                    >
                      <RadioGroupItem value={method} id={`custom-${index}`} />
                      <Label htmlFor={`custom-${index}`} className="flex-1 cursor-pointer">
                        <span className="text-white">{method}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsPaymentModalOpen(true)}
                >
                  + Agregar Método de Pago
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700 sticky top-20">
              <CardHeader>
                <CardTitle className="text-white">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.productName}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{item.quantity} x {formatPrice(item.unitPrice)}</span>
                          {item.origen === 'recompensas' && (
                            <span className="text-yellow-400">({item.puntosRequeridos} pts/ud)</span>
                          )}
                        </div>
                      </div>
                      {item.origen === 'tienda' && (
                        <p className="text-white font-semibold text-sm">{formatPrice(item.totalPrice)}</p>
                      )}
                      {item.origen === 'recompensas' && (
                        <p className="text-yellow-400 font-semibold text-sm">{item.puntosRequeridos! * item.quantity} pts</p>
                      )}
                    </div>
                  ))}
                </div>

                <Separator className="bg-slate-600" />

                {/* Separated summary by origin */}
                {cart.items.some(item => item.origen === 'tienda') && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-xs font-medium mb-2">🛒 TIENDA REGULAR</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Subtotal tienda:</span>
                        <span className="font-medium">{formatPrice(cart.items.filter(i => i.origen === 'tienda').reduce((sum, i) => sum + i.totalPrice, 0))}</span>
                      </div>
                    </div>
                  </div>
                )}

                {cart.items.some(item => item.origen === 'recompensas') && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <p className="text-yellow-400 text-xs font-medium mb-2">🏆 TIENDA RECOMPENSAS</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Puntos a usar:</span>
                        <span className="font-medium text-yellow-400">{cart.items.filter(i => i.origen === 'recompensas').reduce((sum, i) => sum + (i.puntosRequeridos || 0) * i.quantity, 0)} pts</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal (tienda)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Envío</span>
                    <span className="text-green-400">Gratis</span>
                  </div>

                  {currentUser && currentUser.puntos > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="usarPuntos"
                          checked={formData.usarPuntos}
                          onCheckedChange={handlePuntosChange}
                        />
                        <Label htmlFor="usarPuntos" className="text-slate-300 text-sm">
                          Usar puntos ({currentUser.puntos} disponibles)
                        </Label>
                      </div>

                      {formData.usarPuntos && (
                        <div className="ml-6">
                          <Label htmlFor="puntosUsar" className="text-slate-300 text-sm">Puntos a usar</Label>
                          <Input
                            id="puntosUsar"
                            type="number"
                            min="0"
                            max={Math.min(currentUser.puntos, subtotal)}
                            value={formData.puntosUsar}
                            onChange={(e) => handleInputChange("puntosUsar", parseInt(e.target.value) || 0)}
                            className="bg-slate-700 border-slate-600 text-white text-sm"
                          />
                          {errors.puntosUsar && <p className="text-red-400 text-xs mt-1">{errors.puntosUsar}</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {duocDiscount > 0 && (
                    <div className="flex justify-between text-blue-400">
                      <span>Descuento DUOC (20%)</span>
                      <span>-{formatPrice(duocDiscount)}</span>
                    </div>
                  )}

                  {descuentoPuntos > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Descuento por puntos</span>
                      <span>-{formatPrice(descuentoPuntos)}</span>
                    </div>
                  )}

                  <Separator className="bg-slate-600" />

                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  {puntosGanados > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <p className="text-yellow-400 text-sm text-center">
                        🎉 Ganarás {puntosGanados} puntos con esta compra
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando pedido...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Confirmar Pedido
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Shield className="w-4 h-4" />
                  <span>Pago seguro garantizado</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>

      <Footer />

      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => {
          setShowReceipt(false);
          navigate("/");
        }}
        order={completedOrder}
      />

      {/* Add Payment Method Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Método de Pago</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="newPaymentMethod" className="text-slate-300">
              Nombre del Método de Pago
            </Label>
            <Input
              id="newPaymentMethod"
              value={newPaymentMethod}
              onChange={(e) => setNewPaymentMethod(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Ejemplo: Tarjeta Visa, Cuenta RUT"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsPaymentModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddPaymentMethod}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
