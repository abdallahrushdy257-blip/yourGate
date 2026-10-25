import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import TableComponent from "../../components/TableComponent";
import ConfirmModal from "../../components/ConfirmModal";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router";

function KPI() {
  const columns = [
    { name: "السؤال", key: "quiz" },
    { name: "القيمة المتوقعة", key: "target" },
    { name: "", key: "actions" },
  ];
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [quiz, setQuiz] = useState("");
  const [target, setTarget] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());

  // Confirm Modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlekpi = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("quiz", quiz);
    formData.append("target", target);

    try {
      const res = await API.post(`/kpi/store`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res;
      if (data.status === 200) {
        setQuiz("");
        setTarget(0);
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
      const res = await API.get(`/kpi/${deleteId}/delete`);
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
    { label: "حذف", action: (id) => handleDeleteClick(id) },
  ];

  return (
    <>
      <div className="printcasedata-container">
        <TableComponent
          apiUrl="/kpi"
          columns={columns}
          title=" مؤشرات الاداء"
          triggerReload={tableReloadKey}
          dropdownOptions={dropdownOptions}
          addBtn={true}
          onAddClick={() => setShowModal(true)}
        />
      </div>

      {/* Add Indicator Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table archModal donor-modal"
        centered
        size="md"
      >
        <Modal.Header>
          <Modal.Title className="w-100 text-center">
            إضافة مؤشر جديد
          </Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handlekpi}>
            <div className="row g-4">
              <div className="col-12">
                <RegisterTextbox
                  label="المؤشر"
                  type="text"
                  value={quiz}
                  onChange={(e) => setQuiz(e.target.value)}
                />
                {error && error.quiz && (
                  <span className="error">{error.quiz[0]}</span>
                )}
              </div>
              <div className="col-12">
                <RegisterTextbox
                  label="القيمة المتوقعة"
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
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
                  حفظ
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
