import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faPlus,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { Spinner, Modal, Button } from "react-bootstrap";
import API from "../../api/axiosConfig";
import TableComponent from "../../components/TableComponent";
import { toast } from "react-toastify";
import "./leavetype.css";

function LeaveType() {
  const [error, setError] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Table Columns
  const columns = [
    { name: "اسم الإجازة", key: "name" },
    { name: "عدد الأيام", key: "days" },
    { name: "الوصف", key: "description" },
    { name: "الإجراءات", key: "actions" },
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setDays(0);
    setError({});
    setShowModal(true);
  };

  const handleOpenEdit = (record) => {
    setEditingId(record.id);
    setName(record.name || "");
    setDescription(record.description || "");
    setDays(record.days || 0);
    setError({});
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setName("");
    setDescription("");
    setDays(0);
    setError({});
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.item) return;
    setIsDeleting(true);
    try {
      await API.delete(`/vacations/${deleteModal.item.id}`);
      toast.success("تم حذف نوع الإجازة بنجاح");
      setDeleteModal({ show: false, item: null });
      setTableReloadKey(Date.now());
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حذف نوع الإجازة");
    } finally {
      setIsDeleting(false);
    }
  };

  const dropdownOptions = [
    {
      label: "تعديل",
      action: (_id, record) => handleOpenEdit(record),
    },
    {
      label: "حذف",
      action: (_id, record) => setDeleteModal({ show: true, item: record }),
    },
  ];

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const payload = {
      name: name.trim(),
      description: description.trim(),
      days: Number(days) || 0,
    };

    if (editingId) {
      payload.id = editingId;
    }

    try {
      const endpoint = editingId ? "/vacations/update" : "/vacations/store";
      const res = await API.post(endpoint, payload);

      if (res.status === 200 || res.status === 201) {
        toast.success(editingId ? "تم تعديل نوع الإجازة بنجاح" : "تمت إضافة نوع الإجازة بنجاح");
        setTableReloadKey(Date.now());
        handleClose();
      } else {
        setError(res.data?.errors || {});
      }
    } catch (err) {
      console.error("Save error:", err);
      const errs = err?.response?.data?.errors;
      if (errs) {
        setError(errs);
      } else {
        toast.error(err?.response?.data?.message || "حدث خطأ أثناء حفظ نوع الإجازة");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="leave-type-container">
      <TableComponent
        key={tableReloadKey}
        title="انواع الإجازات"
        titleIcon={<FontAwesomeIcon icon={faCalendarCheck} />}
        apiUrl="/vacations"
        columns={columns}
        addBtn={true}
        addBtnName="إجازة"
        onAddClick={handleOpenAdd}
        dropdownOptions={dropdownOptions}
        searchDate={false}
        triggerReload={tableReloadKey}
      />

      {/* ── Add / Edit Modal ── */}
      <Modal
        show={showModal}
        onHide={() => !isSubmitting && handleClose()}
        centered
        size="lg"
        dir="rtl"
        dialogClassName="leave-type-modal"
      >
        <Modal.Header closeButton>
          <div className="leave-type-modal-title">
            <span className="leave-type-modal-title-icon">
              <FontAwesomeIcon icon={editingId ? faPenToSquare : faPlus} />
            </span>
            <span>{editingId ? "تعديل إجازة" : "إضافة إجازة"}</span>
          </div>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="leave-type-grid">
              {/* Leave Name */}
              <div className="leave-type-field-group">
                <label className="leave-type-field-label">
                  اسم الإجازة <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="leave-type-input"
                  placeholder="أدخل اسم نوع الإجازة (مثال: إجازة سنوية)"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error.name) setError((prev) => ({ ...prev, name: null }));
                  }}
                />
                {error.name && (
                  <span className="leave-type-field-error">
                    {Array.isArray(error.name) ? error.name[0] : error.name}
                  </span>
                )}
              </div>

              {/* Days Count */}
              <div className="leave-type-field-group">
                <label className="leave-type-field-label">
                  عدد الأيام <span className="req">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  className="leave-type-input"
                  placeholder="عدد الأيام المستحقة"
                  value={days}
                  onChange={(e) => {
                    setDays(e.target.value);
                    if (error.days) setError((prev) => ({ ...prev, days: null }));
                  }}
                />
                {error.days && (
                  <span className="leave-type-field-error">
                    {Array.isArray(error.days) ? error.days[0] : error.days}
                  </span>
                )}
              </div>

              {/* Leave Description */}
              <div className="leave-type-field-group leave-type-full-width">
                <label className="leave-type-field-label">وصف الإجازة</label>
                <textarea
                  rows={3}
                  className="leave-type-input"
                  placeholder="أدخل وصفاً تفصيلياً أو شروط الحصول على الإجازة..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (error.description)
                      setError((prev) => ({ ...prev, description: null }));
                  }}
                />
                {error.description && (
                  <span className="leave-type-field-error">
                    {Array.isArray(error.description)
                      ? error.description[0]
                      : error.description}
                  </span>
                )}
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              className="leave-type-btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="leave-type-btn-save"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner animation="border" size="sm" />
              ) : editingId ? (
                "تحديث"
              ) : (
                "حفظ"
              )}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        show={deleteModal.show}
        onHide={() => !isDeleting && setDeleteModal({ show: false, item: null })}
        centered
        size="sm"
        dir="rtl"
        dialogClassName="leave-type-modal"
      >
        <Modal.Header closeButton>
          <div className="leave-type-modal-title">
            <span
              className="leave-type-modal-title-icon"
              style={{ background: "rgba(220, 53, 69, 0.15)", color: "#dc3545" }}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </span>
            <span>تأكيد الحذف</span>
          </div>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center", padding: "24px 20px" }}>
          <p style={{ margin: 0, fontSize: "14.5px", color: "#493d2c" }}>
            هل أنت متأكد من رغبتك في حذف نوع الإجازة{" "}
            <strong>"{deleteModal.item?.name}"</strong>؟
          </p>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center", gap: "10px" }}>
          <button
            type="button"
            className="leave-type-btn-cancel"
            onClick={() => setDeleteModal({ show: false, item: null })}
            disabled={isDeleting}
          >
            إلغاء
          </button>
          <Button
            variant="danger"
            style={{ borderRadius: "10px", padding: "8px 24px", fontWeight: 600 }}
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner animation="border" size="sm" /> : "حذف نهائي"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LeaveType;
