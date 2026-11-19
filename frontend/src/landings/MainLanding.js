import React, { useCallback, useRef, Suspense, lazy } from "react";

import "./main-3d/mainLanding3D.css";
import { landingTranslations } from "./main-3d/translations";
import { useReducedMotion, useIsMobile } from "./main-3d/hooks";

import LandingNav3D from "./main-3d/LandingNav3D";
import Hero3DGate from "./main-3d/Hero3DGate";

const DonationJourney3D = lazy(() => import("./main-3d/DonationJourney3D"));
const ModulesCarousel3D = lazy(() => import("./main-3d/ModulesCarousel3D"));
const GovernanceStrip = lazy(() => import("./main-3d/GovernanceStrip"));
const LiveImpactShowcase = lazy(() => import("./main-3d/LiveImpactShowcase"));
const LandingCtaFooter = lazy(() => import("./main-3d/LandingCtaFooter"));

const SectionFallback = () => (
  <div style={{ minHeight: "420px" }} aria-hidden="true" />
);

/**
 * MainLanding Component — Cinematic 3D Scroll Experience for YourGate
 *
 * Story Progression:
 * 0. Fixed Navbar (Glassmorphic blur on scroll, Light/Dark toggle)
 * 1. Hero — The 3D Gate (Canvas animation, rotating gate leaves, light leaks & tunnel)
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

  const isRTL = true;
  const dir = "rtl";
  const t = landingTranslations.ar;

  const handleExploreClick = useCallback(() => {
    const journeyEl = document.getElementById("donationJourney");
    if (journeyEl) {
      journeyEl.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="mainLanding3DContainer"
      dir="rtl"
      lang="ar"
    >
      {/* 0. Fixed Glassmorphic Navigation Bar */}
      <LandingNav3D t={t} dir={dir} isRTL={isRTL} />

      {/* 1. Hero: Pinned 3D Gate Opening & Golden Particle Atmosphere */}
      <Hero3DGate
        t={t}
        dir={dir}
        isRTL={isRTL}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
        onExploreClick={handleExploreClick}
      />

      {/* 2. Donation Journey: 7 Milestones, Traveling Coin, Certified Receipt Simulation */}
      <Suspense fallback={<SectionFallback />}>
        <DonationJourney3D
          t={t}
          dir={dir}
          isRTL={isRTL}
          isMobile={isMobile}
        />
      </Suspense>

      {/* 3. 16 Modules 3D Cylindrical Carousel */}
      <Suspense fallback={<SectionFallback />}>
        <ModulesCarousel3D
          t={t}
          dir={dir}
          isRTL={isRTL}
          isMobile={isMobile}
        />
      </Suspense>

      {/* 4. Governance, Multi-Tenancy & Security Strip */}
      <Suspense fallback={<SectionFallback />}>
        <GovernanceStrip t={t} dir={dir} />
      </Suspense>

      {/* 5. Live Impact Counters & Dual Theme Interactive Showcase */}
      <Suspense fallback={<SectionFallback />}>
        <LiveImpactShowcase
          t={t}
          dir={dir}
          reducedMotion={reducedMotion}
        />
      </Suspense>

      {/* 6. Pricing, Grand Call To Action & Footer */}
      <Suspense fallback={<SectionFallback />}>
        <LandingCtaFooter t={t} dir={dir} isRTL={isRTL} />
      </Suspense>
    </div>
  );
}
