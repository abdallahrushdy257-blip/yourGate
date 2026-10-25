import React, { useContext , useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCircleXmark, faHome, faList } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../context/theme-context";
import API from "../api/axiosConfig";
import "./HomeNavbar.css";
import DarkLightbutton from "./DarkLightbutton";

import logoLight from "../logo-light.svg";
import logoDark from "../logo-dark.svg";

function HomeNavbar({ size, toggleSidebar, isSidebarVisible }) {
  const { theme } = useContext(ThemeContext);
  const [notifications, setNotifications] = React.useState([]); 
  const [count, setCount] = React.useState(0);
  const getNotifications = async() => {
    const res = await API.get("/notify");
    const data = await res;
    if (res.status === 200) {
      setNotifications(data.data.notifications);
      setCount(data.data.count);
    }
  }

  useEffect(() => {
    getNotifications();
  }, []);
  const Logo = theme === "light" ? logoLight : logoDark;
  return (
    <>
      <Navbar
        expand="lg"
        className={`navbar-custom navbar ${size} ${
          isSidebarVisible ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <Navbar.Brand href="" className="brand-custom">
          <img width="40px" className="register-logo" src={Logo} alt="logo" />
        </Navbar.Brand>

        <div className="show d-flex align-items-center">
          <div className="dl-change">
            <DarkLightbutton />
          </div>
          <Nav>
            <div className="notification-icon-wrapper">
            <NavDropdown
              title={<FontAwesomeIcon icon={faBell} />}
              id="notification-dropdown"
              >
          
              <NavDropdown.Item href="">الإشعارات</NavDropdown.Item>
              <NavDropdown.Divider />
              {notifications.map((notification, index) => (
                <NavDropdown.Item className="notifications" href={`/notifications/${notification.id}`} key={index}>
                  <p className="notificationstext">{notification.title}</p>
                  <FontAwesomeIcon icon={faCircleXmark} className="notificationsicon" />
                </NavDropdown.Item>
              ))}
              
              
            
            </NavDropdown>
              {count > 0 && <span className="notification-count">{count}</span>}
              </div>

            <Nav.Link href="/home" className="hs-Container">
              <FontAwesomeIcon icon={faHome} />
            </Nav.Link>
            <Nav.Link href="" className="hs-Container">
              <button className="hideshow-side" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faList} />
              </button>
            </Nav.Link>
          </Nav>
          
        </div>
      </Navbar>
    </>
  );
}

export default HomeNavbar;
