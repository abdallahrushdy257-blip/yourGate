import React, { useEffect, useState } from "react";
import TableComponent from "../../../components/TableComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router";
import { toLocal } from "../../../Utils/toLocal";

function PaymentDetails(props) {
    const columns = [
        { name: "التاريخ", key: "date" },
        { name: "نوع التحويل", key: "transaction_type_string" },
        { name: "رقم السند", key: "invoice_number" },
        { name: "القيمة", key: "amount" },
        { name: "", key: "actions" },
    ];

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([]);
    const [message, setMessage] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

   

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
        { label: "عرض", route: "/moneytransferreports/:id" },
    ];
    return (
        <>
            <div className="printcasedata-container">

                <TableComponent
                    apiUrl={`/shoptransaction/case/paid/${id}`}
                    columns={columns}
                    titleIcon={<FontAwesomeIcon icon={faPrint} />}
                    title={`تفاصيل المدفوعات`}
                    onDownload={handleDownload}
                    dropdownOptions={dropdownOptions}
                    transformRowFn={(row) => ({
                        ...row,
                        amount: toLocal(row.amount) + " ر.س",
                    })}
                    total={true}
                    searchDate={true}
                    searchTextProp={false}
                />
            </div>
        </>
    );
}

export default PaymentDetails;
