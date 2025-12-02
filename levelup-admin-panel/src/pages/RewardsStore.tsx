import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUsers } from "@/context/UserContext";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const RewardsStore = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [sortBy, setSortBy] = useState("puntos-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get current user points
  const { currentUser } = useUsers();
  const userPoints = currentUser.puntos || 0;

  // Get unique categories for rewards products
  const categories = ["todos", ...Array.from(new Set(products.filter(p => p.canjeable).map(p => p.categoria)))];

  useEffect(() => {
    let filtered = products.filter(p => p.activo && p.canjeable);

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "todos") {
      filtered = filtered.filter(product => product.categoria === selectedCategory);
    }

    // Sort products by points
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "puntos-asc":
          return (a.puntos || 0) - (b.puntos || 0);
        case "puntos-desc":
          return (b.puntos || 0) - (a.puntos || 0);
        case "nombre":
        default:
          return a.nombre.localeCompare(b.nombre);
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, searchTerm, selectedCategory, sortBy]);

  const handleRedeemProduct = (product: Product) => {
    if (!currentUser.id) {
      toast.warning("Debes iniciar sesión para canjear productos");
      return;
    }

    const requiredPoints = product.puntos || 0;
    if (userPoints < requiredPoints) {
      toast.warning(`No tienes suficientes puntos. Necesitas ${requiredPoints} puntos, tienes ${userPoints}.`);
      return;
    }

    // Navegar a página de canje
    navigate(`/redemption/product/${product.codigo}`);
  };

  const handleViewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("todos");
    setSortBy("puntos-asc");
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />

      {/* Hero Banner Section */}
      <div className="relative w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/catalogo/banner_catalogo.png"
            alt="Banner Tienda de Recompensas LevelUp"
            className="w-full h-full object-cover scale-110 animate-zoom-smooth"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/30" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-orange-400 rounded-full animate-ping opacity-40" />
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-50" />
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
              <span className="block">Tienda de</span>
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Recompensas
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
              Canjea tus puntos acumulados por productos exclusivos.
              ¡Cada compra te acerca a más recompensas!
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-8 text-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-medium">{filteredProducts.length} productos disponibles</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Tus puntos: {userPoints}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Canjea y ahorra</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters and Search */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-slate-700">
                    {category === "todos" ? "Todas las categorías" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="nombre" className="text-white hover:bg-slate-700">Nombre</SelectItem>
                <SelectItem value="puntos-asc" className="text-white hover:bg-slate-700">Puntos: Menor a Mayor</SelectItem>
                <SelectItem value="puntos-desc" className="text-white hover:bg-slate-700">Puntos: Mayor a Menor</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex-1"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex-1"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              {(searchTerm || selectedCategory !== "todos") && (
                <>
                  <span className="text-slate-400 text-sm">Filtros activos:</span>
                  {searchTerm && (
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                      Búsqueda: {searchTerm}
                    </Badge>
                  )}
                  {selectedCategory !== "todos" && (
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                      Categoría: {selectedCategory}
                    </Badge>
                  )}
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-slate-400 hover:text-white"
            >
              Limpiar filtros
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-400">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''} • Página {currentPage} de {totalPages}
          </p>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : currentProducts.length > 0 ? (
          <>
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                : "space-y-4 mb-8"
            }>
              {currentProducts.map((product) => (
                <div key={product.codigo} className="animate-fade-in">
                  {viewMode === "grid" ? (
                    <ProductCard
                      product={product}
                      onAddToCart={handleRedeemProduct}
                      onViewDetails={handleViewProductDetails}
                      rewardsMode={true}
                    />
                  ) : (
                    // List view - simplified card
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800/70 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.imagen}
                          alt={product.nombre}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">{product.nombre}</h3>
                          <p className="text-slate-400 text-sm truncate">{product.marca}</p>
                          <p className="text-yellow-400 font-bold">
                            {product.puntos} puntos
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleRedeemProduct(product)}
                          disabled={product.stock <= 0}
                          className={
                            product.stock <= 0
                              ? "bg-slate-700 text-slate-400 cursor-not-allowed hover:bg-slate-700"
                              : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                          }
                        >
                          {product.stock <= 0 ? "Agotado" : "Canjear"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={
                        currentPage === page
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-slate-400">
              <p className="text-lg mb-2">No se encontraron productos</p>
              <p className="text-sm">Intenta ajustar tus filtros de búsqueda</p>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        onAddToCart={handleRedeemProduct}
      />
    </div>
  );
};

export default RewardsStore;
