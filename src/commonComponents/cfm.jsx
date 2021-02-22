import React from "react";
const CFM = ({
  label,
  truePositives,
  falseNegatives,
  falsePositives,
  trueNegatives,
}) => {
  return (
    <div
      style={{
        margin: "1em 0.5em 0 0.5em",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <h5>-{label}-</h5>
      <div className="confusion-matrix-exported">
        <div className="matrix-cell-exported green">
          <span className="component-label">TP</span> {truePositives}
        </div>
        <div className="matrix-cell-exported red ">
          <span className="component-label">FN</span> {falseNegatives}
        </div>
        <div className="matrix-cell-exported red">
          <span className="component-label">FP</span> {falsePositives}
        </div>
        <div className="matrix-cell-exported green">
          <span className="component-label">TN</span> {trueNegatives}
        </div>
      </div>
    </div>
  );
};

export default CFM;
