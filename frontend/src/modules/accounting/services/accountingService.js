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
  getEntries: (params) => API.get("/transactions", { params }),
  getEntry: (id) => API.get(`/transactions/${id}`),
  createEntry: (data) => API.post("/transactions/store", data),
  updateEntry: (id, data) => API.post(`/transactions/${id}/update`, data),
  deleteEntry: (id) => API.get(`/transactions/${id}/delete`),

  // ── Account Statements (كشوف الحسابات) ────────────────────────
  getStatement: (params) => API.get("/accountstatement/accounts", { params }),
  getCustomerStatement: (params) => API.get("/accountstatement/clients", { params }),
  getSupplierStatement: (params) => API.get("/accountstatement/vendors", { params }),
  getAccountsStatement: (params) => API.get("/accountstatement/accounts", { params }),

  // ── Financial Reports (ميزانية عمومية / قائمة دخل) ───────────
  getBalanceSheet: (params) => API.get("/reports/balancesheet", { params }),
  getIncomeStatement: (params) => API.get("/reports/incomestatement", { params }),
  getAccountsReport: (params) => API.get("/accounttree", { params }),
};

export default accountingService;
