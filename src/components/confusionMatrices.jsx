import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import CFM from "../commonComponents/cfm";

const CMatrix = () => {
  const ref = React.createRef();
  const [methods, setMethods] = useState([]);
  useEffect(() => {
    const availableMethods = JSON.parse(
      sessionStorage.getItem("selected-matrices")
    );
    availableMethods && setMethods(availableMethods);
  }, []);
  const download = () => {
    var opt = {
      margin: 1,
      filename: "Confusion Matrix.pdf",
      image: { type: "jpeg", quality: 1 },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      html2canvas: { scale: 5 },
      jsPDF: { unit: "in" },
    };
    const doc = document.getElementById("divToPrint");
    html2pdf().set(opt).from(doc).save();
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "2.8em" }}>
      <button className="download-confusion-matrix" onClick={() => download()}>
        Download
      </button>
      <div
        ref={ref}
        id="divToPrint"
        style={{
          textAlign: "center",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <h2>{`Confusion ${methods.length > 1 ? "Matrices" : "Matrix"}`}</h2>
        <div
          style={{
            textAlign: "center",
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}>
          {methods.map((method) => (
            <CFM
              label={method.lbl}
              truePositives={method.tp}
              falseNegatives={method.fn}
              falsePositives={method.fp}
              trueNegatives={method.tn}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CMatrix;
