import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  faPlus,
  faXmark,
  faTrash,
  faPaperclip,
  faUpload,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Spinner } from "react-bootstrap";
import TableComponent from "../../components/TableComponent";
import ConfirmModal from "../../components/ConfirmModal";
import { projectService } from "../../modules/projects";
import { useParams } from "react-router";
import { toast } from "react-toastify";

function ProjectAttachment() {
  const columns = [
    { name: "الوصف", key: "description" },
    { name: "الملف", key: "upload" },
    { name: "", key: "actions" },
  ];
  const { id } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const [error, setError] = useState({});

  // Dynamic attachments array: [{ id, description, file, fileName }]
  const [attachments, setAttachments] = useState([
    { id: Date.now(), description: "", file: null, fileName: "" },
  ]);

  // Confirm Modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const modifyRow = (row) => {
    let newRow = { ...row };
    newRow.upload = `<a class="btn btn-primary" href="${newRow.upload}" target="_blank" rel="noreferrer">عرض</a>`;
    return newRow;
  };

  const handleAddRow = () => {
    setAttachments((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        description: "",
        file: null,
        fileName: "",
      },
    ]);
  };

  const handleRemoveRow = (rowId) => {
    if (attachments.length === 1) {
      setAttachments([
        { id: Date.now(), description: "", file: null, fileName: "" },
      ]);
      return;
    }
    setAttachments((prev) => prev.filter((item) => item.id !== rowId));
  };

  const handleRowDescriptionChange = (rowId, val) => {
    setAttachments((prev) =>
      prev.map((item) =>
        item.id === rowId ? { ...item, description: val } : item
      )
    );
  };

  const handleRowFileChange = (rowId, file) => {
    setAttachments((prev) =>
      prev.map((item) =>
        item.id === rowId
          ? { ...item, file: file, fileName: file ? file.name : "" }
          : item
      )
    );
  };

  const handleOpenModal = () => {
    setAttachments([
      { id: Date.now(), description: "", file: null, fileName: "" },
    ]);
    setError({});
    setShowModal(true);
  };

  const handleUploads = async (e) => {
    if (e) e.preventDefault();

    const validRows = attachments.filter(
      (item) => item.file instanceof File
    );

    if (validRows.length === 0) {
      toast.warning("يرجى اختيار ملف واحد على الأقل للرفع");
      return;
    }

    setIsSubmitting(true);
    setError({});

    const formData = new FormData();
    formData.append("project_id", id);

    validRows.forEach((item) => {
      formData.append("description[]", item.description || "");
      formData.append("upload[]", item.file);
      formData.append("uploads[]", item.file);
    });

    try {
      const res = await projectService.uploadProjectAttachment(formData);
      if (res.status === 200 || res.status === 201) {
        toast.success("تم رفع المرفقات بنجاح");
        setAttachments([
          { id: Date.now(), description: "", file: null, fileName: "" },
        ]);
        setShowModal(false);
        setTableReloadKey(Date.now());
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorData = err.response?.data?.errors || {};
      setError(errorData);
      toast.error(
        err.response?.data?.message || "حدث خطأ أثناء رفع المرفقات"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (attachmentId) => {
    setDeleteId(attachmentId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await projectService.deleteProjectAttachment(deleteId);
      if (res.status === 200) {
        toast.success("تم حذف المرفق بنجاح");
        setTableReloadKey(Date.now());
        setShowConfirm(false);
      }
    } catch (err) {
      console.error("There was an error deleting attachment!", err);
      toast.error("حدث خطأ أثناء حذف المرفق");
    } finally {
      setIsDeleting(false);
    }
  };

  const dropdownOptions = [
    {
      label: "حذف",
      action: (attachmentId) => handleDeleteClick(attachmentId),
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
          onAddClick={handleOpenModal}
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
        size="lg"
        centered
        dir="rtl"
        className="project-kpi-modal"
      >
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Modal.Title className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faPaperclip} className="text-warning" />
            <span>إضافة مرفقات للمشروع</span>
          </Modal.Title>
          <button
            type="button"
            className="btn-close m-0"
            aria-label="Close"
            onClick={() => setShowModal(false)}
          ></button>
        </Modal.Header>

        <Modal.Body className="p-4">
          <form id="project-attachments-form" onSubmit={handleUploads}>
            <div className="d-flex flex-column gap-3">
              {attachments.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 rounded-3 border bg-light shadow-sm"
                  style={{
                    backgroundColor: "var(--input-background, #fdf6ec)",
                    borderColor: "rgba(200, 146, 74, 0.3)",
                  }}
                >
                  <div className="row g-2 align-items-center">
                    {/* Description Column */}
                    <div className="col-12 col-md-6">
                      <label className="form-label small text-muted mb-1 fw-bold">
                        الوصف ({index + 1})
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="أدخل وصف المرفق (مثال: العقد، الفاتورة...)"
                        value={item.description}
                        onChange={(e) =>
                          handleRowDescriptionChange(
                            item.id,
                            e.target.value
                          )
                        }
                        style={{ height: "42px", borderRadius: "8px" }}
                      />
                    </div>

                    {/* File Input Column */}
                    <div className="col-10 col-md-5">
                      <label className="form-label small text-muted mb-1 fw-bold">
                        الملف المرفق
                      </label>
                      <div className="position-relative">
                        <input
                          type="file"
                          id={`file-input-${item.id}`}
                          className="d-none"
                          onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            handleRowFileChange(item.id, f);
                          }}
                        />
                        <label
                          htmlFor={`file-input-${item.id}`}
                          className="btn btn-outline-secondary w-100 text-truncate d-flex align-items-center justify-content-between px-3"
                          style={{
                            height: "42px",
                            cursor: "pointer",
                            borderRadius: "8px",
                            backgroundColor: "#fff",
                            borderColor: item.file ? "#198754" : "#ced4da",
                            color: item.file ? "#198754" : "#6c757d",
                            fontWeight: item.file ? "600" : "normal",
                          }}
                        >
                          <span className="text-truncate">
                            {item.fileName ? item.fileName : "اضغط لاختيار ملف..."}
                          </span>
                          <FontAwesomeIcon
                            icon={item.file ? faCheck : faUpload}
                            className={item.file ? "text-success ms-2" : "text-muted ms-2"}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Action Column (Delete Row) */}
                    <div className="col-2 col-md-1 d-flex align-items-end justify-content-center">
                      <div style={{ height: "42px" }} className="d-flex align-items-center">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveRow(item.id)}
                          title="حذف هذا الصف"
                          style={{
                            height: "40px",
                            width: "40px",
                            borderRadius: "8px",
                          }}
                          className="d-flex align-items-center justify-content-center p-0"
                          disabled={attachments.length === 1 && !item.file && !item.description}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Row Button */}
            <div className="d-flex justify-content-start mt-3">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleAddRow}
                type="button"
                className="d-flex align-items-center gap-2 fw-semibold px-3 py-2"
                style={{
                  borderRadius: "8px",
                  borderColor: "var(--primary-color, #c8924a)",
                  color: "var(--primary-color, #c8924a)",
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>إضافة مرفق آخر</span>
              </Button>
            </div>

            {error && (error.upload || error["upload.0"] || error.uploads) && (
              <div className="alert alert-danger mt-3 py-2 px-3 small">
                {error.upload
                  ? error.upload[0]
                  : error["upload.0"]
                  ? error["upload.0"][0]
                  : error.uploads[0]}
              </div>
            )}
          </form>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between align-items-center">
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            disabled={isSubmitting}
          >
            إغلاق
          </Button>
          <Button
            type="submit"
            form="project-attachments-form"
            className="btn-kpi-save"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="ms-2" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} className="ms-1" />
                حفظ المرفقات
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProjectAttachment;
