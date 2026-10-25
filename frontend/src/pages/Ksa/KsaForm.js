import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterTextBox from "../../components/RegisterTextBox";
import CustomButton from "../../components/CustomButton";
import UploadInput from "../../components/UploadInput"; // 1. استيراد مكون المرفقات

const AXES = [
  {
    key: "knowledge_score",
    label: "المعرفة",
    desc: "مستوى الإلمام بالمعلومات والمفاهيم المطلوبة للوظيفة",
    icon: "📚",
  },
  {
    key: "skills_score",
    label: "المهارات",
    desc: "القدرة على تطبيق المعرفة في بيئة العمل",
    icon: "🛠️",
  },
  {
    key: "attitude_score",
    label: "السلوك والموقف",
    desc: "الالتزام والتعاون وروح العمل الجماعي",
    icon: "🤝",
  },
];

const calcGrade = (total) => {
  if (total === null || total === undefined) return null;
  if (total >= 90) return "A+";
  if (total >= 80) return "A";
  if (total >= 70) return "B";
  if (total >= 60) return "C";
  if (total >= 50) return "D";
  return "F";
};

const KsaForm = ({ period, onSuccess, initialData = null }) => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: initialData?.employee_id ?? "",
    assessor_id: initialData?.assessor_id ?? "",
    knowledge_score: initialData?.knowledge_score ?? "",
    skills_score: initialData?.skills_score ?? "",
    attitude_score: initialData?.attitude_score ?? "",
    period: period,
    assessed_at: initialData?.assessed_at ?? new Date().toISOString().split("T")[0],
    notes: initialData?.notes ?? "",
  });

  const [attachment, setAttachment] = useState(null); // 2. State لتخزين الملف المرفق
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

  const scores = [form.knowledge_score, form.skills_score, form.attitude_score]
    .map(Number)
    .filter((s) => !isNaN(s) && s !== 0);
  const liveTotal = scores.length
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
    : null;
  const liveGrade = calcGrade(liveTotal);

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
        // نستخدم POST مع _method=PUT لأن بعض السيرفرات تجد صعوبة في التعامل مع FormData عبر PUT المباشر
        formData.append("_method", "PUT");
        await API.post(`/ksa-assessments/${initialData.id}`, formData, config);
      } else {
        await API.post("/ksa-assessments", formData, config);
      }
      onSuccess?.();
    } catch (e) {
      setError(e.response?.data?.message ?? "حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  const primaryColor = "#00897b";

  return (
    <div
      style={{
        backgroundColor: "var(--background-color)",
        color: "var(--text-color)",
        direction: "rtl",
      }}
    >
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Live Score Banner */}
      {liveTotal !== null && (
        <div
          style={{
            backgroundColor: "rgba(0, 137, 123, 0.1)",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: `1px solid ${primaryColor}`,
          }}
        >
          <div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
              الدرجة الإجمالية
            </p>
            <p style={{ fontSize: "32px", fontWeight: "800", color: primaryColor, margin: "4px 0 0" }}>
              {liveTotal}%
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "40px", fontWeight: "800", color: primaryColor, margin: 0 }}>
              {liveGrade}
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
              التقدير
            </p>
          </div>
        </div>
      )}

      {/* Selects Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="">
          <RegisterSelect
            id="employee_id"
            label="الموظف *"
            options={[
              { value: "", label: "اختر الموظف" },
              ...employees.map((emp) => ({ value: emp.id, label: emp.name })),
            ]}
            value={form.employee_id}
            onChange={(e) => set("employee_id", e.target.value)}
          />
        </div>
        <div className="responParent">
              <p style={{ width: "100%", textAlign: "right" }} className="mb-1">
               تاريخ التقييم *
              </p>
              <input
               id="assessed_at"
                style={{ width: "100%" }}
                type="date"
                className="custom-datepicker mb-3"
                value={form.assessed_at}
                onChange={(e) => set("assessed_at", e.target.value)}
              />
            </div>
      </div>

      <div className="row">
        <div className="col-md-12 mb-4">
          <RegisterSelect
            id="assessor_id"
            label="المقيّم (اختياري)"
            options={[
              { value: "", label: "اختر المقيّم" },
              ...employees.map((emp) => ({ value: emp.id, label: emp.name })),
            ]}
            value={form.assessor_id}
            onChange={(e) => set("assessor_id", e.target.value)}
          />
        </div>
      </div>

      {/* Axes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "30px", marginBottom: "30px" }}>
        {AXES.map((axis) => (
          <div key={axis.key}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <span style={{ fontSize: "24px" }}>{axis.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "15px", fontWeight: "700", margin: 0 }}>{axis.label}</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>{axis.desc}</p>
              </div>
              {form[axis.key] !== "" && (
                <span style={{ fontSize: "16px", fontWeight: "800", color: primaryColor }}>
                  {form[axis.key]}%
                </span>
              )}
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={form[axis.key] === "" ? 0 : form[axis.key]}
              onChange={(e) => set(axis.key, Number(e.target.value))}
              style={{ width: "100%", accentColor: primaryColor, cursor: "pointer" }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
              {[0, 25, 50, 75, 100].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set(axis.key, v)}
                  style={{
                    fontSize: "12px",
                    padding: "4px 12px",
                    borderRadius: "8px",
                    border: `1px solid ${Number(form[axis.key]) === v ? primaryColor : "var(--border-color)"}`,
                    backgroundColor: Number(form[axis.key]) === v ? primaryColor : "transparent",
                    color: Number(form[axis.key]) === v ? "#fff" : "var(--text-color)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {v}%
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <RegisterTextBox
          id="notes"
          label="ملاحظات (اختياري)"
          type="text"
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="تعليقات أو توصيات التطوير..."
          stylee={{ height: "80px" }}
        />
      </div>

      {/* 4. إدراج حقل الرفع */}
      <div className="mb-4">
        <UploadInput
          id="ksa-attachment"
          label="إرفاق ملف (اختياري)"
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

      <div className="d-flex justify-content-center mt-4">
        <CustomButton
          onClick={handleSubmit}
          disabled={loading || !form.employee_id}
          text={loading ? "جاري الحفظ..." : initialData ? "حفظ التعديلات" : "حفظ التقييم"}
        />
      </div>
    </div>
  );
};

export default KsaForm;