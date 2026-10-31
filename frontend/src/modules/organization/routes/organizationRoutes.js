import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const Users = lazy(() => import("../pages/Users"));
const OrganizationalChart = lazy(() => import("../pages/OrganizationalChart"));
const UserProfile = lazy(() => import("../pages/UserProfile"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const organizationRouteConfigs = [
  { path: "/users", element: withSuspense(Users) },
  { path: "/organizationalChart", element: withSuspense(OrganizationalChart) },
  { path: "/userprofile", element: withSuspense(UserProfile) },
  { path: "/profile", element: withSuspense(UserProfile) },
  { path: "/useredit/:id", element: withSuspense(Users) },
];

export const OrganizationRoutes = (
  <React.Fragment>
    {organizationRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default OrganizationRoutes;

