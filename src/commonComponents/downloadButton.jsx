import React from "react";
const DownloadButton = ({ onClick, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="btn"
      id="download-button">
      PDF{" "}
    </button>
  );
};

export default DownloadButton;
