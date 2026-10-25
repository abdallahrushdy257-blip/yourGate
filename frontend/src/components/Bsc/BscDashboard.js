// src/components/Bsc/BscDashboard.js

import { useState } from 'react';
import { useOrgBsc, useRecalculate } from '../../hooks/useBsc';
import BscHeader       from './BscHeader';
import PerspectiveCard from './PerspectiveCard';
import BscRadarChart   from './BscRadarChart';

const BscDashboard = ({ orgId }) => {
  const currentQuarter = () => {
    const m = new Date().getMonth() + 1;
    const q = Math.ceil(m / 3);
    return `${new Date().getFullYear()}-Q${q}`;
  };

  const [period, setPeriod] = useState(() => {
  const m = new Date().getMonth() + 1;
  const q = Math.ceil(m / 3);
  return `${new Date().getFullYear()}-Q${q}`;
});
  const { data, loading, error, refetch } = useOrgBsc(orgId, period);
  const { recalculate, loading: recalcLoading } = useRecalculate();

  const handleRefresh = async () => {
    await recalculate(orgId, period);
    refetch();
  };



  if (loading) return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '16rem' }}>
      <div className="d-flex flex-column align-items-center gap-3">
        <div
          className="spinner-border text-primary"
          style={{ width: '2rem', height: '2rem', borderWidth: '2px' }}
          role="status"
        />
        <span className="small text-muted">جاري تحميل البيانات...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-3 p-sm-4 mx-auto" style={{ maxWidth: '72rem', direction: 'rtl' }}>
      <BscHeader
        orgName={null}
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={handleRefresh}
        refreshing={recalcLoading}
      />
      <div
        className="rounded-4 p-5 text-center mt-3"
        style={{ background: 'var(--background-color, #fffbeb)', border: '1px solid #fcd34d' }}
      >
        <div className="fs-1 mb-3">📭</div>
        <p className="fw-medium fs-5" style={{ color: 'var(--text-color, #92400e)' }}>
          {error}
        </p>
        <button
          onClick={refetch}
          className="btn btn-sm mt-3"
          style={{
            background: 'var(--background-color, #fef3c7)',
            color: 'var(--text-color, #92400e)',
            border: '1px solid #fcd34d',
          }}
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );

  const perspectives = data?.data?.perspectives ?? {};

  const getKpis = (perspective) => {
    const kpis = perspectives[perspective]?.kpis;
    if (Array.isArray(kpis)) return {};
    return kpis ?? {};
  };

  const scores = Object.values(perspectives)
    .map(p => p?.score)
    .filter(s => s !== null && s !== undefined);

  const overallScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  const getBannerStyle = () => {
    if (overallScore === null) return {};
    if (overallScore >= 75) return { background: 'var(--background-color, #f0fdf4)', border: '1px solid #bbf7d0' };
    if (overallScore >= 50) return { background: 'var(--background-color, #fefce8)', border: '1px solid #fde68a' };
    return { background: 'var(--background-color, #fef2f2)', border: '1px solid #fecaca' };
  };

  const getScoreTextStyle = () => {
    if (overallScore === null) return {};
    if (overallScore >= 75) return { color: 'var(--text-color, #16a34a)' };
    if (overallScore >= 50) return { color: 'var(--text-color, #ca8a04)' };
    return { color: 'var(--text-color, #ef4444)' };
  };

console.log('full data:', data);
console.log('data.perspectives:', data?.perspectives);
console.log('data.data:', data?.data);

  return (
    <div className="p-3 p-sm-4 mx-auto" style={{ maxWidth: '72rem', direction: 'rtl' }}>

      {/* Header */}
      <BscHeader
        orgName={data?.data?.name}
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={handleRefresh}
        refreshing={recalcLoading}
      />

      {/* Overall Score Banner */}
     {/* Overall Score Banner */}
{overallScore !== null && (
  <div
    className="rounded-3 p-3 mb-4 d-flex align-items-center justify-content-between border"
    style={{
      backgroundColor: "var(--background-color)",
      borderColor: overallScore >= 75 ? '#198754' :
                   overallScore >= 50 ? '#ffc107' : '#dc3545',
    }}
  >
    <div>
      <p className="small mb-0" style={{ color: "var(--text-color)" }}>
        الأداء الإجمالي
      </p>
      <p className="small mb-0" style={{ color: "var(--text-color)", opacity: 0.5 }}>
        آخر تحديث:{' '}
        {data?.data?.calc_at ? new Date(data.data.calc_at).toLocaleDateString('ar-SA') : '—'}

      </p>
    </div>
    <div
      className="display-6 fw-bold"
      style={{
        color: overallScore >= 75 ? '#198754' :
               overallScore >= 50 ? '#ffc107' : '#dc3545',
      }}
    >
      {overallScore}%
    </div>
  </div>
)}

{/* الـ 4 Cards */}
<div className="row g-3 mb-4">
  {['finance', 'internal', 'clients', 'growth'].map(p => (
    <div className="col-12 col-md-6" key={p}>
      <PerspectiveCard
        perspective={p}
        score={perspectives[p]?.score ?? null}
        kpis={getKpis(p)}
      />
    </div>
  ))}
</div>

{/* Radar Chart */}
<div
  className="rounded-3 border p-4"
  style={{ backgroundColor: "var(--background-color)" }}
>
  <h6
    className="fw-semibold mb-3"
    style={{ color: "var(--text-color)" }}
  >
    الرسم البياني للأداء
  </h6>
  <BscRadarChart perspectives={perspectives} />
</div>
    </div>
  );
};

export default BscDashboard;