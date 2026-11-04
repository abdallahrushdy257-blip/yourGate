import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import { faFileInvoice, faMoneyBillWave, faCheckCircle, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../components/RegisterTextBox";
import "../../ReceiptVoucher/ReceiptVoucher.css";
import { Form, Spinner, Alert } from "react-bootstrap";
import CustomButton from "../../../components/CustomButton";
import RegisterSelect from "../../../components/RegisterSelect";
import JsBarcode from "jsbarcode";
import { useNavigate } from "react-router";
import API from "../../../api/axiosConfig";
import TestPreLoader from "../../TestPreLoader/TestPreLoader";

import "./voucherDesign.css";

function GeneraReceiptVoucherCash() {
  const barcodeRef = useRef(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("");
  const [debt, setDebt] = useState("");
  const [cridet, setCridet] = useState("");
  const [type, setType] = useState("5"); // 5: نقدي
  const [typeVoucher, setTypeVoucher] = useState("2"); // 2: غير مقيدة
  const [description, setDescription] = useState("");

  const [account, setAccount] = useState([]);
  const [payableAccount, setPayableAccount] = useState([]);
  const [validationError, setValidationError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resFrom, resDonations] = await Promise.all([
        API.get("/generalvoucher/fromaccount").catch(() => ({ data: [] })),
        API.get("/transactions/components/donations").catch(() => ({ data: [] })),
      ]);

      const fromList = Array.isArray(resFrom.data)
        ? resFrom.data
        : (Array.isArray(resFrom.data?.data) ? resFrom.data.data : []);

      const donationList = Array.isArray(resDonations.data)
        ? resDonations.data
        : (Array.isArray(resDonations.data?.data) ? resDonations.data.data : []);

      setAccount(fromList);
      setPayableAccount(donationList);
    } catch (error) {
      console.error("Error fetching voucher accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (barcodeRef.current && !loading) {
      try {
        const barcodeNum = "RV" + Date.now().toString().slice(-6);
        JsBarcode(barcodeRef.current, barcodeNum, {
          format: "CODE128",
          displayValue: true,
          fontSize: 14,
          lineColor: "#4a3f35",
          height: 40,
        });
      } catch (err) {
        console.error("Barcode generation error:", err);
      }
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setServerError("");
    setSuccessMessage("");

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setValidationError("يرجى إدخال مبلغ صحيح لسند القبض.");
      return;
    }
    if (!debt) {
      setValidationError("يرجى اختيار حساب الصندوق / البنك (من حساب القبض).");
      return;
    }
    if (!cridet) {
      setValidationError("يرجى اختيار حساب الإيراد / التبرع (إلى حساب القبض).");
      return;
    }
    if (debt === cridet) {
      setValidationError("لا يمكن أن يكون حساب القبض وحساب الإيداع نفس الحساب.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        amount: parsedAmount,
        type: type || "5",
        description: description || "سند قبض عام نقدي",
        date: date,
        fromaccount: debt,
        toaccount: cridet,
        typevoucher: typeVoucher || "2",
        voucher_type: "receipt",
      };

      const res = await API.post("/generalvoucher/storecashvoucher", payload);
      const data = res.data;

      if (res.status === 200 || res.status === 201 || data.status === 200 || data.success) {
        setSuccessMessage("تم حفظ وترحيل سند القبض النقدي وإنشاء القيد المحاسبي بنجاح.");
        setTimeout(() => {
          navigate("/accountingEntry");
        }, 1200);
      } else {
        setServerError(data.message || "حدث خطأ أثناء حفظ السند.");
      }
    } catch (err) {
      console.error("Error creating receipt voucher:", err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" - ")
          : "تعذر حفظ سند القبض. يرجى التحقق من صحة البيانات.");
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <TestPreLoader />;
  }

  return (
    <div className="voucher-page-wrapper">
      <div className="voucher-header-bar">
        <Title
          title="سند قبض عام نقدي"
          icon={<FontAwesomeIcon icon={faMoneyBillWave} />}
        />
        <div className="voucher-badge receipt">
          <span>سند قبض نقدي - إيداع وإيرادات</span>
        </div>
      </div>

      <div className="voucher-card">
        {validationError && (
          <Alert variant="danger" className="d-flex align-items-center mb-4 rounded-3 shadow-sm">
            <FontAwesomeIcon icon={faExclamationTriangle} className="ms-2 fs-5" />
            <div>{validationError}</div>
          </Alert>
        )}
        {serverError && (
          <Alert variant="danger" className="d-flex align-items-center mb-4 rounded-3 shadow-sm">
            <FontAwesomeIcon icon={faExclamationTriangle} className="ms-2 fs-5" />
            <div>{serverError}</div>
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success" className="d-flex align-items-center mb-4 rounded-3 shadow-sm">
            <FontAwesomeIcon icon={faCheckCircle} className="ms-2 fs-5" />
            <div>{successMessage}</div>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* القسم 1: المبلغ وتاريخ الحركة */}
          <div className="voucher-section-title">
            <FontAwesomeIcon icon={faMoneyBillWave} />
            <span>البيانات المالية الأساسية</span>
          </div>

          <div className="voucher-grid">
            <div className="voucher-field-group">
              <label className="voucher-field-label">
                تاريخ السند <span className="required-star">*</span>
              </label>
              <input
                type="date"
                id="date"
                onChange={(e) => setDate(e.target.value)}
                value={date}
                className="voucher-input"
                required
              />
            </div>

            <div className="voucher-field-group">
              <label className="voucher-field-label">
                المبلغ (ج.م) <span className="required-star">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                id="amount"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="voucher-input voucher-amount-input"
                required
              />
            </div>
          </div>

          {/* القسم 2: الحسابات والتوجيه المحاسبي */}
          <div className="voucher-section-title">
            <FontAwesomeIcon icon={faFileInvoice} />
            <span>الحسابات والتوجيه المالي المزدوج</span>
          </div>

          <div className="voucher-grid">
            <div className="voucher-field-group">
              <label className="voucher-field-label">
                حساب القبض / الخزينة (الطرف المدين - منه) <span className="required-star">*</span>
              </label>
              <select
                className="voucher-select"
                value={debt}
                onChange={(e) => setDebt(e.target.value)}
                required
              >
                <option value="">-- اختر حساب الصندوق / البنك --</option>
                {account.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label || item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="voucher-field-group">
              <label className="voucher-field-label">
                حساب الإيراد / التبرع (الطرف الدائن - له) <span className="required-star">*</span>
              </label>
              <select
                className="voucher-select"
                value={cridet}
                onChange={(e) => setCridet(e.target.value)}
                required
              >
                <option value="">-- اختر حساب الإيراد / المتبرع --</option>
                {payableAccount.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label || item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* القسم 3: طريقة التحصيل ونوع الأموال */}
          <div className="voucher-section-title">
            <span>طريقة الدفع وتصنيف الأموال</span>
          </div>

          <div className="voucher-grid">
            <div className="voucher-field-group">
              <label className="voucher-field-label">طريقة التحصيل</label>
              <select
                className="voucher-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="5">نقدي (Cash)</option>
                <option value="1">شبكة (مدى / بطاقة مصرفية)</option>
                <option value="2">تحويل بنكي</option>
                <option value="3">إيداع نقدي مباشر</option>
                <option value="4">شيك مصرفي</option>
                <option value="6">KNET</option>
              </select>
            </div>

            <div className="voucher-field-group">
              <label className="voucher-field-label">نوع حساب الترحيل</label>
              <select
                className="voucher-select"
                value={typeVoucher}
                onChange={(e) => setTypeVoucher(e.target.value)}
              >
                <option value="2">أموال غير مقيدة (إيرادات عامة)</option>
                <option value="1">أموال مقيدة (مخصصة لمشروع أو غرض محدد)</option>
              </select>
            </div>
          </div>

          {/* القسم 4: البيان والملاحظات */}
          <div className="voucher-section-title">
            <span>البيان والشرح التوضيحي</span>
          </div>

          <div className="voucher-grid single-col">
            <div className="voucher-field-group">
              <label className="voucher-field-label">شرح السند / البيان المحاسبي</label>
              <input
                type="text"
                className="voucher-input"
                placeholder="مثال: استلام تبرع نقدي لحساب كفالات أو إيراد خدمات عامة..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* باركود السند */}
          <div className="voucher-barcode-wrapper">
            <span style={{ fontSize: "12px", color: "var(--label-color)", marginBottom: "4px", fontWeight: "600" }}>الرمز الشريطي للتوثيق</span>
            <svg ref={barcodeRef}></svg>
          </div>

          {/* زر الحفظ والترحيل */}
          <div className="voucher-actions">
            {isSubmitting ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <button
                type="submit"
                className="voucher-submit-btn"
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>حفظ وترحيل السند</span>
              </button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}

export default GeneraReceiptVoucherCash;
