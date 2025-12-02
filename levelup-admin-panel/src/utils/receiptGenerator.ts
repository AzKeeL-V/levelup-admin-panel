/**
 * Utilidad para generar y descargar boletas en PDF
 * Usa dynamic imports para evitar problemas de carga con jspdf en Vite
 */
import { toast } from "sonner";
import type { Order, OrderItem } from "@/types";

export const generateAndDownloadReceiptPDF = async (
  order: Order,
  fileName: string = `boleta-${order.numeroOrden}.pdf`
) => {
  try {
    // Importaciones dinámicas
    const jsPDFModule = await import('jspdf');
    const autoTableModule = await import('jspdf-autotable');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsPDF = jsPDFModule.default || (jsPDFModule as any).jsPDF;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const autoTable = autoTableModule.default || (autoTableModule as any).autoTable;

    if (!jsPDF) {
      console.error("Error: jsPDF module not loaded correctly");
      toast.error("Error al cargar el generador de PDF.");
      return;
    }

    const doc = new jsPDF();

    // --- Constantes de Diseño ---
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    let currentY = 0;

    // Colores corporativos
    const primaryColor = [79, 70, 229]; // Indigo-600 #4f46e5
    const secondaryColor = [30, 41, 59]; // Slate-800 #1e293b
    const lightGray = [241, 245, 249]; // Slate-100 #f1f5f9
    const darkGray = [51, 65, 85]; // Slate-700 #334155

    // --- Helper Functions ---
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

    // --- 1. Header Strip ---
    // Fondo del encabezado
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');

    currentY = 25;

    // Título Empresa (Izquierda)
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("LEVEL UP", margin, currentY);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Tu tienda gamer de confianza", margin, currentY + 6);

    // Título Documento (Derecha)
    doc.setFontSize(16);
    doc.text("BOLETA ELECTRÓNICA", pageWidth - margin, currentY - 5, { align: "right" });

    doc.setFontSize(10);
    doc.text(`N° Ticket: ${order.numeroOrden}`, pageWidth - margin, currentY + 2, { align: "right" });
    doc.text(`Fecha: ${formatDate(order.fechaCreacion)}`, pageWidth - margin, currentY + 7, { align: "right" });

    currentY = 55;

    // --- 2. Información Empresa y Cliente (2 Columnas) ---

    // Columna Izquierda: Emisor
    doc.setFontSize(10);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("EMISOR", margin, currentY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(9);
    currentY += 5;
    doc.text("LEVEL UP SpA", margin, currentY);
    doc.text("RUT: 76.123.456-7", margin, currentY + 5);
    doc.text("Av. Gamer 123, Santiago, Chile", margin, currentY + 10);
    doc.text("contacto@levelup.cl", margin, currentY + 15);
    doc.text("www.levelup.cl", margin, currentY + 20);

    // Columna Derecha: Cliente (en caja)
    const boxY = 50;
    const boxHeight = 35;
    const boxWidth = pageWidth / 2 - margin;
    const boxX = pageWidth / 2;

    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, 'F');

    let clientY = boxY + 10;
    const clientMargin = boxX + 5;

    doc.setFontSize(10);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("CLIENTE", clientMargin, clientY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(9);
    clientY += 6;

    doc.text(order.userName, clientMargin, clientY);
    doc.text(order.userRut || "RUT: N/A", clientMargin, clientY + 5);
    doc.text(order.userEmail, clientMargin, clientY + 10);
    doc.text(order.direccionEnvio.telefono || "", clientMargin, clientY + 15);

    currentY = 100;

    // --- 3. Detalle de Productos (Tabla) ---
    const tableBody = order.items.map((item: OrderItem) => [
      item.quantity,
      item.productName,
      formatPrice(item.unitPrice),
      formatPrice(item.totalPrice)
    ]);

    if (typeof autoTable === 'function') {
      autoTable(doc, {
        startY: currentY,
        head: [['Cant.', 'Descripción', 'Precio Unit.', 'Total']],
        body: tableBody,
        theme: 'striped',
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: {
          fontSize: 9,
          cellPadding: 4,
          textColor: darkGray
        },
        columnStyles: {
          0: { cellWidth: 20, halign: 'center' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 35, halign: 'right' },
          3: { cellWidth: 35, halign: 'right' }
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // Slate-50
        },
        margin: { left: margin, right: margin }
      });
    }

    // --- 4. Totales y Pago ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : currentY + 20;

    // Sección Izquierda: Info Pago
    let paymentY = finalY;
    doc.setFontSize(10);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN DE PAGO", margin, paymentY);

    paymentY += 7;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

    let paymentText = order.metodoPago;
    if (order.metodoPago === 'credito') paymentText = "Tarjeta de Crédito";
    else if (order.metodoPago === 'debito') paymentText = "Tarjeta de Débito";
    else paymentText = order.metodoPago.charAt(0).toUpperCase() + order.metodoPago.slice(1);

    doc.text(`Método: ${paymentText}`, margin, paymentY);

    if (order.metodoPago === 'tarjeta' || order.metodoPago === 'credito' || order.metodoPago === 'debito') {
      paymentY += 5;
      doc.text(`Tarjeta: ${order.datosPago?.numeroTarjeta || "****"}`, margin, paymentY);
      if (order.datosPago?.tipoTarjeta) {
        paymentY += 5;
        doc.text(`Tipo: ${order.datosPago.tipoTarjeta}`, margin, paymentY);
      }
    }

    paymentY += 5;
    doc.text("Estado: Pagado", margin, paymentY);

    // Sección Derecha: Totales
    const rightColX = pageWidth - margin - 40;
    const valuesX = pageWidth - margin;
    let totalsY = finalY;

    // Cálculos
    const total = order.total;
    const neto = Math.round(total / 1.19);
    const iva = total - neto;

    doc.setFontSize(9);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

    // Neto
    doc.text("Neto:", rightColX, totalsY, { align: "right" });
    doc.text(formatPrice(neto), valuesX, totalsY, { align: "right" });
    totalsY += 6;

    // IVA
    doc.text("IVA (19%):", rightColX, totalsY, { align: "right" });
    doc.text(formatPrice(iva), valuesX, totalsY, { align: "right" });
    totalsY += 6;

    // Descuentos
    if (order.descuentoDuoc > 0) {
      doc.setTextColor(22, 163, 74); // Green-600
      doc.text("Desc. DUOC:", rightColX, totalsY, { align: "right" });
      doc.text(`-${formatPrice(order.descuentoDuoc)}`, valuesX, totalsY, { align: "right" });
      totalsY += 6;
    }
    if (order.descuentoPuntos > 0) {
      doc.setTextColor(22, 163, 74); // Green-600
      doc.text("Desc. Puntos:", rightColX, totalsY, { align: "right" });
      doc.text(`-${formatPrice(order.descuentoPuntos)}`, valuesX, totalsY, { align: "right" });
      totalsY += 6;
    }

    // Separator Line
    doc.setDrawColor(200, 200, 200);
    doc.line(rightColX - 20, totalsY, pageWidth - margin, totalsY);
    totalsY += 6;

    // Total Final
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("TOTAL:", rightColX, totalsY + 2, { align: "right" });
    doc.text(formatPrice(total), valuesX, totalsY + 2, { align: "right" });

    // --- 5. Footer ---
    const footerY = pageHeight - 20;

    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Gracias por tu compra en Level Up. ¡Que disfrutes tu juego!", pageWidth / 2, footerY, { align: "center" });
    doc.text("Este documento es una representación impresa de una Boleta Electrónica.", pageWidth / 2, footerY + 5, { align: "center" });

    // Guardar
    doc.save(fileName);

  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Hubo un error al generar el PDF.");
  }
};
