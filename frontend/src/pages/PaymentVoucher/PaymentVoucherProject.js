import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoiceDollar,
  faArrowRight,
  faCoins,
  faBuildingColumns,
  faReceipt,
  faCalendarDays,
  faLayerGroup,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Spinner, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import JsBarcode from "jsbarcode";
import { toast } from "react-toastify";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import Title from "../../components/title";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterTextbox from "../../components/RegisterTextBox";
import "./PaymentVoucherProject.css";

function PaymentVoucherProject() {
  const barcodeRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const [rows, setRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [cridet, setCridet] = useState("");
  const [selHumancases, setSelHumancases] = useState("");
  const [description, setDescription] = useState("");

  // Data lists
  const [humancases, setHumancases] = useState([]);
  const [account, setAccount] = useState([]);
  const [error, setError] = useState({});

  // 1. Fetch Project Details
  const getProject = async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      if (res.status === 200) {
        setRows(res.data?.data || res.data || {});
      }
    } catch (err) {
      console.error("Error fetching project:", err);
    }
  };

  // 2. Fetch Project Phases
  const getHumancases = async () => {
    try {
      const res = await API.get(`/projectphase/${id}/all`);
      const phasesData = res.data?.data ?? res.data;
      setHumancases(Array.isArray(phasesData) ? phasesData : []);
    } catch (err) {
      console.error("Error fetching phases:", err);
      setHumancases([]);
    }
  };

  // 3. Fetch Accounts
  const getAccount = async () => {
    try {
      const res = await API.get("/transactions/components/donations");
      const accountsData = res.data?.data?.data ?? res.data?.data ?? res.data;
      setAccount(Array.isArray(accountsData) ? accountsData : []);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setAccount([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getProject(), getHumancases(), getAccount()]);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // Generate Barcode
  useEffect(() => {
    const barcodeNum = `PV-${id}-${Date.now().toString().slice(-4)}`;
    if (barcodeRef.current && !loading) {
      try {
        JsBarcode(barcodeRef.current, barcodeNum, {
          format: "CODE128",
          displayValue: false,
          fontSize: 13,
          lineColor: "#4a2e14",
          height: 48,
          margin: 0,
        });
      } catch (e) {
        console.error("Barcode generation error:", e);
      }
    }
  }, [loading, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      return toast.error("يرجى إدخال مبلغ صحيح للسند");
    }
    if (!type) {
      return toast.error("يرجى اختيار نوع التحويل");
    }
    if (!cridet) {
      return toast.error("يرجى اختيار حساب الصرف");
    }

    setIsSubmitting(true);
    setError({});

    try {
      const payload = {
        amount: Number(amount),
        selhuman: selHumancases || null,
        type: type,
        date: date,
        project_id: id,
        account: cridet,
        balanceid: rows?.accounts_id ? rows.accounts_id : 0,
        description: description,
      };

      const res = await API.post("/shoptransaction/storepayprojects", payload);

      if (res.status === 200 || res.status === 201) {
        toast.success("تم إصدار سند الصرف بنجاح");
        navigate("/projectStatus");
      } else {
        setError(res.data?.errors || {});
      }
    } catch (err) {
      console.error("Submission error:", err);
      const errMsg = err.response?.data?.message || "حدث خطأ أثناء حفظ سند الصرف";
      toast.error(errMsg);
      setError(err.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <TestPreLoader />;

  return (
    <div className="voucher-page-wrapper" dir="rtl">
      {/* Top Header & Navigation */}
      <div className="voucher-top-bar">
        <Title
          title="سند صرف للمشروع"
          icon={<FontAwesomeIcon icon={faFileInvoiceDollar} />}
        />

        <button
          type="button"
          className="voucher-back-btn"
          onClick={() => navigate(-1)}
          title="رجوع للمشاريع"
        >
          <FontAwesomeIcon icon={faArrowRight} />
          <span>رجوع للمشروع</span>
        </button>
      </div>

      {/* Main Voucher Card */}
      <div className="voucher-main-card">
        {/* Project Header Banner */}
        <div className="voucher-project-banner">
          <div className="voucher-project-details">
            <h3 className="voucher-project-title">
              <span>{rows?.name || "المشروع"}</span>
              <span className="voucher-project-badge">مشروع #{id}</span>
            </h3>
            <div className="voucher-project-meta">
              <span>
                <strong>تاريخ اليوم:</strong> {new Date().toLocaleDateString("ar-SA")}
              </span>
            </div>
          </div>

          <div className="voucher-doc-type-pill">
            <FontAwesomeIcon icon={faReceipt} className="ms-2" />
            <span>سند صرف مالي</span>
          </div>
        </div>

        {/* Voucher Form */}
        <Form onSubmit={handleSubmit} className="voucher-form-body">
          {/* Section 1: Financial & Date Details */}
          <div className="voucher-section">
            <div className="voucher-section-title">
              <FontAwesomeIcon icon={faCoins} />
              <span>البيانات المالية والتحويل</span>
            </div>

            <div className="voucher-form-grid">
              {/* Amount Field */}
              <div className="voucher-field-group">
                <label className="voucher-field-label" htmlFor="amountInput">
                  المبلغ المطلوب صرفه *
                </label>
                <div className="voucher-input-wrapper">
                  <input
                    type="number"
                    id="amountInput"
                    className="voucher-custom-input"
                    placeholder="0.00"
                    value={amount}
                    min={1}
                    step="any"
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <span className="voucher-currency-badge">ر.س</span>
                </div>
                {error?.amount && (
                  <span className="voucher-error-hint">{error.amount[0] || error.amount}</span>
                )}
              </div>

              {/* Voucher Date Field */}
              <div className="voucher-field-group">
                <label className="voucher-field-label" htmlFor="voucherDate">
                  تاريخ استحقاق السند *
                </label>
                <div className="voucher-input-wrapper">
                  <input
                    type="date"
                    id="voucherDate"
                    className="voucher-custom-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                {error?.date && (
                  <span className="voucher-error-hint">{error.date[0] || error.date}</span>
                )}
              </div>

              {/* Payment Type */}
              <div className="voucher-field-group">
                <RegisterSelect
                  id="paymentTypeSelect"
                  label="نوع التحويل / الدفع *"
                  stylee={{ width: "100%" }}
                  parentStyle={{ width: "100%" }}
                  options={[
                    { value: "", label: "اختر نوع التحويل" },
                    { value: "1", label: "الشبكة (مدى / بطاقة)" },
                    { value: "2", label: "تحويل بنكي" },
                    { value: "3", label: "إيداع نقدي" },
                    { value: "4", label: "شيك مصرفي" },
                    { value: "5", label: "نقدي (كاش)" },
                    { value: "6", label: "KNET" },
                  ]}
                  name="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
                {error?.type && (
                  <span className="voucher-error-hint">{error.type[0] || error.type}</span>
                )}
              </div>

              {/* Account / Credit Field */}
              <div className="voucher-field-group">
                <RegisterSelect
                  id="accSelect"
                  label="الحساب المدفوع منه (الخصم) *"
                  stylee={{ width: "100%" }}
                  parentStyle={{ width: "100%" }}
                  options={[
                    { value: "", label: "اختر حساب الصرف" },
                    ...account.map((acc) => ({
                      value: acc.id,
                      label: acc.name,
                    })),
                  ]}
                  value={cridet}
                  onChange={(e) => setCridet(e.target.value)}
                />
                {error?.account && (
                  <span className="voucher-error-hint">{error.account[0] || error.account}</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Phase & Description Details */}
          <div className="voucher-section">
            <div className="voucher-section-title">
              <FontAwesomeIcon icon={faLayerGroup} />
              <span>المرحلة والملاحظات</span>
            </div>

            <div className="voucher-form-grid">
              {/* Project Phase */}
              <div className="voucher-field-group">
                <RegisterSelect
                  id="phaseSelect"
                  label="مرحلة المشروع (اختياري)"
                  stylee={{ width: "100%" }}
                  parentStyle={{ width: "100%" }}
                  options={[
                    { value: "", label: "اختر مرحلة المشروع" },
                    ...humancases.map((phase) => ({
                      value: phase.id,
                      label: phase.name,
                    })),
                  ]}
                  value={selHumancases}
                  onChange={(e) => setSelHumancases(e.target.value)}
                  name="selHumancases"
                />
              </div>

              {/* Description */}
              <div className="voucher-field-group">
                <RegisterTextbox
                  id="descriptionInput"
                  label="وصف وبند الصرف"
                  type="text"
                  placeholder="اكتب تفاصيل أو سبب الصرف..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  stylee={{ width: "100%" }}
                  parentStyle={{ width: "100%" }}
                />
                {error?.description && (
                  <span className="voucher-error-hint">
                    {error.description[0] || error.description}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Barcode Section */}
          <div className="voucher-barcode-section">
            <svg ref={barcodeRef}></svg>
            <span className="voucher-barcode-number">
              PV-{id}-{date.replace(/-/g, "")}
            </span>
          </div>

          {/* Footer Submit Actions */}
          <div className="voucher-actions-footer">
            <button
              type="button"
              className="voucher-cancel-btn"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="voucher-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" />
                  <span>جاري إصدار السند...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faFileInvoiceDollar} />
                  <span>إصدار سند الصرف</span>
                </>
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default PaymentVoucherProject;
