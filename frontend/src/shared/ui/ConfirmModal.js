import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./ConfirmModal.css";

const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title = "تأكيد الحذف",
  message = "هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.",
  confirmText = "حذف",
  cancelText = "إلغاء",
  isSubmitting = false,
  variant = "danger", // danger or primary
}) => {
  // إذا كانت الحالة false لا نرندر أي شيء
  if (!show) return null;

  return (
    <div className="custom-modal-overlay" onClick={onHide}>
      <div 
        className="custom-modal-container" 
        onClick={(e) => e.stopPropagation()} // منع إغلاق المودال عند الضغط داخله
      >
        {/* Header */}
        <div className="custom-modal-header">
          <div className="header-title">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="warning-icon"
            />
            <span>{title}</span>
          </div>
          <button className="close-icon-btn" onClick={onHide}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Body */}
        <div className="custom-modal-body">
          <p className="message-text">{message}</p>
        </div>

        {/* Footer */}
        <div className="custom-modal-footer">
          <button 
            className="btn-cancel" 
            onClick={onHide} 
            disabled={isSubmitting}
          >
            {cancelText}
          </button>
          
          <button 
            className={`btn-confirm ${variant}`} 
            onClick={onConfirm} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="spinner-mini"></div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;