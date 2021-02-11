import React from "react";
const PreviousButton = ({ onClick, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="btn"
      id="next-button">
      {" "}
      <i className="fa fa-angle-double-left fa-2x"></i>
    </button>
  );
};

export default PreviousButton;
