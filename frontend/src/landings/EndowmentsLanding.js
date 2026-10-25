import LandingNav from "../components/LandingNav";
import Title from "../components/title";
import "./createMangelanding.css";
import LandingFooter from "../components/LandingFooter";
import LandingInfo from "../components/LandingInfo";
import OurSystemContainer from "../components/OurSystemContainer";
import BenefitsConatiner from "../components/BenefitsConatiner";
import Stars from "../components/Stars";
import Endowments from './images/endowments.svg?react';

function EndowmentsLanding() {
  const textData = [
    "ادارة اصول الأوقاف",
    "عرض التقارير و الاحصائيات الخاصة بالوقاف",
    "تسجيل التبرعات و المصاريف و الريع الخاصة بالاوقاف",
  ];

  const cardItems = [
    {
      mainText: "اشتراك لمدة ثلاث اعوام",
      text: "نُوفِّرُ خدمات إدارة الاوقاف للجمعيات الخيرية باشتراك لمدة ثلاث اعوام لضمان تنظيم فعّال ودعم مستمر.",
      price: "4000",
      disc: "وفر اكثر مع نظام الثلاث اعوام ",
      list: [
        " إدارة لبيانات وسجلات الأوقاف",
        "تنظيم وتحديث سجلات الأوقاف بشكل دوري",
        " إعداد تقارير دقيقة حول الأوقاف وعوائدها",
      ]
    },
    {
      mainText: "اشتراك لمدة عام",
      text: "نُوفِّرُ خدمات إدارة الاوقاف للجمعيات الخيرية باشتراك سنوي لضمان تنظيم فعّال.",
      price: "1500",
      list: [
        " إدارة لبيانات وسجلات الأوقاف",
        "تنظيم وتحديث سجلات الأوقاف بشكل دوري",
        " إعداد تقارير دقيقة حول الأوقاف وعوائدها",
      ]
    },
     {
      mainText: "اشتراك لمدة خمس اعوام",
      text: "نُوفِّرُ خدمات إدارة الاوقاف للجمعيات الخيرية باشتراك  لضمان تنظيم فعّال.",
      price: "6800",
      list: [
        " إدارة لبيانات وسجلات الأوقاف",
        "تنظيم وتحديث سجلات الأوقاف بشكل دوري",
        " إعداد تقارير دقيقة حول الأوقاف وعوائدها",
      ]
    },

  ];



  return (
    <div className="createMangeLand">
      <LandingNav />
      <div className="landingTitleCon">
        <Title title="إدارة الاوقاف" />
      </div>

      <div className="section1Container" id="mainLandingsec1">
        <div className="homeCover">
          <h3>
            إدارة الاوقاف
          </h3>
          <p>
            نُمكنك من ادارة اوقاف الجمعية الخيرية بطريقة صحيحة وفعالة.
          </p>
          <span className="lineLand"> </span>
        </div>


        <Endowments />

      </div>
      <div className="starsContainer">
        <Stars />

        <LandingInfo
          text={textData}
          title="نظام إدارة الاوقاف"
        />

        <OurSystemContainer items={cardItems} />




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

export default EndowmentsLanding;
