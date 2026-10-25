import { faEnvelope, faPhone, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./LandingFooter.css";

function LandingFooter() {
  return (
    <div className="landingFooter">
      
      <div className="footerSection">
        <div className="footerTitle">بوابة الأعمال الدولية</div>
        <div className="footerContent">International Business Gates</div>
        <div className="footerContent">IBG © جميع الحقوق محفوظة 2020-2024</div>
      </div>

      <div className="footerSection">
  <div className="footerTitle"> الشروط و الأحكام</div>

  <a href="/terms" className="footerLink">الشروط والأحكام</a><br />
  <a href="/privacy" className="footerLink">سياسة الخصوصية</a>
  
</div>
      

      <div className="footerSection footerContact">
        <div className="footerTitle">تواصل معنا</div>
        <div className="footerContent">
          <FontAwesomeIcon icon={faEnvelope} className="footerIcon2" /> info@ibgates.com
        </div>
        <div className="footerContent">
          <FontAwesomeIcon icon={faPhone} className="footerIcon2" /> +966 53 798 0019
        </div>
        <div className="footerContent">
          <FontAwesomeIcon icon={faPhone} className="footerIcon2" /> +20 15 0877 0072
        </div>
      </div>

    </div>
  );
}

export default LandingFooter;
