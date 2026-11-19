import React from "react";
import Title from "./title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass } from "@fortawesome/free-solid-svg-icons";

function BenefitsConatiner(props) {
  const portalsList = [
    { name: "إنشاء وإدارة الحالات", path: "/createMangelanding" },
    { name: "الموارد البشرية والرواتب", path: "/hrlanding" },
    { name: "القروض والأقساط", path: "/loansLanding" },
    { name: "الأوقاف والوصايا", path: "/endowmentsLanding" },
    { name: "إدارة البيانات", path: "/dataManagementLanding" },
    { name: "الأرشيف الرقمي", path: "/archivesLanding" },
    { name: "المتجر الإلكتروني", path: "/websiteLanding" },
  ];

  return (
    <div className="benefitsConatiner">
      {props.title && (
        <div className="benefitsHeader">
          <div className="portalSectionBadge">
            <span className="badgeDot"></span>
            <span>رؤية مبتكرة وقيمة مضافة</span>
          </div>
          <Title title={props.title} />
        </div>
      )}

      <div className="benefits">
        <div className="benefitLuxuryGlow"></div>
        <div className="benefitEmblem">
          <span className="emblemSpark">✦</span>
        </div>
        <h4 className="benTitle">{props.benTitle}</h4>
        <p className="benDesc">{props.benDesc}</p>

        <div className="benefitActionsRow">
          <a href="/login" className="benefitPrimaryCta">
            <span>ابدأ تجربتك المجانية الآن</span>
            <span className="ctaArrow">←</span>
          </a>
        </div>
      </div>

      {/* ── Cross-Portals Fast Navigation Strip ── */}
      <div className="portalCrossNavSection">
        <div className="portalCrossNavTitle">
          <FontAwesomeIcon icon={faCompass} />
          <span>استكشف باقي بوابات منصة Your Gates التخصصية:</span>
        </div>
        <div className="portalCrossNavChips">
          {portalsList.map((p, idx) => (
            <a key={idx} href={p.path} className="portalCrossChip">
              <span>{p.name}</span>
              <span className="chipArrow">←</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BenefitsConatiner;