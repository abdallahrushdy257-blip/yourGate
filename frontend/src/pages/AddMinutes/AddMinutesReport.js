import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoice,
  faPlus,
  faMinus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "../CaseDetails/CaseDetails.css";
import { useState, useEffect, useRef } from "react";
import API from "../../api/axiosConfig";
import TableComponent from "../../components/TableComponent";
import NewButton from "../../components/NewButton";
import { Modal, Row, Col, Button, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterTextarea from "../../components/RegisterTextarea";
import UploadInput from "../../components/UploadInput";
import { toast } from "react-toastify";

function AddMinutesReport(params) {
  const columns = [
    { name: "عنوان المحضر", key: "title" },
    { name: "تاريخ المحضر", key: "date" },
    { name: "ملاحظات", key: "note" },
    { name: "نوع الاجتماع", key: "type" },
    { name: "عرض المستندات", key: "upload" },
    { name: "", key: "actions" },
  ];

  const [rows, setRows] = useState([]);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());

  // ── Add Modal state ─────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});
  const [membership, setMembership] = useState([]);
  const [committee, setCommittee] = useState([]);

  const [date, setDate] = useState(
    () =>
      sessionStorage.getItem("minutes_date") ||
      new Date().toISOString().substr(0, 10),
  );
  const [title, setTitle] = useState(
    () => sessionStorage.getItem("minutes_title") || "",
  );
  const [note, setNote] = useState(
    () => sessionStorage.getItem("minutes_note") || "",
  );
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [attendees, setAttendees] = useState([{ value: "" }]);
  const [committees, setCommittees] = useState([{ value: "" }]);

  const fetchMembership = async () => {
    const res = await API.post("/assemblymembers");
    setMembership(res.data);
  };

  const fetchCommittee = async () => {
    const res = await API.post("/associationcommittee");
    setCommittee(res.data);
  };

  useEffect(() => {
    if (showModal) {
      fetchMembership();
      fetchCommittee();
    }
  }, [showModal]);

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
      prev.map((item, i) => (i === index ? { ...item, value } : item)),
    );
  };

  const handleCommitteeChange = (index, value) => {
    setCommittees((prev) =>
      prev.map((item, i) => (i === index ? { ...item, value } : item)),
    );
  };

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

  const resetForm = () => {
    setDate(new Date().toISOString().substr(0, 10));
    setTitle("");
    setNote("");
    setFile(null);
    setType("");
    setReason("");
    setAttendees([{ member: "" }]);
    setCommittees([{ committee: "" }]);
    setError({});
    sessionStorage.removeItem("minutes_date");
    sessionStorage.removeItem("minutes_title");
    sessionStorage.removeItem("minutes_note");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("اسم المحضر مطلوب")
      return;
    }
    // Client-side validation
    const today = new Date().toISOString().split("T")[0];
    if (date && date < today) {
      toast.error("تاريخ المحضر لا يمكن أن يكون في الماضي")
      return;
    }

    setIsSubmitting(true);

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

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (day.length === 4) return dateStr;
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  // ── Edit Minutes Modal State & Handlers ─────────────────
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState({});
  const [editId, setEditId] = useState(null);
  const isFetchingEditRef = useRef(false);

  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editFile, setEditFile] = useState(null);

  const handleOpenEditModal = async (recordId, record) => {
    if (isFetchingEditRef.current) return;
    isFetchingEditRef.current = true;
    setEditId(recordId);
    setEditError({});

    try {
      const res = await API.get(`/minutesheets/${recordId}`);
      const m = res.data?.data || res.data || record || {};
      setEditTitle(m.title || "");
      setEditDate(formatDateForInput(m.date || ""));
      setEditNote(m.note || "");
      setEditFile(null);
      setShowEditModal(true);
    } catch (err) {
      console.error(err);
      const m = record || {};
      setEditTitle(m.title || "");
      setEditDate(formatDateForInput(m.date || ""));
      setEditNote(m.note || "");
      setEditFile(null);
      setShowEditModal(true);
    } finally {
      isFetchingEditRef.current = false;
    }
  };

  const handleEditSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isEditSubmitting) return;

    if (!editTitle) {
      return toast.error("عنوان المحضر مطلوب");
    }

    const today = new Date().toISOString().split("T")[0];
    if (editDate && editDate < today) {
      return toast.error("تاريخ المحضر لا يمكن أن يكون في الماضي");
    }

    setIsEditSubmitting(true);
    const formData = new FormData();
    formData.append("id", editId);
    formData.append("title", editTitle);
    formData.append("date", editDate);
    formData.append("note", editNote || "");
    if (editFile) {
      formData.append("paper", editFile);
    }

    try {
      const res = await API.post("/minutesheets/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) {
        toast.success("تم تعديل المحضر بنجاح");
        setShowEditModal(false);
        setTableReloadKey(Date.now());
      } else {
        setEditError(res.data?.errors || {});
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء تعديل المحضر");
      setEditError(err.response?.data?.errors || {});
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const dropdownOptions = [
    {
      label: "تعديل",
      action: (id, record) => {
        handleOpenEditModal(id, record);
      },
    },
  ];

  const modifyRow = (row) => {
    let newRow = { ...row };
    newRow.upload =
      newRow.upload !== null &&
      newRow.upload !== undefined &&
      newRow.upload !== ""
        ? `<a class="" href="${newRow.upload}" target="_blank"> 👁️</a>`
        : "لا يوجد مستندات";
    return newRow;
  };

  return (
    <>
      <div className="printcasedata-container">
        {/* <NewButton name={"محضر"} onClick={() => setShowModal(true)} /> */}
        <TableComponent
          apiUrl="/minutesheets"
          columns={columns}
          title="تقرير المحاضر"
          titleIcon={<FontAwesomeIcon icon={faFileInvoice} />}
          dropdownOptions={dropdownOptions}
          transformRowFn={modifyRow}
          triggerReload={tableReloadKey}
          addBtn={true}
          onAddClick={() => setShowModal(true)}
          addBtnName="محضر"
        />
      </div>

      {/* ── Add Minutes Modal ── */}
      <Modal
        show={showModal}
        onHide={handleClose}
        className="modal-table archModal donor-modal"
        size="md"
        centered
      >
        <Modal.Header>
          <Modal.Title>إضافة محضر</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ paddingBottom: "0", direction: "rtl" }}>
          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="min-title"
                label="عنوان المحضر"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  sessionStorage.setItem("minutes_title", e.target.value);
                }}
                error={error.title}
              />
            </Col>
            <Col md={6}>
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <p style={{ marginBottom: "10px", textAlign: "right" }}>
                  تاريخ المحضر
                </p>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    sessionStorage.setItem("minutes_date", e.target.value);
                  }}
                  style={{ width: "100%" }}
                />
                {error.date && (
                  <span className="error-text" style={{ color: "red" }}>
                    {error.date}
                  </span>
                )}
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterSelect
                id="min-type"
                label="نوع الاجتماع"
                options={[
                  { value: "", label: "اختر" },
                  { value: "1", label: "جمعية عمومية" },
                  { value: "2", label: "مجلس إدارة" },
                ]}
                value={type}
                onChange={(e) => setType(e.target.value)}
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

          <RegisterTextarea
            id="min-note"
            label="ملاحظات"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              sessionStorage.setItem("minutes_note", e.target.value);
            }}
            error={error.note}
          />

          <div
            className="AddBeneficiaryContainer"
            style={{
              borderTop: "1px solid #ccc",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
              width: "100%",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <span
                className="addillness"
                onClick={addRow}
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </span>

              {attendees.length > 1 && (
                <span
                  className="addillness"
                  onClick={removeRow}
                  style={{ color: "red", cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </span>
              )}
            </div>

            {attendees.map((row, idx) => (
              <Row key={idx} style={{ marginBottom: "15px" }}>
                <Col md={6}>
                  <RegisterSelect
                    id={`min-member-${idx}`}
                    label="إسم العضو"
                    options={[
                      { value: "", label: "إختر العضو" },
                      ...membership.map((m) => ({
                        value: m.id,
                        label: m.name,
                      })),
                    ]}
                    value={attendees[idx]?.value}
                    onChange={(e) => handleNamesChange(idx, e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id={`min-comm-${idx}`}
                    label="إسم اللجنة"
                    options={[
                      { value: "", label: "إختر اللجنة" },
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

          <UploadInput
            id="min-file"
            label="إرفاق مستند"
            onChange={(e) => setFile(e.target.files[0])}
            error={error.file}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            إغلاق
          </Button>
          {isSubmitting ? (
            <Button variant="primary" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              حفظ
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* ── Edit Minutes Modal ── */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        className="modal-table archModal donor-modal"
        size="md"
        centered
      >
        <Modal.Header>
          <Modal.Title>تعديل محضر اجتماع</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowEditModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ paddingBottom: "0", direction: "rtl" }}>
          <Row>
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
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <p style={{ marginBottom: "10px", textAlign: "right" }}>
                  تاريخ المحضر *
                </p>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  style={{ width: "100%" }}
                />
                {editError.date && (
                  <span className="error-text" style={{ color: "red" }}>
                    {editError.date}
                  </span>
                )}
              </div>
            </Col>
          </Row>

          <RegisterTextarea
            id="edit-min-note"
            label="ملاحظات"
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            error={editError.note}
          />

          <UploadInput
            id="edit-min-file"
            label="إرفاق مستند جديد (اختياري)"
            onChange={(e) => setEditFile(e.target.files[0])}
            error={editError.file}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEditModal(false)}
            disabled={isEditSubmitting}
          >
            إغلاق
          </Button>
          <Button
            variant="primary"
            onClick={handleEditSubmit}
            disabled={isEditSubmitting}
          >
            {isEditSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="ms-2" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              "حفظ التعديلات"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddMinutesReport;
