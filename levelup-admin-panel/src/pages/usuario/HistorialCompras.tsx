import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Eye,
  Filter
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUsers } from "@/context/UserContext";
import { useOrders } from "@/context/OrderContext";
import { Order } from "@/types/Order";

const HistorialCompras = () => {
  const navigate = useNavigate();
  const { currentUser } = useUsers();
  const { getOrdersByUser } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      if (!currentUser) {
        // Wait for auth check or redirect handled by protected route wrapper
        // For now, if no user, we can't load orders.
        return;
      }

      try {
        setIsLoading(true);
        const userOrders = await getOrdersByUser(currentUser.id);

        // Sort by date (newest first)
        userOrders.sort((a: Order, b: Order) =>
          new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        );

        setOrders(userOrders);
        setFilteredOrders(userOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [currentUser, getOrdersByUser]);

  // Filter orders by status
  useEffect(() => {
    if (statusFilter === "todos") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.estado === statusFilter));
    }
  }, [statusFilter, orders]);

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "procesando":
        return <Package className="w-4 h-4 text-blue-400" />;
      case "enviado":
        return <Truck className="w-4 h-4 text-purple-400" />;
      case "entregado":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "cancelado":
      case "rechazado":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "procesando":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "enviado":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "entregado":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "cancelado":
      case "rechazado":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getStatusText = (estado: string) => {
    const statusMap: { [key: string]: string } = {
      pendiente: "Pendiente",
      procesando: "Procesando",
      enviado: "Enviado",
      entregado: "Entregado",
      cancelado: "Cancelado",
      rechazado: "Rechazado"
    };
    return statusMap[estado] || estado;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-white">Cargando historial...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/usuario/dashboard")}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-8 h-8" />
                Historial de Compras
              </h1>
              <p className="text-slate-400">Revisa todas tus órdenes y pedidos</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="todos" className="text-white hover:bg-slate-700">Todos los estados</SelectItem>
                <SelectItem value="pendiente" className="text-white hover:bg-slate-700">Pendiente</SelectItem>
                <SelectItem value="procesando" className="text-white hover:bg-slate-700">Procesando</SelectItem>
                <SelectItem value="enviado" className="text-white hover:bg-slate-700">Enviado</SelectItem>
                <SelectItem value="entregado" className="text-white hover:bg-slate-700">Entregado</SelectItem>
                <SelectItem value="cancelado" className="text-white hover:bg-slate-700">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {statusFilter === "todos" ? "No tienes compras aún" : `No hay compras ${getStatusText(statusFilter).toLowerCase()}`}
              </h3>
              <p className="text-slate-400 mb-6">
                {statusFilter === "todos"
                  ? "Cuando realices tu primera compra, aparecerá aquí."
                  : `No tienes compras en estado "${getStatusText(statusFilter).toLowerCase()}".`
                }
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Explorar Productos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-semibold text-white">
                        Orden #{order.numeroOrden}
                      </div>
                      <Badge className={`${getStatusColor(order.estado)} border`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.estado)}
                          {getStatusText(order.estado)}
                        </div>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        {formatCurrency(order.total)}
                      </div>
                      <div className="text-sm text-slate-400">
                        {formatDate(order.fechaCreacion)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                      <h4 className="text-white font-medium mb-3">Productos</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h5 className="text-white font-medium text-sm">{item.productName}</h5>
                              <p className="text-slate-400 text-xs">
                                Cantidad: {item.quantity} × {formatCurrency(item.unitPrice)}
                              </p>
                            </div>
                            <div className="text-white font-medium text-sm">
                              {formatCurrency(item.totalPrice)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Detalles de la Orden</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Subtotal:</span>
                            <span className="text-white">{formatCurrency(order.subtotal)}</span>
                          </div>
                          {order.descuento > 0 && (
                            <div className="flex justify-between">
                              <span className="text-green-400">Descuento:</span>
                              <span className="text-green-400">-{formatCurrency(order.descuento)}</span>
                            </div>
                          )}
                          {order.puntosUsados > 0 && (
                            <div className="flex justify-between">
                              <span className="text-yellow-400">Puntos usados:</span>
                              <span className="text-yellow-400">{order.puntosUsados} pts</span>
                            </div>
                          )}
                          <div className="flex justify-between font-medium">
                            <span className="text-white">Total:</span>
                            <span className="text-white">{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-2">Dirección de Envío</h4>
                        <div className="text-sm text-slate-400">
                          <p>{order.direccionEnvio.nombre}</p>
                          <p>{order.direccionEnvio.calle} {order.direccionEnvio.numero}</p>
                          {order.direccionEnvio.apartamento && <p>{order.direccionEnvio.apartamento}</p>}
                          <p>{order.direccionEnvio.ciudad}, {order.direccionEnvio.region}</p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => navigate(`/usuario/orden/${order.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">{orders.length}</div>
                <div className="text-sm text-slate-400">Total de Órdenes</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {orders.filter(o => o.estado === "entregado").length}
                </div>
                <div className="text-sm text-slate-400">Entregadas</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {orders.filter(o => ["pendiente", "procesando", "enviado"].includes(o.estado)).length}
                </div>
                <div className="text-sm text-slate-400">En Progreso</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
                </div>
                <div className="text-sm text-slate-400">Total Gastado</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default HistorialCompras;
