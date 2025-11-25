import { Review, ReviewStats } from "@/types/Review";
import axiosInstance from "@/utils/axiosInstance"; // Usa la instancia de axios configurada para backend o mock

export class ReviewRepository {
  private static readonly STORAGE_KEY = "levelup_reviews";
  private static readonly STATS_KEY = "levelup_review_stats";

  static async findAll(): Promise<Review[]> {
    try {
      // Si existe backend, usa axios.
      try {
        const response = await axiosInstance.get('/reviews');
        return response.data;
      } catch (err) {
        // Si falla axios (no hay backend), usa localStorage o JSON local
      }

      // 1. Cargar datos de localStorage
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const localReviews: Review[] = stored ? JSON.parse(stored) : [];

      // 2. Cargar datos del JSON
      let jsonReviews: Review[] = [];
      if (typeof fetch !== 'undefined') {
        try {
          const response = await fetch('/levelup_reviews.json');
          if (response.ok) {
            jsonReviews = await response.json();
          }
        } catch (e) {
          console.error("Error cargando JSON de reseñas:", e);
        }
      }

      // 3. Merge inteligente
      const mergedReviews = [...localReviews];
      jsonReviews.forEach(jsonReview => {
        const exists = localReviews.some(r => r.id === jsonReview.id);
        if (!exists) {
          mergedReviews.push(jsonReview);
        }
      });

      // 4. Guardar si hay cambios (o siempre para asegurar sincronización inicial)
      if (mergedReviews.length > 0) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mergedReviews));
      }

      return mergedReviews;

    } catch (error) {
      console.error("Error loading reviews:", error);
      return [];
    }
  }

  static async findByProductId(productId: string): Promise<Review[]> {
    const reviews = await this.findAll();
    return reviews.filter(review => review.productId === productId && review.aprobado);
  }

  static async findByUserId(userId: string): Promise<Review[]> {
    const reviews = await this.findAll();
    return reviews.filter(review => review.userId === userId);
  }

  static async create(review: Omit<Review, "id" | "fechaCreacion">): Promise<Review> {
    const reviews = await this.findAll();
    const newReview: Review = {
      ...review,
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fechaCreacion: new Date().toISOString(),
      aprobado: false, // Requiere moderación
      util: 0,
      noUtil: 0
    };

    reviews.push(newReview);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reviews));

    // Actualizar estadísticas
    await this.updateProductStats(review.productId);

    return newReview;
  }

  static async update(id: string, reviewData: Partial<Review>): Promise<void> {
    const reviews = await this.findAll();
    const index = reviews.findIndex(review => review.id === id);

    if (index !== -1) {
      reviews[index] = { ...reviews[index], ...reviewData };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reviews));

      // Actualizar estadísticas si cambió el producto
      if (reviewData.productId) {
        await this.updateProductStats(reviewData.productId);
      }
    }
  }

  static async delete(id: string): Promise<void> {
    const reviews = await this.findAll();
    const filteredReviews = reviews.filter(review => review.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredReviews));

    // Actualizar estadísticas del producto
    const deletedReview = reviews.find(review => review.id === id);
    if (deletedReview) {
      await this.updateProductStats(deletedReview.productId);
    }
  }

  static async approveReview(id: string): Promise<void> {
    await this.update(id, { aprobado: true });
  }

  static async rejectReview(id: string): Promise<void> {
    await this.delete(id); // O marcar como rechazado
  }

  static async getProductStats(productId: string): Promise<ReviewStats> {
    const reviews = await this.findByProductId(productId);
    const approvedReviews = reviews.filter(r => r.aprobado);

    const ratingDistribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };

    let totalRating = 0;
    approvedReviews.forEach(review => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      totalRating += review.rating;
    });

    return {
      productId,
      totalReviews: approvedReviews.length,
      averageRating: approvedReviews.length > 0 ? totalRating / approvedReviews.length : 0,
      ratingDistribution
    };
  }

  private static async updateProductStats(productId: string): Promise<void> {
    const stats = await this.getProductStats(productId);
    const allStats = await this.getAllStats();

    allStats[productId] = stats;
    localStorage.setItem(this.STATS_KEY, JSON.stringify(allStats));
  }

  private static async getAllStats(): Promise<Record<string, ReviewStats>> {
    try {
      const data = localStorage.getItem(this.STATS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Error loading review stats:", error);
      return {};
    }
  }

  static async voteHelpful(reviewId: string, helpful: boolean): Promise<void> {
    const reviews = await this.findAll();
    const review = reviews.find(r => r.id === reviewId);

    if (review) {
      if (helpful) {
        review.util++;
      } else {
        review.noUtil++;
      }
      await this.update(reviewId, { util: review.util, noUtil: review.noUtil });
    }
  }
}
