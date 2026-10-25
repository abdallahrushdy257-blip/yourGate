// layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/HomeNavbar";
import RightSidebar from "../components/RightSidebar";

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <RightSidebar />
      <Outlet />
    </>
  );
};

export default PublicLayout;
