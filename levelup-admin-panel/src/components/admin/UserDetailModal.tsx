import { useState, useEffect, useCallback, memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Calendar,
  Award,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Save,
  Edit,
  Eye,
  UserCheck,
  UserX,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import type { User as UserType } from "@/types/User";
import { Order } from "@/types/Order";
import { useOrders } from "@/context/OrderContext";
import { useUsers } from "@/context/UserContext";
import { useIsMobile } from "@/hooks/use-mobile";
import UserCreateForm from "./UserCreateForm";



interface UserDetailModalProps {
  user: UserType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  isCreateMode?: boolean;
}

const UserDetailModal = ({ user, open, onOpenChange, isEditMode, isCreateMode = false }: UserDetailModalProps) => {
  // Guard against null user when not in create mode
  if (!user && !isCreateMode) return null;

  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingRut, setEditingRut] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRut, setNewRut] = useState("");
  const [newAddress, setNewAddress] = useState<{
    calle: string;
    numero: string;
    apartamento?: string;
    ciudad: string;
    region: string;
    codigoPostal?: string;
    pais?: string;
  }>({
    calle: "",
    numero: "",
    apartamento: "",
    ciudad: "",
    region: "",
    codigoPostal: "",
    pais: "Chile"
  });
  const [saving, setSaving] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [rutError, setRutError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // New user creation state
  const [newUser, setNewUser] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    rut: "",
    telefono: "",
    tipo: "normal" as "normal" | "duoc",
    direccion: {
      calle: "",
      numero: "",
      apartamento: "",
      ciudad: "",
      region: "",
      codigoPostal: "",
      pais: "Chile"
    },
    newsletter: false,
    intereses: [] as string[],
    aceptaTerminos: true,
    aceptaPoliticaPrivacidad: true
  });

  const { getOrdersByUser, updateOrder } = useOrders();
  const { updateUser } = useUsers();
  const isMobile = useIsMobile();

  const loadUserOrders = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingOrders(true);
      const orders = await getOrdersByUser(user.id);
      setUserOrders(orders);
    } catch (error) {
      // console.error("Error loading user orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  }, [user, getOrdersByUser]);

  useEffect(() => {
    if (open && user) {
      loadUserOrders();
      setNewEmail(user.correo);
      setNewPassword("");
      setNewPhone(user.telefono || "");
      setNewRut(user.rut);
      setNewAddress(user.direcciones?.[0] ? { ...user.direcciones[0] } : {
        calle: "",
        numero: "",
        apartamento: "",
        ciudad: "",
        region: "",
        codigoPostal: "",
        pais: "Chile"
      });
      setSuccessMessage(""); // Clear success message when opening
    }
  }, [user, open, loadUserOrders]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+569\d{8}$/;
    return phoneRegex.test(phone);
  };

  const validateAddress = (address: typeof newAddress) => {
    return address.calle.trim() && address.numero.trim() && address.ciudad.trim() && address.region.trim() && address.codigoPostal.trim();
  };

  const validateRut = (rut: string) => {
    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
    return rutRegex.test(rut);
  };

  const handleSaveEmail = async () => {
    if (!newEmail.trim()) {
      setEmailError("El correo electrónico es requerido");
      return;
    }

    if (!validateEmail(newEmail.trim())) {
      setEmailError("Formato de correo electrónico inválido");
      return;
    }

    setEmailError("");

    try {
      setSaving(true);
      await updateUser(user.id, { correo: newEmail.trim() });
      setEditingEmail(false);
      setSuccessMessage("Correo electrónico actualizado exitosamente");
      // Update local user data
      user.correo = newEmail.trim();
    } catch (error) {
      // console.error("Error updating email:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (!newPassword.trim()) return;

    try {
      setSaving(true);
      await updateUser(user.id, { contraseña: newPassword.trim() });
      setEditingPassword(false);
      setNewPassword("");
      setSuccessMessage("Contraseña actualizada exitosamente");
    } catch (error) {
      // console.error("Error updating password:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePhone = async () => {
    if (newPhone.trim() && !validatePhone(newPhone.trim())) {
      setPhoneError("Formato de teléfono inválido. Debe ser +569XXXXXXXX");
      return;
    }

    setPhoneError("");

    try {
      setSaving(true);
      await updateUser(user.id, { telefono: newPhone.trim() || undefined });
      setEditingPhone(false);
      setSuccessMessage("Teléfono actualizado exitosamente");
      // Update local user data
      user.telefono = newPhone.trim() || undefined;
    } catch (error) {
      // console.error("Error updating phone:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRut = async () => {
    if (!newRut.trim()) {
      setRutError("El RUT es requerido");
      return;
    }

    if (!validateRut(newRut.trim())) {
      setRutError("Formato de RUT inválido. Debe ser XX.XXX.XXX-X");
      return;
    }

    setRutError("");

    try {
      setSaving(true);
      await updateUser(user.id, { rut: newRut.trim() });
      setEditingRut(false);
      // Refresh the user data in the parent component
      if (window.location) {
        window.location.reload();
      }
    } catch (error) {
      // console.error("Error updating RUT:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!validateAddress(newAddress)) {
      setAddressError("Todos los campos de dirección son requeridos");
      return;
    }

    setAddressError("");

    try {
      setSaving(true);
      // Update the first address in the direcciones array
      const updatedDirecciones = [...(user.direcciones || [])];
      updatedDirecciones[0] = newAddress;
      await updateUser(user.id, { direcciones: updatedDirecciones });
      setEditingAddress(false);
      // Refresh the user data in the parent component
      if (window.location) {
        window.location.reload();
      }
    } catch (error) {
      // console.error("Error updating address:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderStatus(true);
      await updateOrder(orderId, { estado: newStatus as Order['estado'] });
      // Refresh orders
      await loadUserOrders();
    } catch (error) {
      // console.error("Error updating order status:", error);
    } finally {
      setUpdatingOrderStatus(false);
    }
  };

  const handleToggleUserStatus = async () => {
    try {
      setSaving(true);
      await updateUser(user.id, { activo: !user.activo });
      setSuccessMessage(`Usuario ${!user.activo ? "activado" : "desactivado"} exitosamente`);
      // Update local user data
      user.activo = !user.activo;
    } catch (error) {
      // console.error("Error toggling user status:", error);
    } finally {
      setSaving(false);
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Clock className="w-4 h-4" />;
      case "procesando":
        return <Package className="w-4 h-4" />;
      case "enviado":
        return <Truck className="w-4 h-4" />;
      case "entregado":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelado":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "procesando":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "enviado":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "entregado":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "cancelado":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-secondary";
    }
  };

  const getLevelColor = (nivel: string) => {
    switch (nivel) {
      case "diamante":
        return "bg-accent text-accent-foreground";
      case "oro":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "plata":
        return "bg-gray-500/20 text-gray-300 border-gray-500/50";
      case "bronce":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      default:
        return "bg-secondary";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[90vh] max-h-[90vh] flex flex-col overflow-auto p-4 md:p-6 bg-background mx-auto sm:mx-[8px] sm:w-[calc(100vw-16px)] sm:max-w-none" aria-describedby="user-detail-description">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-lg md:text-xl">
            <User className="w-5 h-5 md:w-6 md:h-6" />
            {isCreateMode ? "Crear Nuevo Usuario" : "Detalles del Usuario"}
          </DialogTitle>
          <DialogDescription id="user-detail-description">
            {isCreateMode
              ? "Complete el formulario para crear un nuevo usuario en el sistema."
              : `Información completa del usuario ${user?.nombre || 'Usuario'}, incluyendo datos personales, pedidos y acciones administrativas.`
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={isEditMode ? "actions" : "personal"} className="w-full flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1">
            <TabsTrigger value="personal" className="text-xs md:text-sm">Información Personal</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs md:text-sm">Pedidos</TabsTrigger>
            <TabsTrigger value="payment" className="text-xs md:text-sm">Medios de Pago</TabsTrigger>
            <TabsTrigger value="actions" className="text-xs md:text-sm">Acciones</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="flex-1 mt-4 md:mt-6 overflow-hidden">
            {isCreateMode ? (
              <UserCreateForm
                open={open}
                onOpenChange={onOpenChange}
                onUserCreated={() => {
                  // Refresh user list or handle creation
                  onOpenChange(false);
                }}
              />
            ) : (
              <ScrollArea className="h-full pr-2 md:pr-4">
                <div className="space-y-4 md:space-y-6">
                  {/* Información Básica */}
                  <Card>
                    <CardHeader className="pb-3 md:pb-4">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <User className="w-4 h-4 md:w-5 md:h-5" />
                        Información Básica
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <label className="text-xs md:text-sm font-medium text-muted-foreground">Nombre</label>
                          <p className="text-base md:text-lg font-semibold break-words">{user.nombre}</p>
                        </div>
                        <div>
                          <label className="text-xs md:text-sm font-medium text-muted-foreground">Correo</label>
                          <p className="flex items-center gap-2 text-sm md:text-base break-all">
                            <Mail className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            {user.correo}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs md:text-sm font-medium text-muted-foreground">RUT</label>
                          <p className="font-mono text-sm md:text-base">{user.rut}</p>
                        </div>
                        <div>
                          <label className="text-xs md:text-sm font-medium text-muted-foreground">Tipo</label>
                          <Badge
                            variant={user.tipo === "duoc" ? "default" : "secondary"}
                            className={`text-xs md:text-sm ${user.tipo === "duoc" ? "bg-primary text-primary-foreground" : ""}`}
                          >
                            {user.tipo === "duoc" && <Shield className="w-2 h-2 md:w-3 md:h-3 mr-1" />}
                            {user.tipo === "duoc" ? "DUOC UC" : "Normal"}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-xs md:text-sm font-medium text-muted-foreground">Puntos Level Up</label>
                          <p className="text-base md:text-lg font-semibold text-primary">
                            {user.puntos.toLocaleString("es-CL")}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs md:text-sm font-medium text-muted-foreground">Nivel</label>
                          <Badge className={`${getLevelColor(user.nivel)} text-xs md:text-sm`}>
                            <Award className="w-2 h-2 md:w-3 md:h-3 mr-1" />
                            {user.nivel.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Información de Contacto y Envío */}
                  <Card>
                    <CardHeader className="pb-3 md:pb-4">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                        Información de Contacto y Envío
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <label className="text-xs md:text-sm font-medium text-muted-foreground">Teléfono</label>
                          <p className="flex items-center gap-2 text-sm md:text-base break-all">
                            <Phone className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            {user.telefono || "No especificado"}
                          </p>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs md:text-sm font-medium text-muted-foreground">Dirección</label>
                          {user.direcciones?.[0] ? (
                            <div className="mt-1 p-2 md:p-3 bg-secondary rounded-md">
                              <p className="font-medium text-sm md:text-base break-words">
                                {user.direcciones[0].calle} {user.direcciones[0].numero}
                                {user.direcciones[0].apartamento && `, ${user.direcciones[0].apartamento}`}
                              </p>
                              <p className="text-xs md:text-sm text-muted-foreground">
                                {user.direcciones[0].ciudad}, {user.direcciones[0].region}
                              </p>
                              <p className="text-xs md:text-sm text-muted-foreground">
                                {user.direcciones[0].pais} - {user.direcciones[0].codigoPostal}
                              </p>
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm md:text-base">No especificada</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preferencias y Marketing */}
                  <Card>
                    <CardHeader className="pb-3 md:pb-4">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <Bell className="w-4 h-4 md:w-5 md:h-5" />
                        Preferencias y Marketing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <label className="text-xs md:text-sm font-medium text-muted-foreground">Comunicación</label>
                          <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
                            {user.preferenciasComunicacion.email && (
                              <Badge variant="outline" className="text-xs">Email</Badge>
                            )}
                            {user.preferenciasComunicacion.sms && (
                              <Badge variant="outline" className="text-xs">SMS</Badge>
                            )}
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs md:text-sm font-medium text-muted-foreground">Intereses</label>
                          <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
                            {user.intereses.map((interes, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {interes}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sistema y Legal */}
                  <Card>
                    <CardHeader className="pb-3 md:pb-4">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                        Sistema y Legal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <label className="text-xs md:text-sm font-medium text-muted-foreground">Fecha de Registro</label>
                          <p className="text-sm md:text-base">{new Date(user.fechaRegistro).toLocaleDateString("es-CL")}</p>
                        </div>
                        <div>
                          <label className="text-xs md:text-sm font-medium text-muted-foreground">Último Acceso</label>
                          <p className="text-sm md:text-base">{user.ultimoAcceso ? new Date(user.ultimoAcceso).toLocaleDateString("es-CL") : "Nunca"}</p>
                        </div>
                        <div>
                          <label className="text-xs md:text-sm font-medium text-muted-foreground">Estado</label>
                          <Badge variant={user.activo ? "default" : "destructive"} className="text-xs md:text-sm">
                            {user.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-xs md:text-sm font-medium text-muted-foreground">Legal</label>
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            <Badge variant={user.aceptaTerminos ? "default" : "destructive"} className="text-xs">
                              {user.aceptaTerminos ? "✓ Términos" : "✗ Términos"}
                            </Badge>
                            <Badge variant={user.aceptaPoliticaPrivacidad ? "default" : "destructive"} className="text-xs">
                              {user.aceptaPoliticaPrivacidad ? "✓ Privacidad" : "✗ Privacidad"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="orders" className="flex-1 mt-6 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                {/* Pedidos del Usuario */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Pedidos del Usuario ({userOrders.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingOrders ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span>Cargando pedidos...</span>
                        </div>
                      </div>
                    ) : userOrders.length > 0 ? (
                      isMobile ? (
                        <div className="space-y-3">
                          {userOrders.map((order) => (
                            <Card key={order.id} className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="font-mono font-semibold text-lg">
                                    {order.numeroOrden}
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedOrder(order)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Fecha</p>
                                    <p className="font-medium">
                                      {new Date(order.fechaCreacion).toLocaleDateString("es-CL")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Estado</p>
                                    <Badge className={getEstadoColor(order.estado)}>
                                      {getEstadoIcon(order.estado)}
                                      <span className="ml-1 capitalize">{order.estado}</span>
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Total</p>
                                    <p className="font-semibold text-primary">
                                      ${order.total.toLocaleString("es-CL")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Puntos</p>
                                    <div className="text-sm">
                                      <p className="text-green-600">+{order.puntosGanados}</p>
                                      {order.puntosUsados > 0 && (
                                        <p className="text-red-600">-{order.puntosUsados}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                                <TableHead>N° Orden</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Puntos</TableHead>
                                <TableHead>Acciones</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {userOrders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-secondary/30">
                                  <TableCell className="font-mono font-semibold">
                                    {order.numeroOrden}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {new Date(order.fechaCreacion).toLocaleDateString("es-CL")}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={getEstadoColor(order.estado)}>
                                      {getEstadoIcon(order.estado)}
                                      <span className="ml-1 capitalize">{order.estado}</span>
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="font-semibold text-primary">
                                    ${order.total.toLocaleString("es-CL")}
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm">
                                      <p className="text-green-600">+{order.puntosGanados}</p>
                                      {order.puntosUsados > 0 && (
                                        <p className="text-red-600">-{order.puntosUsados}</p>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedOrder(order)}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Este usuario aún no ha realizado pedidos</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6 mt-6">
            {/* Información de Pago */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Información de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Método Preferido</label>
                    <p className="capitalize">{user.metodoPagoPreferido || "No especificado"}</p>
                  </div>
                  {user.metodosPago?.find(m => m.tipo === 'tarjeta' && m.esPredeterminado)?.tarjeta && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tarjeta</label>
                      <div className="mt-1 p-3 bg-secondary rounded-md">
                        <p className="font-medium">{user.metodosPago.find(m => m.tipo === 'tarjeta' && m.esPredeterminado)?.tarjeta?.numero}</p>
                        <p className="text-sm text-muted-foreground">
                          Vence: {user.metodosPago.find(m => m.tipo === 'tarjeta' && m.esPredeterminado)?.tarjeta?.fechaExpiracion} - {user.metodosPago.find(m => m.tipo === 'tarjeta' && m.esPredeterminado)?.tarjeta?.titular}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6 mt-6">
            {/* Acciones de Administración */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Acciones de Administración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Cambiar Correo Electrónico</Label>
                    {editingEmail ? (
                      <div className="space-y-2 mt-2">
                        <div className="flex gap-2">
                          <Input
                            id="email"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Nuevo correo electrónico"
                          />
                          <Button
                            onClick={handleSaveEmail}
                            disabled={saving}
                            size="sm"
                          >
                            {saving ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingEmail(false)}
                            size="sm"
                          >
                            Cancelar
                          </Button>
                        </div>
                        {emailError && <p className="text-sm text-destructive">{emailError}</p>}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm text-muted-foreground">{user.correo}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingEmail(true)}
                        >
                          Editar
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="password" className="text-sm font-medium">Cambiar Contraseña</Label>
                    {editingPassword ? (
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Nueva contraseña"
                        />
                        <Button
                          onClick={handleSavePassword}
                          disabled={saving}
                          size="sm"
                        >
                          {saving ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingPassword(false)}
                          size="sm"
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm text-muted-foreground">••••••••</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPassword(true)}
                        >
                          Cambiar
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">Cambiar Teléfono</Label>
                    {editingPhone ? (
                      <div className="space-y-2 mt-2">
                        <div className="flex gap-2">
                          <Input
                            id="phone"
                            type="tel"
                            value={newPhone}
                            onChange={(e) => {
                              let value = e.target.value;
                              // Ensure it starts with +569
                              if (!value.startsWith('+569')) {
                                value = '+569' + value.replace(/^\+569/, '');
                              }
                              // Keep only digits after +569 and limit to 8
                              const afterPrefix = value.slice(4).replace(/\D/g, '').slice(0, 8);
                              setNewPhone('+569' + afterPrefix);
                            }}
                            placeholder="+569XXXXXXXX"
                          />
                          <Button
                            onClick={handleSavePhone}
                            disabled={saving}
                            size="sm"
                          >
                            {saving ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingPhone(false)}
                            size="sm"
                          >
                            Cancelar
                          </Button>
                        </div>
                        {phoneError && <p className="text-sm text-destructive">{phoneError}</p>}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm text-muted-foreground">{user.telefono || "No especificado"}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPhone(true);
                            // Preload with +569 if empty or doesn't start with it
                            const currentPhone = user.telefono || "";
                            if (!currentPhone.startsWith("+569")) {
                              setNewPhone("+569");
                            } else {
                              setNewPhone(currentPhone);
                            }
                          }}
                        >
                          Editar
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="rut" className="text-sm font-medium">Cambiar RUT</Label>
                    {editingRut ? (
                      <div className="space-y-2 mt-2">
                        <div className="flex gap-2">
                          <Input
                            id="rut"
                            type="text"
                            value={newRut}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                              let formatted = value;
                              if (value.length > 2) {
                                formatted = value.slice(0, 2) + '.' + value.slice(2);
                              }
                              if (value.length > 5) {
                                formatted = formatted.slice(0, 6) + '.' + formatted.slice(6);
                              }
                              if (value.length > 8) {
                                formatted = formatted.slice(0, 10) + '-' + formatted.slice(10, 11);
                              }
                              setNewRut(formatted);
                            }}
                            placeholder="sin puntos ni guion"
                            maxLength={12} // 11 digits + 2 dots + 1 dash
                          />
                          <Button
                            onClick={handleSaveRut}
                            disabled={saving}
                            size="sm"
                          >
                            {saving ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingRut(false)}
                            size="sm"
                          >
                            Cancelar
                          </Button>
                        </div>
                        {rutError && <p className="text-sm text-destructive">{rutError}</p>}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm text-muted-foreground">{user.rut}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingRut(true);
                            setNewRut("");
                          }}
                        >
                          Editar
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium">Cambiar Dirección</Label>
                    {editingAddress ? (
                      <div className="space-y-3 mt-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Calle"
                            value={newAddress.calle}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, calle: e.target.value }))}
                          />
                          <Input
                            placeholder="Número"
                            value={newAddress.numero}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, numero: e.target.value }))}
                          />
                        </div>
                        <Input
                          placeholder="Apartamento (opcional)"
                          value={newAddress.apartamento}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, apartamento: e.target.value }))}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Ciudad"
                            value={newAddress.ciudad}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, ciudad: e.target.value }))}
                          />
                          <Input
                            placeholder="Región"
                            value={newAddress.region}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, region: e.target.value }))}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Código Postal"
                            value={newAddress.codigoPostal}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, codigoPostal: e.target.value }))}
                          />
                          <Select value={newAddress.pais} onValueChange={(value) => setNewAddress(prev => ({ ...prev, pais: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Chile">Chile</SelectItem>
                              <SelectItem value="Argentina">Argentina</SelectItem>
                              <SelectItem value="Perú">Perú</SelectItem>
                              <SelectItem value="Colombia">Colombia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveAddress}
                            disabled={saving}
                            size="sm"
                          >
                            {saving ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingAddress(false)}
                            size="sm"
                          >
                            Cancelar
                          </Button>
                        </div>
                        {addressError && <p className="text-sm text-destructive">{addressError}</p>}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="text-sm text-muted-foreground">
                          {user.direcciones?.[0] ? (
                            <div>
                              <p>{user.direcciones[0].calle} {user.direcciones[0].numero}</p>
                              <p className="text-xs">{user.direcciones[0].ciudad}, {user.direcciones[0].region}</p>
                            </div>
                          ) : (
                            "No especificada"
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingAddress(true)}
                        >
                          Editar
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium">Estado del Usuario</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={user.activo ? "default" : "destructive"}>
                        {user.activo ? "Activo" : "Inactivo"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToggleUserStatus}
                        disabled={saving}
                      >
                        {saving ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : user.activo ? (
                          <>
                            <UserX className="w-4 h-4 mr-1" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-1" />
                            Activar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
