import API from "../../../api/axiosConfig";

export const marketingService = {
  getProject: (id) => API.get(`/projects/${id}`),

  getShop: (id) => API.get(`/shop/${id}/view`),

  createProject: (data) =>
    API.post("/projects/store", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateProject: (data) =>
    API.post("/projects/update", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  submitProjectDetails: (data) =>
    API.post("/projectsdetails/store", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  submitShopDetails: (data) =>
    API.post("/shopdetails/store", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getProjectUploads: (id) => API.get(`projectsdetails/${id}/uploads`),

  getShopUploads: (id) => API.get(`shopdetails/${id}/uploads`),

  getReports: (params) => API.get("/marketing/reports", { params }),
};

export default marketingService;
