import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faTriangleExclamation,
  faCircleCheck,
  faCircleExclamation,
  faClock,
  faPrint,
  faArrowRight,
  faChartPie,
  faFileShield,
} from "@fortawesome/free-solid-svg-icons";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import Title from "../../components/title";
import "./RiskAssessmentReport.css";

// Helper for Risk Severity Level
const getRiskLevel = (score) => {
  if (score >= 15) {
    return {
      label: "مرتفع",
      className: "high",
      color: "#ef4444",
      icon: faTriangleExclamation,
    };
  }
  if (score >= 6) {
    return {
      label: "متوسط",
      className: "medium",
      color: "#f59e0b",
      icon: faCircleExclamation,
    };
  }
  return {
    label: "منخفض",
    className: "low",
    color: "#22c55e",
    icon: faCircleCheck,
  };
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const normalizedStatus = (status || "").trim();

  let badgeClass = "open";
  let icon = faCircleExclamation;

  if (normalizedStatus === "مغلق" || normalizedStatus === "مكتمل") {
    badgeClass = "closed";
    icon = faCircleCheck;
  } else if (
    normalizedStatus === "قيد المعالجة" ||
    normalizedStatus === "جاري العمل"
  ) {
    badgeClass = "in-progress";
    icon = faClock;
  }

  return (
    <span className={`risk-status-badge ${badgeClass}`}>
      <FontAwesomeIcon icon={icon} />
      <span>{status || "غير محدد"}</span>
    </span>
  );
};

const RiskAssessmentReport = () => {
  const [risk, setRisk] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const getRiskData = async () => {
    try {
      const response = await API.get(`/projectrisk/${id}/report`);
      const resData = response?.data?.data ?? response?.data;
      setRisk(Array.isArray(resData) ? resData : []);
    } catch (error) {
      console.error("Error fetching risk report:", error);
      setRisk([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRiskData();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <TestPreLoader />;

  // Calculate Overview Stats
  const totalRisks = risk.length;
  const highRisks = risk.filter(
    (r) => (r.risk_probability_level || 0) * (r.risk_impact_level || 0) >= 15
  ).length;
  const mediumRisks = risk.filter((r) => {
    const score = (r.risk_probability_level || 0) * (r.risk_impact_level || 0);
    return score >= 6 && score < 15;
  }).length;
  const lowRisks = risk.filter(
    (r) => (r.risk_probability_level || 0) * (r.risk_impact_level || 0) < 6
  ).length;

  return (
    <div className="risk-report-container" dir="rtl">
      {/* Top Header & Actions */}
      <div className="risk-report-header">
        <div className="risk-report-header-right">
          <Title
            title="تقرير تقييم المخاطر"
            icon={<FontAwesomeIcon icon={faShieldHalved} />}
          />
        </div>

        <div className="risk-report-actions">
          <button
            type="button"
            className="risk-action-btn print-btn"
            onClick={handlePrint}
            title="طباعة التقرير"
          >
            <FontAwesomeIcon icon={faPrint} />
            <span>طباعة التقرير</span>
          </button>

          <button
            type="button"
            className="risk-action-btn back-btn"
            onClick={() => navigate(-1)}
            title="رجوع"
          >
            <FontAwesomeIcon icon={faArrowRight} />
            <span>رجوع</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {totalRisks === 0 ? (
        <div className="risk-empty-state">
          <div className="risk-empty-icon">
            <FontAwesomeIcon icon={faFileShield} />
          </div>
          <h3 className="risk-empty-title">لا توجد مخاطر مسجلة</h3>
          <p className="risk-empty-subtitle">
            لم يتم تسجيل أي مخاطر أو إجراءات معالجة لهذا المشروع حتى الآن.
          </p>
          <button
            type="button"
            className="risk-action-btn print-btn"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowRight} />
            <span>العودة إلى تفاصيل المشروع</span>
          </button>
        </div>
      ) : (
        <>
          {/* Overview Metrics Cards */}
          <div className="risk-stats-grid">
            <div className="risk-stat-card total">
              <div className="risk-stat-info">
                <span className="risk-stat-label">إجمالي المخاطر</span>
                <span className="risk-stat-value">{totalRisks}</span>
              </div>
              <div className="risk-stat-icon-wrapper">
                <FontAwesomeIcon icon={faChartPie} />
              </div>
            </div>

            <div className="risk-stat-card high">
              <div className="risk-stat-info">
                <span className="risk-stat-label">مخاطر مرتفعة</span>
                <span className="risk-stat-value">{highRisks}</span>
              </div>
              <div className="risk-stat-icon-wrapper">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </div>
            </div>

            <div className="risk-stat-card medium">
              <div className="risk-stat-info">
                <span className="risk-stat-label">مخاطر متوسطة</span>
                <span className="risk-stat-value">{mediumRisks}</span>
              </div>
              <div className="risk-stat-icon-wrapper">
                <FontAwesomeIcon icon={faCircleExclamation} />
              </div>
            </div>

            <div className="risk-stat-card low">
              <div className="risk-stat-info">
                <span className="risk-stat-label">مخاطر منخفضة</span>
                <span className="risk-stat-value">{lowRisks}</span>
              </div>
              <div className="risk-stat-icon-wrapper">
                <FontAwesomeIcon icon={faCircleCheck} />
              </div>
            </div>
          </div>

          {/* Risk Detail Cards List */}
          <div className="risk-cards-list">
            {risk.map((r, index) => {
              const pLevel = Number(r.risk_probability_level) || 0;
              const iLevel = Number(r.risk_impact_level) || 0;
              const riskScore = pLevel * iLevel;
              const riskLevel = getRiskLevel(riskScore);

              return (
                <div key={index} className="risk-item-card">
                  {/* Card Header */}
                  <div className="risk-item-header">
                    <div className="risk-item-title-section">
                      <span className="risk-phase-badge">
                        {r.risk_phase || `خطر #${index + 1}`}
                      </span>
                      <h4 className="risk-item-title">
                        {r.risk_description
                          ? r.risk_description.length > 50
                            ? r.risk_description.substring(0, 50) + "..."
                            : r.risk_description
                          : `سجل المخاطر ${index + 1}`}
                      </h4>
                    </div>

                    <div className="risk-item-header-meta">
                      {/* Severity Pill */}
                      <span
                        className={`risk-severity-pill ${riskLevel.className}`}
                        title={`الاحتمالية (${pLevel}) × التأثير (${iLevel}) = ${riskScore}`}
                      >
                        <FontAwesomeIcon icon={riskLevel.icon} />
                        <span>
                          درجة الخطورة: {riskScore} ({riskLevel.label})
                        </span>
                      </span>

                      {/* Status Badge */}
                      <StatusBadge status={r.risk_status} />
                    </div>
                  </div>

                  {/* Card Body Grid: Risk vs Mitigation */}
                  <div className="risk-item-body">
                    {/* 1. Initial Risk Side */}
                    <div className="risk-section-box initial-risk">
                      <div className="risk-section-title">
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                        <span>تقييم الخطر الأولي</span>
                      </div>

                      <div className="risk-metrics-row">
                        <div className="risk-metric-box">
                          <span className="risk-metric-label">الاحتمالية</span>
                          <span className="risk-metric-value">
                            {r.risk_probability || pLevel || "-"}
                          </span>
                        </div>

                        <div className="risk-metric-box">
                          <span className="risk-metric-label">مستوى التأثير</span>
                          <span className="risk-metric-value">
                            {r.risk_impact || iLevel || "-"}
                          </span>
                        </div>
                      </div>

                      <div className="risk-description-wrapper">
                        <div className="risk-description-label">وصف الخطر:</div>
                        <p className="risk-description-content">
                          {r.risk_description || "لا يوجد وصف مدخل لهذا الخطر."}
                        </p>
                      </div>

                      <div className="risk-status-row">
                        <span className="risk-status-row-label">حالة الخطر:</span>
                        <StatusBadge status={r.risk_status} />
                      </div>
                    </div>

                    {/* 2. Mitigation Strategy Side */}
                    <div className="risk-section-box mitigation">
                      <div className="risk-section-title">
                        <FontAwesomeIcon icon={faShieldHalved} />
                        <span>إجراءات التخفيف والمعالجة</span>
                      </div>

                      <div className="risk-metrics-row">
                        <div className="risk-metric-box">
                          <span className="risk-metric-label">
                            الاحتمالية بعد المعالجة
                          </span>
                          <span className="risk-metric-value">
                            {r.mitigation_probability || "-"}
                          </span>
                        </div>

                        <div className="risk-metric-box">
                          <span className="risk-metric-label">
                            التأثير بعد المعالجة
                          </span>
                          <span className="risk-metric-value">
                            {r.mitigation_impact || "-"}
                          </span>
                        </div>
                      </div>

                      <div className="risk-description-wrapper">
                        <div className="risk-description-label">
                          إجراءات وخطة المعالجة:
                        </div>
                        <p className="risk-description-content">
                          {r.mitigation_description ||
                            "لم يتم تدوين إجراءات تخفيف محددة بعد."}
                        </p>
                      </div>

                      <div className="risk-status-row">
                        <span className="risk-status-row-label">
                          حالة المعالجة:
                        </span>
                        <StatusBadge status={r.mitigation_status} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default RiskAssessmentReport;
