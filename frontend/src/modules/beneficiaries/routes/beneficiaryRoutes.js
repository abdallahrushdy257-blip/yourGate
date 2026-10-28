import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const CaseDataPage = lazy(() => import("../pages").then((m) => ({ default: m.CaseDataPage })));
const PrintCaseDataPage = lazy(() => import("../pages").then((m) => ({ default: m.PrintCaseDataPage })));
const CaseDetailsPage = lazy(() => import("../pages").then((m) => ({ default: m.CaseDetailsPage })));
const CaseDetailsViewPage = lazy(() => import("../pages").then((m) => ({ default: m.CaseDetailsViewPage })));
const CaseDetailsChartPage = lazy(() => import("../pages").then((m) => ({ default: m.CaseDetailsChartPage })));
const EditCaseDetailsPage = lazy(() => import("../pages").then((m) => ({ default: m.EditCaseDetailsPage })));
const CaseStudyPage = lazy(() => import("../pages").then((m) => ({ default: m.CaseStudyPage })));

const BeneficiaryPage = lazy(() => import("../pages").then((m) => ({ default: m.BeneficiaryPage })));
const BeneficiaryXPage = lazy(() => import("../pages").then((m) => ({ default: m.BeneficiaryXPage })));
const BeneficiaryViewPage = lazy(() => import("../pages").then((m) => ({ default: m.BeneficiaryViewPage })));
const AddBeneficiaryPage = lazy(() => import("../pages").then((m) => ({ default: m.AddBeneficiaryPage })));
const AddBeneficiaryAllPage = lazy(() => import("../pages").then((m) => ({ default: m.AddBeneficiaryAllPage })));
const EditBeneficiaryPage = lazy(() => import("../pages").then((m) => ({ default: m.EditBeneficiaryPage })));
const CreateBeneficiaryLinkPage = lazy(() => import("../pages").then((m) => ({ default: m.CreateBeneficiaryLinkPage })));
const BenefitAddDetailsPage = lazy(() => import("../pages").then((m) => ({ default: m.BenefitAddDetailsPage })));
const MainBeneficiaryDataPage = lazy(() => import("../pages").then((m) => ({ default: m.MainBeneficiaryDataPage })));
const ShowHealthDataPage = lazy(() => import("../pages").then((m) => ({ default: m.ShowHealthDataPage })));
const EditHealthDataPage = lazy(() => import("../pages").then((m) => ({ default: m.EditHealthDataPage })));
const ShowDependDataPage = lazy(() => import("../pages").then((m) => ({ default: m.ShowDependDataPage })));
const EditDependDataPage = lazy(() => import("../pages").then((m) => ({ default: m.EditDependDataPage })));

const ShowDonorsPage = lazy(() => import("../pages").then((m) => ({ default: m.ShowDonorsPage })));
const EditDonorPage = lazy(() => import("../pages").then((m) => ({ default: m.EditDonorPage })));
const DonerReceiptVoucherPage = lazy(() => import("../pages").then((m) => ({ default: m.DonerReceiptVoucherPage })));

const HcVendorPage = lazy(() => import("../pages").then((m) => ({ default: m.HcVendorPage })));
const AddHcVendorPage = lazy(() => import("../pages").then((m) => ({ default: m.AddHcVendorPage })));
const EditHcVendorPage = lazy(() => import("../pages").then((m) => ({ default: m.EditHcVendorPage })));
const HcVendorReportPage = lazy(() => import("../pages").then((m) => ({ default: m.HcVendorReportPage })));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const beneficiaryRouteConfigs = [
  // ── Cases ─────────────────────────────────────────────────────
  { path: "/casedata/:id", element: withSuspense(CaseDataPage) },
  { path: "/printcasedata", element: withSuspense(PrintCaseDataPage) },
  { path: "/casedetails", element: withSuspense(CaseDetailsPage) },
  { path: "/casedetailsview/:id", element: withSuspense(CaseDetailsViewPage) },
  { path: "/casedetailschart/:id", element: withSuspense(CaseDetailsChartPage) },
  { path: "/editcasedetails/:id", element: withSuspense(EditCaseDetailsPage) },
  { path: "/casestudy/:id", element: withSuspense(CaseStudyPage) },

  // ── Beneficiaries ─────────────────────────────────────────────
  { path: "/beneficiary", element: withSuspense(BeneficiaryPage) },
  { path: "/beneficiaryx", element: withSuspense(BeneficiaryXPage) },
  { path: "/beneficiary/view/:id", element: withSuspense(BeneficiaryViewPage) },
  { path: "/addbeneficiary", element: withSuspense(AddBeneficiaryPage) },
  { path: "/addbeneficiaryall", element: withSuspense(AddBeneficiaryAllPage) },
  { path: "/editbeneficiary/:id", element: withSuspense(EditBeneficiaryPage) },
  { path: "/createbeneficiarylink", element: withSuspense(CreateBeneficiaryLinkPage) },
  { path: "/beneficiaryAddDetails/:id", element: withSuspense(BenefitAddDetailsPage) },
  { path: "/mainbeneficiarydata", element: withSuspense(MainBeneficiaryDataPage) },
  { path: "/showhealthdata/:id", element: withSuspense(ShowHealthDataPage) },
  { path: "/edithealthdata/:id", element: withSuspense(EditHealthDataPage) },
  { path: "/showdependdata/:id", element: withSuspense(ShowDependDataPage) },
  { path: "/editdependdata/:id", element: withSuspense(EditDependDataPage) },

  // ── Donors ────────────────────────────────────────────────────
  { path: "/donors", element: withSuspense(ShowDonorsPage) },
  { path: "/editdonor/:id", element: withSuspense(EditDonorPage) },
  { path: "/donerreceiptvoucher/:id", element: withSuspense(DonerReceiptVoucherPage) },

  // ── Vendors ───────────────────────────────────────────────────
  { path: "/hcvendor", element: withSuspense(HcVendorPage) },
  { path: "/addhcvendor", element: withSuspense(AddHcVendorPage) },
  { path: "/edithcvendor/:id", element: withSuspense(EditHcVendorPage) },
  { path: "/hcvendorReport", element: withSuspense(HcVendorReportPage) },
];

export const BeneficiaryRoutes = (
  <React.Fragment>
    {beneficiaryRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default BeneficiaryRoutes;
