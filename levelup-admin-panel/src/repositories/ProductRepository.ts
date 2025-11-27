import { Product } from "@/types/Product";
import axiosInstance from "@/utils/axiosInstance";

export class ProductRepository {
  private static readonly STORAGE_KEY = 'levelup_products';
  private static readonly INITIAL_PRODUCTS: Product[] = [
    {
      codigo: "JM001",
      categoria: "Juegos de Mesa",
      marca: "Catan",
      nombre: "Catan",
      descripcion: "Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores y perfecto para noches de juego en familia o con amigos.",
      precio: 29990,
      stock: 15,
      puntos: 150,
      imagen: "/images/products/catan.jpg",
      activo: true,
      canjeable: true,
    },
    {
      codigo: "JM002",
      categoria: "Juegos de Mesa",
      marca: "Carcassonne",
      nombre: "Carcassonne",
      descripcion: "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores y fácil de aprender.",
      precio: 24990,
      stock: 23,
      puntos: 125,
      imagen: "/images/products/carcassonne.jpg",
      activo: true,
      canjeable: true,
    },
    {
      codigo: "AC001",
      categoria: "Accesorios",
      marca: "Microsoft",
      nombre: "Controlador Inalámbrico Xbox Series X",
      descripcion: "Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada. Compatible con consolas Xbox y PC.",
      precio: 59990,
      stock: 8,
      puntos: 300,
      imagen: "/images/products/xbox-controller.jpg",
      activo: true,
      canjeable: true,
    },
    {
      codigo: "AC002",
      categoria: "Accesorios",
      marca: "HyperX",
      nombre: "Auriculares Gamer HyperX Cloud II",
      descripcion: "Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica para mayor comodidad durante largas sesiones de juego.",
      precio: 79990,
      stock: 34,
      puntos: 400,
      imagen: "/images/products/hyperx-cloud2.jpg",
      activo: true,
      canjeable: true,
    },
    {
      codigo: "CO001",
      categoria: "Consolas",
      marca: "Sony",
      nombre: "PlayStation 5",
      descripcion: "La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia de juego inmersiva.",
      precio: 549990,
      stock: 5,
      puntos: 2750,
      imagen: "/images/products/ps5.jpg",
      activo: true,
      canjeable: false,
    },
    {
      codigo: "CG001",
      categoria: "Computadores Gamers",
      marca: "ASUS",
      nombre: "PC Gamer ASUS ROG Strix",
      descripcion: "Un potente equipo diseñado para los gamers más exigentes, equipado con los últimos componentes para ofrecer un rendimiento excepcional en cualquier juego.",
      precio: 1299990,
      stock: 3,
      puntos: 6500,
      imagen: "/images/products/asus-rog.jpg",
      activo: true,
      canjeable: false,
    },
    {
      codigo: "SG001",
      categoria: "Sillas Gamers",
      marca: "Secretlab",
      nombre: "Silla Gamer Secretlab Titan",
      descripcion: "Diseñada para el máximo confort, esta silla ofrece un soporte ergonómico y personalización ajustable para sesiones de juego prolongadas.",
      precio: 349990,
      stock: 12,
      puntos: 1750,
      imagen: "/images/products/secretlab-titan.jpg",
      activo: true,
      canjeable: true,
    },
    {
      codigo: "MS001",
      categoria: "Mouse",
      marca: "Logitech",
      nombre: "Mouse Gamer Logitech G502 HERO",
      descripcion: "Con sensor de alta precisión y botones personalizables, este mouse es ideal para gamers que buscan un control preciso y personalización.",
      precio: 49990,
      stock: 45,
      puntos: 250,
      imagen: "/images/products/logitech-g502.jpg",
      activo: true,
      canjeable: true,
    },
    {
      codigo: "MP001",
      categoria: "Mousepad",
      marca: "Razer",
      nombre: "Mousepad Razer Goliathus Extended Chroma",
      descripcion: "Ofrece un área de juego amplia con iluminación RGB personalizable, asegurando una superficie suave y uniforme para el movimiento del mouse.",
      precio: 29990,
      stock: 28,
      puntos: 150,
      imagen: "/images/products/razer-goliathus.jpg",
      activo: true,
      canjeable: true,
    },
    {
      codigo: "PP001",
      categoria: "Poleras Personalizadas",
      marca: "Level-Up",
      nombre: "Polera Gamer Personalizada '''Level-Up'''",
      descripcion: "Una camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o diseño favorito.",
      precio: 14990,
      stock: 67,
      puntos: 75,
      imagen: "/images/products/polera-levelup.jpg",
      activo: true,
      canjeable: true,
    },
  ];

  private static async getProductsFromStorage(): Promise<Product[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      // Fallback to JSON file if local storage is empty or invalid
      if (typeof fetch !== 'undefined') {
        try {
          const response = await fetch('/levelup_products.json');
          if (response.ok) {
            const products = await response.json();
            if (Array.isArray(products)) {
              this.saveAll(products);
              return products;
            }
          }
        } catch (e) {
          console.warn("Could not load products from JSON", e);
        }
      }
      return [];
    } catch (error) {
      console.error("Error getting products from storage:", error);
      return this.INITIAL_PRODUCTS;
    }
  }

  private static saveAll(products: Product[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
  }

  static async findAll(): Promise<Product[]> {
    try {
      // Try backend first
      const response = await axiosInstance.get('/products');
      return response.data;
    } catch (err) {
      console.warn("Backend unreachable, falling back to local storage for read");
      const products = await this.getProductsFromStorage();
      if (products.length === 0) {
        return this.INITIAL_PRODUCTS;
      }
      return products;
    }
  }

  static async findById(codigo: string): Promise<Product | null> {
    const products = await this.findAll();
    return products.find((p) => p.codigo === codigo) || null;
  }

  static async create(product: Product): Promise<Product> {
    try {
      const response = await axiosInstance.post('/products', product);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  static async update(codigo: string, product: Product): Promise<Product> {
    try {
      // Backend expects ID for update. We assume product has 'id' if it came from backend.
      // If not, we might fail.
      const id = (product as any).id;
      if (!id) {
        throw new Error("Cannot update product without ID");
      }
      const response = await axiosInstance.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  static async updateStock(codigo: string, quantity: number): Promise<void> {
    console.warn("updateStock not implemented in backend yet");
  }

  static async delete(codigo: string): Promise<void> {
    try {
      const products = await this.findAll();
      const product = products.find(p => p.codigo === codigo);
      if (product && (product as any).id) {
        await axiosInstance.delete(`/products/${(product as any).id}`);
      } else {
        throw new Error("Product not found or missing ID");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  static async findByCategory(categoria: string): Promise<Product[]> {
    const products = await this.findAll();
    return products.filter(product => product.categoria === categoria);
  }

  static async search(query: string): Promise<Product[]> {
    const products = await this.findAll();
    const lowerQuery = query.toLowerCase();
    return products.filter(product =>
      product.nombre.toLowerCase().includes(lowerQuery) ||
      product.descripcion.toLowerCase().includes(lowerQuery) ||
      product.marca.toLowerCase().includes(lowerQuery)
    );
  }

  static async reset(): Promise<void> {
    await this.saveAll(this.INITIAL_PRODUCTS);
  }
}