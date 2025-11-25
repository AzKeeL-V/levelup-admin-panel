import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import { useReviews } from "@/context/ReviewContext";
import { toast } from "sonner";
import { MessageSquare, Star } from "lucide-react";

interface ReviewFormProps {
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  onReviewSubmitted?: () => void;
  className?: string;
}

export const ReviewForm = ({
  productId,
  userId,
  userName,
  userEmail,
  onReviewSubmitted,
  className = ""
}: ReviewFormProps) => {
  const { addReview } = useReviews();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    comment: ""
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (formData.rating === 0) {
      newErrors.rating = "Debes seleccionar una calificación";
    }
    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    }
    if (!formData.comment.trim()) {
      newErrors.comment = "El comentario es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await addReview({
        productId,
        userId,
        userName,
        userEmail,
        rating: formData.rating,
        title: formData.title.trim(),
        comment: formData.comment.trim(),
        verified: true // Asumimos que es verificado si el usuario está logueado
      });

      toast.success("¡Reseña enviada! Será revisada por nuestro equipo antes de publicarse.");

      // Reset form
      setFormData({
        rating: 0,
        title: "",
        comment: ""
      });

      onReviewSubmitted?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error al enviar la reseña. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`bg-slate-800/50 border-slate-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Escribir Reseña
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <Label className="text-slate-300 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Calificación *
            </Label>
            <div className="mt-2">
              <StarRating
                rating={formData.rating}
                onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                size="lg"
              />
            </div>
            {errors.rating && <p className="text-red-400 text-sm mt-1">{errors.rating}</p>}
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-slate-300">
              Título de la reseña *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Resumen de tu experiencia"
              maxLength={100}
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-slate-300">
              Comentario *
            </Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
              placeholder="Cuéntanos tu experiencia con este producto..."
              maxLength={1000}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              {errors.comment && <p className="text-red-400">{errors.comment}</p>}
              <span className="ml-auto">{formData.comment.length}/1000</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-2" />
                Enviar Reseña
              </>
            )}
          </Button>

          <p className="text-xs text-slate-400 text-center">
            Tu reseña será moderada antes de ser publicada.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
