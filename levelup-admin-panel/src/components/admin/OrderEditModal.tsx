import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/Order";
import { Clock, Package, Truck, CheckCircle, XCircle, AlertTriangle, Save } from "lucide-react";

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Editar Pedido
            <Badge className={getEstadoColor(order.estado)}>
              {getEstadoIcon(order.estado)}
              <span className="ml-1 capitalize">{order.estado}</span>
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica del pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">NÚMERO DE ORDEN</Label>
                  <p className="font-mono text-lg font-semibold">{order.numeroOrden}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">CLIENTE</Label>
                  <p className="font-medium">{order.userName}</p>
                  <p className="text-sm text-muted-foreground">{order.userEmail}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">TOTAL</Label>
                <p className="text-xl font-bold text-primary">${order.total.toLocaleString("es-CL")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Estado del pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estado del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="estado" className="text-sm font-medium">
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
                <Label htmlFor="notas" className="text-sm font-medium">
                  Notas del Pedido
                </Label>
                <Textarea
                  id="notas"
                  placeholder="Agregar notas sobre el pedido..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview del nuevo estado */}
          {selectedEstado !== order.estado && (
            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
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
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center gap-2"
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
