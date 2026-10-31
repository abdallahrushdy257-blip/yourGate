import React, { useEffect, useState } from "react";
import CustomTable from "../../../components/CustomTable";
import TableComponent from "../../../components/TableComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router";
import API from "../../../api/axiosConfig";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";
import Title from "../../../components/title";

function ViewDonationsProject(props) {
  const columns = [
    { name: "التاريخ", key: "date" },
    { name: "رقم الفاتورة", key: "invoicenumber" },
    { name: "نوع التحصيل", key: "transaction_type_string" },
    { name: "قيمة التبرع", key: "amount" },
    { name: "", key: "actions" },
  ];

  
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState([]);
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
    { label: " عرض السند", route: "/receiptVoucherViewproject/:id" },
  ];

  return (
    <>
      <div className="printcasedata-container">
       
        <TableComponent
          apiUrl={`/shoptransaction/${id}/payments`}
          columns={columns}
          extraTitleField= "name"
          title="تفاصيل تبرعات"
          titleIcon={<FontAwesomeIcon icon={faPrint} />}
          search={false}
          dropdownOptions={dropdownOptions}
        />
      </div>
      {/* <div className="printcasedata-container">

      </div> */}
        {/* <div className="printcasedata-container">
        
            <TableComponent 
            apiUrl={`/shoptransaction/${id}/payments`}
            columns={columns}
            title="تفاصيل التبرعات"
            titleIcon={<FontAwesomeIcon icon={faPrint} />}
            search={false}
            dropdownOptions={dropdownOptions}
          />
      </div> */}
    </>
  );
}

export default ViewDonationsProject;
