import React, { useState, useEffect, useRef } from "react";
import "./organizationalchart.css";
import Title from "../../../../components/title";
import { faChartDiagram, faXmark, faPrint, faCrown, faUser, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Col, Image, Modal, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../../../../api/axiosConfig";
import TestPreLoader from "../../../common/pages/TestPreLoader/TestPreLoader";
import PrintHead from "../../../../components/PrintHead";
import PrintFooter from "../../../../components/PrintFooter";
import { toLocal } from "../../../../shared/Utils/toLocal";

/* -------------------------------------------------------------------------- */
/*                            مودال عرض بيانات البروفايل                         */
/* -------------------------------------------------------------------------- */
const ProfileModal = ({ show, handleClose, person }) => {
  const printRef = useRef(null);

  const handlePrint = () => {
    if (!person) return;

    const defaultAvatar = person.gender === "1"
      ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

    const avatarUrl = person.photo || defaultAvatar;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("يرجى السماح بالنوافذ المنبثقة للطباعة");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>الملف الوظيفي - ${person.name || ""}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

          @page {
            size: A4 portrait;
            margin: 15mm 18mm 15mm 18mm;
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: 'Tajawal', 'Segoe UI', Tahoma, Arial, sans-serif;
            direction: rtl;
            color: #2b251f;
            background: #ffffff;
            font-size: 13px;
            line-height: 1.6;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Header Card */
          .doc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2.5px solid #c29a64;
            padding-bottom: 14px;
            margin-bottom: 20px;
          }

          .org-title {
            font-size: 20px;
            font-weight: 900;
            color: #8b6534;
            margin-bottom: 4px;
          }

          .doc-badge {
            display: inline-block;
            background: #fdfaf6;
            color: #8b6534;
            font-size: 13px;
            font-weight: 800;
            padding: 3px 12px;
            border-radius: 4px;
            border: 1px solid #e8dbc8;
            border-right: 4px solid #c29a64;
          }

          .doc-meta {
            font-size: 11.5px;
            color: #555;
            text-align: left;
            line-height: 1.8;
          }

          .doc-meta strong {
            color: #222;
          }

          /* Profile Hero Card */
          .profile-hero {
            display: flex;
            align-items: center;
            gap: 22px;
            background: #fdfbf8;
            border: 1.5px solid #ebdcc8;
            border-right: 5px solid #c29a64;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 22px;
          }

          .profile-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #c29a64;
            box-shadow: 0 4px 10px rgba(194, 154, 100, 0.25);
            flex-shrink: 0;
          }

          .hero-info h2 {
            font-size: 19px;
            font-weight: 800;
            color: #382f22;
            margin-bottom: 4px;
          }

          .hero-role {
            font-size: 14px;
            color: #8b6534;
            font-weight: 700;
            margin-bottom: 6px;
          }

          .hero-badge {
            display: inline-block;
            background: rgba(194, 154, 100, 0.15);
            color: #7d5926;
            font-size: 11.5px;
            font-weight: 700;
            padding: 2px 10px;
            border-radius: 20px;
            border: 1px solid rgba(194, 154, 100, 0.3);
          }

          /* Sections */
          .section-card {
            border: 1px solid #e6dace;
            border-radius: 10px;
            margin-bottom: 18px;
            overflow: hidden;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .section-header {
            background: #fbf7f0;
            color: #493d2c;
            padding: 9px 16px;
            font-size: 13.5px;
            font-weight: 800;
            border-bottom: 1px solid #e6dace;
            border-right: 4px solid #c29a64;
          }

          .section-body {
            padding: 14px 16px;
          }

          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px 18px;
          }

          .info-item {
            background: #fcfbfa;
            border: 1px solid #f0e6da;
            border-radius: 6px;
            padding: 8px 12px;
          }

          .info-label {
            display: block;
            font-size: 11px;
            color: #7a6e5d;
            font-weight: 700;
            margin-bottom: 2px;
          }

          .info-value {
            font-size: 13px;
            font-weight: 700;
            color: #2b251f;
          }

          .salary-value {
            color: #1e7e34;
            font-size: 14px;
          }

          /* Signatures Footer */
          .signatures-row {
            display: flex;
            justify-content: space-between;
            margin-top: 35px;
            padding-top: 18px;
            border-top: 1.5px dashed #d9cbba;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .sig-box {
            text-align: center;
            width: 30%;
          }

          .sig-title {
            font-weight: 800;
            color: #382f22;
            margin-bottom: 45px;
            font-size: 12.5px;
          }

          .sig-line {
            border-top: 1px dotted #8b7d6b;
            padding-top: 4px;
            font-size: 11px;
            color: #776a58;
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div class="doc-header">
          <div>
            <div class="org-title">جمعية بوابة الخير الأهلية</div>
            <span class="doc-badge">بطاقة الملف الوظيفي والشخصي</span>
          </div>
          <div class="doc-meta">
            <div>الرقم الوظيفي: <strong>${person.job_number || "غير محدد"}</strong></div>
            <div>تاريخ الطباعة: <strong>${new Date().toLocaleDateString("ar-SA")}</strong></div>
            <div>القسم / الإدارة: <strong>${person.department || "الموارد البشرية"}</strong></div>
          </div>
        </div>

        <!-- Profile Hero -->
        <div class="profile-hero">
          <img src="${avatarUrl}" class="profile-avatar" alt="${person.name}" onerror="this.src='${defaultAvatar}'" />
          <div class="hero-info">
            <h2>${person.name || "غير محدد"}</h2>
            <div class="hero-role">${person.job_title || "موظف"}</div>
            ${person.job_number ? `<span class="hero-badge">الرقم الوظيفي: ${person.job_number}</span>` : ""}
          </div>
        </div>

        <!-- Basic Info Section -->
        <div class="section-card">
          <div class="section-header">المعلومات الشخصية والوظيفية الأساسية</div>
          <div class="section-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">البريد الإلكتروني</span>
                <span class="info-value">${person.email || "غير متوفر"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">رقم الهاتف</span>
                <span class="info-value" dir="ltr">${person.phone || "غير متوفر"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">العنوان الوطني / السكن</span>
                <span class="info-value">${person.address || "غير متوفر"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">تاريخ التعيين</span>
                <span class="info-value">${person.date_of_joining || "غير متوفر"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">المؤهل العلمي</span>
                <span class="info-value">${person.qualification || "غير متوفر"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">الحالة الاجتماعية</span>
                <span class="info-value">
                  ${person.marital_status === "single" || person.marital_status === "0"
                    ? "أعزب / عزباء"
                    : person.marital_status === "married" || person.marital_status === "1"
                    ? "متزوج / متزوجة"
                    : "غير متوفر"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Info Section -->
        <div class="section-card">
          <div class="section-header">المعلومات المالية والبنكية</div>
          <div class="section-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">إجمالي الراتب الشهري</span>
                <span class="info-value salary-value">
                  ${person.total_salary ? `${toLocal(person.total_salary)} ر.س` : "غير متوفر"}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">رقم الحساب البنكي (IBAN)</span>
                <span class="info-value" style="font-family: monospace;">${person.bank_account_number || "غير متوفر"}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Official Signatures -->
        <div class="signatures-row">
          <div class="sig-box">
            <div class="sig-title">الموظف المعني</div>
            <div class="sig-line">التوقيع / المصادقة</div>
          </div>
          <div class="sig-box">
            <div class="sig-title">مدير إدارة الموارد البشرية</div>
            <div class="sig-line">الاعتماد والتاريخ</div>
          </div>
          <div class="sig-box">
            <div class="sig-title">الختم الرسمي للجمعية</div>
            <div class="sig-line">المصادقة الرسمية</div>
          </div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  if (!person) return null;

  const defaultAvatar = person.gender === "1" 
    ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

  return (
    <Modal
      className="dir profile-modal-custom"
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      dir="rtl"
    >
      <Modal.Header className="d-flex justify-content-between align-items-center" style={{ borderBottom: "1.5px solid rgba(194, 154, 100, 0.25)" }}>
        <Modal.Title className="fs-5 fw-bold d-flex align-items-center gap-2" style={{ color: "var(--text-color, #493d2c)" }}>
          <FontAwesomeIcon icon={faChartDiagram} style={{ color: "#c29a64" }} />
          <span>الملف الوظيفي والشخصي: {person.name}</span>
        </Modal.Title>
        <Button
          className="custom-close-button cls-btn"
          variant="link"
          onClick={handleClose}
        >
          <FontAwesomeIcon icon={faXmark} className="closeModal" />
        </Button>
      </Modal.Header>

      <Modal.Body className="dir p-4">
        {/* الجزء المخصص للطباعة والعرض */}
        <div ref={printRef} className="printable-profile-container p-3">
          <PrintHead />

          <Row className="align-items-center print-profile-body">
            {/* الصورة والبيانات الأساسية العلوية */}
            <Col md={4} className="text-center border-end-md pb-3 pb-md-0">
              <div className="mb-3 position-relative d-inline-block">
                <Image
                  src={person.photo || defaultAvatar}
                  roundedCircle
                  style={{
                    width: "140px",
                    height: "140px",
                    objectFit: "cover",
                    border: "3px solid #c29a64",
                    boxShadow: "0 4px 14px rgba(168, 126, 69, 0.25)",
                  }}
                  alt={person.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatar;
                  }}
                />
              </div>
              <h4 className="fw-bold mb-1" style={{ color: "var(--text-color, #493d2c)" }}>{person.name}</h4>
              <p className="text-muted small mb-2">{person.job_title || "موظف"}</p>
              {person.job_number && (
                <span className="badge px-3 py-2 rounded-pill" style={{ background: "rgba(194, 154, 100, 0.15)", color: "#875f28", fontSize: "12px" }}>
                  الرقم الوظيفي: {person.job_number}
                </span>
              )}
            </Col>

            {/* تفاصيل البيانات الشخصية والمالية */}
            <Col md={8} className="text-end ps-md-4">
              <div className="profile-section mb-4">
                <h5 className="fw-bold border-bottom pb-2 mb-3" style={{ color: "var(--text-color, #493d2c)", borderColor: "rgba(194, 154, 100, 0.25)" }}>
                  المعلومات الأساسية
                </h5>
                <Row className="g-2">
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="text-muted small d-block">البريد الإلكتروني:</strong>
                      <span>{person.email || "غير متوفر"}</span>
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="text-muted small d-block">رقم الهاتف:</strong>
                      <span dir="ltr">{person.phone || "غير متوفر"}</span>
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="text-muted small d-block">العنوان:</strong>
                      <span>{person.address || "غير متوفر"}</span>
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="text-muted small d-block">تاريخ التعيين:</strong>
                      <span>{person.date_of_joining || "غير متوفر"}</span>
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="text-muted small d-block">المؤهل العلمي:</strong>
                      <span>{person.qualification || "غير متوفر"}</span>
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="text-muted small d-block">الحالة الاجتماعية:</strong>
                      <span>
                        {person.marital_status === "single" || person.marital_status === "0"
                          ? "أعزب / عزباء"
                          : person.marital_status === "married" || person.marital_status === "1"
                          ? "متزوج / متزوجة"
                          : "غير متوفر"}
                      </span>
                    </p>
                  </Col>
                </Row>
              </div>

              <div className="profile-section">
                <h5 className="fw-bold border-bottom pb-2 mb-3" style={{ color: "var(--text-color, #493d2c)", borderColor: "rgba(194, 154, 100, 0.25)" }}>
                  المعلومات المالية
                </h5>
                <Row className="g-2">
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="text-muted small d-block">إجمالي الراتب:</strong>
                      <span className="fw-bold text-success fs-6">
                        {person.total_salary
                          ? `${toLocal(person.total_salary)} ر.س`
                          : "غير متوفر"}
                      </span>
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="text-muted small d-block">رقم الحساب البنكي (IBAN):</strong>
                      <span className="font-monospace small">{person.bank_account_number || "غير متوفر"}</span>
                    </p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <PrintFooter />
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between align-items-center">
        <Button
          onClick={handlePrint}
          className="d-flex align-items-center gap-2 px-4 rounded-pill"
          style={{
            background: "linear-gradient(135deg, #c29a64 0%, #a87e45 100%)",
            color: "#fff",
            border: "none",
            fontWeight: 700,
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(168, 126, 69, 0.3)",
          }}
        >
          <FontAwesomeIcon icon={faPrint} />
          طباعة الملف
        </Button>

        <Button variant="outline-secondary" onClick={handleClose} className="px-4 rounded-pill">
          إغلاق
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

/* -------------------------------------------------------------------------- */
/*                            بطاقة عرض الموظف                                */
/* -------------------------------------------------------------------------- */
const PersonCard = ({ person, isManager = false, onClick }) => {
  const defaultAvatar = person.gender === "1" 
    ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

  return (
    <div
      className={`person-card ${isManager ? "manager" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {isManager && (
        <div className="role-badge">
          <FontAwesomeIcon icon={faCrown} /> مدير القسم
        </div>
      )}
      <div className="avatar">
        {person.photo ? (
          <img
            src={person.photo}
            alt={person.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatar;
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        ) : (
          <FontAwesomeIcon icon={faUser} />
        )}
      </div>
      <div className="person-name">{person.name}</div>
      <div className="person-role">
        {isManager ? "مدير قسم" : (person.job_title || "موظف")}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                          المكون الرئيسي للهيكل                              */
/* -------------------------------------------------------------------------- */
function OrganizationalChart() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [data, setData] = useState([]);

  const handleShowModal = (person) => {
    setSelectedPerson(person);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPerson(null);
  };

  // جلب بيانات الهيكل التنظيمي من الـ Backend
  const getChart = async () => {
    try {
      setLoading(true);
      const res = await API.get("/organizational-chart");
      const chartData = res.data?.data || res.data || [];
      setData(Array.isArray(chartData) ? chartData : []);
    } catch (err) {
      console.error("Error loading organizational chart:", err);
      toast.error("فشل في تحميل بيانات الهيكل التنظيمي");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChart();
  }, []);

  return loading ? (
    <TestPreLoader />
  ) : (
    <>
      <div className="org-chart-container">
        <div className="d-flex justify-content-between align-items-center w-100 max-w-1200 px-3">
          <Title
            title="الهيكل التنظيمي للشركة"
            icon={<FontAwesomeIcon icon={faChartDiagram} />}
            style={{ width: "unset" }}
          />

          <button
            type="button"
            onClick={getChart}
            className="btn rounded-pill d-flex align-items-center gap-2 px-3 py-2"
            style={{
              background: "var(--surface-color, #fff)",
              border: "1.5px solid rgba(194, 154, 100, 0.4)",
              color: "var(--text-color, #493d2c)",
              fontWeight: 600,
              fontSize: "14px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}
          >
            <FontAwesomeIcon icon={faSyncAlt} />
            <span>تحديث الهيكل</span>
          </button>
        </div>

        <div className="departments-wrapper">
          {data.length === 0 ? (
            <div className="text-center py-5 w-100">
              <FontAwesomeIcon icon={faChartDiagram} style={{ fontSize: "3rem", color: "#c29a64", opacity: 0.4 }} className="mb-3" />
              <h5 className="fw-bold" style={{ color: "var(--text-color, #493d2c)" }}>لا توجد أقسام مسجلة حالياً</h5>
              <p className="text-muted small">يرجى إضافة أقسام وتعيين موظفين لتظهر في الهيكل التنظيمي.</p>
            </div>
          ) : (
            data.map((dept) => (
              <div key={dept.uuid || dept.id} className="department-card">
                {/* اسم القسم */}
                <div className="department-header">
                  <h2>{dept.name}</h2>
                  {dept.description && <p className="text-muted small mt-1 mb-0">{dept.description}</p>}
                </div>

                {/* مدير القسم */}
                {dept.manager ? (
                  <div className="manager-section">
                    <div className="card-manager-container">
                      <PersonCard
                        person={dept.manager}
                        isManager={true}
                        onClick={() => handleShowModal(dept.manager)}
                      />
                      {dept.employees && dept.employees.length > 0 && (
                        <div className="card-manager-pipe"></div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center my-4 py-2 px-3 rounded-pill d-inline-block" style={{ background: "rgba(194, 154, 100, 0.1)", color: "#875f28", margin: "20px auto" }}>
                    لا يوجد مدير معيّن لهذا القسم
                  </div>
                )}

                {/* موظفي القسم */}
                <div
                  data-title="الموظفون"
                  className="employees-grid-container"
                >
                  <div className="employees-pipe"></div>
                  <div className="employees-grid">
                    {dept.employees && dept.employees.length > 0 ? (
                      dept.employees.map((employee) => (
                        <div className="employees-card-container" key={employee.uuid || employee.id}>
                          <PersonCard
                            person={employee}
                            onClick={() => handleShowModal(employee)}
                          />
                        </div>
                      ))
                    ) : (
                      <p
                        style={{
                          color: "#8a7e6b",
                          gridColumn: "1 / -1",
                          textAlign: "center",
                          margin: "15px 0",
                          fontSize: "14px",
                        }}
                      >
                        لا يوجد موظفون إضافيون في هذا القسم
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedPerson && (
          <ProfileModal
            show={showModal}
            handleClose={handleCloseModal}
            person={selectedPerson}
          />
        )}
      </div>
    </>
  );
}

export default OrganizationalChart;