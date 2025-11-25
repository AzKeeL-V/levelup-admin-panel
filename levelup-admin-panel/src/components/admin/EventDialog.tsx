import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Award, Trophy, Gamepad2, Users2, Mic } from "lucide-react";
import { Event } from "@/types/Event";
import { toast } from "sonner";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
  onSave: (event: Omit<Event, "id"> | Partial<Event>) => Promise<void>;
}

const EventDialog = ({ open, onOpenChange, event, onSave }: EventDialogProps) => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    hora: "",
    ubicacion: {
      latitud: -33.4489,
      longitud: -70.6693,
      direccion: "",
      ciudad: "Santiago",
      region: "Metropolitana"
    },
    organizador: "",
    tipo: "torneo" as "torneo" | "lanparty" | "conferencia" | "meetup" | "otro",
    capacidad: "",
    precio: "",
    imagen: "",
    activo: true,
    estado: "programado" as "activo" | "programado" | "finalizado" | "cancelado",
    puntosGanables: "",
    capacidadMaxima: "",
    tags: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        titulo: event.titulo || "",
        descripcion: event.descripcion || "",
        fecha: event.fecha || "",
        hora: event.hora || "",
        ubicacion: event.ubicacion || {
          latitud: -33.4489,
          longitud: -70.6693,
          direccion: "",
          ciudad: "Santiago",
          region: "Metropolitana"
        },
        organizador: event.organizador || "",
        tipo: event.tipo || "torneo",
        capacidad: event.capacidad?.toString() || "",
        precio: event.precio?.toString() || "",
        imagen: event.imagen || "",
        activo: event.activo ?? true,
        estado: event.estado || "programado",
        puntosGanables: event.puntosGanables?.toString() || "",
        capacidadMaxima: event.capacidadMaxima?.toString() || "",
        tags: event.tags || [],
      });
    } else {
      setFormData({
        titulo: "",
        descripcion: "",
        fecha: "",
        hora: "",
        ubicacion: {
          latitud: -33.4489,
          longitud: -70.6693,
          direccion: "",
          ciudad: "Santiago",
          region: "Metropolitana"
        },
        organizador: "",
        tipo: "torneo",
        capacidad: "",
        precio: "",
        imagen: "",
        activo: true,
        estado: "programado",
        puntosGanables: "",
        capacidadMaxima: "",
        tags: [],
      });
    }
  }, [event, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo.trim() || !formData.descripcion.trim() || !formData.fecha || !formData.hora) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    try {
      const eventData = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        fecha: formData.fecha,
        hora: formData.hora,
        ubicacion: formData.ubicacion,
        organizador: formData.organizador.trim(),
        tipo: formData.tipo,
        capacidad: parseInt(formData.capacidad) || 0,
        precio: parseFloat(formData.precio) || 0,
        imagen: formData.imagen.trim(),
        activo: formData.activo,
        estado: formData.estado,
        puntosGanables: formData.puntosGanables ? parseInt(formData.puntosGanables) : undefined,
        capacidadMaxima: formData.capacidadMaxima ? parseInt(formData.capacidadMaxima) : undefined,
        fechaCreacion: event?.fechaCreacion || new Date().toISOString(),
        tags: formData.tags,
        inscritos: event?.inscritos || 0,
      };

      await onSave(eventData);
      toast.success(event ? "Evento actualizado correctamente" : "Evento creado correctamente");
      onOpenChange(false);
    } catch (error) {
      toast.error("Error al guardar el evento");
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case "torneo":
        return <Trophy className="w-4 h-4" />;
      case "lanparty":
        return <Gamepad2 className="w-4 h-4" />;
      case "conferencia":
        return <Mic className="w-4 h-4" />;
      case "meetup":
        return <Users2 className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case "torneo":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "lanparty":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "conferencia":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50";
      case "meetup":
        return "bg-pink-500/20 text-pink-400 border-pink-500/50";
      default:
        return "bg-secondary";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {event ? "Editar Evento" : "Nuevo Evento"}
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
              <Label htmlFor="titulo">Título del Evento *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Ej: Torneo de League of Legends"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Evento *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: "torneo" | "lanparty" | "conferencia" | "meetup" | "otro") =>
                  setFormData(prev => ({ ...prev, tipo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="torneo">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Torneo
                    </div>
                  </SelectItem>
                  <SelectItem value="lanparty">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4" />
                      LAN Party
                    </div>
                  </SelectItem>
                  <SelectItem value="conferencia">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      Conferencia
                    </div>
                  </SelectItem>
                  <SelectItem value="meetup">
                    <div className="flex items-center gap-2">
                      <Users2 className="w-4 h-4" />
                      Meetup
                    </div>
                  </SelectItem>
                  <SelectItem value="otro">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Otro
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Describe el evento..."
              rows={3}
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
              <Label htmlFor="hora">Hora *</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData(prev => ({ ...prev, hora: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Ubicación
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.ubicacion.direccion}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    ubicacion: { ...prev.ubicacion, direccion: e.target.value }
                  }))}
                  placeholder="Ej: Av. Providencia 123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input
                  id="ciudad"
                  value={formData.ubicacion.ciudad}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    ubicacion: { ...prev.ubicacion, ciudad: e.target.value }
                  }))}
                  placeholder="Ej: Santiago"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacidad">Capacidad</Label>
              <Input
                id="capacidad"
                type="number"
                value={formData.capacidad}
                onChange={(e) => setFormData(prev => ({ ...prev, capacidad: e.target.value }))}
                placeholder="Ej: 50"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio ($)</Label>
              <Input
                id="precio"
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData(prev => ({ ...prev, precio: e.target.value }))}
                placeholder="Ej: 5000"
                min="0"
                step="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="puntosGanables" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Puntos Ganables
              </Label>
              <Input
                id="puntosGanables"
                type="number"
                value={formData.puntosGanables}
                onChange={(e) => setFormData(prev => ({ ...prev, puntosGanables: e.target.value }))}
                placeholder="Ej: 100"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organizador">Organizador</Label>
              <Input
                id="organizador"
                value={formData.organizador}
                onChange={(e) => setFormData(prev => ({ ...prev, organizador: e.target.value }))}
                placeholder="Ej: Level Up Gaming"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value: "activo" | "programado" | "finalizado" | "cancelado") =>
                  setFormData(prev => ({ ...prev, estado: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programado">Programado</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagen">URL de Imagen</Label>
            <Input
              id="imagen"
              value={formData.imagen}
              onChange={(e) => setFormData(prev => ({ ...prev, imagen: e.target.value }))}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
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
              {loading ? "Guardando..." : event ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
