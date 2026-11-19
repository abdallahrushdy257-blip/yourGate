import LandingNav from "../../../components/LandingNav";
import Title from "../../../components/title";
import "./createMangelanding.css";
import LandingFooter from "../../../components/LandingFooter";
import LandingInfo from "../../../components/LandingInfo";
import OurSystemContainer from "../../../components/OurSystemContainer";
import BenefitsConatiner from "../../../components/BenefitsConatiner";
import Stars from "../../../components/Stars";
import Loans from './images/loans.svg?react';

function WebsiteLanding() {
  const textData = [
    "إنشاء موقع إلكتروني للجمعية بسهولة دون تعقيد",
    "تصميم يناسب احتياجات وأهداف كل جمعية",
    "أدوات مخصصة لعرض الأنشطة وجذب الداعمين",
    "وصول أسهل للجمهور وزيادة التفاعل مع خدمات الجمعية",
  ];

  const cardItems = [
    {
      text: "يمكنك إنشاء موقعك الإلكتروني الخاص بكل سهولة ومرونة، مع تخصيصه بما يتناسب مع احتياجات جمعيتك وأهدافها.",
      // text: "نُوفّر خدمات التصميم والتسويق للجمعيات الخيرية باشتراك الثلاث اعوام لضمان تجربة متكاملة ودعم مستمر.",
      // price: "5000",
      price: "يتم تحديد السعر علي حسب احتياجات كل موقع ",
      list: [
        "إنشاء الموقع الخاص بك بسهولة وبدون تعقيد",
        "تخصيص التصميم ليتناسب مع هوية الجمعية",
        "تحديد العناصر المناسبة التي تلبي احتياجات جمعيتك",
      ]
    },
  ];



  return (
    <div className="createMangeLand">
      <LandingNav />
      <div className="landingTitleCon">
        <Title title="انشي موقعك الالكتروني" />
      </div>

      <div className="section1Container" id="mainLandingsec1">
        <div className="homeCover">
          <div className="portalSectionBadge">
            <span className="badgeDot"></span>
            <span>بوابة متخصصة متكاملة | Charity Store & Portal Builder</span>
          </div>
          <h3>إنشاء المتجر والموقع الإلكتروني</h3>
          <p>
            نُمكنك من إنشاء وتخصيص المتجر الإلكتروني والموقع الرسمي للجمعية الخيرية بدون تعقيد برمجى، لاستقبال التبرعات وعرض المشاريع بمرونة تامة.
          </p>
          <span className="lineLand"> </span>
          <div className="heroPortalCtaRow">
            <a href="/login" className="heroPortalPrimaryCta">
              <span>طلب استشارة وإنشاء متجر</span>
              <span className="ctaArrow">←</span>
            </a>
            <a href="#plans" className="heroPortalSecondaryCta">
              <span>تفاصيل الباقة</span>
            </a>
          </div>
        </div>

        <Loans />
      </div>

      <div className="starsContainer">
        <Stars />

        <LandingInfo
          text={textData}
          title="أنشئ موقع ومتجر جمعيتك الإلكتروني بسهولة واحترافية"
        />

        <div id="plans">
          <OurSystemContainer items={cardItems} title="باقة إنشاء وتخصيص المتجر والموقع" />
        </div>




        <BenefitsConatiner
          title="أساليب مبتكرة ومُلهمة لتعزيز التواصل، التفاعل، والإنتاجية."
          benTitle="مع خدمة المشاركة من Your Gates"
          benDesc="يمكنك الاستفادة من خدماتنا المتخصصة في إدارة وتسويق المشاريع، بالإضافة إلى تصميم وتنفيذ حلول مبتكرة تلبي احتياجاتك. نحرص على تقديم خدمات عالية الكفاءة والاحترافية لمساعدتك في تحقيق نجاح أعمالك بسهولة."
        />
      </div>
      <LandingFooter />
    </div>
  );
}

export default WebsiteLanding;
