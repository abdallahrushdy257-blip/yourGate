import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faClock,
  faPlus,
  faTrashCan,
  faCheckToSlot,
} from "@fortawesome/free-solid-svg-icons";
import { Spinner, Modal, Nav, Button } from "react-bootstrap";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import TableComponent from "../../components/TableComponent";
import { toast } from "react-toastify";
import "./VacationRequest.css";

function VacationRequest() {
  const [activeTab, setActiveTab] = useState("vacations");
  const [employees, setEmployees] = useState([]);
  const [vacationTypes, setVacationTypes] = useState([]);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Decision Modal State
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [decisionStatus, setDecisionStatus] = useState("");
  const [isSavingDecision, setIsSavingDecision] = useState(false);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Active Request Type inside Modal ('vac' or 'per')
  const [selectedRequestType, setSelectedRequestType] = useState("vac");

  // Form State
  const [formData, setFormData] = useState({
    empId: "",
    vacTypeId: "",
    description: "",
    from: new Date().toISOString().substring(0, 10),
    to: new Date().toISOString().substring(0, 10),
    permDate: new Date().toISOString().substring(0, 10),
    permFromTime: "08:00",
    permToTime: "10:00",
    note: "",
  });
  const [upload, setUpload] = useState(null);

  const resetForm = () => {
    setFormData({
      empId: "",
      vacTypeId: "",
      description: "",
      from: new Date().toISOString().substring(0, 10),
      to: new Date().toISOString().substring(0, 10),
      permDate: new Date().toISOString().substring(0, 10),
      permFromTime: "08:00",
      permToTime: "10:00",
      note: "",
    });
    setUpload(null);
    setError({});
  };

  const getInitialData = async () => {
    try {
      const [empRes, vacRes] = await Promise.all([
        API.post("employees"),
        API.post("vacations"),
      ]);
      setEmployees(Array.isArray(empRes.data) ? empRes.data : (empRes.data?.data || []));
      setVacationTypes(Array.isArray(vacRes.data) ? vacRes.data : (vacRes.data?.data || []));
    } catch (err) {
      console.error("Error loading dropdown data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInitialData();
  }, []);

  const handleOpenAdd = (type) => {
    setSelectedRequestType(type);
    resetForm();
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const mForm = new FormData();

    if (selectedRequestType === "vac") {
      if (!formData.empId) {
        setError({ empId: "يرجى اختيار الموظف" });
        setIsSubmitting(false);
        return;
      }
      if (!formData.vacTypeId) {
        setError({ vacTypeId: "يرجى اختيار نوع الإجازة" });
        setIsSubmitting(false);
        return;
      }

      mForm.append("name", formData.empId);
      mForm.append("type", formData.vacTypeId);
      mForm.append("description", formData.description);
      mForm.append("from", formData.from);
      mForm.append("to", formData.to);
      if (upload) mForm.append("upload", upload);

      try {
        await API.post("/vacationrequests/store", mForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("تم تقديم طلب الإجازة بنجاح");
        setShowModal(false);
        resetForm();
        setRefreshKey(Date.now());
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.errors || {});
        toast.error(err.response?.data?.message || "حدث خطأ أثناء تقديم طلب الإجازة");
      }
    } else {
      if (!formData.empId) {
        setError({ empId: "يرجى اختيار الموظف" });
        setIsSubmitting(false);
        return;
      }

      mForm.append("name", formData.empId);
      mForm.append("date", formData.permDate);
      mForm.append("from_time", formData.permFromTime);
      mForm.append("to_time", formData.permToTime);
      mForm.append("note", formData.note);
      if (upload) mForm.append("upload", upload);

      try {
        await API.post("/leaverequests/store", mForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("تم تقديم طلب الإذن بنجاح");
        setShowModal(false);
        resetForm();
        setRefreshKey(Date.now());
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.errors || {});
        toast.error(err.response?.data?.message || "حدث خطأ أثناء تقديم طلب الإذن");
      }
    }
    setIsSubmitting(false);
  };

  const handleDecisionSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!decisionStatus) {
      toast.warn("يرجى اختيار حالة القرار");
      return;
    }
    setIsSavingDecision(true);
    try {
      const endpoint =
        activeTab === "vacations"
          ? "/vacationrequests/status/update"
          : "/leaverequests/status/update";

      await API.post(endpoint, {
        id: selectedId,
        status: decisionStatus,
      });

      toast.success("تم تحديث حالة الطلب بنجاح");
      setShowDecisionModal(false);
      setSelectedId(null);
      setDecisionStatus("");
      setRefreshKey(Date.now());
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تحديث حالة الطلب");
    } finally {
      setIsSavingDecision(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      const endpoint =
        activeTab === "vacations"
          ? `/vacationrequests/${deleteModal.id}`
          : `/leaverequests/${deleteModal.id}`;

      await API.delete(endpoint);
      toast.success(
        activeTab === "vacations"
          ? "تم حذف طلب الإجازة بنجاح"
          : "تم حذف طلب الإذن بنجاح"
      );
      setDeleteModal({ show: false, id: null });
      setRefreshKey(Date.now());
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء حذف الطلب");
    } finally {
      setIsDeleting(false);
    }
  };

  // Status Badge Formatter
  const renderStatusBadge = (s) => {
    if (s === "مقبول" || s === "موافقة" || s === 1 || s === "1") {
      return '<span style="background: rgba(40, 167, 69, 0.12); color: #28a745; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 13px;">مقبول</span>';
    }
    if (s === "مرفوض" || s === "مرفوضة" || s === 2 || s === "2") {
      return '<span style="background: rgba(220, 53, 69, 0.12); color: #dc3545; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 13px;">مرفوض</span>';
    }
    return '<span style="background: rgba(255, 193, 7, 0.18); color: #b8860b; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 13px;">قيد الانتظار</span>';
  };

  const modifyVacationRow = (row) => {
    return {
      ...row,
      status: renderStatusBadge(row.status),
    };
  };

  const modifyPermissionRow = (row) => {
    const rawType = row.type;
    const typesMap = {
      1: "أثناء اليوم",
      2: "تأخير",
      3: "انصراف مبكر",
      4: "مراجعة المستشفى",
      5: "مرضي",
      6: "حمل",
      7: "أخرى",
    };
    return {
      ...row,
      type: typesMap[rawType] || rawType || "إذن عمل",
      status: renderStatusBadge(row.status),
    };
  };

  // Table Columns
  const vacationColumns = [
    { name: "اسم الموظف", key: "name" },
    { name: "النوع", key: "vacationname" },
    { name: "من", key: "startdate" },
    { name: "إلى", key: "enddate" },
    { name: "حالة الإجازة", key: "status" },
    { name: "الوصف", key: "description" },
    { name: "الإجراءات", key: "actions" },
  ];

  const permissionColumns = [
    { name: "اسم الموظف", key: "name" },
    { name: "نوع الإذن", key: "type" },
    { name: "التاريخ", key: "date" },
    { name: "عدد الساعات", key: "hours" },
    { name: "حالة الإذن", key: "status" },
    { name: "ملاحظات", key: "note" },
    { name: "الإجراءات", key: "actions" },
  ];

  // Dropdown Options
  const vacationOptions = [
    {
      label: "الرد على الإجازة",
      action: (id) => {
        setSelectedId(id);
        setDecisionStatus("");
        setShowDecisionModal(true);
      },
    },
    {
      label: "حذف الطلب",
      action: (id) => {
        setDeleteModal({ show: true, id });
      },
    },
  ];

  const permissionOptions = [
    {
      label: "الرد على الإذن",
      action: (id) => {
        setSelectedId(id);
        setDecisionStatus("");
        setShowDecisionModal(true);
      },
    },
    {
      label: "حذف الطلب",
      action: (id) => {
        setDeleteModal({ show: true, id });
      },
    },
  ];

  if (loading) {
    return <TestPreLoader />;
  }

  return (
    <div className="vacation-management-page">
      {/* ── Subsystem Tabs ── */}
      <div className="management-tabs mb-4 no-print">
        <Nav className="nav-pills rounded-pill shadow-sm">
          <Nav.Item>
            <div
              onClick={() => setActiveTab("vacations")}
              className={`tab-pill ${activeTab === "vacations" ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
              إدارة الإجازات
            </div>
          </Nav.Item>
          <Nav.Item>
            <div
              onClick={() => setActiveTab("permissions")}
              className={`tab-pill ${activeTab === "permissions" ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faClock} />
              إدارة الأذونات
            </div>
          </Nav.Item>
        </Nav>
      </div>

      {/* ── Table Container ── */}
      <div className="hrReports-tabel">
        {activeTab === "vacations" ? (
          <TableComponent
            key={`vac-${refreshKey}`}
            apiUrl="/vacationrequests"
            columns={vacationColumns}
            titleIcon={<FontAwesomeIcon icon={faCalendarCheck} />}
            title="إدارة طلبات الإجازات"
            dropdownOptions={vacationOptions}
            triggerReload={refreshKey}
            transformRowFn={modifyVacationRow}
            addBtn={true}
            addBtnName="إجازة"
            onAddClick={() => handleOpenAdd("vac")}
          />
        ) : (
          <TableComponent
            key={`perm-${refreshKey}`}
            apiUrl="/leaverequests"
            columns={permissionColumns}
            titleIcon={<FontAwesomeIcon icon={faClock} />}
            title="إدارة طلبات الأذونات"
            dropdownOptions={permissionOptions}
            triggerReload={refreshKey}
            transformRowFn={modifyPermissionRow}
            addBtn={true}
            addBtnName="إذن"
            onAddClick={() => handleOpenAdd("per")}
          />
        )}
      </div>

      {/* ── Add Request Modal (Customized by Type: Vacation vs Permission) ── */}
      <Modal
        show={showModal}
        onHide={() => !isSubmitting && setShowModal(false)}
        size="lg"
        centered
        dir="rtl"
        dialogClassName="vacation-request-modal"
      >
        <Modal.Header closeButton>
          <div className="vac-modal-title">
            <span className="vac-modal-title-icon">
              <FontAwesomeIcon
                icon={selectedRequestType === "vac" ? faCalendarCheck : faClock}
              />
            </span>
            <span>
              {selectedRequestType === "vac"
                ? "إضافة طلب إجازة"
                : "إضافة طلب إذن"}
            </span>
          </div>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="vac-form-grid">
              {/* Employee Selection */}
              <div className="vac-field-group vac-full-width">
                <label className="vac-field-label">
                  اسم الموظف <span className="req">*</span>
                </label>
                <select
                  className="vac-select"
                  value={formData.empId}
                  onChange={(e) =>
                    setFormData({ ...formData, empId: e.target.value })
                  }
                >
                  <option value="">اختر الموظف...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} {emp.jobname ? `(${emp.jobname})` : ""}
                    </option>
                  ))}
                </select>
                {error.empId && (
                  <span className="vac-field-error">{error.empId}</span>
                )}
              </div>

              {/* ── Vacation Specific Fields ── */}
              {selectedRequestType === "vac" ? (
                <>
                  <div className="vac-field-group vac-full-width">
                    <label className="vac-field-label">
                      نوع الإجازة <span className="req">*</span>
                    </label>
                    <select
                      className="vac-select"
                      value={formData.vacTypeId}
                      onChange={(e) =>
                        setFormData({ ...formData, vacTypeId: e.target.value })
                      }
                    >
                      <option value="">اختر نوع الإجازة...</option>
                      {vacationTypes.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.days} يوم)
                        </option>
                      ))}
                    </select>
                    {error.vacTypeId && (
                      <span className="vac-field-error">{error.vacTypeId}</span>
                    )}
                  </div>

                  <div className="vac-field-group">
                    <label className="vac-field-label">من تاريخ</label>
                    <input
                      type="date"
                      className="vac-input"
                      value={formData.from}
                      onChange={(e) =>
                        setFormData({ ...formData, from: e.target.value })
                      }
                    />
                  </div>

                  <div className="vac-field-group">
                    <label className="vac-field-label">إلى تاريخ</label>
                    <input
                      type="date"
                      className="vac-input"
                      value={formData.to}
                      onChange={(e) =>
                        setFormData({ ...formData, to: e.target.value })
                      }
                    />
                  </div>

                  <div className="vac-field-group vac-full-width">
                    <label className="vac-field-label">وصف الإجازة / الملاحظات</label>
                    <textarea
                      rows={3}
                      className="vac-input"
                      placeholder="أدخل سبب أو تفاصيل طلب الإجازة..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>
                </>
              ) : (
                /* ── Permission Specific Fields ── */
                <>
                  <div className="vac-field-group vac-full-width">
                    <label className="vac-field-label">تاريخ الإذن</label>
                    <input
                      type="date"
                      className="vac-input"
                      value={formData.permDate}
                      onChange={(e) =>
                        setFormData({ ...formData, permDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="vac-field-group">
                    <label className="vac-field-label">وقت البداية (من)</label>
                    <input
                      type="time"
                      className="vac-input"
                      value={formData.permFromTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          permFromTime: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="vac-field-group">
                    <label className="vac-field-label">وقت النهاية (إلى)</label>
                    <input
                      type="time"
                      className="vac-input"
                      value={formData.permToTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          permToTime: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="vac-field-group vac-full-width">
                    <label className="vac-field-label">سبب الإذن / الملاحظات</label>
                    <textarea
                      rows={3}
                      className="vac-input"
                      placeholder="أدخل سبب الإذن أو ملاحظاتك..."
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {/* Document Upload Zone */}
              <div className="vac-field-group vac-full-width">
                <label className="vac-field-label">
                  {selectedRequestType === "vac"
                    ? "مستند الإجازة (اختياري)"
                    : "مستند الإذن (اختياري)"}
                </label>
                <div className="vac-upload-zone">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setUpload(e.target.files[0])}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              className="vac-btn-cancel"
              onClick={() => setShowModal(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="vac-btn-save"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner animation="border" size="sm" />
              ) : selectedRequestType === "vac" ? (
                "تقديم طلب الإجازة"
              ) : (
                "تقديم طلب الإذن"
              )}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* ── Decision Modal (الرد على الطلب) ── */}
      <Modal
        show={showDecisionModal}
        onHide={() => !isSavingDecision && setShowDecisionModal(false)}
        centered
        size="md"
        dir="rtl"
        dialogClassName="vacation-request-modal"
      >
        <Modal.Header closeButton>
          <div className="vac-modal-title">
            <span className="vac-modal-title-icon">
              <FontAwesomeIcon icon={faCheckToSlot} />
            </span>
            <span>
              {activeTab === "vacations"
                ? "اتخاذ قرار بشأن طلب الإجازة"
                : "اتخاذ قرار بشأن طلب الإذن"}
            </span>
          </div>
        </Modal.Header>
        <form onSubmit={handleDecisionSubmit}>
          <Modal.Body>
            <div className="vac-field-group">
              <label className="vac-field-label">
                القرار المتخذ <span className="req">*</span>
              </label>
              <select
                className="vac-select"
                value={decisionStatus}
                onChange={(e) => setDecisionStatus(e.target.value)}
                required
              >
                <option value="">اختر حالة القرار...</option>
                <option value="مقبول">موافقة وقبول الطلب</option>
                <option value="مرفوض">رفض الطلب</option>
                <option value="قيد الانتظار">قيد الانتظار والدراسة</option>
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="vac-btn-cancel"
              onClick={() => setShowDecisionModal(false)}
              disabled={isSavingDecision}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="vac-btn-save"
              disabled={isSavingDecision}
            >
              {isSavingDecision ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "حفظ القرار"
              )}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        show={deleteModal.show}
        onHide={() => !isDeleting && setDeleteModal({ show: false, id: null })}
        centered
        size="sm"
        dir="rtl"
        dialogClassName="vacation-request-modal"
      >
        <Modal.Header closeButton>
          <div className="vac-modal-title">
            <span
              className="vac-modal-title-icon"
              style={{ background: "rgba(220, 53, 69, 0.15)", color: "#dc3545" }}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </span>
            <span>تأكيد الحذف</span>
          </div>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ margin: 0, fontSize: "14.5px", color: "#493d2c" }}>
            هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟
          </p>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center", gap: "10px" }}>
          <button
            type="button"
            className="vac-btn-cancel"
            onClick={() => setDeleteModal({ show: false, id: null })}
            disabled={isDeleting}
          >
            إلغاء
          </button>
          <Button
            variant="danger"
            style={{ borderRadius: "10px", padding: "8px 24px", fontWeight: 600 }}
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner animation="border" size="sm" /> : "حذف"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VacationRequest;
