

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  Save,
  ShoppingBag,
  Eye,
  CreditCard,
  Edit,
  AlertCircle,
  FileText,
  Lock
} from "lucide-react";
import { useUsers } from "@/context/UserContext";
import { useOrders } from "@/context/OrderContext";
import { User as UserType } from "@/types/User";
import { Order } from "@/types/Order";
import { CHILEAN_REGIONS, getCitiesForRegion } from "@/utils/chileData";
import { validateCardNumber, validateExpiryDate, validateCardHolder, formatCardNumber, formatExpiryDate, maskCardNumber } from "@/utils/validationUtils";
import ReceiptModal from "@/components/ReceiptModal";

interface PerfilModalsProps {
  currentUser: UserType;
  userOrders: Order[];
  ordersLoading: boolean;
  onUserUpdate: (updatedUser: UserType) => void;
}

export const PersonalInfoModal = ({ currentUser, onUserUpdate }: { currentUser: UserType; onUserUpdate: (updatedUser: UserType) => void }) => {
  const { updateUser } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: currentUser.nombre || '',
    correo: currentUser.correo || '',
    telefono: currentUser.telefono || '',
    rut: currentUser.rut || ''
  });
  const [preferences, setPreferences] = useState({
    email: currentUser.preferenciasComunicacion?.email ?? true,
    sms: currentUser.preferenciasComunicacion?.sms ?? false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Sync state with currentUser when it changes
  useEffect(() => {
    setFormData({
      nombre: currentUser.nombre || '',
      correo: currentUser.correo || '',
      telefono: currentUser.telefono || '',
      rut: currentUser.rut || ''
    });
    setPreferences({
      email: currentUser.preferenciasComunicacion?.email ?? true,
      sms: currentUser.preferenciasComunicacion?.sms ?? false
    });
  }, [currentUser]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre es requerido";
    if (!formData.correo.trim()) newErrors.correo = "Correo es requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "Correo electrónico inválido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const updatedUser = {
        ...currentUser,
        nombre: formData.nombre,
        correo: formData.correo,
        telefono: formData.telefono,
        rut: formData.rut,
        preferenciasComunicacion: preferences
      };

      await updateUser(currentUser.id, updatedUser);
      onUserUpdate(updatedUser);
      setIsOpen(false);
      toast.success("Información personal actualizada exitosamente");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar la información personal");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Edit className="w-4 h-4 mr-2" />
          Editar Información Personal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Información Personal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre" className="text-slate-300">Nombre completo *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre}</p>}
              </div>
              <div>
                <Label htmlFor="rut" className="text-slate-300">RUT</Label>
                <Input
                  id="rut"
                  value={formData.rut}
                  onChange={(e) => setFormData(prev => ({ ...prev, rut: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="12.345.678-9"
                />
              </div>
              <div>
                <Label htmlFor="telefono" className="text-slate-300">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="+569XXXXXXXX"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="correo" className="text-slate-300">Correo electrónico *</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData(prev => ({ ...prev, correo: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
              {errors.correo && <p className="text-red-400 text-sm mt-1">{errors.correo}</p>}
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm">
                El RUT y tipo de cuenta no pueden modificarse por seguridad
              </span>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Communication Preferences */}
          <div className="space-y-4">
            <h3 className="text-white font-medium">Preferencias de Comunicación</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={preferences.email}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, email: checked as boolean }))}
                />
                <Label htmlFor="email" className="text-slate-300">Notificaciones por email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms"
                  checked={preferences.sms}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, sms: checked as boolean }))}
                />
                <Label htmlFor="sms" className="text-slate-300">Notificaciones por SMS</Label>
              </div>

            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal para Direcciones
export const AddressesModal = ({ currentUser, onUserUpdate, open, onOpenChange }: { currentUser: UserType; onUserUpdate: (updatedUser: UserType) => void; open?: boolean; onOpenChange?: (open: boolean) => void }) => {
  const { updateUser } = useUsers();
  const [isOpen, setIsOpen] = useState(false);

  // Use external control if provided, otherwise internal
  const modalOpen = open !== undefined ? open : isOpen;
  const setModalOpen = onOpenChange || setIsOpen;
  const [isSaving, setIsSaving] = useState(false);
  const [addresses, setAddresses] = useState<any[]>(currentUser.direcciones || []);
  const [newAddress, setNewAddress] = useState({
    calle: '',
    numero: '',
    apartamento: '',
    ciudad: '',
    region: ''
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Sync addresses state with currentUser.direcciones
  useEffect(() => {
    setAddresses(currentUser.direcciones || []);
  }, [currentUser.direcciones]);

  const handleAddOrUpdateAddress = async () => {
    if (addresses.length >= 3 && editingIndex === null) {
      toast.warning("No puedes agregar más de 3 direcciones");
      return;
    }

    if (!newAddress.calle || !newAddress.numero || !newAddress.ciudad || !newAddress.region) {
      toast.warning("Completa todos los campos requeridos");
      return;
    }

    const address = {
      ...newAddress
    };

    let updatedAddresses;
    if (editingIndex !== null) {
      updatedAddresses = [...addresses];
      updatedAddresses[editingIndex] = address;
    } else {
      updatedAddresses = [...addresses, address];
    }

    try {
      await updateUser(currentUser.id, { direcciones: updatedAddresses });
      const updatedUser = { ...currentUser, direcciones: updatedAddresses };
      onUserUpdate(updatedUser);
      setAddresses(updatedAddresses);
      setNewAddress({
        calle: '',
        numero: '',
        apartamento: '',
        ciudad: '',
        region: ''
      });
      setEditingIndex(null);
      toast.success(editingIndex !== null ? "Dirección actualizada exitosamente" : "Dirección agregada exitosamente");
    } catch (error) {
      console.error("Error adding/updating address:", error);
      toast.error("Error al agregar/actualizar la dirección");
    }
  };

  const handleRemoveAddress = async (index: number) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    try {
      await updateUser(currentUser.id, { direcciones: updatedAddresses });
      const updatedUser = { ...currentUser, direcciones: updatedAddresses };
      onUserUpdate(updatedUser);
      setAddresses(updatedAddresses);
      toast.success("Dirección eliminada exitosamente");
    } catch (error) {
      console.error("Error removing address:", error);
      toast.error("Error al eliminar la dirección");
    }
  };

  const handleEditAddress = (index: number) => {
    const address = addresses[index];
    setNewAddress({
      calle: address.calle || '',
      numero: address.numero || '',
      apartamento: address.apartamento || '',
      ciudad: address.ciudad || '',
      region: address.region || ''
    });
    setEditingIndex(index);
  };

  const handleUpdateAddress = async () => {
    if (editingIndex === null) return;

    if (!newAddress.calle || !newAddress.numero || !newAddress.ciudad || !newAddress.region) {
      toast.warning("Completa todos los campos requeridos");
      return;
    }

    const updatedAddress = {
      ...newAddress
    };

    const updatedAddresses = [...addresses];
    updatedAddresses[editingIndex] = updatedAddress;

    try {
      await updateUser(currentUser.id, { direcciones: updatedAddresses });
      const updatedUser = { ...currentUser, direcciones: updatedAddresses };
      onUserUpdate(updatedUser);
      setAddresses(updatedAddresses);
      setNewAddress({
        calle: '',
        numero: '',
        apartamento: '',
        ciudad: '',
        region: ''
      });
      setEditingIndex(null);
      toast.success("Dirección actualizada exitosamente");
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Error al actualizar la dirección");
    }
  };

  const handleCancelEdit = () => {
    setNewAddress({
      calle: '',
      numero: '',
      apartamento: '',
      ciudad: '',
      region: ''
    });
    setEditingIndex(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUser(currentUser.id, { direcciones: addresses });
      const updatedUser = { ...currentUser, direcciones: addresses };
      onUserUpdate(updatedUser);
      setModalOpen(false);
      toast.success("Direcciones actualizadas exitosamente");
    } catch (error) {
      console.error("Error updating addresses:", error);
      toast.error("Error al actualizar direcciones");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Direcciones de Envío
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Addresses */}
          <div className="space-y-3">
            <h3 className="text-white font-medium">Direcciones Guardadas</h3>
            {addresses.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No tienes direcciones guardadas
              </div>
            ) : (
              addresses.map((address, index) => (
                <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {address.calle} {address.numero}
                        {address.apartamento && `, ${address.apartamento}`}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {address.ciudad}, {address.region}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAddress(index)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAddress(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Separator className="bg-slate-700" />

          {/* Add New Address */}
          <div className="space-y-4">
            <h3 className="text-white font-medium">
              Agregar Nueva Dirección
              {addresses.length > 0 && (
                <span className="text-slate-400 text-sm ml-2">
                  ({addresses.length}/3 direcciones)
                </span>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-slate-300">Calle *</Label>
                <Input
                  value={newAddress.calle}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, calle: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Nombre de la calle"
                />
              </div>
              <div>
                <Label className="text-slate-300">Número *</Label>
                <Input
                  value={newAddress.numero}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, numero: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="123"
                />
              </div>
              <div>
                <Label className="text-slate-300">Apartamento (opcional)</Label>
                <Input
                  value={newAddress.apartamento}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, apartamento: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Depto 4B"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Región *</Label>
                <Select value={newAddress.region} onValueChange={(value) => setNewAddress(prev => ({ ...prev, region: value, ciudad: '' }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Región" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {CHILEAN_REGIONS.map((region) => (
                      <SelectItem key={region} value={region} className="text-white hover:bg-slate-600">
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">Ciudad *</Label>
                <Select value={newAddress.ciudad} onValueChange={(value) => setNewAddress(prev => ({ ...prev, ciudad: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Comuna" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {newAddress.region && getCitiesForRegion(newAddress.region).map((city) => (
                      <SelectItem key={city} value={city} className="text-white hover:bg-slate-600">
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleAddOrUpdateAddress}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {editingIndex !== null ? 'Actualizar Dirección' : 'Agregar Dirección'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal para Pedidos
export const OrdersModal = ({ userOrders, ordersLoading }: { userOrders: Order[]; ordersLoading: boolean }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const handleViewReceipt = (order: Order) => {
    setSelectedOrder(order);
    setIsReceiptModalOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Ver Todos los Pedidos
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Historial de Pedidos
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-slate-400 ml-2">Cargando pedidos...</span>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No tienes pedidos aún</p>
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/");
                  }}
                >
                  Explorar Productos
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.map((order) => (
                  <div key={order.id} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="text-white font-medium">
                            Orden #{order.numeroOrden}
                          </p>
                          <Badge
                            className={`text-xs ${order.estado === "entregado"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : order.estado === "pendiente"
                                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              } border`}
                          >
                            {order.estado}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm mt-1">
                          {new Date(order.fechaCreacion).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {order.items?.length || 0} producto{order.items?.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <p className="text-white font-bold text-lg">
                          ${order.total.toLocaleString()}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            onClick={() => handleViewReceipt(order)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Ver Boleta
                          </Button>
                          {/* Removed "Ver Detalles" button as it was redundant or navigating to a non-existent page in some contexts, 
                              but if needed it can be kept. The user asked for receipt view specifically. 
                              I will keep the original navigation if it was working, or just replace it? 
                              The original code had: navigate(`/usuario/pedido/${order.id}`);
                              I'll keep it for completeness but prioritize the receipt button.
                          */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            onClick={() => {
                              setIsOpen(false);
                              navigate(`/usuario/pedido/${order.id}`);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Detalles
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        order={selectedOrder}
      />
    </>
  );
};

// Modal para Métodos de Pago
export const PaymentMethodsModal = ({ currentUser, onUserUpdate }: { currentUser: UserType; onUserUpdate: (updatedUser: UserType) => void }) => {
  const { updateUser } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [metodoPagoPreferido, setMetodoPagoPreferido] = useState<"tarjeta" | "transferencia" | "efectivo" | "paypal">(currentUser.metodoPagoPreferido || 'tarjeta');
  const [metodosPago, setMetodosPago] = useState(currentUser.metodosPago || []);

  // Sync state with currentUser when it changes
  useEffect(() => {
    console.log('PaymentMethodsModal: currentUser changed:', currentUser);
    console.log('PaymentMethodsModal: currentUser.metodosPago:', currentUser.metodosPago);
    setMetodosPago(currentUser.metodosPago || []);
    setMetodoPagoPreferido(currentUser.metodoPagoPreferido || 'tarjeta');
  }, [currentUser]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMetodoPago, setNewMetodoPago] = useState({
    tipo: "credito" as "credito" | "debito" | "transferencia" | "efectivo" | "paypal",
    tarjeta: {
      numero: '',
      fechaExpiracion: '',
      titular: ''
    },
    banco: '',
    cuenta: '',
    emailPaypal: ''
  });
  const [cardErrors, setCardErrors] = useState<{ numero?: string; fechaExpiracion?: string; titular?: string }>({});

  const handleAddMetodoPago = () => {
    if (metodosPago.length >= 3) {
      toast.warning("No puedes agregar más de 3 métodos de pago");
      return;
    }

    // Validations
    if (newMetodoPago.tipo === 'credito' || newMetodoPago.tipo === 'debito') {
      const errors: { numero?: string; fechaExpiracion?: string; titular?: string } = {};

      if (!newMetodoPago.tarjeta.numero.trim()) {
        errors.numero = "Número de tarjeta es requerido";
      } else if (!validateCardNumber(newMetodoPago.tarjeta.numero)) {
        errors.numero = "Número de tarjeta inválido";
      }

      if (!newMetodoPago.tarjeta.fechaExpiracion.trim()) {
        errors.fechaExpiracion = "Fecha de expiración es requerida";
      } else if (!validateExpiryDate(newMetodoPago.tarjeta.fechaExpiracion)) {
        errors.fechaExpiracion = "Fecha de expiración inválida";
      }

      if (!newMetodoPago.tarjeta.titular.trim()) {
        errors.titular = "Titular es requerido";
      } else if (!validateCardHolder(newMetodoPago.tarjeta.titular)) {
        errors.titular = "Nombre del titular inválido";
      }

      setCardErrors(errors);
      if (Object.keys(errors).length > 0) return;
    } else if (newMetodoPago.tipo === 'transferencia') {
      if (!newMetodoPago.banco || !newMetodoPago.cuenta) {
        toast.warning("Completa todos los campos de la transferencia");
        return;
      }
    } else if (newMetodoPago.tipo === 'paypal') {
      if (!newMetodoPago.emailPaypal) {
        toast.warning("Ingresa tu email de PayPal");
        return;
      }
    }

    const metodoPago = {
      id: Date.now().toString(),
      tipo: newMetodoPago.tipo,
      esPredeterminado: metodosPago.length === 0, // First one is default
      ...((newMetodoPago.tipo === 'credito' || newMetodoPago.tipo === 'debito') && {
        tarjeta: {
          ...newMetodoPago.tarjeta,
          numero: maskCardNumber(newMetodoPago.tarjeta.numero)
        }
      }),
      ...(newMetodoPago.tipo === 'transferencia' && { banco: newMetodoPago.banco, cuenta: newMetodoPago.cuenta }),
      ...(newMetodoPago.tipo === 'paypal' && { emailPaypal: newMetodoPago.emailPaypal })
    };

    setMetodosPago(prev => [...prev, metodoPago]);
    setNewMetodoPago({
      tipo: "credito",
      tarjeta: { numero: '', fechaExpiracion: '', titular: '' },
      banco: '',
      cuenta: '',
      emailPaypal: ''
    });
    setCardErrors({});
    setShowAddForm(false);
  };

  const handleRemoveMetodoPago = (id: string) => {
    setMetodosPago(prev => prev.filter(m => m.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setMetodosPago(prev => prev.map(m => ({ ...m, esPredeterminado: m.id === id })));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const defaultMetodo = metodosPago.find(m => m.esPredeterminado);
      const updatedUser = {
        ...currentUser,
        metodoPagoPreferido: defaultMetodo?.tipo || metodoPagoPreferido,
        metodosPago: metodosPago.map(m => ({
          ...m,
          // Siempre enviamos ID como undefined para forzar la recreación en el backend
          // Esto evita errores de "detached entity" al usar clear() + addAll() en JPA
          id: undefined
        }))
      };

      await updateUser(currentUser.id, updatedUser);
      onUserUpdate(updatedUser);
      setIsOpen(false);
      toast.success("Métodos de pago actualizados exitosamente");
    } catch (error) {
      console.error("Error updating payment methods:", error);
      toast.error("Error al actualizar los métodos de pago");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
          <CreditCard className="w-4 h-4 mr-2" />
          Gestionar Métodos de Pago
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Métodos de Pago
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Gestiona tus tarjetas y cuentas bancarias para futuras compras.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Payment Methods */}
          <div className="space-y-3">
            <h3 className="text-white font-medium">Métodos de Pago Guardados</h3>
            {metodosPago.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No tienes métodos de pago guardados
              </div>
            ) : (
              metodosPago.map((metodo) => (
                <div key={metodo.id} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={metodo.esPredeterminado ? "default" : "secondary"}>
                          {metodo.esPredeterminado ? "Predeterminado" : "Secundario"}
                        </Badge>
                        <span className="text-white font-medium capitalize">{metodo.tipo}</span>
                      </div>
                      {(metodo.tipo === 'tarjeta' || metodo.tipo === 'credito' || metodo.tipo === 'debito') && metodo.tarjeta && (
                        <p className="text-slate-400 text-sm">
                          **** **** **** {metodo.tarjeta.numero.slice(-4)} - {metodo.tarjeta.titular}
                        </p>
                      )}
                      {metodo.tipo === 'transferencia' && (
                        <p className="text-slate-400 text-sm">
                          {metodo.banco} - Cuenta: {metodo.cuenta}
                        </p>
                      )}
                      {metodo.tipo === 'paypal' && (
                        <p className="text-slate-400 text-sm">
                          {metodo.emailPaypal}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!metodo.esPredeterminado && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(metodo.id)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          Establecer como Predeterminado
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMetodoPago(metodo.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Separator className="bg-slate-700" />

          {/* Add New Payment Method */}
          <div className="space-y-4">
            {!showAddForm ? (
              <Button
                variant="outline"
                onClick={() => setShowAddForm(true)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                disabled={metodosPago.length >= 3}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Método de Pago
                {metodosPago.length > 0 && (
                  <span className="text-slate-400 text-sm ml-2">
                    ({metodosPago.length}/3)
                  </span>
                )}
              </Button>
            ) : (
              <div className="space-y-4 p-4 bg-slate-700/30 rounded-lg">
                <h4 className="text-white font-medium">Agregar Nuevo Método de Pago</h4>

                <div>
                  <Label className="text-slate-300">Tipo de Método de Pago</Label>
                  <Select
                    value={newMetodoPago.tipo}
                    onValueChange={(value) => setNewMetodoPago(prev => ({ ...prev, tipo: value as any }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="credito" className="text-white hover:bg-slate-600">Tarjeta de Crédito</SelectItem>
                      <SelectItem value="debito" className="text-white hover:bg-slate-600">Tarjeta de Débito</SelectItem>
                      <SelectItem value="transferencia" className="text-white hover:bg-slate-600">Transferencia Bancaria</SelectItem>
                      <SelectItem value="efectivo" className="text-white hover:bg-slate-600">Efectivo</SelectItem>
                      <SelectItem value="paypal" className="text-white hover:bg-slate-600">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Card Details */}
                {(newMetodoPago.tipo === 'credito' || newMetodoPago.tipo === 'debito') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label className="text-slate-300">Número de Tarjeta</Label>
                      <Input
                        value={newMetodoPago.tarjeta.numero}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          setNewMetodoPago(prev => ({
                            ...prev,
                            tarjeta: { ...prev.tarjeta, numero: formatted }
                          }));
                          if (cardErrors.numero) setCardErrors(prev => ({ ...prev, numero: undefined }));
                        }}
                        className={`bg-slate-700 border-slate-600 text-white ${cardErrors.numero ? 'border-red-500' : ''}`}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                      />
                      {cardErrors.numero && <p className="text-red-400 text-sm mt-1">{cardErrors.numero}</p>}
                    </div>
                    <div>
                      <Label className="text-slate-300">Fecha de Expiración</Label>
                      <Input
                        value={newMetodoPago.tarjeta.fechaExpiracion}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          setNewMetodoPago(prev => ({
                            ...prev,
                            tarjeta: { ...prev.tarjeta, fechaExpiracion: formatted }
                          }));
                          if (cardErrors.fechaExpiracion) setCardErrors(prev => ({ ...prev, fechaExpiracion: undefined }));
                        }}
                        className={`bg-slate-700 border-slate-600 text-white ${cardErrors.fechaExpiracion ? 'border-red-500' : ''}`}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {cardErrors.fechaExpiracion && <p className="text-red-400 text-sm mt-1">{cardErrors.fechaExpiracion}</p>}
                    </div>
                    <div>
                      <Label className="text-slate-300">Titular de la Tarjeta</Label>
                      <Input
                        value={newMetodoPago.tarjeta.titular}
                        onChange={(e) => {
                          setNewMetodoPago(prev => ({
                            ...prev,
                            tarjeta: { ...prev.tarjeta, titular: e.target.value }
                          }));
                          if (cardErrors.titular) setCardErrors(prev => ({ ...prev, titular: undefined }));
                        }}
                        className={`bg-slate-700 border-slate-600 text-white ${cardErrors.titular ? 'border-red-500' : ''}`}
                        placeholder="Nombre del titular"
                      />
                      {cardErrors.titular && <p className="text-red-400 text-sm mt-1">{cardErrors.titular}</p>}
                    </div>
                  </div>
                )}

                {/* Bank Transfer Details */}
                {newMetodoPago.tipo === 'transferencia' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Banco</Label>
                      <Input
                        value={newMetodoPago.banco}
                        onChange={(e) => setNewMetodoPago(prev => ({ ...prev, banco: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Nombre del banco"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Número de Cuenta</Label>
                      <Input
                        value={newMetodoPago.cuenta}
                        onChange={(e) => setNewMetodoPago(prev => ({ ...prev, cuenta: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Número de cuenta"
                      />
                    </div>
                  </div>
                )}

                {/* PayPal Details */}
                {newMetodoPago.tipo === 'paypal' && (
                  <div>
                    <Label className="text-slate-300">Email de PayPal</Label>
                    <Input
                      value={newMetodoPago.emailPaypal}
                      onChange={(e) => setNewMetodoPago(prev => ({ ...prev, emailPaypal: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="tu@email.com"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleAddMetodoPago} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Método
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Métodos de Pago
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal para Cambiar Contraseña
export const ChangePasswordModal = ({ currentUser, onUserUpdate }: { currentUser: UserType; onUserUpdate: (updatedUser: UserType) => void }) => {
  const { updateUser } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    if (passwords.new.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (passwords.current !== currentUser.contraseña) {
      setError("La contraseña actual es incorrecta");
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser = {
        ...currentUser,
        contraseña: passwords.new
      };

      await updateUser(currentUser.id, updatedUser);
      onUserUpdate(updatedUser);
      setIsOpen(false);
      setPasswords({ current: "", new: "", confirm: "" });
      toast.success("Contraseña actualizada exitosamente");
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Error al actualizar la contraseña");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
          <Lock className="w-4 h-4 mr-2" />
          Cambiar Contraseña
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <div className="p-1 bg-purple-500/10 rounded">
              <div className="flex gap-0.5">
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
              </div>
            </div>
            Cambiar Contraseña
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-slate-300">Contraseña Actual</Label>
            <Input
              id="current-password"
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-slate-300">Nueva Contraseña</Label>
            <Input
              id="new-password"
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-slate-300">Confirmar Nueva Contraseña</Label>
            <Input
              id="confirm-password"
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isSaving ? "Guardando..." : "Actualizar Contraseña"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
