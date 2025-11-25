export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1-5 estrellas
  title: string;
  comment: string;
  fechaCreacion: string;
  aprobado: boolean; // Moderación por admin
  util: number; // Votos de utilidad
  noUtil: number; // Votos no útiles
  verified: boolean; // Compra verificada
  imagenes?: string[]; // Opcional: fotos del producto
}

export interface ReviewStats {
  productId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
