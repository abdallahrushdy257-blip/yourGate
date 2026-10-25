import { useEffect, useState } from "react";
import CustomTable from "../../../components/CustomTable";
import TableComponent from "../../../components/TableComponent";
import "../hrreports.css";
// import Title from "../../components/title";
// import PrintHead from "../../components/PrintHead";
// import PrintFooter from "../../components/PrintFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faList, faTable } from "@fortawesome/free-solid-svg-icons";
// import { Dropdown } from "react-bootstrap";
// import HRreports from "../HRreports";


const KpiReport = () => {

  const columns = [
    { name: "إسم الموظف", key: "employee" },
    { name: "التاريخ", key: "date" },
    { name: "الهدف من التقييم", key: "reason" },
    { name: "التقدير", key: "average_grade" },
  ];

  const modifyRow = (row) => {
    let newRow = { ...row };
    newRow.employee = row.employee ? row.employee.name : "";
    newRow.average_grade = row.average_grade ? row.average_grade.toFixed(2) : "0.00";
    newRow.reason = row.reason == 1 ? "تقييم دوري" : row.reason == 2 ? "فترة تجربة" : row.reason == 3 ? " ترقية" : row.reason == 4 ? " علاوة" : row.reason == 5 ? (row.description || "أخرى") : "غير محدد";
    return newRow;
  }

  return (
    <>
      {/* <HRreports activeTab="kpireport" /> */}
      <div className="hrReports-tabel">
        {/* <CustomTable
          title="تقارير التقييمات"
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          onDownload={handleDownload}
          columns={columns}
          data={rows}
          dropdownOptions={dropdownOptions}
        />{" "} */}
        <TableComponent
          apiUrl={"evaluation/kpireport"}
          title="إدارة التقييمات"
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          columns={columns}
          transformRowFn={modifyRow}
        />
      </div>
    </>
  )
}


export default KpiReport