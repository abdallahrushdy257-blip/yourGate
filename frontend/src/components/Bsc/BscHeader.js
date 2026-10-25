// src/components/Bsc/BscHeader.jsx — النسخة المصححة

import { usePeriods } from '../../hooks/useBsc';

const BscHeader = ({ orgName, period, onPeriodChange, onRefresh, refreshing }) => {
  const periodsFromApi = usePeriods();

  // ── تأكد إن الـ period الحالي موجود في القائمة دايماً ───────────
  const periods = periodsFromApi.includes(period)
    ? periodsFromApi
    : [period, ...periodsFromApi]; // أضف الـ period الحالي لو مش موجود

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          بطاقة الأداء المتوازن
        </h1>
        {orgName && (
          <p className="text-sm text-gray-500 mt-1">{orgName}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Period Selector */}
        <select
          value={period}
          onChange={e => onPeriodChange(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2
                     bg-white text-gray-700 focus:outline-none focus:ring-2
                     focus:ring-blue-500"
        >
          {periods.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* زر تحديث */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm bg-blue-600 text-white
                     px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50
                     transition-colors"
        >
          <span className={refreshing ? 'animate-spin inline-block' : ''}>↻</span>
          تحديث
        </button>
      </div>
    </div>
  );
};

export default BscHeader;