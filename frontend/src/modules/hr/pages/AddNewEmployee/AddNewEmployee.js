import React, { useEffect, useState } from "react";
import "./addNewEmployee.css";
import { Form, Modal, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTable,
  faUserPlus,
  faPenToSquare,
  faTrash,
  faEye,
  faIdCard,
  faExclamationTriangle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import Title from "../../../../components/title";
import API from "../../../../api/axiosConfig";
import TableComponent from "../../../../components/TableComponent";
import { toast } from "react-toastify";

function AddNewEmployee() {
  // ── Modal & Stepper State ──
  const [showModal, setShowModal] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ── Job Titles Options ──
  const [jobTitles, setJobTitles] = useState([]);

  // ── Form State (Step 1: General Info) ──
  const [name, setName] = useState("");
  const [gender, setGender] = useState("0");
  const [dob, setDob] = useState("");
  const [idtype, setIdtype] = useState(0);
  const [nationalid, setNationalid] = useState("");
  const [nationalidExpire, setNationalidExpire] = useState("");
  const [dateofhire, setDateofhire] = useState("");
  const [contractexpiration, setContractexpiration] = useState("");
  const [status, setStatus] = useState(0);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [iban, setIban] = useState("");
  const [qualification, setQualification] = useState("");
  const [jobTitleId, setJobTitleId] = useState("");
  const [worktype, setWorktype] = useState(0);
  const [photo, setPhoto] = useState(null);

  // ── Form State (Step 2: Salary & Allowances) ──
  const [basicSalary, setBasicSalary] = useState(0);
  const [socialInsuranceRatio, setSocialInsuranceRatio] = useState(10);
  const [socialInsurance, setSocialInsurance] = useState(0);
  const [housingAllowance, setHousingAllowance] = useState(0);
  const [transportAllowance, setTransportAllowance] = useState(0);
  const [communicationAllowance, setCommunicationAllowance] = useState(0);
  const [lifeAllowance, setLifeAllowance] = useState(0);
  const [workAllowance, setWorkAllowance] = useState(0);
  const [salaryAccount, setSalaryAccount] = useState("");

  // ── Form State (Step 3: Documents) ──
  const [documents, setDocuments] = useState([{ title: "", file: null }]);

  // ── Validation Errors ──
  const [error, setError] = useState({});

  // Fetch job titles for dropdown
  const fetchJobTitles = async () => {
    try {
      const res = await API.post("/jobtitle");
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      setJobTitles(list);
    } catch (err) {
      console.error("Error fetching job titles:", err);
    }
  };

  useEffect(() => {
    fetchJobTitles();
  }, []);

  // Recalculate social insurance when ratio or basic changes
  const handleBasicSalaryChange = (val) => {
    const num = parseFloat(val) || 0;
    setBasicSalary(num);
    const calculatedSocial = (num * (parseFloat(socialInsuranceRatio) || 0)) / 100;
    setSocialInsurance(calculatedSocial);
  };

  const handleRatioChange = (val) => {
    const num = parseFloat(val) || 0;
    setSocialInsuranceRatio(num);
    const calculatedSocial = ((parseFloat(basicSalary) || 0) * num) / 100;
    setSocialInsurance(calculatedSocial);
  };

  // Calculate total salary
  const calculateTotalSalary = () => {
    const total =
      (parseFloat(basicSalary) || 0) +
      (parseFloat(housingAllowance) || 0) +
      (parseFloat(transportAllowance) || 0) +
      (parseFloat(communicationAllowance) || 0) +
      (parseFloat(lifeAllowance) || 0) +
      (parseFloat(workAllowance) || 0) -
      (parseFloat(socialInsurance) || 0);

    return Math.max(0, total).toFixed(2);
  };

  // Document Helpers
  const handleAddDocument = () => {
    setDocuments([...documents, { title: "", file: null }]);
  };

  const handleRemoveDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleDocTitleChange = (index, value) => {
    const updated = [...documents];
    updated[index].title = value;
    setDocuments(updated);
  };

  const handleDocFileChange = (index, file) => {
    const updated = [...documents];
    updated[index].file = file;
    setDocuments(updated);
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setActiveStep(1);
    setName("");
    setGender("0");
    setDob("");
    setIdtype(0);
    setNationalid("");
    setNationalidExpire("");
    setDateofhire("");
    setContractexpiration("");
    setStatus(0);
    setAddress("");
    setEmail("");
    setPhone("");
    setNationality("");
    setIban("");
    setQualification("");
    setJobTitleId("");
    setWorktype(0);
    setPhoto(null);
    setBasicSalary(0);
    setSocialInsuranceRatio(10);
    setSocialInsurance(0);
    setHousingAllowance(0);
    setTransportAllowance(0);
    setCommunicationAllowance(0);
    setLifeAllowance(0);
    setWorkAllowance(0);
    setSalaryAccount("");
    setDocuments([{ title: "", file: null }]);
    setError({});
  };

  // Open modal for Create
  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (record) => {
    setEditingId(record.id);
    setActiveStep(1);
    setName(record.name || "");
    setGender(record.gender !== undefined ? String(record.gender) : "0");
    setDob(record.dob || record.dateofbirth || "");
    setIdtype(record.idtype ?? 0);
    setNationalid(record.nationalid || record.idnumber || "");
    setNationalidExpire(record.nationalid_expire || record.idexpiredate || "");
    setDateofhire(record.dateofhire || record.workdate || "");
    setContractexpiration(record.contractexpiration || record.expirehire || "");
    setStatus(record.status ?? 0);
    setAddress(record.address || "");
    setEmail(record.email || "");
    setPhone(record.phone || "");
    setNationality(record.nationality || "");
    setIban(record.iban || record.ibannumber || "");
    setQualification(record.qualification || "");
    setJobTitleId(record.job_title_id ?? record.jobtitle?.id ?? "");
    setWorktype(record.worktype ?? 0);
    setPhoto(null);

    const b = record.basic_salary ?? record.basic ?? 0;
    const s = record.social_insurance ?? record.socialinsurance ?? 0;
    setBasicSalary(b);
    setSocialInsurance(s);
    setSocialInsuranceRatio(b > 0 ? Math.round((s / b) * 100) : 10);
    setHousingAllowance(record.housing_allowance ?? record.house ?? 0);
    setTransportAllowance(record.transport_allowance ?? record.transport ?? 0);
    setCommunicationAllowance(record.communication_allowance ?? record.communication ?? 0);
    setLifeAllowance(record.life_allowance ?? record.life ?? 0);
    setWorkAllowance(record.work_allowance ?? record.work ?? 0);
    setSalaryAccount(record.salary_account ?? record.account ?? "");

    if (record.documents && record.documents.length > 0) {
      setDocuments(record.documents.map((d) => ({ title: d.title, file: null, existingUrl: d.url })));
    } else {
      setDocuments([{ title: "", file: null }]);
    }

    setError({});
    setShowModal(true);
  };

  // Validate Step 1 before proceeding
  const validateStep1 = () => {
    const err = {};
    if (!name.trim()) err.name = "إسم الموظف مطلوب";
    if (email && !/\S+@\S+\.\S+/.test(email)) err.email = "صيغة البريد الإلكتروني غير صحيحة";
    if (phone && phone.length < 8) err.phone = "رقم الجوال غير صحيح";
    if (nationalid && nationalid.length < 5) err.nationalid = "رقم الهوية غير صحيح";

    setError(err);
    return Object.keys(err).length === 0;
  };

  // Submit complete employee data
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!validateStep1()) {
      setActiveStep(1);
      toast.error("يرجى ملء الحقول الإلزامية في البيانات العامة");
      return;
    }

    setIsSubmitting(true);
    const mFormData = new FormData();

    // Step 1 Fields
    mFormData.append("name", name.trim());
    mFormData.append("gender", gender);
    if (dob) mFormData.append("dob", dob);
    mFormData.append("idtype", idtype);
    if (nationalid) mFormData.append("nationalid", nationalid);
    if (nationalidExpire) mFormData.append("nationalid_expire", nationalidExpire);
    if (dateofhire) mFormData.append("dateofhire", dateofhire);
    if (contractexpiration) mFormData.append("contractexpiration", contractexpiration);
    mFormData.append("status", status);
    if (address) mFormData.append("address", address);
    if (email) mFormData.append("email", email);
    if (phone) mFormData.append("phone", phone);
    if (nationality) mFormData.append("nationality", nationality);
    if (iban) mFormData.append("iban", iban);
    if (qualification) mFormData.append("qualification", qualification);
    if (jobTitleId) mFormData.append("job_title_id", jobTitleId);
    mFormData.append("worktype", worktype);
    if (photo instanceof File) mFormData.append("photo", photo);

    // Step 2 Fields
    mFormData.append("basic_salary", basicSalary || 0);
    mFormData.append("social_insurance", socialInsurance || 0);
    mFormData.append("housing_allowance", housingAllowance || 0);
    mFormData.append("transport_allowance", transportAllowance || 0);
    mFormData.append("communication_allowance", communicationAllowance || 0);
    mFormData.append("life_allowance", lifeAllowance || 0);
    mFormData.append("work_allowance", workAllowance || 0);
    if (salaryAccount) mFormData.append("salary_account", salaryAccount);

    // Step 3 Documents
    documents.forEach((doc, index) => {
      if (doc.file instanceof File) {
        mFormData.append(`documents[${index}][title]`, doc.title || doc.file.name);
        mFormData.append(`documents[${index}][file]`, doc.file);
      }
    });

    try {
      if (editingId) {
        mFormData.append("id", editingId);
        await API.post(`/employees/${editingId}/update`, mFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("تم تحديث بيانات الموظف بنجاح");
      } else {
        await API.post("/employees/store", mFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("تم إضافة الموظف بنجاح");
      }
      setShowModal(false);
      resetForm();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Save employee error:", err);
      const validationErrors = err?.response?.data?.errors || {};
      setError(validationErrors);
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حفظ بيانات الموظف");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleConfirmDelete = async () => {
    if (!deleteModal.item) return;
    setIsDeleting(true);
    try {
      await API.delete(`/employees/${deleteModal.item.id}`);
      toast.success("تم حذف الموظف بنجاح");
      setDeleteModal({ show: false, item: null });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Delete employee error:", err);
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حذف الموظف");
    } finally {
      setIsDeleting(false);
    }
  };

  // Table Columns
  const columns = [
    { name: "إسم الموظف", key: "name" },
    { name: "رقم الهوية", key: "nationalid" },
    { name: "رقم الجوال", key: "phone" },
    { name: "تاريخ التعيين", key: "dateofhire" },
    { name: "المسمى الوظيفي", key: "jobname" },
    { name: "الإجراءات", key: "actions" },
  ];

  // Dropdown options for each table row
  const dropdownOptions = [
    {
      label: "تعديل",
      action: (_id, record) => handleOpenEdit(record),
    },
    {
      label: "عرض",
      route: "/showEmployee/:id",
    },
    {
      label: "كارت الموظف",
      route: "/showEmployeeCard/:id",
    },
    {
      label: "حذف",
      action: (_id, record) => setDeleteModal({ show: true, item: record }),
    },
  ];

  return (
    <div className="addnewemployee-container">
      <div className="employee-list-page">
        <TableComponent
          key={refreshKey}
          apiUrl="/employees"
          columns={columns}
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          title="إدارة الموظفين"
          addBtn={true}
          addBtnName="موظف"
          onAddClick={handleOpenAdd}
          dropdownOptions={dropdownOptions}
          triggerReload={refreshKey}
        />
      </div>

      {/* ── Multi-Step Add / Edit Modal ── */}
      <Modal
        show={showModal}
        onHide={() => !isSubmitting && setShowModal(false)}
        size="lg"
        centered
        dir="rtl"
        className="add-employee-modal"
      >
        <Modal.Header closeButton>
          <div className="emp-modal-title">
            <span className="emp-modal-title-icon">
              <FontAwesomeIcon icon={editingId ? faPenToSquare : faUserPlus} />
            </span>
            <span>{editingId ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}</span>
          </div>
        </Modal.Header>

        <Modal.Body>
          {/* ── Stepper Navigation ── */}
          <div className="emp-stepper">
            <div
              className={`emp-step-item ${activeStep === 1 ? "active" : ""} ${
                activeStep > 1 ? "completed" : ""
              }`}
              onClick={() => setActiveStep(1)}
            >
              <div className="emp-step-circle">
                {activeStep > 1 ? <FontAwesomeIcon icon={faCheckCircle} /> : 1}
              </div>
              <span className="emp-step-label">البيانات العامة</span>
            </div>

            <div className="emp-step-divider" />

            <div
              className={`emp-step-item ${activeStep === 2 ? "active" : ""} ${
                activeStep > 2 ? "completed" : ""
              }`}
              onClick={() => validateStep1() && setActiveStep(2)}
            >
              <div className="emp-step-circle">
                {activeStep > 2 ? <FontAwesomeIcon icon={faCheckCircle} /> : 2}
              </div>
              <span className="emp-step-label">الراتب والبدلات</span>
            </div>

            <div className="emp-step-divider" />

            <div
              className={`emp-step-item ${activeStep === 3 ? "active" : ""}`}
              onClick={() => validateStep1() && setActiveStep(3)}
            >
              <div className="emp-step-circle">3</div>
              <span className="emp-step-label">المستندات</span>
            </div>
          </div>

          {/* ── Step 1: General Info ── */}
          {activeStep === 1 && (
            <div className="emp-form-grid">
              {/* Name */}
              <div className="emp-field-group">
                <label className="emp-field-label">
                  إسم الموظف <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="emp-input"
                  placeholder="أدخل الاسم الرباعي"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error.name) setError((prev) => ({ ...prev, name: null }));
                  }}
                />
                {error.name && <span className="emp-field-error">{error.name}</span>}
              </div>

              {/* Gender */}
              <div className="emp-field-group">
                <label className="emp-field-label">النوع</label>
                <select
                  className="emp-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="0">ذكر</option>
                  <option value="1">أنثى</option>
                </select>
              </div>

              {/* ID Type */}
              <div className="emp-field-group">
                <label className="emp-field-label">نوع الهوية</label>
                <select
                  className="emp-select"
                  value={idtype}
                  onChange={(e) => setIdtype(e.target.value)}
                >
                  <option value={0}>بطاقة هوية وطنية</option>
                  <option value={1}>جواز سفر</option>
                  <option value={2}>إقامة نظامية</option>
                </select>
              </div>

              {/* ID Number */}
              <div className="emp-field-group">
                <label className="emp-field-label">رقم الهوية / الإقامة</label>
                <input
                  type="text"
                  className="emp-input"
                  placeholder="أدخل رقم الهوية"
                  value={nationalid}
                  onChange={(e) => setNationalid(e.target.value)}
                />
                {error.nationalid && (
                  <span className="emp-field-error">{error.nationalid}</span>
                )}
              </div>

              {/* Date of Birth */}
              <div className="emp-field-group">
                <label className="emp-field-label">تاريخ الميلاد</label>
                <input
                  type="date"
                  className="emp-input"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              {/* National ID Expire Date */}
              <div className="emp-field-group">
                <label className="emp-field-label">تاريخ انتهاء الهوية</label>
                <input
                  type="date"
                  className="emp-input"
                  value={nationalidExpire}
                  onChange={(e) => setNationalidExpire(e.target.value)}
                />
              </div>

              {/* Date of Hire */}
              <div className="emp-field-group">
                <label className="emp-field-label">تاريخ التعيين</label>
                <input
                  type="date"
                  className="emp-input"
                  value={dateofhire}
                  onChange={(e) => setDateofhire(e.target.value)}
                />
              </div>

              {/* Contract Expiration */}
              <div className="emp-field-group">
                <label className="emp-field-label">تاريخ انتهاء التعاقد</label>
                <input
                  type="date"
                  className="emp-input"
                  value={contractexpiration}
                  onChange={(e) => setContractexpiration(e.target.value)}
                />
              </div>

              {/* Social Status */}
              <div className="emp-field-group">
                <label className="emp-field-label">الحالة الاجتماعية</label>
                <select
                  className="emp-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value={0}>أعزب</option>
                  <option value={1}>متزوج</option>
                  <option value={2}>مطلق</option>
                  <option value={3}>أرمل</option>
                </select>
              </div>

              {/* Phone */}
              <div className="emp-field-group">
                <label className="emp-field-label">رقم الجوال</label>
                <input
                  type="text"
                  dir="ltr"
                  className="emp-input text-end"
                  placeholder="05XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {error.phone && <span className="emp-field-error">{error.phone}</span>}
              </div>

              {/* Email */}
              <div className="emp-field-group">
                <label className="emp-field-label">البريد الإلكتروني</label>
                <input
                  type="email"
                  dir="ltr"
                  className="emp-input text-end"
                  placeholder="employee@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error.email && <span className="emp-field-error">{error.email}</span>}
              </div>

              {/* Nationality */}
              <div className="emp-field-group">
                <label className="emp-field-label">الجنسية</label>
                <input
                  type="text"
                  className="emp-input"
                  placeholder="سعودي، مصري، ..."
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                />
              </div>

              {/* Job Title */}
              <div className="emp-field-group">
                <label className="emp-field-label">المسمى الوظيفي</label>
                <select
                  className="emp-select"
                  value={jobTitleId}
                  onChange={(e) => setJobTitleId(e.target.value)}
                >
                  <option value="">اختر المسمى الوظيفي</option>
                  {jobTitles.map((jt) => (
                    <option key={jt.id} value={jt.id}>
                      {jt.title || jt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Work Type */}
              <div className="emp-field-group">
                <label className="emp-field-label">نوع العمل</label>
                <select
                  className="emp-select"
                  value={worktype}
                  onChange={(e) => setWorktype(e.target.value)}
                >
                  <option value={0}>دوام كامل</option>
                  <option value={1}>دوام جزئي</option>
                </select>
              </div>

              {/* Qualification */}
              <div className="emp-field-group">
                <label className="emp-field-label">المؤهل العلمي</label>
                <input
                  type="text"
                  className="emp-input"
                  placeholder="بكالوريوس، دبلوم، ..."
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                />
              </div>

              {/* IBAN */}
              <div className="emp-field-group">
                <label className="emp-field-label">رقم الحساب البنكي (IBAN)</label>
                <input
                  type="text"
                  dir="ltr"
                  className="emp-input text-end"
                  placeholder="SAXXXXXXXXXXXXXXXXXXXXXXXX"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                />
              </div>

              {/* Address */}
              <div className="emp-field-group emp-full-width">
                <label className="emp-field-label">العنوان الوطني / السكن</label>
                <input
                  type="text"
                  className="emp-input"
                  placeholder="المدينة، الحي، الشارع"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* Photo Upload */}
              <div className="emp-field-group emp-full-width">
                <label className="emp-field-label">الصورة الشخصية</label>
                <input
                  type="file"
                  className="emp-input"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Salary & Allowances ── */}
          {activeStep === 2 && (
            <div className="emp-form-grid">
              {/* Basic Salary */}
              <div className="emp-field-group">
                <label className="emp-field-label">الراتب الأساسي (ريال)</label>
                <input
                  type="number"
                  className="emp-input"
                  value={basicSalary}
                  onChange={(e) => handleBasicSalaryChange(e.target.value)}
                />
              </div>

              {/* Social Insurance Ratio */}
              <div className="emp-field-group">
                <label className="emp-field-label">نسبة التأمين الاجتماعي (%)</label>
                <input
                  type="number"
                  className="emp-input"
                  value={socialInsuranceRatio}
                  onChange={(e) => handleRatioChange(e.target.value)}
                />
              </div>

              {/* Social Insurance Value */}
              <div className="emp-field-group">
                <label className="emp-field-label">مبلغ التأمين الاجتماعي المستقطع</label>
                <input
                  type="number"
                  className="emp-input"
                  value={socialInsurance}
                  onChange={(e) => setSocialInsurance(parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Housing Allowance */}
              <div className="emp-field-group">
                <label className="emp-field-label">بدل السكن (ريال)</label>
                <input
                  type="number"
                  className="emp-input"
                  value={housingAllowance}
                  onChange={(e) => setHousingAllowance(parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Transport Allowance */}
              <div className="emp-field-group">
                <label className="emp-field-label">بدل المواصلات (ريال)</label>
                <input
                  type="number"
                  className="emp-input"
                  value={transportAllowance}
                  onChange={(e) => setTransportAllowance(parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Communication Allowance */}
              <div className="emp-field-group">
                <label className="emp-field-label">بدل اتصال (ريال)</label>
                <input
                  type="number"
                  className="emp-input"
                  value={communicationAllowance}
                  onChange={(e) => setCommunicationAllowance(parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Life Allowance */}
              <div className="emp-field-group">
                <label className="emp-field-label">بدل إعاشة (ريال)</label>
                <input
                  type="number"
                  className="emp-input"
                  value={lifeAllowance}
                  onChange={(e) => setLifeAllowance(parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Work Allowance */}
              <div className="emp-field-group">
                <label className="emp-field-label">بدل طبيعة عمل (ريال)</label>
                <input
                  type="number"
                  className="emp-input"
                  value={workAllowance}
                  onChange={(e) => setWorkAllowance(parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Salary Account */}
              <div className="emp-field-group emp-full-width">
                <label className="emp-field-label">حساب ترحيل الراتب</label>
                <select
                  className="emp-select"
                  value={salaryAccount}
                  onChange={(e) => setSalaryAccount(e.target.value)}
                >
                  <option value="">اختر حساب ترحيل الراتب</option>
                  <option value="41101001,41101002">الرواتب والأجور النقدية</option>
                  <option value="42301001,42301002">مصاريف التشغيل المحملة على النشاط</option>
                  <option value="44101001,44101002">مصاريف جمع الأموال</option>
                </select>
              </div>

              {/* Salary Total Summary */}
              <div className="emp-full-width emp-salary-summary">
                <span className="emp-salary-label">إجمالي الراتب الصافي:</span>
                <span className="emp-salary-total">{calculateTotalSalary()} ريال</span>
              </div>
            </div>
          )}

          {/* ── Step 3: Documents ── */}
          {activeStep === 3 && (
            <div>
              {documents.map((doc, idx) => (
                <div key={idx} className="emp-doc-card">
                  {documents.length > 1 && (
                    <button
                      type="button"
                      className="emp-doc-delete-btn"
                      onClick={() => handleRemoveDocument(idx)}
                    >
                      حذف المستند
                    </button>
                  )}

                  <div className="emp-field-group mb-2">
                    <label className="emp-field-label">
                      عنوان المستند {idx + 1}
                    </label>
                    <input
                      type="text"
                      className="emp-input"
                      placeholder="مثال: صورة الهوية، العقد الموقع، الشهادة..."
                      value={doc.title}
                      onChange={(e) => handleDocTitleChange(idx, e.target.value)}
                    />
                  </div>

                  <div className="emp-field-group">
                    <label className="emp-field-label">ملف المستند</label>
                    <input
                      type="file"
                      className="emp-input"
                      accept=".pdf,.doc,.docx,image/*"
                      onChange={(e) => handleDocFileChange(idx, e.target.files[0])}
                    />
                    {doc.existingUrl && !doc.file && (
                      <span className="text-muted small mt-1">
                        ملف مرفق حالياً: <a href={doc.existingUrl} target="_blank" rel="noreferrer">عرض</a>
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="emp-add-doc-btn"
                onClick={handleAddDocument}
              >
                + إضافة مستند إضافي
              </button>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <div>
            {activeStep > 1 && (
              <button
                type="button"
                className="emp-btn-secondary"
                onClick={() => setActiveStep((prev) => prev - 1)}
                disabled={isSubmitting}
              >
                السابق
              </button>
            )}
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="emp-btn-secondary"
              onClick={() => setShowModal(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </button>

            {activeStep < 3 ? (
              <button
                type="button"
                className="emp-btn-primary"
                onClick={() => {
                  if (activeStep === 1 && !validateStep1()) {
                    toast.error("يرجى ملء الحقول الإلزامية");
                    return;
                  }
                  setActiveStep((prev) => prev + 1);
                }}
              >
                التالي
              </button>
            ) : (
              <button
                type="button"
                className="emp-btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner size="sm" animation="border" />
                ) : editingId ? (
                  "حفظ التعديلات"
                ) : (
                  "حفظ الموظف"
                )}
              </button>
            )}
          </div>
        </Modal.Footer>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        show={deleteModal.show}
        onHide={() => !isDeleting && setDeleteModal({ show: false, item: null })}
        centered
        dir="rtl"
        dialogClassName="add-employee-modal"
      >
        <Modal.Header closeButton>
          <div className="emp-modal-title" style={{ color: "#dc3545" }}>
            <span
              className="emp-modal-title-icon"
              style={{ background: "rgba(220, 53, 69, 0.12)", color: "#dc3545" }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </span>
            <span>تأكيد حذف الموظف</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <p style={{ margin: 0, fontSize: "15px", color: "#3a2e1d" }}>
            هل أنت متأكد من حذف الموظف{" "}
            <strong>"{deleteModal.item?.name}"</strong>؟
          </p>
          <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#8a7a66" }}>
            سيتم نقل سجل الموظف إلى سلة المحذوفات.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="emp-btn-secondary"
            onClick={() => setDeleteModal({ show: false, item: null })}
            disabled={isDeleting}
          >
            إلغاء
          </button>
          <button
            type="button"
            className="emp-btn-danger"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner size="sm" animation="border" /> : "حذف نهائي"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddNewEmployee;
