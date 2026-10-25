import React, { useState } from "react";
import CustomTable from "../../components/CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import Title from "../../components/title";

function PrintCaseData(props) {
  const columns = [
    { name: "#", key: "actions" },
    { name: "إسم الحالة", key: "name" },
    { name: "نوع العملية", key: "operationType" },
    { name: "التاريخ", key: "date" },
    { name: "المرفقات", key: "attachments" },
    { name: "المدة الزمنية", key: "timeDuration" },
  ];

  const [rows, setRows] = useState([
    {
      id: 1,
      name: "John Doe",
      operationType: "Type A",
      date: "2024-12-01",
      attachments: "Attachment A",
      timeDuration: "--:--",
    },
    {
      id: 2,
      name: "Jane Smith",
      operationType: "Type B",
      date: "2024-12-02",
      attachments: "Attachment B",
      timeDuration: "01:30",
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
          title="طباعة بيانات الحالة"
          icon={<FontAwesomeIcon icon={faPrint} />}
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

export default PrintCaseData;
