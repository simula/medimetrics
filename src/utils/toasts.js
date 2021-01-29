import { toast } from "react-toastify";
const inputConflictError = (err) => {
  if (err.ts) {
    return toast.error(err.ts, {
      position: "top-right",

      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  }
  if (err.ps) {
    return toast.error(err.ps, {
      position: "top-right",

      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  }
  if (err.ns) {
    return toast.error(err.ns, {
      position: "top-right",

      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  }
  if (err.tp) {
    return toast.error(err.tp, {
      position: "top-right",

      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  }
  if (err.fn) {
    return toast.error(err.fn, {
      position: "top-right",

      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  }
  if (err.fp) {
    return toast.error(err.fp, {
      position: "top-right",

      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  }
  if (err.tn) {
    return toast.error(err.tn, {
      position: "top-right",

      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  }
  if (err.conflict) {
    return toast.error(err.conflict, {
      position: "top-right",

      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  }
};

const duplicateLabelError = () => {
  toast.error("This label has already been used.", {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  });
};
const invalidInputError = () => {
  toast.error("Invalid input", {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  });
};

export { invalidInputError, duplicateLabelError, inputConflictError };
