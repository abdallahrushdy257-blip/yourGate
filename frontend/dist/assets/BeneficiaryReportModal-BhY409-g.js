import{r as N,a1 as u,ag as t,al as f,an as y}from"./vendor-ui-oBzl4G4Y.js";import{F as n,ak as F,C as w,f as k,b8 as _,g as C,j as D,b7 as E,N as z,B,Y as $}from"./index-CyTpl17W.js";function H({show:b,onHide:o,beneficiaryData:r}){const j=N.useRef(null);if(!r)return null;const e=r.case||{},l=r.details||{},d=r.work_education||l.qualifications||l.work_education||{},h=r.health||l.health||[],x=r.dependants||l.dependants||[],m=l.vouchers||[],i=l.home||l.personalfeesdetails||{},p=l.bankdetails||{},g=()=>{const s=j.current;if(!s)return;const a=document.createElement("div");a.innerHTML=s.innerHTML,a.querySelectorAll("svg, .svg-inline--fa, i").forEach(A=>A.remove());const v=a.innerHTML,c=window.open("","_blank");c.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>ملف دراسة حالة المستفيد - ${e.name||""}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

          @page {
            size: A4 portrait;
            margin: 12mm 14mm 14mm 14mm;
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: 'Tajawal', 'Segoe UI', Tahoma, Arial, sans-serif;
            direction: rtl;
            color: #1a202c;
            background: #ffffff;
            padding: 6px;
            font-size: 11.5px;
            line-height: 1.5;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Top Document Header */
          .doc-header-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #b8860b;
            padding-bottom: 12px;
            margin-bottom: 14px;
          }

          .doc-brand-title {
            font-size: 20px;
            font-weight: 900;
            color: #1a365d;
            margin-bottom: 4px;
            letter-spacing: -0.3px;
          }

          .doc-badge-title {
            display: inline-block;
            background: #f7fafc;
            color: #744210;
            font-size: 12px;
            font-weight: 800;
            padding: 3px 12px;
            border-radius: 4px;
            border-right: 3px solid #b8860b;
            border: 1px solid #e2e8f0;
            border-right-width: 4px;
            border-right-color: #b8860b;
          }

          .doc-meta-table {
            font-size: 11px;
            line-height: 1.7;
            color: #4a5568;
            text-align: left;
          }

          .doc-meta-table strong {
            color: #1a202c;
          }

          /* Beneficiary Highlight Hero */
          .beneficiary-hero-strip {
            display: grid;
            grid-template-columns: 2fr 1.2fr 1.2fr 1fr;
            gap: 10px;
            background: #f8fafc !important;
            border: 1px solid #cbd5e1;
            border-right: 5px solid #1a365d;
            border-radius: 6px;
            padding: 10px 14px;
            margin-bottom: 14px;
          }

          .hero-field {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .hero-label {
            font-size: 10px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
          }

          .hero-value {
            font-size: 13px;
            font-weight: 800;
            color: #0f172a;
          }

          .hero-value.status-tag {
            display: inline-block;
            background: ${e.case_status_string==="مرفوض"?"#fef2f2":"#f0fdf4"} !important;
            color: ${e.case_status_string==="مرفوض"?"#991b1b":"#166534"} !important;
            border: 1px solid ${e.case_status_string==="مرفوض"?"#fecaca":"#bbf7d0"};
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            width: fit-content;
          }

          /* Sections Layout */
          .section {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            margin-bottom: 12px;
            page-break-inside: avoid;
            break-inside: avoid;
            overflow: hidden;
          }

          .section-title {
            background: #f1f5f9;
            color: #1e293b;
            padding: 7px 12px;
            font-size: 12.5px;
            font-weight: 800;
            border-bottom: 1px solid #cbd5e1;
            border-right: 4px solid #b8860b;
            display: flex;
            align-items: center;
          }

          .section-body {
            padding: 10px 14px;
          }

          /* Info Grids */
          .info-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }

          .info-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
            padding: 6px 10px;
          }

          .info-label {
            display: block;
            font-size: 9.5px;
            font-weight: 700;
            color: #64748b;
            margin-bottom: 2px;
          }

          .info-value {
            font-size: 11.5px;
            font-weight: 700;
            color: #0f172a;
            word-break: break-word;
          }

          .full-width {
            grid-column: 1 / -1;
          }

          /* Tables */
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-top: 6px;
          }

          th {
            background: #f1f5f9 !important;
            color: #1e293b;
            font-weight: 800;
            border: 1px solid #cbd5e1;
            padding: 6px 10px;
            text-align: center;
          }

          td {
            border: 1px solid #e2e8f0;
            padding: 6px 10px;
            text-align: center;
            color: #334155;
          }

          tr:nth-child(even) td {
            background-color: #fafafa;
          }

          .badge-danger {
            color: #dc2626;
            font-weight: 800;
          }

          .badge-warning {
            color: #d97706;
            font-weight: 800;
          }

          .no-data {
            text-align: center;
            color: #94a3b8;
            padding: 12px;
            font-size: 11px;
          }

          /* Signatures Block */
          .signatures-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-top: 24px;
            padding-top: 15px;
            border-top: 1.5px dashed #cbd5e1;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .sig-box {
            text-align: center;
            font-size: 11px;
          }

          .sig-role {
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 35px;
          }

          .sig-underline {
            font-size: 10.5px;
            color: #64748b;
            border-top: 1px dotted #94a3b8;
            padding-top: 4px;
            width: 80%;
            margin: 0 auto;
          }

          /* System Resets for Print */
          .report-preview-banner,
          .report-header,
          svg, .svg-inline--fa {
            display: none !important;
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div class="doc-header-card">
          <div>
            <h1 class="doc-brand-title">جمعية بوابة الخير الخيرية</h1>
            <span class="doc-badge-title">ملف التقرير الشامل لدراسة حالة المستفيد</span>
          </div>
          <div class="doc-meta-table">
            <div>رقم الملف: <strong>#{${e.id||"-"}}</strong></div>
            <div>تاريخ الإصدار: <strong>${new Date().toLocaleDateString("ar-EG")}</strong></div>
            <div>نوع الحالة: <strong>${e.humancasetype==="2"?"مستفيد دائم":"مستفيد مؤقت"}</strong></div>
          </div>
        </div>

        <!-- Summary Strip -->
        <div class="beneficiary-hero-strip">
          <div class="hero-field">
            <span class="hero-label">اسم المستفيد الكامل</span>
            <span class="hero-value">${e.name||"-"}</span>
          </div>
          <div class="hero-field">
            <span class="hero-label">رقم الهوية الوطنية / الإقامة</span>
            <span class="hero-value">${e.idnumber||"-"}</span>
          </div>
          <div class="hero-field">
            <span class="hero-label">رقم الجوال</span>
            <span class="hero-value" dir="ltr">${e.phonenum||"-"}</span>
          </div>
          <div class="hero-field">
            <span class="hero-label">قرار الحالة</span>
            <span class="hero-value status-tag">${e.case_status_string||"موافقة"}</span>
          </div>
        </div>

        <!-- Content Body -->
        <div class="document-sections-flow">
          ${v}
        </div>

        <!-- Official Signatures -->
        <div class="signatures-container">
          <div class="sig-box">
            <div class="sig-role">الباحث الاجتماعي المختص</div>
            <div class="sig-underline">التوقيع والاعتماد</div>
          </div>
          <div class="sig-box">
            <div class="sig-role">مدير إدارة خدمات المستفيدين</div>
            <div class="sig-underline">التوقيع والاعتماد</div>
          </div>
          <div class="sig-box">
            <div class="sig-role">الختم الرسمي للجمعية</div>
            <div class="sig-underline">تاريخ المصادقة</div>
          </div>
        </div>
      </body>
      </html>
    `),c.document.close(),c.focus(),setTimeout(()=>{c.print(),c.close()},450)};return u.jsxs(t,{show:b,onHide:o,className:"modal-table beneficiary-report-modal",centered:!0,size:"xl",scrollable:!0,children:[u.jsxs(t.Header,{children:[u.jsxs(t.Title,{children:[u.jsx(n,{icon:F,className:"me-2",style:{color:"#c62828"}}),"تقرير شامل للمستفيد"]}),u.jsx(f,{className:"custom-close-button cls-btn",variant:"link",onClick:o,children:u.jsx(n,{icon:w,className:"closeModal"})})]}),u.jsx(t.Body,{className:"beneficiary-modal-body",style:{direction:"rtl",maxHeight:"75vh",overflowY:"auto",padding:"24px"},children:u.jsxs("div",{ref:j,children:[u.jsx("div",{className:"report-preview-banner",children:u.jsxs("div",{className:"d-flex justify-content-between align-items-center flex-wrap gap-2",children:[u.jsxs("div",{children:[u.jsx("h4",{className:"fw-bold mb-1",style:{color:"#8b6534"},children:"تقرير بيانات ودراسة حالة المستفيد"}),u.jsxs("div",{className:"text-muted",style:{fontSize:"12.5px"},children:["رقم الملف: ",u.jsxs("strong",{children:["#",e.id||"-"]})," | تاريخ الإصدار: ",u.jsx("strong",{children:new Date().toLocaleDateString("ar-EG")})]})]}),u.jsx("div",{children:u.jsx(y,{style:{backgroundColor:e.case_status_string==="مرفوض"?"#c62828":"#2e7d32",fontSize:"12px",padding:"6px 14px",borderRadius:"20px"},children:e.case_status_string||"موافقة"})})]})}),u.jsxs("div",{className:"section",children:[u.jsxs("div",{className:"section-title",children:[u.jsx(n,{icon:k,className:"me-2"}),"البيانات الشخصية والأساسية"]}),u.jsx("div",{className:"section-body",children:u.jsxs("div",{className:"info-grid",children:[u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"اسم المستفيد الكامل"}),u.jsx("span",{className:"info-value",children:e.name||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"النوع (الجنس)"}),u.jsx("span",{className:"info-value",children:e.gender_string||(e.gender==="0"?"ذكر":"أنثى")})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"الحالة الإجتماعية"}),u.jsx("span",{className:"info-value",children:e.social_status_string||e.status_string||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"تاريخ الميلاد"}),u.jsx("span",{className:"info-value",children:e.dateofbirth||e.dob||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"رقم الهوية"}),u.jsx("span",{className:"info-value",children:e.idnumber||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"مصدر الهوية"}),u.jsx("span",{className:"info-value",children:e.idsource||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"تاريخ انتهاء الهوية"}),u.jsx("span",{className:"info-value",children:e.iddate||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"رقم الجوال"}),u.jsx("span",{className:"info-value",dir:"ltr",children:e.phonenum||e.phone||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"البريد الإلكتروني"}),u.jsx("span",{className:"info-value",children:e.email||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"الجنسية"}),u.jsx("span",{className:"info-value",children:e.nationality||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"عدد أفراد الأسرة"}),u.jsx("span",{className:"info-value",children:e.familycount??"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"حالة الملف"}),u.jsx("span",{className:"info-value",children:e.humancasetype==="2"?"مستفيد دائم":"مستفيد مؤقت"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"قرار دراسة الحالة"}),u.jsx("span",{className:"info-value",children:e.case_status_string||"موافقة"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"تاريخ الإنشاء"}),u.jsx("span",{className:"info-value",children:e.created_at?new Date(e.created_at).toLocaleDateString("ar-EG"):"-"})]}),u.jsxs("div",{className:"info-item full-width",children:[u.jsx("span",{className:"info-label",children:"ملاحظات إضافية"}),u.jsx("span",{className:"info-value",children:e.note||"لا توجد ملاحظات"})]})]})})]}),u.jsxs("div",{className:"section",children:[u.jsxs("div",{className:"section-title",children:[u.jsx(n,{icon:_,className:"me-2"}),"البيانات البنكية"]}),u.jsx("div",{className:"section-body",children:u.jsxs("div",{className:"info-grid",children:[u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"اسم البنك"}),u.jsx("span",{className:"info-value",children:p.name||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"الفرع"}),u.jsx("span",{className:"info-value",children:p.branch||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"رقم الـ IBAN / الحساب"}),u.jsx("span",{className:"info-value",dir:"ltr",children:p.iban||e.accnumber||"-"})]})]})})]}),u.jsxs("div",{className:"section",children:[u.jsxs("div",{className:"section-title",children:[u.jsx(n,{icon:C,className:"me-2"}),"المؤهل العلمي والوظيفة"]}),u.jsxs("div",{className:"section-body",children:[u.jsxs("div",{className:"info-grid",children:[u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"المؤهل الدراسي"}),u.jsx("span",{className:"info-value",children:d.educationlevel||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"الوظيفة الحالية"}),u.jsx("span",{className:"info-value",children:d.job||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"القدرة على العمل"}),u.jsx("span",{className:"info-value",children:d.canwork==="0"||d.canwork===0?"لا يستطيع العمل":"نعم يستطيع العمل"})]})]}),Array.isArray(d.incomesource)&&d.incomesource.length>0&&u.jsxs(u.Fragment,{children:[u.jsx("h6",{style:{marginTop:"14px",fontWeight:700,color:"#5c4027",fontSize:"13px"},children:"مصادر الدخل:"}),u.jsxs("table",{children:[u.jsx("thead",{children:u.jsxs("tr",{children:[u.jsx("th",{children:"#"}),u.jsx("th",{children:"مصدر الدخل"}),u.jsx("th",{children:"القيمة الشهرية"})]})}),u.jsx("tbody",{children:d.incomesource.map((s,a)=>u.jsxs("tr",{children:[u.jsx("td",{children:a+1}),u.jsx("td",{children:s.name||s.source||"-"}),u.jsx("td",{children:s.amount?`${s.amount} ريال`:"-"})]},a))})]})]})]})]}),u.jsxs("div",{className:"section",children:[u.jsxs("div",{className:"section-title",children:[u.jsx(n,{icon:D,className:"me-2"}),"بيانات السكن والمصروفات"]}),u.jsx("div",{className:"section-body",children:u.jsxs("div",{className:"info-grid",children:[u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"المدينة / المحافظة"}),u.jsx("span",{className:"info-value",children:i.state||i.city||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"القرية / الحي"}),u.jsx("span",{className:"info-value",children:i.village||i.district||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"العنوان الوطني"}),u.jsx("span",{className:"info-value",children:i.nationalAddress||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"نوع السكن"}),u.jsx("span",{className:"info-value",children:i.homeType||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"ملكية السكن"}),u.jsx("span",{className:"info-value",children:i.homeOwnership||"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"الإيجار الشهري"}),u.jsx("span",{className:"info-value",children:i.rent?`${i.rent} ريال`:"-"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"عدد السيارات"}),u.jsx("span",{className:"info-value",children:i.cars||"0"})]}),u.jsxs("div",{className:"info-item",children:[u.jsx("span",{className:"info-label",children:"أثاث السكن"}),u.jsx("span",{className:"info-value",children:i.furniture||"-"})]})]})})]}),u.jsxs("div",{className:"section",children:[u.jsxs("div",{className:"section-title",children:[u.jsx(n,{icon:E,className:"me-2"}),"البيانات الصحية (",h.length,")"]}),u.jsx("div",{className:"section-body",children:h.length>0?u.jsxs("table",{children:[u.jsx("thead",{children:u.jsxs("tr",{children:[u.jsx("th",{children:"#"}),u.jsx("th",{children:"اسم المرض"}),u.jsx("th",{children:"نوع المرض"}),u.jsx("th",{children:"درجة الخطورة"}),u.jsx("th",{children:"نوع العلاج"}),u.jsx("th",{children:"التكلفة الشهرية"}),u.jsx("th",{children:"ملاحظات"})]})}),u.jsx("tbody",{children:h.map((s,a)=>u.jsxs("tr",{children:[u.jsx("td",{children:a+1}),u.jsx("td",{children:s.disease_name||s.name||"-"}),u.jsx("td",{children:s.disease_type||s.type||"-"}),u.jsx("td",{className:s.disease_degree==="حرجة"?"badge-danger":"badge-warning",children:s.disease_degree||s.degree||"عادية"}),u.jsx("td",{children:s.treatment_type||s.trtype||"-"}),u.jsx("td",{children:s.treatment_cost?`${s.treatment_cost} ريال`:"-"}),u.jsx("td",{children:s.notes||"-"})]},a))})]}):u.jsx("div",{className:"no-data",children:"لا توجد بيانات صحية مسجلة"})})]}),u.jsxs("div",{className:"section",children:[u.jsxs("div",{className:"section-title",children:[u.jsx(n,{icon:z,className:"me-2"}),"بيانات التابعين (",x.length,")"]}),u.jsx("div",{className:"section-body",children:x.length>0?u.jsxs("table",{children:[u.jsx("thead",{children:u.jsxs("tr",{children:[u.jsx("th",{children:"#"}),u.jsx("th",{children:"اسم التابع"}),u.jsx("th",{children:"صلة القرابة"}),u.jsx("th",{children:"النوع"}),u.jsx("th",{children:"تاريخ الميلاد"}),u.jsx("th",{children:"رقم الهوية"}),u.jsx("th",{children:"الجوال"}),u.jsx("th",{children:"الحالة الصحية"})]})}),u.jsx("tbody",{children:x.map((s,a)=>u.jsxs("tr",{children:[u.jsx("td",{children:a+1}),u.jsx("td",{style:{fontWeight:700},children:s.name||"-"}),u.jsx("td",{children:s.relation||"-"}),u.jsx("td",{children:s.gender==="female"||s.gender==="1"?"أنثى":"ذكر"}),u.jsx("td",{children:s.dateofbirth||s.dob||"-"}),u.jsx("td",{children:s.nationalid||s.national_id||"-"}),u.jsx("td",{dir:"ltr",children:s.phone||"-"}),u.jsx("td",{children:s.health||"-"})]},a))})]}):u.jsx("div",{className:"no-data",children:"لا يوجد تابعين مسجلين"})})]}),m.length>0&&u.jsxs("div",{className:"section",children:[u.jsxs("div",{className:"section-title",children:[u.jsx(n,{icon:B,className:"me-2"}),"سندات الصرف (",m.length,")"]}),u.jsx("div",{className:"section-body",children:u.jsxs("table",{children:[u.jsx("thead",{children:u.jsxs("tr",{children:[u.jsx("th",{children:"#"}),u.jsx("th",{children:"المبلغ"}),u.jsx("th",{children:"تاريخ الصرف"}),u.jsx("th",{children:"طريقة الدفع"}),u.jsx("th",{children:"البيان"})]})}),u.jsx("tbody",{children:m.map((s,a)=>u.jsxs("tr",{children:[u.jsx("td",{children:s.id||a+1}),u.jsx("td",{style:{fontWeight:700,color:"#2e7d32"},children:s.amount?`${s.amount} ريال`:"-"}),u.jsx("td",{children:s.date||"-"}),u.jsx("td",{children:s.payment_method==="cash"?"نقداً":s.payment_method||"-"}),u.jsx("td",{children:s.description||"-"})]},a))})]})})]})]})}),u.jsxs(t.Footer,{children:[u.jsx(f,{variant:"secondary",onClick:o,children:"إغلاق"}),u.jsxs(f,{variant:"primary",onClick:g,style:{background:"linear-gradient(135deg, #b89358 0%, #946f36 100%)",border:"none",borderRadius:"10px"},children:[u.jsx(n,{icon:$,className:"me-2"}),"طباعة التقرير"]})]})]})}export{H as B};
