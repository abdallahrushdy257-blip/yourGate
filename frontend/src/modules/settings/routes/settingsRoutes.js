import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

// ── إعدادات النظام ───────────────────────────────────────────
const SettingTabsPage = lazy(() => import("../pages/Setting/SettingTabs"));
const GenSettingPage = lazy(() => import("../pages/Setting/GenSetting"));
const EnterSettingPage = lazy(() => import("../pages/Setting/EnterSetting"));
const PrintSettingPage = lazy(() => import("../pages/Setting/PrintSetting"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const settingsRouteConfigs = [
  // ── الإعدادات ─────────────────────────────────────────────────
  { path: "/settingTabs", element: withSuspense(SettingTabsPage) },
  { path: "/setting/general", element: withSuspense(GenSettingPage) },
  { path: "/setting/enter", element: withSuspense(EnterSettingPage) },
  { path: "/setting/print", element: withSuspense(PrintSettingPage) },
];

export const SettingsRoutes = (
  <React.Fragment>
    {settingsRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default SettingsRoutes;
