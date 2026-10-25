import React from "react";
import API from "../../api/axiosConfig";
import { useParams } from "react-router";
import TestPreLoader from "../TestPreLoader/TestPreLoader";

const getRiskLevel = (score) => {
  if (score >= 15) return { label: "مرتفع", color: "#dc2626" };
  if (score >= 6) return { label: "متوسط", color: "#f59e0b" };
  return { label: "منخفض", color: "#16a34a" };
};

const StatusBadge = ({ status }) => {
  const colors = {
    مفتوح: "#dc2626",
    "قيد المعالجة": "#f59e0b",
    مغلق: "#16a34a",
  };

  return (
    <span
      style={{
        background: colors[status] || "#64748b",
        color: "#fff",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "13px",
      }}
    >
      {status}
    </span>
  );
};

const RiskAssessmentReport = () => {
  const [risk, setRisk] = React.useState([]);
  const id = useParams().id;
  const [loading, setLoading] = React.useState(true);
  const getRiskData = async () => {
    try {
      const response = await API.get(`/projectrisk/${id}/report`);
      setRisk(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getRiskData();
  }, []);
  
  if (loading) return <TestPreLoader />;
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {risk?.map((r, index) => {
          const riskScore = r.risk_probability_level * r.risk_impact_level;
          const riskLevel = getRiskLevel(riskScore);

          return (
            <div key={index}>
              {/* Header */}
              <div style={styles.header}>
                تقرير تقييم المخاطر – {r.risk_phase}
              </div>

              {/* Score Section */}
              <div style={styles.scoreSection}>
                <div>
                  <span style={{ fontWeight: "bold" }}>درجة الخطورة:</span>{" "}
                  <span style={{ color: riskLevel.color, fontWeight: "bold" }}>
                    {riskScore} ({riskLevel.label})
                  </span>
                </div>
              </div>

              {/* Main Grid */}
              <div style={styles.grid}>
                <div style={styles.riskBox}>
                  <h3 style={styles.riskTitle}>المخاطر</h3>

                  <Info label="الاحتمالية" value={r.risk_probability} />
                  <Info label="مستوى التأثير" value={r.risk_impact} />
                  <Info label="الوصف" value={r.risk_description} />
                  <div style={styles.row}>
                    <strong>الحالة:</strong>
                    <StatusBadge status={r.risk_status} />
                  </div>
                </div>

                <div style={styles.mitigationBox}>
                  <h3 style={styles.mitigationTitle}>إجراءات التخفيف</h3>

                  <Info
                    label="الاحتمالية بعد المعالجة"
                    value={r.mitigation_probability}
                  />
                  <Info
                    label="مستوى التأثير بعد المعالجة"
                    value={r.mitigation_impact}
                  />
                  <Info label="الوصف" value={r.mitigation_description} />
                  <div style={styles.row}>
                    <strong>الحالة:</strong>
                    <StatusBadge status={r.mitigation_status} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div style={styles.row}>
    <strong>{label}:</strong>
    <span>{value}</span>
  </div>
);

const styles = {
  wrapper: {
    background: "var(--background-color)",
    padding: "40px",
    minHeight: "100vh",
    direction: "rtl",
    fontFamily: "Tahoma, Arial, sans-serif",
  },
  card: {
    maxWidth: "1100px",
    margin: "auto",
    background: "var(--background-color)",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg,#1e293b,#334155)",
    color: "var(--text-color)",
    padding: "25px",
    fontSize: "20px",
    fontWeight: "bold",
  },
  scoreSection: {
    padding: "20px 30px",
    background: "var(--background-color)",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
  riskBox: {
    padding: "30px",
    background: "var(--risk-box-background)",
    borderLeft: "1px solid var(--border-color)",
  },
  mitigationBox: {
    padding: "30px",
    background: "var(--mitigation-box-background)",
  },
  riskTitle: {
    color: "#b91c1c",
    marginBottom: "20px",
  },
  mitigationTitle: {
    color: "#15803d",
    marginBottom: "20px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    fontSize: "15px",
  },
};

export default RiskAssessmentReport;
