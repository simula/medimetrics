import React, { useEffect, useState } from "react";
import { FlipyDiv } from "../animations/flipInY";
import { useHistory } from "react-router-dom";

import NextButton from "./nextButton";
const ExportedMatrices = ({ onClick }) => {
  let history = useHistory();
  const [methods, setMethods] = useState([]);
  let [selectAllMethods, setSelectAllMethods] = useState(false);
  const disabled = methods.filter((method) => method.selected).length < 1;
  useEffect(() => {
    const availableMethods = JSON.parse(sessionStorage.getItem("methods"));
    availableMethods.map((method) => (method["selected"] = false));
    availableMethods && setMethods(availableMethods);
  }, []);
  let allMethodsSelected =
    methods.filter((method) => method.selected === false).length < 1;

  const handleMethodsSelection = (label) => {
    setSelectAllMethods(selectAllMethods ? false : selectAllMethods);
    const newMethods = [...methods];
    const selectedItem = newMethods
      .filter((method) => method.lbl === label)
      .pop();
    const index = newMethods.findIndex((method) => method.lbl === label);
    selectedItem.selected = !selectedItem.selected;
    newMethods[index] = selectedItem;
    setMethods(newMethods);
  };

  const handleSelectAllMethods = () => {
    setSelectAllMethods(!selectAllMethods);
    methods.map(
      (method) => (method.selected = selectAllMethods ? false : true)
    );
  };
  const nextStep = () => {
    sessionStorage.setItem(
      "selected-matrices",
      JSON.stringify(methods.filter((method) => method.selected === true))
    );
    history.push("/confusionMatrix");
  };

  return (
    <FlipyDiv>
      <div className="exported-methods">
        <div className="export-header">
          <h5 style={{ color: "#3498DB" }}>Methods:</h5>
          <i onClick={onClick} className="fa fa-close close-export"></i>
        </div>
        <React.Fragment>
          <div className="select-unselect">
            <div className="radio-input">
              <input
                onClick={handleSelectAllMethods}
                style={{ marginRight: "0.2em" }}
                type="radio"
                id="Select-all"
                name="all"
                value="all"
                checked={selectAllMethods || allMethodsSelected}></input>
              <label
                for="Select-all"
                style={{ fontWeight: "550", marginRight: "0.2em" }}>
                Mark All
              </label>
            </div>
          </div>
          <div className="export-content">
            <ul className="exported-methods-list">
              {methods.map((method) => (
                <li
                  className="export-item"
                  onClick={() => handleMethodsSelection(method.lbl)}>
                  <i
                    className={
                      method.selected
                        ? "fa fa-check fa-sm success"
                        : " fa fa-check fa-sm hidden"
                    }
                    aria-hidden="true"></i>

                  <span className="export-label"> {method.lbl} </span>
                </li>
              ))}
            </ul>
          </div>
          <NextButton onClick={() => nextStep()} disabled={disabled} />
        </React.Fragment>
      </div>
    </FlipyDiv>
  );
};

export default ExportedMatrices;
