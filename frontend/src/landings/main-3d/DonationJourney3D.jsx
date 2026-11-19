import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faReceipt,
  faCreditCard,
  faBuildingColumns,
  faHandHoldingHeart,
  faStamp,
  faQrcode,
} from "@fortawesome/free-solid-svg-icons";

const STEP_ICONS = {
  1: faHandHoldingHeart,
  2: faCreditCard,
  3: faReceipt,
  4: faBuildingColumns,
  5: faHandHoldingHeart,
  6: faStamp,
  7: faQrcode,
};

function renderStepPreview(stepId) {
  switch (stepId) {
    case 1:
      return (
        <div className="previewSim donorSim">
          <span>
            مبلغ التبرع: <strong>1,000 ريال</strong>
          </span>
          <span className="badgeZakat">زكاة مال معتمدة</span>
        </div>
      );
    case 2:
      return (
        <div className="previewSim paymentSim">
          <div className="paymentBrand">Mada / Apple Pay</div>
          <span className="paymentApproved">تم التفويض والخصم الآمن بنجاح ✓</span>
        </div>
      );
    case 3:
      return (
        <div className="previewSim voucherSim">
          <div className="voucherSimHeader">
            <span>
              سند قبض رقم: <strong>REC-2026-08892</strong>
            </span>
            <span className="taxQR">رمز QR ضريبي معتمد</span>
          </div>
          <div className="barcodeLines"></div>
        </div>
      );
    case 4:
      return (
        <div className="previewSim ledgerSim">
          <span>
            إيداع في: <strong>حساب مصرف الراجحي (رئيسي)</strong>
          </span>
          <span>ترحيل قيد يومية آلي رقم: #JV-4821</span>
        </div>
      );
    case 5:
      return (
        <div className="previewSim caseSim">
          <div className="caseProgressTop">
            <span>حالة رقم #419: علاج طبي طارئ</span>
            <strong>100% اكتمال الدعم</strong>
          </div>
          <div className="caseProgressBar">
            <div className="caseProgressFill" style={{ width: "100%" }}></div>
          </div>
        </div>
      );
    case 6:
      return (
        <div className="previewSim disbursementSim">
          <span>
            سند صرف معتمد: <strong>PAY-2026-01449</strong>
          </span>
          <span className="stampApproved">موافق عليه ومختوم إلكترونياً</span>
        </div>
      );
    case 7:
      return (
        <div className="previewSim deliveredSim">
          <div className="deliveredAlert">
            <FontAwesomeIcon icon={faCheck} className="deliveredCheck" />
            <span>تم تسليم الإعانة للمستفيد وإرسال تقرير الأثر للمتبرع</span>
          </div>
        </div>
      );
    default:
      return null;
  }
}

/**
 * DonationJourney3D Component
 * - 7 Milestones with curved gold SVG path and traveling orb
 * - Uses IntersectionObserver + rAF + direct DOM refs for path & orb
 * - Re-renders React ONLY when activeStep (1..7) changes
 * - Renders only the active card instead of 7 stacked backdrop-filter layers
 */
export default function DonationJourney3D({ t, dir, isRTL }) {
  const [activeStep, setActiveStep] = useState(1);
  const journeySectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressPathRef = useRef(null);
  const orbRef = useRef(null);
  const activeStepRef = useRef(1);

  const steps = t.journey.steps;

  const applyProgressToDom = useCallback(
    (ratio) => {
      if (progressPathRef.current) {
        progressPathRef.current.style.strokeDashoffset = String(
          1200 - ratio * 1200
        );
      }
      if (orbRef.current && trackRef.current) {
        const trackW = trackRef.current.offsetWidth || 1000;
        const trackH = trackRef.current.offsetHeight || 140;
        const pctX = Math.min(96, Math.max(2, ratio * 96)) / 100;
        const pctY = (50 + Math.sin(ratio * Math.PI * 3.5) * 35) / 100;
        const xPx = isRTL ? (1 - pctX) * trackW : pctX * trackW;
        const yPx = pctY * trackH;
        orbRef.current.style.transform = `translate3d(${xPx.toFixed(1)}px, ${yPx.toFixed(1)}px, 0) translate(-50%, -50%)`;
      }
    },
    [isRTL]
  );

  useEffect(() => {
    const el = journeySectionRef.current;
    if (!el) return;

    let isVisible = false;
    let rafPending = false;

    const measureAndUpdate = () => {
      rafPending = false;
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;

      let ratio = 0;
      let nextStep = 1;

      if (rect.top > 120) {
        ratio = 0;
        nextStep = 1;
      } else if (rect.bottom < 200) {
        ratio = 1;
        nextStep = 7;
      } else {
        const scrollableDistance = el.offsetHeight - windowH * 0.5;
        if (scrollableDistance <= 0) return;
        const currentScroll = Math.max(0, -rect.top + 80);
        ratio = Math.max(0, Math.min(1, currentScroll / scrollableDistance));
        nextStep = Math.min(7, Math.max(1, Math.floor(ratio * 7) + 1));
      }

      applyProgressToDom(ratio);
      if (nextStep !== activeStepRef.current) {
        activeStepRef.current = nextStep;
        setActiveStep(nextStep);
      }
    };

    const onScroll = () => {
      if (!isVisible || rafPending) return;
      rafPending = true;
      requestAnimationFrame(measureAndUpdate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          requestAnimationFrame(measureAndUpdate);
        }
      },
      { rootMargin: "150px 0px" }
    );
    observer.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    applyProgressToDom(0);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [applyProgressToDom]);

  const handleStepSelect = (stepId) => {
    activeStepRef.current = stepId;
    setActiveStep(stepId);
    applyProgressToDom((stepId - 1) / 6);
  };

  const currentStep = steps[activeStep - 1] || steps[0];

  return (
    <div
      ref={journeySectionRef}
      className="donationJourneySection"
      id="donationJourney"
      dir={dir}
    >
      <div className="journeyStickyWrapper">
        {/* Section Header */}
        <div className="journeyHeader text-center">
          <div className="sectionBadge">
            <span className="badgeDot"></span>
            <span>{t.journey.badge}</span>
          </div>
          <h2 className="sectionTitle">{t.journey.title}</h2>
          <p className="sectionSubtitle">{t.journey.subtitle}</p>

          <div className="journeyActiveMeter">
            <span>{t.journey.progressStatus}</span>
            <strong>
              {activeStep} {t.journey.stepOf} 7: {currentStep?.name}
            </strong>
          </div>
        </div>

        {/* Curved Path Visualization & Traveling Golden Coin Orb */}
        <div className="journeyTrackContainer" ref={trackRef}>
          <svg
            className="journeySvgPath"
            viewBox="0 0 1200 160"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 50 80 C 250 20, 350 140, 600 80 C 850 20, 950 140, 1150 80"
              stroke="var(--border-color, rgba(200, 146, 74, 0.25))"
              strokeWidth="4"
              strokeDasharray="6 6"
            />
            <path
              ref={progressPathRef}
              d="M 50 80 C 250 20, 350 140, 600 80 C 850 20, 950 140, 1150 80"
              stroke="url(#journeyGoldGradient)"
              strokeWidth="5"
              strokeDasharray="1200"
              strokeDashoffset="1200"
            />
            <defs>
              <linearGradient
                id="journeyGoldGradient"
                x1="0"
                y1="0"
                x2="1200"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#f0c378" />
                <stop offset="50%" stopColor="#c8924a" />
                <stop offset="100%" stopColor="#27ae60" />
              </linearGradient>
            </defs>
          </svg>

          {/* Glowing Traveling Gold Coin / Light Orb (GPU transform positioned) */}
          <div ref={orbRef} className="travelingGoldOrb" aria-hidden="true">
            <div className="orbPulse"></div>
            <span className="coinSymbol">﷼</span>
          </div>

          {/* Stepper Node Pins on the Path */}
          <div className="journeyNodesRow" role="tablist" aria-label={t.journey.title}>
            {steps.map((st) => {
              const isPassed = st.id < activeStep;
              const isCurrent = st.id === activeStep;

              return (
                <button
                  key={st.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  className={`journeyNodeItem ${
                    isPassed
                      ? "nodePassed"
                      : isCurrent
                      ? "nodeCurrent"
                      : "nodePending"
                  }`}
                  onClick={() => handleStepSelect(st.id)}
                >
                  <div className="nodeMarker">
                    {isPassed ? (
                      <FontAwesomeIcon icon={faCheck} className="checkIcon" />
                    ) : (
                      <span>{st.id}</span>
                    )}
                  </div>
                  <span className="nodeLabel">{st.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Station Glassmorphic Card (single active layer for fast compositing) */}
        <div className="journeyActiveCardWrapper">
          {currentStep && (
            <div
              key={currentStep.id}
              className="journeyGlassCard cardActive"
              role="tabpanel"
            >
              <div className="cardGlassHeader">
                <div className="cardIconBox">
                  <FontAwesomeIcon
                    icon={STEP_ICONS[currentStep.id] || faReceipt}
                  />
                </div>
                <div className="cardMetaGroup">
                  <span className="cardTagBadge">{currentStep.tag}</span>
                  <span className="cardAuditMeta">{currentStep.meta}</span>
                </div>
              </div>

              <h3 className="cardTitle">{currentStep.title}</h3>
              <p className="cardDesc">{currentStep.desc}</p>

              <div className="cardInteractivePreview">
                {renderStepPreview(currentStep.id)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
