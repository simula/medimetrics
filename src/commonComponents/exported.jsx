import React, { useEffect, useState } from "react";
import DownloadButton from "./downloadButton";
import generatePDF from "../services/pdf";
import { FlipyDiv } from "../animations/flipInY";
import NextButton from "./nextButton";
import PreviousButton from "./previousButton";
const Exported = ({ onClick }) => {
  const [methods, setMethods] = useState([]);
  const [metrics, setMetrics] = useState([]);
  let [firstStep, setFirstStep] = useState(true);
  let [secondStep, SetSecondStep] = useState(false);
  let [selectAllMethods, setSelectAllMethods] = useState(false);
  let [selectAllMetrics, setSelectAllMetrics] = useState(false);
  const disabled = methods.filter((method) => method.selected).length < 1;
  useEffect(() => {
    const availableMethods = JSON.parse(sessionStorage.getItem("methods"));
    availableMethods.map((method) => (method["selected"] = false));
    availableMethods && setMethods(availableMethods);
    const metricsLabels = Object.keys(availableMethods[0]).filter(
      (metric) =>
        metric !== "selected" &&
        metric !== "lbl" &&
        metric !== "ts" &&
        metric !== "ps" &&
        metric !== "ns" &&
        metric !== "tp" &&
        metric !== "fn" &&
        metric !== "tn" &&
        metric !== "fp"
    );
    const availableMetrics = [];
    metricsLabels.forEach((metric) => {
      availableMetrics.push({ lbl: metric, selected: false });
    });
    setMetrics(availableMetrics);
  }, []);
  let allMethodsSelected =
    methods.filter((method) => method.selected === false).length < 1;
  let allMetricsSelected =
    metrics.filter((metric) => metric.selected === false).length < 1;
  const metricsCodes = {
    acc: "ACC",
    rc: "REC",
    prc: "PREC",
    f1: "F1",
    spf: "SPEC",
    mcc: "MCC",
    npv: "NPV",
    ths: "THS",
  };
  const metricsLabels = {
    acc: "Accuracy",
    rc: "Recall",
    prc: "Precision",
    f1: "F1-Score",
    spf: "Specificity",
    mcc: "Matthews Correlation Coeff",
    npv: "Negative Predictive Value",
    ths: "Threat score",
  };
  const convertMetrics = (metrics) => {
    const columns = [];
    metrics.map((metric) => columns.push(metricsCodes[metric.lbl]));
    return columns;
  };

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
  const handleMetricsSelection = (label) => {
    setSelectAllMetrics(selectAllMetrics ? false : selectAllMetrics);
    const newMetrics = [...metrics];
    const selectedItem = newMetrics
      .filter((metric) => metric.lbl === label)
      .pop();
    const index = newMetrics.findIndex((metric) => metric.lbl === label);
    selectedItem.selected = !selectedItem.selected;
    newMetrics[index] = selectedItem;
    setMetrics(newMetrics);
  };
  const handleSelectAllMethods = () => {
    setSelectAllMethods(!selectAllMethods);
    methods.map(
      (method) => (method.selected = selectAllMethods ? false : true)
    );
  };
  const handleSelectAllMetrics = () => {
    setSelectAllMetrics(!selectAllMetrics);
    metrics.map(
      (metric) => (metric.selected = selectAllMetrics ? false : true)
    );
  };
  const download = () => {
    const methodsToExport = methods.filter((method) => method.selected);
    const metricstoExport = metrics.filter((metric) => metric.selected);
    const newColumns = convertMetrics(metricstoExport);
    const tableColumns = [
      "Method",
      "TOTAL",
      "POS",
      "NEG",
      "TP",
      "TN",
      "FP",
      "FN",
      ...newColumns,
    ];
    const base = [];
    methodsToExport.forEach((method) => {
      let element = {
        lbl: method.lbl,
        ts: method.ts,
        ps: method.ps,
        ns: method.ns,
        tp: method.tp,
        tn: method.tn,
        fp: method.fp,
        fn: method.fn,
      };
      base.push(element);
    });
    const queue = [];
    methodsToExport.forEach((method) => {
      let element = {};
      for (const [key, value] of Object.entries(method)) {
        if (metricstoExport.find((metric) => metric.lbl === key))
          element[key] = value;
      }
      queue.push(element);
    });
    const tableRows = [];
    for (let i = 0; i < base.length; i++) {
      let merged = [...Object.values(base[i]), ...Object.values(queue[i])];
      tableRows.push(merged);
    }

    generatePDF(tableColumns, tableRows);
  };
  const moveToSecondStep = () => {
    setFirstStep(false);
    SetSecondStep(true);
  };
  const moveToFirstStep = () => {
    SetSecondStep(false);
    setFirstStep(true);
  };
  return (
    <FlipyDiv>
      <div className="exported-methods">
        <div className="export-header">
          <h5 style={{ color: "#3498DB" }}>
            {firstStep ? "Methods:" : "Metrics:"}
          </h5>
          <i onClick={onClick} className="fa fa-close close-export"></i>
        </div>
        {firstStep && (
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
                  checked={selectAllMetrics || allMethodsSelected}></input>
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
            <NextButton
              disabled={disabled}
              onClick={() => moveToSecondStep()}></NextButton>
          </React.Fragment>
        )}
        {secondStep && (
          <React.Fragment>
            <div className="select-unselect">
              <div className="radio-input">
                <input
                  onClick={handleSelectAllMetrics}
                  style={{ marginRight: "0.2em" }}
                  type="radio"
                  id="Select-all"
                  name="all"
                  value="all"
                  checked={selectAllMetrics || allMetricsSelected}></input>
                <label
                  for="Select-all"
                  style={{ fontWeight: "550", marginRight: "0.2em" }}>
                  Mark All
                </label>
              </div>
            </div>
            <div className="export-content">
              <ul className="exported-methods-list">
                {metrics.map((metric) => (
                  <li
                    className="export-item"
                    onClick={() => handleMetricsSelection(metric.lbl)}>
                    <i
                      className={
                        metric.selected
                          ? "fa fa-check fa-sm success"
                          : " fa fa-check fa-sm hidden"
                      }
                      aria-hidden="true"></i>

                    <span className="export-label">
                      {" "}
                      {metricsLabels[metric.lbl]}{" "}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="controls">
              <PreviousButton onClick={() => moveToFirstStep()} />
              <DownloadButton disabled={disabled} onClick={() => download()} />
            </div>
          </React.Fragment>
        )}
      </div>
    </FlipyDiv>
  );
};

export default Exported;
