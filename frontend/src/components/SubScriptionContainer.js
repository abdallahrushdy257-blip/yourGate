import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";

function SubscriptionContainer({ plans = [] }) {
  if (!plans || plans.length === 0) return null;

  return (
    <div className="plansGridContainer" dir="rtl" style={{ marginTop: "40px" }}>
      {plans.map((plan, index) => {
        const isFeatured = index === 1 || plan.subtitle?.includes("وفر أكثر");

        return (
          <div
            className={`planCardItem ${isFeatured ? "featuredPlanCard" : ""}`}
            key={index}
          >
            {isFeatured && (
              <div className="planBadgeFeatured">
                <FontAwesomeIcon icon={faStar} />
                <span>الأكثر طلباً وتوفيراً</span>
              </div>
            )}

            <div className="planHeader">
              <h4 className="planTitle">{plan.title}</h4>
              {plan.subtitle && <p className="planSubtitle">{plan.subtitle}</p>}
            </div>

            <div className="planPriceBox">
              <span className="planPriceValue">{plan.price}</span>
            </div>

            <p className="planTextDesc">{plan.description}</p>

            <Link to="/charityregistration" className="planCtaBtn">
              <span>{plan.buttonText || "اشترك الآن"}</span>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default SubscriptionContainer;