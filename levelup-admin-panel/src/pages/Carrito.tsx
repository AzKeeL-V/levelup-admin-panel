import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Package,
  Truck
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductContext";
import { useUsers } from "@/context/UserContext";
import { toast } from "sonner";

const Carrito = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { products } = useProducts();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  // Shipping Logic
  const SHIPPING_COST = 3990;
  const FREE_SHIPPING_THRESHOLD = 50000;
  const shippingCost = cart.subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = cart.subtotal + shippingCost;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cart.items.find(i => i.id === itemId);
    if (item) {
      const product = products.find(p => p.codigo === item.productId);
      if (product && newQuantity > product.stock) {
        toast.error(`Solo hay ${product.stock} unidades disponibles de ${product.nombre}.`);
        return;
      }
    }

    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const { currentUser } = useUsers();

  const handleCheckout = async () => {
    // Check if user is logged in
    if (!currentUser) {
      navigate("/usuario/login");
      return;
    }

    // Check if user is admin
    if (currentUser.rol === 'admin') {
      navigate("/admin/pos");
      return;
    }

    // Navigate to checkout page
    navigate("/checkout");
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-slate-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">Tu carrito está vacío</h1>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Parece que aún no has agregado productos a tu carrito. ¡Explora nuestro catálogo y encuentra lo que necesitas!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/catalogo")}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Explorar Catálogo
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Volver al Inicio
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />

      {/* Banner */}
      <div className="relative w-full max-h-48 overflow-hidden">
        <img
          src="/images/inicio/banner_carrito.png"
          alt="Banner Carrito"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-slate-400 hover:text-white flex-shrink-0 p-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Continuar comprando</span>
              <span className="sm:hidden">Volver</span>
            </Button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">Carrito de Compras</h1>
          </div>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 self-start sm:self-center text-xs sm:text-sm">
            {cart.itemCount} producto{cart.itemCount !== 1 ? 's' : ''}
          </Badge>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.items.map((item) => {
              const product = products.find(p => p.codigo === item.productId);
              const maxStock = product ? product.stock : Infinity;

              return (
                <Card key={item.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      {/* Product Image and Info Row */}
                      <div className="flex gap-3 sm:gap-4">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm sm:text-base lg:text-lg mb-1">
                            {item.productName}
                          </h3>
                          <p className="text-slate-400 text-xs sm:text-sm mb-1 sm:mb-2">
                            Precio unitario: {formatPrice(item.unitPrice)}
                          </p>
                          {item.puntosGanados && (
                            <p className="text-yellow-400 text-xs sm:text-sm">
                              +{item.puntosGanados * item.quantity} puntos
                            </p>
                          )}
                          {product && product.stock < 10 && (
                            <p className="text-red-400 text-xs mt-1">
                              ¡Solo quedan {product.stock} unidades!
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantity and Price Row */}
                      <div className="flex items-center justify-between gap-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 h-7 w-7 sm:h-8 sm:w-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            max={maxStock}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="w-10 sm:w-12 lg:w-16 text-center bg-slate-700 border-slate-600 text-white h-7 sm:h-8 text-xs sm:text-sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= maxStock}
                            className={`border-slate-600 text-slate-300 h-7 w-7 sm:h-8 sm:w-8 p-0 ${item.quantity >= maxStock
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-slate-700"
                              }`}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex flex-col items-end gap-1 sm:gap-2">
                          <p className="text-white font-bold text-base sm:text-lg">
                            {formatPrice(item.totalPrice)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 h-auto text-xs sm:text-sm"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">Eliminar</span>
                            <span className="sm:hidden">Quitar</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Clear Cart */}
            <div className="flex justify-center sm:justify-end pt-2">
              <Button
                variant="outline"
                onClick={clearCart}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 text-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vaciar carrito
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700 sticky top-20 sm:top-24">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300 text-xs sm:text-sm lg:text-base">
                    <span>Subtotal ({cart.itemCount} productos)</span>
                    <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-slate-300 text-xs sm:text-sm lg:text-base">
                    <span>Envío</span>
                    <span className={shippingCost === 0 ? "text-green-400 font-medium" : "text-white font-medium"}>
                      {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
                    </span>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="flex justify-between text-white font-bold text-base sm:text-lg lg:text-xl">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  {/* Points earned */}
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 sm:p-3">
                    <p className="text-yellow-400 text-xs sm:text-sm">
                      🎉 Ganarás {Math.round(total * 0.05)} puntos con esta compra
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 sm:py-3 text-sm sm:text-base"
                >
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Proceder al Pago
                </Button>

                <div className="text-center">
                  <p className="text-slate-400 text-xs sm:text-sm mb-2">O continúa comprando</p>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/catalogo")}
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Seguir Comprando
                  </Button>
                </div>

                {/* Shipping Info */}
                <div className="bg-slate-700/50 rounded-lg p-2 sm:p-3">
                  <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm mb-2">
                    <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">Envío gratuito</span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Envío gratuito en compras sobre $50.000. Entrega estimada: 3-5 días hábiles.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Carrito;
