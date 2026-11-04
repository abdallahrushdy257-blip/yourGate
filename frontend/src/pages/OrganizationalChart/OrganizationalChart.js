import React, { useState, useEffect, useRef } from "react";
import "./organizationalchart.css";
import Title from "../../components/title";
import { faChartDiagram, faXmark, faPrint, faCrown, faUser, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Col, Image, Modal, Button, Spinner } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import PrintHead from "../../components/PrintHead";
import PrintFooter from "../../components/PrintFooter";
import { toLocal } from "../../Utils/toLocal";

/* -------------------------------------------------------------------------- */
/*                            مودال عرض بيانات البروفايل                         */
/* -------------------------------------------------------------------------- */
const ProfileModal = ({ show, handleClose, person }) => {
  const printRef = useRef(null);

  // إعداد الطباعة باستخدام react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: person ? `الملف الشخصي - ${person.name}` : "الملف الشخصي",
  });

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