import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../pages/TestPreLoader/TestPreLoader";

const AdminHome = lazy(() => import("../Home/AdminHome"));
const Shopdesign = lazy(() => import("../shopandproject/Shopdesign"));
const Shopmarketing = lazy(() => import("../shopandproject/Shopmarketing"));
const Projectdesign = lazy(() => import("../shopandproject/Projectdesign"));
const Projectmarketing = lazy(() => import("../shopandproject/Projectmarketing"));
const Ads = lazy(() => import("../shopandproject/Ads"));
const Representatives = lazy(() => import("../organization/Representatives"));
const Modules = lazy(() => import("../organization/Modules"));
const OrganizationShow = lazy(() => import("../organization/OrganizationShow"));
const OrganizationModules = lazy(() => import("../organization/OrganizationModules"));
const OrgaminzationRequest = lazy(() => import("../organization/OrganizationRequest"));
const Organizations = lazy(() => import("../organization/Organizations"));
const PendingOrganizations = lazy(() => import("../organization/PendingOrganizations"));
const RejectedOrganizations = lazy(() => import("../organization/RejectedOrganizations"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const adminRouteConfigs = [
  { path: "/admindashboard", element: withSuspense(AdminHome) },
  { path: "/organizations", element: withSuspense(Organizations) },
  { path: "/pendingorganizations", element: withSuspense(PendingOrganizations) },
  { path: "/rejectedorganizations", element: withSuspense(RejectedOrganizations) },
  { path: "/adminshopdesign", element: withSuspense(Shopdesign) },
  { path: "/adminshopmarketing", element: withSuspense(Shopmarketing) },
  { path: "/adminprojectdesign", element: withSuspense(Projectdesign) },
  { path: "/adminprojectmarketing", element: withSuspense(Projectmarketing) },
  { path: "/ads", element: withSuspense(Ads) },
  { path: "/representatives", element: withSuspense(Representatives) },
  { path: "/modules", element: withSuspense(Modules) },
  { path: "/organizationshow/:id", element: withSuspense(OrganizationShow) },
  { path: "/organizationmodules/:id", element: withSuspense(OrganizationModules) },
  { path: "/organizationrequests/:id", element: withSuspense(OrgaminzationRequest) },
  { path: "/organization/requests", element: withSuspense(OrgaminzationRequest) },
  { path: "/organization/requests/:id", element: withSuspense(OrgaminzationRequest) },
  { path: "/organizationrequests", element: withSuspense(OrgaminzationRequest) },
];

export const AdminRoutes = (
  <React.Fragment>
    {adminRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default AdminRoutes;
