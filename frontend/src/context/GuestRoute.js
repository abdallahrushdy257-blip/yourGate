import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children ? children : <Outlet />;
};

export default GuestRoute;

