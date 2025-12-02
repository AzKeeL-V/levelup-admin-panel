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
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex flex-wrap items-center gap-2 sm:text-lg md:text-xl">
            Detalles del Pedido
            <Badge className={getEstadoColor(order.estado)}>
              {getEstadoIcon(order.estado)}
              <span className="ml-1 capitalize">{order.estado}</span>
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Información básica del pedido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h4 className="font-medium text-[10px] text-muted-foreground mb-1 sm:text-xs md:text-sm">NÚMERO DE ORDEN</h4>
                <p className="font-mono text-sm font-semibold sm:text-base md:text-lg">{order.numeroOrden}</p>
              </div>

              <div>
                <h4 className="font-medium text-[10px] text-muted-foreground mb-1 sm:text-xs md:text-sm">FECHA DE CREACIÓN</h4>
                <p className="text-xs sm:text-sm">
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
                <h4 className="font-medium text-[10px] text-muted-foreground mb-1 sm:text-xs md:text-sm">ÚLTIMA ACTUALIZACIÓN</h4>
                <p className="text-xs sm:text-sm">
                  {order.fechaActualizacion ? new Date(order.fechaActualizacion).toLocaleDateString("es-CL", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : "No disponible"}
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <h4 className="font-medium text-[10px] text-muted-foreground mb-1 sm:text-xs md:text-sm">CLIENTE</h4>
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-muted-foreground sm:w-4 sm:h-4" />
                  <p className="text-xs sm:text-sm">{order.userEmail}</p>
                </div>
                <p className="text-xs font-medium mt-1 sm:text-sm">{order.userName}</p>
              </div>

              <div>
                <h4 className="font-medium text-[10px] text-muted-foreground mb-1 sm:text-xs md:text-sm">MÉTODO DE PAGO</h4>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-3 h-3 text-muted-foreground sm:w-4 sm:h-4" />
                  <p className="text-xs capitalize sm:text-sm">{order.metodoPago}</p>
                </div>
              </div>

              {order.notas && (
                <div>
                  <h4 className="font-medium text-[10px] text-muted-foreground mb-1 sm:text-xs md:text-sm">NOTAS</h4>
                  <p className="text-xs sm:text-sm">{order.notas}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Productos del pedido */}
          <div>
            <h4 className="font-medium text-[10px] text-muted-foreground mb-2 sm:text-xs sm:mb-3 md:text-sm">PRODUCTOS ({order.items.length})</h4>
            <div className="space-y-2 sm:space-y-3">
              {order.items.map((item) => (
                <Card key={item.id} className="border-border">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                      <div className="flex-shrink-0 self-center sm:self-start">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded-lg border border-border sm:w-14 sm:h-14 md:w-16 md:h-16"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-xs mb-1 sm:text-sm">{item.productName}</h5>
                        <div className="flex flex-col gap-1 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:gap-3 sm:text-xs md:text-sm">
                          <span>Cantidad: {item.quantity || 0}</span>
                          <span>Precio unitario: ${(item.unitPrice || 0).toLocaleString("es-CL")}</span>
                          <span className="font-semibold text-foreground">
                            Total: ${(item.totalPrice || 0).toLocaleString("es-CL")}
                          </span>
                        </div>
                        {!!item.puntosGanados && item.puntosGanados > 0 && (
                          <p className="text-[10px] text-green-600 mt-1 sm:text-xs md:text-sm">
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
              <CardTitle className="text-sm sm:text-base md:text-lg">Resumen de Costos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${order.subtotal.toLocaleString("es-CL")}</span>
              </div>
              {order.descuentoDuoc > 0 && (
                <div className="flex justify-between text-green-600 text-xs sm:text-sm">
                  <span>Descuento Duoc:</span>
                  <span>-${order.descuentoDuoc.toLocaleString("es-CL")}</span>
                </div>
              )}
              {order.descuentoPuntos > 0 && (
                <div className="flex justify-between text-green-600 text-xs sm:text-sm">
                  <span>Descuento Puntos:</span>
                  <span>-${order.descuentoPuntos.toLocaleString("es-CL")}</span>
                </div>
              )}
              {order.puntosUsados > 0 && (
                <div className="flex justify-between text-red-600 text-xs sm:text-sm">
                  <span>Puntos usados:</span>
                  <span>-{order.puntosUsados} pts</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-sm font-semibold sm:text-base md:text-lg">
                <span>Total:</span>
                <span className="text-primary">${order.total.toLocaleString("es-CL")}</span>
              </div>
              <div className="flex justify-between text-green-600 text-xs sm:text-sm">
                <span>Puntos ganados:</span>
                <span>+{order.puntosGanados} pts</span>
              </div>
            </CardContent>
          </Card>

          {/* Información de envío */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 sm:text-base md:text-lg">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                Información de Envío
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="font-medium text-xs sm:text-sm">{order.direccionEnvio.nombre}</p>
                  <p className="text-[10px] text-muted-foreground sm:text-xs md:text-sm">
                    {order.direccionEnvio.calle} {order.direccionEnvio.numero}
                    {order.direccionEnvio.apartamento && `, ${order.direccionEnvio.apartamento}`}
                  </p>
                  <p className="text-[10px] text-muted-foreground sm:text-xs md:text-sm">
                    {order.direccionEnvio.ciudad}, {order.direccionEnvio.region}
                  </p>
                  <p className="text-[10px] text-muted-foreground sm:text-xs md:text-sm">
                    Chile
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-muted-foreground sm:w-4 sm:h-4" />
                    <p className="text-[10px] sm:text-xs md:text-sm">{order.direccionEnvio.telefono}</p>
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
