import "./setting.css";
import { useState, useEffect } from "react";
import { settingsService } from "../../../../modules/settings";
import { Form, Spinner } from "react-bootstrap";
import CustomButton from "../../../../components/CustomButton";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import SettingTabs from "./SettingTabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faBuilding,
  faFileAlt,
  faPrint,
<<<<<<< HEAD
=======
  faPoll,
  faPlus,
  faTrashAlt,
  faSave,
  faInfoCircle,
>>>>>>> 6dd3331de590899fc05b1df69047e8f83980c401
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import {
  getStoredSurveyQuestions,
  saveStoredSurveyQuestions,
} from "./SurveySetting";

const DEFAULT_PRINT_SETTINGS = {
  showAssociationName: {
    enabled: true,
    position: "head",
    label: "اسم الجمعية",
  },
  showInvoiceNumber: {
    enabled: false,
    position: "head",
    label: "رقم الفاتورة",
  },
  type: { enabled: false, position: "head", label: "نوع الفاتورة" },
  address: { enabled: false, position: "head", label: "العنوان" },
  showLogo: { enabled: false, position: "head", label: "ظهور الشعار" },
  taxNum: { enabled: false, position: "tail", label: "الرقم الضريبي" },
  email: { enabled: false, position: "tail", label: "البريد الإلكتروني" },
  whats: { enabled: false, position: "tail", label: "رقم الواتساب" },
  web: { enabled: false, position: "tail", label: "الموقع الإلكتروني" },
  phone: { enabled: false, position: "tail", label: "رقم الجوال" },
  seal: { enabled: false, position: "tail", label: "الختم الإلكتروني" },
  free_text: { enabled: true, value: "", label: "نص حر" },
};

function GenSetting() {
  const [activeTab, setActiveTab] = useState("general");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [printSettings, setPrintSettings] = useState(DEFAULT_PRINT_SETTINGS);
  const [formData, setFormData] = useState({
    orgName: "",
    orgPhone: "",
    orgRegion: "",
    orgCity: "",
    orgRegNum: "",
    orgWhatsapp: "",
    orgWebsite: "",
    orgTaxNum: "",
    orgTaxFile: "",
  });

  // Survey questions state
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [loadingSurvey, setLoadingSurvey] = useState(false);
  const [savingSurvey, setSavingSurvey] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load Rep/Org Info
      const userRes = await settingsService.getRepresentativeInfo();
      const userData = userRes.data;
      setUser(userData);
      setFormData({
        orgName: userData?.organization?.name || "",
        orgPhone: userData?.organization?.phone || "",
        orgRegion: userData?.organization?.region || "",
        orgCity: userData?.organization?.city || "",
        orgRegNum: userData?.organization?.registration_number || "",
        orgWhatsapp: userData?.organization?.phone || "",
        orgWebsite: userData?.organization?.website || "",
        orgTaxNum: userData?.organization?.tax_number || "",
        orgTaxFile: userData?.organization?.tax_register || "",
      });

      // Load Print Settings
      const printRes = await settingsService.getPrintSettings();
      const printData = printRes.data[0];

      if (printData?.settings) {
        const dbSettings = printData.settings;
        let finalSettings = {};
        Object.keys(DEFAULT_PRINT_SETTINGS).forEach((key) => {
          finalSettings[key] = {
            ...DEFAULT_PRINT_SETTINGS[key],
            ...(dbSettings[key] ?? {}),
            ...(key === "free_text" && dbSettings[key]?.value === null
              ? { value: "" }
              : {}),
          };
        });
        setPrintSettings(finalSettings);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Load survey questions
    (async () => {
      setLoadingSurvey(true);
      const list = await getStoredSurveyQuestions();
      setSurveyQuestions(list || []);
      setLoadingSurvey(false);
    })();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const togglePrintEnabled = (key) => {
    setPrintSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const changePrintPosition = (key, value) => {
    setPrintSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], position: value },
    }));
  };

  const handleFreeTextChange = (value) => {
    setPrintSettings((prev) => ({
      ...prev,
      free_text: { ...prev.free_text, value: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await settingsService.savePrintSettings(printSettings);
      if (res.data?.success) {
        toast.success(res.data.message || "تم حفظ الإعدادات بنجاح");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  // Survey handlers
  const handleAddQuestion = () => {
    const newQ = {
      id: Date.now(),
      question: "",
      type: "choice",
      options: ["ممتاز", "جيد", "مقبول", "ضعيف"],
    };
    setSurveyQuestions([...surveyQuestions, newQ]);
  };

  const handleRemoveQuestion = (id) => {
    setSurveyQuestions(surveyQuestions.filter((q) => q.id !== id));
  };

  const handleQuestionTextChange = (id, text) => {
    setSurveyQuestions(
      surveyQuestions.map((q) => (q.id === id ? { ...q, question: text } : q))
    );
  };

  const handleQuestionTypeChange = (id, type) => {
    setSurveyQuestions(
      surveyQuestions.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            type,
            options: type === "text" ? [] : q.options.length ? q.options : ["نعم", "لا"],
          };
        }
        return q;
      })
    );
  };

  const handleAddOption = (questionId) => {
    setSurveyQuestions(
      surveyQuestions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [...q.options, `خيار ${q.options.length + 1}`],
          };
        }
        return q;
      })
    );
  };

  const handleOptionChange = (questionId, optIndex, val) => {
    setSurveyQuestions(
      surveyQuestions.map((q) => {
        if (q.id === questionId) {
          const newOpts = [...q.options];
          newOpts[optIndex] = val;
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  };

  const handleRemoveOption = (questionId, optIndex) => {
    setSurveyQuestions(
      surveyQuestions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.filter((_, idx) => idx !== optIndex),
          };
        }
        return q;
      })
    );
  };

  const handleSaveSurvey = async (e) => {
    e?.preventDefault();
    for (let i = 0; i < surveyQuestions.length; i++) {
      if (!surveyQuestions[i].question.trim()) {
        toast.warning(`يرجى كتابة نص السؤال رقم ${i + 1}`);
        return;
      }
      if (surveyQuestions[i].type === "choice" && surveyQuestions[i].options.length === 0) {
        toast.warning(`يرجى إضافة خيارات إجابة للسؤال رقم ${i + 1}`);
        return;
      }
    }

    setSavingSurvey(true);
    try {
      await saveStoredSurveyQuestions(surveyQuestions);
      toast.success("تم حفظ إعدادات أسئلة الاستبيان بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء حفظ أسئلة الاستبيان");
    } finally {
      setSavingSurvey(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <div className="setting-page-wrapper" dir="rtl">
      {/* Settings Navigation Tabs */}
      <SettingTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="setting-content-container">
        {/* TAB 1: General Info */}
        {activeTab === "general" && (
          <Form onSubmit={handleSubmit}>
            {/* Representative Section */}
            <div className="setting-card mb-4">
              <div className="card-header-custom">
                <FontAwesomeIcon icon={faUserTie} className="header-icon" />
                <h3>بيانات الممثل</h3>
              </div>
              <div className="card-body-custom">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <RegisterTextbox
                      id="repName"
                      label="إسم الممثل"
                      type="text"
                      value={user?.name}
                      disabled
                      parentStyle={{ width: "100%" }}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <RegisterTextbox
                      id="repEmail"
                      label="البريد الإلكتروني"
                      type="text"
                      value={user?.email}
                      disabled
                      parentStyle={{ width: "100%" }}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <RegisterTextbox
                      id="repPhone"
                      label="رقم الجوال"
                      type="text"
                      value={user?.phone}
                      disabled
                      parentStyle={{ width: "100%" }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <RegisterTextbox
                      id="repAddress"
                      label="عنوان الممثل"
                      type="text"
                      value={user?.address}
                      disabled
                      parentStyle={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Section */}
            <div className="setting-card mb-4">
              <div className="card-header-custom header-org">
                <FontAwesomeIcon icon={faBuilding} className="header-icon" />
                <h3>بيانات الجمعية</h3>
              </div>
              <div className="card-body-custom">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <RegisterTextbox
                      id="orgName"
                      label="إسم الجمعية"
                      type="text"
                      value={formData.orgName}
                      onChange={handleChange}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>
                  <div className="col-md-4">
                    <RegisterTextbox
                      id="orgPhone"
                      label="رقم الهاتف"
                      type="text"
                      value={formData.orgPhone}
                      onChange={handleChange}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>
                  <div className="col-md-4">
                    <RegisterTextbox
                      id="orgWhatsapp"
                      label="رقم الواتساب"
                      type="text"
                      value={formData.orgWhatsapp}
                      onChange={handleChange}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <RegisterTextbox
                      id="orgRegion"
                      label="المنطقة"
                      type="text"
                      value={formData.orgRegion}
                      onChange={handleChange}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <RegisterTextbox
                      id="orgCity"
                      label="المدينة"
                      type="text"
                      value={formData.orgCity}
                      onChange={handleChange}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <RegisterTextbox
                      id="orgRegNum"
                      label="رقم التسجيل"
                      type="text"
                      value={formData.orgRegNum}
                      onChange={handleChange}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>
                  <div className="col-md-4">
                    <RegisterTextbox
                      id="orgTaxNum"
                      label="الرقم الضريبي"
                      type="text"
                      value={formData.orgTaxNum}
                      onChange={handleChange}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>
                  <div className="col-md-4">
                    <RegisterTextbox
                      id="orgTaxFile"
                      label="السجل التجاري"
                      type="text"
                      value={formData.orgTaxFile}
                      onChange={handleChange}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <RegisterTextbox
                      id="orgWebsite"
                      label="الموقع الإلكتروني"
                      type="text"
                      value={formData.orgWebsite}
                      onChange={handleChange}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center mb-5">
              <CustomButton
                text={saving ? "جاري الحفظ..." : "حفظ بيانات الجمعية"}
                disabled={saving}
                type="submit"
              />
            </div>
          </Form>
        )}

        {/* TAB 2: Print Settings */}
        {activeTab === "print" && (
          <Form onSubmit={handleSubmit}>
            <div className="setting-card mb-4">
              <div className="card-header-custom header-print">
                <FontAwesomeIcon icon={faPrint} className="header-icon" />
                <h3>إعدادات الطباعة (رأس وذيل الفاتورة)</h3>
              </div>
              <div className="card-body-custom">
                <div className="row">
                  {Object.keys(printSettings).map(
                    (key) =>
                      key !== "free_text" && (
                        <div key={key} className="col-md-6 mb-3">
                          <div className="print-setting-item">
                            <div className="d-flex align-items-center gap-3 flex-grow-1">
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={printSettings[key].enabled}
                                  onChange={() => togglePrintEnabled(key)}
                                />
                                <span className="slider"></span>
                              </label>
                              <span className="print-label">
                                {printSettings[key].label}
                              </span>
                            </div>
                            <select
                              className="form-select form-select-sm print-select"
                              value={printSettings[key].position}
                              onChange={(e) =>
                                changePrintPosition(key, e.target.value)
                              }
                            >
                              <option value="head">رأس الفاتورة</option>
                              <option value="tail">ذيل الفاتورة</option>
                            </select>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center mb-5">
              <CustomButton
                text={saving ? "جاري الحفظ..." : "حفظ إعدادات الطباعة"}
                disabled={saving}
                type="submit"
              />
            </div>
          </Form>
        )}

        {/* TAB 3: Survey Settings */}
        {activeTab === "survey" && (
          <div className="setting-card mb-4">
            <div className="card-header-custom">
              <FontAwesomeIcon
                icon={faPoll}
                className="header-icon"
                style={{ color: "#b89358" }}
              />
              <h3>إعدادات أسئلة استبيان رضا المستفيدين</h3>
            </div>

            <div style={{ padding: "24px 30px" }}>
              <div
                style={{
                  border: "1px solid #ebdccb",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "14px",
                }}
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  style={{ color: "#b89358", fontSize: "18px" }}
                />
                <div>
                  قم بإضافة وتخصيص الأسئلة والخيارات التي ستظهر للموظف والمستفيد في
                  صفحة <strong>استبيان رضا المستفيدين (employeesurvey)</strong>.
                </div>
              </div>

              {loadingSurvey ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <Spinner animation="border" variant="warning" />
                  <p style={{ marginTop: "12px", color: "#8a7558" }}>
                    جاري تحميل الأسئلة...
                  </p>
                </div>
              ) : (
                <Form onSubmit={handleSaveSurvey}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    {surveyQuestions.map((q, idx) => (
                      <div
                        key={q.id || idx}
                        style={{
                          borderRadius: "16px",
                          padding: "20px",
                          position: "relative",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                        }}
                        className="border"
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "14px",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "700",
                              fontSize: "13px",
                              padding: "4px 12px",
                              borderRadius: "10px",
                            }}
                          >
                            سؤال {idx + 1}
                          </span>

                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            style={{
                              borderRadius: "8px",
                              fontSize: "12px",
                              padding: "4px 10px",
                            }}
                            onClick={() => handleRemoveQuestion(q.id)}
                            title="حذف هذا السؤال"
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              style={{ marginLeft: "4px" }}
                            />
                            حذف السؤال
                          </button>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 180px",
                            gap: "14px",
                            marginBottom: "14px",
                          }}
                        >
                          <div>
                            <label
                              style={{
                                fontSize: "13px",
                                fontWeight: "600",
                                marginBottom: "6px",
                                display: "block",
                              }}
                            >
                              نص السؤال:
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              style={{
                                borderRadius: "10px",
                                border: "1.5px solid #d8cbba",
                                padding: "8px 14px",
                                fontSize: "14px",
                              }}
                              value={q.question}
                              onChange={(e) =>
                                handleQuestionTextChange(q.id, e.target.value)
                              }
                              placeholder="أدخل صيغة السؤال هنا..."
                              required
                            />
                          </div>

                          <div>
                            <label
                              style={{
                                fontSize: "13px",
                                fontWeight: "600",
                                marginBottom: "6px",
                                display: "block",
                              }}
                            >
                              نوع الإجابة:
                            </label>
                            <select
                              className="form-select"
                              style={{
                                borderRadius: "10px",
                                border: "1.5px solid #d8cbba",
                                padding: "8px 12px",
                                fontSize: "13.5px",
                              }}
                              value={q.type}
                              onChange={(e) =>
                                handleQuestionTypeChange(q.id, e.target.value)
                              }
                            >
                              <option value="choice">اختيار من متعدد</option>
                              <option value="text">إجابة نصية / تعليق</option>
                            </select>
                          </div>
                        </div>

                        {q.type === "choice" && (
                          <div
                            style={{
                              padding: "16px 18px",
                              borderRadius: "14px",
                              border: "1.5px dashed var(--border-color, #e2d7c7)",
                              backgroundColor: "rgba(184, 147, 88, 0.03)",
                              marginTop: "10px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "14px",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span
                                  style={{
                                    fontSize: "13.5px",
                                    fontWeight: "700",
                                    color: "var(--text-color, #333)",
                                  }}
                                >
                                  خيارات الإجابة:
                                </span>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    color: "var(--text-muted, #8a7558)",
                                    fontWeight: "500",
                                  }}
                                >
                                  ({q.options.length} خيارات متاحة)
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAddOption(q.id)}
                                className="btn btn-sm"
                                style={{
                                  fontSize: "12.5px",
                                  fontWeight: "700",
                                  borderRadius: "10px",
                                  border: "1px solid #c9b497",
                                  background: "#fbf6ed",
                                  color: "#7a5924",
                                  padding: "5px 14px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <FontAwesomeIcon icon={faPlus} />
                                <span>إضافة خيار جديد</span>
                              </button>
                            </div>

                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                                gap: "12px",
                              }}
                            >
                              {q.options.map((opt, optIdx) => (
                                <div
                                  key={optIdx}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: "var(--background-color, #ffffff)",
                                    border: "1.5px solid var(--border-color, #e0d5c5)",
                                    borderRadius: "12px",
                                    padding: "4px 8px 4px 12px",
                                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
                                    transition: "border-color 0.2s, box-shadow 0.2s",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: "800",
                                      color: "#8c672e",
                                      backgroundColor: "#f7efe4",
                                      borderRadius: "50%",
                                      width: "24px",
                                      height: "24px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexShrink: 0,
                                      marginLeft: "8px",
                                    }}
                                  >
                                    {optIdx + 1}
                                  </span>

                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        q.id,
                                        optIdx,
                                        e.target.value
                                      )
                                    }
                                    style={{
                                      border: "none",
                                      outline: "none",
                                      fontSize: "13.5px",
                                      fontWeight: "600",
                                      color: "var(--text-color, #2b2b2b)",
                                      backgroundColor: "transparent",
                                      width: "100%",
                                      padding: "6px 4px",
                                    }}
                                    placeholder={`خيار ${optIdx + 1}...`}
                                  />

                                  {q.options.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveOption(q.id, optIdx)
                                      }
                                      style={{
                                        border: "none",
                                        background: "transparent",
                                        color: "#dc3545",
                                        borderRadius: "6px",
                                        width: "26px",
                                        height: "26px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                        lineHeight: 1,
                                        flexShrink: 0,
                                        transition: "background 0.2s",
                                      }}
                                      title="حذف هذا الخيار"
                                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(220, 53, 69, 0.1)")}
                                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "24px",
                      paddingTop: "16px",
                      borderTop: "1px solid #ebdccb",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="btn"
                      style={{
                        background: "#f5ece0",
                        color: "#6b4d24",
                        border: "1.5px dashed #cbb59b",
                        borderRadius: "12px",
                        padding: "10px 20px",
                        fontWeight: "700",
                        fontSize: "14px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        style={{ marginLeft: "8px" }}
                      />
                      إضافة سؤال جديد
                    </button>

                    <button
                      type="submit"
                      disabled={savingSurvey}
                      className="btn"
                      style={{
                        background:
                          "linear-gradient(135deg, #b89358 0%, #8c672e 100%)",
                        color: "#ffffff",
                        borderRadius: "12px",
                        padding: "10px 28px",
                        fontWeight: "700",
                        fontSize: "14.5px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(184, 147, 88, 0.3)",
                      }}
                    >
                      {savingSurvey ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            style={{ marginLeft: "8px" }}
                          />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon
                            icon={faSave}
                            style={{ marginLeft: "8px" }}
                          />
                          حفظ جميع الأسئلة
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Extra / Free Text */}
        {activeTab === "extra" && (
          <Form onSubmit={handleSubmit}>
            <div className="setting-card mb-4">
              <div className="card-header-custom header-text">
                <FontAwesomeIcon icon={faFileAlt} className="header-icon" />
                <h3>بيانات إضافية (تظهر في الطباعة)</h3>
              </div>
              <div className="card-body-custom">
                <Form.Group>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={printSettings.free_text?.enabled}
                        onChange={() => togglePrintEnabled("free_text")}
                      />
                      <span className="slider"></span>
                    </label>
                    <Form.Label className="mb-0">
                      تفعيل ظهور النص الحر في المطبوعات
                    </Form.Label>
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={printSettings.free_text?.value || ""}
                    onChange={(e) => handleFreeTextChange(e.target.value)}
                    placeholder="أدخل النص الذي تريد ظهوره في المطبوعات..."
                    disabled={!printSettings.free_text?.enabled}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-color)",
                      borderRadius: "12px",
                      padding: "15px",
                      resize: "none",
                      opacity: printSettings.free_text?.enabled ? 1 : 0.5,
                    }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="d-flex justify-content-center mb-5">
              <CustomButton
                text={saving ? "جاري الحفظ..." : "حفظ البيانات الإضافية"}
                disabled={saving}
                type="submit"
              />
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}

export default GenSetting;
