import React, { lazy } from "react";
import { Route } from "react-router-dom";

// Beneficiaries main pages
const Beneficiary = lazy(() => import("../pages/beneficiaries/Beneficiary"));
const BeneficiaryX = lazy(() => import("../pages/beneficiaries/BeneficiaryX"));
const ViewBeneficiary = lazy(() => import("../pages/beneficiaries/BeneficiaryView"));
const AddBeneficiary = lazy(() => import("../pages/beneficiaries/AddBeneficiary"));
const AddBeneficiaryAll = lazy(() => import("../pages/beneficiaries/AddBeneficiaryAll"));
const EditBeneficiary = lazy(() => import("../pages/beneficiaries/EditBeneficiary"));
const PaymentReport = lazy(() => import("../pages/beneficiaries/PaymentReport"));
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

export const beneficiariesRoutes = [
  // المستفيدون والمستبعدون
  { path: "/beneficiary", element: <Beneficiary /> },
  { path: "/beneficiaryx", element: <BeneficiaryX /> },
  { path: "/beneficiary/view/:id", element: <ViewBeneficiary /> },
  { path: "/addbeneficiary", element: <AddBeneficiary /> },
  { path: "/addbeneficiaryall", element: <AddBeneficiaryAll /> },
  { path: "/editbeneficiary/:id", element: <EditBeneficiary /> },

  // تقرير مدفوعات المستفيدون
  { path: "/paymentReport", element: <PaymentReport /> },
  { path: "/paymentreport", element: <PaymentReport /> },

  // إضافة رابط خارجي
  { path: "/createbeneficiarylink", element: <CreateBeneficiaryLink /> },

  // استبيان رضا المستفيدين
  { path: "/employeesurvey", element: <SurveyList /> },
  { path: "/surveyform", element: <SurveyForm /> },
  { path: "/employeesurvey/:id", element: <SurveyForm /> },

  // بيانات التبويبات والتفاصيل
  { path: "/mainbeneficiarydata", element: <MainBeneficiaryData /> },
  { path: "/additionainformation", element: <AdditionaInformation /> },
  { path: "/membershipdata", element: <MembershipData /> },
  { path: "/bankdata", element: <BankData /> },
  { path: "/bankdata/:id", element: <BankData /> },
  { path: "/callingdata", element: <CallingData /> },
  { path: "/qualificationposition", element: <QualificationPosition /> },
  { path: "/qualificationposition/:id", element: <QualificationPosition /> },
  { path: "/housingdata/:id", element: <HousingData /> },
  { path: "/healthdata/:id", element: <HealthData /> },
  { path: "/dependentsdata/:id", element: <DependentsData /> },
  { path: "/showhealthdata/:id", element: <ShowHealthData /> },
  { path: "/edithealthdata/:id", element: <EditHealthData /> },
  { path: "/showdependdata/:id", element: <ShowDependData /> },
  { path: "/editdependdata/:id", element: <EditDependData /> },
];

export const BeneficiariesRoutes = () => (
  <>
    {beneficiariesRoutes.map((r, i) => (
      <Route key={i} path={r.path} element={r.element} />
    ))}
  </>
);

export default BeneficiariesRoutes;
