import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faXmark } from "@fortawesome/free-solid-svg-icons";
import "../CaseDetails/CaseDetails.css";
import API from "../../api/axiosConfig";
import TableComponent from "../../components/TableComponent";
import NewButton from "../../components/NewButton";
import { Button, Modal, Spinner, Row, Col } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import { useNavigate } from "react-router-dom";
import BeneficiarySubModal from "./BeneficiarySubModal";

function Beneficiary(props) {
  const columns = [
    { name: "إسم المستفيد", key: "name" },
    { name: "تاريخ الميلاد", key: "dateofbirth" },
    { name: "النوع", key: "gender_string" },
    { name: "الحالة الإجتماعية", key: "social_status_string" },
    { name: "دراسة الحالة", key: "case_status_badge" },
    { name: "", key: "actions" },
  ];

  const transformRow = (row) => {
    const rawDecision = row.case_status_string || row.case_status || "موافقة";
    const statusConfig = {
      موافقة: { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7", icon: "✓" },
      معلق: { bg: "#fff8e1", color: "#f57f17", border: "#ffe082", icon: "⏳" },
      مرفوض: { bg: "#ffebee", color: "#c62828", border: "#ef9a9a", icon: "✕" },
    }[rawDecision] || { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7", icon: "✓" };

    const badge = `<span style="background:${statusConfig.bg};color:${statusConfig.color};border:1px solid ${statusConfig.border};padding:4px 12px;border-radius:14px;font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:4px;">${statusConfig.icon} ${rawDecision}</span>`;

    return {
      ...row,
      social_status_string: row.social_status_string || row.status_string || "-",
      case_status_badge: badge,
      case_status_string: badge,
    };
  };

  const [rows, setRows] = useState([]);
  const [tableReloadKey, setTableReloadKey] = useState(0);
  const navigate = useNavigate();

  // ── Modal state ─────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [humancasetype, setHumancasetype] = useState("");
  const [status, setStatus] = useState("");
  const [nationality, setNationality] = useState("");
  const [familyCount, setFamilyCount] = useState("");
  const [mobileNum, setMobileNum] = useState("");
  const [email, setEmail] = useState("");
  const [accnumber, setAccnumber] = useState("");
  const [idnumber, setIdnumber] = useState("");
  const [idsource, setIdsource] = useState("");
  const [iddate, setIddate] = useState("");
  const [note, setNote] = useState("");

  const resetForm = () => {
    setName("");
    setGender("");
    setDob("");
    setHumancasetype("");
    setStatus("");
    setNationality("");
    setFamilyCount("");
    setMobileNum("");
    setEmail("");
    setAccnumber("");
    setIdnumber("");
    setIdsource("");
    setIddate("");
    setNote("");
    setError({});
  };

  const handleClose = () => {
    resetForm();
    setEditingId(null);
    setShowModal(false);
  };

  const handleEditOpen = async (id, record) => {
    resetForm();
    setEditingId(id);
    setName(record.name || "");
    setGender(
      record.gender !== undefined && record.gender !== null
        ? String(record.gender)
        : ""
    );
    setDob(record.dob || record.dateofbirth || "");
    setHumancasetype(
      record.humancasetype ? String(record.humancasetype) : ""
    );
    setStatus(record.status ? String(record.status) : "");
    setNationality(record.nationality || "");
    setFamilyCount(record.familycount ? String(record.familycount) : "");
    setMobileNum(record.phonenum || record.phone || "");
    setEmail(record.email || "");
    setAccnumber(record.accnumber || "");
    setIdnumber(record.idnumber || "");
    setIdsource(record.idsource || "");
    setIddate(record.iddate || "");
    setNote(record.note || "");
    setShowModal(true);

    try {
      const res = await API.get(`/humancases/${id}`);
      const data = res.data;
      if (data) {
        if (data.name !== undefined) setName(data.name || "");
        if (data.gender !== undefined)
          setGender(data.gender !== null ? String(data.gender) : "");
        if (data.dob !== undefined) setDob(data.dob || "");
        if (data.humancasetype !== undefined)
          setHumancasetype(
            data.humancasetype ? String(data.humancasetype) : ""
          );
        if (data.status !== undefined)
          setStatus(data.status ? String(data.status) : "");
        if (data.nationality !== undefined)
          setNationality(data.nationality || "");
        if (data.familycount !== undefined)
          setFamilyCount(data.familycount ? String(data.familycount) : "");
        if (data.phonenum !== undefined) setMobileNum(data.phonenum || "");
        if (data.email !== undefined) setEmail(data.email || "");
        if (data.accnumber !== undefined) setAccnumber(data.accnumber || "");
        if (data.idnumber !== undefined) setIdnumber(data.idnumber || "");
        if (data.idsource !== undefined) setIdsource(data.idsource || "");
        if (data.iddate !== undefined) setIddate(data.iddate || "");
        if (data.note !== undefined) setNote(data.note || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toLocaleDateString("en-CA");
    let validationErrors = {};

    if (!name.trim()) {
      validationErrors.name = "حقل الإسم مطلوب";
    }
    if (dob && dob > today) {
      validationErrors.dob = "تاريخ الميلاد لا يمكن أن يكون في المستقبل";
    }
    if (iddate && iddate < today) {
      validationErrors.iddate = "تاريخ انتهاء الهوية لا يمكن أن يكون في الماضي";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    if (editingId) {
      formData.append("id", editingId);
    }
    formData.append("name", name);
    formData.append("gender", gender);
    formData.append("status", status);
    formData.append("nationality", nationality);
    formData.append("email", email);
    formData.append("accnumber", accnumber);
    formData.append("idnumber", idnumber);
    formData.append("idsource", idsource);
    formData.append("iddate", iddate);
    formData.append("note", note);
    formData.append("familycount", familyCount);
    formData.append("phonenum", mobileNum);
    formData.append("humancasetype", humancasetype);
    formData.append("dob", dob);

    try {
      const endpoint = editingId ? "/humancases/update" : "/humancases/store";
      const res = await API.post(endpoint, formData);
      if (res.status === 200 || res.status === 201) {
        handleClose();
        setTableReloadKey((prev) => prev + 1);
      } else {
        setError(res.data?.errors || {});
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  const dropdownOptions = [
    {
      label: "عرض",
      route: "/beneficiary/view/:id",
    },
    {
      label: "تعديل",
      action: (id, record) => handleEditOpen(id, record),
    },
    {
      label: "البيانات البنكية",
      action: (id, record) => setActivePopup({ type: "bank", id, record, title: "البيانات البنكية" }),
    },
    {
      label: "المؤهل و الوظيفية",
      action: (id, record) => setActivePopup({ type: "qualification", id, record, title: "المؤهل و الوظيفية" }),
    },
    {
      label: "بيانات السكن",
      action: (id, record) => setActivePopup({ type: "housing", id, record, title: "بيانات السكن" }),
    },
    {
      label: "البيانات الصحية",
      action: (id, record) => setActivePopup({ type: "health", id, record, title: "البيانات الصحية" }),
    },
    {
      label: "بيانات التابعين ",
      action: (id, record) => setActivePopup({ type: "dependents", id, record, title: "بيانات التابعين" }),
    },
    {
      label: " سند دفع ",
      action: (id, record) => {
        if (record && (record.case_status_string === "مرفوض" || record.case_status === "مرفوض" || record.case_status === "3")) {
          alert("لا يمكن عرض السند لحالة مرفوضة في دراسة الحالة");
        } else {
          setActivePopup({ type: "voucher", id, record, title: "سند دفع" });
        }
      },
    },
    {
      label: "دراسة حالة",
      action: (id, record) => setActivePopup({ type: "casestudy", id, record, title: "دراسة حالة" }),
    },
  ];

  return (
    <>
      <div className="printcasedata-container">
        <TableComponent
          apiUrl="/humancases"
          columns={columns}
          transformRowFn={transformRow}
          title="تقرير المستفيدين"
          titleIcon={<FontAwesomeIcon icon={faReceipt} />}
          placeholderSearch="إسم المستفيد أو رقم الهوية"
          dropdownOptions={dropdownOptions}
          triggerReload={tableReloadKey}
          addBtn={true}
          addBtnName="مستفيد"
          onAddClick={() => {
            resetForm();
            setEditingId(null);
            setShowModal(true);
          }}
        />
      </div>

      {/* ── Add / Edit Beneficiary Modal ── */}
      <Modal
        show={showModal}
        onHide={handleClose}
        className="modal-table archModal donor-modal"
        size="md"
        centered
      >
        <Modal.Header>
          <Modal.Title>{editingId ? "تعديل مستفيد" : "إضافة مستفيد"}</Modal.Title>
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
                id="benef-name"
                label="الإسم"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  sessionStorage.setItem("beneficary_name", e.target.value);
                }}
                error={error.name}
              />
            </Col>
            <Col md={6}>
              <RegisterSelect
                id="benef-gender"
                label="نوع الجنس"
                options={[
                  { value: "", label: "اختر نوع الجنس" },
                  { value: "0", label: "ذكر" },
                  { value: "1", label: "أنثى" },
                ]}
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  sessionStorage.setItem("beneficary_gender", e.target.value);
                }}
                error={error.gender}
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
                  تاريخ الميلاد
                </p>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={dob}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDob(value);
                    sessionStorage.setItem("beneficary_dob", value);

                    const today = new Date().toLocaleDateString("en-CA");
                    if (value > today) {
                      setError((prev) => ({
                        ...prev,
                        dob: "تاريخ الميلاد لا يمكن أن يكون في المستقبل",
                      }));
                    } else {
                      setError((prev) => {
                        const { dob, ...rest } = prev;
                        return rest;
                      });
                    }
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
            <Col md={6}>
              <RegisterSelect
                id="benef-type"
                label="حالة المستفيد"
                options={[
                  { value: "", label: "اختر حالة المستفيد" },
                  { value: "1", label: "مؤقت" },
                  { value: "2", label: "دائم" },
                ]}
                value={humancasetype}
                onChange={(e) => {
                  setHumancasetype(e.target.value);
                  sessionStorage.setItem(
                    "beneficary_humancasetype",
                    e.target.value,
                  );
                }}
                error={error.humancasetype}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterSelect
                id="benef-social"
                label="الحالة الإجتماعية"
                options={[
                  { value: "", label: "اختر الحالة الإجتماعية" },
                  { value: "1", label: "أعزب" },
                  { value: "2", label: "متزوج" },
                  { value: "3", label: "مطلق" },
                  { value: "4", label: "أرمل" },
                ]}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  sessionStorage.setItem("beneficary_status", e.target.value);
                }}
                error={error.status}
              />
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="benef-nationality"
                label="الجنسية"
                type="text"
                value={nationality}
                onChange={(e) => {
                  setNationality(e.target.value);
                  sessionStorage.setItem(
                    "beneficary_nationality",
                    e.target.value,
                  );
                }}
                error={error.nationality}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="benef-family"
                label="عدد افراد الأسرة"
                type="number"
                value={familyCount}
                onChange={(e) => {
                  setFamilyCount(e.target.value);
                  sessionStorage.setItem("beneficary_cardNum", e.target.value);
                }}
                error={error.familycount}
              />
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="benef-phone"
                label="رقم الجوال"
                type="number"
                value={mobileNum}
                onChange={(e) => {
                  setMobileNum(e.target.value);
                  sessionStorage.setItem(
                    "beneficary_mobileNum",
                    e.target.value,
                  );
                }}
                error={error.phonenum}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="benef-email"
                label="البريد الإلكتروني"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  sessionStorage.setItem("beneficary_email", e.target.value);
                }}
                error={error.email}
              />
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="benef-acc"
                label="رقم الحساب"
                type="text"
                value={accnumber}
                onChange={(e) => {
                  setAccnumber(e.target.value);
                  sessionStorage.setItem(
                    "beneficary_accnumber",
                    e.target.value,
                  );
                }}
                error={error.accnumber}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="benef-id-num"
                label="رقم الهوية"
                type="number"
                value={idnumber}
                onChange={(e) => {
                  setIdnumber(e.target.value);
                  sessionStorage.setItem("beneficary_idnumber", e.target.value);
                }}
                error={error.idnumber}
              />
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="benef-id-source"
                label="مصدر الهوية"
                type="text"
                value={idsource}
                onChange={(e) => {
                  setIdsource(e.target.value);
                  sessionStorage.setItem("beneficary_idsource", e.target.value);
                }}
                error={error.idsource}
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
                  تاريخ انتهاء الهوية
                </p>
                <input
                  type="date"
                  className="custom-datepicker"
                  value={iddate}
                  onChange={(e) => {
                    const value = e.target.value;
                    setIddate(value);
                    sessionStorage.setItem("beneficary_iddate", value);

                    const today = new Date().toLocaleDateString("en-CA");
                    if (value < today) {
                      setError((prev) => ({
                        ...prev,
                        iddate: "تاريخ انتهاء الهوية لا يمكن أن يكون في الماضي",
                      }));
                    } else {
                      setError((prev) => {
                        const { iddate, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  style={{ width: "100%" }}
                />
                {error.iddate && (
                  <span className="error-text" style={{ color: "red" }}>
                    {error.iddate}
                  </span>
                )}
              </div>
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="benef-note"
                label="ملاحظات اضافية"
                type="text"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  sessionStorage.setItem("beneficary_note", e.target.value);
                }}
                error={error.note}
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
              {editingId ? "تعديل" : "حفظ"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* ── Sub-pages Popup Modal ── */}
      {activePopup && (
        <BeneficiarySubModal
          activePopup={activePopup}
          onClose={() => setActivePopup(null)}
          onSuccess={() => setTableReloadKey((prev) => prev + 1)}
        />
      )}
    </>
  );
}

export default Beneficiary;
