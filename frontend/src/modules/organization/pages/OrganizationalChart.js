import React, { useState, useEffect, useRef } from "react";
import "./organizationalchart.css";
import Title from "../../../components/title";
import { faChartDiagram, faXmark, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Col, Image, Modal, Button } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
// import API from "../../../api/axiosConfig";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";
import PrintHead from "../../../components/PrintHead";
import PrintFooter from "../../../components/PrintFooter";

// بيانات وهمية تجريبية (Static / Dummy Data)
const mockData = [
  {
    uuid: "dept-1",
    name: "إدارة تكنولوجيا المعلومات (IT)",
    manager: {
      uuid: "emp-101",
      name: "أحمد محمود",
      photo: "https://i.pravatar.cc/150?img=11",
      job_number: "IT-001",
      email: "ahmed.mahmoud@company.com",
      phone: "01012345678",
      address: "القاهرة، مصر",
      date_of_joining: "2020-01-15",
      qualification: "بكالوريوس حاسبات ومعلومات",
      marital_status: "married",
      total_salary: 25000,
      bank_account_number: "EG12345678901234567890123",
    },
    employees: [
      {
        uuid: "emp-102",
        name: "سارة علي",
        photo: "https://i.pravatar.cc/150?img=5",
        job_number: "IT-002",
        email: "sara.ali@company.com",
        phone: "01123456789",
        address: "الجيزة، مصر",
        date_of_joining: "2021-06-01",
        qualification: "بكالوريوس هندسة حاسبات",
        marital_status: "single",
        total_salary: 15000,
        bank_account_number: "EG98765432109876543210987",
      },
      {
        uuid: "emp-103",
        name: "عمر خالد",
        photo: "https://i.pravatar.cc/150?img=12",
        job_number: "IT-003",
        email: "omar.khaled@company.com",
        phone: "01234567890",
        address: "الإسكندرية، مصر",
        date_of_joining: "2022-03-10",
        qualification: "بكالوريوس نظم معلومات",
        marital_status: "single",
        total_salary: 12000,
        bank_account_number: "EG55566677788899900011122",
      },
    ],
  },
  {
    uuid: "dept-2",
    name: "إدارة الموارد البشرية (HR)",
    manager: {
      uuid: "emp-201",
      name: "منى يوسف",
      photo: "https://i.pravatar.cc/150?img=9",
      job_number: "HR-001",
      email: "mona.youssef@company.com",
      phone: "01098765432",
      address: "التجمع الخامس، القاهرة",
      date_of_joining: "2019-11-01",
      qualification: "بكالوريوس إدارة أعمال",
      marital_status: "married",
      total_salary: 22000,
      bank_account_number: "EG11122233344455566677788",
    },
    employees: [
      {
        uuid: "emp-202",
        name: "حسام حسن",
        photo: "",
        job_number: "HR-002",
        email: "hossam.hassan@company.com",
        phone: "01155443322",
        address: "المعادي، القاهرة",
        date_of_joining: "2023-01-15",
        qualification: "ليسانس حقوق",
        marital_status: "single",
        total_salary: 10000,
        bank_account_number: "EG33344455566677788899900",
      },
    ],
  },
  {
    uuid: "dept-3",
    name: "إدارة التسويق (Marketing)",
    manager: null,
    employees: [],
  },
];

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

  const defaultAvatar = "https://via.placeholder.com/150";

  return (
    <Modal
      className="dir"
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      dir="rtl"
    >
      <Modal.Header className="d-flex justify-content-between align-items-center">
        <Modal.Title className="fs-5 fw-bold">
          <FontAwesomeIcon icon={faChartDiagram} className="ms-2 text-primary" />
          الملف الشخصي: {person.name}
        </Modal.Title>
        <Button
          className="custom-close-button cls-btn"
          variant="link"
          onClick={handleClose}
        >
          <FontAwesomeIcon icon={faXmark} className="closeModal" />
        </Button>
      </Modal.Header>

      <Modal.Body className="dir">
        {/* الجزء المخصص للطباعة والعرض */}
        <div ref={printRef} className="printable-profile-container p-3">
          <PrintHead />

          {/* تم إضافة className="print-profile-body" هنا لضبط المسافة أسفل الهيدر عند الطباعة */}
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
                    border: "3px solid var(--border-color, #00897b)",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                  }}
                  alt={person.name}
                />
              </div>
              <h4 className="fw-bold mb-1">{person.name}</h4>
              {person.job_number && (
                <span className="badge bg-light text-dark border px-3 py-2 rounded-pill mt-1">
                  الرقم الوظيفي: {person.job_number}
                </span>
              )}
            </Col>

            {/* تفاصيل البيانات الشخصية والمالية */}
            <Col md={8} className="text-end ps-md-4">
              <div className="profile-section mb-4">
                <h5 className="fw-bold text-primary border-bottom pb-2 mb-3">
                  المعلومات الأساسية
                </h5>
                <Row className="g-2">
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="">البريد الإلكتروني:</strong>{" "}
                      <br />
                      <span>{person.email || "غير متوفر"}</span>
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="">رقم الهاتف:</strong>{" "}
                      <br />
                      <span>{person.phone || "غير متوفر"}</span>
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="">العنوان:</strong>{" "}
                      <br />
                      <span>{person.address || "غير متوفر"}</span>
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="">تاريخ التعيين:</strong>{" "}
                      <br />
                      <span>{person.date_of_joining || "غير متوفر"}</span>
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="">المؤهل العلمي:</strong>{" "}
                      <br />
                      <span>{person.qualification || "غير متوفر"}</span>
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="">الحالة الاجتماعية:</strong>{" "}
                      <br />
                      <span>
                        {person.marital_status === "single"
                          ? "أعزب / عزباء"
                          : person.marital_status === "married"
                          ? "متزوج / متزوجة"
                          : person.marital_status === "divorced"
                          ? "مطلق / مطلقة"
                          : person.marital_status === "widowed"
                          ? "أرمل / أرملة"
                          : "غير متوفر"}
                      </span>
                    </p>
                  </Col>
                </Row>
              </div>

              <div className="profile-section">
                <h5 className="fw-bold text-primary border-bottom pb-2 mb-3">
                  المعلومات المالية
                </h5>
                <Row className="g-2">
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="">إجمالي الراتب:</strong>{" "}
                      <br />
                      <span className="fw-semibold text-success">
                        {person.total_salary
                          ? `${Number(person.total_salary).toLocaleString()} ج.م`
                          : "غير متوفر"}
                      </span>
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="mb-2">
                      <strong className="">رقم الحساب البنكي:</strong>{" "}
                      <br />
                      <span>{person.bank_account_number || "غير متوفر"}</span>
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
          variant="outline-primary"
          onClick={handlePrint}
          className="d-flex align-items-center gap-2 px-4"
        >
          <FontAwesomeIcon icon={faPrint} />
          طباعة الملف
        </Button>

        <Button variant="secondary" onClick={handleClose} className="px-4">
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
  return (
    <div
      className={`person-card ${isManager ? "manager" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {isManager && (
        <div className="role-badge">
          <i className="fa-solid fa-crown"></i> مدير
        </div>
      )}
      <div className="avatar">
        {person.photo ? (
          <img
            src={person.photo}
            alt={person.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        ) : (
          <i className="fa-solid fa-user"></i>
        )}
      </div>
      <div className="person-name">{person.name}</div>
      <div className="person-role">
        {isManager ? "مدير قسم" : "موظف"}
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

  const getChart = () => {
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    getChart();
  }, []);

  return loading ? (
    <TestPreLoader />
  ) : (
    <>
    <style>
      {`
        /* ==========================================
   تنسيقات الطباعة المخصصة (Print Styles)
   ========================================== */
@media print {
  /* إخفاء أي عنصر غير مرغوب فيه أثناء الطباعة */
  body * {
    visibility: hidden;
  }

  /* إظهار الحاوية المخصصة للطباعة فقط */
  .printable-profile-container,
  .printable-profile-container * {
    visibility: visible;
  }

  .printable-profile-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 20px !important;
    background-color: #ffffff !important;
    color: #000000 !important;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    direction: rtl;

    /* ترتيب المحتوى عمودي بدل ما العناصر تتراكب فوق بعض */
    display: flex !important;
    flex-direction: column !important;
  }

  /* منع الهيدر والفوتر من إنهم يبقوا fixed/absolute جوه الطباعة */
  .printable-profile-container .theader,
  .printable-profile-container .tfooter {
    position: static !important;
    width: 100% !important;
  }

  .printable-profile-container .theader {
    margin-bottom: 24px !important;
    order: -1;
  }

  .printable-profile-container .tfooter {
    margin-top: 24px !important;
    order: 999;
  }

  /* مسافة أمان أسفل الهيدر قبل بيانات البروفايل */
  .print-profile-body {
    margin-top: 20px !important;
    position: relative !important;
    z-index: 1;
  }

  /* تنسيق الهيدر في الطباعة */
  .print-header {
    display: flex !important;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #00897b;
    padding-bottom: 15px;
    margin-bottom: 25px;
  }

  /* تنسيق بطاقة البيانات */
  .print-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    background-color: #f9f9f9 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* عناوين الأقسام في الورقة المطبوعة */
  .print-section-title {
    font-size: 16px;
    font-weight: bold;
    color: #00897b !important;
    border-bottom: 1px solid #00897b;
    padding-bottom: 5px;
    margin-bottom: 15px;
  }

  /* تنسيق جدول/شبكة التفاصيل */
  .print-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .print-item {
    font-size: 13px;
    line-height: 1.6;
  }

  .print-label {
    font-weight: bold;
    color: #555;
  }

  /* فوتر ورقة الطباعة */
  .print-footer {
    display: block !important;
    margin-top: 40px;
    padding-top: 10px;
    border-top: 1px solid #ccc;
    text-align: center;
    font-size: 11px;
    color: #777;
  }
}
      `}
    </style>
    <div className="org-chart-container">
      <Title
        title={"الهيكل التنظيمي للشركة"}
        icon={<FontAwesomeIcon icon={faChartDiagram} />}
      />

      <div className="departments-wrapper">
        {data.map((dept) => (
          <div key={dept.uuid} className="department-card">
            {/* اسم القسم */}
            <div className="department-header">
              <h2>{dept.name}</h2>
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
              <p
                style={{
                  textAlign: "center",
                  color: "#a7a7d1",
                  margin: "20px 0",
                }}
              >
                لا يوجد مدير حالياً
              </p>
            )}

            {/* موظفي القسم */}
            <div
              data-title={"الموظفين"}
              className="employees-grid-container"
            >
              <div className="employees-pipe"></div>
              <div className="employees-grid">
                {dept.employees && dept.employees.length > 0 ? (
                  dept.employees.map((employee) => (
                    <div className="employees-card-container" key={employee.uuid}>
                      <PersonCard
                        person={employee}
                        onClick={() => handleShowModal(employee)}
                      />
                    </div>
                  ))
                ) : (
                  <p
                    style={{
                      color: "#a7a7d1",
                      gridColumn: "1 / -1",
                      textAlign: "center",
                    }}
                  >
                    لا يوجد موظفين في هذا القسم
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
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