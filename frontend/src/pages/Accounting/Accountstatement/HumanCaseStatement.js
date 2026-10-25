import TableComponent from "../../../components/TableComponent";
import Accountstatement from "./Accountstatement";

const columns = [
    { key: "name", name: "الإسم" },
    { key: "invoicenumber", name: "رقم الفاتورة" },
    { key: "date", name: "التاريخ" },
    { key: "amount", name: "القيمة" },
];




function HumanCaseStatement() {
    return (
        <>
            <Accountstatement />
            <div className="Accountstatement-table">
                <TableComponent columns={columns} apiUrl={`accountstatement/humancases`} search={true} />
            </div>
        </>
    )

}

export default HumanCaseStatement;
