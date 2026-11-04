import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const ArchiveReport = lazy(() => import("../pages/Archives/ArchiveReport"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const archiveRouteConfigs = [
  { path: "/archiveReport", element: withSuspense(ArchiveReport) },
  { path: "/archivereport", element: withSuspense(ArchiveReport) },
];

export const ArchiveRoutes = (
  <React.Fragment>
    {archiveRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default ArchiveRoutes;

