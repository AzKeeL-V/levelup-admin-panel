import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { ProductRepository } from "@/repositories/ProductRepository";
import { Product } from "@/types/Product";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (codigo: string, product: Product) => Promise<void>;
  deactivateProduct: (codigo: string) => Promise<void>;
  getTotalInventoryValue: () => number;
  getTotalStock: () => number;
  getActiveProductsCount: () => number;
  refreshProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("ProductContext.loadProducts: Iniciando carga de productos");
      let loadedProducts = await ProductRepository.findAll();
      console.log("ProductContext.loadProducts: Productos cargados en contexto:", loadedProducts.length, loadedProducts);

      // Si no hay productos activos, resetear a productos iniciales
      const activeProducts = loadedProducts.filter(p => p.activo);
      if (activeProducts.length === 0) {
        console.log("ProductContext.loadProducts: No hay productos activos, reseteando productos iniciales");
        await ProductRepository.reset();
        loadedProducts = await ProductRepository.findAll();
        console.log("ProductContext.loadProducts: Productos reseteados:", loadedProducts.length, loadedProducts);
      }

      setProducts(loadedProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar productos';
      setError(errorMessage);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar productos al inicializar
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addProduct = useCallback(async (product: Product) => {
    try {
      setError(null);
      await ProductRepository.create(product);
      await loadProducts(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear producto';
      setError(errorMessage);
      throw err;
    }
  }, [loadProducts]);

  const updateProduct = useCallback(async (codigo: string, product: Product) => {
    try {
      setError(null);
      await ProductRepository.update(codigo, product);
      await loadProducts(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar producto';
      setError(errorMessage);
      throw err;
    }
  }, [loadProducts]);

  const deactivateProduct = useCallback(async (codigo: string) => {
    try {
      setError(null);
      const product = products.find(p => p.codigo === codigo);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      const updatedProduct = { ...product, activo: false };
      ProductRepository.update(codigo, updatedProduct);
      await loadProducts(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al desactivar producto';
      setError(errorMessage);
      throw err;
    }
  }, [loadProducts, products]);

  const getTotalInventoryValue = useCallback(() => {
    return products
      .filter(product => product.activo)
      .reduce((total, product) => {
        return total + product.precio * product.stock;
      }, 0);
  }, [products]);

  const getTotalStock = useCallback(() => {
    return products
      .filter(product => product.activo)
      .reduce((total, product) => total + product.stock, 0);
  }, [products]);

  const getActiveProductsCount = useCallback(() => {
    return products.filter(product => product.activo).length;
  }, [products]);

  const refreshProducts = useCallback(async () => {
    await loadProducts();
  }, [loadProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deactivateProduct,
        getTotalInventoryValue,
        getTotalStock,
        getActiveProductsCount,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
