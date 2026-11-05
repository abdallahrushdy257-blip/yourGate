import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const UsersPage = lazy(() => import("../pages/Users/Users"));
const EditUserPage = lazy(() => import("../pages/Users/EditUser"));
const UserProfilePage = lazy(() => import("../pages/Users/UserProfile"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const userRouteConfigs = [
  { path: "/users", element: withSuspense(UsersPage) },
  { path: "/useredit/:id", element: withSuspense(EditUserPage) },
  { path: "/userprofile", element: withSuspense(UserProfilePage) },
  { path: "/profile", element: withSuspense(UserProfilePage) },
];

export const UserRoutes = (
  <React.Fragment>
    {userRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default UserRoutes;

