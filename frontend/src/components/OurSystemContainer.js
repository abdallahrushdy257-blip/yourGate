import React from "react";
import Title from "./title";

function OurSystemContainer({ items, title = "نظامنا وخطط الاشتراك" }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="ourSystemContainer">
      <div className="ourSystemHeader">
        <div className="portalSectionBadge">
          <span className="badgeDot"></span>
          <span>باقات الاشتراك المرنة</span>
        </div>
        <Title title={title} />
        <p className="ourSystemSubline">
          اختر الباقة المناسبة لاحتياجات جمعيتك مع إمكانية الترقية والدعم الفني المتواصل
        </p>
      </div>

      <div className={`ourPlansGrid ${items.length === 1 ? "singlePlanGrid" : ""}`}>
        {items.map((item, i) => {
          const isFeatured = Boolean(item.disc || i === 0 && items.length > 1);
          const isNumeric = Boolean(item.price && /^\s*\d+/.test(item.price));

          return (
            <div
              key={i}
              className={`ourSystemcard ${isFeatured ? "featuredPlanCard" : ""}`}
            >
              {isFeatured && (
                <div className="planPopularBadge">
                  <span>⭐ الأكثر طلباً وتوفيراً</span>
                </div>
              )}

              <div className="planCardHeader">
                <h3 className="planCardTitle">
                  {item.mainText || "خطة الاشتراك المتكاملة"}
                </h3>
                {item.disc && (
                  <div className="planDiscountBadge">
                    <span>{item.disc}</span>
                  </div>
                )}
              </div>

              <div className="planPriceContainer">
                <span className="planPriceNum">{item.price}</span>
                {isNumeric && <span className="planPriceCurrency">ر.س</span>}
              </div>

              <p className="planCardDesc">{item.text}</p>

              <div className="planDivider"></div>

              {item.list && item.list.length > 0 && (
                <ul className="planFeaturesUl">
                  {item.list.map((feat, fIdx) => (
                    <li key={fIdx} className="planFeatureItem">
                      <span className="planFeatCheck">✓</span>
                      <span className="planFeatText">{feat}</span>
                    </li>
                  ))}
                </ul>
              )}

              <a
                href="/login"
                className={`planCtaBtn ${isFeatured ? "planCtaFeatured" : ""}`}
              >
                <span>اشترك الآن في الباقة</span>
                <span className="planCtaArrow">←</span>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OurSystemContainer;
