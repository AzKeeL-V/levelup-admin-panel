import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBlog } from "@/context/BlogContext";
import { Product } from "@/types/Product";
import { Award, ArrowRight, Star, Users, Trophy, Zap, Cpu, Gamepad2, Shield, Sparkles, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";

const Index = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { blogItems } = useBlog();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Select 4 featured products (first 4 active products)
    const activeProducts = products.filter(p => p.activo);
    setFeaturedProducts(activeProducts.slice(0, 4));
  }, [products]);

  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleViewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Generate floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    animation: `animate-particle-${(i % 3) + 1}`,
    delay: Math.random() * 5,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />

      {/* Hero Banner Section */}
      <div className="relative w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/inicio/banner_inicio.png"
            alt="Banner Inicio LevelUp"
            className="w-full h-full object-cover scale-110 animate-zoom-smooth"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/30" />
          {/* Blur fade at bottom to blend with page */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#1A1A2E] via-[#1A1A2E]/50 to-transparent backdrop-blur-sm" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40" />
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-cyan-400 rounded-full animate-pulse opacity-50" />
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
              <span className="block">Bienvenido a</span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                LevelUp
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
              Tu tienda gaming de confianza en Chile. Descubre productos premium,
              acumula puntos con cada compra y únete a la comunidad DUOC gamer más grande del país.
            </p>


          </div>
        </div>
      </div>

      <main id="main-content">

        {/* Enhanced Features Section */}
        <section
          className="py-20 bg-slate-900/40 relative z-10"
          aria-labelledby="features-heading"
          role="region"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 id="features-heading" className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-wide">
                ¿Por qué elegir <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">LevelUp</span>?
              </h2>
              <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
                Descubre por qué LevelUp es la tienda gaming preferida por estudiantes DUOC en todo Chile
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
              <Card className="glass-premium border-0 hover:border-purple-300/50 transition-all duration-700 transform hover:scale-105 hover:translate-y-[-4px] focus-within:ring-4 focus-within:ring-purple-400 animate-fade-in-left animate-delay-200 group relative overflow-hidden" style={{ backgroundImage: 'url(/images/inicio/tarjeta_puntos.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-4">Sistema de Puntos LevelUp</h3>
                  <p className="text-white leading-relaxed">
                    Acumulá puntos con cada compra en LevelUp y canjealos por productos exclusivos, descuentos especiales y beneficios premium para estudiantes DUOC
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-premium border-0 hover:border-slate-500/50 transition-all duration-700 transform hover:scale-105 hover:translate-y-[-4px] focus-within:ring-4 focus-within:ring-purple-400 animate-fade-in-up animate-delay-300 group relative overflow-hidden" style={{ backgroundImage: 'url(/images/inicio/tarjeta_tecnologia.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-4">Tecnología Premium</h3>
                  <p className="text-white leading-relaxed">
                    Productos tecnológicos de vanguardia seleccionados para ofrecer la mejor experiencia gaming del mercado
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-premium border-0 hover:border-purple-400/50 transition-all duration-700 transform hover:scale-105 hover:translate-y-[-4px] focus-within:ring-4 focus-within:ring-purple-400 animate-fade-in-right animate-delay-500 group relative overflow-hidden" style={{ backgroundImage: 'url(/images/inicio/tarjeta_comunidad.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-4">Comunidad DUOC Gaming</h3>
                  <p className="text-white leading-relaxed">
                    Descuentos exclusivos para estudiantes DUOC UC, torneos universitarios, eventos gaming y comunidad exclusiva para gamers DUOC
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Enhanced Featured Products Section */}
        <section
          className="py-20 relative z-10"
          aria-labelledby="products-heading"
          role="region"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 id="products-heading" className="text-4xl md:text-5xl font-bold text-pink-500 mb-6 tracking-wide">
                Productos Destacados
              </h2>
              <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
                Descubre nuestra selección premium de productos gaming más populares entre estudiantes DUOC y comienza tu aventura gaming definitiva
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-16" role="status" aria-live="polite">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 animate-energy-pulse" aria-hidden="true"></div>
                <span className="sr-only">Cargando productos destacados...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" role="list" aria-label="Productos destacados">
                {featuredProducts.map((product, index) => (
                  <div
                    key={product.id || product.codigo || `product-${index}`}
                    className={`animate-fade-in-up animate-geometric-float`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                    role="listitem"
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onViewDetails={handleViewProductDetails}
                      featured={true}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-16 animate-fade-in-up animate-delay-1000">
              <Button
                size="lg"
                onClick={() => navigate("/catalogo")}
                variant="outline"
                className="glass-premium border-pink-400/50 text-pink-400 hover:bg-pink-400/10 hover:text-pink-300 transition-all duration-500 px-12 py-6 rounded-2xl hover:shadow-2xl hover:shadow-pink-400/20 text-xl font-semibold animate-energy-pulse"
                aria-label="Ver todos los productos disponibles"
              >
                <Sparkles className="mr-3 w-6 h-6" />
                Ver Todos los Productos
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </div>
          </div>
        </section>

        {/* Enhanced Blog Section */}
        <section
          className="py-20 bg-gradient-to-b from-slate-900/50 via-purple-950/20 to-slate-900/50 relative z-10"
          aria-labelledby="blog-heading"
          role="region"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 id="blog-heading" className="text-4xl md:text-5xl font-bold text-pink-500 mb-6 tracking-wide">
                Últimas Novedades Gaming
              </h2>
              <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
                Mantente al día con los últimos eventos, torneos y actividades de la comunidad LevelUp
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogItems
                .filter(item => item.tipo === "evento")
                .slice(0, 3)
                .map((item, index) => (
                  <Card key={item.id} className={`glass-premium border-0 hover:border-pink-400/50 transition-all duration-700 transform hover:scale-105 focus-within:ring-4 focus-within:ring-pink-400 animate-fade-in-up animate-delay-${(index + 2) * 100} group flex flex-col h-full`}>
                    <CardContent className="p-0 flex-grow flex flex-col">
                      <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
                        <img
                          src={item.imagen || "/images/blog_noticia/logo_noticias.png"}
                          alt={item.titulo}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                        <Badge className="absolute top-3 right-3 bg-pink-500/80 text-white border-0 backdrop-blur-sm">
                          {item.categoria || "Evento"}
                        </Badge>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-xs text-pink-400 mb-3 font-medium uppercase tracking-wider">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(item.fecha).toLocaleDateString("es-CL", { day: 'numeric', month: 'long' })}</span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-pink-400 transition-colors">
                          {item.titulo}
                        </h3>

                        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                          {item.descripcion}
                        </p>

                        <Button
                          onClick={() => navigate(`/blog/${item.id}`)}
                          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-2 rounded-xl transition-all duration-300 mt-auto shadow-lg shadow-pink-900/20"
                        >
                          Ver Detalles
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <div className="text-center mt-16 animate-fade-in-up animate-delay-1000">
              <Button
                size="lg"
                onClick={() => navigate("/blog")}
                variant="outline"
                className="glass-premium border-purple-300/50 text-purple-200 hover:bg-purple-400/10 hover:text-purple-100 transition-all duration-500 px-12 py-6 rounded-2xl hover:shadow-2xl hover:shadow-purple-400/20 text-xl font-semibold animate-energy-pulse"
                aria-label="Visitar el blog completo"
              >
                <Sparkles className="mr-3 w-6 h-6" />
                Visitar Blog Completo
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default Index;
