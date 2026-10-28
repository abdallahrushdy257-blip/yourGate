import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const SettingTabsPage = lazy(() => import("../pages").then((m) => ({ default: m.SettingTabsPage })));
const GenSettingPage = lazy(() => import("../pages").then((m) => ({ default: m.GenSettingPage })));
const EnterSettingPage = lazy(() => import("../pages").then((m) => ({ default: m.EnterSettingPage })));

const RolesPage = lazy(() => import("../pages").then((m) => ({ default: m.RolesPage })));
const EditRolePage = lazy(() => import("../pages").then((m) => ({ default: m.EditRolePage })));
const PermissionsTabsPage = lazy(() => import("../pages").then((m) => ({ default: m.PermissionsTabsPage })));
const CasePermissionsPage = lazy(() => import("../pages").then((m) => ({ default: m.CasePermissionsPage })));
const ProjectPermissionsPage = lazy(() => import("../pages").then((m) => ({ default: m.ProjectPermissionsPage })));
const HrPermissionsPage = lazy(() => import("../pages").then((m) => ({ default: m.HrPermissionsPage })));
const LoansPermissionsPage = lazy(() => import("../pages").then((m) => ({ default: m.LoansPermissionsPage })));
const EndowmentsPermissionsPage = lazy(() => import("../pages").then((m) => ({ default: m.EndowmentsPermissionsPage })));
const ArchivePermissionsPage = lazy(() => import("../pages").then((m) => ({ default: m.ArchivePermissionsPage })));
const MissionsPermissionsPage = lazy(() => import("../pages").then((m) => ({ default: m.MissionsPermissionsPage })));
const AccountingPermissionsPage = lazy(() => import("../pages").then((m) => ({ default: m.AccountingPermissionsPage })));
const HumanCasePermissionPage = lazy(() => import("../pages").then((m) => ({ default: m.HumanCasePermissionPage })));
const DonorPermissionPage = lazy(() => import("../pages").then((m) => ({ default: m.DonorPermissionPage })));
const AssemblyPermissionPage = lazy(() => import("../pages").then((m) => ({ default: m.AssemblyPermissionPage })));
const WarrantorPermissionPage = lazy(() => import("../pages").then((m) => ({ default: m.WarrantorPermissionPage })));
const UsersPermissionsPage = lazy(() => import("../pages").then((m) => ({ default: m.UsersPermissionsPage })));
const SettingPermissionsPage = lazy(() => import("../pages").then((m) => ({ default: m.SettingPermissionsPage })));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const settingsRouteConfigs = [
  // ── System Settings ───────────────────────────────────────────
  { path: "/settingTabs", element: withSuspense(SettingTabsPage) },
  { path: "/setting/general", element: withSuspense(GenSettingPage) },
  { path: "/setting/enter", element: withSuspense(EnterSettingPage) },

  // ── Roles & Permissions ───────────────────────────────────────
  { path: "/roles", element: withSuspense(RolesPage) },
  { path: "/groupEdit/:id", element: withSuspense(EditRolePage) },
  { path: "/permissionsTabs/:id", element: withSuspense(PermissionsTabsPage) },
  { path: "/permissions/case/:id", element: withSuspense(CasePermissionsPage) },
  { path: "/permissions/project/:id", element: withSuspense(ProjectPermissionsPage) },
  { path: "/permissions/hr/:id", element: withSuspense(HrPermissionsPage) },
  { path: "/permissions/loans/:id", element: withSuspense(LoansPermissionsPage) },
  { path: "/permissions/endowments/:id", element: withSuspense(EndowmentsPermissionsPage) },
  { path: "/permissions/archive/:id", element: withSuspense(ArchivePermissionsPage) },
  { path: "/permissions/missions/:id", element: withSuspense(MissionsPermissionsPage) },
  { path: "/permissions/accounting/:id", element: withSuspense(AccountingPermissionsPage) },
  { path: "/permissions/humancase/:id", element: withSuspense(HumanCasePermissionPage) },
  { path: "/permissions/donor/:id", element: withSuspense(DonorPermissionPage) },
  { path: "/permissions/users/:id", element: withSuspense(UsersPermissionsPage) },
  { path: "/permissions/setting/:id", element: withSuspense(SettingPermissionsPage) },
  { path: "/permissions/assembly/:id", element: withSuspense(AssemblyPermissionPage) },
  { path: "/permissions/warrantors/:id", element: withSuspense(WarrantorPermissionPage) },
];

export const SettingsRoutes = (
  <React.Fragment>
    {settingsRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default SettingsRoutes;
