import React from "react";
import Title from "./title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faStar, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function OurSystemContainer({ items = [], title = "باقات الاشتراك" }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="ourSystemContainer" dir="rtl">
      <div className="subLandingSectionTitle">
        <Title title={title} />
        <p className="subLandingSectionDesc">
          اختر الخطة المناسبة لحجم ونشاط جمعيتك، مع إمكانية الترقية والدعم الفني المستمر
        </p>
      </div>

      <div className="plansGridContainer">
        {items.map((item, index) => {
          const isFeatured =
            item.disc ||
            (item.mainText && item.mainText.includes("ثلاث")) ||
            index === 0;

          return (
            <div
              key={index}
              className={`planCardItem ${isFeatured ? "featuredPlanCard" : ""}`}
            >
              {isFeatured && (
                <div className="planBadgeFeatured">
                  <FontAwesomeIcon icon={faStar} />
                  <span>{item.disc || "الأكثر طلباً وتوفيراً"}</span>
                </div>
              )}

              <div className="planHeader">
                <h4 className="planTitle">
                  {item.mainText || `الباقة ${index + 1}`}
                </h4>
                <p className="planTextDesc">{item.text}</p>
              </div>

              {item.price && (
                <div className="planPriceBox">
                  <span className="planPriceValue">{item.price}</span>
                  {!item.price.includes("حسب") && (
                    <span className="planPriceCurrency">ر.س</span>
                  )}
                </div>
              )}

              {item.list && item.list.length > 0 && (
                <div className="planFeaturesWrap">
                  <div className="planFeaturesTitle">مميزات الباقة:</div>
                  <ul className="planFeaturesList">
                    {item.list.map((feat, fIndex) => (
                      <li key={fIndex} className="planFeatureItem">
                        <div className="planCheckIconWrap">
                          <FontAwesomeIcon icon={faCheck} />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link to="/charityregistration" className="planCtaBtn">
                <span>اشترك الآن</span>
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OurSystemContainer;
