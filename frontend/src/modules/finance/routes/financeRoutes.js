import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const ReceiptVoucherPage = lazy(() => import("../../../pages/ReceiptVoucher/ReceiptVoucher"));
const ReceiptVoucherProjectPage = lazy(() => import("../../../pages/ReceiptVoucher/ReceiptVoucherProject"));
const ReceiptVoucherViewPage = lazy(() => import("../../../pages/ReceiptVoucher/ReceiptVoucherView"));
const ReceiptVoucherViewProjectPage = lazy(() => import("../../../pages/ReceiptVoucher/ReceiptVoucherViewProject"));
const ReceiptVoucherEndowmentsPage = lazy(() => import("../../../pages/ReceiptVoucher/ReceiptVoucherEndowments"));
const ReceiptVoucherLoanPage = lazy(() => import("../../../pages/ReceiptVoucher/ReceiptVoucherLoan"));

const PaymentVoucherPage = lazy(() => import("../../../pages/PaymentVoucher/PaymentVoucher"));
const PaymentVoucherGeneralPage = lazy(() => import("../../../pages/PaymentVoucher/PaymentVoucherGeneral"));
const PaymentVoucherProjectPage = lazy(() => import("../../../pages/PaymentVoucher/PaymentVoucherProject"));
const EndowmentsVoucherPage = lazy(() => import("../../../pages/PaymentVoucher/EndowmentsVoucher"));
const PaymentVoucherLoanPage = lazy(() => import("../../../pages/PaymentVoucher/PaymentVoucherLoan"));

const GeneralReceiptVoucherPage = lazy(() => import("../../../pages/Accounting/GeneralPayment/GeneralReceiptVoucher"));
const GeneralReceiptVoucherCashPage = lazy(() => import("../../../pages/Accounting/GeneralPayment/GeneralReceiptVoucherCash"));
const GeneralPaymentVoucherPage = lazy(() => import("../../../pages/Accounting/GeneralPayment/GeneralPaymentVoucher"));
const GeneralPaymentVoucherCashPage = lazy(() => import("../../../pages/Accounting/GeneralPayment/GeneralPaymentVoucherCash"));

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
