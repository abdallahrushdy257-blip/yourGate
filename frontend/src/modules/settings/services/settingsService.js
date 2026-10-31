import API from "../../../api/axiosConfig";

/**
 * Centralized Settings, Roles & Permissions API Service
 */
export const settingsService = {
  // ── General & Print Settings ──────────────────────────────────
  getRepresentativeInfo: () => API.get("/orgusers/representative"),
  getPrintSettings: () => API.get("/print"),
  savePrintSettings: (settings) => API.post("/print/store", { settings }),

  // ── Roles CRUD ───────────────────────────────────────────────
  getRole: (id) => API.get(`/permissions/${id}`),
  createRole: (data) => API.post("/permissions/store", data),
  updateRole: (data) => API.post("/permissions/update", data),
  deleteRole: (id) => API.get(`/permissions/${id}/delete`),

  // ── Permissions Matrix ────────────────────────────────────────
  saveRolePermissions: (groupId, roles) => API.post(`/permissions/${groupId}/roles`, { roles }),
};

export default settingsService;
