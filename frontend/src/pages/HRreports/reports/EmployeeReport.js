// import { useEffect, useState } from "react";
import CustomTable from "../../../components/CustomTable";
import "../hrreports.css";
// import Title from "../../components/title";
// import PrintHead from "../../components/PrintHead";
// import PrintFooter from "../../components/PrintFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faList, faTable } from "@fortawesome/free-solid-svg-icons";
// import { Dropdown } from "react-bootstrap";
import HRreports from "../HRreports";
import API from "../../../api/axiosConfig";
import TestPreLoader from "../../TestPreLoader/TestPreLoader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import TableComponent from "../../../components/TableComponent";


function EmployeeReport() {
  const handleDownload = (selectedRows) => {
    let activeRows, activeColumns;
    activeRows = rows;
    activeColumns = columns6;
    const selectedData = activeRows.filter((row) =>
      selectedRows.includes(row.id)
    );
    if (selectedData.length === 0) {
      alert("Please select at least one row.");
      return;
    }

    const csvHeader = activeColumns
      .filter((col) => col.key !== "actions")
      .map((col) => col.name)
      .join(",");

    const csvRows = selectedData.map((row) =>
      activeColumns
        .filter((col) => col.key !== "actions")
        .map((col) => `"${row[col.key] || ""}"`)
        .join(",")
    );

    const csvContent = `${csvHeader}\n${csvRows.join("\n")}`;

    const bom = "\uFEFF";
    const finalContent = bom + csvContent;

    const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "selected_rows_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns6 = [
    { name: "إسم الموظف", key: "name" },
    { name: "رقم الهوية", key: "nationalid" },
    { name: "رقم الجوال", key: "phone" },
    { name: "تاريخ التعيين", key: "dateofhire" },
    { name: "المسمي الوظيفي", key: "jobname" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions6 = [
    { label: "إضافة مكافآة او خصم ", route: "/discounts/:id" },
    { label: "إضافة تحقيق ", route: "/investigations/:id" },
    { label: " مستندات التوظيف", route: "/employeepaper/:id" },
    { label: "تعديل", route: "/editemployee/:id" },
    { label: "كارت الموظف", route: "/showEmployeeCard/:id" },
    { label: "عرض", route: "/showEmployee/:id" },
  ];

  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState([]);





  return (

    <>
      <HRreports activeTab="employeereport" />

      <div className="hrReports-tabel">

        <TableComponent
          apiUrl="/employees"
          columns={columns6}
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          title="تقارير الموظفين"
          dropdownOptions={dropdownOptions6}
          searchDate={false}
        />
      </div>
    </>
  )
}

export default EmployeeReport;