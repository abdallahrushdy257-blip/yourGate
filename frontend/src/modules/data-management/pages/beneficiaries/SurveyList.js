import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faXmark,
  faTrashAlt,
  faRotateRight,
  faEye,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import API from "../../../../api/axiosConfig";
import SurveyForm from "./SurveyForm";
import { TableSkeleton } from "../../../../components/Skeleton";
import { getCurrentPeriod } from "../../../../Utils/getCurrentPeriod";
import "./Surveys.css";

const SurveyList = () => {
  const navigate = useNavigate();
  const [currentPeriod, setCurrentPeriod] = useState(getCurrentPeriod());
  const [data, setData] = useState({ data: [], stats: {}, meta: {} });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedSurveyDetails, setSelectedSurveyDetails] = useState(null);

  const availablePeriods = [
    "2026-Q4",
    "2026-Q3",
    "2026-Q2",
    "2026-Q1",
    "2025-Q4",
  ];

  const load = async () => {
    setLoading(true);
    try {
      // 1. Fetch from backend API
      let backendList = [];
      let backendStats = {};
      try {
        const res = await API.get("/surveys", { params: { period: currentPeriod } });
        if (res.data) {
          backendList = res.data.data || [];
          backendStats = res.data.stats || {};
        }
      } catch (e) {
        console.warn("Backend surveys endpoint not reachable:", e);
      }

      // 2. Fetch local storage submissions with answers
      const stored = JSON.parse(localStorage.getItem("survey_recorded_submissions") || "[]");
      const filteredStored = stored.filter(
        (s) => !currentPeriod || s.period === currentPeriod
      );

      // Merge and deduplicate by id
      const combined = [...filteredStored];
      backendList.forEach((bItem) => {
        if (!combined.some((c) => String(c.id) === String(bItem.id))) {
          combined.push(bItem);
        }
      });

      setData({
        data: combined,
        stats: {
          total: combined.length,
          avg_satisfaction:
            combined.length > 0
              ? (
                  combined.reduce((acc, curr) => acc + (Number(curr.satisfaction_score) || 4), 0) /
                  combined.length
                ).toFixed(1)
              : "5.0",
          nps: backendStats.nps !== undefined ? backendStats.nps : 100,
        },
      });
    } catch (err) {
      console.error("Failed to load surveys:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [currentPeriod]);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الاستبيان؟")) return;
    try {
      setDeletingId(id);
      // Remove from localStorage
      const stored = JSON.parse(localStorage.getItem("survey_recorded_submissions") || "[]");
      const updated = stored.filter((s) => String(s.id) !== String(id));
      localStorage.setItem("survey_recorded_submissions", JSON.stringify(updated));

      // Also call delete API if backend has it
      try {
        await API.delete(`/surveys/${id}`);
      } catch (e) {}

      load();
    } catch (err) {
      console.error("Failed to delete survey:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const stats = data.stats ?? {};

  return (
    <div className="surveys-container">
      {/* Header */}
      <div className="surveys-header">
        <div>
          <h2 className="surveys-title">استبيانات رضا المستفيدين</h2>
          <div className="surveys-period-badge">
            <span>الفترة المحددة:</span>
            <select
              className="surveys-period-select"
              value={currentPeriod}
              onChange={(e) => setCurrentPeriod(e.target.value)}
            >
              {availablePeriods.map((p) => (
                <option key={p} value={p}>
                  {p} {p === getCurrentPeriod() ? "(الحالية)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <button
            type="button"
            className="btn btn-outline-warning btn-sm"
            style={{ borderRadius: "10px", padding: "8px 14px", fontWeight: "600", fontSize: "13px" }}
            onClick={() => navigate("/setting/survey")}
            title="تعديل وإدارة أسئلة الاستبيان من الإعدادات"
          >
            <FontAwesomeIcon icon={faSliders} style={{ marginLeft: "6px" }} />
            إعدادات الأسئلة
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            style={{ borderRadius: "10px", padding: "8px 14px" }}
            onClick={load}
            disabled={loading}
            title="تحديث البيانات"
          >
            <FontAwesomeIcon icon={faRotateRight} spin={loading} />
          </button>

          <button
            type="button"
            className="surveys-btn-toggle"
            onClick={() => setShowForm((s) => !s)}
          >
            <FontAwesomeIcon icon={showForm ? faXmark : faPlus} />
            <span>{showForm ? "إغلاق النموذج" : "استبيان جديد"}</span>
          </button>
        </div>
      </div>

      {/* Form Area */}
      {showForm && (
        <SurveyForm
          period={currentPeriod}
          onSuccess={() => {
            setShowForm(false);
            load();
          }}
        />
      )}

      {/* Stats Cards */}
      <div className="surveys-stats-grid">
        <div className="surveys-stat-card">
          <div className="surveys-stat-icon">📊</div>
          <p className="surveys-stat-val" style={{ color: "#a37a3e" }}>
            {stats.total ?? 0}
          </p>
          <p className="surveys-stat-lbl">إجمالي الاستبيانات</p>
        </div>

        <div className="surveys-stat-card">
          <div className="surveys-stat-icon">⭐</div>
          <p className="surveys-stat-val" style={{ color: "#f59e0b" }}>
            {stats.avg_satisfaction !== null && stats.avg_satisfaction !== undefined
              ? `${stats.avg_satisfaction} / 5`
              : "—"}
          </p>
          <p className="surveys-stat-lbl">متوسط تقييم الرضا</p>
        </div>

        <div className="surveys-stat-card">
          <div className="surveys-stat-icon">📝</div>
          <p className="surveys-stat-val" style={{ color: "#2e7d32" }}>
            {data.data ? data.data.length : 0}
          </p>
          <p className="surveys-stat-lbl">استجابات مسجلة</p>
        </div>
      </div>

      {/* Table Area */}
      {loading ? (
        <TableSkeleton rows={4} columns={6} />
      ) : (data.data || []).length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "54px 20px",
            background: "#fffdfa",
            borderRadius: "18px",
            border: "1.5px dashed #ebdccb",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📋</div>
          <h5 style={{ color: "#423625", fontWeight: "700", marginBottom: "8px" }}>
            لا توجد استبيانات مسجلة لهذه الفترة ({currentPeriod})
          </h5>
          <p style={{ color: "#7a6e5d", fontSize: "14px", marginBottom: "18px" }}>
            يمكنك تسجيل استبيان رضا الآن بالأسئلة المحددة من الإعدادات.
          </p>
          <button
            type="button"
            className="surveys-btn-toggle"
            onClick={() => setShowForm(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>تسجيل استبيان الآن</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: "16px",
            border: "1px solid #ebdccb",
          }}
        >
          <table
            className="table mb-0"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "right",
              fontSize: "13.5px",
            }}
          >
            <thead>
              <tr style={{ background: "#f8f2e7", color: "#423625" }}>
                <th style={{ padding: "14px 16px", fontWeight: "700" }}>#</th>
                <th style={{ padding: "14px 16px", fontWeight: "700" }}>المستفيد</th>
                <th style={{ padding: "14px 16px", fontWeight: "700" }}>الأسئلة والإجابات المعتمدة</th>
                <th style={{ padding: "14px 16px", fontWeight: "700" }}>الملاحظات</th>
                <th style={{ padding: "14px 16px", fontWeight: "700", textAlign: "center" }}>
                  التاريخ
                </th>
                <th style={{ padding: "14px 16px", fontWeight: "700", textAlign: "center" }}>
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((row, idx) => {
                const hasAnswers = row.answers && Array.isArray(row.answers) && row.answers.length > 0;
                return (
                  <tr
                    key={row.id || idx}
                    style={{
                      borderBottom: "1px solid #f0e6d6",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <td style={{ padding: "14px 16px", fontWeight: "700", color: "#8a642e" }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: "700" }}>
                      {row.humancase_name || "استبيان عام"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {hasAnswers ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {row.answers.slice(0, 2).map((ans, aIdx) => (
                            <span
                              key={aIdx}
                              style={{
                                background: "#f3ede3",
                                border: "1px solid #e1d3c0",
                                padding: "3px 8px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                color: "#4a3c2a",
                              }}
                            >
                              <strong>{ans.question?.slice(0, 20)}...:</strong>{" "}
                              <span style={{ color: "#a0753b", fontWeight: "700" }}>{ans.answer}</span>
                            </span>
                          ))}
                          {row.answers.length > 2 && (
                            <button
                              type="button"
                              onClick={() => setSelectedSurveyDetails(row)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#b89358",
                                fontSize: "12px",
                                fontWeight: "700",
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              +{row.answers.length - 2} المزيد
                            </button>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: "#8a7558" }}>
                          تقييم عام: {row.satisfaction_score || 5} / 5
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", maxWidth: "240px", color: "#5c4e3c" }}>
                      {row.notes || <span style={{ color: "#a89b88" }}>لا توجد ملاحظات</span>}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "center",
                        color: "#7a6e5d",
                        fontSize: "12.5px",
                      }}
                    >
                      {row.submitted_at
                        ? new Date(row.submitted_at).toLocaleDateString("ar-SA")
                        : "—"}
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <div className="d-flex justify-content-center gap-2">
                        {hasAnswers && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            style={{ borderRadius: "8px", padding: "4px 10px" }}
                            onClick={() => setSelectedSurveyDetails(row)}
                            title="عرض تفاصيل الإجابات كاملة"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          style={{ borderRadius: "8px", padding: "4px 10px" }}
                          onClick={() => handleDelete(row.id)}
                          disabled={deletingId === row.id}
                          title="حذف الاستبيان"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {selectedSurveyDetails && (
        <Modal
          show={!!selectedSurveyDetails}
          onHide={() => setSelectedSurveyDetails(null)}
          centered
          dir="rtl"
        >
          <Modal.Header closeButton style={{ borderBottom: "1.5px solid #ebdccb" }}>
            <Modal.Title style={{ fontSize: "16px", fontWeight: "700", color: "#54432c" }}>
              تفاصيل إجابات استبيان: {selectedSurveyDetails.humancase_name || "استبيان عام"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {(selectedSurveyDetails.answers || []).map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fbf8f3",
                    border: "1px solid #ebdccb",
                    borderRadius: "10px",
                    padding: "12px 16px",
                  }}
                >
                  <div style={{ fontWeight: "700", fontSize: "13.5px", color: "#423625", marginBottom: "6px" }}>
                    <span style={{ color: "#a0753b", marginLeft: "6px" }}>{idx + 1}.</span>
                    {item.question}
                  </div>
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e1d3c0",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      color: "#2e7d32",
                      fontWeight: "700",
                      fontSize: "13.5px",
                    }}
                  >
                    الإجابة: {item.answer || "لم يتم تحديد إجابة"}
                  </div>
                </div>
              ))}

              {selectedSurveyDetails.notes && (
                <div
                  style={{
                    background: "#fffdfa",
                    border: "1px dashed #decbb6",
                    borderRadius: "10px",
                    padding: "12px 16px",
                  }}
                >
                  <div style={{ fontWeight: "700", fontSize: "13px", color: "#6b583f", marginBottom: "4px" }}>
                    ملاحظات إضافية:
                  </div>
                  <div style={{ color: "#4a3c2a", fontSize: "13px" }}>{selectedSurveyDetails.notes}</div>
                </div>
              )}
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default SurveyList;