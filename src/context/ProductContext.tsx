import { createContext, useContext, useState, ReactNode } from "react";

export interface Product {
  codigo: string;
  categoria: string;
  marca: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  puntos?: number;
  imagen: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (codigo: string, product: Product) => void;
  deleteProduct: (codigo: string) => void;
  getTotalInventoryValue: () => number;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialProducts: Product[] = [
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
  },
  {
    codigo: "PP001",
    categoria: "Poleras Personalizadas",
    marca: "Level-Up",
    nombre: "Polera Gamer Personalizada 'Level-Up'",
    descripcion: "Una camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o diseño favorito.",
    precio: 14990,
    stock: 67,
    puntos: 75,
    imagen: "/images/products/polera-levelup.jpg",
  },
];

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const updateProduct = (codigo: string, product: Product) => {
    setProducts(products.map((p) => (p.codigo === codigo ? product : p)));
  };

  const deleteProduct = (codigo: string) => {
    setProducts(products.filter((p) => p.codigo !== codigo));
  };

  const getTotalInventoryValue = () => {
    return products.reduce((total, product) => {
      return total + product.precio * product.stock;
    }, 0);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getTotalInventoryValue,
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
