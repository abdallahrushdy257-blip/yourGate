import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Row,
  Col,
  Nav,
  Tab,
  Button,
  ProgressBar,
  Spinner,
  Table,
  Badge,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faHandHoldingHeart,
  faCoins,
  faReceipt,
  faMoneyBillWave,
  faPaintBrush,
  faBullhorn,
  faPrint,
  faShareNodes,
  faCopy,
  faCheckCircle,
  faUser,
  faPhone,
  faIdCard,
  faCalendarDays,
  faFilePdf,
  faDownload,
  faEye,
  faPlus,
  faInbox,
  faQrcode,
  faTriangleExclamation,
  faCheck,
  faImage,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faTelegram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { QRCodeSVG } from "qrcode.react";
import API, { BASE_URL } from "../../api/axiosConfig";
import { toLocal } from "../../Utils/toLocal";
import {
  CaseReceiptVoucherModal,
  CasePaymentVoucherModal,
  CaseDesignRequestModal,
  CaseMarketingRequestModal,
} from "./CaseActionModals";
import "./CaseDetailsView.css";

export const getMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://localhost/storage")) {
    return url.replace("http://localhost/storage", "http://localhost:8000/storage");
  }
  if (url.startsWith("/storage")) {
    const origin = (BASE_URL || "http://localhost:8000").replace(/\/api\/?$/, "");
    return `${origin}${url}`;
  }
  return url;
};

export const isImageUrl = (url) => {
  if (!url) return false;
  return /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url);
};

export default function CaseDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Quick Action Modal states
  const [modalAction, setModalAction] = useState({ type: null });
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch full case data
  const fetchCase = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await API.get(`/shop/${id}`);
      setCaseData(res.data?.data || res.data || null);
    } catch (err) {
      console.error("Error fetching case details:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  const handlePrint = () => {
    window.print();
  };

  const shareUrl = `${window.location.origin}/casedata/${id}`;
  const shareText = caseData
    ? `ساهم معنا في دعم: ${caseData.title} عبر منصة الجمعية: ${shareUrl}`
    : shareUrl;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: caseData?.title || "حالة إنسانية",
        text: shareText,
        url: shareUrl,
      }).catch(console.error);
    } else {
      handleCopyLink();
    }
  };

  if (loading) {
    return (
      <div className="case-view-page text-center py-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-muted">جاري تحميل الملف الشامل للحالة الإنسانية...</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="case-view-page text-center py-5 text-danger">
        <h4>تعذر العثور على بيانات الحالة.</h4>
        <Button variant="outline-dark" className="mt-3" onClick={() => navigate("/casedetails")}>
          العودة لقائمة الحالات
        </Button>
      </div>
    );
  }

  const total = parseFloat(caseData.total || 0);
  const amount = parseFloat(caseData.amount || 0);
  const remaining = Math.max(0, total - amount);
  const pct = total > 0 ? Math.min(100, Math.round((amount / total) * 100)) : 0;
  const isCompleted = Number(caseData.status) === 1;

  // Filter transactions into receipts and payments
  const allTransactions = Array.isArray(caseData.transactions) ? caseData.transactions : [];
  const receipts = allTransactions.filter(
    (t) =>
      Number(t.transaction_type) === 1 ||
      !t.type ||
      t.type.includes("قبض") ||
      t.type.includes("تبرع") ||
      t.type.includes("تحصيل") ||
      t.donor_id
  );
  const payments = allTransactions.filter(
    (t) =>
      Number(t.transaction_type) === 2 ||
      (t.type && (t.type.includes("صرف") || t.type.includes("دفع")))
  );
  const paidAmount = payments.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  const netBalance = Math.max(0, amount - paidAmount);

  const allDetails = Array.isArray(caseData.details) ? caseData.details : [];
  const designRequests = allDetails.filter((d) => Number(d.type) === 1);
  const marketingRequests = allDetails.filter((d) => Number(d.type) === 2);
  const allAds = Array.isArray(caseData.ads) ? caseData.ads : [];

  return (
    <div className="case-view-page">
      {/* ── Top Header Navigation ── */}
      <div className="case-view-header">
        <div className="case-view-header-right">
          <button
            className="case-back-btn no-print"
            onClick={() => navigate("/casedetails")}
            title="العودة لتقرير الحالات"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <div className="case-header-info">
            <h2>
              <FontAwesomeIcon icon={faHandHoldingHeart} style={{ color: "var(--primary-color, #b89358)" }} />
              <span>{caseData.title}</span>
              {isCompleted ? (
                <span className="badge-case-completed fs-6 px-3 py-1">
                  <FontAwesomeIcon icon={faCheckCircle} className="ms-1" />
                  مكتملة
                </span>
              ) : (
                <span className="badge-case-active fs-6 px-3 py-1">
                  نشطة (قيد التبرع)
                </span>
              )}
            </h2>
            <div className="case-header-subtitle">
              المستفيد: <strong>{caseData.beneficiary_name || "عام"}</strong> | التصنيف: {caseData.casetype} ({caseData.subcasetype || "عام"})
            </div>
          </div>
        </div>

        <div className="case-view-header-left no-print">
          <Button
            variant="outline-secondary"
            className="case-action-btn"
            onClick={handlePrint}
          >
            <FontAwesomeIcon icon={faPrint} />
            طباعة التقرير
          </Button>
          <Button
            variant="outline-primary"
            className="case-action-btn"
            onClick={handleNativeShare}
          >
            <FontAwesomeIcon icon={faShareNodes} />
            مشاركة
          </Button>
          <Button
            variant="success"
            className="case-action-btn"
            onClick={() => setModalAction({ type: "receipt" })}
          >
            <FontAwesomeIcon icon={faReceipt} />
            سند قبض
          </Button>
          <Button
            variant="danger"
            className="case-action-btn"
            onClick={() => setModalAction({ type: "payment" })}
          >
            <FontAwesomeIcon icon={faMoneyBillWave} />
            سند صرف
          </Button>
        </div>
      </div>

      {/* ── Hero KPI Cards Grid ── */}
      <div className="case-view-kpi-grid">
        <div className="case-view-kpi-card kpi-gold">
          <div>
            <div className="kpi-label">المبلغ المستهدف</div>
            <div className="kpi-value text-dark">{toLocal(total)} ر.س</div>
          </div>
          <div className="case-view-kpi-icon">
            <FontAwesomeIcon icon={faCoins} />
          </div>
        </div>

        <div className="case-view-kpi-card kpi-green">
          <div>
            <div className="kpi-label">إجمالي التبرعات المحصلة</div>
            <div className="kpi-value text-success">{toLocal(amount)} ر.س</div>
          </div>
          <div className="case-view-kpi-icon">
            <FontAwesomeIcon icon={faReceipt} />
          </div>
        </div>

        <div className="case-view-kpi-card kpi-danger">
          <div>
            <div className="kpi-label">إجمالي المصروفات المنفذة</div>
            <div className="kpi-value text-danger">{toLocal(paidAmount)} ر.س</div>
          </div>
          <div className="case-view-kpi-icon" style={{ background: "rgba(229, 62, 62, 0.12)", color: "#e53e3e" }}>
            <FontAwesomeIcon icon={faMoneyBillWave} />
          </div>
        </div>

        <div className="case-view-kpi-card kpi-blue">
          <div>
            <div className="kpi-label">الرصيد المتاح للصرف</div>
            <div className="kpi-value text-primary">{toLocal(netBalance)} ر.س</div>
          </div>
          <div className="case-view-kpi-icon">
            <FontAwesomeIcon icon={faHandHoldingHeart} />
          </div>
        </div>

        <div className="case-view-kpi-card kpi-red">
          <div>
            <div className="kpi-label">المتبقي لاكتمال المستهدف</div>
            <div className="case-field-val fw-bold fs-5 text-warning">{toLocal(remaining)} ر.س</div>
          </div>
          <div className="case-view-kpi-icon">
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </div>
        </div>
      </div>

      {/* ── Progress Bar Box ── */}
      <div className="case-view-progress-box">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold" style={{ fontSize: "14px" }}>
            نسبة تغطية الحملة: <strong>{pct}%</strong>
          </span>
          <span className="small text-muted">
            تم جمع {toLocal(amount)} ر.س من أصل {toLocal(total)} ر.س
          </span>
        </div>
        <ProgressBar
          now={pct}
          variant={pct >= 100 ? "success" : pct > 50 ? "info" : "warning"}
          style={{ height: "14px", borderRadius: "10px" }}
        />
      </div>

      {/* ── Tabs Container ── */}
      <div className="case-tabs-container">
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="overview">
                <FontAwesomeIcon icon={faUser} />
                البيانات الأساسية والمستفيد
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="donations">
                <FontAwesomeIcon icon={faReceipt} />
                سجل التبرعات ({receipts.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="payments">
                <FontAwesomeIcon icon={faMoneyBillWave} />
                سندات الصرف ({payments.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="requests">
                <FontAwesomeIcon icon={faPaintBrush} />
                الطلبات والإعلانات ({allDetails.length + allAds.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="share">
                <FontAwesomeIcon icon={faShareNodes} />
                المشاركة والروابط
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <div className="case-tabs-content">
            <Tab.Content>
              {/* ── Tab 1: Overview & Beneficiary ── */}
              <Tab.Pane eventKey="overview">
                <Row className="g-4">
                  <Col md={6}>
                    <div className="case-sub-card">
                      <div className="case-sub-card-header">
                        <FontAwesomeIcon icon={faUser} />
                        بيانات المستفيد
                      </div>
                      <div className="case-field-row">
                        <span className="case-field-label">اسم المستفيد:</span>
                        <span className="case-field-val">{caseData.beneficiary?.name || caseData.beneficiary_name || "عام / غير محدد"}</span>
                      </div>
                      <div className="case-field-row">
                        <span className="case-field-label">رقم الهوية:</span>
                        <span className="case-field-val">{caseData.beneficiary?.idnumber || "غير مسجل"}</span>
                      </div>
                      <div className="case-field-row">
                        <span className="case-field-label">رقم الجوال:</span>
                        <span className="case-field-val">{caseData.beneficiary?.phonenum || "غير مسجل"}</span>
                      </div>
                      <div className="case-field-row">
                        <span className="case-field-label">قناة التسويق المعتمدة:</span>
                        <span className="case-field-val">{caseData.marketingmethod_string || "غير محدد"}</span>
                      </div>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="case-sub-card">
                      <div className="case-sub-card-header">
                        <FontAwesomeIcon icon={faCalendarDays} />
                        مواعيد وتفاصيل الحالة
                      </div>
                      <div className="case-field-row">
                        <span className="case-field-label">التصنيف الرئيسي:</span>
                        <span className="case-field-val">{caseData.casetype || "عام"}</span>
                      </div>
                      <div className="case-field-row">
                        <span className="case-field-label">التصنيف الفرعي:</span>
                        <span className="case-field-val">{caseData.subcasetype || "عام"}</span>
                      </div>
                      <div className="case-field-row">
                        <span className="case-field-label">تاريخ الإطلاق:</span>
                        <span className="case-field-val">{caseData.dateoflaunch || "غير محدد"}</span>
                      </div>
                      <div className="case-field-row">
                        <span className="case-field-label">تاريخ الانتهاء المحدد:</span>
                        <span className="case-field-val">{caseData.dateofcompletion || "غير محدد"}</span>
                      </div>
                      {caseData.is_assets_selected && (
                        <div className="case-field-row">
                          <span className="case-field-label">نظام الأسهم:</span>
                          <span className="case-field-val">
                            {caseData.number_of_assets} أسهم (قيمة السهم: {toLocal(caseData.cost_per_asset)} ر.س)
                          </span>
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="case-sub-card">
                      <div className="case-sub-card-header">
                        <FontAwesomeIcon icon={faEye} />
                        الأوصاف والملاحظات المرفقة
                      </div>
                      <div className="mb-3">
                        <span className="case-field-label d-block mb-1">وصف الحالة العام:</span>
                        <p className="p-3 rounded mb-0 text-muted" style={{ background: "rgba(0,0,0,0.02)", lineHeight: 1.7 }}>
                          {caseData.description || "لا يوجد وصف مدخل لهذه الحالة."}
                        </p>
                      </div>
                      {caseData.description2 && (
                        <div>
                          <span className="case-field-label d-block mb-1">تفاصيل وملاحظات إضافية:</span>
                          <p className="p-3 rounded mb-0 text-muted" style={{ background: "rgba(0,0,0,0.02)", lineHeight: 1.7 }}>
                            {caseData.description2}
                          </p>
                        </div>
                      )}

                      {caseData.document_url && (
                        <div className="mt-3 pt-3 border-top d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-2">
                            <FontAwesomeIcon icon={faFilePdf} className="text-danger fs-4" />
                            <span>المستند والوثيقة المرفقة للحالة</span>
                          </div>
                          <a
                            href={caseData.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            <FontAwesomeIcon icon={faDownload} className="ms-1" />
                            تحميل المستند
                          </a>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* ── Tab 2: Donations / Receipts ── */}
              <Tab.Pane eventKey="donations">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">قائمة سندات القبض والتبرعات المستلمة</h6>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => setModalAction({ type: "receipt" })}
                  >
                    <FontAwesomeIcon icon={faPlus} className="ms-1" />
                    إضافة سند قبض جديد
                  </Button>
                </div>

                {receipts.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <FontAwesomeIcon icon={faInbox} style={{ fontSize: "3rem", opacity: 0.3 }} />
                    <p className="mt-3 mb-0 fw-bold">لم يتم تسجيل أي تبرعات لهذه الحالة بعد.</p>
                  </div>
                ) : (
                  <Table responsive hover className="align-middle text-center">
                    <thead style={{ background: "rgba(184, 147, 88, 0.08)" }}>
                      <tr>
                        <th>م</th>
                        <th>التاريخ</th>
                        <th>رقم السند</th>
                        <th>طريقة الدفع</th>
                        <th>المبلغ</th>
                        <th>المتبرع / البيان</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipts.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td>{idx + 1}</td>
                          <td>{item.date || "-"}</td>
                          <td><Badge bg="light" text="dark" className="border">{item.invoice_number || `#${item.id}`}</Badge></td>
                          <td>{item.transaction_type_string || item.type || "تبرع نقدي"}</td>
                          <td className="fw-bold text-success">{toLocal(item.amount)} ر.س</td>
                          <td className="text-muted small">{item.donor?.name || item.donor_name || item.notes || "فاعل خير"}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="table-light fw-bold">
                        <td colSpan={4} className="text-end ps-3">إجمالي التبرعات:</td>
                        <td className="text-success">{toLocal(amount)} ر.س</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </Table>
                )}
              </Tab.Pane>

              {/* ── Tab 3: Payment Vouchers ── */}
              <Tab.Pane eventKey="payments">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">قائمة سندات الصرف والمصروفات المنفذة للحالة</h6>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setModalAction({ type: "payment" })}
                  >
                    <FontAwesomeIcon icon={faPlus} className="ms-1" />
                    إصدار سند صرف جديد
                  </Button>
                </div>

                {payments.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <FontAwesomeIcon icon={faInbox} style={{ fontSize: "3rem", opacity: 0.3 }} />
                    <p className="mt-3 mb-0 fw-bold">لم يتم تسجيل أي سندات صرف لهذه الحالة حتى الآن.</p>
                  </div>
                ) : (
                  <Table responsive hover className="align-middle text-center">
                    <thead style={{ background: "rgba(229, 62, 62, 0.08)" }}>
                      <tr>
                        <th>م</th>
                        <th>التاريخ</th>
                        <th>رقم السند</th>
                        <th>الحساب المسحوب منه</th>
                        <th>المبلغ المصروف</th>
                        <th>البيان والملاحظات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td>{idx + 1}</td>
                          <td>{item.date || "-"}</td>
                          <td><Badge bg="light" text="dark" className="border">{item.invoice_number || `#${item.id}`}</Badge></td>
                          <td>{item.account || "الحساب البنكي"}</td>
                          <td className="fw-bold text-danger">{toLocal(item.amount)} ر.س</td>
                          <td className="text-muted small">{item.notes || "صرف للحالة"}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="table-light fw-bold">
                        <td colSpan={4} className="text-end ps-3">إجمالي المصروفات المنفذة:</td>
                        <td className="text-danger">{toLocal(paidAmount)} ر.س</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </Table>
                )}
              </Tab.Pane>

              {/* ── Tab 4: Requests & Ads ── */}
              <Tab.Pane eventKey="requests">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">طلبات التصميم والتسويق والإعلانات الممولة</h6>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setModalAction({ type: "design" })}
                    >
                      <FontAwesomeIcon icon={faPaintBrush} className="ms-1" />
                      طلب تصميم
                    </Button>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => setModalAction({ type: "marketing" })}
                    >
                      <FontAwesomeIcon icon={faBullhorn} className="ms-1" />
                      طلب تسويق
                    </Button>
                  </div>
                </div>

                {/* Design Requests */}
                <h6 className="fw-bold text-primary mt-4 mb-2">
                  <FontAwesomeIcon icon={faPaintBrush} className="ms-2" />
                  طلبات التصميم ({designRequests.length})
                </h6>
                {designRequests.length === 0 ? (
                  <p className="text-muted small">لا توجد طلبات تصميم مسجلة لهذه الحالة.</p>
                ) : (
                  <Row className="g-3 mb-4">
                    {designRequests.map((req, idx) => (
                      <Col md={6} key={req.id || idx}>
                        <div className="case-sub-card">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="fw-bold small text-primary">طلب تصميم #{req.id}</span>
                            <span className="text-muted small">{req.created_at || "-"}</span>
                          </div>
                          <p className="small mb-2 text-dark">{req.description || req.note || "بدون وصف"}</p>
                          {req.note && <p className="small text-muted mb-2">ملاحظة: {req.note}</p>}
                          {req.upload_url && (
                            <a href={req.upload_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary">
                              <FontAwesomeIcon icon={faDownload} className="ms-1" />
                              عرض المرفق 1
                            </a>
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}

                {/* Marketing Requests */}
                <h6 className="fw-bold text-warning mt-4 mb-2">
                  <FontAwesomeIcon icon={faBullhorn} className="ms-2" />
                  طلبات الحملات التسويقية والإدارة ({marketingRequests.length})
                </h6>
                {marketingRequests.length === 0 ? (
                  <p className="text-muted small">لا توجد طلبات تسويقية مسجلة لهذه الحالة.</p>
                ) : (
                  <Row className="g-3 mb-4">
                    {marketingRequests.map((req, idx) => (
                      <Col md={6} key={req.id || idx}>
                        <div className="case-sub-card">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="fw-bold small text-warning">طلب حملة تسويقية #{req.id}</span>
                            <span className="text-muted small">{req.created_at || "-"}</span>
                          </div>
                          <p className="small mb-2 text-dark">{req.description || req.note || "بدون وصف"}</p>
                          {req.upload_url && (
                            <a href={req.upload_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary">
                              <FontAwesomeIcon icon={faDownload} className="ms-1" />
                              عرض خطة الحملة
                            </a>
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}

                {/* Ads Requests */}
                <h6 className="fw-bold text-success mt-4 mb-2">
                  <FontAwesomeIcon icon={faShareNodes} className="ms-2" />
                  طلبات الإعلانات الممولة عبر المنصة ({allAds.length})
                </h6>
                {allAds.length === 0 ? (
                  <p className="text-muted small">لا توجد طلبات إعلانات ممولة مسجلة لهذه الحالة.</p>
                ) : (
                  <Row className="g-3">
                    {allAds.map((ad, idx) => (
                      <Col md={6} key={ad.id || idx}>
                        <div className="case-sub-card">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="fw-bold small text-success">طلب إعلان ممول #{ad.id}</span>
                            <Badge bg={ad.ad_approved ? "success" : "secondary"}>
                              {ad.status_name || (ad.ad_approved ? "مقبول وممول" : "قيد المراجعة")}
                            </Badge>
                          </div>
                          <p className="small text-muted mb-0">تاريخ الطلب: {ad.created_at || "-"}</p>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Tab.Pane>

              {/* ── Tab 5: Sharing & QR Code ── */}
              <Tab.Pane eventKey="share">
                <Row className="g-4 align-items-center">
                  <Col md={7}>
                    <div className="case-sub-card">
                      <div className="case-sub-card-header">
                        <FontAwesomeIcon icon={faShareNodes} />
                        رابط المشاركة المباشر للحالة
                      </div>
                      <p className="small text-muted mb-2">
                        انسخ هذا الرابط لمشاركته مع المتبرعين أو نشره على منصات التواصل الاجتماعي لجمع التبرعات:
                      </p>
                      <div className="d-flex gap-2 mb-3">
                        <input
                          type="text"
                          className="form-control text-start"
                          value={shareUrl}
                          readOnly
                          dir="ltr"
                        />
                        <Button
                          variant={copied ? "success" : "primary"}
                          onClick={handleCopyLink}
                          className="px-3"
                        >
                          <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="ms-1" />
                          {copied ? "تم النسخ" : "نسخ الرابط"}
                        </Button>
                      </div>

                      <div className="case-sub-card-header mt-4">
                        <FontAwesomeIcon icon={faShareNodes} />
                        المشاركة الفورية عبر شبكات التواصل
                      </div>
                      <div className="share-links-grid">
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="share-btn share-whatsapp"
                        >
                          <FontAwesomeIcon icon={faWhatsapp} />
                          واتساب
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="share-btn share-twitter"
                        >
                          <FontAwesomeIcon icon={faXTwitter} />
                          إكس (تويتر)
                        </a>
                        <a
                          href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(caseData.title)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="share-btn share-telegram"
                        >
                          <FontAwesomeIcon icon={faTelegram} />
                          تيليجرام
                        </a>
                      </div>
                    </div>
                  </Col>

                  <Col md={5} className="text-center">
                    <div className="case-sub-card p-4">
                      <div className="case-sub-card-header justify-content-center">
                        <FontAwesomeIcon icon={faQrcode} />
                        رمز الاستجابة السريعة (QR Code)
                      </div>
                      <p className="small text-muted mb-3">
                        امسح الرمز بواسطة كاميرا الجوال للوصول السريع إلى صفحة التبرع
                      </p>
                      <div className="p-3 bg-white d-inline-block rounded border shadow-sm mb-2">
                        <QRCodeSVG value={shareUrl} size={180} level="H" />
                      </div>
                      <p className="small text-muted mb-0">يمكنك طباعة هذا الرمز أو وضعه في النشرات والمطبوعات.</p>
                    </div>
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>
      </div>

      {/* ── Quick Action Modals ── */}
      <CaseReceiptVoucherModal
        show={modalAction.type === "receipt"}
        onClose={() => setModalAction({ type: null })}
        caseId={id}
        caseRecord={caseData}
        onSuccess={fetchCase}
      />

      <CasePaymentVoucherModal
        show={modalAction.type === "payment"}
        onClose={() => setModalAction({ type: null })}
        caseId={id}
        caseRecord={caseData}
        onSuccess={fetchCase}
      />

      <CaseDesignRequestModal
        show={modalAction.type === "design"}
        onClose={() => setModalAction({ type: null })}
        caseId={id}
        caseRecord={caseData}
      />

      <CaseMarketingRequestModal
        show={modalAction.type === "marketing"}
        onClose={() => setModalAction({ type: null })}
        caseId={id}
        caseRecord={caseData}
      />
    </div>
  );
}
