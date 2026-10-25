// src/components/Bsc/BscRadarChart.jsx

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const PERSPECTIVE_LABELS = {
  finance:  'المالية',
  internal: 'العمليات',
  clients:  'المستفيدون',
  growth:   'النمو',
};

const BscRadarChart = ({ perspectives }) => {
  const data = Object.entries(perspectives ?? {}).map(([key, val]) => ({
    subject:  PERSPECTIVE_LABELS[key] ?? key,
    score:    val?.score ?? 0,
    fullMark: 100,
  }));

  if (data.every(d => d.score === 0)) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: '12rem', color: "var(--text-color)", opacity: 0.4 }}
      >
        لا توجد بيانات كافية لعرض الرسم البياني
      </div>
    );
  }

  // جيب الـ text color من الـ CSS variable
  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-color').trim() || '#6b7280';

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="rgba(128,128,128,0.2)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 12, fill: textColor, fontFamily: 'inherit' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: textColor, opacity: 0.5 }}
          tickCount={5}
        />
        <Radar
          name="الأداء"
          dataKey="score"
          stroke="#0d6efd"
          fill="#0d6efd"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Tooltip
          formatter={(v) => [`${v}%`, 'الأداء']}
          contentStyle={{
            borderRadius:    '8px',
            fontSize:        '12px',
            border:          '1px solid rgba(128,128,128,0.2)',
            backgroundColor: "var(--background-color)",
            color:           "var(--text-color)",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default BscRadarChart;