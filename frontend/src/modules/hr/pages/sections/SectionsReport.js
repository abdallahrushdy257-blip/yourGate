import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faPlus,
  faPenToSquare,
  faTrash,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Spinner } from "react-bootstrap";
import TableComponent from "../../../../components/TableComponent";
import API from "../../../../api/axiosConfig";
import { toast } from "react-toastify";
import "./SectionsReport.css";

function SectionsReport() {
  // ── States ──
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ── Form fields ──
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [managerId, setManagerId] = useState("");
  const [error, setError] = useState({});

  // ── Managers dropdown options loaded from API ──
  const [managers, setManagers] = useState([]);

  // Fetch managers from employees API
  const fetchManagers = async () => {
    try {
      const res = await API.get("/employees");
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      setManagers(list);
    } catch (err) {
      console.error("Error fetching managers:", err);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  // Open modal for Create
  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setManagerId("");
    setError({});
    setShowModal(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (record) => {
    setEditingId(record.id);
    setName(record.name || record.dapartmentname || "");
    setDescription(record.description || record.desc || "");
    setManagerId(
      record.manager_id || (record.manager && typeof record.manager === "object" ? record.manager.id : "") || ""
    );
    setError({});
    setShowModal(true);
  };

  // Close form modal
  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setName("");
    setDescription("");
    setManagerId("");
    setError({});
  };

  // Submit form (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError({ name: "اسم القسم مطلوب" });
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: name.trim(),
      description: description || "",
      manager_id: managerId ? parseInt(managerId, 10) : null,
    };

    try {
      if (editingId) {
        await API.post(`/sections/${editingId}/update`, payload);
        toast.success("تم تحديث بيانات القسم بنجاح");
      } else {
        await API.post("/sections/store", payload);
        toast.success("تم إضافة القسم بنجاح");
      }
      handleClose();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Save section error:", err);
      const validationErrors = err?.response?.data?.errors || {};
      setError(validationErrors);
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حفظ القسم");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleConfirmDelete = async () => {
    if (!deleteModal.item) return;
    setIsDeleting(true);
    try {
      await API.delete(`/sections/${deleteModal.item.id}`);
      toast.success("تم حذف القسم بنجاح");
      setDeleteModal({ show: false, item: null });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Delete section error:", err);
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حذف القسم");
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns (TableComponent provides serial row number automatically)
  const columns = [
    { name: "اسم القسم", key: "name" },
    { name: "اسم المدير", key: "managerName" },
    { name: "الوصف", key: "description" },
    { name: "الإجراءات", key: "actions" },
  ];

  // Dropdown options for each row
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

  return (
    <div className="sections-report-container">
      <TableComponent
        key={refreshKey}
        title="تقرير الأقسام والإدارات"
        titleIcon={<FontAwesomeIcon icon={faBuilding} />}
        apiUrl="/sections"
        columns={columns}
        addBtn={true}
        addBtnName="قسم جديد"
        onAddClick={handleOpenAdd}
        dropdownOptions={dropdownOptions}
        searchDate={false}
        triggerReload={refreshKey}
      />

      {/* ── Add / Edit Modal ── */}
      <Modal
        show={showModal}
        onHide={() => !isSubmitting && handleClose()}
        centered
        size="lg"
        dir="rtl"
        dialogClassName="sections-modal"
      >
        <Modal.Header closeButton>
          <div className="sections-modal-title">
            <span className="sections-modal-title-icon">
              <FontAwesomeIcon icon={editingId ? faPenToSquare : faBuilding} />
            </span>
            <span>{editingId ? "تعديل قسم" : "إضافة قسم جديد"}</span>
          </div>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="sections-grid">
              {/* Section Name */}
              <div className="sections-field-group">
                <label className="sections-field-label">
                  اسم القسم <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="sections-input"
                  placeholder="أدخل اسم القسم أو الإدارة"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error.name) setError((prev) => ({ ...prev, name: null }));
                  }}
                />
                {error.name && (
                  <span className="sections-field-error">{error.name}</span>
                )}
              </div>

              {/* Manager Name */}
              <div className="sections-field-group">
                <label className="sections-field-label">اسم المدير</label>
                <select
                  className="sections-select"
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                >
                  <option value="">اختر مدير القسم...</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.jobname ? `(${m.jobname})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Description */}
              <div className="sections-field-group sections-full-width">
                <label className="sections-field-label">وصف القسم</label>
                <textarea
                  rows={3}
                  className="sections-input"
                  placeholder="أدخل وصفاً تفصيلياً لمهام ومسؤوليات القسم..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              className="sections-btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="sections-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner size="sm" animation="border" />
              ) : editingId ? (
                "حفظ التعديلات"
              ) : (
                "حفظ القسم"
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
        dir="rtl"
        dialogClassName="sections-modal"
      >
        <Modal.Header closeButton>
          <div className="sections-modal-title" style={{ color: "#dc3545" }}>
            <span
              className="sections-modal-title-icon"
              style={{ background: "rgba(220, 53, 69, 0.12)", color: "#dc3545" }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </span>
            <span>تأكيد حذف القسم</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <p style={{ margin: 0, fontSize: "15px", color: "#3a2e1d" }}>
            هل أنت متأكد من حذف القسم{" "}
            <strong>"{deleteModal.item?.name}"</strong>؟
          </p>
          <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#8a7a66" }}>
            سيتم نقل سجل القسم إلى سلة المحذوفات.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="sections-btn-secondary"
            onClick={() => setDeleteModal({ show: false, item: null })}
            disabled={isDeleting}
          >
            إلغاء
          </button>
          <button
            type="button"
            className="sections-btn-danger"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner size="sm" animation="border" /> : "حذف نهائي"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SectionsReport;
