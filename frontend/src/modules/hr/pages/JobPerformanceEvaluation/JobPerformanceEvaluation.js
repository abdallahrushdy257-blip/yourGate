import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../../../components/TableComponent";
import JobPerformanceEvaluationModal from "./JobPerformanceEvaluationModal";
import "./jobPerformanceEvaluation.css";

function JobPerformanceEvaluation() {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { name: "إسم الموظف", key: "employee" },
    { name: "التاريخ", key: "date" },
    { name: "الهدف من التقييم", key: "reason" },
    { name: "التقدير", key: "average_grade" },
    { name: "الإجراءات", key: "actions" },
  ];

  const modifyRow = (row) => {
    let newRow = { ...row };
    newRow.employee = row.employee ? (typeof row.employee === "object" ? row.employee.name : row.employee) : "";
    newRow.average_grade = row.average_grade ? Number(row.average_grade).toFixed(2) : "0.00";
    newRow.reason =
      row.reason == 1
        ? "تقييم دوري"
        : row.reason == 2
        ? "فترة تجربة"
        : row.reason == 3
        ? " ترقية"
        : row.reason == 4
        ? " علاوة"
        : row.reason == 5
        ? row.description || "أخرى"
        : row.reason || "غير محدد";
    return newRow;
  };

  const dropdownOptions = [
    {
      label: "عرض التقييم",
      route: "/kpievaluation/:id",
    },
  ];

  return (
    <div className="JobPerformanceEvaluation">
      <TableComponent
        key={refreshKey}
        apiUrl={"evaluation/kpireport"}
        title="إدارة التقييمات"
        titleIcon={<FontAwesomeIcon icon={faTable} />}
        columns={columns}
        transformRowFn={modifyRow}
        addBtn={true}
        addBtnName="تقييم"
        onAddClick={() => setShowModal(true)}
        dropdownOptions={dropdownOptions}
      />

      <JobPerformanceEvaluationModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setRefreshKey((prev) => prev + 1);
        }}
      />
    </div>
  );
}

export default JobPerformanceEvaluation;
