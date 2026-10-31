import API from "../../../api/axiosConfig";

export const governanceService = {
  // Association Members
  getAssociationMembers: (params = {}) => API.get("/association_members", { params }),
  getAssociationMember: (id) => API.get(`/association_members/${id}`),
  createAssociationMember: (data) => API.post("/association_members", data),
  updateAssociationMember: (id, data) => API.post(`/association_members/${id}`, data),
  deleteAssociationMember: (id) => API.delete(`/association_members/${id}`),

  // Meeting Minutes
  getMinutes: (params = {}) => API.get("/meeting_minutes", { params }),
  getMinute: (id) => API.get(`/meeting_minutes/${id}`),
  createMinute: (data) => API.post("/meeting_minutes", data),
  updateMinute: (id, data) => API.post(`/meeting_minutes/${id}`, data),
  deleteMinute: (id) => API.delete(`/meeting_minutes/${id}`),

  // Committees
  getCommittees: (params = {}) => API.get("/committees", { params }),
  getCommittee: (id) => API.get(`/committees/${id}`),
  createCommittee: (data) => API.post("/committees", data),
  updateCommittee: (id, data) => API.post(`/committees/${id}`, data),
  deleteCommittee: (id) => API.delete(`/committees/${id}`),
  getCommitteeMembers: (committeeId) => API.get(`/committee_members/${committeeId}`),

  // Volunteers
  getVolunteers: (params = {}) => API.get("/volunteers", { params }),
  getVolunteer: (id) => API.get(`/volunteers/${id}`),
  createVolunteer: (data) => API.post("/volunteers", data),
  updateVolunteer: (id, data) => API.post(`/volunteers/${id}`, data),
  deleteVolunteer: (id) => API.delete(`/volunteers/${id}`),
};

export default governanceService;
