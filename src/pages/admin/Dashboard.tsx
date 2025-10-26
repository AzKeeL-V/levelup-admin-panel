import { Card } from "@/components/ui/card";
import { Package, Users, TrendingUp, Award, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Usuarios Registrados",
      value: "1,234",
      icon: Users,
      change: "+12.5%",
      color: "text-accent",
    },
    {
      title: "Productos Vendidos",
      value: "8,432",
      icon: TrendingUp,
      change: "+23.1%",
      color: "text-primary",
    },
    {
      title: "Productos Únicos",
      value: "156",
      icon: Package,
      change: "+5.2%",
      color: "text-accent",
    },
    {
      title: "Puntos Level Up Totales",
      value: "45,678",
      icon: Award,
      change: "+18.7%",
      color: "text-primary",
    },
  ];

  const lowStockProducts = [
    { id: "PROD-001", name: "Teclado Mecánico RGB", stock: 3, marca: "Razer" },
    { id: "PROD-015", name: "Mouse Gamer Inalámbrico", stock: 5, marca: "Logitech" },
    { id: "PROD-023", name: "Monitor 27'' 144Hz", stock: 2, marca: "ASUS" },
    { id: "PROD-034", name: "Auriculares Gaming", stock: 4, marca: "HyperX" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de la plataforma LevelUp</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6 bg-card border-border hover:shadow-[var(--shadow-glow)] transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className={`text-sm ${stat.color} font-medium`}>{stat.change} vs mes anterior</p>
              </div>
              <div className={`p-3 rounded-lg bg-secondary/50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Low Stock Alert */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h2 className="text-xl font-bold">Productos con Bajo Stock</h2>
        </div>
        <div className="space-y-3">
          {lowStockProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.marca} • {product.id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Stock restante</p>
                <p className="text-2xl font-bold text-destructive">{product.stock}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-secondary to-card border-border">
          <h3 className="text-lg font-semibold mb-2">Usuarios DUOC</h3>
          <p className="text-3xl font-bold text-primary">487</p>
          <p className="text-sm text-muted-foreground mt-1">39.4% del total</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-secondary to-card border-border">
          <h3 className="text-lg font-semibold mb-2">Usuarios Diamante</h3>
          <p className="text-3xl font-bold text-accent">23</p>
          <p className="text-sm text-muted-foreground mt-1">Nivel más alto</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-secondary to-card border-border">
          <h3 className="text-lg font-semibold mb-2">Eventos Activos</h3>
          <p className="text-3xl font-bold text-primary">5</p>
          <p className="text-sm text-muted-foreground mt-1">En curso</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
