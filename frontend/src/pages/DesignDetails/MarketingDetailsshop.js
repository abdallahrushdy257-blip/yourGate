import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./DesignsDetails.css";
import { faList12, faSignsPost } from "@fortawesome/free-solid-svg-icons";
import CustomTable from "../../components/CustomTable";
import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import { Button } from "react-bootstrap";
import TableComponent from "../../components/TableComponent";
function DesignsDetailsshop() {
  const columns = [
    { name: "إسم الحالة", key: "title" },
    { name: "التاريخ", key: "date" },
    { name: "المتطلبات", key: "description" },
    { name: "حالة الطلب", key: "status" },
    { name: "المرفقات", key: "upload" },
    { name: "الملاحظات", key: "note" },
  ];

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleDownload = (selectedRows) => {
    const selectedData = rows.filter((row) => selectedRows.includes(row.id));
    if (selectedData.length === 0) {
      alert("Please select at least one row.");
      return;
    }

    const csvHeader = columns
      .filter((col) => col.key !== "actions")
      .map((col) => col.name)
      .join(",");

    const csvRows = selectedData.map((row) =>
      columns
        .filter((col) => col.key !== "actions")
        .map((col) => `${row[col.key] || ""}`)
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







  const modifyRow = (row) => {
    let newRow = { ...row };
    let currentUrl = window.location.href;
    let transStatus = (status) => {
      if (status == 0) {
        return '<span style="border-radius:5px; border:1px solid blue; padding:2px ">قيد التصميم</span>';
      } else if (status == 1) {
        return '<span  style="border-radius:5px; border:1px solid red; padding:2px ">قيد التنفيذ</span>';
      } else {
        return '<span "border-radius:5px; border:1px solid green; padding:2px ">مكتمل</span>';
      }
    };
    let showPhoto = (photo) => {
      if (photo) {
        return `<a href="${photo}" target="_blank">👁️</a>`;
      } else {
        return '<button class="btn btn-danger" >لا يوجد</button>';
      }
    };

    newRow.status = transStatus(newRow.status);
    newRow.upload = showPhoto(newRow.upload);

    return newRow;

  };
  return (
    // loading ? <TestPreLoader /> :
    <>
      <div className="designsdetails">


        <TableComponent
          apiUrl="/shopdetails/designs"
          columns={columns}
          title="التصميمات"
          titleIcon={<FontAwesomeIcon icon={faSignsPost} />}
          // dropdownOptions={dropdownOptions}
          transformRowFn={modifyRow}
          searchDate={false}
        />
      </div>
    </>
  );
}

export default DesignsDetailsshop;
