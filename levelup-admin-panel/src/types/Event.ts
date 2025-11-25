export interface Event {
  id: string;
  titulo: string;
  nombre?: string; // Alias para titulo
  descripcion: string;
  descripcionCompleta?: string;
  fecha: string;
  hora?: string;
  horaInicio?: string;
  horaFin?: string;
  ubicacion: {
    latitud?: number;
    longitud?: number;
    direccion: string;
    ciudad: string;
    region: string;
  };
  organizador: string;
  tipo: "torneo" | "lanparty" | "conferencia" | "meetup" | "otro" | "online" | "presencial" | "hibrido";
  capacidad: number;
  capacidadMaxima?: number;
  inscritos?: number;
  precio: number;
  imagen: string;
  activo: boolean;
  estado?: "activo" | "programado" | "finalizado" | "cancelado";
  puntosRecompensa?: number;
  puntosGanables?: number; // Puntos que gana el usuario al participar
  tags: string[];
  fechaCreacion: string;
  fecha_actualizacion?: string;
  requiereInscripcion?: boolean;
  enlaceTransmision?: string; // Para eventos online
  categoria?: string;
  contenidoAdjunto?: {
    slides?: string;
    video?: string;
    documento?: string;
  };
}
