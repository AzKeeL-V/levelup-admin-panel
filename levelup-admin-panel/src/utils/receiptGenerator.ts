/**
 * Utilidad para generar y descargar boletas en PDF
 * Usa dynamic imports para evitar problemas de carga con jspdf en Vite
 */
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
      alert("Error al cargar el generador de PDF.");
      return;
    }

    const doc = new jsPDF();

    // --- Constantes de Diseño ---
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = 20;

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

    // --- 1. Header (Empresa) ---
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("LEVEL UP SpA", margin, currentY);

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("BOLETA ELECTRÓNICA", pageWidth - margin, currentY, { align: "right" });

    currentY += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text("Av. Gamer 123, Santiago, Chile", margin, currentY);
    doc.text("RUT: 76.123.456-7", pageWidth - margin, currentY, { align: "right" });

    currentY += 5;
    doc.text("Email: adminlevelup@.cl", margin, currentY);
    doc.text(`N° Ticket: ${order.numeroOrden}`, pageWidth - margin, currentY, { align: "right" });

    currentY += 5;
    doc.text("Web: www.levelup.cl", margin, currentY);
    doc.text(`Fecha Emisión: ${formatDate(order.fechaCreacion)}`, pageWidth - margin, currentY, { align: "right" });

    currentY += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    // --- 2. Información del Cliente ---
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Información del Cliente", margin, currentY);
    currentY += 7;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    // Izquierda
    doc.text(`Nombre: ${order.userName}`, margin, currentY);
    doc.text(`RUT: ${order.userRut || 'N/A'}`, pageWidth / 2 + 10, currentY); // Placeholder for RUT
    currentY += 5;

    doc.text(`Email: ${order.userEmail}`, margin, currentY);
    doc.text(`Teléfono: ${order.direccionEnvio?.telefono || 'N/A'}`, pageWidth / 2 + 10, currentY);
    currentY += 5;

    const address = order.direccionEnvio;
    const addressStr = `${address.calle} ${address.numero}, ${address.ciudad}, ${address.region}`;
    doc.text(`Dirección: ${addressStr}`, margin, currentY);
    currentY += 5;

    doc.text(`Forma de Entrega: Envío a Domicilio`, margin, currentY);
    doc.text(`Vendedor: `, pageWidth / 2 + 10, currentY); // Dejar vacío
    currentY += 10;

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
        head: [['Cant.', 'Artículo', 'P. Unitario', 'Total']],
        body: tableBody,
        theme: 'plain', // Minimalist theme
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineWidth: 0.1,
          lineColor: [200, 200, 200]
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: { bottom: 0.1 }
        },
        columnStyles: {
          0: { cellWidth: 20, halign: 'center' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 35, halign: 'right' },
          3: { cellWidth: 35, halign: 'right' }
        }
      });
    }

    // --- 4. Totales ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : currentY + 20;
    const rightColX = pageWidth - margin - 40;
    const valuesX = pageWidth - margin;

    doc.setFontSize(9);

    // Cálculos
    // Asumimos que el total incluye IVA. Neto = Total / 1.19
    const total = order.total;
    const neto = Math.round(total / 1.19);
    const iva = total - neto;

    // Neto
    doc.text("Neto:", rightColX, finalY, { align: "right" });
    doc.text(formatPrice(neto), valuesX, finalY, { align: "right" });

    // IVA
    doc.text("IVA (19%):", rightColX, finalY + 5, { align: "right" });
    doc.text(formatPrice(iva), valuesX, finalY + 5, { align: "right" });

    // Descuentos
    let discountY = finalY + 10;
    if (order.descuentoDuoc > 0) {
      doc.text("Descuento DUOC:", rightColX, discountY, { align: "right" });
      doc.text(`-${formatPrice(order.descuentoDuoc)}`, valuesX, discountY, { align: "right" });
      discountY += 5;
    }
    if (order.descuentoPuntos > 0) {
      doc.text("Descuento Puntos:", rightColX, discountY, { align: "right" });
      doc.text(`-${formatPrice(order.descuentoPuntos)}`, valuesX, discountY, { align: "right" });
      discountY += 5;
    }

    // Total Final
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", rightColX, discountY + 2, { align: "right" });
    doc.text(formatPrice(total), valuesX, discountY + 2, { align: "right" });

    // --- 5. Footer / Info Pago ---
    let footerY = discountY + 15;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Observaciones: null", margin, footerY);
    footerY += 5;

    doc.text("Comprobante de Venta", margin, footerY);
    footerY += 5;

    // Info Tarjeta Mockeada
    if (order.metodoPago === 'tarjeta') {
      doc.text("Método de Pago: Tarjeta de Crédito/Débito", margin, footerY);
      footerY += 5;
      doc.text("Emisor: Transbank / WebPay", margin, footerY);
      footerY += 5;
      doc.text("N° Tarjeta: **** **** **** 1234", margin, footerY);
    } else {
      doc.text(`Método de Pago: ${order.metodoPago.toUpperCase()}`, margin, footerY);
    }

    // Guardar
    doc.save(fileName);

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Hubo un error al generar el PDF.");
  }
};
