import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

/**
 * ModulesCarousel3D Component
 * - 16 modules as glassmorphism cards arranged on a 3D ring/carousel
 * - Category filter chips to jump or filter
 * - Safe 3D spacing preventing any card collision
 * - Active center card enlarges and reveals mockup preview and bullet points
 */
export default function ModulesCarousel3D({ t, dir, isRTL, isMobile }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselContainerRef = useRef(null);

  const allModules = t.modules.list;
  const categories = t.modules.categories;

  // Filter modules by category if selected
  const filteredModules =
    activeCategory === "all"
      ? allModules
      : allModules.filter((m) => m.cat === activeCategory);

  const total = filteredModules.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handleCategoryChange = (catKey) => {
    setActiveCategory(catKey);
    setActiveIndex(0);
  };

  return (
    <div className="modulesSection" id="platformModules" dir={dir}>
      <div className="modulesInnerContainer">
        {/* Section Header */}
        <div className="modulesHeader text-center">
          <div className="sectionBadge">
            <span className="badgeDot"></span>
            <span>{t.modules.badge}</span>
          </div>
          <h2 className="sectionTitle">{t.modules.title}</h2>
          <p className="sectionSubtitle">{t.modules.subtitle}</p>

          {/* Category Filter Chips */}
          <div className="modulesCategoryChips">
            <button
              type="button"
              className={`catChip ${activeCategory === "all" ? "chipActive" : ""}`}
              onClick={() => handleCategoryChange("all")}
            >
              {t.modules.filterAll} ({allModules.length})
            </button>
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`catChip ${activeCategory === key ? "chipActive" : ""}`}
                onClick={() => handleCategoryChange(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Stage Carousel */}
        <div className="carousel3DStage" ref={carouselContainerRef}>
          <div className="carousel3DTrack">
            {filteredModules.map((item, idx) => {
              // Calculate offset relative to active index
              let offset = idx - activeIndex;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const isCenter = offset === 0;
              const absOffset = Math.abs(offset);
              // Only render center card and immediate 2 adjacent cards to avoid visual overlap
              const isVisible = absOffset <= 2;

              if (!isVisible) return null;

              // Safe 3D math: spacing proportional to card width so cards never collide
              const rotateY = offset * (isRTL ? -25 : 25);
              const translateZ = 120 - absOffset * 130;
              const translateX = offset * (isRTL ? -380 : 380);
              const scale = isCenter ? 1 : 0.88 - absOffset * 0.06;
              const opacity = isCenter ? 1 : Math.max(0.2, 0.75 - absOffset * 0.3);

              return (
                <div
                  key={item.id}
                  className={`card3DItem ${isCenter ? "card3DCenter" : "card3DSide"}`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex: 20 - absOffset,
                    pointerEvents: isCenter ? "auto" : "auto",
                  }}
                  onClick={() => setActiveIndex(idx)}
                >
                  <div className="card3DContent">
                    <div className="card3DHeader">
                      <span className="card3DTag">{item.metric}</span>
                      <span className="card3DIndex">#{idx + 1}</span>
                    </div>

                    <h4 className="card3DTitle">{item.title}</h4>
                    <p className="card3DDesc">{item.desc}</p>

                    {/* Features List */}
                    <ul className="card3DFeatures">
                      {item.features.map((f, fIdx) => (
                        <li key={fIdx}>
                          <FontAwesomeIcon icon={faCheckCircle} className="featCheck" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Simulated Mini Screen Mockup */}
                    <div className="card3DMockup">
                      <div className="mockupHeader">
                        <span className="mockupDot red"></span>
                        <span className="mockupDot yellow"></span>
                        <span className="mockupDot green"></span>
                        <span className="mockupTitle">{item.title}</span>
                      </div>
                      <div className="mockupBody">
                        <div className="mockupSkeletonLine"></div>
                        <div className="mockupSkeletonLine short"></div>
                        <div className="mockupSkeletonGrid">
                          <div className="mockupBox"></div>
                          <div className="mockupBox"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows & Indicator */}
          <div className="carouselNavControls" dir="ltr">
            <button
              type="button"
              className="carouselNavBtn"
              onClick={handlePrev}
              aria-label="Previous Module"
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <div className="carouselDotsIndicator">
              {filteredModules.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`carouselDot ${dotIdx === activeIndex ? "active" : ""}`}
                  onClick={() => setActiveIndex(dotIdx)}
                />
              ))}
            </div>
            <button
              type="button"
              className="carouselNavBtn"
              onClick={handleNext}
              aria-label="Next Module"
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
