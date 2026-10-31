import { useState, useEffect } from 'react';
import API from "../../../api/axiosConfig";
import KsaModal from './KsaModal';
import { getCurrentPeriod } from "../../../Utils/getCurrentPeriod";
import "./Ksa.css";

const PRIMARY_COLOR = '#00897b';

const GRADE_STYLE = {
  'A+': { bg: 'rgba(0, 137, 123, 0.1)', color: PRIMARY_COLOR },
  'A':  { bg: 'rgba(0, 137, 123, 0.1)', color: PRIMARY_COLOR },
  'B':  { bg: 'rgba(0, 137, 123, 0.1)', color: PRIMARY_COLOR },
  'C':  { bg: 'rgba(0, 137, 123, 0.1)', color: PRIMARY_COLOR },
  'D':  { bg: 'rgba(0, 137, 123, 0.1)', color: PRIMARY_COLOR },
  'F':  { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
};

const ScoreBar = ({ value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999, height: 6 }}>
      <div style={{ 
        width: `${value ?? 0}%`, 
        height: 6, 
        borderRadius: 999, 
        backgroundColor: PRIMARY_COLOR, 
        transition: 'width 0.3s' 
      }} />
    </div>
    <span style={{ fontSize: 11, color: 'var(--text-muted, #9ca3af)', width: 28 }}>{value ?? '—'}</span>
  </div>
);

const cardStyle = {
  backgroundColor: 'var(--background-color)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  padding: '16px',
  textAlign: 'center',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  color: 'var(--text-color)',
};

const KsaList = ({ period = getCurrentPeriod() }) => {
  const [data, setData] = useState({ data: [], stats: {}, meta: {} });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get('/ksa-assessments', { params: { period } });
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [period]);

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذا التقييم؟')) return;
    await API.delete(`/ksa-assessments/${id}`);
    load();
  };

  const stats = data.stats ?? {};

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-color)' }} dir="rtl">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: 'var(--text-color)', fontWeight: 700, marginBottom: 4 }}>تقييمات KSA</h2>
          <p style={{ color: 'var(--text-muted, #9ca3af)', fontSize: 13, margin: 0 }}>
            المعرفة • المهارات • السلوك — الفترة: {period}
          </p>
        </div>
        <button
          onClick={() => { setShowModal(true); setEditing(null); }}
          style={{ 
            backgroundColor: PRIMARY_COLOR, 
            color: '#fff', 
            border: 'none', 
            borderRadius: '10px', 
            padding: '8px 18px', 
            fontSize: 14, 
            fontWeight: '600',
            cursor: 'pointer' 
          }}
        >
          + تقييم جديد
        </button>
      </div>

      {/* Modal */}
      <KsaModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        period={period} 
        initialData={editing} 
        onSuccess={load} 
      />

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'إجمالي التقييمات', value: stats.total          ?? 0 },
          { label: 'متوسط المعرفة',    value: (stats.avg_knowledge ?? 0) + '%' },
          { label: 'متوسط المهارات',   value: (stats.avg_skills ?? 0) + '%' },
          { label: 'متوسط السلوك',     value: (stats.avg_attitude ?? 0) + '%' },
        ].map(s => (
          <div className="col-6 col-sm-3" key={s.label}>
            <div style={cardStyle}>
              <p style={{ fontSize: 24, fontWeight: 700, color: PRIMARY_COLOR, margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted, #9ca3af)', marginTop: 4 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted, #9ca3af)' }}>جاري التحميل...</div>
      ) : data.data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted, #9ca3af)', backgroundColor: 'var(--background-color)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: 40 }}>🎯</div>
          <p>لا توجد تقييمات لهذه الفترة</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--background-color)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <table className="table table-borderless ksa-table-custom mb-0" style={{ color: 'var(--text-color)' }}>
            <thead style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-color)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                {['الموظف','المعرفة','المهارات','السلوك','الإجمالي','التقدير','إجراءات'].map((h, i) => (
                  <th key={h} style={{ padding: '16px', textAlign: i === 0 ? 'right' : 'center', fontWeight: 600, fontSize: '14px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map(row => {
                const g = GRADE_STYLE[row.grade] ?? { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-color)' };
                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px', fontWeight: 500 }}>
                      <div>{row.employee_name ?? '—'}</div>
                      {row.assessor_name && <div style={{ fontSize: 11, color: 'var(--text-muted, #9ca3af)' }}>المقيّم: {row.assessor_name}</div>}
                    </td>
                    <td style={{ padding: '16px' }}><ScoreBar value={row.knowledge_score} /></td>
                    <td style={{ padding: '16px' }}><ScoreBar value={row.skills_score} /></td>
                    <td style={{ padding: '16px' }}><ScoreBar value={row.attitude_score} /></td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: PRIMARY_COLOR }}>{row.total_score ?? '—'}%</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ backgroundColor: g.bg, color: g.color, padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, border: '1px solid rgba(0,0,0,0.1)' }}>
                        {row.grade}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button onClick={() => { setEditing(row); setShowModal(true); }}
                        style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: 12, fontWeight: '600', cursor: 'pointer', marginLeft: 12 }}>تعديل</button>
                      <button onClick={() => handleDelete(row.id)}
                        style={{ background: 'none', border: 'none', color: '#f87171', fontSize: 12, fontWeight: '600', cursor: 'pointer' }}>حذف</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default KsaList;