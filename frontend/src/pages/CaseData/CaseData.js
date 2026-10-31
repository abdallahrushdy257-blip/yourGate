import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingHeart,
  faCoins,
  faHeart,
  faCheckCircle,
  faShieldHalved,
  faShareNodes,
  faCopy,
  faCheck,
  faArrowRight,
  faQrcode,
  faReceipt,
  faLock,
  faCreditCard,
  faBuildingColumns,
  faMobileScreenButton,
  faCircleCheck,
  faBullhorn,
  faSliders,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faXTwitter,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";
import API from "../../api/axiosConfig";
import { toLocal } from "../../Utils/toLocal";
import caseimage from "../../case.png";
import logoLight from "../../logo-light.svg";
import "./CaseDate.css";

const CaseData = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Donation Form State
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mada");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI State
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [adSuccessMessage, setAdSuccessMessage] = useState("");

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // Fetch case data
  const getCase = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/shop/${id}/view`);
      if (res.status === 200 && res.data) {
        setCaseData(res.data);
      }
    } catch (err) {
      console.error("Error fetching case data:", err);
      setError("تعذر تحميل بيانات الحالة، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCase();
  }, [id]);

  // Calculations
  const total = parseFloat(caseData?.total || 0);
  const collected = parseFloat(caseData?.amount || 0);
  const remaining = Math.max(0, total - collected);
  const percentage =
    total > 0 ? Math.min(100, Math.round((collected / total) * 100)) : 0;
  const isCompleted = caseData?.status === 1 || (total > 0 && remaining <= 0);

  // Effective donation amount
  const donationAmount = customAmount
    ? parseFloat(customAmount) || 0
    : parseFloat(selectedAmount) || 0;

  // Copy URL to clipboard
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  // Preset amounts
  const presetAmounts = [20, 50, 100, 250, 500];

  // Submit Donation
  const handleDonate = async (e) => {
    e.preventDefault();
    if (donationAmount <= 0) {
      alert("يرجى تحديد مبلغ التبرع أولاً.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        shop_id: id,
        amount: donationAmount,
        notes: isAnonymous
          ? "تبرع فاعل خير عبر الرابط العام"
          : `تبرع من: ${donorName || "فاعل خير"}${donorPhone ? ` (${donorPhone})` : ""}`,
        date: new Date().toISOString().slice(0, 10),
        account:
          paymentMethod === "apple"
            ? "Apple Pay"
            : paymentMethod === "visa"
            ? "بطاقة ائتمانية"
            : paymentMethod === "bank"
            ? "تحويل بنكي"
            : "مدى (Mada)",
      };

      const res = await API.post("/shop/public/donate", payload);

      if (res.status === 200 || res.status === 201) {
        // Update local amounts
        const newCollected = collected + donationAmount;
        const newRemaining = Math.max(0, total - newCollected);
        setCaseData((prev) => ({
          ...prev,
          amount: newCollected,
          remaining: newRemaining,
          percentage:
            total > 0
              ? Math.min(100, Math.round((newCollected / total) * 100))
              : 100,
          status: newRemaining <= 0 ? 1 : prev.status,
        }));

        setReceiptData({
          amount: donationAmount,
          invoiceNumber:
            res.data?.data?.invoice_number ||
            `REC-${Date.now().toString().slice(-6)}`,
          date: new Date().toLocaleDateString("ar-SA"),
        });

        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error("Donation error:", err);
      alert("حدث خطأ أثناء تسجيل التبرع، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Request Ad
  const handleRequestAd = async () => {
    const mForm = new FormData();
    mForm.append("id", id);
    try {
      const res = await API.post("/ads/shop/store", mForm);
      if (res.status === 200) {
        setAdSuccessMessage("تم إرسال طلب ترويج وإعلان الحالة بنجاح!");
        setTimeout(() => setAdSuccessMessage(""), 4000);
      }
    } catch (err) {
      console.error("Ad request error:", err);
    }
  };

  // Share text
  const shareText = encodeURIComponent(
    `ساهم معنا في دعم حالة: ${caseData?.title || "حالة إنسانية"}\nمتبقي لاكتمالها: ${toLocal(remaining)} ر.س\nتبرعك يصنع فارقاً:\n${currentUrl}`
  );

  if (loading) {
    return (
      <div className="public-case-loading">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3">جاري تحميل بيانات الحالة الإنسانية...</p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="public-case-error">
        <FontAwesomeIcon icon={faShieldHalved} className="error-icon" />
        <h3>الحالة غير متوفرة</h3>
        <p>{error || "لم يتم العثور على الحالة المطلوبة أو تم إغلاقها."}</p>
        <Button variant="primary" onClick={() => navigate("/")}>
          العودة للرئيسية
        </Button>
      </div>
    );
  }

  return (
    <div className="public-case-page">
      {/* ── Top Bar ── */}
      <header className="public-case-header">
        <div className="header-container">
          <div className="header-brand">
            <span className="brand-icon">
              <FontAwesomeIcon icon={faHandHoldingHeart} />
            </span>
            <div className="brand-text">
              <span className="brand-title">منصة أبوابكم الخيرية</span>
              <span className="brand-tagline">بوابة التبرع المباشر الموثقة</span>
            </div>
          </div>

          <div className="header-actions">
            <div className="trust-badge">
              <FontAwesomeIcon icon={faShieldHalved} />
              <span>مرخصة وموثوقة</span>
            </div>
            {isLoggedIn && (
              <Button
                variant="outline-primary"
                size="sm"
                className="btn-admin-view"
                onClick={() => navigate(`/casedetailsview/${id}`)}
              >
                <FontAwesomeIcon icon={faSliders} className="ms-1" />
                لوحة إدارة الحالة
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="public-case-main">
        <div className="case-layout-grid">
          {/* ── Right Column: Case Story & Details ── */}
          <div className="case-details-column">
            <div className="case-hero-card">
              <div className="case-meta-header">
                <span className="category-pill">
                  {caseData.casetype || "حالة إنسانية"}
                </span>
                <span className="case-number-pill">رقم الحالة #{id}</span>
                {isCompleted && (
                  <span className="completed-pill">
                    <FontAwesomeIcon icon={faCheckCircle} /> مكتملة بنجاح
                  </span>
                )}
              </div>

              <h1 className="case-title">{caseData.title || "حالة دعم إنساني"}</h1>

              <div className="organization-info">
                <span className="org-label">الجهة المشرفة:</span>
                <strong className="org-name">
                  {caseData.store_name || caseData.organization?.name || "جمعية البر الأهلية"}
                </strong>
                <span className="verified-check" title="جهة معتمدة وموثقة">
                  <FontAwesomeIcon icon={faCircleCheck} /> موثقة
                </span>
              </div>

              {/* Illustration / Visual Banner */}
              <div className="case-illustration-wrapper">
                <img src={caseimage} alt="دعم الحالة" className="case-banner-img" />
              </div>

              {/* Progress Section */}
              <div className="case-progress-box">
                <div className="progress-metrics">
                  <div className="metric-item">
                    <span className="metric-label">المستهدف</span>
                    <span className="metric-val">{toLocal(total)} ر.س</span>
                  </div>
                  <div className="metric-item highlight-green">
                    <span className="metric-label">المجموع حتى الآن</span>
                    <span className="metric-val">{toLocal(collected)} ر.س</span>
                  </div>
                  <div className="metric-item highlight-gold">
                    <span className="metric-label">المتبقي للاكتمال</span>
                    <span className="metric-val">{toLocal(remaining)} ر.س</span>
                  </div>
                </div>

                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="progress-footer">
                  <span className="progress-percent">
                    تم تغطية <strong>{percentage}%</strong> من المبلغ المطلوب
                  </span>
                  {remaining > 0 ? (
                    <span className="progress-hint">
                      ساهم بما تجود به نفسك لتفريج كربتهم
                    </span>
                  ) : (
                    <span className="progress-hint text-success">
                      الحمد لله، اكتمل التبرع بالكامل!
                    </span>
                  )}
                </div>
              </div>

              {/* Case Story & Details */}
              <div className="case-story-section">
                <h3 className="section-title">نبذة عن الحالة</h3>
                <p className="case-desc-text">
                  {caseData.description ||
                    "حالة إنسانية مستحقة ومدروسة بعناية من قِبل الباحث الاجتماعي، نرجو من أهل الخير والفضل المساهمة في سدادها وتفريج كربتهم."}
                </p>

                {caseData.description2 && (
                  <div className="case-additional-info">
                    <strong>معلومات إضافية:</strong>
                    <p>{caseData.description2}</p>
                  </div>
                )}
              </div>

              {/* Viral Social Share Section */}
              <div className="case-share-section">
                <h4 className="share-title">
                  <FontAwesomeIcon icon={faShareNodes} className="ms-2" />
                  ساهم بنشر الحالة واكسب أجر من تبرع
                </h4>
                <div className="share-buttons-grid">
                  <a
                    href={`https://api.whatsapp.com/send?text=${shareText}`}
                    target="_blank"
                    rel="noreferrer"
                    className="share-btn btn-whatsapp"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                    <span>واتساب</span>
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${shareText}`}
                    target="_blank"
                    rel="noreferrer"
                    className="share-btn btn-twitter"
                  >
                    <FontAwesomeIcon icon={faXTwitter} />
                    <span>منصة إكس</span>
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${shareText}`}
                    target="_blank"
                    rel="noreferrer"
                    className="share-btn btn-telegram"
                  >
                    <FontAwesomeIcon icon={faTelegram} />
                    <span>تيليجرام</span>
                  </a>

                  <button
                    type="button"
                    className={`share-btn btn-copy ${copied ? "copied" : ""}`}
                    onClick={handleCopyLink}
                  >
                    <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                    <span>{copied ? "تم النسخ!" : "نسخ الرابط"}</span>
                  </button>

                  <button
                    type="button"
                    className="share-btn btn-qr"
                    onClick={() => setShowQrModal(true)}
                  >
                    <FontAwesomeIcon icon={faQrcode} />
                    <span>رمز QR</span>
                  </button>
                </div>
              </div>

              {/* Admin Special Action for Promotion */}
              {isLoggedIn && (
                <div className="admin-actions-bar">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleRequestAd}
                  >
                    <FontAwesomeIcon icon={faBullhorn} className="ms-1" />
                    طلب إعلان وترويج الحالة
                  </Button>
                  {adSuccessMessage && (
                    <span className="text-success ms-2 font-weight-bold">
                      {adSuccessMessage}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Left Column: Sticky Donation Box ── */}
          <div className="case-donation-column">
            <div className="donation-card sticky-card">
              <div className="donation-card-header">
                <span className="card-badge">تبرع إلكتروني مباشر</span>
                <h3 className="donation-heading">
                  <FontAwesomeIcon icon={faHeart} className="heart-icon ms-2" />
                  أدخل السرور عليهم بتبرعك
                </h3>
                <p className="donation-subheading">
                  قال رسول الله ﷺ: «من فرّج عن مسلم كربة من كرب الدنيا، فرّج الله عنه كربة من كرب يوم القيامة»
                </p>
              </div>

              {isCompleted ? (
                <div className="completed-donation-box">
                  <FontAwesomeIcon icon={faCircleCheck} className="completed-icon" />
                  <h4>اكتمل التبرع لهذه الحالة بنجاح</h4>
                  <p>جزاكم الله خيراً، بفضل عطائكم تم تغطية المبلغ بالكامل.</p>
                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={handleCopyLink}
                  >
                    <FontAwesomeIcon icon={faShareNodes} className="ms-2" />
                    مشاركة الحالة مع الآخرين
                  </Button>
                </div>
              ) : (
                <Form onSubmit={handleDonate}>
                  {/* Preset Amount Chips */}
                  <div className="amount-selection-area">
                    <label className="input-field-label">اختر مبلغ التبرع:</label>
                    <div className="preset-chips-grid">
                      {presetAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          className={`preset-chip ${
                            selectedAmount === amt && !customAmount ? "active" : ""
                          }`}
                          onClick={() => {
                            setSelectedAmount(amt);
                            setCustomAmount("");
                          }}
                        >
                          {amt} ر.س
                        </button>
                      ))}

                      {remaining > 0 && remaining <= 5000 && (
                        <button
                          type="button"
                          className={`preset-chip chip-cover ${
                            selectedAmount === remaining && !customAmount
                              ? "active"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedAmount(remaining);
                            setCustomAmount("");
                          }}
                        >
                          تغطية المتبقي ({toLocal(remaining)} ر.س)
                        </button>
                      )}
                    </div>

                    {/* Custom Amount Field */}
                    <div className="custom-amount-wrapper">
                      <label className="input-field-label">أو أدخل مبلغاً آخر:</label>
                      <div className="currency-input-group">
                        <input
                          type="number"
                          min="1"
                          placeholder="مبلغ مخصص"
                          className="custom-amount-input"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(null);
                          }}
                        />
                        <span className="currency-suffix">ر.س</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector Mockup */}
                  <div className="payment-methods-area">
                    <label className="input-field-label">طريقة الدفع:</label>
                    <div className="payment-options-grid">
                      <button
                        type="button"
                        className={`payment-option-btn ${
                          paymentMethod === "mada" ? "active" : ""
                        }`}
                        onClick={() => setPaymentMethod("mada")}
                      >
                        <FontAwesomeIcon icon={faCreditCard} />
                        <span>مدى (Mada)</span>
                      </button>

                      <button
                        type="button"
                        className={`payment-option-btn ${
                          paymentMethod === "apple" ? "active" : ""
                        }`}
                        onClick={() => setPaymentMethod("apple")}
                      >
                        <FontAwesomeIcon icon={faMobileScreenButton} />
                        <span>Apple Pay</span>
                      </button>

                      <button
                        type="button"
                        className={`payment-option-btn ${
                          paymentMethod === "visa" ? "active" : ""
                        }`}
                        onClick={() => setPaymentMethod("visa")}
                      >
                        <FontAwesomeIcon icon={faCreditCard} />
                        <span>فيزا / ماستر</span>
                      </button>

                      <button
                        type="button"
                        className={`payment-option-btn ${
                          paymentMethod === "bank" ? "active" : ""
                        }`}
                        onClick={() => setPaymentMethod("bank")}
                      >
                        <FontAwesomeIcon icon={faBuildingColumns} />
                        <span>تحويل بنكي</span>
                      </button>
                    </div>
                  </div>

                  {/* Donor Options */}
                  <div className="donor-options-area">
                    <div className="anonymous-toggle">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <span className="checkbox-text">
                          التبرع كفاعل خير (مجهول الهوية)
                        </span>
                      </label>
                    </div>

                    {!isAnonymous && (
                      <div className="donor-details-inputs">
                        <div className="mb-2">
                          <input
                            type="text"
                            placeholder="اسم المتبرع الكريم"
                            className="donor-input"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                          />
                        </div>
                        <div>
                          <input
                            type="tel"
                            placeholder="رقم الجوال (لاستلام سند القبض)"
                            className="donor-input"
                            value={donorPhone}
                            onChange={(e) => setDonorPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    className="submit-donation-btn"
                    disabled={isSubmitting || donationAmount <= 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner animation="border" size="sm" className="ms-2" />
                        جاري معالجة التبرع...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faHeart} className="ms-2" />
                        تبرع الآن بمبلغ ({toLocal(donationAmount)} ر.س)
                      </>
                    )}
                  </button>

                  {/* Trust Footer */}
                  <div className="donation-card-footer">
                    <div className="security-note">
                      <FontAwesomeIcon icon={faLock} />
                      <span>تبرع آمن ومحمي 100% | يصل الدعم مباشرة للمستفيد</span>
                    </div>
                  </div>
                </Form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── QR Code Modal ── */}
      <Modal
        show={showQrModal}
        onHide={() => setShowQrModal(false)}
        centered
        className="qr-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>رمز الاستجابة السريعة (QR Code)</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          <p className="mb-3">
            امسح الرمز بكاميرا الجوال للوصول المباشر للحالة والتبرع لها:
          </p>
          <div className="qr-wrapper p-3 bg-white d-inline-block rounded shadow-sm border">
            <QRCodeSVG value={currentUrl} size={220} level="H" />
          </div>
          <div className="mt-4">
            <Button variant="outline-primary" onClick={handleCopyLink}>
              <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="ms-2" />
              {copied ? "تم نسخ الرابط!" : "نسخ رابط الحالة"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* ── Success Celebration Modal ── */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
        className="success-celebration-modal"
      >
        <Modal.Body className="text-center p-5">
          <div className="celebration-icon">
            <FontAwesomeIcon icon={faCircleCheck} />
          </div>
          <h2 className="celebration-title">تقبل الله عطاءكم!</h2>
          <p className="celebration-subtitle">
            تم استلام تبرعكم المبارك بنجاح، ونسأل الله أن يجعله في ميزان حسناتكم ويخلف عليكم بالبركة.
          </p>

          {receiptData && (
            <div className="receipt-summary-box">
              <div className="receipt-row">
                <span>رقم سند التبرع:</span>
                <strong>{receiptData.invoiceNumber}</strong>
              </div>
              <div className="receipt-row">
                <span>المبلغ المتبرع به:</span>
                <strong className="text-success">{toLocal(receiptData.amount)} ر.س</strong>
              </div>
              <div className="receipt-row">
                <span>تاريخ التبرع:</span>
                <span>{receiptData.date}</span>
              </div>
            </div>
          )}

          <div className="d-flex flex-column gap-2 mt-4">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `الحمد لله تبرعت للتو لحالة: ${caseData.title}\nساهموا معي في تفريج كربتهم:\n${currentUrl}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-success py-2 font-weight-bold"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="ms-2" />
              مشاركة أجر التبرع عبر واتساب
            </a>

            <Button
              variant="outline-secondary"
              onClick={() => setShowSuccessModal(false)}
            >
              إغلاق ومتابعة الحالة
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CaseData;
