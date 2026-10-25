import "../hrreports.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import HRreports from "../HRreports";
import { useState } from "react";
import TableComponent from "../../../components/TableComponent";

function VolunterReport() {
  const columns6 = [
    { name: "إسم المتطوع", key: "name" },
    { name: "رقم الهوية", key: "identification_number" },
    { name: "رقم الجوال", key: "phone" },
    { name: "تاريخ التعيين", key: "dateofhire" },
    { name: " نوع التطوع", key: "type" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions6 = [
    { label: "تعديل بيانات المتطوع ", route: "/editvolunteer/:id" },
    { label: " سند صرف ", route: "/volunteersVoucher/:id" },
    { label: " شهادة المتطوعين", route: "/volunteercertificate/:id" },
    { label: " حذف المتطوع", route: "/volunteerWorkHours/:id" },
  ];

  return (
    <>
      <HRreports activeTab="employeereport" />

      <div className="hrReports-tabel">
        <TableComponent
          apiUrl="/volunteers"
          columns={columns6}
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          title="تقارير المتطوعين"
          dropdownOptions={dropdownOptions6}
          searchDate={false}
        />
      </div>
    </>
  );
}

export default VolunterReport;
