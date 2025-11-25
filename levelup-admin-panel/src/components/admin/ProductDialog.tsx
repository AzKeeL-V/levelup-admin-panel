import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/Product";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (product: Product) => Promise<void>;
}

export const ProductDialog = ({ open, onOpenChange, product, onSave }: ProductDialogProps) => {
  const [formData, setFormData] = useState<Product>({
    codigo: "",
    categoria: "",
    marca: "",
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    puntos: 0,
    imagen: "/placeholder.svg",
    activo: true,
    canjeable: false,
    origen: "tienda",
  });

  const [imagePreview, setImagePreview] = useState<string>("/placeholder.svg");

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImagePreview(product.imagen);
    } else {
      setFormData({
        codigo: "",
        categoria: "",
        marca: "",
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        puntos: 0,
        imagen: "/placeholder.svg",
        activo: true,
        canjeable: false,
        origen: "tienda",
      });
      setImagePreview("/placeholder.svg");
    }
  }, [product, open]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor selecciona un archivo de imagen válido");
        return;
      }

      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no puede superar los 5MB");
        return;
      }

      // Crear URL de preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);

        // En producción, aquí subirías la imagen a un servidor
        // Por ahora, guardamos una ruta simulada
        const imagePath = `/images/products/${file.name}`;
        setFormData({ ...formData, imagen: imagePath });

        toast.success("Imagen cargada (en producción se subiría al servidor)");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.codigo || !formData.nombre || !formData.marca || !formData.categoria) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    if (formData.precio <= 0) {
      toast.error("El precio debe ser mayor a 0");
      return;
    }

    if (formData.stock < 0) {
      toast.error("El stock no puede ser negativo");
      return;
    }

    if (formData.canjeable && (!formData.puntos || formData.puntos <= 0)) {
      toast.error("Si el producto es canjeable, debes especificar los puntos requeridos");
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error("Error al guardar el producto");
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {product ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Imagen */}
          <div className="space-y-2">
            <Label>Imagen del Producto</Label>
            <div className="flex items-start gap-4">
              <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg overflow-hidden bg-secondary/30 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-border"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Imagen
                  </Button>
                  {imagePreview !== "/placeholder.svg" && (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setImagePreview("/placeholder.svg");
                        setFormData({ ...formData, imagen: "/placeholder.svg" });
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <p className="text-xs text-muted-foreground">
                  Las imágenes se guardarán en: <code className="text-primary">public/images/products/</code>
                </p>
                <p className="text-xs text-muted-foreground">
                  Formatos: JPG, PNG, WEBP (máx. 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Información básica */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                placeholder="Ej: JM001"
                className="bg-secondary border-border font-mono"
                disabled={!!product}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría *</Label>
              <Input
                id="categoria"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                placeholder="Ej: Juegos de Mesa"
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marca">Marca *</Label>
              <Input
                id="marca"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                placeholder="Ej: Razer"
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Producto *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Teclado Mecánico RGB"
                className="bg-secondary border-border"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe el producto..."
              className="bg-secondary border-border min-h-[100px]"
            />
          </div>

          {/* Precio, Stock y Puntos */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio (CLP) *</Label>
              <Input
                id="precio"
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: parseInt(e.target.value) || 0 })}
                placeholder="29990"
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                placeholder="10"
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="puntos">Puntos Level Up {formData.canjeable && <span className="text-destructive">*</span>}</Label>
              <Input
                id="puntos"
                type="number"
                value={formData.puntos || ""}
                onChange={(e) => setFormData({ ...formData, puntos: parseInt(e.target.value) || undefined })}
                placeholder="450"
                className="bg-secondary border-border"
                disabled={!formData.canjeable}
                required={formData.canjeable}
              />
            </div>
          </div>

          {/* Canjeable con puntos */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="canjeable"
                checked={formData.canjeable}
                onChange={(e) => setFormData({
                  ...formData,
                  canjeable: e.target.checked,
                  puntos: e.target.checked ? formData.puntos : undefined
                })}
                className="w-4 h-4 text-primary bg-secondary border-border rounded focus:ring-primary focus:ring-2"
              />
              <Label htmlFor="canjeable" className="text-sm font-medium">
                Disponible para canje con puntos Level Up
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Si marcas esta opción, podrás asignar puntos para que los usuarios puedan canjear este producto.
            </p>
          </div>

          {/* Origen del Producto */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Origen del Producto</Label>
            <RadioGroup
              value={formData.origen || "tienda"}
              onValueChange={(value) =>
                setFormData({ ...formData, origen: value as "tienda" | "recompensas" })
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tienda" id="tienda" />
                <Label htmlFor="tienda" className="text-sm font-normal cursor-pointer">
                  Tienda Regular (compra con dinero)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recompensas" id="recompensas" />
                <Label htmlFor="recompensas" className="text-sm font-normal cursor-pointer">
                  Tienda de Recompensas (canje por puntos)
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              Esto permite que el carrito identifique si el producto se compra con dinero o se canjea por puntos.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              {product ? "Guardar Cambios" : "Crear Producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
