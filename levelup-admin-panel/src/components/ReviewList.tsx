import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRatingDisplay } from "@/components/ui/star-rating";
import { useReviews } from "@/context/ReviewContext";
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import type { Review } from "@/types";

interface ReviewListProps {
  productId: string;
  className?: string;
}

export const ReviewList = ({ productId, className = "" }: ReviewListProps) => {
  const { getProductReviews, voteHelpful } = useReviews();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedReviews, setVotedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const productReviews = await getProductReviews(productId);
      setReviews(productReviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("Error al cargar reseñas");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (reviewId: string, helpful: boolean) => {
    if (votedReviews.has(reviewId)) {
      toast.info("Ya votaste esta reseña");
      return;
    }

    try {
      await voteHelpful(reviewId, helpful);
      setVotedReviews(prev => new Set(prev).add(reviewId));
      toast.success("¡Gracias por tu voto!");
      await loadReviews(); // Recargar para mostrar votos actualizados
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Error al votar");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-slate-700 rounded"></div>
                    <div className="w-24 h-3 bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="w-full h-4 bg-slate-700 rounded"></div>
                <div className="w-3/4 h-4 bg-slate-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-8 text-center">
          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Sin reseñas aún</h3>
          <p className="text-slate-400">Sé el primero en compartir tu opinión sobre este producto.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {reviews.map((review) => (
        <Card key={review.id} className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {review.userName?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-semibold">{review.userName || 'Usuario'}</h4>
                    {review.verified && (
                      <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Compra verificada
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <StarRatingDisplay rating={review.rating} size="sm" showText={false} />
                    <span>{formatDate(review.fechaCreacion)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-white font-semibold mb-2">{review.title}</h5>
              <p className="text-slate-300 leading-relaxed">{review.comment}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(review.id, true)}
                  disabled={votedReviews.has(review.id)}
                  className="text-slate-400 hover:text-green-400 hover:bg-green-500/10"
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Útil ({review.util})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(review.id, false)}
                  disabled={votedReviews.has(review.id)}
                  className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <ThumbsDown className="w-4 h-4 mr-1" />
                  No útil ({review.noUtil})
                </Button>
              </div>

              {votedReviews.has(review.id) && (
                <span className="text-xs text-slate-500">Gracias por votar</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
