import React, { useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faArrowRight,
  faArrowLeft,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../../context/theme-context";
import { useNavigate } from "react-router-dom";
import logoLight from "../../logo-light.svg";
import logoDark from "../../logo-dark.svg";

export default function LandingNav3D({ t, dir, isRTL }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isScrolledRef = useRef(false);
  const navigate = useNavigate();

  const logoSrc = theme === "light" ? logoLight : logoDark;

  useEffect(() => {
    let rafPending = false;
    const handleScroll = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        const scrolled = window.scrollY > 40;
        if (scrolled !== isScrolledRef.current) {
          isScrolledRef.current = scrolled;
          setIsScrolled(scrolled);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const themeLabel = theme === "light" ? t.nav.themeDark : t.nav.themeLight;

  return (
    <header
      className={`landingNav3D ${isScrolled ? "navScrolled" : ""}`}
      dir={dir}
    >
      <div className="navContainer">
        {/* Brand Logo */}
        <div
          className="navBrand"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src={logoSrc}
            alt="YourGate"
            width={42}
            height={42}
            className="navLogoImg"
          />
          <div className="navBrandText">
            <span className="brandName">{t.nav.brand}</span>
            <span className="brandBadge">SaaS</span>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="navLinksDesktop" aria-label={t.nav.brand}>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {t.nav.home}
          </button>
          <button type="button" onClick={() => scrollTo("donationJourney")}>
            {t.nav.journey}
          </button>
          <button type="button" onClick={() => scrollTo("platformModules")}>
            {t.nav.modules}
          </button>
          <button type="button" onClick={() => scrollTo("governanceSecurity")}>
            {t.nav.governance}
          </button>
          <button type="button" onClick={() => scrollTo("liveImpact")}>
            {t.nav.impact}
          </button>
          <button type="button" onClick={() => scrollTo("pricingSection")}>
            {t.nav.pricing}
          </button>
        </nav>

        {/* Actions Group (Theme, Auth) */}
        <div className="navActions">
          {/* Theme Toggle Button */}
          <button
            type="button"
            className="navBtnSecondary themeToggleBtn"
            onClick={handleToggleTheme}
            title={themeLabel}
            aria-label={themeLabel}
          >
            <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
          </button>

          {/* Login Link */}
          <button
            type="button"
            className="navBtnLogin"
            onClick={() => navigate("/login")}
          >
            {t.nav.login}
          </button>

          {/* Free Trial CTA */}
          <button
            type="button"
            className="navBtnCta"
            onClick={() => navigate("/charityregistration")}
          >
            <span>{t.nav.startTrial}</span>
            <FontAwesomeIcon icon={isRTL ? faArrowLeft : faArrowRight} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobileMenuToggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
            aria-expanded={mobileMenuOpen}
          >
            <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobileDrawer" dir={dir}>
          <button type="button" onClick={() => scrollTo("donationJourney")}>
            {t.nav.journey}
          </button>
          <button type="button" onClick={() => scrollTo("platformModules")}>
            {t.nav.modules}
          </button>
          <button type="button" onClick={() => scrollTo("governanceSecurity")}>
            {t.nav.governance}
          </button>
          <button type="button" onClick={() => scrollTo("liveImpact")}>
            {t.nav.impact}
          </button>
          <button type="button" onClick={() => scrollTo("pricingSection")}>
            {t.nav.pricing}
          </button>
          <button type="button" onClick={() => navigate("/login")}>
            {t.nav.login}
          </button>
          <button type="button" onClick={() => navigate("/charityregistration")}>
            {t.nav.startTrial}
          </button>
        </div>
      )}
    </header>
  );
}
