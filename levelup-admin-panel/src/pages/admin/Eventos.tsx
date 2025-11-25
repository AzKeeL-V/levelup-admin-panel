import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MapPin, Calendar, Users, Award, Edit, Trash2, Loader2, AlertTriangle, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useEvents } from "@/context/EventContext";
import { Event } from "@/types/Event";
import EventDialog from "../../components/admin/EventDialog";
import { toast } from "sonner";

const Eventos = () => {
  const { events, loading, error, addEvent, updateEvent, deleteEvent } = useEvents();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      (event.nombre || event.titulo).toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.ubicacion.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.ubicacion.ciudad.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || event.estado === statusFilter;
    const matchesType = typeFilter === "all" || event.tipo === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "finalizado":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      case "cancelado":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "programado":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default:
        return "bg-secondary";
    }
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case "torneo":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "lanzamiento":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "promocion":
        return "bg-pink-500/20 text-pink-400 border-pink-500/50";
      case "meetup":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50";
      default:
        return "bg-secondary";
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setDialogOpen(true);
  };

  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      await deleteEvent(eventToDelete.id);
      toast.success("Evento eliminado correctamente");
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    } catch (error) {
      toast.error("Error al eliminar el evento");
    }
  };

  const handleSaveEvent = async (eventData: Omit<Event, "id"> | Partial<Event>) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
        toast.success("Evento actualizado correctamente");
      } else {
        await addEvent(eventData as Omit<Event, "id">);
        toast.success("Evento creado correctamente");
      }
      setDialogOpen(false);
      setEditingEvent(null);
    } catch (error) {
      toast.error("Error al guardar el evento");
      throw error;
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
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Eventos</h1>
          <p className="text-muted-foreground">Gestiona eventos y actividades con ubicación geográfica</p>
        </div>
        <Button
          onClick={handleAddEvent}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Evento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-500/20 to-card border-green-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-green-400" />
            <p className="text-sm text-muted-foreground">Activos</p>
          </div>
          <p className="text-2xl font-bold">{events.filter((e) => e.estado === "activo").length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-card border-blue-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-muted-foreground">Programados</p>
          </div>
          <p className="text-2xl font-bold">{events.filter((e) => e.estado === "programado").length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500/20 to-card border-purple-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-400" />
            <p className="text-sm text-muted-foreground">Finalizados</p>
          </div>
          <p className="text-2xl font-bold">{events.filter((e) => e.estado === "finalizado").length}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-500/20 to-card border-red-500/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-sm text-muted-foreground">Cancelados</p>
          </div>
          <p className="text-2xl font-bold">{events.filter((e) => e.estado === "cancelado").length}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 sm:p-6 bg-card border-border">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos por nombre, descripción o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <Button
              variant="outline"
              className="border-border w-full sm:w-auto"
              onClick={resetFilters}
            >
              <Filter className="w-4 h-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="programado">Programados</SelectItem>
                <SelectItem value="finalizado">Finalizados</SelectItem>
                <SelectItem value="cancelado">Cancelados</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="torneo">Torneo</SelectItem>
                <SelectItem value="lanzamiento">Lanzamiento</SelectItem>
                <SelectItem value="promocion">Promoción</SelectItem>
                <SelectItem value="meetup">Meetup</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Events List */}
      <div className="grid gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card key={event.id} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={getTypeColor(event.tipo)}>
                      {event.tipo.charAt(0).toUpperCase() + event.tipo.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(event.estado)}>
                      {event.estado.charAt(0).toUpperCase() + event.estado.slice(1)}
                    </Badge>
                    {event.puntosRecompensa && (
                      <Badge variant="outline" className="border-primary text-primary">
                        <Award className="w-3 h-3 mr-1" />
                        {event.puntosRecompensa} puntos
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2">{event.nombre || event.titulo}</h3>
                  <p className="text-muted-foreground mb-3">{event.descripcion}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.fecha).toLocaleDateString("es-CL")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{event.ubicacion.direccion}, {event.ubicacion.ciudad}</span>
                    </div>
                  </div>

                  {event.capacidadMaxima && (
                    <div className="mt-3">
                      <Badge variant="outline" className="text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        Capacidad: {event.capacidadMaxima} personas
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border"
                    onClick={() => handleEditEvent(event)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border hover:border-destructive hover:text-destructive"
                    onClick={() => handleDeleteEvent(event)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-sm">No se encontraron eventos</p>
            </div>
          </div>
        )}
      </div>

      {/* Event Dialog */}
      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={editingEvent}
        onSave={handleSaveEvent}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              ¿Eliminar evento?
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar "{eventToDelete?.nombre || eventToDelete?.titulo}"?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteEvent}
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

export default Eventos;
