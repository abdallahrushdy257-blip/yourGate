import LandingNav from "../components/LandingNav";
import Title from "../components/title";
import "./createMangelanding.css";
import LandingFooter from "../components/LandingFooter";
import LandingInfo from "../components/LandingInfo";
import OurSystemContainer from "../components/OurSystemContainer";
import BenefitsConatiner from "../components/BenefitsConatiner";
import Stars from "../components/Stars";
import { ReactComponent as Data } from './images/data.svg';

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
      price: "8000",
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
      price: "2000",
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
          <h3>
          إدارة البيانات
          </h3>
          <p>
          الحصول علي بيانات المستفدين و المانحين  والأعضاء بطريقة سلسة وفعالة.          </p>
          <span className="lineLand"> </span>
        </div>


        <Data />

      </div>
      <div className="starsContainer">
        <Stars />

        <LandingInfo
          text={textData}
          title="تنظيم إدارة البيانات بذكاء"
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

export default DataManagementLanding;
