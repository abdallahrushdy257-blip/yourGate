import { useState } from "react";
import TableComponent from "../../../components/TableComponent";
import "../hrreports.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";

import HRreports from "../HRreports";
import { Modal } from "react-bootstrap";
import API from "../../../api/axiosConfig";

function LeaveReport() {
  // const handleDownload = (selectedRows) => {
  //   let activeRows, activeColumns;
  //   activeRows = rows;
  //   activeColumns = columns;
  //   const selectedData = activeRows.filter((row) =>
  //     selectedRows.includes(row.id)
  //   );
  //   if (selectedData.length === 0) {
  //     alert("Please select at least one row.");
  //     return;
  //   }

  //   const csvHeader = activeColumns
  //     .filter((col) => col.key !== "actions")
  //     .map((col) => col.name)
  //     .join(",");

  //   const csvRows = selectedData.map((row) =>
  //     activeColumns
  //       .filter((col) => col.key !== "actions")
  //       .map((col) => `"${row[col.key] || ""}"`)
  //       .join(",")
  //   );

  //   const csvContent = `${csvHeader}\n${csvRows.join("\n")}`;

  //   const bom = "\uFEFF";
  //   const finalContent = bom + csvContent;

  //   const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" });
  //   const link = document.createElement("a");
  //   const url = URL.createObjectURL(blob);
  //   link.setAttribute("href", url);
  //   link.setAttribute("download", "selected_rows_report.csv");
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const [id, setId] = useState(null);
  const [error, setError] = useState({});
  const [message, setMessage] = useState([]);

  const columns = [
    //{ name: "#", key: "id" },
    { name: "إسم الموظف", key: "name" },
    { name: " نوع", key: "vacationname" },
    { name: " من", key: "startdate" },
    { name: " الى", key: "enddate" },
    { name: " حالة الإجازة", key: "status" },
    { name: "", key: "actions" },
  ];

  const [showModel, setShowModel] = useState(false);
  const [status, setStatus] = useState("");
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  //const { id } = useParams();
  const dropdownOptions = [
    {
      label: "الرد عل الإجازة",
      action: (id, record) => {
        setShowModel(true);
        setId(id);
      },
    },
  ];

  const modifyRow = (row) => {
    let newRow = { ...row };
    const transStatus = (status) => {
      if (status === 0) {
        return "قيد الانتظار";
      } else if (status === 1) {
        return "قبول";
      } else if (status === 2) {
        return "رفض";
      }
    };
    newRow.status = transStatus(row.status);
    return newRow;
  };

  const handleDecission = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/vacationrequests/status/update`, {
        id: id,
        status: status,
      });
      const data = await res;
      if (data.status === 200) {
        //alert(data.data.message);
        setShowModel(false);
        setId(null);
        setTableReloadKey(Date.now());
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
      setId(null);
    }
    setShowModel(false);
  };
  return (
    <>
      <HRreports activeTab="vacationreport" />

      <div className="hrReports-tabel">
        <TableComponent
          apiUrl="/vacationrequests"
          columns={columns}
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          title="تقارير اجازات الموظفين"
          dropdownOptions={dropdownOptions}
          triggerReload={tableReloadKey}
          // search={false}
          transformRowFn={modifyRow}
        />
      </div>
      {showModel && (
        <Modal show={showModel} onHide={() => setShowModel(false)}>
          <Modal.Header closeButton>
            <Modal.Title>القرار</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <select
                  className="form-control"
                  id="decision"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ direction: "rtl" }}
                >
                  <option value="">اختر قرار</option>
                  <option value="1"> موافقة</option>
                  <option value="2"> رفض</option>
                </select>
                <input type="hidden" name="id" value={id} />
                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                  onClick={handleDecission}
                >
                  حفظ
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default LeaveReport;
