import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTable,
  faArrowRight,
  faScaleBalanced,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import API from "../../../api/axiosConfig";
import Title from "../../../components/title";
import TestPreLoader from "../../TestPreLoader/TestPreLoader";
import RegisterTextbox from "../../../components/RegisterTextBox";

function AccountingEntryView() {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await API.get(`/transactions/${id}`);
        const data = response.data;
        setEntry(data);
      } catch (error) {
        console.error("Error fetching entry:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  if (loading) {
    return (
      <div style={{ height: "100vh" }}>
        <TestPreLoader />
      </div>
    );
  }

  // Derive lines: if lines array exists, use it; otherwise fallback to debitaccount/creditaccount
  const lines =
    entry?.lines && entry.lines.length > 0
      ? entry.lines
      : [
          ...(entry?.debitaccount
            ? [
                {
                  id: "legacy-debit",
                  account_name: entry.debitaccount.name,
                  account_number: entry.debitaccount.code,
                  debit: entry.debt_amount || entry.total_debit || 0,
                  credit: 0,
                  description: entry.description || "",
                },
              ]
            : []),
          ...(entry?.creditaccount
            ? [
                {
                  id: "legacy-credit",
                  account_name: entry.creditaccount.name,
                  account_number: entry.creditaccount.code,
                  debit: 0,
                  credit: entry.credit_amount || entry.total_credit || 0,
                  description: entry.description || "",
                },
              ]
            : []),
        ];

  const totalDebit = lines.reduce((acc, l) => acc + (parseFloat(l.debit) || 0), 0);
  const totalCredit = lines.reduce((acc, l) => acc + (parseFloat(l.credit) || 0), 0);

  return (
    <div className="container py-4" style={{ direction: "rtl" }}>
      {/* Header & Back Button */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <Title
          title={`تفاصيل القيد المحاسبي (${entry?.entry_number || entry?.registration_number || `#${id}`})`}
          icon={<FontAwesomeIcon icon={faScaleBalanced} />}
        />
        <button
          className="btn btn-outline-secondary rounded-pill px-4"
          onClick={() => navigate("/accountingEntry")}
        >
          <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
          العودة لقائمة القيود
        </button>
      </div>

      {/* Entry Meta Information */}
      <div className="card shadow-sm border-0 rounded-4 mb-4 p-4" style={{ backgroundColor: "#faf8f5" }}>
        <div className="row g-3">
          <div className="col-md-3">
            <RegisterTextbox
              label="رقم القيد"
              value={entry?.entry_number || entry?.registration_number || `#${id}`}
              disabled={true}
              type="text"
            />
          </div>
          <div className="col-md-3">
            <RegisterTextbox
              label="تاريخ القيد"
              value={entry?.date || "—"}
              disabled={true}
              type="text"
            />
          </div>
          <div className="col-md-3">
            <RegisterTextbox
              label="الحالة"
              value={entry?.status_label || (entry?.status === "posted" ? "مرحل" : "مسودة")}
              disabled={true}
              type="text"
            />
          </div>
          <div className="col-md-3">
            <RegisterTextbox
              label="البيان العام"
              value={entry?.description || "—"}
              disabled={true}
              type="text"
            />
          </div>
        </div>
      </div>

      {/* Lines Table */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle mb-0" style={{ direction: "rtl" }}>
            <thead style={{ backgroundColor: "#f4ecdf" }}>
              <tr>
                <th style={{ width: "8%", textAlign: "center" }}>#</th>
                <th style={{ width: "22%" }}>رقم الحساب</th>
                <th style={{ width: "30%" }}>اسم الحساب</th>
                <th style={{ width: "20%", textAlign: "center" }}>مدين (Debit)</th>
                <th style={{ width: "20%", textAlign: "center" }}>دائن (Credit)</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, idx) => (
                <tr key={line.id || idx}>
                  <td className="text-center fw-bold text-muted">{idx + 1}</td>
                  <td className="fw-bold">{line.account_number || line.account?.code || "—"}</td>
                  <td>{line.account_name || line.account?.name || "—"}</td>
                  <td className="text-center fw-bold" style={{ color: line.debit > 0 ? "#198754" : "inherit" }}>
                    {line.debit > 0
                      ? `${parseFloat(line.debit).toLocaleString("ar-EG", { minimumFractionDigits: 2 })} ج.م`
                      : "—"}
                  </td>
                  <td className="text-center fw-bold" style={{ color: line.credit > 0 ? "#0d6efd" : "inherit" }}>
                    {line.credit > 0
                      ? `${parseFloat(line.credit).toLocaleString("ar-EG", { minimumFractionDigits: 2 })} ج.م`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot style={{ backgroundColor: "#fbf9f6" }}>
              <tr className="fw-bold fs-6">
                <td colSpan="3" className="text-center">الإجمالي الكلي</td>
                <td className="text-center text-success">
                  {totalDebit.toLocaleString("ar-EG", { minimumFractionDigits: 2 })} ج.م
                </td>
                <td className="text-center text-primary">
                  {totalCredit.toLocaleString("ar-EG", { minimumFractionDigits: 2 })} ج.م
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Balance Indicator */}
      <div className="alert alert-success d-flex align-items-center justify-content-between rounded-4 p-3 shadow-sm">
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faCheckCircle} className="ms-2 fs-4 text-success" />
          <span className="fw-bold">القيد المحاسبي متوازن ومرحل بدفتر اليومية العامة بنجاح.</span>
        </div>
        <span className="badge bg-success px-3 py-2 rounded-pill">
          إجمالي الحركة: {totalDebit.toLocaleString("ar-EG", { minimumFractionDigits: 2 })} ج.م
        </span>
      </div>
    </div>
  );
}

export default AccountingEntryView;