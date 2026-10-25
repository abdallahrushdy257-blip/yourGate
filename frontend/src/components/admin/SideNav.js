import React, { useState } from "react";
import { Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCogs,
  faChartSimple,
  faDatabase,
  faUser,
  faRightFromBracket,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./SideNav.css";

import Dropdown from "../Dropdown";
import DarkLightbutton from "../DarkLightbutton";

const MENU_CONFIG = [
  {
    key: "org",
    name: "إدارة الجمعيات",
    icon: faDatabase,
    items: [
      { label: " الموديولات ", route: "/modules" },
      // { label: "إنشاء جمعية جيدة", route: "/createorg" },
      { label: " الجمعيات", route: "/organizations" },
      { label: " الجمعيات قيد المعالجة", route: "/pendingorganizations" },
      { label: "الجمعيات المرفوضة", route: "/rejectedorganizations" },
      { label: "تقرير المسئولين", route: "/representatives" },
      
    ],
  },
  {
    key: "accounts",
    name: "الحسابات",
    icon: faCogs,
    items: [
      { label: " الاشتراكات", route: "/subscription" },
      { label: "التاخيرات", route: "/latepayment" },
      
    ],
  },
  {
    key: "ads",
    name: "ادارة الحالات و المشاريع",
    icon: faChartSimple,
    items: [
      { label: "تصميمات الحالات ", route: "/adminshopdesign" },
      { label: " تصميمات المشاريع", route: "/adminprojectdesign" },
      { label: "ادارة الحالات", route: "/adminshopmarketing" },
      { label: " ادارة المشاريع", route: "/adminprojectmarketing" },
      { label: " المتجر ", route: "/ads" },
    ],
  },
   {
    key: "adminusers",
    name: "  المستخدمين الاداريين",
    icon: faUser,
    items: [
      { label: " المستخدمين ", route: "/jobtitle" },
      { label: "  الصلاحيات", route: "/employpaper" },
    
    ],
  },
];

const SideNav = ({ isVisible, toggleSidebar }) => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleDropdown = (key) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar className={`right-sidebar ${isVisible ? "visible" : "hidden"}`}>
      {/* ===== Header ===== */}
      <div className="side-head">
        <button className="sidebar-close-btn" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faCaretRight} />
        </button>

        <div className="infoSide">
          <div className="text">
            <h4>Sayed</h4>
            <p>p@gmail.com</p>
          </div>

          <div
            className="side-imageCon"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <img className="side-image" src="../../logo-dark.svg" alt="user" />

            {showUserMenu && (
              <div className="user-dropdown">
                <ul>
                  <li onClick={() => navigate("/profile")}>
                    <FontAwesomeIcon icon={faUser} /> الملف الشخصي
                  </li>
                  <li onClick={handleLogout}>
                    <FontAwesomeIcon icon={faRightFromBracket} /> تسجيل الخروج
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Menu ===== */}
      <div className="side-lists" id="scrollableDivNav">
        {MENU_CONFIG.map((menu) => (
          <Dropdown
            key={menu.key}
            name={menu.name}
            icon={menu.icon}
            choices={menu.items}
            isOpen={activeDropdown === menu.key}
            onToggle={() => toggleDropdown(menu.key)}
          />
        ))}
      </div>

      {/* ===== Footer ===== */}
      <div className="dl-change">
        <DarkLightbutton />
      </div>
    </Navbar>
  );
};

export default SideNav;
