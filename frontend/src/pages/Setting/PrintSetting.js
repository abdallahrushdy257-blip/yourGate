import { useState, useEffect } from "react";
import CustomButton from "../../components/CustomButton";
import SettingTabs from "./SettingTabs";
import { Form } from "react-bootstrap";
import API from "../../api/axiosConfig";
import { text } from "@fortawesome/fontawesome-svg-core";

function PrintSetting() {
     // -------- DEFAULT SETTINGS ---------
  const defaultSettings = {
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


  const [settings, setSettings] = useState(defaultSettings);

  // -------- LOAD FROM API ON MOUNT ---------
  useEffect(() => {
  API.get("/print")
    .then((res) => {
      if (res.data?.settings) {

        let dbSettings = res.data.settings;
        //console.log('settings' ,dbSettings);
        let finalSettings = {};

        Object.keys(defaultSettings).forEach((key) => {
          finalSettings[key] = {
            ...defaultSettings[key],     // default values
            ...dbSettings[key],          // overwrite only fields from DB
          };
        });

        setSettings(finalSettings);
      }
    })
    .catch(() => {});
}, []);

  const toggleEnabled = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const changePosition = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], position: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    API.post("/print/store", {
    settings: settings
});
  };
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <SettingTabs activeTab="print" />

      <Form onSubmit={handleSubmit}>
        <div style={{ marginTop: "20px", width: "100%" }}>
          <h4 style={{ marginBottom: "20px", textAlign: "center" }}>
            إعدادات ظهور رأس أو ذيل الفاتورة
          </h4>

          {Object.keys(settings).map((key) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <p style={{ margin: 0, width: "200px" }}>{settings[key].label}</p>

              {/* Toggle Switch */}
              <label
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "50px",
                  height: "24px",
                }}
              >
                <input
                  type="checkbox"
                  checked={settings[key].enabled}
                  onChange={() => toggleEnabled(key)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: settings[key].enabled ? "#2196F3" : "#ccc",
                    transition: ".4s",
                    borderRadius: "34px",
                  }}
                ></span>
              </label>

              {/* Select Position */}
              <Form.Select
                style={{ width: "150px", marginLeft: "10px" }}
                value={settings[key].position}
                onChange={(e) => changePosition(key, e.target.value)}
              >
                <option value="head">رأس الفاتورة</option>
                <option value="tail">ذيل الفاتورة</option>
              </Form.Select>
            </div>
          ))}
          <div
            style={{
              width: "100%",
              margin: "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CustomButton
              text="حفظ"
              type="submit"
              style={{ textAlign: "center" }}
            />
          </div>
        </div>
    
      </Form>
    </div>
  );
}

export default PrintSetting;