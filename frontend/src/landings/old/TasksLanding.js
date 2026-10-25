import LandingNav from "../components/LandingNav";
import Title from "../components/title";
import "./createMangelanding.css";
import LandingFooter from "../components/LandingFooter";
import LandingInfo from "../components/LandingInfo";
import OurSystemContainer from "../components/OurSystemContainer";
import BenefitsConatiner from "../components/BenefitsConatiner";
import Stars from "../components/Stars";
import { ReactComponent as Tasks } from './images/tasks.svg';

function TasksLanding() {
  const textData = [
    "تنظيم إدارة مهام بكفاءة عالية",
    "عرض التقارير والإحصائيات المتعلقة المهام بشكل دوري",
    "تسجيل وتحديث المهام بشكل مستمر لضمان الدقة والفعالي",
  ];

  const cardItems = [
    {
      mainText: "اشتراك لمدة ثلاث اعوام",
      text: "نُوفِّرُ خدمات إدارة المهام  للجمعيات الخيرية باشتراك لمدة ثلاث اعوام لضمان تنظيم فعّال ودعم مستمر.",
      price: "5000",
      disc: "وفر اكثر مع نظام الثلاث اعوام ",
      list: [
        "اضافة المهام بشكل اوضح واسهل ",
        "تنظيم وتحديث قائمة المهام",
        "إعداد تقارير دقيقة حول المهام  وحفظ البيانات",
      ]
    },
    {
      mainText: "اشتراك لمدة عام",
      text: "نُوفِّرُ خدمات إدارة المهام للجمعيات الخيرية باشتراك سنوي لضمان تنظيم فعّال.",
      price: "2000",
      list: [
        "اضافة المهام بشكل اوضح واسهل ",
        "تنظيم وتحديث قائمة المهام",
        "إعداد تقارير دقيقة حول المهام  وحفظ البيانات",
      ]
    },

  ];



  return (
    <div className="createMangeLand">
      <LandingNav />
      <div className="landingTitleCon">
        <Title title="إدارة المهام " />
      </div>

      <div className="section1Container" id="mainLandingsec1">
        <div className="homeCover">
          <h3>
            إدارة المهام
          </h3>
          <p>
            نُمكنك من تنظيم ادارة مهام الجمعية الخيرية بكل كفاءة و دقة لضمان الوصول الي الهدف المباشر .
          </p>
          <span className="lineLand"> </span>
        </div>


        <Tasks />

      </div>
      <div className="starsContainer">
        <Stars />

        <LandingInfo
          text={textData}
          title="تطبيق إدارة المهام"
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

export default TasksLanding;
