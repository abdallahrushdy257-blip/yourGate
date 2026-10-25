// src/components/Surveys/SurveyList.jsx

import { useState, useEffect } from 'react';
import API from '../../api/axiosConfig';
import SurveyForm from './SurveyForm';
import TestPreLoader from '../../pages/TestPreLoader/TestPreLoader';
import { getCurrentPeriod } from "../../Utils/getCurrentPeriod";

const NPS_BADGE = {
  promoter:  { label: 'مروّج',   bg: '#dbeafe', color: '#1d4ed8' },
  passive:   { label: 'محايد',   bg: '#ede9fe', color: '#7c3aed' },
  detractor: { label: 'منتقد', bg: '#ccfbf1', color: '#0f766e' },
};

const STARS = (score) => score
  ? '★'.repeat(score) + '☆'.repeat(5 - score)
  : '—';

const SurveyList = ({ period = getCurrentPeriod() }) =>  {
  const [data,     setData]     = useState({ data: [], stats: {}, meta: {} });
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get('/surveys', { params: { period } });
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  const getNpsCategory = (row) => {
  if (row.nps_category) return row.nps_category; // ← من الـ API
  if (row.nps_score === null || row.nps_score === undefined) return null;
  if (row.nps_score >= 9) return 'promoter';
  if (row.nps_score >= 7) return 'passive';
  return 'detractor';
};

  useEffect(() => { load(); }, [period]);

  const cardStyle = {
  backgroundColor: 'var(--background-color)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  padding: '16px',
  textAlign: 'center',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};
 

  const stats = data.stats ?? {};

  return loading ? (
    <TestPreLoader />
  ) : (
    <div style={{ 
      padding: '32px', 
      width: '90%', 
      margin: '20px auto',
      backgroundColor: 'var(--card--background, #ffffff)',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      border: '1px solid var(--border-color)',
    }} dir="rtl">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 style={{ color: 'var(--text-color)', fontWeight: 700, marginBottom: 8, fontSize: '24px' }}>استبيانات الرضا</h2>
          <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: 14, margin: 0 }}>الفترة الحالية: <span style={{ fontWeight: 600 }}>{period}</span></p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          style={{
            backgroundColor: 'var(--primary-color, #c8924a)',
            color: 'var(--buttontext-color, #fff)',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 24px',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            transition: '0.3s',
            boxShadow: '0 4px 10px rgba(200, 146, 74, 0.2)'
          }}
        >
          {showForm ? 'إغلاق' : '+ استبيان جديد'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-5 p-4" style={{ backgroundColor: 'var(--input-background)', borderRadius: '15px', border: '1px dashed var(--border-color)' }}>
          <SurveyForm
            period={period}
            onSuccess={() => { setShowForm(false); load(); }}
          />
        </div>
      )}

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        {[
          { label: 'إجمالي الاستبيانات',  value: stats.total ?? 0, icon: '📊', color: 'var(--primary-color)' },
          { label: 'متوسط الرضا',     value: stats.avg_satisfaction ?? '—', icon: '⭐', color: '#f59e0b' },
          { label: 'مؤشر NPS',     value: stats.nps !== null && stats.nps !== undefined ? stats.nps : '—', icon: '📈', color: '#7c3aed' },
        ].map(s => (
          <div className="col-4" key={s.label}>
            <div style={{
              backgroundColor: 'var(--input-background, #fdf6ec)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              transition: '0.3s'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{s.icon}</div>
              <p style={{ fontSize: 28, fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: 'var(--text-color)', marginTop: 6, fontWeight: 500, opacity: 0.9 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-color)' }}>جاري التحميل...</div>
      ) : data.data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-color)', backgroundColor: 'var(--input-background)', borderRadius: 16 }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</p>
          <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>لا توجد استبيانات لهذه الفترة</p>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'transparent', 
          borderRadius: 16, 
          overflow: 'hidden', 
          border: '1px solid var(--border-color)'
        }}>
          <table className="table mb-0" style={{ 
            color: 'var(--text-color)', 
            width: '100%', 
            borderCollapse: 'collapse',
            backgroundColor: 'transparent'
          }} >
            <thead style={{ 
              backgroundColor: 'var(--input-background)', 
              color: 'var(--text-color)'
            }}>
              <tr>
                <th style={{ textAlign: 'center', padding: '18px', fontWeight: 700, fontSize: '14px', borderBottom: '2px solid var(--border-color)', backgroundColor: 'transparent', boxShadow: 'none', color: 'inherit' }}>المستفيد</th>
                <th style={{ textAlign: 'center', padding: '18px', fontWeight: 700, fontSize: '14px', borderBottom: '2px solid var(--border-color)', backgroundColor: 'transparent', boxShadow: 'none', color: 'inherit' }}>الرضا</th>
                <th style={{ textAlign: 'center', padding: '18px', fontWeight: 700, fontSize: '14px', borderBottom: '2px solid var(--border-color)', backgroundColor: 'transparent', boxShadow: 'none', color: 'inherit' }}>NPS</th>
                <th style={{ textAlign: 'center', padding: '18px', fontWeight: 700, fontSize: '14px', borderBottom: '2px solid var(--border-color)', backgroundColor: 'transparent', boxShadow: 'none', color: 'inherit' }}>التصنيف</th>
                <th style={{ textAlign: 'center', padding: '18px', fontWeight: 700, fontSize: '14px', borderBottom: '2px solid var(--border-color)', backgroundColor: 'transparent', boxShadow: 'none', color: 'inherit' }}>التاريخ</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'transparent' }}>
              {data.data.map((row, idx) => {
                const category = getNpsCategory(row);
                const badge = NPS_BADGE[category];
                return (
                  <tr key={row.id} style={{ 
                    borderTop: '1px solid var(--border-color)',
                    backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                    boxShadow: 'none'
                  }}>
                    <td style={{ padding: '16px', fontWeight: 600, fontSize: '14px', backgroundColor: 'transparent', boxShadow: 'none', color: 'inherit' }}>
                      {row.humancase_name ?? 'غير محدد'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', color: '#f59e0b', fontSize: '1.2rem', backgroundColor: 'transparent', boxShadow: 'none' }}>
                      {STARS(row.satisfaction_score)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700, fontSize: '15px', backgroundColor: 'transparent', boxShadow: 'none', color: 'inherit' }}>
                      {row.nps_score ?? '—'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', backgroundColor: 'transparent', boxShadow: 'none' }}>
                      {badge ? (
                        <span style={{ 
                          backgroundColor: badge.bg, 
                          color: badge.color,
                          padding: '5px 14px',
                          borderRadius: '25px',
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'inline-block',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                        }}>
                          {badge.label}
                        </span>
                      ) : '—'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', color: 'var(--text-color)', opacity: 0.8, fontSize: '13px', backgroundColor: 'transparent', boxShadow: 'none' }}>
                      {row.submitted_at
                        ? new Date(row.submitted_at).toLocaleDateString('ar-SA')
                        : '—'}
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

export default SurveyList;