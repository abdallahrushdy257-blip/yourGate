import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";
import GuestRoute from "../../../context/GuestRoute";

// Authentication & Registration
const Login = lazy(() => import("../../../pages/Login/Login"));
const Verify = lazy(() => import("../../../pages/Verify/Verify"));
const CharityRegistration = lazy(() =>
  import("../../../pages/CharityRegistration/CharityRegistration")
);
const ForgotPassword = lazy(() =>
  import("../../../pages/ForgotPassword/ForgotPassword")
);
const SetnewPassword = lazy(() =>
  import("../../../pages/ForgotPassword/SetnewPassword")
);

// Main Landing
const MainLanding = lazy(() => import("../../../landings/MainLanding"));
const CreateMangeLanding = lazy(() =>
  import("../../../landings/CreateMangeLanding")
);
const DesignMarketingLanding = lazy(() =>
  import("../../../landings/DesignMarketingLanding")
);
const HRLanding = lazy(() => import("../../../landings/HRLanding"));
const LandingStore = lazy(() =>
  import("../../../pages/LandingStore/LandingStore")
);
const LoansLanding = lazy(() => import("../../../landings/LoansLanding"));
const DataManagementLanding = lazy(() =>
  import("../../../landings/DataManagementLanding")
);
const ArchivesLanding = lazy(() =>
  import("../../../landings/ArchivesLanding")
);
const WebsiteLanding = lazy(() => import("../../../landings/WebsiteLanding"));
const EndowmentsLanding = lazy(() =>
  import("../../../landings/EndowmentsLanding")
);
const TasksLanding = lazy(() => import("../../../landings/TasksLanding"));
const AccountingLanding = lazy(() =>
  import("../../../landings/AccountingLanding")
);

// Terms & Privacy
const Terms = lazy(() =>
  import("../../../pages/TermsandCondition/Terms")
);
const Privacy = lazy(() =>
  import("../../../pages/TermsandCondition/Privacy")
);

// External Beneficiary Registration Form
const BenefitAddDetails = lazy(() =>
  import("../../data-management/pages/beneficiaries/BenefitAddDetails")
);

// Suspense Wrapper
const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

// Guest Only Wrapper (Redirects authenticated users to /home)
const withGuest = (Component) => (
  <GuestRoute>
    <Suspense fallback={<TestPreLoader />}>
      <Component />
    </Suspense>
  </GuestRoute>
);

// Public Route Configurations
export const publicRouteConfigs = [
  // Authentication & Registration (Guest Only)
  { path: "/login", element: withGuest(Login) },
  { path: "/:id/verify", element: withGuest(Verify) },
  {
    path: "/charityregistration",
    element: withGuest(CharityRegistration),
  },
  { path: "/forgotpassword", element: withGuest(ForgotPassword) },
  { path: "/setnewpassword", element: withGuest(SetnewPassword) },

  // Main Landing & Landing Pages
  { path: "/", element: withSuspense(MainLanding) },
  {
    path: "/createMangelanding",
    element: withSuspense(CreateMangeLanding),
  },
  {
    path: "/designmarketinglanding",
    element: withSuspense(DesignMarketingLanding),
  },
  { path: "/hrlanding", element: withSuspense(HRLanding) },
  { path: "/landingStore", element: withSuspense(LandingStore) },
  { path: "/loanslanding", element: withSuspense(LoansLanding) },
  {
    path: "/dataManagementLanding",
    element: withSuspense(DataManagementLanding),
  },
  { path: "/archivesLanding", element: withSuspense(ArchivesLanding) },
  { path: "/websideLanding", element: withSuspense(WebsiteLanding) },
  {
    path: "/endowmentsLanding",
    element: withSuspense(EndowmentsLanding),
  },
  { path: "/tasksLanding", element: withSuspense(TasksLanding) },
  {
    path: "/accountingLanding",
    element: withSuspense(AccountingLanding),
  },

  // Terms & Privacy
  { path: "/terms", element: withSuspense(Terms) },
  { path: "/privacy", element: withSuspense(Privacy) },

  // رابط إضافة مستفيد خارجي (عام)
  { path: "/benefitadddetails/:id", element: withSuspense(BenefitAddDetails) },
  { path: "/benefitadddetails", element: withSuspense(BenefitAddDetails) },
];

// Public Routes
export const PublicRoutes = (
  <React.Fragment>
    {publicRouteConfigs.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={route.element}
      />
    ))}
  </React.Fragment>
);

export default PublicRoutes;