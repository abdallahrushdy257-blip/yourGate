import React from "react";
import Title from "./title";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRocket } from "@fortawesome/free-solid-svg-icons";

function BenefitsConatiner(props) {
  return (
    <div className="benefitsConatiner" dir="rtl">
      {props.title && <Title title={props.title} />}

      <div className="benefitsBannerCard">
        <div className="benefitsBadge">
          <FontAwesomeIcon icon={faRocket} />
          <span>قيمة مضافة لأعمالك</span>
        </div>

        <h4 className="benTitle">{props.benTitle}</h4>
        <p className="benDesc">{props.benDesc}</p>

        <div className="benefitsCtaWrap">
          <Link to="/charityregistration" className="benefitsPrimaryBtn">
            <span>ابدأ الآن مع بوابتك</span>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <Link to="/login" className="benefitsSecondaryBtn">
            <span>تسجيل الدخول</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BenefitsConatiner;