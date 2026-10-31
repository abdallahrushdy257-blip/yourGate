import API from "../../../api/axiosConfig";

export const voucherService = {
  // Receipt Vouchers
  getReceiptVouchers: (params = {}) => API.get("/receipt_vouchers", { params }),
  getReceiptVoucher: (id) => API.get(`/receipt_vouchers/${id}`),
  createReceiptVoucher: (data) => API.post("/receipt_vouchers", data),
  updateReceiptVoucher: (id, data) => API.post(`/receipt_vouchers/${id}`, data),
  deleteReceiptVoucher: (id) => API.delete(`/receipt_vouchers/${id}`),

  // Payment Vouchers
  getPaymentVouchers: (params = {}) => API.get("/payment_vouchers", { params }),
  getPaymentVoucher: (id) => API.get(`/payment_vouchers/${id}`),
  createPaymentVoucher: (data) => API.post("/payment_vouchers", data),
  updatePaymentVoucher: (id, data) => API.post(`/payment_vouchers/${id}`, data),
  deletePaymentVoucher: (id) => API.delete(`/payment_vouchers/${id}`),

  // Money Reports
  getMoneyReceiptReports: (params = {}) => API.get("/money_receipt_reports", { params }),
  getMoneyTransferReports: (params = {}) => API.get("/money_transfer_reports", { params }),

  // Payments Data & Reports
  getPaymentsReport: (params = {}) => API.get("/payment_reports", { params }),
  getPaymentDetails: (id) => API.get(`/payment_details/${id}`),
};

export default voucherService;
