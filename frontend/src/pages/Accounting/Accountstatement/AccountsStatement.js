import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faPrint,
  faRotateRight,
  faMagnifyingGlass,
  faEye,
  faArrowTrendUp,
  faArrowTrendDown,
  faScaleBalanced,
  faWallet,
  faFileInvoiceDollar,
} from "@fortawesome/free-solid-svg-icons";
import { Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../../../api/axiosConfig";
import Accountstatement from "./Accountstatement";
import "./accountstatement.css";

function AccountsStatement() {
  const navigate = useNavigate();

  // Filters state
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [accountsList, setAccountsList] = useState([]);

  // Data state
  const [loading, setLoading] = useState(false);
  const [statementData, setStatementData] = useState({
    account: null,
    opening_balance: 0,
    total_debit: 0,
    total_credit: 0,
    net_change: 0,
    closing_balance: 0,
    data: [],
  });
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch accounts dropdown list
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await API.get("/accounttree/entry");
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setAccountsList(list);
      } catch (err) {
        console.error("Error fetching accounts list for statement:", err);
      }
    };
    fetchAccounts();
  }, []);

  // Fetch statement data from backend
  const fetchStatement = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const params = {};
      if (selectedAccountId) params.account_id = selectedAccountId;
      if (fromDate) params.date_from = fromDate;
      if (toDate) params.date_to = toDate;
      if (search) params.search = search;

      const res = await API.get("/accountstatement/accounts", { params });
      const data = res.data;

      if (data && (data.success || data.status === 200 || Array.isArray(data.data))) {
        setStatementData({
          account: data.account || null,
          opening_balance: parseFloat(data.opening_balance) || 0,
          total_debit: parseFloat(data.total_debit) || 0,
          total_credit: parseFloat(data.total_credit) || 0,
          net_change: parseFloat(data.net_change) || 0,
          closing_balance: parseFloat(data.closing_balance) || 0,
          data: Array.isArray(data.data) ? data.data : (data.transactions || []),
        });
      }
    } catch (err) {
      console.error("Error loading account statement:", err);
      setErrorMsg("تعذر تحميل كشف الحساب. يرجى إعادة المحاولة.");
    } finally {
      setLoading(false);
    }
  }, [selectedAccountId, fromDate, toDate, search]);

  useEffect(() => {
    fetchStatement();
  }, [fetchStatement]);

  const handleResetFilters = () => {
    setSelectedAccountId("");
    setFromDate("");
    setToDate("");
    setSearch("");
  };

  const handlePrint = () => {
    window.print();
  };

  const rows = statementData.data || [];

  return (
    <div className="account-statement-page-wrapper" style={{ direction: "rtl" }}>
      {/* Top Statement Category Navigation Radios */}
      <Accountstatement />

      <div className="container-fluid px-4 py-3">
        {/* Luxury Filter Toolbar Card */}
        <div className="card shadow-sm border-0 rounded-4 mb-4 statement-filter-card p-4">
          <div className="row g-3 align-items-end">
            {/* Account Selector */}
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-bold text-muted small mb-1">
                <FontAwesomeIcon icon={faWallet} className="ms-1 text-primary" />
                الحساب المالي المستعلم عنه
              </label>
              <select
                className="form-select luxury-filter-select"
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
              >
                <option value="">-- كافة الحسابات المالية (كشف عام) --</option>
                {accountsList.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.code} - {acc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* From Date */}
            <div className="col-lg-2 col-md-3">
              <label className="form-label fw-bold text-muted small mb-1">من تاريخ</label>
              <input
                type="date"
                className="form-control luxury-filter-input"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            {/* To Date */}
            <div className="col-lg-2 col-md-3">
              <label className="form-label fw-bold text-muted small mb-1">إلى تاريخ</label>
              <input
                type="date"
                className="form-control luxury-filter-input"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            {/* Search Input */}
            <div className="col-lg-2 col-md-6">
              <label className="form-label fw-bold text-muted small mb-1">بحث برقم القيد أو البيان</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 luxury-filter-input"
                  placeholder="بحث سريع..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="col-lg-2 col-md-6 d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-3 px-3 d-flex align-items-center gap-2"
                onClick={handleResetFilters}
                title="إعادة تعيين الفلاتر"
              >
                <FontAwesomeIcon icon={faRotateRight} />
                <span>إعادة ضبط</span>
              </button>
              <button
                type="button"
                className="btn btn-primary rounded-3 px-3 d-flex align-items-center gap-2 shadow-sm"
                onClick={handlePrint}
                title="طباعة كشف الحساب"
              >
                <FontAwesomeIcon icon={faPrint} />
                <span>طباعة</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Account Info Banner if specific account is selected */}
        {statementData.account && (
          <div className="alert alert-primary-subtle border border-primary-subtle rounded-4 p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-primary text-white rounded-circle shadow-sm">
                <FontAwesomeIcon icon={faFileInvoiceDollar} className="fs-4" />
              </div>
              <div>
                <h5 className="fw-bold mb-1">
                  كشف حساب: {statementData.account.name} ({statementData.account.code})
                </h5>
                <span className="text-muted small">
                  طبيعة الحساب:{" "}
                  <strong>
                    {statementData.account.nature === "debit" ? "مدين (Debit)" : "دائن (Credit)"}
                  </strong>{" "}
                  | نوع الحساب: {statementData.account.account_type || "أصل / التزام"}
                </span>
              </div>
            </div>
            <span className="badge bg-primary px-3 py-2 rounded-pill fs-6">
              الرصيد الدفتري الحالي:{" "}
              {statementData.closing_balance.toLocaleString("ar-EG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              ج.م
            </span>
          </div>
        )}

        {/* Financial Summary Cards */}
        <div className="row g-3 mb-4 statement-summary-row">
          <div className="col-xl col-md-6 col-12">
            <div className="card border-0 rounded-4 shadow-sm p-3 bg-white h-100 border-start border-4 border-info">
              <span className="text-muted small d-block mb-1">الرصيد الافتتاحي (السابق)</span>
              <h4 className="fw-bold mb-0 text-dark">
                {statementData.opening_balance.toLocaleString("ar-EG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <small className="fs-6 text-muted">ج.م</small>
              </h4>
            </div>
          </div>

          <div className="col-xl col-md-6 col-12">
            <div className="card border-0 rounded-4 shadow-sm p-3 bg-white h-100 border-start border-4 border-success">
              <span className="text-muted small d-block mb-1">إجمالي الحركات المدينة (Debit)</span>
              <h4 className="fw-bold mb-0 text-success">
                <FontAwesomeIcon icon={faArrowTrendUp} className="ms-2 fs-6" />
                {statementData.total_debit.toLocaleString("ar-EG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <small className="fs-6 text-muted">ج.م</small>
              </h4>
            </div>
          </div>

          <div className="col-xl col-md-6 col-12">
            <div className="card border-0 rounded-4 shadow-sm p-3 bg-white h-100 border-start border-4 border-danger">
              <span className="text-muted small d-block mb-1">إجمالي الحركات الدائنة (Credit)</span>
              <h4 className="fw-bold mb-0 text-danger">
                <FontAwesomeIcon icon={faArrowTrendDown} className="ms-2 fs-6" />
                {statementData.total_credit.toLocaleString("ar-EG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <small className="fs-6 text-muted">ج.م</small>
              </h4>
            </div>
          </div>

          <div className="col-xl col-md-6 col-12">
            <div className="card border-0 rounded-4 shadow-sm p-3 bg-white h-100 border-start border-4 border-warning">
              <span className="text-muted small d-block mb-1">صافي حركة الفترة</span>
              <h4
                className={`fw-bold mb-0 ${
                  statementData.net_change >= 0 ? "text-primary" : "text-danger"
                }`}
              >
                {statementData.net_change.toLocaleString("ar-EG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <small className="fs-6 text-muted">ج.م</small>
              </h4>
            </div>
          </div>

          <div className="col-xl col-md-6 col-12">
            <div className="card border-0 rounded-4 shadow-sm p-3 bg-white h-100 border-start border-4 border-primary bg-primary-subtle">
              <span className="text-muted small d-block mb-1">الرصيد الختامي بعد الحركة</span>
              <h4 className="fw-bold mb-0 text-primary">
                {statementData.closing_balance.toLocaleString("ar-EG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <small className="fs-6 text-muted">ج.م</small>
              </h4>
            </div>
          </div>
        </div>

        {errorMsg && (
          <Alert variant="danger" className="rounded-3 shadow-sm mb-4">
            {errorMsg}
          </Alert>
        )}

        {/* Statement Data Table */}
        <div className="card border-0 rounded-4 shadow-sm overflow-hidden mb-4 bg-white">
          <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
            <div className="d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faScaleBalanced} className="text-primary" />
              <h6 className="fw-bold mb-0">جدول حركات وسجل كشف الحساب</h6>
            </div>
            <span className="badge bg-light text-muted border px-3 py-2 rounded-pill">
              عدد الحركات: {rows.length}
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 statement-table">
              <thead>
                <tr>
                  <th style={{ width: "4%", textAlign: "center" }}>م</th>
                  <th style={{ width: "12%" }}>رقم القيد</th>
                  <th style={{ width: "10%" }}>التاريخ</th>
                  <th style={{ width: "18%" }}>اسم الحساب</th>
                  <th style={{ width: "14%" }}>رقم الفاتورة / السند</th>
                  <th style={{ width: "20%" }}>البيان / الوصف</th>
                  <th style={{ width: "11%", textAlign: "center" }}>مدين (Debit)</th>
                  <th style={{ width: "11%", textAlign: "center" }}>دائن (Credit)</th>
                  <th style={{ width: "12%", textAlign: "center" }}>الرصيد التراكمي</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                      <p className="text-muted mt-2 mb-0">جاري تحميل حركات كشف الحساب...</p>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5 text-muted">
                      <FontAwesomeIcon icon={faFileInvoiceDollar} className="fs-1 mb-3 text-secondary opacity-50" />
                      <h5>لا توجد حركات محاسبية مسجلة لهذا الحساب أو الفترة المحددة.</h5>
                      <p className="small mb-0">يمكنك تعديل خيارات التصفية أو اختيار حساب آخر للاستعلام.</p>
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => (
                    <tr key={row.id || idx}>
                      <td className="text-center text-muted fw-bold">{row.index || idx + 1}</td>
                      <td>
                        <span className="badge bg-light text-dark border px-2 py-1 fw-bold font-monospace">
                          {row.numtranzaction || row.entry_number || `#${row.id}`}
                        </span>
                      </td>
                      <td className="text-nowrap">{row.date || "—"}</td>
                      <td className="fw-semibold text-primary">{row.account || row.name || "—"}</td>
                      <td>
                        <span className="badge bg-secondary-subtle text-secondary border px-2 py-1">
                          {row.invoisnum || row.invoicenumber || "—"}
                        </span>
                      </td>
                      <td>
                        <span className="text-truncate d-inline-block" style={{ maxWidth: "260px" }} title={row.description}>
                          {row.description || "—"}
                        </span>
                      </td>
                      <td className="text-center fw-bold text-success">
                        {parseFloat(row.debit) > 0
                          ? `${parseFloat(row.debit).toLocaleString("ar-EG", { minimumFractionDigits: 2 })} ج.م`
                          : "—"}
                      </td>
                      <td className="text-center fw-bold text-danger">
                        {parseFloat(row.credit) > 0
                          ? `${parseFloat(row.credit).toLocaleString("ar-EG", { minimumFractionDigits: 2 })} ج.م`
                          : "—"}
                      </td>
                      <td className="text-center fw-bold text-dark font-monospace bg-light">
                        {parseFloat(row.running_balance ?? row.balance ?? 0).toLocaleString("ar-EG", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        ج.م
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {rows.length > 0 && (
                <tfoot className="bg-light fw-bold">
                  <tr>
                    <td colSpan="6" className="text-center fs-6">
                      الإجمالي الكلي لحركات الفترة
                    </td>
                    <td className="text-center text-success fs-6">
                      {statementData.total_debit.toLocaleString("ar-EG", { minimumFractionDigits: 2 })} ج.م
                    </td>
                    <td className="text-center text-danger fs-6">
                      {statementData.total_credit.toLocaleString("ar-EG", { minimumFractionDigits: 2 })} ج.م
                    </td>
                    <td className="text-center text-primary fs-6">
                      {statementData.closing_balance.toLocaleString("ar-EG", { minimumFractionDigits: 2 })} ج.م
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountsStatement;
