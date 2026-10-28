import API from "../../../api/axiosConfig";

/**
 * Centralized Accounting & Finance Reports API Service
 */
export const accountingService = {
  // ── Chart of Accounts & Tree ──────────────────────────────────
  getChartOfAccounts: (params) => API.get("/chartofaccounts", { params }),
  createAccount: (data) => API.post("/chartofaccounts/store", data),
  updateAccount: (id, data) => API.post(`/chartofaccounts/${id}/update`, data),
  deleteAccount: (id) => API.get(`/chartofaccounts/${id}/delete`),

  // ── Accounting Entries (قيود اليومية) ─────────────────────────
  getEntries: (params) => API.get("/accountingentry", { params }),
  getEntry: (id) => API.get(`/accountingentry/${id}`),
  createEntry: (data) => API.post("/accountingentry/store", data),
  updateEntry: (id, data) => API.post(`/accountingentry/${id}/update`, data),
  deleteEntry: (id) => API.get(`/accountingentry/${id}/delete`),

  // ── Account Statements (كشوف الحسابات) ────────────────────────
  getStatement: (params) => API.get("/accountstatement", { params }),
  getCustomerStatement: (params) => API.get("/accountstatement/customers", { params }),
  getSupplierStatement: (params) => API.get("/accountstatement/suppliers", { params }),
  getAccountsStatement: (params) => API.get("/accountstatement/accounts", { params }),

  // ── Financial Reports (ميزانية عمومية / قائمة دخل) ───────────
  getBalanceSheet: (params) => API.get("/reports/balancesheet", { params }),
  getIncomeStatement: (params) => API.get("/reports/incomestatement", { params }),
  getAccountsReport: (params) => API.get("/reports/accounts", { params }),

  // ── Invoices & Purchases/Sales ────────────────────────────────
  createPurchaseInvoice: (data) => API.post("/invoice/purchase/store", data),
  createSalesInvoice: (data) => API.post("/invoice/sales/store", data),
  getItems: (params) => API.get("/item", { params }),
  createItem: (data) => API.post("/item/store", data),
  getClients: (params) => API.get("/client", { params }),
  createClient: (data) => API.post("/client/store", data),
  getSuppliers: (params) => API.get("/supplier", { params }),
  createSupplier: (data) => API.post("/supplier/store", data),
};

export default accountingService;
