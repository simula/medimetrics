const extractF1 = (data) => {
  const f1 = {
    metric: "F1-score",
  };
  data.map((element) => (f1[element.lbl] = element.f1));
  return f1;
};
const extractRecall = (data) => {
  const rc = {
    metric: "Recall",
  };
  data.map((element) => (rc[element.lbl] = element.rc));
  return rc;
};
const extractPrecision = (data) => {
  const prc = {
    metric: "precision",
  };
  data.map((element) => (prc[element.lbl] = element.prc));
  return prc;
};
const extractLabels = (data) => {
  const lbls = [];

  data.map((element) => lbls.push(element.lbl));
  return lbls;
};

const extractAccuracy = (data) => {
  const acc = {
    metric: "Accuracy",
  };
  data.map((element) => (acc[element.lbl] = element.acc));
  return acc;
};
const extractMCC = (data) => {
  const mcc = {
    metric: "N-MCC",
  };
  data.map(
    (element) =>
      (mcc[element.lbl] =
        Math.round(((element.mcc + 1) / 2 + Number.EPSILON) * 1000) / 1000)
  );
  return mcc;
};
const extractThreatScore = (data) => {
  const ths = {
    metric: "Threat score",
  };
  data.map((element) => (ths[element.lbl] = element.ths));
  return ths;
};

const extractNPV = (data) => {
  const npv = {
    metric: "NPV",
  };
  data.map((element) => (npv[element.lbl] = element.npv));
  return npv;
};

const extractSpecificity = (data) => {
  const spf = {
    metric: "Specificity",
  };
  data.map((element) => (spf[element.lbl] = element.spf));
  return spf;
};

const processDataForChart = (data) => {
  let metrics = [];
  metrics.push(extractF1(data));
  metrics.push(extractPrecision(data));
  metrics.push(extractRecall(data));
  metrics.push(extractAccuracy(data));
  metrics.push(extractMCC(data));
  metrics.push(extractNPV(data));
  metrics.push(extractThreatScore(data));
  metrics.push(extractSpecificity(data));
  return metrics;
};

const convertData = (method) => {
  return {
    lbl: method.lbl,
    ts: method.ts,
    ps: method.ps,
    ns: method.ns,
    tp: method.tp,
    tn: method.tn,
    fp: method.fp,
    fn: method.fn,
    mcc: Math.round((method.mcc + Number.EPSILON) * 1000) / 1000 || 0,
    f1: Math.round((method.f1 + Number.EPSILON) * 1000) / 1000 || 0,
    rc: Math.round((method.rc + Number.EPSILON) * 1000) / 1000 || 0,
    prc: Math.round((method.prc + Number.EPSILON) * 1000) / 1000 || 0,
    acc: Math.round((method.acc + Number.EPSILON) * 1000) / 1000 || 0,
    spf: Math.round((method.spf + Number.EPSILON) * 1000) / 1000 || 0,
    npv: Math.round((method.npv + Number.EPSILON) * 1000) / 1000 || 0,
    ths: Math.round((method.ths + Number.EPSILON) * 1000) / 1000 || 0,
  };
};

export { processDataForChart, extractLabels, convertData };
