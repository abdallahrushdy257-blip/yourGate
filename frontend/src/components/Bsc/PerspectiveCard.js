// src/components/Bsc/PerspectiveCard.jsx

import KpiRow from './KpiRow';

const PERSPECTIVE_CONFIG = {
  finance: {
    label: 'المالية',
    icon:  '💰',
    color: 'border-t-green-500',
    bg:    'bg-green-50',
  },
  internal: {
    label: 'العمليات الداخلية',
    icon:  '⚙️',
    color: 'border-t-orange-500',
    bg:    'bg-orange-50',
  },
  clients: {
    label: 'المستفيدون',
    icon:  '🤝',
    color: 'border-t-blue-500',
    bg:    'bg-blue-50',
  },
  growth: {
    label: 'التعلم والنمو',
    icon:  '📈',
    color: 'border-t-purple-500',
    bg:    'bg-purple-50',
  },
};

const PerspectiveCard = ({ perspective, score, kpis }) => {
  const config = PERSPECTIVE_CONFIG[perspective];
  if (!config) return null;

  const scoreColor =
    score === null ? 'text-gray-400' :
    score >= 75    ? 'text-green-600' :
    score >= 50    ? 'text-yellow-600' :
                     'text-red-500';

  return (
    <div
      className={`rounded-4 shadow-sm border border-1 border-t-4 ${config.color} p-4 d-flex flex-column gap-3`}
      style={{ backgroundColor: "var(--background-color)",height:"100%" }} // ✅
    >
      <div
        className="d-flex align-items-center justify-content-between"
        style={{ backgroundColor: "var(--background-color)" }} // ✅
      >
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontSize: '1.2rem' }}>{config.icon}</span>
          <h6
            className="fw-semibold mb-0"
            style={{ color: "var(--text-color)" }} // ✅
          >
            {config.label}
          </h6>
        </div>
        <div className={`fs-5 fw-bold ${scoreColor}`}>
          {score !== null ? `${score}%` : '—'}
        </div>
      </div>

      <div className="d-flex flex-column">
        {Object.entries(kpis ?? {}).map(([key, kpi]) => (
          <KpiRow
            key={key}
            kpiKey={key}
            value={kpi?.value}
            calcAt={kpi?.calc_at}
          />
        ))}

        {Object.keys(kpis ?? {}).length === 0 && (
          <p
            className="text-center py-3 mb-0 small"
            style={{ color: "var(--text-color)", opacity: 0.5 }}
          >
            لا توجد بيانات
          </p>
        )}
      </div>
    </div>
  );
};

export default PerspectiveCard;