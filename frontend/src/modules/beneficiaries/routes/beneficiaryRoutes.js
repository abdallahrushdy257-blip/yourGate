import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const CaseDataPage = lazy(() => import("../../../pages/CaseData/CaseData"));
const PrintCaseDataPage = lazy(() => import("../../../pages/PrintCaseData/PrintCaseData"));
const CaseDetailsPage = lazy(() => import("../../../pages/CaseDetails/CaseDetails"));
const CaseDetailsViewPage = lazy(() => import("../../../pages/CaseDetails/CaseDetailsView"));
const CaseDetailsChartPage = lazy(() => import("../../../pages/CaseDetailsChart/CaseDetailsChart"));
const EditCaseDetailsPage = lazy(() => import("../../../pages/createAndManage/EditCaseDetails"));
const CaseStudyPage = lazy(() => import("../../../pages/AddBeneficiary/CaseStudy"));

const BeneficiaryPage = lazy(() => import("../../../pages/Beneficiary/Beneficiary"));
const BeneficiaryXPage = lazy(() => import("../../../pages/Beneficiary/BeneficiaryX"));
const BeneficiaryViewPage = lazy(() => import("../../../pages/Beneficiary/BeneficiaryView"));
const AddBeneficiaryPage = lazy(() => import("../../../pages/AddBeneficiary/AddBeneficiary"));
const AddBeneficiaryAllPage = lazy(() => import("../../../pages/AddBeneficiary/AddBeneficiaryAll"));
const EditBeneficiaryPage = lazy(() => import("../../../pages/AddBeneficiary/EditBeneficiary"));
const CreateBeneficiaryLinkPage = lazy(() => import("../../../pages/AddBeneficiary/CreateBeneficiaryLink"));
const BenefitAddDetailsPage = lazy(() => import("../../../pages/AddBeneficiary/BenefitAddDetails"));
const MainBeneficiaryDataPage = lazy(() => import("../../../pages/AddBeneficiary/MainBeneficiaryData"));
const ShowHealthDataPage = lazy(() => import("../../../pages/AddBeneficiary/ShowhelthData"));
const EditHealthDataPage = lazy(() => import("../../../pages/AddBeneficiary/EdithealthData"));
const ShowDependDataPage = lazy(() => import("../../../pages/AddBeneficiary/ShowDependData"));
const EditDependDataPage = lazy(() => import("../../../pages/AddBeneficiary/EditDependData"));

const ShowDonorsPage = lazy(() => import("../../../pages/AddDonor/ShowDonors"));
const EditDonorPage = lazy(() => import("../../../pages/AddDonor/EditDonor"));
const DonerReceiptVoucherPage = lazy(() => import("../../../pages/AddDonor/DonerReceiptVoucher"));

const HcVendorPage = lazy(() => import("../../../pages/hcvendor/Hcvendor"));
const AddHcVendorPage = lazy(() => import("../../../pages/hcvendor/Addhcvendor"));
const EditHcVendorPage = lazy(() => import("../../../pages/hcvendor/Edithcvendor"));
const HcVendorReportPage = lazy(() => import("../../../pages/hcvendor/HcVendorReport"));

const Additionalnformation = lazy(() => import("../../../pages/AddBeneficiary/Additionalnformation"));
const MembershipData = lazy(() => import("../../../pages/AddBeneficiary/MembershipData"));
const BankData = lazy(() => import("../../../pages/AddBeneficiary/BankData"));
const CallingData = lazy(() => import("../../../pages/AddBeneficiary/CallingData"));
const QualificationPosition = lazy(() => import("../../../pages/AddBeneficiary/QualificationPosition"));
const HousingData = lazy(() => import("../../../pages/AddBeneficiary/HousingData"));
const HealthData = lazy(() => import("../../../pages/AddBeneficiary/HealthData"));
const DependentsData = lazy(() => import("../../../pages/AddBeneficiary/DependentsData"));

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
  { path: "/additionalnformation", element: withSuspense(Additionalnformation) },
  { path: "/membershipdata", element: withSuspense(MembershipData) },
  { path: "/bankdata/:id", element: withSuspense(BankData) },
  { path: "/callingdata", element: withSuspense(CallingData) },
  { path: "/qualificationposition/:id", element: withSuspense(QualificationPosition) },
  { path: "/housingdata/:id", element: withSuspense(HousingData) },
  { path: "/healthdata/:id", element: withSuspense(HealthData) },
  { path: "/dependentsdata/:id", element: withSuspense(DependentsData) },
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
