import React, { lazy } from "react";
import { Route } from "react-router-dom";

const HcVendor = lazy(() => import("../pages/vendors/Hcvendor"));
const AddHcVendor = lazy(() => import("../pages/vendors/Addhcvendor"));
const EditHcVendor = lazy(() => import("../pages/vendors/Edithcvendor"));
const HcVendorReport = lazy(() => import("../pages/vendors/HcVendorReport"));

export const vendorsRoutes = [
  { path: "/hcvendor", element: <HcVendor /> },
  { path: "/addhcvendor", element: <AddHcVendor /> },
  { path: "/edithcvendor/:id", element: <EditHcVendor /> },
  { path: "/hcvendorReport", element: <HcVendorReport /> },
  { path: "/hcvendorreport", element: <HcVendorReport /> },
];

export const VendorsRoutes = () => (
  <>
    {vendorsRoutes.map((r, i) => (
      <Route key={i} path={r.path} element={r.element} />
    ))}
  </>
);

export default VendorsRoutes;

