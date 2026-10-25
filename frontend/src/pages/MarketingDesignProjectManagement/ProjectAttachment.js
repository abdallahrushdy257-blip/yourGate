import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import TableComponent from "../../components/TableComponent";
import ConfirmModal from "../../components/ConfirmModal";
import API from "../../api/axiosConfig";
import { useNavigate, useParams } from "react-router";
import UploadInput from "../../components/UploadInput";

function ProjectAttachment() {
  const columns = [
    { name: "الوصف", key: "description" },
    { name: "الملف", key: "upload" },
    { name: "", key: "actions" },
  ];
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [description, setDescription] = useState("");
  const [upload, setUpload] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const { id } = useParams();

  // Confirm Modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const modifyRow = (row) => {
    let newRow = { ...row };
    newRow.upload = `<a class="btn btn-primary" href="${newRow.upload}" target="_blank">عرض</a>`;
    return newRow;
  };
  const handleUploads = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("description", description);
    formData.append("upload", upload);
    formData.append("project_id", id);

    try {
      const res = await API.post(`/projectuploads/store`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res;
      if (data.status === 200) {
        setDescription("");
        setUpload("");
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

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await API.get(`/projectuploads/${deleteId}/delete`);
      if (res.status === 200) {
        setTableReloadKey(Date.now());
        setShowConfirm(false);
      }
    } catch (error) {
      console.error("There was an error!", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const dropdownOptions = [
    {
      label: "حذف",
      action: (id) => handleDeleteClick(id),
    },
  ];

  return (
    <>
      <div className="printcasedata-container">
        <TableComponent
          apiUrl={`/projectuploads/${id}`}
          columns={columns}
          title="مرفقات المشروع"
          transformRowFn={modifyRow}
          triggerReload={tableReloadKey}
          dropdownOptions={dropdownOptions}
          addBtn={true}
          onAddClick={() => setShowModal(true)}
        />
      </div>

      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        isSubmitting={isDeleting}
        title="تأكيد حذف المرفق"
        message="هل أنت متأكد من حذف هذا المرفق من المشروع؟"
      />
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table small-modall archModal archive-modal"
        dialogClassName="fit-content-modal"
      >
        <Modal.Header>
          <Modal.Title>إضافة مرفق</Modal.Title>
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
            label="الوصف"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && error.description && (
            <span className="error">{error.description[0]}</span>
          )}
          <div style={{ marginBottom: "20px" }}></div>
          <UploadInput
            label="الملف"
            type="file"
            value={upload}
            id="upload"
            onChange={(e) => setUpload(e.target.files[0])}
          />
          {error && error.upload && (
            <span className="error">{error.upload[0]}</span>
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
            <Button variant="primary" onClick={handleUploads}>
              حفظ
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProjectAttachment;
