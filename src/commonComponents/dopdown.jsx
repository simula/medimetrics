import React, { useState } from "react";

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const DropDown = ({ onClickMethod, onMatrixExport }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Dropdown
      id="dropdown"
      style={{
        display: "inline",
        position: "relative",
        left: "0.5em",
        top: "0.7em",
        outline: "none",
      }}
      isOpen={dropdownOpen}
      toggle={toggle}>
      <DropdownToggle
        style={{ backgroundColor: "#3498db", border: "none", height: "2.35em" }}
        caret>
        {" "}
        <i className="fa fa-share-alt mr-2" aria-hidden="true"></i>Export
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={onMatrixExport}>Confusion Matrix</DropdownItem>
        <DropdownItem onClick={onClickMethod}>Table view</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropDown;
