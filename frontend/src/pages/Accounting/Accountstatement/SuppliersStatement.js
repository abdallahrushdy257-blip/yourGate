import TableComponent from "../../../components/TableComponent";
import Accountstatement from "./Accountstatement";

const columns = [
    { key: "name", name: "الإسم" },
    { key: "invoicenumber", name: "رقم الفاتورة" },
    { key: "date", name: "التاريخ" },
    { key: "paymenttype", name: "نوع العملية" },
    { key: "amount", name: "القيمة" },
];


function SuppliersStatement() {
    return (
        <>
            <Accountstatement />
            <div className="Accountstatement-table">
                <TableComponent columns={columns} apiUrl={`accountstatement/vendors`} search={true} />
            </div>
        </>
    )
}

export default SuppliersStatement;
