import "./mainLanding.css";
import Title from "../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalculator,
  faChartSimple,
  faComment,
  faDatabase,
  faFileShield,
  faGlobe,
  faHome,
  faLandmark,
  faLayerGroup,
  faList,
  faListCheck,
  faMoneyBillTransfer,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import LandingFooter from "../components/LandingFooter";
import MainLandingPageNav from "../components/MainLandingPageNav";
import MainLandingCover from './images/mainlandingv2.svg?react';
import Main1 from './images/main1.svg?react';
import Main2 from './images/main2.svg?react';
import CustomButton from "../components/CustomButton";
import API from "../api/axiosConfig";



function MainLanding() {
  const [showCard7, setShowCard7] = useState(false);
  const toggleCard7 = () => {
    setShowCard7((prevShowCard7) => !prevShowCard7);
  };

  const [price , setPrice] = useState([]);

  const getPrices = async () => {
    try {
      const response = await API.get('/pricing/modules');
      const data = await response;
      setPrice(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPrices();
  }, []);



  //  const columns = [
  //   {
  //     title: "59,800",
  //     subTitle: 'ر.س/ تخصص سنوياً',
  //     discount: "وفر 35% عند الحصول على النظام الكامل",
  //     button: "اختر هذه الخطة",
  //     features: ["8000", "8000", "10000", "2000", "8000", "5000", "12000", "6800", "مجاني", "وفقاً للمتطلبات"]
  //   },
  //   {
  //     title: "37,800",
  //     title: "39,400",
  //     subTitle: 'ر.س/ ثلاث تخصصات سنوياً',
  //     discount: "وفر 20% عند الحصول على النظام الكامل",
  //     button: "اختر هذه الخطة",
  //     features: ["5400", "5400", "6750", "1350", "5400", "3000", "8100", "4000", "مجاني", "وفقاً للمتطلبات"]
  //   },
  //   {
  //     title: "15,750",
  //     title: "14,500",
  //     subTitle: 'ر.س/ سنوياً',
  //     discount: "وفر 10% عند الحصول على النظام الكامل",
  //     button: "اختر هذه الخطة",
  //     features: ["2000", "2000", "2500", "500", "2000", "1000", "3000", "1500", "مجاني", "وفقاً للمتطلبات"]
  //   }
  // ];

  // const rows = [
  //   "التعرف على النظام",
  //   "الإنشاء و الإدارة",
  //   "تصميم المشاريع ",
  //   "إدارة الموارد البشرية",
  //   "الأرشيف",
  //   "إدارة القروض و الأقساط",
  //   "إدارة المهام",
  //   "إدارة البيانات",
  //   "إدارة الأوقاف",
  //   "المحاسبة",
  //   "إنشاء موقعك الالكتروني"
  // ];


  return (
    <div className="landingcontainer">
      <MainLandingPageNav />

      <div className="section1Container" id="mainLandingsec1">
        <div className="homeCover">
          <h3>
            بوابتك للأعمال الخيرية
          </h3>
          <p>
            بوابتك هي منصتك الخيرية الذكية التي تتيح لك إدارة جمعيتك بكل سهولة واحترافية. توفر أدوات متقدمة لتنظيم التبرعات، متابعة المشاريع، وإعداد التقارير بكل يسر ودقة.
          </p>
          <span className="lineLand"> </span>

        </div>


        <MainLandingCover />
        {/* <img src={mainlanding} alt='cover' /> */}

      </div>
      <div className="svgMainCon" style={{height:"35px"}}>
        <Main1 className="animatedRock" />
        <Main2 />
      </div>
      {/* <div className="ourSystemContainer" id="mainourSystemContainer">
        <div>
          <Title title="نظامنا" />
        </div>
        <div className="CardeContainer">
          <div className="ourSystemcard">
            <div className="cardImageContainer cardImageContainer1"></div>
            <h5 className="ourSystext">إختر نظامك الخاص</h5>
            <p className="ourNote">
              احصل على الخدمات التي تحتاجها وفقًا لاحتياجاتك
            </p>
          </div>
          <div className="ourSystemcard">
            <div className="cardImageContainer cardImageContainer2"></div>
            <h5 className="ourSystext">إشترك لمدة ثلاث سنوات</h5>
            <p className="ourNote">
              الحصول على جميع الخدمات المتاحة لمدة ثلاث سنوات
            </p>
          </div>

          <div className="ourSystemcard">
            <div className="cardImageContainer cardImageContainer3"></div>
            <h5 className="ourSystext">إشترك لمدة سنه</h5>
            <p className="ourNote">
              الحصول على كافة الخدمات المتاحة لمدة سنة واحدة
            </p>
          </div>
        </div>
      </div> */}

      <div className="ourServ" id="mainourServ">
        <div>
          <Title title="خدماتنا" />
        </div>



        <div className="servCards">
          <div className="setvCard">
            <FontAwesomeIcon icon={faHome} className="servIcon" />
            <h5>الإنشاء والإدارة</h5>
            <p className="serveDesc">تصميم مشاريع مبتكرة تلبي احتياجات المجتمع، مع أدوات فعّالة للترويج وجذب الدعم.</p>
            <Link to="/createMangelanding" className="showserve">
              عرض الخدمة{" "}
              <FontAwesomeIcon icon={faArrowLeft} className="showSerIcon" />
            </Link>
          </div>
          <div className="setvCard">
            <FontAwesomeIcon icon={faChartSimple} className="servIcon" />
            <h5>تصميم المشاريع و الادارة</h5>
            <p className="serveDesc">
              تصميم المشاريع الخيرية وادارتها باحترافية. نوفر لك أدوات متقدمة لتخطيط المبادرات، وإبرازها للجمهور، وزيادة أثرها المجتمعي بسهولة.</p>
            <Link to="/designmarketinglanding" className="showserve">
              عرض الخدمة{" "}
              <FontAwesomeIcon icon={faArrowLeft} className="showSerIcon" />
            </Link>
          </div>
          <div className="setvCard">
            <FontAwesomeIcon icon={faLayerGroup} className="servIcon" />
            <h5>إدارة الموارد البشرية</h5>
            <p className="serveDesc">
              نُمكنك من إدارة الكوادر البشرية لجمعيتك باحترافية. نوفر أدوات متقدمة لتنظيم المهام، وتوزيع الأدوار،الأداء.
            </p>
            <Link to="/hrlanding" className="showserve">
              عرض الخدمة{" "}
              <FontAwesomeIcon icon={faArrowLeft} className="showSerIcon" />
            </Link>
          </div>
          {/* <div className="setvCard">
            <FontAwesomeIcon icon={faShield} className="servIcon" />
            <h5>إدارة الحوكمة</h5>
            <p className="serveDesc">
              نُمكِّن جمعيتك من تطبيق أفضل ممارسات الحوكمة بكل شفافية وفعالية لضمان تحقيق الأهداف بثقة واستدامة.
            </p>
            <Link to="/governanceLanding" className="showserve">
              عرض الخدمة{" "}
              <FontAwesomeIcon icon={faArrowLeft} className="showSerIcon" />
            </Link>
          </div> */}
          <div className="setvCard">
            <FontAwesomeIcon icon={faMoneyBillTransfer} className="servIcon" />
            <h5>إدارة القروض و الاقساط</h5>
            <p className="serveDesc">
              نُوفر لك نظامًا متكاملًا لتنظيم عمليات الإقراض وتحصيل الأقساط بكل دقة وسهولة. يمكنك متابعة الحالات، جدولة الدفعات،لدعم الشفافية .
            </p>
            <Link to="/loansLanding" className="showserve">
              عرض الخدمة{" "}
              <FontAwesomeIcon icon={faArrowLeft} className="showSerIcon" />
            </Link>
          </div>
          <div className="setvCard">
            <FontAwesomeIcon icon={faDatabase} className="servIcon" />
            <h5>إدارة البيانات</h5>
            <p className="serveDesc">
              نُتيح لك تنظيم وحفظ بيانات جمعيتك بكل أمان واحترافية. نوفر أدوات متقدمة لتصنيف المعلومات، تتبع الأنشطة بدقة لدعم اتخاذ القرار .
            </p>
            <Link to="/dataManagementLanding" className="showserve">
              عرض الخدمة{" "}
              <FontAwesomeIcon icon={faArrowLeft} className="showSerIcon" />
            </Link>
          </div>
              <div className="setvCard">
                <FontAwesomeIcon icon={faFileShield} className="servIcon" />
                <h5>الأرشيف</h5>
                <p className="serveDesc">نُتيح لك حفظ وتنظيم كافة مستندات جمعيتك في أرشيف رقمي آمن وسهل الوصول  وضمان الحفظ .
                </p>
                <Link to="/archivesLanding" className="showserve">
                  عرض الخدمة{" "}
                  <FontAwesomeIcon icon={faArrowLeft} className="showSerIcon" />
                </Link>
              </div>

          {showCard7 && (
            <>
            
              <div className="setvCard">
                <FontAwesomeIcon icon={faLandmark} className="servIcon" />
                <h5>إدارة الاوقاف</h5>
                <p className="serveDesc">
                  نُوفر نظامًا متخصصًا لإدارة الأوقاف بكفاءة وشفافية. يمكنك متابعة الأصول الوقفية، وتوزيع العوائد، وتوثيق الأنشطة .
                </p>
                <Link to="/endowmentsLanding" className="showserve">
                  عرض الخدمة{" "}
                  <FontAwesomeIcon icon={faArrowLeft} className="showSerIcon" />
                </Link>
              </div>
              <div className="setvCard">
                <FontAwesomeIcon icon={faListCheck} className="servIcon" />
                <h5>إدارة المهام</h5>
                <p className="serveDesc">
                  نُساعدك على تنظيم مهام فريقك ومتابعتها بكل سهولة وفعالية. يمكنك تحديد المسؤوليات، ضبط المواعيد، وتتبع الإنجاز.
                </p>
                <Link to="/tasksLanding" className="showserve">
                  عرض الخدمة{" "}
                  <FontAwesomeIcon icon={faArrowLeft} className="showSerIcon" />
                </Link>
              </div>
              <div className="setvCard">
                <FontAwesomeIcon icon={faCalculator} className="servIcon" />
                <h5>المحاسبة</h5>
                <p className="serveDesc">
                  نُوفر لك نظامًا محاسبيًا متكاملًا يساعدك على تتبع الإيرادات والمصروفات بكل دقة.
                </p>
                <Link to="/accountingLanding" className="showserve">
                  عرض الخدمة{" "}
                  <FontAwesomeIcon icon={faArrowLeft} className="showSerIcon" />
                </Link>
              </div>
              <div className="setvCard">
                <FontAwesomeIcon icon={faGlobe} className="servIcon" />
                <h5>أنشئ موقعك الإلكتروني</h5>
                <p className="serveDesc">
                  نُوفر لك أدوات سهلة وفعالة لإنشاء موقعك الإلكتروني الخاص بالجمعية الخيرية.</p>
                <Link to="/websiteLanding" className="showserve">
                  عرض الخدمة{" "}
                  <FontAwesomeIcon icon={faArrowLeft} className="showSerIcon" />
                </Link>
              </div>
            </>
          )}
        </div>



        {!showCard7 ? (
          <p
            className="moreserv"
            onClick={toggleCard7}
            style={{ cursor: "pointer" }}
          >
            عرض المزيد
          </p>
        ) : (
          <p
            className="moreserv"
            onClick={toggleCard7}
            style={{ cursor: "pointer" }}
          >
            عرض اقل
          </p>
        )}


      </div>

        <div className="pricing" dir="rtl" id="prices">
        <h2 className="mainTitle">الأسعار</h2>
        <div className="landingScrollTable">
          <table className="pricingTable">
            <thead >
              <tr></tr>
              <tr style={{fontSize:"20px" , fontWeight:"bold"}}>
                <th >اسم المديول </th>
                <th >سعر سنه</th>
                <th >سعر ثلاث سنوات</th>
                <th >سعر خمس سنوات  </th>
              </tr>
              <tr style={{borderBottom:"1px solid var(--text-color)" , fontSize:"14px" , fontWeight:"normal" , color:"gray"}}>
                   <th >  </th>
                <th >وفر 10% عند الحصول على النظام الكامل</th>
                <th >وفر 20% عند الحصول على النظام الكامل  </th>
                <th >  وفر 35% عند الحصول على النظام الكامل  </th>
              </tr>
            </thead>
            <tbody>
                {price && price.map((item , index) => (
              <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.price_peryear} ر.س</td>
                  <td>{item.price_perthreeyears} ر.س</td>
                  <td>{item.price_perfiveyears} ر.س</td>
              </tr>
                ))}
               
            </tbody>
          </table>
        </div>
      </div>
      {/* <div className="mainsubscriptionContainer" id="mainsubscriptionContainer">
        <div>
          <Title title="الأسعار" />
        </div>
        <div className="subscriptionContainer">
          <div className="subSys">
            <div className="subText">
              <div className="subTitleCon">
                <h3 className="subtitle">باقة السنة</h3>
                <p className="subSentance">وفر أكثر مع النظام المتكامل</p>
                <p className="subPrice">12,250 ر.س</p>
              </div>
              <p className="subDesc">
                الخيار الأمثل لأصحاب الأعمال الذين يسعون للحصول على تقارير
                شاملة، مميزات متقدمة، وخصائص تدعم توسيع نطاق أعمالهم، مع
                الاستفادة من خبرات فريق عملنا المحترف.
              </p>
            </div>
            <button className="subButton">اشترك الآن</button>
          </div>

          <div className="subSys">
            <div className="subText">
              <div className="subTitleCon">
                <h3 className="subtitle">حزمة الثلاث سنوات</h3>
                <p className="subSentance">
                  وفر أكثر حزمة مع الثلاث سنوات حتي 13%
                </p>
                <p className="subPrice">32,500 ر.س</p>
              </div>
              <p className="subDesc">
                الخطة المثالية لأصحاب الأعمال الذين يبحثون عن تقارير شاملة،
                مميزات متطورة، وخصائص تساهم في توسيع نطاق أعمالهم، مع دعم كامل
                من فريق عملنا المحترف.
              </p>
            </div>
            <button className="subButton">اشترك الآن</button>
          </div>
        </div>
      </div> */}
      <div className="aboutUs mainsubscriptionContainer" id="aboutUs">
        <div>
          <Title title="ماذا عنا" />
        </div>
        <div className="subscriptionContainer">
          {/* <div className="subSys">
            <div className="subText">
              <div className="subTitleCon">
                <h3 className="subtitle"> من نحن؟</h3>
                <FontAwesomeIcon icon={faComment} className="servIcon" />
                <p className="subPrice"></p>
              </div>
              <p className="subDesc">
                نحن في بوابتك نؤمن بأن التقنية يمكن أن تُحدث فارقًا حقيقيًا في تطوير العمل الخيري.
                لذلك أنشأنا منصة رقمية متكاملة تساعد الجمعيات الخيرية على إدارة أعمالها بسهولة وكفاءة.
              </p>
            </div>
          </div> */}
          <div className="subSys">
            <div className="subText">
              <div className="subTitleCon">
                <h3 className="subtitle"> الرؤية</h3>
                <FontAwesomeIcon icon={faComment} className="servIcon" />
                <p className="subPrice"></p>
              </div>
              <p className="subDesc">
                تقدم بوابتك حلولًا ذكية ومتكاملة تلبّي احتياجات الجمعيات الخيرية، من خلال أدوات مرنة تساعد في إدارة البيانات وتنظيم الفرق وتصميم المشاريع ومتابعة الأداء بسلاسة وفعالية.

              </p>
            </div>
          </div>
          <div className="subSys">
            <div className="subText">
              <div className="subTitleCon">
                <h3 className="subtitle">رسالتنا</h3>
                <FontAwesomeIcon icon={faComment} className="servIcon" />
                <p className="subPrice"></p>
              </div>
              <p className="subDesc">
                هدفنا هو تمكين الجمعيات من التركيز على رسالتها المجتمعية، وترك المهام الإدارية والتقنية علينا.
                نعمل بشغف لنكون الشريك الرقمي الموثوق لكل جمعية تسعى إلى تحقيق الأثر والاستدامة.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="aboutUs mainsubscriptionContainer" id="mainsubscriptionContainer">
        <div>
          <Title title="تعرف علي النظام وباقات الاشتراك " />
        </div>

      </div> */}

      <LandingFooter />
    </div>
  );
}

export default MainLanding;
