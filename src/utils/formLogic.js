import { actions } from "./actions";
const reg = new RegExp("^[0-9]+$");
const metricReg = new RegExp("[+-]?([0-9]*[.])?[0-9]+");

const reducer = (state, action) => {
  switch (action.type) {
    case actions.ADD_LBL:
      /* IF THE LABEL CHANGES, OTHER FIELDS SHOULD NOT BE UPDATED. */
      return {
        ...state,
        err: "",
        lbl: action.payload.toString(),
      };
    case actions.ADD_TS:
      if (
        (state.ps && state.ns) ||
        (state.tp && state.tn && state.fp && state.fn)
      ) {
        return {
          ...state,
          ts: action.payload,
          ps: 0,
          ns: 0,
          tp: 0,
          tn: 0,
          fp: 0,
          fn: 0,
          rc: 0,
          prc: 0,
          f1: 0,
          acc: 0,
          mcc: 0,
          spf: 0,
          npv: 0,
          ths: 0,
          err: { conflict: "Input conflict" },
        };
      } else if (
        action.payload < 0 ||
        !reg.test(action.payload.toString()) ||
        (state.ps && action.payload < state.ps) ||
        (state.ns && action.payload < state.ns) ||
        (state.tp && action.payload < state.tp) ||
        (state.tn && action.payload < state.tn) ||
        (state.fp && action.payload < state.fp) ||
        (state.fn && action.payload < state.fn)
      ) {
        return {
          ...state,
          err: { ts: "Invalid input for Total samples" },
          psLock: true,
          nsLock: true,
          tpLock: true,
          fpLock: true,
          tnLock: true,
          fnLock: true,
          rcLock: true,
          prcLock: true,
          f1Lock: true,
          accLock: true,
          mccLock: true,
          spfLock: true,
          npvLock: true,
          thsLock: true,
        };
      } else if (
        action.payload === 0 &&
        (state.ps || state.ns || state.tp || state.tn || state.fp || state.fn)
      ) {
        return {
          ...state,
          ts: action.payload,
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
        };
      } else
        return {
          ...state,
          err: { ...state.err, ts: "" },
          psLock: false,
          nsLock: false,
          tpLock: false,
          fpLock: false,
          tnLock: false,
          fnLock: false,
          rcLock: false,
          prcLock: false,
          f1Lock: false,
          accLock: false,
          mccLock: false,
          spfLock: false,
          npvLock: false,
          thsLock: false,
          ts: action.payload,

          /* Method label */
          lbl: state.lbl,

          /* Positive samples */
          ps:
            !state.ps && state.ns
              ? action.payload - state.ns
              : state.ps && state.ns
              ? 0
              : state.ps,

          /* Negative samples */
          ns:
            !state.ns && state.ps
              ? action.payload - state.ps
              : state.ns && state.ps
              ? 0
              : state.ns,

          /* True positives */

          tp:
            state.tp && state.fp && state.tn && state.fn
              ? 0
              : state.ps && state.fn
              ? state.ps - state.fn
              : state.fn &&
                state.tn &&
                state.fp + (state.fn + state.tn + state.fp <= action.payload)
              ? action.payload - (state.fn + state.tn + state.fp)
              : state.ns && state.fn
              ? action.payload - (state.ns + state.fn)
              : state.tp,

          /* False negatives */

          fn:
            state.tp && state.fp && state.tn && state.fn
              ? 0
              : state.ps && state.tp
              ? state.ps - state.tp
              : state.tp &&
                state.tn &&
                state.fp &&
                state.tp + state.tn + state.fp <= action.payload
              ? action.payload - (state.tp + state.tn + state.fp)
              : state.ns && state.tp
              ? action.payload - (state.ns + state.tp)
              : state.fn,

          /* True negatives */
          tn:
            state.tp && state.fp && state.tn && state.fn
              ? 0
              : state.ns && state.fp
              ? state.ns - state.fp
              : state.tp &&
                state.fp &&
                state.fn &&
                state.tp + state.fp + state.fn <= action.payload
              ? action.payload - (state.tp + state.fp + state.fn)
              : state.ps && state.fp
              ? action.payload - (state.ps + state.fp)
              : state.tn,

          /* False positives */

          fp:
            state.tp && state.fp && state.tn && state.fn
              ? 0
              : state.ns && state.tn
              ? state.ns - state.tn
              : state.tp &&
                state.tn &&
                state.fn &&
                state.tp + state.tn + state.fn <= action.payload
              ? action.payload - (state.tp + state.tn + state.fn)
              : state.ps && state.tn
              ? action.payload - (state.ps + state.tn)
              : state.fp,
        };
    case actions.ADD_PS:
      if (
        action.payload < 0 ||
        !reg.test(action.payload.toString()) ||
        (state.ts && action.payload > state.ts) ||
        (state.tp && action.payload > 0 && action.payload < state.tp) ||
        (state.fn && action.payload > 0 && action.payload < state.fn)
      ) {
        return {
          ...state,
          err: { ps: "Invalid input for Positive samples" },
          tsLock: true,
          nsLock: true,
          tpLock: true,
          fpLock: true,
          tnLock: true,
          fnLock: true,
          rcLock: true,
          prcLock: true,
          f1Lock: true,
          accLock: true,
          mccLock: true,
          spfLock: true,
          npvLock: true,
          thsLock: true,
        };
      } else if (
        (state.tp > 0 &&
          state.fn > 0 &&
          action.payload !== state.tp + state.fn) ||
        (action.payload < state.ps &&
          (state.ps === state.tp || state.ps === state.fn))
      ) {
        return {
          ...state,
          tp: 0,
          fn: 0,
          rc: 0,
          prc: 0,
          ts: state.ns ? state.ns + action.payload : state.ts,
          ns: state.ns
            ? state.ns
            : state.ts >= action.payload
            ? state.ts - action.payload
            : state.ns,
          ps: action.payload,
          tsLock: false,
          nsLock: false,
          tpLock: false,
          fpLock: false,
          tnLock: false,
          fnLock: false,
          rcLock: false,
          prcLock: false,
          f1Lock: false,
          accLock: false,
          mccLock: false,
          spfLock: false,
          npvLock: false,
          thsLock: false,
          err:
            (state.tp && state.fn) || state.ps
              ? { conflict: "Input conflict" }
              : { conflict: "" },
        };
      } else
        return {
          ...state,
          err: { ...state.err, ps: "", conflict: "" },
          tsLock: false,
          nsLock: false,
          tpLock: false,
          fpLock: false,
          tnLock: false,
          fnLock: false,
          rcLock: false,
          prcLock: false,
          f1Lock: false,
          accLock: false,
          mccLock: false,
          spfLock: false,
          npvLock: false,
          thsLock: false,
          ps: action.payload,
          lbl: state.lbl,
          /* Total samples */
          ts: state.ns && state.ns >= 0 ? state.ns + action.payload : state.ts,

          /* Negative Samples */
          ns: state.ns
            ? state.ns
            : (state.ns && state.ts) || (!state.ns && state.ts)
            ? state.ts - action.payload
            : state.ns,

          /* True Positives */
          tp: state.fn
            ? action.payload - state.fn
            : state.rc
            ? Math.round(action.payload * state.rc)
            : state.tp,

          /* False Negatives */
          fn: state.tp
            ? action.payload - state.tp
            : state.rc
            ? action.payload - Math.round(action.payload * state.rc)
            : state.fn,

          /* True negatives */

          tn:
            state.ns && state.fp
              ? state.ns - state.fp
              : state.ts & state.tp && state.fn & state.fp
              ? state.ts - (state.tp + state.fn + state.fp)
              : state.ts && state.fp
              ? state.ts - (action.payload + state.fp)
              : state.tn,

          /* False positives */

          fp:
            state.ns && state.tn
              ? state.ns - state.tn
              : state.ts & state.tp && state.fn & state.tn
              ? state.ts - (state.tp + state.fn + state.tn)
              : state.ts && state.tn
              ? state.ts - (action.payload + state.tn)
              : state.fp,

          /* RECALL*/
          rc: state.rc
            ? 0
            : state.fn
            ? (action.payload - state.fn) / action.payload
            : state.tp
            ? state.tp / action.payload
            : state.rc,

          /* PRECISION*/
          prc:
            state.tp && state.fp
              ? state.tp / (state.tp + state.fp)
              : state.fn && state.fp
              ? (action.payload - state.fn) /
                (action.payload - state.fn + state.fp)
              : state.prc,

          /* F1-SCORE*/
          f1:
            state.tp && state.fp && state.fn
              ? (2 * state.tp) / (2 * state.tp + state.fp + state.fn)
              : state.fp && state.tp
              ? (2 * state.tp) /
                (2 * state.tp + state.fp + (action.payload - state.tp))
              : state.fp && state.fn
              ? (2 * (action.payload - state.fn)) /
                (2 * (action.payload - state.fn) + state.fp + state.fn)
              : state.f1,

          /* Matthews Correlation Coefficient*/
          mcc: state.mcc
            ? 0
            : state.fp && state.fn && state.tn
            ? ((action.payload - state.fn) * state.tn - state.fp * state.fn) /
              Math.sqrt(
                (action.payload - state.fn + state.fp) *
                  (action.payload - state.fn + state.fn) *
                  (state.tn + state.fp) *
                  (state.tn + state.fn)
              )
            : state.tp && state.tn && state.fp
            ? (state.tp * state.tn - state.fp * (action.payload - state.tp)) /
              Math.sqrt(
                (state.tp + state.fp) *
                  action.payload *
                  (state.tn + state.fp) *
                  (state.tn + (action.payload - state.tp))
              )
            : state.mcc,
          /* Accuracy*/
          acc:
            state.fp && state.fn && state.tn
              ? (action.payload - state.fn + state.tn) /
                (action.payload + state.fp + state.tn)
              : state.fp && state.tp && state.tn
              ? (state.tp + state.tn) / (action.payload + state.fp + state.tn)
              : state.acc,

          /* Negative Predicitve value*/

          npv:
            state.tn && state.fn
              ? state.tn / (state.tn + state.fn)
              : state.tn && state.tp
              ? state.tn / (state.tn + (action.payload - state.tp))
              : state.npv,

          /* Specificity*/

          spf:
            state.tn && state.fp
              ? state.tn / (state.tn + state.fp)
              : state.tn && state.ns
              ? state.tn / state.ns
              : state.spf,

          /* Threat score */
          ths:
            state.tp && state.fp
              ? state.tp / (state.fp + action.payload)
              : state.fn && state.fp
              ? (action.payload - state.fn) / (state.fp + action.payload)
              : state.ths,
        };
    case actions.ADD_NS:
      if (
        action.payload < 0 ||
        !reg.test(action.payload.toString()) ||
        (state.ts && action.payload > state.ts) ||
        (state.tn && action.payload > 0 && action.payload < state.tn) ||
        (state.fp && action.payload > 0 && action.payload < state.fp)
      ) {
        return {
          ...state,
          ns: action.payload,
          err: { ns: "Invalid input for Negative samples" },
          tsLock: true,
          psLock: true,
          tpLock: true,
          fpLock: true,
          tnLock: true,
          fnLock: true,
          rcLock: true,
          prcLock: true,
          f1Lock: true,
          accLock: true,
          mccLock: true,
          spfLock: true,
          npvLock: true,
          thsLock: true,
        };
      } else if (
        (state.tn > 0 &&
          state.fp > 0 &&
          action.payload !== state.tn + state.fp) ||
        (action.payload < state.ns &&
          (state.ns === state.fp || state.ns === state.tn))
      ) {
        return {
          ...state,
          tn: 0,
          fp: 0,
          rc: 0,
          prc: 0,
          ts: state.ps > 0 ? state.ps + action.payload : state.ts,
          ns: action.payload,
          ps: state.ps
            ? state.ps
            : state.ts && state.ts >= action.payload
            ? state.ts - action.payload
            : state.ps,
          tsLock: false,
          psLock: false,
          tpLock: false,
          fpLock: false,
          tnLock: false,
          fnLock: false,
          rcLock: false,
          prcLock: false,
          f1Lock: false,
          accLock: false,
          mccLock: false,
          spfLock: false,
          npvLock: false,
          thsLock: false,
          err:
            (state.fp && state.tn) || state.ns
              ? { conflict: "Input conflict" }
              : { conflict: "" },
        };
      } else
        return {
          ...state,
          err: { ...state.err, ns: "", conflict: "" },
          tsLock: false,
          psLock: false,
          tpLock: false,
          fpLock: false,
          tnLock: false,
          fnLock: false,
          rcLock: false,
          prcLock: false,
          f1Lock: false,
          accLock: false,
          mccLock: false,
          spfLock: false,
          npvLock: false,
          thsLock: false,
          ns: action.payload,
          lbl: state.lbl,
          /* Total samples */
          ts: state.ps && state.ps >= 0 ? state.ps + action.payload : state.ts,

          /* Negative Samples */
          ps: state.ps
            ? state.ps
            : (state.ps && state.ts) || (!state.ps && state.ts)
            ? state.ts - action.payload
            : state.ps,

          /* False positives */
          fp:
            state.fp && state.tn
              ? 0
              : state.tn
              ? action.payload - state.tn
              : state.fp,

          /* True negatives */
          tn:
            state.fp && state.tn
              ? 0
              : state.fp
              ? action.payload - state.fp
              : state.tp && state.prc
              ? action.payload - Math.round(state.tp / state.prc - state.tp)
              : state.tn,

          /* True positives */

          tp:
            state.ps && state.fn
              ? state.ps - state.fn
              : state.ts & state.fp && state.fn & state.tn
              ? state.ts - (state.fp + state.fn + state.tn)
              : state.ts && state.fn
              ? state.ts - (action.payload + state.fn)
              : state.tp,

          /* False negatives */
          fn:
            state.ps && state.tp
              ? state.ps - state.tp
              : state.ts & state.fp && state.tp & state.tn
              ? state.ts - (state.fp + state.tp + state.tn)
              : state.ts && state.tp
              ? state.ts - (action.payload + state.tp)
              : state.fn,

          /* RECALL*/
          rc:
            state.tp && state.fn ? state.tp / (state.tp + state.fn) : state.rc,

          /* PRECISION*/
          prc:
            state.tp && state.fp
              ? state.tp / (state.tp + state.fp)
              : state.tp && state.tn
              ? state.tp / (state.tp + (action.payload - state.tn))
              : state.prc,

          /* F1-SCORE*/
          f1:
            state.tp && state.fp && state.fn
              ? (2 * state.tp) / (2 * state.tp + state.fp + state.fn)
              : state.fn && state.tp && state.tn
              ? (2 * state.tp) /
                (2 * state.tp + state.fn + (action.payload - state.tn))
              : state.f1,

          /* Matthews Correlation Coefficient*/
          mcc:
            state.fp && state.fn && state.tp
              ? (state.tp * (action.payload - state.fp) - state.fp * state.fn) /
                Math.sqrt(
                  (state.tp + state.fp) *
                    (state.tp + state.fn) *
                    action.payload *
                    (action.payload - state.fp + state.fn)
                )
              : state.tp && state.tn && state.fn
              ? (state.tp * state.tn - (action.payload - state.tn) * state.fn) /
                Math.sqrt(
                  (state.tp + action.payload - state.tn) *
                    (state.tp + state.fn) *
                    action.payload *
                    (action.payload - state.tn + state.fn)
                )
              : state.mcc,
          /* Accuracy*/
          acc:
            state.tp && state.fn && state.tn
              ? (state.tp + state.tn) / (action.payload + state.tp + state.fn)
              : state.fn && state.tp && state.fp
              ? (state.tp + (action.payload - state.fp)) /
                (action.payload + state.fn + state.tp)
              : state.acc,

          /* Negative Predicitve value*/

          npv:
            state.tn && state.fn
              ? state.tn / (state.tn + state.fn)
              : state.fn && state.fp
              ? (action.payload - state.fp) /
                (state.fn + action.payload - state.fp)
              : state.npv,

          /* Specificity*/

          spf: state.tn
            ? state.tn / action.payload
            : state.fp
            ? (action.payload - state.fp) / action.payload
            : state.spf,
          ths:
            state.tp && state.fp && state.fn
              ? state.tp / (state.tp + state.fn + state.fp)
              : state.ps && state.fn && state.fp
              ? (state.ps - state.fn) / (state.ps + state.fp)
              : state.tp && state.fn && state.tn
              ? state.tp / (state.tp + state.fn + action.payload - state.tn)
              : state.ps && state.fn && state.tn
              ? (state.ps - state.fn) / (state.ps + action.payload - state.tn)
              : state.ths,
        };
    case actions.ADD_TP:
      if (
        action.payload < 0 ||
        !reg.test(action.payload.toString()) ||
        (state.ts && action.payload > state.ts) ||
        (state.ps && action.payload > state.ps)
      ) {
        return {
          ...state,
          err: { tp: "Invalid input for true positives" },
          tsLock: true,
          psLock: true,
          nsLock: true,
          fnLock: true,
          fpLock: true,
          tnLock: true,
          rcLock: true,
          prcLock: true,
          f1Lock: true,
          accLock: true,
          mccLock: true,
          spfLock: true,
          npvLock: true,
          thsLock: true,
        };
      }
      return {
        ...state,
        tsLock: false,
        psLock: false,
        nsLock: false,
        fnLock: false,
        fpLock: false,
        tnLock: false,
        rcLock: false,
        prcLock: false,
        f1Lock: false,
        accLock: false,
        mccLock: false,
        spfLock: false,
        npvLock: false,
        thsLock: false,
        tp: action.payload,
        err: { ...state.err, tp: "", conflict: "" },
        lbl: state.lbl,

        /* TOTAL SAMPLES*/
        ts: state.ts
          ? state.ts
          : state.fn && state.ns
          ? state.fn + action.payload + state.ns
          : state.fp && state.tn && state.fn
          ? state.fp + state.tn + state.fn + action.payload
          : state.ts,

        /* POSITIVE SAMPLES */
        ps: state.ps
          ? state.ps
          : state.fn
          ? state.fn + action.payload
          : state.ps,

        /* Negative Samples */

        ns: state.ns
          ? state.ns
          : state.ts && state.fn
          ? state.ts - (state.fn + action.payload)
          : state.ns,

        /* FALSE NEGATIVES */
        fn:
          state.ps && action.payload <= state.ps
            ? state.ps - action.payload
            : state.ts &&
              state.tn &&
              state.fp &&
              action.payload + state.tn + state.fp <= state.ts
            ? state.ts - (action.payload + state.tn + state.fp)
            : state.fn,

        /* TRUE NEGATIVES */
        tn: state.tn
          ? state.tn
          : !state.tn && state.ts && state.fn && state.fp && !state.ns
          ? state.ts - (action.payload + state.fn + state.fp)
          : state.ns && state.prc
          ? state.ns - Math.round(action.payload / state.prc - action.payload)
          : state.tn,

        /* FALSE POSITIVES */
        fp: state.fp
          ? state.fp
          : !state.fp && state.ts && state.fn && state.tn && !state.ns
          ? state.ts - (action.payload + state.fn + state.tn)
          : state.prc
          ? Math.round(action.payload / state.prc - action.payload)
          : state.fp,

        /* RECALL*/
        rc:
          (state.fn && action.payload / (action.payload + state.fn)) ||
          (state.ps && action.payload / state.ps) ||
          state.rc,

        /* PRECISION*/
        prc: state.fp
          ? action.payload / (action.payload + state.fp)
          : state.ns && state.tn && state.ns > state.tn
          ? action.payload / (action.payload + (state.ns - state.tn))
          : state.prc,

        /* F1-SCORE*/
        f1:
          state.fp && state.fn
            ? (2 * action.payload) / (2 * action.payload + state.fp + state.fn)
            : state.fp && state.ps
            ? (2 * action.payload) /
              (2 * action.payload + state.fp + (state.ps - action.payload))
            : state.f1,

        /* Matthews Correlation Coefficient*/
        mcc:
          state.fp && state.fn && state.tn
            ? (action.payload * state.tn - state.fp * state.fn) /
              Math.sqrt(
                (action.payload + state.fp) *
                  (action.payload + state.fn) *
                  (state.tn + state.fp) *
                  (state.tn + state.fn)
              )
            : state.ps && state.tn && state.fp
            ? (action.payload * state.tn -
                state.fp * (state.ps - action.payload)) /
              Math.sqrt(
                (action.payload + state.fp) *
                  (action.payload + state.ps - action.payload) *
                  (state.tn + state.fp) *
                  (state.tn + state.ps - action.payload)
              )
            : state.mcc,
        /* Accuracy*/
        acc:
          state.fp && state.fn && state.tn
            ? (action.payload + state.tn) /
              (action.payload + state.fp + state.fn + state.tn)
            : state.fp && state.ps && state.tn
            ? (action.payload + state.tn) /
              (action.payload +
                state.fp +
                (state.ps - action.payload) +
                state.tn)
            : state.acc,

        /* Negative Predicitve value*/
        npv:
          state.tn && state.ps
            ? state.tn / (state.tn + (state.ps - action.payload))
            : state.npv,

        /* Specificity*/

        spf:
          state.tn && state.fp ? state.tn / (state.tn + state.fp) : state.spf,

        /* Threat score */

        ths:
          state.ps && state.fp
            ? action.payload / (state.ps + state.fp)
            : state.fn && state.fp
            ? action.payload / (action.payload + state.fn + state.fp)
            : state.ths,
      };

    case actions.ADD_FN:
      if (
        action.payload < 0 ||
        !reg.test(action.payload.toString()) ||
        (state.ts && action.payload > state.ts) ||
        (state.ps && action.payload > state.ps)
      ) {
        return {
          ...state,
          err: { fn: "Invalid input for false negatives" },
          tsLock: true,
          psLock: true,
          nsLock: true,
          tpLock: true,
          fpLock: true,
          tnLock: true,
          rcLock: true,
          prcLock: true,
          f1Lock: true,
          accLock: true,
          mccLock: true,
          spfLock: true,
          npvLock: true,
          thsLock: true,
        };
      }
      return {
        ...state,
        tsLock: false,
        psLock: false,
        nsLock: false,
        tpLock: false,
        fpLock: false,
        tnLock: false,
        rcLock: false,
        prcLock: false,
        f1Lock: false,
        accLock: false,
        mccLock: false,
        spfLock: false,
        npvLock: false,
        thsLock: false,
        fn: action.payload,
        err: { ...state.err, fn: "", conflict: "" },
        lbl: state.lbl,
        /* Total Samples */
        ts: state.ts
          ? state.ts
          : state.tp && state.ns
          ? state.tp + action.payload + state.ns
          : state.fp && state.tn && state.tp
          ? state.fp + state.tn + state.tp + action.payload
          : state.ts,

        /* POSITIVE SAMPLES */
        ps: state.ps
          ? state.ps
          : state.tp
          ? state.tp + action.payload
          : state.ps,

        /* Negative Samples */

        ns: state.ns
          ? state.ns
          : state.ts && state.tp
          ? state.ts - (state.tp + action.payload)
          : state.ns,

        /* TRUE POSITIVES */
        tp:
          state.ps && action.payload <= state.ps
            ? state.ps - action.payload
            : state.ts &&
              state.tn &&
              state.fp &&
              action.payload + state.tn + state.fp <= state.ts
            ? state.ts - (action.payload + state.tn + state.fp)
            : state.tp,

        /* TRUE NEGATIVES */
        tn: state.tn
          ? state.tn
          : !state.tn && state.ts && state.tp && state.fp && !state.ns
          ? state.ts - (action.payload + state.tp + state.fp)
          : state.tn,

        /* FALSE POSITIVES */
        fp: state.fp
          ? state.fp
          : !state.fp && state.ts && state.tp && state.tn && !state.ns
          ? state.ts - (action.payload + state.tp + state.tn)
          : state.fp,
        /* RECALL*/
        rc: state.tp
          ? state.tp / (action.payload + state.tp)
          : state.ps
          ? (state.ps - action.payload) / state.ps
          : state.rc,

        /* PRECISION */
        prc:
          state.tp && state.fp
            ? state.tp / (state.tp + state.fp)
            : state.fp && state.ps
            ? (state.ps - action.payload) /
              (state.fp + state.ps - action.payload)
            : state.prc,

        /* F1-SCORE*/
        f1:
          state.fp && state.tp
            ? (2 * state.tp) / (2 * state.tp + state.fp + action.payload)
            : state.fp && state.ps
            ? (2 * (state.ps - action.payload)) /
              (2 * (state.ps - action.payload) + state.fp + action.payload)
            : state.f1,

        /* Matthews Correlation Coefficient*/
        mcc:
          state.fp && state.tp && state.tn
            ? (state.tp * state.tn - state.fp * action.payload) /
              Math.sqrt(
                (state.tp + state.fp) *
                  (state.tp + action.payload) *
                  (state.tn + state.fp) *
                  (state.tn + action.payload)
              )
            : state.fp && state.ps && state.tn
            ? ((state.ps - action.payload) * state.tn -
                state.fp * action.payload) /
              Math.sqrt(
                (state.ps - action.payload + state.fp) *
                  (state.ps - action.payload + action.payload) *
                  (state.tn + state.fp) *
                  (state.tn + action.payload)
              )
            : state.mcc,

        /* Accuracy*/
        acc:
          state.fp && state.tp && state.tn
            ? (state.tp + state.tn) /
              (state.tp + state.fp + action.payload + state.tn)
            : state.fp && state.ps && state.tn
            ? (state.ps - action.payload + state.tn) /
              (action.payload +
                state.fp +
                (state.ps - action.payload) +
                state.tn)
            : state.acc,

        /* Negative Predictive Value*/
        npv: state.tn ? state.tn / (state.tn + action.payload) : state.npv,

        /* Specificity*/

        spf:
          state.tn && state.fp ? state.tn / (state.tn + state.fp) : state.spf,

        /* Threat score */
        ths:
          state.tp && state.fp
            ? state.tp / (state.tp + action.payload + state.fp)
            : state.ps && state.fp
            ? (state.ps - action.payload) / (state.ps + state.fp)
            : state.ths,
      };
    case actions.ADD_FP:
      if (
        action.payload < 0 ||
        !reg.test(action.payload.toString()) ||
        (state.ts && action.payload > state.ts) ||
        (state.ns && action.payload > state.ns)
      ) {
        return {
          ...state,
          err: { fp: "Invalid input for false positives" },
          tsLock: true,
          psLock: true,
          nsLock: true,
          tpLock: true,
          fnLock: true,
          tnLock: true,
          rcLock: true,
          prcLock: true,
          f1Lock: true,
          accLock: true,
          mccLock: true,
          spfLock: true,
          npvLock: true,
          thsLock: true,
        };
      }
      return {
        ...state,
        tsLock: false,
        psLock: false,
        nsLock: false,
        tpLock: false,
        fnLock: false,
        tnLock: false,
        rcLock: false,
        prcLock: false,
        f1Lock: false,
        accLock: false,
        mccLock: false,
        spfLock: false,
        npvLock: false,
        thsLock: false,
        err: { ...state.err, fp: "", conflict: "" },
        fp: action.payload,
        lbl: state.lbl,

        /* True Negatives */
        tn:
          state.ns && action.payload <= state.ns
            ? state.ns - action.payload
            : state.ts &&
              state.tp &&
              state.fn &&
              action.payload + state.tp + state.fn <= state.ts
            ? state.ts - (action.payload + state.tp + state.fn)
            : state.tn,

        /* False Negatives */

        fn: state.fn
          ? state.fn
          : state.ts && state.tp && state.tn && !state.ps
          ? state.ts - (action.payload + state.tp + state.tn)
          : state.fn,

        /* True Positives */

        tp: state.tp
          ? state.tp
          : state.ts && state.fn && state.tn && !state.ps
          ? state.ts - (action.payload + state.fn + state.tn)
          : state.tp,

        /* Negative Samples */

        ns: state.ns
          ? state.ns
          : state.tn
          ? state.tn + action.payload
          : state.ns,

        /* Positive Samples */

        ps: state.ps
          ? state.ps
          : state.ts && state.tn
          ? state.ts - (state.tn + action.payload)
          : state.ps,

        /* Total Samples */
        ts: state.ts
          ? state.ts
          : state.tn && state.ps
          ? state.tn + action.payload + state.ps
          : state.ts,

        /* Precision */
        prc: state.tp ? state.tp / (action.payload + state.tp) : state.prc,

        /* f1-score */
        f1:
          state.tp && state.fn
            ? (2 * state.tp) / (2 * state.tp + action.payload + state.fn)
            : state.f1,

        /* Matthews Correlation Coefficient*/
        mcc:
          state.fn && state.tp && state.tn
            ? (state.tp * state.tn - state.fn * action.payload) /
              Math.sqrt(
                (state.tp + action.payload) *
                  (state.tp + state.fn) *
                  (state.tn + action.payload) *
                  (state.tn + state.fn)
              )
            : state.fn && state.tp && state.ns
            ? (state.tp * (state.ns - action.payload) -
                state.fn * action.payload) /
              Math.sqrt(
                (state.tp + action.payload) *
                  (state.tp + state.fn) *
                  state.ns *
                  (state.ns - action.payload + state.fn)
              )
            : state.mcc,

        /* Accuracy*/
        acc:
          state.fn && state.tp && state.tn
            ? (state.tp + state.tn) /
              (state.tp + state.fn + action.payload + state.tn)
            : state.fn && state.ns && state.tp
            ? (state.tp + (state.ns - action.payload)) /
              (action.payload +
                state.fn +
                (state.ns - action.payload) +
                state.tp)
            : state.acc,

        /* Specificity*/

        spf: state.tn
          ? state.tn / (state.tn + action.payload)
          : state.ns
          ? (state.ns - action.payload) / state.ns
          : state.spf,

        /* RECALL*/
        rc:
          state.tp && state.fn
            ? state.tp / (state.tp + state.fn)
            : state.tp && state.ps
            ? state.tp / state.ps
            : state.rc,

        /* Negative Predictive Value*/
        npv:
          state.tn && state.fn
            ? state.tn / (state.fn + state.tn)
            : state.ns && state.fn
            ? (state.ns - action.payload) /
              (state.ns - action.payload + state.fn)
            : state.npv,

        /* Threat score */
        ths:
          state.tp && state.fn
            ? state.tp / (state.tp + state.fn + action.payload)
            : state.tp && state.ps
            ? state.tp / (state.ps + action.payload)
            : state.ths,
      };
    case actions.ADD_TN:
      if (
        action.payload < 0 ||
        !reg.test(action.payload.toString()) ||
        (state.ts && action.payload > state.ts) ||
        (state.ns && action.payload > state.ns)
      ) {
        return {
          ...state,
          err: { tn: "Invalid input for true negatives" },
          tsLock: true,
          psLock: true,
          nsLock: true,
          tpLock: true,
          fnLock: true,
          fpLock: true,
          rcLock: true,
          prcLock: true,
          f1Lock: true,
          accLock: true,
          mccLock: true,
          spfLock: true,
          npvLock: true,
          thsLock: true,
        };
      }
      return {
        ...state,
        tsLock: false,
        psLock: false,
        nsLock: false,
        tpLock: false,
        fnLock: false,
        fpLock: false,
        rcLock: false,
        prcLock: false,
        f1Lock: false,
        accLock: false,
        mccLock: false,
        spfLock: false,
        npvLock: false,
        thsLock: false,
        err: { ...state.err, tn: "", conflict: "" },
        tn: action.payload,
        lbl: state.lbl,
        /* False Positives */
        fp:
          state.ns && action.payload <= state.ns
            ? state.ns - action.payload
            : state.ts &&
              state.tp &&
              state.fn &&
              action.payload + state.tp + state.fn <= state.ts
            ? state.ts - (action.payload + state.tp + state.fn)
            : state.fp,

        /* False Negatives */

        fn: state.fn
          ? state.fn
          : state.ts && state.tp && state.fp && !state.ps
          ? state.ts - (action.payload + state.tp + state.fp)
          : state.ps && state.tp
          ? state.ps - state.tp
          : state.fn,

        /* True Positives */

        tp: state.tp
          ? state.tp
          : state.ts && state.fn && state.fp && !state.ps
          ? state.ts - (action.payload + state.fn + state.fp)
          : state.tp,

        /* Negative Samples */

        ns: state.ns
          ? state.ns
          : state.fp
          ? state.fp + action.payload
          : state.ns,

        /* Positive Samples */

        ps: state.ps
          ? state.ps
          : state.ts && state.fp
          ? state.ts - (state.fp + action.payload)
          : state.ps,

        /* Total Samples */
        ts: state.ts
          ? state.ts
          : state.fp && state.ps
          ? state.fp + action.payload + state.ps
          : state.ts,

        /* Matthews Correlation Coefficient*/
        mcc:
          state.fn && state.tp && state.fp
            ? (state.tp * action.payload - state.fn * state.fp) /
              Math.sqrt(
                (state.tp + state.fp) *
                  (state.tp + state.fn) *
                  (state.fp + action.payload) *
                  (action.payload + state.fn)
              )
            : state.fn && state.tp && state.ns
            ? (state.tp * action.payload -
                state.fn * (state.ns - action.payload)) /
              Math.sqrt(
                (state.tp + (state.ns - action.payload)) *
                  (state.tp + state.fn) *
                  (state.ns - action.payload + action.payload) *
                  (action.payload + state.fn)
              )
            : state.mcc,

        /* Accuracy*/
        acc:
          state.fn && state.tp && state.fp
            ? (state.tp + action.payload) /
              (state.tp + state.fn + state.fp + action.payload)
            : state.fn && state.ns && state.tp
            ? (state.tp + action.payload) /
              (action.payload +
                state.fn +
                (state.ns - action.payload) +
                state.tp)
            : state.acc,

        /* Negative Predictive Value*/
        npv: state.fn
          ? action.payload / (state.fn + action.payload)
          : state.npv,

        /* Specificity*/

        spf: state.fp
          ? action.payload / (state.fp + action.payload)
          : state.ns
          ? action.payload / state.ns
          : state.spf,

        /* F1-score*/

        f1:
          state.tp && state.fn
            ? (2 * state.tp) / (2 * state.tp + action.payload + state.fn)
            : state.f1,

        /* Precision */
        prc:
          state.tp && state.fp
            ? state.tp / (state.fp + state.tp)
            : state.ns && state.tp
            ? state.tp / (state.tp + state.ns - action.payload)
            : state.prc,

        /* RECALL*/
        rc:
          state.tp && state.fn
            ? state.tp / (state.tp + state.fn)
            : state.tp && state.ps
            ? state.tp / state.ps
            : state.rc,

        /* Threat score */
        ths:
          state.tp && state.fn && state.fp
            ? state.tp / (state.tp + state.fn + state.fp)
            : state.tp && state.ps && state.fp
            ? state.tp / (state.ps + state.fp)
            : state.fn && state.ps && state.fp
            ? (state.ps - state.fn) / (state.ps + state.fp)
            : state.tp && state.fn && state.ns
            ? state.tp / (state.tp + state.fn + state.ns - action.payload)
            : state.tp && state.ps && state.ns
            ? state.tp / (state.ps + state.ns - action.payload)
            : state.ps && state.fn && state.ns
            ? (state.ps - state.fn) /
              (state.ps + action.payload - action.payload)
            : state.ths,
      };
    case actions.ADD_RC:
      if (
        action.payload < 0 ||
        action.payload > 1 ||
        !metricReg.test(action.payload.toString())
      )
        return {
          ...state,
          err: { rc: "Invalid input for recall" },
          tsLock: true,
          psLock: true,
          nsLock: true,
          tpLock: true,
          fnLock: true,
          fpLock: true,
          tnLock: true,
          prcLock: true,
          f1Lock: true,
          accLock: true,
          mccLock: true,
          spfLock: true,
          npvLock: true,
          thsLock: true,
        };
      return {
        ...state,
        err: { rc: "" },
        tsLock: false,
        psLock: false,
        nsLock: false,
        tpLock: false,
        fnLock: false,
        fpLock: false,
        tnLock: false,
        prcLock: false,
        f1Lock: false,
        accLock: false,
        mccLock: false,
        spfLock: false,
        npvLock: false,
        thsLock: false,
        rc: action.payload,
        lbl: state.lbl,
        f1: state.prc
          ? (2 * state.prc * action.payload) / (state.prc + action.payload)
          : state.f1,
        tp: state.ps ? Math.round(state.ps * action.payload) : state.tp,
        fn: state.ps
          ? state.ps - Math.round(state.ps * action.payload)
          : state.fn,
      };
    case actions.ADD_PRC:
      if (
        action.payload < 0 ||
        action.payload > 1 ||
        !metricReg.test(action.payload.toString())
      )
        return {
          ...state,
          err: { prc: "Invalid input for precision" },
          tsLock: true,
          psLock: true,
          nsLock: true,
          tpLock: true,
          fnLock: true,
          tnLock: true,
          fpLock: true,
          rcLock: true,
          f1Lock: true,
          accLock: true,
          mccLock: true,
          spfLock: true,
          npvLock: true,
          thsLock: true,
        };
      return {
        ...state,
        err: { prc: "" },
        tsLock: false,
        psLock: false,
        nsLock: false,
        tpLock: false,
        fpLock: false,
        fnLock: false,
        tnLock: false,
        rcLock: false,
        f1Lock: false,
        accLock: false,
        mccLock: false,
        spfLock: false,
        npvLock: false,
        thsLock: false,
        prc: action.payload,
        lbl: state.lbl,
        f1: state.rc
          ? (2 * state.rc * action.payload) / (state.rc + action.payload)
          : state.f1,
        fp: state.tp
          ? Math.round(state.tp / action.payload - state.tp)
          : state.fp,
        tn:
          state.tp && state.ns
            ? state.ns - Math.round(state.tp / action.payload - state.tp)
            : state.tn,
      };

    case actions.ADD_F1:
      if (
        action.payload < 0 ||
        action.payload > 1 ||
        !metricReg.test(action.payload.toString())
      )
        return {
          ...state,
          err: { f1: "Invalid input for F1 score" },
          tsLock: true,
          psLock: true,
          nsLock: true,
          tpLock: true,
          fnLock: true,
          tnLock: true,
          fpLock: true,
          rcLock: true,
          prcLock: true,
          accLock: true,
          mccLock: true,
          spfLock: true,
          npvLock: true,
          thsLock: true,
        };
      return {
        ...state,
        err: { f1: "" },
        tsLock: false,
        psLock: false,
        nsLock: false,
        fpLock: false,
        tpLock: false,
        fnLock: false,
        tnLock: false,
        rcLock: false,
        prcLock: false,
        accLock: false,
        mccLock: false,
        spfLock: false,
        npvLock: false,
        thsLock: false,
        f1: action.payload,
        lbl: state.lbl,
      };

    case actions.ADD_ACC:
      if (
        action.payload < 0 ||
        action.payload > 1 ||
        !metricReg.test(action.payload.toString())
      )
        return {
          ...state,
          err: { acc: "Invalid input for accuracy" },
          tsLock: true,
          psLock: true,
          nsLock: true,
          tpLock: true,
          fnLock: true,
          fpLock: true,
          tnLock: true,
          rcLock: true,
          prcLock: true,
          f1Lock: true,
          mccLock: true,
          spfLock: true,
          npvLock: true,
          thsLock: true,
        };
      return {
        ...state,
        err: { acc: "" },
        tsLock: false,
        psLock: false,
        nsLock: false,
        tpLock: false,
        fnLock: false,
        fpLock: false,
        tnLock: false,
        rcLock: false,
        prcLock: false,
        f1Lock: false,
        mccLock: false,
        spfLock: false,
        npvLock: false,
        thsLock: false,
        acc: action.payload,
        lbl: state.lbl,
      };
    case actions.ADD_MCC:
      if (
        action.payload < -1 ||
        action.payload > 1 ||
        (action.payload !== 0 && !metricReg.test(action.payload.toString()))
      )
        return {
          ...state,
          err: { mcc: "Invalid input for MCC" },
          tsLock: true,
          psLock: true,
          nsLock: true,
          tpLock: true,
          fpLock: true,
          fnLock: true,
          tnLock: true,
          rcLock: true,
          prcLock: true,
          accLock: true,
          f1Lock: true,
          spfLock: true,
          npvLock: true,
          thsLock: true,
        };
      return {
        ...state,
        err: { mcc: "" },
        tsLock: false,
        psLock: false,
        fpLock: false,
        nsLock: false,
        tpLock: false,
        fnLock: false,
        tnLock: false,
        rcLock: false,
        prcLock: false,
        accLock: false,
        f1Lock: false,
        spfLock: false,
        npvLock: false,
        thsLock: false,
        mcc: action.payload,
        lbl: state.lbl,
      };

    case actions.ADD_NPV:
      if (
        action.payload < 0 ||
        action.payload > 1 ||
        !metricReg.test(action.payload.toString())
      )
        return {
          ...state,
          err: { npv: "Invalid input for NPV" },
          tsLock: true,
          psLock: true,
          nsLock: true,
          tpLock: true,
          fpLock: true,
          fnLock: true,
          tnLock: true,
          rcLock: true,
          prcLock: true,
          accLock: true,
          f1Lock: true,
          spfLock: true,
          mccLock: true,
          thsLock: true,
        };
      return {
        ...state,
        err: { npv: "" },
        tsLock: false,
        psLock: false,
        nsLock: false,
        tpLock: false,
        fnLock: false,
        fpLock: false,
        tnLock: false,
        rcLock: false,
        prcLock: false,
        accLock: false,
        f1Lock: false,
        spfLock: false,
        mccLock: false,
        thsLock: false,
        npv: action.payload,
        lbl: state.lbl,
      };

    case actions.ADD_SPF:
      if (
        action.payload < 0 ||
        action.payload > 1 ||
        !metricReg.test(action.payload.toString())
      )
        return {
          ...state,
          err: { spf: "Invalid input for specificity" },
          tsLock: true,
          psLock: true,
          nsLock: true,
          tpLock: true,
          fpLock: true,
          fnLock: true,
          tnLock: true,
          rcLock: true,
          prcLock: true,
          accLock: true,
          f1Lock: true,
          mccLock: true,
          npvLock: true,
          thsLock: true,
        };
      return {
        ...state,
        err: { spf: "" },
        tsLock: false,
        psLock: false,
        nsLock: false,
        tpLock: false,
        fnLock: false,
        fpLock: false,
        tnLock: false,
        rcLock: false,
        prcLock: false,
        accLock: false,
        f1Lock: false,
        mccLock: false,
        npvLock: false,
        thsLock: false,
        spf: action.payload,
        lbl: state.lbl,
      };
    case actions.ADD_THS:
      if (
        action.payload < 0 ||
        action.payload > 1 ||
        !metricReg.test(action.payload.toString())
      )
        return {
          ...state,
          err: { ths: "Invalid input for threat score" },
          tsLock: true,
          psLock: true,
          nsLock: true,
          tpLock: true,
          fnLock: true,
          fpLock: true,
          mccLock: true,
          tnLock: true,
          rcLock: true,
          prcLock: true,
          accLock: true,
          f1Lock: true,
          spfLock: true,
          npvLock: true,
        };
      return {
        ...state,
        err: { spf: "" },
        tsLock: false,
        psLock: false,
        nsLock: false,
        tpLock: false,
        fpLock: false,
        fnLock: false,
        tnLock: false,
        rcLock: false,
        prcLock: false,
        accLock: false,
        f1Lock: false,
        mccLock: false,
        npvLock: false,
        spfLock: false,
        ths: action.payload,
        lbl: state.lbl,
      };

    default:
      return;
  }
};
export { reducer };
