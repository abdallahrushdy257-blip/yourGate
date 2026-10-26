import React from "react";
import "./Skeleton.css";

/**
 * Basic Skeleton element with shimmer wave animation.
 */
export function Skeleton({
  variant = "text",
  width,
  height,
  borderRadius,
  className = "",
  style = {},
  ...props
}) {
  const variantClass = `skeleton-${variant}`;
  const customStyle = {
    ...style,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(borderRadius !== undefined ? { borderRadius } : {}),
  };

  return (
    <span
      className={`skeleton-base ${variantClass} ${className}`}
      style={customStyle}
      {...props}
    />
  );
}

/**
 * Realistic Table Rows Skeleton for table bodies.
 */
export function TableSkeleton({ rows = 6, columns = 5 }) {
  // Array of varied widths to give an organic, natural feel
  const widthTemplates = ["65%", "85%", "45%", "75%", "90%", "55%", "70%"];

  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="skeleton-table-row">
          <td className="skeleton-table-cell" style={{ width: "50px" }}>
            <Skeleton variant="text" width="24px" height="16px" style={{ margin: "auto" }} />
          </td>
          {Array.from({ length: Math.max(1, columns - 1) }).map((_, cIdx) => {
            const templateIdx = (rIdx + cIdx) % widthTemplates.length;
            const width = widthTemplates[templateIdx];
            return (
              <td key={cIdx} className="skeleton-table-cell">
                <Skeleton
                  variant="text"
                  width={width}
                  height="16px"
                  style={{ margin: "auto" }}
                />
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

/**
 * Card Skeleton for grid views.
 */
export function CardSkeleton() {
  return (
    <div className="skeleton-card">
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
        <Skeleton variant="circular" width="46px" height="46px" />
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height="16px" style={{ marginBottom: "6px" }} />
          <Skeleton variant="text" width="40%" height="12px" />
        </div>
      </div>
      <Skeleton variant="rounded" width="100%" height="90px" style={{ marginBottom: "14px" }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Skeleton variant="text" width="30%" height="14px" />
        <Skeleton variant="text" width="25%" height="14px" />
      </div>
    </div>
  );
}

/**
 * Full Page Skeleton for reports and table views.
 */
export function PageSkeleton({ title = "جاري التحميل...", tableRows = 6, tableCols = 5 }) {
  return (
    <div className="skeleton-page-container">
      {/* Header Bar */}
      <div className="skeleton-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Skeleton variant="circular" width="38px" height="38px" />
          <Skeleton variant="text" width="180px" height="22px" />
        </div>
        <Skeleton variant="rounded" width="110px" height="38px" />
      </div>

      {/* Filter / Actions Bar */}
      <div className="skeleton-filter-bar">
        <Skeleton variant="rounded" width="260px" height="40px" />
        <Skeleton variant="rounded" width="180px" height="40px" />
        <Skeleton variant="rounded" width="180px" height="40px" />
        <div style={{ marginInlineStart: "auto", display: "flex", gap: "8px" }}>
          <Skeleton variant="circular" width="38px" height="38px" />
          <Skeleton variant="circular" width="38px" height="38px" />
        </div>
      </div>

      {/* Table Section */}
      <div className="skeleton-table-wrapper">
        <table className="skeleton-mock-table">
          <thead>
            <tr>
              <th className="skeleton-mock-th" style={{ width: "50px" }}>
                <Skeleton variant="text" width="20px" height="16px" style={{ margin: "auto" }} />
              </th>
              {Array.from({ length: tableCols - 1 }).map((_, i) => (
                <th key={i} className="skeleton-mock-th">
                  <Skeleton variant="text" width="70%" height="16px" style={{ margin: "auto" }} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <TableSkeleton rows={tableRows} columns={tableCols} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Details / View Profile Skeleton (e.g. BeneficiaryView, LoanDetails).
 */
export function DetailsSkeleton() {
  return (
    <div className="skeleton-page-container">
      {/* Hero Card */}
      <div className="skeleton-details-box">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <Skeleton variant="circular" width="68px" height="68px" />
            <div>
              <Skeleton variant="text" width="220px" height="26px" style={{ marginBottom: "8px" }} />
              <div style={{ display: "flex", gap: "10px" }}>
                <Skeleton variant="rounded" width="90px" height="22px" />
                <Skeleton variant="rounded" width="120px" height="22px" />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Skeleton variant="rounded" width="100px" height="38px" />
            <Skeleton variant="rounded" width="100px" height="38px" />
          </div>
        </div>
      </div>

      {/* Tabs Placeholder */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Skeleton variant="rounded" width="130px" height="42px" />
        <Skeleton variant="rounded" width="130px" height="42px" />
        <Skeleton variant="rounded" width="130px" height="42px" />
        <Skeleton variant="rounded" width="130px" height="42px" />
        <Skeleton variant="rounded" width="130px" height="42px" />
      </div>

      {/* Grid of detail boxes */}
      <div className="skeleton-details-box">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Skeleton variant="circular" width="24px" height="24px" />
          <Skeleton variant="text" width="190px" height="20px" />
        </div>
        <div className="skeleton-info-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-info-item">
              <Skeleton variant="text" width="50%" height="12px" style={{ marginBottom: "8px" }} />
              <Skeleton variant="text" width="85%" height="18px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Form Skeleton for modals or create/edit pages.
 */
export function FormSkeleton({ fields = 6 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", padding: "10px" }}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <Skeleton variant="text" width="40%" height="14px" style={{ marginBottom: "8px" }} />
          <Skeleton variant="rounded" width="100%" height="42px" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
