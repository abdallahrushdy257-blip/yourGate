import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

/**
 * LiveImpactShowcase Component
 * - Lightweight IntersectionObserver + rAF KPI counters (no GSAP overhead)
 * - In-page dual-theme interactive wipe showcase using CSS custom property (--split-pos)
 *   for zero React re-renders while dragging
 */
export default function LiveImpactShowcase({ t, dir, reducedMotion }) {
  const metricsGridRef = useRef(null);
  const stageRef = useRef(null);
  const draggingRef = useRef(false);
  const stageRectRef = useRef(null);
  const splitPosRef = useRef(50);

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

  // Native IntersectionObserver + rAF KPI Counter (replaces GSAP ScrollTrigger)
  useEffect(() => {
    const gridEl = metricsGridRef.current;
    if (!gridEl || reducedMotion) return;

    const counters = Array.from(gridEl.querySelectorAll(".counterNumber"));
    if (!counters.length) return;

    let animIds = [];
    let hasAnimated = false;

    const animateCounters = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      const duration = 1800;
      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // power2.out easing
        const eased = 1 - Math.pow(1 - progress, 2);

        for (let i = 0; i < counters.length; i++) {
          const el = counters[i];
          const target = parseInt(el.getAttribute("data-target"), 10);
          if (!isNaN(target)) {
            el.textContent = Math.round(target * eased).toLocaleString("en-US");
          }
        }

        if (progress < 1) {
          animIds.push(requestAnimationFrame(step));
        }
      };

      animIds.push(requestAnimationFrame(step));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(gridEl);

    return () => {
      observer.disconnect();
      animIds.forEach((id) => cancelAnimationFrame(id));
    };
  }, [reducedMotion]);

  const applySplitPosition = (pct) => {
    const clamped = Math.max(10, Math.min(90, pct));
    splitPosRef.current = clamped;
    if (stageRef.current) {
      stageRef.current.style.setProperty("--split-pos", `${clamped.toFixed(2)}%`);
      stageRef.current.setAttribute("aria-valuenow", String(Math.round(clamped)));
    }
  };

  const startDrag = (clientX) => {
    draggingRef.current = true;
    if (stageRef.current) {
      stageRectRef.current = stageRef.current.getBoundingClientRect();
      if (typeof clientX === "number") {
        const pct =
          ((clientX - stageRectRef.current.left) / stageRectRef.current.width) *
          100;
        applySplitPosition(pct);
      }
    }
  };

  const stopDrag = () => {
    draggingRef.current = false;
  };

  const updateFromClientX = (clientX) => {
    if (!draggingRef.current) return;
    const rect = stageRectRef.current || stageRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    applySplitPosition(pct);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      applySplitPosition(splitPosRef.current - 5);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      applySplitPosition(splitPosRef.current + 5);
    }
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
        <div ref={metricsGridRef} className="impactMetricsGrid">
          {statsList.map((m) => (
            <div key={m.key} className="metricCard">
              <div className="metricValueRow">
                <span className="counterNumber" data-target={m.value}>
                  {m.value.toLocaleString("en-US")}
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
            ref={stageRef}
            className="themeSplitStage"
            role="slider"
            tabIndex={0}
            aria-label={themeShowcase.title}
            aria-valuemin={10}
            aria-valuemax={90}
            aria-valuenow={50}
            style={{ "--split-pos": "50%" }}
            onKeyDown={handleKeyDown}
            onMouseDown={(e) => startDrag(e.clientX)}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onMouseMove={(e) => updateFromClientX(e.clientX)}
            onTouchStart={(e) => startDrag(e.touches[0]?.clientX)}
            onTouchEnd={stopDrag}
            onTouchMove={(e) =>
              e.touches[0] && updateFromClientX(e.touches[0].clientX)
            }
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

            {/* Light Theme Side (Clipped via --split-pos CSS variable) */}
            <div className="themeLayer themeLightLayer">
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
            <div className="themeDividerHandle">
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
