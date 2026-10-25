import LandingNav from "../components/LandingNav";
import Title from "../components/title";
import "./createMangelanding.css";
import LandingFooter from "../components/LandingFooter";
import LandingInfo from "../components/LandingInfo";
import OurSystemContainer from "../components/OurSystemContainer";
import BenefitsConatiner from "../components/BenefitsConatiner";
import Stars from "../components/Stars";
import { ReactComponent as Hr } from './images/hr.svg';

function HRLanding() {
  const textData = [
    "تسجيل الحضور والانصراف بتقنية QR Code",
    "الحصول على تقارير الموظفين مع التحاليل الإحصائية ",
    "وجود معايير تقييم الأداء KPI من أجل توزيع الحوافز على الموظفين",
    "امكانية ربط نظام إدارة الموارد البشرية بالنظام المحاسبي لدينا لكي يتم خصم المرتبات من الخزينة وتوزيعها على الموظفين أتوماتيكيا",
    "امكانية انشاء المهمات الفرعية واليومية وتحويلها إلي الموظفين الآخرين من أجل تنفيذها وامكانية المراجعة والحصول على التقارير ",
    "عرض بيانات شاملة عن الموظفين مثل الاسم، الوظيفة، التخصص، الراتب، والتاريخ الوظيفي.",
    " متابعة خصومات الرواتب والمكافآت التي تم تطبيقها على الموظف بناءً على الأداء أو سياسات الشركة.",
  ];

  const cardItems = [
    {
      mainText: "اشتراك لمدة ثلاث اعوام",
      text: "نوفّر خدمات  التصميم والتسويق للجمعيات الخيرية باشتراك ثلاث اعوام ليضمن لك تجربة متكاملة ودعم مستمر.",
      price: "8000",
      disc: "وفر اكثر مع نظام الثلاث اعوام ",
      list: [
        " إدارة كاملة لبيانات وسجلات الموظفين",
        "نظام متقدم لإدارة الإجازات والأرصدة",
        " إعداد وتصدير مسير الرواتب الشهري",
        " تقارير موارد بشرية شاملة وتحليلات",
      ]
    },
    {
      mainText: "اشتراك لمدة عام",
      text: "نُوفَّرُ خدمات الموارد البشرية للجمعيات الخيرية باشتراك سنوي يضمن لك تجربة متكاملة ودعمًا مستمرًا.",
      price: "3000",
      list: [
        " إدارة كاملة لبيانات وسجلات الموظفين",
        "نظام متقدم لإدارة الإجازات والأرصدة",
        " إعداد وتصدير مسير الرواتب الشهري",
        " تقارير موارد بشرية شاملة وتحليلات",
      ]
    },

  ];

  return (
    <div className="createMangeLand">
      <LandingNav />
      <div className="landingTitleCon">
        <Title title="إدارة الموارد البشرية" />
      </div>

      <div className="section1Container" id="mainLandingsec1">
        <div className="homeCover">
          <h3>
            الموارد البشرية
          </h3>
          <p>
            نُوفر خدمات متخصصة في إدارة الموارد البشرية لجمعيتك لضمان كفاءة تنظيم الأفراد ونجاح الأعمال الخيرية.
          </p>
          <span className="lineLand"> </span>
        </div>


        <Hr />

      </div>
      <div className="starsContainer">
        <Stars />

        <LandingInfo
          text={textData}
          title="ابدأ الآن بتحسين وإدارة الموارد البشرية في مشروعك باستخدام أدوات مبتكرة "
        />

        <OurSystemContainer items={cardItems} />

        <BenefitsConatiner
          title="أساليب مبتكرة ومُلهمة لتعزيز التواصل، التفاعل، والإنتاجية."
          benTitle="مع خدمة المشاركة من Your Gates"
          benDesc="يمكنك الاستفادة من خدماتنا المتخصصة في إدارة الموارد البشرية وتصميم حلول مبتكرة تلبي احتياجات شركتك. نحن نساعدك على تطوير أنظمة فعّالة لإدارة الموظفين، تحسين الأداء، وتعزيز بيئة العمل لتحقيق نجاح أعمالك بسهولة وكفاءة."
        />
      </div>
      <LandingFooter />
    </div>
  );
}

export default HRLanding;
