import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const PaymentData = lazy(() => import("../pages/PaymentData"));
const PaymentReport = lazy(() => import("../pages/PaymentReport"));
const PaymentDetails = lazy(() => import("../pages/PaymentDetails"));
const AssociationPaymentReport = lazy(() => import("../pages/AssociationPaymentReport"));
const AssociationPaymentDetails = lazy(() => import("../pages/AssociationPaymentDetails"));
const ReceiptVoucher = lazy(() => import("../pages/ReceiptVoucher"));
const ReceiptVoucherView = lazy(() => import("../pages/ReceiptVoucherView"));
const ReceiptVoucherLoan = lazy(() => import("../pages/ReceiptVoucherLoan"));
const ReceiptVoucherEndowments = lazy(() => import("../pages/ReceiptVoucherEndowments"));
const ReceiptVoucherProject = lazy(() => import("../pages/ReceiptVoucherProject"));
const ReceiptVoucherViewProject = lazy(() => import("../pages/ReceiptVoucherViewProject"));
const PaymentVoucher = lazy(() => import("../pages/PaymentVoucher"));
const PaymentVoucherLoan = lazy(() => import("../pages/PaymentVoucherLoan"));
const EndowmentsVoucher = lazy(() => import("../pages/EndowmentsVoucher"));
const Moneyreceiptreports = lazy(() => import("../pages/Moneyreceiptreports"));
const Moneytransferreports = lazy(() => import("../pages/Moneytransferreports"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const voucherRouteConfigs = [
  { path: "/paymentdata/:id", element: withSuspense(PaymentData) },
  { path: "/paymentReport", element: withSuspense(PaymentReport) },
  { path: "/projectpaymentreport", element: withSuspense(PaymentReport) },
  { path: "/paymentDetails/:id", element: withSuspense(PaymentDetails) },
  { path: "/associationMemberspaymentReport", element: withSuspense(AssociationPaymentReport) },
  { path: "/associationpaymentDetails/:id", element: withSuspense(AssociationPaymentDetails) },
  { path: "/receiptvoucher", element: withSuspense(ReceiptVoucher) },
  { path: "/receiptvoucherview/:id", element: withSuspense(ReceiptVoucherView) },
  { path: "/receiptvoucherloan/:id", element: withSuspense(ReceiptVoucherLoan) },
  { path: "/receiptvoucherendowments/:id", element: withSuspense(ReceiptVoucherEndowments) },
  { path: "/receiptvoucherproject/:id", element: withSuspense(ReceiptVoucherProject) },
  { path: "/receiptvoucherviewproject/:id", element: withSuspense(ReceiptVoucherViewProject) },
  { path: "/paymentvoucher", element: withSuspense(PaymentVoucher) },
  { path: "/paymentvoucherloan/:id", element: withSuspense(PaymentVoucherLoan) },
  { path: "/endowmentsVoucher/:id", element: withSuspense(EndowmentsVoucher) },
  { path: "/moneyreceiptreports", element: withSuspense(Moneyreceiptreports) },
  { path: "/moneyreceiptreports/:id", element: withSuspense(Moneyreceiptreports) },
  { path: "/moneytransferreports", element: withSuspense(Moneytransferreports) },
  { path: "/moneytransferreports/:id", element: withSuspense(Moneytransferreports) },
];

export const VoucherRoutes = (
  <React.Fragment>
    {voucherRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default VoucherRoutes;

