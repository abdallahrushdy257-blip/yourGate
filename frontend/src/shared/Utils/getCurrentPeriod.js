// src/utils/getCurrentPeriod.js
export const getCurrentPeriod = () => {
  const now     = new Date();
  const year    = now.getFullYear();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  return `${year}-Q${quarter}`;
  // مثال: "2026-Q2"
};