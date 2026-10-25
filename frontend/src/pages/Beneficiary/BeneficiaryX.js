import React, { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import "../CaseDetails/CaseDetails.css";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import TableComponent from "../../components/TableComponent";

function BeneficiaryX(props) {

    const columns = [
        { name: "إسم المستفيد", key: "name" },
        { name: "الحالة", key: "status_string" },
        { name: "السبب", key: "note" },
        { name: "", key: "actions" },
    ];

    const dummyData = [
  {
    id: 1,
    name: "أحمد محمد",
    status_string: "مقبول",
    note: "مستحق للدعم",
  },
  {
    id: 2,
    name: "سارة علي",
    status_string: "قيد المراجعة",
    note: "في انتظار استكمال المستندات",
  },
  {
    id: 3,
    name: "محمد خالد",
    status_string: "مرفوض",
    note: "عدم استيفاء الشروط",
  },
  {
    id: 4,
    name: "ريم عبدالله",
    status_string: "مقبول",
    note: "تم اعتماد الطلب",
  },
  {
    id: 5,
    name: "يوسف أحمد",
    status_string: "قيد المراجعة",
    note: "جارٍ التحقق من البيانات",
  },
  {
    id: 6,
    name: "منى حسن",
    status_string: "مرفوض",
    note: "البيانات غير مكتملة",
  },
  {
    id: 7,
    name: "خالد إبراهيم",
    status_string: "مقبول",
    note: "مستفيد من البرنامج",
  },
  {
    id: 8,
    name: "هبة محمود",
    status_string: "قيد المراجعة",
    note: "بانتظار زيارة ميدانية",
  },
  {
    id: 9,
    name: "طارق السيد",
    status_string: "مقبول",
    note: "تم صرف المساعدة",
  },
  {
    id: 10,
    name: "نجلاء مصطفى",
    status_string: "مرفوض",
    note: "تجاوز الحد المسموح للدخل",
  },
];
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([]);



    const dropdownOptions = [
         { label: "دراسة حالة", route: "/casestudy/:id" },
    ];


    const handleDownload = (selectedRows) => {
        const selectedData = rows.filter((row) => selectedRows.includes(row.id));
        if (selectedData.length === 0) {
            alert("Please select at least one row.");
            return;
        }

        const csvHeader = columns
            .filter((col) => col.key !== "actions")
            .map((col) => col.name)
            .join(",");

        const csvRows = selectedData.map((row) =>
            columns
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

    // useEffect(() => {
    //     getHumanCases();
    // }, []);
  
    return (
        
        <>
            <div className="printcasedata-container">

               

                <TableComponent
                            apiUrl="/humancases/rejected"
                            columns={columns}
                            title="تقرير المستبعدون"
                            titleIcon={<FontAwesomeIcon icon={faReceipt} />}
                            dropdownOptions = {dropdownOptions}
                            searchTextProp={true}
                            searchDate={false}
                            data={dummyData}
                          />
            </div>
        </>
    );
}

export default BeneficiaryX;
