import React, { useState, useEffect } from "react";
import "./balanceSheet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleDown, faPrint, faScaleBalanced } from "@fortawesome/free-solid-svg-icons";
import API from "../../../../api/axiosConfig";
import Title from "../../../../components/title";
import { Spinner } from "react-bootstrap";

function IncomeStatement() {
  const [isRevenueOpen, setIsRevenueOpen] = useState(true);
  const [isExpensesOpen, setIsExpensesOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split("T")[0]);
  const [report, setReport] = useState({
    organization_name: "جمعية خيرية",
    revenues: [],
    expenses: [],
    total_revenues: 0,
    total_expenses: 0,
    net_surplus: 0,
  });

  const fetchIncomeStatement = async (dateVal) => {
    setLoading(true);
    try {
      const res = await API.get("/reports/incomestatement", {
        params: { date: dateVal || asOfDate },
      });
      const payload = res.data?.data || res.data || {};
      setReport({
        organization_name: payload.organization_name || "جمعية خيرية",
        revenues: Array.isArray(payload.revenues) ? payload.revenues : [],
        expenses: Array.isArray(payload.expenses) ? payload.expenses : [],
        total_revenues: Number(payload.total_revenues || 0),
        total_expenses: Number(payload.total_expenses || 0),
        net_surplus: Number(payload.net_surplus || 0),
      });
    } catch (err) {
      console.error("Error fetching income statement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeStatement(asOfDate);
  }, [asOfDate]);

  const formatNum = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="balance-sheet-container" dir="rtl">
      <div className="d-flex justify-content-between align-items-center mb-3 no-print">
        <Title title="قائمة الأنشطة (الإيرادات والمصروفات)" icon={<FontAwesomeIcon icon={faScaleBalanced} />} />
        <div className="d-flex align-items-center gap-2">
          <input
            type="date"
            className="custom-datepicker"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
          />
          <button className="btn btn-outline-secondary" onClick={() => window.print()}>
            <FontAwesomeIcon icon={faPrint} className="ms-1" /> طباعة
          </button>
        </div>
      </div>

      <p>جمعية (<span>{report.organization_name}</span>) الخيرية</p>
      <p>تحت إشراف المركز الوطني لتنمية القطاع غير الربحي</p>
      <p>قائمة الأنشطة عن الفترة المنتهية في (<span>{asOfDate}</span>) (المبالغ بالريال السعودي)</p>

      <div className="report-header">
        <h2>قائمة الأنشطة</h2>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <div className="section">
            <h3 className="section-titleRepo" onClick={() => setIsRevenueOpen(!isRevenueOpen)}>
              الإيرادات والتبرعات
              <span className={`arrow ${isRevenueOpen ? "open" : ""}`}>
                <FontAwesomeIcon icon={faArrowCircleDown} />
              </span>
            </h3>
            {isRevenueOpen && (
              <div className="section-contentRepo">
                {report.revenues.length > 0 ? (
                  report.revenues.map((item) => (
                    <div className="report-item" key={item.id || item.code}>
                      <span>{item.code} - {item.name}</span>
                      <span>{formatNum(item.balance)}</span>
                    </div>
                  ))
                ) : (
                  <div className="report-item">
                    <span>التبرعات والإيرادات العامة</span>
                    <span>0.00</span>
                  </div>
                )}
                <div className="total-section sub-total">
                  <div className="report-item">
                    <span>إجمالي الإيرادات والتبرعات</span>
                    <span>{formatNum(report.total_revenues)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="section">
            <h3 className="section-titleRepo" onClick={() => setIsExpensesOpen(!isExpensesOpen)}>
              المصروفات والمساعدات
              <span className={`arrow ${isExpensesOpen ? "open" : ""}`}>
                <FontAwesomeIcon icon={faArrowCircleDown} />
              </span>
            </h3>
            {isExpensesOpen && (
              <div className="section-contentRepo">
                {report.expenses.length > 0 ? (
                  report.expenses.map((item) => (
                    <div className="report-item" key={item.id || item.code}>
                      <span>{item.code} - {item.name}</span>
                      <span>{formatNum(item.balance)}</span>
                    </div>
                  ))
                ) : (
                  <div className="report-item">
                    <span>المصروفات العمومية والبرامج</span>
                    <span>0.00</span>
                  </div>
                )}

                <div className="total-section sub-total">
                  <div className="report-item">
                    <span>إجمالي المصروفات والمساعدات</span>
                    <span>{formatNum(report.total_expenses)}</span>
                  </div>
                </div>

                <div className="total-section">
                  <div className="report-item">
                    <span>فائض / (عجز) الفترة (التغير في صافي الأصول)</span>
                    <span>{formatNum(report.net_surplus)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default IncomeStatement;
