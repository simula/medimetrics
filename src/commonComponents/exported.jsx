import React, { useEffect, useState } from "react";
import DownloadButton from "./downloadButton";
import generatePDF from "../services/pdf";
import { FlipyDiv } from "../animations/flipInY";

const Exported = ({ onClick }) => {
  const [methods, setMethods] = useState([]);
  const disabled = methods.filter((method) => method.selected).length < 1;
  useEffect(() => {
    const availableMethods = JSON.parse(sessionStorage.getItem("methods"));
    availableMethods.map((method) => (method["selected"] = false));
    availableMethods && setMethods(availableMethods);
  }, []);

  const handleSelection = (label) => {
    const newMethods = [...methods];
    const selectedItem = newMethods
      .filter((method) => method.lbl === label)
      .pop();
    const index = newMethods.findIndex((method) => method.lbl === label);
    selectedItem.selected = !selectedItem.selected;
    newMethods[index] = selectedItem;
    setMethods(newMethods);
  };
  const download = () => {
    const methodsToExport = methods.filter((method) => method.selected);
    generatePDF(methodsToExport);
  };
  return (
    <FlipyDiv>
      <div className="exported-methods">
        <div className="export-header">
          <h5>Select methods:</h5>
          <i onClick={onClick} className="fa fa-close close-export"></i>
        </div>

        <div className="export-content">
          <ul className="exported-methods-list">
            {methods.map((method) => (
              <li
                className="export-item"
                onClick={() => handleSelection(method.lbl)}>
                <i
                  className={
                    method.selected
                      ? "fa fa-check success"
                      : " fa fa-check hidden"
                  }
                  aria-hidden="true"></i>

                <span className="export-label"> {method.lbl} </span>
              </li>
            ))}
          </ul>
        </div>
        <DownloadButton disabled={disabled} onClick={() => download()} />
      </div>
    </FlipyDiv>
  );
};

export default Exported;
