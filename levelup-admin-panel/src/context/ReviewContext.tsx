import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Review, ReviewStats } from "@/types/Review";
import { ReviewRepository } from "@/repositories/ReviewRepository";

interface ReviewContextType {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  addReview: (review: Omit<Review, "id" | "fechaCreacion" | "aprobado" | "util" | "noUtil">) => Promise<void>;
  updateReview: (id: string, review: Partial<Review>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  approveReview: (id: string) => Promise<void>;
  rejectReview: (id: string) => Promise<void>;
  getProductReviews: (productId: string) => Promise<Review[]>;
  getUserReviews: (userId: string) => Promise<Review[]>;
  getProductStats: (productId: string) => Promise<ReviewStats>;
  voteHelpful: (reviewId: string, helpful: boolean) => Promise<void>;
  refreshReviews: () => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      console.log("ReviewContext: Loading reviews...");
      setLoading(true);
      setError(null);
      const reviewData = await ReviewRepository.findAll();
      console.log("ReviewContext: Reviews loaded:", reviewData?.length || 0, "reviews");
      setReviews(reviewData);
    } catch (err) {
      console.error("ReviewContext: Error loading reviews:", err);
      setError(err instanceof Error ? err.message : "Error al cargar reseñas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const addReview = useCallback(async (review: Omit<Review, "id" | "fechaCreacion">) => {
    try {
      setError(null);
      await ReviewRepository.create(review);
      await loadReviews(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear reseña";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadReviews]);

  const updateReview = useCallback(async (id: string, reviewData: Partial<Review>) => {
    try {
      setError(null);
      await ReviewRepository.update(id, reviewData);
      await loadReviews(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar reseña";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadReviews]);

  const deleteReview = useCallback(async (id: string) => {
    try {
      setError(null);
      await ReviewRepository.delete(id);
      await loadReviews(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar reseña";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadReviews]);

  const approveReview = useCallback(async (id: string) => {
    try {
      setError(null);
      await ReviewRepository.approveReview(id);
      await loadReviews();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al aprobar reseña";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadReviews]);

  const rejectReview = useCallback(async (id: string) => {
    try {
      setError(null);
      await ReviewRepository.rejectReview(id);
      await loadReviews();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al rechazar reseña";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadReviews]);

  const getProductReviews = useCallback(async (productId: string) => {
    try {
      return await ReviewRepository.findByProductId(productId);
    } catch (err) {
      console.error("Error getting product reviews:", err);
      throw err;
    }
  }, []);

  const getUserReviews = useCallback(async (userId: string) => {
    try {
      return await ReviewRepository.findByUserId(userId);
    } catch (err) {
      console.error("Error getting user reviews:", err);
      throw err;
    }
  }, []);

  const getProductStats = useCallback(async (productId: string) => {
    try {
      return await ReviewRepository.getProductStats(productId);
    } catch (err) {
      console.error("Error getting product stats:", err);
      throw err;
    }
  }, []);

  const voteHelpful = useCallback(async (reviewId: string, helpful: boolean) => {
    try {
      setError(null);
      await ReviewRepository.voteHelpful(reviewId, helpful);
      await loadReviews();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al votar reseña";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadReviews]);

  const refreshReviews = useCallback(async () => {
    await loadReviews();
  }, [loadReviews]);

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        loading,
        error,
        addReview,
        updateReview,
        deleteReview,
        approveReview,
        rejectReview,
        getProductReviews,
        getUserReviews,
        getProductStats,
        voteHelpful,
        refreshReviews,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewProvider");
  }
  return context;
};
