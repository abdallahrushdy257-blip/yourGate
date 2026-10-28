import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axiosConfig";
import { toLocal } from "../../Utils/toLocal";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import {
  Tab,
  Nav,
  ProgressBar,
  Badge,
  Button,
  Dropdown,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faFolderOpen,
  faCoins,
  faReceipt,
  faMoneyBillWave,
  faHandHoldingHeart,
  faTriangleExclamation,
  faLayerGroup,
  faUsers,
  faChartLine,
  faShieldHalved,
  faPaperclip,
  faPenToSquare,
  faClock,
  faExternalLinkAlt,
  faCircleCheck,
  faInbox,
  faEllipsisVertical,
  faBan,
  faRotateRight,
  faPlus,
  faPercent,
  faEye,
  faFileContract,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "./ProjectDetailsView.css";

export default function ProjectDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Progress Modal
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressPct, setProgressPct] = useState(0);

  // Financial Filter
  const [financialFilter, setFinancialFilter] = useState("all"); // all, receipts, payments

  const fetchProjectDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await API.get(`/projects/${id}`);
      const data = res.data?.data || res.data || null;
      setProject(data);
    } catch (err) {
      console.error("Error fetching project details:", err);
      toast.error("فشل في تحميل تفاصيل المشروع");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  // Project Status Toggle (Cancel / Activate)
  const handleToggleStatus = async (action) => {
    try {
      const endpoint = action === "cancel" ? `/projects/${id}/cancel` : `/projects/${id}/activate`;
      const res = await API.get(endpoint);
      if (res.status === 200) {
        toast.success(action === "cancel" ? "تم إلغاء المشروع" : "تم تفعيل المشروع بنجاح");
        fetchProjectDetails();
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تغيير حالة المشروع");
    }
  };

  const handleOpenProgressModal = async () => {
    setShowProgressModal(true);
    try {
      const res = await API.get(`/projectprogress/${id}/percentage`);
      const pct = res.data?.percentage !== undefined ? res.data.percentage : 0;
      setProgressPct(pct);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <TestPreLoader />;

  if (!project) {
    return (
      <div className="project-view-page text-center py-5">
        <h4 className="text-muted">لم يتم العثور على المشروع</h4>
        <Button
          variant="outline-primary"
          className="mt-3"
          onClick={() => navigate("/projectStatus")}
        >
          <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
          العودة لقائمة المشاريع
        </Button>
      </div>
    );
  }

  // Financial calculations
  const total = parseFloat(project.budget || project.total || 0);
  const collected = parseFloat(project.amount || 0);
  const paid = parseFloat(project.paid_amount || project.total_paid || 0);
  const availableBalance = parseFloat(
    project.net_balance !== undefined ? project.net_balance : (collected - paid)
  );
  const remaining = parseFloat(
    project.remaining !== undefined ? project.remaining : Math.max(0, total - collected)
  );
  const pct = Math.round(
    project.percentage !== undefined ? project.percentage : (total > 0 ? (collected / total) * 100 : 0)
  );

  const phases = project.phases || [];
  const assignments = project.assignments || [];
  const kpis = project.kpis || [];
  const risks = project.risks || [];
  const uploads = project.uploads || [];
  const transactions = project.transactions || [];

  const filteredTransactions = transactions.filter((t) => {
    if (financialFilter === "receipts") return parseInt(t.transaction_type) === 1;
    if (financialFilter === "payments") return parseInt(t.transaction_type) === 2;
    return true;
  });

  const getStatusBadge = (status) => {
    switch (parseInt(status)) {
      case 2:
        return <Badge bg="success" className="px-3 py-2 fs-6">مكتمل</Badge>;
      case 3:
        return <Badge bg="danger" className="px-3 py-2 fs-6">ملغي</Badge>;
      default:
        return <Badge bg="warning" text="dark" className="px-3 py-2 fs-6">قيد التنفيذ</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (String(priority)) {
      case "1":
        return <Badge bg="info">منخفض</Badge>;
      case "3":
        return <Badge bg="warning" text="dark">مرتفع</Badge>;
      case "4":
        return <Badge bg="danger">عاجل</Badge>;
      default:
        return <Badge bg="secondary">متوسط</Badge>;
    }
  };

  return (
    <div className="project-view-page">
      {/* ── Top Header ────────────────────────────────────────── */}
      <div className="project-view-header">
        <div className="project-view-header-right">
          <button
            className="project-back-btn"
            onClick={() => navigate("/projectStatus")}
            title="رجوع لقائمة المشاريع"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <div className="project-header-info">
            <h2>
              {project.name || project.title}
              <span className="badge bg-light text-dark border fs-6">
                #{project.id}
              </span>
              {getStatusBadge(project.status)}
            </h2>
            <div className="project-header-subtitle">
              تاريخ الإطلاق: {project.startdate || project.dateoflaunch || "-"} &nbsp;|&nbsp;
              الموعد النهائي: {project.deadline || "-"}
            </div>
          </div>
        </div>

        {/* ── Direct Actions Bar ───────────────────────────────── */}
        <div className="project-view-header-left">
          <Button
            variant="outline-danger"
            className="project-action-btn"
            onClick={() => navigate(`/paymentvoucherproject/${project.id}`)}
          >
            <FontAwesomeIcon icon={faMoneyBillWave} />
            سند صرف
          </Button>

          <Button
            variant="outline-success"
            className="project-action-btn"
            onClick={() => navigate(`/receiptvoucherproject/${project.id}`)}
          >
            <FontAwesomeIcon icon={faHandHoldingHeart} />
            سند قبض / تبرع
          </Button>

          <Button
            variant="outline-secondary"
            className="project-action-btn"
            onClick={() => navigate(`/riskassessmentreport/${project.id}`)}
          >
            <FontAwesomeIcon icon={faShieldHalved} />
            تقرير المخاطر
          </Button>

          {/* All Actions Dropdown Menu */}
          <Dropdown className="d-inline-block">
            <Dropdown.Toggle
              variant="primary"
              className="project-action-btn"
              id="project-actions-dropdown"
            >
              <FontAwesomeIcon icon={faEllipsisVertical} className="ms-1" />
              إجراءات المشروع
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" style={{ minWidth: "220px", boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}>
              <Dropdown.Header className="fw-bold text-muted">إدارة المشروع</Dropdown.Header>
              <Dropdown.Item onClick={() => navigate(`/projectdetails/${project.id}`)}>
                <FontAwesomeIcon icon={faLayerGroup} className="ms-2 text-primary" />
                مراحل المشروع
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate(`/projectmembers/${project.id}`)}>
                <FontAwesomeIcon icon={faUsers} className="ms-2 text-info" />
                أعضاء المشروع
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate(`/projectkpiview/${project.id}`)}>
                <FontAwesomeIcon icon={faChartLine} className="ms-2 text-success" />
                مؤشرات الأداء
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate(`/projectattachments/${project.id}`)}>
                <FontAwesomeIcon icon={faPaperclip} className="ms-2 text-secondary" />
                المرفقات والوثائق
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate(`/projectrisks/${project.id}`)}>
                <FontAwesomeIcon icon={faTriangleExclamation} className="ms-2 text-warning" />
                سجل المخاطر
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate(`/riskassessmentreport/${project.id}`)}>
                <FontAwesomeIcon icon={faShieldHalved} className="ms-2 text-danger" />
                تقرير تقييم المخاطر
              </Dropdown.Item>

              <Dropdown.Divider />
              <Dropdown.Header className="fw-bold text-muted">المالية والسندات</Dropdown.Header>
              <Dropdown.Item onClick={() => navigate(`/paymentvoucherproject/${project.id}`)}>
                <FontAwesomeIcon icon={faMoneyBillWave} className="ms-2 text-danger" />
                إنشاء سند صرف
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate(`/receiptvoucherproject/${project.id}`)}>
                <FontAwesomeIcon icon={faReceipt} className="ms-2 text-success" />
                إنشاء سند قبض / تبرع
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate(`/projectpaymentvouchers/${project.id}`)}>
                <FontAwesomeIcon icon={faFileContract} className="ms-2 text-primary" />
                عرض سندات الدفع
              </Dropdown.Item>

              <Dropdown.Divider />
              <Dropdown.Header className="fw-bold text-muted">العمليات والتحكم</Dropdown.Header>
              <Dropdown.Item onClick={handleOpenProgressModal}>
                <FontAwesomeIcon icon={faPercent} className="ms-2 text-info" />
                نسبة الإنجاز
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate(`/editproject/${project.id}`)}>
                <FontAwesomeIcon icon={faPenToSquare} className="ms-2 text-warning" />
                تعديل المشروع
              </Dropdown.Item>
              {project.status === 3 ? (
                <Dropdown.Item onClick={() => handleToggleStatus("activate")} className="text-success">
                  <FontAwesomeIcon icon={faRotateRight} className="ms-2" />
                  تفعيل المشروع
                </Dropdown.Item>
              ) : (
                <Dropdown.Item onClick={() => handleToggleStatus("cancel")} className="text-danger">
                  <FontAwesomeIcon icon={faBan} className="ms-2" />
                  إلغاء المشروع
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* ── Hero KPI Cards Grid ────────────────────────────────── */}
      <div className="project-view-kpi-grid">
        <div className="project-view-kpi-card kpi-gold">
          <div>
            <div className="project-kpi-label">ميزانية المشروع المستهدفة</div>
            <div className="project-kpi-value text-dark">{toLocal(total)} ر.س</div>
          </div>
          <div className="project-view-kpi-icon">
            <FontAwesomeIcon icon={faCoins} />
          </div>
        </div>

        <div className="project-view-kpi-card kpi-green">
          <div>
            <div className="project-kpi-label">إجمالي التبرعات المحصلة</div>
            <div className="project-kpi-value text-success">{toLocal(collected)} ر.س</div>
          </div>
          <div className="project-view-kpi-icon">
            <FontAwesomeIcon icon={faReceipt} />
          </div>
        </div>

        <div className="project-view-kpi-card kpi-danger">
          <div>
            <div className="project-kpi-label">إجمالي المصروفات المنفذة</div>
            <div className="project-kpi-value text-danger">{toLocal(paid)} ر.س</div>
          </div>
          <div className="project-view-kpi-icon">
            <FontAwesomeIcon icon={faMoneyBillWave} />
          </div>
        </div>

        <div className="project-view-kpi-card kpi-blue">
          <div>
            <div className="project-kpi-label">الرصيد المتاح للصرف</div>
            <div className="project-kpi-value text-primary">{toLocal(availableBalance)} ر.س</div>
          </div>
          <div className="project-view-kpi-icon">
            <FontAwesomeIcon icon={faHandHoldingHeart} />
          </div>
        </div>

        <div className="project-view-kpi-card kpi-purple">
          <div>
            <div className="project-kpi-label">المتبقي لاكتمال الميزانية</div>
            <div className="project-kpi-value text-warning">{toLocal(remaining)} ر.س</div>
          </div>
          <div className="project-view-kpi-icon">
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </div>
        </div>
      </div>

      {/* ── Progress Bar Box ───────────────────────────────────── */}
      <div className="project-view-progress-box">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold" style={{ fontSize: "14px" }}>
            نسبة إنجاز المشروع: <strong>{pct}%</strong>
          </span>
          <span className="text-muted" style={{ fontSize: "13px" }}>
            تم تحصيل {toLocal(collected)} ر.س من أصل {toLocal(total)} ر.س
          </span>
        </div>
        <ProgressBar
          now={pct}
          variant={pct >= 100 ? "success" : pct > 50 ? "info" : "warning"}
          style={{ height: "14px", borderRadius: "10px" }}
        />
      </div>

      {/* ── Tabs Container ─────────────────────────────────────── */}
      <div className="project-tabs-container">
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="overview">
                <FontAwesomeIcon icon={faFolderOpen} />
                البيانات الأساسية
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="phases">
                <FontAwesomeIcon icon={faLayerGroup} />
                مراحل المشروع ({phases.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="members">
                <FontAwesomeIcon icon={faUsers} />
                فريق العمل والمسؤولين ({assignments.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="kpis">
                <FontAwesomeIcon icon={faChartLine} />
                مؤشرات الأداء ({kpis.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="risks">
                <FontAwesomeIcon icon={faShieldHalved} />
                سجل المخاطر ({risks.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="financials">
                <FontAwesomeIcon icon={faMoneyBillWave} />
                الحركات المالية ({transactions.length})
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="attachments">
                <FontAwesomeIcon icon={faPaperclip} />
                المرفقات والوثائق ({uploads.length})
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <div className="project-tabs-content">
            <Tab.Content>
              {/* 1. OVERVIEW TAB */}
              <Tab.Pane eventKey="overview">
                <div className="project-overview-grid">
                  <div className="project-info-card">
                    <h4>
                      <FontAwesomeIcon icon={faFolderOpen} className="text-warning ms-2" />
                      معلومات المشروع
                    </h4>
                    <div className="project-info-row">
                      <span className="label">اسم المشروع:</span>
                      <span className="val fw-bold">{project.name || project.title}</span>
                    </div>
                    <div className="project-info-row">
                      <span className="label">تاريخ الإطلاق:</span>
                      <span className="val">{project.startdate || project.dateoflaunch || "-"}</span>
                    </div>
                    <div className="project-info-row">
                      <span className="label">الموعد النهائي:</span>
                      <span className="val">{project.deadline || "-"}</span>
                    </div>
                    <div className="project-info-row">
                      <span className="label">طريقة التسويق:</span>
                      <span className="val badge bg-light text-dark border">
                        {project.marketingmethodstring || "غير محدد"}
                      </span>
                    </div>
                    <div className="project-info-row">
                      <span className="label">شجرة الحسابات:</span>
                      <span className="val">{project.accounttree || "-"}</span>
                    </div>
                    <div className="project-info-row">
                      <span className="label">الحالة الحالية:</span>
                      <span className="val">{getStatusBadge(project.status)}</span>
                    </div>
                  </div>

                  <div className="project-info-card">
                    <h4>
                      <FontAwesomeIcon icon={faChartLine} className="text-success ms-2" />
                      مؤشرات الإنجاز والتنفيذ
                    </h4>
                    <div className="project-info-row">
                      <span className="label">نسبة الإنجاز المالي:</span>
                      <span className="val fw-bold text-success">{pct}%</span>
                    </div>
                    <div className="project-info-row">
                      <span className="label">عدد المراحل المكتملة:</span>
                      <span className="val badge bg-success">
                        {phases.filter((p) => p.status === 2).length} من {phases.length}
                      </span>
                    </div>
                    <div className="project-info-row">
                      <span className="label">عدد أعضاء الفريق:</span>
                      <span className="val badge bg-secondary">{assignments.length}</span>
                    </div>
                    <div className="project-info-row">
                      <span className="label">مؤشرات الأداء المسجلة:</span>
                      <span className="val badge bg-secondary">{kpis.length}</span>
                    </div>
                    <div className="project-info-row">
                      <span className="label">المخاطر المرصودة:</span>
                      <span className="val badge bg-secondary">{risks.length}</span>
                    </div>
                    <div className="project-info-row">
                      <span className="label">عدد الحركات المالية:</span>
                      <span className="val badge bg-secondary">{transactions.length}</span>
                    </div>
                  </div>
                </div>

                {project.description && (
                  <div className="project-info-card mt-3">
                    <h4>وصف ومستهدفات المشروع</h4>
                    <p className="text-muted m-0" style={{ lineHeight: "1.8" }}>
                      {project.description}
                    </p>
                  </div>
                )}
              </Tab.Pane>

              {/* 2. PHASES TAB */}
              <Tab.Pane eventKey="phases">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="m-0 fw-bold">مراحل وخطوات تنفيذ المشروع</h5>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(`/projectdetails/${project.id}`)}
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-1" />
                    إدارة وإضافة المراحل
                  </Button>
                </div>
                {phases.length === 0 ? (
                  <div className="empty-tab-state">
                    <FontAwesomeIcon icon={faInbox} className="icon" />
                    <div>لا توجد مراحل مسجلة لهذا المشروع حتى الآن</div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-2"
                      onClick={() => navigate(`/projectdetails/${project.id}`)}
                    >
                      <FontAwesomeIcon icon={faPlus} className="ms-1" />
                      إضافة المرحلة الأولى
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="project-sub-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>اسم المرحلة</th>
                          <th>تاريخ البدء</th>
                          <th>تاريخ الانتهاء</th>
                          <th>الأولوية</th>
                          <th>الميزانية</th>
                          <th>الحالة</th>
                          <th>ملخص الأداء</th>
                          <th>العمل المتبقي</th>
                          <th>ملاحظات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {phases.map((p, idx) => (
                          <tr key={p.id || idx}>
                            <td>{idx + 1}</td>
                            <td className="fw-bold">{p.name}</td>
                            <td>{p.start_date || "-"}</td>
                            <td>{p.end_date || "-"}</td>
                            <td>{getPriorityBadge(p.priority)}</td>
                            <td>{toLocal(p.budget)} ر.س</td>
                            <td>{getStatusBadge(p.status)}</td>
                            <td>{p.performance_summary || "-"}</td>
                            <td>{p.remaining_work || "-"}</td>
                            <td>{p.notes || p.description || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Tab.Pane>

              {/* 3. MEMBERS TAB */}
              <Tab.Pane eventKey="members">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="m-0 fw-bold">فريق العمل والمسؤولين</h5>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(`/projectmembers/${project.id}`)}
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-1" />
                    إدارة المسؤولين
                  </Button>
                </div>
                {assignments.length === 0 ? (
                  <div className="empty-tab-state">
                    <FontAwesomeIcon icon={faInbox} className="icon" />
                    <div>لم يتم تعيين أي مسؤولين للمشروع بعد</div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-2"
                      onClick={() => navigate(`/projectmembers/${project.id}`)}
                    >
                      <FontAwesomeIcon icon={faPlus} className="ms-1" />
                      تعيين أعضاء الفريق
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="project-sub-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>اسم المسؤول</th>
                          <th>النوع</th>
                          <th>المرحلة المعين عليها</th>
                          <th>الدور والمهمة</th>
                          <th>تاريخ التعيين</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignments.map((m, idx) => (
                          <tr key={m.id || idx}>
                            <td>{idx + 1}</td>
                            <td className="fw-bold">{m.user_name || m.name || `مسؤول #${m.user_id}`}</td>
                            <td>
                              <Badge bg={m.type === "volunteer" ? "info" : "primary"}>
                                {m.type === "volunteer" ? "متطوع" : "موظف"}
                              </Badge>
                            </td>
                            <td>{m.phase_name || "المشروع ككل"}</td>
                            <td>{m.role || m.description || "-"}</td>
                            <td>{m.created_at || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Tab.Pane>

              {/* 4. KPIS TAB */}
              <Tab.Pane eventKey="kpis">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="m-0 fw-bold">مؤشرات الأداء الرئيسية (KPIs)</h5>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => navigate(`/projectkpis/${project.id}`)}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} className="ms-1" />
                      تحديث القيم
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/projectkpiview/${project.id}`)}
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-1" />
                      عرض المؤشرات
                    </Button>
                  </div>
                </div>
                {kpis.length === 0 ? (
                  <div className="empty-tab-state">
                    <FontAwesomeIcon icon={faInbox} className="icon" />
                    <div>لم يتم إدخال مؤشرات أداء لهذا المشروع</div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-2"
                      onClick={() => navigate(`/projectkpis/${project.id}`)}
                    >
                      <FontAwesomeIcon icon={faPlus} className="ms-1" />
                      تسجيل مؤشرات الأداء
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="project-sub-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>المؤشر المطلوب قياسه</th>
                          <th>المستهدف</th>
                          <th>المنجز الفعلي</th>
                          <th>الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kpis.map((k, idx) => (
                          <tr key={k.id || idx}>
                            <td>{idx + 1}</td>
                            <td className="fw-bold">{k.quiz}</td>
                            <td>{k.target}%</td>
                            <td className="fw-bold">{k.actual}%</td>
                            <td>
                              <Badge
                                bg={
                                  k.status === "ممتاز"
                                    ? "success"
                                    : k.status === "تحذير"
                                    ? "warning"
                                    : "danger"
                                }
                                text={k.status === "تحذير" ? "dark" : "white"}
                              >
                                {k.status || "قيد القياس"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Tab.Pane>

              {/* 5. RISKS TAB */}
              <Tab.Pane eventKey="risks">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="m-0 fw-bold">سجل المخاطر وخطة التخفيف</h5>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => navigate(`/riskassessmentreport/${project.id}`)}
                    >
                      <FontAwesomeIcon icon={faShieldHalved} className="ms-1" />
                      تقرير المخاطر الكامل
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/projectrisks/${project.id}`)}
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-1" />
                      إدارة وإضافة المخاطر
                    </Button>
                  </div>
                </div>
                {risks.length === 0 ? (
                  <div className="empty-tab-state">
                    <FontAwesomeIcon icon={faInbox} className="icon" />
                    <div>لم يتم تسجيل أي مخاطر لهذا المشروع</div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-2"
                      onClick={() => navigate(`/projectrisks/${project.id}`)}
                    >
                      <FontAwesomeIcon icon={faPlus} className="ms-1" />
                      إضافة أول خطر
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="project-sub-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>المرحلة المرتبطة</th>
                          <th>وصف الخطر</th>
                          <th>مستوى التأثير</th>
                          <th>الاحتمالية</th>
                          <th>الحالة</th>
                          <th>إجراءات التخفيف</th>
                          <th>الإجراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {risks.map((r, idx) => (
                          <tr key={r.id || idx}>
                            <td>{idx + 1}</td>
                            <td>{r.phase_name || "المشروع ككل"}</td>
                            <td className="fw-bold">{r.description}</td>
                            <td>
                              <Badge bg={r.impactlevel === 3 ? "danger" : r.impactlevel === 1 ? "success" : "warning"}>
                                {r.impact_level_string || "متوسط"}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={r.probability === 3 ? "danger" : r.probability === 1 ? "success" : "warning"}>
                                {r.probability_string || "متوسط"}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={r.status === "مغلق" ? "success" : "info"}>
                                {r.status_string || r.status || "مفتوح"}
                              </Badge>
                            </td>
                            <td style={{ maxWidth: "200px", fontSize: "13px" }}>
                              {r.mitigation_description || r.action_plan || "لم تسجل خطة تخفيف"}
                            </td>
                            <td>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => navigate(`/riskmitigation/${r.id}`)}
                                style={{ fontSize: "12px", padding: "3px 10px", whiteSpace: "nowrap" }}
                              >
                                خطة التخفيف
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Tab.Pane>

              {/* 6. FINANCIALS TAB */}
              <Tab.Pane eventKey="financials">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <h5 className="m-0 fw-bold">الحركات المالية وسندات المشروع</h5>
                    <div className="btn-group btn-group-sm me-2">
                      <button
                        type="button"
                        className={`btn ${financialFilter === "all" ? "btn-secondary" : "btn-outline-secondary"}`}
                        onClick={() => setFinancialFilter("all")}
                      >
                        الكل ({transactions.length})
                      </button>
                      <button
                        type="button"
                        className={`btn ${financialFilter === "receipts" ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => setFinancialFilter("receipts")}
                      >
                        سندات القبض ({transactions.filter((t) => parseInt(t.transaction_type) === 1).length})
                      </button>
                      <button
                        type="button"
                        className={`btn ${financialFilter === "payments" ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => setFinancialFilter("payments")}
                      >
                        سندات الصرف ({transactions.filter((t) => parseInt(t.transaction_type) === 2).length})
                      </button>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => navigate(`/receiptvoucherproject/${project.id}`)}
                    >
                      <FontAwesomeIcon icon={faPlus} className="ms-1" />
                      سند قبض جديد
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => navigate(`/paymentvoucherproject/${project.id}`)}
                    >
                      <FontAwesomeIcon icon={faPlus} className="ms-1" />
                      سند صرف جديد
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/projectpaymentvouchers/${project.id}`)}
                    >
                      <FontAwesomeIcon icon={faReceipt} className="ms-1" />
                      عرض السندات
                    </Button>
                  </div>
                </div>

                {filteredTransactions.length === 0 ? (
                  <div className="empty-tab-state">
                    <FontAwesomeIcon icon={faInbox} className="icon" />
                    <div>لا توجد حركات مالية مطابقة للفلتر المحدد</div>
                    <div className="d-flex gap-2 mt-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => navigate(`/receiptvoucherproject/${project.id}`)}
                      >
                        <FontAwesomeIcon icon={faPlus} className="ms-1" />
                        إنشاء سند قبض / تبرع
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => navigate(`/paymentvoucherproject/${project.id}`)}
                      >
                        <FontAwesomeIcon icon={faPlus} className="ms-1" />
                        إنشاء سند صرف
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="project-sub-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>رقم السند</th>
                          <th>نوع السند</th>
                          <th>المبلغ</th>
                          <th>الحساب المالي</th>
                          <th>الطرف (المانح / المستفيد)</th>
                          <th>التاريخ</th>
                          <th>البيان والملاحظات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((t, idx) => {
                          const isPayment = parseInt(t.transaction_type) === 2;
                          return (
                            <tr key={t.id || idx}>
                              <td>{idx + 1}</td>
                              <td className="fw-bold">{t.invoice_number || `#${t.id}`}</td>
                              <td>
                                <Badge bg={isPayment ? "danger" : "success"}>
                                  {t.transaction_type_string || (isPayment ? "سند صرف" : "سند قبض")}
                                </Badge>
                              </td>
                              <td className={`fw-bold ${isPayment ? "text-danger" : "text-success"}`}>
                                {isPayment ? "-" : "+"}{toLocal(t.amount)} ر.س
                              </td>
                              <td>{t.account || "-"}</td>
                              <td>{t.donor_name || t.beneficiary_name || "-"}</td>
                              <td>{t.date || "-"}</td>
                              <td>{t.notes || "-"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Tab.Pane>

              {/* 7. ATTACHMENTS TAB */}
              <Tab.Pane eventKey="attachments">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="m-0 fw-bold">المرفقات والوثائق الرسمية للمشروع</h5>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(`/projectattachments/${project.id}`)}
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-1" />
                    إدارة ورفع المرفقات
                  </Button>
                </div>
                {uploads.length === 0 ? (
                  <div className="empty-tab-state">
                    <FontAwesomeIcon icon={faInbox} className="icon" />
                    <div>لا توجد وثائق مرفقة بهذا المشروع حتى الآن</div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-2"
                      onClick={() => navigate(`/projectattachments/${project.id}`)}
                    >
                      <FontAwesomeIcon icon={faPlus} className="ms-1" />
                      رفع أول مرفق
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="project-sub-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>وصف الملف</th>
                          <th>رابط الملف</th>
                          <th>تاريخ الرفع</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploads.map((u, idx) => (
                          <tr key={u.id || idx}>
                            <td>{idx + 1}</td>
                            <td className="fw-bold">{u.description || "ملف مرفق"}</td>
                            <td>
                              <a
                                href={u.upload}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-outline-primary"
                              >
                                <FontAwesomeIcon icon={faEye} className="ms-1" />
                                عرض الملف
                              </a>
                            </td>
                            <td>{u.created_at || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>
      </div>

      {/* ── Progress Modal ─────────────────────────────────────── */}
      <Modal show={showProgressModal} onHide={() => setShowProgressModal(false)} centered dir="rtl">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-5">نسبة إنجاز المشروع</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="mb-3">
            <span style={{ fontSize: "36px", fontWeight: "800", color: "var(--primary-color, #c29a64)" }}>
              {progressPct}%
            </span>
          </div>
          <ProgressBar
            now={progressPct}
            variant={progressPct >= 100 ? "success" : progressPct > 50 ? "info" : "warning"}
            style={{ height: "16px", borderRadius: "10px", marginBottom: "20px" }}
          />
          <div className="text-muted" style={{ fontSize: "14px" }}>
            تم تحصيل {toLocal(collected)} ر.س من إجمالي ميزانية {toLocal(total)} ر.س
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProgressModal(false)}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
