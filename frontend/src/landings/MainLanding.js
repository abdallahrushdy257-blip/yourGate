import React, { useEffect, useRef, Suspense, lazy } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import "./main-3d/mainLanding3D.css";
import { landingTranslations } from "./main-3d/translations";
import { useLandingLanguage, useReducedMotion, useIsMobile } from "./main-3d/hooks";

import LandingNav3D from "./main-3d/LandingNav3D";
import Hero3DGate from "./main-3d/Hero3DGate";
import DonationJourney3D from "./main-3d/DonationJourney3D";
import ModulesCarousel3D from "./main-3d/ModulesCarousel3D";
import GovernanceStrip from "./main-3d/GovernanceStrip";
import LiveImpactShowcase from "./main-3d/LiveImpactShowcase";
import LandingCtaFooter from "./main-3d/LandingCtaFooter";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/**
 * MainLanding Component — Cinematic 3D Scroll Experience for YourGate
 *
 * Story Progression:
 * 0. Fixed Navbar (Glassmorphic blur on scroll, AR/EN toggle, Light/Dark toggle)
 * 1. Hero — The 3D Gate (Pinned & Scrubbed, rotating gate leaves, light leaks & tunnel)
 * 2. Donation Journey (7 Milestones, traveling gold coin orb along SVG path, certified receipt generation)
 * 3. Platform Modules (16 Modules on a 3D cylindrical carousel, draggable & filtered by category)
 * 4. Governance & Security (Multi-Tenancy store_id, Spatie permissions, immutable audit trail)
 * 5. Live Impact (Animated counters, in-page dual theme interactive wipe showcase)
 * 6. Grand CTA & Footer (Pricing table, demo / free trial triggers, sub-landing portals)
 */
export default function MainLanding() {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const lang = "ar";
  const isRTL = true;
  const dir = "rtl";
  const t = landingTranslations.ar;

  // Initialize GSAP ScrollTrigger Context and Counter animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Refresh ScrollTrigger after DOM & images settle
      ScrollTrigger.refresh();

      // Number counter animation trigger
      if (!reducedMotion) {
        gsap.utils.toArray(".counterNumber").forEach((counter) => {
          const rawTarget = counter.getAttribute("data-target");
          const targetNum = parseInt(rawTarget, 10);
          if (!isNaN(targetNum)) {
            gsap.fromTo(
              counter,
              { innerText: 0 },
              {
                innerText: targetNum,
                duration: 2.2,
                snap: { innerText: 1 },
                ease: "power2.out",
                scrollTrigger: {
                  trigger: counter,
                  start: "top 90%",
                  once: true,
                },
              }
            );
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleExploreClick = () => {
    const journeyEl = document.getElementById("donationJourney");
    if (journeyEl) {
      journeyEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="mainLanding3DContainer"
      dir="rtl"
      lang="ar"
    >
      {/* 0. Fixed Glassmorphic Navigation Bar */}
      <LandingNav3D
        t={t}
        dir={dir}
        isRTL={isRTL}
      />

      {/* 1. Hero: Pinned 3D Gate Opening & Golden Particle Atmosphere */}
      <Hero3DGate
        t={t}
        dir={dir}
        isRTL={isRTL}
        reducedMotion={reducedMotion}
        onExploreClick={handleExploreClick}
      />

      {/* 2. Donation Journey: 7 Milestones, Traveling Coin, Certified Receipt Simulation */}
      <DonationJourney3D
        t={t}
        dir={dir}
        isRTL={isRTL}
        isMobile={isMobile}
      />

      {/* 3. 16 Modules 3D Cylindrical Carousel */}
      <ModulesCarousel3D
        t={t}
        dir={dir}
        isRTL={isRTL}
        isMobile={isMobile}
      />

      {/* 4. Governance, Multi-Tenancy & Security Strip */}
      <GovernanceStrip
        t={t}
        dir={dir}
      />

      {/* 5. Live Impact Counters & Dual Theme Interactive Showcase */}
      <LiveImpactShowcase
        t={t}
        dir={dir}
      />

      {/* 6. Pricing, Grand Call To Action & Footer */}
      <LandingCtaFooter
        t={t}
        dir={dir}
        isRTL={isRTL}
      />
    </div>
  );
}
