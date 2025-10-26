import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Edit, Trash2, Award } from "lucide-react";
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
import { toast } from "sonner";

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

const Productos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [products, setProducts] = useState<Product[]>([
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
  ]);

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteProduct = (codigo: string) => {
    setProducts(products.filter(p => p.codigo !== codigo));
    toast.success("Producto eliminado correctamente");
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      // Editar producto existente
      setProducts(products.map(p => p.codigo === editingProduct.codigo ? product : p));
      toast.success("Producto actualizado correctamente");
    } else {
      // Agregar nuevo producto
      setProducts([...products, product]);
      toast.success("Producto agregado correctamente");
    }
    setDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Productos</h1>
          <p className="text-muted-foreground">Gestiona el catálogo de productos</p>
        </div>
        <Button 
          onClick={handleAddProduct}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <Card className="p-6 bg-card border-border">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos por nombre, marca, código o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <Button variant="outline" className="border-border">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead>Imagen</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Puntos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.codigo} className="hover:bg-secondary/30">
                  <TableCell>
                    <img 
                      src={product.imagen} 
                      alt={product.nombre}
                      className="w-12 h-12 object-cover rounded-lg border border-border"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-primary">{product.codigo}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-accent/50 text-accent">
                      {product.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{product.marca}</TableCell>
                  <TableCell className="font-semibold">{product.nombre}</TableCell>
                  <TableCell className="font-semibold">
                    ${product.precio.toLocaleString("es-CL")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.stock < 10 ? "destructive" : "secondary"}
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
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-border"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-border hover:border-destructive hover:text-destructive"
                        onClick={() => handleDeleteProduct(product.codigo)}
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

        <div className="mt-4 text-sm text-muted-foreground">
          Mostrando {filteredProducts.length} de {products.length} productos
        </div>
      </Card>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default Productos;
