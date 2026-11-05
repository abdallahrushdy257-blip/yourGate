import { useNavigate } from "react-router";
import "./setting.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faPoll,
  faPrint,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";

function SettingTabs({ activeTab, onTabChange }) {
  const navigate = useNavigate();

  const tabs = [
    {
      id: "general",
      path: "/setting/general",
      label: "البيانات العامة للجمعية",
      icon: faBuilding,
    },
    {
      id: "print",
      path: "/setting/general",
      label: "إعدادات الطباعة والفواتير",
      icon: faPrint,
    },
    {
      id: "survey",
      path: "/setting/general",
      label: "أسئلة استبيان المستفيدين",
      icon: faPoll,
    },
    {
      id: "extra",
      path: "/setting/general",
      label: "بيانات إضافية (نص حر)",
      icon: faFileLines,
    },
  ];

  const handleTabClick = (tab) => {
    if (onTabChange) {
      onTabChange(tab.id);
    } else {
      navigate(tab.path);
    }
  };

  return (
    <div className="settings-navigation-tabs">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`settings-nav-tab ${isActive ? "active" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.icon && (
              <FontAwesomeIcon
                icon={tab.icon}
                className="settings-nav-icon"
              />
            )}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default SettingTabs;
