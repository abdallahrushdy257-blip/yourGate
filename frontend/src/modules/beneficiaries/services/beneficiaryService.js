import API from "../../../api/axiosConfig";

/**
 * Centralized Beneficiaries, Cases, Donors & Vendors API Service
 */
export const beneficiaryService = {
  // ── Cases (حالات المتجر / الحالات الإنسانية) ──────────────────
  getCases: (params) => API.get("/case", { params }),
  getCase: (id) => API.get(`/case/${id}`),
  createCase: (data) => API.post("/case/store", data),
  updateCase: (id, data) => API.post(`/case/${id}/update`, data),
  deleteCase: (id) => API.get(`/case/${id}/delete`),
  getCaseDetails: (id) => API.get(`/casedetails/${id}`),

  // ── Beneficiaries (المستفيدين) ────────────────────────────────
  getBeneficiaries: (params) => API.get("/beneficiary", { params }),
  getBeneficiary: (id) => API.get(`/beneficiary/${id}`),
  createBeneficiary: (data) => API.post("/beneficiary/store", data),
  updateBeneficiary: (id, data) => API.post(`/beneficiary/${id}/update`, data),
  deleteBeneficiary: (id) => API.get(`/beneficiary/${id}/delete`),
  createBeneficiaryLink: (data) => API.post("/beneficiarylink/store", data),
  getBeneficiaryLink: (id) => API.get(`/beneficiarylink/${id}`),

  // ── Donors (المانحين) ─────────────────────────────────────────
  getDonors: (params) => API.get("/donor", { params }),
  getDonor: (id) => API.get(`/donor/${id}`),
  createDonor: (data) => API.post("/donor/store", data),
  updateDonor: (id, data) => API.post(`/donor/${id}/update`, data),
  deleteDonor: (id) => API.get(`/donor/${id}/delete`),

  // ── Vendors (الموردين) ────────────────────────────────────────
  getVendors: (params) => API.get("/vendor", { params }),
  getVendor: (id) => API.get(`/vendor/${id}`),
  createVendor: (data) => API.post("/vendor/store", data),
  updateVendor: (id, data) => API.post(`/vendor/${id}/update`, data),
  deleteVendor: (id) => API.get(`/vendor/${id}/delete`),
};

export default beneficiaryService;
