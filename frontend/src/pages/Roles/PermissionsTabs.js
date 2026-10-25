import { useNavigate, useParams } from "react-router";
import "./roles.css";

function PermissionsTabs({ activeTab }) {
    const navigate = useNavigate();

    const { id } = useParams(); 

    const tabs = [
        { id: `/permissions/humancase/${id}`, label: "المستفيدون", key: "humancase" },
        { id: `/permissions/donor/${id}`, label: "المانحون", key: "donor" },
        { id: `/permissions/assembly/${id}`, label: "مجلس الادارة", key: "assembly" },
        { id: `/permissions/warrantors/${id}`, label: "الكفلاء", key: "warrantors" },
        { id: `/permissions/case/${id}`, label: "إنشاء وإدارة", key: "case" },
        { id: `/permissions/project/${id}`, label: "إدارة المشاريع", key: "project" },
        { id: `/permissions/hr/${id}`, label: "إدارة الموارد البشرية", key: "hr" },
        { id: `/permissions/loans/${id}`, label: "القروض والأقساط", key: "loans" },
        { id: `/permissions/endowments/${id}`, label: "الأوقاف", key: "endowments" },
        { id: `/permissions/archive/${id}`, label: "الأرشيف", key: "archive" },
        { id: `/permissions/missions/${id}`, label: "إدارة المهام", key: "missions" },
        { id: `/permissions/accounting/${id}`, label: "المحاسبة المالية والقانونية", key: "accounting" },
        { id: `/permissions/setting/${id}`, label: "الاعدادات", key: "setting" },
        { id: `/permissions/users/${id}`, label: "المستخدمون", key: "users" },
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

export default PermissionsTabs;
