import React from "react";
const NextButton = ({ onClick, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="btn"
      id="next-button">
      <i className="fa fa-angle-double-right fa-2x"></i>
    </button>
  );
};

export default NextButton;
