import React, { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../components/TableComponent";
import AdminLayout from "../../layouts/AdminLayouts";


function Representatives(props) {

    const columns = [
        { name: "إسم الجمعية", key: "organization_name" },
        { name: "  اسم الممثل  ", key: "name" },
        { name: "  العنوان", key: "address" },
        { name: "رقم الجوال", key: "phone" },
        { name: "   البريد الالكتروني", key: "email" },
        { name: "   الحالة", key: "organization_status" },
    ];

  
    const modifyRow = (row) => {
        let modifiedRow = { ...row };
        modifiedRow.organization_status = row.organization_status == 1 ? "مفعل" : "غير مفعل";
        return modifiedRow;
    };
  

    return (
        <>
        <AdminLayout />
            <div className="printcasedata-container">

                <TableComponent
                    apiUrl="/organization/representatives"
                    columns={columns}
                    title="تقرير ممثلي الجمعيات"
                    titleIcon={<FontAwesomeIcon icon={faReceipt} />}
                    searchDate={false}
                    placeholderSearch='إسم الجمعية / الممثل'
                    transformRowFn = {modifyRow}
                />
            </div>
        </>
    );
}

export default Representatives;
