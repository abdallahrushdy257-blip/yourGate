import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faArrowLeft,
  faArrowRight,
  faShieldHalved,
  faPhone,
  faEnvelope,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

/**
 * LandingCtaFooter Component
 * - 3 Tiers Pricing Table
 * - Grand Final CTA banner
 * - Quick Sub-landing portals
 * - Official Footer
 */
export default function LandingCtaFooter({ t, dir, isRTL }) {
  const navigate = useNavigate();

  const pricingTiers = t?.pricing?.tiers || [
    {
      id: "starter",
      name: "باقة الانطلاق",
      desc: "مثالية للجمعيات الناشئة والمكاتب الإشرافية الصغيرة",
      price: "1,499 ريال",
      period: "سنوياً",
      features: [
        "إدارة الحالات والمستفيدين",
        "سندات القبض والصرف بـ QR",
        "دعم حتى 5 مستخدمين",
        "تخزين سحابي معتمد 50GB",
      ],
      cta: "ابدأ التجربة المجانية",
      popular: false,
    },
    {
      id: "pro",
      name: "باقة المنظومة المتقدمة",
      desc: "الباقة الأكثر اكتمالاً للجمعيات المتوسطة والكبيرة",
      price: "3,899 ريال",
      period: "سنوياً",
      features: [
        "كافة الموديولات الـ 16 كاملة",
        "شجرة المحاسبة والقيود اليومية",
        "المسيرات والرواتب وبصمة الحضور",
        "صلاحيات دقيقة وتدقيق مالي",
        "عدد غير محدود من المستخدمين",
      ],
      cta: "ابدأ التجربة المجانية",
      popular: true,
    },
    {
      id: "enterprise",
      name: "باقة المؤسسات والاتحادات",
      desc: "حلول سحابية مخصصة للكيانات الكبرى والفروع المتعددة",
      price: "تواصل معنا",
      period: "مخصص",
      features: [
        "ربط برمجي مخصص (API)",
        "سيرفر مخصص ومعزول بالكامل",
        "مدير حساب فني مخصص 24/7",
        "تدريب ميداني لكوادر الجمعية",
      ],
      cta: "تواصل مع مستشار الحلول",
      popular: false,
    },
  ];

  return (
    <footer className="landingCtaFooterSection" dir={dir}>
      {/* ── Pricing Table Section ── */}
      <div className="pricingContainer" id="pricingSection">
        <div className="pricingHeader text-center">
          <div className="sectionBadge">
            <span className="badgeDot"></span>
            <span>{t?.pricing?.badge || "خطط استثمار مرنة"}</span>
          </div>
          <h2 className="sectionTitle">{t?.pricing?.title || "استثمار مدروس لتعظيم أثر جمعيتك"}</h2>
          <p className="sectionSubtitle">{t?.pricing?.subtitle || "باقات اشتراك تناسب كافة أحجام الجمعيات والمؤسسات الأهلية دون أي تكاليف تأسيس خفية."}</p>
        </div>

        <div className="pricingCardsRow">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`pricingCard ${tier.popular ? "tierPopular" : ""}`}
            >
              {tier.popular && (
                <div className="popularRibbon">
                  <span>الأكثر اختياراً</span>
                </div>
              )}

              <div className="tierHeader">
                <h3 className="tierName">{tier.name}</h3>
                <p className="tierDesc">{tier.desc}</p>
              </div>

              <div className="tierPriceBox">
                <span className="tierAmount">{tier.price}</span>
                <span className="tierPeriod"> / {tier.period}</span>
              </div>

              <ul className="tierFeaturesList">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx}>
                    <FontAwesomeIcon icon={faCheck} className="tierCheck" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`tierCtaBtn ${tier.popular ? "btnPopular" : "btnStandard"}`}
                onClick={() => navigate("/charityregistration")}
              >
                <span>{tier.cta}</span>
                <FontAwesomeIcon icon={isRTL ? faArrowLeft : faArrowRight} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Grand Final CTA Banner ── */}
      <div className="grandCtaBannerContainer">
        <div className="grandCtaBanner">
          <div className="ctaBadge">{t?.cta?.badge || "انطلاقة فورية"}</div>
          <h2 className="ctaTitle">{t?.cta?.title || "جاهز لنقل جمعيتك نحو عصر التحول الرقمي الكامل؟"}</h2>
          <p className="ctaSubtitle">{t?.cta?.desc || t?.cta?.subtitle || "انضم إلى أكثر من 120 كياناً خيرياً يعتمد على بوابتك يومياً في إدارة الحالات، التبرعات، والمسيرات المالية بكل يسر وموثوقية."}</p>

          <div className="ctaButtonGroup">
            <button
              type="button"
              className="ctaBtnPrimary"
              onClick={() => navigate("/charityregistration")}
            >
              <span>{t?.cta?.btnTrial || "ابدأ التجربة المجانية الآن"}</span>
              <FontAwesomeIcon icon={isRTL ? faArrowLeft : faArrowRight} />
            </button>
            <button
              type="button"
              className="ctaBtnSecondary"
              onClick={() => navigate("/login")}
            >
              <span>{t?.cta?.btnDemo || "طلب عرض توضيحي حي"}</span>
            </button>
          </div>

          <div className="ctaGuaranteeBadge">
            <FontAwesomeIcon icon={faShieldHalved} />
            <span>{t?.cta?.guarantee || "بدون أي رسوم خفية — دعم فني متواصل وتدريب كامل لفريقك"}</span>
          </div>
        </div>
      </div>

      {/* ── Navigation Links to Specific Modules Landings ── */}
      <div className="subLandingsGridRow">
        <div className="subLandingsTitle">استكشف البوابات التخصصية:</div>
        <div className="subLandingsChips">
          <Link to="/createMangelanding">بوابة إنشاء وإدارة الحالات</Link>
          <Link to="/hrlanding">بوابة الموارد البشرية والرواتب</Link>
          <Link to="/loansLanding">بوابة القروض والأقساط</Link>
          <Link to="/endowmentsLanding">بوابة الأوقاف والوصايا</Link>
          <Link to="/dataManagementLanding">بوابة إدارة البيانات</Link>
          <Link to="/archivesLanding">بوابة الأرشيف الرقمي</Link>
          <Link to="/websiteLanding">بوابة إنشاء المتجر الإلكتروني</Link>
        </div>
      </div>

      {/* ── Official Footer ── */}
      <div className="bottomFooterArea">
        <div className="footerCol">
          <div className="footerBrandTitle">{t?.footer?.company || "بوابة الأعمال الدولية"}</div>
          <div className="footerSubBrand">{t?.footer?.subCompany || "International Business Gates (IBG)"}</div>
          <div className="footerCopyright">{t?.footer?.rights || "جميع الحقوق محفوظة © 2020-2026"}</div>
        </div>

        <div className="footerCol">
          <div className="footerColTitle">{t?.footer?.quickLinks || "روابط سريعة"}</div>
          <div className="footerLinksGroup">
            <Link to="/terms">{t?.footer?.terms || "الشروط والأحكام"}</Link>
            <Link to="/privacy">{t?.footer?.privacy || "سياسة الخصوصية"}</Link>
          </div>
        </div>

        <div className="footerCol">
          <div className="footerColTitle">{t?.footer?.contact || "تواصل معنا"}</div>
          <div className="footerContactItem">
            <FontAwesomeIcon icon={faEnvelope} /> info@ibgates.com
          </div>
          <div className="footerContactItem">
            <FontAwesomeIcon icon={faPhone} /> +966 53 798 0019 (السعودية)
          </div>
          <div className="footerContactItem">
            <FontAwesomeIcon icon={faHeadset} /> دعم فني مباشر 24/7
          </div>
        </div>
      </div>
    </footer>
  );
}
