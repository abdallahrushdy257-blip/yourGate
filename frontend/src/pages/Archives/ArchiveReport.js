import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./archive.css";
import { useState } from "react";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import UploadInput from "../../components/UploadInput";
import TableComponent from "../../components/TableComponent";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router";

function ArchiveReport() {
  const columns = [
    { name: "التاريخ", key: "date" },
    { name: "العنوان", key: "name" },
    { name: "الوصف", key: "description" },
    { name: "المرفقات", key: "upload" },
    { name: "", key: "actions" },
  ];
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const navigate = useNavigate();

  const modifyRow = (row) => {
    let newRow = { ...row };
    newRow.upload = `<a class="btn btn-primary" href="${newRow.upload}" target="_blank">عرض</a>`;
    return newRow;
  };
  const handleArchive = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", address);
    formData.append("note", description);
    formData.append("file", attachments);

    try {
      const res = await API.post(`/archives/store`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res;
      if (data.status === 200) {
        setAddress("");
        setDescription("");
        setAttachments("");
        setError([]);

        setShowModal(false);
        setIsSubmitting(false);
        setRows(data.data);
        setTableReloadKey(Date.now());
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setError(error.response?.data?.errors || {});
    }
  };

  const dropdownOptions = [
    {
      label: "حذف",
      action: (id) => {
        if (window.confirm("هل أنت متأكد من حذف هذا الأرشيف؟")) {
          API.get(`/archives/${id}/delete`)
            .then((res) => {
              if (res.status === 200) {
                setTableReloadKey(Date.now());
              }
            })
            .catch((error) => {
              console.error("There was an error!", error);
            });
        }
      },
    },
  ];

  return (
    <>
      <div className="printcasedata-container">
        {/* <div className="archive-report">
                    <span className="add-row-ta archiveAdd" onClick={() => setShowModal(true)}>
                        <FontAwesomeIcon icon={faPlus} /> إضافة
                    </span>
                </div> */}

        <TableComponent
          apiUrl="/archives"
          columns={columns}
          title="الأرشيف"
          transformRowFn={modifyRow}
          triggerReload={tableReloadKey}
          dropdownOptions={dropdownOptions}
          addBtn={true}
          onAddClick={() => setShowModal(true)}
        />
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table small-modall archModal archive-modal"
        dialogClassName="fit-content-modal"
      >
        <Modal.Header>
          <Modal.Title>إضافة ارشيف</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <RegisterTextbox
            label="العنوان"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {error && error.name && (
            <span className="error">{error.name[0]}</span>
          )}
          <RegisterTextbox
            label="الوصف"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && error.description && (
            <span className="error">{error.description[0]}</span>
          )}
          <UploadInput
            id={`attachments`}
            parentStyle={{
              margin: "10px",
              display: "flex",
              alignItems: "center",
            }}
            label={`ارفاق مستند`}
            onChange={(e) => setAttachments(e.target.files[0])}
          />
          {error && error.file && (
            <span className="error">{error.file[0]}</span>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إغلاق
          </Button>
          {isSubmitting ? (
            <Button variant="primary" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleArchive}>
              حفظ
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ArchiveReport;
