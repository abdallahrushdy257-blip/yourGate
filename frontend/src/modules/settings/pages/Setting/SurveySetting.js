import React, { useState, useEffect } from "react";
import SettingTabs from "./SettingTabs";
import "./setting.css";
import SelectComponent from "../../../../components/SelectComponent";
import { Form, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPoll,
  faPlus,
  faTrashAlt,
  faSave,
  faCheckCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import API from "../../../../api/axiosConfig";

const STORAGE_KEY = "beneficiary_survey_questions";

const DEFAULT_QUESTIONS = [
  {
    id: 1,
    question: "ما مدى رضاك عن سرعة استجابة الجمعية لطلبك؟",
    type: "choice", // 'choice' or 'rating' or 'text'
    options: ["ممتاز", "جيد جداً", "جيد", "مقبول", "ضعيف"],
  },
  {
    id: 2,
    question: "كيف تقيّم تعامل موظفي الجمعية معك؟",
    type: "choice",
    options: ["ممتاز", "جيد جداً", "جيد", "مقبول", "ضعيف"],
  },
  {
    id: 3,
    question: "هل ساهمت المساعدات المقدمة في تحسين وضعك المعيشي؟",
    type: "choice",
    options: ["نعم وبشكل كبير", "نعم إلى حد ما", "لا لم تؤثر"],
  },
  {
    id: 4,
    question: "ما مدى ترشيحك لخدمات الجمعية للآخرين؟",
    type: "choice",
    options: ["أرشح بشدة", "أرشح", "محايد", "لا أرشح"],
  },
  {
    id: 5,
    question: "هل لديك أي مقترحات أو شكاوى لتحسين خدماتنا؟",
    type: "text",
    options: [],
  },
];

export const getStoredSurveyQuestions = async () => {
  try {
    const res = await API.get("/settings/survey-questions").catch(() => null);
    if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (e) {
    // fallback
  }

  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  return DEFAULT_QUESTIONS;
};

export const saveStoredSurveyQuestions = async (questions) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  try {
    await API.post("/settings/survey-questions", { questions }).catch(() => null);
  } catch (e) {}
};

function SurveySetting() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const list = await getStoredSurveyQuestions();
      setQuestions(list);
      setLoading(false);
    })();
  }, []);

  const handleAddQuestion = () => {
    const newQ = {
      id: Date.now(),
      question: "",
      type: "choice",
      options: ["ممتاز", "جيد", "مقبول", "ضعيف"],
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleQuestionTextChange = (id, text) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, question: text } : q))
    );
  };

  const handleQuestionTypeChange = (id, type) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            type,
            options: type === "text" ? [] : q.options.length ? q.options : ["نعم", "لا"],
          };
        }
        return q;
      })
    );
  };

  const handleAddOption = (questionId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [...q.options, `خيار ${q.options.length + 1}`],
          };
        }
        return q;
      })
    );
  };

  const handleOptionChange = (questionId, optIndex, val) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOpts = [...q.options];
          newOpts[optIndex] = val;
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  };

  const handleRemoveOption = (questionId, optIndex) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.filter((_, idx) => idx !== optIndex),
          };
        }
        return q;
      })
    );
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        toast.warning(`يرجى كتابة نص السؤال رقم ${i + 1}`);
        return;
      }
      if (questions[i].type === "choice" && questions[i].options.length === 0) {
        toast.warning(`يرجى إضافة خيارات إجابة للسؤال رقم ${i + 1}`);
        return;
      }
    }

    setSaving(true);
    try {
      await saveStoredSurveyQuestions(questions);
      toast.success("تم حفظ إعدادات أسئلة الاستبيان بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="setting-page-wrapper">
      <SettingTabs activeTab="survey" />

      <div className="setting-content-container">
        <div className="setting-card">
          <div className="card-header-custom">
            <FontAwesomeIcon icon={faPoll} className="header-icon" style={{ color: "#b89358" }} />
            <h3>إعدادات أسئلة استبيان رضا المستفيدين</h3>
          </div>

          <div style={{ padding: "24px 30px" }}>
            <div
              style={{
                background: "#fbf8f4",
                border: "1px solid #ebdccb",
                borderRadius: "12px",
                padding: "14px 18px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#6b583f",
                fontSize: "14px",
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} style={{ color: "#b89358", fontSize: "18px" }} />
              <div>
                قم بتحديد وتخصيص الأسئلة والخيارات المتاحة التي ستظهر للموظف والمستفيد في صفحة{" "}
                <strong>استبيان رضا المستفيدين (employeesurvey)</strong>.
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <Spinner animation="border" variant="warning" />
                <p style={{ marginTop: "12px", color: "#8a7558" }}>جاري تحميل الأسئلة...</p>
              </div>
            ) : (
              <Form onSubmit={handleSave}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {questions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      style={{
                        background: "#ffffff",
                        border: "1.5px solid #e7dcce",
                        borderRadius: "16px",
                        padding: "20px",
                        position: "relative",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "14px",
                        }}
                      >
                        <span
                          style={{
                            background: "#ecd9be",
                            color: "#5f4422",
                            fontWeight: "700",
                            fontSize: "13px",
                            padding: "4px 12px",
                            borderRadius: "10px",
                          }}
                        >
                          سؤال {idx + 1}
                        </span>

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          style={{ borderRadius: "8px", fontSize: "12px", padding: "4px 10px" }}
                          onClick={() => handleRemoveQuestion(q.id)}
                          title="حذف هذا السؤال"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} style={{ marginLeft: "4px" }} />
                          حذف السؤال
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: "14px", marginBottom: "14px" }}>
                        <div>
                          <label style={{ fontSize: "13px", fontWeight: "600", color: "#544634", marginBottom: "6px", display: "block" }}>
                            نص السؤال:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            style={{
                              borderRadius: "10px",
                              border: "1.5px solid #d8cbba",
                              padding: "8px 14px",
                              fontSize: "14px",
                            }}
                            value={q.question}
                            onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
                            placeholder="أدخل صيغة السؤال هنا..."
                            required
                          />
                        </div>

                        <div>
                          <SelectComponent
                            label="نوع الإجابة:"
                            placeholder="اختر نوع الإجابة"
                            options={[
                              { value: "choice", label: "اختيار من متعدد" },
                              { value: "text", label: "إجابة نصية / تعليق" },
                            ]}
                            value={q.type}
                            onChange={(opt) =>
                              handleQuestionTypeChange(q.id, opt?.value || "choice")
                            }
                            isSearchable={false}
                            selectStyle={{
                              borderRadius: "10px",
                              border: "1.5px solid var(--border-color, #d8cbba)",
                              minHeight: "40px",
                              height: "40px",
                              marginTop: "0",
                              fontSize: "13.5px",
                              backgroundColor: "var(--surface-color, #ffffff)",
                            }}
                            labelStyle={{
                              fontSize: "13px",
                              fontWeight: "600",
                              marginBottom: "6px",
                              display: "block",
                              color: "var(--text-color, #544634)",
                            }}
                          />
                        </div>
                      </div>

                      {q.type === "choice" && (
                        <div
                          style={{
                            padding: "16px 18px",
                            borderRadius: "14px",
                            border: "1.5px dashed var(--border-color, #e2d7c7)",
                            backgroundColor: "rgba(184, 147, 88, 0.03)",
                            marginTop: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "14px",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span
                                style={{
                                  fontSize: "13.5px",
                                  fontWeight: "700",
                                  color: "var(--text-color, #333)",
                                }}
                              >
                                خيارات الإجابة:
                              </span>
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "var(--text-muted, #8a7558)",
                                  fontWeight: "500",
                                }}
                              >
                                ({q.options.length} خيارات متاحة)
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddOption(q.id)}
                              className="btn btn-sm"
                              style={{
                                fontSize: "12.5px",
                                fontWeight: "700",
                                borderRadius: "10px",
                                border: "1px solid #c9b497",
                                background: "#fbf6ed",
                                color: "#7a5924",
                                padding: "5px 14px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                              <span>إضافة خيار جديد</span>
                            </button>
                          </div>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                              gap: "12px",
                            }}
                          >
                            {q.options.map((opt, optIdx) => (
                              <div
                                key={optIdx}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  backgroundColor: "var(--background-color, #ffffff)",
                                  border: "1.5px solid var(--border-color, #e0d5c5)",
                                  borderRadius: "12px",
                                  padding: "4px 8px 4px 12px",
                                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
                                  transition: "border-color 0.2s, box-shadow 0.2s",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "800",
                                    color: "#8c672e",
                                    backgroundColor: "#f7efe4",
                                    borderRadius: "50%",
                                    width: "24px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    marginLeft: "8px",
                                  }}
                                >
                                  {optIdx + 1}
                                </span>

                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      q.id,
                                      optIdx,
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    border: "none",
                                    outline: "none",
                                    fontSize: "13.5px",
                                    fontWeight: "600",
                                    color: "var(--text-color, #2b2b2b)",
                                    backgroundColor: "transparent",
                                    width: "100%",
                                    padding: "6px 4px",
                                  }}
                                  placeholder={`خيار ${optIdx + 1}...`}
                                />

                                {q.options.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveOption(q.id, optIdx)
                                    }
                                    style={{
                                      border: "none",
                                      background: "transparent",
                                      color: "#dc3545",
                                      borderRadius: "6px",
                                      width: "26px",
                                      height: "26px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                      fontSize: "16px",
                                      lineHeight: 1,
                                      flexShrink: 0,
                                      transition: "background 0.2s",
                                    }}
                                    title="حذف هذا الخيار"
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(220, 53, 69, 0.1)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "24px",
                    paddingTop: "16px",
                    borderTop: "1px solid #ebdccb",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="btn"
                    style={{
                      background: "#f5ece0",
                      color: "#6b4d24",
                      border: "1.5px dashed #cbb59b",
                      borderRadius: "12px",
                      padding: "10px 20px",
                      fontWeight: "700",
                      fontSize: "14px",
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} style={{ marginLeft: "8px" }} />
                    إضافة سؤال جديد
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="btn"
                    style={{
                      background: "linear-gradient(135deg, #b89358 0%, #8c672e 100%)",
                      color: "#ffffff",
                      borderRadius: "12px",
                      padding: "10px 28px",
                      fontWeight: "700",
                      fontSize: "14.5px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(184, 147, 88, 0.3)",
                    }}
                  >
                    {saving ? (
                      <>
                        <Spinner animation="border" size="sm" style={{ marginLeft: "8px" }} />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} style={{ marginLeft: "8px" }} />
                        حفظ جميع الأسئلة
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurveySetting;
