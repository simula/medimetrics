import React from "react";
import { NavLink } from "react-router-dom";
const AddMetricButton = () => {
  return (
    <NavLink to="/newmetricset">
      <button className="btn" id="add-metric-button">
        <i className="fa fa-plus mr-2" aria-hidden="true"></i>New Metric Set{" "}
      </button>
    </NavLink>
  );
};

export default AddMetricButton;
