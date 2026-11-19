import API from "../../../api/axiosConfig";

/**
 * Centralized Projects & KPIs API Service
 */
export const projectService = {
  // ── Project Core ──────────────────────────────────────────────
  getProjects: (params) => API.get("/projects", { params }),
  getProject: (id) => API.get(`/projects/${id}`),
  createProject: (data) => API.post("/projects/store", data),
  updateProject: (id, data) => API.post(`/projects/update/${id}`, data),
  updateProjectStatus: (id, data) => API.post(`/projects/update/${id}`, data),
  deleteProject: (id) => API.get(`/projects/${id}/delete`),

  // ── Project Details & Stats ───────────────────────────────────
  getProjectDetails: (id) => API.get(`/projects/${id}`),
  saveProjectDetails: (data) => API.post("/projectsdetails/store", data),

  // ── KPIs ──────────────────────────────────────────────────────
  getMasterKpis: (params) => API.get("/kpi", { params }),
  saveMasterKpi: (data) => API.post("/kpi/store", data),
  updateMasterKpi: (id, data) => API.post(`/kpi/${id}/update`, data),
  deleteMasterKpi: (id) => API.get(`/kpi/${id}/delete`),
  getKpiQuizs: () => API.get("/kpi/quizs"),

  getProjectKpis: (projectId) => API.get(`/projectkpi/${projectId}`),
  saveProjectKpis: (data) => API.post("/projectkpi/store", data),
  deleteProjectKpi: (kpiId) => API.get(`/projectkpi/${kpiId}/delete`),

  // ── Phases ────────────────────────────────────────────────────
  getProjectPhases: (projectId) => API.get(`/projectphase/${projectId}`),
  saveProjectPhases: (data) => API.post("/projectphase/store", data),
  deleteProjectPhase: (phaseId) => API.get(`/projectphase/${phaseId}/status/cancel`),

  // ── Members & Helpers ─────────────────────────────────────────
  getProjectMembers: (projectId) => API.get(`/projectassignment/${projectId}`),
  saveProjectMembers: (data) => API.post("/projectassignment/store", data),
  deleteProjectMember: (memberId) => API.get(`/projectassignment/${memberId}/delete`),

  // ── Risks & Mitigations ───────────────────────────────────────
  getProjectRisks: (projectId) => API.get(`/projectrisk/${projectId}`),
  saveProjectRisk: (data) => API.post("/projectrisk/risk/store", data),
  deleteProjectRisk: (riskId) => API.get(`/projectrisk/${riskId}/delete`),
  getRiskMitigation: (riskId) => API.get(`/projectrisk/mitigation/${riskId}`),
  saveRiskMitigation: (data) => API.post("/projectrisk/mitigation/store", data),

  // ── Attachments ───────────────────────────────────────────────
  getProjectAttachments: (projectId) => API.get(`/projectupload/${projectId}`),
  uploadProjectAttachment: (formData) =>
    API.post("/projectupload/store", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteProjectAttachment: (uploadId) => API.get(`/projectupload/${uploadId}/delete`),
};

export default projectService;
