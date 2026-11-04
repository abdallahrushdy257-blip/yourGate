import React, { useState, useEffect, useCallback } from "react";
import "./balanceSheet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPrint,
  faRotateRight,
  faScaleBalanced,
  faCheckCircle,
  faExclamationTriangle,
  faBuildingColumns,
  faHandHoldingDollar,
  faCoins,
  faFileContract,
} from "@fortawesome/free-solid-svg-icons";
import { Spinner, Alert } from "react-bootstrap";
import API from "../../../api/axiosConfig";

function BalanceSheet() {
  const [isAssetsOpen, setIsAssetsOpen] = useState(true);
  const [isLiabilitiesOpen, setIsLiabilitiesOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split("T")[0]);
  const [rows, setRows] = useState({});
  const [totals, setTotals] = useState({});
  const [info, setInfo] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  const getBalanceSheet = useCallback(async (dateToUse) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const targetDate = dateToUse || asOfDate;
      const response = await API.get("/generalbudget", {
        params: { date: targetDate },
      });
      const data = response.data;

      if (data) {
        setRows(data);
        if (data.totals) {
          setTotals(data.totals);
        }
      }
    } catch (err) {
      console.error("Error fetching balance sheet:", err);
      setErrorMsg("تعذر تحميل بيانات قائمة المركز المالي. يرجى إعادة المحاولة.");
    } finally {
      setLoading(false);
    }
  }, [asOfDate]);

  const getInfo = async () => {
    try {
      const response = await API.get("/user");
      const data = response.data;
      setInfo(data.data || data);
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  useEffect(() => {
    getBalanceSheet();
    getInfo();
  }, [getBalanceSheet]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setAsOfDate(newDate);
    getBalanceSheet(newDate);
  };

  const handlePrint = () => {
    window.print();
  };

  // Safe numerical calculations helper
  const val = (group, key, isLiability = false) => {
    if (!rows || !rows.debt || !rows.credit) return 0;
    const d = parseFloat(rows.debt[key]) || 0;
    const c = parseFloat(rows.credit[key]) || 0;
    return isLiability ? c - d : d - c;
  };

  const formatCurrency = (amount) => {
    return (parseFloat(amount) || 0).toLocaleString("ar-EG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // ── Asset Calculations ──────────────────────────────────────────
  const cash = val("asset", "cash");
  const otherDebt = val("asset", "other_debt_account");
  const totalCurrentAssets = totals.current_assets ?? cash + otherDebt;

  const endowments = val("asset", "endowments");
  const totalEndowments = totals.endowment_assets ?? endowments;

  const projects = val("asset", "projects_under_progress");
  const investments = val("asset", "investments");
  const intangibles = val("asset", "intangible_assets");
  const totalNonCurrentAssets = totals.non_current_assets ?? projects + investments + intangibles;

  const totalAssets = totals.total_assets ?? totalCurrentAssets + totalEndowments + totalNonCurrentAssets;

  // ── Liability Calculations ──────────────────────────────────────
  const shortLoans = val("liability", "shortterm_loans", true);
  const paymentPapers = val("liability", "payment_papers", true);
  const accountsPayable = val("liability", "accounts_payable", true);
  const dueExpenses = val("liability", "due_expenses", true);
  const deferredRevenue = val("liability", "revenue_and_donations_provided", true);
  const otherCurrentLiab = val("liability", "other_current_obligations", true);
  const totalCurrentLiab =
    totals.current_liabilities ??
    shortLoans + paymentPapers + accountsPayable + dueExpenses + deferredRevenue + otherCurrentLiab;

  const longLoans = val("liability", "longterm_loans", true);
  const longPaymentNotes = val("liability", "longterm_payment_notes", true);
  const allocations = val("liability", "allocations", true);
  const accDeprec = val("liability", "depreciation_and_exhaustion_accumulations", true);
  const allocEndowments = val("liability", "allocations_for_endowment_assets", true);
  const deprecEndowments = val("liability", "depreciation_and_exhaustion_pools_for_endowment_assets", true);
  const totalNonCurrentLiab =
    totals.non_current_liabilities ??
    longLoans + longPaymentNotes + allocations + accDeprec + allocEndowments + deprecEndowments;

  const totalLiabilities = totals.total_liabilities ?? totalCurrentLiab + totalNonCurrentLiab;

  // ── Net Assets Calculations ─────────────────────────────────────
  const netUnrestricted = val("net_assets", "net_unrestricted_assets", true);
  const netRestricted = val("net_assets", "net_restricted_assets", true);
  const netEndowments = val("net_assets", "net_assets_of_endowments", true);
  const totalNetAssets = totals.total_net_assets ?? netUnrestricted + netRestricted + netEndowments;

  const totalLiabilitiesAndNetAssets =
    totals.total_liabilities_and_net_assets ?? totalLiabilities + totalNetAssets;

  const isBalanced = totals.is_balanced ?? Math.abs(totalAssets - totalLiabilitiesAndNetAssets) < 0.05;

  const orgName =
    rows.organization_name ||
    info?.store?.name ||
    info?.organization?.name ||
    info?.name ||
    "جمعية البر الخيرية";

  return (
    <div className="balance-sheet-wrapper" style={{ direction: "rtl" }}>
      {/* Printable / Top Official Header Card */}
      <div className="balance-sheet-container shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
        {/* Top Control Bar (Hidden in Print) */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom flex-wrap gap-2 print-controls">
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faScaleBalanced} className="text-primary fs-4" />
            <h5 className="fw-bold mb-0">قائمة المركز المالي والميزانية العمومية</h5>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <label className="fw-bold small text-muted mb-0">كما في تاريخ:</label>
              <input
                type="date"
                className="form-control form-control-sm luxury-date-input"
                value={asOfDate}
                onChange={handleDateChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm px-3 rounded-pill d-flex align-items-center gap-1"
              onClick={() => getBalanceSheet()}
              title="تحديث البيانات"
            >
              <FontAwesomeIcon icon={faRotateRight} />
              <span>تحديث</span>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm px-3 rounded-pill d-flex align-items-center gap-1 shadow-sm"
              onClick={handlePrint}
              title="طباعة التقرير الرسمي"
            >
              <FontAwesomeIcon icon={faPrint} />
              <span>طباعة</span>
            </button>
          </div>
        </div>

        {/* Official Header */}
        <div className="official-report-header text-center py-2 mb-4">
          <h4 className="fw-bold text-dark mb-1">
            جمعية ( <span className="text-primary">{orgName}</span> )
          </h4>
          <p className="text-muted small mb-1">تحت إشراف المركز الوطني لتنمية القطاع غير الربحي</p>
          <p className="text-muted small mb-1">مسجلة بالمركز الوطني لتنمية القطاع غير الربحي</p>
          <div className="badge bg-light text-dark border px-3 py-2 rounded-pill fs-6 mt-2 mb-1">
            قائمة المركز المالي كما في <strong>{asOfDate}</strong>
          </div>
          <p className="text-muted small mb-0 mt-1">(المبالغ بالعملة المحلية)</p>
        </div>

        {errorMsg && (
          <Alert variant="danger" className="rounded-3 shadow-sm mb-4">
            {errorMsg}
          </Alert>
        )}

        {/* Live Balance Status Indicator Card */}
        <div className="row g-3 mb-4 balance-summary-overview">
          <div className="col-md-4">
            <div className="card border-0 rounded-4 p-3 bg-light border-start border-4 border-primary h-100">
              <span className="text-muted small d-block mb-1">
                <FontAwesomeIcon icon={faCoins} className="ms-1 text-primary" />
                إجمالي الأصول (Assets)
              </span>
              <h4 className="fw-bold mb-0 text-primary">{formatCurrency(totalAssets)} ج.م</h4>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 rounded-4 p-3 bg-light border-start border-4 border-danger h-100">
              <span className="text-muted small d-block mb-1">
                <FontAwesomeIcon icon={faHandHoldingDollar} className="ms-1 text-danger" />
                إجمالي الالتزامات (Liabilities)
              </span>
              <h4 className="fw-bold mb-0 text-danger">{formatCurrency(totalLiabilities)} ج.م</h4>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 rounded-4 p-3 bg-light border-start border-4 border-success h-100">
              <span className="text-muted small d-block mb-1">
                <FontAwesomeIcon icon={faBuildingColumns} className="ms-1 text-success" />
                مجموع صافي الأصول (Net Assets)
              </span>
              <h4 className="fw-bold mb-0 text-success">{formatCurrency(totalNetAssets)} ج.م</h4>
            </div>
          </div>
        </div>

        {/* Balance Check Banner */}
        <div
          className={`alert ${
            isBalanced ? "alert-success border-success" : "alert-warning border-warning"
          } d-flex align-items-center justify-content-between rounded-4 p-3 mb-4 shadow-sm`}
        >
          <div className="d-flex align-items-center">
            <FontAwesomeIcon
              icon={isBalanced ? faCheckCircle : faExclamationTriangle}
              className={`ms-2 fs-4 ${isBalanced ? "text-success" : "text-warning"}`}
            />
            <span className="fw-bold">
              {isBalanced
                ? "قائمة المركز المالي متوازنة تماماً: إجمالي الأصول = إجمالي الالتزامات وصافي الأصول ✅"
                : `يوجد فارق غير متوازن قدره: ${formatCurrency(
                    Math.abs(totalAssets - totalLiabilitiesAndNetAssets)
                  )} ج.م ⚠️`}
            </span>
          </div>
          <span className="badge bg-white text-dark border px-3 py-2 rounded-pill font-monospace fw-bold">
            الموازنة: {formatCurrency(totalLiabilitiesAndNetAssets)} ج.م
          </span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">جاري استخراج وتحديث أرقام قائمة المركز المالي...</p>
          </div>
        ) : (
          <>
            {/* ── Section 1: الأصول (Assets) ────────────────────────── */}
            <div className="section mb-4 rounded-4 overflow-hidden border shadow-sm">
              <div
                className="section-titleRepo d-flex justify-content-between align-items-center p-3 bg-white"
                onClick={() => setIsAssetsOpen(!isAssetsOpen)}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faCoins} className="text-primary fs-5" />
                  <h5 className="fw-bold mb-0 text-dark">الأصول (Assets)</h5>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="badge bg-primary-subtle text-primary border border-primary px-3 py-2 rounded-pill fw-bold">
                    إجمالي الأصول: {formatCurrency(totalAssets)} ج.م
                  </span>
                  <FontAwesomeIcon icon={isAssetsOpen ? faChevronUp : faChevronDown} className="text-muted" />
                </div>
              </div>

              {isAssetsOpen && (
                <div className="section-contentRepo p-4 bg-white border-top">
                  {/* Current Assets */}
                  <h6 className="repoSub fw-bold text-secondary mb-3 pb-2 border-bottom">
                    الأصول المتداولة (Current Assets)
                  </h6>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">النقد وما في حكمه (الصناديق والبنوك)</span>
                    <span className="fw-bold text-primary font-monospace">{formatCurrency(cash)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">أرصدة مدينة أخرى وذمم</span>
                    <span className="fw-bold text-primary font-monospace">{formatCurrency(otherDebt)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between bg-light rounded px-2 mt-1">
                    <span className="fw-bold text-dark">مجموع الأصول المتداولة</span>
                    <span className="fw-bold text-primary font-monospace">{formatCurrency(totalCurrentAssets)} ج.م</span>
                  </div>

                  {/* Endowment Assets */}
                  <h6 className="repoSub fw-bold text-secondary mt-4 mb-3 pb-2 border-bottom">
                    أصول الأوقاف - بالصافي (Endowment Assets)
                  </h6>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">أصول الأوقاف العقارية والمالية</span>
                    <span className="fw-bold text-primary font-monospace">{formatCurrency(endowments)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between bg-light rounded px-2 mt-1">
                    <span className="fw-bold text-dark">مجموع أصول الأوقاف</span>
                    <span className="fw-bold text-primary font-monospace">{formatCurrency(totalEndowments)} ج.م</span>
                  </div>

                  {/* Non-Current Assets */}
                  <h6 className="repoSub fw-bold text-secondary mt-4 mb-3 pb-2 border-bottom">
                    الأصول غير المتداولة (Non-Current Assets)
                  </h6>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">مشروعات تحت التنفيذ</span>
                    <span className="fw-bold text-primary font-monospace">{formatCurrency(projects)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">العقارات الاستثمارية - بالتكلفة</span>
                    <span className="fw-bold text-primary font-monospace">{formatCurrency(investments)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">الأصول غير الملموسة - بالصافي</span>
                    <span className="fw-bold text-primary font-monospace">{formatCurrency(intangibles)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between bg-light rounded px-2 mt-1">
                    <span className="fw-bold text-dark">مجموع الأصول غير المتداولة</span>
                    <span className="fw-bold text-primary font-monospace">{formatCurrency(totalNonCurrentAssets)} ج.م</span>
                  </div>

                  {/* Total Assets Bar */}
                  <div className="total-section p-3 rounded-3 bg-primary text-white d-flex justify-content-between align-items-center mt-4 shadow-sm">
                    <span className="fs-5 fw-bold">إجمالي الأصول الكلية</span>
                    <span className="fs-5 fw-bold font-monospace">{formatCurrency(totalAssets)} ج.م</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── Section 2: الالتزامات وصافي الأصول ─────────────────── */}
            <div className="section mb-4 rounded-4 overflow-hidden border shadow-sm">
              <div
                className="section-titleRepo d-flex justify-content-between align-items-center p-3 bg-white"
                onClick={() => setIsLiabilitiesOpen(!isLiabilitiesOpen)}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faBuildingColumns} className="text-success fs-5" />
                  <h5 className="fw-bold mb-0 text-dark">الالتزامات وصافي الأصول (Liabilities & Net Assets)</h5>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill fw-bold">
                    إجمالي الالتزامات وصافي الأصول: {formatCurrency(totalLiabilitiesAndNetAssets)} ج.م
                  </span>
                  <FontAwesomeIcon icon={isLiabilitiesOpen ? faChevronUp : faChevronDown} className="text-muted" />
                </div>
              </div>

              {isLiabilitiesOpen && (
                <div className="section-contentRepo p-4 bg-white border-top">
                  {/* Current Liabilities */}
                  <h6 className="repoSub fw-bold text-secondary mb-3 pb-2 border-bottom">
                    الالتزامات المتداولة (Current Liabilities)
                  </h6>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">القروض قصيرة الأجل</span>
                    <span className="fw-bold text-danger font-monospace">{formatCurrency(shortLoans)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">أوراق الدفع</span>
                    <span className="fw-bold text-danger font-monospace">{formatCurrency(paymentPapers)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">الذمم الدائنة والموردون</span>
                    <span className="fw-bold text-danger font-monospace">{formatCurrency(accountsPayable)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">مصروفات مستحقة</span>
                    <span className="fw-bold text-danger font-monospace">{formatCurrency(dueExpenses)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">إيرادات وتبرعات مقدمة</span>
                    <span className="fw-bold text-danger font-monospace">{formatCurrency(deferredRevenue)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">التزامات متداولة أخرى</span>
                    <span className="fw-bold text-danger font-monospace">{formatCurrency(otherCurrentLiab)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between bg-light rounded px-2 mt-1">
                    <span className="fw-bold text-dark">مجموع الالتزامات المتداولة</span>
                    <span className="fw-bold text-danger font-monospace">{formatCurrency(totalCurrentLiab)} ج.م</span>
                  </div>

                  {/* Non-Current Liabilities */}
                  <h6 className="repoSub fw-bold text-secondary mt-4 mb-3 pb-2 border-bottom">
                    الالتزامات غير المتداولة (Non-Current Liabilities)
                  </h6>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">قروض طويلة الأجل</span>
                    <span className="fw-bold text-danger font-monospace">{formatCurrency(longLoans)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">أوراق دفع طويلة الأجل</span>
                    <span className="fw-bold text-danger font-monospace">{formatCurrency(longPaymentNotes)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">المخصصات ومكافأة نهاية الخدمة</span>
                    <span className="fw-bold text-danger font-monospace">{formatCurrency(allocations)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">مجمعات الإهلاك والاستنفاد</span>
                    <span className="fw-bold text-danger font-monospace">{formatCurrency(accDeprec)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">المخصصات للأصول الوقفية</span>
                    <span className="fw-bold text-danger font-monospace">{formatCurrency(allocEndowments)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">مجمعات الإهلاك والاستنفاذ للأصول الوقفية</span>
                    <span className="fw-bold text-danger font-monospace">{formatCurrency(deprecEndowments)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between bg-light rounded px-2 mt-1">
                    <span className="fw-bold text-dark">مجموع الالتزامات غير المتداولة</span>
                    <span className="fw-bold text-danger font-monospace">{formatCurrency(totalNonCurrentLiab)} ج.م</span>
                  </div>

                  {/* Total Liabilities Subtotal */}
                  <div className="report-item py-2 border-bottom d-flex justify-content-between bg-danger-subtle rounded px-2 mt-2">
                    <span className="fw-bold text-danger fs-6">مجموع الالتزامات الكلي</span>
                    <span className="fw-bold text-danger font-monospace fs-6">{formatCurrency(totalLiabilities)} ج.م</span>
                  </div>

                  {/* Net Assets */}
                  <h6 className="repoSub fw-bold text-secondary mt-4 mb-3 pb-2 border-bottom">
                    صافي الأصول / حقوق الملكية (Net Assets)
                  </h6>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">صافي الأصول غير المقيدة (شاملاً فائض/عجز الفترة)</span>
                    <span className="fw-bold text-success font-monospace">{formatCurrency(netUnrestricted)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">صافي الأصول المقيدة</span>
                    <span className="fw-bold text-success font-monospace">{formatCurrency(netRestricted)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between">
                    <span className="text-dark">صافي أصول الأوقاف</span>
                    <span className="fw-bold text-success font-monospace">{formatCurrency(netEndowments)} ج.م</span>
                  </div>
                  <div className="report-item py-2 border-bottom d-flex justify-content-between bg-light rounded px-2 mt-1">
                    <span className="fw-bold text-dark">مجموع صافي الأصول</span>
                    <span className="fw-bold text-success font-monospace">{formatCurrency(totalNetAssets)} ج.م</span>
                  </div>

                  {/* Total Liabilities & Net Assets Bar */}
                  <div className="total-section p-3 rounded-3 bg-success text-white d-flex justify-content-between align-items-center mt-4 shadow-sm">
                    <span className="fs-5 fw-bold">إجمالي الالتزامات وصافي الأصول</span>
                    <span className="fs-5 fw-bold font-monospace">{formatCurrency(totalLiabilitiesAndNetAssets)} ج.م</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BalanceSheet;
