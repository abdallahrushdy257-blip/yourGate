import{r,a1 as u,ah as l,ac as p,ai as x,aj as s,au as y}from"./vendor-ui-CUh85MhK.js";import{T as _,P as v,F as c,ak as b,p as F,S as C}from"./index-RGglJHmn.js";import{Z as w}from"./react-to-print-D3Xpqpq9.js";import{P as k,a as E}from"./PrintFooter-Dn1genTa.js";import"./vendor-docs-D5513Sxe.js";import"./vendor-charts-DyLL0GK1.js";const D=[{uuid:"dept-1",name:"إدارة تكنولوجيا المعلومات (IT)",manager:{uuid:"emp-101",name:"أحمد محمود",photo:"https://i.pravatar.cc/150?img=11",job_number:"IT-001",email:"ahmed.mahmoud@company.com",phone:"01012345678",address:"القاهرة، مصر",date_of_joining:"2020-01-15",qualification:"بكالوريوس حاسبات ومعلومات",marital_status:"married",total_salary:25e3,bank_account_number:"EG12345678901234567890123"},employees:[{uuid:"emp-102",name:"سارة علي",photo:"https://i.pravatar.cc/150?img=5",job_number:"IT-002",email:"sara.ali@company.com",phone:"01123456789",address:"الجيزة، مصر",date_of_joining:"2021-06-01",qualification:"بكالوريوس هندسة حاسبات",marital_status:"single",total_salary:15e3,bank_account_number:"EG98765432109876543210987"},{uuid:"emp-103",name:"عمر خالد",photo:"https://i.pravatar.cc/150?img=12",job_number:"IT-003",email:"omar.khaled@company.com",phone:"01234567890",address:"الإسكندرية، مصر",date_of_joining:"2022-03-10",qualification:"بكالوريوس نظم معلومات",marital_status:"single",total_salary:12e3,bank_account_number:"EG55566677788899900011122"}]},{uuid:"dept-2",name:"إدارة الموارد البشرية (HR)",manager:{uuid:"emp-201",name:"منى يوسف",photo:"https://i.pravatar.cc/150?img=9",job_number:"HR-001",email:"mona.youssef@company.com",phone:"01098765432",address:"التجمع الخامس، القاهرة",date_of_joining:"2019-11-01",qualification:"بكالوريوس إدارة أعمال",marital_status:"married",total_salary:22e3,bank_account_number:"EG11122233344455566677788"},employees:[{uuid:"emp-202",name:"حسام حسن",photo:"",job_number:"HR-002",email:"hossam.hassan@company.com",phone:"01155443322",address:"المعادي، القاهرة",date_of_joining:"2023-01-15",qualification:"ليسانس حقوق",marital_status:"single",total_salary:1e4,bank_account_number:"EG33344455566677788899900"}]},{uuid:"dept-3",name:"إدارة التسويق (Marketing)",manager:null,employees:[]}],P=({show:i,handleClose:t,person:e})=>{const n=r.useRef(null),o=w({contentRef:n,documentTitle:e?`الملف الشخصي - ${e.name}`:"الملف الشخصي"});return e?u.jsxs(l,{className:"dir",show:i,onHide:t,size:"lg",centered:!0,dir:"rtl",children:[u.jsxs(l.Header,{className:"d-flex justify-content-between align-items-center",children:[u.jsxs(l.Title,{className:"fs-5 fw-bold",children:[u.jsx(c,{icon:b,className:"ms-2 text-primary"}),"الملف الشخصي: ",e.name]}),u.jsx(p,{className:"custom-close-button cls-btn",variant:"link",onClick:t,children:u.jsx(c,{icon:F,className:"closeModal"})})]}),u.jsx(l.Body,{className:"dir",children:u.jsxs("div",{ref:n,className:"printable-profile-container p-3",children:[u.jsx(k,{}),u.jsxs(x,{className:"align-items-center print-profile-body",children:[u.jsxs(s,{md:4,className:"text-center border-end-md pb-3 pb-md-0",children:[u.jsx("div",{className:"mb-3 position-relative d-inline-block",children:u.jsx(y,{src:e.photo||"https://via.placeholder.com/150",roundedCircle:!0,style:{width:"140px",height:"140px",objectFit:"cover",border:"3px solid var(--border-color, #00897b)",boxShadow:"0 4px 10px rgba(0,0,0,0.1)"},alt:e.name})}),u.jsx("h4",{className:"fw-bold mb-1",children:e.name}),e.job_number&&u.jsxs("span",{className:"badge bg-light text-dark border px-3 py-2 rounded-pill mt-1",children:["الرقم الوظيفي: ",e.job_number]})]}),u.jsxs(s,{md:8,className:"text-end ps-md-4",children:[u.jsxs("div",{className:"profile-section mb-4",children:[u.jsx("h5",{className:"fw-bold text-primary border-bottom pb-2 mb-3",children:"المعلومات الأساسية"}),u.jsxs(x,{className:"g-2",children:[u.jsx(s,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"",children:"البريد الإلكتروني:"})," ",u.jsx("br",{}),u.jsx("span",{children:e.email||"غير متوفر"})]})}),u.jsx(s,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"",children:"رقم الهاتف:"})," ",u.jsx("br",{}),u.jsx("span",{children:e.phone||"غير متوفر"})]})}),u.jsx(s,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"",children:"العنوان:"})," ",u.jsx("br",{}),u.jsx("span",{children:e.address||"غير متوفر"})]})}),u.jsx(s,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"",children:"تاريخ التعيين:"})," ",u.jsx("br",{}),u.jsx("span",{children:e.date_of_joining||"غير متوفر"})]})}),u.jsx(s,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"",children:"المؤهل العلمي:"})," ",u.jsx("br",{}),u.jsx("span",{children:e.qualification||"غير متوفر"})]})}),u.jsx(s,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"",children:"الحالة الاجتماعية:"})," ",u.jsx("br",{}),u.jsx("span",{children:e.marital_status==="single"?"أعزب / عزباء":e.marital_status==="married"?"متزوج / متزوجة":e.marital_status==="divorced"?"مطلق / مطلقة":e.marital_status==="widowed"?"أرمل / أرملة":"غير متوفر"})]})})]})]}),u.jsxs("div",{className:"profile-section",children:[u.jsx("h5",{className:"fw-bold text-primary border-bottom pb-2 mb-3",children:"المعلومات المالية"}),u.jsxs(x,{className:"g-2",children:[u.jsx(s,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"",children:"إجمالي الراتب:"})," ",u.jsx("br",{}),u.jsx("span",{className:"fw-semibold text-success",children:e.total_salary?`${Number(e.total_salary).toLocaleString()} ج.م`:"غير متوفر"})]})}),u.jsx(s,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"",children:"رقم الحساب البنكي:"})," ",u.jsx("br",{}),u.jsx("span",{children:e.bank_account_number||"غير متوفر"})]})})]})]})]})]}),u.jsx(E,{})]})}),u.jsxs(l.Footer,{className:"d-flex justify-content-between align-items-center",children:[u.jsxs(p,{variant:"outline-primary",onClick:o,className:"d-flex align-items-center gap-2 px-4",children:[u.jsx(c,{icon:C}),"طباعة الملف"]}),u.jsx(p,{variant:"secondary",onClick:t,className:"px-4",children:"إغلاق"})]})]}):null},A=({person:i,isManager:t=!1,onClick:e})=>u.jsxs("div",{className:`person-card ${t?"manager":""}`,onClick:e,style:{cursor:"pointer"},children:[t&&u.jsxs("div",{className:"role-badge",children:[u.jsx("i",{className:"fa-solid fa-crown"})," مدير"]}),u.jsx("div",{className:"avatar",children:i.photo?u.jsx("img",{src:i.photo,alt:i.name,style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}):u.jsx("i",{className:"fa-solid fa-user"})}),u.jsx("div",{className:"person-name",children:i.name}),u.jsx("div",{className:"person-role",children:t?"مدير قسم":"موظف"})]});function z(){const[i,t]=r.useState(!0),[e,n]=r.useState(!1),[o,d]=r.useState(null),[j,f]=r.useState([]),h=a=>{d(a),n(!0)},g=()=>{n(!1),d(null)},N=()=>{setTimeout(()=>{f(D),t(!1)},500)};return r.useEffect(()=>{N()},[]),i?u.jsx(_,{}):u.jsxs(u.Fragment,{children:[u.jsx("style",{children:`
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
      `}),u.jsxs("div",{className:"org-chart-container",children:[u.jsx(v,{title:"الهيكل التنظيمي للشركة",icon:u.jsx(c,{icon:b})}),u.jsx("div",{className:"departments-wrapper",children:j.map(a=>u.jsxs("div",{className:"department-card",children:[u.jsx("div",{className:"department-header",children:u.jsx("h2",{children:a.name})}),a.manager?u.jsx("div",{className:"manager-section",children:u.jsxs("div",{className:"card-manager-container",children:[u.jsx(A,{person:a.manager,isManager:!0,onClick:()=>h(a.manager)}),a.employees&&a.employees.length>0&&u.jsx("div",{className:"card-manager-pipe"})]})}):u.jsx("p",{style:{textAlign:"center",color:"#a7a7d1",margin:"20px 0"},children:"لا يوجد مدير حالياً"}),u.jsxs("div",{"data-title":"الموظفين",className:"employees-grid-container",children:[u.jsx("div",{className:"employees-pipe"}),u.jsx("div",{className:"employees-grid",children:a.employees&&a.employees.length>0?a.employees.map(m=>u.jsx("div",{className:"employees-card-container",children:u.jsx(A,{person:m,onClick:()=>h(m)})},m.uuid)):u.jsx("p",{style:{color:"#a7a7d1",gridColumn:"1 / -1",textAlign:"center"},children:"لا يوجد موظفين في هذا القسم"})})]})]},a.uuid))}),o&&u.jsx(P,{show:e,handleClose:g,person:o})]})]})}export{z as default};
