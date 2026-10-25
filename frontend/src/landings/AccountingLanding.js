import LandingNav from "../components/LandingNav";
import Title from "../components/title";
import "./createMangelanding.css";
import LandingFooter from "../components/LandingFooter";
import LandingInfo from "../components/LandingInfo";
import OurSystemContainer from "../components/OurSystemContainer";
import BenefitsConatiner from "../components/BenefitsConatiner";
import Stars from "../components/Stars";
import Accounting from './images/accounting.svg?react';

function AccountingLanding() {
  const textData = [
    " تسجيل المعاملات المالية بدقة وسهولة",
    "إعداد تقارير مالية شاملة وآنية",
    " متابعة الميزانية والمصروفات بفعالية",
    "ضمان الشفافية والامتثال المالي",
  ];

  // const cardItems = [
  //   {
  //     mainText: "اشتراك لمدة ثلاث اعوام",
  //     text: "خدمات محاسبية شاملة باشتراك لثلاث سنوات تضمن دقة وشفافية مالية للجمعيات.",
  //     price: "5000",
  //     disc: "وفر اكثر مع نظام الثلاث اعوام ",
  //     list: [
  //       "تسجيل دقيق للمعاملات المالية",
  //       "تقارير مالية دورية وموثوقة",
  //       "شفافية تامة في إدارة الميزانية",
  //     ]
  //   },
  //   {
  //     mainText: "اشتراك لمدة عام",
  //     text: "خدمات محاسبية شاملة باشتراك سنوي تضمن دقة وشفافية مالية للجمعيات.",
  //     price: "2000",
  //     list: [
  //       "تسجيل دقيق للمعاملات المالية",
  //       "تقارير مالية دورية وموثوقة",
  //       "شفافية تامة في إدارة الميزانية",
  //     ]
  //   },

  // ];



  return (
    <div className="createMangeLand">
      <LandingNav />
      <div className="landingTitleCon">
        <Title title="المحاسبة" />
      </div>

      <div className="section1Container" id="mainLandingsec1">
        <div className="homeCover">
          <h3>
            المحاسبة
          </h3>
          <p>
            نُمكنك من إدارة العمليات المحاسبية للجمعية الخيرية بدقة وكفاءة لضمان الشفافية وتحقيق الأهداف المالية.
          </p>
          <span className="lineLand"> </span>
        </div>


        <Accounting />

      </div>
      <div className="starsContainer">
        <Stars />

        <LandingInfo
          text={textData}
          title="حلول محاسبية ذكية لضمان كفاءة الأداء المالي للجمعية"
        />

        {/* <OurSystemContainer items={cardItems} /> */}




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

export default AccountingLanding;
