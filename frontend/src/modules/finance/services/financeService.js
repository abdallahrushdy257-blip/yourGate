import API from "../../../api/axiosConfig";

/**
 * Centralized Finance & Vouchers API Service
 */
export const financeService = {
  // ── Receipt Vouchers ──────────────────────────────────────────
  getReceiptVouchers: (params) => API.get("/receiptvoucher", { params }),
  getReceiptVoucher: (id) => API.get(`/receiptvoucher/${id}`),
  createReceiptVoucher: (data) => API.post("/receiptvoucher/store", data),
  getReceiptVoucherProject: (id) => API.get(`/receiptvoucherproject/${id}`),
  createReceiptVoucherProject: (data) => API.post("/receiptvoucherproject/store", data),
  getReceiptVoucherEndowments: (id) => API.get(`/receiptvoucherendowments/${id}`),
  createReceiptVoucherEndowments: (data) => API.post("/receiptvoucherendowments/store", data),
  getReceiptVoucherLoan: (id) => API.get(`/receiptvoucherloan/${id}`),
  createReceiptVoucherLoan: (data) => API.post("/receiptvoucherloan/store", data),

  // ── Payment Vouchers ──────────────────────────────────────────
  getPaymentVouchers: (params) => API.get("/paymentvoucher", { params }),
  getPaymentVoucher: (id) => API.get(`/paymentvoucher/${id}`),
  createPaymentVoucher: (data) => API.post("/paymentvoucher/store", data),
  createPaymentVoucherGeneral: (data) => API.post("/paymentvouchergeneral/store", data),
  getPaymentVoucherProject: (id) => API.get(`/paymentvoucherproject/${id}`),
  createPaymentVoucherProject: (data) => API.post("/paymentvoucherproject/store", data),
  getEndowmentsVoucher: (id) => API.get(`/endowmentsvoucher/${id}`),
  createEndowmentsVoucher: (data) => API.post("/endowmentsvoucher/store", data),
  getPaymentVoucherLoan: (id) => API.get(`/paymentvoucherloan/${id}`),
  createPaymentVoucherLoan: (data) => API.post("/paymentvoucherloan/store", data),

  // ── General Payment / Cash ────────────────────────────────────
  getGeneralReceiptVoucher: () => API.get("/generalreceiptvoucher"),
  getGeneralPaymentVoucher: () => API.get("/generalpaymentvoucher"),
  createGeneralReceiptVoucher: (data) => API.post("/generalreceiptvoucher/store", data),
  createGeneralPaymentVoucher: (data) => API.post("/generalpaymentvoucher/store", data),
};

export default financeService;
