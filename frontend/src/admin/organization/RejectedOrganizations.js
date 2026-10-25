import React, { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../components/TableComponent";
import AdminLayout from "../../layouts/AdminLayouts";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router";


function RejectedOrganizations(props) {

    const columns = [
        { name: "إسم الجمعية", key: "name" },
        { name: " رقم التسجيل  ", key: "registration_number" },
      
        { name: "رقم الجوال", key: "phone" },
       
        { name: "  ممثل الجمعية", key: "representative" },
        { name: "   سبب الرفض", key: "note" },
        { name: "", key: "actions" },
    ];
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
     const [tableReloadKey, setTableReloadKey] = useState(Date.now());
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
        { label: "متابعة", route: "/organizationshow/:id" },
        { label: "قبول", action : (id) => { 
            try {
                const response = API.post(`/organization/${id}/update/status/approve`);
               
                    alert("تم قبول الجمعية");
                   setTableReloadKey(Date.now());
                   navigate("/organizations");
               
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    const errorMessage = error.response.data.message;
                    if (errorMessage === "Organization already approved") {
                        alert("الجمعية موافقة من قبل");
            }
                }
            }
         } },
    
    ];

    return (
        <>
        <AdminLayout />
            <div className="printcasedata-container">

                <TableComponent
                    apiUrl="/organization/rejected"
                    columns={columns}
                    title="تقرير الجمعيات  المرفوضه"
                    titleIcon={<FontAwesomeIcon icon={faReceipt} />}
                    dropdownOptions={dropdownOptions}
                    searchDate={false}
                    placeholderSearch='إسم الجمعية'
                    triggerReload={tableReloadKey}
                />
            </div>
        </>
    );
}

export default RejectedOrganizations;
