import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

// Beneficiaries main pages
const Beneficiary = lazy(() => import("../pages/beneficiaries/Beneficiary"));
const BeneficiaryX = lazy(() => import("../pages/beneficiaries/BeneficiaryX"));
const ViewBeneficiary = lazy(() => import("../pages/beneficiaries/BeneficiaryView"));
const AddBeneficiary = lazy(() => import("../pages/beneficiaries/AddBeneficiary"));
const AddBeneficiaryAll = lazy(() => import("../pages/beneficiaries/AddBeneficiaryAll"));
const EditBeneficiary = lazy(() => import("../pages/beneficiaries/EditBeneficiary"));
const PaymentReport = lazy(() => import("../pages/beneficiaries/PaymentReport"));
const PaymentDetails = lazy(() => import("../pages/beneficiaries/PaymentDetails"));
const PaymentData = lazy(() => import("../pages/beneficiaries/PaymentData"));
const CreateBeneficiaryLink = lazy(() => import("../pages/beneficiaries/CreateBeneficiaryLink"));

// Surveys
const SurveyList = lazy(() => import("../pages/beneficiaries/SurveyList"));
const SurveyForm = lazy(() => import("../pages/beneficiaries/SurveyForm"));

// Beneficiary tab sub-pages
const MainBeneficiaryData = lazy(() => import("../pages/beneficiaries/MainBeneficiaryData"));
const AdditionaInformation = lazy(() => import("../pages/beneficiaries/Additionalnformation"));
const MembershipData = lazy(() => import("../pages/beneficiaries/MembershipData"));
const BankData = lazy(() => import("../pages/beneficiaries/BankData"));
const CallingData = lazy(() => import("../pages/beneficiaries/CallingData"));
const QualificationPosition = lazy(() => import("../pages/beneficiaries/QualificationPosition"));
const HousingData = lazy(() => import("../pages/beneficiaries/HousingData"));
const HealthData = lazy(() => import("../pages/beneficiaries/HealthData"));
const DependentsData = lazy(() => import("../pages/beneficiaries/DependentsData"));
const ShowHealthData = lazy(() => import("../pages/beneficiaries/ShowhelthData"));
const EditHealthData = lazy(() => import("../pages/beneficiaries/EdithealthData"));
const ShowDependData = lazy(() => import("../pages/beneficiaries/ShowDependData"));
const EditDependData = lazy(() => import("../pages/beneficiaries/EditDependData"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const beneficiariesRoutes = [
  // المستفيدون والمستبعدون
  { path: "/beneficiary", element: withSuspense(Beneficiary) },
  { path: "/beneficiaryx", element: withSuspense(BeneficiaryX) },
  { path: "/beneficiary/view/:id", element: withSuspense(ViewBeneficiary) },
  { path: "/addbeneficiary", element: withSuspense(AddBeneficiary) },
  { path: "/addbeneficiaryall", element: withSuspense(AddBeneficiaryAll) },
  { path: "/editbeneficiary/:id", element: withSuspense(EditBeneficiary) },

  // تقرير مدفوعات المستفيدون
  { path: "/paymentReport", element: withSuspense(PaymentReport) },
  { path: "/paymentreport", element: withSuspense(PaymentReport) },
  { path: "/paymentDetails/:id", element: withSuspense(PaymentDetails) },
  { path: "/paymentdetails/:id", element: withSuspense(PaymentDetails) },
  { path: "/paymentdata/:id", element: withSuspense(PaymentData) },

  // إضافة رابط خارجي
  { path: "/createbeneficiarylink", element: withSuspense(CreateBeneficiaryLink) },

  // استبيان رضا المستفيدين
  { path: "/employeesurvey", element: withSuspense(SurveyList) },
  { path: "/surveyform", element: withSuspense(SurveyForm) },
  { path: "/employeesurvey/:id", element: withSuspense(SurveyForm) },

  // بيانات التبويبات والتفاصيل
  { path: "/mainbeneficiarydata", element: withSuspense(MainBeneficiaryData) },
  { path: "/additionainformation", element: withSuspense(AdditionaInformation) },
  { path: "/membershipdata", element: withSuspense(MembershipData) },
  { path: "/bankdata", element: withSuspense(BankData) },
  { path: "/bankdata/:id", element: withSuspense(BankData) },
  { path: "/callingdata", element: withSuspense(CallingData) },
  { path: "/qualificationposition", element: withSuspense(QualificationPosition) },
  { path: "/qualificationposition/:id", element: withSuspense(QualificationPosition) },
  { path: "/housingdata/:id", element: withSuspense(HousingData) },
  { path: "/healthdata/:id", element: withSuspense(HealthData) },
  { path: "/dependentsdata/:id", element: withSuspense(DependentsData) },
  { path: "/showhealthdata/:id", element: withSuspense(ShowHealthData) },
  { path: "/edithealthdata/:id", element: withSuspense(EditHealthData) },
  { path: "/showdependdata/:id", element: withSuspense(ShowDependData) },
  { path: "/showDependentsData/:id", element: withSuspense(ShowDependData) },
  { path: "/editdependdata/:id", element: withSuspense(EditDependData) },
  { path: "/editDependentsData/:id", element: withSuspense(EditDependData) },
];

export const BeneficiariesRoutes = (
  <React.Fragment>
    {beneficiariesRoutes.map((r) => (
      <Route key={r.path} path={r.path} element={r.element} />
    ))}
  </React.Fragment>
);

export default BeneficiariesRoutes;
