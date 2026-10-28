import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingHeart,
  faCircleCheck,
  faClock,
  faCoins,
  faXmark,
  faTriangleExclamation,
  faPlus,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import "./CaseDetails.css";
import TableComponent from "../../components/TableComponent";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Row, Col, Spinner, Form } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterRadio from "../../components/Radio";
import RegisterTextarea from "../../components/RegisterTextarea";
import UploadInput from "../../components/UploadInput";
import API from "../../api/axiosConfig";
import { toLocal } from "../../Utils/toLocal";
import {
  CaseOverviewModal,
  CaseInfoCardModal,
  CaseDonationsModal,
  CaseDesignRequestModal,
  CaseMarketingRequestModal,
  CasePaymentVoucherModal,
  CaseReceiptVoucherModal,
  CaseEditModal,
} from "./CaseActionModals";

function CaseDetails(props) {
  const navigate = useNavigate();
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const [stats, setStats] = useState({
    total_cases: 0,
    active_cases: 0,
    completed_cases: 0,
    total_target_amount: 0,
    total_collected_amount: 0,
    total_paid_amount: 0,
  });

  // ── Modal State ──────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  const [name, setName] = useState("");
  const [isAssetsSelected, setIsAssetsSelected] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [numberOfAssets, setNumberOfAssets] = useState(0);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subOptions, setSubOptions] = useState([]);
  const [showOtherTextbox, setShowOtherTextbox] = useState(false);
  const [showOtherTextboxValue, setShowOtherTextboxValue] = useState("");
  const [document, setDocument] = useState(null);
  const [postDate, setPostDate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [deedlineDate, setDeedlineDate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [benf, setBenf] = useState("");
  const [description, setDescription] = useState("");
  const [description2, setDescription2] = useState("");
  const [marketingmethod, setMarketingmethod] = useState(0);
  const [accounttree, setAccounttre] = useState("");
  const [human, setHuman] = useState([]);

  // ── Delete Modal State ───────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCase, setDeletingCase] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Action Popups State ──────────────────────────────────
  const [actionPopup, setActionPopup] = useState({
    type: null,
    caseId: null,
    record: null,
  });

  const handleOpenActionModal = (type, id, record) => {
    setActionPopup({ type, caseId: id, record });
  };

  const handleCloseActionModal = () => {
    setActionPopup({ type: null, caseId: null, record: null });
  };

  // Fetch KPI Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await API.get("/shop/stats");
      if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching case stats:", err);
    }
  }, []);

  // Fetch beneficiaries for dropdown
  const getCaseData = async () => {
    try {
      const res = await API.post("/humancases");
      const data = res.data?.data || res.data || [];
      setHuman(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching human cases:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    getCaseData();
  }, [fetchStats]);

  useEffect(() => {
    if (showModal || actionPopup.type) {
      getCaseData();
    }
  }, [showModal, actionPopup.type]);

  const handleRadioChange = (label) => {
    setIsAssetsSelected(label === "أسهم");
  };

  const calculatePricePerAsset = () => {
    return numberOfAssets > 0 ? (totalCost / numberOfAssets).toFixed(2) : 0;
  };

  const handleMainCategoryChange = (e) => {
    const selectedValue = e.target.value;
    setMainCategory(selectedValue);
    if (selectedValue === "حالة اغاثة") {
      setSubOptions([
        { value: "صحية", label: "صحية" },
        { value: "طارئة ", label: "طارئة " },
        { value: "إجتماعية", label: "إجتماعية" },
      ]);
      setShowOtherTextbox(false);
    } else if (selectedValue === "حالة تنموية") {
      setSubOptions([
        { value: "دورات تدريبية", label: "دورات تدريبية" },
        { value: "دراسة", label: "دراسة" },
        { value: "إقامة مشاريع استراتيجية", label: "إقامة مشاريع استراتيجية" },
      ]);
      setShowOtherTextbox(false);
    } else if (selectedValue === "أخري") {
      setSubOptions([]);
      setShowOtherTextbox(true);
    } else {
      setSubOptions([]);
      setShowOtherTextbox(false);
    }
  };

  const resetForm = () => {
    setName("");
    setIsAssetsSelected(false);
    setTotalCost(0);
    setNumberOfAssets(0);
    setMainCategory("");
    setSubCategory("");
    setSubOptions([]);
    setShowOtherTextbox(false);
    setShowOtherTextboxValue("");
    setDocument(null);
    setPostDate(new Date().toISOString().substr(0, 10));
    setDeedlineDate(new Date().toISOString().substr(0, 10));
    setBenf("");
    setDescription("");
    setDescription2("");
    setMarketingmethod(0);
    setAccounttre("");
    setError({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const mForm = new FormData();
    mForm.append("name", name);
    mForm.append("isAssetsSelected", isAssetsSelected);
    mForm.append("numberOfAssets", numberOfAssets);
    mForm.append("totalCost", totalCost);
    mForm.append("mainCategory", mainCategory);
    mForm.append("subCategory", subCategory);
    mForm.append("description", description);
    mForm.append("description2", description2);
    if (benf && benf !== "0") {
      mForm.append("benf", benf);
    }
    mForm.append("postDate", postDate);
    mForm.append("deedlineDate", deedlineDate);
    if (document) {
      mForm.append("document", document);
    }
    mForm.append("marketingmethod", marketingmethod);
    mForm.append("accounttree", accounttree);
    if (showOtherTextboxValue) {
      mForm.append("othertext", showOtherTextboxValue);
    }

    try {
      const res = await API.post("/shop/store", mForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) {
        handleClose();
        setTableReloadKey(Date.now());
        fetchStats();
      } else {
        setError(res.data?.errors || {});
      }
    } catch (err) {
      console.error("Error creating shop case:", err);
      setError(err.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (id, record) => {
    setDeletingCase(record || { id, title: `الحالة #${id}` });
    setShowDeleteModal(true);
  };

  // Confirm Delete Case
  const handleConfirmDelete = async () => {
    if (!deletingCase?.id) return;
    setIsDeleting(true);

    try {
      await API.delete(`/shop/${deletingCase.id}`);
      setShowDeleteModal(false);
      setDeletingCase(null);
      setTableReloadKey(Date.now());
      fetchStats();
    } catch (err) {
      console.error("Error deleting case:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Table Config ─────────────────────────────────────────
  const columns = [
    { name: "إسم الحالة", key: "title" },
    { name: "نوع العملية", key: "status_badge" },
    { name: "تاريخ البدء", key: "dateoflaunch" },
    { name: "آلية التسويق", key: "marketing_badge" },
    { name: "قيمة الحالة", key: "formatted_total" },
    { name: "التحصيلات", key: "formatted_amount" },
    { name: "المصروفات", key: "formatted_paid" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions = [
    {
      label: "عرض الحالة",
      action: (id, record) => handleOpenActionModal("overview", id, record),
    },
    {
      label: "التفاصيل",
      action: (id) => navigate(`/casedetailsview/${id}`),
    },
    {
      label: "بيانات الحالة",
      action: (id, record) => handleOpenActionModal("info", id, record),
    },
    {
      label: "عرض التبرعات",
      action: (id, record) => handleOpenActionModal("donations", id, record),
    },
    {
      label: "طلب تصميم",
      action: (id, record) => handleOpenActionModal("design", id, record),
    },
    {
      label: "طلب إدارة",
      action: (id, record) => handleOpenActionModal("marketing", id, record),
    },
    {
      label: "سند صرف",
      action: (id, record) => handleOpenActionModal("payment", id, record),
    },
    {
      label: "سند قبض",
      action: (id, record) => handleOpenActionModal("receipt", id, record),
    },
    {
      label: "تعديل",
      action: (id, record) => handleOpenActionModal("edit", id, record),
    },
    {
      label: "حذف الحالة",
      action: (id, record) => handleOpenDeleteModal(id, record),
    },
  ];

  const modifyRow = (row) => {
    const totalVal = parseFloat(row.total || 0);
    const amountVal = parseFloat(row.amount || 0);
    const paidVal = parseFloat(row.paid_amount || row.total_paid || 0);
    const statusVal = Number(row.status);
    const marketingVal = Number(row.marketingmethod);

    const statusBadge =
      statusVal === 1
        ? '<span class="badge-case-completed">مكتملة</span>'
        : '<span class="badge-case-active">نشطة (قيد التبرع)</span>';

    let marketingBadge = '<span class="badge-marketing-unknown">غير محدد</span>';
    if (marketingVal === 1) {
      marketingBadge = '<span class="badge-marketing-donors">المانحين</span>';
    } else if (marketingVal === 2) {
      marketingBadge = '<span class="badge-marketing-gov">المنصات الحكومية</span>';
    } else if (marketingVal === 3) {
      marketingBadge = '<span class="badge-marketing-store">متاجر الجمعيات</span>';
    }

    return {
      ...row,
      status_badge: statusBadge,
      marketing_badge: marketingBadge,
      formatted_total: `<span style="font-weight:700; color:var(--text-color)">${toLocal(totalVal)} ر.س</span>`,
      formatted_amount: `<span style="font-weight:700; color:#2e7d32">${toLocal(amountVal)} ر.س</span>`,
      formatted_paid: `<span style="font-weight:700; color:${paidVal > 0 ? '#c53030' : 'var(--placeholder-color, #8c7e6c)'}">${toLocal(paidVal)} ر.س</span>`,
    };
  };

  return (
    <div className="cases-page-container">
      {/* ── Top KPI Statistics Cards ── */}
      <div className="cases-stats-grid">
        <div className="case-stat-card stat-gold">
          <div className="case-stat-content">
            <div className="case-stat-info">
              <span className="case-stat-title">إجمالي الحالات</span>
              <span className="case-stat-value">{stats.total_cases}</span>
              <span className="case-stat-sub">حالات الدعم المعتمدة</span>
            </div>
            <div className="case-stat-icon-wrapper">
              <FontAwesomeIcon icon={faHandHoldingHeart} />
            </div>
          </div>
        </div>

        <div className="case-stat-card stat-blue">
          <div className="case-stat-content">
            <div className="case-stat-info">
              <span className="case-stat-title">الحالات النشطة</span>
              <span className="case-stat-value">{stats.active_cases}</span>
              <span className="case-stat-sub">قيد جمع التبرعات</span>
            </div>
            <div className="case-stat-icon-wrapper">
              <FontAwesomeIcon icon={faClock} />
            </div>
          </div>
        </div>

        <div className="case-stat-card stat-green">
          <div className="case-stat-content">
            <div className="case-stat-info">
              <span className="case-stat-title">الحالات المكتملة</span>
              <span className="case-stat-value">{stats.completed_cases}</span>
              <span className="case-stat-sub">اكتمل التبرع لها بنجاح</span>
            </div>
            <div className="case-stat-icon-wrapper">
              <FontAwesomeIcon icon={faCircleCheck} />
            </div>
          </div>
        </div>

        <div className="case-stat-card stat-purple">
          <div className="case-stat-content">
            <div className="case-stat-info">
              <span className="case-stat-title">التحصيلات / المستهدف</span>
              <span className="case-stat-value" style={{ fontSize: "19px" }}>
                {toLocal(stats.total_collected_amount)} ر.س
              </span>
              <span className="case-stat-sub">
                من إجمالي: {toLocal(stats.total_target_amount)} ر.س
              </span>
            </div>
            <div className="case-stat-icon-wrapper">
              <FontAwesomeIcon icon={faCoins} />
            </div>
          </div>
        </div>

        <div className="case-stat-card stat-red">
          <div className="case-stat-content">
            <div className="case-stat-info">
              <span className="case-stat-title">إجمالي المصروفات</span>
              <span className="case-stat-value" style={{ fontSize: "19px", color: "#c53030" }}>
                {toLocal(stats.total_paid_amount || 0)} ر.س
              </span>
              <span className="case-stat-sub">
                صافي السيولة: {toLocal(Math.max(0, (stats.total_collected_amount || 0) - (stats.total_paid_amount || 0)))} ر.س
              </span>
            </div>
            <div className="case-stat-icon-wrapper">
              <FontAwesomeIcon icon={faMoneyBillWave} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Table Container ── */}
      <TableComponent
        apiUrl="/shop"
        columns={columns}
        title="تقرير الحالات الإنسانية"
        titleIcon={<FontAwesomeIcon icon={faHandHoldingHeart} />}
        dropdownOptions={dropdownOptions}
        transformRowFn={modifyRow}
        triggerReload={tableReloadKey}
        searchDate={true}
        addBtn={true}
        onAddClick={() => {
          resetForm();
          setShowModal(true);
        }}
        addBtnName="حالة جديدة"
      />

      {/* ── Add Case Modal ── */}
      <Modal
        show={showModal}
        onHide={handleClose}
        className="modal-table archModal donor-modal case-modal"
        size="lg"
        centered
      >
        <Modal.Header>
          <Modal.Title>
            <FontAwesomeIcon
              icon={faHandHoldingHeart}
              style={{ color: "var(--primary-color, #b89358)" }}
            />
            <span>إضافة ونشر حالة إنسانية جديدة</span>
          </Modal.Title>
          <Button
            className="custom-close-button"
            variant="link"
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ direction: "rtl", padding: "24px" }}>
          <Form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="case-section-header">
                <span>1. البيانات الأساسية للحالة</span>
              </div>
              <Row className="g-3">
                <Col md={6}>
                  <RegisterTextbox
                    id="case-name"
                    label="مسمى الحالة *"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={error.title || error.name}
                  />
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id="case-benf"
                    label="إسم المستفيد"
                    options={[
                      { value: "", label: "إختر المستفيد" },
                      { value: "0", label: "لا يوجد مستفيد محدد" },
                      ...human.map((item) => ({
                        value: item.id,
                        label: `${item.name} (${item.idnumber || "بدون هوية"})`,
                      })),
                    ]}
                    value={benf}
                    onChange={(e) => setBenf(e.target.value)}
                    error={error.human_cases_id || error.benf}
                  />
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id="case-main-cat"
                    label="نوع الحالة"
                    options={[
                      { value: "", label: "إختر التصنيف الرئيسي" },
                      { value: "حالة اغاثة", label: "حالة إغاثة" },
                      { value: "حالة تنموية", label: "حالة تنموية" },
                      { value: "أخري", label: "أخرى" },
                    ]}
                    value={mainCategory}
                    onChange={handleMainCategoryChange}
                    error={error.casetype || error.mainCategory}
                  />
                </Col>
                <Col md={6}>
                  {subOptions.length > 0 && (
                    <RegisterSelect
                      id="case-sub-cat"
                      label="التصنيف الفرعي"
                      options={[
                        { value: "", label: "اختر التصنيف الفرعي" },
                        ...subOptions,
                      ]}
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      error={error.subcasetype || error.subCategory}
                    />
                  )}
                  {showOtherTextbox && (
                    <RegisterTextbox
                      id="case-other-cat"
                      label="أدخل التصنيف المخصص"
                      type="text"
                      value={showOtherTextboxValue}
                      onChange={(e) => setShowOtherTextboxValue(e.target.value)}
                      error={error.other_category || error.otherCategory}
                    />
                  )}
                </Col>
              </Row>
            </div>

            <div className="mb-4">
              <div className="case-section-header">
                <span>2. البيانات المالية والتسويقية</span>
              </div>
              <Row className="g-3">
                <Col md={6}>
                  <RegisterSelect
                    id="case-marketing"
                    label="آلية التسويق"
                    options={[
                      { value: "0", label: "إختر الآلية" },
                      { value: "1", label: "المانحين" },
                      { value: "2", label: "المنصات الحكومية" },
                      { value: "3", label: "متاجر الجمعيات" },
                    ]}
                    value={marketingmethod}
                    onChange={(e) => setMarketingmethod(e.target.value)}
                    error={error.marketingmethod}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="case-total-cost"
                    label="مبلغ الدعم المستهدف (ريال) *"
                    type="number"
                    value={totalCost}
                    onChange={(e) => setTotalCost(Number(e.target.value))}
                    error={error.total || error.totalCost}
                  />
                </Col>
              </Row>

              <div
                className="mt-3 p-3"
                style={{
                  backgroundColor: "var(--surface-color, #ffffff)",
                  borderRadius: "12px",
                  border: "1px solid var(--border-color, #ebdcc8)",
                }}
              >
                <div
                  onChange={(e) => handleRadioChange(e.target.value)}
                  className="radioCon"
                >
                  <p className="mb-2 fw-bold" style={{ fontSize: "13px" }}>
                    تقسيم مبالغ التبرع للحالة:
                  </p>
                  <div className="d-flex gap-4">
                    <RegisterRadio
                      label="أسهم تبرع"
                      value="أسهم"
                      name="assetType"
                      checked={isAssetsSelected}
                    />
                    <RegisterRadio
                      label="مبلغ إجمالي مفتوح"
                      value="قيمة"
                      name="assetType"
                      checked={!isAssetsSelected}
                    />
                  </div>
                </div>

                {isAssetsSelected && (
                  <div className="mt-3">
                    <RegisterTextbox
                      id="case-assets-count"
                      label="عدد الأسهم المطروحة للتبرع"
                      type="number"
                      value={numberOfAssets}
                      onChange={(e) =>
                        setNumberOfAssets(Number(e.target.value))
                      }
                    />
                    <div
                      className="mt-2 p-2 text-center"
                      style={{
                        backgroundColor: "rgba(184, 147, 88, 0.08)",
                        borderRadius: "8px",
                        border: "1px dashed rgba(184, 147, 88, 0.4)",
                        fontSize: "13px",
                      }}
                    >
                      قيمة السهم الواحد:{" "}
                      <span className="fw-bold" style={{ color: "#2e7d32" }}>
                        {calculatePricePerAsset()} ريال
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="case-section-header">
                <span>3. التوقيت والمرفقات</span>
              </div>
              <Row className="g-3">
                <Col md={6}>
                  <div className="mb-2">
                    <label
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "var(--label-color, #8c7e6c)",
                        marginBottom: "6px",
                        display: "block",
                      }}
                    >
                      تاريخ بدء النشر
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={postDate}
                      onChange={(e) => setPostDate(e.target.value)}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-2">
                    <label
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "var(--label-color, #8c7e6c)",
                        marginBottom: "6px",
                        display: "block",
                      }}
                    >
                      تاريخ انتهاء الحملة
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={deedlineDate}
                      onChange={(e) => setDeedlineDate(e.target.value)}
                    />
                  </div>
                </Col>
                <Col md={12}>
                  <UploadInput
                    id="case-doc"
                    label="إرفاق وثيقة أو صورة للحالة"
                    onChange={(e) => setDocument(e.target.files[0])}
                    error={error.document}
                  />
                </Col>
              </Row>
            </div>

            <div className="mb-4">
              <div className="case-section-header">
                <span>4. الوصف والتفاصيل</span>
              </div>
              <Row className="g-3">
                <Col md={6}>
                  <RegisterTextarea
                    id="case-desc1"
                    label="وصف كارت الحالة"
                    placeholder="البيانات التي تظهر للمتبرعين في الكارت الرئيسي"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={error.description}
                    stylee={{ height: "100px" }}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextarea
                    id="case-desc2"
                    label="تفاصيل إضافية للحالة"
                    placeholder="ملاحظات داخلية لا تظهر للعامة"
                    value={description2}
                    onChange={(e) => setDescription2(e.target.value)}
                    error={error.description2}
                    stylee={{ height: "100px" }}
                  />
                </Col>
              </Row>
            </div>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                إغلاق
              </Button>
              {isSubmitting ? (
                <Button variant="primary" disabled>
                  <Spinner animation="border" size="sm" />
                </Button>
              ) : (
                <Button variant="primary" type="submit">
                  <FontAwesomeIcon icon={faPlus} style={{ marginLeft: "8px" }} />
                  حفظ ونشر الحالة
                </Button>
              )}
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        className="modal-table archModal donor-modal case-delete-modal"
        centered
      >
        <Modal.Header>
          <Modal.Title style={{ color: "#e53e3e" }}>
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              style={{ marginLeft: "8px" }}
            />
            تأكيد حذف الحالة
          </Modal.Title>
          <Button
            className="custom-close-button"
            variant="link"
            onClick={() => setShowDeleteModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </Modal.Header>
        <Modal.Body
          style={{
            direction: "rtl",
            textAlign: "center",
            padding: "24px 20px",
          }}
        >
          <p
            style={{ fontSize: "15px", fontWeight: "600", marginBottom: "8px" }}
          >
            هل أنت متأكد من رغبتك في حذف الحالة:
          </p>
          <p style={{ fontSize: "16px", fontWeight: "800", color: "#e53e3e" }}>
            "{deletingCase?.title}"
          </p>
          <p
            style={{
              fontSize: "12.5px",
              color: "var(--placeholder-color, #9c8e7c)",
              margin: 0,
            }}
          >
            سيتم حذف بيانات هذه الحالة من المتجر وقائمة الحالات نهائياً.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            إلغاء
          </Button>
          {isDeleting ? (
            <Button variant="danger" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button variant="danger" onClick={handleConfirmDelete}>
              تأكيد الحذف
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* ── Action Popups (All 8 actions open in popup) ── */}
      <CaseOverviewModal
        show={actionPopup.type === "overview"}
        onClose={handleCloseActionModal}
        caseId={actionPopup.caseId}
        onOpenDonations={(id, rec) => handleOpenActionModal("donations", id, rec)}
        onCaseUpdated={() => {
          setTableReloadKey(Date.now());
          fetchStats();
        }}
      />

      <CaseInfoCardModal
        show={actionPopup.type === "info"}
        onClose={handleCloseActionModal}
        caseId={actionPopup.caseId}
      />

      <CaseDonationsModal
        show={actionPopup.type === "donations"}
        onClose={handleCloseActionModal}
        caseId={actionPopup.caseId}
        caseRecord={actionPopup.record}
        onAddReceipt={(id, rec) => handleOpenActionModal("receipt", id, rec)}
      />

      <CaseDesignRequestModal
        show={actionPopup.type === "design"}
        onClose={handleCloseActionModal}
        caseId={actionPopup.caseId}
        caseRecord={actionPopup.record}
      />

      <CaseMarketingRequestModal
        show={actionPopup.type === "marketing"}
        onClose={handleCloseActionModal}
        caseId={actionPopup.caseId}
        caseRecord={actionPopup.record}
      />

      <CasePaymentVoucherModal
        show={actionPopup.type === "payment"}
        onClose={handleCloseActionModal}
        caseId={actionPopup.caseId}
        caseRecord={actionPopup.record}
        onSuccess={() => {
          setTableReloadKey(Date.now());
          fetchStats();
        }}
      />

      <CaseReceiptVoucherModal
        show={actionPopup.type === "receipt"}
        onClose={handleCloseActionModal}
        caseId={actionPopup.caseId}
        caseRecord={actionPopup.record}
        onSuccess={() => {
          setTableReloadKey(Date.now());
          fetchStats();
        }}
      />

      <CaseEditModal
        show={actionPopup.type === "edit"}
        onClose={handleCloseActionModal}
        caseId={actionPopup.caseId}
        beneficiaries={human}
        onSuccess={() => {
          setTableReloadKey(Date.now());
          fetchStats();
        }}
      />
    </div>
  );
}

export default CaseDetails;
