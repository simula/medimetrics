import React from "react";
import logo from "../images/brain.png";
const Brand = () => {
  return (
    <div className="brand">
      {" "}
      <h1 className="title"> MediMetrics</h1>
      <img alt="logo" src={logo} className="brand-logo"></img>
    </div>
  );
};

export default Brand;
