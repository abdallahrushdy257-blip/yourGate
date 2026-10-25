import { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable";
import "./hrreports.css";
import Title from "../../components/title";
import PrintHead from "../../components/PrintHead";
import PrintFooter from "../../components/PrintFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faList, faTable } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router";

function HRreports(props) {
  const [activeTab, setActiveTab] = useState("/jobTitles");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vacationData, setVacationData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const navigate = useNavigate();

  const tabs = [
    // { id: "/hrreport/jobtitles", label: "المسميات الوظيفية", key: "jobtitlereport" },
    // { id: "/hrreport/employees", label: " الموظفين", key: "employeereport" },
    // { id: "/hrreport/volunteers", label: "المتطوعين",  key: "volunteerreport" },
    { id: "/payroll", label: "مسيرات الرواتب", key: "salaryreport" },
    // { id: "/hrreport/vacations", label: "الإجازات", key: "vacationreport" },
    // { id: "/hrreport/kpi", label: "التقييمات الوظيفية", key: "kpireport" },
    // { id: "/hrreport/vacdetails", label: "تفاصيل الإجازات", key: "vacdetailsreport" },
    // { id: "/hrreport/leavepermissionreport", label: " تقرير الأذونات", key: "LeavePermissionReport" },
    // { id: "/hrreport/attendancedeparturereport", label: "الحضور والانصراف", key: "attendancedeparturereport" },
    {
      id: "/hrreport/discounts",
      label: "الخصومات والمكافآت",
      key: "discountsreport",
    },
    {
      id: "/hrreport/investigations",
      label: "التحقيقات",
      key: "investigationreport",
    },
    {
      id: "/hrreport/emploteeVac",
      label: "اجازات الموظفين",
      key: "emploteeVac",
    },
  ];
  const primaryTabs = tabs.slice(0, 5);
  const dropdownTabs = tabs.slice(5);

  return (
    <>
      <div className="hrreports-container no-print">
        <div className="Hrtabs">
          {primaryTabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${
                props.activeTab === tab.key ? "active" : ""
              } Hrtab`}
              onClick={() => navigate(tab.id)}
            >
              {tab.label}
            </button>
          ))}

          {/* <div className="dropdown">
            <button className="tab-button dropdown-buttonHR">
              تقارير إضافية
            </button>
            <div className="dropdown-content Dropdown-contentHR">
              {dropdownTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`dropdown-item dropdown-itemHR ${props.activeTab === tab.key ? "active" : ""
                    }`}
                  onClick={() => navigate(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default HRreports;
