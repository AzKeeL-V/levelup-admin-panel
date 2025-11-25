import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/Order";
import { Clock, Package, Truck, CheckCircle, XCircle, MapPin, CreditCard, Phone, Mail } from "lucide-react";

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailModal = ({ order, open, onOpenChange }: OrderDetailModalProps) => {
  if (!order) return null;

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Clock className="w-5 h-5" />;
      case "procesando":
        return <Package className="w-5 h-5" />;
      case "enviado":
        return <Truck className="w-5 h-5" />;
      case "entregado":
        return <CheckCircle className="w-5 h-5" />;
      case "cancelado":
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "procesando":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "enviado":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "entregado":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "cancelado":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-secondary";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Detalles del Pedido
            <Badge className={getEstadoColor(order.estado)}>
              {getEstadoIcon(order.estado)}
              <span className="ml-1 capitalize">{order.estado}</span>
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica del pedido */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">NÚMERO DE ORDEN</h4>
                <p className="font-mono text-lg font-semibold">{order.numeroOrden}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">FECHA DE CREACIÓN</h4>
                <p className="text-sm">
                  {new Date(order.fechaCreacion).toLocaleDateString("es-CL", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">ÚLTIMA ACTUALIZACIÓN</h4>
                <p className="text-sm">
                  {new Date(order.fechaActualizacion).toLocaleDateString("es-CL", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">CLIENTE</h4>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm">{order.userEmail}</p>
                </div>
                <p className="text-sm font-medium mt-1">{order.userName}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">MÉTODO DE PAGO</h4>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm capitalize">{order.metodoPago}</p>
                </div>
              </div>

              {order.notas && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">NOTAS</h4>
                  <p className="text-sm">{order.notas}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Productos del pedido */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-3">PRODUCTOS ({order.items.length})</h4>
            <div className="space-y-3">
              {order.items.map((item) => (
                <Card key={item.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-lg border border-border"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm mb-1">{item.productName}</h5>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Cantidad: {item.quantity}</span>
                          <span>Precio unitario: ${item.unitPrice.toLocaleString("es-CL")}</span>
                          <span className="font-semibold text-foreground">
                            Total: ${item.totalPrice.toLocaleString("es-CL")}
                          </span>
                        </div>
                        {item.puntosGanados && item.puntosGanados > 0 && (
                          <p className="text-sm text-green-600 mt-1">
                            +{item.puntosGanados} puntos ganados
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Resumen de costos */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Resumen de Costos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${order.subtotal.toLocaleString("es-CL")}</span>
              </div>
              {order.descuento > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento:</span>
                  <span>-${order.descuento.toLocaleString("es-CL")}</span>
                </div>
              )}
              {order.puntosUsados > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Puntos usados:</span>
                  <span>-{order.puntosUsados} pts</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary">${order.total.toLocaleString("es-CL")}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Puntos ganados:</span>
                <span>+{order.puntosGanados} pts</span>
              </div>
            </CardContent>
          </Card>

          {/* Información de envío */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Información de Envío
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">{order.direccionEnvio.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.direccionEnvio.calle} {order.direccionEnvio.numero}
                    {order.direccionEnvio.apartamento && `, ${order.direccionEnvio.apartamento}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.direccionEnvio.ciudad}, {order.direccionEnvio.region}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.direccionEnvio.pais} - {order.direccionEnvio.codigoPostal}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm">{order.direccionEnvio.telefono}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
