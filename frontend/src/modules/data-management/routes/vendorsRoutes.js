import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../common/pages/TestPreLoader/TestPreLoader";

const HcVendor = lazy(() => import("../pages/vendors/Hcvendor"));
const AddHcVendor = lazy(() => import("../pages/vendors/Addhcvendor"));
const EditHcVendor = lazy(() => import("../pages/vendors/Edithcvendor"));
const HcVendorReport = lazy(() => import("../pages/vendors/HcVendorReport"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const vendorsRoutes = [
  { path: "/hcvendor", element: withSuspense(HcVendor) },
  { path: "/addhcvendor", element: withSuspense(AddHcVendor) },
  { path: "/edithcvendor/:id", element: withSuspense(EditHcVendor) },
  { path: "/hcvendorReport", element: withSuspense(HcVendorReport) },
  { path: "/hcvendorreport", element: withSuspense(HcVendorReport) },
];

export const VendorsRoutes = (
  <React.Fragment>
    {vendorsRoutes.map((r) => (
      <Route key={r.path} path={r.path} element={r.element} />
    ))}
  </React.Fragment>
);

export default VendorsRoutes;
