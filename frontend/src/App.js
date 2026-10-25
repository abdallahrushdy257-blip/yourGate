import React, { useState } from "react";
import "./App.css";
import "./print.css";
import ProtectedRoute from "./context/ProtectedRoute";
import RightSidebar from "./components/RightSidebar";
import HomeNavbar from "./components/HomeNavbar";

//import PublicLayout from "./layouts/PublicLayout";
import { Route, Routes, useLocation } from "react-router-dom";
import CharityRegistration from "./pages/CharityRegistration/CharityRegistration";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import ReviewData from "./pages/ReviewData/ReviewData";
import CompletingData from "./pages/CompletingData/CompletingData";
import CreateAndManege from "./pages/createAndManage/createAndManage";
import CaseData from "./pages/CaseData/CaseData";
import PrintCaseData from "./pages/PrintCaseData/PrintCaseData";
import CaseDetails from "./pages/CaseDetails/CaseDetails";
import ViewDonations from "./pages/ViewDonations/ViewDonations";
import ReceiptVoucher from "./pages/ReceiptVoucher/ReceiptVoucher";
import ReceiptVoucherProject from "./pages/ReceiptVoucher/ReceiptVoucherProject";
import PaymentVoucher from "./pages/PaymentVoucher/PaymentVoucher";
import PaymentVoucherGeneral from "./pages/PaymentVoucher/PaymentVoucherGeneral";
import PaymentVoucherProject from "./pages/PaymentVoucher/PaymentVoucherProject";
import MarketingDesignProjectManagement from "./pages/MarketingDesignProjectManagement/MarketingDesignProjectManagement";
import SendDesignRequest from "./pages/SendDesignRequest/SendDesignRequest";
import SendDesignRequestshop from "./pages/SendDesignRequest/SendDesignRequestshop";
import SendMarketingRequest from "./pages/SendMarketingRequest/SendMarketingRequest";
import SendMarketingRequestshop from "./pages/SendMarketingRequest/SendMarketingRequestshop";
import ThemeContextProvider from "./context/theme-context";
import MarketingReports from "./pages/MarketingReports/MarketingReports";
import ProjectStatus from "./pages/ProjectStatus/ProjectStatus";
import EmployeeName from "./pages/EmployeeName/EmployeeName";
import VacationRequest from "./pages/VacationRequest/VacationRequest";
import Jobtitle from "./pages/JobTitle/JobTitle";
import ViewDonationsProject from "./pages/ViewDonationsProject/ViewDonationsProject";
import AddNewEmployee from "./pages/AddNewEmployee/AddNewEmployee";
import Payroll from "./pages/Payroll/Payroll";
// import MonthlySalary from "./pages/MonthlySalary/MonthlySalary";
import HRreports from "./pages/HRreports/HRreports";
import JobPerformanceEvaluation from "./pages/JobPerformanceEvaluation/JobPerformanceEvaluation";
import ShowJobPerformanceEvaluation from "./pages/ShowJobPerformanceEvaluation/ShowJobPerformanceEvaluation";
import ShowPerformance from "./pages/ShowPerformance/ShowPerformance";
import KPIEvaluation from "./pages/KPIEvaluation/KPIEvaluation";
import GeneralEmployeeReports from "./pages/GeneralEmployeeReports/GeneralEmployeeReports";
import Salarycertificate from "./pages/Salarycertificate/Salarycertificate";
import VacationDetails from "./pages/VacationDetails/VacationDetails";
import DepartmentsDetails from "./pages/DepartmentsDetails/DepartmentsDetails";
import CaseDetailsChart from "./pages/CaseDetailsChart/CaseDetailsChart";
import ProjectChart from "./pages/CaseDetailsChart/ProjectChart";
import ComplexDesignMarketingRequest from "./pages/ComplexDesignMarketingRequest/ComplexDesignMarketingRequest";
import DesignsDetails from "./pages/DesignDetails/DesignsDetails";
import MarketingDetails from "./pages/DesignDetails/MarketingDetails";
import DesignsDetailsshop from "./pages/DesignDetails/DesignsDetailsshop";
import MarketingDetailsshop from "./pages/DesignDetails/MarketingDetailsshop";
import DesignAttachments from "./pages/DesignAttachments/DesignAttachments";
import DesignAttachmentsshop from "./pages/DesignAttachments/DesignAttachmentsshop";
import TestPreLoader from "./pages/TestPreLoader/TestPreLoader";
import AttendanceDeparture from "./pages/AttendanceDeparture/AttendanceDeparture";
import AttendanceDepartureReport from "./pages/AttendanceDepartureReport/AttendanceDepartureReport";
import PaySalary from "./pages/PaySalary/PaySalary";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import SetnewPassword from "./pages/ForgotPassword/SetnewPassword";
import DataReview from "./pages/DataReview/DataReview";
import MainLanding from "./landings/MainLanding";
import Editcasedetails from "./pages/createAndManage/EditCaseDetails";
import CreateMangeLanding from "./landings/CreateMangeLanding";
import DesignMarketingLanding from "./landings/DesignMarketingLanding";
import HRLanding from "./landings/HRLanding";
import AddNewClient from "./pages/AddNewClient/AddNewClient";
import AddNewSupplier from "./pages/AddNewSupplier/AddNewSupplier";
import StatementOfAccount from "./pages/StatementOfAccount/StatementOfAccount";
import AccountsReport from "./pages/Accounting/AccountsReport/AccountsReport";
import CarouselComponent from "./pages/CarouselCom/CarouselCom";
import CommitmentCompliance from "./pages/CommitmentCompliance/CommitmentCompliance";
// import AddDonor from "./pages/AddDonor/AddDonor";
import EditDonor from "./pages/AddDonor/EditDonor";
import EmployPaper from "./pages/EmployPaper/EmployPaper";
import AddEmpPaper from "./pages/EmployPaper/AddEmpPaper";
import ShowEmployee from "./pages/ShowEmployee/ShowEmployee";
import Discounts from "./pages/Discounts/Discounts";
import Investigations from "./pages/Investigations/Investigations";
import ComeLeave from "./pages/ComeLeave/ComeLeave";
import CreateLoan from "./pages/CreateLoan/CreateLoan";
import PaymentData from "./pages/PaymentData/PaymentData";
import DelaysData from "./pages/DelaysData/DelaysData";
import RequestPermission from "./pages/RequestPermission/RequestPermission";
import TestPrint from "./pages/TestPrint/TestPrint";
import AddBeneficiary from "./pages/AddBeneficiary/AddBeneficiary";
import MainBeneficiaryData from "./pages/AddBeneficiary/MainBeneficiaryData";
import Additionalnformation from "./pages/AddBeneficiary/Additionalnformation";
import MembershipData from "./pages/AddBeneficiary/MembershipData";
import BankData from "./pages/AddBeneficiary/BankData";
import CallingData from "./pages/AddBeneficiary/CallingData";
import QualificationPosition from "./pages/AddBeneficiary/QualificationPosition";
import HousingData from "./pages/AddBeneficiary/HousingData";
import HealthData from "./pages/AddBeneficiary/HealthData";
import DependentsData from "./pages/AddBeneficiary/DependentsData";
import ShowDonors from "./pages/AddDonor/ShowDonors";
import CaseStudy from "./pages/AddBeneficiary/CaseStudy";
import Beneficiary from "./pages/Beneficiary/Beneficiary";
import BeneficiaryX from "./pages/Beneficiary/BeneficiaryX";
import EditJobTitle from "./pages/JobTitle/EditJobTitle";
import ReceiptVoucherView from "./pages/ReceiptVoucher/ReceiptVoucherView";
import Verify from "./pages/Verify/Verify";
import AddBeneficiaryAll from "./pages/AddBeneficiary/AddBeneficiaryAll";
import JobtitleReport from "./pages/HRreports/reports/JobtitleReport";
import EmployeeReport from "./pages/HRreports/reports/EmployeeReport";
import SalaryReport from "./pages/HRreports/reports/SalaryReport";
import LeaveReport from "./pages/HRreports/reports/LeaveReport";
import KpiReport from "./pages/HRreports/reports/KpiReport";
import LeaveNameReport from "./pages/HRreports/reports/LeaveNameReport";
import DeductionReport from "./pages/HRreports/reports/DeductionReport";
import AttendenceReport from "./pages/HRreports/reports/AttendenceReport";
import InvestigationReport from "./pages/HRreports/reports/InvestigationReport";
import LeaveType from "./pages/LeaveType/LeaveType";
import EmployeePaper from "./pages/HRreports/reports/EmployeePaper";
import EditEmploypaper from "./pages/EmployPaper/EditEmploypaper";
import LeavePermissionReport from "./pages/HRreports/reports/LeavePermissionReport";
import AddBenef from "./pages/AddBeneficiary/AddBenef";
import EditBeneficiary from "./pages/AddBeneficiary/EditBeneficiary";
import PaymentReport from "./pages/PaymentData/PaymentReport";
import PaymentDetails from "./pages/PaymentData/PaymentDetails";
import DonationsReport from "./pages/DonationsReport/DonationsReport";
import AssociationMembers from "./pages/AssociationMembers/AssociationMembers";
import AssociationMembersReport from "./pages/AssociationMembers/AssociationMembersReport";
import AddMinutes from "./pages/AddMinutes/AddMinutes";
import AddMinutesReport from "./pages/AddMinutes/AddMinutesReport";
import Endowments from "./pages/Endowments/Endowments";
import EndowmentsReport from "./pages/Endowments/EndowmentsReport";
import PaymentsDue from "./pages/Endowments/PaymentsDue";
import PaymentHistory from "./pages/Endowments/PaymentHistory";
import DonationDetails from "./pages/DonationsReport/DonationDetails";
import ShowAssociationMembers from "./pages/AssociationMembers/ShowAssociationMembers";
import EditAddMinutes from "./pages/AddMinutes/EditAddMinutes";
import EndowmentsVoucher from "./pages/PaymentVoucher/EndowmentsVoucher";
import LandingStore from "./pages/LandingStore/LandingStore";
import TestNewTable from "./pages/TestNewTable/TestNewTable";
import ArchiveReport from "./pages/Archives/ArchiveReport";
import LoansData from "./pages/PaymentData/LoansData";
import Feasibility from "./pages/Feasibility/Feasibility";
import AddWarrantor from "./pages/Warrantor/AddWarrantor";
import EditWarrantor from "./pages/Warrantor/EditWarrantor";
import Warrantors from "./pages/Warrantor/Warrantors";
import WarrantorsReport from "./pages/Warrantor/WarrantorsReport";
import FeasibilityStudy from "./pages/Feasibility/FeasibilityStudy";
import Missions from "./pages/Missions/Missions";
import AddMissions from "./pages/Missions/AddMissions";
import Chartofaccounts from "./pages/Accounting/Chartofaccounts/Chartofaccounts";
import AccountingEntry from "./pages/Accounting/AccountingEntry/AccountingEntry";
import Accountstatement from "./pages/Accounting/Accountstatement/Accountstatement";
import CustomersStatement from "./pages/Accounting/Accountstatement/CustomersStatement";
import SuppliersStatement from "./pages/Accounting/Accountstatement/SuppliersStatement";
import AccountsStatement from "./pages/Accounting/Accountstatement/AccountsStatement";
import AddClient from "./pages/Accounting/AddClient/AddClient";
import Additem from "./pages/Accounting/Additem/Additem";
import AddSupplier from "./pages/Accounting/AddSupplier/AddSupplier";
import CustomerReport from "./pages/Accounting/CustomerReport/CustomerReport";
import Items from "./pages/Accounting/Items/Items";
import PurchasesReport from "./pages/Accounting/PurchasesReport/PurchasesReport";
import Purecommand from "./pages/Accounting/Purecommand/Purecommand";
import SalesReport from "./pages/Accounting/SalesReport/SalesReport";
import Settlementreport from "./pages/Accounting/Settlementreport/Settlementreport";
import Storeinventory from "./pages/Accounting/Storeinventory/Storeinventory";
import SupplieRreports from "./pages/Accounting/Supplierreports/SupplieRreports";
import TransferInvoiceBetweenStores from "./pages/Accounting/TransferInvoiceBetweenStores/TransferInvoiceBetweenStores";
import UnitsReport from "./pages/Accounting/UnitsReport/Unitsreport";
import Warehousereport from "./pages/Accounting/WarehouseReport/Warehousereport";
import NewPurchaseInvoice from "./pages/Accounting/SalesInvoice/NewPurchaseInvoice";
import NewPurchaseRefundInvoice from "./pages/Accounting/SalesInvoice/NewPurchaseRefundInvoice";
import NewSalesInvoice from "./pages/Accounting/SalesInvoice/NewSalesInvoice";
import NewSalesRefundInvoice from "./pages/Accounting/SalesInvoice/NewSalesRefundInvoice";
import ItemReport from "./pages/Accounting/ItemReport/ItemReport";
import ItemDetails from "./pages/Accounting/Items/ItemDetails";
import ItemsinStock from "./pages/Accounting/Items/ItemsinStock";
import AccountingEntryView from "./pages/Accounting/AccountingEntry/AccountingEntryView";
import PrintPurchase from "./pages/Accounting/SalesInvoice/PrintPurchase";
import GeneralReceiptVoucher from "./pages/Accounting/GeneralPayment/GeneralReceiptVoucher";
import GeneralPaymentVoucher from "./pages/Accounting/GeneralPayment/GeneralPaymentVoucher";
import GeneralPaymentVoucherCash from "./pages/Accounting/GeneralPayment/GeneralPaymentVoucherCash";
import GeneralReceiptVoucherCash from "./pages/Accounting/GeneralPayment/GeneralReceiptVoucherCash";
import DonerReceiptVoucher from "./pages/AddDonor/DonerReceiptVoucher";

import PriceList from "./pages/Accounting/PriceList/PricelList/PriceList";
import UpdatePrices from "./pages/Accounting/PriceList/UpdatePrices/UpdatePrices";
import Depreciationreport from "./pages/Accounting/Settlementreport/Depreciation";
import WarrantorsPayments from "./pages/Warrantor/WarrantorsPayments";
import AssociationMembersPayment from "./pages/AssociationMembers/AssociationMembersPayment";
import AssociationMemberStatement from "./pages/Accounting/Accountstatement/AssociationMemberStatement";
import DonorStatement from "./pages/Accounting/Accountstatement/DonorStatement";
import HumanCaseStatement from "./pages/Accounting/Accountstatement/HumanCaseStatement";
import ManagementMemberStatement from "./pages/Accounting/Accountstatement/ManagementMemberStatement";
import WarrantorsStatement from "./pages/Accounting/Accountstatement/WarrantorsStatement";
import BalanceSheet from "./pages/Accounting/Reports/BalanceSheet";
import IncomeStatement from "./pages/Accounting/Reports/IncomeStatement";
import AssociationPaymentReport from "./pages/PaymentData/AssociationPaymentReport";
import AssociationPaymentDetails from "./pages/PaymentData/AssociationPaymentDetails";
import EditProjectStatus from "./pages/MarketingDesignProjectManagement/EditProjectStatus";
import Fstudy from "./pages/Feasibility/Fstudy";
import ReceiptVoucherLoan from "./pages/ReceiptVoucher/ReceiptVoucherLoan";
import PaymentVoucherLoan from "./pages/PaymentVoucher/PaymentVoucherLoan";
import Moneyreceiptreports from "./pages/MoneyReports/Moneyreceiptreports";
import Moneytransferreports from "./pages/MoneyReports/Moneytransferreports";
import ReceiptVoucherEndowments from "./pages/ReceiptVoucher/ReceiptVoucherEndowments";
import ShowpaymentHistory from "./pages/Endowments/ShowpaymentHistory";
import ShowEmployeeCard from "./pages/Card/ShowEmployeeCard";
import ShowhealthData from "./pages/AddBeneficiary/ShowhelthData";
import OrganizationalChart from "./pages/OrganizationalChart/OrganizationalChart";
import EditEmployee from "./pages/AddNewEmployee/EditEmployee";
import EditInvestigations from "./pages/Investigations/EditInvestigations";
import EditLeave from "./pages/LeaveType/EditLeave";
import EditEndowments from "./pages/Endowments/EditEndowments";
import EditMissions from "./pages/Missions/EditMissions";
import EmpVac from "./pages/HRreports/reports/EmpVac";
import ShowEmpVac from "./pages/HRreports/reports/ShowEmpVac";
import LoanView from "./pages/LoanView/LoanView";
import EdithealthData from "./pages/AddBeneficiary/EdithealthData";
import ShowDependData from "./pages/AddBeneficiary/ShowDependData";
import EditDependData from "./pages/AddBeneficiary/EditDependData";
import ReceiptVoucherViewProject from "./pages/ReceiptVoucher/ReceiptVoucherViewProject";
import Roles from "./pages/Roles/Roles";
import PermissionsTabs from "./pages/Roles/PermissionsTabs";
import CasePermissions from "./pages/Roles/CasePermissions";
import ProjectPermissions from "./pages/Roles/ProjectPermissions";
import HrPermissions from "./pages/Roles/HrPermissions";
import LoansPermissions from "./pages/Roles/LoansPermissions";
import EndowmentsPermissions from "./pages/Roles/EndowmentsPermissions";
import ArchivePermissions from "./pages/Roles/ArchivePermissions";
import MissionsPermissions from "./pages/Roles/MissionsPermissions";
import AccountingPermissions from "./pages/Roles/AccountingPermissions";
import HumanCasePermission from "./pages/Roles/HumanCasePermission";
import DonorPermission from "./pages/Roles/DonorPermission";
import AssemblyPermission from "./pages/Roles/AssemblyPermission";
import WarrantorPermission from "./pages/Roles/WarrantorPermission";
import SettingTabs from "./pages/Setting/SettingTabs";
import GenSetting from "./pages/Setting/GenSetting";
import PrintSetting from "./pages/Setting/PrintSetting";
import EnterSetting from "./pages/Setting/EnterSetting";
import EndowmentSammary from "./pages/Endowments/EndowmentSammary";
import ShowMissions from "./pages/Missions/ShowMissions";
import LoanDetails from "./pages/PaymentData/LoanDetials";
import EditRole from "./pages/Roles/EditRole";
import Users from "./pages/Users/Users";
import BenefitAddDetails from "./pages/AddBeneficiary/BenefitAddDetails";
import CreateBeneficiaryLink from "./pages/AddBeneficiary/CreateBeneficiaryLink";
import Terms from "./pages/TermsandCondition/Terms";
import Privacy from "./pages/TermsandCondition/Privacy";
import ViewEndowments from "./pages/Endowments/ViewEndowments";
import PayrollVoucher from "./pages/Payroll/PayrollVoucher";
import NotificationItem from "./pages/notification/Notification";
import WebsiteLanding from "./landings/WebsiteLanding";
import UsersPermissions from "./pages/Roles/UsersPermissions";
import SettingPermissions from "./pages/Roles/SettingPermissions";
// import NotFound from "./components/NotFound";
import Interest from "./pages/interests/Interest";
import Addhcvendor from "./pages/hcvendor/Addhcvendor";
import Edithcvendor from "./pages/hcvendor/Edithcvendor";
import MainApp from "./components/MainApp";
import HcVendorReport from "./pages/hcvendor/HcVendorReport";
//TODO Make 404 page
//admin dashboard
import AdminLogin from "./admin/Login/AdminLogin";
import AdminHome from "./admin/Home/AdminHome";
import Organizations from "./admin/organization/Organizations";
import PendingOrganizations from "./admin/organization/PendingOrganizations";
import RejectedOrganizations from "./admin/organization/RejectedOrganizations";
import Representatives from "./admin/organization/Representatives";
import Modules from "./admin/organization/Modules";
import OrganizationShow from "./admin/organization/OrganizationShow";
import OrganizationModules from "./admin/organization/OrganizationModules";
import OrgaminzationRequest from "./admin/organization/OrganizationRequest";
import Shopdesign from "./admin/shopandproject/Shopdesign";
import Shopmarketing from "./admin/shopandproject/Shopmarketing";
import Projectdesign from "./admin/shopandproject/Projectdesign";
import Projectmarketing from "./admin/shopandproject/Projectmarketing";
import Ads from "./admin/shopandproject/Ads";
import LoansLanding from "./landings/LoansLanding";
import DataManagementLanding from "./landings/DataManagementLanding";
import ArchivesLanding from "./landings/ArchivesLanding";
import EndowmentsLanding from "./landings/EndowmentsLanding";
import TasksLanding from "./landings/TasksLanding";
import AccountingLanding from "./landings/AccountingLanding";
import Hcvendor from "./pages/hcvendor/Hcvendor";
import AssociationMembersRecieve from "./pages/AssociationMembers/AssociationMembersRecieve";
import AddCommittee from "./pages/committee/AddCommittee";
import Committee from "./pages/committee/Committee";
import CommiteeMembers from "./pages/committee/CommiteeMembers";
import Volunteers from "./pages/Volunteers/Volunteers";
import VolunterReport from "./pages/HRreports/reports/VolunterReport";
import ProjectMember from "./pages/MarketingDesignProjectManagement/ProjectMember";
import ProjectAttachment from "./pages/MarketingDesignProjectManagement/ProjectAttachment";
import KPI from "./pages/MarketingDesignProjectManagement/KPI";
import ProjectKPI from "./pages/MarketingDesignProjectManagement/ProjectKPI";
import ProjectKpiView from "./pages/MarketingDesignProjectManagement/ProjectKpiView";
import ProjectPhases from "./pages/MarketingDesignProjectManagement/ProjectPhases";
import ProjectRisk from "./pages/MarketingDesignProjectManagement/ProjectRisk";
import RiskMitigation from "./pages/MarketingDesignProjectManagement/RiskMitigation";
import RiskAssessmentReport from "./pages/MarketingDesignProjectManagement/RiskAssessmentReport";
import VolunteerCertificate from "./pages/HRreports/reports/VolunteerCertificate";
import VolunteersVoucher from "./pages/HRreports/reports/VolunteersVoucher";
import UserProfile from "./pages/Users/UserProfile";
import SurveyList from "./components/Surveys/SurveyList";
import SurveyForm from "./components/Surveys/SurveyForm";
import TrainingForm from "./pages/Training/TrainingForm";
import TrainingList from "./pages/Training/TrainingList";
import KsaForm from "./pages/Ksa/KsaForm";
import KsaList from "./pages/Ksa/KsaList";
import LatePoliciesPage from "./pages/latePolitics/LatePoliciesPage";
import SectionsReport from "./pages/sections/SectionsReport";
import CreateEmployeeAdvance from "./pages/employeeAdvance/CreateEmployeeAdvance";
import EmployeeWithdrawals from "./pages/employeeWithdrawals/EmployeeWithdrawals";
// import EmployeeCardPhoto from "./pages/EmployeeCard/EmployeeCardPhoto";
// import ShowEmployeeCard from "./pages/EmployeeCard/ShowEmployeeCard";



function App() {
  const location = useLocation();
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const showNavbar =
    location.pathname !== "/login" &&
    location.pathname !== "/ibgates/adminlogin" &&
    location.pathname !== "/verify" &&
    location.pathname !== "/charityregistration" &&
    location.pathname !== "/complete" &&
    location.pathname !== "/landingStore" &&
    location.pathname !== "/archivesLanding" &&
    location.pathname !== "/dataManagementLanding" &&
    location.pathname !== "/endowmentsLanding" &&
    location.pathname !== "/tasksLanding" &&
    location.pathname !== "/accountingLanding" &&
    location.pathname !== "/" &&
    location.pathname !== "/createMangelanding" &&
    location.pathname !== "/designmarketinglanding" &&
    location.pathname !== "/hrlanding" &&
    location.pathname !== "/datareview" &&
    location.pathname !== "/websideLanding" &&
    !location.pathname.startsWith("/casedata/") &&
    location.pathname !== "/loanslanding" &&
    location.pathname !== "/terms" &&
    location.pathname !== "/privacy" &&
    location.pathname !== "/admindashboard" &&
    location.pathname !== "/organizations" &&
    location.pathname !== "/pendingorganizations" &&
    location.pathname !== "/rejectedorganizations" &&
    location.pathname !== "/representatives" &&
    location.pathname !== "/modules" &&
    location.pathname !== "/adminshopdesign" &&
    location.pathname !== "/adminshopmarketing" &&
    location.pathname !== "/adminprojectdesign" &&
    location.pathname !== "/adminprojectmarketing" &&
    location.pathname !== "/ads" &&
    !location.pathname.startsWith("/organizationshow/") &&
    !location.pathname.startsWith("/organizationmodules/") &&
    !location.pathname.startsWith("/organizationrequests/") &&
    !location.pathname.startsWith("/benefitadddetails/");
  const showSidebar =
    location.pathname !== "/login" &&
    location.pathname !== "/ibgates/adminlogin" &&
    location.pathname !== "/verify" &&
    location.pathname !== "/charityregistration" &&
    location.pathname !== "/complete" &&
    location.pathname !== "/landingStore" &&
    location.pathname !== "/loanslanding" &&
    location.pathname !== "/websideLanding" &&
    location.pathname !== "/" &&
    location.pathname !== "/createMangelanding" &&
    location.pathname !== "/archivesLanding" &&
    location.pathname !== "/designmarketinglanding" &&
    location.pathname !== "/hrlanding" &&
    location.pathname !== "/datareview" &&
    location.pathname !== "/dataManagementLanding" &&
    !location.pathname.startsWith("/casedata/") &&
    location.pathname !== "/terms" &&
    location.pathname !== "/privacy" &&
    location.pathname !== "/admindashboard" &&
    location.pathname !== "/organizations" &&
    location.pathname !== "/pendingorganizations" &&
    location.pathname !== "/rejectedorganizations" &&
    location.pathname !== "/representatives" &&
    location.pathname !== "/modules" &&
    location.pathname !== "/adminshopdesign" &&
    location.pathname !== "/adminshopmarketing" &&
    location.pathname !== "/adminprojectdesign" &&
    location.pathname !== "/endowmentsLanding" &&
    location.pathname !== "/tasksLanding" &&
    location.pathname !== "/accountingLanding" &&
    location.pathname !== "/adminprojectmarketing" &&
    location.pathname !== "/ads" &&
    !location.pathname.startsWith("/organizationshow/") &&
    !location.pathname.startsWith("/organizationmodules/") &&
    !location.pathname.startsWith("/organizationrequests/") &&
    !location.pathname.startsWith("/benefitadddetails/");

  const toggleSidebar = () => {
    setSidebarVisible((prevState) => !prevState);
  };

  return (
    <ThemeContextProvider>
      <div
        className={`App ${
          isSidebarVisible ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        {showNavbar && (
          <HomeNavbar
            toggleSidebar={toggleSidebar}
            isSidebarVisible={isSidebarVisible}
          />
        )}
        {showSidebar && (
          <RightSidebar
            isVisible={isSidebarVisible}
            toggleSidebar={toggleSidebar}
          />
        )}

        <div className="page-container">
          <Routes>
            <Route path="/ibgates/adminlogin" element={<AdminLogin />} />
            <Route
              path="/charityregistration"
              element={<CharityRegistration />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/:id/verify" element={<Verify />} />
            <Route path="/" element={<MainLanding />} />
            <Route
              path="/createMangelanding"
              element={<CreateMangeLanding />}
            />
            <Route
              path="/designmarketinglanding"
              element={<DesignMarketingLanding />}
            />
            <Route path="/hrlanding" element={<HRLanding />} />
            <Route path="/landingStore" element={<LandingStore />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route
              path="/benefitadddetails/:id"
              element={<BenefitAddDetails />}
            />
            <Route path="/loanslanding" element={<LoansLanding />} />
            <Route
              path="/dataManagementLanding"
              element={<DataManagementLanding />}
            />
            <Route path="/archivesLanding" element={<ArchivesLanding />} />
            <Route path="/websideLanding" element={<WebsiteLanding />} />
            <Route path="/endowmentsLanding" element={<EndowmentsLanding />} />
            <Route path="/tasksLanding" element={<TasksLanding />} />
            <Route path="/accountingLanding" element={<AccountingLanding />} />
            <Route element={<MainApp />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/review" element={<ReviewData />} />
                <Route path="/complete" element={<CompletingData />} />
                {/* <Route path="/createandmanege" element={<CreateAndManege />} /> */}
                <Route path="/casedata/:id" element={<CaseData />} />
                <Route path="/printcasedata" element={<PrintCaseData />} />
                <Route path="/casedetails" element={<CaseDetails />} />
                <Route path="/viewdonations/:id" element={<ViewDonations />} />
                <Route
                  path="/receiptvoucher/:id"
                  element={<ReceiptVoucher />}
                />
                <Route
                  path="/projectvoucher/:id"
                  element={<ReceiptVoucherProject />}
                />
                <Route
                  path="/paymentvoucher/:id"
                  element={<PaymentVoucher />}
                />
                <Route
                  path="/paymentvoucherGeneral/:id"
                  element={<PaymentVoucherGeneral />}
                />
                <Route
                  path="/paymentvoucherproject/:id"
                  element={<PaymentVoucherProject />}
                />
                <Route
                  path="/viewdonationsproject/:id"
                  element={<ViewDonationsProject />}
                />
                {/* <Route
                  path="/marketingdesignprojectmanagement"
                  element={<MarketingDesignProjectManagement />}
                /> */}
                <Route
                  path="/senddesignrequest/:id"
                  element={<SendDesignRequest />}
                />
                <Route
                  path="/senddesignrequestshop/:id"
                  element={<SendDesignRequestshop />}
                />
                <Route
                  path="/sendmarketingrequest/:id"
                  element={<SendMarketingRequest />}
                />
                <Route
                  path="/sendmarketingrequestshop/:id"
                  element={<SendMarketingRequestshop />}
                />
                <Route
                  path="/marketingreports"
                  element={<MarketingReports />}
                />
                <Route path="/projectStatus" element={<ProjectStatus />} />
                <Route path="/employeename" element={<EmployeeName />} />
                <Route path="/vacationrequest" element={<VacationRequest />} />
                <Route
                  path="/requestpermission"
                  element={<RequestPermission />}
                />
                <Route path="/jobtitle" element={<Jobtitle />} />
                <Route path="/addnewemployee" element={<AddNewEmployee />} />
                <Route path="/payroll" element={<Payroll />} />
                {/* <Route path="/monthlysalary" element={<MonthlySalary />} /> */}
                <Route path="/hrreports" element={<HRreports />} />
                <Route path="/editemployee/:id" element={<EditEmployee />} />
                <Route
                  path="/jobperformanceevaluation"
                  element={<JobPerformanceEvaluation />}
                />
                <Route
                  path="/showJobPerformanceEvaluation"
                  element={<ShowJobPerformanceEvaluation />}
                />
                <Route path="/showperformance" element={<ShowPerformance />} />
                <Route path="/kpievaluation/:id" element={<KPIEvaluation />} />
                <Route
                  path="/generalemployeereports/:id"
                  element={<GeneralEmployeeReports />}
                />
                <Route
                  path="/salarycertificate"
                  element={<Salarycertificate />}
                />
                <Route path="/vacationdetails" element={<VacationDetails />} />
                <Route
                  path="/departmentsdetails"
                  element={<DepartmentsDetails />}
                />
                <Route
                  path="/casedetailschart/:id"
                  element={<CaseDetailsChart />}
                />
                <Route path="/projectchart/:id" element={<ProjectChart />} />
                <Route
                  path="/complexdesignmarketingrequest/:id"
                  element={<ComplexDesignMarketingRequest />}
                />
                <Route path="/designsdetails" element={<DesignsDetails />} />
                <Route
                  path="/marketingdetails"
                  element={<MarketingDetails />}
                />
                <Route
                  path="/marketingdetailsshop"
                  element={<DesignsDetailsshop />}
                />
                <Route
                  path="/designsdetailsshop"
                  element={<MarketingDetailsshop />}
                />
                <Route
                  path="/designattachments/:id"
                  element={<DesignAttachments />}
                />
                <Route
                  path="/designattachmentsshop/:id"
                  element={<DesignAttachmentsshop />}
                />
                <Route path="/testpreLoader" element={<TestPreLoader />} />
                <Route
                  path="/attendancedeparture"
                  element={<AttendanceDeparture />}
                />
                <Route
                  path="/attendancedeparturereport"
                  element={<AttendanceDepartureReport />}
                />
                <Route path="/paysalary" element={<PaySalary />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/setnewpassword" element={<SetnewPassword />} />
                <Route path="/datareview" element={<DataReview />} />

                <Route
                  path="/editcasedetails/:id"
                  element={<Editcasedetails />}
                />

                <Route path="/addnewclient" element={<AddNewClient />} />
                <Route path="/addnewsupplier" element={<AddNewSupplier />} />
                <Route
                  path="/statementofaccount"
                  element={<StatementOfAccount />}
                />
                <Route path="/newaccountsReport" element={<AccountsReport />} />
                {/* <Route path="/inventoryreport" element={<InventoryReport />} /> */}
                <Route
                  path="/CarouselComponent"
                  element={<CarouselComponent />}
                />
                <Route
                  path="/CommitmentCompliance"
                  element={<CommitmentCompliance />}
                />
                {/* <Route path="/addDonor" element={<AddDonor />} /> */}
                <Route path="/donors" element={<ShowDonors />} />
                {/* <Route path="/employpaper" element={<EmployPaper />} /> */}
                <Route path="/addempaper/:id" element={<AddEmpPaper />} />
                <Route path="/showEmployee/:id" element={<ShowEmployee />} />
                <Route path="/discounts/:id" element={<Discounts />} />
                <Route
                  path="/investigations/:id"
                  element={<Investigations />}
                />
                <Route path="/comeleave" element={<ComeLeave />} />
                {/* <Route path="/createloan" element={<CreateLoan />} /> */}
                <Route path="/paymentdata/:id" element={<PaymentData />} />
                <Route path="/delaysdata" element={<DelaysData />} />
                <Route path="/testprint" element={<TestPrint />} />
                <Route path="/addbeneficiary" element={<AddBeneficiary />} />
                <Route
                  path="/mainbeneficiarydata"
                  element={<MainBeneficiaryData />}
                />
                <Route
                  path="/additionainformation"
                  element={<Additionalnformation />}
                />
                <Route path="/membershipdata" element={<MembershipData />} />
                <Route path="/bankdata/:id" element={<BankData />} />
                <Route path="/callingdata" element={<CallingData />} />
                <Route
                  path="/qualificationposition/:id"
                  element={<QualificationPosition />}
                />
                <Route path="/housingdata/:id" element={<HousingData />} />
                {/* <Route path="/healthdata/:id" element={<HealthData />} /> */}
                {/* <Route
                  path="/dependentsdata/:id"
                  element={<DependentsData />}
                /> */}
                <Route path="/casestudy/:id" element={<CaseStudy />} />
                {/* الصفحة الجديدة لاضافة المستفيد */}

                <Route
                  path="/createbeneficiarylink"
                  element={<CreateBeneficiaryLink />}
                />

                <Route path="/beneficiary" element={<Beneficiary />} />
                <Route path="/beneficiaryx" element={<BeneficiaryX />} />
                <Route path="/editjobtitle/:id" element={<EditJobTitle />} />
                <Route
                  path="/receiptVoucherView/:id"
                  element={<ReceiptVoucherView />}
                />
                <Route
                  path="/addbeneficiaryall"
                  element={<AddBeneficiaryAll />}
                />
                {/* <Route
                  path="/hrreport/jobtitles"
                  element={<JobtitleReport />}
                /> */}
                {/* <Route
                  path="/hrreport/employees"
                  element={<EmployeeReport />}
                /> */}
                <Route path="/hrreport/salary" element={<SalaryReport />} />
                <Route path="/hrreport/vacations" element={<LeaveReport />} />
                {/* <Route path="/hrreport/kpi" element={<KpiReport />} /> */}
                <Route
                  path="/hrreport/vacdetails"
                  element={<LeaveNameReport />}
                />
                <Route
                  path="/hrreport/discounts"
                  element={<DeductionReport />}
                />
                {/* <Route
                  path="/hrreport/attendancedeparturereport"
                  element={<AttendenceReport />}
                /> */}
                <Route
                  path="/hrreport/investigations"
                  element={<InvestigationReport />}
                />
                <Route path="/leavestype" element={<LeaveType />} />
                <Route path="/employeepaper/:id" element={<EmployeePaper />} />
                {/* code below by mohamed hany قبل اضافة ال backend */}
                <Route
                  path="/editemploypaper/:id"
                  element={<EditEmploypaper />}
                />
                {/* code below up mohamed hany قبل اضافة ال backend */}
                <Route
                  path="/hrreport/leavepermissionreport"
                  element={<LeavePermissionReport />}
                />
                {/* <Route path="/addBenef" element={<AddBenef />} /> */}
                <Route path="paymentReport" element={<PaymentReport />} />
                <Route
                  path="/paymentDetails/:id"
                  element={<PaymentDetails />}
                />
                <Route path="/donationsReport" element={<DonationsReport />} />
                {/* <Route
                  path="/associationMembers"
                  element={<AssociationMembers />}
                /> */}
                <Route
                  path="/associationMembersReport"
                  element={<AssociationMembersReport />}
                />
                {/* <Route path="/addMinutes" element={<AddMinutes />} /> */}
                <Route
                  path="/addMinutesReport"
                  element={<AddMinutesReport />}
                />
                {/* <Route path="/endowments" element={<Endowments />} /> */}
                <Route
                  path="/endowmentsReport"
                  element={<EndowmentsReport />}
                />
                <Route path="/paymentsDue" element={<PaymentsDue />} />
                <Route path="/paymentHistory" element={<PaymentHistory />} />
                <Route
                  path="/donationDetails/:id"
                  element={<DonationDetails />}
                />
                <Route
                  path="/showAssociationMembers/:id"
                  element={<ShowAssociationMembers />}
                />
                <Route
                  path="/editAddMinutes/:id"
                  element={<EditAddMinutes />}
                />
                <Route
                  path="/endowmentsVoucher/:id"
                  element={<EndowmentsVoucher />}
                />

                <Route path="/testNewTable" element={<TestNewTable />} />
                <Route path="/archiveReport" element={<ArchiveReport />} />
                <Route path="/loansData" element={<LoansData />} />
                <Route path="/feasibility" element={<Feasibility />} />
                {/* <Route path="/addwarrantor" element={<AddWarrantor />} /> */}
                <Route path="/warrantors" element={<Warrantors />} />
                <Route
                  path="/warrantorsreport"
                  element={<WarrantorsReport />}
                />
                <Route
                  path="/feasibilitystudy/:id"
                  element={<FeasibilityStudy />}
                />
                <Route path="/missions" element={<Missions />} />
                {/* <Route path="/addmission" element={<AddMissions />} /> */}
                <Route path="/chartofaccounts" element={<Chartofaccounts />} />
                <Route path="/accountingEntry" element={<AccountingEntry />} />
                <Route path="/employeeWithdrawals" element={<EmployeeWithdrawals />} />
                <Route
                  path="/accountstatement"
                  element={<Accountstatement />}
                />
                <Route
                  path="/accountstatement/customers"
                  element={<CustomersStatement />}
                />
                <Route
                  path="/accountstatement/suppliers"
                  element={<SuppliersStatement />}
                />
                <Route
                  path="/accountstatement/accounts"
                  element={<AccountsStatement />}
                />
                <Route
                  path="/employeeAdvance"
                  element={<CreateEmployeeAdvance />}
                />
                <Route path="/addClient" element={<AddClient />} />
                <Route path="/newadditem" element={<Additem />} />
                <Route path="/addSupplier" element={<AddSupplier />} />
                <Route path="/chartofaccounts" element={<Chartofaccounts />} />
                <Route path="/customerReport" element={<CustomerReport />} />
                <Route path="/items" element={<Items />} />
                <Route path="/purchasesReport" element={<PurchasesReport />} />
                <Route path="/purecommand" element={<Purecommand />} />
                <Route path="/salesReport" element={<SalesReport />} />
                <Route
                  path="/settlementreport"
                  element={<Settlementreport />}
                />
                <Route path="/storeinventory" element={<Storeinventory />} />
                <Route path="/supplierRreports" element={<SupplieRreports />} />
                <Route
                  path="/transferInvoiceBetweenStores"
                  element={<TransferInvoiceBetweenStores />}
                />
                <Route path="/unitsReport" element={<UnitsReport />} />
                <Route path="/warehousereport" element={<Warehousereport />} />
                <Route
                  path="/purchaseInvoice"
                  element={<NewPurchaseInvoice />}
                />
                <Route
                  path="/purchaseRefundInvoice"
                  element={<NewPurchaseRefundInvoice />}
                />
                <Route path="/salesInvoice" element={<NewSalesInvoice />} />
                <Route
                  path="/salesRefundInvoice"
                  element={<NewSalesRefundInvoice />}
                />
                <Route path="/itemreport" element={<ItemReport />} />
                <Route path="/itemdetails/:id" element={<ItemDetails />} />
                <Route path="/iteminstock/:id" element={<ItemsinStock />} />
                <Route
                  path="/entryview/:id"
                  element={<AccountingEntryView />}
                />
                <Route path="/printpurchase/:id" element={<PrintPurchase />} />
                <Route
                  path="/generalreceiptvoucher"
                  element={<GeneralReceiptVoucher />}
                />
                <Route
                  path="/generalreceiptvouchercash"
                  element={<GeneralReceiptVoucherCash />}
                />
                <Route
                  path="/generalpaymentvoucher"
                  element={<GeneralPaymentVoucher />}
                />
                <Route
                  path="/generalpaymentvouchercash"
                  element={<GeneralPaymentVoucherCash />}
                />
                <Route path="/pricelist" element={<PriceList />} />
                <Route path="/updateprices/:id" element={<UpdatePrices />} />
                <Route
                  path="/depreciationreport"
                  element={<Depreciationreport />}
                />
                <Route
                  path="/warrantorspayment/:id"
                  element={<WarrantorsPayments />}
                />
                <Route
                  path="/associationmemberspayment/:id"
                  element={<AssociationMembersPayment />}
                />
                <Route
                  path="/accountstatement/humancase"
                  element={<HumanCaseStatement />}
                />
                <Route
                  path="/accountstatement/donor"
                  element={<DonorStatement />}
                />
                <Route
                  path="/accountstatement/managementmembers"
                  element={<ManagementMemberStatement />}
                />
                <Route
                  path="/accountstatement/warrantors"
                  element={<WarrantorsStatement />}
                />
                <Route
                  path="/accountstatement/humancase"
                  element={<HumanCaseStatement />}
                />
                <Route
                  path="/accountstatement/donors"
                  element={<DonorStatement />}
                />
                <Route
                  path="/accountstatement/warrantors"
                  element={<WarrantorsStatement />}
                />
                <Route
                  path="/accountstatement/assemblymembers"
                  element={<AssociationMemberStatement />}
                />
                <Route path="/balancesheet" element={<BalanceSheet />} />
                <Route path="/incomestatement" element={<IncomeStatement />} />
                <Route
                  path="/donerreceiptvoucher/:id"
                  element={<DonerReceiptVoucher />}
                />
                <Route path="/editdonor/:id" element={<EditDonor />} />
                <Route
                  path="/editbeneficiary/:id"
                  element={<EditBeneficiary />}
                />
                <Route path="/editwarrantor/:id" element={<EditWarrantor />} />
                <Route
                  path="/associationMemberspaymentReport"
                  element={<AssociationPaymentReport />}
                />
                <Route
                  path="/associationpaymentDetails/:id"
                  element={<AssociationPaymentDetails />}
                />
                <Route
                  path="/editprojectstatus/:id"
                  element={<EditProjectStatus />}
                />
                <Route path="/fstudy/:id" element={<Fstudy />} />
                <Route
                  path="/receiptvoucherloan/:id"
                  element={<ReceiptVoucherLoan />}
                />
                <Route
                  path="/paymentvoucherloan/:id"
                  element={<PaymentVoucherLoan />}
                />
                <Route
                  path="/moneyreceiptreports/:id"
                  element={<Moneyreceiptreports />}
                />
                <Route
                  path="/moneytransferreports/:id"
                  element={<Moneytransferreports />}
                />
                <Route
                  path="/endowmentsreceiptvoucher/:id"
                  element={<ReceiptVoucherEndowments />}
                />
                <Route
                  path="showpaymentHistory/:id"
                  element={<ShowpaymentHistory />}
                />
                <Route
                  path="showEmployeeCard/:id"
                  element={<ShowEmployeeCard />}
                />
                <Route
                  path="organizationalChart"
                  element={<OrganizationalChart />}
                />
                <Route
                  path="LatePoliciesPage"
                  element={<LatePoliciesPage />}
                />
                <Route
                  path="SectionsReport"
                  element={<SectionsReport />}
                />
                <Route
                  path="/showhealthData/:id"
                  element={<ShowhealthData />}
                />
                <Route
                  path="/edithealthData/:id"
                  element={<EdithealthData />}
                />

                <Route
                  path="/editInvestigations/:id"
                  element={<EditInvestigations />}
                />
                <Route path="/editLeave/:id" element={<EditLeave />} />
                <Route
                  path="/editEndowments/:id"
                  element={<EditEndowments />}
                />
                <Route
                  path="/endowmentsSammary/:id"
                  element={<EndowmentSammary />}
                />
                <Route
                  path="/showDependentsData/:id"
                  element={<ShowDependData />}
                />
                <Route
                  path="/editDependentsData/:id"
                  element={<EditDependData />}
                />
                <Route
                  path="/receiptVoucherViewproject/:id"
                  element={<ReceiptVoucherViewProject />}
                />

                <Route path="/editMissions/:id" element={<EditMissions />} />
                {/* <Route path="/hrreport/emploteeVac" element={<EmpVac />} /> */}
                <Route path="/showEmpVac" element={<ShowEmpVac />} />

                <Route path="/loanView/:id" element={<LoanView />} />

                <Route path="/roles" element={<Roles />} />
                <Route
                  path="/permissionsTabs/:id"
                  element={<PermissionsTabs />}
                />
                <Route
                  path="/permissions/case/:id"
                  element={<CasePermissions />}
                />
                <Route
                  path="/permissions/project/:id"
                  element={<ProjectPermissions />}
                />
                <Route path="/permissions/hr/:id" element={<HrPermissions />} />
                <Route
                  path="/permissions/loans/:id"
                  element={<LoansPermissions />}
                />
                <Route
                  path="/permissions/endowments/:id"
                  element={<EndowmentsPermissions />}
                />
                <Route
                  path="/permissions/archive/:id"
                  element={<ArchivePermissions />}
                />
                <Route
                  path="/permissions/missions/:id"
                  element={<MissionsPermissions />}
                />
                <Route
                  path="/permissions/accounting/:id"
                  element={<AccountingPermissions />}
                />
                <Route
                  path="/permissions/humancase/:id"
                  element={<HumanCasePermission />}
                />
                <Route
                  path="/permissions/donor/:id"
                  element={<DonorPermission />}
                />
                <Route
                  path="/permissions/users/:id"
                  element={<UsersPermissions />}
                />
                <Route
                  path="/permissions/setting/:id"
                  element={<SettingPermissions />}
                />
                <Route
                  path="/permissions/assembly/:id"
                  element={<AssemblyPermission />}
                />
                <Route
                  path="/permissions/warrantors/:id"
                  element={<WarrantorPermission />}
                />
                <Route path="/loandetails/:id" element={<LoanDetails />} />
                <Route path="/settingTabs" element={<SettingTabs />} />
                <Route path="/setting/general" element={<GenSetting />} />
                {/* <Route path="/setting/print" element={<PrintSetting />} /> */}
                <Route path="/setting/enter" element={<EnterSetting />} />
                <Route path="/groupEdit/:id" element={<EditRole />} />
                <Route path="/showMissions/:id" element={<ShowMissions />} />
                <Route path="/users" element={<Users />} />
                <Route path="viewendowments/:id" element={<ViewEndowments />} />
                <Route path="payroll/:id" element={<PayrollVoucher />} />
                <Route
                  path="notifications/:id"
                  element={<NotificationItem />}
                />
                <Route
                  path="/associationMembersRecieve/:id"
                  element={<AssociationMembersRecieve />}
                />
                {/* <Route path="/addcommittee" element={<AddCommittee />} /> */}
                <Route path="/committee" element={<Committee />} />
                <Route
                  path="/committeemembers/:id"
                  element={<CommiteeMembers />}
                />
                <Route path="/volunteers" element={<Volunteers />} />
                {/* <Route
                  path="/hrreport/volunteers"
                  element={<VolunterReport />}
                /> */}
                <Route path="/projectmembers/:id" element={<ProjectMember />} />
                <Route
                  path="/projectattachments/:id"
                  element={<ProjectAttachment />}
                />
                <Route path="/kpi" element={<KPI />} />
                <Route path="/projectkpis/:id" element={<ProjectKPI />} />
                <Route
                  path="/projectkpiview/:id"
                  element={<ProjectKpiView />}
                />
                <Route path="/projectdetails/:id" element={<ProjectPhases />} />
                <Route path="/projectrisks/:id" element={<ProjectRisk />} />
                <Route
                  path="/riskmitigation/:id"
                  element={<RiskMitigation />}
                />
                <Route
                  path="/riskassessmentreport/:id"
                  element={<RiskAssessmentReport />}
                />
                <Route
                  path="/volunteercertificate/:id"
                  element={<VolunteerCertificate />}
                />
                <Route
                  path="/volunteersvoucher/:id"
                  element={<VolunteersVoucher />}
                />
                <Route path="/profile" element={<UserProfile />} />
                {/* </Route> */}

                <Route path="/admindashboard" element={<AdminHome />} />
                <Route path="/organizations" element={<Organizations />} />
                <Route
                  path="/pendingorganizations"
                  element={<PendingOrganizations />}
                />
                <Route
                  path="/rejectedorganizations"
                  element={<RejectedOrganizations />}
                />
                <Route path="/representatives" element={<Representatives />} />
                <Route path="/modules" element={<Modules />} />
                <Route
                  path="/organizationshow/:id"
                  element={<OrganizationShow />}
                />
                <Route
                  path="/organizationmodules/:id"
                  element={<OrganizationModules />}
                />
                <Route
                  path="/organizationrequests/:id"
                  element={<OrgaminzationRequest />}
                />
                <Route path="/adminshopdesign" element={<Shopdesign />} />
                <Route path="/adminshopmarketing" element={<Shopmarketing />} />
                <Route path="/adminprojectdesign" element={<Projectdesign />} />
                <Route
                  path="/adminprojectmarketing"
                  element={<Projectmarketing />}
                />
                <Route path="/ads" element={<Ads />} />
                <Route path="/interests" element={<Interest />} />
                {/* <Route path="/addhcvendor" element={<Addhcvendor />} /> */}
                <Route path="/edithcvendor/:id" element={<Edithcvendor />} />
                <Route path="/hcvendor" element={<Hcvendor />} />
                <Route path="/hcvendorReport" element={<HcVendorReport />} />
                <Route path="/employeesurvey" element={<SurveyList />} />
                <Route path="/employeesurvey/:id" element={<SurveyForm />} />
                <Route path="/employeetraining" element={<TrainingList />} />
                <Route
                  path="/employeetraining/:id"
                  element={<TrainingForm />}
                />
                <Route path="/employeeksa" element={<KsaList />} />
                <Route path="/ksa/:id" element={<KsaForm />} />
              </Route>
              {/* <Route path="*" element={<NotFound />} /> */}
            </Route>
          </Routes>
        </div>
      </div>
    </ThemeContextProvider>
  );
}

export default App;
