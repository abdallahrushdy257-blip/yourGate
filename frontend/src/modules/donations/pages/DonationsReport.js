import React, { useState , useEffect } from "react";
import CustomTable from "../../../components/CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import API from "../../../api/axiosConfig";
import TableComponent from "../../../components/TableComponent";
import { toLocal } from "../../../Utils/toLocal";

function DonationsReport(props) {
    const columns = [
        { name: "إسم المانح", key: "donorname" },
        { name: "رقم الجوال", key: "donorphone" },
        { name: "قيمة التبرع", key: "amount" },
        { name: "", key: "actions" },
    ];

    const dummyData = [
  {
    id: 1,
    donorname: "أحمد محمد علي",
    donorphone: "0501234567",
    amount: 5000,
  },
  {
    id: 2,
    donorname: "محمد إبراهيم حسن",
    donorphone: "0502345678",
    amount: 2500,
  },
  {
    id: 3,
    donorname: "عبدالله صالح",
    donorphone: "0503456789",
    amount: 10000,
  },
  {
    id: 4,
    donorname: "خالد أحمد",
    donorphone: "0504567890",
    amount: 1200,
  },
  {
    id: 5,
    donorname: "سارة محمود",
    donorphone: "0505678901",
    amount: 7800,
  },
  {
    id: 6,
    donorname: "منى السيد",
    donorphone: "0506789012",
    amount: 3300,
  },
  {
    id: 7,
    donorname: "يوسف عبد الرحمن",
    donorphone: "0507890123",
    amount: 15000,
  },
  {
    id: 8,
    donorname: "ريم خالد",
    donorphone: "0508901234",
    amount: 950,
  },
  {
    id: 9,
    donorname: "طارق جمال",
    donorphone: "0509012345",
    amount: 4400,
  },
  {
    id: 10,
    donorname: "هبة علي",
    donorphone: "0501122334",
    amount: 6750,
  },
];

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({});

   
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
    const navigate = useNavigate();


    const dropdownOptions = [
        { label: "تفاصيل المدفوعات", route: "/donationDetails/:id" },
    ];
    

    const modifyRow = (row) => {
       let newRow = { ...row };
        newRow.amount = toLocal(row.amount) + " ريال";
        //newRow.donorphone = parse(row.donorphone);
        return newRow;
    }
 
    return (
        <>
            <div className="printcasedata-container">
                
                <TableComponent
                    apiUrl="/shoptransaction/case/totalrecieved"
                    columns={columns}
                    title="تقرير مدفوعات المانحون"
                    titleIcon={<FontAwesomeIcon icon={faPrint} />}
                    dropdownOptions={dropdownOptions}
                    transformRowFn={modifyRow}
                    searchTextProp={true}
                    searchDate={false}
                />
            </div>
        </>
    );
}

export default DonationsReport;
