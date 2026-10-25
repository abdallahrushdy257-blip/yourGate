import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomTable from "../../components/CustomTable";
import { faDollarSign, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "../CaseDetails/CaseDetails.css";
import { useState } from "react";
import TableComponent from "../../components/TableComponent";


function PaymentsDue(params) {


    const columns = [
        { name: "اسم الوقف", key: "name" },
        { name: "تاريخ الوقف", key: "date" },
        { name: "التكلفة التشغيلية السنوية", key: "yearlyfees" },
        { name: "القيمة المتبقية", key: "remainedfees" },
        { name: "الحالة", key: "status_string" },
        { name: "", key: "actions" },
    ];




    const dropdownOptions = [
        { label: "سند صرف", route: "/endowmentsVoucher/:id" },
        { label: "سند قبض", route: "/endowmentsreceiptvoucher/:id" },
    ];

    
  
    return (
        <>
            <div className="printcasedata-container">

         
                <TableComponent
                   apiUrl={"/endowments"}
                    columns={columns}
                    title="مستحقات الدفعات"
                    titleIcon={<FontAwesomeIcon icon={faDollarSign} />}
                    dropdownOptions={dropdownOptions}
                    search={true}
                />
            </div>
        </>
    );
}
export default PaymentsDue
