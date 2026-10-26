import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeartPulse,
  faPlus,
  faTrashAlt,
  faArrowLeft,
  faArrowRight,
  faCloudArrowUp,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import API from "../../../api/axiosConfig";
import "../BenefitAddDetailsUnified.css";

const emptyIllness = {
  name: "",
  type: "مزمن",
  degree: "متوسطة",
  notes: "",
  trtype: "",
  trcost: "",
};

function ForBenefitHealthData({ initialData, onNext, onPrev, onSaved }) {
  const { id } = useParams();

  const [hasHealthIssues, setHasHealthIssues] = useState(initialData?.hasHealthIssues || false);
  const [illnesses, setIllnesses] = useState(
    initialData?.illnesses && initialData.illnesses.length > 0
      ? initialData.illnesses
      : [{ ...emptyIllness }]
  );
  const [upload, setUpload] = useState(null);
  const [existingUpload, setExistingUpload] = useState(initialData?.upload || null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    if (initialData) {
      if (initialData.hasHealthIssues !== undefined) {
        setHasHealthIssues(initialData.hasHealthIssues);
      }
      if (initialData.illnesses && initialData.illnesses.length > 0) {
        setIllnesses(initialData.illnesses);
      }
      if (initialData.upload) {
        setExistingUpload(initialData.upload);
      }
    }
  }, [initialData]);

  const addIllness = () => setIllnesses([...illnesses, { ...emptyIllness }]);
  const removeIllness = (idx) => {
    if (illnesses.length > 1) {
      setIllnesses(illnesses.filter((_, i) => i !== idx));
    }
  };
  const updateField = (idx, field, val) => {
    const next = [...illnesses];
    next[idx][field] = val;
    setIllnesses(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const formData = new FormData();

    if (hasHealthIssues) {
      const validIllnesses = illnesses.filter((item) => item.name.trim());
      formData.append("illness", JSON.stringify(validIllnesses));
      if (upload) {
        formData.append("upload", upload);
      }
    } else {
      formData.append("illness", JSON.stringify([]));
    }

    try {
      const res = await API.post(`/hcrequest/${id}/healthdetails`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        if (onSaved) {
          onSaved({
            hasHealthIssues,
            illnesses,
            upload: existingUpload,
          });
        }
        onNext();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || { general: "حدث خطأ أثناء حفظ البيانات الصحية" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bad-card">
      <div className="bad-card-header">
        <div className="bad-card-header-icon">
          <FontAwesomeIcon icon={faHeartPulse} />
        </div>
        <div>
          <h3 className="bad-card-header-title">الحالة الصحية للأفراد</h3>
          <p className="bad-card-header-desc">
            تسجيل الأمراض المزمنة، الإعاقات، وتكاليف العلاج الشهري لتقديم الدعم الطبي.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Toggle Question */}
        <div
          style={{
            background: "#faf7f2",
            border: "1.5px solid #e8decb",
            borderRadius: "14px",
            padding: "18px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span style={{ fontWeight: "700", color: "#382f22", fontSize: "14.5px" }}>
            هل يعاني المستفيد أو أحد أفراد الأسرة من أمراض مزمنة أو إعاقات تتطلب علاجاً؟
          </span>
          <div style={{ display: "flex", gap: "14px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: "700" }}>
              <input
                type="radio"
                name="hasHealth"
                checked={hasHealthIssues}
                onChange={() => setHasHealthIssues(true)}
                style={{ accentColor: "#b89358" }}
              />
              نعم
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: "700" }}>
              <input
                type="radio"
                name="hasHealth"
                checked={!hasHealthIssues}
                onChange={() => setHasHealthIssues(false)}
                style={{ accentColor: "#b89358" }}
              />
              لا (صحة جيدة)
            </label>
          </div>
        </div>

        {hasHealthIssues && (
          <div>
            {illnesses.map((item, idx) => (
              <div key={idx} className="bad-repeat-item">
                <div className="bad-repeat-header">
                  <span className="bad-repeat-title">الحالة الصحية / المرض #{idx + 1}</span>
                  {illnesses.length > 1 && (
                    <button
                      type="button"
                      className="bad-btn-remove"
                      onClick={() => removeIllness(idx)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} /> حذف
                    </button>
                  )}
                </div>

                <div className="bad-grid">
                  <div className="bad-field">
                    <label className="bad-label">اسم المرض أو الإعاقة</label>
                    <input
                      type="text"
                      className="bad-input"
                      placeholder="مثال: سكري / ضغط / فشل كلوي..."
                      value={item.name}
                      onChange={(e) => updateField(idx, "name", e.target.value)}
                    />
                  </div>

                  <div className="bad-field">
                    <label className="bad-label">تصنيف المرض</label>
                    <select
                      className="bad-select"
                      value={item.type}
                      onChange={(e) => updateField(idx, "type", e.target.value)}
                    >
                      <option value="مزمن">مزمن</option>
                      <option value="وراثي">وراثي</option>
                      <option value="إعاقة حركية">إعاقة حركية</option>
                      <option value="إعاقة بصرية">إعاقة بصرية</option>
                      <option value="إعاقة سمعية">إعاقة سمعية</option>
                      <option value="إعاقة ذهنية">إعاقة ذهنية</option>
                      <option value="عارض">عارض / مؤقت</option>
                    </select>
                  </div>

                  <div className="bad-field">
                    <label className="bad-label">درجة الحالة</label>
                    <select
                      className="bad-select"
                      value={item.degree}
                      onChange={(e) => updateField(idx, "degree", e.target.value)}
                    >
                      <option value="بسيطة">بسيطة</option>
                      <option value="متوسطة">متوسطة</option>
                      <option value="حرجة">حرجة / متقدمة</option>
                    </select>
                  </div>

                  <div className="bad-field">
                    <label className="bad-label">نوع العلاج أو المستلزمات</label>
                    <input
                      type="text"
                      className="bad-input"
                      placeholder="مثال: أدوية شهرية / جلسات غسيل"
                      value={item.trtype}
                      onChange={(e) => updateField(idx, "trtype", e.target.value)}
                    />
                  </div>

                  <div className="bad-field">
                    <label className="bad-label">تكلفة العلاج الشهرية (ريال)</label>
                    <input
                      type="number"
                      className="bad-input"
                      placeholder="0.00"
                      value={item.trcost}
                      onChange={(e) => updateField(idx, "trcost", e.target.value)}
                    />
                  </div>

                  <div className="bad-field">
                    <label className="bad-label">ملاحظات طبية</label>
                    <input
                      type="text"
                      className="bad-input"
                      placeholder="تفاصيل إضافية..."
                      value={item.notes}
                      onChange={(e) => updateField(idx, "notes", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="bad-btn-add mb-4" onClick={addIllness}>
              <FontAwesomeIcon icon={faPlus} />
              <span>إضافة حالة صحية أخرى</span>
            </button>

            {/* Medical Report Upload */}
            <div className="bad-field mb-4">
              <label className="bad-label">صورة التقرير الطبي أو المشهد الصحي (اختياري)</label>
              <label className={`bad-upload-card ${upload ? "has-file" : ""}`}>
                <div className="bad-upload-info">
                  <FontAwesomeIcon
                    icon={upload ? faCheckCircle : faCloudArrowUp}
                    className="bad-upload-icon"
                    style={{ color: upload ? "#2e7d32" : "#b89358" }}
                  />
                  <div>
                    <p className="bad-upload-title">
                      {upload ? upload.name : "تقرير المستشفى أو مشهد التأهيل الشامل"}
                    </p>
                    <p className="bad-upload-sub">JPG, PNG, PDF</p>
                  </div>
                </div>
                <span className="bad-upload-btn">{upload ? "تغيير" : "اختيار"}</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => e.target.files && setUpload(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>
        )}

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

export default ForBenefitHealthData;
