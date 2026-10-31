import{r as n,a1 as e,ar as o,ae as x,as as h,at as t,av as _}from"./vendor-ui-BntanN4V.js";import{e as v,H as w,F as d,Z as u,_ as k,a as C,Q as S,V as P,M as T}from"./index-CRgigqaL.js";import"./vendor-charts-CFIezg6S.js";import"./vendor-docs-CFX8IUqo.js";const R=[{uuid:"dept-1",name:"إدارة تكنولوجيا المعلومات (IT)",manager:{uuid:"emp-101",name:"أحمد محمود",photo:"https://i.pravatar.cc/150?img=11",job_number:"IT-001",email:"ahmed.mahmoud@company.com",phone:"01012345678",address:"القاهرة، مصر",date_of_joining:"2020-01-15",qualification:"بكالوريوس حاسبات ومعلومات",marital_status:"married",total_salary:25e3,bank_account_number:"EG12345678901234567890123"},employees:[{uuid:"emp-102",name:"سارة علي",photo:"https://i.pravatar.cc/150?img=5",job_number:"IT-002",email:"sara.ali@company.com",phone:"01123456789",address:"الجيزة، مصر",date_of_joining:"2021-06-01",qualification:"بكالوريوس هندسة حاسبات",marital_status:"single",total_salary:15e3,bank_account_number:"EG98765432109876543210987"},{uuid:"emp-103",name:"عمر خالد",photo:"https://i.pravatar.cc/150?img=12",job_number:"IT-003",email:"omar.khaled@company.com",phone:"01234567890",address:"الإسكندرية، مصر",date_of_joining:"2022-03-10",qualification:"بكالوريوس نظم معلومات",marital_status:"single",total_salary:12e3,bank_account_number:"EG55566677788899900011122"}]},{uuid:"dept-2",name:"إدارة الموارد البشرية (HR)",manager:{uuid:"emp-201",name:"منى يوسف",photo:"https://i.pravatar.cc/150?img=9",job_number:"HR-001",email:"mona.youssef@company.com",phone:"01098765432",address:"التجمع الخامس، القاهرة",date_of_joining:"2019-11-01",qualification:"بكالوريوس إدارة أعمال",marital_status:"married",total_salary:22e3,bank_account_number:"EG11122233344455566677788"},employees:[{uuid:"emp-202",name:"حسام حسن",photo:"",job_number:"HR-002",email:"hossam.hassan@company.com",phone:"01155443322",address:"المعادي، القاهرة",date_of_joining:"2023-01-15",qualification:"ليسانس حقوق",marital_status:"single",total_salary:1e4,bank_account_number:"EG33344455566677788899900"}]},{uuid:"dept-3",name:"إدارة التسويق (Marketing)",manager:null,employees:[]}],E=({show:r,handleClose:i,person:a})=>{const l=n.useRef(null),c=k({contentRef:l,documentTitle:a?`الملف الشخصي - ${a.name}`:"الملف الشخصي"});return a?e.jsxs(o,{className:"dir",show:r,onHide:i,size:"lg",centered:!0,dir:"rtl",children:[e.jsxs(o.Header,{className:"d-flex justify-content-between align-items-center",children:[e.jsxs(o.Title,{className:"fs-5 fw-bold",children:[e.jsx(d,{icon:u,className:"ms-2 text-primary"}),"الملف الشخصي: ",a.name]}),e.jsx(x,{className:"custom-close-button cls-btn",variant:"link",onClick:i,children:e.jsx(d,{icon:C,className:"closeModal"})})]}),e.jsx(o.Body,{className:"dir",children:e.jsxs("div",{ref:l,className:"printable-profile-container p-3",children:[e.jsx(S,{}),e.jsxs(h,{className:"align-items-center print-profile-body",children:[e.jsxs(t,{md:4,className:"text-center border-end-md pb-3 pb-md-0",children:[e.jsx("div",{className:"mb-3 position-relative d-inline-block",children:e.jsx(_,{src:a.photo||"https://via.placeholder.com/150",roundedCircle:!0,style:{width:"140px",height:"140px",objectFit:"cover",border:"3px solid var(--border-color, #00897b)",boxShadow:"0 4px 10px rgba(0,0,0,0.1)"},alt:a.name})}),e.jsx("h4",{className:"fw-bold mb-1",children:a.name}),a.job_number&&e.jsxs("span",{className:"badge bg-light text-dark border px-3 py-2 rounded-pill mt-1",children:["الرقم الوظيفي: ",a.job_number]})]}),e.jsxs(t,{md:8,className:"text-end ps-md-4",children:[e.jsxs("div",{className:"profile-section mb-4",children:[e.jsx("h5",{className:"fw-bold text-primary border-bottom pb-2 mb-3",children:"المعلومات الأساسية"}),e.jsxs(h,{className:"g-2",children:[e.jsx(t,{sm:6,children:e.jsxs("p",{className:"mb-2",children:[e.jsx("strong",{className:"",children:"البريد الإلكتروني:"})," ",e.jsx("br",{}),e.jsx("span",{children:a.email||"غير متوفر"})]})}),e.jsx(t,{sm:6,children:e.jsxs("p",{className:"mb-2",children:[e.jsx("strong",{className:"",children:"رقم الهاتف:"})," ",e.jsx("br",{}),e.jsx("span",{children:a.phone||"غير متوفر"})]})}),e.jsx(t,{sm:6,children:e.jsxs("p",{className:"mb-2",children:[e.jsx("strong",{className:"",children:"العنوان:"})," ",e.jsx("br",{}),e.jsx("span",{children:a.address||"غير متوفر"})]})}),e.jsx(t,{sm:6,children:e.jsxs("p",{className:"mb-2",children:[e.jsx("strong",{className:"",children:"تاريخ التعيين:"})," ",e.jsx("br",{}),e.jsx("span",{children:a.date_of_joining||"غير متوفر"})]})}),e.jsx(t,{sm:6,children:e.jsxs("p",{className:"mb-2",children:[e.jsx("strong",{className:"",children:"المؤهل العلمي:"})," ",e.jsx("br",{}),e.jsx("span",{children:a.qualification||"غير متوفر"})]})}),e.jsx(t,{sm:6,children:e.jsxs("p",{className:"mb-2",children:[e.jsx("strong",{className:"",children:"الحالة الاجتماعية:"})," ",e.jsx("br",{}),e.jsx("span",{children:a.marital_status==="single"?"أعزب / عزباء":a.marital_status==="married"?"متزوج / متزوجة":a.marital_status==="divorced"?"مطلق / مطلقة":a.marital_status==="widowed"?"أرمل / أرملة":"غير متوفر"})]})})]})]}),e.jsxs("div",{className:"profile-section",children:[e.jsx("h5",{className:"fw-bold text-primary border-bottom pb-2 mb-3",children:"المعلومات المالية"}),e.jsxs(h,{className:"g-2",children:[e.jsx(t,{sm:6,children:e.jsxs("p",{className:"mb-2",children:[e.jsx("strong",{className:"",children:"إجمالي الراتب:"})," ",e.jsx("br",{}),e.jsx("span",{className:"fw-semibold text-success",children:a.total_salary?`${Number(a.total_salary).toLocaleString()} ج.م`:"غير متوفر"})]})}),e.jsx(t,{sm:6,children:e.jsxs("p",{className:"mb-2",children:[e.jsx("strong",{className:"",children:"رقم الحساب البنكي:"})," ",e.jsx("br",{}),e.jsx("span",{children:a.bank_account_number||"غير متوفر"})]})})]})]})]})]}),e.jsx(P,{})]})}),e.jsxs(o.Footer,{className:"d-flex justify-content-between align-items-center",children:[e.jsxs(x,{variant:"outline-primary",onClick:c,className:"d-flex align-items-center gap-2 px-4",children:[e.jsx(d,{icon:T}),"طباعة الملف"]}),e.jsx(x,{variant:"secondary",onClick:i,className:"px-4",children:"إغلاق"})]})]}):null},j=({person:r,isManager:i=!1,onClick:a})=>e.jsxs("div",{className:`person-card ${i?"manager":""}`,onClick:a,style:{cursor:"pointer"},children:[i&&e.jsxs("div",{className:"role-badge",children:[e.jsx("i",{className:"fa-solid fa-crown"})," مدير"]}),e.jsx("div",{className:"avatar",children:r.photo?e.jsx("img",{src:r.photo,alt:r.name,style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}):e.jsx("i",{className:"fa-solid fa-user"})}),e.jsx("div",{className:"person-name",children:r.name}),e.jsx("div",{className:"person-role",children:i?"مدير قسم":"موظف"})]});function q(){const[r,i]=n.useState(!0),[a,l]=n.useState(!1),[c,m]=n.useState(null),[f,g]=n.useState([]),b=s=>{m(s),l(!0)},N=()=>{l(!1),m(null)},y=()=>{setTimeout(()=>{g(R),i(!1)},500)};return n.useEffect(()=>{y()},[]),r?e.jsx(v,{}):e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        /* ==========================================
   تنسيقات الطباعة المخصصة (Print Styles)
   ========================================== */
@media print {
  /* إخفاء أي عنصر غير مرغوب فيه أثناء الطباعة */
  body * {
    visibility: hidden;
  }

  /* إظهار الحاوية المخصصة للطباعة فقط */
  .printable-profile-container,
  .printable-profile-container * {
    visibility: visible;
  }

  .printable-profile-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 20px !important;
    background-color: #ffffff !important;
    color: #000000 !important;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    direction: rtl;

    /* ترتيب المحتوى عمودي بدل ما العناصر تتراكب فوق بعض */
    display: flex !important;
    flex-direction: column !important;
  }

  /* منع الهيدر والفوتر من إنهم يبقوا fixed/absolute جوه الطباعة */
  .printable-profile-container .theader,
  .printable-profile-container .tfooter {
    position: static !important;
    width: 100% !important;
  }

  .printable-profile-container .theader {
    margin-bottom: 24px !important;
    order: -1;
  }

  .printable-profile-container .tfooter {
    margin-top: 24px !important;
    order: 999;
  }

  /* مسافة أمان أسفل الهيدر قبل بيانات البروفايل */
  .print-profile-body {
    margin-top: 20px !important;
    position: relative !important;
    z-index: 1;
  }

  /* تنسيق الهيدر في الطباعة */
  .print-header {
    display: flex !important;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #00897b;
    padding-bottom: 15px;
    margin-bottom: 25px;
  }

  /* تنسيق بطاقة البيانات */
  .print-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    background-color: #f9f9f9 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* عناوين الأقسام في الورقة المطبوعة */
  .print-section-title {
    font-size: 16px;
    font-weight: bold;
    color: #00897b !important;
    border-bottom: 1px solid #00897b;
    padding-bottom: 5px;
    margin-bottom: 15px;
  }

  /* تنسيق جدول/شبكة التفاصيل */
  .print-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .print-item {
    font-size: 13px;
    line-height: 1.6;
  }

  .print-label {
    font-weight: bold;
    color: #555;
  }

  /* فوتر ورقة الطباعة */
  .print-footer {
    display: block !important;
    margin-top: 40px;
    padding-top: 10px;
    border-top: 1px solid #ccc;
    text-align: center;
    font-size: 11px;
    color: #777;
  }
}
      `}),e.jsxs("div",{className:"org-chart-container",children:[e.jsx(w,{title:"الهيكل التنظيمي للشركة",icon:e.jsx(d,{icon:u})}),e.jsx("div",{className:"departments-wrapper",children:f.map(s=>e.jsxs("div",{className:"department-card",children:[e.jsx("div",{className:"department-header",children:e.jsx("h2",{children:s.name})}),s.manager?e.jsx("div",{className:"manager-section",children:e.jsxs("div",{className:"card-manager-container",children:[e.jsx(j,{person:s.manager,isManager:!0,onClick:()=>b(s.manager)}),s.employees&&s.employees.length>0&&e.jsx("div",{className:"card-manager-pipe"})]})}):e.jsx("p",{style:{textAlign:"center",color:"#a7a7d1",margin:"20px 0"},children:"لا يوجد مدير حالياً"}),e.jsxs("div",{"data-title":"الموظفين",className:"employees-grid-container",children:[e.jsx("div",{className:"employees-pipe"}),e.jsx("div",{className:"employees-grid",children:s.employees&&s.employees.length>0?s.employees.map(p=>e.jsx("div",{className:"employees-card-container",children:e.jsx(j,{person:p,onClick:()=>b(p)})},p.uuid)):e.jsx("p",{style:{color:"#a7a7d1",gridColumn:"1 / -1",textAlign:"center"},children:"لا يوجد موظفين في هذا القسم"})})]})]},s.uuid))}),c&&e.jsx(E,{show:a,handleClose:N,person:c})]})]})}export{q as default};
