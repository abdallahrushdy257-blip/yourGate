import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationTriangle,
  faUser,
  faLandmark,
  faGraduationCap,
  faHouseUser,
  faHeartPulse,
  faPeopleRoof,
} from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "react-bootstrap";
import API from "../../api/axiosConfig";
import "./BenefitAddDetailsUnified.css";

import ForBenefitAdding from "./PartsOfBenefitAddDetails/ForBenefitAdding";
import ForBenefitBank from "./PartsOfBenefitAddDetails/ForBenefitBank";
import ForBenefitQualificationPosition from "./PartsOfBenefitAddDetails/ForBenefitQualificationPosition";
import ForBenefitHousingData from "./PartsOfBenefitAddDetails/ForBenefitHousingData";
import ForBenefitHealthData from "./PartsOfBenefitAddDetails/ForBenefitHealthData";
import ForBenefitDependentsData from "./PartsOfBenefitAddDetails/ForBenefitDependentsData";

function BenefitAddDetails({ handleDataSubmit }) {
  const { id } = useParams();

  const stepMeta = [
    { key: "mainbeneficiarydata", label: "البيانات الأساسية", icon: faUser },
    { key: "bankdata", label: "الحساب البنكي", icon: faLandmark },
    { key: "qualificationposition", label: "المؤهل والدخل", icon: faGraduationCap },
    { key: "housingdata", label: "بيانات السكن", icon: faHouseUser },
    { key: "healthdata", label: "الحالة الصحية", icon: faHeartPulse },
    { key: "dependentsdata", label: "التابعين", icon: faPeopleRoof },
  ];

  const tabs = stepMeta.map((s) => s.key);

  const [activeTab, setActiveTab] = useState("mainbeneficiarydata");
  const [isValidating, setIsValidating] = useState(true);
  const [tokenStatus, setTokenStatus] = useState({ valid: true, message: "" });
  const [isCompleted, setIsCompleted] = useState(false);
  const [formData, setFormData] = useState({
    case: null,
    bank: null,
    qualifications: null,
    housing: null,
    health: null,
    dependants: null,
  });
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [beneficiaryName, setBeneficiaryName] = useState("");

  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      try {
        setIsValidating(true);
        const res = await API.get(`/hcrequest/${id}`);
        if (isMounted) {
          if (res.status === 200 && res.data?.valid !== false) {
            setTokenStatus({ valid: true, message: "" });

            const initial = res.data?.initial_data || {};
            setFormData(initial);

            const suggested = res.data?.suggested_step;
            if (suggested && tabs.includes(suggested)) {
              setActiveTab(suggested);
            }

            const maxStep = typeof res.data?.max_step === "number" ? res.data.max_step : 0;
            setMaxStepReached(maxStep);

            if (initial?.case?.name) {
              setBeneficiaryName(initial.case.name);
            }
          } else {
            setTokenStatus({
              valid: false,
              message: res.data?.message || "الرابط غير صالح أو انتهت صلاحيته",
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          const msg =
            err.response?.data?.message ||
            "عذراً، هذا الرابط غير صالح أو منتهي الصلاحية.";
          setTokenStatus({ valid: false, message: msg });
        }
      } finally {
        if (isMounted) {
          setIsValidating(false);
        }
      }
    };

    if (id) {
      verifyToken();
    } else {
      setIsValidating(false);
      setTokenStatus({ valid: false, message: "لم يتم تزويد كود الرابط" });
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const currentIndex = tabs.indexOf(activeTab);

  const handleStepClick = (idx) => {
    // Can jump to any step <= maxStepReached or if case data exists
    if (idx <= maxStepReached || (formData.case && idx <= Math.max(maxStepReached, 1))) {
      setActiveTab(tabs[idx]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentIndex < tabs.length - 1) {
      const nextIdx = currentIndex + 1;
      setMaxStepReached((prev) => Math.max(prev, nextIdx));
      setActiveTab(tabs[nextIdx]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDataSaved = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), ...data },
    }));
    if (section === "case" && data?.name) {
      setBeneficiaryName(data.name);
    }
  };

  const handleCompleted = () => {
    setIsCompleted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isValidating) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "70vh", direction: "rtl", gap: "16px" }}
      >
        <Spinner animation="border" variant="warning" style={{ width: "3.2rem", height: "3.2rem" }} />
        <h5 style={{ color: "#7a6e5d", fontWeight: "700" }}>جارٍ التحقق من صلاحية الرابط...</h5>
      </div>
    );
  }

  if (!tokenStatus.valid) {
    return (
      <div className="bad-page-wrapper">
        <div
          className="container text-center"
          style={{
            maxWidth: "600px",
            marginTop: "60px",
            background: "#ffffff",
            padding: "44px 32px",
            borderRadius: "22px",
            border: "1.5px solid #ebdccb",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              width: "74px",
              height: "74px",
              borderRadius: "50%",
              background: "#ffebee",
              color: "#c62828",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
              marginBottom: "18px",
            }}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <h3 style={{ fontWeight: "800", color: "#3d3121", marginBottom: "10px" }}>
            رابط غير متاح
          </h3>
          <p style={{ color: "#7a6e5d", fontSize: "14.5px", lineHeight: "1.7", marginBottom: "20px" }}>
            {tokenStatus.message}
          </p>
          <div style={{ background: "#faf7f2", padding: "12px 18px", borderRadius: "12px", fontSize: "13px", color: "#8c7e6c" }}>
            يرجى التواصل مع إدارة الجمعية لتزويدكم برابط جديد وصالح.
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="bad-page-wrapper">
        <div
          className="container text-center"
          style={{
            maxWidth: "680px",
            marginTop: "60px",
            background: "#ffffff",
            padding: "50px 36px",
            borderRadius: "24px",
            border: "2px solid #c8e6c9",
            boxShadow: "0 12px 36px rgba(46, 125, 50, 0.08)",
          }}
        >
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              background: "#e8f5e9",
              color: "#2e7d32",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "44px",
              marginBottom: "20px",
            }}
          >
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <h2 style={{ fontWeight: "800", color: "#2e7d32", marginBottom: "14px" }}>
            تم استلام طلبكم بنجاح!
          </h2>
          <p style={{ color: "#424242", fontSize: "15.5px", lineHeight: "1.8", marginBottom: "22px" }}>
            شكراً لكم، لقد تم حفظ كافة البيانات والمرفقات بنجاح في نظام الجمعية. طلبكم الآن قيد دراسة الحالة والمراجعة من قبل لجنة البحث الاجتماعي.
          </p>
          <div
            style={{
              background: "#f9fbe7",
              padding: "16px 20px",
              borderRadius: "14px",
              border: "1px solid #dce775",
              color: "#827717",
              fontSize: "13.5px",
              fontWeight: "600",
              display: "inline-block",
            }}
          >
            سيتم إشعاركم بنتيجة الطلب عبر رسالة نصية أو اتصال هاتفي على الرقم المسجل.
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "mainbeneficiarydata":
        return (
          <ForBenefitAdding
            initialData={formData.case}
            onNext={handleNext}
            onSaved={(data) => handleDataSaved("case", data)}
          />
        );
      case "bankdata":
        return (
          <ForBenefitBank
            initialData={formData.bank}
            onNext={handleNext}
            onPrev={handlePrev}
            onSaved={(data) => handleDataSaved("bank", data)}
          />
        );
      case "qualificationposition":
        return (
          <ForBenefitQualificationPosition
            initialData={formData.qualifications}
            onNext={handleNext}
            onPrev={handlePrev}
            onSaved={(data) => handleDataSaved("qualifications", data)}
          />
        );
      case "housingdata":
        return (
          <ForBenefitHousingData
            initialData={formData.housing}
            onNext={handleNext}
            onPrev={handlePrev}
            onSaved={(data) => handleDataSaved("housing", data)}
          />
        );
      case "healthdata":
        return (
          <ForBenefitHealthData
            initialData={formData.health}
            onNext={handleNext}
            onPrev={handlePrev}
            onSaved={(data) => handleDataSaved("health", data)}
          />
        );
      case "dependentsdata":
        return (
          <ForBenefitDependentsData
            initialData={formData.dependants}
            onNext={handleNext}
            onPrev={handlePrev}
            onCompleted={handleCompleted}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bad-page-wrapper">
      <div className="bad-container">
        {/* Header */}
        <div className="bad-header">
          <h2 className="bad-main-title">استمارة تسجيل بيانات المستفيد</h2>
          <p className="bad-sub-title">
            الخطوة {currentIndex + 1} من {stepMeta.length}: {stepMeta[currentIndex]?.label}
          </p>
        </div>

        {/* Resume Banner */}
        {beneficiaryName && (
          <div className="bad-resume-alert">
            <div className="d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} style={{ color: "#b89358", fontSize: "18px" }} />
              <p className="bad-resume-text">
                مرحباً بك <strong>{beneficiaryName}</strong>، تم استرجاع بياناتك السابقة بنجاح. يمكنك المتابعة أو النقر على أي خطوة سابقة لتعديل بياناتك.
              </p>
            </div>
            <span className="bad-resume-badge">استئناف الطلب</span>
          </div>
        )}

        {/* Stepper */}
        <div className="bad-stepper-container">
          <div className="bad-stepper">
            {stepMeta.map((step, idx) => {
              const isPassed = idx < currentIndex;
              const isActive = activeTab === step.key;
              const isClickable = idx <= maxStepReached || (Boolean(formData.case) && idx <= Math.max(maxStepReached, 1));

              return (
                <div
                  key={step.key}
                  className={`bad-step-item ${isClickable ? "clickable" : ""}`}
                  onClick={() => isClickable && handleStepClick(idx)}
                  title={isClickable ? `الانتقال إلى: ${step.label}` : ""}
                >
                  <div
                    className={`bad-step-circle ${
                      isActive ? "active" : isPassed ? "passed" : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={isPassed ? faCheckCircle : step.icon} />
                  </div>
                  <span
                    className={`bad-step-label ${
                      isActive ? "active" : isPassed ? "passed" : ""
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Body */}
        {renderContent()}
      </div>
    </div>
  );
}

export default BenefitAddDetails;
