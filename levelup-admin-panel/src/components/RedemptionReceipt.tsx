import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Download, Printer } from "lucide-react";
import { RedemptionReceipt as ReceiptType } from "@/types/RedemptionOrder";

interface RedemptionReceiptProps {
  receipt: ReceiptType;
  onClose: () => void;
}

const RedemptionReceipt = ({ receipt, onClose }: RedemptionReceiptProps) => {
  const handleDownload = () => {
    const receiptText = generateReceiptText(receipt);
    const element = document.createElement("a");
    const file = new Blob([receiptText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `canje_${receipt.numeroRecibo}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    const receiptText = generateReceiptText(receipt);
    const printWindow = window.open("", "", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Boleta de Canje - ${receipt.numeroRecibo}</title>
            <style>
              body {
                font-family: monospace;
                padding: 20px;
                background-color: #fff;
                color: #000;
              }
              pre {
                white-space: pre-wrap;
                word-wrap: break-word;
              }
            </style>
          </head>
          <body>
            <pre>${receiptText}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
      <Card className="bg-slate-800/50 border-slate-700 w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-white">✅ Canje Confirmado</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <Separator className="bg-slate-700" />
        <CardContent className="space-y-6 pt-6">
          {/* Receipt Preview */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
            <div className="font-mono text-xs text-slate-300 space-y-2 mb-6">
              <div className="text-center font-bold text-slate-200">
                BOLETA DE CANJE - LEVELUP
              </div>
              <div className="text-center text-xs text-slate-400">
                ═══════════════════════════════════
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs text-slate-300">
              {/* Order Info */}
              <div>
                <div className="flex justify-between">
                  <span>Número de Recibo:</span>
                  <span className="font-bold text-yellow-400">{receipt.numeroRecibo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fecha:</span>
                  <span>{receipt.fecha}</span>
                </div>
              </div>

              <div className="border-t border-slate-600 pt-4">
                <div className="font-bold text-slate-200 mb-2">Cliente</div>
                <div className="flex justify-between">
                  <span>Nombre:</span>
                  <span>{receipt.usuario.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span>{receipt.usuario.correo}</span>
                </div>
              </div>

              <div className="border-t border-slate-600 pt-4">
                <div className="font-bold text-slate-200 mb-2">Producto Canjeado</div>
                <div className="flex justify-between">
                  <span>Nombre:</span>
                  <span>{receipt.producto.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span>Código:</span>
                  <span>{receipt.producto.codigo}</span>
                </div>
              </div>

              <div className="border-t border-slate-600 pt-4">
                <div className="font-bold text-slate-200 mb-2">Puntos</div>
                <div className="flex justify-between">
                  <span>Puntos Utilizados:</span>
                  <span className="text-yellow-400">{receipt.puntosUsados}</span>
                </div>
                <div className="flex justify-between">
                  <span>Puntos Restantes:</span>
                  <span className="text-green-400">{receipt.puntosRestantes}</span>
                </div>
              </div>

              <div className="border-t border-slate-600 pt-4">
                <div className="font-bold text-slate-200 mb-2">Envío</div>
                <div className="flex justify-between">
                  <span>Método:</span>
                  <span>{receipt.metodoRetiro}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dirección:</span>
                  <span className="text-right">{receipt.direccionEnvio}</span>
                </div>
              </div>

              <div className="border-t border-slate-600 pt-4">
                <div className="flex justify-between">
                  <span>Estado:</span>
                  <span className="font-bold text-green-400">{receipt.estado}</span>
                </div>
              </div>

              <div className="border-t border-slate-600 pt-4">
                <div className="text-center text-xs text-slate-400">
                  ═══════════════════════════════════
                </div>
                <div className="text-center text-xs text-slate-400 mt-2">
                  Gracias por tu canje en LevelUp
                </div>
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-400 text-sm">
              📩 Se ha enviado una copia de tu canje al correo <strong>{receipt.usuario.correo}</strong>. Tu producto será procesado en las próximas 24-48 horas.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
            <Button
              onClick={handlePrint}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Volver a Tienda
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function generateReceiptText(receipt: ReceiptType): string {
  return `
╔═══════════════════════════════════════════════════════════╗
║             BOLETA DE CANJE - LEVELUP                    ║
╚═══════════════════════════════════════════════════════════╝

NÚMERO DE RECIBO: ${receipt.numeroRecibo}
FECHA: ${receipt.fecha}

───────────────────────────────────────────────────────────
CLIENTE
───────────────────────────────────────────────────────────
Nombre: ${receipt.usuario.nombre}
Email:  ${receipt.usuario.correo}

───────────────────────────────────────────────────────────
PRODUCTO CANJEADO
───────────────────────────────────────────────────────────
Nombre: ${receipt.producto.nombre}
Código: ${receipt.producto.codigo}

───────────────────────────────────────────────────────────
PUNTOS
───────────────────────────────────────────────────────────
Puntos Utilizados:  ${receipt.puntosUsados} pts
Puntos Restantes:   ${receipt.puntosRestantes} pts

───────────────────────────────────────────────────────────
ENVÍO
───────────────────────────────────────────────────────────
Método: ${receipt.metodoRetiro}
Dirección: ${receipt.direccionEnvio}

───────────────────────────────────────────────────────────
ESTADO DEL PEDIDO
───────────────────────────────────────────────────────────
${receipt.estado}

═══════════════════════════════════════════════════════════
¡Gracias por tu canje en LevelUp!
Tu producto será procesado en las próximas 24-48 horas.
═══════════════════════════════════════════════════════════
  `;
}

export default RedemptionReceipt;
