import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const ProjectListPage = lazy(() => import("../../../pages/ProjectStatus/ProjectStatus"));
const ProjectDetailsPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/ProjectDetailsView"));
const EditProjectStatusPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/EditProjectStatus"));
const MarketingDesignProjectManagementPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/MarketingDesignProjectManagement"));
const MasterKpiPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/KPI"));
const ProjectKpiViewPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/ProjectKpiView"));
const ProjectKpiFormPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/ProjectKPI"));
const ProjectPhasesPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/ProjectPhases"));
const ProjectMembersPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/ProjectMember"));
const ProjectRisksPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/ProjectRisk"));
const RiskMitigationPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/RiskMitigation"));
const RiskAssessmentReportPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/RiskAssessmentReport"));
const ProjectAttachmentsPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/ProjectAttachment"));
const DepartmentsDetailsPage = lazy(() => import("../../../pages/DepartmentsDetails/DepartmentsDetails"));
const ProjectChartPage = lazy(() => import("../../../pages/CaseDetailsChart/ProjectChart"));
const SectionsReportPage = lazy(() => import("../../../pages/sections/SectionsReport"));
const CreateAndManagePage = lazy(() => import("../../../pages/createAndManage/createAndManage"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const projectRouteConfigs = [
  { path: "/projectStatus", element: withSuspense(ProjectListPage) },
  { path: "/projectstatus", element: withSuspense(ProjectListPage) },
  { path: "/KPI", element: withSuspense(MasterKpiPage) },
  { path: "/sectionsreport", element: withSuspense(SectionsReportPage) },
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
  { path: "/projectrisks", element: withSuspense(ProjectRisksPage) },
  { path: "/riskmitigation/:id", element: withSuspense(RiskMitigationPage) },
  { path: "/riskassessmentreport/:id", element: withSuspense(RiskAssessmentReportPage) },
  { path: "/projectattachments/:id", element: withSuspense(ProjectAttachmentsPage) },
  { path: "/departmentsdetails", element: withSuspense(DepartmentsDetailsPage) },
  { path: "/projectchart/:id", element: withSuspense(ProjectChartPage) },
  { path: "/SectionsReport", element: withSuspense(SectionsReportPage) },
  { path: "/createandmanage", element: withSuspense(CreateAndManagePage) },
];

export const ProjectRoutes = (
  <React.Fragment>
    {projectRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default ProjectRoutes;
