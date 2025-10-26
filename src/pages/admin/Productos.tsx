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

interface Product {
  codigo: string;
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
  
  const products: Product[] = [
    {
      codigo: "PROD-001",
      marca: "Razer",
      nombre: "Teclado Mecánico RGB",
      descripcion: "Teclado mecánico con switches Cherry MX",
      precio: 89990,
      stock: 15,
      puntos: 450,
      imagen: "/placeholder.svg",
    },
    {
      codigo: "PROD-002",
      marca: "Logitech",
      nombre: "Mouse Gamer Pro",
      descripcion: "Mouse inalámbrico con sensor HERO 25K",
      precio: 69990,
      stock: 23,
      puntos: 350,
      imagen: "/placeholder.svg",
    },
    {
      codigo: "PROD-003",
      marca: "ASUS",
      nombre: "Monitor 27'' 144Hz",
      descripcion: "Monitor gaming IPS con HDR",
      precio: 249990,
      stock: 8,
      puntos: 1250,
      imagen: "/placeholder.svg",
    },
    {
      codigo: "PROD-004",
      marca: "HyperX",
      nombre: "Auriculares Cloud II",
      descripcion: "Auriculares gaming con sonido 7.1",
      precio: 59990,
      stock: 34,
      puntos: 300,
      imagen: "/placeholder.svg",
    },
    {
      codigo: "PROD-005",
      marca: "Corsair",
      nombre: "Silla Gamer RGB",
      descripcion: "Silla ergonómica con iluminación RGB",
      precio: 189990,
      stock: 12,
      imagen: "/placeholder.svg",
    },
  ];

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Productos</h1>
          <p className="text-muted-foreground">Gestiona el catálogo de productos</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <Card className="p-6 bg-card border-border">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos por nombre, marca o código..."
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
                <TableHead>Código</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Puntos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.codigo} className="hover:bg-secondary/30">
                  <TableCell className="font-mono text-primary">{product.codigo}</TableCell>
                  <TableCell className="font-medium">{product.marca}</TableCell>
                  <TableCell>{product.nombre}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {product.descripcion}
                  </TableCell>
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
                      <Button size="sm" variant="outline" className="border-border">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-border hover:border-destructive hover:text-destructive">
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
    </div>
  );
};

export default Productos;
