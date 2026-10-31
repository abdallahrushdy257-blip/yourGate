import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../components/TableComponent";
import { toLocal } from "../../Utils/toLocal";

function HcVendorReport() {
    const columns = [
        { name: "إسم المستفيد", key: "humancase" },
        { name: "إسم المورد", key: "vendor" },
        { name: "المبلغ ", key: "amount_formatted" },
        { name: "الحالة ", key: "status_badge" },
        { name: "الكود ", key: "code" },
        { name: "تاريخ الصلاحية ", key: "expiration_date" },
    ];

    const modifyRow = (row) => ({
        ...row,
        amount_formatted: `${toLocal(row.amount)} ر.س`,
        status_badge: row.status === 1 
            ? '<span class="badge bg-success">نشط / ساري</span>' 
            : '<span class="badge bg-secondary">غير نشط / منتهي</span>',
    });

    return (
        <div className="printcasedata-container">
            <TableComponent
                apiUrl="/humancasevendor/act"
                columns={columns}
                title="تقرير مدفوعات الموردين"
                titleIcon={<FontAwesomeIcon icon={faPrint} />}
                transformRowFn={modifyRow}
                searchTextProp={true}
                searchDate={false}
            />
        </div>
    );
}

export default HcVendorReport;
