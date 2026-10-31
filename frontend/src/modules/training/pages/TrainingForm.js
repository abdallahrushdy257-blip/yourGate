// src/components/Training/TrainingForm.jsx

import { useState, useEffect } from "react";
import API from "../../../api/axiosConfig";
import UploadInput from "../../../components/UploadInput"; // 1. استيراد مكون المرفقات

const TRAINING_TYPES = [
  { value: 1, label: "داخلي", icon: "🏢" },
  { value: 2, label: "خارجي", icon: "🌐" },
  { value: 3, label: "إلكتروني", icon: "💻" },
];

const TrainingForm = ({ period, onSuccess, initialData = null }) => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: initialData?.employee_id ?? "",
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    hours: initialData?.hours ?? "",
    training_date: initialData?.training_date ?? "",
    period: period,
    type: initialData?.type ?? 1,
    certificate: initialData?.certificate ?? "",
  });

  const [attachment, setAttachment] = useState(null); // 2. حالة لتخزين الملف المرفق
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.post("/employees")
      .then((res) => {
        setEmployees(res.data?.data ?? res.data ?? []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setForm((f) => ({ ...f, period }));
  }, [period]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    // 3. تحويل البيانات إلى FormData للتمكن من رفع الملف
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== undefined) {
        formData.append(key, form[key]);
      }
    });

    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (initialData) {
        formData.append("_method", "PUT");
        await API.post(`/training-records/${initialData.id}`, formData, config);
      } else {
        await API.post("/training-records", formData, config);
      }
      onSuccess?.();
    } catch (e) {
      setError(e.response?.data?.message ?? "حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    padding: "10px",
    backgroundColor: "var(--background-color)",
    color: "var(--text-color)",
    outline: "none",
    margin: "5px 0",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    color: "var(--text-color)",
    marginBottom: "5px",
    marginTop: "10px",
  };

  return (
    <div
      style={{
        backgroundColor: "var(--background-color)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "30px",
        width: "90%",
        maxWidth: "800px",
        margin: "20px auto",
        color: "var(--text-color)",
        direction: "rtl",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "25px", fontWeight: "700" }}>
        {initialData ? "تعديل سجل التدريب" : "إضافة سجل تدريب"}
      </h3>

      {error && (
        <div style={{ backgroundColor: "#fecaca", color: "#b91c1c", padding: "10px", borderRadius: "8px", marginBottom: "15px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        {/* الموظف */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>الموظف *</label>
          <select
            value={form.employee_id}
            onChange={(e) => set("employee_id", e.target.value)}
            style={inputStyle}
          >
            <option value="" style={{ backgroundColor: "var(--background-color)" }}>اختر الموظف</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id} style={{ backgroundColor: "var(--background-color)" }}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* عنوان التدريب */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>عنوان التدريب *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="مثال: دورة إدارة المشاريع"
            style={inputStyle}
          />
        </div>

        {/* عدد الساعات */}
        <div>
          <label style={labelStyle}>عدد الساعات *</label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            value={form.hours}
            onChange={(e) => set("hours", e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* تاريخ التدريب */}
        <div>
          <label style={labelStyle}>تاريخ التدريب *</label>
          <input
            type="date"
            value={form.training_date}
            onChange={(e) => set("training_date", e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* نوع التدريب */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>نوع التدريب *</label>
          <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "10px" }}>
            {TRAINING_TYPES.map((t) => (
              <button
                type="button"
                key={t.value}
                onClick={() => set("type", t.value)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  padding: "15px",
                  borderRadius: "12px",
                  border: form.type === t.value ? "2px solid #00897b" : "1px solid var(--border-color)",
                  backgroundColor: form.type === t.value ? "rgba(0, 137, 123, 0.1)" : "transparent",
                  color: "var(--text-color)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ fontSize: "24px" }}>{t.icon}</span>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* الوصف */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>الوصف (اختياري)</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="تفاصيل إضافية عن الدورة..."
            rows={3}
            style={{ ...inputStyle, height: "80px", resize: "none" }}
          />
        </div>

        {/* الشهادة */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>رقم / اسم الشهادة (اختياري)</label>
          <input
            type="text"
            value={form.certificate}
            onChange={(e) => set("certificate", e.target.value)}
            placeholder="مثال: PMP-2025-001"
            style={inputStyle}
          />
        </div>

        {/* 4. حقل مرفق الشهادة أو الملف */}
        <div style={{ gridColumn: "1 / -1" }}>
          <UploadInput
            id="training-attachment"
            label="إرفاق ملف الشهادة (اختياري)"
            parentStyle={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px",
            }}
            accept=".pdf,.doc,.docx,image/*"
            onChange={(e) => setAttachment(e.target.files[0])}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          marginTop: "30px",
          backgroundColor: "#00897b",
          color: "white",
          padding: "12px",
          borderRadius: "10px",
          border: "none",
          fontSize: "16px",
          fontWeight: "600",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "جاري الحفظ..." : initialData ? "حفظ التعديلات" : "إضافة سجل التدريب"}
      </button>
    </div>
  );
};

export default TrainingForm;