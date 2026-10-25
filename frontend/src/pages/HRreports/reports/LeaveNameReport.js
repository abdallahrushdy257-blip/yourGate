import { useEffect, useState } from "react";
import TableComponent from "../../../components/TableComponent";
import "../hrreports.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faList, faTable } from "@fortawesome/free-solid-svg-icons";
import HRreports from "../HRreports";
import API from "../../../api/axiosConfig";
import TestPreLoader from "../../TestPreLoader/TestPreLoader";

function LeaveNameReport() {
  const handleDownload = (selectedRows) => {
    let activeRows, activeColumns;
    activeRows = rows;
    activeColumns = columns1;
    const selectedData = activeRows.filter((row) =>
      selectedRows.includes(row.id),
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
        .join(","),
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

  const columns1 = [
    //{ name: " #", key: "id" },
    { name: " نوع الإجازة", key: "name" },
    { name: " عدد الايام", key: "days" },
    { name: " الوصف", key: "description" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions1 = [{ label: "تعديل", route: "/editLeave/:id" }];

  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <HRreports activeTab="vacdetailsreport" />
      <div className="hrReports-tabel">
        <TableComponent
          apiUrl="/vacations"
          columns={columns1}
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          title="أنواع الإجازات"
          search={false}
          dropdownOptions={dropdownOptions1}
        />
      </div>
    </>
  );
}

export default LeaveNameReport;
