import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  Plus,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Calendar,
  User,
  Tag,
} from "lucide-react";
import { useBlog } from "@/context/BlogContext";
import { useToast } from "@/hooks/use-toast";

const AdminNoticias = () => {
  const { blogItems, addBlogItem, updateBlogItem, deleteBlogItem } = useBlog();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    contenidoCompleto: "",
    autor: "",
    categoria: "General",
    imagen: "",
    videoUrl: "",
    tiempoLectura: 5,
    etiquetas: [] as string[],
  });

  // Filter news items only
  const newsItems = blogItems.filter(item => item.tipo !== "evento");

  const categories = ["General", "Consolas", "Hardware", "Juegos", "Periféricos", "VR", "Portátiles", "Eventos"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newsData = {
      ...formData,
      tipo: "noticia" as const,
      fecha: editingItem?.fecha || new Date().toISOString(),
    };

    if (editingItem) {
      updateBlogItem(editingItem.id, newsData);
      toast({
        title: "Noticia actualizada",
        description: "La noticia se ha actualizado correctamente",
      });
    } else {
      addBlogItem(newsData);
      toast({
        title: "Noticia creada",
        description: "La noticia se ha creado correctamente",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      titulo: item.titulo,
      descripcion: item.descripcion,
      contenidoCompleto: item.contenidoCompleto || "",
      autor: item.autor || "",
      categoria: item.categoria || "General",
      imagen: item.imagen || "",
      videoUrl: item.videoUrl || "",
      tiempoLectura: item.tiempoLectura || 5,
      etiquetas: item.etiquetas || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta noticia?")) {
      deleteBlogItem(id);
      toast({
        title: "Noticia eliminada",
        description: "La noticia se ha eliminado correctamente",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      titulo: "",
      descripcion: "",
      contenidoCompleto: "",
      autor: "",
      categoria: "General",
      imagen: "",
      videoUrl: "",
      tiempoLectura: 5,
      etiquetas: [],
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Consolas":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "Hardware":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Juegos":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "Periféricos":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "VR":
        return "bg-pink-500/20 text-pink-400 border-pink-500/50";
      case "Portátiles":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Noticias</h1>
          <p className="text-muted-foreground">
            Administra las noticias que se muestran en el sitio
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Noticia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Editar Noticia" : "Crear Nueva Noticia"}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? "Modifica los detalles de la noticia"
                  : "Completa los detalles para crear una nueva noticia"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                  placeholder="Título de la noticia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Resumen *</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                  placeholder="Breve resumen de la noticia"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contenidoCompleto">Contenido Completo</Label>
                <Textarea
                  id="contenidoCompleto"
                  value={formData.contenidoCompleto}
                  onChange={(e) =>
                    setFormData({ ...formData, contenidoCompleto: e.target.value })
                  }
                  placeholder="Contenido completo de la noticia"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="autor">Autor</Label>
                  <Input
                    id="autor"
                    value={formData.autor}
                    onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                    placeholder="Nombre del autor"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagen">URL de Imagen</Label>
                <Input
                  id="imagen"
                  value={formData.imagen}
                  onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                  placeholder="/images/blog_noticia/imagen.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL de Video (YouTube, etc.)</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiempoLectura">Tiempo de Lectura (minutos)</Label>
                <Input
                  id="tiempoLectura"
                  type="number"
                  min="1"
                  value={formData.tiempoLectura}
                  onChange={(e) =>
                    setFormData({ ...formData, tiempoLectura: parseInt(e.target.value) })
                  }
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  {editingItem ? "Actualizar" : "Crear"} Noticia
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Noticias</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsItems.length}</div>
            <p className="text-xs text-muted-foreground">Noticias publicadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(newsItems.map((item) => item.categoria)).size}
            </div>
            <p className="text-xs text-muted-foreground">Categorías activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Video</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {newsItems.filter((item) => item.videoUrl).length}
            </div>
            <p className="text-xs text-muted-foreground">Noticias con enlace externo</p>
          </CardContent>
        </Card>
      </div>

      {/* News Table */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Noticias</CardTitle>
        </CardHeader>
        <CardContent>
          {newsItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Newspaper className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No hay noticias</h3>
              <p className="text-muted-foreground mb-4">
                Comienza creando tu primera noticia
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Crear Noticia
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Extras</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newsItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium max-w-md">
                        <div className="flex items-start gap-2">
                          {item.imagen && (
                            <img
                              src={item.imagen}
                              alt={item.titulo}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="font-medium">{item.titulo}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {item.descripcion}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getCategoryColor(item.categoria || "General")}>
                          {item.categoria || "General"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <User className="w-3 h-3" />
                          {item.autor || "Equipo LevelUp"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.fecha).toLocaleDateString("es-ES")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {item.videoUrl && (
                            <Badge variant="outline" className="text-xs">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Video
                            </Badge>
                          )}
                          {item.etiquetas?.includes("breaking") && (
                            <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400">
                              Breaking
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open("/noticias", "_blank")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNoticias;
