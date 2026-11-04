import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./ShowEmployee.css";
import API from "../../api/axiosConfig";
import TestPreloader from "../TestPreLoader/TestPreLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faArrowRight,
  faPrint,
  faPenToSquare,
  faIdCard,
  faBriefcase,
  faMoneyBillWave,
  faCalendarAlt,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faFileAlt,
  faDownload,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

function ShowEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");

  const getEmployee = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/employees/${id}`);
      if (res.status === 200) {
        const item = res.data?.data || res.data || {};
        setEmployee(item);
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployee();
  }, [id]);

  const calculateAge = (dob) => {
    if (!dob) return "—";
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return "—";
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + " سنة";
  };

  const defaultAvatar =
    "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?semt=ais_hybrid";

  if (loading) {
    return <TestPreloader />;
  }

  if (!employee) {
    return (
      <div className="show-emp-container text-center py-5">
        <h4>لم يتم العثور على بيانات الموظف</h4>
        <Link to="/addnewemployee" className="btn btn-primary mt-3">
          العودة لقائمة الموظفين
        </Link>
      </div>
    );
  }

  const idTypes = ["بطاقة هوية وطنية", "جواز سفر", "إقامة نظامية"];
  const socialStatuses = ["أعزب", "متزوج", "مطلق", "أرمل"];
  const workTypes = ["دوام كامل", "دوام جزئي"];

  return (
    <div className="show-emp-container">
      {/* ── Top Bar with Actions ── */}
      <div className="show-emp-topbar no-print">
        <button
          type="button"
          className="show-emp-btn show-emp-btn-outline"
          onClick={() => navigate("/addnewemployee")}
        >
          <FontAwesomeIcon icon={faArrowRight} />
          <span>العودة للموظفين</span>
        </button>

        <div className="show-emp-actions">
          <button
            type="button"
            className="show-emp-btn show-emp-btn-outline"
            onClick={() => window.print()}
          >
            <FontAwesomeIcon icon={faPrint} />
            <span>طباعة الملف</span>
          </button>

          <Link
            to={`/showEmployeeCard/${employee.id}`}
            className="show-emp-btn show-emp-btn-outline"
          >
            <FontAwesomeIcon icon={faIdCard} />
            <span>بطاقة الموظف</span>
          </Link>

          <Link
            to={`/editemployee/${employee.id}`}
            className="show-emp-btn show-emp-btn-primary"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
            <span>تعديل البيانات</span>
          </Link>
        </div>
      </div>

      {/* ── Profile Hero Card ── */}
      <div className="show-emp-hero-card">
        <div className="show-emp-hero-content">
          <div className="show-emp-avatar-wrapper">
            <img
              src={employee.photo || defaultAvatar}
              alt={employee.name || "Employee"}
              className="show-emp-avatar"
            />
            <span className="show-emp-online-indicator" />
          </div>

          <div className="show-emp-hero-details">
            <h2>{employee.name || "اسم الموظف"}</h2>
            <div className="show-emp-hero-tags">
              <span className="show-emp-job-badge">
                <FontAwesomeIcon icon={faBriefcase} className="ms-1" />
                {employee.jobname || employee.jobtitle?.title || "غير محدد"}
              </span>
              <span className="show-emp-status-badge">
                {workTypes[employee.worktype] || "دوام كامل"}
              </span>
              {employee.phone && (
                <span className="text-muted small d-inline-flex align-items-center gap-1">
                  <FontAwesomeIcon icon={faPhone} />
                  <span dir="ltr">{employee.phone}</span>
                </span>
              )}
              {employee.email && (
                <span className="text-muted small d-inline-flex align-items-center gap-1">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>{employee.email}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Metrics Summary Strip ── */}
      <div className="show-emp-metrics-grid">
        <div className="show-emp-metric-card">
          <div
            className="show-emp-metric-icon"
            style={{ background: "rgba(194, 154, 100, 0.15)", color: "#a87e45" }}
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
          </div>
          <div className="show-emp-metric-info">
            <span className="show-emp-metric-label">تاريخ التعيين</span>
            <span className="show-emp-metric-val">
              {employee.dateofhire || "—"}
            </span>
          </div>
        </div>

        <div className="show-emp-metric-card">
          <div
            className="show-emp-metric-icon"
            style={{ background: "rgba(46, 196, 182, 0.15)", color: "#1a8f84" }}
          >
            <FontAwesomeIcon icon={faMoneyBillWave} />
          </div>
          <div className="show-emp-metric-info">
            <span className="show-emp-metric-label">الراتب الصافي</span>
            <span className="show-emp-metric-val">
              {employee.total_salary ? `${employee.total_salary} ريال` : "—"}
            </span>
          </div>
        </div>

        <div className="show-emp-metric-card">
          <div
            className="show-emp-metric-icon"
            style={{ background: "rgba(67, 97, 238, 0.15)", color: "#4361ee" }}
          >
            <FontAwesomeIcon icon={faIdCard} />
          </div>
          <div className="show-emp-metric-info">
            <span className="show-emp-metric-label">رقم الهوية</span>
            <span className="show-emp-metric-val">
              {employee.nationalid || employee.idnumber || "—"}
            </span>
          </div>
        </div>

        <div className="show-emp-metric-card">
          <div
            className="show-emp-metric-icon"
            style={{ background: "rgba(247, 127, 0, 0.15)", color: "#f77f00" }}
          >
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="show-emp-metric-info">
            <span className="show-emp-metric-label">العمر التقريبي</span>
            <span className="show-emp-metric-val">
              {calculateAge(employee.dob || employee.dateofbirth)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Section Navigation Tabs ── */}
      <div className="show-emp-nav-tabs no-print">
        <button
          type="button"
          className={`show-emp-tab-btn ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <FontAwesomeIcon icon={faUser} />
          <span>البيانات الشخصية</span>
        </button>

        <button
          type="button"
          className={`show-emp-tab-btn ${activeTab === "job" ? "active" : ""}`}
          onClick={() => setActiveTab("job")}
        >
          <FontAwesomeIcon icon={faBriefcase} />
          <span>بيانات الوظيفة والتعاقد</span>
        </button>

        <button
          type="button"
          className={`show-emp-tab-btn ${activeTab === "salary" ? "active" : ""}`}
          onClick={() => setActiveTab("salary")}
        >
          <FontAwesomeIcon icon={faMoneyBillWave} />
          <span>تفاصيل الراتب والبدلات</span>
        </button>

        <button
          type="button"
          className={`show-emp-tab-btn ${activeTab === "docs" ? "active" : ""}`}
          onClick={() => setActiveTab("docs")}
        >
          <FontAwesomeIcon icon={faFileAlt} />
          <span>المستندات المرفقة ({employee.documents?.length || 0})</span>
        </button>
      </div>

      {/* ── Tab 1: General Personal Info ── */}
      {activeTab === "general" && (
        <div className="show-emp-card">
          <div className="show-emp-card-header">
            <FontAwesomeIcon icon={faUser} style={{ color: "#c29a64" }} />
            <span>البيانات الشخصية والتعريفية</span>
          </div>

          <div className="show-emp-fields-grid">
            <div className="show-emp-field">
              <span className="show-emp-field-title">الاسم الكامل</span>
              <span className="show-emp-field-content">{employee.name || "—"}</span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">النوع</span>
              <span className="show-emp-field-content">
                {String(employee.gender) === "1" ? "أنثى" : "ذكر"}
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">نوع الهوية</span>
              <span className="show-emp-field-content">
                {idTypes[employee.idtype] || "بطاقة هوية وطنية"}
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">رقم الهوية / الإقامة</span>
              <span className="show-emp-field-content">
                {employee.nationalid || employee.idnumber || "—"}
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">تاريخ انتهاء الهوية</span>
              <span className="show-emp-field-content">
                {employee.nationalid_expire || employee.idexpiredate || "—"}
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">تاريخ الميلاد</span>
              <span className="show-emp-field-content">
                {employee.dob || employee.dateofbirth || "—"}
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">الجنسية</span>
              <span className="show-emp-field-content">{employee.nationality || "—"}</span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">الحالة الاجتماعية</span>
              <span className="show-emp-field-content">
                {socialStatuses[employee.status] || "أعزب"}
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">رقم الجوال</span>
              <span className="show-emp-field-content" dir="ltr">
                {employee.phone || "—"}
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">البريد الإلكتروني</span>
              <span className="show-emp-field-content" dir="ltr">
                {employee.email || "—"}
              </span>
            </div>

            <div className="show-emp-field" style={{ gridColumn: "1 / -1" }}>
              <span className="show-emp-field-title">العنوان الوطني / السكن</span>
              <span className="show-emp-field-content">{employee.address || "—"}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Job & Contract Info ── */}
      {activeTab === "job" && (
        <div className="show-emp-card">
          <div className="show-emp-card-header">
            <FontAwesomeIcon icon={faBriefcase} style={{ color: "#c29a64" }} />
            <span>بيانات الوظيفة والتعاقد</span>
          </div>

          <div className="show-emp-fields-grid">
            <div className="show-emp-field">
              <span className="show-emp-field-title">المسمى الوظيفي</span>
              <span className="show-emp-field-content">
                {employee.jobname || employee.jobtitle?.title || "غير محدد"}
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">نوع العمل</span>
              <span className="show-emp-field-content">
                {workTypes[employee.worktype] || "دوام كامل"}
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">تاريخ التعيين</span>
              <span className="show-emp-field-content">
                {employee.dateofhire || employee.workdate || "—"}
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">تاريخ انتهاء العقد</span>
              <span className="show-emp-field-content">
                {employee.contractexpiration || employee.expirehire || "—"}
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">المؤهل العلمي</span>
              <span className="show-emp-field-content">
                {employee.qualification || "—"}
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">رقم الحساب البنكي (IBAN)</span>
              <span className="show-emp-field-content" dir="ltr">
                {employee.iban || employee.ibannumber || "—"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 3: Salary & Allowances ── */}
      {activeTab === "salary" && (
        <div className="show-emp-card">
          <div className="show-emp-card-header">
            <FontAwesomeIcon icon={faMoneyBillWave} style={{ color: "#c29a64" }} />
            <span>تفاصيل الراتب الشهري والبدلات</span>
          </div>

          <div className="show-emp-fields-grid">
            <div className="show-emp-field">
              <span className="show-emp-field-title">الراتب الأساسي</span>
              <span className="show-emp-field-content">
                {employee.basic_salary ?? employee.basic ?? 0} ريال
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">التأمين الاجتماعي (مستقطع)</span>
              <span className="show-emp-field-content" style={{ color: "#dc3545" }}>
                - {employee.social_insurance ?? employee.socialinsurance ?? 0} ريال
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">بدل السكن</span>
              <span className="show-emp-field-content">
                {employee.housing_allowance ?? employee.house ?? 0} ريال
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">بدل المواصلات</span>
              <span className="show-emp-field-content">
                {employee.transport_allowance ?? employee.transport ?? 0} ريال
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">بدل اتصال</span>
              <span className="show-emp-field-content">
                {employee.communication_allowance ?? employee.communication ?? 0} ريال
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">بدل إعاشة</span>
              <span className="show-emp-field-content">
                {employee.life_allowance ?? employee.life ?? 0} ريال
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">بدل طبيعة عمل</span>
              <span className="show-emp-field-content">
                {employee.work_allowance ?? employee.work ?? 0} ريال
              </span>
            </div>

            <div className="show-emp-field">
              <span className="show-emp-field-title">حساب ترحيل الراتب</span>
              <span className="show-emp-field-content">
                {employee.salary_account ?? employee.account ?? "الرواتب والأجور النقدية"}
              </span>
            </div>

            <div
              className="show-emp-field"
              style={{
                gridColumn: "1 / -1",
                background: "rgba(194, 154, 100, 0.12)",
                borderColor: "#c29a64",
                padding: "16px 20px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <span style={{ fontSize: "16px", fontWeight: 700, color: "#3a2e1d" }}>
                  إجمالي الراتب الصافي الشهري:
                </span>
                <span
                  style={{ fontSize: "20px", fontWeight: 800, color: "#b28647" }}
                >
                  {employee.total_salary ?? 0} ريال
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 4: Documents ── */}
      {activeTab === "docs" && (
        <div className="show-emp-card">
          <div className="show-emp-card-header">
            <FontAwesomeIcon icon={faFileAlt} style={{ color: "#c29a64" }} />
            <span>المستندات والوثائق المرفقة</span>
          </div>

          {employee.documents && employee.documents.length > 0 ? (
            <div className="show-emp-docs-grid">
              {employee.documents.map((doc, idx) => (
                <div key={idx} className="show-emp-doc-item">
                  <div>
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      style={{ fontSize: "28px", color: "#dc3545", marginBottom: "10px" }}
                    />
                    <div className="show-emp-doc-title">{doc.title || `مستند ${idx + 1}`}</div>
                  </div>
                  <a
                    href={doc.url || doc.file_path}
                    target="_blank"
                    rel="noreferrer"
                    className="show-emp-doc-link"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    <span>تحميل / معاينة</span>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <FontAwesomeIcon icon={faFileAlt} style={{ fontSize: "40px", opacity: 0.3 }} />
              <p className="mt-3">لا توجد مستندات مرفقة لهذا الموظف</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ShowEmployee;
