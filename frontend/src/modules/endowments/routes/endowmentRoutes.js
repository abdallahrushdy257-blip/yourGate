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
  // ── الأوقاف والتقارير ─────────────────────────────────────────
  { path: "/endowments", element: withSuspense(Endowments) },
  { path: "/endowmentsReport", element: withSuspense(EndowmentsReport) },
  { path: "/endowmentsreport", element: withSuspense(EndowmentsReport) },
  { path: "/editEndowments/:id", element: withSuspense(EditEndowments) },
  { path: "/editendowments/:id", element: withSuspense(EditEndowments) },
  { path: "/viewendowments/:id", element: withSuspense(ViewEndowments) },
  { path: "/viewEndowments/:id", element: withSuspense(ViewEndowments) },

  // ── مستحقات الدفعات وتاريخ المدفوعات ──────────────────────────
  { path: "/paymentsDue", element: withSuspense(PaymentsDue) },
  { path: "/paymentsdue", element: withSuspense(PaymentsDue) },
  { path: "/paymentHistory", element: withSuspense(PaymentHistory) },
  { path: "/paymenthistory", element: withSuspense(PaymentHistory) },
  { path: "/showpaymentHistory/:id", element: withSuspense(ShowpaymentHistory) },
  { path: "/endowmentsreceiptvoucher/:id", element: withSuspense(PaymentsDue) },

  // ── ملخص الوقف ───────────────────────────────────────────────
  { path: "/endowmentsammary", element: withSuspense(EndowmentSammary) },
  { path: "/endowmentsSammary/:id", element: withSuspense(EndowmentSammary) },
];

export const EndowmentRoutes = (
  <React.Fragment>
    {endowmentRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default EndowmentRoutes;
