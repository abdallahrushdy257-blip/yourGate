import { useState } from "react";
import SideNav from "../components/admin/SideNav";
import TopNav from "../components/admin/TopNav";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="admin-layout">
      <SideNav
        isVisible={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className={`admin-main ${sidebarOpen ? "sidebar-open" : ""}`}>
        <TopNav toggleSidebar={toggleSidebar} />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
