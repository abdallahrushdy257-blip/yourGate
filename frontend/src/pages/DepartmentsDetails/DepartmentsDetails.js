import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "../VacationDetails/VacationDetails.css";
import { faList } from "@fortawesome/free-solid-svg-icons";
import CustomTable from "../../components/CustomTable";
import { useState } from "react";

function DepartmentsDetails() {
  const DepartmentsDetailscolumns = [
    { name: "", key: "id", type: "hidden" },
    { name: "إسم القسم", key: "dapartmentname", type: "text" },
    { name: "إسم المدير", key: "mangername", type: "text" },
    { name: "وصف القسم", key: "desc", type: "text" },
  ];

  const [DepartmentsDetailsrows, setRows] = useState([
    {
      id: 1,
      dapartmentname: "Human Resources",
      mangername: "Ali Ahmed",
      desc: "Handles recruitment, employee relations, and training.",
    },
    {
      id: 2,
      dapartmentname: "Finance",
      mangername: "Fatima Khalid",
      desc: "Manages company budgets, payroll, and financial reporting.",
    },
    {
      id: 3,
      dapartmentname: "IT",
      mangername: "Mohammed Saleh",
      desc: "Responsible for technology infrastructure and support.",
    },
    {
      id: 4,
      dapartmentname: "Marketing",
      mangername: "Sara Youssef",
      desc: "Focuses on branding, advertising, and market research.",
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
          title="تفاصيل الاقسام"
          icon={<FontAwesomeIcon icon={faList} />}
        />
        <div className="VacationDetailsTabel">
          <CustomTable
            columns={DepartmentsDetailscolumns}
            data={DepartmentsDetailsrows}
            // onDownload={handleDownload}
            add={true}
          />
        </div>
      </div>
    </>
  );
}

export default DepartmentsDetails;
