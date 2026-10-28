import API from "../../../api/axiosConfig";

/**
 * Centralized Human Resources (HR) API Service
 */
export const hrService = {
  // ── Employees ─────────────────────────────────────────────────
  getEmployees: (params) => API.get("/employee", { params }),
  getEmployee: (id) => API.get(`/employee/${id}`),
  createEmployee: (data) => API.post("/employee/store", data),
  updateEmployee: (id, data) => API.post(`/employee/${id}/update`, data),
  deleteEmployee: (id) => API.get(`/employee/${id}/delete`),
  getEmployeeCard: (id) => API.get(`/employee/card/${id}`),

  // ── Payroll & Salaries ────────────────────────────────────────
  getPayroll: (params) => API.get("/payroll", { params }),
  createPayroll: (data) => API.post("/payroll/store", data),
  paySalary: (data) => API.post("/paysalary/store", data),
  getSalaryCertificate: (id) => API.get(`/salarycertificate/${id}`),

  // ── Attendance & Departure ───────────────────────────────────
  getAttendance: (params) => API.get("/attendance", { params }),
  recordAttendance: (data) => API.post("/attendance/store", data),
  getAttendanceReport: (params) => API.get("/attendancereport", { params }),

  // ── Vacations & Leaves ────────────────────────────────────────
  getVacationRequests: (params) => API.get("/vacationrequest", { params }),
  createVacationRequest: (data) => API.post("/vacationrequest/store", data),
  getVacationDetails: (id) => API.get(`/vacationdetails/${id}`),
  getLeaveTypes: () => API.get("/leavetype"),

  // ── Performance & Evaluation ──────────────────────────────────
  getJobPerformance: (params) => API.get("/jobperformance", { params }),
  createJobPerformance: (data) => API.post("/jobperformance/store", data),
  getPerformanceEvaluation: (id) => API.get(`/jobperformance/${id}`),
  getKpiEvaluation: (id) => API.get(`/kpievaluation/${id}`),

  // ── Advances & Withdrawals ────────────────────────────────────
  getEmployeeAdvances: (params) => API.get("/employeeadvance", { params }),
  createEmployeeAdvance: (data) => API.post("/employeeadvance/store", data),
  getEmployeeWithdrawals: (params) => API.get("/employeewithdrawal", { params }),
  createEmployeeWithdrawal: (data) => API.post("/employeewithdrawal/store", data),

  // ── Job Titles & Departments ──────────────────────────────────
  getJobTitles: () => API.get("/jobtitle"),
  getDepartments: () => API.get("/department"),
};

export default hrService;
