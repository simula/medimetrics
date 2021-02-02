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
        element.mcc < 0
          ? precision3((parseFloat(element.mcc, 10) + 1) / 2)
          : precision3(parseFloat(element.mcc, 10)))
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

const precision3 = (float) => {
  return float && Number.parseFloat(float).toFixed(3);
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
    mcc: precision3(method.mcc) || 0,
    f1: precision3(method.f1) || 0,
    rc: precision3(method.rc) || 0,
    prc: precision3(method.prc) || 0,
    acc: precision3(method.acc) || 0,
    spf: precision3(method.spf) || 0,
    npv: precision3(method.npv) || 0,
    ths: precision3(method.ths) || 0,
  };
};

export { processDataForChart, extractLabels, convertData, precision3 };
