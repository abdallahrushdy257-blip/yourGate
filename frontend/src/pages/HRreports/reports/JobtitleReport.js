import { useEffect, useState } from "react";
import CustomTable from "../../../components/CustomTable";
import "../hrreports.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faList, faTable } from "@fortawesome/free-solid-svg-icons";
// import { Dropdown } from "react-bootstrap";
import HRreports from "../HRreports";
import API from "../../../api/axiosConfig";
import TestPreLoader from "../../TestPreLoader/TestPreLoader";
import TableComponent from "../../../components/TableComponent";

function JobtitleReport() {

  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState([]);

  // const getJobtitle = async () => {
  //   try {
  //     const res = await API.get("/jobtitle");
  //     const data = await res;
  //     if (data.status === 200) {
  //       setRows(data.data);
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setError(error.response.data.errors);
  //     setMessage(error.response.data.message);
  //   }
  // };

  // useEffect(() => {
  //   getJobtitle();
  // }, []);
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
    { name: "المسمي الوظيفي", key: "title" },
    { name: "الوصف", key: "description" },
    { name: "المهام الوظيفية", key: "note" },
    { name: "المدير المباشر", key: "parent" },
    { name: " عدد ايام العمل", key: "workdayspermonth" },
    { name: " عدد ساعات العمل", key: "workhoursperday" },
    { name: "", key: "actions" },
  ];


  const dropdownOptions1 = [
    { label: "تعديل", route: "/editjobtitle/:id" },
  ];

  const modifyRow = (row) => {
    let newRow = {...row };
    newRow.parent = newRow.parent ? newRow.parent.title : "لا يوجد";
    return newRow;
  }

  return (
    // loading ? <TestPreLoader /> :
    <>
      <HRreports activeTab="jobtitlereport" />
      <div className="hrReports-tabel">
        {/* <CustomTable
            title="تقارير المسميات الوظيفية"
            titleIcon={<FontAwesomeIcon icon={faTable} />}
            onDownload={handleDownload}
            columns={columns1}
            data={rows.map((row) => ({
              id: row.id,
              title: row.title,
              description: row.description,
              parent: row.parent ? row.parent.title : "لا يوجد",
              note: row.note,
              workdays: row.workdayspermonth,
              workhours: row.workhoursperday,
            }))}
            dropdownOptions={dropdownOptions1}
          />{" "} */}

        <TableComponent
          apiUrl="/jobtitle"
          columns={columns1}
          title="تقارير المسميات الوظيفية"
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          dropdownOptions={dropdownOptions1}
          transformRowFn={modifyRow}
        // search={false}
        />
      </div>
    </>
  );
}

export default JobtitleReport;
