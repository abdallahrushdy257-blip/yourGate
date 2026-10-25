import React, { useState } from "react";
import CustomTable from "../../components/CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faReceipt } from "@fortawesome/free-solid-svg-icons";
import Title from "../../components/title";

function MarketingReports(props) {
  const columns = [
    { name: "#", key: "actions" },
    { name: "إسم المشروع", key: "name" },
    { name: "حالة العملية", key: "operation" },
    { name: "التاريخ", key: "date" },
    { name: "المرفقات", key: "attachments" },
    { name: "المدة الزمانية", key: "duration" },
  ];

  const [rows, setRows] = useState([
    {
      id: 1,
      name: "مشروع ألف",
      operation: "مكتمل",
      date: "2024-01-30",
      attachments: "ملف.pdf",
      duration: "30 يومًا",
    },
    {
      id: 2,
      name: "مشروع باء",
      operation: "قيد التنفيذ",
      date: "2024-02-28",
      attachments: "تقرير.docx",
      duration: "27 يومًا",
    },
    {
      id: 3,
      name: "مشروع جيم",
      operation: "مكتمل",
      date: "2024-03-25",
      attachments: "صورة.png",
      duration: "20 يومًا",
    },
    {
      id: 4,
      name: "مشروع دال",
      operation: "قيد التنفيذ",
      date: "2024-04-30",
      attachments: "عرض تقديمي.pptx",
      duration: "30 يومًا",
    },
    {
      id: 5,
      name: "مشروع هاء",
      operation: "لم يبدأ",
      date: "2024-05-20",
      attachments: "وثيقة.pdf",
      duration: "10 أيام",
    },
  ]);
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

  const dropdownOptions = [
    { label: "تقرير", route: "/viewdonations" },
    { label: "سند صرف", route: "/paymentvoucher" },
    { label: "سند قبض", route: "/receiptvoucher" },
  ];

  return (
    <>
      <div className="printcasedata-container">
        <Title
          title="التسويق والتصميم وإدارة المشاريع "
          icon={<FontAwesomeIcon icon={faChartSimple} />}
          style={{ width: "unset" }}
        />
        <CustomTable
          columns={columns}
          data={rows}
          onDownload={handleDownload}
          dropdownOptions={dropdownOptions}
        />
      </div>
    </>
  );
}

export default MarketingReports;
