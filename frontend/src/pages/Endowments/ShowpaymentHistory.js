import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableComponent from "../../components/TableComponent";
import { faDollarSign, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "../CaseDetails/CaseDetails.css";
import { useParams } from "react-router";


function ShowpaymentHistory(params) {

    const columns = [
        { name: "التاريخ ", key: "date" },
        { name: "النوع", key: "transaction_type_string" },
        { name: "نوع السند", key: "type_string" },
        { name: "رقم السند", key: "invoice_number" },
        { name: "قيمة السند", key: "amount" },
        { name: "#" , key: "actions" },
    ];

    const {id} = useParams();



    //TODO: PRint for this payments

     const dropdownOptions = [
        { label: "عرض", route: "/viewendowments/:id" },
    ];


    return (
        <>
            <div className="printcasedata-container">

          
                <TableComponent
                    title="مستحقات الدفعات"
                    titleIcon={<FontAwesomeIcon icon={faDollarSign} />}
                    columns={columns}
                    apiUrl={`shoptransaction/endowments/${id}`}
                    search={true}
                    dropdownOptions={dropdownOptions}
                />
            </div>


        </>
    );
}
export default ShowpaymentHistory
