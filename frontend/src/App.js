import { useState, lazy } from "react";
import "./App.css";
import "./print.css";
import ProtectedRoute from "./context/ProtectedRoute";
import RightSidebar from "./components/RightSidebar";
import HomeNavbar from "./components/HomeNavbar";

//import PublicLayout from "./layouts/PublicLayout";
import { Route, Routes, useLocation, Navigate, useParams } from "react-router-dom";
// import CharityRegistration from "./pages/CharityRegistration/CharityRegistration";
// import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import ReviewData from "./pages/ReviewData/ReviewData";
import CompletingData from "./pages/CompletingData/CompletingData";
import MarketingDesignProjectManagement from "./pages/MarketingDesignProjectManagement/MarketingDesignProjectManagement";
import ThemeContextProvider from "./context/theme-context";
// import ProjectStatus from "./modules/projects/pages/ProjectStatus/ProjectStatus";
// import MonthlySalary from "./pages/MonthlySalary/MonthlySalary";
import TestPreLoader from "./pages/TestPreLoader/TestPreLoader";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import SetnewPassword from "./pages/ForgotPassword/SetnewPassword";
import DataReview from "./pages/DataReview/DataReview";
// import MainLanding from "./landings/MainLanding";
import CreateMangeLanding from "./landings/CreateMangeLanding";
import DesignMarketingLanding from "./landings/DesignMarketingLanding";
import HRLanding from "./landings/HRLanding";
import CarouselComponent from "./pages/CarouselCom/CarouselCom";
import CommitmentCompliance from "./pages/CommitmentCompliance/CommitmentCompliance";
// import AddDonor from "./pages/AddDonor/AddDonor";
import TestPrint from "./pages/TestPrint/TestPrint";








// import Verify from "./pages/Verify/Verify";

import LandingStore from "./pages/LandingStore/LandingStore";
import TestNewTable from "./pages/TestNewTable/TestNewTable";
// import EditProjectStatus from "./modules/projects/pages/ProjectStatus/EditProjectStatus";
// import OrganizationalChart from "./modules/hr/pages/OrganizationalChart/OrganizationalChart";
// import Users from "./pages/Users/Users";
import Terms from "./pages/TermsandCondition/Terms";
import Privacy from "./pages/TermsandCondition/Privacy";
import NotificationItem from "./pages/notification/Notification";
import WebsiteLanding from "./landings/WebsiteLanding";
// import NotFound from "./components/NotFound";

import MainApp from "./components/MainApp";
//TODO Make 404 page
//admin dashboard
import AdminLogin from "./admin/Login/AdminLogin";
import LoansLanding from "./landings/LoansLanding";
import DataManagementLanding from "./landings/DataManagementLanding";
import ArchivesLanding from "./landings/ArchivesLanding";
import EndowmentsLanding from "./landings/EndowmentsLanding";
import TasksLanding from "./landings/TasksLanding";
import AccountingLanding from "./landings/AccountingLanding";
import { ProjectRoutes } from "./modules/projects";

import AddOrganization from "./admin/organization/AddOrganization";
import { FinanceRoutes } from "./modules/finance";
import { HrRoutes } from "./modules/hr";
import { CaseRoutes } from "./modules/cases";
const BenefitAddDetailsPage = lazy(() => import("./modules/data-management/pages/beneficiaries/BenefitAddDetails"));
import { DataManagementRoutes } from "./modules/data-management";
import { AccountingRoutes } from "./modules/accounting";
import { SettingsRoutes } from "./modules/settings";
import { MarketingRoutes } from "./modules/marketing";
import { PartnerRoutes } from "./modules/partners";
import { LoanRoutes } from "./modules/loans";


import { EndowmentRoutes } from "./modules/endowments";

import { ArchiveRoutes } from "./modules/archives";
import { TaskRoutes } from "./modules/tasks";
import { RoleRoutes } from "./modules/roles";
import { UserRoutes } from "./modules/users";
// import UserProfile from "./pages/Users/UserProfile";
import CommonRoutes from "./modules/common/routes/commonRoutes";
import { PublicRoutes } from "./modules/common";
import { AdminRoutes } from "./admin/routes/adminRoutes";
// import EmployeeCardPhoto from "./pages/EmployeeCard/EmployeeCardPhoto";
// import ShowEmployeeCard from "./pages/EmployeeCard/ShowEmployeeCard";

function ProjectPaymentVouchersRedirect() {
  const { id } = useParams();
  return <Navigate to={`/projectdetailsview/${id}?tab=financials&filter=payments`} replace />;
}
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
    !location.pathname.startsWith("/benefitadddetails");
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
    !location.pathname.startsWith("/benefitadddetails");

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
            {PublicRoutes}
            {/* <Route path="/ibgates/adminlogin" element={<AdminLogin />} /> */}
            {/* <Route
              path="/charityregistration"
              element={<CharityRegistration />}
            /> */}
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/:id/verify" element={<Verify />} /> */}
            {/* <Route path="/" element={<MainLanding />} /> */}

            {/* <Route
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
            <Route path="/accountingLanding" element={<AccountingLanding />} /> */}

            {/* <Route path="/casedata/:id" element={<CaseDataPage />} /> */}
            <Route element={<MainApp />}>
              <Route element={<ProtectedRoute />}>
                {CommonRoutes}
                 {/* <Route path="/home" element={<Home />} /> */}
                {/* <Route path="/review" element={<ReviewData />} /> */}
                {/*<Route path="/complete" element={<CompletingData  */}
                {/* <Route path="/createandmanege" element={<CreateAndManege />} /> */}
                {CaseRoutes}
                {DataManagementRoutes}
                
                {FinanceRoutes}
                {/* <Route
                  path="/marketingdesignprojectmanagement"
                  element={<MarketingDesignProjectManagement />}
                /> */}
                {ProjectRoutes}
                {HrRoutes}
                {/* <Route path="/testpreLoader" element={<TestPreLoader />} /> */}
                {/* <Route path="/forgotpassword" element={<ForgotPassword />} /> */}
                {/* <Route path="/setnewpassword" element={<SetnewPassword />} /> */}
                {/* <Route path="/datareview" element={<DataReview />} /> */}
                {/* <Route path="/inventoryreport" element={<InventoryReport />} /> */}
                {/* <Route
                  path="/CarouselComponent"
                  element={<CarouselComponent />}
                /> */}
                {/* <Route
                  path="/CommitmentCompliance"
                  element={<CommitmentCompliance />}
                /> */}
                {/* <Route path="/addDonor" element={<AddDonor />} /> */}
                {/* <Route path="/employpaper" element={<EmployPaper />} /> */}             
                {/*                                 <Route path="/testprint" element={<TestPrint />} />
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
                {/* الصفحة الجديدة لاضافة المتفيد */}
                {/* <Route
                  path="/hrreport/jobtitles"
                  element={<JobtitleReport />}
                /> */}
                {/* <Route
                  path="/hrreport/employees"
                  element={<EmployeeReport />}
                /> */}
                {/*                                 {/* <Route
                  path="/hrreport/attendancedeparturereport"
                  element={<AttendenceReport />}
                /> */}
                {/* code below by mohamed hany قبل اضافة ال backend */}
                {/* code below up mohamed hany قبل اضافة ال backend */}
                {/* <Route path="/addBenef" element={<AddBenef />} /> */}
                {/* {/* <Route path="/addMinutes" element={<AddMinutes />} /> */}
                {/* <Route path="/paymentsDue" element={<PaymentsDue />} />
                
                <Route
                  path="/donationDetails/:id"
                  element={<DonationDetails />}
                />
<Route path="/testNewTable" element={<TestNewTable />} />
                {AccountingRoutes}
                <Route
                  path="/projectpaymentvouchers/:id"
                  element={<ProjectPaymentVouchersRedirect />}
                />
                  path="organizationalChart"
                  element={<OrganizationalChart />}
                /> */}
                {SettingsRoutes}
                {RoleRoutes}
                {UserRoutes}
                {MarketingRoutes}
                {PartnerRoutes}
                {LoanRoutes}


                {EndowmentRoutes}

                {ArchiveRoutes}
                {TaskRoutes}

                {/* <Route path="/bankdata" element={<BankData />} /> */}

                {/* <Route path="/qualificationposition" element={<QualificationPosition />} /> */}
                {/* <Route path="/createorg" element={<AddOrganization />} /> */}
                {/* <Route path="/addorganization" element={<AddOrganization />} /> */}
                {/* <Route path="/users" element={<Users />} /> */}
                {/* <Route
                  path="notifications/:id"
                  element={<NotificationItem />}
                /> */}
                {/* <Route path="/profile" element={<UserProfile />} /> */}

                {AdminRoutes}
                {/* <Route path="/interests" element={<Interest />} /> */}
                {/* <Route path="/addhcvendor" element={<Addhcvendor />} /> */}

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
