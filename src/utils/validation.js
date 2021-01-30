import Joi from "joi-browser";
const schema = {
  lbl: Joi.string().required(),
  ts: Joi.number().min(0),
  ps: Joi.number().min(0),
  ns: Joi.number().min(0),
  tp: Joi.number().min(0),
  fp: Joi.number().min(0),
  fn: Joi.number().min(0),
  tn: Joi.number().min(0),
  rc: Joi.number().min(0).max(1),
  prc: Joi.number().min(0).max(1),
  f1: Joi.number().min(0).max(1),
  acc: Joi.number().min(0).max(1),
  spf: Joi.number().min(0).max(1),
  mcc: Joi.number().min(-1).max(1),
  npv: Joi.number().min(0).max(1),
  ths: Joi.number().min(0).max(1),
  err: Joi.optional(),
  tsLock: Joi.boolean(),
  psLock: Joi.boolean(),
  nsLock: Joi.boolean(),
  tpLock: Joi.boolean(),
  fnLock: Joi.boolean(),
  tnLock: Joi.boolean(),
  fpLock: Joi.boolean(),
  rcLock: Joi.boolean(),
  prcLock: Joi.boolean(),
  f1Lock: Joi.boolean(),
  accLock: Joi.boolean(),
  mccLock: Joi.boolean(),
  spfLock: Joi.boolean(),
  npvLock: Joi.boolean(),
  thsLock: Joi.boolean(),
};
const disableFormButton = (
  state = {
    err: {
      ts: "",
      ps: "",
      ns: "",
      tp: "",
      fn: "",
      fp: "",
      tn: "",
      rc: "",
      f1: "",
      prc: "",
      acc: "",
      mcc: "",
      npv: "",
      spf: "",
      ths: "",
    },
  }
) => {
  return state.err &&
    (state.err.ts ||
      state.err.ps ||
      state.err.ns ||
      state.err.tp ||
      state.err.fn ||
      state.err.fp ||
      state.err.tn ||
      state.err.rc ||
      state.err.prc ||
      state.err.f1 ||
      state.err.acc ||
      state.err.mcc ||
      state.err.npv ||
      state.err.spf ||
      state.err.ths)
    ? true
    : false;
};

export { schema, disableFormButton };
