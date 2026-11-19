import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../common/pages/TestPreLoader/TestPreLoader";

// Association Members
const AssociationMembersReport = lazy(() => import("../pages/association-members/AssociationMembersReport"));
const AssociationMembers = lazy(() => import("../pages/association-members/AssociationMembers"));
const ShowAssociationMembers = lazy(() => import("../pages/association-members/ShowAssociationMembers"));
const AssociationMembersPayment = lazy(() => import("../pages/association-members/AssociationMembersPayment"));
const AssociationMembersRecieve = lazy(() => import("../pages/association-members/AssociationMembersRecieve"));

// Association Payment Reports
const AssociationMembersPaymentReport = lazy(() => import("../pages/association-members/AssociationPaymentReport"));
const AssociationPaymentDetails = lazy(() => import("../pages/association-members/AssociationPaymentDetails"));

// Committees
const Committee = lazy(() => import("../pages/association-members/Committee"));
const AddCommittee = lazy(() => import("../pages/association-members/AddCommittee"));
const CommitteeMembers = lazy(() => import("../pages/association-members/CommiteeMembers"));

// Minutes of meeting
const AddMinutesReport = lazy(() => import("../pages/association-members/AddMinutesReport"));
const AddMinutes = lazy(() => import("../pages/association-members/AddMinutes"));
const EditAddMinutes = lazy(() => import("../pages/association-members/EditAddMinutes"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const associationRoutes = [
  // أعضاء الجمعية العمومية
  { path: "/associationMembersReport", element: withSuspense(AssociationMembersReport) },
  { path: "/associationMembers", element: withSuspense(AssociationMembers) },
  { path: "/showAssociationMembers/:id", element: withSuspense(ShowAssociationMembers) },
  { path: "/associationmemberspayment/:id", element: withSuspense(AssociationMembersPayment) },
  { path: "/associationMembersRecieve/:id", element: withSuspense(AssociationMembersRecieve) },

  // تقرير دفعات الأعضاء
  { path: "/associationMemberspaymentReport", element: withSuspense(AssociationMembersPaymentReport) },
  { path: "/associationpaymentDetails/:id", element: withSuspense(AssociationPaymentDetails) },

  // اللجان
  { path: "/committee", element: withSuspense(Committee) },
  { path: "/addcommittee", element: withSuspense(AddCommittee) },
  { path: "/committeemembers/:id", element: withSuspense(CommitteeMembers) },

  // محاضر الاجتماعات
  { path: "/addMinutesReport", element: withSuspense(AddMinutesReport) },
  { path: "/addMinutes", element: withSuspense(AddMinutes) },
  { path: "/editAddMinutes/:id", element: withSuspense(EditAddMinutes) },
];

export const AssociationRoutes = (
  <React.Fragment>
    {associationRoutes.map((r) => (
      <Route key={r.path} path={r.path} element={r.element} />
    ))}
  </React.Fragment>
);

export default AssociationRoutes;
