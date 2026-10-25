import { useState } from "react";
import TableComponent from "../../../components/TableComponent";
import "../hrreports.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faTable } from "@fortawesome/free-solid-svg-icons";
import HRreports from "../HRreports";

function AttendenceReport() {
  const [rows, setRows] = useState([]);


 

  
  const handleDownload = (selectedRows) => {
    let activeRows, activeColumns;
    activeRows = rows;
    activeColumns = columns1;
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

  const columns1 = [
    //{ name: "#", key: "id" },
    { name: "إسم الموظف", key: "name" },
    { name: "وقت الحضور", key: "att" },
    { name: "وقت الانصراف", key: "dateleave" },
    { name: "التاريخ", key: "recorddate" },
    
  ];


  
  return (
   
    <>
      <HRreports activeTab="attendancedeparturereport" />
      <div className="hrReports-tabel">
       
        <TableComponent
          apiUrl="/attendances"
          columns={columns1}
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          title="إدارة الحضور والانصراف"
          onDownload={handleDownload}
          // search={false}
        />
      </div>
    </>
  );
}

export default AttendenceReport;
