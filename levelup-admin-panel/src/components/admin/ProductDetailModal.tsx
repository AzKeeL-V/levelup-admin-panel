import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/Product";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductDetailModal = ({ product, open, onOpenChange }: ProductDetailModalProps) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Detalles del Producto</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imagen y información básica */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <img
                src={product.imagen}
                alt={product.nombre}
                className="w-32 h-32 object-cover rounded-lg border border-border"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold">{product.nombre}</h3>
              <p className="text-sm text-muted-foreground">{product.marca}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-accent/50 text-accent">
                  {product.categoria}
                </Badge>
                <Badge variant={product.activo ? "secondary" : "destructive"}>
                  {product.activo ? "Activo" : "Inactivo"}
                </Badge>
                {product.canjeable && (
                  <Badge variant="outline" className="text-xs">
                    Canjeable
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Información detallada */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">CÓDIGO</h4>
                <p className="font-mono text-sm">{product.codigo}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">PRECIO</h4>
                <p className="text-lg font-semibold text-primary">
                  ${product.precio.toLocaleString("es-CL")}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">STOCK</h4>
                <p className={`text-sm font-medium ${
                  product.stock <= 5 ? "text-destructive" : "text-foreground"
                }`}>
                  {product.stock} unidades
                </p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">VALOR TOTAL STOCK</h4>
                <p className="text-sm font-semibold">
                  ${(product.precio * product.stock).toLocaleString("es-CL")}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">PUNTOS</h4>
                {product.puntos ? (
                  <p className="text-sm font-semibold text-primary">
                    {product.puntos} puntos
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">No asignados</p>
                )}
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">DESCRIPCIÓN</h4>
                <p className="text-sm">{product.descripcion || "Sin descripción"}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">FECHA DE CREACIÓN</h4>
                <p className="text-sm">
                  {product.fechaCreacion ?
                    new Date(product.fechaCreacion).toLocaleDateString("es-CL") :
                    "No disponible"
                  }
                </p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">ÚLTIMA ACTUALIZACIÓN</h4>
                <p className="text-sm">
                  {product.fechaActualizacion ?
                    new Date(product.fechaActualizacion).toLocaleDateString("es-CL") :
                    "No disponible"
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Información adicional si existe */}
          {product.dimensiones && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">DIMENSIONES</h4>
                <p className="text-sm">{product.dimensiones}</p>
              </div>
            </>
          )}

          {product.material && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">MATERIAL</h4>
                <p className="text-sm">{product.material}</p>
              </div>
            </>
          )}

          {product.caracteristicas && product.caracteristicas.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">CARACTERÍSTICAS</h4>
                <ul className="text-sm space-y-1">
                  {product.caracteristicas.map((caracteristica, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{caracteristica}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
