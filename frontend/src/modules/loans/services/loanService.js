import API from "../../../api/axiosConfig";

export const loanService = {
  // Loans
  getLoans: (params = {}) => API.get("/loans", { params }),
  getLoan: (id) => API.get(`/loans/${id}`),
  createLoan: (data) => API.post("/loans", data),
  updateLoan: (id, data) => API.post(`/loans/${id}`, data),
  deleteLoan: (id) => API.delete(`/loans/${id}`),

  // Delays & Payments
  getDelays: (params = {}) => API.get("/delays", { params }),
  getLoanDetails: (id) => API.get(`/loans/${id}/details`),

  // Feasibility studies
  getFeasibilityStudies: (params = {}) => API.get("/feasibility", { params }),
  getFeasibilityStudy: (id) => API.get(`/feasibility/${id}`),
  createFeasibilityStudy: (data) => API.post("/feasibility", data),
  updateFeasibilityStudy: (id, data) => API.post(`/feasibility/${id}`, data),

  // Warrantors
  getWarrantors: (params = {}) => API.get("/warrantors", { params }),
  getWarrantor: (id) => API.get(`/warrantors/${id}`),
  createWarrantor: (data) => API.post("/warrantors", data),
  updateWarrantor: (id, data) => API.post(`/warrantors/${id}`, data),
  deleteWarrantor: (id) => API.delete(`/warrantors/${id}`),
};

export default loanService;
