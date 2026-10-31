import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const Home = lazy(() => import("../pages/Home"));
const CommitmentCompliance = lazy(() => import("../pages/CommitmentCompliance"));
const Terms = lazy(() => import("../pages/Terms"));
const Privacy = lazy(() => import("../pages/Privacy"));
const NotificationItem = lazy(() => import("../pages/Notification"));
const Interest = lazy(() => import("../pages/Interest"));
const TestPrint = lazy(() => import("../pages/TestPrint"));
const LandingStore = lazy(() => import("../pages/LandingStore"));
const CarouselComponent = lazy(() => import("../pages/CarouselCom"));

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
  { path: "/interests", element: withSuspense(Interest) },
  { path: "/testprint", element: withSuspense(TestPrint) },
  { path: "/landingstore", element: withSuspense(LandingStore) },
  { path: "/carouselcomponent", element: withSuspense(CarouselComponent) },
];

export const CommonRoutes = (
  <React.Fragment>
    {commonRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default CommonRoutes;

