import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const ProjectListPage = lazy(() => import("../pages/ProjectStatus/ProjectStatus"));
const ProjectDetailsPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/ProjectDetailsView"));
const EditProjectStatusPage = lazy(() => import("../pages/ProjectStatus/EditProjectStatus"));
const MarketingDesignProjectManagementPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/MarketingDesignProjectManagement"));
const MasterKpiPage = lazy(() => import("../pages/KPI/KPI"));
const ProjectKpiViewPage = lazy(() => import("../pages/KPI/ProjectKpiView"));
const ProjectKpiFormPage = lazy(() => import("../pages/KPI/ProjectKPI"));
const ProjectPhasesPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/ProjectPhases"));
const ProjectMembersPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/ProjectMember"));
const ProjectRisksPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/ProjectRisk"));
const RiskMitigationPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/RiskMitigation"));
const RiskAssessmentReportPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/RiskAssessmentReport"));
const ProjectAttachmentsPage = lazy(() => import("../../../pages/MarketingDesignProjectManagement/ProjectAttachment"));
const DepartmentsDetailsPage = lazy(() => import("../../../pages/DepartmentsDetails/DepartmentsDetails"));
const ProjectChartPage = lazy(() => import("../../cases/pages/CaseDetailsChart/ProjectChart"));
const SectionsReportPage = lazy(() => import("../../hr/pages/sections/SectionsReport"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const projectRouteConfigs = [
  // تقارير المشاريع وحالاتها
  { path: "/projectStatus", element: withSuspense(ProjectListPage) },
  { path: "/projectstatus", element: withSuspense(ProjectListPage) },
  { path: "/sectionsreport", element: withSuspense(SectionsReportPage) },
  { path: "/SectionsReport", element: withSuspense(SectionsReportPage) },
  { path: "/projectpaymentreport", element: withSuspense(ProjectListPage) },

  // إدارة المشاريع والتعديل
  { path: "/marketingdesignprojectmanagement", element: withSuspense(MarketingDesignProjectManagementPage) },
  { path: "/editprojectstatus/:id", element: withSuspense(EditProjectStatusPage) },
  { path: "/editproject/:id", element: withSuspense(EditProjectStatusPage) },
  { path: "/projectdetailsview/:id", element: withSuspense(ProjectDetailsPage) },
  { path: "/projectdetails/:id", element: withSuspense(ProjectPhasesPage) },
  { path: "/projectchart/:id", element: withSuspense(ProjectChartPage) },

  // مؤشرات الأداء KPIs
  { path: "/KPI", element: withSuspense(MasterKpiPage) },
  { path: "/kpi", element: withSuspense(MasterKpiPage) },
  { path: "/projectkpis/:id", element: withSuspense(ProjectKpiFormPage) },
  { path: "/projectkpiview/:id", element: withSuspense(ProjectKpiViewPage) },

  // الأعضاء والمخاطر والمرفقات
  { path: "/projectmembers/:id", element: withSuspense(ProjectMembersPage) },
  { path: "/projectrisks/:id", element: withSuspense(ProjectRisksPage) },
  { path: "/projectrisks", element: withSuspense(ProjectRisksPage) },
  { path: "/riskmitigation/:id", element: withSuspense(RiskMitigationPage) },
  { path: "/riskassessmentreport/:id", element: withSuspense(RiskAssessmentReportPage) },
  { path: "/projectattachments/:id", element: withSuspense(ProjectAttachmentsPage) },
  { path: "/departmentsdetails", element: withSuspense(DepartmentsDetailsPage) },
];

export const ProjectRoutes = (
  <React.Fragment>
    {projectRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default ProjectRoutes;
