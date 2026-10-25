import { useState } from "react";
import CustomTable from "../../../components/CustomTable";
import Title from "../../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableColumns } from "@fortawesome/free-solid-svg-icons";

function AccountsReport() {
  const columns = [
    { name: "", key: "id" },
    { name: "إسم العميل", key: "name" },
    { name: "كود العميل", key: "clientCode" },
    { name: "الرصيد المتاح", key: "avaliablebud" },
  ];

  const [rows, setRows] = useState([
    {
      id: 1,
      name: "محمج",
      clientCode: "2010610",
      avaliablebud: "5552",
      
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
  return (
    <>
      <div className="printcasedata-container">
        <Title title="تقرير الحسابات" style={{ width: "unset" }} icon={<FontAwesomeIcon icon={faTableColumns} />} />

        <CustomTable
          columns={columns}
          data={rows}
          onDownload={handleDownload}
        />
      </div>
    </>
  );
}

export default AccountsReport;
