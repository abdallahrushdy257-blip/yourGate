import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../../components/title";
import "./jobTitle.css";
import {
  faUsers,
  faBriefcase,
  faPenToSquare,
  faTrash,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import { Form, Modal, Spinner } from "react-bootstrap";
import API from "../../../../api/axiosConfig";
import TableComponent from "../../../../components/TableComponent";
import { toast } from "react-toastify";

function Jobtitle() {
  // ── Modal states ──
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Form fields ──
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [note, setNote] = useState("");
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Table reload trigger ──
  const [refreshKey, setRefreshKey] = useState(0);

  // Open modal for Create
  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setDays(0);
    setHours(0);
    setNote("");
    setError({});
    setShowModal(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (record) => {
    setEditingId(record.id);
    setName(record.title || record.name || "");
    setDescription(record.description || "");
    setDays(record.workdayspermonth ?? record.days ?? 0);
    setHours(record.workhoursperday ?? record.hours ?? 0);
    setNote(record.note || "");
    setError({});
    setShowModal(true);
  };

  // Close form modal
  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setName("");
    setDescription("");
    setDays(0);
    setHours(0);
    setNote("");
    setError({});
  };

  // Submit form (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError({ name: "اسم المسمى الوظيفي مطلوب" });
      return;
    }

    setIsSubmitting(true);
    const mFormData = new FormData();
    mFormData.append("name", name.trim());
    mFormData.append("description", description || "");
    mFormData.append("days", days || 0);
    mFormData.append("hours", hours || 0);
    mFormData.append("note", note || "");

    try {
      if (editingId) {
        mFormData.append("id", editingId);
        await API.post("/jobtitle/update", mFormData);
        toast.success("تم تحديث المسمى الوظيفي بنجاح");
      } else {
        await API.post("/jobtitle/store", mFormData);
        toast.success("تم إضافة المسمى الوظيفي بنجاح");
      }
      handleClose();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Save job title error:", err);
      const validationErrors = err?.response?.data?.errors || {};
      setError(validationErrors);
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!deleteModal.item) return;
    setIsDeleting(true);
    try {
      await API.delete(`/jobtitle/${deleteModal.item.id}`);
      toast.success("تم حذف المسمى الوظيفي بنجاح");
      setDeleteModal({ show: false, item: null });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Delete job title error:", err);
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حذف المسمى");
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns
  const columns = [
    { name: "المسمى الوظيفي", key: "title" },
    { name: "الوصف", key: "description" },
    { name: "المهام الوظيفية", key: "note" },
    { name: "أيام العمل / شهر", key: "workdayspermonth" },
    { name: "ساعات العمل / يوم", key: "workhoursperday" },
    { name: "الإجراءات", key: "actions" },
  ];

  // Transform row for TableComponent rendering
  const transformRowFn = (row) => ({ ...row });

  // Dropdown options for each table row
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
    <>
      <div className="jobtitle-page-container">
        <Title
          title="المسميات الوظيفية"
          icon={<FontAwesomeIcon icon={faUsers} />}
          style={{ width: "unset" }}
        />

        <TableComponent
          key={refreshKey}
          apiUrl="/jobtitle"
          columns={columns}
          addBtn={true}
          addBtnName="مسمى وظيفي"
          onAddClick={handleOpenAdd}
          transformRowFn={transformRowFn}
          dropdownOptions={dropdownOptions}
          triggerReload={refreshKey}
        />
      </div>

      {/* ── Add / Edit Modal ── */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        size="lg"
        dir="rtl"
        dialogClassName="jobtitle-modal"
      >
        <Modal.Header closeButton>
          <div className="jobtitle-modal-title">
            <span className="jobtitle-modal-title-icon">
              <FontAwesomeIcon icon={editingId ? faPenToSquare : faBriefcase} />
            </span>
            <span>{editingId ? "تعديل مسمى وظيفي" : "إضافة مسمى وظيفي"}</span>
          </div>
        </Modal.Header>

        <Modal.Body>
          <Form id="jobtitle-modal-form" onSubmit={handleSubmit}>
            <div className="jobtitle-grid">
              {/* Job Title Name */}
              <div>
                <RegisterTextbox
                  parentStyle={{ width: "100%" }}
                  id="name"
                  label="اسم المسمى الوظيفي"
                  type="text"
                  stylee={{ width: "100%" }}
                  name="name"
                  value={name}
                  required={true}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error?.name) setError((prev) => ({ ...prev, name: null }));
                  }}
                />
                {error?.name && (
                  <span className="jobtitle-field-error">{error.name}</span>
                )}
              </div>

              {/* Description */}
              <div>
                <RegisterTextbox
                  parentStyle={{ width: "100%" }}
                  id="jobDesc"
                  label="وصف المسمى الوظيفي"
                  type="text"
                  stylee={{ width: "100%" }}
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {error?.description && (
                  <span className="jobtitle-field-error">{error.description}</span>
                )}
              </div>

              {/* Work days */}
              <div>
                <RegisterTextbox
                  parentStyle={{ width: "100%" }}
                  id="days"
                  label="عدد أيام الدوام في الشهر"
                  type="number"
                  stylee={{ width: "100%" }}
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                />
                {error?.days && (
                  <span className="jobtitle-field-error">{error.days}</span>
                )}
              </div>

              {/* Work hours */}
              <div>
                <RegisterTextbox
                  parentStyle={{ width: "100%" }}
                  id="hours"
                  label="عدد ساعات العمل اليومية"
                  type="number"
                  stylee={{ width: "100%" }}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
                {error?.hours && (
                  <span className="jobtitle-field-error">{error.hours}</span>
                )}
              </div>

              {/* Job Notes / Responsibilities */}
              <div className="jobtitle-full-width">
                <RegisterTextbox
                  parentStyle={{ width: "100%" }}
                  id="note"
                  label="المهام الوظيفية / ملاحظات"
                  type="text"
                  stylee={{ width: "100%" }}
                  name="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                {error?.note && (
                  <span className="jobtitle-field-error">{error.note}</span>
                )}
              </div>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="jobtitle-btn-cancel"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            إلغاء
          </button>
          <button
            type="submit"
            form="jobtitle-modal-form"
            className="jobtitle-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner size="sm" animation="border" />
            ) : editingId ? (
              "حفظ التعديلات"
            ) : (
              "حفظ المسمى"
            )}
          </button>
        </Modal.Footer>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        show={deleteModal.show}
        onHide={() => !isDeleting && setDeleteModal({ show: false, item: null })}
        centered
        dir="rtl"
        dialogClassName="jobtitle-modal"
      >
        <Modal.Header closeButton>
          <div className="jobtitle-modal-title" style={{ color: "#dc3545" }}>
            <span
              className="jobtitle-modal-title-icon"
              style={{ background: "rgba(220, 53, 69, 0.12)", color: "#dc3545" }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </span>
            <span>تأكيد الحذف</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <p style={{ margin: 0, fontSize: "15px", color: "#3a2e1d" }}>
            هل أنت متأكد من حذف المسمى الوظيفي{" "}
            <strong>"{deleteModal.item?.title || deleteModal.item?.name}"</strong>؟
          </p>
          <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#8a7a66" }}>
            لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="jobtitle-btn-cancel"
            onClick={() => setDeleteModal({ show: false, item: null })}
            disabled={isDeleting}
          >
            إلغاء
          </button>
          <button
            type="button"
            className="jobtitle-btn-danger"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner size="sm" animation="border" /> : "حذف نهائي"}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Jobtitle;
