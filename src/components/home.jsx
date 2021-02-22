import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "react-svg-radar-chart/build/css/index.css";
import ReactTooltip from "react-tooltip";
import { ResponsiveRadar } from "@nivo/radar";
import Brand from "../commonComponents/brand";
import Intro from "../commonComponents/intro";
import AddMetricButton from "../commonComponents/addMetricButton";
import Footer from "../commonComponents/footer";
import DropDown from "../commonComponents/dopdown";
import Modal from "@material-ui/core/Modal";
import _ from "lodash";

import {
  extractLabels,
  processDataForChart,
  convertData,
} from "../utils/metricsExtraction";
import ConfusionMatrix from "../commonComponents/confusionMatrix";
import Exported from "../commonComponents/exported";
import ExportedMatrices from "../commonComponents/exported-matrices";

const Home = ({ history }) => {
  const [confusionMatrixComponents, setConfusionMatrixComponents] = useState(
    {}
  );

  const [open, setOpen] = React.useState(false);
  const [openExport, setOpenExport] = React.useState(false);
  const [openMatrixExport, setOpenMatrixExport] = React.useState(false);
  const [methods, setMethods] = useState([]);
  const [sortColumn, setSortColumn] = useState({ path: "acc", order: "asc" });
  const [mappedMethods, setMappedMethods] = useState([]);
  useEffect(() => {
    const availableMethods = JSON.parse(sessionStorage.getItem("methods"));
    availableMethods &&
      setMethods(availableMethods.map((method) => convertData(method)));
  }, []);
  const toggleExport = () => {
    setOpenExport(true);
  };
  const toggleMatrixExport = () => {
    setOpenMatrixExport(true);
  };
  const handleExportClose = () => {
    setOpenExport(false);
  };
  const handleMatrixExportClose = () => {
    setOpenMatrixExport(false);
  };
  const handleOpen = (label) => {
    setOpen(true);
    const selected = JSON.parse(sessionStorage.getItem("methods")).find(
      (e) => e.lbl === label
    );
    const components = {
      lbl: selected.lbl,
      tp: selected.tp,
      fn: selected.fn,
      fp: selected.fp,
      tn: selected.tn,
    };
    setConfusionMatrixComponents(components);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const toggleMethod = (label) => {
    const selected = mappedMethods.find((e) => e.lbl === label);
    if (selected === undefined) {
      const newItem = methods.find((e) => e.lbl === label);
      let newItems = [...mappedMethods];
      newItems.push(newItem);
      setMappedMethods(newItems);
    } else {
      setMappedMethods(mappedMethods.filter((e) => e.lbl !== label));
    }
  };

  const deleteMethod = (label) => {
    const currentMethods = JSON.parse(sessionStorage.getItem("methods"));
    const newMethods = currentMethods.filter((e) => e.lbl !== label);
    sessionStorage.setItem("methods", JSON.stringify(newMethods));
    setMethods(newMethods.map((method) => convertData(method)));
    const currentMappedMethods = mappedMethods;
    const newMappedMethods = currentMappedMethods.filter(
      (e) => e.lbl !== label
    );
    setMappedMethods(newMappedMethods);
    const current = sessionStorage.getItem("current");
    if (current === label) {
      window.sessionStorage.removeItem("current");
    }
  };

  const editMethod = (label) => {
    window.sessionStorage.setItem("current", label);
    history.push(`/${label}`);
  };
  const handleSort = (column) => {
    const currentSortColumn = { ...sortColumn };
    const newSortColumn = {};
    if (currentSortColumn.path === column) {
      newSortColumn.path = column;
      newSortColumn.order = currentSortColumn.order === "asc" ? "desc" : "asc";
    } else {
      newSortColumn.path = column;
      newSortColumn.order = "asc";
    }
    setSortColumn(newSortColumn);
    let sorted = _.orderBy(
      methods,
      [newSortColumn.path],
      [newSortColumn.order]
    );
    setMethods(sorted);
  };

  const renderSortIcon = (path) => {
    const currentSortColumn = { ...sortColumn };
    if (path !== currentSortColumn.path) return null;
    if (currentSortColumn.order === "asc")
      return <i className="fa fa-sort-asc sort-icon"></i>;
    return <i className="fa fa-sort-desc sort-icon"></i>;
  };
  return (
    <div>
      <Brand />

      {methods.length < 1 ? (
        <div style={{ textAlign: "center", marginTop: "3.5em" }}>
          <Intro
            text="We help researchers properly assess the quality of binary classficiation
        models."
          />

          <AddMetricButton />
        </div>
      ) : (
        <div>
          {" "}
          <AddMetricButton />
          <DropDown
            onClickMethod={() => toggleExport()}
            onMatrixExport={() => toggleMatrixExport()}
          />
          <div className="visuals">
            <ReactTooltip
              className="custom-tooltip"
              multiline={true}
              place="right"
            />
            <Modal
              className="modal"
              open={open}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description">
              <ConfusionMatrix
                onClick={() => {
                  setOpen(false);
                }}
                label={confusionMatrixComponents.lbl}
                truePositives={confusionMatrixComponents.tp}
                falseNegatives={confusionMatrixComponents.fn}
                falsePositives={confusionMatrixComponents.fp}
                trueNegatives={confusionMatrixComponents.tn}
              />
            </Modal>
            <Modal
              className="modal"
              open={openExport}
              onClose={handleExportClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description">
              <Exported
                onClick={() => {
                  setOpenExport(false);
                }}
              />
            </Modal>
            <Modal
              className="modal"
              open={openMatrixExport}
              onClose={handleMatrixExportClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description">
              <ExportedMatrices
                onClick={() => {
                  setOpenMatrixExport(false);
                }}
              />
            </Modal>
            {
              <Table striped bordered responsive>
                <thead>
                  <tr>
                    <th
                      className="table-header"
                      onClick={() => handleSort("lbl")}>
                      Label {renderSortIcon("lbl")}
                    </th>
                    <th
                      className="table-header"
                      onClick={() => handleSort("ts")}>
                      TS {renderSortIcon("ts")}{" "}
                    </th>
                    <th
                      className="table-header"
                      onClick={() => handleSort("tp")}>
                      TP {renderSortIcon("tp")}{" "}
                    </th>
                    <th
                      className="table-header"
                      onClick={() => handleSort("fp")}>
                      FP {renderSortIcon("fp")}{" "}
                    </th>
                    <th
                      className="table-header"
                      onClick={() => handleSort("tn")}>
                      TN {renderSortIcon("tn")}{" "}
                    </th>
                    <th
                      className="table-header"
                      onClick={() => handleSort("fn")}>
                      FN {renderSortIcon("fn")}{" "}
                    </th>
                    <th
                      className="table-header"
                      onClick={() => handleSort("acc")}>
                      Accuracy {renderSortIcon("acc")}{" "}
                    </th>
                    <th
                      className="table-header"
                      onClick={() => handleSort("rc")}>
                      <span>RECALL</span> {renderSortIcon("rc")}
                    </th>
                    <th
                      className="table-header"
                      onClick={() => handleSort("prc")}>
                      PRECISION {renderSortIcon("prc")}
                    </th>
                    <th
                      className="table-header"
                      onClick={() => handleSort("f1")}>
                      F1 SCORE {renderSortIcon("f1")}
                    </th>
                    <th
                      className="table-header"
                      onClick={() => handleSort("spf")}>
                      SPECIFICITY {renderSortIcon("spf")}
                    </th>
                    <th
                      className="table-header"
                      onClick={() => handleSort("mcc")}>
                      MCC {renderSortIcon("mcc")}
                    </th>
                    <th
                      className="table-header"
                      onClick={() => handleSort("npv")}>
                      NPV {renderSortIcon("npv")}
                    </th>
                    <th
                      className="table-header"
                      onClick={() => handleSort("ths")}>
                      THREAT SCORE {renderSortIcon("ths")}
                    </th>
                    <th>Settings</th>
                  </tr>
                </thead>
                <tbody>
                  {methods &&
                    methods.map((method, i) => (
                      <tr key={i}>
                        <td
                          style={{ width: "fit-content" }}
                          onClick={() => toggleMethod(method.lbl)}
                          className={
                            mappedMethods.find((e) => e.lbl === method.lbl)
                              ? "label-cell-focus"
                              : "label-cell"
                          }>
                          {method.lbl}
                        </td>
                        <td
                          className={
                            mappedMethods.find((e) => e.lbl === method.lbl)
                              ? "label-cell-focus"
                              : "label-cell"
                          }
                          style={{ width: "fit-content" }}>
                          {" "}
                          {method.ts}
                        </td>
                        <td
                          className={
                            mappedMethods.find((e) => e.lbl === method.lbl)
                              ? "label-cell-focus"
                              : "label-cell"
                          }
                          style={{ width: "fit-content" }}>
                          {" "}
                          {method.tp}
                        </td>
                        <td
                          className={
                            mappedMethods.find((e) => e.lbl === method.lbl)
                              ? "label-cell-focus"
                              : "label-cell"
                          }
                          style={{ width: "fit-content" }}>
                          {" "}
                          {method.fp}
                        </td>
                        <td
                          className={
                            mappedMethods.find((e) => e.lbl === method.lbl)
                              ? "label-cell-focus"
                              : "label-cell"
                          }
                          style={{ width: "fit-content" }}>
                          {" "}
                          {method.tn}
                        </td>
                        <td
                          className={
                            mappedMethods.find((e) => e.lbl === method.lbl)
                              ? "label-cell-focus"
                              : "label-cell"
                          }
                          style={{ width: "fit-content" }}>
                          {" "}
                          {method.fn}
                        </td>
                        <td
                          className={
                            mappedMethods.find((e) => e.lbl === method.lbl)
                              ? "label-cell-focus"
                              : "label-cell"
                          }
                          style={{ width: "fit-content" }}>
                          {" "}
                          {method.acc}
                        </td>
                        <td
                          className={
                            mappedMethods.find((e) => e.lbl === method.lbl)
                              ? "label-cell-focus"
                              : "label-cell"
                          }
                          style={{ width: "fit-content" }}>
                          {" "}
                          {method.rc}
                        </td>
                        <td
                          className={
                            mappedMethods.find((e) => e.lbl === method.lbl)
                              ? "label-cell-focus"
                              : "label-cell"
                          }
                          style={{ width: "fit-content" }}>
                          {method.prc}
                        </td>
                        <td
                          className={
                            mappedMethods.find((e) => e.lbl === method.lbl)
                              ? "label-cell-focus"
                              : "label-cell"
                          }
                          style={{ width: "fit-content" }}>
                          {method.f1}
                        </td>
                        <td
                          className={
                            mappedMethods.find((e) => e.lbl === method.lbl)
                              ? "label-cell-focus"
                              : "label-cell"
                          }
                          style={{ width: "fit-content" }}>
                          {method.spf}
                        </td>
                        <td
                          className={
                            mappedMethods.find((e) => e.lbl === method.lbl)
                              ? "label-cell-focus"
                              : "label-cell"
                          }
                          style={{ width: "7.69" }}>
                          {method.mcc}
                        </td>
                        <td
                          className={
                            mappedMethods.find((e) => e.lbl === method.lbl)
                              ? "label-cell-focus"
                              : "label-cell"
                          }
                          style={{ width: "fit-content" }}>
                          {method.npv}
                        </td>
                        <td
                          className={
                            mappedMethods.find((e) => e.lbl === method.lbl)
                              ? "label-cell-focus"
                              : "label-cell"
                          }
                          style={{ width: "fit-content" }}>
                          {method.ths}
                        </td>
                        <td
                          className={
                            mappedMethods.find((e) => e.lbl === method.lbl)
                              ? "label-cell-focus"
                              : "label-cell"
                          }
                          style={{ width: "fit-content" }}>
                          <div className="settings">
                            <button
                              onClick={() => handleOpen(method.lbl)}
                              className="commands">
                              <i
                                data-tip="Confusion matrix"
                                style={{ color: "#FF9201" }}
                                className="fa fa-th-large"></i>
                            </button>
                            <button
                              onClick={() => editMethod(method.lbl)}
                              className="commands">
                              <i
                                data-tip="Edit method"
                                style={{ color: "#2863B3" }}
                                className="fa fa-pencil-square-o "
                                aria-hidden="true"></i>
                            </button>
                            <button
                              onClick={() => deleteMethod(method.lbl)}
                              className="commands">
                              <i
                                data-tip="Delete method"
                                style={{ color: "#AF262B" }}
                                className="fa fa-close "></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            }
            <div
              style={{ display: mappedMethods.length < 1 ? "none" : "block" }}
              className="radar-wrapper">
              {mappedMethods.length > 0 && (
                <ResponsiveRadar
                  data={processDataForChart(mappedMethods)}
                  keys={extractLabels(mappedMethods)}
                  curve="linearClosed"
                  indexBy="metric"
                  maxValue="auto"
                  margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                  borderWidth={2}
                  gridLevels={5}
                  enableDots={true}
                  dotSize={10}
                  dotBorderWidth={2}
                  dotLabelYOffset={18}
                  blendMode="multiply"
                  legends={[
                    {
                      anchor: "top-left",
                      direction: "column",
                      translateX: -30,
                      translateY: -30,
                      itemWidth: 80,
                      itemHeight: 20,
                      itemTextColor: "#111",
                      symbolSize: 13,
                      symbolShape: "circle",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemTextColor: "#000",
                          },
                        },
                      ],
                    },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <Footer text={` SimulaMet 2021`} />
    </div>
  );
};

export default Home;
