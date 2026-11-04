import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Spinner } from "react-bootstrap";
import TableComponent from "../../../../components/TableComponent";
import ComeLeaveModal from "./ComeLeaveModal";
import API from "../../../../api/axiosConfig";
import { toast } from "react-toastify";
import "./ComeLeave.css";

function ComeLeave() {
  const [showModal, setShowModal] = useState(false);
  const [triggerReload, setTriggerReload] = useState(Date.now());
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const columns = [
    { name: "إسم الموظف", key: "name" },
    { name: "وقت الحضور", key: "att" },
    { name: "وقت الانصراف", key: "dateleave" },
    { name: "التاريخ", key: "recorddate" },
    { name: "طريقة التسجيل", key: "method" },
    { name: "الحالة", key: "statusBadge" },
    { name: "", key: "actions" },
  ];

  const handleSuccess = () => {
    setTriggerReload(Date.now());
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      await API.delete(`/attendances/${deleteModal.id}`);
      toast.success("تم حذف سجل الحضور بنجاح");
      setDeleteModal({ show: false, id: null });
      setTriggerReload(Date.now());
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء حذف السجل");
    } finally {
      setIsDeleting(false);
    }
  };

  const modifyRow = (row) => {
    return {
      ...row,
      statusBadge:
        row.status === "حاضر" || !row.status ? (
          '<span style="background: rgba(40, 167, 69, 0.12); color: #28a745; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 13px;">حاضر</span>'
        ) : (
          `<span style="background: rgba(255, 193, 7, 0.18); color: #b8860b; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 13px;">${row.status}</span>`
        ),
    };
  };

  const dropdownOptions = [
    {
      label: "حذف السجل",
      action: (id) => setDeleteModal({ show: true, id }),
    },
  ];

  return (
    <div className="ComeLeave p-4 rounded shadow-sm" style={{ direction: "rtl" }}>
      <TableComponent
        key={triggerReload}
        apiUrl="/attendances"
        columns={columns}
        data={dummyData}
        title="الحضور والانصراف"
        addBtn={true}
        onAddClick={() => setShowModal(true)}
        dropdownOptions={dropdownOptions}
        triggerReload={triggerReload}
        transformRowFn={modifyRow}
        searchDate={false}
      />
      <ComeLeaveModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />

      {/* مودال تأكيد الحذف */}
      <Modal
        show={deleteModal.show}
        onHide={() => !isDeleting && setDeleteModal({ show: false, id: null })}
        centered
        size="sm"
        dir="rtl"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.1rem", fontWeight: 700 }}>
            تأكيد الحذف
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ margin: 0, fontSize: "14.5px", color: "#493d2c" }}>
            هل أنت متأكد من رغبتك في حذف سجل الحضور هذا؟
          </p>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center", gap: "10px" }}>
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ show: false, id: null })}
            disabled={isDeleting}
          >
            إلغاء
          </Button>
          <Button
            variant="danger"
            style={{ borderRadius: "8px", fontWeight: 600 }}
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner animation="border" size="sm" /> : "حذف"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ComeLeave;
