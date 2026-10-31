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
import MarketingDesignProjectManagement from "./pages/MarketingDesignProjectManagement/MarketingDesignProjectManagement";
import ThemeContextProvider from "./context/theme-context";
import ProjectStatus from "./pages/ProjectStatus/ProjectStatus";
// import MonthlySalary from "./pages/MonthlySalary/MonthlySalary";
import TestPreLoader from "./pages/TestPreLoader/TestPreLoader";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import SetnewPassword from "./pages/ForgotPassword/SetnewPassword";
import DataReview from "./pages/DataReview/DataReview";
import MainLanding from "./landings/MainLanding";
import CreateMangeLanding from "./landings/CreateMangeLanding";
import DesignMarketingLanding from "./landings/DesignMarketingLanding";
import HRLanding from "./landings/HRLanding";
import CarouselComponent from "./pages/CarouselCom/CarouselCom";
import CommitmentCompliance from "./pages/CommitmentCompliance/CommitmentCompliance";
// import AddDonor from "./pages/AddDonor/AddDonor";
import TestPrint from "./pages/TestPrint/TestPrint";
import Additionalnformation from "./pages/AddBeneficiary/Additionalnformation";
import MembershipData from "./pages/AddBeneficiary/MembershipData";
import BankData from "./pages/AddBeneficiary/BankData";
import CallingData from "./pages/AddBeneficiary/CallingData";
import QualificationPosition from "./pages/AddBeneficiary/QualificationPosition";
import HousingData from "./pages/AddBeneficiary/HousingData";
import HealthData from "./pages/AddBeneficiary/HealthData";
import DependentsData from "./pages/AddBeneficiary/DependentsData";
import Verify from "./pages/Verify/Verify";
import AddBenef from "./pages/AddBeneficiary/AddBenef";
import LandingStore from "./pages/LandingStore/LandingStore";
import TestNewTable from "./pages/TestNewTable/TestNewTable";
import EditProjectStatus from "./pages/MarketingDesignProjectManagement/EditProjectStatus";
import OrganizationalChart from "./pages/OrganizationalChart/OrganizationalChart";
import Users from "./pages/Users/Users";
import Terms from "./pages/TermsandCondition/Terms";
import Privacy from "./pages/TermsandCondition/Privacy";
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
import { ProjectRoutes } from "./modules/projects";
import { OrganizationRoutes } from "./modules/organization";
import AddOrganization from "./admin/organization/AddOrganization";
import { FinanceRoutes } from "./modules/finance";
import { HrRoutes } from "./modules/hr";
import { BeneficiaryRoutes, CaseDataPage, BenefitAddDetailsPage } from "./modules/beneficiaries";
import { AccountingRoutes } from "./modules/accounting";
import { SettingsRoutes } from "./modules/settings";
import { MarketingRoutes } from "./modules/marketing";
import { PartnerRoutes } from "./modules/partners";
import { LoanRoutes } from "./modules/loans";
import { VoucherRoutes } from "./modules/vouchers";
import { GovernanceRoutes } from "./modules/governance";
import { EndowmentRoutes } from "./modules/endowments";
import { TrainingRoutes } from "./modules/training";
import { DonationRoutes } from "./modules/donations";
import UserProfile from "./pages/Users/UserProfile";
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
                
                {FinanceRoutes}
                                {/* <Route
                  path="/marketingdesignprojectmanagement"
                  element={<MarketingDesignProjectManagement />}
                /> */}
                                                                                                {ProjectRoutes}
                {HrRoutes}
                                <Route path="/testpreLoader" element={<TestPreLoader />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/setnewpassword" element={<SetnewPassword />} />
                <Route path="/datareview" element={<DataReview />} />
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
                                                                {/*                 {/* <Route path="/addMinutes" element={<AddMinutes />} /> */}
                                {/*                 <Route path="/paymentsDue" element={<PaymentsDue />} />
                <Route path="/paymentHistory" element={<PaymentHistory />} />
                <Route
                  path="/donationDetails/:id"
                  element={<DonationDetails />}
                />
                                

                <Route path="/testNewTable" element={<TestNewTable />} />
                                                                {/*                                                 
                {/* <Route path="/addmission" element={<AddMissions />} /> */}
                {AccountingRoutes}
                                                                                                {/* Edit project routes integrated via ProjectRoutes */}
                                
                                
                
                <Route
                  path="organizationalChart"
                  element={<OrganizationalChart />}
                />
                                                                
                                

                
                {SettingsRoutes}
                {MarketingRoutes}
                {PartnerRoutes}
                {LoanRoutes}
                {VoucherRoutes}
                {GovernanceRoutes}
                {EndowmentRoutes}
                {TrainingRoutes}
                {DonationRoutes}
                {OrganizationRoutes}
                <Route path="/bankdata" element={<BankData />} />
                <Route path="/qualificationposition" element={<QualificationPosition />} />
                <Route path="/createorg" element={<AddOrganization />} />
                <Route path="/addorganization" element={<AddOrganization />} />
                <Route path="/organization/requests" element={<OrgaminzationRequest />} />
                <Route path="/organization/requests/:id" element={<OrgaminzationRequest />} />
                <Route path="/organizationrequests" element={<OrgaminzationRequest />} />
                <Route path="/users" element={<Users />} />
                <Route
                  path="notifications/:id"
                  element={<NotificationItem />}
                />
                <Route path="/profile" element={<UserProfile />} />

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
