import React, { lazy } from "react";
import { Route } from "react-router-dom";

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

export const associationRoutes = [
  // أعضاء الجمعية العمومية
  { path: "/associationMembersReport", element: <AssociationMembersReport /> },
  { path: "/associationMembers", element: <AssociationMembers /> },
  { path: "/showAssociationMembers/:id", element: <ShowAssociationMembers /> },
  { path: "/associationmemberspayment/:id", element: <AssociationMembersPayment /> },
  { path: "/associationMembersRecieve/:id", element: <AssociationMembersRecieve /> },

  // تقرير دفعات الأعضاء
  { path: "/associationMemberspaymentReport", element: <AssociationMembersPaymentReport /> },
  { path: "/associationpaymentDetails/:id", element: <AssociationPaymentDetails /> },

  // اللجان
  { path: "/committee", element: <Committee /> },
  { path: "/addcommittee", element: <AddCommittee /> },
  { path: "/committeemembers/:id", element: <CommitteeMembers /> },

  // محاضر الاجتماعات
  { path: "/addMinutesReport", element: <AddMinutesReport /> },
  { path: "/addMinutes", element: <AddMinutes /> },
  { path: "/editAddMinutes/:id", element: <EditAddMinutes /> },
];

export const AssociationRoutes = () => (
  <>
    {associationRoutes.map((r, i) => (
      <Route key={i} path={r.path} element={r.element} />
    ))}
  </>
);

export default AssociationRoutes;
