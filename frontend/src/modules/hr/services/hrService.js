import API from "../../../api/axiosConfig";

export const hrService = {
  // Employees
  getEmployees: () => API.get("/employees"),
  getEmployeesPost: () => API.post("/employees"),

  // Job Titles
  getJobTitles: (params) => API.post("/jobtitle", params),
  getJobTitle: (id) => API.get(`/jobtitle/${id}`),
  createJobTitle: (data) => API.post("/jobtitle/store", data),
  updateJobTitle: (data) => API.post("/jobtitle/update", data),

  // Employee Papers
  createEmployeePaper: (data) => API.post("/employeepapers/store", data),
  getEmployeePaper: (id) => API.get(`/employeepapers/${id}`),
  updateEmployeePaper: (data) => API.post("/employeepapers/update", data),
  uploadEmployeePaper: (data) =>
    API.post("/employeeuploads/store", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Discounts & Allowances
  getDonationAccounts: () => API.get("transactions/components/donations"),
  createDiscountOrAward: (data) => API.post("/deduction/store", data),
  createSalaryAction: (data) => API.post("/salaryactions/store", data),

  // Investigations
  createInvestigation: (data) =>
    API.post("/investigations/store", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getInvestigation: (id) => API.get(`/investigations/${id}`),
  updateInvestigation: (id, data) =>
    API.post(`/investigations/update/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Vacations & Leaves
  createVacation: (data) => API.post("/vacations/store", data),
  getVacation: (id) => API.get(`/vacations/${id}`),
  updateVacation: (data) => API.post("/vacations/update", data),
  createLeavePermission: (data) => API.post("/leavepermissions/store", data),

  // Attendances
  createAttendance: (data) => API.post("/attendances/store", data),

  // Missions
  getMissionEmployees: () => API.get("missions/eams"),
  createMission: (data) =>
    API.post("/missions/store", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getMission: (id) => API.get(`/missions/${id}`),
  updateMission: (data) =>
    API.post("/missions/update", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteMission: (id) => API.get(`/missions/${id}/delete`),
};

export default hrService;
