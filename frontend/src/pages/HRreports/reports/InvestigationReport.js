import { useState } from "react";
import TableComponent from "../../../components/TableComponent";
import "../hrreports.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable, faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../../../components/CustomButton";
import InvestigationsModal from "../../Investigations/Investigations";

function InvestigationReport() {
  const [rows, setRows] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDownload = (selectedRows) => {
    let activeRows = rows;
    let activeColumns = columns1;
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
    { name: "إسم المحقق", key: "investigator" },
    { name: "إسم المحقق معه", key: "name" },
    { name: "الوصف", key: "description" },
    { name: "التاريخ", key: "date" },
    { name: "النتيجة", key: "result" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions1 = [{ label: "تعديل", route: "/editInvestigations/:id" }];

  const handleSuccessAdd = () => {
    setRefreshKey((prev) => prev + 1); // تحديث بيانات الجدول
  };

  return (
    <>
      <div className="hrReports-tabel">

        <TableComponent
          key={refreshKey}
          addBtn={true}
          onAddClick={() => setShowAddModal(true)}
          apiUrl="/investigations"
          columns={columns1}
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          title="تقارير التحقيقات الادارية"
          onDownload={handleDownload}
          dropdownOptions={dropdownOptions1}
          search
        />
      </div>

      {/* مودال إضافة تحقيق */}
      <InvestigationsModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        onSuccess={handleSuccessAdd}
      />
    </>
  );
}

export default InvestigationReport;