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
            </Route>
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
