import React from "react";
import { PageSkeleton, DetailsSkeleton, CardSkeleton } from "./Skeleton";

function PreLoader({ variant = "page", rows = 6, cols = 5 }) {
  if (variant === "details") {
    return <DetailsSkeleton />;
  }

  if (variant === "cards") {
    return (
      <div className="skeleton-page-container">
        <div className="skeleton-card-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return <PageSkeleton tableRows={rows} tableCols={cols} />;
}

export default PreLoader;
