import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const SettingTabsPage = lazy(() => import("../../../pages/Setting/SettingTabs"));
const GenSettingPage = lazy(() => import("../../../pages/Setting/GenSetting"));
const EnterSettingPage = lazy(() => import("../../../pages/Setting/EnterSetting"));

const RolesPage = lazy(() => import("../../../pages/Roles/Roles"));
const EditRolePage = lazy(() => import("../../../pages/Roles/EditRole"));
const PermissionsTabsPage = lazy(() => import("../../../pages/Roles/PermissionsTabs"));
const CasePermissionsPage = lazy(() => import("../../../pages/Roles/CasePermissions"));
const ProjectPermissionsPage = lazy(() => import("../../../pages/Roles/ProjectPermissions"));
const HrPermissionsPage = lazy(() => import("../../../pages/Roles/HrPermissions"));
const LoansPermissionsPage = lazy(() => import("../../../pages/Roles/LoansPermissions"));
const EndowmentsPermissionsPage = lazy(() => import("../../../pages/Roles/EndowmentsPermissions"));
const ArchivePermissionsPage = lazy(() => import("../../../pages/Roles/ArchivePermissions"));
const MissionsPermissionsPage = lazy(() => import("../../../pages/Roles/MissionsPermissions"));
const AccountingPermissionsPage = lazy(() => import("../../../pages/Roles/AccountingPermissions"));
const HumanCasePermissionPage = lazy(() => import("../../../pages/Roles/HumanCasePermission"));
const DonorPermissionPage = lazy(() => import("../../../pages/Roles/DonorPermission"));
const AssemblyPermissionPage = lazy(() => import("../../../pages/Roles/AssemblyPermission"));
const WarrantorPermissionPage = lazy(() => import("../../../pages/Roles/WarrantorPermission"));
const UsersPermissionsPage = lazy(() => import("../../../pages/Roles/UsersPermissions"));
const SettingPermissionsPage = lazy(() => import("../../../pages/Roles/SettingPermissions"));

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
  { path: "/groupShow/:id", element: withSuspense(RolesPage) },
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
