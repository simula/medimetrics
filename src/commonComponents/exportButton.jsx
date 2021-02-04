import React from "react";
const ExportMetricButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="btn" id="export-metric-button">
      <i className="fa fa-share-alt mr-2" aria-hidden="true"></i>Export{" "}
    </button>
  );
};

export default ExportMetricButton;
