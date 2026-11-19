import React, { useEffect, useRef, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../../context/theme-context";

/**
 * Hero3DGate Component
 * - Pinned + Scrubbed Gate Opening with high-FPS Canvas 2D
 * - Realistic 3D Double Gate leaves rotating open as user scrolls
 * - Pauses rAF & background video automatically when off-screen or tab hidden
 * - Updates scroll progress via direct DOM refs (zero React re-renders per scroll frame)
 * - Respects prefers-reduced-motion & Save-Data preferences
 */
export default function Hero3DGate({
  t,
  dir,
  isRTL,
  reducedMotion,
  isMobile,
  onExploreClick,
}) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const heroWrapperRef = useRef(null);
  const contentOverlayRef = useRef(null);
  const progressBarRef = useRef(null);
  const ratioTextRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  const shouldShowVideo =
    !reducedMotion &&
    !(typeof navigator !== "undefined" && navigator.connection?.saveData);

  // Defer video playback slightly and pause when hero leaves viewport
  useEffect(() => {
    const video = videoRef.current;
    const wrapper = heroWrapperRef.current;
    if (!video || !wrapper || !shouldShowVideo) return;

    let isVisible = true;
    const tryPlay = () => {
      if (isVisible && !document.hidden) {
        video.play().catch(() => {});
      }
    };

    const startTimer = setTimeout(() => {
      video.load();
      tryPlay();
    }, 150);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !document.hidden) {
          tryPlay();
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(wrapper);

    return () => {
      clearTimeout(startTimer);
      observer.disconnect();
      video.pause();
    };
  }, [shouldShowVideo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = heroWrapperRef.current;
    if (!canvas || !wrapper || reducedMotion) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId = null;
    let isInView = true;
    let isTabVisible = !document.hidden;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let wrapperHeight = wrapper.offsetHeight || window.innerHeight;

    const updateSize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.offsetWidth || window.innerWidth;
      height = canvas.parentElement.offsetHeight || window.innerHeight;
      wrapperHeight = wrapper.offsetHeight || height;
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    updateSize();

    let resizeTimer = null;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateSize, 120);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Mouse coordinates with spring interpolation (desktop only)
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e) => {
      if (isMobile || !width || !height) return;
      mouse.targetX = (e.clientX / width - 0.5) * 2;
      mouse.targetY = (e.clientY / height - 0.5) * 2;
    };
    if (!isMobile) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    // 3D Gold Dust Particles (scaled to device capability)
    const maxParticles = isMobile ? 55 : 110;
    const PARTICLE_COUNT = Math.min(
      Math.floor((width * height) / 11000),
      maxParticles
    );
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 1200,
      y: (Math.random() - 0.5) * 900,
      z: Math.random() * 800 + 40,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      vz: Math.random() * 0.9 + 0.3,
      size: Math.random() * 2.4 + 1.2,
      alpha: Math.random() * 0.6 + 0.3,
    }));

    let currentOpenRatio = 0;
    let targetOpenRatio = 0;
    let lastDisplayedPct = -1;

    const applyScrollDomUpdates = (ratio) => {
      if (contentOverlayRef.current) {
        const opacity = Math.max(0.2, 1 - ratio * 0.9);
        const ty = ratio * 40;
        contentOverlayRef.current.style.opacity = opacity.toFixed(3);
        contentOverlayRef.current.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0)`;
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${ratio.toFixed(4)})`;
      }
      const pct = Math.round(ratio * 100);
      if (pct !== lastDisplayedPct && ratioTextRef.current) {
        lastDisplayedPct = pct;
        ratioTextRef.current.textContent = `${pct}%`;
      }
    };

    const onScroll = () => {
      if (!isInView) return;
      const rect = wrapper.getBoundingClientRect();
      const totalDist = wrapperHeight * 0.8;
      if (totalDist <= 0) return;
      const ratio = Math.max(0, Math.min(1, -rect.top / totalDist));
      targetOpenRatio = ratio;
      applyScrollDomUpdates(ratio);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const isDark =
      theme === "dark" || document.body.classList.contains("dark-mode");
    const primaryColor = isDark
      ? "rgba(200, 146, 74, "
      : "rgba(185, 130, 50, ";
    const lightFloodColor = isDark
      ? "rgba(240, 195, 120, "
      : "rgba(255, 235, 190, ";

    // Main Render Loop (runs ONLY when visible and tab active)
    const render = () => {
      if (!isInView || !isTabVisible) {
        animId = null;
        return;
      }

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      currentOpenRatio += (targetOpenRatio - currentOpenRatio) * 0.1;

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5 + mouse.x * 35;
      const cy = height * 0.5 + mouse.y * 25;

      // ── 1. Warm Radiance Leaking Through Gate Seams ──
      const beamRadius = 280 + currentOpenRatio * 450;
      const beamGlow = ctx.createRadialGradient(cx, cy, 20, cx, cy, beamRadius);
      const beamAlpha = 0.22 + currentOpenRatio * 0.75;
      beamGlow.addColorStop(0, `${lightFloodColor}${beamAlpha})`);
      beamGlow.addColorStop(0.35, `${primaryColor}${beamAlpha * 0.55})`);
      beamGlow.addColorStop(0.8, `${primaryColor}0.04)`);
      beamGlow.addColorStop(1, `${primaryColor}0)`);
      ctx.fillStyle = beamGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, beamRadius, 0, Math.PI * 2);
      ctx.fill();

      // ── 2. 3D Architectural Double Gate Leaves ──
      const gateWidth = Math.min(260, width * 0.28);
      const gateHeight = gateWidth * 1.65;
      const openAngle = currentOpenRatio * 1.55;
      const perspectiveScale = Math.max(0.08, Math.cos(openAngle));

      // Outer Arch Portal Frame (layered glow stroke instead of costly shadowBlur)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy - gateHeight * 0.35, gateWidth, Math.PI, 0, false);
      ctx.lineTo(cx + gateWidth, cy + gateHeight * 0.5);
      ctx.lineTo(cx - gateWidth, cy + gateHeight * 0.5);
      ctx.lineTo(cx - gateWidth, cy - gateHeight * 0.35);

      ctx.strokeStyle = `${lightFloodColor}0.22)`;
      ctx.lineWidth = 9;
      ctx.stroke();

      ctx.strokeStyle = `${primaryColor}0.85)`;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Base pedestal line
      ctx.beginPath();
      ctx.moveTo(cx - gateWidth * 1.25, cy + gateHeight * 0.5);
      ctx.lineTo(cx + gateWidth * 1.25, cy + gateHeight * 0.5);
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.restore();

      // Helper to render left/right gate leaf without duplicated logic
      const drawGateLeaf = (sideSign) => {
        ctx.save();
        ctx.translate(cx + sideSign * gateWidth, cy);
        ctx.rotate(sideSign * openAngle * 0.9);
        ctx.scale(perspectiveScale, 1);

        const x0 = sideSign === -1 ? 0 : -gateWidth;
        const grad = ctx.createLinearGradient(
          0,
          -gateHeight * 0.5,
          -sideSign * gateWidth,
          gateHeight * 0.5
        );
        grad.addColorStop(0, `${primaryColor}0.38)`);
        grad.addColorStop(0.5, `${primaryColor}0.18)`);
        grad.addColorStop(1, `${primaryColor}0.48)`);

        ctx.fillStyle = grad;
        ctx.strokeStyle = `${primaryColor}0.95)`;
        ctx.lineWidth = 2.4;

        ctx.beginPath();
        ctx.rect(x0, -gateHeight * 0.45, gateWidth, gateHeight * 0.95);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        for (let bar = 1; bar < 4; bar++) {
          const bx = -sideSign * (gateWidth / 4) * bar;
          ctx.moveTo(bx, -gateHeight * 0.45);
          ctx.lineTo(bx, gateHeight * 0.5);
        }
        ctx.strokeStyle = `${primaryColor}0.5)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      };

      drawGateLeaf(-1);
      drawGateLeaf(1);

      // ── 3. Light Flood Tunnel ──
      if (currentOpenRatio > 0.05) {
        const flashAlpha = Math.min(0.92, Math.pow(currentOpenRatio, 1.8) * 0.92);
        const flashGrad = ctx.createRadialGradient(
          cx,
          cy,
          10,
          cx,
          cy,
          width * 0.7
        );
        flashGrad.addColorStop(0, `${lightFloodColor}${flashAlpha})`);
        flashGrad.addColorStop(0.5, `${lightFloodColor}${flashAlpha * 0.4})`);
        flashGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, width * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── 4. Floating 3D Gold Dust Particles ──
      const fov = 420;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.z -= p.vz + currentOpenRatio * 4;
        p.x += p.vx;
        p.y += p.vy;

        if (p.z <= 10) {
          p.z = 800;
          p.x = (Math.random() - 0.5) * 1200;
          p.y = (Math.random() - 0.5) * 900;
        }

        const scale = fov / (fov + p.z);
        const px = cx + (p.x + mouse.x * 80) * scale;
        const py = cy + (p.y + mouse.y * 80) * scale;
        const alpha = Math.min(1, (1 - p.z / 800) * p.alpha);

        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = `${primaryColor}${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    const startLoopIfActive = () => {
      if (isInView && isTabVisible && animId === null) {
        animId = requestAnimationFrame(render);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        if (isInView) {
          startLoopIfActive();
        } else if (animId !== null) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(wrapper);

    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        startLoopIfActive();
      } else if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    startLoopIfActive();

    return () => {
      if (animId !== null) cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      if (!isMobile) window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [theme, reducedMotion, isMobile]);

  return (
    <div
      ref={heroWrapperRef}
      className="heroPinSection"
      dir={dir}
      id="heroGateSection"
    >
      <div className="heroStickyViewport">
        {/* Ambient Video Layer */}
        <div className="heroVideoBgContainer">
          {shouldShowVideo && (
            <video
              ref={videoRef}
              loop
              muted
              playsInline
              preload="none"
              className="heroBgVideo"
              aria-hidden="true"
            >
              <source src="/people_cont.mp4" type="video/mp4" />
            </video>
          )}
          <div className="heroVideoOverlay"></div>
        </div>

        {/* 3D Gate & Light Flood Canvas */}
        <canvas ref={canvasRef} className="heroGateCanvas" aria-hidden="true" />

        {/* Overlaid UI Content */}
        <div ref={contentOverlayRef} className="heroContentOverlay">
          <div className="heroBadge">
            <span className="heroBadgeDot"></span>
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="heroTitle">
            {t.hero.titleMain}{" "}
            <span className="heroGoldGradient">{t.hero.titleHighlight}</span>
          </h1>

          <p className="heroSubline">{t.hero.subline}</p>

          <div className="heroCtaGroup">
            <button
              type="button"
              className="heroPrimaryCta"
              onClick={onExploreClick}
            >
              <span>{t.hero.ctaPrimary}</span>
              <FontAwesomeIcon icon={isRTL ? faArrowLeft : faArrowRight} />
            </button>
            <a href="#platformModules" className="heroSecondaryCta">
              <span>{t.hero.ctaSecondary}</span>
            </a>
          </div>
        </div>

        {/* Floating Scroll Indicator & Gate Status Bar */}
        <div className="gateStatusBar" dir={dir}>
          <div className="gateProgressTrack">
            <div
              ref={progressBarRef}
              className="gateProgressBar"
              style={{ transform: "scaleX(0)" }}
            ></div>
          </div>
          <div className="gateStatusInfo">
            <FontAwesomeIcon icon={faChevronDown} className="pulseArrow" />
            <span>{t.hero.scrollHint}</span>
            <span ref={ratioTextRef} className="gateRatioText">
              0%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
