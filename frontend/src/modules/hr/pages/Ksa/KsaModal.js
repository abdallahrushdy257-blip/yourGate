import { Modal } from "react-bootstrap";
import KsaForm from "./KsaForm";

const KsaModal = ({ show, handleClose, onSuccess, initialData, period }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "تعديل تقييم KSA" : "إضافة تقييم KSA جديد"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <KsaForm
          period={period}
          initialData={initialData}
          onSuccess={() => {
            handleClose();
            if (onSuccess) onSuccess();
          }}
        />
      </Modal.Body>
    </Modal>
  );
};

export default KsaModal;
