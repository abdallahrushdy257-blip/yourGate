import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const DonationsReport = lazy(() => import("../pages/DonationsReport"));
const DonationDetails = lazy(() => import("../pages/DonationDetails"));
const ViewDonations = lazy(() => import("../pages/ViewDonations"));
const ViewDonationsProject = lazy(() => import("../pages/ViewDonationsProject"));
const ArchiveReport = lazy(() => import("../pages/ArchiveReport"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const donationRouteConfigs = [
  { path: "/donationsreport", element: withSuspense(DonationsReport) },
  { path: "/donationsReport", element: withSuspense(DonationsReport) },
  { path: "/donationdetails/:id", element: withSuspense(DonationDetails) },
  { path: "/viewdonations", element: withSuspense(ViewDonations) },
  { path: "/viewdonations/:id", element: withSuspense(ViewDonations) },
  { path: "/viewdonationsproject/:id", element: withSuspense(ViewDonationsProject) },
  { path: "/projectpaymentvouchers/:id", element: withSuspense(ViewDonationsProject) },
  { path: "/archivereport", element: withSuspense(ArchiveReport) },
  { path: "/archiveReport", element: withSuspense(ArchiveReport) },
];

export const DonationRoutes = (
  <React.Fragment>
    {donationRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default DonationRoutes;

