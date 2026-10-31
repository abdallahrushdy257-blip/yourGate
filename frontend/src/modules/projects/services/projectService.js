import API from "../../../api/axiosConfig";

/**
 * Centralized Projects & KPIs API Service
 */
export const projectService = {
  // ── Project Core ──────────────────────────────────────────────
  getProjects: (params) => API.get("/project", { params }),
  getProject: (id) => API.get(`/project/${id}`),
  createProject: (data) => API.post("/project/store", data),
  updateProject: (id, data) => API.post(`/project/${id}/update`, data),
  updateProjectStatus: (id, data) => API.post(`/project/${id}/update`, data),
  deleteProject: (id) => API.get(`/project/${id}/delete`),

  // ── Project Details & Stats ───────────────────────────────────
  getProjectDetails: (id) => API.get(`/projectdetails/${id}`),
  saveProjectDetails: (data) => API.post("/projectdetails/store", data),

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
  deleteProjectPhase: (phaseId) => API.get(`/projectphase/${phaseId}/delete`),

  // ── Members & Helpers ─────────────────────────────────────────
  getProjectMembers: (projectId) => API.get(`/projecthelpers/${projectId}`),
  saveProjectMembers: (data) => API.post("/projecthelpers/store", data),
  deleteProjectMember: (memberId) => API.get(`/projecthelpers/${memberId}/delete`),

  // ── Risks & Mitigations ───────────────────────────────────────
  getProjectRisks: (projectId) => API.get(`/projectrisk/${projectId}`),
  saveProjectRisk: (data) => API.post("/projectrisk/store", data),
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
