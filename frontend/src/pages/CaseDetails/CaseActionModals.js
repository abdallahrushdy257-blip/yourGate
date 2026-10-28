import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Row, Col, Spinner, Form, ProgressBar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faEye,
  faCoins,
  faPaintBrush,
  faBullhorn,
  faReceipt,
  faMoneyBillWave,
  faPenToSquare,
  faXmark,
  faCheckCircle,
  faTriangleExclamation,
  faCopy,
  faArrowLeft,
  faShareNodes,
  faPlus,
  faCalendarDays,
  faUser,
  faInbox,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faTelegram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterRadio from "../../components/Radio";
import RegisterTextarea from "../../components/RegisterTextarea";
import UploadInput from "../../components/UploadInput";
import API from "../../api/axiosConfig";
import { toLocal } from "../../Utils/toLocal";

// ══════════════════════════════════════════════════════════════════════════════
// 1. عرض الحالة (Case Overview & Analytics Modal)
// ══════════════════════════════════════════════════════════════════════════════
export function CaseOverviewModal({
  show,
  onClose,
  caseId,
  onOpenDonations,
  onCaseUpdated,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchCase = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    setSuccessMsg("");
    try {
      const res = await API.get(`/shop/${caseId}`);
      setCaseData(res.data?.data || res.data || null);
    } catch (err) {
      console.error("Error loading case overview:", err);
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    if (show && caseId) {
      fetchCase();
    }
  }, [show, caseId, fetchCase]);

  const handleCloseCase = async () => {
    if (!caseId) return;
    setIsClosing(true);
    try {
      const res = await API.get(`/shop/${caseId}/close`);
      if (res.status === 200) {
        setSuccessMsg("تم إغلاق الحالة واكتمالها بنجاح!");
        if (onCaseUpdated) onCaseUpdated();
        fetchCase();
      }
    } catch (err) {
      console.error("Error closing case:", err);
    } finally {
      setIsClosing(false);
    }
  };

  const total = parseFloat(caseData?.total || 0);
  const amount = parseFloat(caseData?.amount || 0);
  const paidAmount = parseFloat(caseData?.paid_amount || caseData?.total_paid || 0);
  const remaining = Math.max(0, total - amount);
  const netBalance = Math.max(0, amount - paidAmount);
  const pct = total > 0 ? Math.min(100, Math.round((amount / total) * 100)) : 0;
  const isCompleted = Number(caseData?.status) === 1;

  return (
    <Modal
      show={show}
      onHide={onClose}
      className="modal-table archModal donor-modal case-modal action-popup"
      size="lg"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          <FontAwesomeIcon icon={faChartPie} style={{ color: "var(--primary-color, #b89358)" }} />
          <span>متابعة ونسبة إنجاز الحالة الإنسانية</span>
        </Modal.Title>
        <Button className="custom-close-button" variant="link" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </Modal.Header>

      <Modal.Body style={{ direction: "rtl", padding: "24px" }}>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-3 text-muted">جاري تحميل بيانات وإحصائيات الحالة...</p>
          </div>
        ) : !caseData ? (
          <div className="text-center py-4 text-danger">تعذر تحميل بيانات الحالة.</div>
        ) : (
          <div className="case-overview-content">
            {successMsg && (
              <div className="alert alert-success d-flex align-items-center mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Title & Status Header */}
            <div className="overview-hero mb-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h4 className="case-overview-title mb-1">{caseData.title}</h4>
                  <span className="text-muted small">
                    المستفيد: {caseData.beneficiary_name || "عام / غير محدد"}
                  </span>
                </div>
                <div>
                  {isCompleted ? (
                    <span className="badge-case-completed fs-6 px-3 py-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="ms-1" />
                      مكتملة
                    </span>
                  ) : (
                    <span className="badge-case-active fs-6 px-3 py-2">
                      نشطة (قيد التبرع)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Metrics Cards */}
            <Row className="g-3 mb-4">
              <Col sm={6} md={3}>
                <div className="kpi-mini-card kpi-target">
                  <span className="kpi-label">المبلغ المستهدف</span>
                  <span className="kpi-value">{toLocal(total)} ر.س</span>
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div className="kpi-mini-card kpi-collected">
                  <span className="kpi-label">إجمالي التبرعات</span>
                  <span className="kpi-value text-success">{toLocal(amount)} ر.س</span>
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div className="kpi-mini-card kpi-paid">
                  <span className="kpi-label">إجمالي المصروفات</span>
                  <span className="kpi-value text-danger">{toLocal(paidAmount)} ر.س</span>
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div className="kpi-mini-card kpi-remaining">
                  <span className="kpi-label">المتبقي للاكتمال</span>
                  <span className="kpi-value text-warning">{toLocal(remaining)} ر.س</span>
                </div>
              </Col>
            </Row>

            {/* Progress Bar */}
            <div className="progress-section mb-4 p-3 rounded" style={{ background: "rgba(184, 147, 88, 0.06)", border: "1px solid var(--border-color, #ebdcc8)" }}>
              <div className="d-flex justify-content-between mb-2 align-items-center">
                <span className="fw-bold" style={{ fontSize: "14px" }}>نسبة تحصيل التبرعات</span>
                <span className="badge bg-dark fs-6">{pct}%</span>
              </div>
              <ProgressBar
                now={pct}
                variant={pct >= 100 ? "success" : pct > 50 ? "info" : "warning"}
                style={{ height: "14px", borderRadius: "10px" }}
              />
            </div>

            {/* Details Table */}
            <div className="overview-details p-3 rounded mb-3" style={{ background: "var(--surface-color, #ffffff)", border: "1px solid var(--border-color, #ebdcc8)" }}>
              <Row className="g-3">
                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">نوع وتصنيف الحالة:</span>
                    <span className="detail-value">{caseData.casetype || "عام"} - {caseData.subcasetype || "عام"}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">آلية وقناة التسويق:</span>
                    <span className="detail-value">{caseData.marketingmethod_string || "غير محدد"}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">تاريخ البدء:</span>
                    <span className="detail-value">{caseData.dateoflaunch || "غير محدد"}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">تاريخ الانتهاء المحدد:</span>
                    <span className="detail-value">{caseData.dateofcompletion || "غير محدد"}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">الرصيد المتاح للصرف (التبرعات - المصروفات):</span>
                    <span className="detail-value text-primary fw-bold">{toLocal(netBalance)} ر.س</span>
                  </div>
                </Col>
                {caseData.description && (
                  <Col md={12}>
                    <div className="detail-item">
                      <span className="detail-label">وصف الحالة:</span>
                      <p className="detail-desc mb-0 mt-1">{caseData.description}</p>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <div>
          <Button
            variant="outline-dark"
            className="me-2"
            onClick={() => {
              onClose();
              navigate(`/casedetailsview/${caseId}`);
            }}
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="ms-2" />
            شاشة التفاصيل الشاملة
          </Button>
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => {
              onClose();
              if (onOpenDonations) onOpenDonations(caseId, caseData);
            }}
          >
            <FontAwesomeIcon icon={faCoins} className="ms-2" />
            عرض سجل التبرعات
          </Button>
          <Button
            variant="outline-danger"
            className="me-2"
            onClick={() => {
              onClose();
              navigate(`/casedetailsview/${caseId}?tab=payments`);
            }}
          >
            <FontAwesomeIcon icon={faMoneyBillWave} className="ms-2" />
            سندات الصرف
          </Button>
          {!isCompleted && caseData && (
            <Button
              variant="warning"
              disabled={isClosing}
              onClick={handleCloseCase}
            >
              {isClosing ? <Spinner size="sm" animation="border" /> : "إغلاق الحالة واكتمالها"}
            </Button>
          )}
        </div>
        <Button variant="secondary" onClick={onClose}>
          إغلاق
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. بيانات الحالة (Full Case Details Card Modal)
// ══════════════════════════════════════════════════════════════════════════════
export function CaseInfoCardModal({ show, onClose, caseId }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isAdvertising, setIsAdvertising] = useState(false);
  const [adSuccess, setAdSuccess] = useState(false);
  const [adError, setAdError] = useState("");

  useEffect(() => {
    if (show && caseId) {
      setLoading(true);
      setCopied(false);
      setAdSuccess(false);
      setAdError("");
      API.get(`/shop/${caseId}`)
        .then((res) => {
          setCaseData(res.data?.data || res.data || null);
        })
        .catch((err) => console.error("Error loading case info:", err))
        .finally(() => setLoading(false));
    }
  }, [show, caseId]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/casedata/${caseId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleAdvertise = async () => {
    setIsAdvertising(true);
    setAdError("");
    setAdSuccess(false);
    try {
      const formData = new FormData();
      formData.append("id", caseId);
      await API.post("/ads/shop/store", formData);
      setAdSuccess(true);
      setTimeout(() => setAdSuccess(false), 4500);
    } catch (err) {
      console.error("Ad request error:", err);
      const msg = err.response?.data?.message || "تعذر تقديم طلب الإعلان، يرجى المحاولة لاحقاً";
      setAdError(msg);
      setTimeout(() => setAdError(""), 5000);
    } finally {
      setIsAdvertising(false);
    }
  };

  const shareUrl = `${window.location.origin}/casedata/${caseId}`;
  const shareText = `ساهم معنا في دعم حالة: ${caseData?.title || ""}`;
  const openShare = (platform) => {
    let url = "";
    if (platform === "whatsapp") {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    } else if (platform === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === "telegram") {
      url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    }
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      className="modal-table archModal donor-modal case-modal action-popup"
      size="lg"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          <FontAwesomeIcon icon={faEye} style={{ color: "var(--primary-color, #b89358)" }} />
          <span>بطاقة بيانات وتفاصيل الحالة الإنسانية</span>
        </Modal.Title>
        <Button className="custom-close-button" variant="link" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </Modal.Header>

      <Modal.Body style={{ direction: "rtl", padding: "24px" }}>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-3 text-muted">جاري تحميل بيانات الحالة الكاملة...</p>
          </div>
        ) : !caseData ? (
          <div className="text-center py-4 text-danger">تعذر تحميل بيانات الحالة.</div>
        ) : (
          <div>
            {copied && (
              <div className="alert alert-success d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2" />
                <span>تم نسخ رابط الحالة بنجاح إلى الحافظة!</span>
              </div>
            )}
            {adSuccess && (
              <div className="alert alert-success d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2" />
                <span>تم تسجيل وإرسال طلب الإعلان للحالة بنجاح إلى الإدارة!</span>
              </div>
            )}
            {adError && (
              <div className="alert alert-danger d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faTriangleExclamation} className="ms-2" />
                <span>{adError}</span>
              </div>
            )}

            <div className="case-detail-card p-3 rounded mb-3" style={{ background: "var(--surface-color, #ffffff)", border: "1px solid var(--border-color, #ebdcc8)" }}>
              <Row className="g-3">
                <Col md={12}>
                  <div className="detail-item p-3 rounded" style={{ background: "rgba(184, 147, 88, 0.08)" }}>
                    <span className="detail-label fw-bold" style={{ color: "var(--label-color, #705838)" }}>مسمى الحالة:</span>
                    <h5 className="mb-0 mt-1 fw-bold text-dark">{caseData.title}</h5>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">التصنيف الرئيسي:</span>
                    <span className="detail-value">{caseData.casetype || "غير محدد"}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">التصنيف الفرعي:</span>
                    <span className="detail-value">{caseData.subcasetype || "غير محدد"}</span>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">المبلغ المستهدف:</span>
                    <span className="detail-value fw-bold text-primary">{toLocal(caseData.total)} ر.س</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">المبلغ المحصل:</span>
                    <span className="detail-value fw-bold text-success">{toLocal(caseData.amount)} ر.س</span>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">المستفيد المسجل:</span>
                    <span className="detail-value">{caseData.beneficiary_name || "عام / غير محدد"}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">آلية التسويق:</span>
                    <span className="detail-value">{caseData.marketingmethod_string || "غير محدد"}</span>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">تاريخ الإطلاق:</span>
                    <span className="detail-value">{caseData.dateoflaunch || "غير محدد"}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">تاريخ الانتهاء:</span>
                    <span className="detail-value">{caseData.dateofcompletion || "غير محدد"}</span>
                  </div>
                </Col>

                {caseData.is_assets_selected && (
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">نظام الأسهم:</span>
                      <span className="detail-value">
                        {caseData.number_of_assets} أسهم (قيمة السهم: {toLocal(caseData.cost_per_asset)} ر.س)
                      </span>
                    </div>
                  </Col>
                )}

                {caseData.description && (
                  <Col md={12}>
                    <div className="detail-item">
                      <span className="detail-label">وصف الحالة العام:</span>
                      <p className="detail-desc p-2 rounded mt-1 mb-0" style={{ background: "rgba(0,0,0,0.02)" }}>
                        {caseData.description}
                      </p>
                    </div>
                  </Col>
                )}

                {caseData.description2 && (
                  <Col md={12}>
                    <div className="detail-item">
                      <span className="detail-label">تفاصيل وملاحظات إضافية:</span>
                      <p className="detail-desc p-2 rounded mt-1 mb-0" style={{ background: "rgba(0,0,0,0.02)" }}>
                        {caseData.description2}
                      </p>
                    </div>
                  </Col>
                )}
              </Row>
            </div>

            {/* Social Share Box */}
            <div
              className="p-3 rounded mb-2"
              style={{
                background: "rgba(184, 147, 88, 0.05)",
                border: "1px dashed var(--primary-color, #b89358)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <span className="fw-bold d-block" style={{ color: "var(--label-color, #705838)", fontSize: "14px" }}>
                    <FontAwesomeIcon icon={faShareNodes} className="ms-1" />
                    المشاركة والنشر السريع للحالة:
                  </span>
                  <small className="text-muted">انشر الرابط مباشرة عبر منصات التواصل لزيادة التبرعات</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline-success"
                    onClick={() => openShare("whatsapp")}
                    title="مشاركة عبر واتساب"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="ms-1" />
                    واتساب
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-dark"
                    onClick={() => openShare("twitter")}
                    title="مشاركة عبر X / تويتر"
                  >
                    <FontAwesomeIcon icon={faXTwitter} className="ms-1" />
                    منصة X
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => openShare("telegram")}
                    title="مشاركة عبر تيليجرام"
                  >
                    <FontAwesomeIcon icon={faTelegram} className="ms-1" />
                    تيليجرام
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between flex-wrap gap-2">
        <div className="d-flex gap-2 flex-wrap">
          <Button
            variant={copied ? "success" : "outline-dark"}
            onClick={handleCopyLink}
          >
            <FontAwesomeIcon icon={copied ? faCheckCircle : faCopy} className="ms-2" />
            {copied ? "تم النسخ!" : "نسخ الرابط"}
          </Button>
          <Button
            variant="outline-warning"
            disabled={isAdvertising}
            onClick={handleAdvertise}
          >
            {isAdvertising ? (
              <Spinner size="sm" animation="border" className="ms-2" />
            ) : (
              <FontAwesomeIcon icon={faBullhorn} className="ms-2" />
            )}
            طلب إعلان للحالة
          </Button>
          <Button
            variant="primary"
            style={{
              backgroundColor: "var(--primary-color, #b89358)",
              borderColor: "var(--primary-color, #b89358)",
              color: "#fff",
            }}
            onClick={() => {
              onClose();
              navigate(`/casedetailsview/${caseId}`);
            }}
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="ms-2" />
            شاشة التفاصيل الشاملة
          </Button>
        </div>
        <Button variant="secondary" onClick={onClose}>
          إغلاق
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. عرض التبرعات (Case Donations List Modal)
// ══════════════════════════════════════════════════════════════════════════════
export function CaseDonationsModal({
  show,
  onClose,
  caseId,
  caseRecord,
  onAddReceipt,
}) {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);

  const fetchDonations = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    try {
      const res = await API.get(`/shoptransaction/${caseId}`);
      const list = res.data?.data || res.data || [];
      setDonations(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error loading case donations:", err);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    if (show && caseId) {
      fetchDonations();
    }
  }, [show, caseId, fetchDonations]);

  const totalDonations = donations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  return (
    <Modal
      show={show}
      onHide={onClose}
      className="modal-table archModal donor-modal case-modal action-popup"
      size="lg"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          <FontAwesomeIcon icon={faCoins} style={{ color: "var(--primary-color, #b89358)" }} />
          <span>سجل التبرعات المحصلة للحالة</span>
        </Modal.Title>
        <Button className="custom-close-button" variant="link" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </Modal.Header>

      <Modal.Body style={{ direction: "rtl", padding: "20px" }}>
        {/* Summary Card */}
        <div className="d-flex justify-content-between align-items-center p-3 rounded mb-3" style={{ background: "rgba(184, 147, 88, 0.08)", border: "1px solid var(--border-color, #ebdcc8)" }}>
          <div>
            <h6 className="fw-bold mb-1">{caseRecord?.title || `حالة #${caseId}`}</h6>
            <span className="text-muted small">إجمالي التبرعات المسجلة: {donations.length} سند</span>
          </div>
          <div className="text-start">
            <span className="text-muted d-block small">المجموع المحصل</span>
            <span className="fw-bold fs-5 text-success">{toLocal(totalDonations)} ر.س</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-3 text-muted">جاري تحميل حركات وتبرعات الحالة...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FontAwesomeIcon icon={faInbox} style={{ fontSize: "3rem", opacity: 0.3 }} />
            <p className="mt-3 mb-2 fw-bold">لا توجد تبرعات مسجلة لهذه الحالة بعد</p>
            <span className="small text-muted">يمكنك تسجيل تبرع جديد عبر سند القبض.</span>
          </div>
        ) : (
          <div className="table-responsive" style={{ maxHeight: "380px", overflowY: "auto" }}>
            <table className="table table-hover align-middle mb-0 text-center">
              <thead style={{ background: "var(--surface-color, #f7f3ec)", color: "var(--text-color, #4a3e2e)" }}>
                <tr>
                  <th>م</th>
                  <th>التاريخ</th>
                  <th>رقم الفاتورة / السند</th>
                  <th>نوع التحصيل</th>
                  <th>قيمة التبرع</th>
                  <th>المتبرع / البيان</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>{idx + 1}</td>
                    <td>{item.date || "-"}</td>
                    <td><span className="badge bg-light text-dark border">{item.invoice_number || `#${item.id}`}</span></td>
                    <td>{item.transaction_type_string || item.type || "تبرع نقدي"}</td>
                    <td className="fw-bold text-success">{toLocal(item.amount)} ر.س</td>
                    <td className="text-muted small">{item.donor?.name || item.donor_name || item.notes || "فاعل خير"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <Button
          variant="primary"
          onClick={() => {
            onClose();
            if (onAddReceipt) onAddReceipt(caseId, caseRecord);
          }}
        >
          <FontAwesomeIcon icon={faPlus} className="ms-2" />
          إضافة سند قبض جديد
        </Button>
        <Button variant="secondary" onClick={onClose}>
          إغلاق
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. طلب تصميم (Case Design Request Modal)
// ══════════════════════════════════════════════════════════════════════════════
export function CaseDesignRequestModal({ show, onClose, caseId, caseRecord, onSuccess }) {
  const [upload1, setUpload1] = useState(null);
  const [upload2, setUpload2] = useState(null);
  const [note, setNote] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (show) {
      setUpload1(null);
      setUpload2(null);
      setNote("");
      setDescription("");
      setError({});
      setSuccess(false);
      setIsSubmitting(false);
    }
  }, [show]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const formData = new FormData();
    formData.append("id", caseId);
    formData.append("type", 1); // 1 = Design Request
    if (upload1) formData.append("upload", upload1);
    if (upload2) formData.append("upload2", upload2);
    formData.append("note", note);
    formData.append("description", description);

    try {
      const res = await API.post("/shopdetails/store", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) {
        setSuccess(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Error creating design request:", err);
      setError(err.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      className="modal-table archModal donor-modal case-modal action-popup"
      size="lg"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          <FontAwesomeIcon icon={faPaintBrush} style={{ color: "var(--primary-color, #b89358)" }} />
          <span>إرسال طلب تصميم للحالة الإنسانية</span>
        </Modal.Title>
        <Button className="custom-close-button" variant="link" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </Modal.Header>

      <Modal.Body style={{ direction: "rtl", padding: "24px" }}>
        {success ? (
          <div className="text-center py-4 text-success">
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: "3rem" }} />
            <h5 className="mt-3">تم إرسال طلب التصميم بنجاح!</h5>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Row className="g-3 mb-3">
              <Col md={12}>
                <RegisterTextbox
                  id="design-case-title"
                  label="إسم الحالة"
                  type="text"
                  value={caseRecord?.title || ""}
                  disabled
                />
              </Col>
              <Col md={6}>
                <UploadInput
                  id="design-file-1"
                  label="مرفقات أولية (شعار / صور)"
                  onChange={(e) => setUpload1(e.target.files[0])}
                />
              </Col>
              <Col md={6}>
                <UploadInput
                  id="design-file-2"
                  label="مرفقات إضافية"
                  onChange={(e) => setUpload2(e.target.files[0])}
                />
              </Col>
              <Col md={12}>
                <RegisterTextarea
                  id="design-notes"
                  label="ملاحظات لفريق التصميم"
                  placeholder="أدخل أي ملاحظات خاصة بالأبعاد، الألوان، أو الشعارات المطلوبة..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  stylee={{ height: "90px" }}
                />
              </Col>
              <Col md={12}>
                <RegisterTextarea
                  id="design-desc"
                  label="وصف التصميم والمحتوى المطلوب *"
                  placeholder="اكتب تفاصيل المحتوى والنصوص المطلوب إدراجها في التصميم..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={error.description}
                  stylee={{ height: "110px" }}
                />
              </Col>
            </Row>

            <Modal.Footer className="px-0 pb-0">
              <Button variant="secondary" onClick={onClose}>
                إلغاء
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaintBrush} className="ms-2" />
                    إرسال طلب التصميم
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. طلب إدارة / تسويق (Case Marketing Request Modal)
// ══════════════════════════════════════════════════════════════════════════════
export function CaseMarketingRequestModal({ show, onClose, caseId, caseRecord, onSuccess }) {
  const [upload1, setUpload1] = useState(null);
  const [upload2, setUpload2] = useState(null);
  const [note, setNote] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (show) {
      setUpload1(null);
      setUpload2(null);
      setNote("");
      setDescription("");
      setError({});
      setSuccess(false);
      setIsSubmitting(false);
    }
  }, [show]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const formData = new FormData();
    formData.append("id", caseId);
    formData.append("type", 2); // 2 = Marketing Request
    if (upload1) formData.append("upload", upload1);
    if (upload2) formData.append("upload2", upload2);
    formData.append("note", note);
    formData.append("description", description);

    try {
      const res = await API.post("/shopdetails/store", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) {
        setSuccess(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Error creating marketing request:", err);
      setError(err.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      className="modal-table archModal donor-modal case-modal action-popup"
      size="lg"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          <FontAwesomeIcon icon={faBullhorn} style={{ color: "var(--primary-color, #b89358)" }} />
          <span>إرسال طلب إدارة وحملة تسويقية</span>
        </Modal.Title>
        <Button className="custom-close-button" variant="link" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </Modal.Header>

      <Modal.Body style={{ direction: "rtl", padding: "24px" }}>
        {success ? (
          <div className="text-center py-4 text-success">
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: "3rem" }} />
            <h5 className="mt-3">تم إرسال طلب الحملة التسويقية بنجاح!</h5>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Row className="g-3 mb-3">
              <Col md={12}>
                <RegisterTextbox
                  id="mkt-case-title"
                  label="إسم الحالة"
                  type="text"
                  value={caseRecord?.title || ""}
                  disabled
                />
              </Col>
              <Col md={6}>
                <UploadInput
                  id="mkt-file-1"
                  label="مرفقات الخطة التسويقية"
                  onChange={(e) => setUpload1(e.target.files[0])}
                />
              </Col>
              <Col md={6}>
                <UploadInput
                  id="mkt-file-2"
                  label="ملفات إضافية"
                  onChange={(e) => setUpload2(e.target.files[0])}
                />
              </Col>
              <Col md={12}>
                <RegisterTextarea
                  id="mkt-notes"
                  label="ملاحظات لفريق التسويق والإدارة"
                  placeholder="أدخل المنصات المستهدفة أو الفئة المستهدفة..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  stylee={{ height: "90px" }}
                />
              </Col>
              <Col md={12}>
                <RegisterTextarea
                  id="mkt-desc"
                  label="وصف الخطة أو الحملة المطلوبة *"
                  placeholder="اكتب أهداف الحملة والموازنة المتوقعة والقنوات التسويقية..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={error.description}
                  stylee={{ height: "110px" }}
                />
              </Col>
            </Row>

            <Modal.Footer className="px-0 pb-0">
              <Button variant="secondary" onClick={onClose}>
                إلغاء
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faBullhorn} className="ms-2" />
                    إرسال طلب التسويق
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 6. سند صرف (Payment Voucher Modal)
// ══════════════════════════════════════════════════════════════════════════════
export function CasePaymentVoucherModal({
  show,
  onClose,
  caseId,
  caseRecord,
  onSuccess,
}) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [account, setAccount] = useState("الحساب البنكي الرئيسي");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (show) {
      setAmount("");
      setDate(new Date().toISOString().substr(0, 10));
      setAccount("الحساب البنكي الرئيسي");
      setNotes("");
      setError({});
      setSuccess(false);
      setIsSubmitting(false);
    }
  }, [show]);

  const isCompleted = Number(caseRecord?.status) === 1;

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isCompleted) {
      alert("لا يمكن إجراء أي حركات نقدية على الحالة بعد اكتمالها");
      return;
    }
    setIsSubmitting(true);
    setError({});

    try {
      const payload = {
        shop_id: caseId,
        amount: parseFloat(amount),
        date: date,
        account: account,
        notes: notes,
        human_cases_id: caseRecord?.human_cases_id || null,
        type: "صرف للحالة",
      };
      const res = await API.post("/shoptransaction/storepay", payload);
      if (res.status === 200 || res.status === 201) {
        setSuccess(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Error creating payment voucher:", err);
      setError(err.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      className="modal-table archModal donor-modal case-modal action-popup"
      size="lg"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          <FontAwesomeIcon icon={faMoneyBillWave} style={{ color: "#d9534f" }} />
          <span>إصدار سند صرف للحالة الإنسانية</span>
        </Modal.Title>
        <Button className="custom-close-button" variant="link" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </Modal.Header>

      <Modal.Body style={{ direction: "rtl", padding: "24px" }}>
        {isCompleted && (
          <div className="alert alert-warning d-flex align-items-center mb-3">
            <FontAwesomeIcon icon={faTriangleExclamation} className="ms-2" />
            <span>تنبيه: هذه الحالة مكتملة ومغلقة، لا يمكن إضافة سندات صرف جديدة لها.</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-4 text-success">
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: "3rem" }} />
            <h5 className="mt-3">تم تسجيل وإصدار سند الصرف بنجاح!</h5>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Row className="g-3 mb-3">
              <Col md={6}>
                <RegisterTextbox
                  id="pay-case-title"
                  label="مسمى الحالة"
                  type="text"
                  value={caseRecord?.title || ""}
                  disabled
                />
              </Col>
              <Col md={6}>
                <RegisterTextbox
                  id="pay-benf-name"
                  label="المستفيد المستحق"
                  type="text"
                  value={caseRecord?.beneficiary_name || "عام / غير محدد"}
                  disabled
                />
              </Col>
              <Col md={6}>
                <RegisterTextbox
                  id="pay-amount"
                  label="مبلغ الصرف (ر.س) *"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  error={error.amount}
                  disabled={isCompleted}
                />
              </Col>
              <Col md={6}>
                <RegisterTextbox
                  id="pay-date"
                  label="تاريخ السند *"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isCompleted}
                />
              </Col>
              <Col md={12}>
                <RegisterSelect
                  id="pay-account"
                  label="الحساب المسحوب منه"
                  options={[
                    { value: "الحساب البنكي الرئيسي", label: "الحساب البنكي الرئيسي (الراجحي)" },
                    { value: "حساب التبرعات والزكاة", label: "حساب التبرعات والزكاة" },
                    { value: "الصندوق النقدي", label: "الصندوق النقدي بالجمعية" },
                  ]}
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  disabled={isCompleted}
                />
              </Col>
              <Col md={12}>
                <RegisterTextarea
                  id="pay-notes"
                  label="بيان وملاحظات الصرف"
                  placeholder="اكتب بيان الصرف وتفاصيل الشيك أو التحويل البنكي..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  stylee={{ height: "90px" }}
                  disabled={isCompleted}
                />
              </Col>
            </Row>

            <Modal.Footer className="px-0 pb-0">
              <Button variant="secondary" onClick={onClose}>
                إلغاء
              </Button>
              <Button variant="danger" type="submit" disabled={isSubmitting || isCompleted}>
                {isSubmitting ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faMoneyBillWave} className="ms-2" />
                    حفظ وإصدار سند الصرف
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 7. سند قبض (Receipt Voucher Modal)
// ══════════════════════════════════════════════════════════════════════════════
export function CaseReceiptVoucherModal({
  show,
  onClose,
  caseId,
  caseRecord,
  onSuccess,
}) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [account, setAccount] = useState("تحويل بنكي");
  const [selectedDonor, setSelectedDonor] = useState("");
  const [donors, setDonors] = useState([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (show) {
      setAmount("");
      setDate(new Date().toISOString().substr(0, 10));
      setAccount("تحويل بنكي");
      setSelectedDonor("");
      setNotes("");
      setError({});
      setSuccess(false);
      setIsSubmitting(false);

      // Fetch donors list
      API.get("/donor/all")
        .then((res) => {
          const list = res.data?.data || res.data || [];
          setDonors(Array.isArray(list) ? list : []);
        })
        .catch(() => {
          // fallback
          API.post("/donor").then((r) => {
            const list = r.data?.data || r.data || [];
            setDonors(Array.isArray(list) ? list : []);
          }).catch(console.error);
        });
    }
  }, [show]);

  const isCompleted = Number(caseRecord?.status) === 1;

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isCompleted) {
      alert("لا يمكن إجراء أي حركات نقدية على الحالة بعد اكتمالها");
      return;
    }
    setIsSubmitting(true);
    setError({});

    try {
      const payload = {
        shop_id: caseId,
        amount: parseFloat(amount),
        date: date,
        account: account,
        donor_id: selectedDonor ? parseInt(selectedDonor) : null,
        notes: notes,
        type: account,
      };
      const res = await API.post("/shoptransaction/storerec", payload);
      if (res.status === 200 || res.status === 201) {
        setSuccess(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Error creating receipt voucher:", err);
      setError(err.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      className="modal-table archModal donor-modal case-modal action-popup"
      size="lg"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          <FontAwesomeIcon icon={faReceipt} style={{ color: "#38a169" }} />
          <span>إصدار سند قبض وتبرع للحالة</span>
        </Modal.Title>
        <Button className="custom-close-button" variant="link" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </Modal.Header>

      <Modal.Body style={{ direction: "rtl", padding: "24px" }}>
        {isCompleted && (
          <div className="alert alert-warning d-flex align-items-center mb-3">
            <FontAwesomeIcon icon={faTriangleExclamation} className="ms-2" />
            <span>تنبيه: هذه الحالة مكتملة ومغلقة، لا يمكن تسجيل تبرعات جديدة لها.</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-4 text-success">
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: "3rem" }} />
            <h5 className="mt-3">تم تسجيل سند القبض وإضافة التبرع بنجاح!</h5>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Row className="g-3 mb-3">
              <Col md={6}>
                <RegisterTextbox
                  id="rec-case-title"
                  label="مسمى الحالة"
                  type="text"
                  value={caseRecord?.title || ""}
                  disabled
                />
              </Col>
              <Col md={6}>
                <RegisterSelect
                  id="rec-donor-select"
                  label="إسم المتبرع"
                  options={[
                    { value: "", label: "فاعل خير (غير مسجل)" },
                    ...donors.map((d) => ({
                      value: d.id,
                      label: `${d.name} (${d.phonenum || d.idnumber || "بدون هاتف"})`,
                    })),
                  ]}
                  value={selectedDonor}
                  onChange={(e) => setSelectedDonor(e.target.value)}
                  disabled={isCompleted}
                />
              </Col>
              <Col md={6}>
                <RegisterTextbox
                  id="rec-amount"
                  label="قيمة التبرع (ر.س) *"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  error={error.amount}
                  disabled={isCompleted}
                />
              </Col>
              <Col md={6}>
                <RegisterTextbox
                  id="rec-date"
                  label="تاريخ القبض *"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isCompleted}
                />
              </Col>
              <Col md={12}>
                <RegisterSelect
                  id="rec-method"
                  label="طريقة وسيلة الدفع / التحصيل"
                  options={[
                    { value: "تحويل بنكي", label: "تحويل بنكي مباشر" },
                    { value: "نقدي", label: "نقدي (كاش)" },
                    { value: "شبكة مدى / بطاقة ائتمان", label: "شبكة مدى / بطاقة ائتمان" },
                    { value: "سداد الإلكتروني", label: "نظام سداد الإلكتروني" },
                  ]}
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  disabled={isCompleted}
                />
              </Col>
              <Col md={12}>
                <RegisterTextarea
                  id="rec-notes"
                  label="بيان التبرع والملاحظات"
                  placeholder="اكتب بيان القبض، رقم الحوالة، أو أي تفاصيل إضافية..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  stylee={{ height: "90px" }}
                  disabled={isCompleted}
                />
              </Col>
            </Row>

            <Modal.Footer className="px-0 pb-0">
              <Button variant="secondary" onClick={onClose}>
                إلغاء
              </Button>
              <Button variant="success" type="submit" disabled={isSubmitting || isCompleted}>
                {isSubmitting ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faReceipt} className="ms-2" />
                    حفظ وإصدار سند القبض
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 8. تعديل الحالة (Edit Case Modal)
// ══════════════════════════════════════════════════════════════════════════════
export function CaseEditModal({
  show,
  onClose,
  caseId,
  beneficiaries = [],
  onSuccess,
}) {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  const [title, setTitle] = useState("");
  const [total, setTotal] = useState(0);
  const [isAssetsSelected, setIsAssetsSelected] = useState(false);
  const [numberOfAssets, setNumberOfAssets] = useState(0);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subOptions, setSubOptions] = useState([]);
  const [showOtherTextbox, setShowOtherTextbox] = useState(false);
  const [otherText, setOtherText] = useState("");
  const [benf, setBenf] = useState("");
  const [postDate, setPostDate] = useState("");
  const [deedlineDate, setDeedlineDate] = useState("");
  const [marketingmethod, setMarketingmethod] = useState(0);
  const [description, setDescription] = useState("");
  const [description2, setDescription2] = useState("");
  const [documentFile, setDocumentFile] = useState(null);

  const updateSubCategoryOptions = (mainCat) => {
    if (mainCat === "حالة اغاثة") {
      setSubOptions([
        { value: "صحية", label: "صحية" },
        { value: "طارئة ", label: "طارئة " },
        { value: "إجتماعية", label: "إجتماعية" },
      ]);
      setShowOtherTextbox(false);
    } else if (mainCat === "حالة تنموية") {
      setSubOptions([
        { value: "دورات تدريبية", label: "دورات تدريبية" },
        { value: "دراسة", label: "دراسة" },
        { value: "إقامة مشاريع استراتيجية", label: "إقامة مشاريع استراتيجية" },
      ]);
      setShowOtherTextbox(false);
    } else if (mainCat === "أخري") {
      setSubOptions([]);
      setShowOtherTextbox(true);
    } else {
      setSubOptions([]);
      setShowOtherTextbox(false);
    }
  };

  useEffect(() => {
    if (show && caseId) {
      setLoading(true);
      setError({});
      setIsSubmitting(false);

      API.get(`/shop/${caseId}`)
        .then((res) => {
          const d = res.data?.data || res.data || {};
          setTitle(d.title || d.name || "");
          setTotal(parseFloat(d.total || 0));
          setIsAssetsSelected(Boolean(d.is_assets_selected));
          setNumberOfAssets(d.number_of_assets || 0);
          setMainCategory(d.casetype || d.mainCategory || "");
          setSubCategory(d.subcasetype || d.subCategory || "");
          updateSubCategoryOptions(d.casetype || d.mainCategory || "");
          setOtherText(d.other_category || "");
          setBenf(d.human_cases_id || d.benf || "");
          setPostDate(d.dateoflaunch || d.postDate || "");
          setDeedlineDate(d.dateofcompletion || d.deedlineDate || "");
          setMarketingmethod(Number(d.marketingmethod || 0));
          setDescription(d.description || "");
          setDescription2(d.description2 || "");
        })
        .catch((err) => console.error("Error loading case for edit:", err))
        .finally(() => setLoading(false));
    }
  }, [show, caseId]);

  const handleMainCatChange = (e) => {
    const val = e.target.value;
    setMainCategory(val);
    updateSubCategoryOptions(val);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const formData = new FormData();
    formData.append("id", caseId);
    formData.append("title", title);
    formData.append("total", total);
    formData.append("is_assets_selected", isAssetsSelected);
    formData.append("number_of_assets", numberOfAssets);
    formData.append("casetype", mainCategory);
    formData.append("subcasetype", subCategory);
    if (otherText) formData.append("other_category", otherText);
    if (benf && benf !== "0") formData.append("benf", benf);
    formData.append("dateoflaunch", postDate);
    formData.append("dateofcompletion", deedlineDate);
    formData.append("marketingmethod", marketingmethod);
    formData.append("description", description);
    formData.append("description2", description2);
    if (documentFile) formData.append("document", documentFile);

    try {
      const res = await API.post("/shop/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Error updating shop case:", err);
      setError(err.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      className="modal-table archModal donor-modal case-modal action-popup"
      size="lg"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          <FontAwesomeIcon icon={faPenToSquare} style={{ color: "var(--primary-color, #b89358)" }} />
          <span>تعديل بيانات الحالة الإنسانية</span>
        </Modal.Title>
        <Button className="custom-close-button" variant="link" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </Modal.Header>

      <Modal.Body style={{ direction: "rtl", padding: "24px" }}>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-3 text-muted">جاري تحميل بيانات الحالة للتعديل...</p>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <div className="case-section-header mb-3">
              <span>1. البيانات الأساسية</span>
            </div>
            <Row className="g-3 mb-4">
              <Col md={6}>
                <RegisterTextbox
                  id="edit-case-title"
                  label="مسمى الحالة *"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={error.title}
                />
              </Col>
              <Col md={6}>
                <RegisterSelect
                  id="edit-case-benf"
                  label="إسم المستفيد"
                  options={[
                    { value: "", label: "إختر المستفيد" },
                    { value: "0", label: "لا يوجد مستفيد محدد" },
                    ...beneficiaries.map((item) => ({
                      value: item.id,
                      label: `${item.name} (${item.idnumber || "بدون هوية"})`,
                    })),
                  ]}
                  value={benf}
                  onChange={(e) => setBenf(e.target.value)}
                  error={error.human_cases_id || error.benf}
                />
              </Col>
              <Col md={6}>
                <RegisterSelect
                  id="edit-case-main-cat"
                  label="نوع الحالة"
                  options={[
                    { value: "", label: "إختر التصنيف الرئيسي" },
                    { value: "حالة اغاثة", label: "حالة إغاثة" },
                    { value: "حالة تنموية", label: "حالة تنموية" },
                    { value: "أخري", label: "أخرى" },
                  ]}
                  value={mainCategory}
                  onChange={handleMainCatChange}
                  error={error.casetype}
                />
              </Col>
              <Col md={6}>
                {showOtherTextbox ? (
                  <RegisterTextbox
                    id="edit-case-other-cat"
                    label="تصنيف آخر"
                    type="text"
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                  />
                ) : (
                  <RegisterSelect
                    id="edit-case-sub-cat"
                    label="التصنيف الفرعي للحالة"
                    options={[
                      { value: "", label: "إختر التصنيف الفرعي" },
                      ...subOptions,
                    ]}
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    error={error.subcasetype}
                  />
                )}
              </Col>
            </Row>

            <div className="case-section-header mb-3">
              <span>2. الموازنة وآلية التبرع</span>
            </div>
            <Row className="g-3 mb-4">
              <Col md={6}>
                <RegisterTextbox
                  id="edit-case-total"
                  label="المبلغ المستهدف الكلي (ر.س) *"
                  type="number"
                  value={total}
                  onChange={(e) => setTotal(parseFloat(e.target.value) || 0)}
                  error={error.total}
                />
              </Col>
              <Col md={6}>
                <div style={{ marginTop: "30px" }}>
                  <RegisterRadio
                    name="edit-case-donation-system"
                    options={[
                      { label: "مبلغ عام", defaultChecked: !isAssetsSelected },
                      { label: "أسهم", defaultChecked: isAssetsSelected },
                    ]}
                    onChange={(label) => setIsAssetsSelected(label === "أسهم")}
                  />
                </div>
              </Col>
              {isAssetsSelected && (
                <>
                  <Col md={6}>
                    <RegisterTextbox
                      id="edit-case-num-assets"
                      label="عدد الأسهم"
                      type="number"
                      value={numberOfAssets}
                      onChange={(e) => setNumberOfAssets(parseInt(e.target.value) || 0)}
                    />
                  </Col>
                  <Col md={6}>
                    <RegisterTextbox
                      id="edit-case-asset-cost"
                      label="سعر السهم التقديري"
                      type="text"
                      value={numberOfAssets > 0 ? (total / numberOfAssets).toFixed(2) : 0}
                      disabled
                    />
                  </Col>
                </>
              )}
            </Row>

            <div className="case-section-header mb-3">
              <span>3. النشر والمواعيد</span>
            </div>
            <Row className="g-3 mb-4">
              <Col md={6}>
                <RegisterTextbox
                  id="edit-case-post-date"
                  label="تاريخ البدء"
                  type="date"
                  value={postDate}
                  onChange={(e) => setPostDate(e.target.value)}
                />
              </Col>
              <Col md={6}>
                <RegisterTextbox
                  id="edit-case-deadline"
                  label="تاريخ الانتهاء"
                  type="date"
                  value={deedlineDate}
                  onChange={(e) => setDeedlineDate(e.target.value)}
                />
              </Col>
              <Col md={6}>
                <RegisterSelect
                  id="edit-case-marketing"
                  label="آلية التسويق"
                  options={[
                    { value: "0", label: "غير محدد" },
                    { value: "1", label: "المانحين" },
                    { value: "2", label: "المنصات الحكومية" },
                    { value: "3", label: "متاجر الجمعيات" },
                  ]}
                  value={marketingmethod}
                  onChange={(e) => setMarketingmethod(Number(e.target.value))}
                />
              </Col>
              <Col md={6}>
                <UploadInput
                  id="edit-case-doc"
                  label="تحديث المستند المرفق"
                  onChange={(e) => setDocumentFile(e.target.files[0])}
                />
              </Col>
            </Row>

            <div className="case-section-header mb-3">
              <span>4. الأوصاف والملاحظات</span>
            </div>
            <Row className="g-3 mb-4">
              <Col md={6}>
                <RegisterTextarea
                  id="edit-case-desc"
                  label="وصف الحالة"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  stylee={{ height: "90px" }}
                />
              </Col>
              <Col md={6}>
                <RegisterTextarea
                  id="edit-case-desc2"
                  label="تفاصيل إضافية داخلية"
                  value={description2}
                  onChange={(e) => setDescription2(e.target.value)}
                  stylee={{ height: "90px" }}
                />
              </Col>
            </Row>

            <Modal.Footer className="px-0 pb-0">
              <Button variant="secondary" onClick={onClose}>
                إلغاء
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPenToSquare} className="ms-2" />
                    حفظ التعديلات
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}
