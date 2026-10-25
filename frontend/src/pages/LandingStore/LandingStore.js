import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import { faArrowUpLong, faCartShopping, faStore } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./landingStore.css";
import MainLandingPageNav from "../../components/MainLandingPageNav";

function LandingStore() {
    const slides = [
        { title: "ساهم الآن وكن أنت الأثر الذي يدوم", desc: "تبرعك اليوم قد يكون غدًا شريان حياة لإنسان يحتاج دعمك. كل ريال يُسهم في سقيا عطشى وإحياء أرواح.", amount: "8000$" },
        { title: "كن جزءًا من التغيير", desc: "تبرعك يسهم في بناء مستقبل أكثر إشراقًا للعديد من الأسر المحتاجة.", amount: "5000$" },
        { title: "ساعد في توفير المياه النظيفة", desc: "كل تبرع يُسهم في إيصال مياه نظيفة للقرى المحتاجة.", amount: "6000$" },
        { title: "ادعم الأطفال المحتاجين", desc: "ساهم في توفير الغذاء والتعليم للأطفال حول العالم.", amount: "7000$" },
        { title: "كن يد العون للمرضى", desc: "تبرعك يمكن أن يساهم في توفير الأدوية والرعاية الصحية.", amount: "9000$" },
        { title: "ساهم في بناء المساجد", desc: "تبرعك يساهم في بناء بيوت الله وتوفير أماكن للصلاة.", amount: "11000$" },
    ];

    return (
        <>
            <MainLandingPageNav />
            <div className="landingStoreContainer">

                <Title
                    title="معًا لتحقيق النجاح في مشاريعنا المستقبلية"
                    icon={<FontAwesomeIcon icon={faStore} />}
                />
                <div className="sliderContainer">
                    <div className="sliderHead">
                        <span className="donationCart">
                            سلة التبرعات <FontAwesomeIcon icon={faCartShopping} />
                        </span>
                        <span className="showAllProject">
                            عرض كل المشاريع <FontAwesomeIcon icon={faArrowUpLong} />
                        </span>
                    </div>

                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={20}
                        slidesPerView={4} // Show 4 slides at a time
                        navigation
                    >
                        {slides.map((slide, index) => (
                            <SwiperSlide key={index}>
                                <div className="landingStoreSlide">
                                    <div className="addToCart">أضف إلي العربة</div>
                                    <div className="slideText">
                                        <div className="slideTitle">{slide.title}</div>
                                        <div className="slideDesc">{slide.desc}</div>
                                    </div>
                                    <div className="slideMoney">{slide.amount}</div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>
        </>
    );
}

export default LandingStore;
