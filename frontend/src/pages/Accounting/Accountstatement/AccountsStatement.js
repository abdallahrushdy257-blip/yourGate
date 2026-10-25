import CustomTable from "../../../components/CustomTable";
import Accountstatement from "./Accountstatement";

const columns = [
    { key: "id", name: "" },
    { key: "account", name: "الإسم" },
    { key: "invoisnum", name: "رقم الفاتورة" },
    { key: "numtranzaction", name: "رقم القيد" },
    { key: "date", name: "التاريخ" },
    { key: "value", name: "القيمة" },
];

const rows = [
    //{ id: 4, account: "حساب 1", invoisnum: "INV004", numtranzaction: "TRX004", date: "2024-03-13", value: "500" },
];

function AccountsStatement() {
    return (
        <>
            <Accountstatement />
            <div className="Accountstatement-table">
                < CustomTable columns={columns} data={rows} />
            </div>
        </>
    )
}

export default AccountsStatement;
