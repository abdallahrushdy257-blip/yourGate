import LandingNav from "../../../components/LandingNav";
import Title from "../../../components/title";
import "./createMangelanding.css";
import LandingFooter from "../../../components/LandingFooter";
import LandingInfo from "../../../components/LandingInfo";
import OurSystemContainer from "../../../components/OurSystemContainer";
import BenefitsConatiner from "../../../components/BenefitsConatiner";
import Stars from "../../../components/Stars";
import Archives from './images/archives.svg?react';

function ArchivesLanding() {
  const textData = [
    "إدارة سجلات الأرشيف وتنظيمها بشكل فعال",
    "عرض التقارير والإحصائيات المتعلقة بالأرشيف بشكل دوري",
    "تسجيل المستندات والأصول الخاصة بالأرشيف وتحديثها بشكل مستمر",
  ];

  const cardItems = [
    {
      mainText: "اشتراك لمدة ثلاث اعوام",
      text: "نُوفِّرُ خدمات إدارة الارشيف للجمعيات الخيرية باشتراك لمدة ثلاث اعوام لضمان تنظيم فعّال ودعم مستمر.",
      price: "1350",
      disc: "وفر اكثر مع نظام الثلاث اعوام ",
      list: [
        "إدارة سجلات الأرشيف وتنظيمها بشكل فعال",
        "تنظيم وتحديث مستندات الأرشيف بشكل دوري",
        "إعداد تقارير دقيقة حول محتويات الأرشيف وحفظ البيانات",
      ]
    },
    {
      mainText: "اشتراك لمدة عام",
      text: "نُوفِّرُ خدمات إدارة الارشيف للجمعيات الخيرية باشتراك سنوي لضمان تنظيم فعّال.",
      price: "500",
      list: [
        "إدارة سجلات الأرشيف وتنظيمها بشكل فعال",
        "تنظيم وتحديث مستندات الأرشيف بشكل دوري",
        "إعداد تقارير دقيقة حول محتويات الأرشيف وحفظ البيانات",
      ]
    },
    {
      mainText: "اشتراك لمدة خمسة اعوام",
      text: "نُوفِّرُ خدمات إدارة الارشيف للجمعيات الخيرية باشتراك  لضمان تنظيم فعّال.",
      price: "2000",
      list: [
        "إدارة سجلات الأرشيف وتنظيمها بشكل فعال",
        "تنظيم وتحديث مستندات الأرشيف بشكل دوري",
        "إعداد تقارير دقيقة حول محتويات الأرشيف وحفظ البيانات",
      ]
    },

  ];



  return (
    <div className="createMangeLand">
      <LandingNav />
      <div className="landingTitleCon">
        <Title title="الارشيف" />
      </div>

      <div className="section1Container" id="mainLandingsec1">
        <div className="homeCover">
          <div className="portalSectionBadge">
            <span className="badgeDot"></span>
            <span>بوابة متخصصة متكاملة | Electronic Records & Archive</span>
          </div>
          <h3>الأرشيف الرقمي وإدارة الوثائق</h3>
          <p>
            نُمكنك من تنظيم وحفظ وثائق وأرشيف الجمعية الخيرية إلكترونياً بأعلى معايير الأمان والتصنيف للوصول السريع والفوري للمستندات والقرارات.
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

        <Archives />
      </div>

      <div className="starsContainer">
        <Stars />

        <LandingInfo
          text={textData}
          title="تنظيم وإدارة الأرشيف الرقمي والوثائق"
        />

        <div id="plans">
          <OurSystemContainer items={cardItems} title="نظام وباقات الأرشيف الرقمي" />
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

export default ArchivesLanding;
