import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLandmark,
  faArrowLeft,
  faArrowRight,
  faCloudArrowUp,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import API from "../../../api/axiosConfig";
import "../BenefitAddDetailsUnified.css";

function ForBenefitBank({ initialData, onNext, onPrev, onSaved }) {
  const { id } = useParams();

  const [name, setName] = useState(initialData?.name || "");
  const [branch, setBranch] = useState(initialData?.branch || "");
  const [iban, setIban] = useState(initialData?.iban || "");
  const [file, setFile] = useState(null);
  const [existingUpload, setExistingUpload] = useState(initialData?.upload || null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    if (initialData) {
      if (initialData.name) setName(initialData.name);
      if (initialData.branch) setBranch(initialData.branch);
      if (initialData.iban) setIban(initialData.iban);
      if (initialData.upload) setExistingUpload(initialData.upload);
    }
  }, [initialData]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const formData = new FormData();
    formData.append("name", name);
    formData.append("branch", branch);
    formData.append("iban", iban);
    if (file) {
      formData.append("upload", file);
    }

    try {
      const res = await API.post(`/hcrequest/${id}/banks`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        if (onSaved) {
          onSaved({ name, branch, iban, upload: existingUpload });
        }
        onNext();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || { general: "حدث خطأ أثناء حفظ البيانات البنكية" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bad-card">
      <div className="bad-card-header">
        <div className="bad-card-header-icon">
          <FontAwesomeIcon icon={faLandmark} />
        </div>
        <div>
          <h3 className="bad-card-header-title">البيانات والحساب البنكي</h3>
          <p className="bad-card-header-desc">
            يرجى إدخال بيانات الحساب البنكي للمستفيد لإيداع المساعدات المالية بصورة مباشرة.
          </p>
        </div>
      </div>

      {error.general && (
        <div className="alert alert-danger mb-4" style={{ borderRadius: "12px", fontSize: "14px" }}>
          {error.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bad-grid">
          {/* اسم البنك */}
          <div className="bad-field">
            <label className="bad-label">اسم البنك</label>
            <input
              type="text"
              className="bad-input"
              placeholder="مثال: مصرف الراجحي / البنك الأهلي"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* اسم الفرع */}
          <div className="bad-field">
            <label className="bad-label">الفرع (اختياري)</label>
            <input
              type="text"
              className="bad-input"
              placeholder="مثال: فرع الرياض"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>

          {/* رقم الآيبان */}
          <div className="bad-field bad-grid-full">
            <label className="bad-label">رقم الآيبان (IBAN)</label>
            <input
              type="text"
              className="bad-input"
              placeholder="SA..."
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              style={{ direction: "ltr", textAlign: "right", letterSpacing: "1px" }}
            />
          </div>

          {/* صورة الآيبان أو البطاقة */}
          <div className="bad-field bad-grid-full">
            <label className="bad-label">صورة خطاب الآيبان البنكي أو البطاقة (اختياري)</label>
            <label className={`bad-upload-card ${file || existingUpload ? "has-file" : ""}`}>
              <div className="bad-upload-info">
                <FontAwesomeIcon
                  icon={file || existingUpload ? faCheckCircle : faCloudArrowUp}
                  className="bad-upload-icon"
                  style={{ color: file || existingUpload ? "#2e7d32" : "#b89358" }}
                />
                <div>
                  <p className="bad-upload-title">
                    {file
                      ? file.name
                      : existingUpload
                      ? "تم إرفاق المستند البنكي مسبقاً (اضغط لاختيار ملف جديد إذا رغبت)"
                      : "اضغط لاختيار صورة أو ملف PDF للحساب البنكي"}
                  </p>
                  <p className="bad-upload-sub">صيغ مقبولة: JPG, PNG, PDF (أقصى حجم 10MB)</p>
                </div>
              </div>
              <span className="bad-upload-btn">{file || existingUpload ? "تغيير الملف" : "اختيار ملف"}</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bad-actions">
          {onPrev ? (
            <button type="button" className="bad-btn-prev" onClick={onPrev}>
              <FontAwesomeIcon icon={faArrowRight} />
              <span>السابق</span>
            </button>
          ) : <div />}

          <button type="submit" className="bad-btn-submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <span>حفظ ومتابعة</span>
                <FontAwesomeIcon icon={faArrowLeft} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForBenefitBank;