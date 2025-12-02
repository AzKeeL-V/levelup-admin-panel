export interface Product {
  id?: number;
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
  rating?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  dimensiones?: string;
  material?: string;
  caracteristicas?: string[];
}
