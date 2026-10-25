import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import "../hrreports.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faList, faTable } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../../components/TableComponent";
import { Button, Modal } from "react-bootstrap";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import API from "../../../api/axiosConfig";
import UploadInput from "../../../components/UploadInput";

const EmployeePaper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [message, setMessage] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [attachments, setAttachments] = useState(null);
  const [paperid, setPaperId] = useState(null);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  // useEffect(() => {
  //     const getData = async () => {
  //         try {
  //             const res = await API.get(`/employees/${id}/papers`);
  //             const data = await res;
  //             console.log(data.data);
  //             setRows(data.data);
  //             setLoading(false);
  //         } catch (error) {
  //             console.error(error);
  //             setError(error.response.data.errors);
  //             setMessage(error.response.data.message);
  //         }
  //     }
  //     getData();
  // }, []);

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
    { name: "اسم الملف", key: "name" },
    { name: "الملف", key: "file" },
    { name: "الحالة", key: "status" },
    { name: "", key: "actions" },
  ];

  const modifyRow = (row) => {
    let newRow = { ...row };
    const showPhoto = (photo) => {
      if (photo) {
        return `<a href=${photo} target="_blank" >👁️</a>`;
      } else {
        return `<span class="text-danger">لا يوجد ملف</span>`;
      }
    };
    newRow.file = showPhoto(row.file);
    newRow.status =
      row.status == 0
        ? "<span class='text-danger'>غير موجود</span>"
        : "<span class='text-success'>موجود</span>";
    return newRow;
  };

  const dropdownOptions1 = [
    {
      label: "تحميل المستند",
      action: (id, record) => {
        setShowModal(true);
        setPaperId(record.id);
      },
    },
  ];

  const handleUpload = async () => {
    if (!attachments) {
      setError({ attachments: "يرجى تحميل المستند" });
      return;
    }
    const formData = new FormData();
    formData.append("upload", attachments);
    formData.append("id", paperid);
    try {
      await API.post(`/employeeuploads/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("تم تحميل المستند بنجاح");
      setShowModal(false);
      setTableReloadKey(Date.now());
    } catch (error) {
      console.error(error);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  };
  return (
    <>
      <div className="hrReports-tabel">
        <TableComponent
          apiUrl={`/employees/${id}/papers`}
          columns={columns}
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          title="مستندات"
          dropdownOptions={dropdownOptions1}
          search={false}
          transformRowFn={modifyRow}
          extraTitleField="employee.name"
          triggerReload={tableReloadKey}
        />
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table small-modall archModal paperModal"
      >
        <Modal.Header>
          <Modal.Title>تحميل المستند</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <UploadInput
            id={`attachments`}
            label="تحميل المستند"
            onChange={(e) => setAttachments(e.target.files[0])}
            value={attachments}
            parentStyle={{
              marginTop: "3%",
              display: "flex",
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إغلاق
          </Button>
          <Button variant="primary" onClick={() => handleUpload()}>
            تحميل
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EmployeePaper;
