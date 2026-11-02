import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";

const Home = lazy(() => import("../pages/Home"));
const CommitmentCompliance = lazy(() => import("../pages/CommitmentCompliance"));
const Terms = lazy(() => import("../pages/Terms"));
const Privacy = lazy(() => import("../pages/Privacy"));
const NotificationItem = lazy(() => import("../pages/Notification"));

const TestPrint = lazy(() => import("../pages/TestPrint"));
const LandingStore = lazy(() => import("../pages/LandingStore"));
const CarouselComponent = lazy(() => import("../pages/CarouselCom"));
const ReviewData = lazy(() => import ("../../../pages/ReviewData/ReviewData"));
const CompletingData = lazy(() => import ("../../../pages/CompletingData/CompletingData"));
const TestPreLoader = lazy(() => import ("../../../pages/TestPreLoader/TestPreLoader"));


const DataReview = lazy(() => import("../../../pages/DataReview/DataReview"));
const BankData = lazy(() => import("../../data-management/pages/beneficiaries/BankData"));
const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const commonRouteConfigs = [
  { path: "/home", element: withSuspense(Home) },
  { path: "/commitmentcompliance", element: withSuspense(CommitmentCompliance) },
  { path: "/terms", element: withSuspense(Terms) },
  { path: "/privacy", element: withSuspense(Privacy) },
  { path: "/notifications", element: withSuspense(NotificationItem) },

  { path: "/testprint", element: withSuspense(TestPrint) },
  { path: "/landingstore", element: withSuspense(LandingStore) },
  { path: "/carouselcomponent", element: withSuspense(CarouselComponent) },
  { path: "/review", element: withSuspense(ReviewData) },
  { path: "/complete", element: withSuspense(CompletingData) },
  { path: "/testpreLoader", element: withSuspense(TestPreLoader) },


  { path: "/datareview", element: withSuspense(DataReview) },
  { path: "/bankdata", element: withSuspense(BankData) },
  { path: "notifications/:id", element: withSuspense(NotificationItem) },
];

export const CommonRoutes = (
  <React.Fragment>
    {commonRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default CommonRoutes;

