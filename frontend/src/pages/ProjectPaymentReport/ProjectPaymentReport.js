import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoiceDollar,
  faCoins,
  faMoneyBillWave,
  faReceipt,
  faChartPie,
  faArrowUpRightFromSquare,
  faPlus,
  faFilter,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosConfig";
import TableComponent from "../../components/TableComponent";
import { toLocal } from "../../Utils/toLocal";
import PaymentVoucherProject from "../PaymentVoucher/PaymentVoucherProject";
import "./ProjectPaymentReport.css";

function ProjectPaymentReport() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_projects: 0,
    total_budget: 0,
    total_paid: 0,
    total_remaining: 0,
    total_vouchers: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());

  // Filter by project state
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("");
  const [projectsList, setProjectsList] = useState([]);

  // Modal State for Payment Voucher
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await API.get("/projects");
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setProjectsList(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to load projects for filter:", err);
      }
    };
    loadProjects();
  }, []);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const params = selectedProjectFilter ? { id: selectedProjectFilter } : {};
      const res = await API.get("/projectpaymentreport/stats", { params });
      if (res.data?.data) {
        setStats(res.data.data);
      } else if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Failed to load project payment stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [tableReloadKey, selectedProjectFilter]);

  const columns = [
    { name: "اسم المشروع", key: "name" },
    { name: "الميزانية المعتمدة", key: "budget" },
    { name: "إجمالي المدفوع", key: "paid_amount" },
    { name: "المتبقي", key: "remaining" },
    { name: "نسبة الصرف", key: "paid_percentage" },
    { name: "عدد السندات", key: "vouchers_count" },
    { name: "حالة المشروع", key: "statusstring" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions = [
    {
      label: "سندات ومدفوعات المشروع",
      action: (id) => {
        navigate(`/projectdetailsview/${id}?tab=financials&filter=payments`);
      },
    },
    {
      label: "تفاصيل المشروع الشاملة",
      action: (id) => {
        navigate(`/projectdetailsview/${id}`);
      },
    },
  ];

  const modifyRow = (row) => {
    const percentage = Number(row.paid_percentage || 0);
    const progressColor =
      percentage >= 90 ? "#e11d48" : percentage >= 50 ? "#f59e0b" : "#10b981";

    let statusBadge =
      '<span style="background: rgba(2, 132, 199, 0.12); color: #0284c7; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; display: inline-block;">قيد التنفيذ</span>';
    if (row.status === 2) {
      statusBadge =
        '<span style="background: rgba(22, 163, 74, 0.12); color: #16a34a; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; display: inline-block;">مكتمل</span>';
    } else if (row.status === 3) {
      statusBadge =
        '<span style="background: rgba(220, 38, 38, 0.12); color: #dc2626; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; display: inline-block;">ملغي</span>';
    }

    const percentageHtml = `
      <div style="display: flex; align-items: center; gap: 8px; min-width: 110px;">
        <div style="flex: 1; height: 7px; background-color: rgba(0,0,0,0.08); border-radius: 4px; overflow: hidden;">
          <div style="width: ${Math.min(100, percentage)}%; height: 100%; background-color: ${progressColor}; border-radius: 4px;"></div>
        </div>
        <span style="font-size: 12px; font-weight: 700; color: ${progressColor};">${percentage}%</span>
      </div>
    `;

    const vouchersHtml = `
      <span style="display: inline-block; padding: 2px 8px; background: rgba(194, 154, 100, 0.15); border-radius: 6px; font-weight: 700; color: #c29a64;">
        ${row.vouchers_count || 0}
      </span>
    `;

    return {
      ...row,
      budget: `<span style="font-weight: 600;">${toLocal(row.budget || 0)} ر.س</span>`,
      paid_amount: `<span style="font-weight: 700; color: #b45309;">${toLocal(row.paid_amount || 0)} ر.س</span>`,
      remaining: `<span style="font-weight: 600; color: #047857;">${toLocal(row.remaining || 0)} ر.س</span>`,
      paid_percentage: percentageHtml,
      vouchers_count: vouchersHtml,
      statusstring: statusBadge,
    };
  };

  return (
    <div className="project-payment-report-wrapper">
      {/* ── KPI Summary Cards ─────────────────────────────────────── */}
      <div className="payment-report-stats-grid">
        <div className="payment-stat-card card-budget">
          <div className="stat-icon-wrapper icon-budget">
            <FontAwesomeIcon icon={faCoins} />
          </div>
          <div className="stat-content">
            <span className="stat-label">إجمالي ميزانيات المشاريع</span>
            <h3 className="stat-value">
              {loadingStats ? "..." : `${toLocal(stats.total_budget || 0)} ر.س`}
            </h3>
            <span className="stat-sub">{stats.total_projects || 0} مشاريع معتمدة</span>
          </div>
        </div>

        <div className="payment-stat-card card-paid">
          <div className="stat-icon-wrapper icon-paid">
            <FontAwesomeIcon icon={faMoneyBillWave} />
          </div>
          <div className="stat-content">
            <span className="stat-label">إجمالي المصروف / المدفوع</span>
            <h3 className="stat-value text-amber">
              {loadingStats ? "..." : `${toLocal(stats.total_paid || 0)} ر.س`}
            </h3>
            <span className="stat-sub">{stats.total_vouchers || 0} سندات صرف منفذة</span>
          </div>
        </div>

        <div className="payment-stat-card card-remaining">
          <div className="stat-icon-wrapper icon-remaining">
            <FontAwesomeIcon icon={faReceipt} />
          </div>
          <div className="stat-content">
            <span className="stat-label">المتبقي من الميزانيات</span>
            <h3 className="stat-value text-emerald">
              {loadingStats ? "..." : `${toLocal(stats.total_remaining || 0)} ر.س`}
            </h3>
            <span className="stat-sub">رصيد متاح للصرف</span>
          </div>
        </div>

        <div className="payment-stat-card card-percentage">
          <div className="stat-icon-wrapper icon-percentage">
            <FontAwesomeIcon icon={faChartPie} />
          </div>
          <div className="stat-content">
            <span className="stat-label">متوسط نسبة الصرف</span>
            <h3 className="stat-value">
              {loadingStats
                ? "..."
                : `${
                    stats.total_budget > 0
                      ? Math.round((stats.total_paid / stats.total_budget) * 100)
                      : 0
                  }%`}
            </h3>
            <span className="stat-sub">من إجمالي المخصص المالي</span>
          </div>
        </div>
      </div>

      {/* ── Project Filter Bar ───────────────────────────────────── */}
      <div className="payment-report-filter-bar mb-3 p-3 bg-white rounded-3 shadow-sm border d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="fw-bold small text-muted d-flex align-items-center gap-1">
            <FontAwesomeIcon icon={faFilter} className="text-warning" />
            فلترة التقرير حسب المشروع:
          </span>
          <select
            className="form-select project-filter-select"
            value={selectedProjectFilter}
            onChange={(e) => {
              setSelectedProjectFilter(e.target.value);
              setTableReloadKey(Date.now());
            }}
            style={{
              minWidth: "260px",
              height: "40px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <option value="">جميع المشاريع (عرض الكل)</option>
            {projectsList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {selectedProjectFilter && (
            <button
              type="button"
              className="btn btn-outline-secondary d-flex align-items-center gap-1"
              onClick={() => {
                setSelectedProjectFilter("");
                setTableReloadKey(Date.now());
              }}
              style={{ height: "40px", borderRadius: "8px", fontWeight: "600" }}
            >
              <FontAwesomeIcon icon={faRotateLeft} />
              إلغاء الفلترة
            </button>
          )}
        </div>

        {selectedProjectFilter && (
          <span className="badge bg-warning text-dark px-3 py-2" style={{ fontSize: "12px" }}>
            يتم عرض بيانات المشروع المحدد فقط
          </span>
        )}
      </div>

      {/* ── Main Table ───────────────────────────────────────────── */}
      <div className="printcasedata-container">
        <TableComponent
          apiUrl="/projectpaymentreport"
          id={selectedProjectFilter || ""}
          columns={columns}
          title="تقرير مدفوعات المشاريع"
          titleIcon={<FontAwesomeIcon icon={faFileInvoiceDollar} />}
          dropdownOptions={dropdownOptions}
          transformRowFn={modifyRow}
          searchTextProp={true}
          searchDate={true}
          triggerReload={tableReloadKey}
          addBtn={true}
          addBtnName="إصدار سند صرف لمشروع"
          onAddClick={() => {
            setSelectedProjectId(null);
            setShowVoucherModal(true);
          }}
        />
      </div>

      {/* ── Modal for issuing project payment voucher ────────────── */}
      <PaymentVoucherProject
        show={showVoucherModal}
        onHide={() => {
          setShowVoucherModal(false);
          setSelectedProjectId(null);
        }}
        projectId={selectedProjectId}
        onSuccess={() => {
          setShowVoucherModal(false);
          setSelectedProjectId(null);
          setTableReloadKey(Date.now());
        }}
      />
    </div>
  );
}

export default ProjectPaymentReport;
