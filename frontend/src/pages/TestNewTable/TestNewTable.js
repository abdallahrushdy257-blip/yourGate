import React from "react";
import "../CaseDetails/CaseDetails.css";
import TableComponent from "../../components/TableComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

function TestNewTable() {

  const modifyRow = (row) => {
    let newRow = { ...row };

    if (newRow.code.length < 5) {
      newRow.name = `<span class=" bg-danger p-1 rounded">${newRow.name}</span>`;
    }
    // newRow.is_active = `<span class=" bg-danger p-1 rounded">${newRow.code + 1}</span>`;
    newRow.is_active = newRow.is_active ? "YUPYYYYYY" : "Nope";
    return newRow;
  };

  const columns = [
    { name: "الكود", key: "code" },
    { name: "الإسم", key: "name" },
    { name: "الوصف", key: "description" },
    { name: "التاريخ", key: "created_at" },
    { name: "نشط", key: "is_active" },
  ];
  

  return (
    <div className="printcasedata-container">
      <TableComponent
        apiUrl="/test"
        columns={columns}
        title="تجربة"
        titleIcon={<FontAwesomeIcon icon={faWarning} />}
        transformRowFn={modifyRow}
      />
    </div>
  );
}

export default TestNewTable;
