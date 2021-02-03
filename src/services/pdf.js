import jsPDF from "jspdf";
import "jspdf-autotable";
const generatePDF = (methods) => {
  const doc = new jsPDF("pt");
  doc.setFontSize(8.5);
  let footer = `      medimetrics.no
      https://github.com/simula/medimetrics`;
  doc.text(footer, 0, doc.internal.pageSize.height - 8);

  const tableColumn = [
    "Method",
    "TOTAL",
    "POS",
    "NEG",
    "TP",
    "TN",
    "FP",
    "FN",
    "ACC",
    "PREC",
    "F1",
    "SPEC",
    "MCC",
    "NPV",
    "THS",
  ];
  const tableRows = [];
  methods.forEach((method) => {
    const methodsData = [
      method.lbl,
      method.ts,
      method.tp,
      method.ns,
      method.tp,
      method.fp,
      method.tn,
      method.fn,
      method.acc,
      method.mcc,
      method.spf,
      method.npv,
      method.ths,
      method.rc,
      method.prc,
      method.f1,
    ];
    tableRows.push(methodsData);
  });

  doc.autoTable(tableColumn, tableRows, {
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
