import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ShoppingCart, User, CreditCard, Save, Banknote, Building2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUsers } from "@/context/UserContext";
import { useProducts } from "@/context/ProductContext";
import { OrderRepository } from "@/repositories/OrderRepository";
import { ProductRepository } from "@/repositories/ProductRepository";
import { toast } from "sonner";
import ManualPaymentForm, { PaymentData } from "@/components/admin/ManualPaymentForm";
import ReceiptModal from "@/components/ReceiptModal";
import AdminLayout from "@/components/admin/AdminLayout";
import { REGIONES_Y_COMUNAS } from "@/data/chile-data";

const POS = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { currentUser } = useUsers();
    const { refreshProducts } = useProducts();

    const [clientData, setClientData] = useState({
        nombre: "",
        email: "",
        telefono: "+569",
        rut: "",
        region: "",
        ciudad: "",
        calle: "",
        numero: "",
        depto: ""
    });

    const [deliveryMethod, setDeliveryMethod] = useState<"retiro" | "envio">("retiro");
    const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "tarjeta" | "transferencia">("efectivo");
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [completedOrder, setCompletedOrder] = useState<any>(null);

    // Redirect if not admin
    useEffect(() => {
        if (currentUser && currentUser.rol !== 'admin') {
            navigate("/");
        }
    }, [currentUser, navigate]);

    const availableCommunes = useMemo(() => {
        if (!clientData.region) return [];
        const regionData = REGIONES_Y_COMUNAS.find(r => r.region === clientData.region);
        return regionData ? regionData.comunas : [];
    }, [clientData.region]);

    const formatRut = (rut: string) => {
        // Remove dots and hyphens
        let value = rut.replace(/\./g, "").replace(/-/g, "");

        // Limit length (8 or 9 digits typically)
        if (value.length > 9) value = value.slice(0, 9);

        // Format
        if (value.length > 1) {
            const dv = value.slice(-1);
            const rutBody = value.slice(0, -1);
            let formattedBody = "";

            for (let i = rutBody.length - 1, j = 0; i >= 0; i--, j++) {
                if (j > 0 && j % 3 === 0) formattedBody = "." + formattedBody;
                formattedBody = rutBody[i] + formattedBody;
            }
            return `${formattedBody}-${dv}`;
        }
        return value;
    };

    const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9kK]/g, ""); // Allow digits and K
        setClientData(prev => ({ ...prev, rut: formatRut(value) }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // Ensure it starts with +569
        if (!value.startsWith("+569")) {
            value = "+569" + value.replace(/[^0-9]/g, "");
        } else {
            // Allow only digits after prefix
            value = "+569" + value.slice(4).replace(/[^0-9]/g, "");
        }
        // Limit to +569 + 8 digits = 12 chars
        if (value.length > 12) value = value.slice(0, 12);

        setClientData(prev => ({ ...prev, telefono: value }));
    };

    const handleClientChange = (field: string, value: string) => {
        setClientData(prev => {
            const updates: any = { [field]: value };
            // Reset comuna if region changes
            if (field === "region") {
                updates.ciudad = "";
            }
            return { ...prev, ...updates };
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
        }).format(price);
    };

    const handleSubmit = async () => {
        // Validations
        if (!clientData.nombre || !clientData.email || !clientData.rut) {
            toast.error("Por favor completa los datos obligatorios del cliente (Nombre, Email, RUT)");
            return;
        }

        if (clientData.telefono.length !== 12) {
            toast.error("El teléfono debe tener el formato +569XXXXXXXX (8 dígitos después del prefijo)");
            return;
        }

        if (clientData.rut.length < 8) { // Basic length check
            toast.error("RUT inválido");
            return;
        }

        if (deliveryMethod === "envio") {
            if (!clientData.region || !clientData.ciudad || !clientData.calle || !clientData.numero) {
                toast.error("Por favor completa la dirección de envío (Región, Comuna, Calle, Número)");
                return;
            }
        }

        if (paymentMethod === "tarjeta" && (!paymentData || !paymentData.isValid)) {
            toast.error("Por favor completa los datos de la tarjeta");
            return;
        }

        if (cart.items.length === 0) {
            toast.error("El carrito está vacío");
            return;
        }

        setIsProcessing(true);

        try {
            const direccionEnvio = deliveryMethod === "retiro"
                ? {
                    nombre: clientData.nombre,
                    calle: "Retiro en Tienda",
                    numero: "",
                    ciudad: "Santiago",
                    region: "Metropolitana",
                    telefono: clientData.telefono
                }
                : {
                    nombre: clientData.nombre,
                    calle: clientData.calle,
                    numero: clientData.numero,
                    apartamento: clientData.depto,
                    ciudad: clientData.ciudad,
                    region: clientData.region,
                    telefono: clientData.telefono,
                };

            const orderData = {
                userId: "guest", // Or search for existing user
                userName: clientData.nombre,
                userEmail: clientData.email,
                userRut: clientData.rut,
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
                subtotal: cart.subtotal,
                descuentoDuoc: 0,
                descuentoPuntos: 0,
                total: cart.subtotal,
                puntosUsados: 0,
                puntosGanados: 0,
                estado: "entregado" as const,
                fechaCreacion: new Date().toISOString(),
                fechaActualizacion: new Date().toISOString(),
                direccionEnvio: direccionEnvio,
                metodoPago: paymentMethod,
                creadoPor: "admin" as const,
                adminId: currentUser?.id,
                adminNombre: currentUser?.nombre,
                datosPago: paymentMethod === "tarjeta" && paymentData ? {
                    numeroTarjeta: `**** ${paymentData.numeroTarjeta}`,
                    tipoTarjeta: paymentData.tipoTarjeta,
                    titular: paymentData.titular
                } : undefined,
                notas: `Venta POS - RUT Cliente: ${clientData.rut} - Entrega: ${deliveryMethod}${deliveryMethod === 'envio' && clientData.depto ? ` - Depto: ${clientData.depto}` : ''}`
            };

            const savedOrder = await OrderRepository.create(orderData);

            // Update stock
            for (const item of cart.items) {
                if (item.productId) {
                    await ProductRepository.updateStock(item.productId, item.quantity);
                }
            }

            await refreshProducts();

            setCompletedOrder(savedOrder);
            setShowReceipt(true);
            toast.success("Venta realizada con éxito");
            clearCart();

        } catch (error) {
            console.error("Error creating order:", error);
            toast.error("Error al procesar la venta");
        } finally {
            setIsProcessing(false);
        }
    };


    if (showReceipt && completedOrder) {
        return (
            <AdminLayout>
                <div className="p-8 flex justify-center">
                    <ReceiptModal
                        isOpen={showReceipt}
                        onClose={() => {
                            setShowReceipt(false);
                            navigate("/admin/dashboard");
                        }}
                        order={completedOrder}
                    />
                    <div className="text-center ml-8 self-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Venta Completada</h2>
                        <div className="space-y-4">
                            <Button onClick={() => navigate("/admin/dashboard")} className="w-full">
                                Volver al Dashboard
                            </Button>
                            <Button variant="outline" onClick={() => setShowReceipt(false)} className="w-full">
                                Nueva Venta
                            </Button>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate("/carrito")} className="text-slate-300">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Carrito
                    </Button>
                    <h1 className="text-3xl font-bold text-white">Punto de Venta (POS)</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Client & Payment */}
                    <div className="space-y-6">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Datos del Cliente
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-slate-300">Nombre Completo *</Label>
                                    <Input
                                        value={clientData.nombre}
                                        onChange={(e) => handleClientChange("nombre", e.target.value)}
                                        className="bg-slate-700 border-slate-600 text-white"
                                        placeholder="Juan Pérez"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-slate-300">RUT *</Label>
                                        <Input
                                            value={clientData.rut}
                                            onChange={handleRutChange}
                                            className="bg-slate-700 border-slate-600 text-white"
                                            placeholder="12.345.678-9"
                                            maxLength={12}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Email *</Label>
                                        <Input
                                            type="email"
                                            value={clientData.email}
                                            onChange={(e) => handleClientChange("email", e.target.value)}
                                            className="bg-slate-700 border-slate-600 text-white"
                                            placeholder="juan@ejemplo.com"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-slate-300">Teléfono *</Label>
                                        <Input
                                            value={clientData.telefono}
                                            onChange={handlePhoneChange}
                                            className="bg-slate-700 border-slate-600 text-white"
                                            placeholder="+569..."
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Formato: +569XXXXXXXX</p>
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Tipo de Entrega</Label>
                                        <RadioGroup
                                            value={deliveryMethod}
                                            onValueChange={(val: "retiro" | "envio") => setDeliveryMethod(val)}
                                            className="flex gap-4 mt-2"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="retiro" id="retiro" className="border-slate-400 text-purple-500" />
                                                <Label htmlFor="retiro" className="text-white cursor-pointer">Retiro</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="envio" id="envio" className="border-slate-400 text-purple-500" />
                                                <Label htmlFor="envio" className="text-white cursor-pointer">Envío</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>

                                {deliveryMethod === "envio" && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-2 border-t border-slate-700">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-slate-300">Región *</Label>
                                                <Select
                                                    value={clientData.region}
                                                    onValueChange={(val) => handleClientChange("region", val)}
                                                >
                                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                                                        <SelectValue placeholder="Selecciona..." />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-700 border-slate-600 text-white">
                                                        {REGIONES_Y_COMUNAS.map((reg) => (
                                                            <SelectItem key={reg.region} value={reg.region} className="hover:bg-slate-600 cursor-pointer">
                                                                {reg.region}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label className="text-slate-300">Comuna *</Label>
                                                <Select
                                                    value={clientData.ciudad}
                                                    onValueChange={(val) => handleClientChange("ciudad", val)}
                                                    disabled={!clientData.region}
                                                >
                                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                                                        <SelectValue placeholder="Selecciona..." />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-700 border-slate-600 text-white">
                                                        {availableCommunes.map((com) => (
                                                            <SelectItem key={com} value={com} className="hover:bg-slate-600 cursor-pointer">
                                                                {com}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="col-span-6">
                                                <Label className="text-slate-300">Calle *</Label>
                                                <Input
                                                    value={clientData.calle}
                                                    onChange={(e) => handleClientChange("calle", e.target.value)}
                                                    className="bg-slate-700 border-slate-600 text-white mt-1"
                                                    placeholder="Av. Principal"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <Label className="text-slate-300">Número *</Label>
                                                <Input
                                                    value={clientData.numero}
                                                    onChange={(e) => handleClientChange("numero", e.target.value)}
                                                    className="bg-slate-700 border-slate-600 text-white mt-1"
                                                    placeholder="123"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <Label className="text-slate-300">Depto</Label>
                                                <Input
                                                    value={clientData.depto}
                                                    onChange={(e) => handleClientChange("depto", e.target.value)}
                                                    className="bg-slate-700 border-slate-600 text-white mt-1"
                                                    placeholder="4B"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Banknote className="w-5 h-5" />
                                    Método de Pago
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={(val: any) => setPaymentMethod(val)}
                                    className="grid grid-cols-3 gap-4"
                                >
                                    <div>
                                        <RadioGroupItem value="efectivo" id="efectivo" className="peer sr-only" />
                                        <Label
                                            htmlFor="efectivo"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-slate-600 bg-slate-700 p-4 hover:bg-slate-600 hover:text-white peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:text-green-500 cursor-pointer"
                                        >
                                            <Banknote className="mb-2 h-6 w-6" />
                                            Efectivo
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="tarjeta" id="tarjeta" className="peer sr-only" />
                                        <Label
                                            htmlFor="tarjeta"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-slate-600 bg-slate-700 p-4 hover:bg-slate-600 hover:text-white peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:text-purple-500 cursor-pointer"
                                        >
                                            <CreditCard className="mb-2 h-6 w-6" />
                                            Tarjeta
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="transferencia" id="transferencia" className="peer sr-only" />
                                        <Label
                                            htmlFor="transferencia"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-slate-600 bg-slate-700 p-4 hover:bg-slate-600 hover:text-white peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:text-blue-500 cursor-pointer"
                                        >
                                            <Building2 className="mb-2 h-6 w-6" />
                                            Transferencia
                                        </Label>
                                    </div>
                                </RadioGroup>

                                {paymentMethod === "tarjeta" && (
                                    <div className="mt-4 animate-in fade-in slide-in-from-top-4">
                                        <ManualPaymentForm onPaymentDataChange={setPaymentData} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="space-y-6">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    Resumen de la Venta
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {cart.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg">
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{item.productName}</p>
                                                <p className="text-sm text-slate-400">{item.quantity} x {formatPrice(item.unitPrice)}</p>
                                            </div>
                                            <p className="text-white font-bold">{formatPrice(item.totalPrice)}</p>
                                        </div>
                                    ))}

                                    <Separator className="bg-slate-600" />

                                    <div className="flex justify-between items-center text-xl font-bold text-white">
                                        <span>Total a Pagar</span>
                                        <span>{formatPrice(cart.subtotal)}</span>
                                    </div>

                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                                        onClick={handleSubmit}
                                        disabled={isProcessing || cart.items.length === 0}
                                    >
                                        {isProcessing ? "Procesando..." : (
                                            <>
                                                <Save className="mr-2 h-5 w-5" />
                                                Finalizar Venta
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default POS;
