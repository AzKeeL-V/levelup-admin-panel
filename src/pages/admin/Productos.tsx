import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Edit, Trash2, Award, DollarSign } from "lucide-react";
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
import { useProducts } from "@/context/ProductContext";

const Productos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const { products, addProduct, updateProduct, deleteProduct, getTotalInventoryValue } = useProducts();
  
  const totalInventoryValue = getTotalInventoryValue();

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

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteProduct = (codigo: string) => {
    deleteProduct(codigo);
    toast.success("Producto eliminado correctamente");
  };

  const handleSaveProduct = (product: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.codigo, product);
      toast.success("Producto actualizado correctamente");
    } else {
      addProduct(product);
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

      {/* Inventory Value Card */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-primary/20">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Valor Total del Inventario</p>
              <h3 className="text-4xl font-bold text-primary">
                ${totalInventoryValue.toLocaleString("es-CL")}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Basado en {products.length} productos únicos
              </p>
            </div>
          </div>
        </div>
      </Card>

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
                <TableHead>Valor Stock</TableHead>
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
                  <TableCell className="font-bold text-primary">
                    ${(product.precio * product.stock).toLocaleString("es-CL")}
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
