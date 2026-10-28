import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "./title";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

function LandingInfo({ text = [], title = "المميزات والخدمات" }) {
  if (!text || text.length === 0) return null;

  return (
    <div className="infoContainer" dir="rtl">
      <div className="subLandingSectionTitle">
        <Title title={title} />
        <p className="subLandingSectionDesc">
          أهم المزايا والخصائص المتطورة المصممة خصيصاً لخدمة أهداف جمعيتك
        </p>
      </div>

      <div className="featureCardsGrid">
        {text.map((item, index) => (
          <div className="featureCardItem" key={index}>
            <div className="featureIconBadge">
              <FontAwesomeIcon icon={faCircleCheck} />
            </div>
            <p className="featureCardText">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingInfo;
