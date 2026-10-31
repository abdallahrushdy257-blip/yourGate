import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const TrainingForm = lazy(() => import("../pages/TrainingForm"));
const TrainingList = lazy(() => import("../pages/TrainingList"));
const KsaForm = lazy(() => import("../pages/KsaForm"));
const KsaList = lazy(() => import("../pages/KsaList"));
const SurveyForm = lazy(() => import("../pages/SurveyForm"));
const SurveyList = lazy(() => import("../pages/SurveyList"));
const LatePoliciesPage = lazy(() => import("../pages/LatePoliciesPage"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const trainingRouteConfigs = [
  { path: "/surveys", element: withSuspense(SurveyList) },
  { path: "/employeesurvey", element: withSuspense(SurveyList) },
  { path: "/surveyform", element: withSuspense(SurveyForm) },
  { path: "/employeesurvey/:id", element: withSuspense(SurveyForm) },
  { path: "/surveys/new", element: withSuspense(SurveyForm) },
  { path: "/surveys/:id/edit", element: withSuspense(SurveyForm) },
  { path: "/traininglist", element: withSuspense(TrainingList) },
  { path: "/employeetraining", element: withSuspense(TrainingList) },
  { path: "/trainingform", element: withSuspense(TrainingForm) },
  { path: "/trainingform/:id", element: withSuspense(TrainingForm) },
  { path: "/employeetraining/:id", element: withSuspense(TrainingForm) },
  { path: "/ksalist", element: withSuspense(KsaList) },
  { path: "/employeeksa", element: withSuspense(KsaList) },
  { path: "/ksaform", element: withSuspense(KsaForm) },
  { path: "/ksa/:id", element: withSuspense(KsaForm) },
  { path: "/latepolitics", element: withSuspense(LatePoliciesPage) },
  { path: "/LatePoliciesPage", element: withSuspense(LatePoliciesPage) },
];

export const TrainingRoutes = (
  <React.Fragment>
    {trainingRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default TrainingRoutes;

