// src/components/Surveys/SurveyForm.jsx

import { useState } from 'react';
import API from '../../api/axiosConfig';

const SATISFACTION_LABELS = {
  1: { label: 'سيء جداً',  emoji: '😞' },
  2: { label: 'سيء',       emoji: '😕' },
  3: { label: 'مقبول',     emoji: '😐' },
  4: { label: 'جيد',       emoji: '😊' },
  5: { label: 'ممتاز',     emoji: '😄' },
};

const SurveyForm = ({ period, humancaseId = null, onSuccess }) => {
  const [form, setForm]       = useState({
    satisfaction_score: null,
    nps_score:          null,
    notes:              '',
    period:             period,
    humancase_id:       humancaseId,
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleSubmit = async () => {
    if (!form.satisfaction_score && form.nps_score === null) {
      setError('يرجى تعبئة تقييم الرضا أو مؤشر الترشيح على الأقل');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await API.post('/surveys', form);
      onSuccess?.();
    } catch (e) {
      setError(e.response?.data?.message ?? 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl p-6 shadow-sm border border-gray-100" dir="rtl" style={{ backgroundColor: '--var(--background-color)' , width: '80%' , margin: '10px auto' , padding: '20px' }}>
      <h3 className="text-lg font-semibold text-gray-800 mb-6">استبيان رضا المستفيد</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm
                        rounded-xl p-3 mb-4">
          {error}
        </div>
      )}

      {/* تقييم الرضا 1-5 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          مستوى الرضا عن الخدمة
        </label>
        <div style={{display:"flex" , justifyContent:"center" , gap:"10px"}}>
          {[1, 2, 3, 4, 5].map(score => (
            <button
              key={score}
              onClick={() => setForm(f => ({ ...f, satisfaction_score: score }))}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2
                          transition-all w-16
                          ${form.satisfaction_score === score
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'}`}
              style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '10px',
    borderRadius: '12px',
    border: form.satisfaction_score === score
      ? '2px solid #3b82f6'
      : '2px solid #e5e7eb',
    backgroundColor: form.satisfaction_score === score ? '#eff6ff' : '#fff',
    width: '150px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }}
            >
              <span className="text-2xl">{SATISFACTION_LABELS[score].emoji}</span>
              <span className="text-xs text-gray-600">{SATISFACTION_LABELS[score].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* NPS 0-10 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ما مدى ترشيحك لنا للآخرين؟
        </label>
        <p className="text-xs text-gray-400 mb-3">0 = لن أرشح، 10 = سأرشح بالتأكيد</p>
        <div className="flex gap-1.5 flex-wrap" style={{display:"flex" , justifyContent:"center" , gap:"10px"}}>
          {[...Array(11)].map((_, i) => (
            <button
              key={i}
              onClick={() => setForm(f => ({ ...f, nps_score: i }))}
              className={`w-10 h-10 rounded-lg text-sm font-semibold border-2
                          transition-all
                          ${form.nps_score === i
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : i <= 6
                              ? 'border-red-200 text-red-500 hover:border-red-400'
                              : i <= 8
                                ? 'border-yellow-200 text-yellow-600 hover:border-yellow-400'
                                : 'border-green-200 text-green-600 hover:border-green-400'
                          }`}
              style={{
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid',
    backgroundColor: form.nps_score === i ? '#3b82f6' : '#fff',
    color: form.nps_score === i
      ? '#fff'
      : i <= 6 ? '#ef4444' : i <= 8 ? '#ca8a04' : '#16a34a',
    borderColor: form.nps_score === i
      ? '#3b82f6'
      : i <= 6 ? '#fca5a5' : i <= 8 ? '#fde68a' : '#86efac',
  }}
            >
              {i}
            </button>
          ))}
        </div>

        {/* NPS Legend */}
        <div className="flex gap-4 mt-2 text-xs text-gray-400" style={{display:"flex" , justifyContent:"center" , gap:"10px"}}>
          <span><span className="text-red-400">■</span> منتقد (0-6)</span>
          <span><span className="text-yellow-400">■</span> محايد (7-8)</span>
          <span><span className="text-green-400">■</span> مروّج (9-10)</span>
        </div>
      </div>

      {/* ملاحظات */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ملاحظات (اختياري)
        </label>
        <textarea
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          placeholder="أي تعليقات أو اقتراحات..."
          rows={3}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm
                     text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                     resize-none"
                      style={{ backgroundColor: '--var(--background-color)' , color: '--var(--text-color)' , border: '3px solid var(--border-color)' , borderRadius: '18px' , width: '100%' }}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium
                   hover:bg-blue-700 disabled:opacity-50 transition-colors"
        style={{ backgroundColor: '--var(--background-color)' , color: '--var(--text-color)' , border: '3px solid var(--border-color)' , borderRadius: '18px' , margin:"10px 350px" }}
      >
        {loading ? 'جاري الحفظ...' : 'حفظ الاستبيان'}
      </button>
    </div>
  );
};

export default SurveyForm;