import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";

/**
 * LiveImpactShowcase Component
 * - Live statistical impact counters with GSAP
 * - In-page dual-theme interactive wipe showcase
 */
export default function LiveImpactShowcase({ t, dir }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // Safely fallback to stats or empty array
  const statsList = t?.impact?.stats || [
    { key: "donations", value: 48500000, suffix: " ر.س", label: "إجمالي التبرعات المدارة عبر المنظومة" },
    { key: "cases", value: 12450, suffix: "+", label: "حالة اجتماعية مخدومة ومستفيدة" },
    { key: "vouchers", value: 34200, suffix: "", label: "سند قبض وصرف رسمي معتمد بـ QR" },
    { key: "associations", value: 128, suffix: " جمعية", label: "كيان خيري يعتمد على المنصة" },
  ];

  const themeShowcase = t?.impact?.themeShowcase || {
    title: "استكشف تجربة المظهر المزدوج (Dual Theme)",
    desc: "تم تصميم المنصة لتمنح عينيك الراحة الفائقة سواءً في ضوء النهار الطبيعي أو خلال ساعات العمل المسائية الهادئة.",
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !e.touches[0]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const pct = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <div className="impactSection" id="liveImpact" dir={dir}>
      <div className="impactInnerContainer">
        {/* Section Header */}
        <div className="impactHeader text-center">
          <div className="sectionBadge">
            <span className="badgeDot"></span>
            <span>{t?.impact?.badge || "الأثر المباشر والمظهر المزدوج"}</span>
          </div>
          <h2 className="sectionTitle">{t?.impact?.title || "أرقام تتحدث عن نفسها"}</h2>
          <p className="sectionSubtitle">{t?.impact?.subtitle || ""}</p>
        </div>

        {/* 4 Animated KPI Stat Counters */}
        <div className="impactMetricsGrid">
          {statsList.map((m, idx) => (
            <div key={idx} className="metricCard">
              <div className="metricValueRow">
                <span className="counterNumber" data-target={m.value}>
                  {m.value}
                </span>
                <span className="metricSuffix">{m.suffix}</span>
              </div>
              <div className="metricLabel">{m.label}</div>
            </div>
          ))}
        </div>

        {/* In-Page Interactive Dual Theme Split Viewer */}
        <div className="themeComparisonContainer">
          <div className="comparisonHeader">
            <h3>{themeShowcase.title}</h3>
            <p>{themeShowcase.desc}</p>
          </div>

          <div
            className="themeSplitStage"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
          >
            {/* Dark Theme Side */}
            <div className="themeLayer themeDarkLayer">
              <div className="themeWatermark">
                <FontAwesomeIcon icon={faMoon} />
                <span>الوضع الليلي الفاخر (Dark Mode)</span>
              </div>
              <div className="simDashboardMock">
                <div className="simDashSidebar dark">
                  <div className="simLogo"></div>
                  <div className="simNavItem active"></div>
                  <div className="simNavItem"></div>
                  <div className="simNavItem"></div>
                </div>
                <div className="simDashMain dark">
                  <div className="simDashHeader"></div>
                  <div className="simDashCardsRow">
                    <div className="simCard dark"></div>
                    <div className="simCard dark"></div>
                    <div className="simCard dark"></div>
                  </div>
                  <div className="simDashTable dark"></div>
                </div>
              </div>
            </div>

            {/* Light Theme Side (Clipped via slider position) */}
            <div
              className="themeLayer themeLightLayer"
              style={{
                clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
              }}
            >
              <div className="themeWatermark light">
                <FontAwesomeIcon icon={faSun} />
                <span>الوضع النهاري المريح (Light Mode)</span>
              </div>
              <div className="simDashboardMock">
                <div className="simDashSidebar light">
                  <div className="simLogo"></div>
                  <div className="simNavItem active"></div>
                  <div className="simNavItem"></div>
                  <div className="simNavItem"></div>
                </div>
                <div className="simDashMain light">
                  <div className="simDashHeader"></div>
                  <div className="simDashCardsRow">
                    <div className="simCard light"></div>
                    <div className="simCard light"></div>
                    <div className="simCard light"></div>
                  </div>
                  <div className="simDashTable light"></div>
                </div>
              </div>
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="themeDividerHandle"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="handleKnob">
                <span>⇆</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
