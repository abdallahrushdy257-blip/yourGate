import LandingNav from "../components/LandingNav";
import Title from "../components/title";
import "./createMangelanding.css";
import LandingFooter from "../components/LandingFooter";
import LandingInfo from "../components/LandingInfo";
import OurSystemContainer from "../components/OurSystemContainer";
import BenefitsConatiner from "../components/BenefitsConatiner";
import Stars from "../components/Stars";
import SubscriptionContainer from "../components/SubScriptionContainer";
import { ReactComponent as DesignProject } from './images/projectmarketing.svg';

function DesignMarketingLanding() {
  const textData = [
    "نُـمْـكَـنُك من الإطلاع على التقارير  والحصول علي كافة التصميمات الخاصة بكل مشروع",
    "نُـمْـكَـنُك من قرءاة كافة البيانات وتحليلها",
    "عرض بياني وتفصيلي حول اكتمال كل مشروع",
    "عرض المشاريع المتاحة للتبرع في المتجر الخاص بالموقع لتسهيل عملية التبرع",
    "نُـمْـكَـنُك من الحصول علي الخطط الاستراتجية لكل مشروع",
  ];

  const cardItems = [
    {
      mainText: "اشتراك لمدة ثلاث اعوام",
      text: "نوفّر خدمات إنشاء وإدارة الجمعيات الخيرية باشتراك لمدة ثلاث  سنوات يضمن لك تجربة متكاملة ودعم مستمر.",
      price: "7000",
      disc: "وفر اكثر مع نظام الثلاث اعوام ",
      list: [
        "الحصول علي خدمات ادارة المشاريع ",
        "الحصول علي تصميم  (200)بوست علي مدار الثلاث اعوام",
        "الحصول عل تصميم (200) بوستر علي مدار الثلاث اعوام",
        "الحصول عل  (50) خطة علي مدار الثلاث اعوام (مفكرة الحالة ،الخطة التنفذية للحالة، الميزانية)",
      ]
    },
    {
      mainText: "اشتراك لمدة عام",
      text: "نوفّر خدمات  التصميم والتسويق للجمعيات الخيرية باشتراك سنوي يضمن لك تجربة متكاملة ودعم مستمر.",
      price: " 2500",
      list: [
        "الحصول علي خدمات ادارة المشاريع ",
        "الحصول علي تصميم  (60)بوست سنوياً",
        "الحصول عل تصميم (60) بوستر سنوياً",
        "الحصول عل  (15) خطة سنوياً (مفكرة الحالة ،الخطة التنفذية للحالة، الميزانية)",
      ]
    },

  ];
  const subscriptionPlans = [
    {
      title: "باقة السنة",
      subtitle: "وفر أكثر مع النظام المتكامل",
      price: "12,250 ر.س",
      description:
        "الخيار الأمثل لأصحاب الأعمال الذين يسعون للحصول على تقارير شاملة، مميزات متقدمة، وخصائص تدعم توسيع نطاق أعمالهم، مع الاستفادة من خبرات فريق عملنا المحترف.",
      buttonText: "اشترك الآن",
    },
    {
      title: "حزمة الثلاث سنوات",
      subtitle: "وفر أكثر حزمة مع الثلاث سنوات حتي 13%",
      price: "32,500 ر.س",
      description:
        "الخطة المثالية لأصحاب الأعمال الذين يبحثون عن تقارير شاملة، مميزات متطورة، وخصائص تساهم في توسيع نطاق أعمالهم، مع دعم كامل من فريق عملنا المحترف.",
      buttonText: "اشترك الآن",
    },
  ];
  return (
    <div className="createMangeLand">
      <LandingNav />
      <div className="landingTitleCon">
        <Title title="تصميم المشاريع والتسويق" />
      </div>

      <div className="section1Container" id="mainLandingsec1">
        <div className="homeCover">
          <h3>
            التصميم والتسويق
          </h3>
          <p>
            يمكنك الاستفادة من خدماتنا المتخصصة التي تشمل إدارة المشاريع  الخاصة بجمعيتك. نحن نركز على تلبية احتياجاتك بأعلى مستوى من الكفاءة والاحترافية لضمان نجاح أعمال الجمعيات الأهلية والخيرية.          </p>
          <span className="lineLand"> </span>
        </div>


        <DesignProject />

      </div>
      <div className="starsContainer">
        <Stars />

        <LandingInfo
          text={textData}
          title="تمتع الآن بتسويق وتصميم المشاريع الخاصة بك"
        />

        <OurSystemContainer items={cardItems} />

        {/* <SubscriptionContainer plans={subscriptionPlans} /> */}

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

export default DesignMarketingLanding;
