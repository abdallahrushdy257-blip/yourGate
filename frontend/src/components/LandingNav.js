import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../context/theme-context";
import { NavLink, useNavigate } from "react-router-dom";
import "./LandingNav.css";
import "./MainLandingPageNav.css";
import logoLight from "../logo-light.svg";
import logoDark from "../logo-dark.svg";

function LandingNav() {
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const Logo = theme === "light" ? logoLight : logoDark;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navItems = [
    { to: "/", label: "الرئيسية" },
    { to: "/createMangelanding", label: "إنشاء وإدارة" },
    { to: "/designmarketinglanding", label: "تصميم المشاريع" },
    { to: "/hrlanding", label: "الموارد البشرية" },
    { to: "/loanslanding", label: "القروض والأقساط" },
    { to: "/dataManagementLanding", label: "إدارة البيانات" },
    { to: "/archiveslanding", label: "الأرشيف" },
    { to: "/endowmentsLanding", label: "الأوقاف" },
    { to: "/tasksLanding", label: "المهام" },
    { to: "/accountingLanding", label: "المحاسبة" },
    { to: "/landingStore", label: "المتجر" },
    { to: "/websiteLanding", label: "أنشئ موقعك" },
  ];

  return (
    <>
      <header className="landingPageNav featureLandingNav" dir="rtl">
        {/* 1. Brand Logo & Name */}
        <div className="navBrandSection" onClick={() => navigate("/")}>
          <img className="register-logo" src={Logo} alt="logo" />
        </div>

        {/* 2. Desktop Navigation Links (Hidden on mobile/tablet) */}
        <nav className="navCenterLinks featureNavLinks">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `mainNavLink featureNavLink ${isActive ? "activeFeatureLink" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* 3. Actions: Login, Theme Toggle & Mobile Hamburger */}
        <div className="navActionsSection">
          <button
            type="button"
            className="navLoginBtn desktopLoginBtn"
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/login");
            }}
          >
            تسجيل الدخول
          </button>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title="تبديل المظهر"
            aria-label="تبديل المظهر"
          >
            <FontAwesomeIcon
              icon={theme === "light" ? faSun : faMoon}
              className="theme-icon"
            />
          </button>

          {/* Hamburger Menu Button (Visible on mobile/tablet) */}
          <button
            type="button"
            className="navMenuToggleBtn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            title="القائمة"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} />
          </button>
        </div>
      </header>

      {/* 4. Mobile Navigation Dropdown Menu & Backdrop */}
      {isMenuOpen && (
        <>
          <div
            className="mobileNavBackdrop"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="mobileNavDrawer featureMobileDrawer" dir="rtl">
            <div className="mobileNavGridLinks">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `mobileNavLinkItem ${isActive ? "activeFeatureLink" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <button
              type="button"
              className="mobileNavLoginBtn"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/login");
              }}
            >
              تسجيل الدخول
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default LandingNav;
