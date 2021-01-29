const recallFormula = (state) => {
  return state.tp >= 0 && state.fn >= 0
    ? state.tp / (state.tp + state.fn)
    : null;
};

const precisionFormula = (state) => {
  return state.tp >= 0 && state.fp >= 0
    ? state.tp / (state.tp + state.fp)
    : null;
};
const f1ScoreFormula = (state) => {
  return state.tp >= 0 && state.fn >= 0 && state.fp >= 0
    ? (2 * state.tp) / (2 * state.tp + state.fn + state.fp)
    : null;
};
const accuracyFormula = (state) => {
  return state.tp >= 0 && state.tn >= 0 && state.fp >= 0 && state.fn >= 0
    ? (state.tp + state.tn) / (state.tp + state.tn + state.fp + state.fn)
    : null;
};

const mccFormula = (state) => {
  return state.tp >= 0 && state.tn >= 0 && state.fp >= 0 && state.fn >= 0
    ? (state.tp * state.tn - state.fp * state.fn) /
        Math.sqrt(
          (state.tp + state.fp) *
            (state.tp + state.fn) *
            (state.tn + state.fp) *
            (state.tn + state.fn)
        )
    : null;
};
const npvFormula = (state) => {
  return state.tn >= 0 && state.fn >= 0
    ? state.tn / (state.tn + state.fn)
    : null;
};

const spfFormula = (state) => {
  return state.tn >= 0 && state.fp >= 0
    ? state.tn / (state.tn + state.fp)
    : null;
};

const thsFormula = (state) => {
  return state.tp >= 0 && state.fn >= 0 && state.fp >= 0
    ? state.tp / (state.tp + state.fp + state.fn)
    : null;
};
export {
  recallFormula,
  precisionFormula,
  f1ScoreFormula,
  accuracyFormula,
  mccFormula,
  npvFormula,
  spfFormula,
  thsFormula,
};
