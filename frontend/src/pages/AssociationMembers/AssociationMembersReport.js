import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsersBetweenLines,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "../CaseDetails/CaseDetails.css";
import "./associationMembers.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/TableComponent";
import NewButton from "../../components/NewButton";
import { Modal, Row, Col, Button, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import UploadInput from "../../components/UploadInput";
import API from "../../api/axiosConfig";

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

    if (dob && dob > today) {
      newErrors.dob = "تاريخ الميلاد لا يمكن أن يكون في المستقبل";
    }
    if (endjoin && endjoin < today) {
      newErrors.endjoin = "تاريخ انتهاء الاشتراك لا يمكن أن يكون في الماضي";
    }
    if (idexpire && idexpire < today) {
      newErrors.idexpire = "تاريخ انتهاء الهوية لا يمكن أن يكون في الماضي";
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

  const dropdownOptions = [
    { label: "تعديل", route: "/showAssociationMembers/:id" },
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
    </div>
  );
}

export default AssociationMembersReport;
