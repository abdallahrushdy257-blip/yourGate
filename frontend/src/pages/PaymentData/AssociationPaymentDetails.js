import React, { useState , useEffect } from "react";
import TableComponent from "../../components/TableComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useNavigate , useParams } from "react-router";

function AssociationPaymentDetails(props) {
    const columns = [
        { name: "التاريخ", key: "date" },
        { name: "نوع التحويل", key: "transaction_type_string" },
        { name: "رقم السند", key: "invoicenumber" },
        { name: "القيمة", key: "amount" },
        { name: "", key: "actions" },
    ];

    const [rows, setRows] = useState([]);
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error , setError] = useState({});

    // const getDonations = async () => {
    //     try {
    //         const response = await API.get(`/receiptorg/assembly/${id}`);
    //         setRows(response.data);
    //         setLoading(false);
    //     } catch (error) {
    //         console.error(error);
    //         setError(error.response.data.errors);
    //     }
    // };

    // useEffect(() => {
    //     getDonations();
    // }, []);

    const handleDownload = (selectedRows) => {
        const selectedData = rows.filter((row) => selectedRows.includes(row.id));
        if (selectedData.length === 0) {
            alert("Please select at least one row.");
            return;
        }

        const csvHeader = columns
            .filter((col) => col.key !== "actions")
            .map((col) => col.name)
            .join(",");

        const csvRows = selectedData.map((row) =>
            columns
                .filter((col) => col.key !== "actions")
                .map((col) => `"${row[col.key] || ""}"`)
                .join(",")
        );

        const csvContent = `${csvHeader}\n${csvRows.join("\n")}`;

        const bom = "\uFEFF";
        const finalContent = bom + csvContent;

        const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "selected_rows_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



   const dropdownOptions = [
        { label: "عرض", route: "/moneyreceiptreports/:id" },
    ];
    
    return (
        <>
            <div className="printcasedata-container">
                {/* <CustomTable
                    title={`تفاصيل الاشتراكات`}
                    titleIcon={<FontAwesomeIcon icon={faPrint} />}
                    columns={columns}
                    data={rows.map((row , index) => ({
                        date: row.date,
                        transactiontype: transactiontype(row.transactiontype),
                        invoicenumber: row.invoicenumber,
                        entryNumber: row.entryNumber,
                        totalCost: row.amount,
                        id:id
                    }))}
                    onDownload={handleDownload}
                    dropdownOptions={dropdownOptions}
                    total={true}
                    phoneSearch={true}
                /> */}
                <TableComponent
                    apiUrl={`/receiptorg/assembly/${id}`}
                    columns={columns}
                    titleIcon={<FontAwesomeIcon icon={faPrint} />}
                    title={`تفاصيل الاشتراكات`}
                    onDownload={handleDownload}
                    dropdownOptions={dropdownOptions}
                    total={true}
                   searchDate={true}
                   searchTextProp={false}
                    />
            </div>
        </>
    );
}

export default AssociationPaymentDetails;
