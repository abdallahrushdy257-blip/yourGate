import { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faTimes } from "@fortawesome/free-solid-svg-icons";

function UploadInput(props) {
  const [fileInfo, setFileInfo] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isImage, setIsImage] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileInfo(file.name);
      if (file.type.startsWith("image/")) {
        setIsImage(true);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setIsImage(false);
        setPreviewUrl("");
      }
    } else {
      setFileInfo("");
      setPreviewUrl("");
      setIsImage(false);
    }

    if (props.onChange) {
      props.onChange(event);
    }
  };

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFileInfo("");
    setPreviewUrl("");
    setIsImage(false);

    if (props.onChange) {
      props.onChange({ target: { files: [] } });
    }
  };

  return (
    <Form.Group
      className="responParent"
      controlId={props.id}
      style={{ width: "100%", ...props.parentStyle }}
    >
      {props.label && (
        <Form.Label
          className="register-label"
          style={{
            direction: "rtl",
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "600",
            textAlign: "right",
          }}
        >
          {props.label} {props.required && <span style={{ color: "red" }}>*</span>}
        </Form.Label>
      )}

      <Form.Label
        htmlFor={props.id}
        className="register-input styled-input"
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          height: "45px",
          borderRadius: "25px",
          border: "1.5px solid var(--border-color, #c29a64)",
          backgroundColor: "var(--input-bg, transparent)",
          color: "var(--text-color, #333)",
          margin: 0,
          width: "100%",
          direction: "rtl",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            opacity: fileInfo ? 1 : 0.6,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "calc(100% - 50px)",
          }}
        >
          {fileInfo || "اضغط لاختيار ملف..."}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isImage && previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: "28px",
                height: "28px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "1px solid var(--primary-color, #c29a64)",
              }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faFile}
              style={{ color: "var(--primary-color, #c29a64)", fontSize: "15px" }}
            />
          )}
          {fileInfo && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClearFile();
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#e63946",
                cursor: "pointer",
                padding: "0 4px",
                fontSize: "14px",
              }}
              title="إزالة الملف"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
      </Form.Label>

      <Form.Control
        type="file"
        id={props.id}
        style={{ display: "none" }}
        onChange={handleFileChange}
        ref={fileInputRef}
        accept="image/*,application/pdf"
      />

      {props.error && (
        <div className="error" style={{ marginTop: "5px", color: "red", fontSize: "12px", textAlign: "right" }}>
          {props.error}
        </div>
      )}
    </Form.Group>
  );
}

export default UploadInput;