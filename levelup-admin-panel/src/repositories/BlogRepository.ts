import { BlogItem } from "@/types/BlogItem";
import axiosInstance from "@/utils/axiosInstance"; // Usa la instancia de axios para backend

export class BlogRepository {
  private static readonly STORAGE_KEY = "levelup_blog_items";

  private static async getItems(): Promise<BlogItem[]> {
    try {
      // 1. Cargar datos de localStorage
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const localItems: BlogItem[] = stored ? JSON.parse(stored) : [];

      // 2. Cargar Eventos (levelup_blogs.json)
      let jsonEvents: BlogItem[] = [];
      if (typeof fetch !== 'undefined') {
        try {
          const response = await fetch('/levelup_blogs.json');
          if (response.ok) {
            jsonEvents = await response.json();
          }
        } catch (e) {
          console.error("Error cargando JSON de eventos:", e);
        }
      }

      // 3. Cargar Noticias (levelup_news.json)
      let jsonNews: BlogItem[] = [];
      if (typeof fetch !== 'undefined') {
        try {
          const response = await fetch('/levelup_news.json');
          if (response.ok) {
            jsonNews = await response.json();
          }
        } catch (e) {
          console.error("Error cargando JSON de noticias:", e);
        }
      }

      // 4. Merge inteligente
      // Crear un mapa con los items locales para acceso rápido
      const itemsMap = new Map(localItems.map(item => [item.id, item]));

      // Actualizar o agregar eventos del JSON
      jsonEvents.forEach(item => {
        // Si existe, actualizamos con los datos del JSON (prioridad al JSON para asegurar que se vean los cambios)
        // Pero podríamos querer preservar ciertos campos si el usuario editó...
        // Para este caso, asumiremos que el JSON manda para estos IDs específicos.
        itemsMap.set(item.id, { ...itemsMap.get(item.id), ...item });
      });

      // Actualizar o agregar noticias del JSON
      jsonNews.forEach(item => {
        itemsMap.set(item.id, { ...itemsMap.get(item.id), ...item });
      });

      const mergedItems = Array.from(itemsMap.values());

      // 5. Guardar fusión
      this.saveItems(mergedItems);

      return mergedItems;
    } catch (error) {
      console.error("Error al cargar elementos del blog:", error);
      // Fallback a datos iniciales si falla la carga
      const defaultItems: BlogItem[] = [
        {
          id: "1",
          tipo: "evento",
          titulo: "Torneo de Gaming Mensual",
          descripcion: "Participa en nuestro torneo mensual y gana puntos Level Up",
          fecha: "2025-11-15",
          puntos: 500,
          estado: "activo",
          direccion: "Av. Siempre Viva 123, Springfield"
        }
      ];
      this.saveItems(defaultItems);
      return defaultItems;
    }
  }

  private static saveItems(items: BlogItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error al guardar elementos del blog:", error);
      throw new Error("Error al guardar los elementos del blog");
    }
  }

  static async findAll(): Promise<BlogItem[]> {
    try {
      // Si existe backend, usa axios. Si no, usa localStorage o JSON local.
      try {
        const response = await axiosInstance.get('/blogs');
        return response.data;
      } catch (err) {
        // Si falla axios (no hay backend), usa localStorage o JSON local
      }
      return await this.getItems();
    } catch (error) {
      console.error("Error al cargar elementos del blog:", error);
      // Fallback a datos iniciales si falla la carga
      const defaultItems: BlogItem[] = [
        {
          id: "1",
          tipo: "evento",
          titulo: "Torneo de Gaming Mensual",
          descripcion: "Participa en nuestro torneo mensual y gana puntos Level Up",
          fecha: "2025-11-15",
          puntos: 500,
          estado: "activo",
          direccion: "Av. Siempre Viva 123, Springfield"
        },
        {
          id: "2",
          tipo: "video",
          titulo: "Review: Nuevo Mouse Logitech G Pro X",
          descripcion: "Análisis completo del último lanzamiento de Logitech",
          fecha: "2025-10-20",
          estado: "activo",
        },
        {
          id: "3",
          tipo: "nota",
          titulo: "Guía: Cómo elegir tu primer setup gaming",
          descripcion: "Tips y recomendaciones para armar tu setup ideal",
          fecha: "2025-10-18",
          estado: "activo",
        },
        {
          id: "4",
          tipo: "evento",
          titulo: "Webinar: Tendencias Tech 2025",
          descripcion: "Expertos hablan sobre las tendencias tecnológicas del año",
          fecha: "2025-10-10",
          puntos: 300,
          estado: "finalizado",
          direccion: "Online"
        },
        {
          id: "5",
          tipo: "evento",
          titulo: "Black Friday LevelUp",
          descripcion: "Evento especial con descuentos y puntos dobles",
          fecha: "2025-11-29",
          puntos: 1000,
          estado: "programado",
          direccion: "Centro Comercial LevelUp, Ciudad Gótica"
        },
      ];
      this.saveItems(defaultItems);
      return defaultItems;
    }
  }

  static async findById(id: string): Promise<BlogItem | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const items = await this.getItems();
    return items.find(item => item.id === id) || null;
  }

  static async create(item: Omit<BlogItem, "id">): Promise<BlogItem> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const items = await this.getItems();

    const newItem: BlogItem = {
      ...item,
      id: Date.now().toString(),
    };

    items.push(newItem);
    this.saveItems(items);
    return newItem;
  }

  static async update(id: string, itemData: Partial<BlogItem>): Promise<BlogItem> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const items = await this.getItems();
    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
      throw new Error("Elemento del blog no encontrado");
    }

    items[index] = { ...items[index], ...itemData };
    this.saveItems(items);
    return items[index];
  }

  static async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const items = await this.getItems();
    const filteredItems = items.filter(item => item.id !== id);

    if (filteredItems.length === items.length) {
      throw new Error("Elemento del blog no encontrado");
    }

    this.saveItems(filteredItems);
  }

  static async findByCategory(categoria: string): Promise<BlogItem[]> {
    const items = await this.getItems();
    return items.filter(item => item.tipo === categoria);
  }

  static async search(query: string): Promise<BlogItem[]> {
    const items = await this.getItems();
    const lowerQuery = query.toLowerCase();
    return items.filter(item =>
      item.titulo.toLowerCase().includes(lowerQuery) ||
      item.descripcion.toLowerCase().includes(lowerQuery)
    );
  }

  static async getStats(): Promise<{
    totalItems: number;
    videos: number;
    notas: number;
    eventos: number;
    activos: number;
    finalizados: number;
    programados: number;
    totalPuntos: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const items = await this.getItems();

    return {
      totalItems: items.length,
      videos: items.filter(i => i.tipo === "video").length,
      notas: items.filter(i => i.tipo === "nota").length,
      eventos: items.filter(i => i.tipo === "evento").length,
      activos: items.filter(i => i.estado === "activo").length,
      finalizados: items.filter(i => i.estado === "finalizado").length,
      programados: items.filter(i => i.estado === "programado").length,
      totalPuntos: items.reduce((sum, item) => sum + (item.puntos || 0), 0),
    };
  }
}
