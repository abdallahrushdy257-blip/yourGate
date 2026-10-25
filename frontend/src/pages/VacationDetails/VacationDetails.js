import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./VacationDetails.css";
import { faList } from "@fortawesome/free-solid-svg-icons";
import CustomTable from "../../components/CustomTable";
import { useState } from "react";

function VacationDetails() {
  const VacationDetailscolumns = [
    { name: "", key: "id", type: "hidden" },
    { name: "نوع الإجازة", key: "type", type: "text" },
    { name: "عدد أيام الإجازة", key: "duration", type: "number" },
  ];

  const [vacationDetailsrows, setVacationDetailsRows] = useState([
    {
      id: 1,
      type: "مرضية",
      duration: "10 أيام",
    },
    {
      id: 2,
      type: "سنوية",
      duration: "15 أيام",
    },
    {
      id: 3,
      type: "أمومة",
      duration: "30 أيام",
    },
    {
      id: 4,
      type: "إدارية",
      duration: "5 أيام",
    },
  ]);

  // const handleDownload = (selectedRows) => {
  //   const selectedData = rows.filter((row) => selectedRows.includes(row.id));
  //   if (selectedData.length === 0) {
  //     alert("Please select at least one row.");
  //     return;
  //   }

  //   const csvHeader = columns
  //     .filter((col) => col.key !== "actions")
  //     .map((col) => col.name)
  //     .join(",");

  //   const csvRows = selectedData.map((row) =>
  //     columns
  //       .filter((col) => col.key !== "actions")
  //       .map((col) => `"${row[col.key] || ""}"`)
  //       .join(",")
  //   );

  //   const csvContent = `${csvHeader}\n${csvRows.join("\n")}`;

  //   const bom = "\uFEFF";
  //   const finalContent = bom + csvContent;

  //   const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" });
  //   const link = document.createElement("a");
  //   const url = URL.createObjectURL(blob);
  //   link.setAttribute("href", url);
  //   link.setAttribute("download", "selected_rows_report.csv");
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  return (
    <>
      <div className="VacationDetails">
        <Title
          title="تفاصيل الإجازات"
          icon={<FontAwesomeIcon icon={faList} />}
        />
        <div className="VacationDetailsTabel">
          <CustomTable
            columns={VacationDetailscolumns}
            data={vacationDetailsrows}
            // onDownload={handleDownload}
            add={true}
          />
        </div>
      </div>
    </>
  );
}

export default VacationDetails;
