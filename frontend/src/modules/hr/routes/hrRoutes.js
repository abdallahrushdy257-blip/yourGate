import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const EmployeeListPage = lazy(() => import("../../../pages/EmployeeName/EmployeeName"));
const AddNewEmployeePage = lazy(() => import("../../../pages/AddNewEmployee/AddNewEmployee"));
const EditEmployeePage = lazy(() => import("../../../pages/AddNewEmployee/EditEmployee"));
const ShowEmployeePage = lazy(() => import("../../../pages/ShowEmployee/ShowEmployee"));
const GeneralEmployeeReportsPage = lazy(() => import("../../../pages/GeneralEmployeeReports/GeneralEmployeeReports"));
const EmployeePaperPage = lazy(() => import("../../../pages/HRreports/reports/EmployeePaper"));
const ShowEmployeeCardPage = lazy(() => import("../../../pages/Card/ShowEmployeeCard"));
const EmployeeWithdrawalsPage = lazy(() => import("../../../pages/employeeWithdrawals/EmployeeWithdrawals"));
const CreateEmployeeAdvancePage = lazy(() => import("../../../pages/employeeAdvance/CreateEmployeeAdvance"));

const PayrollPage = lazy(() => import("../../../pages/Payroll/Payroll"));
const PayrollVoucherPage = lazy(() => import("../../../pages/Payroll/PayrollVoucher"));
const PaySalaryPage = lazy(() => import("../../../pages/PaySalary/PaySalary"));
const SalaryCertificatePage = lazy(() => import("../../../pages/Salarycertificate/Salarycertificate"));

const AttendanceDeparturePage = lazy(() => import("../../../pages/AttendanceDeparture/AttendanceDeparture"));
const AttendanceDepartureReportPage = lazy(() => import("../../../pages/AttendanceDepartureReport/AttendanceDepartureReport"));

const VacationRequestPage = lazy(() => import("../../../pages/VacationRequest/VacationRequest"));
const VacationDetailsPage = lazy(() => import("../../../pages/VacationDetails/VacationDetails"));

const JobPerformanceEvaluationPage = lazy(() => import("../../../pages/JobPerformanceEvaluation/JobPerformanceEvaluation"));
const ShowJobPerformanceEvaluationPage = lazy(() => import("../../../pages/ShowJobPerformanceEvaluation/ShowJobPerformanceEvaluation"));
const ShowPerformancePage = lazy(() => import("../../../pages/ShowPerformance/ShowPerformance"));
const KPIEvaluationPage = lazy(() => import("../../../pages/KPIEvaluation/KPIEvaluation"));

const HRReportsPage = lazy(() => import("../../../pages/HRreports/HRreports"));
const EmployeeReportPage = lazy(() => import("../../../pages/HRreports/reports/EmployeeReport"));
const SalaryReportPage = lazy(() => import("../../../pages/HRreports/reports/SalaryReport"));
const LeaveReportPage = lazy(() => import("../../../pages/HRreports/reports/LeaveReport"));

// ── Additional HR Pages ─────────────────────────────────────────
const Jobtitle = lazy(() => import("../pages/JobTitle/JobTitle"));
const EditJobTitle = lazy(() => import("../pages/JobTitle/EditJobTitle"));
const AddEmpPaper = lazy(() => import("../pages/EmployPaper/AddEmpPaper"));
const EditEmploypaper = lazy(() => import("../pages/EmployPaper/EditEmploypaper"));
const Discounts = lazy(() => import("../pages/Discounts/Discounts"));
const Investigations = lazy(() => import("../pages/Investigations/Investigations"));
const EditInvestigations = lazy(() => import("../pages/Investigations/EditInvestigations"));
const ComeLeave = lazy(() => import("../pages/ComeLeave/ComeLeave"));
const LeaveType = lazy(() => import("../pages/LeaveType/LeaveType"));
const EditLeave = lazy(() => import("../pages/LeaveType/EditLeave"));
const RequestPermission = lazy(() => import("../pages/RequestPermission/RequestPermission"));
const Missions = lazy(() => import("../pages/Missions/Missions"));
const AddMissions = lazy(() => import("../pages/Missions/AddMissions"));
const EditMissions = lazy(() => import("../pages/Missions/EditMissions"));
const ShowMissions = lazy(() => import("../pages/Missions/ShowMissions"));

// ── Reports ─────────────────────────────────────────────────────
const JobtitleReport = lazy(() => import("../../../pages/HRreports/reports/JobtitleReport"));
const KpiReport = lazy(() => import("../../../pages/HRreports/reports/KpiReport"));
const LeaveNameReport = lazy(() => import("../../../pages/HRreports/reports/LeaveNameReport"));
const DeductionReport = lazy(() => import("../../../pages/HRreports/reports/DeductionReport"));
const AttendenceReport = lazy(() => import("../../../pages/HRreports/reports/AttendenceReport"));
const InvestigationReport = lazy(() => import("../../../pages/HRreports/reports/InvestigationReport"));
const LeavePermissionReport = lazy(() => import("../../../pages/HRreports/reports/LeavePermissionReport"));
const EmpVac = lazy(() => import("../../../pages/HRreports/reports/EmpVac"));
const ShowEmpVac = lazy(() => import("../../../pages/HRreports/reports/ShowEmpVac"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const hrRouteConfigs = [
  // ── Employees ─────────────────────────────────────────────────
  { path: "/employeename", element: withSuspense(EmployeeListPage) },
  { path: "/addnewemployee", element: withSuspense(AddNewEmployeePage) },
  { path: "/editemployee/:id", element: withSuspense(EditEmployeePage) },
  { path: "/showEmployee/:id", element: withSuspense(ShowEmployeePage) },
  { path: "/generalemployeereports/:id", element: withSuspense(GeneralEmployeeReportsPage) },
  { path: "/employeepaper/:id", element: withSuspense(EmployeePaperPage) },
  { path: "/showEmployeeCard/:id", element: withSuspense(ShowEmployeeCardPage) },
  { path: "/employeeWithdrawals", element: withSuspense(EmployeeWithdrawalsPage) },
  { path: "/employeeAdvance", element: withSuspense(CreateEmployeeAdvancePage) },

  // ── Job Titles ────────────────────────────────────────────────
  { path: "/jobtitle", element: withSuspense(Jobtitle) },
  { path: "/editjobtitle/:id", element: withSuspense(EditJobTitle) },

  // ── Employee Papers ───────────────────────────────────────────
  { path: "/addempaper/:id", element: withSuspense(AddEmpPaper) },
  { path: "/editemploypaper/:id", element: withSuspense(EditEmploypaper) },

  // ── Discounts & Investigations ────────────────────────────────
  { path: "/discounts/:id", element: withSuspense(Discounts) },
  { path: "/investigations/:id", element: withSuspense(Investigations) },
  { path: "/editInvestigations/:id", element: withSuspense(EditInvestigations) },

  // ── Attendance, Leaves & Permissions ──────────────────────────
  { path: "/attendancedeparture", element: withSuspense(AttendanceDeparturePage) },
  { path: "/attendancedeparturereport", element: withSuspense(AttendanceDepartureReportPage) },
  { path: "/comeleave", element: withSuspense(ComeLeave) },
  { path: "/leavestype", element: withSuspense(LeaveType) },
  { path: "/editLeave/:id", element: withSuspense(EditLeave) },
  { path: "/requestpermission", element: withSuspense(RequestPermission) },
  { path: "/vacationrequest", element: withSuspense(VacationRequestPage) },
  { path: "/vacationdetails", element: withSuspense(VacationDetailsPage) },

  // ── Payroll & Salaries ────────────────────────────────────────
  { path: "/payroll", element: withSuspense(PayrollPage) },
  { path: "/payroll/:id", element: withSuspense(PayrollVoucherPage) },
  { path: "/paysalary", element: withSuspense(PaySalaryPage) },
  { path: "/salarycertificate", element: withSuspense(SalaryCertificatePage) },

  // ── Performance & Evaluation ──────────────────────────────────
  { path: "/jobperformanceevaluation", element: withSuspense(JobPerformanceEvaluationPage) },
  { path: "/showJobPerformanceEvaluation", element: withSuspense(ShowJobPerformanceEvaluationPage) },
  { path: "/showperformance", element: withSuspense(ShowPerformancePage) },
  { path: "/kpievaluation", element: withSuspense(KPIEvaluationPage) },
  { path: "/kpievaluation/:id", element: withSuspense(KPIEvaluationPage) },

  // ── Missions ──────────────────────────────────────────────────
  { path: "/missions", element: withSuspense(Missions) },
  { path: "/addmission", element: withSuspense(AddMissions) },
  { path: "/editMissions/:id", element: withSuspense(EditMissions) },
  { path: "/showMissions/:id", element: withSuspense(ShowMissions) },

  // ── HR Reports ────────────────────────────────────────────────
  { path: "/hrreports", element: withSuspense(HRReportsPage) },
  { path: "/hrreport/employees", element: withSuspense(EmployeeReportPage) },
  { path: "/hrreport/salary", element: withSuspense(SalaryReportPage) },
  { path: "/hrreport/vacations", element: withSuspense(LeaveReportPage) },
  { path: "/hrreport/jobtitle", element: withSuspense(JobtitleReport) },
  { path: "/hrreport/kpi", element: withSuspense(KpiReport) },
  { path: "/hrreport/leavename", element: withSuspense(LeaveNameReport) },
  { path: "/hrreport/deduction", element: withSuspense(DeductionReport) },
  { path: "/hrreport/discounts", element: withSuspense(DeductionReport) },
  { path: "/hrreport/attendence", element: withSuspense(AttendenceReport) },
  { path: "/hrreport/investigation", element: withSuspense(InvestigationReport) },
  { path: "/hrreport/investigations", element: withSuspense(InvestigationReport) },
  { path: "/hrreport/vacdetails", element: withSuspense(VacationDetailsPage) },
  { path: "/hrreport/leavepermissionreport", element: withSuspense(LeavePermissionReport) },
  { path: "/hrreport/emploteeVac", element: withSuspense(EmpVac) },
  { path: "/showEmpVac", element: withSuspense(ShowEmpVac) },
];

export const HrRoutes = (
  <React.Fragment>
    {hrRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default HrRoutes;
