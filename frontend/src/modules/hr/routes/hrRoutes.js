import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const EmployeeListPage = lazy(() => import("../pages").then((m) => ({ default: m.EmployeeListPage })));
const AddNewEmployeePage = lazy(() => import("../pages").then((m) => ({ default: m.AddNewEmployeePage })));
const EditEmployeePage = lazy(() => import("../pages").then((m) => ({ default: m.EditEmployeePage })));
const ShowEmployeePage = lazy(() => import("../pages").then((m) => ({ default: m.ShowEmployeePage })));
const GeneralEmployeeReportsPage = lazy(() => import("../pages").then((m) => ({ default: m.GeneralEmployeeReportsPage })));
const EmployeePaperPage = lazy(() => import("../pages").then((m) => ({ default: m.EmployeePaperPage })));
const ShowEmployeeCardPage = lazy(() => import("../pages").then((m) => ({ default: m.ShowEmployeeCardPage })));
const EmployeeWithdrawalsPage = lazy(() => import("../pages").then((m) => ({ default: m.EmployeeWithdrawalsPage })));
const CreateEmployeeAdvancePage = lazy(() => import("../pages").then((m) => ({ default: m.CreateEmployeeAdvancePage })));

const PayrollPage = lazy(() => import("../pages").then((m) => ({ default: m.PayrollPage })));
const PayrollVoucherPage = lazy(() => import("../pages").then((m) => ({ default: m.PayrollVoucherPage })));
const PaySalaryPage = lazy(() => import("../pages").then((m) => ({ default: m.PaySalaryPage })));
const SalaryCertificatePage = lazy(() => import("../pages").then((m) => ({ default: m.SalaryCertificatePage })));

const AttendanceDeparturePage = lazy(() => import("../pages").then((m) => ({ default: m.AttendanceDeparturePage })));
const AttendanceDepartureReportPage = lazy(() => import("../pages").then((m) => ({ default: m.AttendanceDepartureReportPage })));

const VacationRequestPage = lazy(() => import("../pages").then((m) => ({ default: m.VacationRequestPage })));
const VacationDetailsPage = lazy(() => import("../pages").then((m) => ({ default: m.VacationDetailsPage })));

const JobPerformanceEvaluationPage = lazy(() => import("../pages").then((m) => ({ default: m.JobPerformanceEvaluationPage })));
const ShowJobPerformanceEvaluationPage = lazy(() => import("../pages").then((m) => ({ default: m.ShowJobPerformanceEvaluationPage })));
const ShowPerformancePage = lazy(() => import("../pages").then((m) => ({ default: m.ShowPerformancePage })));
const KPIEvaluationPage = lazy(() => import("../pages").then((m) => ({ default: m.KPIEvaluationPage })));

const HRReportsPage = lazy(() => import("../pages").then((m) => ({ default: m.HRReportsPage })));
const EmployeeReportPage = lazy(() => import("../pages").then((m) => ({ default: m.EmployeeReportPage })));
const SalaryReportPage = lazy(() => import("../pages").then((m) => ({ default: m.SalaryReportPage })));
const LeaveReportPage = lazy(() => import("../pages").then((m) => ({ default: m.LeaveReportPage })));

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

  // ── Payroll & Salaries ────────────────────────────────────────
  { path: "/payroll", element: withSuspense(PayrollPage) },
  { path: "/payroll/:id", element: withSuspense(PayrollVoucherPage) },
  { path: "/paysalary", element: withSuspense(PaySalaryPage) },
  { path: "/salarycertificate", element: withSuspense(SalaryCertificatePage) },

  // ── Attendance & Departure ───────────────────────────────────
  { path: "/attendancedeparture", element: withSuspense(AttendanceDeparturePage) },
  { path: "/attendancedeparturereport", element: withSuspense(AttendanceDepartureReportPage) },

  // ── Vacations & Leaves ────────────────────────────────────────
  { path: "/vacationrequest", element: withSuspense(VacationRequestPage) },
  { path: "/vacationdetails", element: withSuspense(VacationDetailsPage) },

  // ── Performance & Evaluation ──────────────────────────────────
  { path: "/jobperformanceevaluation", element: withSuspense(JobPerformanceEvaluationPage) },
  { path: "/showJobPerformanceEvaluation", element: withSuspense(ShowJobPerformanceEvaluationPage) },
  { path: "/showperformance", element: withSuspense(ShowPerformancePage) },
  { path: "/kpievaluation", element: withSuspense(KPIEvaluationPage) },

  // ── HR Reports ────────────────────────────────────────────────
  { path: "/hrreports", element: withSuspense(HRReportsPage) },
  { path: "/hrreport/employees", element: withSuspense(EmployeeReportPage) },
  { path: "/hrreport/salary", element: withSuspense(SalaryReportPage) },
  { path: "/hrreport/vacations", element: withSuspense(LeaveReportPage) },
];

export const HrRoutes = (
  <React.Fragment>
    {hrRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default HrRoutes;
