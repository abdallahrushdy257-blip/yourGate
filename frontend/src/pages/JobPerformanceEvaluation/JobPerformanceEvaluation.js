import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../components/TableComponent";
import JobPerformanceEvaluationModal from "./JobPerformanceEvaluationModal";
import "./jobPerformanceEvaluation.css";

function JobPerformanceEvaluation() {
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { name: "إسم الموظف", key: "employee" },
    { name: "التاريخ", key: "date" },
    { name: "الهدف من التقييم", key: "reason" },
    { name: "التقدير", key: "average_grade" },
    { name: "الإجراءات", key: "actions" },
  ];

  const modifyRow = (row) => {
    let newRow = { ...row };
    newRow.employee = row.employee ? row.employee.name : "";
    newRow.average_grade = row.average_grade ? row.average_grade.toFixed(2) : "0.00";
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
        : "غير محدد";
    return newRow;
  };

  const dropdownOptions = [
    {
      label: "عرض التقييم",
      route: "/kpievaluation/:id",
    },
  ];

  const dummyData = [
    {
      id: 1,
      employee: { name: "أحمد السالم" },
      date: "2026-07-20",
      reason: 1,
      average_grade: 4.5,
      description: "تقييم دوري",
    },
    {
      id: 2,
      employee: { name: "سارة محمد" },
      date: "2026-07-15",
      reason: 2,
      average_grade: 3.8,
      description: "فترة تجربة",
    },
  ];

  return (
    <div className="JobPerformanceEvaluation">
      <TableComponent
        apiUrl={"evaluation/kpireport"}
        data={dummyData}
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
        handleClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default JobPerformanceEvaluation;
