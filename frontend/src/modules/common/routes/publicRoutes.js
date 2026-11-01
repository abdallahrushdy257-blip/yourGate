import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

// Authentication & Registration
const Login = lazy(() => import("../../../pages/Login/Login"));
const Verify = lazy(() => import("../../../pages/Verify/Verify"));
const CharityRegistration = lazy(() =>
  import("../../../pages/CharityRegistration/CharityRegistration")
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

// Suspense Wrapper
const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

// Public Route Configurations
export const publicRouteConfigs = [
  { path: "/login", element: withSuspense(Login) },
  { path: "/:id/verify", element: withSuspense(Verify) },
  {
    path: "/charityregistration",
    element: withSuspense(CharityRegistration),
  },
  { path: "/", element: withSuspense(MainLanding) },

  // Landing Pages
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