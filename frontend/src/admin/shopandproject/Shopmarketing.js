import React, { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../components/TableComponent";
import AdminLayout from "../../layouts/AdminLayouts";


function Shopmarketing(props) {

    const columns = [
        { name: "إسم الجمعية", key: "name" },
        { name: "  اسم الحالة  ", key: "title" },
        { name: "  اسم التسويق", key: "note" },
        { name: " وصف التسويق", key: "description" },
        { name: " المرفقات  ", key: "upload" },
        { name: "   المرفقات 2", key: "upload2" },
        { name: "   الحالة", key: "status" },
    ];

  
    const modifyRow = (row) => {
        let modifiedRow = { ...row };
        modifiedRow.upload = row.upload == "" ? "" : `<a class="btn btn-primary" href="${row.upload}" target="_blank">عرض</a>`;
        modifiedRow.upload2 = row.upload2 == "" ? "" : `<a class="btn btn-primary" href="${row.upload2}" target="_blank">عرض</a>`;
        return modifiedRow;
    };
  

    return (
        <>
        <AdminLayout />
            <div className="printcasedata-container">

                <TableComponent
                    apiUrl="/organization/request/shop/marketing"
                    columns={columns}
                    title="تقرير  ادارة الحالات"
                    titleIcon={<FontAwesomeIcon icon={faReceipt} />}
                    searchDate={false}
                    transformRowFn = {modifyRow}
                />
            </div>
        </>
    );
}

export default Shopmarketing;
