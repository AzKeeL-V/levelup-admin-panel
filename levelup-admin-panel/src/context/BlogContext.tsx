import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { BlogItem } from "@/types/BlogItem";
import { BlogRepository } from "@/repositories/BlogRepository";

interface BlogContextType {
  blogItems: BlogItem[];
  loading: boolean;
  error: string | null;
  addBlogItem: (item: Omit<BlogItem, "id">) => Promise<void>;
  updateBlogItem: (id: string, item: Partial<BlogItem>) => Promise<void>;
  deleteBlogItem: (id: string) => Promise<void>;
  getBlogStats: () => Promise<{
    totalItems: number;
    videos: number;
    notas: number;
    eventos: number;
    activos: number;
    finalizados: number;
    programados: number;
    totalPuntos: number;
  }>;
  refreshBlogItems: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [blogItems, setBlogItems] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBlogItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await BlogRepository.findAll();
      setBlogItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar elementos del blog");
      console.error("Error loading blog items:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogItems();
  }, [loadBlogItems]);

  const addBlogItem = useCallback(async (item: Omit<BlogItem, "id">) => {
    try {
      setError(null);
      await BlogRepository.create(item);
      await loadBlogItems(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear elemento del blog";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadBlogItems]);

  const updateBlogItem = useCallback(async (id: string, itemData: Partial<BlogItem>) => {
    try {
      setError(null);
      await BlogRepository.update(id, itemData);
      await loadBlogItems(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar elemento del blog";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadBlogItems]);

  const deleteBlogItem = useCallback(async (id: string) => {
    try {
      setError(null);
      await BlogRepository.delete(id);
      await loadBlogItems(); // Recargar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar elemento del blog";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loadBlogItems]);

  const getBlogStats = useCallback(async () => {
    try {
      return await BlogRepository.getStats();
    } catch (err) {
      console.error("Error getting blog stats:", err);
      throw err;
    }
  }, []);

  const refreshBlogItems = useCallback(async () => {
    await loadBlogItems();
  }, [loadBlogItems]);

  return (
    <BlogContext.Provider
      value={{
        blogItems,
        loading,
        error,
        addBlogItem,
        updateBlogItem,
        deleteBlogItem,
        getBlogStats,
        refreshBlogItems,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};
