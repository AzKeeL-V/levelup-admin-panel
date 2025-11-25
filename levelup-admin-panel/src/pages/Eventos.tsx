import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Search,
  Filter,
  Gamepad2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEvents } from "@/context/EventContext";
import { Event } from "@/types/Event";

const Eventos = () => {
  const { events, loading, getActiveEvents } = useEvents();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("todos");

  useEffect(() => {
    const loadEvents = async () => {
      await getActiveEvents();
    };
    loadEvents();
  }, [getActiveEvents]);

  useEffect(() => {
    let filtered = events.filter(event => event.activo);

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizador.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== "todos") {
      filtered = filtered.filter(event => event.tipo === typeFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, typeFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const getTypeColor = (tipo: string) => {
    const colors: {[key: string]: string} = {
      torneo: "bg-red-500/10 text-red-400 border-red-500/20",
      lanparty: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      conferencia: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      meetup: "bg-green-500/10 text-green-400 border-green-500/20",
      otro: "bg-slate-500/10 text-slate-400 border-slate-500/20"
    };
    return colors[tipo] || colors.otro;
  };

  const getTypeText = (tipo: string) => {
    const types = {
      torneo: "Torneo",
      lanparty: "LAN Party",
      conferencia: "Conferencia",
      meetup: "Meetup",
      otro: "Otro"
    };
    return types[tipo as keyof typeof types] || tipo;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-white">Cargando eventos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Gamepad2 className="w-10 h-10 text-purple-400" />
            Eventos Gamer
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Descubre torneos, LAN parties, conferencias y meetups de la comunidad gamer chilena
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="todos" className="text-white hover:bg-slate-700">Todos los tipos</SelectItem>
                <SelectItem value="torneo" className="text-white hover:bg-slate-700">Torneos</SelectItem>
                <SelectItem value="lanparty" className="text-white hover:bg-slate-700">LAN Parties</SelectItem>
                <SelectItem value="conferencia" className="text-white hover:bg-slate-700">Conferencias</SelectItem>
                <SelectItem value="meetup" className="text-white hover:bg-slate-700">Meetups</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-12 text-center">
              <Gamepad2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm || typeFilter !== "todos" ? "No se encontraron eventos" : "No hay eventos disponibles"}
              </h3>
              <p className="text-slate-400">
                {searchTerm || typeFilter !== "todos"
                  ? "Intenta con otros filtros de búsqueda"
                  : "Los eventos aparecerán aquí cuando estén disponibles"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <img
                    src={event.imagen}
                    alt={event.titulo}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getTypeColor(event.tipo)} border`}>
                      {getTypeText(event.tipo)}
                    </Badge>
                  </div>
                  {event.precio === 0 && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20 border">
                        Gratuito
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-white text-lg line-clamp-2">
                    {event.titulo}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.fecha)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm line-clamp-3">
                    {event.descripcion}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{event.hora}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">
                        {event.inscritos || 0}/{event.capacidad}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">
                      {event.ubicacion.direccion}, {event.ubicacion.ciudad}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      <span className="text-white font-semibold">
                        {event.precio === 0 ? "Gratuito" : formatCurrency(event.precio)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                ¿Quieres organizar un evento?
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Si eres organizador de eventos gamer y quieres que aparezca en nuestra plataforma,
                contáctanos para agregar tu evento a la lista.
              </p>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Contactar Organizadores
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Eventos;
