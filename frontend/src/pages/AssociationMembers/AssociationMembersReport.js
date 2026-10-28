import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsersBetweenLines,
  faUsers,
  faUserGroup,
  faBuildingColumns,
  faCoins,
  faXmark,
  faPenToSquare,
  faTrashCan,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Modal, Row, Col, Button, Spinner } from "react-bootstrap";
import TableComponent from "../../components/TableComponent";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import UploadInput from "../../components/UploadInput";
import API from "../../api/axiosConfig";
import "../CaseDetails/CaseDetails.css";
import "./associationMembers.css";

function AssociationMembersReport() {
  const navigate = useNavigate();

  const columns = [
    { name: "رقم العضو", key: "membership_serial_badge" },
    { name: "اسم العضو", key: "name" },
    { name: "نوع العضو", key: "status_badge" },
    { name: "نوع العضوية", key: "subscription_badge" },
    { name: "قيمة الاشتراك", key: "subscription_fees_formatted" },
    { name: "تاريخ العضوية", key: "start_membership_date" },
    { name: "تاريخ الإشتراك", key: "start_subscription_date" },
    { name: "", key: "actions" },
  ];

  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const [stats, setStats] = useState({
    total_members: 0,
    board_members: 0,
    general_members: 0,
    total_fees: 0,
  });

  // ── Fetch aggregate statistics ───────────────────────────
  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await API.get("/assemblymembers/stats");
        if (isMounted && res.data?.success && res.data?.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [tableReloadKey]);

  // ── Add Modal state ─────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  const [name, setName] = useState(
    () => sessionStorage.getItem("assemblyname") || ""
  );
  const [dob, setDob] = useState(
    () =>
      sessionStorage.getItem("assemblydob") ||
      new Date().toISOString().substr(0, 10)
  );
  const [nationalid, setNationalid] = useState(
    () => sessionStorage.getItem("assemblyid") || ""
  );
  const [idexpire, setIdexpire] = useState(
    () =>
      sessionStorage.getItem("assemblyidexpire") ||
      new Date().toISOString().substr(0, 10)
  );
  const [startjoin, setStartjoin] = useState(
    () =>
      sessionStorage.getItem("assemblystartjoin") ||
      new Date().toISOString().substr(0, 10)
  );
  const [endjoin, setEndjoin] = useState(
    () =>
      sessionStorage.getItem("assemblyendjoin") ||
      new Date().toISOString().substr(0, 10)
  );
  const [status, setStatus] = useState(
    () => sessionStorage.getItem("assemblystatus") || "2"
  );
  const [membertype, setMembertype] = useState(
    () => sessionStorage.getItem("assemblymembertype") || ""
  );
  const [job, setJob] = useState(
    () => sessionStorage.getItem("assemblyjob") || ""
  );
  const [jobAddress, setJobAddress] = useState(
    () => sessionStorage.getItem("assemblyjobAddress") || ""
  );
  const [fees, setFees] = useState(
    () => sessionStorage.getItem("assemblyfees") || ""
  );
  const [notes, setNotes] = useState(
    () => sessionStorage.getItem("assemblynotes") || ""
  );
  const [startmember, setStartmember] = useState(
    () =>
      sessionStorage.getItem("assemblystartmember") ||
      new Date().toISOString().substr(0, 10)
  );
  const [upload, setUpload] = useState(null);

  const memberTypeOptionsByStatus = {
    1: [
      { value: "", label: "إختر نوع العضوية" },
      { value: "4", label: "عضو مجلس" },
      { value: "5", label: "رئيس مجلس" },
      { value: "6", label: "نائب رئيس" },
      { value: "7", label: "عضو لجنة" },
    ],
    2: [
      { value: "", label: "إختر نوع العضوية" },
      { value: "1", label: "داعمة" },
      { value: "2", label: "فخرية" },
      { value: "3", label: "عادية" },
    ],
  };

  const resetForm = () => {
    setName("");
    setDob(new Date().toISOString().substr(0, 10));
    setNationalid("");
    setIdexpire(new Date().toISOString().substr(0, 10));
    setStartjoin(new Date().toISOString().substr(0, 10));
    setEndjoin(new Date().toISOString().substr(0, 10));
    setStatus("2");
    setMembertype("");
    setJob("");
    setJobAddress("");
    setFees("");
    setNotes("");
    setStartmember(new Date().toISOString().substr(0, 10));
    setUpload(null);
    setError({});
    sessionStorage.removeItem("assemblyname");
    sessionStorage.removeItem("assemblydob");
    sessionStorage.removeItem("assemblyid");
    sessionStorage.removeItem("assemblyidexpire");
    sessionStorage.removeItem("assemblystartjoin");
    sessionStorage.removeItem("assemblyendjoin");
    sessionStorage.removeItem("assemblystatus");
    sessionStorage.removeItem("assemblymembertype");
    sessionStorage.removeItem("assemblyjob");
    sessionStorage.removeItem("assemblyjobAddress");
    sessionStorage.removeItem("assemblyfees");
    sessionStorage.removeItem("assemblynotes");
    sessionStorage.removeItem("assemblystartmember");
  };

  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!name.trim()) {
      newErrors.name = "اسم العضو مطلوب";
    }
    if (dob && dob > today) {
      newErrors.dob = "تاريخ الميلاد لا يمكن أن يكون في المستقبل";
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("nationalid", nationalid);
    formData.append("idexpire", idexpire);
    formData.append("startjoin", startjoin);
    formData.append("endjoin", endjoin);
    formData.append("membertype", membertype);
    formData.append("startmember", startmember);
    formData.append("job", job);
    formData.append("jobAddress", jobAddress);
    formData.append("fees", fees || 0);
    formData.append("notes", notes);
    formData.append("status", status);
    if (upload) formData.append("upload", upload);

    try {
      const res = await API.post("/assemblymembers/store", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) {
        handleClose();
        setTableReloadKey(Date.now());
      } else {
        setError(res.data.errors || {});
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Edit Modal state ────────────────────────────────────
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [isFetchingMember, setIsFetchingMember] = useState(false);
  const [editError, setEditError] = useState({});
  const [editFormData, setEditFormData] = useState({
    name: "",
    dob: "",
    nationalid: "",
    idexpire: "",
    startjoin: "",
    endjoin: "",
    status: "2",
    membertype: "",
    job: "",
    jobAddress: "",
    fees: "",
    notes: "",
    startmember: "",
    upload: null,
  });

  // ── Delete Modal state ──────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMember, setDeletingMember] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenEditModal = async (targetId, record) => {
    const id = record?.id || targetId;
    setEditingMemberId(id);
    setEditError({});
    setShowEditModal(true);
    setIsFetchingMember(true);

    if (record) {
      setEditFormData({
        name: record.name || "",
        dob: record.dateofbirth || record.dob || "",
        nationalid: record.nationalid || "",
        idexpire: record.nationalid_expire || record.idexpire || "",
        startjoin: record.start_subscription_date || record.startjoin || "",
        endjoin: record.end_subscription_date || record.endjoin || "",
        status: String(record.status ?? "2"),
        membertype: String(record.subscription_type || record.membertype || ""),
        job: record.job || "",
        jobAddress: record.jobaddress || record.jobAddress || "",
        fees: record.subscription_fees ?? record.fees ?? "",
        notes: record.notes || "",
        startmember: record.start_membership_date || record.startmember || "",
        upload: null,
      });
    }

    try {
      const res = await API.get(`/assemblymembers/${id}`);
      const data = res.data?.data || res.data;
      if (data) {
        setEditFormData({
          name: data.name || "",
          dob: data.dateofbirth || data.dob || "",
          nationalid: data.nationalid || "",
          idexpire: data.nationalid_expire || data.idexpire || "",
          startjoin: data.start_subscription_date || data.startjoin || "",
          endjoin: data.end_subscription_date || data.endjoin || "",
          status: String(data.status ?? "2"),
          membertype: String(data.subscription_type || data.membertype || ""),
          job: data.job || "",
          jobAddress: data.jobaddress || data.jobAddress || "",
          fees: data.subscription_fees ?? data.fees ?? "",
          notes: data.notes || "",
          startmember: data.start_membership_date || data.startmember || "",
          upload: null,
        });
      }
    } catch (err) {
      console.error("Error loading member details:", err);
    } finally {
      setIsFetchingMember(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.name?.trim()) {
      setEditError({ name: "اسم العضو مطلوب" });
      return;
    }
    setIsEditSubmitting(true);
    setEditError({});

    const formData = new FormData();
    formData.append("id", editingMemberId);
    formData.append("name", editFormData.name);
    if (editFormData.dob) formData.append("dob", editFormData.dob);
    if (editFormData.nationalid) formData.append("nationalid", editFormData.nationalid);
    if (editFormData.idexpire) formData.append("idexpire", editFormData.idexpire);
    if (editFormData.status) formData.append("status", editFormData.status);
    if (editFormData.membertype) formData.append("membertype", editFormData.membertype);
    if (editFormData.startmember) formData.append("startmember", editFormData.startmember);
    if (editFormData.startjoin) formData.append("startjoin", editFormData.startjoin);
    if (editFormData.endjoin) formData.append("endjoin", editFormData.endjoin);
    formData.append(
      "fees",
      editFormData.fees !== "" && editFormData.fees !== null ? editFormData.fees : 0
    );
    if (editFormData.job) formData.append("job", editFormData.job);
    if (editFormData.jobAddress) formData.append("jobAddress", editFormData.jobAddress);
    if (editFormData.notes) formData.append("notes", editFormData.notes);
    if (editFormData.upload) formData.append("upload", editFormData.upload);

    try {
      const res = await API.post("/assemblymembers/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) {
        setShowEditModal(false);
        setTableReloadKey(Date.now());
      } else {
        setEditError(res.data?.errors || {});
      }
    } catch (err) {
      console.error(err);
      setEditError(err.response?.data?.errors || {});
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleOpenDeleteModal = (targetId, record) => {
    const member = record || { id: targetId, name: `عضو #${targetId}` };
    setDeletingMember(member);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMember?.id) return;
    setIsDeleting(true);
    try {
      await API.delete(`/assemblymembers/${deletingMember.id}`);
      setShowDeleteModal(false);
      setDeletingMember(null);
      setTableReloadKey(Date.now());
    } catch (err) {
      console.error("Error deleting member:", err);
      alert("حدث خطأ أثناء محاولة حذف العضو");
    } finally {
      setIsDeleting(false);
    }
  };

  const dropdownOptions = [
    {
      label: "تعديل",
      action: (id, record) => handleOpenEditModal(id, record),
    },
    { label: "سند قبض", route: "/associationMemberspayment/:id" },
    { label: "سند دفع", route: "/associationMembersRecieve/:id" },
    {
      label: "حذف العضو",
      action: (id, record) => handleOpenDeleteModal(id, record),
    },
  ];

  const modifyRow = (row) => {
    const isBoard = Number(row.status) === 1;

    return {
      ...row,
      membership_serial_badge: `<span class="badge-serial">${row.membership_serial || `MEM-${row.id}`}</span>`,
      status_badge: isBoard
        ? `<span class="badge-board">مجلس إدارة</span>`
        : `<span class="badge-assembly">جمعية عمومية</span>`,
      subscription_badge: `<span class="badge-sub">${row.subscription_type_string || row.membertype || "عادية"}</span>`,
      subscription_fees_formatted: `<span class="badge-fees">${Number(row.subscription_fees ?? row.fees ?? 0).toLocaleString()} ر.س</span>`,
    };
  };

  return (
    <div className="ass-mem">
      <div className="printcasedata-container">
        {/* ── Page Header ── */}
        <div className="ass-page-header">
          <div className="ass-header-title-box">
            <div className="ass-header-icon">
              <FontAwesomeIcon icon={faUsersBetweenLines} />
            </div>
            <div>
              <h1 className="ass-header-title">تقرير أعضاء الجمعية</h1>
              <p className="ass-header-subtitle">
                إدارة بيانات أعضاء مجلس الإدارة والجمعية العمومية وتتبع اشتراكاتهم
              </p>
            </div>
          </div>
        </div>

        {/* ── KPI Stats Cards ── */}
        <div className="ass-stats-grid">
          <div className="ass-stat-card total">
            <div className="ass-stat-info">
              <span className="ass-stat-label">إجمالي الأعضاء</span>
              <div className="ass-stat-value-wrap">
                <span className="ass-stat-value">{stats.total_members}</span>
                <span className="ass-stat-unit">عضو</span>
              </div>
            </div>
            <div className="ass-stat-icon-wrap">
              <FontAwesomeIcon icon={faUsers} />
            </div>
          </div>

          <div className="ass-stat-card board">
            <div className="ass-stat-info">
              <span className="ass-stat-label">مجلس الإدارة</span>
              <div className="ass-stat-value-wrap">
                <span className="ass-stat-value">{stats.board_members}</span>
                <span className="ass-stat-unit">عضو</span>
              </div>
            </div>
            <div className="ass-stat-icon-wrap">
              <FontAwesomeIcon icon={faBuildingColumns} />
            </div>
          </div>

          <div className="ass-stat-card general">
            <div className="ass-stat-info">
              <span className="ass-stat-label">الجمعية العمومية</span>
              <div className="ass-stat-value-wrap">
                <span className="ass-stat-value">{stats.general_members}</span>
                <span className="ass-stat-unit">عضو</span>
              </div>
            </div>
            <div className="ass-stat-icon-wrap">
              <FontAwesomeIcon icon={faUserGroup} />
            </div>
          </div>

          <div className="ass-stat-card fees">
            <div className="ass-stat-info">
              <span className="ass-stat-label">إجمالي الاشتراكات</span>
              <div className="ass-stat-value-wrap">
                <span className="ass-stat-value">
                  {Number(stats.total_fees || 0).toLocaleString()}
                </span>
                <span className="ass-stat-unit">ر.س</span>
              </div>
            </div>
            <div className="ass-stat-icon-wrap">
              <FontAwesomeIcon icon={faCoins} />
            </div>
          </div>
        </div>

        {/* ── Table Component ── */}
        <TableComponent
          apiUrl="/assemblymembers"
          columns={columns}
          title="تقرير الأعضاء"
          titleIcon={<FontAwesomeIcon icon={faUsersBetweenLines} />}
          placeholderSearch="ابحث باسم العضو، رقم العضو، أو الهوية الوطنية..."
          dropdownOptions={dropdownOptions}
          transformRowFn={modifyRow}
          triggerReload={tableReloadKey}
          addBtn={true}
          onAddClick={() => setShowModal(true)}
          addBtnName="عضو جديد"
        />
      </div>

      {/* ── Add Member Modal ── */}
      <Modal
        show={showModal}
        onHide={handleClose}
        className="modal-table archModal donor-modal"
        size="lg"
        centered
      >
        <Modal.Header>
          <Modal.Title>إضافة عضو جديد</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ paddingBottom: "0", direction: "rtl" }}>
          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="mem-name"
                label="إسم العضو *"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  sessionStorage.setItem("assemblyname", e.target.value);
                }}
                error={error.name}
              />
            </Col>
            <Col md={6}>
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label className="register-label">
                  تاريخ الميلاد
                </label>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={dob}
                  onChange={(e) => {
                    setDob(e.target.value);
                    sessionStorage.setItem("assemblydob", e.target.value);
                  }}
                  style={{ width: "100%" }}
                />
                {error.dob && (
                  <span className="error-text">{error.dob}</span>
                )}
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="mem-id"
                label="رقم الهوية الوطنية / الإقامة"
                type="text"
                value={nationalid}
                onChange={(e) => {
                  setNationalid(e.target.value);
                  sessionStorage.setItem("assemblyid", e.target.value);
                }}
                error={error.nationalid}
              />
            </Col>
            <Col md={6}>
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label className="register-label">
                  تاريخ انتهاء الهوية
                </label>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={idexpire}
                  onChange={(e) => {
                    setIdexpire(e.target.value);
                    sessionStorage.setItem("assemblyidexpire", e.target.value);
                  }}
                  style={{ width: "100%" }}
                />
                {error.idexpire && (
                  <span className="error-text">{error.idexpire}</span>
                )}
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterSelect
                id="mem-status"
                label="فئة العضو *"
                options={[
                  { value: "1", label: "عضو مجلس ادارة" },
                  { value: "2", label: "عضو جمعية عمومية" },
                ]}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setMembertype("");
                  sessionStorage.setItem("assemblystatus", e.target.value);
                }}
                error={error.status}
              />
            </Col>
            <Col md={6}>
              <RegisterSelect
                id="mem-type"
                label="صفة / نوع العضوية"
                options={
                  memberTypeOptionsByStatus[status] || [
                    { value: "", label: "إختر نوع العضوية" },
                  ]
                }
                value={membertype}
                onChange={(e) => {
                  setMembertype(e.target.value);
                  sessionStorage.setItem("assemblymembertype", e.target.value);
                }}
                error={error.membertype}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label className="register-label">
                  تاريخ بداية العضوية
                </label>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={startmember}
                  onChange={(e) => {
                    setStartmember(e.target.value);
                    sessionStorage.setItem("assemblystartmember", e.target.value);
                  }}
                  style={{ width: "100%" }}
                />
              </div>
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="mem-fees"
                label="قيمة الإشتراك السنوي (ر.س)"
                type="number"
                value={fees}
                onChange={(e) => {
                  setFees(e.target.value);
                  sessionStorage.setItem("assemblyfees", e.target.value);
                }}
                error={error.fees}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label className="register-label">
                  تاريخ بداية الاشتراك
                </label>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={startjoin}
                  onChange={(e) => {
                    setStartjoin(e.target.value);
                    sessionStorage.setItem("assemblystartjoin", e.target.value);
                  }}
                  style={{ width: "100%" }}
                />
              </div>
            </Col>
            <Col md={6}>
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label className="register-label">
                  تاريخ انتهاء الاشتراك
                </label>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={endjoin}
                  onChange={(e) => {
                    setEndjoin(e.target.value);
                    sessionStorage.setItem("assemblyendjoin", e.target.value);
                  }}
                  style={{ width: "100%" }}
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="mem-job"
                label="المهنة"
                type="text"
                value={job}
                onChange={(e) => {
                  setJob(e.target.value);
                  sessionStorage.setItem("assemblyjob", e.target.value);
                }}
                error={error.job}
              />
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="mem-job-addr"
                label="عنوان العمل"
                type="text"
                value={jobAddress}
                onChange={(e) => {
                  setJobAddress(e.target.value);
                  sessionStorage.setItem("assemblyjobAddress", e.target.value);
                }}
                error={error.jobAddress}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="mem-notes"
                label="ملاحظات"
                type="text"
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  sessionStorage.setItem("assemblynotes", e.target.value);
                }}
                error={error.notes}
              />
            </Col>
            <Col md={6}>
              <UploadInput
                id="mem-paper"
                label="إرفاق مستند أو بطاقة"
                onChange={(e) => {
                  setUpload(e.target.files[0]);
                }}
                error={error.upload}
              />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            إغلاق
          </Button>
          {isSubmitting ? (
            <Button variant="primary" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              حفظ العضو
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* ── Edit Member Modal ── */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        className="modal-table archModal donor-modal"
        size="lg"
        centered
      >
        <Modal.Header>
          <Modal.Title>
            <FontAwesomeIcon
              icon={faPenToSquare}
              style={{ marginLeft: "8px", color: "var(--primary-color)" }}
            />
            تعديل بيانات العضو
          </Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowEditModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ paddingBottom: "0", direction: "rtl" }}>
          {isFetchingMember ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spinner
                animation="border"
                style={{ color: "var(--primary-color)" }}
              />
              <p style={{ marginTop: "10px", color: "var(--label-color)" }}>
                جاري تحميل بيانات العضو...
              </p>
            </div>
          ) : (
            <>
              <Row>
                <Col md={6}>
                  <RegisterTextbox
                    id="edit-mem-name"
                    label="إسم العضو *"
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    error={editError.name}
                  />
                </Col>
                <Col md={6}>
                  <div
                    className="mb-3"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label className="register-label">
                      تاريخ الميلاد
                    </label>
                    <input
                      type="date"
                      className="custom-datepicker"
                      value={editFormData.dob}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          dob: e.target.value,
                        })
                      }
                      style={{ width: "100%" }}
                    />
                    {editError.dob && (
                      <span className="error-text">{editError.dob}</span>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <RegisterTextbox
                    id="edit-mem-id"
                    label="رقم الهوية الوطنية / الإقامة"
                    type="text"
                    value={editFormData.nationalid}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        nationalid: e.target.value,
                      })
                    }
                    error={editError.nationalid}
                  />
                </Col>
                <Col md={6}>
                  <div
                    className="mb-3"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label className="register-label">
                      تاريخ انتهاء الهوية
                    </label>
                    <input
                      type="date"
                      className="custom-datepicker"
                      value={editFormData.idexpire}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          idexpire: e.target.value,
                        })
                      }
                      style={{ width: "100%" }}
                    />
                    {editError.idexpire && (
                      <span className="error-text">{editError.idexpire}</span>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <RegisterSelect
                    id="edit-mem-status"
                    label="فئة العضو *"
                    options={[
                      { value: "1", label: "عضو مجلس ادارة" },
                      { value: "2", label: "عضو جمعية عمومية" },
                    ]}
                    value={editFormData.status}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        status: e.target.value,
                        membertype: "",
                      })
                    }
                    error={editError.status}
                  />
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id="edit-mem-type"
                    label="صفة / نوع العضوية"
                    options={
                      memberTypeOptionsByStatus[editFormData.status] || [
                        { value: "", label: "إختر نوع العضوية" },
                      ]
                    }
                    value={editFormData.membertype}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        membertype: e.target.value,
                      })
                    }
                    error={editError.membertype}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div
                    className="mb-3"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label className="register-label">
                      تاريخ بداية العضوية
                    </label>
                    <input
                      type="date"
                      className="custom-datepicker"
                      value={editFormData.startmember}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          startmember: e.target.value,
                        })
                      }
                      style={{ width: "100%" }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="edit-mem-fees"
                    label="قيمة الإشتراك السنوي (ر.س)"
                    type="number"
                    value={editFormData.fees}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        fees: e.target.value,
                      })
                    }
                    error={editError.fees}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div
                    className="mb-3"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label className="register-label">
                      تاريخ بداية الاشتراك
                    </label>
                    <input
                      type="date"
                      className="custom-datepicker"
                      value={editFormData.startjoin}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          startjoin: e.target.value,
                        })
                      }
                      style={{ width: "100%" }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div
                    className="mb-3"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label className="register-label">
                      تاريخ انتهاء الاشتراك
                    </label>
                    <input
                      type="date"
                      className="custom-datepicker"
                      value={editFormData.endjoin}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          endjoin: e.target.value,
                        })
                      }
                      style={{ width: "100%" }}
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <RegisterTextbox
                    id="edit-mem-job"
                    label="المهنة"
                    type="text"
                    value={editFormData.job}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, job: e.target.value })
                    }
                    error={editError.job}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="edit-mem-job-addr"
                    label="عنوان العمل"
                    type="text"
                    value={editFormData.jobAddress}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        jobAddress: e.target.value,
                      })
                    }
                    error={editError.jobAddress}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <RegisterTextbox
                    id="edit-mem-notes"
                    label="ملاحظات"
                    type="text"
                    value={editFormData.notes}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        notes: e.target.value,
                      })
                    }
                    error={editError.notes}
                  />
                </Col>
                <Col md={6}>
                  <UploadInput
                    id="edit-mem-paper"
                    label="تحديث المستند أو البطاقة (اختياري)"
                    onChange={(e) => {
                      setEditFormData({
                        ...editFormData,
                        upload: e.target.files[0],
                      });
                    }}
                    error={editError.upload}
                  />
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            إلغاء
          </Button>
          {isEditSubmitting ? (
            <Button variant="primary" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleEditSubmit}
              disabled={isFetchingMember}
            >
              حفظ التعديلات
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        className="modal-table archModal donor-modal delete-modal"
        centered
        size="md"
      >
        <Modal.Header>
          <Modal.Title style={{ color: "#e53e3e" }}>
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              style={{ marginLeft: "8px" }}
            />
            تأكيد حذف العضو
          </Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowDeleteModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>

        <Modal.Body
          style={{ padding: "24px", direction: "rtl", textAlign: "right" }}
        >
          <p
            style={{
              fontSize: "15px",
              color: "var(--text-color)",
              marginBottom: "10px",
            }}
          >
            هل أنت متأكد من رغبتك في حذف العضو{" "}
            <strong>"{deletingMember?.name || ""}"</strong>؟
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "var(--label-color)",
              margin: 0,
            }}
          >
            سيتم حذف العضو وجميع بياناته بشكل نهائي من النظام، ولن تتمكن من
            استرجاعها.
          </p>
        </Modal.Body>

        <Modal.Footer style={{ justifyContent: "flex-start", gap: "10px" }}>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            إلغاء
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            style={{
              backgroundColor: "#e53e3e",
              borderColor: "#e53e3e",
              color: "#fff",
              fontWeight: "700",
            }}
          >
            {isDeleting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faTrashCan}
                  style={{ marginLeft: "6px" }}
                />
                تأكيد الحذف
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AssociationMembersReport;
