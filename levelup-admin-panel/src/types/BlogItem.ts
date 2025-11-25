export interface BlogItem {
  id: string;
  tipo: "video" | "nota" | "evento";
  titulo: string;
  descripcion: string;
  fecha: string;
  puntos?: number;
  estado: "activo" | "finalizado" | "programado";
  imagen?: string; // URL de la imagen
  videoUrl?: string; // URL del video (YouTube, Vimeo, etc.)
  contenidoCompleto?: string; // Contenido completo del artículo/nota
  autor?: string; // Autor del contenido
  tiempoLectura?: number; // Tiempo estimado de lectura en minutos
  categoria?: string; // Categoría adicional (Reviews, Guías, Noticias, etc.)
  etiquetas?: string[]; // Tags para búsqueda
  direccion?: string; // Dirección para eventos, utilizada en Google Maps
  horaInicio?: string; // Hora de inicio del evento
  horaFin?: string; // Hora de fin del evento
  ubicacionUrl?: string; // URL directa a Google Maps u otro servicio
}
