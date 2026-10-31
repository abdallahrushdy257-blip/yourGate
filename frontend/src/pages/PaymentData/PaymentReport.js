import React, { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import TableComponent from "../../components/TableComponent";
import { toLocal } from "../../Utils/toLocal";

function PaymentReport(props) {
    const columns = [
        { name: "إسم المستفيد", key: "human_case_name" },
        { name: "اجمالي المدفوعات", key: "amount" },
        { name: "", key: "actions" },
    ];


    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([]);
    const [message, setMessage] = useState([]);
    const navigate = useNavigate();

    // const getPaymentReport = async () => {
    //     try {
    //         const res = await API.get("/shoptransaction/case/totalpaid");
    //         const data = await res;
    //         if (data.status === 200) {
    //             setRows(data.data);
    //             setLoading(false);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         setError(error.response.data.errors);
    //         setMessage(error.response.data.message);
    //     }
    // };

    // useEffect(() => {
    //     getPaymentReport();
    // }, []);
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
        { label: "تفاصيل المدفوعات", route: "/paymentDetails/:id" },
    ];

    const modifyRow = (row) => {
        let newRow = { ...row };
        newRow.amount = toLocal(row.amount) + " ريال";
        return newRow;
    };
    return (
        <>
            <div className="printcasedata-container">

                <TableComponent
                    apiUrl="/shoptransaction/case/totalpaid"
                    columns={columns}
                    title="تقرير مدفوعات المستفيدون"
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

export default PaymentReport;
