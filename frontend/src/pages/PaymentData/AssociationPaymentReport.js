import React, { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import TableComponent from "../../components/TableComponent";
import { toLocal } from "../../Utils/toLocal";

function AssociationPaymentReport(props) {
    const columns = [
        { name: "إسم العضو", key: "name" },
        { name: " نوع العضوية", key: "status" },
        { name: "اجمالي المدفوعات", key: "amount" },
        { name: "", key: "actions" },
    ];

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([]);
    const [message, setMessage] = useState([]);
    const navigate = useNavigate();

    
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


    const dropdownOptions = [
        { label: "تفاصيل المدفوعات", route: "/associationpaymentDetails/:id" },
    ];
    const modifyRow = (row) => ({
        ...row,
        status: row.status === 1 ? "عضو مجلس إدارة" : "عضو جمعية عمومية",
        amount: `${toLocal(row.amount)} ر.س`,
    });
    return (
        <>
            <div className="printcasedata-container">
          
                <TableComponent
                            apiUrl="/receiptorg/assembly"
                            columns={columns}
                            title="مدفوعات الأعضاء"
                            titleIcon={<FontAwesomeIcon icon={faPrint} />}
                            dropdownOptions = {dropdownOptions}
                            transformRowFn={modifyRow}
                            searchTextProp={true}
                            searchDate={false}
                />
            </div>
        </>
    );
}

export default AssociationPaymentReport;
