import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { faChevronDown, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "./Dropdown.css";

const Dropdown = (props) => {
  const [openSubMenus, setOpenSubMenus] = useState({});

  const toggleSubMenu = (category) => {
    setOpenSubMenus((prev) => (prev[category] ? {} : { [category]: true }));
  };

  return (
    <div className={`text-with-choices ${props.isOpen ? "is-active" : ""}`}>
      <div
        className={`clickable-text ${props.isOpen ? "active-head" : ""}`}
        onClick={props.onToggle}
      >
        <div className="menu-title-group">
          {props.icon && (
            <FontAwesomeIcon className="sideIcon" icon={props.icon} />
          )}
          <span className="menu-name">{props.name}</span>
        </div>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`arrow-icon ${props.isOpen ? "rotate" : ""}`}
        />
      </div>

      <div className={`choices-wrapper ${props.isOpen ? "open" : ""}`}>
        <div className="choices-inner">
          {props.choices &&
            props.choices.map((choice, index) => (
              <div key={index} className="clickdiv">
                {choice.category ? (
                  <div className="submenu-group">
                    <div
                      className={`clickable-submenu ${
                        openSubMenus[choice.category] ? "submenu-active" : ""
                      }`}
                      onClick={() => toggleSubMenu(choice.category)}
                    >
                      <div className="submenu-title-group">
                        {choice.icon && (
                          <FontAwesomeIcon
                            icon={choice.icon}
                            className="submenu-icon"
                          />
                        )}
                        <span>{choice.category}</span>
                      </div>
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        className={`sub-arrow ${
                          openSubMenus[choice.category] ? "sub-rotate" : ""
                        }`}
                      />
                    </div>
                    {openSubMenus[choice.category] && (
                      <div className="sub-choices">
                        {choice.subChoices &&
                          choice.subChoices.map((subChoice, subIndex) => (
                            <NavLink
                              key={subIndex}
                              className={({ isActive }) =>
                                `sidebar-subelement ${
                                  isActive ? "active-link" : ""
                                }`
                              }
                              to={subChoice.route}
                            >
                              <span className="subelement-bullet"></span>
                              <span>{subChoice.label}</span>
                            </NavLink>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    className={({ isActive }) =>
                      `sidebar-subelement direct-link ${
                        isActive ? "active-link" : ""
                      }`
                    }
                    to={choice.route}
                  >
                    <span className="subelement-bullet"></span>
                    <span>{choice.label}</span>
                  </NavLink>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
