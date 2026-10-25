import { useEffect, useState } from "react";
import TableComponent from "../../../components/TableComponent";
import "../hrreports.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faTable } from "@fortawesome/free-solid-svg-icons";
import HRreports from "../HRreports";
import API from "../../../api/axiosConfig";
import TestPreLoader from "../../TestPreLoader/TestPreLoader";
import DiscountsModal from "../../Discounts/Discounts";

function DeductionReport() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState([]);
const [refreshKey, setRefreshKey] = useState(0);
const [showAddModal, setShowAddModal] = useState(false);
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

  // const getAwards = async () => {
  //   try {
  //     const response = await API.get("/salaryactions");
  //     const data = await response;
  //     setRows(data.data);
  //     setLoading(false);
  //   } catch (error) {
  //     setError(error.response.data.message);
  //     setLoading(false);
  //   }
  // }
  const columns1 = [
    { name: "اسم الموظف", key: "name" },
    { name: "النوع", key: "type" },
    { name: "السبب", key: "reason" },
    { name: "التاريخ", key: "date" },
    { name: " نوع القيمة", key: "amounttype" },
    { name: "القيمة", key: "amount" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions1 = [{ label: "تعديل", route: "/editjobtitle/:id" }];
const handleSuccessAdd = () => {
    setRefreshKey((prev) => prev + 1); // إعادة جلب البيانات في TableComponent
  };
  const modifyRow = (row) => {
    let newRow = { ...row };
    newRow.type = row.type == 0 ? "مكافات" : "خصومات";
    newRow.amounttype = row.amounttype == 0 ? "الايام" : "المال";
    return newRow;
  }
  return (
    // loading ? <TestPreLoader /> :
    <>
      {/* <HRreports activeTab="discountsreport" /> */}
      <div className="hrReports-tabel">
        {/* <CustomTable
          title="تقارير المكافات و الخصومات"
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          onDownload={handleDownload}
          columns={columns1}
          data={rows.map((row) => ({
            id: row.id,
            name: row.employee.name,
            type: row.type == 0 ? "مكافات" : "خصومات",
            reason: row.reason ,
            date: row.date,
            amounttype: row.amounttype == 0 ? "الايام" : "المال",
            amount: row.amount,
          }))}
          dropdownOptions={dropdownOptions1}
        />{" "} */}
        <TableComponent
        addBtn={true}
        onAddClick={() => setShowAddModal(true)}
          apiUrl="/salaryactions"
          columns={columns1}
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          title="تقارير المكافات و الخصومات"
          onDownload={handleDownload}
          dropdownOptions={dropdownOptions1}
          search
          transformRowFn={modifyRow}
        />

        <DiscountsModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        onSuccess={handleSuccessAdd}
      />
      </div>
    </>
  );
}

export default DeductionReport;
