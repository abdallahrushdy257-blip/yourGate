import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "../CaseDetails/CaseDetails.css";
import TableComponent from "../../components/TableComponent";

function EndowmentSammary(params) {

    const columns = [
        { name: "اسم الوقف", key: "name" },
        { name: "تاريخ الصك", key: "date" },
        { name: "الحالة", key: "status_string" },
        { name: "النوع", key: "type" },
        { name: "إسم مسؤول الوقف", key: "empname" },
        { name: "", key: "actions" },
    ];

    const dropdownOptions = [
        { label: "تعديل", route: "/editEndowments/:id" },
    ];


    return (
        <>
            <div className="printcasedata-container">

                <TableComponent
                    apiUrl="/endowments"
                    columns={columns}
                    title="ملخص الوقف"
                    titleIcon={<FontAwesomeIcon icon={faLocationDot} />}
                    dropdownOptions={dropdownOptions}
                />
            </div>
        </>
    );
}
export default EndowmentSammary
