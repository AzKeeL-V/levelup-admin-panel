import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  Download,
  X,
  FileText,
  Calendar,
  User,
  CreditCard,
  MapPin,
  Package
} from "lucide-react";
import { generateAndDownloadReceiptPDF } from "@/utils/receiptGenerator";
import { Order } from "@/types/Order";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const ReceiptModal = ({ isOpen, onClose, order }: ReceiptModalProps) => {
  const [isPrinting, setIsPrinting] = useState(false);

  console.log("ReceiptModal rendering. isOpen:", isOpen, "Order:", order);

  if (!isOpen) return null;
  if (!order) return null;

  // Defensive check for essential properties
  if (!order.items || !order.direccionEnvio) {
    console.error("ReceiptModal: Order is missing essential properties", order);
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrint = () => {
    // For now, print just triggers the PDF download as it's the most reliable way to get the exact layout
    generateAndDownloadReceiptPDF(order, `boleta-${order.numeroOrden}.pdf`);
  };

  const handleDownload = () => {
    generateAndDownloadReceiptPDF(order, `boleta-${order.numeroOrden}.pdf`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Boleta Electrónica - {order.numeroOrden}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Receipt Header */}
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white mb-2">LEVEL-UP SpA</h2>
                <p className="text-slate-300">BOLETA ELECTRÓNICA</p>
                <p className="text-lg font-semibold text-purple-400">{order.numeroOrden}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-400">Fecha</p>
                    <p className="text-white">{formatDate(order.fechaCreacion)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-400">Cliente</p>
                    <p className="text-white">{order.userName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-400">Pago</p>
                    <p className="text-white capitalize">{order.metodoPago}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {order.estado}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Productos
              </h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="text-white font-medium">{item.productName}</p>
                        <p className="text-slate-400 text-sm">
                          {item.quantity} x {formatPrice(item.unitPrice)}
                          {item.puntosGanados > 0 && (
                            <span className="text-yellow-400 ml-2">
                              +{item.puntosGanados * item.quantity} pts
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-white font-semibold">{formatPrice(item.totalPrice)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Dirección de Envío
              </h3>
              <div className="text-slate-300">
                <p className="font-medium text-white">{order.direccionEnvio.nombre}</p>
                <p>{order.direccionEnvio.calle} {order.direccionEnvio.numero}</p>
                {order.direccionEnvio.apartamento && <p>{order.direccionEnvio.apartamento}</p>}
                <p>{order.direccionEnvio.ciudad}, {order.direccionEnvio.region}</p>
                <p>Código Postal: {order.direccionEnvio.codigoPostal}</p>
                <p>Teléfono: {order.direccionEnvio.telefono}</p>
              </div>
            </CardContent>
          </Card>

          {/* Totals */}
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.descuentoDuoc > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Descuento DUOC</span>
                  <span>-{formatPrice(order.descuentoDuoc)}</span>
                </div>
              )}
              {order.descuentoPuntos > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Descuento Puntos</span>
                  <span>-{formatPrice(order.descuentoPuntos)}</span>
                </div>
              )}
              <Separator className="bg-slate-600" />
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              {order.puntosGanados > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-4">
                  <p className="text-yellow-400 text-sm text-center">
                    🎉 Ganaste {order.puntosGanados} puntos con esta compra
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar Boleta PDF
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;
