// src/components/Bsc/KpiRow.jsx

// خريطة أسماء عربية للـ KPIs
const KPI_LABELS = {
  roi:                  'العائد على الاستثمار',
  revenue_growth:       'نمو الإيرادات',
  operating_income:     'الدخل التشغيلي',
  net_margin:           'هامش الربح الصافي',
  process_efficiency:   'كفاءة العمليات',
  time_to_market:       'الوقت للإنجاز',
  quality_control:      'ضبط الجودة',
  cost_per_service:     'تكلفة الخدمة',
  satisfaction_score:   'رضا المستفيدين',
  nps:                  'مؤشر الترشيح',
  retention_rate:       'معدل الاحتفاظ',
  lifetime_value:       'القيمة الدائمة',
  market_reach:         'الوصول للمستهدفين',
  turnover_rate:        'معدل دوران الموظفين',
  engagement_score:     'مؤشر الانخراط',
  training_hours:       'ساعات التدريب',
  knowledge_retention:  'الاحتفاظ بالمعرفة',
};


const KpiRow = ({ kpiKey, value, calcAt }) => {
  const label   = KPI_LABELS[kpiKey] ?? kpiKey;
  const display = value !== null && value !== undefined
    ? `${Number(value).toLocaleString('ar-SA', { maximumFractionDigits: 1 })}%`
    : '—';

  const valueColor =
    value === null ? 'var(--text-color)' :
    value >= 75    ? '#198754' :
    value >= 50    ? '#ffc107' :
                     '#dc3545';

  const barColor =
    value >= 75 ? '#198754' :
    value >= 50 ? '#ffc107' :
                  '#dc3545';

  return (
    <div
      className="d-flex align-items-center justify-content-between py-2 border-bottom gap-3"
      style={{ borderColor: 'rgba(128,128,128,0.15)' }}
    >
      {/* اسم الـ KPI */}
      <span
        className="small flex-grow-1"
        style={{ color: "var(--text-color)" }}
      >
        {label}
      </span>

      {/* شريط التقدم */}
      <div
        className="rounded-pill"
        style={{
          width: '96px',
          height: '6px',
          backgroundColor: 'rgba(128,128,128,0.15)',
        }}
      >
        <div
          className="rounded-pill h-100 transition"
          style={{
            width:           `${Math.min(Math.max(value ?? 0, 0), 100)}%`,
            backgroundColor: value !== null ? barColor : 'transparent',
            transition:      'width 0.5s ease',
          }}
        />
      </div>

      {/* القيمة */}
      <span
        className="small fw-semibold"
        style={{ minWidth: '56px', textAlign: 'left', color: valueColor }}
      >
        {display}
      </span>
    </div>
  );
};

export default KpiRow;