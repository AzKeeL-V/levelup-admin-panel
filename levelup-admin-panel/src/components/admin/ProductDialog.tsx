import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/Product";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";


interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (product: Product) => Promise<void>;
  categories?: string[];
}

export const ProductDialog = ({ open, onOpenChange, product, onSave, categories = [] }: ProductDialogProps) => {
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
  });

  const [imagePreview, setImagePreview] = useState<string>("/placeholder.svg");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (product) {
      // Si el producto no tiene código (legacy), usamos su ID
      const suggestedCode = product.codigo || (product.id ? product.id.toString() : "");

      setFormData({
        ...product,
        codigo: suggestedCode,
        categoria: product.categoria || "",
        marca: product.marca || "",
        nombre: product.nombre || "",
        descripcion: product.descripcion || "",
        precio: product.precio || 0,
        stock: product.stock || 0,
        puntos: product.puntos || 0,
        imagen: product.imagen || "/placeholder.svg",
        activo: product.activo !== undefined ? product.activo : true,
        canjeable: product.canjeable || false,
      });
      setImagePreview(product.imagen || "/placeholder.svg");
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
      });
      setImagePreview("/placeholder.svg");
    }
  }, [product, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    console.log("[ProductDialog] Uploading image:", file.name);
    setIsUploadingImage(true);

    try {
      // Crear FormData para enviar el archivo
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      // Subir imagen al backend
      const response = await fetch('http://localhost:8080/api/upload/product-image', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al subir la imagen');
      }

      const data = await response.json();
      console.log("[ProductDialog] Upload successful:", data);

      // Crear preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Guardar la URL retornada por el backend
      setFormData(prev => ({ ...prev, imagen: data.url }));

      toast.success("Imagen subida exitosamente");
    } catch (error) {
      console.error("[ProductDialog] Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Error al subir la imagen");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones detalladas
    if (!formData.codigo) {
      toast.error("El campo 'Código' es obligatorio");
      return;
    }
    if (!formData.nombre) {
      toast.error("El campo 'Nombre' es obligatorio");
      return;
    }
    if (!formData.marca) {
      toast.error("El campo 'Marca' es obligatorio");
      return;
    }
    if (!formData.categoria) {
      toast.error("El campo 'Categoría' es obligatorio");
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
                    disabled={isUploadingImage}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploadingImage ? "Subiendo..." : "Subir Imagen"}
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
