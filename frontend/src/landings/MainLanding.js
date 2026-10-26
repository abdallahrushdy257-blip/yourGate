import React, { useEffect, useState, useRef } from "react";
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
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LandingFooter from "../components/LandingFooter";
import MainLandingPageNav from "../components/MainLandingPageNav";
import MainLandingCover from "./images/mainlandingv2.svg?react";
import Main1 from "./images/main1.svg?react";
import Main2 from "./images/main2.svg?react";
import API from "../api/axiosConfig";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * SplitHeading: Splits text by words for GSAP staggered word reveals
 */
function SplitHeading({
  text,
  className = "",
  wordClass = "",
  as: Component = "h3",
}) {
  const words = text ? text.split(" ") : [];
  return (
    <Component
      className={`split-heading-container ${className}`}
      data-split-heading
    >
      {words.map((word, i) => (
        <span key={i} className="split-word-mask">
          <span className={`split-word ${wordClass}`}>{word}</span>
          {i < words.length - 1 && <span className="split-space">&nbsp;</span>}
        </span>
      ))}
    </Component>
  );
}

function MainLanding() {
  const containerRef = useRef(null);
  const heroVideoRef = useRef(null);

  const [showCard7, setShowCard7] = useState(false);
  const toggleCard7 = () => {
    setShowCard7((prevShowCard7) => !prevShowCard7);
  };

  const [price, setPrice] = useState([]);

  const getPrices = async () => {
    try {
      const response = await API.get("/pricing/modules");
      const data = await response;
      setPrice(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPrices();
  }, []);

  // GSAP Text Animations & ScrollTriggers
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Entrance Timeline
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .from(".heroBadge", {
          y: -25,
          opacity: 0,
          duration: 0.7,
        })
        .fromTo(
          ".heroTitle .split-word",
          { y: "115%", opacity: 0, rotateZ: 3 },
          {
            y: "0%",
            opacity: 1,
            rotateZ: 0,
            duration: 0.85,
            stagger: 0.05,
          },
          "-=0.4",
        )
        .from(
          ".heroDesc",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5",
        )
        .from(
          ".heroCtaGroup",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4",
        )
        .from(
          ".heroIllustrationWrap",
          {
            x: -35,
            opacity: 0,
            duration: 0.9,
          },
          "-=0.6",
        );

      // 2. Lightweight GPU parallax on video container (no video re-scaling)
      gsap.to(".heroVideoBgContainer", {
        y: "12%",
        ease: "none",
        scrollTrigger: {
          trigger: ".heroWrapper",
          start: "top top",
          end: "bottom top",
          scrub: 0.3,
        },
      });

      // 3. ScrollTrigger for Section SplitHeadings
      const splitTitles = containerRef.current.querySelectorAll(
        ".scroll-split-title [data-split-heading]",
      );
      splitTitles.forEach((title) => {
        const words = title.querySelectorAll(".split-word");
        if (words.length > 0) {
          gsap.fromTo(
            words,
            { y: "110%", opacity: 0 },
            {
              y: "0%",
              opacity: 1,
              duration: 0.75,
              stagger: 0.04,
              ease: "power3.out",
              scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      });

      // 4. ScrollTrigger for Services Cards (Staggered Reveal)
      gsap.fromTo(
        ".servCards .setvCard",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".servCards",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // 5. ScrollTrigger for Pricing Section
      gsap.fromTo(
        ".pricingTable tbody tr",
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".pricingTable",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // 6. ScrollTrigger for About Us Cards
      gsap.fromTo(
        ".subscriptionContainer .subSys",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".subscriptionContainer",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="landingcontainer" ref={containerRef}>
      <MainLandingPageNav />

      {/* ================================================================
          HERO SECTION (with people_cont.mp4 Video Background)
          ================================================================ */}
      <div className="heroWrapper" id="mainLandingsec1">
        <div className="heroVideoBgContainer">
          <video
            ref={heroVideoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="heroBgVideo"
          >
            <source src="/people_cont.mp4" type="video/mp4" />
          </video>
          <div className="heroVideoOverlay"></div>
        </div>

        <div className="section1Container">
          <div className="homeCover">
            <div className="heroBadge">
              <span className="heroBadgeDot"></span>
              <span>المنظومة الذكية الرائدة لإدارة الجمعيات</span>
            </div>

            <SplitHeading
              text="بوابتك للأعمال الخيرية"
              className="heroTitle"
              as="h3"
            />

            <p className="heroDesc">
              بوابتك هي منصتك الخيرية الذكية التي تتيح لك إدارة جمعيتك بكل سهولة
              واحترافية. توفر أدوات متقدمة لتنظيم التبرعات، متابعة المشاريع،
              وإعداد التقارير بكل يسر ودقة.
            </p>

            <div className="heroCtaGroup">
              <a href="#mainourServ" className="heroCtaPrimary">
                <span>استكشف خدماتنا</span>
                <FontAwesomeIcon icon={faArrowLeft} />
              </a>
              <a href="#prices" className="heroCtaSecondary">
                <span>خطط الأسعار</span>
              </a>
            </div>

            <span className="lineLand"> </span>
          </div>

          <div className="heroIllustrationWrap">
            <MainLandingCover />
          </div>
        </div>
      </div>

      <div className="svgMainCon" style={{ height: "35px" }}>
        <Main1 className="animatedRock" />
        <Main2 />
      </div>

      {/* ================================================================
          SERVICES SECTION
          ================================================================ */}
      <div className="ourServ" id="mainourServ">
        <div className="scroll-split-title">
          <SplitHeading text="خدماتنا" as="h2" className="mainTitle" />
        </div>

        <div className="servCards">
          <div className="setvCard">
            <FontAwesomeIcon icon={faHome} className="servIcon" />
            <h5>الإنشاء والإدارة</h5>
            <p className="serveDesc">
              تصميم مشاريع مبتكرة تلبي احتياجات المجتمع، مع أدوات فعّالة للترويج
              وجذب الدعم.
            </p>
            <Link to="/createMangelanding" className="showserve">
              عرض الخدمة{" "}
              <FontAwesomeIcon icon={faArrowLeft} className="showSerIcon" />
            </Link>
          </div>
          <div className="setvCard">
            <FontAwesomeIcon icon={faChartSimple} className="servIcon" />
            <h5>تصميم المشاريع و الادارة</h5>
            <p className="serveDesc">
              تصميم المشاريع الخيرية وادارتها باحترافية. نوفر لك أدوات متقدمة
              لتخطيط المبادرات، وإبرازها للجمهور، وزيادة أثرها المجتمعي بسهولة.
            </p>
            <Link to="/designmarketinglanding" className="showserve">
              عرض الخدمة{" "}
              <FontAwesomeIcon icon={faArrowLeft} className="showSerIcon" />
            </Link>
          </div>
          <div className="setvCard">
            <FontAwesomeIcon icon={faLayerGroup} className="servIcon" />
            <h5>إدارة الموارد البشرية</h5>
            <p className="serveDesc">
              نُمكنك من إدارة الكوادر البشرية لجمعيتك باحترافية. نوفر أدوات
              متقدمة لتنظيم المهام، وتوزيع الأدوار،الأداء.
            </p>
            <Link to="/hrlanding" className="showserve">
              عرض الخدمة{" "}
              <FontAwesomeIcon icon={faArrowLeft} className="showSerIcon" />
            </Link>
          </div>
          <div className="setvCard">
            <FontAwesomeIcon icon={faMoneyBillTransfer} className="servIcon" />
            <h5>إدارة القروض و الاقساط</h5>
            <p className="serveDesc">
              نُوفر لك نظامًا متكاملًا لتنظيم عمليات الإقراض وتحصيل الأقساط بكل
              دقة وسهولة. يمكنك متابعة الحالات، جدولة الدفعات،لدعم الشفافية .
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
              نُتيح لك تنظيم وحفظ بيانات جمعيتك بكل أمان واحترافية. نوفر أدوات
              متقدمة لتصنيف المعلومات، تتبع الأنشطة بدقة لدعم اتخاذ القرار .
            </p>
            <Link to="/dataManagementLanding" className="showserve">
              عرض الخدمة{" "}
              <FontAwesomeIcon icon={faArrowLeft} className="showSerIcon" />
            </Link>
          </div>
          <div className="setvCard">
            <FontAwesomeIcon icon={faFileShield} className="servIcon" />
            <h5>الأرشيف</h5>
            <p className="serveDesc">
              نُتيح لك حفظ وتنظيم كافة مستندات جمعيتك في أرشيف رقمي آمن وسهل
              الوصول وضمان الحفظ .
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
                  نُوفر نظامًا متخصصًا لإدارة الأوقاف بكفاءة وشفافية. يمكنك
                  متابعة الأصول الوقفية، وتوزيع العوائد، وتوثيق الأنشطة .
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
                  نُساعدك على تنظيم مهام فريقك ومتابعتها بكل سهولة وفعالية.
                  يمكنك تحديد المسؤوليات، ضبط المواعيد، وتتبع الإنجاز.
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
                  نُوفر لك نظامًا محاسبيًا متكاملًا يساعدك على تتبع الإيرادات
                  والمصروفات بكل دقة.
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
                  نُوفر لك أدوات سهلة وفعالة لإنشاء موقعك الإلكتروني الخاص
                  بالجمعية الخيرية.
                </p>
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

      {/* ================================================================
          PRICING SECTION
          ================================================================ */}
      <div className="pricing" dir="rtl" id="prices">
        <div className="scroll-split-title">
          <SplitHeading text="الأسعار" as="h2" className="mainTitle" />
        </div>
        <div className="landingScrollTable">
          <table className="pricingTable">
            <thead>
              <tr></tr>
              <tr style={{ fontSize: "20px", fontWeight: "bold" }}>
                <th>اسم المديول </th>
                <th>سعر سنه</th>
                <th>سعر ثلاث سنوات</th>
                <th>سعر خمس سنوات </th>
              </tr>
              <tr
                style={{
                  borderBottom: "1px solid var(--text-color)",
                  fontSize: "14px",
                  fontWeight: "normal",
                  color: "gray",
                }}
              >
                <th> </th>
                <th>وفر 10% عند الحصول على النظام الكامل</th>
                <th>وفر 20% عند الحصول على النظام الكامل </th>
                <th> وفر 35% عند الحصول على النظام الكامل </th>
              </tr>
            </thead>
            <tbody>
              {price &&
                price.map((item, index) => (
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

      {/* ================================================================
          ABOUT US SECTION
          ================================================================ */}
      <div className="aboutUs mainsubscriptionContainer" id="aboutUs">
        <div className="scroll-split-title text-center">
          <SplitHeading text="ماذا عنا" as="h2" className="mainTitle" />
        </div>
        <div className="subscriptionContainer">
          <div className="subSys">
            <div className="subText">
              <div className="subTitleCon">
                <div className="subIconWrap">
                  <FontAwesomeIcon icon={faComment} />
                </div>
                <h3 className="subtitle">الرؤية</h3>
              </div>
              <p className="subDesc">
                تقدم بوابتك حلولًا ذكية ومتكاملة تلبّي احتياجات الجمعيات
                الخيرية، من خلال أدوات مرنة تساعد في إدارة البيانات وتنظيم الفرق
                وتصميم المشاريع ومتابعة الأداء بسلاسة وفعالية.
              </p>
            </div>
          </div>
          <div className="subSys">
            <div className="subText">
              <div className="subTitleCon">
                <div className="subIconWrap">
                  <FontAwesomeIcon icon={faComment} />
                </div>
                <h3 className="subtitle">رسالتنا</h3>
              </div>
              <p className="subDesc">
                هدفنا هو تمكين الجمعيات من التركيز على رسالتها المجتمعية، وترك
                المهام الإدارية والتقنية علينا. نعمل بشغف لنكون الشريك الرقمي
                الموثوق لكل جمعية تسعى إلى تحقيق الأثر والاستدامة.
              </p>
            </div>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}

export default MainLanding;
