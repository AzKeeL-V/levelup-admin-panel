export interface Product {
  codigo: string;
  categoria: string;
  marca: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  puntos?: number;
  imagen: string;
  activo: boolean;
  canjeable: boolean;
  origen?: "tienda" | "recompensas"; // "tienda" = tienda regular, "recompensas" = canje por puntos
  rating?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  dimensiones?: string;
  material?: string;
  caracteristicas?: string[];
}
