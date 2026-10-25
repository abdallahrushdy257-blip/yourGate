import { useNavigate } from "react-router";
import "./setting.css";

function SettingTabs({ activeTab }) {
    const navigate = useNavigate();

    const tabs = [
        { id: `/setting/general`, label: "البيانات العامه للجمعية", key: "general" },
        // { id: `/setting/print`, label: "بيانات الطباعة", key: "print" },
        // { id: `/setting/enter`, label: "بيانات الإدخال", key: "enter" },
    ];

    return (
        <div className="permissions-tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
                    onClick={() => navigate(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default SettingTabs;
