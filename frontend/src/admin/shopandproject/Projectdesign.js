import React, { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../components/TableComponent";
import AdminLayout from "../../layouts/AdminLayouts";


function Projectdesign(props) {

    const columns = [
        { name: "إسم الجمعية", key: "name" },
        { name: "  اسم الحالة  ", key: "title" },
        { name: "  اسم التصميم", key: "note" },
        { name: " وصف التصميم", key: "description" },
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
                    apiUrl="/organization/request/project/design"
                    columns={columns}
                    title="تقرير  تصميم المشاريع"
                    titleIcon={<FontAwesomeIcon icon={faReceipt} />}
                    searchDate={false}
                    transformRowFn = {modifyRow}
                />
            </div>
        </>
    );
}

export default Projectdesign;
