import{r as i,a1 as e,au as y,aw as A,as as j,at as c,aF as p,a9 as E}from"./vendor-ui-BntanN4V.js";import{d as I,u as z,H as M,F as l,W as T,E as H,bt as v,R as N,bn as P,bu as L,Y as U,aw as W,A as w}from"./index-CRgigqaL.js";import"./vendor-charts-CFIezg6S.js";import"./vendor-docs-CFX8IUqo.js";function G(){const{id:b}=I(),[a,d]=i.useState([]),[h,m]=i.useState([]),[k,C]=i.useState(!0),[u,R]=i.useState(""),g=z(),[S,x]=i.useState(!1),F=async()=>{try{const t=await w.get(`/minutesheets/${b}`);t.status===200&&(d(t.data),C(!1))}catch(t){console.error(t),t.response&&t.response.data.errors&&m(t.response.data.errors)}};i.useEffect(()=>{F()},[]);const D=t=>{if(!t)return"";if(t.includes("-")&&t.split("-")[0].length===4)return t;const[n,o,s]=t.split("-");return!n||!o||!s?t:`${s}-${o}-${n}`},f=t=>{t&&t.preventDefault();const n=new Date().toISOString().split("T")[0],o=D(a.date);if(o&&o<n){m({date:"تاريخ المحضر لا يمكن أن يكون في الماضي"});return}x(!0);const s=new FormData;s.append("title",a.title),s.append("date",a.date),s.append("note",a.note),s.append("paper",u),s.append("id",b);try{w.post("/minutesheets/update",s,{headers:{"Content-Type":"multipart/form-data"}}).then(r=>{r.status===200&&g("/addMinutesReport")}).catch(r=>{console.error(r),x(!1),r.response&&r.response.data.errors&&m(r.response.data.errors)})}catch(r){console.error(r),x(!1)}},$=t=>{if(!t)return"";const n=t.split("-");if(n.length!==3)return"";const[o,s,r]=n;return`${r}-${s}-${o}`};return k?e.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{minHeight:"400px"},children:e.jsx(y,{animation:"grow",variant:"primary"})}):e.jsxs(A,{className:"py-5",style:{direction:"rtl"},children:[e.jsxs("div",{className:"mb-4 text-center",children:[e.jsx(M,{title:"تعديل محضر اجتماع",icon:e.jsx(l,{icon:T,className:"text-primary-gold"})}),e.jsx("p",{style:{color:"var(--text-color)"},className:"mt-2",children:"تحديث بيانات المحضر والمستندات المرفقة"})]}),e.jsx(j,{className:"justify-content-center",children:e.jsx(c,{lg:10,children:e.jsxs(p,{className:"luxury-card border-0 shadow-sm overflow-hidden",style:{background:"var(--card--background)",borderRadius:"20px"},children:[e.jsx(p.Header,{className:"bg-transparent border-0 pt-4 px-4",children:e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("div",{className:"icon-badge ms-3",children:e.jsx(l,{icon:H,style:{color:"#c5a059"}})}),e.jsx("h5",{className:"mb-0",style:{fontWeight:"700",color:"var(--text-color)"},children:"تفاصيل المحضر"})]})}),e.jsx(p.Body,{className:"p-4 p-md-5",children:e.jsxs(E,{onSubmit:f,children:[e.jsxs(j,{className:"g-4",children:[e.jsx(c,{md:6,children:e.jsxs("div",{className:"input-group-custom",children:[e.jsxs("label",{className:"form-label d-flex align-items-center",style:{color:"var(--text-color)"},children:[e.jsx(l,{icon:v,className:"ms-2 opacity-50"}),"عنوان المحضر"]}),e.jsx(N,{parentStyle:{width:"100%"},id:"address",type:"text",stylee:{width:"100%",borderRadius:"12px"},value:a.title||"",onChange:t=>d({...a,title:t.target.value}),placeholder:"أدخل عنوان المحضر..."})]})}),e.jsx(c,{md:6,children:e.jsxs("div",{className:"input-group-custom",children:[e.jsxs("label",{className:"form-label d-flex align-items-center",style:{color:"var(--text-color)"},children:[e.jsx(l,{icon:P,className:"ms-2 opacity-50"}),"تاريخ المحضر"]}),e.jsx("input",{type:"date",id:"date",className:"form-control custom-datepicker",style:{borderRadius:"12px",padding:"12px",border:"1px solid var(--border-color)",background:"var(--input-background, transparent)",color:"var(--text-color)"},onChange:t=>d({...a,date:t.target.value}),value:$(a.date)}),h.date&&e.jsx("p",{className:"error text-danger small mt-2",children:h.date})]})}),e.jsx(c,{md:12,children:e.jsxs("div",{className:"input-group-custom",children:[e.jsxs("label",{className:"form-label d-flex align-items-center",style:{color:"var(--text-color)"},children:[e.jsx(l,{icon:v,className:"ms-2 opacity-50"}),"ملاحظات إضافية"]}),e.jsx(N,{parentStyle:{width:"100%"},id:"notes",type:"text",stylee:{width:"100%",borderRadius:"12px"},value:a.note||"",onChange:t=>d({...a,note:t.target.value}),placeholder:"أدخل أي ملاحظات إضافية هنا..."})]})}),e.jsx(c,{md:12,children:e.jsx("div",{className:"upload-section p-4 rounded-4",style:{border:"2px dashed var(--border-color)",background:"rgba(197, 160, 89, 0.05)"},children:e.jsxs("div",{className:"d-flex flex-column align-items-center",children:[e.jsx("div",{className:"mb-3",children:e.jsx(l,{icon:L,size:"2x",style:{color:"#c5a059"}})}),e.jsx(U,{id:"paper",parentStyle:{width:"100%",textAlign:"center"},label:"تحديث المستندات المرفقة (اختياري)",onChange:t=>R(t.target.files[0])}),u&&e.jsxs("p",{className:"mt-2 text-success small",children:["تم اختيار: ",u.name]})]})})})]}),e.jsxs("div",{className:"mt-5 d-flex justify-content-center",children:[S?e.jsxs("button",{className:"luxury-submit-btn disabled",disabled:!0,children:[e.jsx(y,{animation:"border",size:"sm",className:"me-2"}),"جاري الحفظ..."]}):e.jsxs("button",{style:{marginLeft:"8px"},type:"button",className:"luxury-submit-btn",onClick:f,children:[e.jsx(l,{icon:W,className:"ms-2"}),"حفظ التعديلات"]}),e.jsx("button",{type:"button",className:"luxury-cancel-btn ms-3",onClick:()=>g("/addMinutesReport"),children:"إلغاء"})]})]})})]})})}),e.jsx("style",{children:`
                .text-primary-gold {
                    color: #c5a059 !important;
                }
                .icon-badge {
                    width: 40px;
                    height: 40px;
                    background: rgba(197, 160, 89, 0.15);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .luxury-card {
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05) !important;
                }
                .input-group-custom .form-label {
                    font-weight: 600;
                    font-size: 0.9rem;
                    margin-bottom: 10px;
                }
                .luxury-submit-btn {
                    background: linear-gradient(135deg, #1a5c4d 0%, #2e8b57 100%);
                    color: white;
                    border: none;
                    padding: 12px 40px;
                    border-radius: 12px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(26, 92, 77, 0.2);
                    display: flex;
                    align-items: center;
                }
                .luxury-submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(26, 92, 77, 0.3);
                }
                .luxury-cancel-btn {
                    background: transparent;
                    color: #6c757d;
                    border: 1px solid var(--border-color);
                    padding: 12px 40px;
                    border-radius: 12px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                .luxury-cancel-btn:hover {
                    background: rgba(0,0,0,0.05);
                    color: #343a40;
                }
                .custom-datepicker:focus {
                    border-color: #c5a059;
                    box-shadow: 0 0 0 0.2rem rgba(197, 160, 89, 0.25);
                    outline: none;
                }
            `})]})}export{G as default};
