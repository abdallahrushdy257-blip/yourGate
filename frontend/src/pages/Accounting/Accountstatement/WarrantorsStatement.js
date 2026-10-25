import TableComponent from "../../../components/TableComponent";
import Accountstatement from "./Accountstatement";

const columns = [
    { key: "name", name: "الإسم" },
    { key: "invoicenumber", name: "رقم الفاتورة" },
    { key: "date", name: "التاريخ" },
    { key: "amount", name: "القيمة" },
];



function WarrantorsStatement() {
    return (
        <>
            <Accountstatement />
            <div className="Accountstatement-table">
            <TableComponent columns={columns} apiUrl={`accountstatement/affiliates`} search={true} />
            </div>
        </>
    )

}

export default WarrantorsStatement;
