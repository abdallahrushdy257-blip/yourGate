import { Nav, Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { ThemeContext } from "../context/theme-context";
import { Link } from "react-router";
import "./LandingNav.css"

import logoLight from "../logo-light.svg";
import logoDark from "../logo-dark.svg";

function LandingNav() {
  const { theme, setTheme } = useContext(ThemeContext);

  const Logo = theme === "light" ? logoLight : logoDark;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Navbar expand="lg" className="landingPageNav">
      <Navbar.Brand href="">
        <img width="50px" className="register-logo" src={Logo} alt="logo" />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav" className="navlinksColla">
        <Nav className="navlinks">
          <div className="navlinksCon">
            <Link to="/" className="mainNavLink">الرئيسية</Link>
            <Link to="/createMangelanding" className="mainNavLink">إنشاء وإدارة</Link>
            <Link to="/designmarketinglanding" className="mainNavLink">الادارة وتصميم المشاريع</Link>
            <Link to="/hrlanding" className="mainNavLink">الموارد البشرية</Link>
            <Link to="/loanslanding" className="mainNavLink">  القروض و الاقساط</Link>
            <Link to="/dataManagementLanding" className="mainNavLink">إدارة البيانات</Link>
            <Link to="/websideLanding" className="mainNavLink">أنشيء موقعك الإلكتروني</Link>

            {/* زرار التوجل */}
            <button
              className="themeToggleBtn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon
                icon={theme === "light" ? faMoon : faSun}
              />
            </button>
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default LandingNav;
