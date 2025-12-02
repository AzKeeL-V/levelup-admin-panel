import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CHILEAN_REGIONS, getCitiesForRegion } from "@/utils/chileData";
import {
  ArrowLeft,
  Copy,
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  CreditCard,
  Edit,
  Plus,
  Trash2,
  Award
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUsers } from "@/context/UserContext";
import { useOrders } from "@/context/OrderContext";
import { User as UserType } from "@/types/User";
import { Order } from "@/types/Order";
import {
  PersonalInfoModal,
  AddressesModal,
  OrdersModal,
  PaymentMethodsModal,
  ChangePasswordModal
} from "@/components/usuario/PerfilModals";

const Perfil = () => {
  const navigate = useNavigate();
  const { getOrdersByUser } = useOrders();
  const { currentUser, updateUser } = useUsers();

  // const [currentUser, setCurrentUser] = useState<UserType | null>(null); // Removed local state
  const [isLoading, setIsLoading] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [isAddressesModalOpen, setIsAddressesModalOpen] = useState(false);

  // Load user data
  useEffect(() => {
    if (!currentUser) {
      // If no user in context, redirect to login
      // But wait a bit to ensure context has loaded? 
      // Actually UserContext handles loading state.
      // We can check if we are still loading in context?
      // For now, let's assume if currentUser is null and we are mounted, we might need to login.
      // But UserContext might be loading.
      // Let's rely on the fact that if we are here, Header or App should have handled auth or we are a protected route.
      // But Perfil is a protected page.
      // Let's just load orders if user exists.
    } else {
      loadUserOrders(currentUser.id);
    }
  }, [currentUser]);

  const loadUserOrders = async (userId: string) => {
    setOrdersLoading(true);
    try {
      const orders = await getOrdersByUser(userId);
      // Sort by date (newest first)
      orders.sort((a: Order, b: Order) =>
        new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
      );
      setUserOrders(orders);
    } catch (error) {
      console.error("Error loading user orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleCopyReferralCode = async () => {
    if (!currentUser?.codigoReferido) return;

    try {
      await navigator.clipboard.writeText(currentUser.codigoReferido);
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    } catch (error) {
      console.error("Error copying referral code:", error);
      toast.error("Error al copiar el código de referido");
    }
  };

  const handleUserUpdate = async (updatedUser: UserType) => {
    await updateUser(updatedUser.id, updatedUser);
  };

  const handleEditAddress = (address: any, index: number) => {
    setEditingAddress({ ...address, index });
  };

  const handleSaveAddressEdit = async () => {
    if (!editingAddress || !currentUser) return;

    const { index, ...addressData } = editingAddress;
    const updatedAddresses = [...(currentUser.direcciones || [])];
    updatedAddresses[index] = addressData;

    const updatedUser = { ...currentUser, direcciones: updatedAddresses };
    await handleUserUpdate(updatedUser);
    setEditingAddress(null);
    toast.success("Dirección actualizada exitosamente");
  };

  const handleCancelAddressEdit = () => {
    setEditingAddress(null);
  };

  const handleDeleteAddress = async (index: number) => {
    if (!currentUser) return;

    // Use toast with confirmation action instead of window.confirm
    toast("¿Estás seguro de que quieres eliminar esta dirección?", {
      description: "Esta acción no se puede deshacer.",
      action: {
        label: "Eliminar",
        onClick: async () => {
          const updatedAddresses = currentUser.direcciones.filter((_, i) => i !== index);
          const updatedUser = { ...currentUser, direcciones: updatedAddresses };

          try {
            await handleUserUpdate(updatedUser);
            toast.success("Dirección eliminada exitosamente");
          } catch (error) {
            console.error("Error deleting address:", error);
            toast.error("Error al eliminar la dirección");
          }
        }
      },
      cancel: {
        label: "Cancelar",
        onClick: () => { }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-white">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />

      {/* Hero Banner Section */}
      <div className="relative w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/inicio/banner_perfil_usuario.png"
            alt="Banner Perfil Usuario LevelUp"
            className="w-full h-full object-cover scale-110 animate-zoom-smooth"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/30" />
          {/* Blur fade at bottom to blend with page */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#1A1A2E] via-[#1A1A2E]/50 to-transparent backdrop-blur-sm" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40" />
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-cyan-400 rounded-full animate-pulse opacity-50" />
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
              <span className="block">Mi Perfil</span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                LevelUp
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
              Gestiona tu información personal, direcciones de envío y preferencias de comunicación.
              Mantén tu cuenta actualizada para una mejor experiencia gaming.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content with Tabs */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-0">
                <Tabs defaultValue="account" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 h-12 bg-slate-700/50">
                    <TabsTrigger value="account" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-600">
                      <User className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Mi Cuenta</span>
                    </TabsTrigger>
                    <TabsTrigger value="addresses" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Direcciones</span>
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-600">
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Pago</span>
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-600">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Pedidos</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="account" className="p-4 sm:p-6">
                    {/* Personal Information Section */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Información Personal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                          <div className="space-y-4">
                            <div>
                              <Label className="text-slate-400 text-sm">Nombre completo</Label>
                              <p className="text-white font-medium">{currentUser.nombre || 'No especificado'}</p>
                            </div>
                            <div>
                              <Label className="text-slate-400 text-sm">Correo electrónico</Label>
                              <p className="text-white font-medium">{currentUser.correo || 'No especificado'}</p>
                            </div>
                            <div>
                              <Label className="text-slate-400 text-sm">RUT</Label>
                              <p className="text-white font-medium font-mono">{currentUser.rut}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-slate-400 text-sm">Teléfono</Label>
                              <p className="text-white font-medium">{currentUser.telefono || 'No especificado'}</p>
                            </div>
                            <div>
                              <Label className="text-slate-400 text-sm">Tipo de cuenta</Label>
                              <div>
                                <Badge variant={currentUser.tipo === "duoc" ? "default" : "secondary"}>
                                  {currentUser.tipo === "duoc" ? "DUOC UC" : "Usuario Normal"}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <Label className="text-slate-400 text-sm">Nivel</Label>
                              <div>
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold">
                                  {currentUser.nivel.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <Label className="text-slate-400 text-sm mb-3 block">Preferencias de Comunicación</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${currentUser.preferenciasComunicacion?.email ? 'bg-green-400' : 'bg-slate-600'}`} />
                              <span className="text-slate-300 text-sm">Correo electrónico</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${currentUser.preferenciasComunicacion?.sms ? 'bg-green-400' : 'bg-slate-600'}`} />
                              <span className="text-slate-300 text-sm">Número de teléfono</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <PersonalInfoModal currentUser={currentUser} onUserUpdate={handleUserUpdate} />
                          <ChangePasswordModal currentUser={currentUser} onUserUpdate={handleUserUpdate} />
                        </div>
                      </div>

                      <Separator className="bg-slate-700" />

                      {/* Points Section */}
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Mis Puntos LevelUp</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                          <div className="bg-slate-700/50 p-3 sm:p-4 rounded-lg border border-slate-600">
                            <p className="text-slate-400 text-xs sm:text-sm">Puntos Disponibles</p>
                            <p className="text-xl sm:text-2xl font-bold text-yellow-400">{currentUser.puntos.toLocaleString()}</p>
                          </div>
                          <div className="bg-slate-700/50 p-3 sm:p-4 rounded-lg border border-slate-600">
                            <p className="text-slate-400 text-xs sm:text-sm">Total Ganados</p>
                            <p className="text-xl sm:text-2xl font-bold text-green-400">
                              {userOrders.reduce((acc, order) => acc + (order.puntosGanados || 0), 0).toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-slate-700/50 p-3 sm:p-4 rounded-lg border border-slate-600">
                            <p className="text-slate-400 text-xs sm:text-sm">Total Canjeados</p>
                            <p className="text-xl sm:text-2xl font-bold text-red-400">
                              {userOrders.reduce((acc, order) => acc + (order.puntosUsados || 0), 0).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-medium text-base sm:text-lg mb-3">Historial de Transacciones</h4>
                          <div className="space-y-3">
                            {userOrders.filter(o => (o.puntosGanados > 0 || o.puntosUsados > 0)).length === 0 ? (
                              <div className="text-center py-8 bg-slate-700/30 rounded-lg border border-slate-700 border-dashed">
                                <Award className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                                <p className="text-slate-400">No hay transacciones de puntos aún</p>
                                <p className="text-slate-500 text-sm mt-2">Realiza compras para ganar puntos</p>
                              </div>
                            ) : (
                              userOrders
                                .filter(o => (o.puntosGanados > 0 || o.puntosUsados > 0))
                                .slice(0, 5)
                                .map((order) => (
                                  <div key={order.id} className="p-3 sm:p-4 bg-slate-700/50 rounded-lg border border-slate-700 flex items-center justify-between hover:border-purple-500/50 transition-colors">
                                    <div className="flex items-center gap-2 sm:gap-4">
                                      <div className={`p-1.5 sm:p-2 rounded-full ${order.puntosGanados > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {order.puntosGanados > 0 ? <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> : <Award className="w-4 h-4 sm:w-5 sm:h-5" />}
                                      </div>
                                      <div>
                                        <p className="text-white font-medium text-sm sm:text-base">
                                          {order.puntosGanados > 0 ? 'Puntos Ganados' : 'Canje de Puntos'}
                                        </p>
                                        <p className="text-slate-400 text-xs sm:text-sm">
                                          Pedido #{order.numeroOrden} • {new Date(order.fechaCreacion).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                    <span className={`font-bold text-sm sm:text-base ${order.puntosGanados > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                      {order.puntosGanados > 0 ? '+' : '-'}{order.puntosGanados > 0 ? order.puntosGanados : order.puntosUsados}
                                    </span>
                                  </div>
                                ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="addresses" className="p-4 sm:p-6">
                    {/* Preview Section */}
                    <div className="space-y-6 mb-6">
                      <div>
                        <h3 className="text-white font-medium mb-4">Direcciones de Envío</h3>
                        {currentUser.direcciones && currentUser.direcciones.length > 0 ? (
                          <div className="space-y-3">
                            {currentUser.direcciones.map((address: any, index: number) => (
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
                                  <div className="flex items-center gap-2">
                                    <Edit
                                      className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer"
                                      onClick={() => handleEditAddress(address, index)}
                                    />
                                    <Trash2
                                      className="w-4 h-4 text-red-400 hover:text-red-300 cursor-pointer"
                                      onClick={() => handleDeleteAddress(index)}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-400">
                            No tienes direcciones guardadas
                          </div>
                        )}
                      </div>

                      {/* Edit Address Form */}
                      {editingAddress && (
                        <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                          <h4 className="text-white font-medium mb-4">Editar Dirección</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <Label className="text-slate-400 text-sm">Calle</Label>
                              <Input
                                value={editingAddress.calle || ''}
                                onChange={(e) => setEditingAddress({ ...editingAddress, calle: e.target.value })}
                                className="bg-slate-600 border-slate-500 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-slate-400 text-sm">Número</Label>
                              <Input
                                value={editingAddress.numero || ''}
                                onChange={(e) => setEditingAddress({ ...editingAddress, numero: e.target.value })}
                                className="bg-slate-600 border-slate-500 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-slate-400 text-sm">Apartamento (opcional)</Label>
                              <Input
                                value={editingAddress.apartamento || ''}
                                onChange={(e) => setEditingAddress({ ...editingAddress, apartamento: e.target.value })}
                                className="bg-slate-600 border-slate-500 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-slate-400 text-sm">Región</Label>
                              <Select
                                value={editingAddress.region || ''}
                                onValueChange={(value) => setEditingAddress({ ...editingAddress, region: value, ciudad: '' })}
                              >
                                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
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
                              <Label className="text-slate-400 text-sm">Ciudad</Label>
                              <Select
                                value={editingAddress.ciudad || ''}
                                onValueChange={(value) => setEditingAddress({ ...editingAddress, ciudad: value })}
                              >
                                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                                  <SelectValue placeholder="Ciudad" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                  {editingAddress.region && getCitiesForRegion(editingAddress.region).map((city) => (
                                    <SelectItem key={city} value={city} className="text-white hover:bg-slate-600">
                                      {city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            <Button onClick={handleSaveAddressEdit} className="bg-purple-600 hover:bg-purple-700">
                              Guardar Cambios
                            </Button>
                            <Button variant="outline" onClick={handleCancelAddressEdit} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      )}

                      {(!currentUser.direcciones || currentUser.direcciones.length < 3) && (
                        <div className="text-center">
                          <Button
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            onClick={() => setIsAddressesModalOpen(true)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Nueva Dirección
                          </Button>
                        </div>
                      )}
                    </div>

                    <AddressesModal
                      currentUser={currentUser}
                      onUserUpdate={handleUserUpdate}
                      open={isAddressesModalOpen}
                      onOpenChange={setIsAddressesModalOpen}
                    />
                  </TabsContent>

                  <TabsContent value="payment" className="p-4 sm:p-6">
                    <PaymentMethodsModal currentUser={currentUser} onUserUpdate={handleUserUpdate} />
                  </TabsContent>

                  <TabsContent value="orders" className="p-4 sm:p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium">Pedidos Recientes</h3>
                        <OrdersModal userOrders={userOrders} ordersLoading={ordersLoading} />
                      </div>

                      {ordersLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : userOrders.length === 0 ? (
                        <div className="text-center py-12 bg-slate-700/30 rounded-lg border border-slate-700 border-dashed">
                          <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                          <p className="text-slate-400 mb-4">No has realizado pedidos aún</p>
                          <Button
                            onClick={() => navigate("/catalogo")}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Explorar Productos
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {userOrders.slice(0, 3).map((order) => (
                            <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-700/50 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-colors gap-3 sm:gap-0">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-lg">
                                  <ShoppingBag className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                  <p className="text-white font-medium">Pedido #{order.numeroOrden}</p>
                                  <p className="text-slate-400 text-sm">
                                    {new Date(order.fechaCreacion).toLocaleDateString("es-CL", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric"
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge
                                  className={`${order.estado === "entregado"
                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                    : order.estado === "pendiente"
                                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                    } border capitalize`}
                                >
                                  {order.estado}
                                </Badge>
                                <p className="text-white font-bold hidden sm:block">
                                  ${order.total.toLocaleString()}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigate(`/usuario/pedido/${order.id}`)}
                                  className="text-slate-400 hover:text-white hover:bg-slate-600"
                                >
                                  <ArrowLeft className="w-4 h-4 rotate-180" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Referral Code */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Copy className="w-5 h-5" />
                  Código de Referido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-400">Tu código único</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={currentUser?.codigoReferido || ''}
                      readOnly
                      className="bg-slate-700 border-slate-600 text-white font-mono"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyReferralCode}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      {copiedReferral ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {copiedReferral && (
                    <p className="text-green-400 text-sm mt-1">¡Código copiado al portapapeles!</p>
                  )}
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    Comparte este código con amigos para ganar puntos LevelUp cuando se registren.
                    ¡Cada referido exitoso te da puntos extra!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Perfil;
