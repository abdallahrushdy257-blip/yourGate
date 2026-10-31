import React from "react";
import API from "../../api/axiosConfig";
import { useParams, useNavigate } from "react-router";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faShieldHalved,
  faArrowRight,
  faPrint,
  faFileContract,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const getRiskLevel = (score) => {
  if (score >= 6) {
    return { label: "مرتفع", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" };
  }
  if (score >= 3) {
    return { label: "متوسط", color: "#d97706", bg: "#fffbeb", border: "#fde68a" };
  }
  return { label: "منخفض", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" };
};

const StatusBadge = ({ status }) => {
  const normalized = status || "مفتوح";
  const stylesMap = {
    مفتوح: { bg: "#fee2e2", text: "#991b1b", border: "#f87171" },
    "قيد المعالجة": { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
    "بانتظار المعالجة": { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" },
    مغلق: { bg: "#dcfce7", text: "#166534", border: "#86efac" },
  };

  const current = stylesMap[normalized] || { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" };

  return (
    <span
      style={{
        background: current.bg,
        color: current.text,
        border: `1px solid ${current.border}`,
        padding: "4px 14px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700",
        display: "inline-block",
      }}
    >
      {normalized}
    </span>
  );
};

const LevelBadge = ({ text }) => {
  const normalized = text || "متوسط";
  const colors = {
    مرتفع: { bg: "#fee2e2", text: "#b91c1c" },
    متوسط: { bg: "#fef3c7", text: "#b45309" },
    منخفض: { bg: "#dcfce7", text: "#15803d" },
  };
  const theme = colors[normalized] || { bg: "#f1f5f9", text: "#334155" };

  return (
    <span
      style={{
        background: theme.bg,
        color: theme.text,
        padding: "3px 12px",
        borderRadius: "6px",
        fontSize: "13px",
        fontWeight: "600",
      }}
    >
      {normalized}
    </span>
  );
};

const RiskAssessmentReport = () => {
  const [risk, setRisk] = React.useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  const getRiskData = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/projectrisk/${id}/report`);
      const list = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setRisk(list);
    } catch (error) {
      console.error("Error loading risk report:", error);
      setRisk([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getRiskData();
  }, [id]);

  if (loading) return <TestPreLoader />;

  return (
    <div style={styles.wrapper}>
      {/* Top Action Bar */}
      <div style={styles.topBar} className="no-print">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FontAwesomeIcon icon={faFileContract} style={{ fontSize: "24px", color: "var(--primary-color, #c29a64)" }} />
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "var(--text-color, #1e293b)" }}>
            تقرير تقييم المخاطر وإجراءات التخفيف
          </h2>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={() => window.print()}
            style={styles.printBtn}
          >
            <FontAwesomeIcon icon={faPrint} style={{ marginLeft: "8px" }} />
            طباعة التقرير
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={styles.backBtn}
          >
            <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: "8px" }} />
            العودة
          </button>
        </div>
      </div>

      {risk.length === 0 ? (
        <div style={styles.emptyCard}>
          <FontAwesomeIcon icon={faShieldHalved} style={{ fontSize: "48px", color: "#94a3b8", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", color: "#334155", margin: "0 0 8px" }}>لا توجد مخاطر مسجلة لهذا المشروع بعد</h3>
          <p style={{ color: "#64748b", margin: "0 0 20px" }}>يمكنك إضافة مخاطر للمشروع وتحديد خطط التخفيف من خلال صفحة المخاطر.</p>
          <button
            type="button"
            onClick={() => navigate(`/projectrisks/${id}`)}
            style={styles.addBtn}
          >
            <FontAwesomeIcon icon={faPlus} style={{ marginLeft: "8px" }} />
            الانتقال لصفحة المخاطر
          </button>
        </div>
      ) : (
        <div style={styles.cardsContainer}>
          {risk.map((r, index) => {
            const probLevel = Number(r.risk_probability_level) || 2;
            const impactLevel = Number(r.risk_impact_level) || 2;
            const riskScore = probLevel * impactLevel;
            const riskLevel = getRiskLevel(riskScore);
            const hasMitigation = Boolean(r.mitigation_description && r.mitigation_description !== "لم يتم تسجيل خطة تخفيف بعد");

            return (
              <div key={r.id || index} style={styles.card}>
                {/* Header */}
                <div style={styles.header}>
                  <div>
                    <span style={styles.headerSubtitle}>المرحلة المرتبطة</span>
                    <h3 style={styles.headerTitle}>{r.risk_phase || "المشروع ككل"}</h3>
                  </div>
                  <div style={styles.scoreBadge(riskLevel)}>
                    <span style={{ fontSize: "12px", opacity: 0.9 }}>درجة الخطورة الكلية</span>
                    <strong style={{ fontSize: "18px" }}>
                      {riskScore} / 9 – ({riskLevel.label})
                    </strong>
                  </div>
                </div>

                {/* Score Formula Details */}
                <div style={styles.formulaBar}>
                  <span>
                    <strong>معادلة التقييم:</strong> الاحتمالية ({probLevel}) × مستوى التأثير ({impactLevel}) = <strong>{riskScore}</strong>
                  </span>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span>حالة الخطر:</span>
                    <StatusBadge status={r.risk_status} />
                  </div>
                </div>

                {/* Main Two Columns Grid */}
                <div style={styles.grid}>
                  {/* Left Box: Risk Analysis */}
                  <div style={styles.riskBox}>
                    <div style={styles.boxHeader}>
                      <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: "#dc2626", fontSize: "18px" }} />
                      <h4 style={styles.riskTitle}>تحليل الخطر</h4>
                    </div>

                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>الاحتمالية:</span>
                      <LevelBadge text={r.risk_probability} />
                    </div>

                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>مستوى التأثير:</span>
                      <LevelBadge text={r.risk_impact} />
                    </div>

                    <div style={styles.infoBlock}>
                      <span style={styles.infoLabel}>وصف الخطر:</span>
                      <p style={styles.descText}>{r.risk_description || "لا يوجد وصف"}</p>
                    </div>

                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>الحالة:</span>
                      <StatusBadge status={r.risk_status} />
                    </div>
                  </div>

                  {/* Right Box: Mitigation Plan */}
                  <div style={styles.mitigationBox}>
                    <div style={styles.boxHeader}>
                      <FontAwesomeIcon icon={faShieldHalved} style={{ color: "#16a34a", fontSize: "18px" }} />
                      <h4 style={styles.mitigationTitle}>إجراءات وخطة التخفيف</h4>
                    </div>

                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>الاحتمالية بعد المعالجة:</span>
                      <LevelBadge text={r.mitigation_probability} />
                    </div>

                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>مستوى التأثير بعد المعالجة:</span>
                      <LevelBadge text={r.mitigation_impact} />
                    </div>

                    <div style={styles.infoBlock}>
                      <span style={styles.infoLabel}>إجراءات التخفيف المتخذة:</span>
                      <p style={hasMitigation ? styles.descText : styles.emptyDescText}>
                        {r.mitigation_description}
                      </p>
                    </div>

                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>حالة المعالجة:</span>
                      <StatusBadge status={r.mitigation_status} />
                    </div>

                    {!hasMitigation && (
                      <div style={{ marginTop: "16px", textAlign: "left" }} className="no-print">
                        <button
                          type="button"
                          onClick={() => navigate(`/riskmitigation/${r.id}`)}
                          style={styles.addMitigationBtn}
                        >
                          <FontAwesomeIcon icon={faPlus} style={{ marginLeft: "6px" }} />
                          تسجيل خطة التخفيف لهذا الخطر
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "30px 40px",
    minHeight: "100vh",
    direction: "rtl",
    fontFamily: "Tajawal, Tahoma, Arial, sans-serif",
    background: "var(--background-color, #f8fafc)",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1150px",
    margin: "0 auto 25px auto",
  },
  printBtn: {
    background: "#ffffff",
    color: "#334155",
    border: "1px solid #cbd5e1",
    padding: "9px 18px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  backBtn: {
    background: "var(--primary-color, #c29a64)",
    color: "#ffffff",
    border: "none",
    padding: "9px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  cardsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    maxWidth: "1150px",
    margin: "0 auto",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },
  header: {
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    padding: "22px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: "12px",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "block",
    marginBottom: "4px",
  },
  headerTitle: {
    fontSize: "20px",
    fontWeight: "700",
    margin: 0,
    color: "#ffffff",
  },
  scoreBadge: (riskLevel) => ({
    background: riskLevel.bg,
    color: riskLevel.color,
    border: `1px solid ${riskLevel.border}`,
    padding: "8px 18px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  }),
  formulaBar: {
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    padding: "12px 28px",
    fontSize: "14px",
    color: "#475569",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
  riskBox: {
    padding: "26px 28px",
    borderLeft: "1px solid #e2e8f0",
    background: "#ffffff",
  },
  mitigationBox: {
    padding: "26px 28px",
    background: "#fafafa",
  },
  boxHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
    paddingBottom: "10px",
    borderBottom: "2px solid #f1f5f9",
  },
  riskTitle: {
    color: "#b91c1c",
    fontSize: "16px",
    fontWeight: "700",
    margin: 0,
  },
  mitigationTitle: {
    color: "#15803d",
    fontSize: "16px",
    fontWeight: "700",
    margin: 0,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
    fontSize: "14px",
  },
  infoBlock: {
    marginBottom: "14px",
  },
  infoLabel: {
    fontWeight: "600",
    color: "#334155",
    fontSize: "14px",
  },
  descText: {
    marginTop: "6px",
    color: "#1e293b",
    fontSize: "14px",
    lineHeight: "1.6",
    background: "#f8fafc",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  emptyDescText: {
    marginTop: "6px",
    color: "#94a3b8",
    fontSize: "13px",
    fontStyle: "italic",
    background: "#f1f5f9",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px dashed #cbd5e1",
  },
  addMitigationBtn: {
    background: "#15803d",
    color: "#ffffff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  emptyCard: {
    maxWidth: "700px",
    margin: "60px auto",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "50px 30px",
    textAlign: "center",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  addBtn: {
    background: "var(--primary-color, #c29a64)",
    color: "#ffffff",
    border: "none",
    padding: "10px 22px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default RiskAssessmentReport;
