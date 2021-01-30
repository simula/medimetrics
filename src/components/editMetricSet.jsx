import React, { useReducer, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import Joi from "joi-browser";
import { ToastContainer } from "react-toastify";
import { datatips } from "../utils/tooltips";
import ReactTooltip from "react-tooltip";
import { reducer } from "../utils/editFormLogic";
import { convertData } from "../utils/metricsExtraction";
import { schema, disableFormButton } from "../utils/validation";
import { precision3 } from "../utils/metricsExtraction";
import { refs } from "../utils/refs";
import { actions } from "../utils/actions";
import {
  recallFormula,
  precisionFormula,
  f1ScoreFormula,
  accuracyFormula,
  mccFormula,
  npvFormula,
  spfFormula,
  thsFormula,
} from "../utils/formulas";

import {
  invalidInputError,
  duplicateLabelError,
  inputConflictError,
} from "../utils/toasts";

const initialize = () => {
  const methods = JSON.parse(sessionStorage.getItem("methods"));
  const selected =
    methods.length > 0 &&
    methods
      .filter(
        (method) => method.lbl === window.sessionStorage.getItem("current")
      )
      .map((method) => convertData(method));

  return selected[0];
};

const EditMetricSet = ({ history }) => {
  const [state, dispatch] = useReducer(
    reducer,
    {
      lbl: "",
      ts: 0,
      ps: 0,
      ns: 0,
      tp: 0,
      fp: 0,
      tn: 0,
      fn: 0,
      rc: 0,
      prc: 0,
      f1: 0,
      acc: 0,
      mcc: 0,
      spf: 0,
      npv: 0,
      ths: 0,
      err: {
        ts: "",
      },
      tsLock: false,
      psLock: false,
      nsLock: false,
      tpLock: false,
      fnLock: false,
      tnLock: false,
      fpLock: false,
      rcLock: false,
      prcLock: false,
      f1Lock: false,
      accLock: false,
      mccLock: false,
      npvLock: false,
      spfLock: false,
      thsLock: false,
    },
    initialize
  );
  useEffect(() => {
    if (state.err) {
      inputConflictError(state.err);
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const errors = Joi.validate(state, schema, { abortEarly: false });
    if (errors.error != null) {
      console.log(state, errors);
      invalidInputError();
    } else {
      let content = {
        lbl: state.lbl,
        ts: state.ts,
        ps: state.ps,
        ns: state.ns,
        tp: state.tp,
        fp: state.fp,
        tn: state.tn,
        fn: state.fn,
        rc: parseFloat(refs.recall.current.defaultValue, 10),
        prc: parseFloat(refs.precision.current.defaultValue, 10),
        f1: parseFloat(refs.f1Score.current.defaultValue, 10),
        acc: parseFloat(refs.accuracy.current.defaultValue, 10),
        mcc: parseFloat(
          refs.matthewsCorrelationCoefficient.current.defaultValue,
          10
        ),
        spf: parseFloat(refs.specificity.current.defaultValue, 10),
        npv: parseFloat(refs.negativePredictiveValue.current.defaultValue, 10),
        ths: parseFloat(refs.threatScore.current.defaultValue, 10),
      };
      let retrievedMethods = JSON.parse(sessionStorage.getItem("methods"));
      if (retrievedMethods) {
        const label = state.lbl;
        const exists = retrievedMethods
          .filter((e) => e.lbl !== label)
          .find((e) => e.lbl === label);
        if (exists) {
          duplicateLabelError();
        } else {
          let newMethods = [...retrievedMethods];
          let methodtoUpdate = retrievedMethods.find(
            (e) => e.lbl === window.sessionStorage.getItem("current")
          );
          let index = retrievedMethods.indexOf(methodtoUpdate);
          methodtoUpdate = { ...content };
          newMethods[index] = methodtoUpdate;
          sessionStorage.setItem("methods", JSON.stringify(newMethods));
          history.replace("/");
        }
      }
    }
  };

  return (
    <div>
      <ReactTooltip className="custom-tooltip" multiline={true} place="right" />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
      <h4 className="new-method-title">Edit method</h4>
      <form id="add-metric-form" onSubmit={onSubmit}>
        <div className="input-wrapper label-wrapper">
          <label htmlFor="lbl">
            Label
            <i
              style={{
                color: "red",
                fontSize: "0.4em",
                position: "relative",
                bottom: "1.1em",
                left: "0.2em",
              }}
              className="fa fa-asterisk required-icon"
              aria-hidden="true"></i>
          </label>
          <DebounceInput
            className="form-input"
            onChange={(e) =>
              dispatch({ type: actions.ADD_LBL, payload: e.target.value })
            }
            value={state.lbl || ""}
            debounceTimeout={1000}
            name="lbl"
          />
        </div>
        <div className="tspsns">
          <div className="input-wrapper">
            <label htmlFor="ts">Total Samples</label>
            <DebounceInput
              disabled={state.tsLock}
              className={
                (state.ts < 0 && " form-input negative-error ") || "form-input"
              }
              onChange={(e) =>
                dispatch({ type: actions.ADD_TS, payload: +e.target.value })
              }
              value={state.ts || ""}
              debounceTimeout={1000}
              name="ts"
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="ps">Positive Samples</label>
            <DebounceInput
              disabled={state.psLock}
              className={
                (state.ps < 0 && " form-input negative-error ") || "form-input"
              }
              onChange={(e) =>
                dispatch({ type: actions.ADD_PS, payload: +e.target.value })
              }
              value={state.ps || ""}
              debounceTimeout={1000}
              name="ps"
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="ns">Negative Samples</label>
            <DebounceInput
              disabled={state.nsLock}
              className={
                (state.ns < 0 && " form-input negative-error ") || "form-input"
              }
              onChange={(e) =>
                dispatch({ type: actions.ADD_NS, payload: +e.target.value })
              }
              value={state.ns || ""}
              debounceTimeout={1000}
              name="ns"
            />
          </div>
        </div>
        <div className="tpfntnfn">
          <div className="input-wrapper">
            <label htmlFor="tp" className="tooltiped">
              True Positives{" "}
              <i
                className=" fa fa-info-circle form-tooltip"
                data-tip={datatips.tp}></i>
            </label>
            <DebounceInput
              disabled={state.tpLock}
              className={
                (state.tp < 0 && " form-input negative-error ") || "form-input"
              }
              onChange={(e) =>
                dispatch({ type: actions.ADD_TP, payload: +e.target.value })
              }
              value={state.tp || ""}
              debounceTimeout={1000}
              name="tp"
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="fn" className="tooltiped">
              False Negatives{" "}
              <i
                className=" fa fa-info-circle form-tooltip"
                data-tip={datatips.fn}></i>{" "}
            </label>
            <DebounceInput
              disabled={state.fnLock}
              className={
                (state.fn < 0 && " form-input negative-error ") || "form-input"
              }
              onChange={(e) =>
                dispatch({ type: actions.ADD_FN, payload: +e.target.value })
              }
              value={state.fn || ""}
              debounceTimeout={1000}
              name="fn"
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="tn" className="tooltiped">
              True Negatives{" "}
              <i
                className=" fa fa-info-circle form-tooltip"
                data-tip={datatips.tn}></i>
            </label>
            <DebounceInput
              disabled={state.tnLock}
              className={
                (state.tn < 0 && " form-input negative-error ") || "form-input"
              }
              onChange={(e) =>
                dispatch({ type: actions.ADD_TN, payload: +e.target.value })
              }
              value={state.tn || ""}
              debounceTimeout={1000}
              name="tn"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="fp" className="tooltiped">
              False Positives{" "}
              <i
                className=" fa fa-info-circle form-tooltip"
                data-tip={datatips.fp}></i>
            </label>
            <DebounceInput
              disabled={state.fpLock}
              className={
                (state.fp < 0 && " form-input negative-error ") || "form-input"
              }
              onChange={(e) =>
                dispatch({ type: actions.ADD_FP, payload: +e.target.value })
              }
              value={state.fp || ""}
              debounceTimeout={1000}
              name="fp"
            />
          </div>
        </div>
        <div className="input-wrapper">
          <label htmlFor="rc" className="tooltiped">
            Recall{" "}
            <i
              className=" fa fa-info-circle  form-tooltip"
              data-tip={datatips.rc}></i>
          </label>
          <DebounceInput
            disabled={state.rcLock}
            inputRef={refs.recall}
            className={
              (state.rc < 0 && " form-input negative-error ") || "form-input"
            }
            onChange={(e) =>
              dispatch({ type: actions.ADD_RC, payload: +e.target.value })
            }
            value={precision3(recallFormula(state)) || state.rc || ""}
            debounceTimeout={1000}
            name="rc"
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="prc" className="tooltiped">
            Precision{" "}
            <i
              className=" fa fa-info-circle form-tooltip"
              data-tip={datatips.prc}></i>
          </label>
          <DebounceInput
            disabled={state.prcLock}
            inputRef={refs.precision}
            className={
              (state.prc < 0 && " form-input negative-error ") || "form-input"
            }
            onChange={(e) =>
              dispatch({ type: actions.ADD_PRC, payload: +e.target.value })
            }
            value={precision3(precisionFormula(state)) || state.prc || ""}
            debounceTimeout={1000}
            name="prc"
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="f1" className="tooltiped">
            F1-score{" "}
            <i
              className=" fa fa-info-circle form-tooltip"
              data-tip={datatips.f1}></i>
          </label>
          <DebounceInput
            disabled={state.f1Lock}
            inputRef={refs.f1Score}
            className={
              (state.f1 < 0 && " form-input negative-error ") || "form-input"
            }
            onChange={(e) =>
              dispatch({ type: actions.ADD_F1, payload: +e.target.value })
            }
            value={precision3(f1ScoreFormula(state)) || state.f1 || ""}
            debounceTimeout={1000}
            name="f1"
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="acc" className="tooltiped">
            Accuracy{" "}
            <i
              className=" fa fa-info-circle form-tooltip"
              data-tip={datatips.acc}></i>
          </label>
          <DebounceInput
            disabled={state.accLock}
            inputRef={refs.accuracy}
            className={
              (state.acc < 0 && " form-input negative-error ") || "form-input"
            }
            onChange={(e) =>
              dispatch({ type: actions.ADD_ACC, payload: +e.target.value })
            }
            value={precision3(accuracyFormula(state)) || state.acc || ""}
            name="acc"
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="mcc" className="tooltiped">
            MCC{" "}
            <i
              className=" fa fa-info-circle form-tooltip"
              data-tip={datatips.mcc}></i>
          </label>
          <DebounceInput
            disabled={state.mccLock}
            inputRef={refs.matthewsCorrelationCoefficient}
            className={
              (state.mcc < -1 &&
                state.mcc > 1 &&
                " form-input negative-error ") ||
              "form-input"
            }
            onChange={(e) =>
              dispatch({ type: actions.ADD_MCC, payload: +e.target.value })
            }
            value={precision3(mccFormula(state)) || state.mcc || ""}
            debounceTimeout={1000}
            name="mcc"
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="npv" className="tooltiped">
            NPV{" "}
            <i
              className=" fa fa-info-circle form-tooltip"
              data-tip={datatips.npv}></i>
          </label>
          <DebounceInput
            disabled={state.npvLock}
            inputRef={refs.negativePredictiveValue}
            className={
              (state.npv < 0 && " form-input negative-error ") || "form-input"
            }
            onChange={(e) =>
              dispatch({ type: actions.ADD_NPV, payload: +e.target.value })
            }
            value={precision3(npvFormula(state)) || state.npv || ""}
            debounceTimeout={1000}
            name="npv"
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="spf" className="tooltiped">
            Specificity{" "}
            <i
              className=" fa fa-info-circle form-tooltip"
              data-tip={datatips.spf}></i>
          </label>
          <DebounceInput
            disabled={state.spfLock}
            inputRef={refs.specificity}
            className={
              (state.spc < 0 && " form-input negative-error ") || "form-input"
            }
            onChange={(e) =>
              dispatch({ type: actions.ADD_SPF, payload: +e.target.value })
            }
            value={precision3(spfFormula(state)) || state.spf || ""}
            debounceTimeout={1000}
            name="spf"
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="ths" className="tooltiped">
            Threat score{" "}
            <i
              className=" fa fa-info-circle form-tooltip custom-tooltip"
              data-tip={datatips.ths}></i>
          </label>
          <DebounceInput
            disabled={state.thsLock}
            inputRef={refs.threatScore}
            className={
              (state.ths < 0 && " form-input negative-error ") || "form-input"
            }
            onChange={(e) =>
              dispatch({ type: actions.ADD_THS, payload: +e.target.value })
            }
            value={precision3(thsFormula(state)) || state.ths || ""}
            debounceTimeout={1000}
            name="ths"
          />
        </div>

        <button
          disabled={disableFormButton(state)}
          className="btn"
          id="submit-metric-button"
          type="submit">
          Save changes
        </button>
      </form>
    </div>
  );
};
export default EditMetricSet;
