import TableComponent from "../../../components/TableComponent";
import Accountstatement from "./Accountstatement";

const columns = [
    { key: "name", name: "الإسم" },
    { key: "invoicenumber", name: "رقم الفاتورة" },
    { key: "date", name: "التاريخ" },
    { key: "amount", name: "القيمة" },
];



function ManagementMemberStatement() {
    return (
        <>
            <Accountstatement />
            <div className="Accountstatement-table">
                 <TableComponent columns={columns} apiUrl={`accountstatement/boards`} search={true} />
            </div>
        </>
    )

}

export default ManagementMemberStatement;
