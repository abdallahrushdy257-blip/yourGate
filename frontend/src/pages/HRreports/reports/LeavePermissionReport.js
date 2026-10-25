import { useState } from "react";
import TableComponent from "../../../components/TableComponent";
import "../hrreports.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
// import { Dropdown } from "react-bootstrap";
import HRreports from "../HRreports";
import { Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";

function LeavePermissionReport() {
  const handleDownload = (selectedRows) => {
    let activeRows, activeColumns;
    activeRows = rows;
    activeColumns = columns;
    const selectedData = activeRows.filter((row) =>
      selectedRows.includes(row.id),
    );
    if (selectedData.length === 0) {
      alert("Please select at least one row.");
      return;
    }

    const csvHeader = activeColumns
      .filter((col) => col.key !== "actions")
      .map((col) => col.name)
      .join(",");

    const csvRows = selectedData.map((row) =>
      activeColumns
        .filter((col) => col.key !== "actions")
        .map((col) => `"${row[col.key] || ""}"`)
        .join(","),
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

  const columns = [
    { name: " اسم الموظف", key: "name" },
    { name: " نوع الاذن", key: "type" },
    { name: " التاريخ", key: "date" },
    { name: " عدد الساعات", key: "hours" },
    { name: " حالة الإجازة", key: "status" },
    { name: " ملاحظات", key: "note" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions = [
    {
      label: "الرد على الاذن",
      action: (id, record) => {
        setShowModel(true);
      },
    },
  ];

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [status, setStatus] = useState("");
  const { id } = useParams();

  // const getLeavesPermission = async () => {
  //   try {
  //     const response = await API.get("/leaverequests");
  //     const data = await response;
  //     console.log(data.data);
  //     setRows(data.data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   getLeavesPermission();
  // }, []);

  const modifyRow = (row) => {
    let newRow = { ...row };
    const transStatus = (status) => {
      if (status == "0") return "قيد الانتظار";
      if (status == "1") return "موافقة";
      if (status == "2") return "مرفوضة";
    };

    const transType = (leave) => {
      if (leave == "1") return " أثناء اليوم";
      if (leave == "2") return "تأخير";
      if (leave == "3") return "انصراف مبكر";
      if (leave == "4") return "مراجعة المستشفى";
      if (leave == "5") return "مرضي";
      if (leave == "6") return "حمل";
      if (leave == "7") return "اخرى";
    };
    newRow.status = transStatus(row.status);
    newRow.type = transType(row.type);
    return newRow;
  };

  const handleDecission = async (e) => {
    e.preventDefault();
    //فين الريكويستتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتت
    setShowModel(false);
  };
  return (
    <>
      <HRreports activeTab="LeavePermissionReport" />

      <div className="hrReports-tabel">
        {/* <CustomTable
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          title="تقارير الأذونات"
          onDownload={handleDownload}
          columns={columns}
          data={rows.map((row) => ({
            id: row.id,
            type: transType(row.type),
            date: row.date,
            hours: row.hours,
            note: row.note,
            // days: calcDays(row),
            status: transStatus(row.status),
          }))}
          dropdownOptions={dropdownOptions}
        />{" "} */}
        <TableComponent
          apiUrl="/leaverequests"
          columns={columns}
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          title="تقارير الأذونات"
          dropdownOptions={dropdownOptions}
          // search={false}
          transformRowFn={modifyRow}
        />
      </div>
      {showModel && (
        <Modal show={showModel} onHide={() => setShowModel(false)}>
          <Modal.Header closeButton>
            <Modal.Title>قرار</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label htmlFor="decision">قرار</label>
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

export default LeavePermissionReport;
