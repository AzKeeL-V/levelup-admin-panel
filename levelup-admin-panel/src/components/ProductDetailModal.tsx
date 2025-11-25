import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/Product";
import { ShoppingCart, Star, Package, Award, Zap, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useReviews } from "@/context/ReviewContext";
import { useOrders } from "@/context/OrderContext";
import { useUsers } from "@/context/UserContext";
import { ReviewList } from "@/components/ReviewList";
import { ReviewForm } from "@/components/ReviewForm";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart?: (product: Product) => void;
}

const ProductDetailModal = ({ product, open, onOpenChange, onAddToCart }: ProductDetailModalProps) => {
  const { currentUser } = useUsers();
  const [hasPurchased, setHasPurchased] = useState(false);
  const { getOrdersByUser } = useOrders();

  useEffect(() => {
    const checkPurchase = async () => {
      if (currentUser && product) {
        try {
          const userOrders = await getOrdersByUser(currentUser.id);
          const hasPurchasedProduct = userOrders.some(order =>
            order.items.some(item => item.productId === product.codigo)
          );
          setHasPurchased(hasPurchasedProduct);
        } catch (error) {
          console.error("Error checking purchase:", error);
          setHasPurchased(false);
        }
      }
    };

    checkPurchase();
  }, [currentUser, product, getOrdersByUser]);

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-purple-400" />
            {product.nombre}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="detalles" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="detalles" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
              <Package className="w-4 h-4 mr-2" />
              Detalles
            </TabsTrigger>
            <TabsTrigger value="reseñas" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Reseñas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detalles" className="space-y-6 mt-6">
            {/* Imagen principal y información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-lg border border-slate-700">
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-full h-80 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  {product.puntos && (
                    <Badge className="absolute top-3 right-3 bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                      +{product.puntos} pts
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">{product.marca}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="border-purple-400/50 text-purple-400">
                      {product.categoria}
                    </Badge>
                    <div className="flex items-center text-sm text-slate-400">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>4.5</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {formatPrice(product.precio)}
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`font-medium ${product.stock < 10 ? "text-red-400" : "text-green-400"}`}>
                      Stock: {product.stock} unidades
                    </span>
                    {product.stock < 10 && (
                      <span className="text-red-400 font-medium">
                        ¡Solo {product.stock} disponibles!
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      onAddToCart?.(product);
                      onOpenChange(false);
                    }}
                    disabled={product.stock <= 0}
                    className={`w-full font-semibold py-3 ${product.stock <= 0
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed hover:bg-slate-700"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      }`}
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {product.stock <= 0 ? "Agotado" : "Agregar al Carrito"}
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-700" />

            {/* Descripción detallada */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                Descripción
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {product.descripcion}
              </p>
            </div>

            {/* Características */}
            {product.caracteristicas && product.caracteristicas.length > 0 && (
              <>
                <Separator className="bg-slate-700" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    Características
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-300">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{caracteristica}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.dimensiones && (
                <div>
                  <h4 className="font-medium text-slate-400 mb-1">Dimensiones</h4>
                  <p className="text-slate-300">{product.dimensiones}</p>
                </div>
              )}

              {product.material && (
                <div>
                  <h4 className="font-medium text-slate-400 mb-1">Material</h4>
                  <p className="text-slate-300">{product.material}</p>
                </div>
              )}

              {product.puntos && (
                <div>
                  <h4 className="font-medium text-slate-400 mb-1">Puntos LevelUp</h4>
                  <p className="text-slate-300">{product.puntos} puntos por compra</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reseñas" className="space-y-6 mt-6">
            <ReviewList productId={product.codigo} />

            {currentUser && hasPurchased && (
              <>
                <Separator className="bg-slate-700" />
                <ReviewForm
                  productId={product.codigo}
                  userId={currentUser.id}
                  userName={currentUser.nombre}
                  userEmail={currentUser.correo}
                />
              </>
            )}

            {currentUser && !hasPurchased && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Compra este producto para dejar una reseña</h3>
                <p className="text-slate-400">Solo los usuarios que han comprado este producto pueden compartir su opinión.</p>
              </div>
            )}

            {!currentUser && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Inicia sesión para dejar una reseña</h3>
                <p className="text-slate-400">Debes estar logueado y haber comprado este producto para compartir tu opinión.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
