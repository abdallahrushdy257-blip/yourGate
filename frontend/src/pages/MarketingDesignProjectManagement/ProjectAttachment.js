import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useCallback } from "react";
import {
  faPlus,
  faXmark,
  faTrash,
  faPaperclip,
  faUpload,
  faCheck,
  faEye,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Spinner, Tab, Nav, Badge } from "react-bootstrap";
import ConfirmModal from "../../components/ConfirmModal";
import { projectService } from "../../modules/projects";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../modules/projects/pages/KPI/ProjectKPI.css";

function ProjectAttachment({
  show: propShow,
  onHide: propOnHide,
  projectId: propProjectId,
  onSuccess: propOnSuccess,
}) {
  const { id: paramId } = useParams();
  const id = propProjectId || paramId;
  const navigate = useNavigate();

  const [show, setShow] = useState(propShow !== undefined ? propShow : true);
  const [activeTab, setActiveTab] = useState("list");
  const [existingUploads, setExistingUploads] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // Dynamic new attachments array: [{ id, description, file, fileName }]
  const [attachments, setAttachments] = useState([
    { id: Date.now(), description: "", file: null, fileName: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  // Confirm delete states
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (propShow !== undefined) {
      setShow(propShow);
    }
  }, [propShow]);

  const fetchUploads = useCallback(async () => {
    if (!id) return;
    setLoadingList(true);
    try {
      const res = await projectService.getProjectAttachments(id);
      const list = res.data?.data || res.data || [];
      const safeList = Array.isArray(list) ? list : [];
      setExistingUploads(safeList);
      if (safeList.length === 0) {
        setActiveTab("add");
      }
    } catch (err) {
      console.error("Failed to load attachments:", err);
    } finally {
      setLoadingList(false);
    }
  }, [id]);

  useEffect(() => {
    if (show && id) {
      fetchUploads();
    }
  }, [show, id, fetchUploads]);

  const handleClose = () => {
    setShow(false);
    if (propOnHide) {
      propOnHide();
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/projectStatus");
      }
    }
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

  const handleUploads = async (e) => {
    if (e) e.preventDefault();

    const validRows = attachments.filter((item) => item.file instanceof File);

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
        await fetchUploads();
        setActiveTab("list");
        if (propOnSuccess) propOnSuccess();
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorData = err.response?.data?.errors || {};
      setError(errorData);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء رفع المرفقات");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (uploadId) => {
    setDeleteId(uploadId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await projectService.deleteProjectAttachment(deleteId);
      if (res.status === 200 || res.status === 204) {
        toast.success("تم حذف المرفق بنجاح");
        setShowConfirm(false);
        setDeleteId(null);
        await fetchUploads();
        if (propOnSuccess) propOnSuccess();
      }
    } catch (err) {
      toast.error("فشل في حذف المرفق");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
        dir="rtl"
        backdrop="static"
        className="project-kpi-modal"
      >
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Modal.Title className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faPaperclip} className="text-warning" />
            <span className="fw-bold">مرفقات المشروع #{id}</span>
          </Modal.Title>
          <button
            type="button"
            className="btn-close m-0"
            aria-label="Close"
            onClick={handleClose}
          ></button>
        </Modal.Header>

        <Modal.Body className="p-4">
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav variant="pills" className="mb-3 d-flex gap-2">
              <Nav.Item>
                <Nav.Link eventKey="list" className="fw-bold">
                  <FontAwesomeIcon icon={faFileLines} className="ms-1" />
                  المرفقات الحالية
                  <Badge bg="secondary" className="me-2">
                    {existingUploads.length}
                  </Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="add" className="fw-bold">
                  <FontAwesomeIcon icon={faPlus} className="ms-1" />
                  إضافة مرفقات جديدة
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* Tab 1: Existing Attachments */}
              <Tab.Pane eventKey="list">
                {loadingList ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                    <div className="mt-2 text-muted small">جاري تحميل المرفقات...</div>
                  </div>
                ) : existingUploads.length === 0 ? (
                  <div className="text-center py-4 border rounded bg-light">
                    <FontAwesomeIcon
                      icon={faPaperclip}
                      className="text-muted mb-2"
                      style={{ fontSize: "2rem" }}
                    />
                    <p className="text-muted mb-2">لا توجد مرفقات مسجلة لهذا المشروع بعد</p>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setActiveTab("add")}
                    >
                      <FontAwesomeIcon icon={faPlus} className="ms-1" />
                      إضافة أول مرفق
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: "50px" }}>#</th>
                          <th>وصف المرفق</th>
                          <th>تاريخ الرفع</th>
                          <th style={{ width: "160px" }} className="text-center">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {existingUploads.map((u, idx) => (
                          <tr key={u.id || idx}>
                            <td>{idx + 1}</td>
                            <td className="fw-semibold">{u.description || "ملف مرفق"}</td>
                            <td className="text-muted small">{u.created_at || "-"}</td>
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <a
                                  href={u.upload || u.upload_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                  <span>عرض</span>
                                </a>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDeleteClick(u.id)}
                                  title="حذف المرفق"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Tab.Pane>

              {/* Tab 2: Add New Attachments */}
              <Tab.Pane eventKey="add">
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
                                handleRowDescriptionChange(item.id, e.target.value)
                              }
                              style={{ height: "42px", borderRadius: "8px" }}
                            />
                          </div>
                          <div className="col-10 col-md-5">
                            <label className="form-label small text-muted mb-1 fw-bold">
                              الملف المرفق
                            </label>
                            <div className="position-relative">
                              <input
                                type="file"
                                id={`file-input-prop-${item.id}`}
                                className="d-none"
                                onChange={(e) => {
                                  const f = e.target.files?.[0] || null;
                                  handleRowFileChange(item.id, f);
                                }}
                              />
                              <label
                                htmlFor={`file-input-prop-${item.id}`}
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
                                  className={
                                    item.file ? "text-success ms-2" : "text-muted ms-2"
                                  }
                                />
                              </label>
                            </div>
                          </div>
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
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                    <Button
                      type="button"
                      variant="outline-primary"
                      size="sm"
                      onClick={handleAddRow}
                      className="d-flex align-items-center gap-1"
                      style={{ borderRadius: "8px" }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      <span>إضافة مرفق آخر</span>
                    </Button>
                    <span className="text-muted small">
                      إجمالي الملفات المحددة: {attachments.filter((a) => a.file).length}
                    </span>
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
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between align-items-center">
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            إغلاق
          </Button>
          {activeTab === "add" && (
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
          )}
        </Modal.Footer>
      </Modal>

      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        isSubmitting={isDeleting}
        title="تأكيد حذف المرفق"
        message="هل أنت متأكد من حذف هذا المرفق نهائياً؟"
      />
    </>
  );
}

export default ProjectAttachment;
