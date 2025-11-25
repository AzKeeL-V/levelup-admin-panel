import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Filter, Plus, Edit, Trash2, Award, DollarSign, Loader2, Eye, EyeOff } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductDialog } from "@/components/admin/ProductDialog";
import ProductDetailModal from "@/components/admin/ProductDetailModal";
import { toast } from "sonner";
import { useProducts } from "@/context/ProductContext";

const Productos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [canjeableFilter, setCanjeableFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [mobilePage, setMobilePage] = useState(1);
  const MOBILE_ITEMS_PER_PAGE = 10;

  const { products, loading, error, addProduct, updateProduct, deactivateProduct, getTotalInventoryValue, getTotalStock, getActiveProductsCount } = useProducts();

  const totalInventoryValue = getTotalInventoryValue();
  const totalStock = getTotalStock();
  const activeProductsCount = getActiveProductsCount();

  // Get unique categories and brands for filters
  const categories = Array.from(new Set(products.map(p => p.categoria)));
  const brands = Array.from(new Set(products.map(p => p.marca)));

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "all" || product.categoria === categoryFilter;
    const matchesBrand = brandFilter === "all" || product.marca === brandFilter;
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && product.activo) ||
      (statusFilter === "inactive" && !product.activo);
    const matchesCanjeable = canjeableFilter === "all" ||
      (canjeableFilter === "canjeable" && product.canjeable) ||
      (canjeableFilter === "no-canjeable" && !product.canjeable);

    return matchesSearch && matchesCategory && matchesBrand && matchesStatus && matchesCanjeable;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const resetMobilePage = () => {
    setMobilePage(1);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleViewProductDetails = (product: any) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  const handleToggleProductStatus = (product: any) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmToggleProductStatus = async () => {
    if (!productToDelete) return;

    try {
      if (productToDelete.activo) {
        // Desactivar producto
        await deactivateProduct(productToDelete.codigo);
        toast.success("Producto desactivado correctamente");
      } else {
        // Reactivar producto
        const updatedProduct = { ...productToDelete, activo: true };
        await updateProduct(productToDelete.codigo, updatedProduct);
        toast.success("Producto reactivado correctamente");
      }
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (err) {
      toast.error(`Error al ${productToDelete.activo ? 'desactivar' : 'reactivar'} el producto`);
    }
  };

  const handleSaveProduct = async (product: any) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.codigo, product);
        toast.success("Producto actualizado correctamente");
      } else {
        await addProduct(product);
        toast.success("Producto agregado correctamente");
      }
      setEditingProduct(null);
    } catch (err) {
      toast.error("Error al guardar el producto");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando productos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Productos</h1>
          <p className="text-muted-foreground">Gestiona el catálogo de productos</p>
        </div>
        <Button
          onClick={handleAddProduct}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Inventory Value Card */}
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 sm:p-4 rounded-xl bg-primary/20">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Valor Total del Inventario</p>
              <h3 className="text-2xl sm:text-4xl font-bold text-primary">
                ${totalInventoryValue.toLocaleString("es-CL")}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Basado en {activeProductsCount} productos activos ({totalStock} unidades)
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6 bg-card border-border">
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos por nombre, marca, código o categoría..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  resetMobilePage();
                }}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <Button
              variant="outline"
              className="border-border w-full sm:w-auto"
              onClick={() => {
                setCategoryFilter("all");
                setBrandFilter("all");
                setStatusFilter("all");
                setCanjeableFilter("all");
                setSearchTerm("");
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={categoryFilter} onValueChange={(value) => {
              setCategoryFilter(value);
              resetMobilePage();
            }}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={brandFilter} onValueChange={(value) => {
              setBrandFilter(value);
              resetMobilePage();
            }}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              resetMobilePage();
            }}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={canjeableFilter} onValueChange={(value) => {
              setCanjeableFilter(value);
              resetMobilePage();
            }}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Canjeable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="canjeable">Canjeables</SelectItem>
                <SelectItem value="no-canjeable">No canjeables</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden xl:block rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="w-[400px]">Producto</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Puntos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.codigo} className="hover:bg-secondary/30">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="w-12 h-12 object-cover rounded-lg border border-border"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{product.nombre}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{product.marca}</span>
                          <span>•</span>
                          <span className="font-mono">{product.codigo}</span>
                        </div>
                        <div className="mt-1">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-accent/50 text-accent">
                            {product.categoria}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${product.precio.toLocaleString("es-CL")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.stock <= 5 ? "destructive" : "secondary"}
                      className="font-mono"
                    >
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.puntos ? (
                      <div className="flex items-center gap-1 text-primary">
                        <Award className="w-4 h-4" />
                        <span className="font-semibold">{product.puntos}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={product.activo ? "secondary" : "destructive"}
                        className="w-fit"
                      >
                        {product.activo ? "Activo" : "Inactivo"}
                      </Badge>
                      {product.canjeable && (
                        <Badge variant="outline" className="text-[10px] w-fit">
                          Canjeable
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleViewProductDetails(product)}
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleEditProduct(product)}
                        title="Editar producto"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-8 w-8 ${product.activo ? 'hover:text-destructive hover:bg-destructive/10' : 'hover:text-green-500 hover:bg-green-500/10'
                          }`}
                        onClick={() => handleToggleProductStatus(product)}
                        title={product.activo ? 'Desactivar producto' : 'Reactivar producto'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="block xl:hidden">
          {filteredProducts.length > 0 ? (
            <>
              <div className="space-y-3">
                {filteredProducts.slice(
                  (mobilePage - 1) * MOBILE_ITEMS_PER_PAGE,
                  mobilePage * MOBILE_ITEMS_PER_PAGE
                ).map((product) => (
                  <Card key={product.codigo} className="p-4 transition-all hover:shadow-md">
                    <div className="space-y-3">
                      {/* Header with name and actions */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm leading-tight">{product.nombre}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">{product.marca}</p>
                          <p className="text-xs font-mono text-muted-foreground">{product.codigo}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewProductDetails(product)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleProductStatus(product)}
                            className={`h-8 w-8 p-0 ${product.activo ? 'hover:border-destructive hover:text-destructive' : 'hover:border-green-500 hover:text-green-500'
                              }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Badges and points */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-xs border-accent/50 text-accent">
                            {product.categoria}
                          </Badge>
                          <Badge
                            variant={product.activo ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {product.activo ? "Activo" : "Inactivo"}
                          </Badge>
                          {product.canjeable && (
                            <Badge variant="outline" className="text-xs">
                              Canjeable
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-primary">
                            ${product.precio.toLocaleString("es-CL")}
                          </p>
                          <p className="text-xs text-muted-foreground">precio</p>
                        </div>
                      </div>

                      {/* Stock and points */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Stock:</span>
                          <Badge
                            variant={product.stock <= 5 ? "destructive" : "secondary"}
                            className="text-xs font-mono"
                          >
                            {product.stock}
                          </Badge>
                        </div>
                        {product.puntos && (
                          <div className="flex items-center gap-1 text-primary">
                            <Award className="w-3 h-3" />
                            <span className="text-xs font-semibold">{product.puntos} pts</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Mobile Pagination */}
              {Math.ceil(filteredProducts.length / MOBILE_ITEMS_PER_PAGE) > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Página {mobilePage} de {Math.ceil(filteredProducts.length / MOBILE_ITEMS_PER_PAGE)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMobilePage(prev => Math.max(1, prev - 1))}
                      disabled={mobilePage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMobilePage(prev => Math.min(Math.ceil(filteredProducts.length / MOBILE_ITEMS_PER_PAGE), prev + 1))}
                      disabled={mobilePage === Math.ceil(filteredProducts.length / MOBILE_ITEMS_PER_PAGE)}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <p className="text-sm">No se encontraron productos</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          Mostrando {filteredProducts.length} de {products.length} productos ({activeProductsCount} activos)
        </div>
      </Card>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      <ProductDetailModal
        product={selectedProduct}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de {productToDelete && productToDelete.activo ? 'desactivar' : 'reactivar'} este producto?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {productToDelete && productToDelete.activo ? (
                <>
                  El producto <strong>{productToDelete.nombre}</strong> con código{" "}
                  <strong>{productToDelete.codigo}</strong> será marcado como inactivo y no estará disponible para la venta. Puedes reactivarlo posteriormente desde esta misma vista.
                </>
              ) : productToDelete ? (
                <>
                  El producto <strong>{productToDelete.nombre}</strong> con código{" "}
                  <strong>{productToDelete.codigo}</strong> será reactivado y volverá a estar disponible para la venta.
                </>
              ) : (
                <>Cargando...</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmToggleProductStatus}
              className={`${productToDelete && productToDelete.activo ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-green-600 text-white hover:bg-green-700'}`}
            >
              {productToDelete && productToDelete.activo ? 'Desactivar' : 'Reactivar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Productos;
