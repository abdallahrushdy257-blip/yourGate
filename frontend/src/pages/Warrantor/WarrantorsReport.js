import React, { useState, useEffect } from "react";
import CustomTable from "../../components/CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import API from "../../api/axiosConfig";
import TableComponent from "../../components/TableComponent";

function WarrantorsReport(props) {
    const columns = [
        { name: "إسم الكفيل", key: "wname" },
        { name: "اسم المستفيد", key: "hcname" },
        { name: "قيمة التبرع", key: "amount" },
        { name: "", key: "actions" },
    ];

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({});

    // const getDonations = async () => {
    //     try {
    //         const res = await API.get(`/shoptransaction/case/totalrecieved`);
    //         const data = await res;

    //         if (data.status === 200) {
    //             setRows(data.data);
    //             setLoading(false);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         setError(error.response.data.errors);
    //         setLoading(false);
    //     }
    // };

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
        {
            label: "عرض القرض", action: (id, record) => {
                if (record.status !== 1) {
                    alert("لا يمكن عرض المدفوعات حتى تتم الموافقة على القرض للموافقة برجاء الذهاب الى قسم القروض و الاقساط");
                } else {
                    navigate(`/loanView/${id}`);
                }
            } // this api TBA will show loan.
        },
        { label: "بيانات المدفوعات", route: `/paymentdata/:id` },

    ];


    return (
        <>
            <div className="printcasedata-container">

                <TableComponent
                    apiUrl="/loans/cases" // this api TBA
                    columns={columns}
                    title="مدفوعات الكُفَلاءُ"
                    titleIcon={<FontAwesomeIcon icon={faPrint} />}
                    dropdownOptions={dropdownOptions}
                    searchDate={false}
                />
            </div>
        </>
    );
}

export default WarrantorsReport;
