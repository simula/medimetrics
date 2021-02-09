import jsPDF from "jspdf";
import "jspdf-autotable";
const generatePDF = (tableColumns, tableRows) => {
  const doc = new jsPDF("pt");
  doc.setFontSize(8.5);
  let footer = `      medimetrics.no
      https://github.com/simula/medimetrics`;
  doc.text(footer, 0, doc.internal.pageSize.height - 8);

  doc.autoTable(tableColumns, tableRows, {
    margin: { horizontal: 5 },
    bodyStyles: { valign: "middle" },
    styles: {
      lineWidth: 0.05,
      lineColor: 25,
      halign: "center",
      overflow: "linebreak",
      cellWidth: "wrap",
      fontSize: "8",
    },
    theme: "plain",
  });
  doc.save(`export.pdf`);
};

export default generatePDF;
