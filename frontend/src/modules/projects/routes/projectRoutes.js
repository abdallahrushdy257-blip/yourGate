import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const ProjectListPage = lazy(() => import("../pages").then((m) => ({ default: m.ProjectListPage })));
const ProjectDetailsPage = lazy(() => import("../pages").then((m) => ({ default: m.ProjectDetailsPage })));
const EditProjectStatusPage = lazy(() => import("../pages").then((m) => ({ default: m.EditProjectStatusPage })));
const MarketingDesignProjectManagementPage = lazy(() =>
  import("../pages").then((m) => ({ default: m.MarketingDesignProjectManagementPage }))
);
const MasterKpiPage = lazy(() => import("../pages").then((m) => ({ default: m.MasterKpiPage })));
const ProjectKpiViewPage = lazy(() => import("../pages").then((m) => ({ default: m.ProjectKpiViewPage })));
const ProjectKpiFormPage = lazy(() => import("../pages").then((m) => ({ default: m.ProjectKpiFormPage })));
const ProjectPhasesPage = lazy(() => import("../pages").then((m) => ({ default: m.ProjectPhasesPage })));
const ProjectMembersPage = lazy(() => import("../pages").then((m) => ({ default: m.ProjectMembersPage })));
const ProjectRisksPage = lazy(() => import("../pages").then((m) => ({ default: m.ProjectRisksPage })));
const RiskMitigationPage = lazy(() => import("../pages").then((m) => ({ default: m.RiskMitigationPage })));
const RiskAssessmentReportPage = lazy(() =>
  import("../pages").then((m) => ({ default: m.RiskAssessmentReportPage }))
);
const ProjectAttachmentsPage = lazy(() =>
  import("../pages").then((m) => ({ default: m.ProjectAttachmentsPage }))
);

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const projectRouteConfigs = [
  { path: "/projectStatus", element: withSuspense(ProjectListPage) },
  { path: "/marketingdesignprojectmanagement", element: withSuspense(MarketingDesignProjectManagementPage) },
  { path: "/editprojectstatus/:id", element: withSuspense(EditProjectStatusPage) },
  { path: "/editproject/:id", element: withSuspense(EditProjectStatusPage) },
  { path: "/projectdetailsview/:id", element: withSuspense(ProjectDetailsPage) },
  { path: "/kpi", element: withSuspense(MasterKpiPage) },
  { path: "/projectkpis/:id", element: withSuspense(ProjectKpiFormPage) },
  { path: "/projectkpiview/:id", element: withSuspense(ProjectKpiViewPage) },
  { path: "/projectdetails/:id", element: withSuspense(ProjectPhasesPage) },
  { path: "/projectmembers/:id", element: withSuspense(ProjectMembersPage) },
  { path: "/projectrisks/:id", element: withSuspense(ProjectRisksPage) },
  { path: "/riskmitigation/:id", element: withSuspense(RiskMitigationPage) },
  { path: "/riskassessmentreport/:id", element: withSuspense(RiskAssessmentReportPage) },
  { path: "/projectattachments/:id", element: withSuspense(ProjectAttachmentsPage) },
];

export const ProjectRoutes = (
  <React.Fragment>
    {projectRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default ProjectRoutes;
