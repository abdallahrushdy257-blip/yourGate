import{r as m,$ as u,a8 as p,an as f,aq as h,ar as t,ax as k}from"./vendor-ui-CFXWyGvy.js";import{T as C}from"./title-CGmus1v7.js";import{aU as A,aV as F,aW as _,a as z,O as S,A as $}from"./index-BEpCPwJu.js";import{F as n}from"./index.es-oQsFxonT.js";import{c as D,a as E,y as N}from"./index-D-Y14evi.js";import{P,a as T}from"./PrintFooter-OWhdKL2Z.js";import{t as j}from"./toLocal-OUblUQkk.js";import"./vendor-helpers-D-Es2Tlf.js";import"./logo-light-DfYyM67-.js";const q=({show:e,handleClose:i,person:a})=>{const c=m.useRef(null),d=()=>{if(!a)return;const r=a.gender==="1"?"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",b=a.photo||r,l=window.open("","_blank");if(!l){N.error("يرجى السماح بالنوافذ المنبثقة للطباعة");return}l.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>الملف الوظيفي - ${a.name||""}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

          @page {
            size: A4 portrait;
            margin: 15mm 18mm 15mm 18mm;
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: 'Tajawal', 'Segoe UI', Tahoma, Arial, sans-serif;
            direction: rtl;
            color: #2b251f;
            background: #ffffff;
            font-size: 13px;
            line-height: 1.6;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Header Card */
          .doc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2.5px solid #c29a64;
            padding-bottom: 14px;
            margin-bottom: 20px;
          }

          .org-title {
            font-size: 20px;
            font-weight: 900;
            color: #8b6534;
            margin-bottom: 4px;
          }

          .doc-badge {
            display: inline-block;
            background: #fdfaf6;
            color: #8b6534;
            font-size: 13px;
            font-weight: 800;
            padding: 3px 12px;
            border-radius: 4px;
            border: 1px solid #e8dbc8;
            border-right: 4px solid #c29a64;
          }

          .doc-meta {
            font-size: 11.5px;
            color: #555;
            text-align: left;
            line-height: 1.8;
          }

          .doc-meta strong {
            color: #222;
          }

          /* Profile Hero Card */
          .profile-hero {
            display: flex;
            align-items: center;
            gap: 22px;
            background: #fdfbf8;
            border: 1.5px solid #ebdcc8;
            border-right: 5px solid #c29a64;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 22px;
          }

          .profile-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #c29a64;
            box-shadow: 0 4px 10px rgba(194, 154, 100, 0.25);
            flex-shrink: 0;
          }

          .hero-info h2 {
            font-size: 19px;
            font-weight: 800;
            color: #382f22;
            margin-bottom: 4px;
          }

          .hero-role {
            font-size: 14px;
            color: #8b6534;
            font-weight: 700;
            margin-bottom: 6px;
          }

          .hero-badge {
            display: inline-block;
            background: rgba(194, 154, 100, 0.15);
            color: #7d5926;
            font-size: 11.5px;
            font-weight: 700;
            padding: 2px 10px;
            border-radius: 20px;
            border: 1px solid rgba(194, 154, 100, 0.3);
          }

          /* Sections */
          .section-card {
            border: 1px solid #e6dace;
            border-radius: 10px;
            margin-bottom: 18px;
            overflow: hidden;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .section-header {
            background: #fbf7f0;
            color: #493d2c;
            padding: 9px 16px;
            font-size: 13.5px;
            font-weight: 800;
            border-bottom: 1px solid #e6dace;
            border-right: 4px solid #c29a64;
          }

          .section-body {
            padding: 14px 16px;
          }

          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px 18px;
          }

          .info-item {
            background: #fcfbfa;
            border: 1px solid #f0e6da;
            border-radius: 6px;
            padding: 8px 12px;
          }

          .info-label {
            display: block;
            font-size: 11px;
            color: #7a6e5d;
            font-weight: 700;
            margin-bottom: 2px;
          }

          .info-value {
            font-size: 13px;
            font-weight: 700;
            color: #2b251f;
          }

          .salary-value {
            color: #1e7e34;
            font-size: 14px;
          }

          /* Signatures Footer */
          .signatures-row {
            display: flex;
            justify-content: space-between;
            margin-top: 35px;
            padding-top: 18px;
            border-top: 1.5px dashed #d9cbba;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .sig-box {
            text-align: center;
            width: 30%;
          }

          .sig-title {
            font-weight: 800;
            color: #382f22;
            margin-bottom: 45px;
            font-size: 12.5px;
          }

          .sig-line {
            border-top: 1px dotted #8b7d6b;
            padding-top: 4px;
            font-size: 11px;
            color: #776a58;
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div class="doc-header">
          <div>
            <div class="org-title">جمعية بوابة الخير الأهلية</div>
            <span class="doc-badge">بطاقة الملف الوظيفي والشخصي</span>
          </div>
          <div class="doc-meta">
            <div>الرقم الوظيفي: <strong>${a.job_number||"غير محدد"}</strong></div>
            <div>تاريخ الطباعة: <strong>${new Date().toLocaleDateString("ar-SA")}</strong></div>
            <div>القسم / الإدارة: <strong>${a.department||"الموارد البشرية"}</strong></div>
          </div>
        </div>

        <!-- Profile Hero -->
        <div class="profile-hero">
          <img src="${b}" class="profile-avatar" alt="${a.name}" onerror="this.src='${r}'" />
          <div class="hero-info">
            <h2>${a.name||"غير محدد"}</h2>
            <div class="hero-role">${a.job_title||"موظف"}</div>
            ${a.job_number?`<span class="hero-badge">الرقم الوظيفي: ${a.job_number}</span>`:""}
          </div>
        </div>

        <!-- Basic Info Section -->
        <div class="section-card">
          <div class="section-header">المعلومات الشخصية والوظيفية الأساسية</div>
          <div class="section-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">البريد الإلكتروني</span>
                <span class="info-value">${a.email||"غير متوفر"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">رقم الهاتف</span>
                <span class="info-value" dir="ltr">${a.phone||"غير متوفر"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">العنوان الوطني / السكن</span>
                <span class="info-value">${a.address||"غير متوفر"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">تاريخ التعيين</span>
                <span class="info-value">${a.date_of_joining||"غير متوفر"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">المؤهل العلمي</span>
                <span class="info-value">${a.qualification||"غير متوفر"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">الحالة الاجتماعية</span>
                <span class="info-value">
                  ${a.marital_status==="single"||a.marital_status==="0"?"أعزب / عزباء":a.marital_status==="married"||a.marital_status==="1"?"متزوج / متزوجة":"غير متوفر"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Info Section -->
        <div class="section-card">
          <div class="section-header">المعلومات المالية والبنكية</div>
          <div class="section-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">إجمالي الراتب الشهري</span>
                <span class="info-value salary-value">
                  ${a.total_salary?`${j(a.total_salary)} ر.س`:"غير متوفر"}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">رقم الحساب البنكي (IBAN)</span>
                <span class="info-value" style="font-family: monospace;">${a.bank_account_number||"غير متوفر"}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Official Signatures -->
        <div class="signatures-row">
          <div class="sig-box">
            <div class="sig-title">الموظف المعني</div>
            <div class="sig-line">التوقيع / المصادقة</div>
          </div>
          <div class="sig-box">
            <div class="sig-title">مدير إدارة الموارد البشرية</div>
            <div class="sig-line">الاعتماد والتاريخ</div>
          </div>
          <div class="sig-box">
            <div class="sig-title">الختم الرسمي للجمعية</div>
            <div class="sig-line">المصادقة الرسمية</div>
          </div>
        </div>
      </body>
      </html>
    `),l.document.close(),l.focus(),setTimeout(()=>{l.print(),l.close()},400)};if(!a)return null;const x=a.gender==="1"?"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";return u.jsxs(p,{className:"dir profile-modal-custom",show:e,onHide:i,size:"lg",centered:!0,dir:"rtl",children:[u.jsxs(p.Header,{className:"d-flex justify-content-between align-items-center",style:{borderBottom:"1.5px solid rgba(194, 154, 100, 0.25)"},children:[u.jsxs(p.Title,{className:"fs-5 fw-bold d-flex align-items-center gap-2",style:{color:"var(--text-color, #493d2c)"},children:[u.jsx(n,{icon:A,style:{color:"#c29a64"}}),u.jsxs("span",{children:["الملف الوظيفي والشخصي: ",a.name]})]}),u.jsx(f,{className:"custom-close-button cls-btn",variant:"link",onClick:i,children:u.jsx(n,{icon:S,className:"closeModal"})})]}),u.jsx(p.Body,{className:"dir p-4",children:u.jsxs("div",{ref:c,className:"printable-profile-container p-3",children:[u.jsx(P,{}),u.jsxs(h,{className:"align-items-center print-profile-body",children:[u.jsxs(t,{md:4,className:"text-center border-end-md pb-3 pb-md-0",children:[u.jsx("div",{className:"mb-3 position-relative d-inline-block",children:u.jsx(k,{src:a.photo||x,roundedCircle:!0,style:{width:"140px",height:"140px",objectFit:"cover",border:"3px solid #c29a64",boxShadow:"0 4px 14px rgba(168, 126, 69, 0.25)"},alt:a.name,onError:r=>{r.target.onerror=null,r.target.src=x}})}),u.jsx("h4",{className:"fw-bold mb-1",style:{color:"var(--text-color, #493d2c)"},children:a.name}),u.jsx("p",{className:"text-muted small mb-2",children:a.job_title||"موظف"}),a.job_number&&u.jsxs("span",{className:"badge px-3 py-2 rounded-pill",style:{background:"rgba(194, 154, 100, 0.15)",color:"#875f28",fontSize:"12px"},children:["الرقم الوظيفي: ",a.job_number]})]}),u.jsxs(t,{md:8,className:"text-end ps-md-4",children:[u.jsxs("div",{className:"profile-section mb-4",children:[u.jsx("h5",{className:"fw-bold border-bottom pb-2 mb-3",style:{color:"var(--text-color, #493d2c)",borderColor:"rgba(194, 154, 100, 0.25)"},children:"المعلومات الأساسية"}),u.jsxs(h,{className:"g-2",children:[u.jsx(t,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"text-muted small d-block",children:"البريد الإلكتروني:"}),u.jsx("span",{children:a.email||"غير متوفر"})]})}),u.jsx(t,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"text-muted small d-block",children:"رقم الهاتف:"}),u.jsx("span",{dir:"ltr",children:a.phone||"غير متوفر"})]})}),u.jsx(t,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"text-muted small d-block",children:"العنوان:"}),u.jsx("span",{children:a.address||"غير متوفر"})]})}),u.jsx(t,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"text-muted small d-block",children:"تاريخ التعيين:"}),u.jsx("span",{children:a.date_of_joining||"غير متوفر"})]})}),u.jsx(t,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"text-muted small d-block",children:"المؤهل العلمي:"}),u.jsx("span",{children:a.qualification||"غير متوفر"})]})}),u.jsx(t,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"text-muted small d-block",children:"الحالة الاجتماعية:"}),u.jsx("span",{children:a.marital_status==="single"||a.marital_status==="0"?"أعزب / عزباء":a.marital_status==="married"||a.marital_status==="1"?"متزوج / متزوجة":"غير متوفر"})]})})]})]}),u.jsxs("div",{className:"profile-section",children:[u.jsx("h5",{className:"fw-bold border-bottom pb-2 mb-3",style:{color:"var(--text-color, #493d2c)",borderColor:"rgba(194, 154, 100, 0.25)"},children:"المعلومات المالية"}),u.jsxs(h,{className:"g-2",children:[u.jsx(t,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"text-muted small d-block",children:"إجمالي الراتب:"}),u.jsx("span",{className:"fw-bold text-success fs-6",children:a.total_salary?`${j(a.total_salary)} ر.س`:"غير متوفر"})]})}),u.jsx(t,{sm:6,children:u.jsxs("p",{className:"mb-2",children:[u.jsx("strong",{className:"text-muted small d-block",children:"رقم الحساب البنكي (IBAN):"}),u.jsx("span",{className:"font-monospace small",children:a.bank_account_number||"غير متوفر"})]})})]})]})]})]}),u.jsx(T,{})]})}),u.jsxs(p.Footer,{className:"d-flex justify-content-between align-items-center",children:[u.jsxs(f,{onClick:d,className:"d-flex align-items-center gap-2 px-4 rounded-pill",style:{background:"linear-gradient(135deg, #c29a64 0%, #a87e45 100%)",color:"#fff",border:"none",fontWeight:700,fontSize:"14px",boxShadow:"0 4px 12px rgba(168, 126, 69, 0.3)"},children:[u.jsx(n,{icon:$}),"طباعة الملف"]}),u.jsx(f,{variant:"outline-secondary",onClick:i,className:"px-4 rounded-pill",children:"إغلاق"})]})]})},y=({person:e,isManager:i=!1,onClick:a})=>{const c=e.gender==="1"?"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";return u.jsxs("div",{className:`person-card ${i?"manager":""}`,onClick:a,style:{cursor:"pointer"},children:[i&&u.jsxs("div",{className:"role-badge",children:[u.jsx(n,{icon:_})," مدير القسم"]}),u.jsx("div",{className:"avatar",children:e.photo?u.jsx("img",{src:e.photo,alt:e.name,onError:d=>{d.target.onerror=null,d.target.src=c},style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}):u.jsx(n,{icon:z})}),u.jsx("div",{className:"person-name",children:e.name}),u.jsx("div",{className:"person-role",children:i?"مدير قسم":e.job_title||"موظف"})]})};function V(){const[e,i]=m.useState(!0),[a,c]=m.useState(!1),[d,x]=m.useState(null),[r,b]=m.useState([]),l=s=>{x(s),c(!0)},w=()=>{c(!1),x(null)},g=async()=>{var s;try{i(!0);const o=await E.get("/organizational-chart"),v=((s=o.data)==null?void 0:s.data)||o.data||[];b(Array.isArray(v)?v:[])}catch(o){console.error("Error loading organizational chart:",o),N.error("فشل في تحميل بيانات الهيكل التنظيمي"),b([])}finally{i(!1)}};return m.useEffect(()=>{g()},[]),e?u.jsx(D,{}):u.jsx(u.Fragment,{children:u.jsxs("div",{className:"org-chart-container",children:[u.jsxs("div",{className:"d-flex justify-content-between align-items-center w-100 max-w-1200 px-3",children:[u.jsx(C,{title:"الهيكل التنظيمي للشركة",icon:u.jsx(n,{icon:A}),style:{width:"unset"}}),u.jsxs("button",{type:"button",onClick:g,className:"btn rounded-pill d-flex align-items-center gap-2 px-3 py-2",style:{background:"var(--surface-color, #fff)",border:"1.5px solid rgba(194, 154, 100, 0.4)",color:"var(--text-color, #493d2c)",fontWeight:600,fontSize:"14px",boxShadow:"0 2px 6px rgba(0,0,0,0.04)"},children:[u.jsx(n,{icon:F}),u.jsx("span",{children:"تحديث الهيكل"})]})]}),u.jsx("div",{className:"departments-wrapper",children:r.length===0?u.jsxs("div",{className:"text-center py-5 w-100",children:[u.jsx(n,{icon:A,style:{fontSize:"3rem",color:"#c29a64",opacity:.4},className:"mb-3"}),u.jsx("h5",{className:"fw-bold",style:{color:"var(--text-color, #493d2c)"},children:"لا توجد أقسام مسجلة حالياً"}),u.jsx("p",{className:"text-muted small",children:"يرجى إضافة أقسام وتعيين موظفين لتظهر في الهيكل التنظيمي."})]}):r.map(s=>u.jsxs("div",{className:"department-card",children:[u.jsxs("div",{className:"department-header",children:[u.jsx("h2",{children:s.name}),s.description&&u.jsx("p",{className:"text-muted small mt-1 mb-0",children:s.description})]}),s.manager?u.jsx("div",{className:"manager-section",children:u.jsxs("div",{className:"card-manager-container",children:[u.jsx(y,{person:s.manager,isManager:!0,onClick:()=>l(s.manager)}),s.employees&&s.employees.length>0&&u.jsx("div",{className:"card-manager-pipe"})]})}):u.jsx("div",{className:"text-center my-4 py-2 px-3 rounded-pill d-inline-block",style:{background:"rgba(194, 154, 100, 0.1)",color:"#875f28",margin:"20px auto"},children:"لا يوجد مدير معيّن لهذا القسم"}),u.jsxs("div",{"data-title":"الموظفون",className:"employees-grid-container",children:[u.jsx("div",{className:"employees-pipe"}),u.jsx("div",{className:"employees-grid",children:s.employees&&s.employees.length>0?s.employees.map(o=>u.jsx("div",{className:"employees-card-container",children:u.jsx(y,{person:o,onClick:()=>l(o)})},o.uuid||o.id)):u.jsx("p",{style:{color:"#8a7e6b",gridColumn:"1 / -1",textAlign:"center",margin:"15px 0",fontSize:"14px"},children:"لا يوجد موظفون إضافيون في هذا القسم"})})]})]},s.uuid||s.id))}),d&&u.jsx(q,{show:a,handleClose:w,person:d})]})})}export{V as default};
