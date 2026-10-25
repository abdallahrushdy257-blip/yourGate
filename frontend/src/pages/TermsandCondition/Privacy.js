import LandingFooter from "../../components/LandingFooter";
import MainLandingPageNav from "../../components/MainLandingPageNav";
function Privacy() {
  const today = new Date().toLocaleDateString("ar-SA");

  return (
    <>
    <MainLandingPageNav />
    <div className="termsPage">
      <div className="termsContainer">

        <h1 className="termsTitle">سياسة السرية والخصوصية</h1>
        <div className="termsDate">آخر تحديث: {today}</div>

        <p className="termsParagraph">
          توضح سياسة الخصوصية كيفية جمع، استخدام، تخزين وحماية البيانات الشخصية 
          على موقع بواباتك لإدارة الجمعيات الخيرية.
        </p>

        <h2 className="termsSectionTitle">1. البيانات التي نجمعها</h2>
        <ul className="termsList">
          <li>بيانات الجمعية</li>
          <li>بيانات المفوض</li>
          <li>أرقام التواصل</li>
        </ul>

        <h2 className="termsSectionTitle">2. استخدام البيانات</h2>
        <ul className="termsList">
          <li>إدارة العمليات اليومية للجمعيات الخيرية.</li>
          <li>تسهيل جمع التبرعات ومتابعة المشاريع والقروض.</li>
          <li>إدارة الموارد البشرية والمهام والمحاسبة داخل الجمعية.</li>
          <li>تحسين خدمات الموقع وتجربة المستخدم.</li>
        </ul>

        <h2 className="termsSectionTitle">3. مشاركة البيانات</h2>
        <ul className="termsList">
          <li>لا نشارك البيانات مع أي جهات خارجية إلا في الحالات التالية:</li>
          <li>● الامتثال للقوانين السعودية.</li>
          <li>● مع مقدمي الخدمات التقنيين الذين يساعدوننا في تشغيل الموقع (مع ضمان السرية).</li>
        </ul>

        <h2 className="termsSectionTitle">4. حماية البيانات</h2>
        <ul className="termsList">
          <li>نستخدم إجراءات تقنية وإدارية لحماية البيانات من الوصول غير المصرح به، الفقدان أو التغيير.</li>
          <li>بياناتك مخزنة على خوادم آمنة في المملكة العربية السعودية.</li>
        </ul>

        <h2 className="termsSectionTitle">5. حقوق المستخدمين</h2>
        <ul className="termsList">
          <li>الحق في الوصول إلى بياناتك الشخصية وتصحيحها أو طلب حذفها إذا لم تعد هناك حاجة لها.</li>
          <li>الحق في الاعتراض على معالجة بياناتك الشخصية في بعض الحالات.</li>
        </ul>

        <h2 className="termsSectionTitle">الاتصال بنا</h2>
        <p className="termsParagraph">لأي استفسار أو طلب متعلق بالخصوصية، يرجى التواصل معنا:</p>

        <ul className="termsList">
          <li>البريد الإلكتروني: info@yourgates.com</li>
             <li>الهاتف: [<span dir="ltr">+ 966 53 798 0019</span>  ]</li>
        </ul>

      </div>
    </div>
    <LandingFooter />
    </>
  );
}

export default Privacy;
