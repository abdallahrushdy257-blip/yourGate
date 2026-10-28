import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsersBetweenLines,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "../CaseDetails/CaseDetails.css";
import "./associationMembers.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/TableComponent";
import NewButton from "../../components/NewButton";
import { Modal, Row, Col, Button, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import UploadInput from "../../components/UploadInput";
import API from "../../api/axiosConfig";
import { toast } from "react-toastify";

function AssociationMembersReport(params) {
  const columns = [
    { name: "رقم العضو", key: "membership_serial" },
    { name: "اسم العضو", key: "name" },
    { name: "نوع العضوية", key: "status" },
    { name: "تاريخ العضوية", key: "start_membership_date" },
    { name: "تاريخ الإشتراك", key: "start_subscription_date" },
    { name: "", key: "actions" },
  ];

  const [rows, setRows] = useState([]);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const navigate = useNavigate();

  // ── Add Modal state ─────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  const [name, setName] = useState(
    () => sessionStorage.getItem("assemblyname") || "",
  );
  const [dob, setDob] = useState(
    () =>
      sessionStorage.getItem("assemblydob") ||
      new Date().toISOString().substr(0, 10),
  );
  const [nationalid, setNationalid] = useState(
    () => sessionStorage.getItem("assemblyid") || "",
  );
  const [idexpire, setIdexpire] = useState(
    () =>
      sessionStorage.getItem("assemblyidexpire") ||
      new Date().toISOString().substr(0, 10),
  );
  const [startjoin, setStartjoin] = useState(
    () =>
      sessionStorage.getItem("assemblystartjoin") ||
      new Date().toISOString().substr(0, 10),
  );
  const [endjoin, setEndjoin] = useState(
    () =>
      sessionStorage.getItem("assemblyendjoin") ||
      new Date().toISOString().substr(0, 10),
  );
  const [status, setStatus] = useState(
    () => sessionStorage.getItem("assemblystatus") || "",
  );
  const [membertype, setMembertype] = useState(
    () => sessionStorage.getItem("assemblymembertype") || "",
  );
  const [job, setJob] = useState(
    () => sessionStorage.getItem("assemblyjob") || "",
  );
  const [jobAddress, setJobAddress] = useState(
    () => sessionStorage.getItem("assemblyjobAddress") || "",
  );
  const [fees, setFees] = useState(
    () => sessionStorage.getItem("assemblyfees") || "",
  );
  const [notes, setNotes] = useState(
    () => sessionStorage.getItem("assemblynotes") || "",
  );
  const [startmember, setStartmember] = useState(
    () =>
      sessionStorage.getItem("assemblystartmember") ||
      new Date().toISOString().substr(0, 10),
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
    setStatus("");
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

    
    // Client-side validation
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!name) {
      toast.error("حقل الاسم مطلوب");
      return;
    }

    if (dob && dob > today) {
      toast.error("تاريخ الميلاد لا يمكن أن يكون في المستقبل");
      return;
    }
    if (endjoin && endjoin < today) {
      toast.error("تاريخ انتهاء الاشتراك لا يمكن أن يكون في الماضي");
      return;
    }
    if (idexpire && idexpire < today) {
      toast.error("تاريخ انتهاء الهوية لا يمكن أن يكون في الماضي");
      return;
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
    formData.append("fees", fees);
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

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("-");
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  // ── Edit Member Modal State & Handlers ──────────────────
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState({});
  const [editId, setEditId] = useState(null);
  const isFetchingEditRef = useRef(false);

  const [editName, setEditName] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editNationalid, setEditNationalid] = useState("");
  const [editIdexpire, setEditIdexpire] = useState("");
  const [editStartjoin, setEditStartjoin] = useState("");
  const [editEndjoin, setEditEndjoin] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editMembertype, setEditMembertype] = useState("");
  const [editJob, setEditJob] = useState("");
  const [editJobAddress, setEditJobAddress] = useState("");
  const [editFees, setEditFees] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editStartmember, setEditStartmember] = useState("");
  const [editUpload, setEditUpload] = useState(null);

  const handleOpenEditModal = async (memberId, record) => {
    if (isFetchingEditRef.current) return;
    isFetchingEditRef.current = true;
    setEditId(memberId);
    setEditError({});

    try {
      const res = await API.get(`/assemblymembers/${memberId}`);
      const m = res.data?.data || res.data || record || {};
      setEditName(m.name || "");
      setEditDob(formatDateForInput(m.dateofbirth || m.dob || ""));
      setEditNationalid(m.nationalid || "");
      setEditIdexpire(
        formatDateForInput(m.nationalid_expire || m.idexpire || ""),
      );
      setEditStartjoin(
        formatDateForInput(m.start_subscription_date || m.startjoin || ""),
      );
      setEditEndjoin(
        formatDateForInput(m.end_subscription_date || m.endjoin || ""),
      );
      setEditStatus(m.status !== undefined ? String(m.status) : "");
      setEditMembertype(
        m.subscription_type !== undefined
          ? String(m.subscription_type)
          : m.membertype !== undefined
            ? String(m.membertype)
            : "",
      );
      setEditJob(m.job || "");
      setEditJobAddress(m.jobaddress || m.jobAddress || "");
      setEditFees(
        m.subscription_fees !== undefined
          ? m.subscription_fees
          : m.fees || "",
      );
      setEditNotes(m.notes || "");
      setEditStartmember(
        formatDateForInput(m.start_membership_date || m.startmember || ""),
      );
      setEditUpload(null);
      setShowEditModal(true);
    } catch (err) {
      console.error(err);
      const m = record || {};
      setEditName(m.name || "");
      setEditDob(formatDateForInput(m.dateofbirth || m.dob || ""));
      setEditNationalid(m.nationalid || "");
      setEditIdexpire(
        formatDateForInput(m.nationalid_expire || m.idexpire || ""),
      );
      setEditStartjoin(
        formatDateForInput(m.start_subscription_date || m.startjoin || ""),
      );
      setEditEndjoin(
        formatDateForInput(m.end_subscription_date || m.endjoin || ""),
      );
      setEditStatus(m.status !== undefined ? String(m.status) : "");
      setEditMembertype(
        m.subscription_type !== undefined
          ? String(m.subscription_type)
          : "",
      );
      setEditJob(m.job || "");
      setEditJobAddress(m.jobaddress || "");
      setEditFees(m.subscription_fees || "");
      setEditNotes(m.notes || "");
      setEditStartmember(
        formatDateForInput(m.start_membership_date || ""),
      );
      setEditUpload(null);
      setShowEditModal(true);
    } finally {
      isFetchingEditRef.current = false;
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (isEditSubmitting) return;

    if (!editName) {
      return toast.error("حقل الاسم مطلوب");
    }

    const today = new Date().toISOString().split("T")[0];
    if (editDob && editDob > today) {
      return toast.error("تاريخ الميلاد لا يمكن أن يكون في المستقبل");
    }
    if (editEndjoin && editEndjoin < today) {
      return toast.error("تاريخ انتهاء الاشتراك لا يمكن أن يكون في الماضي");
    }
    if (editIdexpire && editIdexpire < today) {
      return toast.error("تاريخ انتهاء الهوية لا يمكن أن يكون في الماضي");
    }

    setIsEditSubmitting(true);
    const formData = new FormData();
    formData.append("id", editId);
    formData.append("name", editName);
    formData.append("dob", editDob);
    formData.append("nationalid", editNationalid);
    formData.append("idexpire", editIdexpire);
    formData.append("startjoin", editStartjoin);
    formData.append("endjoin", editEndjoin);
    formData.append("membertype", editMembertype);
    formData.append("startmember", editStartmember);
    formData.append("job", editJob);
    formData.append("jobAddress", editJobAddress);
    formData.append("fees", editFees);
    formData.append("notes", editNotes);
    formData.append("status", editStatus);
    if (editUpload) {
      formData.append("upload", editUpload);
    }

    try {
      const res = await API.post("/assemblymembers/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) {
        toast.success("تم تعديل بيانات العضو بنجاح");
        setShowEditModal(false);
        setTableReloadKey(Date.now());
      } else {
        setEditError(res.data?.errors || {});
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "حدث خطأ أثناء تعديل بيانات العضو",
      );
      setEditError(err.response?.data?.errors || {});
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const dropdownOptions = [
    {
      label: "تعديل",
      action: (id, record) => {
        handleOpenEditModal(id, record);
      },
    },
    { label: "سند قبض", route: "/associationMemberspayment/:id" },
    { label: "سند دفع", route: "/associationMembersRecieve/:id" },
  ];

  const modifyRow = (row) => {
    let modifiedRow = { ...row };
    modifiedRow.status =
      modifiedRow.status === 1 ? "عضو مجلس ادارة" : " عضو جمعية عمومية";
    return modifiedRow;
  };

  return (
    <div className="ass-mem">
      <div className="printcasedata-container">
        {/* <NewButton name={"عضو"} onClick={() => setShowModal(true)} /> */}
        <TableComponent
          apiUrl="/assemblymembers"
          columns={columns}
          title="تقرير الأعضاء"
          titleIcon={<FontAwesomeIcon icon={faUsersBetweenLines} />}
          dropdownOptions={dropdownOptions}
          transformRowFn={modifyRow}
          triggerReload={tableReloadKey}
          addBtn={true}
          onAddClick={() => setShowModal(true)}
          addBtnName="عضو"
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
          <Modal.Title>إضافة عضو</Modal.Title>
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
                label="إسم العضو"
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
                <p style={{ marginBottom: "10px", textAlign: "right" }}>
                  تاريخ الميلاد
                </p>
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
                  <span className="error-text" style={{ color: "red" }}>
                    {error.dob}
                  </span>
                )}
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="mem-id"
                label="رقم الهوية"
                type="number"
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
                <p style={{ marginBottom: "10px", textAlign: "right" }}>
                  تاريخ انتهاء الهوية
                </p>
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
                  <span className="error-text" style={{ color: "red" }}>
                    {error.idexpire}
                  </span>
                )}
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <p style={{ marginBottom: "10px", textAlign: "right" }}>
                  تاريخ بداية الاشتراك
                </p>
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
                {error.startjoin && (
                  <span className="error-text" style={{ color: "red" }}>
                    {error.startjoin}
                  </span>
                )}
              </div>
            </Col>
            <Col md={6}>
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <p style={{ marginBottom: "10px", textAlign: "right" }}>
                  تاريخ انتهاء الاشتراك
                </p>
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
                {error.endjoin && (
                  <span className="error-text" style={{ color: "red" }}>
                    {error.endjoin}
                  </span>
                )}
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterSelect
                id="mem-status"
                label="نوع العضو"
                options={[
                  { value: "", label: "إختر نوع العضو" },
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
                label="نوع العضوية"
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
                disabled={!status}
              />
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
                id="mem-fees"
                label="قيمة الإشتراك السنوي"
                type="number"
                value={fees}
                onChange={(e) => {
                  setFees(e.target.value);
                  sessionStorage.setItem("assemblyfees", e.target.value);
                }}
                error={error.fees}
              />
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="mem-notes"
                label="ملاحظات اخري"
                type="text"
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  sessionStorage.setItem("assemblynotes", e.target.value);
                }}
                error={error.notes}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <p style={{ marginBottom: "10px", textAlign: "right" }}>
                  تاريخ بداية العضوية
                </p>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={startmember}
                  onChange={(e) => {
                    setStartmember(e.target.value);
                    sessionStorage.setItem(
                      "assemblystartmember",
                      e.target.value,
                    );
                  }}
                  style={{ width: "100%" }}
                />
                {error.startmember && (
                  <span className="error-text" style={{ color: "red" }}>
                    {error.startmember}
                  </span>
                )}
              </div>
            </Col>
            <Col style={{ marginTop: "16px" }} md={6}>
              <UploadInput
                id="mem-paper"
                label="إرفاق اوراق اخري"
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
              حفظ
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
          <Modal.Title>تعديل بيانات العضو</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowEditModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ paddingBottom: "0", direction: "rtl" }}>
          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="edit-mem-name"
                label="إسم العضو *"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                error={editError.name}
              />
            </Col>
            <Col md={6}>
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <p style={{ marginBottom: "10px", textAlign: "right" }}>
                  تاريخ الميلاد
                </p>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                  style={{ width: "100%" }}
                />
                {editError.dob && (
                  <span className="error-text" style={{ color: "red" }}>
                    {editError.dob}
                  </span>
                )}
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="edit-mem-id"
                label="رقم الهوية"
                type="number"
                value={editNationalid}
                onChange={(e) => setEditNationalid(e.target.value)}
                error={editError.nationalid}
              />
            </Col>
            <Col md={6}>
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <p style={{ marginBottom: "10px", textAlign: "right" }}>
                  تاريخ انتهاء الهوية
                </p>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={editIdexpire}
                  onChange={(e) => setEditIdexpire(e.target.value)}
                  style={{ width: "100%" }}
                />
                {editError.idexpire && (
                  <span className="error-text" style={{ color: "red" }}>
                    {editError.idexpire}
                  </span>
                )}
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <p style={{ marginBottom: "10px", textAlign: "right" }}>
                  تاريخ بداية الاشتراك
                </p>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={editStartjoin}
                  onChange={(e) => setEditStartjoin(e.target.value)}
                  style={{ width: "100%" }}
                />
                {editError.startjoin && (
                  <span className="error-text" style={{ color: "red" }}>
                    {editError.startjoin}
                  </span>
                )}
              </div>
            </Col>
            <Col md={6}>
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <p style={{ marginBottom: "10px", textAlign: "right" }}>
                  تاريخ انتهاء الاشتراك
                </p>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={editEndjoin}
                  onChange={(e) => setEditEndjoin(e.target.value)}
                  style={{ width: "100%" }}
                />
                {editError.endjoin && (
                  <span className="error-text" style={{ color: "red" }}>
                    {editError.endjoin}
                  </span>
                )}
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterSelect
                id="edit-mem-status"
                label="نوع العضو"
                options={[
                  { value: "", label: "إختر نوع العضو" },
                  { value: "1", label: "عضو مجلس ادارة" },
                  { value: "2", label: "عضو جمعية عمومية" },
                ]}
                value={editStatus}
                onChange={(e) => {
                  setEditStatus(e.target.value);
                  setEditMembertype("");
                }}
                error={editError.status}
              />
            </Col>
            <Col md={6}>
              <RegisterSelect
                id="edit-mem-type"
                label="نوع العضوية"
                options={
                  memberTypeOptionsByStatus[editStatus] || [
                    { value: "", label: "إختر نوع العضوية" },
                  ]
                }
                value={editMembertype}
                onChange={(e) => setEditMembertype(e.target.value)}
                error={editError.membertype}
                disabled={!editStatus}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="edit-mem-job"
                label="المهنة"
                type="text"
                value={editJob}
                onChange={(e) => setEditJob(e.target.value)}
                error={editError.job}
              />
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="edit-mem-job-addr"
                label="عنوان العمل"
                type="text"
                value={editJobAddress}
                onChange={(e) => setEditJobAddress(e.target.value)}
                error={editError.jobAddress}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="edit-mem-fees"
                label="قيمة الإشتراك السنوي"
                type="number"
                value={editFees}
                onChange={(e) => setEditFees(e.target.value)}
                error={editError.fees}
              />
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="edit-mem-notes"
                label="ملاحظات اخري"
                type="text"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                error={editError.notes}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div
                className="mb-3"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <p style={{ marginBottom: "10px", textAlign: "right" }}>
                  تاريخ بداية العضوية
                </p>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={editStartmember}
                  onChange={(e) => setEditStartmember(e.target.value)}
                  style={{ width: "100%" }}
                />
                {editError.startmember && (
                  <span className="error-text" style={{ color: "red" }}>
                    {editError.startmember}
                  </span>
                )}
              </div>
            </Col>
            <Col style={{ marginTop: "16px" }} md={6}>
              <UploadInput
                id="edit-mem-paper"
                label="إرفاق اوراق اخري (اختياري)"
                onChange={(e) => setEditUpload(e.target.files[0])}
                error={editError.upload}
              />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEditModal(false)}
            disabled={isEditSubmitting}
          >
            إلغاء
          </Button>
          <Button
            variant="primary"
            onClick={handleEditSubmit}
            disabled={isEditSubmitting}
          >
            {isEditSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="ms-2" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              "حفظ التعديلات"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AssociationMembersReport;
