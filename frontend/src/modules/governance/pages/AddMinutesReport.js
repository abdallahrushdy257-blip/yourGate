import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoice,
  faPlus,
  faMinus,
  faXmark,
  faBuildingColumns,
  faUsersLine,
  faFileContract,
  faTriangleExclamation,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback } from "react";
import API from "../../../api/axiosConfig";
import TableComponent from "../../../components/TableComponent";
import { Modal, Row, Col, Button, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../../components/RegisterTextBox";
import RegisterSelect from "../../../components/RegisterSelect";
import RegisterTextarea from "../../../components/RegisterTextarea";
import UploadInput from "../../../components/UploadInput";
import "./addMinutes.css";

function AddMinutesReport() {
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const [stats, setStats] = useState({
    total_minutes: 0,
    assembly_minutes: 0,
    board_minutes: 0,
  });

  // Lookup Options
  const [membership, setMembership] = useState([]);
  const [committee, setCommittee] = useState([]);

  // ── Add Modal State ─────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  const [date, setDate] = useState(() => new Date().toISOString().substr(0, 10));
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [attendees, setAttendees] = useState([{ value: "" }]);
  const [committees, setCommittees] = useState([{ value: "" }]);

  // ── Edit Modal State ────────────────────────────────────
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editType, setEditType] = useState("");
  const [editReason, setEditReason] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [editDefaultFileUrl, setEditDefaultFileUrl] = useState("");
  const [editAttendees, setEditAttendees] = useState([{ value: "" }]);
  const [editCommittees, setEditCommittees] = useState([{ value: "" }]);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState({});

  // ── Delete Modal State ──────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await API.get("/minutesheets/stats");
      if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching minute stats:", err);
    }
  }, []);

  const fetchLookups = async () => {
    try {
      const [membersRes, committeesRes] = await Promise.all([
        API.post("/assemblymembers", { perpage: 0 }),
        API.post("/associationcommittee", { perpage: 0 }),
      ]);
      setMembership(Array.isArray(membersRes.data) ? membersRes.data : membersRes.data?.data || []);
      setCommittee(Array.isArray(committeesRes.data) ? committeesRes.data : committeesRes.data?.data || []);
    } catch (error) {
      console.error("Error fetching lookups:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchLookups();
  }, [fetchStats]);

  const minutesreason = {
    1: [
      { value: "", label: "إختر نوع المحضر" },
      { value: "1", label: "عادية" },
      { value: "2", label: "غير عادية" },
    ],
    2: [
      { value: "", label: "إختر نوع المحضر" },
      { value: "3", label: "دوري" },
      { value: "4", label: "طارئة" },
      { value: "5", label: "لجان" },
    ],
  };

  const addRow = () => {
    setAttendees([...attendees, { value: "" }]);
    setCommittees([...committees, { value: "" }]);
  };

  const removeRow = () => {
    if (attendees.length > 1) {
      setAttendees(attendees.slice(0, -1));
      setCommittees(committees.slice(0, -1));
    }
  };

  const handleNamesChange = (index, value) => {
    setAttendees((prev) =>
      prev.map((item, i) => (i === index ? { ...item, value } : item))
    );
  };

  const handleCommitteeChange = (index, value) => {
    setCommittees((prev) =>
      prev.map((item, i) => (i === index ? { ...item, value } : item))
    );
  };

  const resetForm = () => {
    setDate(new Date().toISOString().substr(0, 10));
    setTitle("");
    setNote("");
    setFile(null);
    setType("");
    setReason("");
    setAttendees([{ value: "" }]);
    setCommittees([{ value: "" }]);
    setError({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  // Submit Add Minute
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("note", note);
    formData.append("type", type);
    formData.append("reason", reason);
    formData.append("attendees", JSON.stringify(attendees));
    formData.append("committee", JSON.stringify(committees));
    if (file) formData.append("file", file);

    try {
      const res = await API.post("/minutesheets/store", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) {
        handleClose();
        setTableReloadKey(Date.now());
        fetchStats();
      } else {
        setError(res.data.errors || {});
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = async (minuteId, minuteRecord) => {
    try {
      setEditId(minuteId);
      setEditTitle(minuteRecord?.title || "");
      setEditDate(minuteRecord?.date || "");
      setEditNote(minuteRecord?.note || "");
      setEditType(minuteRecord?.type ? String(minuteRecord.type) : "");
      setEditReason(minuteRecord?.reason ? String(minuteRecord.reason) : "");
      setEditDefaultFileUrl(minuteRecord?.upload_url || minuteRecord?.upload || "");
      setEditFile(null);
      setEditError({});

      const res = await API.get(`/minutesheets/${minuteId}`);
      const data = res.data?.data || res.data;
      if (data) {
        setEditTitle(data.title || "");
        setEditDate(data.date || "");
        setEditNote(data.note || "");
        setEditType(data.type ? String(data.type) : "");
        setEditReason(data.reason ? String(data.reason) : "");
        setEditDefaultFileUrl(data.upload_url || data.upload || "");

        if (Array.isArray(data.attendees) && data.attendees.length > 0) {
          setEditAttendees(data.attendees.map((a) => ({ value: a.assembly_member_id || "" })));
          setEditCommittees(data.attendees.map((a) => ({ value: a.committee_id || "" })));
        } else {
          setEditAttendees([{ value: "" }]);
          setEditCommittees([{ value: "" }]);
        }
      }
      setShowEditModal(true);
    } catch (err) {
      console.error("Error loading minute sheet:", err);
    }
  };

  // Submit Edit Minute
  const handleEditSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsEditing(true);
    setEditError({});

    const formData = new FormData();
    formData.append("id", editId);
    formData.append("title", editTitle);
    formData.append("date", editDate);
    formData.append("note", editNote);
    formData.append("type", editType);
    formData.append("reason", editReason);
    formData.append("attendees", JSON.stringify(editAttendees));
    formData.append("committee", JSON.stringify(editCommittees));
    if (editFile) formData.append("file", editFile);

    try {
      const res = await API.post(`/minutesheets/update/${editId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) {
        setShowEditModal(false);
        setTableReloadKey(Date.now());
        fetchStats();
      } else {
        setEditError(res.data.errors || {});
      }
    } catch (err) {
      console.error("Error updating minute sheet:", err);
      setEditError(err.response?.data?.errors || {});
    } finally {
      setIsEditing(false);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (minuteId, minuteRecord) => {
    setDeleteId(minuteId);
    setDeleteTitle(minuteRecord?.title || "هذا المحضر");
    setShowDeleteModal(true);
  };

  // Submit Delete Minute
  const handleDeleteSubmit = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const res = await API.delete(`/minutesheets/${deleteId}`);
      if (res.status === 200 || res.status === 204) {
        setShowDeleteModal(false);
        setTableReloadKey(Date.now());
        fetchStats();
      }
    } catch (err) {
      console.error("Error deleting minute sheet:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { name: "عنوان المحضر", key: "title" },
    { name: "تاريخ المحضر", key: "date" },
    { name: "نوع الاجتماع", key: "type_badge" },
    { name: "غرض الاجتماع", key: "reason_badge" },
    { name: "ملاحظات", key: "note" },
    { name: "عرض المستندات", key: "upload_link" },
    { name: "", key: "actions" },
  ];

  const modifyRow = (row) => {
    const isAssembly = String(row.type) === "1" || String(row.type_string).includes("عمومية");
    const typeLabel = row.type_string || (isAssembly ? "جمعية عمومية" : "مجلس إدارة");
    const typeClass = isAssembly ? "badge-minute-assembly" : "badge-minute-board";

    const reasonLabel = row.reason_string || "غير محدد";
    const uploadUrl = row.upload_url || row.upload;

    return {
      ...row,
      type_badge: `<span class="${typeClass}">${typeLabel}</span>`,
      reason_badge: `<span style="font-size:12.5px;font-weight:600;">${reasonLabel}</span>`,
      note: row.note || "لا توجد ملاحظات",
      upload_link: uploadUrl
        ? `<a class="badge-minute-file" href="${uploadUrl}" target="_blank" rel="noreferrer">📄 عرض المستند</a>`
        : `<span style="color:#a89a88;font-size:12px;">لا يوجد مستند</span>`,
    };
  };

  const dropdownOptions = [
    { label: "تعديل", action: (id, record) => handleOpenEdit(id, record) },
    { label: "حذف المحضر", action: (id, record) => handleOpenDelete(id, record) },
  ];

  return (
    <div className="minutes-page-container">
      {/* ── Top KPI Statistics Cards ── */}
      <div className="minutes-stats-grid">
        <div className="minutes-stat-card stat-gold">
          <div className="minutes-stat-content">
            <div className="minutes-stat-info">
              <span className="minutes-stat-title">إجمالي المحاضر المعتمدة</span>
              <span className="minutes-stat-value">{stats.total_minutes}</span>
              <span className="minutes-stat-sub">محاضر الاجتماعات الموثقة</span>
            </div>
            <div className="minutes-stat-icon-wrapper">
              <FontAwesomeIcon icon={faFileContract} />
            </div>
          </div>
        </div>

        <div className="minutes-stat-card stat-blue">
          <div className="minutes-stat-content">
            <div className="minutes-stat-info">
              <span className="minutes-stat-title">محاضر الجمعية العمومية</span>
              <span className="minutes-stat-value">{stats.assembly_minutes}</span>
              <span className="minutes-stat-sub">الاجتماعات العادية وغير العادية</span>
            </div>
            <div className="minutes-stat-icon-wrapper">
              <FontAwesomeIcon icon={faUsersLine} />
            </div>
          </div>
        </div>

        <div className="minutes-stat-card stat-purple">
          <div className="minutes-stat-content">
            <div className="minutes-stat-info">
              <span className="minutes-stat-title">محاضر مجلس الإدارة</span>
              <span className="minutes-stat-value">{stats.board_minutes}</span>
              <span className="minutes-stat-sub">الاجتماعات الدورية والطارئة</span>
            </div>
            <div className="minutes-stat-icon-wrapper">
              <FontAwesomeIcon icon={faBuildingColumns} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Table Container ── */}
      <TableComponent
        apiUrl="/minutesheets"
        columns={columns}
        title="تقرير محاضر الاجتماعات"
        titleIcon={<FontAwesomeIcon icon={faFileInvoice} />}
        dropdownOptions={dropdownOptions}
        transformRowFn={modifyRow}
        triggerReload={tableReloadKey}
        searchDate={true}
        addBtn={true}
        onAddClick={() => {
          resetForm();
          setShowModal(true);
        }}
        addBtnName="محضر جديد"
      />

      {/* ── Add Minutes Modal ── */}
      <Modal
        show={showModal}
        onHide={handleClose}
        className="modal-table archModal donor-modal minutes-modal"
        size="lg"
        centered
      >
        <Modal.Header>
          <Modal.Title>
            <FontAwesomeIcon icon={faFileInvoice} style={{ color: "var(--primary-color, #b89358)" }} />
            <span>إضافة محضر اجتماع جديد</span>
          </Modal.Title>
          <Button
            className="custom-close-button"
            variant="link"
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ direction: "rtl" }}>
          <Row className="mb-2">
            <Col md={6}>
              <RegisterTextbox
                id="min-title"
                label="عنوان المحضر *"
                type="text"
                placeholder="أدخل عنوان المحضر (مثال: محضر الاجتماع السنوي الأول)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={error.title}
              />
            </Col>
            <Col md={6}>
              <div className="mb-3" style={{ display: "flex", flexDirection: "column" }}>
                <label className="register-label">تاريخ المحضر *</label>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ width: "100%" }}
                />
                {error.date && <span className="error-text">{error.date}</span>}
              </div>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <RegisterSelect
                id="min-type"
                label="نوع الاجتماع *"
                options={[
                  { value: "", label: "اختر نوع الاجتماع" },
                  { value: "1", label: "جمعية عمومية" },
                  { value: "2", label: "مجلس إدارة" },
                ]}
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setReason("");
                }}
                error={error.type}
              />
            </Col>
            <Col md={6}>
              <RegisterSelect
                id="min-reason"
                label="غرض الاجتماع"
                options={
                  minutesreason[type] || [
                    { value: "", label: "إختر نوع المحضر" },
                  ]
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                error={error.reason}
                disabled={!type}
              />
            </Col>
          </Row>

          <div className="mb-3">
            <RegisterTextarea
              id="min-note"
              label="ملاحظات وبنود الاجتماع"
              placeholder="أدخل ملخص بنود المحضر والقرارات الصادرة..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              error={error.note}
            />
          </div>

          {/* Dynamic Attendees Section */}
          <div className="minutes-attendees-box">
            <div className="attendees-box-header">
              <span className="attendees-box-title">
                أعضاء ولجان الحضور ({attendees.length})
              </span>
              <div className="attendees-box-actions">
                <button type="button" className="btn-add-row" onClick={addRow}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span>إضافة سطر</span>
                </button>
                {attendees.length > 1 && (
                  <button type="button" className="btn-remove-row" onClick={removeRow}>
                    <FontAwesomeIcon icon={faMinus} />
                    <span>حذف سطر</span>
                  </button>
                )}
              </div>
            </div>

            {attendees.map((row, idx) => (
              <Row key={idx} style={{ marginBottom: "10px" }}>
                <Col md={6}>
                  <RegisterSelect
                    id={`min-member-${idx}`}
                    label={`اسم العضو (${idx + 1})`}
                    options={[
                      { value: "", label: "اختر العضو الحاضر" },
                      ...membership.map((m) => ({
                        value: m.id,
                        label: `${m.name} ${m.membership_serial ? `(${m.membership_serial})` : ""}`,
                      })),
                    ]}
                    value={attendees[idx]?.value}
                    onChange={(e) => handleNamesChange(idx, e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id={`min-comm-${idx}`}
                    label="اللجنة التابع لها (اختياري)"
                    options={[
                      { value: "", label: "اختر اللجنة" },
                      ...committee.map((c) => ({
                        value: c.id,
                        label: c.name,
                      })),
                    ]}
                    value={committees[idx]?.value}
                    onChange={(e) => handleCommitteeChange(idx, e.target.value)}
                  />
                </Col>
              </Row>
            ))}
          </div>

          <div className="mb-2">
            <UploadInput
              id="min-file"
              label="إرفاق ملف المحضر الموقع (PDF أو صورة)"
              onChange={(e) => setFile(e.target.files[0])}
              error={error.file}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            إلغاء
          </Button>
          {isSubmitting ? (
            <Button variant="primary" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              حفظ واعتماد المحضر
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* ── Edit Minutes Modal ── */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        className="modal-table archModal donor-modal minutes-modal"
        size="lg"
        centered
      >
        <Modal.Header>
          <Modal.Title>
            <FontAwesomeIcon icon={faPenToSquare} style={{ color: "var(--primary-color, #b89358)" }} />
            <span>تعديل محضر الاجتماع</span>
          </Modal.Title>
          <Button
            className="custom-close-button"
            variant="link"
            onClick={() => setShowEditModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ direction: "rtl" }}>
          <Row className="mb-2">
            <Col md={6}>
              <RegisterTextbox
                id="edit-min-title"
                label="عنوان المحضر *"
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                error={editError.title}
              />
            </Col>
            <Col md={6}>
              <div className="mb-3" style={{ display: "flex", flexDirection: "column" }}>
                <label className="register-label">تاريخ المحضر *</label>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  style={{ width: "100%" }}
                />
                {editError.date && <span className="error-text">{editError.date}</span>}
              </div>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <RegisterSelect
                id="edit-min-type"
                label="نوع الاجتماع *"
                options={[
                  { value: "", label: "اختر نوع الاجتماع" },
                  { value: "1", label: "جمعية عمومية" },
                  { value: "2", label: "مجلس إدارة" },
                ]}
                value={editType}
                onChange={(e) => {
                  setEditType(e.target.value);
                  setEditReason("");
                }}
                error={editError.type}
              />
            </Col>
            <Col md={6}>
              <RegisterSelect
                id="edit-min-reason"
                label="غرض الاجتماع"
                options={
                  minutesreason[editType] || [
                    { value: "", label: "إختر نوع المحضر" },
                  ]
                }
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                error={editError.reason}
                disabled={!editType}
              />
            </Col>
          </Row>

          <div className="mb-3">
            <RegisterTextarea
              id="edit-min-note"
              label="ملاحظات وبنود الاجتماع"
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              error={editError.note}
            />
          </div>

          <div className="mb-2">
            <UploadInput
              id="edit-min-file"
              label="تحديث ملف المحضر الموقع (اختياري)"
              defaultUrl={editDefaultFileUrl}
              onChange={(e) => setEditFile(e.target.files[0])}
              error={editError.file}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            إلغاء
          </Button>
          {isEditing ? (
            <Button variant="primary" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleEditSubmit}>
              حفظ التعديلات
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        className="modal-table archModal donor-modal minutes-delete-modal"
        centered
        size="sm"
      >
        <Modal.Header>
          <Modal.Title style={{ color: "#e53e3e" }}>
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>تأكيد حذف المحضر</span>
          </Modal.Title>
          <Button
            className="custom-close-button"
            variant="link"
            onClick={() => setShowDeleteModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </Modal.Header>
        <Modal.Body style={{ direction: "rtl", textAlign: "center", padding: "24px 20px" }}>
          <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "8px" }}>
            هل أنت متأكد من رغبتك في حذف:
          </p>
          <p style={{ fontSize: "16px", fontWeight: "800", color: "#e53e3e" }}>
            "{deleteTitle}"
          </p>
          <p style={{ fontSize: "12.5px", color: "var(--placeholder-color, #9c8e7c)", margin: 0 }}>
            سيتم حذف المحضر والمستندات المرفقة به نهائياً.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            إلغاء
          </Button>
          {isDeleting ? (
            <Button variant="danger" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button variant="danger" onClick={handleDeleteSubmit}>
              تأكيد الحذف
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddMinutesReport;
