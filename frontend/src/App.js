import { useState, lazy, Suspense } from "react";
import "./App.css";
import "./print.css";
import ProtectedRoute from "./context/ProtectedRoute";
import { Route, Routes, useLocation, Navigate, useParams } from "react-router-dom";

import { PublicRoutes } from "./modules/common/routes/publicRoutes";
import { CommonRoutes } from "./modules/common/routes/commonRoutes";
import { ProjectRoutes } from "./modules/projects/routes/projectRoutes";
import { FinanceRoutes } from "./modules/finance/routes/financeRoutes";
import { HrRoutes } from "./modules/hr/routes/hrRoutes";
import { CaseRoutes } from "./modules/cases/routes/caseRoutes";
import { DataManagementRoutes } from "./modules/data-management/routes/dataManagementRoutes";
import { AccountingRoutes } from "./modules/accounting/routes/accountingRoutes";
import { SettingsRoutes } from "./modules/settings/routes/settingsRoutes";
import { MarketingRoutes } from "./modules/marketing/routes/marketingRoutes";
import { PartnerRoutes } from "./modules/partners/routes/partnerRoutes";
import { LoanRoutes } from "./modules/loans/routes/loanRoutes";
import { EndowmentRoutes } from "./modules/endowments/routes/endowmentRoutes";
import { ArchiveRoutes } from "./modules/archives/routes/archiveRoutes";
import { TaskRoutes } from "./modules/tasks/routes/taskRoutes";
import { RoleRoutes } from "./modules/roles/routes/roleRoutes";
import { UserRoutes } from "./modules/users/routes/userRoutes";
import { AdminRoutes } from "./admin/routes/adminRoutes";

const MainApp = lazy(() => import("./components/MainApp"));
const RightSidebar = lazy(() => import("./components/RightSidebar"));
const HomeNavbar = lazy(() => import("./components/HomeNavbar"));
const PaymentDetails = lazy(() =>
  import("./modules/data-management/pages/beneficiaries/PaymentDetails")
);

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
    <div
      className={`App ${
        isSidebarVisible ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      {showNavbar && (
        <Suspense fallback={null}>
          <HomeNavbar
            toggleSidebar={toggleSidebar}
            isSidebarVisible={isSidebarVisible}
          />
        </Suspense>
      )}
      {showSidebar && (
        <Suspense fallback={null}>
          <RightSidebar
            isVisible={isSidebarVisible}
            toggleSidebar={toggleSidebar}
          />
        </Suspense>
      )}

<<<<<<< HEAD
      <div className="page-container">
        <Routes>
          {PublicRoutes}
          <Route
            element={
              <Suspense fallback={null}>
                <MainApp />
              </Suspense>
            }
          >
            <Route element={<ProtectedRoute />}>
              <Route
                path="/paymentDetails/:id"
                element={
                  <Suspense fallback={null}>
                    <PaymentDetails />
                  </Suspense>
                }
              />
              {CommonRoutes}
              {CaseRoutes}
              {DataManagementRoutes}
              {FinanceRoutes}
              {ProjectRoutes}
              {HrRoutes}
              {AccountingRoutes}
              <Route
                path="/projectpaymentvouchers/:id"
                element={<ProjectPaymentVouchersRedirect />}
              />
              {SettingsRoutes}
              {RoleRoutes}
              {UserRoutes}
              {MarketingRoutes}
              {PartnerRoutes}
              {LoanRoutes}
              {EndowmentRoutes}
              {ArchiveRoutes}
              {TaskRoutes}
              {AdminRoutes}
=======
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
            <Route path="/paymentDetails/:id" element={<PaymentDetails />} />
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
                {/* <Route path="/paymentsDue" element={<PaymentsDue />} /> */}
                {/* <Route path="/donationDetails/:id" element={<DonationDetails />} /> */}

                <Route path="/testNewTable" element={<TestNewTable />} />
                {AccountingRoutes}
                <Route
                  path="/projectpaymentvouchers/:id"
                  element={<ProjectPaymentVouchersRedirect />}
                />
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
>>>>>>> 6dd3331de590899fc05b1df69047e8f83980c401
            </Route>
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
