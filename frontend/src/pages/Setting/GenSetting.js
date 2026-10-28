import "./setting.css";
import { useState, useEffect } from "react";
import { settingsService } from "../../modules/settings";
import { Form, Spinner } from "react-bootstrap";
import CustomButton from "../../components/CustomButton";
import RegisterTextbox from "../../components/RegisterTextBox";
import SettingTabs from "./SettingTabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faBuilding,
  faFileAlt,
  faPrint,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

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

      // data.data لأن axios بيحط الـ response في .data
      const printData = printRes.data[0];

      if (printData?.settings) {
        const dbSettings = printData.settings;

        let finalSettings = {};
        Object.keys(DEFAULT_PRINT_SETTINGS).forEach((key) => {
          finalSettings[key] = {
            ...DEFAULT_PRINT_SETTINGS[key],
            ...(dbSettings[key] ?? {}),
            // معالجة null في free_text.value
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

  // تحقق إن printSettings وقت الـ submit فيها الـ enabled صح
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    console.log("saving:", printSettings); // شوف الـ state قبل الإرسال
    try {
      await settingsService.savePrintSettings(printSettings);
      toast.success("تم حفظ جميع الإعدادات بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="setting-page-wrapper" dir="rtl">
      {/* <SettingTabs activeTab="general" /> */}

      <div className="setting-content-container">
        <Form onSubmit={handleSubmit}>
          {/* Representative Section */}
          <div className="setting-card mb-5">
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
          <div className="setting-card mb-5">
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

          {/* Print Settings Section */}
          <div className="setting-card mb-5">
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
                    ),
                )}
              </div>
            </div>
          </div>

          {/* Free Text Section */}
          <div className="setting-card mb-5">
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

          {/* Submit All */}
          <div className="d-flex justify-content-center mb-5 sticky-bottom-btn">
            <CustomButton
              text={saving ? "جاري الحفظ..." : "حفظ جميع الإعدادات"}
              disabled={saving}
              type="submit"
            />
          </div>
        </Form>
      </div>
    </div>
  );
}

export default GenSetting;
