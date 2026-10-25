import React, { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import TableComponent from "../../components/TableComponent";

function HcVendorReport() {
    const columns = [
        { name: "إسم المستفيد", key: "humancase" },
        { name: "إسم المورد", key: "vendor" },
        { name: "المبلغ ", key: "amount" },
        { name: "الحالة ", key: "status" },
        { name: "الكود ", key: "code" },
        { name: "تاريخ الصلاحية ", key: "expiration_date" },
    ];


 

    const dummyData = [
  {
    id: 1,
    humancase: "أحمد محمد علي",
    vendor: "مستشفى الأمل",
    amount: 5000,
    status: 1,
    code: "CODE001",
    expiration_date: "2025-12-31",
  },
  {
    id: 2,
    humancase: "فاطمة الزهراء",
    vendor: "مركز النور",
    amount: 2500,
    status: 0,
    code: "CODE002",
    expiration_date: "2025-11-30",
  },
  {
    id: 3,
    humancase: "خالد إبراهيم",
    vendor: "مستشفى السلام",
    amount: 10000,
    status: 1,
    code: "CODE003",
    expiration_date: "2025-10-31",
  },
  {
    id: 4,
    humancase: "سارة عبد الرحمن",
    vendor: "مركز الشفاء",
    amount: 1200,
    status: 1,
    code: "CODE004",
    expiration_date: "2025-12-31",
  },
  {
    id: 5,
    humancase: "يوسف طارق",
    vendor: "مستشفى الأمل",
    amount: 7800,
    status: 0,
    code: "CODE005",
    expiration_date: "2025-11-30",
  },
  {
    id: 6,
    humancase: "مريم جمال",
    vendor: "مركز النور",
    amount: 3300,
    status: 1,
    code: "CODE006",
    expiration_date: "2025-10-31",
  },
  {
    id: 7,
    humancase: "عمر خالد",
    vendor: "مستشفى السلام",
    amount: 15000,
    status: 1,
    code: "CODE007",
    expiration_date: "2025-12-31",
  },
  {
    id: 8,
    humancase: "نور محمد",
    vendor: "مركز الشفاء",
    amount: 4500,
    status: 0,
    code: "CODE008",
    expiration_date: "2025-11-30",
  },
  {
    id: 9,
    humancase: "طارق كمال",
    vendor: "مستشفى الأمل",
    amount: 8200,
    status: 1,
    code: "CODE009",
    expiration_date: "2025-10-31",
  },
  {
    id: 10,
    humancase: "ليلى أحمد",
    vendor: "مركز النور",
    amount: 6700,
    status: 1,
    code: "CODE010",
    expiration_date: "2025-12-31",
  },
];
   

 
    return (
        <>
            <div className="printcasedata-container">

                <TableComponent
                    apiUrl="/humancasevendor/act"
                    columns={columns}
                    title="تقرير مدفوعات الموردين"
                    titleIcon={<FontAwesomeIcon icon={faPrint} />}
                    searchTextProp={true}
                    searchDate={false}
                    data={dummyData}
                />
            </div>
        </>
    );
}

export default HcVendorReport;
