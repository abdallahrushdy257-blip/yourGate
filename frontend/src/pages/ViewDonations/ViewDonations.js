import React, { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router";
import Title from "../../components/title";


function ViewDonations(props) {
  const columns = [
    { name: "التاريخ", key: "date" },
    { name: "رقم الفاتورة", key: "invoice_number" },
    { name: "نوع التحصيل", key: "transaction_type_string" },
    { name: "قيمة التبرع", key: "amount" },
    { name: "", key: "actions" },
  ];


  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState([]);
  // const { id } = useParams();
  const { id } = useParams();
  const navigate = useNavigate();
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
    { label: "عرض السند", route: "/receiptVoucherView/:id" },
  ];
  // const gettransactions = async () => {
  //   try {
  //     const res = await API.get(`/shoptransaction/${id}`);
  //     const data = await res;
  //     setRows(data.data);
  //     setLoading(false);
  // }catch (error) {
  //     console.error(error);
  //     setMessage("حدث خطأ أثناء جلب البيانات");
  //   }
  // }
  // useEffect(() => {
  //   gettransactions();
  // }, []);


  return (
    <>
      <div className="printcasedata-container">

        {/* <Title title={`تبرعات `} icon={<FontAwesomeIcon icon={faPrint} />} /> */}
        <TableComponent
          apiUrl={`/shoptransaction/${id}`}
          columns={columns}
          title={"تبرعات"}
          //extraTitleField={"description"}
          search={false}
          refreshData={true}
          addButton={false}
          dropdownOptions={dropdownOptions}

        />


      </div>
    </>
  );
}

export default ViewDonations;
