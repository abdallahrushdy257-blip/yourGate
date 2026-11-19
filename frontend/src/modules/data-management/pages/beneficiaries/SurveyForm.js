import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSave, faUser, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import API from "../../../../api/axiosConfig";
import { getStoredSurveyQuestions } from "../../../settings/pages/Setting/SurveySetting";
import "./Surveys.css";

const SurveyForm = ({ period, humancaseId = null, onSuccess }) => {
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [answers, setAnswers] = useState({}); // { [questionId]: answerValue }

  const [humancase_id, setHumancaseId] = useState(humancaseId || "");
  const [notes, setNotes] = useState("");
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load configured questions from settings
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoadingQuestions(true);
        const list = await getStoredSurveyQuestions();
        if (isMounted) {
          setQuestions(list || []);
        }
      } catch (err) {
        console.error("Failed to load survey questions:", err);
      } finally {
        if (isMounted) setLoadingQuestions(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load beneficiaries for dropdown
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

  const handleAnswerChange = (qId, val) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: val,
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (Object.keys(answers).length === 0) {
      setError("يرجى الإجابة على سؤال واحد على الأقل من أسئلة الاستبيان.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Build survey response payload
      const questionsWithAnswers = questions.map((q) => ({
        id: q.id,
        question: q.question,
        type: q.type,
        answer: answers[q.id] || "—",
      }));

      // Calculate approximate score for backend stats compatibility
      let satisfactionScore = 5;
      const firstAnswer = answers[questions[0]?.id];
      if (firstAnswer === "ممتاز") satisfactionScore = 5;
      else if (firstAnswer === "جيد جداً") satisfactionScore = 4;
      else if (firstAnswer === "جيد") satisfactionScore = 3;
      else if (firstAnswer === "مقبول") satisfactionScore = 2;
      else if (firstAnswer === "ضعيف") satisfactionScore = 1;

      const payload = {
        period: period,
        humancase_id: humancase_id ? parseInt(humancase_id, 10) : null,
        satisfaction_score: satisfactionScore,
        nps_score: satisfactionScore >= 4 ? 9 : satisfactionScore === 3 ? 7 : 4,
        notes: notes,
        answers: questionsWithAnswers,
      };

      // Save locally to keep answers record for table display
      const storedAnswersList = JSON.parse(localStorage.getItem("survey_recorded_submissions") || "[]");
      const newSubmission = {
        id: Date.now(),
        humancase_id: payload.humancase_id,
        humancase_name:
          beneficiaries.find((b) => String(b.id) === String(humancase_id))?.name || "استبيان عام",
        period: period,
        satisfaction_score: satisfactionScore,
        answers: questionsWithAnswers,
        notes: notes,
        submitted_at: new Date().toISOString(),
      };
      storedAnswersList.unshift(newSubmission);
      localStorage.setItem("survey_recorded_submissions", JSON.stringify(storedAnswersList));

      // Also submit to backend API if available
      try {
        await API.post("/surveys", payload);
      } catch (backendErr) {
        // Fallback gracefully
        console.warn("Backend /surveys error:", backendErr);
      }

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
        <span>تسجيل استبيان رضا جديد (بناءً على إعدادات الأسئلة)</span>
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
      <div style={{ marginBottom: "22px" }}>
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
            maxWidth: "460px",
          }}
          value={humancase_id}
          onChange={(e) => setHumancaseId(e.target.value)}
        >
          <option value="">-- استبيان عام (بدون تحديد مستفيد) --</option>
          {beneficiaries.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} {b.idnumber ? `(هوية: ${b.idnumber})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Questions Loaded From Settings */}
      {loadingQuestions ? (
        <div style={{ textAlign: "center", padding: "30px" }}>
          <Spinner animation="border" variant="warning" size="sm" />
          <span style={{ marginRight: "10px", fontSize: "14px", color: "#8a7558" }}>
            جاري تحميل أسئلة الاستبيان من الإعدادات...
          </span>
        </div>
      ) : questions.length === 0 ? (
        <div
          style={{
            background: "#fff9f0",
            border: "1.5px dashed #e8cda6",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
            color: "#835f29",
            marginBottom: "20px",
          }}
        >
          لم يتم تحديد أسئلة في الإعدادات بعد. يرجى التوجه إلى <strong>الإعدادات &gt; أسئلة استبيان المستفيدين</strong> لإضافة الأسئلة.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "22px", marginBottom: "24px" }}>
          {questions.map((q, idx) => (
            <div
              key={q.id || idx}
              style={{
                border: "1px solid #ebdccb",
                borderRadius: "14px",
                padding: "18px 20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "15px",
                  fontWeight: "700",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    background: "#ebdccb",
                    color: "#54432c",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    marginLeft: "8px",
                    fontSize: "13px",
                  }}
                >
                  {idx + 1}
                </span>
                {q.question}
              </label>

              {q.type === "choice" ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {(q.options || []).map((opt, optIdx) => {
                    const isSelected = answers[q.id] === opt;
                    return (
                      <button
                        type="button"
                        key={optIdx}
                        onClick={() => handleAnswerChange(q.id, opt)}
                        style={{
                          background: isSelected ? "#b89358" : "#ffffff",
                          color: isSelected ? "#ffffff" : "#493b2a",
                          border: isSelected ? "1.5px solid #b89358" : "1.5px solid #d8cabd",
                          padding: "8px 18px",
                          borderRadius: "10px",
                          fontSize: "14px",
                          fontWeight: isSelected ? "700" : "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {isSelected && <FontAwesomeIcon icon={faCheck} style={{ marginLeft: "6px" }} />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  className="form-control"
                  style={{
                    borderRadius: "10px",
                    border: "1.5px solid #d8cabd",
                    padding: "10px 14px",
                    fontSize: "14px",
                  }}
                  rows={2}
                  placeholder="اكتب إجابتك هنا..."
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* General Notes */}
      <div style={{ marginBottom: "24px" }}>
        <label className="survey-field-lbl">ملاحظات أو تعليقات إضافية (اختياري)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="أي ملاحظات أو تفاصيل إضافية..."
          rows={3}
          className="survey-textarea"
        />
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", justifyContent: "flex-start", gap: "12px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || questions.length === 0}
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