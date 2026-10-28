import { useState } from "react";
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

import ViewDonations from "./pages/ViewDonations/ViewDonations";
import MarketingDesignProjectManagement from "./pages/MarketingDesignProjectManagement/MarketingDesignProjectManagement";
import SendDesignRequest from "./pages/SendDesignRequest/SendDesignRequest";
import SendDesignRequestshop from "./pages/SendDesignRequest/SendDesignRequestshop";
import SendMarketingRequest from "./pages/SendMarketingRequest/SendMarketingRequest";
import SendMarketingRequestshop from "./pages/SendMarketingRequest/SendMarketingRequestshop";
import ThemeContextProvider from "./context/theme-context";
import MarketingReports from "./pages/MarketingReports/MarketingReports";
import ProjectStatus from "./pages/ProjectStatus/ProjectStatus";
import Jobtitle from "./pages/JobTitle/JobTitle";
import ViewDonationsProject from "./pages/ViewDonationsProject/ViewDonationsProject";
// import MonthlySalary from "./pages/MonthlySalary/MonthlySalary";
import DepartmentsDetails from "./pages/DepartmentsDetails/DepartmentsDetails";

import ProjectChart from "./pages/CaseDetailsChart/ProjectChart";
import ComplexDesignMarketingRequest from "./pages/ComplexDesignMarketingRequest/ComplexDesignMarketingRequest";
import DesignsDetails from "./pages/DesignDetails/DesignsDetails";
import MarketingDetails from "./pages/DesignDetails/MarketingDetails";
import DesignsDetailsshop from "./pages/DesignDetails/DesignsDetailsshop";
import MarketingDetailsshop from "./pages/DesignDetails/MarketingDetailsshop";
import DesignAttachments from "./pages/DesignAttachments/DesignAttachments";
import DesignAttachmentsshop from "./pages/DesignAttachments/DesignAttachmentsshop";
import TestPreLoader from "./pages/TestPreLoader/TestPreLoader";

import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import SetnewPassword from "./pages/ForgotPassword/SetnewPassword";
import DataReview from "./pages/DataReview/DataReview";
import MainLanding from "./landings/MainLanding";

import CreateMangeLanding from "./landings/CreateMangeLanding";
import DesignMarketingLanding from "./landings/DesignMarketingLanding";
import HRLanding from "./landings/HRLanding";
import AddNewClient from "./pages/AddNewClient/AddNewClient";
import AddNewSupplier from "./pages/AddNewSupplier/AddNewSupplier";
import StatementOfAccount from "./pages/StatementOfAccount/StatementOfAccount";

import CarouselComponent from "./pages/CarouselCom/CarouselCom";
import CommitmentCompliance from "./pages/CommitmentCompliance/CommitmentCompliance";
// import AddDonor from "./pages/AddDonor/AddDonor";

import EmployPaper from "./pages/EmployPaper/EmployPaper";
import AddEmpPaper from "./pages/EmployPaper/AddEmpPaper";

import Discounts from "./pages/Discounts/Discounts";
import Investigations from "./pages/Investigations/Investigations";
import ComeLeave from "./pages/ComeLeave/ComeLeave";
import CreateLoan from "./pages/CreateLoan/CreateLoan";
import PaymentData from "./pages/PaymentData/PaymentData";
import DelaysData from "./pages/DelaysData/DelaysData";
import RequestPermission from "./pages/RequestPermission/RequestPermission";
import TestPrint from "./pages/TestPrint/TestPrint";

import Additionalnformation from "./pages/AddBeneficiary/Additionalnformation";
import MembershipData from "./pages/AddBeneficiary/MembershipData";
import BankData from "./pages/AddBeneficiary/BankData";
import CallingData from "./pages/AddBeneficiary/CallingData";
import QualificationPosition from "./pages/AddBeneficiary/QualificationPosition";
import HousingData from "./pages/AddBeneficiary/HousingData";
import HealthData from "./pages/AddBeneficiary/HealthData";
import DependentsData from "./pages/AddBeneficiary/DependentsData";
import EditJobTitle from "./pages/JobTitle/EditJobTitle";
import ReceiptVoucherView from "./pages/ReceiptVoucher/ReceiptVoucherView";
import Verify from "./pages/Verify/Verify";

import JobtitleReport from "./pages/HRreports/reports/JobtitleReport";

import KpiReport from "./pages/HRreports/reports/KpiReport";
import LeaveNameReport from "./pages/HRreports/reports/LeaveNameReport";
import DeductionReport from "./pages/HRreports/reports/DeductionReport";
import AttendenceReport from "./pages/HRreports/reports/AttendenceReport";
import InvestigationReport from "./pages/HRreports/reports/InvestigationReport";
import LeaveType from "./pages/LeaveType/LeaveType";

import EditEmploypaper from "./pages/EmployPaper/EditEmploypaper";
import LeavePermissionReport from "./pages/HRreports/reports/LeavePermissionReport";
import AddBenef from "./pages/AddBeneficiary/AddBenef";

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



import WarrantorsPayments from "./pages/Warrantor/WarrantorsPayments";
import AssociationMembersPayment from "./pages/AssociationMembers/AssociationMembersPayment";

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


import OrganizationalChart from "./pages/OrganizationalChart/OrganizationalChart";

import EditInvestigations from "./pages/Investigations/EditInvestigations";
import EditLeave from "./pages/LeaveType/EditLeave";
import EditEndowments from "./pages/Endowments/EditEndowments";
import EditMissions from "./pages/Missions/EditMissions";
import EmpVac from "./pages/HRreports/reports/EmpVac";
import ShowEmpVac from "./pages/HRreports/reports/ShowEmpVac";
import LoanView from "./pages/LoanView/LoanView";

import ReceiptVoucherViewProject from "./pages/ReceiptVoucher/ReceiptVoucherViewProject";

import EndowmentSammary from "./pages/Endowments/EndowmentSammary";
import ShowMissions from "./pages/Missions/ShowMissions";
import LoanDetails from "./pages/PaymentData/LoanDetials";

import Users from "./pages/Users/Users";

import Terms from "./pages/TermsandCondition/Terms";
import Privacy from "./pages/TermsandCondition/Privacy";
import ViewEndowments from "./pages/Endowments/ViewEndowments";

import NotificationItem from "./pages/notification/Notification";
import WebsiteLanding from "./landings/WebsiteLanding";

// import NotFound from "./components/NotFound";
import Interest from "./pages/interests/Interest";
import MainApp from "./components/MainApp";
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

import AssociationMembersRecieve from "./pages/AssociationMembers/AssociationMembersRecieve";
import AddCommittee from "./pages/committee/AddCommittee";
import Committee from "./pages/committee/Committee";
import CommiteeMembers from "./pages/committee/CommiteeMembers";
import Volunteers from "./pages/Volunteers/Volunteers";
import VolunterReport from "./pages/HRreports/reports/VolunterReport";
import { ProjectRoutes } from "./modules/projects";
import { FinanceRoutes } from "./modules/finance";
import { HrRoutes } from "./modules/hr";
import { BeneficiaryRoutes, CaseDataPage, BenefitAddDetailsPage } from "./modules/beneficiaries";
import { AccountingRoutes } from "./modules/accounting";
import { SettingsRoutes } from "./modules/settings";
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
              element={<BenefitAddDetailsPage />}
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
            <Route path="/casedata/:id" element={<CaseDataPage />} />
            <Route element={<MainApp />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/review" element={<ReviewData />} />
                <Route path="/complete" element={<CompletingData />} />
                {/* <Route path="/createandmanege" element={<CreateAndManege />} /> */}
                {BeneficiaryRoutes}
                <Route path="/viewdonations/:id" element={<ViewDonations />} />
                {FinanceRoutes}
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
                {/* Projects routes integrated via ProjectRoutes */}
                {HrRoutes}
                <Route
                  path="/requestpermission"
                  element={<RequestPermission />}
                />
                <Route path="/jobtitle" element={<Jobtitle />} />
                <Route
                  path="/departmentsdetails"
                  element={<DepartmentsDetails />}
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

                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/setnewpassword" element={<SetnewPassword />} />
                <Route path="/datareview" element={<DataReview />} />



                <Route path="/addnewclient" element={<AddNewClient />} />
                <Route path="/addnewsupplier" element={<AddNewSupplier />} />
                <Route
                  path="/statementofaccount"
                  element={<StatementOfAccount />}
                />
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

                {/* <Route path="/employpaper" element={<EmployPaper />} /> */}
                <Route path="/addempaper/:id" element={<AddEmpPaper />} />

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

                {/* الصفحة الجديدة لاضافة المستفيد */}


                <Route path="/editjobtitle/:id" element={<EditJobTitle />} />


                {/* <Route
                  path="/hrreport/jobtitles"
                  element={<JobtitleReport />}
                /> */}
                {/* <Route
                  path="/hrreport/employees"
                  element={<EmployeeReport />}
                /> */}

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
                {AccountingRoutes}
                <Route
                  path="/warrantorspayment/:id"
                  element={<WarrantorsPayments />}
                />
                <Route
                  path="/associationmemberspayment/:id"
                  element={<AssociationMembersPayment />}
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
                {/* Edit project routes integrated via ProjectRoutes */}
                <Route
                  path="/projectpaymentvouchers/:id"
                  element={<ViewDonationsProject />}
                />
                <Route path="/fstudy/:id" element={<Fstudy />} />

                <Route
                  path="/moneyreceiptreports/:id"
                  element={<Moneyreceiptreports />}
                />
                <Route
                  path="/moneytransferreports/:id"
                  element={<Moneytransferreports />}
                />

                <Route
                  path="showpaymentHistory/:id"
                  element={<ShowpaymentHistory />}
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


                <Route path="/editMissions/:id" element={<EditMissions />} />
                {/* <Route path="/hrreport/emploteeVac" element={<EmpVac />} /> */}
                <Route path="/showEmpVac" element={<ShowEmpVac />} />

                <Route path="/loanView/:id" element={<LoanView />} />

                {SettingsRoutes}
                <Route path="/loandetails/:id" element={<LoanDetails />} />
                <Route path="/showMissions/:id" element={<ShowMissions />} />
                <Route path="/users" element={<Users />} />
                <Route path="viewendowments/:id" element={<ViewEndowments />} />

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
                {ProjectRoutes}
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
