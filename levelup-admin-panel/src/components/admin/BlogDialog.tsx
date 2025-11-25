import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, FileText, Award } from "lucide-react";
import { BlogItem } from "@/types/BlogItem";
import { toast } from "sonner";

interface BlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blogItem?: BlogItem | null;
  onSave: (item: Omit<BlogItem, "id"> | Partial<BlogItem>) => Promise<void>;
}

const BlogDialog = ({ open, onOpenChange, blogItem, onSave }: BlogDialogProps) => {
  const [formData, setFormData] = useState({
    tipo: "nota" as "video" | "nota" | "evento",
    titulo: "",
    descripcion: "",
    fecha: "",
    puntos: "",
    estado: "activo" as "activo" | "finalizado" | "programado",
    imagen: "",
    videoUrl: "",
    contenidoCompleto: "",
    autor: "",
    tiempoLectura: "",
    categoria: "",
    etiquetas: "",
    direccion: "",
    horaInicio: "",
    horaFin: "",
    ubicacionUrl: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blogItem) {
      setFormData({
        tipo: blogItem.tipo,
        titulo: blogItem.titulo,
        descripcion: blogItem.descripcion,
        fecha: blogItem.fecha,
        puntos: blogItem.puntos?.toString() || "",
        estado: blogItem.estado,
        imagen: blogItem.imagen || "",
        videoUrl: blogItem.videoUrl || "",
        contenidoCompleto: blogItem.contenidoCompleto || "",
        autor: blogItem.autor || "",
        tiempoLectura: blogItem.tiempoLectura?.toString() || "",
        categoria: blogItem.categoria || "",
        etiquetas: blogItem.etiquetas?.join(", ") || "",
        direccion: blogItem.direccion || "",
        horaInicio: blogItem.horaInicio || "",
        horaFin: blogItem.horaFin || "",
        ubicacionUrl: blogItem.ubicacionUrl || "",
      });
    } else {
      setFormData({
        tipo: "nota",
        titulo: "",
        descripcion: "",
        fecha: "",
        puntos: "",
        estado: "activo",
        imagen: "",
        videoUrl: "",
        contenidoCompleto: "",
        autor: "",
        tiempoLectura: "",
        categoria: "",
        etiquetas: "",
        direccion: "",
        horaInicio: "",
        horaFin: "",
        ubicacionUrl: "",
      });
    }
  }, [blogItem, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo.trim() || !formData.descripcion.trim() || !formData.fecha) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    try {
      const itemData = {
        tipo: formData.tipo,
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        fecha: formData.fecha,
        puntos: formData.puntos ? parseInt(formData.puntos) : undefined,
        estado: formData.estado,
        imagen: formData.imagen.trim() || undefined,
        videoUrl: formData.videoUrl.trim() || undefined,
        contenidoCompleto: formData.contenidoCompleto.trim() || undefined,
        autor: formData.autor.trim() || undefined,
        tiempoLectura: formData.tiempoLectura ? parseInt(formData.tiempoLectura) : undefined,
        categoria: formData.categoria.trim() || undefined,
        etiquetas: formData.etiquetas.trim() ? formData.etiquetas.split(",").map(tag => tag.trim()).filter(tag => tag) : undefined,
        direccion: formData.direccion.trim() || undefined,
        horaInicio: formData.horaInicio.trim() || undefined,
        horaFin: formData.horaFin.trim() || undefined,
        ubicacionUrl: formData.ubicacionUrl.trim() || undefined,
      };

      await onSave(itemData);
      toast.success(blogItem ? "Contenido actualizado correctamente" : "Contenido creado correctamente");
      onOpenChange(false);
    } catch (error) {
      toast.error("Error al guardar el contenido");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {blogItem ? "Editar Contenido" : "Nuevo Contenido"}
            {formData.tipo && (
              <Badge className={getTypeColor(formData.tipo)}>
                {getTypeIcon(formData.tipo)}
                <span className="ml-1 capitalize">{formData.tipo}</span>
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Contenido *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: "video" | "nota" | "evento") =>
                  setFormData(prev => ({ ...prev, tipo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nota">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Nota
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video
                    </div>
                  </SelectItem>
                  <SelectItem value="evento">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Evento
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select
                value={formData.estado}
                onValueChange={(value: "activo" | "finalizado" | "programado") =>
                  setFormData(prev => ({ ...prev, estado: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="programado">Programado</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Ingresa el título del contenido"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Describe el contenido..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="puntos" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Puntos (opcional)
              </Label>
              <Input
                id="puntos"
                type="number"
                value={formData.puntos}
                onChange={(e) => setFormData(prev => ({ ...prev, puntos: e.target.value }))}
                placeholder="Ej: 100"
                min="0"
              />
            </div>
          </div>

          {/* Campos adicionales */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground">Campos adicionales (opcionales)</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="autor">Autor</Label>
                <Input
                  id="autor"
                  value={formData.autor}
                  onChange={(e) => setFormData(prev => ({ ...prev, autor: e.target.value }))}
                  placeholder="Nombre del autor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reviews">Reviews</SelectItem>
                    <SelectItem value="Guías">Guías</SelectItem>
                    <SelectItem value="Noticias">Noticias</SelectItem>
                    <SelectItem value="LevelUp">LevelUp</SelectItem>
                    <SelectItem value="Tutoriales">Tutoriales</SelectItem>
                    <SelectItem value="Análisis">Análisis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tiempoLectura">Tiempo de lectura (min)</Label>
                <Input
                  id="tiempoLectura"
                  type="number"
                  value={formData.tiempoLectura}
                  onChange={(e) => setFormData(prev => ({ ...prev, tiempoLectura: e.target.value }))}
                  placeholder="Ej: 5"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagen">URL de imagen</Label>
                <Input
                  id="imagen"
                  value={formData.imagen}
                  onChange={(e) => setFormData(prev => ({ ...prev, imagen: e.target.value }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>

            {/* Event-specific fields */}
            {formData.tipo === "evento" && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-medium text-muted-foreground">Información del Evento</h4>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección del evento</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                    placeholder="Ej: Av. Providencia 123, Santiago"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horaInicio">Hora de inicio</Label>
                    <Input
                      id="horaInicio"
                      type="time"
                      value={formData.horaInicio}
                      onChange={(e) => setFormData(prev => ({ ...prev, horaInicio: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horaFin">Hora de término</Label>
                    <Input
                      id="horaFin"
                      type="time"
                      value={formData.horaFin}
                      onChange={(e) => setFormData(prev => ({ ...prev, horaFin: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ubicacionUrl">URL de Google Maps</Label>
                  <Input
                    id="ubicacionUrl"
                    value={formData.ubicacionUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, ubicacionUrl: e.target.value }))}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="videoUrl">URL del video</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="etiquetas">Etiquetas (separadas por coma)</Label>
              <Input
                id="etiquetas"
                value={formData.etiquetas}
                onChange={(e) => setFormData(prev => ({ ...prev, etiquetas: e.target.value }))}
                placeholder="gaming, tecnología, review"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenidoCompleto">Contenido completo</Label>
              <Textarea
                id="contenidoCompleto"
                value={formData.contenidoCompleto}
                onChange={(e) => setFormData(prev => ({ ...prev, contenidoCompleto: e.target.value }))}
                placeholder="Contenido completo del artículo o nota..."
                rows={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : blogItem ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDialog;
