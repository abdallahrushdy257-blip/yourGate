import LandingFooter from "../../../components/LandingFooter";
import React from "react";
import "./terms.css";
import MainLandingPageNav from "../../../components/MainLandingPageNav";

function Terms() {
  const today = new Date().toLocaleDateString("ar-SA");

  return (
    <>
    <MainLandingPageNav />
    <div className="termsPage">

      <div className="termsContainer">

        <h1 className="termsTitle">سياسة الاستخدام</h1>
        <div className="termsDate">آخر تحديث: {today}</div>

        <p className="termsParagraph">
          مرحبًا بكم في بوابتك لإدارة الجمعيات الخيرية. باستخدامك هذا الموقع، فإنك توافق على الالتزام بسياسة الاستخدام التالية. 
          إذا لم توافق على أي جزء منها، يرجى عدم استخدام الموقع.
        </p>

        <h2 className="termsSectionTitle">1. نطاق الاستخدام</h2>
        <p className="termsParagraph">الموقع مخصص لإدارة الجمعيات الخيرية في المملكة العربية السعودية، ويتضمن الموديلات التالية:</p>

        <ul className="termsList">
          <li>إدارة البيانات: إدارة بيانات المستفيدين، المانحين، أعضاء مجلس الإدارة، الجمعية العمومية والكفلاء.</li>
          <li>إنشاء وإدارة الحالات التي يتم جمع التبرعات لها.</li>
          <li>إدارة المشاريع ومتابعتها.</li>
          <li>الموارد البشرية: إدارة الموظفين وشؤونهم.</li>
          <li>القروض والأقساط: إدارة القروض المقدمة للمستفيدين لإنشاء مشاريع صغيرة.</li>
          <li>الأوقاف: إدارة الأراضي والمباني الوقفية وتطويرها.</li>
          <li>الأرشيف: حفظ الملفات والوثائق.</li>
          <li>إدارة المهام: توزيع المهام ومتابعتها.</li>
          <li>المحاسبة: إدارة الأمور المالية والمحاسبية.</li>
          <li>إنشاء المواقع الإلكترونية الخاصة بالجمعيات.</li>
        </ul>

        <h2 className="termsSectionTitle">2. المسؤوليات</h2>
        <ul className="termsList">
          <li>المستخدم مسؤول عن الحفاظ على سرية بيانات تسجيل الدخول وعدم مشاركتها مع أي طرف آخر.</li>
          <li>يُمنع استخدام الموقع لأي أغراض غير قانونية أو ضارة أو تهدف إلى اختراق أنظمة الموقع.</li>
        </ul>

        <h2 className="termsSectionTitle">3. حقوق الملكية الفكرية</h2>
        <p className="termsParagraph">
          جميع الحقوق المتعلقة بالمحتوى، البيانات، البرامج والتصاميم الخاصة بالموقع هي ملكية شركة 
          بوابات الأعمال الرقمية للبرمجيات (www.ibgates.com).
          ويُمنع نسخ أو إعادة توزيع أي محتوى دون موافقة خطية مسبقة.
        </p>

        <h2 className="termsSectionTitle">4. إخلاء المسؤولية</h2>
        <p className="termsParagraph">
          الموقع يُقدم "كما هو" بدون أي ضمان صريح أو ضمني، ولا نتحمل أي أضرار قد تنتج عن استخدام الموقع أو الأخطاء 
          التقنية أو فقدان البيانات.
        </p>

        <h2 className="termsSectionTitle">5. تعديل الشروط</h2>
        <p className="termsParagraph">
          نحتفظ بالحق في تعديل سياسة الاستخدام في أي وقت، وسيصبح استخدامك المستمر للموقع بعد التحديث موافقة على الشروط الجديدة.
        </p>

        <h2 className="termsSectionTitle">6. القانون المعمول به وتسوية النزاعات</h2>
        <p className="termsParagraph">
          تخضع هذه السياسة لقوانين المملكة العربية السعودية، وأي نزاع يطرأ سيكون من اختصاص المحاكم السعودية.
        </p>

        <h2 className="termsSectionTitle">7. الاتصال بنا</h2>
        <ul className="termsList">
          <li>البريد الإلكتروني: info@yourgates.com</li>
          <li>الهاتف: [<span dir="ltr">+ 966 53 798 0019</span>  ]</li>
        </ul>

      </div>

     <LandingFooter />
    </div>
    </>
  );
}

export default Terms;
