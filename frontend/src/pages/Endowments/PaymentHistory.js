import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableComponent from "../../components/TableComponent";
import { faCalendar, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "../CaseDetails/CaseDetails.css";
import { useState } from "react";
import Title from "../../components/title";


function PaymentHistory(params) {

    const columns = [
        { name: "اسم الوقف", key: "name" },
        { name: "تاريخ الوقف", key: "date" },
        { name: "التكلفة التشغيلية السنوية", key: "annualcost" },
        { name: "القيمة المتبقية", key: "remainingvalue" },
        { name: "الريع السنوي", key: "profit" },
        { name: " اجمالي المدفوعات", key: "total" },
        { name: "", key: "actions" },
    ];





    const dropdownOptions = [
        { label: "عرض", route: "/showpaymentHistory/:id" },
    ];




    return (
        <>
            <div className="printcasedata-container">

                <Title
                    title="تاريخ المدفوعات"
                    icon={<FontAwesomeIcon icon={faCalendar} />}
                />
                <TableComponent
                    apiUrl={"endowments/totalpaid"}
                    columns={columns}
                    searchDate={false}
                    refreshData={true}
                    dropdownOptions={dropdownOptions}
                />
            </div>
        </>
    );
}
export default PaymentHistory
