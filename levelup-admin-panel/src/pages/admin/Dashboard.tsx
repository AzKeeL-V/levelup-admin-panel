import { Card } from "@/components/ui/card";
import { Package, Users, DollarSign, Award, AlertTriangle, Loader2, ShoppingCart } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { useUsers } from "@/context/UserContext";
import { useOrders } from "@/context/OrderContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { products, getTotalInventoryValue } = useProducts();
  const { users, loading: usersLoading } = useUsers();
  const { orders, loading: ordersLoading, getOrderStats } = useOrders();

  const [orderStats, setOrderStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const totalInventoryValue = getTotalInventoryValue();
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 10);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getOrderStats();
        setOrderStats(stats);
      } catch (error) {
        console.error("Error loading order stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (!ordersLoading) {
      loadStats();
    }
  }, [ordersLoading, getOrderStats]);

  const stats = [
    {
      title: "Usuarios Registrados",
      value: usersLoading ? "..." : users.length.toString(),
      icon: Users,
      change: "+12.5%",
      color: "text-accent",
      path: "/admin/usuarios",
    },
    {
      title: "Valor Total Inventario",
      value: `$${totalInventoryValue.toLocaleString("es-CL")}`,
      icon: DollarSign,
      change: "Actualizado",
      color: "text-primary",
      path: "/admin/productos",
    },
    {
      title: "Productos Únicos",
      value: totalProducts.toString(),
      icon: Package,
      change: "En catálogo",
      color: "text-accent",
      path: "/admin/productos",
    },
    {
      title: "Total Pedidos",
      value: ordersLoading ? "..." : orders.length.toString(),
      icon: ShoppingCart,
      change: statsLoading ? "..." : `$${orderStats?.totalRevenue?.toLocaleString("es-CL") || 0} ventas`,
      color: "text-primary",
      path: "/admin/pedidos",
    },
  ];

  if (usersLoading || ordersLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de la plataforma LevelUp</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="p-6 bg-card border-border hover:shadow-[var(--shadow-glow)] transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={() => navigate(stat.path)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className={`text-sm ${stat.color} font-medium`}>{stat.change}</p>
              </div>
              <div className={stat.color}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-card border-yellow-500/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <p className="text-sm text-muted-foreground">Pedidos Pendientes</p>
          </div>
          <p className="text-3xl font-bold text-yellow-400">
            {orderStats?.pendingOrders || 0}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Requieren atención</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-card border-blue-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-muted-foreground">En Procesamiento</p>
          </div>
          <p className="text-3xl font-bold text-blue-400">
            {orderStats?.processingOrders || 0}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Siendo preparados</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-500/20 to-card border-green-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-green-400" />
            <p className="text-sm text-muted-foreground">Completados Hoy</p>
          </div>
          <p className="text-3xl font-bold text-green-400">
            {orders.filter(o => o.fechaActualizacion === new Date().toISOString().split('T')[0] && o.estado === 'entregado').length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Entregas exitosas</p>
        </Card>
      </div>

      {/* Low Stock Alert */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h2 className="text-xl font-bold">Productos con Bajo Stock</h2>
          <span className="text-sm text-muted-foreground ml-auto">
            ({lowStockProducts.length} productos)
          </span>
        </div>
        <div className="space-y-3">
          {lowStockProducts.slice(0, 4).map((product) => (
            <div
              key={product.codigo}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="w-12 h-12 object-cover rounded-lg border border-border"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <div>
                  <p className="font-semibold">{product.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.marca} • {product.codigo}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Stock restante</p>
                <p className="text-2xl font-bold text-destructive">{product.stock}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Orders */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Pedidos Recientes</h2>
        </div>
        <div className="space-y-3">
          {orders.slice(0, 3).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{order.numeroOrden}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.userName} • {new Date(order.fechaCreacion).toLocaleDateString("es-CL")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">${order.total.toLocaleString("es-CL")}</p>
                <p className={`text-sm capitalize ${order.estado === 'entregado' ? 'text-green-600' :
                  order.estado === 'enviado' ? 'text-purple-600' :
                    order.estado === 'procesando' ? 'text-blue-600' :
                      order.estado === 'pendiente' ? 'text-yellow-600' :
                        'text-red-600'
                  }`}>
                  {order.estado}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
