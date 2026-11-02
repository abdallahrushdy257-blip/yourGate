import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const Missions = lazy(() => import("../../../pages/Missions/Missions"));
const AddMissions = lazy(() => import("../../../pages/Missions/AddMissions"));
const EditMissions = lazy(() => import("../../../pages/Missions/EditMissions"));
const ShowMissions = lazy(() => import("../../../pages/Missions/ShowMissions"));
const ShowMissionsEmp = lazy(() => import("../../../pages/Missions/ShowMissionsEmp"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const taskRouteConfigs = [
  { path: "/missions", element: withSuspense(Missions) },
  { path: "/addmission", element: withSuspense(AddMissions) },
  { path: "/editMissions/:id", element: withSuspense(EditMissions) },
  { path: "/showMissions/:id", element: withSuspense(ShowMissions) },
  { path: "/showmissionsemp/:id", element: withSuspense(ShowMissionsEmp) },
  { path: "/missionemployee", element: withSuspense(ShowMissionsEmp) },
];

export const TaskRoutes = (
  <React.Fragment>
    {taskRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default TaskRoutes;

