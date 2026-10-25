// src/hooks/useBsc.js

import { useState, useEffect, useCallback } from 'react';
import { fetchOrgBsc, fetchAllBsc, fetchPeriods, recalculateBsc } from '../services/bscService';

// ── Helper: استخرج الـ message من Axios error ─────────────────────
// الـ interceptor بيعرض Toast تلقائي، بس لو محتاج الـ message في الـ state
const extractError = (e) =>
  e?.response?.data?.message ?? e?.message ?? 'حدث خطأ غير متوقع';

// ── Hook: داشبورد جمعية واحدة ─────────────────────────────────────
export const useOrgBsc = (orgId, period) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetchOrgBsc(orgId, period);
      setData(res);
    } catch (e) {
      setError(extractError(e));
    } finally {
      setLoading(false);
    }
  }, [orgId, period]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refetch: load };
};

// ── Hook: كل الجمعيات ────────────────────────────────────────────
export const useAllBsc = (period) => {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData([]);
    try {
      const res = await fetchAllBsc(period);
      setData(res.data ?? []);
    } catch (e) {
      setError(extractError(e));
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refetch: load };
};

// ── Hook: الفترات المتاحة ─────────────────────────────────────────
export const usePeriods = () => {
  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    fetchPeriods()
      .then(res => setPeriods(res.periods ?? []))
      .catch(() => {}); // الـ interceptor بيتكلم عنه
  }, []);

  return periods;
};

// ── Hook: إعادة حساب يدوي ────────────────────────────────────────
export const useRecalculate = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState(null);

  const recalculate = async (orgId, period) => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      await recalculateBsc(orgId, period);
      setSuccess(true);
    } catch (e) {
      setError(extractError(e));
    } finally {
      setLoading(false);
    }
  };

  return { recalculate, loading, success, error };
};