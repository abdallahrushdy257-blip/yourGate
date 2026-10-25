import { Nav, Navbar, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { ThemeContext } from "../context/theme-context";
import { useNavigate } from "react-router";
import "./MainLandingPageNav.css"
import logoLight from "../logo-light.svg";
import logoDark from "../logo-dark.svg";

function MainLandingPageNav() {
  const { theme, setTheme } = useContext(ThemeContext);

  const Logo = theme === "light" ? logoLight : logoDark;

  const handleToggle = (value) => {
    setTheme(value);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const yOffset = -150;
      const yPosition =
        section.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: yPosition, behavior: "smooth" });
    }
  };

  const navigate = useNavigate();

  return (
    <Navbar expand="lg" className="landingPageNav">
  <Navbar.Brand href="">
    <img width="50px" className="register-logo" src={Logo} alt="logo" />
  </Navbar.Brand>

  <Navbar.Toggle aria-controls="navbar-nav" />

  <Navbar.Collapse id="navbar-nav" className="navlinksColla">
    <Nav className="navlinks">
      <div className="navlinksCon">
        <p className="mainNavLink" onClick={() => navigate("/")}>الرئيسية</p>
        {/* <p className="mainNavLink" onClick={() => scrollToSection("mainourSystemContainer")}>نظامنا</p> */}
        <p className="mainNavLink" onClick={() => scrollToSection("mainourServ")}>خدماتنا</p>
        <p className="mainNavLink" onClick={() => scrollToSection("mainsubscriptionContainer")}>الأسعار</p>
        <p className="mainNavLink" onClick={() => scrollToSection("mainContactUs")}>تواصل معنا</p>
        <p className="mainNavLink" onClick={() => navigate("/landingStore")}>المتجر</p>
        <p className="mainNavLink" onClick={() => navigate("/login")}>تسجيل الدخول</p>

        {/* THEME TOGGLE BUTTON */}
        <button
          className="theme-toggle-btn"
          onClick={() => handleToggle(theme === "light" ? "dark" : "light")}
        >
          <FontAwesomeIcon
            icon={theme === "light" ? faSun : faMoon}
            className="theme-icon"
          />
        </button>
      </div>
    </Nav>
  </Navbar.Collapse>
</Navbar>

  );
}

export default MainLandingPageNav;
