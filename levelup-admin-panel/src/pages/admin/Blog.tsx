import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Video, FileText, Calendar, Award, Edit, Trash2, Loader2, AlertTriangle, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useBlog } from "@/context/BlogContext";
import { BlogItem } from "@/types/BlogItem";
import BlogDialog from "@/components/admin/BlogDialog";
import { toast } from "sonner";

const Blog = () => {
  const { blogItems, loading, error, addBlogItem, updateBlogItem, deleteBlogItem } = useBlog();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<BlogItem | null>(null);

  // Filtrar solo eventos
  const events = blogItems.filter(item => item.tipo === "evento");

  const handleAddItem = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEditItem = (item: BlogItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDeleteItem = (item: BlogItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      await deleteBlogItem(itemToDelete.id);
      toast.success("Contenido eliminado correctamente");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error("Error al eliminar el contenido");
    }
  };

  const handleSaveItem = async (itemData: Omit<BlogItem, "id"> | Partial<BlogItem>) => {
    try {
      // Asegurar que siempre sea tipo "evento" para este admin
      const dataWithType = {
        ...itemData,
        tipo: "evento" as const,
      };

      if (editingItem) {
        await updateBlogItem(editingItem.id, dataWithType);
        toast.success("Evento actualizado correctamente");
      } else {
        await addBlogItem(dataWithType as Omit<BlogItem, "id">);
        toast.success("Evento creado correctamente");
      }
      setDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast.error("Error al guardar el evento");
      throw error;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando eventos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Eventos</h1>
          <p className="text-muted-foreground">
            Gestiona eventos, torneos y actividades de la comunidad
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAddItem}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Evento
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/20 to-card border-primary/50">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Eventos</p>
          </div>
          <p className="text-2xl font-bold">{events.length}</p>
        </Card>
      </div>

      {/* Content List */}
      <div className="grid gap-4">
        {events.map((item) => (
          <Card key={item.id} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
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
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(item.fecha).toLocaleDateString("es-CL")}</span>
                  </div>
                  {item.direccion && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{item.direccion}</span>
                    </div>
                  )}
                  {item.horaInicio && (
                    <div className="flex items-center gap-1">
                      <span>{item.horaInicio}</span>
                      {item.horaFin && <span>- {item.horaFin}</span>}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border"
                  onClick={() => handleEditItem(item)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border hover:border-destructive hover:text-destructive"
                  onClick={() => handleDeleteItem(item)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Blog Dialog */}
      <BlogDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        blogItem={editingItem}
        onSave={handleSaveItem}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              ¿Eliminar contenido?
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar "{itemToDelete?.titulo}"?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteItem}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Blog;
