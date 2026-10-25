import LandingNav from "../components/LandingNav";
import Title from "../components/title";
import "./createMangelanding.css";
import LandingFooter from "../components/LandingFooter";
import LandingInfo from "../components/LandingInfo";
import OurSystemContainer from "../components/OurSystemContainer";
import BenefitsConatiner from "../components/BenefitsConatiner";
import Stars from "../components/Stars";
import CreateManage from './images/createmanage.svg?react';


function CreateMangeLanding() {
  const textData = [
    "نُـمْـكَـنُك من الإطلاع على التقارير  والحصول علي كافة التصميمات الخاصة بكل حالة",
    "نُـمْـكَـنُك من قرءاة كافة البيانات وتحليلها",
    "عرض بياني وتفصيلي حول اكتمال كل حالة",
    "عرض الحالات المتاحة للتبرع في المتجر الخاص بالموقع لتسهيل عملية التبرع",
    "نُـمْـكَـنُك من الحصول علي الخطط الاستراتجية لكل حالة",
  ];


  const cardItems = [
    {
      mainText: "اشتراك لمدة ثلاث اعوام",
      text: "نوفّر خدمات إنشاء وإدارة الجمعيات الخيرية باشتراك لمدة ثلاث  سنوات يضمن لك تجربة متكاملة ودعم مستمر.",
      price: "5400",
      disc: "وفر اكثر مع نظام الثلاث اعوام ",
      list: [
        "الحصول علي خدمات ادارة الحالات ",
        "الحصول علي تصميم  (200)بوست علي مدار الثلاث اعوام",
        "الحصول عل تصميم (200) بوستر علي مدار الثلاث اعوام",
        "الحصول عل  (50) خطة علي مدار الثلاث اعوام (مفكرة الحالة ،الخطة التنفذية للحالة، الميزانية)",
      ]
    },
    {
      mainText: "اشتراك لمدة عام",
      text: "نوفّر خدمات الإنشاء و الإدارة للجمعيات الخيرية باشتراك سنوي يضمن لك تجربة متكاملة ودعم مستمر.",
      price: " 2000",
      list: [
        "الحصول علي خدمات ادارة الحالات ",
        "الحصول علي تصميم  (60)بوست سنوياً ",
        "الحصول عل تصميم (60) بوستر سنوياً",
        "الحصول عل  (15) خطة سنوياً (مفكرة الحالة ،الخطة التنفذية للحالة، الميزانية)",
      ]
    },
    {
      mainText: "اشتراك خمسة اعوام",
      text: "نوفّر خدمات الإنشاء و الإدارة للجمعيات الخيرية باشتراك  يضمن لك تجربة متكاملة ودعم مستمر.",
      price: " 8000",
      list: [
        "الحصول علي خدمات ادارة الحالات ",
        "الحصول علي تصميم  (400)بوست سنوياً ",
        "الحصول عل تصميم (400) بوستر سنوياً",
        "الحصول عل  (100) خطة سنوياً (مفكرة الحالة ،الخطة التنفذية للحالة، الميزانية)",
      ]
    },

  ];

  return (
    <div className="createMangeLand">
      <LandingNav />
      <div className="landingTitleCon">
        <Title title="الإنشاء والإدارة" />
      </div>

      <div className="section1Container" id="mainLandingsec1">
        <div className="homeCover">
          <h3>
               الإنشاء و الإدارة
          </h3>
          <p>
يمكنك الاستفادة من خدماتنا المتخصصة التي تشمل إدارة الحالات الخاصة بجمعيتك. نحن نركز على تلبية احتياجاتك بأعلى مستوى من الكفاءة والاحترافية لضمان نجاح أعمال الجمعيات الأهلية والخيرية.          </p>
          <span className="lineLand"> </span>
        </div>


        <CreateManage />

      </div>

      <div className="starsContainer">
        <Stars />

        <LandingInfo text={textData} title="ماذا عن الإنشاء و الإدارة؟" />

        <OurSystemContainer items={cardItems} title='نظام الإنشاء و الإدارة' />

        <BenefitsConatiner
          title="أساليب مبتكرة ومُلهمة لتعزيز التواصل، التفاعل، والإنتاجية"
          benTitle="مع خدمة المشاركة من Your Gates"
          benDesc="يمكنك الاستفادة من خدماتنا المتخصصة التي تشمل إدارة وإنشاء و الحلول
          المبتكرة. نحن نركز على تلبية احتياجاتك بأعلى مستوى من الكفاءة
          والاحترافية لضمان نجاح أعمالك وتحقيق أهدافك."
        />
      </div>
      <LandingFooter />
    </div>
  );
}

export default CreateMangeLanding;
