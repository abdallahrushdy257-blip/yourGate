import LandingNav from "../components/LandingNav";
import Title from "../components/title";
import "./createMangelanding.css";
import LandingFooter from "../components/LandingFooter";
import LandingInfo from "../components/LandingInfo";
import OurSystemContainer from "../components/OurSystemContainer";
import BenefitsConatiner from "../components/BenefitsConatiner";
import Stars from "../components/Stars";
import GoverncePoster from './images/governce.svg?react';

function Governance() {
  const textData = [
    "التحديث المستمر لمعايير الحوكمة طبقاً لتحديثات المركز الوطني لتنمية القطاع غير الربحي",
    "عرض مميز لمعايير الحوكمة (معايير الامتثال والالتزام، معايير الشفافية والإفصاح، معايير السلامة المالية)",
    "إمكانية إرفاق مستندات الشواهد والدلائل ومتابعة تقدم نسبة الحوكمة.",
  ];



  return (
    <div className="createMangeLand">
      <LandingNav />
      <div className="landingTitleCon">
        <Title title=" ادارة الحوكمة" />
      </div>

      <div className="section1Container" id="mainLandingsec1">
        <div className="homeCover">
          <h3>
            ادارة الحوكمة
          </h3>
          <p>
            نُوفر خدمات متخصصة في تطبيق مبادئ الحوكمة داخل جمعيتك لضمان الشفافية، تعزيز الكفاءة، وتحقيق أفضل الممارسات في العمل الخيري.            </p>
          <span className="lineLand"> </span>
        </div>


        <GoverncePoster />

      </div>
      <div className="starsContainer">
        <Stars />

        <LandingInfo
          text={textData}
          title="نٌمكنك من تطبيق وتحسين ومراجعة معاير الحوكمة"
        />


        <div className="landingBox">
          <Title title=" ادارة الحوكمة" />
          <div className="landingBoxcon">
            <div className="landingBoxText" >
              احصل على مراجعة ومتابعة معايير الحوكمة مجاناً على بوابتك لإدارة الجمعيات الخيرية.
            </div>
          </div>
        </div>

        <div className="landingBox">
          <Title title="المراجع الخاص " />
          <div className="landingBoxcon">
            <div className="landingBoxText" >
              يمكنك الحصول على مراجعك الخاصة للتأكد من وصولك إلى أعلى مستوى من معايير الشفافية والالتزام والنزاهة المالية.
            </div>
          </div>
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

export default Governance;
