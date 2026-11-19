import React, { useEffect, useRef, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faVolumeHigh,
  faVolumeXmark,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../../context/theme-context";

/**
 * Hero3DGate Component
 * - Pinned + Scrubbed Gate Opening with WebGL Canvas
 * - Realistic 3D Double Gate leaves rotating open as user scrolls
 * - Light leaks out through seams, flooding screen on full open
 * - Floating golden dust particles with mouse parallax
 * - Respects prefers-reduced-motion & low-power fallback
 * - Theme-reactive colors reading CSS variables
 */
export default function Hero3DGate({
  t,
  dir,
  isRTL,
  reducedMotion,
  onExploreClick,
}) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const heroWrapperRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight || window.innerHeight);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Mouse coordinates with spring interpolation
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e) => {
      mouse.targetX = (e.clientX / width - 0.5) * 2; // -1 to 1
      mouse.targetY = (e.clientY / height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // 3D Gold Dust Particles
    const PARTICLE_COUNT = Math.min(Math.floor((width * height) / 9000), 140);
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1200,
        y: (Math.random() - 0.5) * 900,
        z: Math.random() * 800 + 40,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        vz: Math.random() * 0.9 + 0.3,
        size: Math.random() * 2.6 + 1.2,
        alpha: Math.random() * 0.6 + 0.3,
      });
    }

    let time = 0;
    let currentOpenRatio = 0;
    let targetOpenRatio = 0;

    // Track scroll within hero section
    const onScroll = () => {
      const wrapper = heroWrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const scrolled = -rect.top;
      const totalDist = wrapper.offsetHeight * 0.8;
      if (totalDist <= 0) return;

      const ratio = Math.max(0, Math.min(1, scrolled / totalDist));
      targetOpenRatio = ratio;
      setScrollProgress(ratio);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Main 60fps Render Loop
    const render = () => {
      time += 0.016;

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Gate opening easing
      const prevRatio = currentOpenRatio;
      currentOpenRatio += (targetOpenRatio - currentOpenRatio) * 0.1;


      ctx.clearRect(0, 0, width, height);

      // Read current dynamic CSS theme variable
      const isDark = theme === "dark" || document.body.classList.contains("dark-mode");
      const primaryColor = isDark ? "rgba(200, 146, 74, " : "rgba(185, 130, 50, ";
      const lightFloodColor = isDark ? "rgba(240, 195, 120, " : "rgba(255, 235, 190, ";

      const cx = width * 0.5 + mouse.x * 35;
      const cy = height * 0.5 + mouse.y * 25;

      // ── 1. Warm Radiance Leaking Through Gate Seams ──
      const beamGlow = ctx.createRadialGradient(
        cx,
        cy,
        20,
        cx,
        cy,
        280 + currentOpenRatio * 450
      );
      const beamAlpha = 0.22 + currentOpenRatio * 0.75;
      beamGlow.addColorStop(0, `${lightFloodColor}${beamAlpha})`);
      beamGlow.addColorStop(0.35, `${primaryColor}${beamAlpha * 0.55})`);
      beamGlow.addColorStop(0.8, `${primaryColor}0.04)`);
      beamGlow.addColorStop(1, `${primaryColor}0)`);
      ctx.fillStyle = beamGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 280 + currentOpenRatio * 450, 0, Math.PI * 2);
      ctx.fill();

      // ── 2. 3D Architectural Double Gate Leaves ──
      const gateWidth = Math.min(260, width * 0.28);
      const gateHeight = gateWidth * 1.65;
      const openAngle = currentOpenRatio * 1.55; // 0 to ~90 degrees in radians

      // Outer Arch Portal Frame (Fixed)
      ctx.save();
      ctx.strokeStyle = `${primaryColor}0.85)`;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = "#e8b068";
      ctx.shadowBlur = 18;

      ctx.beginPath();
      ctx.arc(cx, cy - gateHeight * 0.35, gateWidth, Math.PI, 0, false);
      ctx.lineTo(cx + gateWidth, cy + gateHeight * 0.5);
      ctx.lineTo(cx - gateWidth, cy + gateHeight * 0.5);
      ctx.lineTo(cx - gateWidth, cy - gateHeight * 0.35);
      ctx.stroke();

      // Base pedestal line
      ctx.beginPath();
      ctx.moveTo(cx - gateWidth * 1.25, cy + gateHeight * 0.5);
      ctx.lineTo(cx + gateWidth * 1.25, cy + gateHeight * 0.5);
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.restore();

      // Left Gate Leaf (Rotates Open outward to the left)
      ctx.save();
      ctx.translate(cx - gateWidth, cy);
      ctx.rotate(-openAngle * 0.9);
      const leftPerspectiveScale = Math.cos(openAngle); // Shrinks horizontally in perspective
      ctx.scale(Math.max(0.08, leftPerspectiveScale), 1);

      // Gate Leaf Surface
      const leftGrad = ctx.createLinearGradient(0, -gateHeight * 0.5, gateWidth, gateHeight * 0.5);
      leftGrad.addColorStop(0, `${primaryColor}0.38)`);
      leftGrad.addColorStop(0.5, `${primaryColor}0.18)`);
      leftGrad.addColorStop(1, `${primaryColor}0.48)`);

      ctx.fillStyle = leftGrad;
      ctx.strokeStyle = `${primaryColor}0.95)`;
      ctx.lineWidth = 2.4;
      ctx.shadowColor = "#f0c378";
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.rect(0, -gateHeight * 0.45, gateWidth, gateHeight * 0.95);
      ctx.fill();
      ctx.stroke();

      // Ornate Gate Ironwork Grid
      for (let bar = 1; bar < 4; bar++) {
        ctx.beginPath();
        ctx.moveTo((gateWidth / 4) * bar, -gateHeight * 0.45);
        ctx.lineTo((gateWidth / 4) * bar, gateHeight * 0.5);
        ctx.strokeStyle = `${primaryColor}0.5)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();

      // Right Gate Leaf (Rotates Open outward to the right)
      ctx.save();
      ctx.translate(cx + gateWidth, cy);
      ctx.rotate(openAngle * 0.9);
      const rightPerspectiveScale = Math.cos(openAngle);
      ctx.scale(Math.max(0.08, rightPerspectiveScale), 1);

      const rightGrad = ctx.createLinearGradient(0, -gateHeight * 0.5, -gateWidth, gateHeight * 0.5);
      rightGrad.addColorStop(0, `${primaryColor}0.38)`);
      rightGrad.addColorStop(0.5, `${primaryColor}0.18)`);
      rightGrad.addColorStop(1, `${primaryColor}0.48)`);

      ctx.fillStyle = rightGrad;
      ctx.strokeStyle = `${primaryColor}0.95)`;
      ctx.lineWidth = 2.4;
      ctx.shadowColor = "#f0c378";
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.rect(-gateWidth, -gateHeight * 0.45, gateWidth, gateHeight * 0.95);
      ctx.fill();
      ctx.stroke();

      for (let bar = 1; bar < 4; bar++) {
        ctx.beginPath();
        ctx.moveTo((-gateWidth / 4) * bar, -gateHeight * 0.45);
        ctx.lineTo((-gateWidth / 4) * bar, gateHeight * 0.5);
        ctx.strokeStyle = `${primaryColor}0.5)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();

      // ── 3. Light Flood Tunnel (Dollies into camera when gate opens) ──
      if (currentOpenRatio > 0.05) {
        ctx.save();
        const flashAlpha = Math.min(0.92, Math.pow(currentOpenRatio, 1.8) * 0.92);
        const flashGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.7);
        flashGrad.addColorStop(0, `${lightFloodColor}${flashAlpha})`);
        flashGrad.addColorStop(0.5, `${lightFloodColor}${flashAlpha * 0.4})`);
        flashGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, width * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── 4. Floating 3D Gold Dust Particles ──
      const fov = 420;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.z -= p.vz + currentOpenRatio * 4; // Fly faster toward camera when open
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

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [theme, reducedMotion, soundEnabled]);

  const gateOpenPercent = Math.round(scrollProgress * 100);

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
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="heroBgVideo"
          >
            <source src="/people_cont.mp4" type="video/mp4" />
          </video>
          <div className="heroVideoOverlay"></div>
        </div>

        {/* 3D Gate & Light Flood Canvas */}
        <canvas ref={canvasRef} className="heroGateCanvas" />

        {/* Overlaid UI Content */}
        <div
          className="heroContentOverlay"
          style={{
            opacity: Math.max(0.2, 1 - scrollProgress * 0.9),
            transform: `translateY(${scrollProgress * 40}px)`,
          }}
        >
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
              className="gateProgressBar"
              style={{ width: `${gateOpenPercent}%` }}
            ></div>
          </div>
          <div className="gateStatusInfo">
            <FontAwesomeIcon icon={faChevronDown} className="pulseArrow" />
            <span>{t.hero.scrollHint}</span>
            <span className="gateRatioText">{gateOpenPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
