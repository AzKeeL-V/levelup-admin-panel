import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Video, FileText, Calendar, Award, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogItem {
  id: string;
  tipo: "video" | "nota" | "evento";
  titulo: string;
  descripcion: string;
  fecha: string;
  puntos?: number;
  estado: "activo" | "finalizado" | "programado";
}

const Blog = () => {
  const items: BlogItem[] = [
    {
      id: "1",
      tipo: "evento",
      titulo: "Torneo de Gaming Mensual",
      descripcion: "Participa en nuestro torneo mensual y gana puntos Level Up",
      fecha: "2025-11-15",
      puntos: 500,
      estado: "activo",
    },
    {
      id: "2",
      tipo: "video",
      titulo: "Review: Nuevo Mouse Logitech G Pro X",
      descripcion: "Análisis completo del último lanzamiento de Logitech",
      fecha: "2025-10-20",
      estado: "activo",
    },
    {
      id: "3",
      tipo: "nota",
      titulo: "Guía: Cómo elegir tu primer setup gaming",
      descripcion: "Tips y recomendaciones para armar tu setup ideal",
      fecha: "2025-10-18",
      estado: "activo",
    },
    {
      id: "4",
      tipo: "evento",
      titulo: "Webinar: Tendencias Tech 2025",
      descripcion: "Expertos hablan sobre las tendencias tecnológicas del año",
      fecha: "2025-10-10",
      puntos: 300,
      estado: "finalizado",
    },
    {
      id: "5",
      tipo: "evento",
      titulo: "Black Friday LevelUp",
      descripcion: "Evento especial con descuentos y puntos dobles",
      fecha: "2025-11-29",
      puntos: 1000,
      estado: "programado",
    },
  ];

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "nota":
        return <FileText className="w-4 h-4" />;
      case "evento":
        return <Calendar className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case "video":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "nota":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "evento":
        return "bg-primary/20 text-primary border-primary/50";
      default:
        return "bg-secondary";
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-primary text-primary-foreground";
      case "finalizado":
        return "bg-muted text-muted-foreground";
      case "programado":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog y Eventos</h1>
          <p className="text-muted-foreground">
            Gestiona contenido, videos, notas y eventos con puntos Level Up
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Contenido
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-500/20 to-card border-purple-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-5 h-5 text-purple-400" />
            <p className="text-sm text-muted-foreground">Videos</p>
          </div>
          <p className="text-2xl font-bold">{items.filter((i) => i.tipo === "video").length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-card border-blue-500/50">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-muted-foreground">Notas</p>
          </div>
          <p className="text-2xl font-bold">{items.filter((i) => i.tipo === "nota").length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-primary/20 to-card border-primary/50">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Eventos</p>
          </div>
          <p className="text-2xl font-bold">{items.filter((i) => i.tipo === "evento").length}</p>
        </Card>
      </div>

      {/* Content List */}
      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={getTypeColor(item.tipo)}>
                    {getTypeIcon(item.tipo)}
                    <span className="ml-1 capitalize">{item.tipo}</span>
                  </Badge>
                  <Badge className={getEstadoColor(item.estado)}>
                    {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
                  </Badge>
                  {item.puntos && (
                    <Badge variant="outline" className="border-primary text-primary">
                      <Award className="w-3 h-3 mr-1" />
                      {item.puntos} puntos
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.titulo}</h3>
                <p className="text-muted-foreground mb-3">{item.descripcion}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(item.fecha).toLocaleDateString("es-CL")}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-border">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border hover:border-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Blog;
