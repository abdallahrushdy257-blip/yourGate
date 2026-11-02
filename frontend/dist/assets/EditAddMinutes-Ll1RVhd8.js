import{r as l,a1 as e,ab as y,a9 as S,ai as j,aj as i,av as x,aa as $}from"./vendor-ui-CUh85MhK.js";import{u as I,l as z,P as M,F as n,Y as P,i as T,b8 as A,b9 as B,ba as U,c as H,A as v}from"./index-CwjJjhuQ.js";import{R as N}from"./RegisterTextBox-PoPYMLTo.js";import{U as L}from"./UploadInput-DLNfKF2e.js";import"./vendor-docs-D5513Sxe.js";import"./vendor-charts-DyLL0GK1.js";function K(){const{id:b}=I(),[s,c]=l.useState([]),[h,d]=l.useState([]),[w,D]=l.useState(!0),[m,F]=l.useState(""),g=z(),[k,p]=l.useState(!1),C=async()=>{try{const u=await v.get(`/minutesheets/${b}`);u.status===200&&(c(u.data),D(!1))}catch(u){console.error(u),u.response&&u.response.data.errors&&d(u.response.data.errors)}};l.useEffect(()=>{C()},[]);const E=u=>{if(!u)return"";if(u.includes("-")&&u.split("-")[0].length===4)return u;const[r,o,t]=u.split("-");return!r||!o||!t?u:`${t}-${o}-${r}`},f=u=>{u&&u.preventDefault();const r=new Date().toISOString().split("T")[0],o=E(s.date);if(o&&o<r){d({date:"تاريخ المحضر لا يمكن أن يكون في الماضي"});return}p(!0);const t=new FormData;t.append("title",s.title),t.append("date",s.date),t.append("note",s.note),t.append("paper",m),t.append("id",b);try{v.post("/minutesheets/update",t,{headers:{"Content-Type":"multipart/form-data"}}).then(a=>{a.status===200&&g("/addMinutesReport")}).catch(a=>{console.error(a),p(!1),a.response&&a.response.data.errors&&d(a.response.data.errors)})}catch(a){console.error(a),p(!1)}},R=u=>{if(!u)return"";const r=u.split("-");if(r.length!==3)return"";const[o,t,a]=r;return`${a}-${t}-${o}`};return w?e.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{minHeight:"400px"},children:e.jsx(y,{animation:"grow",variant:"primary"})}):e.jsxs(S,{className:"py-5",style:{direction:"rtl"},children:[e.jsxs("div",{className:"mb-4 text-center",children:[e.jsx(M,{title:"تعديل محضر اجتماع",icon:e.jsx(n,{icon:P,className:"text-primary-gold"})}),e.jsx("p",{style:{color:"var(--text-color)"},className:"mt-2",children:"تحديث بيانات المحضر والمستندات المرفقة"})]}),e.jsx(j,{className:"justify-content-center",children:e.jsx(i,{lg:10,children:e.jsxs(x,{className:"luxury-card border-0 shadow-sm overflow-hidden",style:{background:"var(--card--background)",borderRadius:"20px"},children:[e.jsx(x.Header,{className:"bg-transparent border-0 pt-4 px-4",children:e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("div",{className:"icon-badge ms-3",children:e.jsx(n,{icon:T,style:{color:"#c5a059"}})}),e.jsx("h5",{className:"mb-0",style:{fontWeight:"700",color:"var(--text-color)"},children:"تفاصيل المحضر"})]})}),e.jsx(x.Body,{className:"p-4 p-md-5",children:e.jsxs($,{onSubmit:f,children:[e.jsxs(j,{className:"g-4",children:[e.jsx(i,{md:6,children:e.jsxs("div",{className:"input-group-custom",children:[e.jsxs("label",{className:"form-label d-flex align-items-center",style:{color:"var(--text-color)"},children:[e.jsx(n,{icon:A,className:"ms-2 opacity-50"}),"عنوان المحضر"]}),e.jsx(N,{parentStyle:{width:"100%"},id:"address",type:"text",stylee:{width:"100%",borderRadius:"12px"},value:s.title||"",onChange:u=>c({...s,title:u.target.value}),placeholder:"أدخل عنوان المحضر..."})]})}),e.jsx(i,{md:6,children:e.jsxs("div",{className:"input-group-custom",children:[e.jsxs("label",{className:"form-label d-flex align-items-center",style:{color:"var(--text-color)"},children:[e.jsx(n,{icon:B,className:"ms-2 opacity-50"}),"تاريخ المحضر"]}),e.jsx("input",{type:"date",id:"date",className:"form-control custom-datepicker",style:{borderRadius:"12px",padding:"12px",border:"1px solid var(--border-color)",background:"var(--input-background, transparent)",color:"var(--text-color)"},onChange:u=>c({...s,date:u.target.value}),value:R(s.date)}),h.date&&e.jsx("p",{className:"error text-danger small mt-2",children:h.date})]})}),e.jsx(i,{md:12,children:e.jsxs("div",{className:"input-group-custom",children:[e.jsxs("label",{className:"form-label d-flex align-items-center",style:{color:"var(--text-color)"},children:[e.jsx(n,{icon:A,className:"ms-2 opacity-50"}),"ملاحظات إضافية"]}),e.jsx(N,{parentStyle:{width:"100%"},id:"notes",type:"text",stylee:{width:"100%",borderRadius:"12px"},value:s.note||"",onChange:u=>c({...s,note:u.target.value}),placeholder:"أدخل أي ملاحظات إضافية هنا..."})]})}),e.jsx(i,{md:12,children:e.jsx("div",{className:"upload-section p-4 rounded-4",style:{border:"2px dashed var(--border-color)",background:"rgba(197, 160, 89, 0.05)"},children:e.jsxs("div",{className:"d-flex flex-column align-items-center",children:[e.jsx("div",{className:"mb-3",children:e.jsx(n,{icon:U,size:"2x",style:{color:"#c5a059"}})}),e.jsx(L,{id:"paper",parentStyle:{width:"100%",textAlign:"center"},label:"تحديث المستندات المرفقة (اختياري)",onChange:u=>F(u.target.files[0])}),m&&e.jsxs("p",{className:"mt-2 text-success small",children:["تم اختيار: ",m.name]})]})})})]}),e.jsxs("div",{className:"mt-5 d-flex justify-content-center",children:[k?e.jsxs("button",{className:"luxury-submit-btn disabled",disabled:!0,children:[e.jsx(y,{animation:"border",size:"sm",className:"me-2"}),"جاري الحفظ..."]}):e.jsxs("button",{style:{marginLeft:"8px"},type:"button",className:"luxury-submit-btn",onClick:f,children:[e.jsx(n,{icon:H,className:"ms-2"}),"حفظ التعديلات"]}),e.jsx("button",{type:"button",className:"luxury-cancel-btn ms-3",onClick:()=>g("/addMinutesReport"),children:"إلغاء"})]})]})})]})})}),e.jsx("style",{children:`
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
            `})]})}export{K as default};
