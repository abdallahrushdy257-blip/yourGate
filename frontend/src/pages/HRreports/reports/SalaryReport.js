import { useEffect, useState } from "react";
import CustomTable from "../../../components/CustomTable";
import "../hrreports.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import HRreports from "../HRreports";
import API from "../../../api/axiosConfig";
import TestPreLoader from "../../TestPreLoader/TestPreLoader";
import TableComponent from "../../../components/TableComponent";

const SalaryReport = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);
  // useEffect(() => {
  //   const getSalary = async () => {
  //     try {
  //       const response = await API.get("/salary");
  //       const data = await response;
  //       console.log(data.data);
  //       setRows(data.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error(error);
  //       setError(error.response.data.errors);
  //       setMessage(error.response.data.message);
  //     }
  //   };
  //   getSalary();
  // }, []);
  const handleDownload = (selectedRows) => {
    let activeRows, activeColumns;
    activeRows = rows;
    activeColumns = columns;
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

  const columns = [
    // { name: "", key: "idd" },
    { name: "إسم الموظف", key: "name" },
    { name: " الراتب", key: "basic" },
    { name: " الاستقطاعات", key: "socialinsurance" },
    { name: "الراتب اليومي", key: "salarybyday" },
    // { name: "", key: "actions" },
  ];

  const dropdownOptions = [

  ];
  return (
    // loading ? (
    //   <TestPreLoader />
    // ) : (
    <>
      <HRreports activeTab="salaryreport" />
      <div className="hrReports-tabel">
        {/* <CustomTable
            titleIcon={<FontAwesomeIcon icon={faTable} />}
            title="مسيرات الرواتب"
            onDownload={handleDownload}
            columns={columns}
            data={rows.map((row, index) => ({
              id: index + 1,
              name: row.employee.name,
              salay: (row.basic + row.allowance + row.addition + row.incentive).toFixed(2),
              negative: (row.socialinsurance + row.healthinsurance + row.tax).toFixed(2),
              type: row.type == 1 ? 'نقدي' : 'شبكة',
              salaryperday: (row.salarybyday).toFixed(2),
            }))}
            dropdownOptions={dropdownOptions}
          />{" "} */}
        <TableComponent
          apiUrl="/salary"
          columns={columns}
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          title="مسيرات الرواتب"
          dropdownOptions={dropdownOptions}
          // search={false}
          // searchTextProp={false}
          // searchDate={false}
        />
      </div>
    </>
  )




};

export default SalaryReport;