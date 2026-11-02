import React from "react";
import { Route } from "react-router-dom";
import { donorsRoutes } from "./donorsRoutes";
import { vendorsRoutes } from "./vendorsRoutes";
import { beneficiariesRoutes } from "./beneficiariesRoutes";
import { associationRoutes } from "./associationRoutes";

export const dataManagementRoutes = [
  ...donorsRoutes,
  ...vendorsRoutes,
  ...beneficiariesRoutes,
  ...associationRoutes,
];

export const DataManagementRoutes = (
  <React.Fragment>
    {dataManagementRoutes.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default DataManagementRoutes;
