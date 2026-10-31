import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../context/theme-context";
import { useNavigate } from "react-router";
import "./MainLandingPageNav.css";
import logoLight from "../logo-light.svg";
import logoDark from "../logo-dark.svg";

function MainLandingPageNav() {
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const Logo = theme === "light" ? logoLight : logoDark;

  const handleToggle = (value) => {
    setTheme(value);
  };

  const scrollToSection = (sectionId) => {
    if (window.location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      return;
    }
    const section = document.getElementById(sectionId);
    if (section) {
      const yOffset = -70;
      const yPosition =
        section.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: yPosition, behavior: "smooth" });
    }
  };

  const handleHomeClick = () => {
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <header className="landingPageNav" dir="rtl">
      {/* 1. Brand Logo & Name */}
      <div className="navBrandSection order-3" onClick={handleHomeClick}>
        <img className="register-logo" src={Logo} alt="بوابتك" />
      </div>

      {/* 2. Navigation Links Distributed in the Center */}
      <nav className="navCenterLinks order-2">
        <button
          type="button"
          className="mainNavLink"
          onClick={handleHomeClick}
        >
          الرئيسية
        </button>
        <button
          type="button"
          className="mainNavLink"
          onClick={() => scrollToSection("mainourServ")}
        >
          خدماتنا
        </button>
        <button
          type="button"
          className="mainNavLink"
          onClick={() => scrollToSection("prices")}
        >
          الأسعار
        </button>
        <button
          type="button"
          className="mainNavLink"
          onClick={() => scrollToSection("aboutUs")}
        >
          ماذا عنا
        </button>
        <button
          type="button"
          className="mainNavLink"
          onClick={() => scrollToSection("footer")}
        >
          تواصل معنا
        </button>
        <button
          type="button"
          className="mainNavLink"
          onClick={() => navigate("/landingStore")}
        >
          المتجر
        </button>
      </nav>

      {/* 3. Actions: Login & Theme Toggle */}
      <div className="navActionsSection order-1">
        <button
          type="button"
          className="navLoginBtn"
          onClick={() => navigate("/login")}
        >
          تسجيل الدخول
        </button>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={() => handleToggle(theme === "light" ? "dark" : "light")}
          title="تبديل المظهر"
          aria-label="تبديل المظهر"
        >
          <FontAwesomeIcon
            icon={theme === "light" ? faSun : faMoon}
            className="theme-icon"
          />
        </button>
      </div>
    </header>
  );
}

export default MainLandingPageNav;
