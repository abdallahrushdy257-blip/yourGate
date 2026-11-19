import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faTimes, faFilePdf } from "@fortawesome/free-solid-svg-icons";

function detectFileType(urlOrName, mimeType) {
  if (mimeType) {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType === "application/pdf") return "pdf";
  }
  if (urlOrName && typeof urlOrName === "string") {
    const clean = urlOrName.toLowerCase().split("?")[0];
    if (clean.endsWith(".pdf")) return "pdf";
    if (/\.(jpe?g|png|gif|webp|svg)$/i.test(clean)) return "image";
  }
  return "file";
}

function UploadInput(props) {
  const [fileInfo, setFileInfo] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileType, setFileType] = useState("file"); // "image" | "pdf" | "file"
  const fileInputRef = useRef(null);

  useEffect(() => {
    const url = props.defaultUrl || (typeof props.value === "string" ? props.value : "");
    if (url) {
      setPreviewUrl(url);
      const type = detectFileType(url);
      setFileType(type);
      try {
        const cleanName = decodeURIComponent(url.split("/").pop().split("?")[0]);
        setFileInfo(cleanName || (type === "pdf" ? "ملف PDF" : "ملف مرفوع"));
      } catch {
        setFileInfo(type === "pdf" ? "ملف PDF" : "ملف مرفوع");
      }
    } else if (!fileInputRef.current?.files?.length) {
      setPreviewUrl("");
      setFileInfo("");
      setFileType("file");
    }
  }, [props.defaultUrl, props.value]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 1) {
      setFileInfo(`تم اختيار ${files.length} ملفات`);
      setPreviewUrl("");
      setFileType("file");
    } else if (files && files.length === 1) {
      const file = files[0];
      setFileInfo(file.name);
      const type = detectFileType(file.name, file.type);
      setFileType(type);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFileInfo("");
      setPreviewUrl("");
      setFileType("file");
    }

    if (props.onChange) {
      props.onChange(event);
    }
  };

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setFileInfo("");
    setPreviewUrl("");
    setFileType("file");

    if (props.onChange) {
      props.onChange({ target: { files: [] } });
    }
    if (props.onClear) {
      props.onClear();
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
            maxWidth: "calc(100% - 70px)",
          }}
        >
          {fileInfo || "اضغط لاختيار ملف..."}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {fileType === "image" && previewUrl ? (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="معاينة الصورة"
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "28px",
                  height: "28px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "1.5px solid var(--primary-color, #c29a64)",
                  cursor: "pointer",
                }}
              />
            </a>
          ) : fileType === "pdf" && previewUrl ? (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="عرض ملف PDF في نافذة جديدة"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                backgroundColor: "#e63946",
                color: "#ffffff",
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: "bold",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <FontAwesomeIcon icon={faFilePdf} />
              <span>PDF</span>
            </a>
          ) : (
            <FontAwesomeIcon
              icon={faFile}
              style={{ color: "var(--primary-color, #c29a64)", fontSize: "16px" }}
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
        multiple={props.multiple}
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