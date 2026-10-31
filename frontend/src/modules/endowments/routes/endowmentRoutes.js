import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const Endowments = lazy(() => import("../pages/Endowments"));
const EditEndowments = lazy(() => import("../pages/EditEndowments"));
const EndowmentsReport = lazy(() => import("../pages/EndowmentsReport"));
const PaymentsDue = lazy(() => import("../pages/PaymentsDue"));
const PaymentHistory = lazy(() => import("../pages/PaymentHistory"));
const ShowpaymentHistory = lazy(() => import("../pages/ShowpaymentHistory"));
const EndowmentSammary = lazy(() => import("../pages/EndowmentSammary"));
const ViewEndowments = lazy(() => import("../pages/ViewEndowments"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const endowmentRouteConfigs = [
  { path: "/endowments", element: withSuspense(Endowments) },
  { path: "/editEndowments/:id", element: withSuspense(EditEndowments) },
  { path: "/endowmentsreport", element: withSuspense(EndowmentsReport) },
  { path: "/paymentsdue", element: withSuspense(PaymentsDue) },
  { path: "/endowmentsreceiptvoucher/:id", element: withSuspense(PaymentsDue) },
  { path: "/paymenthistory", element: withSuspense(PaymentHistory) },
  { path: "/showpaymentHistory/:id", element: withSuspense(ShowpaymentHistory) },
  { path: "/endowmentsammary", element: withSuspense(EndowmentSammary) },
  { path: "/endowmentsSammary/:id", element: withSuspense(EndowmentSammary) },
  { path: "/viewendowments/:id", element: withSuspense(ViewEndowments) },
];

export const EndowmentRoutes = (
  <React.Fragment>
    {endowmentRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default EndowmentRoutes;

