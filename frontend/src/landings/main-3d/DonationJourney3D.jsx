import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faReceipt,
  faCreditCard,
  faBuildingColumns,
  faHandHoldingHeart,
  faStamp,
  faQrcode,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

/**
 * DonationJourney3D Component
 * - 7 Milestones: Donor -> Payment Gateway -> Certified Receipt (typing serial + QR)
 *   -> Association Account -> Case Allocation -> Payment Voucher -> Beneficiary Impact
 * - Curved connecting gold path line that fills as user explores or scrolls through the section
 * - Glowing gold coin/orb that travels along the path
 * - Completed stations marked with emerald badge (#27ae60)
 * - Glassmorphic cards with subtle 3D tilt
 * - Only tracks scroll when the section itself is actively in view (not during Hero)
 */
export default function DonationJourney3D({ t, dir, isRTL, isMobile }) {
  const [activeStep, setActiveStep] = useState(1);
  const journeySectionRef = useRef(null);
  const [journeyProgress, setJourneyProgress] = useState(0);

  const steps = t.journey.steps;

  // Track scroll position ONLY when the user reaches this section
  useEffect(() => {
    const handleScroll = () => {
      const el = journeySectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Only start calculating when the top of the section enters upper part of viewport
      // rect.top <= 100 means the user has actually scrolled past the hero and reached this section
      if (rect.top > 120) {
        // Still in hero or above this section -> keep at step 1
        setJourneyProgress(0);
        setActiveStep(1);
        return;
      }

      // If section is passed completely
      if (rect.bottom < 200) {
        setJourneyProgress(1);
        setActiveStep(7);
        return;
      }

      // The user is actively inside this section
      const scrollableDistance = el.offsetHeight - windowH * 0.5;
      if (scrollableDistance <= 0) return;

      const currentScroll = Math.max(0, -rect.top + 80);
      const ratio = Math.max(0, Math.min(1, currentScroll / scrollableDistance));
      setJourneyProgress(ratio);

      const mappedStep = Math.min(7, Math.max(1, Math.floor(ratio * 7) + 1));
      setActiveStep(mappedStep);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getStepIcon = (id) => {
    switch (id) {
      case 1:
        return faHandHoldingHeart;
      case 2:
        return faCreditCard;
      case 3:
        return faReceipt;
      case 4:
        return faBuildingColumns;
      case 5:
        return faHandHoldingHeart;
      case 6:
        return faStamp;
      case 7:
        return faQrcode;
      default:
        return faReceipt;
    }
  };

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
              {activeStep} {t.journey.stepOf} 7: {steps[activeStep - 1]?.name}
            </strong>
          </div>
        </div>

        {/* Curved Path Visualization & Traveling Golden Coin Orb */}
        <div className="journeyTrackContainer">
          {/* SVG Animated Path */}
          <svg
            className="journeySvgPath"
            viewBox="0 0 1200 160"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M 50 80 C 250 20, 350 140, 600 80 C 850 20, 950 140, 1150 80"
              stroke="var(--border-color, rgba(200, 146, 74, 0.25))"
              strokeWidth="4"
              strokeDasharray="6 6"
            />
            <path
              d="M 50 80 C 250 20, 350 140, 600 80 C 850 20, 950 140, 1150 80"
              stroke="url(#journeyGoldGradient)"
              strokeWidth="5"
              strokeDasharray="1200"
              strokeDashoffset={1200 - journeyProgress * 1200}
              style={{ transition: "stroke-dashoffset 0.15s ease-out" }}
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

          {/* Glowing Traveling Gold Coin / Light Orb */}
          <div
            className="travelingGoldOrb"
            style={{
              [isRTL ? "right" : "left"]: `${Math.min(96, Math.max(2, journeyProgress * 96))}%`,
              top: `${50 + Math.sin(journeyProgress * Math.PI * 3.5) * 35}%`,
            }}
          >
            <div className="orbPulse"></div>
            <span className="coinSymbol">﷼</span>
          </div>

          {/* Stepper Node Pins on the Path */}
          <div className="journeyNodesRow">
            {steps.map((st) => {
              const isPassed = st.id < activeStep;
              const isCurrent = st.id === activeStep;

              return (
                <div
                  key={st.id}
                  className={`journeyNodeItem ${
                    isPassed ? "nodePassed" : isCurrent ? "nodeCurrent" : "nodePending"
                  }`}
                  onClick={() => {
                    setActiveStep(st.id);
                    setJourneyProgress((st.id - 1) / 6);
                  }}
                >
                  <div className="nodeMarker">
                    {isPassed ? (
                      <FontAwesomeIcon icon={faCheck} className="checkIcon" />
                    ) : (
                      <span>{st.id}</span>
                    )}
                  </div>
                  <span className="nodeLabel">{st.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed 3D Glassmorphic Cards Carousel for Current Station */}
        <div className="journeyActiveCardWrapper">
          {steps.map((st) => {
            const isVisible = st.id === activeStep;
            return (
              <div
                key={st.id}
                className={`journeyGlassCard ${isVisible ? "cardActive" : "cardHidden"}`}
              >
                <div className="cardGlassHeader">
                  <div className="cardIconBox">
                    <FontAwesomeIcon icon={getStepIcon(st.id)} />
                  </div>
                  <div className="cardMetaGroup">
                    <span className="cardTagBadge">{st.tag}</span>
                    <span className="cardAuditMeta">{st.meta}</span>
                  </div>
                </div>

                <h3 className="cardTitle">{st.title}</h3>
                <p className="cardDesc">{st.desc}</p>

                {/* Interactive Simulated Preview Based on Step */}
                <div className="cardInteractivePreview">
                  {st.id === 1 && (
                    <div className="previewSim donorSim">
                      <span>مبلغ التبرع: <strong>1,000 ريال</strong></span>
                      <span className="badgeZakat">زكاة مال معتمدة</span>
                    </div>
                  )}

                  {st.id === 2 && (
                    <div className="previewSim paymentSim">
                      <div className="paymentBrand">Mada / Apple Pay</div>
                      <span className="paymentApproved">تم التفويض والخصم الآمن بنجاح ✓</span>
                    </div>
                  )}

                  {st.id === 3 && (
                    <div className="previewSim voucherSim">
                      <div className="voucherSimHeader">
                        <span>سند قبض رقم: <strong>REC-2026-08892</strong></span>
                        <span className="taxQR">رمز QR ضريبي معتمد</span>
                      </div>
                      <div className="barcodeLines"></div>
                    </div>
                  )}

                  {st.id === 4 && (
                    <div className="previewSim ledgerSim">
                      <span>إيداع في: <strong>حساب مصرف الراجحي (رئيسي)</strong></span>
                      <span>ترحيل قيد يومية آلي رقم: #JV-4821</span>
                    </div>
                  )}

                  {st.id === 5 && (
                    <div className="previewSim caseSim">
                      <div className="caseProgressTop">
                        <span>حالة رقم #419: علاج طبي طارئ</span>
                        <strong>100% اكتمال الدعم</strong>
                      </div>
                      <div className="caseProgressBar">
                        <div className="caseProgressFill" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                  )}

                  {st.id === 6 && (
                    <div className="previewSim disbursementSim">
                      <span>سند صرف معتمد: <strong>PAY-2026-01449</strong></span>
                      <span className="stampApproved">موافق عليه ومختوم إلكترونياً</span>
                    </div>
                  )}

                  {st.id === 7 && (
                    <div className="previewSim deliveredSim">
                      <div className="deliveredAlert">
                        <FontAwesomeIcon icon={faCheck} className="deliveredCheck" />
                        <span>تم تسليم الإعانة للمستفيد وإرسال تقرير الأثر للمتبرع</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
