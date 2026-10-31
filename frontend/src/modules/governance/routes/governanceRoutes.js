import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const AssociationMembers = lazy(() => import("../pages/AssociationMembers"));
const ShowAssociationMembers = lazy(() => import("../pages/ShowAssociationMembers"));
const AssociationMembersReport = lazy(() => import("../pages/AssociationMembersReport"));
const AssociationMembersPayment = lazy(() => import("../pages/AssociationMembersPayment"));
const AssociationMembersRecieve = lazy(() => import("../pages/AssociationMembersRecieve"));
const AddMinutes = lazy(() => import("../pages/AddMinutes"));
const EditAddMinutes = lazy(() => import("../pages/EditAddMinutes"));
const AddMinutesReport = lazy(() => import("../pages/AddMinutesReport"));
const Committee = lazy(() => import("../pages/Committee"));
const AddCommittee = lazy(() => import("../pages/AddCommittee"));
const CommiteeMembers = lazy(() => import("../pages/CommiteeMembers"));
const Volunteers = lazy(() => import("../pages/Volunteers"));
const VolunterReport = lazy(() => import("../pages/VolunterReport"));
const VolunteerCertificate = lazy(() => import("../pages/VolunteerCertificate"));
const VolunteersVoucher = lazy(() => import("../pages/VolunteersVoucher"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const governanceRouteConfigs = [
  { path: "/associationMembers", element: withSuspense(AssociationMembers) },
  { path: "/associationMembersReport", element: withSuspense(AssociationMembersReport) },
  { path: "/addMinutes", element: withSuspense(AddMinutes) },
  { path: "/addMinutesReport", element: withSuspense(AddMinutesReport) },
  { path: "/showAssociationMembers/:id", element: withSuspense(ShowAssociationMembers) },
  { path: "/editAddMinutes/:id", element: withSuspense(EditAddMinutes) },
  { path: "/associationmemberspayment/:id", element: withSuspense(AssociationMembersPayment) },
  { path: "/associationMembersRecieve/:id", element: withSuspense(AssociationMembersRecieve) },
  { path: "/addcommittee", element: withSuspense(AddCommittee) },
  { path: "/committee", element: withSuspense(Committee) },
  { path: "/committeemembers/:id", element: withSuspense(CommiteeMembers) },
  { path: "/volunteers", element: withSuspense(Volunteers) },
  { path: "/editvolunteer/:id", element: withSuspense(Volunteers) },
  { path: "/volunteerWorkHours/:id", element: withSuspense(Volunteers) },
  { path: "/hrreport/volunteers", element: withSuspense(VolunterReport) },
  { path: "/volunteercertificate/:id", element: withSuspense(VolunteerCertificate) },
  { path: "/volunteersvoucher/:id", element: withSuspense(VolunteersVoucher) },
];

export const GovernanceRoutes = (
  <React.Fragment>
    {governanceRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default GovernanceRoutes;

