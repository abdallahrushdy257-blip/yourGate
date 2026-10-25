import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import UploadInput from "../../components/UploadInput";
import API from "../../api/axiosConfig";

function BeneficiarySubModal({ activePopup, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: "", text: "" });

  // Bank fields
  const [bankName, setBankName] = useState("");
  const [branch, setBranch] = useState("");
  const [iban, setIban] = useState("");
  const [ibanUpload, setIbanUpload] = useState(null);

  // Qualification fields
  const [educationLevel, setEducationLevel] = useState("");
  const [canWork, setCanWork] = useState("");
  const [job, setJob] = useState("");
  const [incomeSource, setIncomeSource] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [qualNotes, setQualNotes] = useState("");
  const [sourceUpload, setSourceUpload] = useState(null);
  const [courseUpload, setCourseUpload] = useState(null);

  // Housing fields
  const [houseState, setHouseState] = useState("");
  const [village, setVillage] = useState("");
  const [nationalAddress, setNationalAddress] = useState("");
  const [summaryAddress, setSummaryAddress] = useState("");
  const [homeType, setHomeType] = useState("");
  const [homeOwnership, setHomeOwnership] = useState("");
  const [rent, setRent] = useState("");
  const [cars, setCars] = useState("");
  const [furniture, setFurniture] = useState("");

  // Health fields
  const [healthStatus, setHealthStatus] = useState("سليم");
  const [diseaseName, setDiseaseName] = useState("");
  const [diseaseType, setDiseaseType] = useState("");
  const [diseaseDegree, setDiseaseDegree] = useState("");
  const [treatmentType, setTreatmentType] = useState("");
  const [treatmentCost, setTreatmentCost] = useState("");
  const [healthNotes, setHealthNotes] = useState("");
  const [healthUpload, setHealthUpload] = useState(null);

  // Dependents fields
  const [depName, setDepName] = useState("");
  const [depRelation, setDepRelation] = useState("");
  const [depGender, setDepGender] = useState("");
  const [depDob, setDepDob] = useState("");
  const [depPhone, setDepPhone] = useState("");
  const [depNationalId, setDepNationalId] = useState("");
  const [depHealth, setDepHealth] = useState("");
  const [depNote, setDepNote] = useState("");

  // Voucher fields
  const [voucherAmount, setVoucherAmount] = useState("");
  const [voucherDate, setVoucherDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [voucherMethod, setVoucherMethod] = useState("cash");
  const [voucherAccount, setVoucherAccount] = useState("");
  const [voucherDesc, setVoucherDesc] = useState("");

  // Case Study fields
  const [decision, setDecision] = useState("2");
  const [caseNotes, setCaseNotes] = useState("");

  useEffect(() => {
    if (!activePopup?.id) return;

    if (activePopup.record) {
      const r = activePopup.record;
      if (r.accnumber) setIban(r.accnumber);
      if (r.status) setDecision(String(r.status));
      if (r.note) setCaseNotes(r.note);
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/humancasedetails/get/${activePopup.id}`);
        if (res.data) {
          const details = res.data.details || {};

          // Bank data
          if (details.bankdetails) {
            setBankName(details.bankdetails.name || "");
            setBranch(details.bankdetails.branch || "");
            setIban(details.bankdetails.iban || "");
          }

          // Qualification data
          const q = details.qualifications || details.work_education || {};
          if (q) {
            setEducationLevel(q.level || q.educationlevel || "");
            setCanWork(q.canwork !== undefined ? String(q.canwork) : "");
            setJob(q.job || "");
            setIncomeSource(q.sourcename || q.incomeSource || "");
            setIncomeAmount(q.sourceamount || q.incomeAmount || "");
            setQualNotes(q.note || q.notes || "");
          }

          // Housing data
          const h = details.home || details.personalfeesdetails || {};
          if (h) {
            setHouseState(h.state || "");
            setVillage(h.village || "");
            setNationalAddress(h.nationalAdress || h.nationalAddress || "");
            setSummaryAddress(h.summaryAdress || h.summaryAddress || "");
            setHomeType(h.homeType || "");
            setHomeOwnership(h.homeOwnership || "");
            setRent(h.rent || "");
            setCars(h.cars || "");
            setFurniture(h.furniture || "");
          }

          // Health data
          if (Array.isArray(details.health) && details.health.length > 0) {
            const lastH = details.health[details.health.length - 1];
            setDiseaseName(lastH.disease_name || "");
            setDiseaseType(lastH.disease_type || "");
            setDiseaseDegree(lastH.disease_degree || "");
            setTreatmentType(lastH.treatment_type || "");
            setTreatmentCost(lastH.treatment_cost || "");
            setHealthNotes(lastH.notes || "");
          }

          // Dependents data
          if (Array.isArray(details.dependants) && details.dependants.length > 0) {
            const lastD = details.dependants[details.dependants.length - 1];
            setDepName(lastD.name || "");
            setDepRelation(lastD.relation || "");
            setDepGender(lastD.gender || "");
            setDepDob(lastD.dateofbirth || "");
            setDepPhone(lastD.phone || "");
            setDepNationalId(lastD.nationalid || "");
            setDepHealth(lastD.health || "");
            setDepNote(lastD.note || "");
          }

          // Case study / Status
          if (res.data.status) {
            setDecision(String(res.data.status));
          }
          if (res.data.note) {
            setCaseNotes(res.data.note);
          }
        }
      } catch (err) {
        console.error("Failed to load popup details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activePopup?.id]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setAlertMsg({ type: "", text: "" });

    try {
      const type = activePopup.type;
      const id = activePopup.id;
      let endpoint = "";
      const formData = new FormData();
      formData.append("id", id);

      if (type === "bank") {
        endpoint = "/humancasedetails/update/banks";
        formData.append("name", bankName);
        formData.append("branch", branch);
        formData.append("iban", iban);
        if (ibanUpload) formData.append("upload", ibanUpload);
      } else if (type === "qualification") {
        endpoint = "/humancasedetails/qualifications/store";
        formData.append("level", educationLevel);
        formData.append("canwork", canWork);
        formData.append("job", job);
        formData.append("sourcename", incomeSource);
        formData.append("sourceamount", incomeAmount);
        formData.append("note", qualNotes);
        if (sourceUpload) formData.append("sourceupload", sourceUpload);
        if (courseUpload) formData.append("courseupload", courseUpload);
      } else if (type === "housing") {
        endpoint = "/humancasedetails/update/personalfees";
        formData.append("state", houseState);
        formData.append("village", village);
        formData.append("nationalAdress", nationalAddress);
        formData.append("summaryAdress", summaryAddress);
        formData.append("homeType", homeType);
        formData.append("homeOwnership", homeOwnership);
        formData.append("rent", rent);
        formData.append("cars", cars);
        formData.append("furniture", furniture);
      } else if (type === "health") {
        endpoint = "/humancasedetails/health/store";
        formData.append("health_status", healthStatus);
        formData.append("disease_name", diseaseName);
        formData.append("disease_type", diseaseType);
        formData.append("disease_degree", diseaseDegree);
        formData.append("treatment_type", treatmentType);
        formData.append("treatment_cost", treatmentCost);
        formData.append("notes", healthNotes);
        if (healthUpload) formData.append("upload", healthUpload);
      } else if (type === "dependents") {
        endpoint = "/humancasedetails/dependants/store";
        formData.append("name", depName);
        formData.append("relation", depRelation);
        formData.append("gender", depGender);
        formData.append("dateofbirth", depDob);
        formData.append("phone", depPhone);
        formData.append("nationalid", depNationalId);
        formData.append("health", depHealth);
        formData.append("note", depNote);
      } else if (type === "voucher") {
        endpoint = "/humancasedetails/voucher/store";
        formData.append("amount", voucherAmount);
        formData.append("date", voucherDate);
        formData.append("payment_method", voucherMethod);
        formData.append("account", voucherAccount);
        formData.append("description", voucherDesc);
      } else if (type === "casestudy") {
        endpoint = "/humancasedetails/update/status";
        formData.append("status", decision);
        formData.append("note", caseNotes);
      }

      const res = await API.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200 || res.status === 201) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setAlertMsg({ type: "danger", text: "حدث خطأ أثناء حفظ البيانات" });
      }
    } catch (err) {
      console.error(err);
      setAlertMsg({
        type: "danger",
        text: err.response?.data?.message || "حدث خطأ في الاتصال بالخادم",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWide =
    activePopup?.type === "qualification" ||
    activePopup?.type === "housing" ||
    activePopup?.type === "health" ||
    activePopup?.type === "dependents";

  return (
    <Modal
      show={Boolean(activePopup)}
      onHide={onClose}
      className="modal-table archModal donor-modal"
      size="lg"
      centered
    >
      <Modal.Header
        style={{
          padding: "1.25rem 2rem",
          borderBottom: "1px solid var(--border-color, #eee)",
          direction: "rtl",
        }}
      >
        <Modal.Title
          style={{
            fontWeight: "700",
            fontSize: "1.25rem",
            color: "var(--primary-color, #c29a64)",
          }}
        >
          {activePopup?.title}
        </Modal.Title>
        <Button
          className="custom-close-button cls-btn"
          variant="link"
          onClick={onClose}
          style={{
            color: "var(--text-color, #888)",
            fontSize: "1.2rem",
            padding: "0",
          }}
        >
          <FontAwesomeIcon icon={faXmark} className="closeModal" />
        </Button>
      </Modal.Header>

      <Modal.Body
        style={{
          padding: "1.75rem 2rem 1.25rem",
          direction: "rtl",
          maxHeight: "75vh",
          overflowY: "auto",
        }}
      >
        {alertMsg.text && (
          <Alert variant={alertMsg.type} className="mb-3">
            {alertMsg.text}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            {/* 1. BANK DATA */}
            {activePopup?.type === "bank" && (
              <Row className="g-3">
                <Col md={6}>
                  <RegisterTextbox
                    id="bank-name"
                    label="إسم البنك"
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="bank-branch"
                    label="الفرع"
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="bank-iban"
                    label="رقم IBAN"
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <UploadInput
                    id="bank-upload"
                    label="صورة رقم IBAN"
                    onChange={(e) => setIbanUpload(e.target.files[0])}
                  />
                </Col>
              </Row>
            )}

            {/* 2. QUALIFICATION & WORK */}
            {activePopup?.type === "qualification" && (
              <Row className="g-3">
                <Col md={6}>
                  <RegisterSelect
                    id="qual-level"
                    label="المؤهل العلمي"
                    options={[
                      { value: "", label: "اختر المؤهل" },
                      { value: "ابتدائي", label: "ابتدائي" },
                      { value: "متوسط", label: "متوسط" },
                      { value: "ثانوي", label: "ثانوي" },
                      { value: "دبلوم", label: "دبلوم" },
                      { value: "بكالوريوس", label: "بكالوريوس" },
                      { value: "ماجستير", label: "ماجستير" },
                      { value: "دكتوراه", label: "دكتوراه" },
                      { value: "أمي", label: "أمي" },
                    ]}
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id="qual-canwork"
                    label="القدرة على العمل"
                    options={[
                      { value: "", label: "اختر" },
                      { value: "1", label: "نعم" },
                      { value: "0", label: "لا" },
                    ]}
                    value={canWork}
                    onChange={(e) => setCanWork(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="qual-job"
                    label="الوظيفة الحالية"
                    type="text"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="qual-source"
                    label="مصدر الدخل"
                    type="text"
                    value={incomeSource}
                    onChange={(e) => setIncomeSource(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="qual-amount"
                    label="قيمة الدخل الشهري"
                    type="number"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="qual-notes"
                    label="ملاحظات إضافية"
                    type="text"
                    value={qualNotes}
                    onChange={(e) => setQualNotes(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <UploadInput
                    id="qual-sourceupload"
                    label="إثبات الدخل"
                    onChange={(e) => setSourceUpload(e.target.files[0])}
                  />
                </Col>
                <Col md={6}>
                  <UploadInput
                    id="qual-courseupload"
                    label="شهادة أو دورة تدريبية"
                    onChange={(e) => setCourseUpload(e.target.files[0])}
                  />
                </Col>
              </Row>
            )}

            {/* 3. HOUSING DATA */}
            {activePopup?.type === "housing" && (
              <Row className="g-3">
                <Col md={6}>
                  <RegisterTextbox
                    id="house-state"
                    label="المدينة / المنطقة"
                    type="text"
                    value={houseState}
                    onChange={(e) => setHouseState(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="house-village"
                    label="الحي / القرية"
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="house-national"
                    label="العنوان الوطني"
                    type="text"
                    value={nationalAddress}
                    onChange={(e) => setNationalAddress(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id="house-type"
                    label="نوع السكن"
                    options={[
                      { value: "", label: "اختر نوع السكن" },
                      { value: "شقة", label: "شقة" },
                      { value: "فيلا", label: "فيلا" },
                      { value: "بيت شعبي", label: "بيت شعبي" },
                      { value: "غرفة", label: "غرفة" },
                      { value: "ملحق", label: "ملحق" },
                    ]}
                    value={homeType}
                    onChange={(e) => setHomeType(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id="house-owner"
                    label="ملكية السكن"
                    options={[
                      { value: "", label: "اختر نوع الملكية" },
                      { value: "ملك", label: "ملك" },
                      { value: "إيجار", label: "إيجار" },
                      { value: "رهن", label: "رهن" },
                      { value: "وقف", label: "وقف" },
                      { value: "سكن عمل", label: "سكن عمل" },
                    ]}
                    value={homeOwnership}
                    onChange={(e) => setHomeOwnership(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="house-rent"
                    label="قيمة الإيجار السنوي"
                    type="number"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="house-cars"
                    label="عدد السيارات"
                    type="number"
                    value={cars}
                    onChange={(e) => setCars(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id="house-furniture"
                    label="حالة الأثاث"
                    options={[
                      { value: "", label: "اختر حالة الأثاث" },
                      { value: "ممتاز", label: "ممتاز" },
                      { value: "جيد", label: "جيد" },
                      { value: "متوسط", label: "متوسط" },
                      { value: "سيء", label: "سيء" },
                    ]}
                    value={furniture}
                    onChange={(e) => setFurniture(e.target.value)}
                  />
                </Col>
                <Col md={12}>
                  <RegisterTextbox
                    id="house-address"
                    label="العنوان بالتفصيل"
                    type="text"
                    value={summaryAddress}
                    onChange={(e) => setSummaryAddress(e.target.value)}
                  />
                </Col>
              </Row>
            )}

            {/* 4. HEALTH DATA */}
            {activePopup?.type === "health" && (
              <Row className="g-3">
                <Col md={6}>
                  <RegisterSelect
                    id="health-status"
                    label="الحالة الصحية العامة"
                    options={[
                      { value: "سليم", label: "سليم" },
                      { value: "مريض", label: "مريض" },
                      { value: "ذوي احتياجات خاصة", label: "ذوي احتياجات خاصة" },
                    ]}
                    value={healthStatus}
                    onChange={(e) => setHealthStatus(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="disease-name"
                    label="اسم المرض أو الحالة"
                    type="text"
                    value={diseaseName}
                    onChange={(e) => setDiseaseName(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id="disease-type"
                    label="نوع المرض"
                    options={[
                      { value: "", label: "اختر نوع المرض" },
                      { value: "مزمن", label: "مزمن" },
                      { value: "عارض", label: "عارض" },
                      { value: "وراثي", label: "وراثي" },
                      { value: "نفسي", label: "نفسي" },
                    ]}
                    value={diseaseType}
                    onChange={(e) => setDiseaseType(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id="disease-degree"
                    label="درجة الخطورة"
                    options={[
                      { value: "", label: "اختر درجة الخطورة" },
                      { value: "بسيطة", label: "بسيطة" },
                      { value: "متوسطة", label: "متوسطة" },
                      { value: "حرجة", label: "حرجة" },
                    ]}
                    value={diseaseDegree}
                    onChange={(e) => setDiseaseDegree(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="treatment-type"
                    label="نوع العلاج"
                    type="text"
                    value={treatmentType}
                    onChange={(e) => setTreatmentType(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="treatment-cost"
                    label="تكلفة العلاج الشهري"
                    type="number"
                    value={treatmentCost}
                    onChange={(e) => setTreatmentCost(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <UploadInput
                    id="health-upload"
                    label="إرفاق تقرير طبي"
                    onChange={(e) => setHealthUpload(e.target.files[0])}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="health-notes"
                    label="ملاحظات إضافية"
                    type="text"
                    value={healthNotes}
                    onChange={(e) => setHealthNotes(e.target.value)}
                  />
                </Col>
              </Row>
            )}

            {/* 5. DEPENDENTS DATA */}
            {activePopup?.type === "dependents" && (
              <Row className="g-3">
                <Col md={6}>
                  <RegisterTextbox
                    id="dep-name"
                    label="اسم التابع"
                    type="text"
                    value={depName}
                    onChange={(e) => setDepName(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id="dep-relation"
                    label="صلة القرابة"
                    options={[
                      { value: "", label: "اختر صلة القرابة" },
                      { value: "ابن", label: "ابن" },
                      { value: "ابنة", label: "ابنة" },
                      { value: "زوجة", label: "زوجة" },
                      { value: "زوج", label: "زوج" },
                      { value: "أب", label: "أب" },
                      { value: "أم", label: "أم" },
                      { value: "أخ", label: "أخ" },
                      { value: "أخت", label: "أخت" },
                      { value: "أخرى", label: "أخرى" },
                    ]}
                    value={depRelation}
                    onChange={(e) => setDepRelation(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id="dep-gender"
                    label="النوع"
                    options={[
                      { value: "", label: "اختر النوع" },
                      { value: "male", label: "ذكر" },
                      { value: "female", label: "أنثى" },
                    ]}
                    value={depGender}
                    onChange={(e) => setDepGender(e.target.value)}
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
                      value={depDob}
                      onChange={(e) => setDepDob(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="dep-phone"
                    label="رقم الهاتف"
                    type="text"
                    value={depPhone}
                    onChange={(e) => setDepPhone(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="dep-nationalid"
                    label="رقم الهوية"
                    type="text"
                    value={depNationalId}
                    onChange={(e) => setDepNationalId(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="dep-health"
                    label="الحالة الصحية"
                    type="text"
                    value={depHealth}
                    onChange={(e) => setDepHealth(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="dep-note"
                    label="ملاحظات"
                    type="text"
                    value={depNote}
                    onChange={(e) => setDepNote(e.target.value)}
                  />
                </Col>
              </Row>
            )}

            {/* 6. PAYMENT VOUCHER */}
            {activePopup?.type === "voucher" && (
              <Row className="g-3">
                <Col md={6}>
                  <RegisterTextbox
                    id="vouch-amount"
                    label="المبلغ"
                    type="number"
                    value={voucherAmount}
                    onChange={(e) => setVoucherAmount(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <div
                    className="mb-3"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <p style={{ marginBottom: "10px", textAlign: "right" }}>
                      تاريخ السند
                    </p>
                    <input
                      type="date"
                      className="custom-datepicker"
                      value={voucherDate}
                      onChange={(e) => setVoucherDate(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id="vouch-method"
                    label="طريقة الدفع"
                    options={[
                      { value: "cash", label: "نقدي" },
                      { value: "bank_transfer", label: "تحويل بنكي" },
                      { value: "cheque", label: "شيك" },
                    ]}
                    value={voucherMethod}
                    onChange={(e) => setVoucherMethod(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="vouch-account"
                    label="الحساب / البنك"
                    type="text"
                    value={voucherAccount}
                    onChange={(e) => setVoucherAccount(e.target.value)}
                  />
                </Col>
                <Col md={12}>
                  <RegisterTextbox
                    id="vouch-desc"
                    label="البيان / ملاحظات الصرف"
                    type="text"
                    value={voucherDesc}
                    onChange={(e) => setVoucherDesc(e.target.value)}
                  />
                </Col>
              </Row>
            )}

            {/* 7. CASE STUDY */}
            {activePopup?.type === "casestudy" && (
              <Row className="g-3">
                <Col md={6}>
                  <RegisterSelect
                    id="study-status"
                    label="قرار دراسة الحالة"
                    options={[
                      { value: "2", label: "موافقة" },
                      { value: "3", label: "رفض" },
                      { value: "1", label: "معلق / قيد المراجعة" },
                    ]}
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextbox
                    id="study-notes"
                    label="ملاحظات وتوصيات الباحث الاجتماعي"
                    type="text"
                    value={caseNotes}
                    onChange={(e) => setCaseNotes(e.target.value)}
                  />
                </Col>
              </Row>
            )}
          </>
        )}
      </Modal.Body>

      <Modal.Footer
        style={{
          padding: "1.25rem 2rem",
          borderTop: "1px solid var(--border-color, #eee)",
          display: "flex",
          justifyContent: "flex-start",
          gap: "12px",
          direction: "rtl",
        }}
      >
        {isSubmitting ? (
          <Button
            variant="primary"
            disabled
            style={{
              backgroundColor: "var(--primary-color, #c29a64)",
              borderColor: "var(--primary-color, #c29a64)",
              borderRadius: "22px",
              padding: "8px 32px",
              fontWeight: "600",
              minWidth: "110px",
            }}
          >
            <Spinner animation="border" size="sm" />
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmit}
            style={{
              backgroundColor: "var(--primary-color, #c29a64)",
              borderColor: "var(--primary-color, #c29a64)",
              borderRadius: "22px",
              padding: "8px 32px",
              fontWeight: "600",
              minWidth: "110px",
            }}
          >
            حفظ
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={onClose}
          style={{
            borderRadius: "22px",
            padding: "8px 26px",
            fontWeight: "600",
            backgroundColor: "transparent",
            color: "var(--text-color, #666)",
            border: "1.5px solid var(--border-color, #ccc)",
          }}
        >
          إغلاق
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BeneficiarySubModal;
