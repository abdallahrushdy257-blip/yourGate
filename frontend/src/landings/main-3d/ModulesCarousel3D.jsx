import React, { useState, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

/**
 * ModulesCarousel3D Component
 * - 16 modules as glassmorphism cards arranged on a 3D ring/carousel
 * - Category filter chips with memoized filtering
 * - Accessible keyboard navigation and button dot controls
 */
export default function ModulesCarousel3D({ t, dir, isRTL, isMobile }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);

  const allModules = t.modules.list;
  const categories = t.modules.categories;

  const filteredModules = useMemo(
    () =>
      activeCategory === "all"
        ? allModules
        : allModules.filter((m) => m.cat === activeCategory),
    [allModules, activeCategory]
  );

  const total = filteredModules.length;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handleCategoryChange = useCallback((catKey) => {
    setActiveCategory(catKey);
    setActiveIndex(0);
  }, []);

  const handleStageKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      isRTL ? handleNext() : handlePrev();
    } else if (e.key === "ArrowRight") {
      isRTL ? handlePrev() : handleNext();
    }
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
              aria-pressed={activeCategory === "all"}
              className={`catChip ${activeCategory === "all" ? "chipActive" : ""}`}
              onClick={() => handleCategoryChange("all")}
            >
              {t.modules.filterAll} ({allModules.length})
            </button>
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={activeCategory === key}
                className={`catChip ${activeCategory === key ? "chipActive" : ""}`}
                onClick={() => handleCategoryChange(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Stage Carousel */}
        <div
          className="carousel3DStage"
          tabIndex={0}
          onKeyDown={handleStageKeyDown}
          aria-roledescription="carousel"
          aria-label={t.modules.title}
        >
          <div className="carousel3DTrack">
            {filteredModules.map((item, idx) => {
              let offset = idx - activeIndex;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const absOffset = Math.abs(offset);
              if (absOffset > 1) return null;

              const isCenter = offset === 0;
              const stepX = isMobile ? 310 : 370;
              const rotateY = offset * (isRTL ? -16 : 16);
              const translateZ = isCenter ? 100 : 0;
              const translateX = offset * (isRTL ? -stepX : stepX);
              const scale = isCenter ? 1 : 0.88;
              const opacity = isCenter ? 1 : 0.78;

              return (
                <div
                  key={item.id}
                  className={`card3DItem ${isCenter ? "card3DCenter" : "card3DSide"}`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex: 20 - absOffset,
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

                    <ul className="card3DFeatures">
                      {item.features.map((f, fIdx) => (
                        <li key={fIdx}>
                          <FontAwesomeIcon icon={faCheckCircle} className="featCheck" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

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
              {filteredModules.map((mod, dotIdx) => (
                <button
                  key={mod.id}
                  type="button"
                  aria-label={`${mod.title}`}
                  aria-current={dotIdx === activeIndex ? "true" : undefined}
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
