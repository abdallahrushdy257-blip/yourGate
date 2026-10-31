import API from "../../../api/axiosConfig";

export const donationService = {
  // Donations
  getDonations: (params = {}) => API.get("/donations", { params }),
  getDonationDetails: (id) => API.get(`/donations/${id}`),
  getProjectDonations: (projectId, params = {}) => API.get(`/projects/${projectId}/donations`, { params }),

  // Archives
  getArchives: (params = {}) => API.get("/archives", { params }),
  uploadArchive: (data) => API.post("/archives", data),
  deleteArchive: (id) => API.delete(`/archives/${id}`),
};

export default donationService;
