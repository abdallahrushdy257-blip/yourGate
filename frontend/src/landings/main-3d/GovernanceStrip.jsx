import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faKey,
  faFileContract,
  faCheck,
  faServer,
} from "@fortawesome/free-solid-svg-icons";

/**
 * GovernanceStrip Component
 * 3 Pillars with count-in animation:
 * 1. Multi-Tenant data isolation (store_id)
 * 2. Granular roles & permissions per screen/button
 * 3. Immutable audit trail & board approvals
 */
export default function GovernanceStrip({ t, dir }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const pillars = t.governance.pillars;

  const getPillarIcon = (idx) => {
    switch (idx) {
      case 0:
        return faServer;
      case 1:
        return faKey;
      case 2:
        return faFileContract;
      default:
        return faShieldHalved;
    }
  };

  return (
    <section className="governanceSection" id="governanceSecurity" dir={dir}>
      <div className="governanceInnerContainer">
        <div className="governanceHeader text-center">
          <div className="sectionBadge">
            <span className="badgeDot"></span>
            <span>{t.governance.badge}</span>
          </div>
          <h2 className="sectionTitle">{t.governance.title}</h2>
          <p className="sectionSubtitle">{t.governance.subtitle}</p>
        </div>

        <div className="governanceCardsGrid">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className={`governanceCard ${hoveredIdx === idx ? "cardHovered" : ""}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="govCardTop">
                <div className="govIconBox">
                  <FontAwesomeIcon icon={getPillarIcon(idx)} />
                </div>
                <div className="govStatBadge">
                  <span className="govStatValue">{pillar.stat}</span>
                  <span className="govStatLabel">{pillar.statLabel}</span>
                </div>
              </div>

              <h3 className="govCardTitle">{pillar.title}</h3>
              <p className="govCardDesc">{pillar.desc}</p>

              <div className="govCardFooter">
                <span className="verifiedTick">
                  <FontAwesomeIcon icon={faCheck} /> معتمد ومطابق للمعايير
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
