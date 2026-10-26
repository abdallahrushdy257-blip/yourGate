import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faCopy,
  faCheck,
  faExternalLinkAlt,
  faQrcode,
  faClock,
  faShieldAlt,
  faRotateRight,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { QRCodeSVG } from "qrcode.react";
import { Spinner } from "react-bootstrap";
import API from "../../api/axiosConfig";
import { TableSkeleton } from "../../components/Skeleton";
import "./CreateBeneficiaryLink.css";

function CreateBeneficiaryLink() {
  const [label, setLabel] = useState("");
  const [hours, setHours] = useState("24");
  const [generatedLink, setGeneratedLink] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Recent tokens history
  const [tokens, setTokens] = useState([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [tokenCopiedIndex, setTokenCopiedIndex] = useState(null);

  const fetchTokens = async () => {
    try {
      setLoadingTokens(true);
      const res = await API.get("/hcform/tokens");
      if (res.data?.data) {
        setTokens(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch beneficiary link tokens:", err);
    } finally {
      setLoadingTokens(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleCreateLink = async (e) => {
    e?.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await API.post("/hcform/request", {
        label: label.trim() || undefined,
        hours: parseInt(hours, 10) || 24,
      });

      if (res.status === 200 && res.data?.code) {
        const link = `${window.location.origin}/benefitadddetails/${res.data.code}`;
        setGeneratedLink(link);
        setGeneratedCode(res.data.code);
        setExpiresAt(res.data.expires_at || "");
        setCopied(false);
        setLabel("");
        fetchTokens();
      }
    } catch (err) {
      console.error("Failed to generate beneficiary link:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (textToCopy, isRowIndex = null) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      if (isRowIndex !== null) {
        setTokenCopiedIndex(isRowIndex);
        setTimeout(() => setTokenCopiedIndex(null), 2500);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    });
  };

  const getWhatsappShareUrl = (link) => {
    const text = encodeURIComponent(
      `السلام عليكم، تفضل رابط تسجيل وتحديث بيانات المستفيد لدى الجمعية:\n${link}\n(ملاحظة: الرابط صالح للاستخدام مرة واحدة فقط).`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  return (
    <div className="cbl-container">
      {/* Header Hero Card */}
      <div className="cbl-header-card d-flex align-items-center">
        <div className="cbl-header-icon">
          <FontAwesomeIcon icon={faLink} />
        </div>
        <div>
          <h2 className="cbl-header-title">
            إنشاء رابط إضافة بيانات المستفيد
          </h2>
          <p className="cbl-header-subtitle">
            إنشاء رابط إلكتروني آمن يتيح للمستفيد تسجيل بياناته الأساسية، الحساب البنكي، المؤهلات والمهنة، السكن، الحالة الصحية، والتابعين ذاتياً لمرة واحدة.
          </p>
        </div>
      </div>

      {/* Generator Form Card */}
      <div className="cbl-card">
        <div className="cbl-card-title">
          <span className="dot"></span>
          <span>إعدادات الرابط الخارجي الجديد</span>
        </div>

        <form onSubmit={handleCreateLink}>
          <div className="cbl-form-row">
            <div className="cbl-input-group">
              <label>وصف الرابط أو اسم المستفيد (اختياري)</label>
              <input
                type="text"
                className="cbl-input"
                placeholder="مثال: المستفيد أحمد محمد - طلب مساعدة عاجلة"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>

            <div className="cbl-input-group">
              <label>مدة صلاحية الرابط</label>
              <select
                className="cbl-select"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              >
                <option value="24">24 ساعة (الموصى به)</option>
                <option value="48">48 ساعة (يومان)</option>
                <option value="72">72 ساعة (3 أيام)</option>
                <option value="168">أسبوع (7 أيام)</option>
              </select>
            </div>

            <button
              type="submit"
              className="cbl-btn-generate"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" />
                  <span>جارٍ الإنشاء...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faUserPlus} />
                  <span>إنشاء الرابط</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Generated Link Result Area */}
        {generatedLink && (
          <div className="cbl-result-box">
            <div className="cbl-result-header">
              <span className="cbl-result-badge">
                <FontAwesomeIcon icon={faCheck} />
                تم إنشاء الرابط بنجاح
              </span>
              <span className="cbl-expiry-badge">
                <FontAwesomeIcon icon={faClock} />
                صالح لمدة {hours} ساعة • استخدام مرة واحدة فقط
              </span>
            </div>

            <div className="cbl-link-row">
              <input
                type="text"
                className="cbl-link-input"
                value={generatedLink}
                readOnly
              />
            </div>

            <div className="cbl-actions-row">
              <button
                type="button"
                className="cbl-action-btn cbl-btn-copy"
                onClick={() => handleCopy(generatedLink)}
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                <span>{copied ? "تم النسخ بنجاح!" : "نسخ الرابط"}</span>
              </button>

              <a
                href={generatedLink}
                target="_blank"
                rel="noreferrer"
                className="cbl-action-btn cbl-btn-open"
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} />
                <span>فتح الاستمارة</span>
              </a>

              <a
                href={getWhatsappShareUrl(generatedLink)}
                target="_blank"
                rel="noreferrer"
                className="cbl-action-btn cbl-btn-whatsapp"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                <span>إرسال عبر واتساب</span>
              </a>

              <button
                type="button"
                className="cbl-action-btn cbl-btn-qr"
                onClick={() => setShowQr(!showQr)}
              >
                <FontAwesomeIcon icon={faQrcode} />
                <span>{showQr ? "إخفاء QR" : "عرض رمز QR"}</span>
              </button>
            </div>

            {showQr && (
              <div className="cbl-qr-box">
                <QRCodeSVG
                  value={generatedLink}
                  size={160}
                  level="M"
                  includeMargin={true}
                />
                <small style={{ color: "#7a6e5d", fontWeight: "600" }}>
                  امسح الرمز بكاميرا الجوال لفتح الاستمارة
                </small>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Tokens History Table */}
      <div className="cbl-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="cbl-card-title mb-0">
            <span className="dot"></span>
            <span>سجل الروابط المنشأة مؤخراً</span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={fetchTokens}
            disabled={loadingTokens}
            title="تحديث القائمة"
            style={{ borderRadius: "10px" }}
          >
            <FontAwesomeIcon icon={faRotateRight} spin={loadingTokens} />
          </button>
        </div>

        {loadingTokens ? (
          <TableSkeleton rows={4} columns={6} />
        ) : tokens.length === 0 ? (
          <div className="cbl-empty-state">
            <FontAwesomeIcon
              icon={faShieldAlt}
              size="2x"
              style={{ color: "#d2c5b3", marginBottom: "12px" }}
            />
            <p>لم يتم إنشاء روابط بعد. اضغط على زر "إنشاء الرابط" أعلاه للبدء.</p>
          </div>
        ) : (
          <div className="cbl-table-wrapper">
            <table className="cbl-table">
              <thead>
                <tr>
                  <th>كود الرابط</th>
                  <th>الوصف</th>
                  <th>المستفيد المسجل</th>
                  <th>تاريخ الإنشاء</th>
                  <th>ينتهي في</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((tok, idx) => {
                  const fullUrl = `${window.location.origin}/benefitadddetails/${tok.code}`;
                  const isCopied = tokenCopiedIndex === idx;

                  const statusClass =
                    tok.status === "نشط"
                      ? "cbl-status-active"
                      : tok.status === "مستخدم"
                      ? "cbl-status-used"
                      : "cbl-status-expired";

                  return (
                    <tr key={tok.id || idx}>
                      <td>
                        <code style={{ fontSize: "12px", color: "#6d583b" }}>
                          {tok.code.substring(0, 10)}...
                        </code>
                      </td>
                      <td>{tok.label || "-"}</td>
                      <td style={{ fontWeight: "600" }}>
                        {tok.beneficiary_name || (
                          <span style={{ color: "#9e917e" }}>لم يسجل بعد</span>
                        )}
                      </td>
                      <td style={{ fontSize: "12.5px" }}>{tok.created_at}</td>
                      <td style={{ fontSize: "12.5px" }}>
                        {tok.expires_at_human}
                      </td>
                      <td>
                        <span className={`cbl-status-badge ${statusClass}`}>
                          {tok.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-light"
                            style={{
                              border: "1px solid #dcd1be",
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                            onClick={() => handleCopy(fullUrl, idx)}
                            title="نسخ الرابط"
                          >
                            <FontAwesomeIcon
                              icon={isCopied ? faCheck : faCopy}
                              style={{ color: isCopied ? "#2e7d32" : "inherit" }}
                            />
                          </button>
                          <a
                            href={fullUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-light"
                            style={{
                              border: "1px solid #dcd1be",
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                            title="فتح الرابط"
                          >
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateBeneficiaryLink;
