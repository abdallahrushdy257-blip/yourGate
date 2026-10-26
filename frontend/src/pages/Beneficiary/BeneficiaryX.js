import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import "../CaseDetails/CaseDetails.css";
import TableComponent from "../../components/TableComponent";
import BeneficiarySubModal from "./BeneficiarySubModal";

function BeneficiaryX(props) {
  const columns = [
    { name: "إسم المستفيد", key: "name" },
    { name: "الحالة الإجتماعية", key: "social_status_string" },
    { name: "دراسة الحالة", key: "case_status_badge" },
    { name: "السبب", key: "note" },
    { name: "", key: "actions" },
  ];

  const transformRow = (row) => {
    const badge = `<span style="background:#ffebee;color:#c62828;border:1px solid #ef9a9a;padding:4px 12px;border-radius:14px;font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:4px;">✕ ${row.case_status_string || "مرفوض"}</span>`;
    return {
      ...row,
      social_status_string: row.social_status_string || row.status_string || "-",
      case_status_badge: badge,
      case_status_string: badge,
    };
  };

  const [activePopup, setActivePopup] = useState(null);
  const [tableReloadKey, setTableReloadKey] = useState(0);

  const dropdownOptions = [
    {
      label: "عرض",
      route: "/beneficiary/view/:id",
    },
    {
      label: "دراسة حالة",
      action: (id, record) =>
        setActivePopup({
          type: "casestudy",
          id,
          record,
          title: "دراسة حالة",
        }),
    },
    {
      label: "البيانات البنكية",
      action: (id, record) =>
        setActivePopup({
          type: "bank",
          id,
          record,
          title: "البيانات البنكية",
        }),
    },
    {
      label: "المؤهل و الوظيفية",
      action: (id, record) =>
        setActivePopup({
          type: "qualification",
          id,
          record,
          title: "المؤهل و الوظيفية",
        }),
    },
    {
      label: "بيانات السكن",
      action: (id, record) =>
        setActivePopup({
          type: "housing",
          id,
          record,
          title: "بيانات السكن",
        }),
    },
    {
      label: "البيانات الصحية",
      action: (id, record) =>
        setActivePopup({
          type: "health",
          id,
          record,
          title: "البيانات الصحية",
        }),
    },
    {
      label: "بيانات التابعين",
      action: (id, record) =>
        setActivePopup({
          type: "dependents",
          id,
          record,
          title: "بيانات التابعين",
        }),
    },
    {
      label: "صفحة دراسة الحالة",
      route: "/casestudy/:id",
    },
  ];

  return (
    <>
      <div className="printcasedata-container">
        <TableComponent
          apiUrl="/humancases/rejected"
          columns={columns}
          transformRowFn={transformRow}
          title="تقرير المستبعدون"
          titleIcon={<FontAwesomeIcon icon={faReceipt} />}
          placeholderSearch="بحث بإسم المستفيد أو السبب..."
          dropdownOptions={dropdownOptions}
          triggerReload={tableReloadKey}
          searchTextProp={true}
          searchDate={false}
        />
      </div>

      {activePopup && (
        <BeneficiarySubModal
          activePopup={activePopup}
          onClose={() => setActivePopup(null)}
          onSuccess={() => setTableReloadKey((prev) => prev + 1)}
        />
      )}
    </>
  );
}

export default BeneficiaryX;
