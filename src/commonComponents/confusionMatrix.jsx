import React from "react";
import { ZoomyDiv } from "../animations/zoomIn";
const ConfusionMatrix = ({
  label,
  truePositives,
  falseNegatives,
  falsePositives,
  trueNegatives,
  onClick,
}) => {
  return (
    <ZoomyDiv>
      <div className="confusion-matrix-wrapper">
        <div className="matrix-header">
          <span className="method-label">{label}</span>
          <i onClick={onClick} className="fa fa-close close-matrix"></i>
        </div>
        <div className="confusion-matrix">
          <div className="matrix-cell green">
            <span className="component-label">TP</span> {truePositives}
          </div>
          <div className="matrix-cell red ">
            <span className="component-label">FN</span> {falseNegatives}
          </div>
          <div className="matrix-cell red">
            <span className="component-label">FP</span> {falsePositives}
          </div>
          <div className="matrix-cell green">
            <span className="component-label">TN</span> {trueNegatives}
          </div>
        </div>
      </div>
    </ZoomyDiv>
  );
};

export default ConfusionMatrix;
