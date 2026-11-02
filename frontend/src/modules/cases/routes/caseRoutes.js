import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const CaseDetailsPage = lazy(() => import("../pages/CaseDetails/CaseDetails"));
const CaseDetailsViewPage = lazy(() => import("../pages/CaseDetails/CaseDetailsView"));
const CaseDetailsChartPage = lazy(() => import("../pages/CaseDetailsChart/CaseDetailsChart"));
const EditCaseDetailsPage = lazy(() => import("../pages/createAndManage/EditCaseDetails"));
const CreateAndManegePage = lazy(() => import("../pages/createAndManage/createAndManage"));
const CaseDataPage = lazy(() => import("../pages/CaseData/CaseData"));
const PrintCaseDataPage = lazy(() => import("../pages/PrintCaseData/PrintCaseData"));
const CaseStudyPage = lazy(() => import("../../data-management/pages/beneficiaries/CaseStudy"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const caseRoutes = [
  // تقرير الحالات
  { path: "/casedetails", element: withSuspense(CaseDetailsPage) },
  { path: "/casedetailsview/:id", element: withSuspense(CaseDetailsViewPage) },
  { path: "/casedetailschart/:id", element: withSuspense(CaseDetailsChartPage) },
  { path: "/editcasedetails/:id", element: withSuspense(EditCaseDetailsPage) },
  
  // إنشاء وإدارة حالة
  { path: "/createandmanege", element: withSuspense(CreateAndManegePage) },
  
  // بيانات وطباعة ودراسة الحالة
  { path: "/casedata/:id", element: withSuspense(CaseDataPage) },
  { path: "/printcasedata", element: withSuspense(PrintCaseDataPage) },
  { path: "/casestudy/:id", element: withSuspense(CaseStudyPage) },
];

export const CaseRoutes = (
  <React.Fragment>
    {caseRoutes.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default CaseRoutes;

