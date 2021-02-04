import React from "react";
const DownloadButton = ({ onClick, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="btn"
      id="download-button">
      <i className="fa fa-file-pdf-o mr-2" aria-hidden="true"></i>Download PDF{" "}
    </button>
  );
};

export default DownloadButton;
