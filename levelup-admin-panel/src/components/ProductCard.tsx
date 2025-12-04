import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/Product";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  featured?: boolean;
  rewardsMode?: boolean;
}

const ProductCard = ({ product, onAddToCart, onViewDetails, featured = false, rewardsMode = false }: ProductCardProps) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isLiked = isInWishlist(product.codigo);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      removeFromWishlist(product.codigo);
    } else {
      addToWishlist(product);
    }
  };

  console.log("ProductCard: Renderizando producto:", product.nombre, product);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 border-slate-800 bg-slate-900/50 backdrop-blur-sm cursor-pointer ${featured ? 'ring-2 ring-pink-500/50' : ''}`}
      onClick={() => onViewDetails?.(product)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {featured && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            Destacado
          </Badge>
        )}
        {product.puntos && product.canjeable && (
          <Badge variant="secondary" className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
            Canjeable
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 hover:bg-black/20 text-white"
          onClick={toggleWishlist}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-pink-500 text-pink-500" : "text-white"}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 group-hover:text-cyan-400 transition-colors">
                {product.nombre}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{product.marca}</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2">
            {product.descripcion}
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col min-h-[3rem]">
              <span className="text-lg font-bold text-white">
                {rewardsMode ? `${product.puntos} puntos` : formatPrice(product.precio)}
              </span>
              {product.stock < 10 && !rewardsMode && (
                <span className="text-xs text-red-400">
                  ¡Solo {product.stock} disponibles!
                </span>
              )}
            </div>

            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.(product);
              }}
              disabled={product.stock <= 0}
              className={`shadow-lg transition-all duration-300 ${product.stock <= 0
                ? "bg-slate-700 text-slate-400 cursor-not-allowed hover:bg-slate-700"
                : "bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-white hover:shadow-pink-500/25"
                }`}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {product.stock <= 0 ? "Agotado" : (rewardsMode ? "Canjear" : "Agregar")}
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            {!rewardsMode && <span>Stock: {product.stock}</span>}
            <div className="flex items-center">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
              <span>{product.rating || 4.5}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
