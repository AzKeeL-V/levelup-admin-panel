import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
  className
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const handleClick = (starValue: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleMouseEnter = (starValue: number) => {
    if (!readonly) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = hoverRating > 0 ? star <= hoverRating : star <= rating;
        const isHalf = hoverRating > 0
          ? false // No half stars on hover for simplicity
          : star - 0.5 <= rating && rating < star;

        return (
          <button
            key={star}
            type="button"
            className={cn(
              "transition-colors duration-150",
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110",
              "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded"
            )}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-all duration-150",
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-slate-300 hover:text-yellow-300"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

interface StarRatingDisplayProps {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const StarRatingDisplay = ({
  rating,
  totalReviews,
  size = "md",
  showText = true,
  className
}: StarRatingDisplayProps) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= rating;
          const isPartial = star - 1 < rating && rating < star;

          return (
            <div key={star} className="relative">
              <Star
                className={cn(
                  sizeClasses[size],
                  "text-slate-300"
                )}
              />
              {isFilled && (
                <Star
                  className={cn(
                    sizeClasses[size],
                    "absolute top-0 left-0 fill-yellow-400 text-yellow-400"
                  )}
                />
              )}
              {isPartial && (
                <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
                  <Star
                    className={cn(
                      sizeClasses[size],
                      "fill-yellow-400 text-yellow-400"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showText && (
        <span className="text-sm text-slate-600">
          {rating.toFixed(1)}
          {totalReviews !== undefined && ` (${totalReviews} reseñas)`}
        </span>
      )}
    </div>
  );
};
