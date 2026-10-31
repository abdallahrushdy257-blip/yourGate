import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const CreateLoan = lazy(() => import("../pages/CreateLoan"));
const DelaysData = lazy(() => import("../pages/DelaysData"));
const LoansData = lazy(() => import("../pages/LoansData"));
const LoanView = lazy(() => import("../pages/LoanView"));


const LoanDetails = lazy(() => import("../pages/LoanDetials"));
const Feasibility = lazy(() => import("../pages/Feasibility"));
const FeasibilityStudy = lazy(() => import("../pages/FeasibilityStudy"));
const Fstudy = lazy(() => import("../pages/Fstudy"));
const Warrantors = lazy(() => import("../pages/Warrantors"));
const AddWarrantor = lazy(() => import("../pages/AddWarrantor"));
const EditWarrantor = lazy(() => import("../pages/EditWarrantor"));
const WarrantorsReport = lazy(() => import("../pages/WarrantorsReport"));
const WarrantorsPayments = lazy(() => import("../pages/WarrantorsPayments"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const loanRouteConfigs = [
  { path: "/createloan", element: withSuspense(CreateLoan) },
  { path: "/delaysdata", element: withSuspense(DelaysData) },
  { path: "/loansData", element: withSuspense(LoansData) },
  { path: "/feasibility", element: withSuspense(Feasibility) },
  { path: "/addwarrantor", element: withSuspense(AddWarrantor) },
  { path: "/warrantors", element: withSuspense(Warrantors) },
  { path: "/warrantorsreport", element: withSuspense(WarrantorsReport) },
  { path: "/feasibilitystudy/:id", element: withSuspense(FeasibilityStudy) },
  { path: "/warrantorspayment/:id", element: withSuspense(WarrantorsPayments) },
  { path: "/editwarrantor/:id", element: withSuspense(EditWarrantor) },
  { path: "/fstudy/:id", element: withSuspense(Fstudy) },
  { path: "/loanView/:id", element: withSuspense(LoanView) },
  { path: "/loandetails/:id", element: withSuspense(LoanDetails) },
];

export const LoanRoutes = (
  <React.Fragment>
    {loanRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default LoanRoutes;

