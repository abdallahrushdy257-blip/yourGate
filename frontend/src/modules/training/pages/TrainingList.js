import { useState, useEffect } from "react";
import API from "../../../api/axiosConfig";
import TrainingForm from "./TrainingForm";
import { getCurrentPeriod } from "../../../Utils/getCurrentPeriod";
import "./Training.css";


const TYPE_BADGE = {
  1: { label: "داخلي", bg: "rgba(219, 234, 254, 0.1)", color: "#60a5fa" },
  2: { label: "خارجي", bg: "rgba(237, 233, 254, 0.1)", color: "#a78bfa" },
  3: { label: "إلكتروني", bg: "rgba(204, 251, 241, 0.1)", color: "#2dd4bf" },
};

const cardStyle = {
  backgroundColor: "var(--background-color)",
  border: "1px solid var(--border-color)",
  borderRadius: "16px",
  padding: "20px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  color: "var(--text-color)",
};

const TrainingList = ({ period = getCurrentPeriod() }) => {
  const [data, setData] = useState({ data: [], stats: {}, meta: {} });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/training-records", { params: { period } });
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [period]);

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذا السجل؟")) return;
    await API.delete(`/training-records/${id}`);
    load();
  };

  const stats = data.stats ?? {};

  return (
    <div
      style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto", direction: "rtl", color: "var(--text-color)" }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 style={{ color: "var(--text-color)", fontWeight: "700", marginBottom: "8px" }}>
            سجلات التدريب
          </h2>
          <p style={{ color: "var(--text-muted, #9ca3af)", fontSize: "14px", margin: 0 }}>
            الفترة الحالية: {period}
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm((s) => !s);
            setEditing(null);
          }}
          style={{
            backgroundColor: "#00897b",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "10px 24px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0, 137, 123, 0.3)"
          }}
        >
          {showForm ? "إغلاق" : "+ إضافة تدريب"}
        </button>
      </div>

      {/* Form */}
      {(showForm || editing) && (
        <div className="mb-5">
          <TrainingForm
            period={period}
            initialData={editing}
            onSuccess={() => {
              setShowForm(false);
              setEditing(null);
              load();
            }}
          />
        </div>
      )}

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        {[
          {
            label: "إجمالي الساعات",
            value: stats.total_hours ?? 0,
            color: "#00897b",
          },
          {
            label: "عدد الدورات",
            value: stats.total_sessions ?? 0,
            color: "#60a5fa",
          },
          {
            label: "ساعة / موظف",
            value: stats.avg_per_employee ?? "—",
            color: "#a78bfa",
          },
        ].map((s) => (
          <div className="col-md-4" key={s.label}>
            <div style={cardStyle}>
              <h3
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: s.color,
                  marginBottom: "8px",
                }}
              >
                {s.value}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted, #9ca3af)",
                  fontWeight: "500"
                }}
              >
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div style={{
        backgroundColor: "var(--background-color)",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid var(--border-color)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
      }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted, #9ca3af)" }}>
            جاري التحميل...
          </div>
        ) : data.data.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted, #9ca3af)" }}>
            <p style={{ fontSize: "50px" }}>📚</p>
            <p>لا توجد سجلات تدريب لهذه الفترة</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-borderless training-table-custom mb-0" style={{ color: "var(--text-color)" }}>
              <thead style={{ backgroundColor: "rgba(0,0,0,0.2)", borderBottom: "1px solid var(--border-color)" }}>

                <tr>
                  <th style={thStyle}>الموظف</th>
                  <th style={thStyle}>عنوان الدورة</th>
                  <th style={thStyle}>الساعات</th>
                  <th style={thStyle}>النوع</th>
                  <th style={thStyle}>التاريخ</th>
                  <th style={thStyle}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((row) => {
                  const badge = TYPE_BADGE[row.type];
                  return (
                    <tr key={row.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={tdStyle}>{row.employee_name ?? "—"}</td>
                      <td style={tdStyle}>{row.title}</td>
                      <td style={{ ...tdStyle, color: "#00897b", fontWeight: "700" }}>{row.hours}h</td>
                      <td style={tdStyle}>
                        <span style={{
                          backgroundColor: badge?.bg ?? "rgba(243, 244, 246, 0.1)",
                          color: badge?.color ?? "#9ca3af",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}>
                          {badge?.label ?? row.type_label}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, color: "var(--text-muted, #9ca3af)", fontSize: "13px" }}>{row.training_date}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => { setEditing(row); setShowForm(false); }}
                          style={btnActionStyle("#60a5fa")}
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          style={btnActionStyle("#f87171")}
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const thStyle = { textAlign: "right", padding: "16px 20px", color: "var(--text-color)", fontWeight: "600", fontSize: "14px" };
const tdStyle = { padding: "16px 20px", verticalAlign: "middle", fontSize: "14px" };
const btnActionStyle = (color) => ({
  background: "none",
  border: "none",
  color: color,
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
  marginLeft: "12px",
  padding: "0"
});

export default TrainingList;
