import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import {
  faFileInvoice,
  faBoxes,
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Spinner, Alert } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { useNavigate } from "react-router";
import API from "../../../api/axiosConfig";
import TestPreLoader from "../../TestPreLoader/TestPreLoader";
import "./voucherDesign.css";

function GeneraReceiptVoucher() {
  const barcodeRef = useRef(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("2");
  const [account, setAccount] = useState([]);
  const [warehouseAccount, setWarehouseAccount] = useState([]);
  const [debt, setDebt] = useState("");
  const [cridet, setCridet] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [validationError, setValidationError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const typeVoucher = 2;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resFrom, resWarehouse] = await Promise.all([
        API.get("/generalvoucher/fromaccount").catch(() => ({ data: [] })),
        API.post("warehouse/transaction/warehousecontentcode").catch(() =>
          API.get("/transactions/components/donations").catch(() => ({ data: [] }))
        ),
      ]);

      const fromList = Array.isArray(resFrom.data)
        ? resFrom.data
        : (Array.isArray(resFrom.data?.data) ? resFrom.data.data : []);

      const warehouseList = Array.isArray(resWarehouse.data)
        ? resWarehouse.data
        : (Array.isArray(resWarehouse.data?.data) ? resWarehouse.data.data : []);

      setAccount(fromList);
      setWarehouseAccount(warehouseList);
    } catch (err) {
      console.error("Error fetching accounts:", err);
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
        const barcodeNum = "RV-IN" + Date.now().toString().slice(-6);
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
      setValidationError("يرجى إدخال قيمة تقديرية صحيحة للسند العيني.");
      return;
    }
    if (!debt) {
      setValidationError("يرجى اختيار حساب الطرف المدين (من حساب).");
      return;
    }
    if (!cridet) {
      setValidationError("يرجى اختيار حساب الطرف الدائن / المخزن (إلى حساب).");
      return;
    }
    if (debt === cridet) {
      setValidationError("لا يمكن أن يكون حساب المدين وحساب الدائن نفس الحساب.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        amount: parsedAmount,
        type: type || "2",
        description: description || "سند قبض عيني",
        date: date,
        fromaccount: debt,
        toaccount: cridet,
        typevoucher: typeVoucher,
        voucher_type: "receipt",
      };

      const res = await API.post("/generalvoucher/storecashvoucher", payload);
      if (res.status === 200 || res.status === 201 || res.data?.success) {
        setSuccessMessage("تم حفظ وترحيل سند القبض العيني بنجاح!");
        setTimeout(() => {
          navigate("/accountingEntry");
        }, 1200);
      }
    } catch (err) {
      console.error("Error saving receipt voucher:", err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" - ")
          : "تعذر حفظ سند القبض العيني.");
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
          title="سند قبض عيني"
          icon={<FontAwesomeIcon icon={faBoxes} />}
        />
        <div className="voucher-badge receipt">
          <span>سند قبض عيني - أصول وتبرعات عينية ومخازن</span>
        </div>
      </div>

      <div className="voucher-card">
        {validationError && (
          <Alert variant="warning" className="d-flex align-items-center mb-4 rounded-3 shadow-sm">
            <FontAwesomeIcon icon={faExclamationTriangle} className="ms-2 fs-5 text-warning" />
            <div>{validationError}</div>
          </Alert>
        )}
        {serverError && (
          <Alert variant="danger" className="d-flex align-items-center mb-4 rounded-3 shadow-sm">
            <FontAwesomeIcon icon={faExclamationTriangle} className="ms-2 fs-5 text-danger" />
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
            <FontAwesomeIcon icon={faBoxes} />
            <span>البيانات الأساسية وتاريخ السند</span>
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
                القيمة التقديرية (ج.م) <span className="required-star">*</span>
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
            <span>التوجيه المحاسبي والمخزني</span>
          </div>

          <div className="voucher-grid">
            <div className="voucher-field-group">
              <label className="voucher-field-label">
                من حساب (الطرف المدين) <span className="required-star">*</span>
              </label>
              <select
                className="voucher-select"
                value={debt}
                onChange={(e) => setDebt(e.target.value)}
                required
              >
                <option value="">-- اختر الحساب --</option>
                {account.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label || item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="voucher-field-group">
              <label className="voucher-field-label">
                إلى حساب / المخزن (الطرف الدائن) <span className="required-star">*</span>
              </label>
              <select
                className="voucher-select"
                value={cridet}
                onChange={(e) => setCridet(e.target.value)}
                required
              >
                <option value="">-- اختر حساب المخزن / المتبرع --</option>
                {warehouseAccount.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name ? `${item.name}${item.code ? ` - ${item.code}` : ""}` : (item.label || item.id)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* القسم 3: نوع التحويل والتصنيف */}
          <div className="voucher-section-title">
            <span>نوع التحويل والتصنيف</span>
          </div>

          <div className="voucher-grid">
            <div className="voucher-field-group">
              <label className="voucher-field-label">نوع التحويل</label>
              <select
                className="voucher-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="2">عيني / تحويل مواد</option>
                <option value="1">الشبكة</option>
                <option value="3">إيداع</option>
                <option value="4">شيك</option>
                <option value="5">نقدي</option>
                <option value="6">KNET</option>
              </select>
            </div>

            <div className="voucher-field-group">
              <label className="voucher-field-label">نوع حساب الترحيل</label>
              <select
                className="voucher-select"
                value={typeVoucher}
                disabled
              >
                <option value="2">سند قبض عيني</option>
              </select>
            </div>
          </div>

          {/* القسم 4: البيان والملاحظات */}
          <div className="voucher-section-title">
            <span>البيان والشرح التوضيحي</span>
          </div>

          <div className="voucher-grid single-col">
            <div className="voucher-field-group">
              <label className="voucher-field-label">شرح السند / تفاصيل الأصناف العينية</label>
              <input
                type="text"
                className="voucher-input"
                placeholder="مثال: استلام تبرع عيني عبارة عن أجهزة ومعدات طبية أو مواد غذائية..."
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

          {/* زر الحفظ */}
          <div className="voucher-actions">
            {isSubmitting ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <button
                type="submit"
                className="voucher-submit-btn"
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>حفظ وترحيل السند العيني</span>
              </button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}

export default GeneraReceiptVoucher;
