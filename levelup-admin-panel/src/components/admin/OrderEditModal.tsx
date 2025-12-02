import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/Order";
import { Clock, Package, Truck, CheckCircle, XCircle, AlertTriangle, Save, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface OrderEditModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (orderId: string, updates: Partial<Order>) => void;
}

const OrderEditModal = ({ order, open, onOpenChange, onSave }: OrderEditModalProps) => {
  const [selectedEstado, setSelectedEstado] = useState<string>("");
  const [notas, setNotas] = useState<string>("");

  useEffect(() => {
    if (order) {
      setSelectedEstado(order.estado);
      setNotas(order.notas || "");
    }
  }, [order]);

  if (!order) return null;

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Clock className="w-4 h-4" />;
      case "procesando":
        return <Package className="w-4 h-4" />;
      case "enviado":
        return <Truck className="w-4 h-4" />;
      case "entregado":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelado":
        return <XCircle className="w-4 h-4" />;
      case "rechazado":
        return <AlertTriangle className="w-4 h-4" />;
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
      case "rechazado":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-secondary";
    }
  };

  const handleSave = () => {
    const updates: Partial<Order> = {
      estado: selectedEstado as Order["estado"],
      notas: notas,
      fechaActualizacion: new Date().toISOString(),
    };

    onSave(order.id, updates);
    onOpenChange(false);
  };

  const hasChanges = selectedEstado !== order.estado || notas !== (order.notas || "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[90vw] md:max-w-xl lg:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex flex-wrap items-center gap-2 sm:text-lg md:text-xl">
            Editar Pedido
            <Badge className={getEstadoColor(order.estado)}>
              {getEstadoIcon(order.estado)}
              <span className="ml-1 capitalize">{order.estado}</span>
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Información básica del pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base md:text-lg">Información del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="text-[10px] font-medium text-muted-foreground sm:text-xs md:text-sm">NÚMERO DE ORDEN</Label>
                  <p className="font-mono text-sm font-semibold sm:text-base md:text-lg">{order.numeroOrden}</p>
                </div>
                <div>
                  <Label className="text-[10px] font-medium text-muted-foreground sm:text-xs md:text-sm">CLIENTE</Label>
                  <p className="font-medium text-xs sm:text-sm">{order.userName}</p>
                  <p className="text-[10px] text-muted-foreground sm:text-xs">{order.userEmail}</p>
                </div>
              </div>

              <div>
                <Label className="text-[10px] font-medium text-muted-foreground sm:text-xs md:text-sm">TOTAL</Label>
                <p className="text-lg font-bold text-primary sm:text-xl md:text-2xl">${order.total.toLocaleString("es-CL")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Productos del Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base md:text-lg">Productos del Pedido ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 p-2 border rounded-lg sm:flex-row sm:gap-3 sm:p-3">
                  <div className="flex-shrink-0 self-center sm:self-start">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded border sm:w-14 sm:h-14 md:w-16 md:h-16"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-xs mb-1 sm:text-sm">{item.productName}</h5>
                    <div className="flex flex-col gap-1 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:gap-3 sm:text-xs">
                      <span>Cantidad: <span className="font-semibold text-foreground">{item.quantity || 0}</span></span>
                      <span>Precio unitario: <span className="font-semibold text-foreground">${(item.unitPrice || 0).toLocaleString("es-CL")}</span></span>
                      <span className="font-semibold text-primary">
                        Total: ${(item.totalPrice || 0).toLocaleString("es-CL")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <Separator />

              {/* Total del Pedido */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">${order.subtotal.toLocaleString("es-CL")}</span>
                </div>
                {order.descuentoDuoc > 0 && (
                  <div className="flex justify-between text-xs text-green-600 sm:text-sm">
                    <span>Descuento Duoc:</span>
                    <span>-${order.descuentoDuoc.toLocaleString("es-CL")}</span>
                  </div>
                )}
                {order.descuentoPuntos > 0 && (
                  <div className="flex justify-between text-xs text-green-600 sm:text-sm">
                    <span>Descuento Puntos:</span>
                    <span>-${order.descuentoPuntos.toLocaleString("es-CL")}</span>
                  </div>
                )}
                {order.puntosUsados > 0 && (
                  <div className="flex justify-between text-xs text-red-600 sm:text-sm">
                    <span>Puntos usados:</span>
                    <span>-{order.puntosUsados} pts</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-sm font-bold sm:text-base md:text-lg">
                  <span>Total:</span>
                  <span className="text-primary">${order.total.toLocaleString("es-CL")}</span>
                </div>
                {order.puntosGanados > 0 && (
                  <div className="flex justify-between text-xs text-green-600 sm:text-sm">
                    <span>Puntos ganados:</span>
                    <span>+{order.puntosGanados} pts</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estado del pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base md:text-lg">Estado del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="estado" className="text-xs font-medium sm:text-sm">
                  Cambiar Estado
                </Label>
                <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Pendiente
                      </div>
                    </SelectItem>
                    <SelectItem value="procesando">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Procesando
                      </div>
                    </SelectItem>
                    <SelectItem value="enviado">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Enviado
                      </div>
                    </SelectItem>
                    <SelectItem value="entregado">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Entregado
                      </div>
                    </SelectItem>
                    <SelectItem value="cancelado">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Cancelado
                      </div>
                    </SelectItem>
                    <SelectItem value="rechazado">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Rechazado
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notas" className="text-xs font-medium sm:text-sm">
                  Notas del Pedido
                </Label>
                <Textarea
                  id="notas"
                  placeholder="Agregar notas sobre el pedido..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="mt-1 min-h-[80px] sm:min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview del nuevo estado */}
          {selectedEstado !== order.estado && (
            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="pt-3 sm:pt-4">
                <div className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs font-medium sm:text-sm">
                    El estado cambiará a:
                    <Badge className={`${getEstadoColor(selectedEstado)} ml-2`}>
                      {getEstadoIcon(selectedEstado)}
                      <span className="ml-1 capitalize">{selectedEstado}</span>
                    </Badge>
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col-reverse gap-2 pt-3 border-t sm:flex-row sm:justify-end sm:gap-3 sm:pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderEditModal;
