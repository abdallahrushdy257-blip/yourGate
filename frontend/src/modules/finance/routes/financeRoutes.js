import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const ReceiptVoucherPage = lazy(() => import("../pages").then((m) => ({ default: m.ReceiptVoucherPage })));
const ReceiptVoucherProjectPage = lazy(() => import("../pages").then((m) => ({ default: m.ReceiptVoucherProjectPage })));
const ReceiptVoucherViewPage = lazy(() => import("../pages").then((m) => ({ default: m.ReceiptVoucherViewPage })));
const ReceiptVoucherViewProjectPage = lazy(() => import("../pages").then((m) => ({ default: m.ReceiptVoucherViewProjectPage })));
const ReceiptVoucherEndowmentsPage = lazy(() => import("../pages").then((m) => ({ default: m.ReceiptVoucherEndowmentsPage })));
const ReceiptVoucherLoanPage = lazy(() => import("../pages").then((m) => ({ default: m.ReceiptVoucherLoanPage })));

const PaymentVoucherPage = lazy(() => import("../pages").then((m) => ({ default: m.PaymentVoucherPage })));
const PaymentVoucherGeneralPage = lazy(() => import("../pages").then((m) => ({ default: m.PaymentVoucherGeneralPage })));
const PaymentVoucherProjectPage = lazy(() => import("../pages").then((m) => ({ default: m.PaymentVoucherProjectPage })));
const EndowmentsVoucherPage = lazy(() => import("../pages").then((m) => ({ default: m.EndowmentsVoucherPage })));
const PaymentVoucherLoanPage = lazy(() => import("../pages").then((m) => ({ default: m.PaymentVoucherLoanPage })));

const GeneralReceiptVoucherPage = lazy(() => import("../pages").then((m) => ({ default: m.GeneralReceiptVoucherPage })));
const GeneralReceiptVoucherCashPage = lazy(() => import("../pages").then((m) => ({ default: m.GeneralReceiptVoucherCashPage })));
const GeneralPaymentVoucherPage = lazy(() => import("../pages").then((m) => ({ default: m.GeneralPaymentVoucherPage })));
const GeneralPaymentVoucherCashPage = lazy(() => import("../pages").then((m) => ({ default: m.GeneralPaymentVoucherCashPage })));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const financeRouteConfigs = [
  { path: "/receiptvoucher/:id", element: withSuspense(ReceiptVoucherPage) },
  { path: "/projectvoucher/:id", element: withSuspense(ReceiptVoucherProjectPage) },
  { path: "/receiptVoucherView/:id", element: withSuspense(ReceiptVoucherViewPage) },
  { path: "/receiptVoucherViewproject/:id", element: withSuspense(ReceiptVoucherViewProjectPage) },
  { path: "/receiptvoucherendowments/:id", element: withSuspense(ReceiptVoucherEndowmentsPage) },
  { path: "/receiptvoucherloan/:id", element: withSuspense(ReceiptVoucherLoanPage) },

  { path: "/paymentvoucher/:id", element: withSuspense(PaymentVoucherPage) },
  { path: "/paymentvoucherGeneral/:id", element: withSuspense(PaymentVoucherGeneralPage) },
  { path: "/paymentvoucherproject/:id", element: withSuspense(PaymentVoucherProjectPage) },
  { path: "/endowmentsVoucher/:id", element: withSuspense(EndowmentsVoucherPage) },
  { path: "/paymentvoucherloan/:id", element: withSuspense(PaymentVoucherLoanPage) },

  { path: "/generalreceiptvoucher", element: withSuspense(GeneralReceiptVoucherPage) },
  { path: "/generalreceiptvouchercash", element: withSuspense(GeneralReceiptVoucherCashPage) },
  { path: "/generalpaymentvoucher", element: withSuspense(GeneralPaymentVoucherPage) },
  { path: "/generalpaymentvouchercash", element: withSuspense(GeneralPaymentVoucherCashPage) },
];

export const FinanceRoutes = (
  <React.Fragment>
    {financeRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default FinanceRoutes;
