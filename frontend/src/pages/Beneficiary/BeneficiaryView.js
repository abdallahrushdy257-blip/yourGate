import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Spinner,
  Button,
  Row,
  Col,
  Table,
  Badge,
  Nav,
  Form,
  Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBank,
  faGraduationCap,
  faHouseUser,
  faNotesMedical,
  faUsers,
  faReceipt,
  faFileContract,
  faPrint,
  faArrowRight,
  faFilePdf,
  faFile,
  faEye,
  faCheckCircle,
  faClock,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import API from "../../api/axiosConfig";
import "./BeneficiaryView.css";
import { DetailsSkeleton } from "../../components/Skeleton";

function BeneficiaryView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  // Decision edit state
  const [decision, setDecision] = useState("1");
  const [note, setNote] = useState("");
  const [savingDecision, setSavingDecision] = useState(false);
  const [decisionMsg, setDecisionMsg] = useState({ type: "", text: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/humancasedetails/get/${id}`);
      if (res.status === 200 && res.data) {
        const d = res.data;
        setData(d);
        if (d.case?.status) {
          setDecision(String(d.case.status));
        }
        if (d.case?.note) {
          setNote(d.case.note);
        }
      }
    } catch (err) {
      console.error("Failed to load beneficiary details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const handleUpdateDecision = async (e) => {
    e.preventDefault();
    setSavingDecision(true);
    setDecisionMsg({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("status", decision);
      formData.append("note", note);

      const res = await API.post("/humancases/update/status", formData);
      if (res.status === 200) {
        setDecisionMsg({ type: "success", text: "تم تحديث القرار بنجاح" });
        loadData();
      } else {
        setDecisionMsg({ type: "danger", text: "حدث خطأ أثناء حفظ القرار" });
      }
    } catch (err) {
      console.error(err);
      setDecisionMsg({ type: "danger", text: "حدث خطأ في الاتصال بالخادم" });
    } finally {
      setSavingDecision(false);
    }
  };

  const isPdf = (url) => {
    return typeof url === "string" && url.toLowerCase().split("?")[0].endsWith(".pdf");
  };

  const renderFilePreview = (url, label = "معاينة الملف") => {
    if (!url) {
      return <span className="text-muted" style={{ fontSize: "12px" }}>لا يوجد ملف مرفق</span>;
    }

    if (isPdf(url)) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#e63946",
            color: "#ffffff",
            padding: "5px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          <FontAwesomeIcon icon={faFilePdf} />
          <span>فتح ملف PDF</span>
        </a>
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: "var(--primary-color, #c29a64)",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        <img
          src={url}
          alt={label}
          style={{
            width: "38px",
            height: "38px",
            objectFit: "cover",
            borderRadius: "6px",
            border: "1px solid var(--border-color, #c29a64)",
          }}
        />
        <span style={{ textDecoration: "underline", fontSize: "13px" }}>{label}</span>
      </a>
    );
  };

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (!data || !data.case) {
    return (
      <div className="beneficiary-view-container text-center pt-5">
        <h4 className="text-danger mb-3">لم يتم العثور على بيانات هذا المستفيد</h4>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
          العودة
        </Button>
      </div>
    );
  }

  const c = data.case || {};
  const d = data.details || {};
  const work = data.work_education || d.qualifications || d.work_education || {};
  const healthList = data.health || d.health || [];
  const dependentsList = data.dependants || d.dependants || [];
  const vouchers = d.vouchers || [];
  const home = d.home || d.personalfeesdetails || {};
  const bank = d.bankdetails || {};

  // Status badge config (Case Study Decision)
  const statusConfig = {
    "1": { label: "قيد المراجعة / معلق", className: "pending", icon: faClock },
    "2": { label: "مقبول / موافقة", className: "approved", icon: faCheckCircle },
    "3": { label: "مستبعد / مرفوض", className: "rejected", icon: faTimesCircle },
    "معلق": { label: "قيد المراجعة / معلق", className: "pending", icon: faClock },
    "موافقة": { label: "مقبول / موافقة", className: "approved", icon: faCheckCircle },
    "مرفوض": { label: "مستبعد / مرفوض", className: "rejected", icon: faTimesCircle },
  }[c.case_status_string || c.case_status] || { label: c.case_status_string || "موافقة", className: "approved", icon: faCheckCircle };

  // Sub-sections rendering
  const renderBasicInfo = () => (
    <div className="view-section-card">
      <div className="view-section-title">
        <FontAwesomeIcon icon={faUser} />
        البيانات الشخصية والأساسية
      </div>
      <div className="info-grid">
        <div className="info-item-box">
          <span className="info-item-label">اسم المستفيد الكامل</span>
          <span className="info-item-value">{c.name || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">النوع (الجنس)</span>
          <span className="info-item-value">{c.gender_string || (c.gender === "0" ? "ذكر" : "أنثى")}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">الحالة الإجتماعية</span>
          <span className="info-item-value">{c.social_status_string || c.status_string || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">قرار دراسة الحالة</span>
          <span className="info-item-value">{c.case_status_string || c.case_status || "موافقة"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">تاريخ الميلاد</span>
          <span className="info-item-value">{c.dateofbirth || c.dob || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">حالة الملف</span>
          <span className="info-item-value">{c.humancasetype === "2" ? "مستفيد دائم" : "مستفيد مؤقت"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">رقم الهوية</span>
          <span className="info-item-value">{c.idnumber || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">مصدر الهوية</span>
          <span className="info-item-value">{c.idsource || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">تاريخ انتهاء الهوية</span>
          <span className="info-item-value">{c.iddate || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">رقم الجوال</span>
          <span className="info-item-value" dir="ltr">{c.phonenum || c.phone || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">البريد الإلكتروني</span>
          <span className="info-item-value">{c.email || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">الجنسية</span>
          <span className="info-item-value">{c.nationality || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">عدد أفراد الأسرة</span>
          <span className="info-item-value">{c.familycount ?? "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">تاريخ الإنشاء</span>
          <span className="info-item-value">{c.created_at ? new Date(c.created_at).toLocaleDateString("ar-EG") : "-"}</span>
        </div>
        <div className="info-item-box" style={{ gridColumn: "1 / -1" }}>
          <span className="info-item-label">ملاحظات إضافية</span>
          <span className="info-item-value">{c.note || "لا توجد ملاحظات"}</span>
        </div>
      </div>
    </div>
  );

  const renderBankInfo = () => (
    <div className="view-section-card">
      <div className="view-section-title">
        <FontAwesomeIcon icon={faBank} />
        البيانات البنكية والحساب
      </div>
      <Row className="g-3">
        <Col md={4}>
          <div className="info-item-box">
            <span className="info-item-label">اسم البنك</span>
            <span className="info-item-value">{bank.name || "-"}</span>
          </div>
        </Col>
        <Col md={4}>
          <div className="info-item-box">
            <span className="info-item-label">الفرع</span>
            <span className="info-item-value">{bank.branch || "-"}</span>
          </div>
        </Col>
        <Col md={4}>
          <div className="info-item-box">
            <span className="info-item-label">رقم الـ IBAN / الحساب</span>
            <span className="info-item-value" dir="ltr">{bank.iban || c.accnumber || "-"}</span>
          </div>
        </Col>
        <Col md={12}>
          <div className="attachment-preview-card mt-2">
            <h6 className="mb-2" style={{ fontWeight: 600 }}>مرفق الحساب البنكي / صورة الـ IBAN:</h6>
            {renderFilePreview(d.bankdetails_upload || bank.upload, "معاينة مستند الحساب البنكي")}
          </div>
        </Col>
      </Row>
    </div>
  );

  const renderWorkEducation = () => (
    <div className="view-section-card">
      <div className="view-section-title">
        <FontAwesomeIcon icon={faGraduationCap} />
        المؤهل العلمي والوظيفة ومصادر الدخل
      </div>
      <div className="info-grid mb-4">
        <div className="info-item-box">
          <span className="info-item-label">المؤهل الدراسي</span>
          <span className="info-item-value">{work.educationlevel || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">الوظيفة الحالية</span>
          <span className="info-item-value">{work.job || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">القدرة على العمل</span>
          <span className="info-item-value">{work.canwork === "0" || work.canwork === 0 ? "لا يستطيع العمل" : "نعم يستطيع العمل"}</span>
        </div>
      </div>

      <h6 className="mt-3 mb-2 fw-bold" style={{ color: "var(--primary-color, #c29a64)" }}>بيانات مصادر الدخل:</h6>
      <div className="table-responsive mb-4">
        <Table bordered hover size="sm" className="text-center align-middle">
          <thead style={{ background: "rgba(194, 154, 100, 0.1)" }}>
            <tr>
              <th>#</th>
              <th>مصدر الدخل</th>
              <th>القيمة الشهرية</th>
              <th>المرفق</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(work.incomesource) && work.incomesource.length > 0 ? (
              work.incomesource.map((inc, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{inc.name || inc.source || "-"}</td>
                  <td>{inc.amount ? `${inc.amount} ريال` : "-"}</td>
                  <td>{renderFilePreview(inc.upload || work.incomesource_upload, "مرفق الدخل")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>1</td>
                <td>{work.incomesource || "-"}</td>
                <td>{work.incomeamount ? `${work.incomeamount} ريال` : "-"}</td>
                <td>{renderFilePreview(work.incomesource_upload, "مرفق الدخل")}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <h6 className="mt-3 mb-2 fw-bold" style={{ color: "var(--primary-color, #c29a64)" }}>الدورات التدريبية والشهادات:</h6>
      <div className="table-responsive">
        <Table bordered hover size="sm" className="text-center align-middle">
          <thead style={{ background: "rgba(194, 154, 100, 0.1)" }}>
            <tr>
              <th>#</th>
              <th>اسم الدورة</th>
              <th>الجهة المنظمة</th>
              <th>الشهادة / المرفق</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(work.courses) && work.courses.length > 0 ? (
              work.courses.map((course, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{course.title || course.name || "-"}</td>
                  <td>{course.address || course.organization || "-"}</td>
                  <td>{renderFilePreview(course.upload || work.courses_upload, "شهادة الدورة")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-muted py-3">لا توجد دورات تدريبية مسجلة</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );

  const renderHousing = () => (
    <div className="view-section-card">
      <div className="view-section-title">
        <FontAwesomeIcon icon={faHouseUser} />
        بيانات السكن والمصروفات
      </div>
      <div className="info-grid">
        <div className="info-item-box">
          <span className="info-item-label">المدينة / المحافظة</span>
          <span className="info-item-value">{home.state || home.city || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">القرية / الحي</span>
          <span className="info-item-value">{home.village || home.district || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">العنوان الوطني</span>
          <span className="info-item-value">{home.nationalAddress || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">العنوان المختصر</span>
          <span className="info-item-value">{home.summaryAddress || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">نوع السكن</span>
          <span className="info-item-value">{home.homeType || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">ملكية السكن</span>
          <span className="info-item-value">{home.homeOwnership || "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">الإيجار الشهري</span>
          <span className="info-item-value">{home.rent ? `${home.rent} ريال` : "-"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">عدد السيارات</span>
          <span className="info-item-value">{home.cars || "0"}</span>
        </div>
        <div className="info-item-box">
          <span className="info-item-label">أثاث السكن</span>
          <span className="info-item-value">{home.furniture || "-"}</span>
        </div>
        <div className="info-item-box" style={{ gridColumn: "1 / -1" }}>
          <span className="info-item-label">مرفقات السكن:</span>
          <div className="d-flex gap-4 mt-2">
            {renderFilePreview(d.personalfeesdetails_upload1, "صورة إثبات السكن 1")}
            {renderFilePreview(d.personalfeesdetails_upload2, "صورة إثبات السكن 2")}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHealth = () => (
    <div className="view-section-card">
      <div className="view-section-title">
        <FontAwesomeIcon icon={faNotesMedical} />
        البيانات الصحية والتقارير الطبية
      </div>
      {healthList.length > 0 ? (
        <div className="table-responsive">
          <Table bordered hover size="sm" className="text-center align-middle">
            <thead style={{ background: "rgba(194, 154, 100, 0.1)" }}>
              <tr>
                <th>#</th>
                <th>اسم المرض / الحالة</th>
                <th>نوع المرض</th>
                <th>درجة الخطورة</th>
                <th>نوع العلاج</th>
                <th>تكلفة العلاج الشهري</th>
                <th>الملاحظات</th>
                <th>التقرير الطبي</th>
              </tr>
            </thead>
            <tbody>
              {healthList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.disease_name || item.name || "-"}</td>
                  <td>{item.disease_type || item.type || "-"}</td>
                  <td>
                    <Badge bg={item.disease_degree === "حرجة" ? "danger" : "warning"} text="dark">
                      {item.disease_degree || item.degree || "عادية"}
                    </Badge>
                  </td>
                  <td>{item.treatment_type || item.trtype || "-"}</td>
                  <td>{item.treatment_cost ? `${item.treatment_cost} ريال` : "-"}</td>
                  <td>{item.notes || "-"}</td>
                  <td>{renderFilePreview(item.upload || item.attachment || d.health_upload, "التقرير الطبي")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="text-center text-muted py-4">
          <FontAwesomeIcon icon={faNotesMedical} size="2x" className="mb-2 opacity-50" />
          <p>لا توجد بيانات صحية مسجلة حالياً</p>
        </div>
      )}
    </div>
  );

  const renderDependents = () => (
    <div className="view-section-card">
      <div className="view-section-title">
        <FontAwesomeIcon icon={faUsers} />
        بيانات التابعين والمرافقين ({dependentsList.length})
      </div>
      {dependentsList.length > 0 ? (
        <div className="table-responsive">
          <Table bordered hover size="sm" className="text-center align-middle">
            <thead style={{ background: "rgba(194, 154, 100, 0.1)" }}>
              <tr>
                <th>#</th>
                <th>اسم التابع</th>
                <th>صلة القرابة</th>
                <th>النوع</th>
                <th>تاريخ الميلاد</th>
                <th>رقم الهوية</th>
                <th>الجوال</th>
                <th>الحالة الصحية</th>
                <th>ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {dependentsList.map((dep, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="fw-bold">{dep.name || "-"}</td>
                  <td>{dep.relation || "-"}</td>
                  <td>{dep.gender === "female" || dep.gender === "1" ? "أنثى" : "ذكر"}</td>
                  <td>{dep.dateofbirth || dep.dob || "-"}</td>
                  <td>{dep.nationalid || dep.national_id || "-"}</td>
                  <td dir="ltr">{dep.phone || "-"}</td>
                  <td>{dep.health || "-"}</td>
                  <td>{dep.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="text-center text-muted py-4">
          <FontAwesomeIcon icon={faUsers} size="2x" className="mb-2 opacity-50" />
          <p>لا يوجد تابعين مسجلين لهذا المستفيد</p>
        </div>
      )}
    </div>
  );

  const renderVouchers = () => (
    <div className="view-section-card">
      <div className="view-section-title">
        <FontAwesomeIcon icon={faReceipt} />
        سندات الصرف والمدفوعات ({vouchers.length})
      </div>
      {vouchers.length > 0 ? (
        <div className="table-responsive">
          <Table bordered hover size="sm" className="text-center align-middle">
            <thead style={{ background: "rgba(194, 154, 100, 0.1)" }}>
              <tr>
                <th>#</th>
                <th>المبلغ</th>
                <th>تاريخ الصرف</th>
                <th>طريقة الدفع</th>
                <th>الحساب / البنك</th>
                <th>البيان والملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v, i) => (
                <tr key={i}>
                  <td>{v.id || i + 1}</td>
                  <td className="fw-bold text-success">{v.amount ? `${v.amount} ريال` : "-"}</td>
                  <td>{v.date || "-"}</td>
                  <td>{v.payment_method === "cash" ? "نقداً" : v.payment_method || "-"}</td>
                  <td>{v.account || "-"}</td>
                  <td>{v.description || "-"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="text-center text-muted py-4">
          <FontAwesomeIcon icon={faReceipt} size="2x" className="mb-2 opacity-50" />
          <p>لا توجد سندات صرف منشأة لهذا المستفيد حتى الآن</p>
        </div>
      )}
    </div>
  );

  const renderDecision = () => (
    <div className="view-section-card">
      <div className="view-section-title">
        <FontAwesomeIcon icon={faFileContract} />
        قرار دراسة الحالة وتحديث الاعتماد
      </div>

      {decisionMsg.text && (
        <Alert variant={decisionMsg.type} className="text-center">
          {decisionMsg.text}
        </Alert>
      )}

      <Form onSubmit={handleUpdateDecision} style={{ maxWidth: "600px", margin: "auto" }}>
        <div className="mb-3">
          <Form.Label className="fw-bold">قرار الحالة:</Form.Label>
          <Form.Select
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            style={{ borderRadius: "20px", padding: "10px 16px" }}
          >
            <option value="1">قيد المراجعة / معلق</option>
            <option value="2">موافقة / قبول الحالة</option>
            <option value="3">استبعاد / رفض الحالة</option>
          </Form.Select>
        </div>

        <div className="mb-3">
          <Form.Label className="fw-bold">سبب القرار / الملاحظات:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="أدخل سبب القرار أو أي توصيات خاصة بالحالة..."
            style={{ borderRadius: "14px" }}
          />
        </div>

        <div className="text-center mt-3">
          <Button
            type="submit"
            disabled={savingDecision}
            style={{
              backgroundColor: "var(--primary-color, #c29a64)",
              borderColor: "var(--primary-color, #c29a64)",
              borderRadius: "25px",
              padding: "8px 36px",
              fontWeight: "600",
            }}
          >
            {savingDecision ? <Spinner animation="border" size="sm" /> : "حفظ وتحديث القرار"}
          </Button>
        </div>
      </Form>
    </div>
  );

  return (
    <div className="beneficiary-view-container">
      {/* Top Header Actions */}
      <div className="beneficiary-view-header no-print">
        <div className="d-flex align-items-center gap-3">
          <Button
            variant="outline-secondary"
            onClick={() => navigate(-1)}
            style={{ borderRadius: "20px", padding: "6px 18px", fontWeight: "600" }}
          >
            <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            العودة
          </Button>
          <h4 className="mb-0 fw-bold">عرض تفاصيل المستفيد الشاملة</h4>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Button
            variant="outline-dark"
            size="sm"
            onClick={() => window.print()}
            style={{ borderRadius: "20px", padding: "6px 18px", fontWeight: "600" }}
          >
            <FontAwesomeIcon icon={faPrint} className="ms-1" />
            طباعة الملف
          </Button>
        </div>
      </div>

      {/* Beneficiary Hero Banner */}
      <div className="beneficiary-banner-card">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="beneficiary-avatar-box">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div>
              <h3 className="fw-bold mb-1">{c.name}</h3>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className={`status-badge ${statusConfig.className}`}>
                  <FontAwesomeIcon icon={statusConfig.icon} />
                  {statusConfig.label}
                </span>
                <Badge bg="secondary">
                  {c.humancasetype === "2" ? "مستفيد دائم" : "مستفيد مؤقت"}
                </Badge>
                {c.idnumber && (
                  <Badge bg="light" text="dark" className="border">
                    الهوية: {c.idnumber}
                  </Badge>
                )}
                {c.phonenum && (
                  <Badge bg="light" text="dark" className="border" dir="ltr">
                    {c.phonenum}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="text-end">
            <div className="text-muted" style={{ fontSize: "13px" }}>
              رقم الملف: <strong>#{c.id}</strong>
            </div>
            {c.accnumber && (
              <div className="text-muted" style={{ fontSize: "13px" }} dir="ltr">
                IBAN: {c.accnumber}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Modern Tabs Navigation */}
      <div className="nav-tabs-container no-print">
        <Nav className="nav-tabs-custom">
          <Nav.Item>
            <Nav.Link
              className={activeTab === "basic" ? "active" : ""}
              onClick={() => setActiveTab("basic")}
            >
              <FontAwesomeIcon icon={faUser} className="tab-icon" />
              <span>البيانات الأساسية</span>
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              className={activeTab === "bank" ? "active" : ""}
              onClick={() => setActiveTab("bank")}
            >
              <FontAwesomeIcon icon={faBank} className="tab-icon" />
              <span>البيانات البنكية</span>
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              className={activeTab === "work" ? "active" : ""}
              onClick={() => setActiveTab("work")}
            >
              <FontAwesomeIcon icon={faGraduationCap} className="tab-icon" />
              <span>المؤهل والعمل</span>
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              className={activeTab === "housing" ? "active" : ""}
              onClick={() => setActiveTab("housing")}
            >
              <FontAwesomeIcon icon={faHouseUser} className="tab-icon" />
              <span>بيانات السكن</span>
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              className={activeTab === "health" ? "active" : ""}
              onClick={() => setActiveTab("health")}
            >
              <FontAwesomeIcon icon={faNotesMedical} className="tab-icon" />
              <span>البيانات الصحية</span>
              {healthList.length > 0 && (
                <span className="tab-count-badge">{healthList.length}</span>
              )}
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              className={activeTab === "dependents" ? "active" : ""}
              onClick={() => setActiveTab("dependents")}
            >
              <FontAwesomeIcon icon={faUsers} className="tab-icon" />
              <span>التابعين</span>
              {dependentsList.length > 0 && (
                <span className="tab-count-badge">{dependentsList.length}</span>
              )}
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              className={activeTab === "vouchers" ? "active" : ""}
              onClick={() => setActiveTab("vouchers")}
            >
              <FontAwesomeIcon icon={faReceipt} className="tab-icon" />
              <span>سندات الصرف</span>
              {vouchers.length > 0 && (
                <span className="tab-count-badge">{vouchers.length}</span>
              )}
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              className={activeTab === "decision" ? "active" : ""}
              onClick={() => setActiveTab("decision")}
            >
              <FontAwesomeIcon icon={faFileContract} className="tab-icon" />
              <span>دراسة الحالة والقرار</span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      {/* Active Tab Content with Fade-In Animation */}
      <div className="tab-pane-content no-print">
        {activeTab === "basic" && renderBasicInfo()}
        {activeTab === "bank" && renderBankInfo()}
        {activeTab === "work" && renderWorkEducation()}
        {activeTab === "housing" && renderHousing()}
        {activeTab === "health" && renderHealth()}
        {activeTab === "dependents" && renderDependents()}
        {activeTab === "vouchers" && renderVouchers()}
        {activeTab === "decision" && renderDecision()}
      </div>

      {/* All sections rendered for print only */}
      <div className="print-only" style={{ display: "none" }}>
        {renderBasicInfo()}
        {renderBankInfo()}
        {renderWorkEducation()}
        {renderHousing()}
        {renderHealth()}
        {renderDependents()}
        {renderVouchers()}
        {renderDecision()}
      </div>
    </div>
  );
}

export default BeneficiaryView;
