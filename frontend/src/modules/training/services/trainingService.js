import API from "../../../api/axiosConfig";

export const trainingService = {
  // Training
  getTrainings: (params = {}) => API.get("/trainings", { params }),
  getTraining: (id) => API.get(`/trainings/${id}`),
  createTraining: (data) => API.post("/trainings", data),
  updateTraining: (id, data) => API.post(`/trainings/${id}`, data),
  deleteTraining: (id) => API.delete(`/trainings/${id}`),

  // KSA
  getKsaList: (params = {}) => API.get("/ksa", { params }),
  getKsa: (id) => API.get(`/ksa/${id}`),
  createKsa: (data) => API.post("/ksa", data),
  updateKsa: (id, data) => API.post(`/ksa/${id}`, data),

  // Surveys
  getSurveys: (params = {}) => API.get("/surveys", { params }),
  getSurvey: (id) => API.get(`/surveys/${id}`),
  createSurvey: (data) => API.post("/surveys", data),
  updateSurvey: (id, data) => API.post(`/surveys/${id}`, data),

  // Late policies
  getLatePolicies: (params = {}) => API.get("/late-policies", { params }),
  createLatePolicy: (data) => API.post("/late-policies", data),
  updateLatePolicy: (id, data) => API.post(`/late-policies/${id}`, data),
};

export default trainingService;
