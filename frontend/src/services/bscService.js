// src/services/bscService.js

import API from '../api/axiosConfig';

// ── جيب داشبورد جمعية واحدة ──────────────────────────────────────
export const fetchOrgBsc = async (orgId, period) => {
  const params = period ? { period } : {};
  const res = await API.get(`/bsc/${orgId}`, { params });
  return res.data; // ← Axios بيرجع res.data مش res.json()
};

// ── جيب كل الجمعيات — Admin ──────────────────────────────────────
export const fetchAllBsc = async (period) => {
  const params = period ? { period } : {};
  const res = await API.get('/bsc', { params });
  return res.data;
};

// ── مقارنة على KPI معين ───────────────────────────────────────────
export const fetchKpiCompare = async (kpi, period) => {
  const res = await API.get('/bsc/compare', { params: { kpi, period } });
  return res.data;
};

// ── الفترات المتاحة ───────────────────────────────────────────────
export const fetchPeriods = async () => {
  const res = await API.get('/bsc/periods');
  return res.data;
};

// ── إعادة حساب يدوي ──────────────────────────────────────────────
export const recalculateBsc = async (orgId, period) => {
  const res = await API.post(`/bsc/${orgId}/recalculate`, { period });
  return res.data;
};