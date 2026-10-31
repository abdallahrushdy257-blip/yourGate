import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const AddNewClient = lazy(() => import("../pages/AddNewClient/AddNewClient"));
const AddNewSupplier = lazy(() => import("../pages/AddNewSupplier/AddNewSupplier"));
const StatementOfAccount = lazy(() => import("../pages/StatementOfAccount/StatementOfAccount"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const partnerRouteConfigs = [
  { path: "/addnewclient", element: withSuspense(AddNewClient) },
  { path: "/addnewsupplier", element: withSuspense(AddNewSupplier) },
  { path: "/statementofaccount", element: withSuspense(StatementOfAccount) },
];

export const PartnerRoutes = (
  <React.Fragment>
    {partnerRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default PartnerRoutes;

