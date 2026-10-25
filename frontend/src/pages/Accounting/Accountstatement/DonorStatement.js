import TableComponent from "../../../components/TableComponent";
import Accountstatement from "./Accountstatement";

const columns = [
    { key: "name", name: "الإسم" },
    { key: "invoicenumber", name: "رقم الفاتورة" },
    { key: "date", name: "التاريخ" },
    { key: "amount", name: "القيمة" },
];



function DonorStatement() {
    return (
        <>
            <Accountstatement />
            <div className="Accountstatement-table">
            <TableComponent columns={columns} apiUrl={`accountstatement/donors`} search={true} />
            </div>
        </>
    )

}

export default DonorStatement;
