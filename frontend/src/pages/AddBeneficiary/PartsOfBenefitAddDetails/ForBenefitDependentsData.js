import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleRoof,
  faPlus,
  faTrashAlt,
  faArrowRight,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import API from "../../../api/axiosConfig";
import "../BenefitAddDetailsUnified.css";

const emptyDependent = {
  name: "",
  relation: "ابن",
  gender: "ذكر",
  dateofbirth: "",
  nationalid: "",
  phone: "",
  note: "",
};

function ForBenefitDependentsData({ initialData, onNext, onPrev, onCompleted }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hasDependents, setHasDependents] = useState(
    initialData?.hasDependents !== undefined ? initialData.hasDependents : true
  );
  const [dependents, setDependents] = useState(
    initialData?.dependents && initialData.dependents.length > 0
      ? initialData.dependents
      : [{ ...emptyDependent }]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    if (initialData) {
      if (initialData.hasDependents !== undefined) {
        setHasDependents(initialData.hasDependents);
      }
      if (initialData.dependents && initialData.dependents.length > 0) {
        setDependents(initialData.dependents);
      }
    }
  }, [initialData]);

  const addDependent = () => setDependents([...dependents, { ...emptyDependent }]);
  const removeDependent = (idx) => {
    if (dependents.length > 1) {
      setDependents(dependents.filter((_, i) => i !== idx));
    }
  };
  const updateField = (idx, field, val) => {
    const next = [...dependents];
    next[idx][field] = val;
    setDependents(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const formData = new FormData();

    if (hasDependents) {
      const validDeps = dependents.filter((d) => d.name.trim());
      formData.append("data", JSON.stringify(validDeps));
    } else {
      formData.append("data", JSON.stringify([]));
    }

    try {
      const res = await API.post(`/hcrequest/${id}/dependantdetails`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        if (onCompleted) {
          onCompleted();
        } else {
          alert("تم حفظ بيانات المستفيد بنجاح!");
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || { general: "حدث خطأ أثناء إتمام الطلب" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bad-card">
      <div className="bad-card-header">
        <div className="bad-card-header-icon">
          <FontAwesomeIcon icon={faPeopleRoof} />
        </div>
        <div>
          <h3 className="bad-card-header-title">بيانات أفراد الأسرة والتابعين</h3>
          <p className="bad-card-header-desc">
            تسجيل بيانات التابعين للمستفيد (الزوجة، الأبناء، الوالدين) لحساب استحقاق الأسرة.
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
            هل يوجد تابعون أو أفراد أسرة يعولهم المستفيد؟
          </span>
          <div style={{ display: "flex", gap: "14px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: "700" }}>
              <input
                type="radio"
                name="hasDeps"
                checked={hasDependents}
                onChange={() => setHasDependents(true)}
                style={{ accentColor: "#b89358" }}
              />
              نعم (يوجد تابعون)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: "700" }}>
              <input
                type="radio"
                name="hasDeps"
                checked={!hasDependents}
                onChange={() => setHasDependents(false)}
                style={{ accentColor: "#b89358" }}
              />
              لا (مستفيد فردي فقط)
            </label>
          </div>
        </div>

        {hasDependents && (
          <div>
            {dependents.map((dep, idx) => (
              <div key={idx} className="bad-repeat-item">
                <div className="bad-repeat-header">
                  <span className="bad-repeat-title">التابع #{idx + 1}</span>
                  {dependents.length > 1 && (
                    <button
                      type="button"
                      className="bad-btn-remove"
                      onClick={() => removeDependent(idx)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} /> حذف
                    </button>
                  )}
                </div>

                <div className="bad-grid">
                  <div className="bad-field">
                    <label className="bad-label">اسم التابع بالكامل</label>
                    <input
                      type="text"
                      className="bad-input"
                      placeholder="الاسم الرباعي"
                      value={dep.name}
                      onChange={(e) => updateField(idx, "name", e.target.value)}
                    />
                  </div>

                  <div className="bad-field">
                    <label className="bad-label">صلة القرابة</label>
                    <select
                      className="bad-select"
                      value={dep.relation}
                      onChange={(e) => updateField(idx, "relation", e.target.value)}
                    >
                      <option value="ابن">ابن</option>
                      <option value="ابنة">ابنة</option>
                      <option value="زوجة">زوجة</option>
                      <option value="زوج">زوج</option>
                      <option value="أم">أم</option>
                      <option value="أب">أب</option>
                      <option value="أخت">أخت</option>
                      <option value="أخ">أخ</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>

                  <div className="bad-field">
                    <label className="bad-label">الجنس</label>
                    <select
                      className="bad-select"
                      value={dep.gender}
                      onChange={(e) => updateField(idx, "gender", e.target.value)}
                    >
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>

                  <div className="bad-field">
                    <label className="bad-label">تاريخ الميلاد</label>
                    <input
                      type="date"
                      className="bad-input"
                      value={dep.dateofbirth}
                      onChange={(e) => updateField(idx, "dateofbirth", e.target.value)}
                    />
                  </div>

                  <div className="bad-field">
                    <label className="bad-label">رقم الهوية (اختياري)</label>
                    <input
                      type="text"
                      className="bad-input"
                      placeholder="10 أرقام"
                      value={dep.nationalid}
                      onChange={(e) => updateField(idx, "nationalid", e.target.value)}
                    />
                  </div>

                  <div className="bad-field">
                    <label className="bad-label">رقم الجوال (اختياري)</label>
                    <input
                      type="tel"
                      className="bad-input"
                      placeholder="05XXXXXXXX"
                      value={dep.phone}
                      onChange={(e) => updateField(idx, "phone", e.target.value)}
                    />
                  </div>

                  <div className="bad-field bad-grid-full">
                    <label className="bad-label">ملاحظات التابع</label>
                    <input
                      type="text"
                      className="bad-input"
                      placeholder="أي تفاصيل خاصة (طالب، مريض، موظف...)"
                      value={dep.note}
                      onChange={(e) => updateField(idx, "note", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="bad-btn-add mb-4" onClick={addDependent}>
              <FontAwesomeIcon icon={faPlus} />
              <span>إضافة تابع آخر</span>
            </button>
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

          <button
            type="submit"
            className="bad-btn-submit"
            disabled={isSubmitting}
            style={{
              background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
              boxShadow: "0 4px 14px rgba(46, 125, 50, 0.3)",
            }}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" />
                <span>جاري إرسال الطلب...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>إتمام وإرسال الطلب نهائياً</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForBenefitDependentsData;
