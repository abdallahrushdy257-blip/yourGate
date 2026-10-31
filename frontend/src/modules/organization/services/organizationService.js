import API from "../../../api/axiosConfig";

export const organizationService = {
  // Users
  getUsers: (params = {}) => API.get("/users", { params }),
  getUser: (id) => API.get(`/users/${id}`),
  createUser: (data) => API.post("/users", data),
  updateUser: (id, data) => API.post(`/users/${id}`, data),
  deleteUser: (id) => API.delete(`/users/${id}`),
  getUserProfile: () => API.get("/user/profile"),

  // Organizational Chart
  getOrganizationalChart: () => API.get("/organizational-chart"),
  saveOrganizationalChart: (data) => API.post("/organizational-chart", data),
};

export default organizationService;

