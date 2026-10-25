import LandingNav from "../components/LandingNav";
import Title from "../components/title";
import "./createMangelanding.css";
import LandingFooter from "../components/LandingFooter";
import LandingInfo from "../components/LandingInfo";
import OurSystemContainer from "../components/OurSystemContainer";
import BenefitsConatiner from "../components/BenefitsConatiner";
import Stars from "../components/Stars";
import { ReactComponent as Loans } from './images/loans.svg';

function LoansLanding() {
  const textData = [
    "إمكانية منح القروض للمستفيدين مع متابعة دقيقة لسجل الأقساط لضمان السداد المنتظم والإدارة المالية السليمة.",
    "تقسيم فترة منح القرض إلى مراحل محددة تلقائيًا بما يتناسب مع خطة السداد وجدول المدفوعات.",
    " إعداد دراسة جدوى شاملة لكل طلب قرض الوضع المالي للمستفيد لتحديد امكانية القبول او الرفض.",
    " أخذ الكفيل في الاعتبار لضمان سداد القرض في حال تعذر على المستفيد الوفاء بالتزاماته المالية.",
  ];

  const cardItems = [
    {
      mainText: "اشتراك لمدة ثلاث اعوام",
      text: "نُوفّر خدمات التصميم والتسويق للجمعيات الخيرية باشتراك الثلاث اعوام لضمان تجربة متكاملة ودعم مستمر.",
      price: "5000",
      disc: "وفر اكثر مع نظام الثلاث اعوام ",
      list: [
        "إدارة كاملة لبيانات وسجلات القروض",
        "نظام تلقائي لإدارة الأقساط والدفعات",
        "إعداد وتصدير تقارير القروض الشهرية",
        "تقارير  لإدارة القروض والأقساط",
      ]
    },
    {
      mainText: "اشتراك لمدة عام",
      text: "نُوفِّرُ خدمات إدارة القروض للجمعيات الخيرية باشتراك سنوي لضمان تجربة سلسة ودعم مستمر.",
      price: "2000",
      list: [
        "إدارة كاملة لبيانات وسجلات القروض",
        "نظام تلقائي لإدارة الأقساط والدفعات",
        "إعداد وتصدير تقارير القروض الشهرية",
        "تقارير  لإدارة القروض والأقساط",
      ]
    },

  ];



  return (
    <div className="createMangeLand">
      <LandingNav />
      <div className="landingTitleCon">
        <Title title=" إدارة القروض و الاقساط" />
      </div>

      <div className="section1Container" id="mainLandingsec1">
        <div className="homeCover">
          <h3>
            القروض و الاقساط
          </h3>
          <p>
            نُوفر خدمات متخصصة في إدارة القروض والأقساط لجمعيتك لضمان تنظيم مالي فعّال ودعم استدامة الأعمال الخيرية.
          </p>
          <span className="lineLand"> </span>
        </div>


        <Loans />

      </div>
      <div className="starsContainer">
        <Stars />

        <LandingInfo
          text={textData}
          title="إدارة القروض والأقساط: ضمان سداد مرن وفعّال"
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

export default LoansLanding;
