import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSave, faUser } from "@fortawesome/free-solid-svg-icons";
import API from "../../../api/axiosConfig";
import "./Surveys.css";

const SATISFACTION_LABELS = {
  1: { label: "سيء جداً", emoji: "😞" },
  2: { label: "سيء", emoji: "😕" },
  3: { label: "مقبول", emoji: "😐" },
  4: { label: "جيد", emoji: "😊" },
  5: { label: "ممتاز", emoji: "😄" },
};

const SurveyForm = ({ period, humancaseId = null, onSuccess }) => {
  const [form, setForm] = useState({
    satisfaction_score: null,
    nps_score: null,
    notes: "",
    period: period,
    humancase_id: humancaseId || "",
  });

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchBeneficiaries = async () => {
      try {
        setLoadingBeneficiaries(true);
        const res = await API.get("/humancases");
        if (isMounted && res.data) {
          const list = Array.isArray(res.data) ? res.data : res.data.data || [];
          setBeneficiaries(list);
        }
      } catch (err) {
        console.error("Failed to load beneficiaries for survey:", err);
      } finally {
        if (isMounted) setLoadingBeneficiaries(false);
      }
    };

    fetchBeneficiaries();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.satisfaction_score && form.nps_score === null) {
      setError("يرجى اختيار مستوى الرضا أو درجة الترشيح (NPS) على الأقل.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        humancase_id: form.humancase_id ? parseInt(form.humancase_id, 10) : null,
      };
      await API.post("/surveys", payload);
      onSuccess?.();
    } catch (e) {
      setError(e.response?.data?.message ?? "حدث خطأ أثناء حفظ الاستبيان.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="survey-form-box">
      <div className="survey-form-title">
        <span className="indicator"></span>
        <span>تسجيل استبيان رضا جديد</span>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#ffebee",
            border: "1px solid #ef9a9a",
            color: "#c62828",
            borderRadius: "12px",
            padding: "10px 16px",
            fontSize: "13.5px",
            fontWeight: "600",
            marginBottom: "18px",
          }}
        >
          {error}
        </div>
      )}

      {/* Select Beneficiary (Optional) */}
      <div style={{ marginBottom: "20px" }}>
        <label className="survey-field-lbl">
          <FontAwesomeIcon icon={faUser} style={{ marginLeft: "6px", color: "#b89358" }} />
          المستفيد (اختياري)
        </label>
        <select
          className="form-select"
          style={{
            borderRadius: "12px",
            border: "1.5px solid #dcd1be",
            padding: "10px 14px",
            fontSize: "14px",
            maxWidth: "420px",
          }}
          value={form.humancase_id}
          onChange={(e) => setForm((f) => ({ ...f, humancase_id: e.target.value }))}
        >
          <option value="">-- استبيان عام (بدون تحديد مستفيد) --</option>
          {beneficiaries.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} {b.idnumber ? `(هوية: ${b.idnumber})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* تقييم الرضا 1-5 */}
      <div style={{ marginBottom: "24px" }}>
        <label className="survey-field-lbl">مستوى الرضا العام عن الخدمة</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {[1, 2, 3, 4, 5].map((score) => {
            const isSelected = form.satisfaction_score === score;
            return (
              <button
                type="button"
                key={score}
                onClick={() => setForm((f) => ({ ...f, satisfaction_score: score }))}
                className={`survey-emoji-btn ${isSelected ? "active" : ""}`}
              >
                <span className="survey-emoji-icon">{SATISFACTION_LABELS[score].emoji}</span>
                <span className="survey-emoji-text">{SATISFACTION_LABELS[score].label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* NPS 0-10 */}
      <div style={{ marginBottom: "24px" }}>
        <label className="survey-field-lbl">ما مدى ترشيحك لخدماتنا للآخرين؟</label>
        <p style={{ color: "#7a6e5d", fontSize: "12.5px", margin: "0 0 10px" }}>
          (0 = لن أرشح أبداً • 10 = سأرشح بالتأكيد)
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          {[...Array(11)].map((_, i) => {
            const isSelected = form.nps_score === i;
            const isDetractor = i <= 6;
            const isPassive = i >= 7 && i <= 8;

            let borderColor = isDetractor ? "#fca5a5" : isPassive ? "#fde68a" : "#86efac";
            let color = isDetractor ? "#dc2626" : isPassive ? "#d97706" : "#16a34a";
            let bg = "#ffffff";

            if (isSelected) {
              bg = isDetractor ? "#dc2626" : isPassive ? "#d97706" : "#16a34a";
              color = "#ffffff";
              borderColor = bg;
            }

            return (
              <button
                type="button"
                key={i}
                onClick={() => setForm((f) => ({ ...f, nps_score: i }))}
                className="survey-nps-btn"
                style={{
                  backgroundColor: bg,
                  borderColor: borderColor,
                  color: color,
                }}
              >
                {i}
              </button>
            );
          })}
        </div>

        {/* NPS Legend */}
        <div style={{ display: "flex", gap: "16px", marginTop: "10px", fontSize: "12px", color: "#7a6e5d" }}>
          <span><span style={{ color: "#dc2626" }}>■</span> منتقد (0-6)</span>
          <span><span style={{ color: "#d97706" }}>■</span> محايد (7-8)</span>
          <span><span style={{ color: "#16a34a" }}>■</span> مروّج (9-10)</span>
        </div>
      </div>

      {/* ملاحظات */}
      <div style={{ marginBottom: "24px" }}>
        <label className="survey-field-lbl">ملاحظات أو مقترحات (اختياري)</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          placeholder="أي تعليقات أو مقترحات تود إضافتها..."
          rows={3}
          className="survey-textarea"
        />
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", justifyContent: "flex-start", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="survey-btn-submit"
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} />
              <span>حفظ الاستبيان</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SurveyForm;