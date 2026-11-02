import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const Interest = lazy(() => import("../pages/donors/Interest"));
const ShowDonors = lazy(() => import("../pages/donors/ShowDonors"));
const AddDonor = lazy(() => import("../pages/donors/AddDonor"));
const EditDonor = lazy(() => import("../pages/donors/EditDonor"));
const DonerReceiptVoucher = lazy(() => import("../pages/donors/DonerReceiptVoucher"));
const DonationsReport = lazy(() => import("../pages/donors/DonationsReport"));
const DonationDetails = lazy(() => import("../pages/donors/DonationDetails"));
const ViewDonations = lazy(() => import("../pages/donors/ViewDonations"));
const ViewDonationsProject = lazy(() => import("../pages/donors/ViewDonationsProject"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const donorsRoutes = [
  { path: "/interests", element: withSuspense(Interest) },
  { path: "/donors", element: withSuspense(ShowDonors) },
  { path: "/addDonor", element: withSuspense(AddDonor) },
  { path: "/adddonor", element: withSuspense(AddDonor) },
  { path: "/editdonor/:id", element: withSuspense(EditDonor) },
  { path: "/donationsreport", element: withSuspense(DonationsReport) },
  { path: "/donationsReport", element: withSuspense(DonationsReport) },
  { path: "/donationdetails/:id", element: withSuspense(DonationDetails) },
  { path: "/donationDetails/:id", element: withSuspense(DonationDetails) },
  { path: "/donerreceiptvoucher/:id", element: withSuspense(DonerReceiptVoucher) },
  { path: "/viewdonations", element: withSuspense(ViewDonations) },
  { path: "/viewdonations/:id", element: withSuspense(ViewDonations) },
  { path: "/viewdonationsproject/:id", element: withSuspense(ViewDonationsProject) },
  { path: "/projectpaymentvouchers/:id", element: withSuspense(ViewDonationsProject) },
];

export const donorsRouteConfigs = donorsRoutes;

export const DonorsRoutes = (
  <React.Fragment>
    {donorsRoutes.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default DonorsRoutes;

