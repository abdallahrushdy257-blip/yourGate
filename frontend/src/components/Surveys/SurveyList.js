import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faStar,
  faClipboardList,
  faPlus,
  faXmark,
  faTrashAlt,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import API from "../../api/axiosConfig";
import SurveyForm from "./SurveyForm";
import { TableSkeleton } from "../Skeleton";
import { getCurrentPeriod } from "../../Utils/getCurrentPeriod";
import "./Surveys.css";

const NPS_BADGE = {
  promoter: { label: "مروّج (Promoter)", bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
  passive: { label: "محايد (Passive)", bg: "#fff8e1", color: "#b78103", border: "#ffe082" },
  detractor: { label: "منتقد (Detractor)", bg: "#ffebee", color: "#c62828", border: "#ef9a9a" },
};

const STARS = (score) => {
  if (!score) return "—";
  return "★".repeat(score) + "☆".repeat(5 - score);
};

const SurveyList = () => {
  const [currentPeriod, setCurrentPeriod] = useState(getCurrentPeriod());
  const [data, setData] = useState({ data: [], stats: {}, meta: {} });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
      const res = await API.get("/surveys", { params: { period: currentPeriod } });
      if (res.data) {
        setData(res.data);
      }
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
      await API.delete(`/surveys/${id}`);
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
          <h2 className="surveys-title">استبيانات الرضا</h2>
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

        <div className="d-flex gap-2">
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
          <p className="surveys-stat-lbl">متوسط الرضا العام</p>
        </div>

        <div className="surveys-stat-card">
          <div className="surveys-stat-icon">📈</div>
          <p
            className="surveys-stat-val"
            style={{
              color:
                stats.nps > 0
                  ? "#2e7d32"
                  : stats.nps < 0
                  ? "#c62828"
                  : "#7c3aed",
            }}
          >
            {stats.nps !== null && stats.nps !== undefined ? `${stats.nps}%` : "—"}
          </p>
          <p className="surveys-stat-lbl">
            مؤشر صافي الترويج (NPS)
          </p>
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
            يمكنك تسجيل أول استبيان رضا الآن من خلال الضغط على زر "استبيان جديد" أعلاه.
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
                <th style={{ padding: "14px 16px", fontWeight: "700", textAlign: "center" }}>
                  الرضا
                </th>
                <th style={{ padding: "14px 16px", fontWeight: "700", textAlign: "center" }}>
                  NPS
                </th>
                <th style={{ padding: "14px 16px", fontWeight: "700", textAlign: "center" }}>
                  التصنيف
                </th>
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
                const category = row.nps_category;
                const badge = NPS_BADGE[category];
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
                      {row.humancase_name || "غير محدد"}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "center",
                        color: "#f59e0b",
                        fontSize: "16px",
                        letterSpacing: "2px",
                      }}
                      title={`${row.satisfaction_score || 0} من 5`}
                    >
                      {STARS(row.satisfaction_score)}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        textAlign: "center",
                        fontWeight: "800",
                        fontSize: "14px",
                      }}
                    >
                      {row.nps_score !== null && row.nps_score !== undefined
                        ? row.nps_score
                        : "—"}
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      {badge ? (
                        <span
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            padding: "4px 12px",
                            borderRadius: "16px",
                            fontSize: "11.5px",
                            fontWeight: "700",
                            display: "inline-block",
                          }}
                        >
                          {badge.label}
                        </span>
                      ) : (
                        "—"
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SurveyList;