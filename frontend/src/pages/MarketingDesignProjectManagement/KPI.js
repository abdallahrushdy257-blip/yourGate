import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faPlus, faXmark, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import TableComponent from "../../components/TableComponent";
import ConfirmModal from "../../components/ConfirmModal";
import API from "../../api/axiosConfig";
import { toast } from "react-toastify";

function KPI() {
  const columns = [
    { name: "المؤشر / السؤال", key: "quiz" },
    { name: "القيمة المستهدفة", key: "target_display" },
    { name: "", key: "actions" },
  ];

  const [error, setError] = useState({});
  const [quiz, setQuiz] = useState("");
  const [target, setTarget] = useState(100);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());

  // Confirm Modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetForm = () => {
    setQuiz("");
    setTarget(100);
    setEditId(null);
    setError({});
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditClick = (record) => {
    setEditId(record.id);
    setQuiz(record.quiz || "");
    setTarget(record.target !== undefined ? record.target : 100);
    setError({});
    setShowModal(true);
  };

  const handlekpi = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const payload = {
      quiz: quiz,
      target: Number(target) || 0,
    };

    try {
      let res;
      if (editId) {
        res = await API.post(`/kpi/${editId}/update`, payload);
      } else {
        res = await API.post(`/kpi/store`, payload);
      }

      if (res.status === 200 || res.status === 201) {
        toast.success(editId ? "تم تحديث المؤشر بنجاح" : "تمت إضافة المؤشر بنجاح");
        resetForm();
        setShowModal(false);
        setTableReloadKey(Date.now());
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || {});
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حفظ المؤشر");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await API.get(`/kpi/${deleteId}/delete`);
      if (res.status === 200 || res.status === 204) {
        toast.success("تم حذف المؤشر بنجاح");
        setTableReloadKey(Date.now());
        setShowConfirm(false);
      }
    } catch (err) {
      console.error("Error deleting KPI:", err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حذف المؤشر");
    } finally {
      setIsDeleting(false);
    }
  };

  const dropdownOptions = [
    { label: "تعديل", action: (id, record) => handleEditClick(record) },
    { label: "حذف", action: (id) => handleDeleteClick(id) },
  ];

  const transformRowFn = (record) => ({
    ...record,
    target_display: `${record.target !== undefined ? record.target : 100} %`,
  });

  return (
    <>
      <div className="printcasedata-container">
        <TableComponent
          apiUrl="/kpi"
          columns={columns}
          title="مؤشرات الأداء المعيارية"
          triggerReload={tableReloadKey}
          dropdownOptions={dropdownOptions}
          transformRowFn={transformRowFn}
          addBtn={true}
          onAddClick={handleOpenAdd}
        />
      </div>

      {/* Add / Edit Indicator Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table archModal donor-modal"
        centered
        size="md"
        dir="rtl"
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center fw-bold">
            {editId ? "تعديل مؤشر الأداء" : "إضافة مؤشر أداء جديد"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handlekpi}>
            <div className="row g-3">
              <div className="col-12">
                <RegisterTextbox
                  label="نص المؤشر / السؤال"
                  type="text"
                  value={quiz}
                  onChange={(e) => setQuiz(e.target.value)}
                  placeholder="مثال: نسبة الالتزام بالجدول الزمني للمشروع"
                  required
                />
                {error && error.quiz && (
                  <span className="error">{error.quiz[0]}</span>
                )}
              </div>
              <div className="col-12">
                <RegisterTextbox
                  label="القيمة المستهدفة (%)"
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  min={0}
                  max={100}
                  required
                />
                {error && error.target && (
                  <span className="error">{error.target[0]}</span>
                )}
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-center gap-2">
              {isSubmitting ? (
                <Button
                  className="premium-btn primary"
                  disabled
                  style={{ minWidth: "120px" }}
                >
                  <Spinner animation="border" size="sm" />
                </Button>
              ) : (
                <Button
                  className="premium-btn primary"
                  type="submit"
                  style={{ minWidth: "120px" }}
                >
                  {editId ? "حفظ التعديلات" : "إضافة المؤشر"}
                </Button>
              )}
              <Button
                className="premium-btn secondary"
                onClick={() => setShowModal(false)}
                style={{ minWidth: "120px" }}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        isSubmitting={isDeleting}
        title="تأكيد حذف المؤشر"
        message="هل أنت متأكد من حذف هذا المؤشر؟ لا يمكن التراجع عن هذا الإجراء."
      />
    </>
  );
}

export default KPI;
