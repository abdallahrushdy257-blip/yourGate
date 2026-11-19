import LandingNav from "../components/LandingNav";
import Title from "../components/title";
import "./createMangelanding.css";
import LandingFooter from "../components/LandingFooter";
import LandingInfo from "../components/LandingInfo";
import OurSystemContainer from "../components/OurSystemContainer";
import BenefitsConatiner from "../components/BenefitsConatiner";
import Stars from "../components/Stars";
import Data from './images/data.svg?react';

function DataManagementLanding() {
  const textData = [
    "ادارة بيانات المستفدين وكل ما يخصهم من عمليات ",
    "ادارة بيانات المانحين بالجمعية وكل ما يخصهم من تبرعات.",
    "ادارة بيانات (اعضاء مجلس الادارة ،اغضاء الجمعية العمومية و الكفلاء",
  ];

  const cardItems = [
    {
      mainText: "اشتراك لمدة ثلاث اعوام",
      text: "نُوفِّرُ خدمات إدارة البيانات للجمعيات الخيرية باشتراك لمدة ثلاث اعوام لضمان تنظيم فعّال ودعم مستمر.",
      price: "8100",
      disc: "وفر اكثر مع نظام الثلاث اعوام ",
      list: [
        "إدارة كاملة لبيانات وسجلات المستفيدين",
        "نظام تلقائي لتنظيم وتحديث البيانات بشكل دوري",
        "إعداد وتصدير تقارير بيانات شهرية دقيقة",
        "تحليلات شاملة لدعم قرارات إدارة البيانات",
      ]
    },
    {
      mainText: "اشتراك لمدة عام",
      text: "نُوفِّرُ خدمات إدارة القروض للجمعيات الخيرية باشتراك سنوي لضمان تجربة سلسة ودعم مستمر..",
      price: "3000",
      list: [
        "إدارة كاملة لبيانات وسجلات المستفيدين",
        "نظام تلقائي لتنظيم وتحديث البيانات بشكل دوري",
        "إعداد وتصدير تقارير بيانات شهرية دقيقة",
        "تحليلات شاملة لدعم قرارات إدارة البيانات",
      ]
    },
    {
      mainText: "اشتراك لمدة خمسة اعوام",
      text: "نُوفِّرُ خدمات إدارة القروض للجمعيات الخيرية باشتراك  لضمان تجربة سلسة ودعم مستمر..",
      price: "12000",
      list: [
        "إدارة كاملة لبيانات وسجلات المستفيدين",
        "نظام تلقائي لتنظيم وتحديث البيانات بشكل دوري",
        "إعداد وتصدير تقارير بيانات شهرية دقيقة",
        "تحليلات شاملة لدعم قرارات إدارة البيانات",
      ]
    },

  ];



  return (
    <div className="createMangeLand">
      <LandingNav />
      <div className="landingTitleCon">
        <Title title="إدارة البيانات" />
      </div>

      <div className="section1Container" id="mainLandingsec1">
        <div className="homeCover">
          <div className="portalSectionBadge">
            <span className="badgeDot"></span>
            <span>بوابة متخصصة متكاملة | Master Data Hub</span>
          </div>
          <h3>إدارة البيانات المركزية</h3>
          <p>
            حصر وتنظيم بيانات المستفيدين، المانحين، أعضاء مجلس الإدارة، وأعضاء الجمعية العمومية والكفلاء بطريقة مركزية سلسة وآمنة.
          </p>
          <span className="lineLand"> </span>
          <div className="heroPortalCtaRow">
            <a href="/login" className="heroPortalPrimaryCta">
              <span>طلب تجربة مجانية</span>
              <span className="ctaArrow">←</span>
            </a>
            <a href="#plans" className="heroPortalSecondaryCta">
              <span>خطط الاشتراك</span>
            </a>
          </div>
        </div>

        <Data />
      </div>

      <div className="starsContainer">
        <Stars />

        <LandingInfo
          text={textData}
          title="تنظيم وإدارة البيانات بذكاء وأمان عالي"
        />

        <div id="plans">
          <OurSystemContainer items={cardItems} title="نظام وباقات إدارة البيانات" />
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

export default DataManagementLanding;
