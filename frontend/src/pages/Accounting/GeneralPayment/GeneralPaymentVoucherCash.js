import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import {
  faFileInvoice,
  faMoneyBillWave,
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../components/RegisterTextBox";
import "../../ReceiptVoucher/ReceiptVoucher.css";
import "./voucherDesign.css";
import { Form, Spinner, Alert } from "react-bootstrap";
import CustomButton from "../../../components/CustomButton";
import RegisterSelect from "../../../components/RegisterSelect";
import JsBarcode from "jsbarcode";
import { useNavigate } from "react-router";
import API from "../../../api/axiosConfig";
import TestPreLoader from "../../TestPreLoader/TestPreLoader";

function GeneralPaymentVoucherCash() {
  const barcodeRef = useRef(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("");
  const [cashAccount, setCashAccount] = useState("");
  const [expenseAccount, setExpenseAccount] = useState("");
  const [type, setType] = useState("5"); // 5: نقدي
  const [typeVoucher, setTypeVoucher] = useState("2"); // 2: غير مقيدة
  const [description, setDescription] = useState("");

  const [cashAccountsList, setCashAccountsList] = useState([]);
  const [payableAccountsList, setPayableAccountsList] = useState([]);
  const [validationError, setValidationError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resCash, resPayable] = await Promise.all([
        API.get("/generalvoucher/fromaccount").catch(() => ({ data: [] })),
        API.get("/accounttree/entry").catch(async () => {
          return await API.get("/transactions/components/donations").catch(() => ({ data: [] }));
        }),
      ]);

      const rawCash = Array.isArray(resCash.data)
        ? resCash.data
        : (Array.isArray(resCash.data?.data) ? resCash.data.data : []);

      const rawPayable = Array.isArray(resPayable.data)
        ? resPayable.data
        : (Array.isArray(resPayable.data?.data) ? resPayable.data.data : []);

      const formattedCash = rawCash.map((acc) => ({
        value: acc.id,
        label: acc.name || `${acc.code} - ${acc.name_ar || acc.name}`,
      }));

      const formattedPayable = rawPayable.map((acc) => ({
        value: acc.id,
        label: acc.label || (acc.code ? `${acc.code} - ${acc.name}` : acc.name),
      }));

      setCashAccountsList(formattedCash);
      setPayableAccountsList(formattedPayable);
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
        const barcodeNum = "PV" + Date.now().toString().slice(-6);
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
      setValidationError("يرجى إدخال مبلغ صحيح لسند الصرف.");
      return;
    }
    if (!cashAccount) {
      setValidationError("يرجى اختيار حساب الصندوق / البنك (من حساب الصرف).");
      return;
    }
    if (!expenseAccount) {
      setValidationError("يرجى اختيار حساب المصروف / المستفيد (إلى حساب الصرف).");
      return;
    }
    if (cashAccount === expenseAccount) {
      setValidationError("لا يمكن أن يكون حساب الصرف وحساب المصروف نفس الحساب.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        amount: parsedAmount,
        type: type || "5",
        description: description || "سند صرف عام نقدي",
        date: date,
        fromaccount: cashAccount,
        toaccount: expenseAccount,
        typevoucher: typeVoucher || "2",
        voucher_type: "payment",
      };

      const res = await API.post("/generalvoucher/storepaymentvoucher", payload).catch(async () => {
        // Fallback to storecashvoucher with voucher_type=payment
        return await API.post("/generalvoucher/storecashvoucher", payload);
      });

      const data = res.data;

      if (res.status === 200 || res.status === 201 || data.status === 200 || data.success) {
        setSuccessMessage("تم حفظ وترحيل سند الصرف النقدي وإنشاء القيد المحاسبي بنجاح.");
        setTimeout(() => {
          navigate("/accountingEntry");
        }, 1200);
      } else {
        setServerError(data.message || "حدث خطأ أثناء حفظ سند الصرف.");
      }
    } catch (err) {
      console.error("Error creating payment voucher:", err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" - ")
          : "تعذر حفظ سند الصرف. يرجى التحقق من صحة البيانات.");
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: "100vh" }}>
        <TestPreLoader />
      </div>
    );
  }

  return (
    <div className="voucher-page-wrapper">
      <div className="voucher-header-bar">
        <Title
          title="سند صرف عام نقدي"
          icon={<FontAwesomeIcon icon={faMoneyBillWave} />}
        />
        <div className="voucher-badge payment">
          <span>سند صرف نقدي - خزينة وبنوك</span>
        </div>
      </div>

      <div className="voucher-card">
        {validationError && (
          <Alert variant="warning" className="d-flex align-items-center rounded-3 shadow-sm mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="ms-2 fs-5 text-warning" />
            <div>{validationError}</div>
          </Alert>
        )}

        {serverError && (
          <Alert variant="danger" className="d-flex align-items-center rounded-3 shadow-sm mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="ms-2 fs-5 text-danger" />
            <div>{serverError}</div>
          </Alert>
        )}

        {successMessage && (
          <Alert variant="success" className="d-flex align-items-center rounded-3 shadow-sm mb-4">
            <FontAwesomeIcon icon={faCheckCircle} className="ms-2 fs-5 text-success" />
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
                من حساب الصرف (الخزينة / البنك - الطرف الدائن) <span className="required-star">*</span>
              </label>
              <select
                className="voucher-select"
                value={cashAccount}
                onChange={(e) => setCashAccount(e.target.value)}
                required
              >
                <option value="">-- اختر حساب الصندوق / البنك --</option>
                {Array.isArray(cashAccountsList) &&
                  cashAccountsList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label || item.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="voucher-field-group">
              <label className="voucher-field-label">
                إلى حساب المصروف / المستفيد (الطرف المدين) <span className="required-star">*</span>
              </label>
              <select
                className="voucher-select"
                value={expenseAccount}
                onChange={(e) => setExpenseAccount(e.target.value)}
                required
              >
                <option value="">-- اختر حساب المصروف أو الجهة --</option>
                {Array.isArray(payableAccountsList) &&
                  payableAccountsList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label || item.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* القسم 3: طريقة الصرف وتصنيف الأموال */}
          <div className="voucher-section-title">
            <span>طريقة الدفع وتصنيف الأموال</span>
          </div>

          <div className="voucher-grid">
            <div className="voucher-field-group">
              <label className="voucher-field-label">طريقة الصرف</label>
              <select
                className="voucher-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="5">نقدي (كاش)</option>
                <option value="2">تحويل بنكي</option>
                <option value="1">شبكة (مدى / بطاقة)</option>
                <option value="4">شيك مصرفي</option>
                <option value="3">إيداع نقدي</option>
                <option value="6">KNET</option>
              </select>
            </div>

            <div className="voucher-field-group">
              <label className="voucher-field-label">نوع الترحيل</label>
              <select
                className="voucher-select"
                value={typeVoucher}
                onChange={(e) => setTypeVoucher(e.target.value)}
              >
                <option value="2">أموال غير مقيدة (مصروفات عامة)</option>
                <option value="1">أموال مقيدة (مخصصة لمشروع محدد)</option>
              </select>
            </div>
          </div>

          {/* القسم 4: البيان والملاحظات */}
          <div className="voucher-section-title">
            <span>البيان والشرح التوضيحي</span>
          </div>

          <div className="voucher-grid single-col">
            <div className="voucher-field-group">
              <label className="voucher-field-label">البيان / الوصف التفصيلي لسند الصرف</label>
              <input
                type="text"
                className="voucher-input"
                placeholder="مثال: سداد فواتير الكهرباء أو مصروفات صيانة..."
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </div>
          </div>

          {/* باركود السند */}
          <div className="voucher-barcode-wrapper">
            <span style={{ fontSize: "12px", color: "var(--label-color)", marginBottom: "4px", fontWeight: "600" }}>الرمز الشريطي للتوثيق</span>
            <svg ref={barcodeRef}></svg>
          </div>

          {/* أزرار الحفظ والإرسال */}
          <div className="voucher-actions">
            {isSubmitting ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <button
                type="submit"
                className="voucher-submit-btn"
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>حفظ وترحيل سند الصرف</span>
              </button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}

export default GeneralPaymentVoucherCash;
