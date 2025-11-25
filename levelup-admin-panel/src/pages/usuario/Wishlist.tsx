import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useUsers } from "@/context/UserContext";

const Wishlist = () => {
    const navigate = useNavigate();
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { currentUser } = useUsers();

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center p-4">
                    <Card className="bg-slate-800/50 border-slate-700 max-w-md w-full text-center p-8">
                        <Heart className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Inicia sesión para ver tu lista de deseos</h2>
                        <p className="text-slate-400 mb-6">
                            Guarda tus productos favoritos y accede a ellos desde cualquier dispositivo.
                        </p>
                        <Button
                            onClick={() => navigate("/usuario/login")}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        >
                            Iniciar Sesión
                        </Button>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex flex-col">
            <Header />

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/")}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                            Mi Lista de Deseos
                        </h1>
                        <p className="text-slate-400">Tus productos favoritos guardados</p>
                    </div>
                </div>

                {wishlist.length === 0 ? (
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Heart className="w-20 h-20 text-slate-600 mb-6" />
                            <h3 className="text-xl font-semibold text-white mb-2">Tu lista de deseos está vacía</h3>
                            <p className="text-slate-400 mb-8 max-w-md text-center">
                                Explora nuestro catálogo y guarda los productos que más te gusten para comprarlos después.
                            </p>
                            <Button
                                onClick={() => navigate("/catalogo")}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                Explorar Catálogo
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((product) => (
                            <Card key={product.codigo} className="bg-slate-800/50 border-slate-700 overflow-hidden hover:border-purple-500/50 transition-colors group">
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={product.imagen}
                                        alt={product.nombre}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8 rounded-full bg-black/50 hover:bg-red-500 backdrop-blur-sm"
                                            onClick={() => removeFromWishlist(product.codigo)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="mb-2">
                                        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
                                            {product.categoria}
                                        </p>
                                        <h3 className="text-white font-semibold truncate" title={product.nombre}>
                                            {product.nombre}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-lg font-bold text-white">
                                            ${product.precio.toLocaleString("es-CL")}
                                        </span>
                                        <Button
                                            size="sm"
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock <= 0}
                                            className={`
                        ${product.stock <= 0
                                                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                                                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                                                }
                      `}
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            {product.stock <= 0 ? "Agotado" : "Agregar"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Wishlist;
