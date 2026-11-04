import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import API from "../../../api/axiosConfig";
import "./fstudy.css";

const Fstudy = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);

  const getLoan = async () => {
    const fData = new FormData();
    fData.append("id", id);
    try {
      const res = await API.post("/loans/loan", fData);
      setLoan(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const parseJson = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };

  useEffect(() => {
    getLoan();
  }, []);

  if (!loan) return <p style={{ textAlign: "center" }}>جاري تحميل البيانات...</p>;

  const feasibility = loan.feasibility ? {
    ...loan.feasibility,
    evaluation: parseJson(loan.feasibility.evaluation),
    license: parseJson(loan.feasibility.license),
    organization_structure: parseJson(loan.feasibility.organization_structure),
    establishment_fees: parseJson(loan.feasibility.establishment_fees),
    fixed_assets: parseJson(loan.feasibility.fixed_assets),
    products_monthly_income: parseJson(loan.feasibility.products_monthly_income),
    project_implementation_steps: parseJson(loan.feasibility.project_implementation_steps)
  } : {};

  const projectType = (t) =>
    t == 1 ? "منزلي" : t == 2 ? "محل" : "متنقل";

  const contactType = (t) => {
    switch (t) {
      case "1": return "واتساب";
      case "2": return "سناب شات";
      case "3": return "تويتر";
      case "4": return "انستغرام";
      default: return "موقع إلكتروني";
    }
  };

  return (
    <div className="fstudy-container" dir="rtl">
      <div className="print-header">
        <h1>تقرير دراسة الجدوى</h1>
        <p>رقم المشروع: {loan.serial}</p>
      </div>

      <section>
        <h2>بيانات القرض</h2>
        <div className="two-col">
          <p><strong>اسم المستفيد:</strong> {loan.humancase?.name}</p>
          <p><strong>المبلغ المطلوب:</strong> {loan.amount} ريال</p>
        </div>
        <div className="two-col">
          <p><strong>تاريخ القرض:</strong> {loan.approvedate}</p>
          <p><strong>حالة القرض:</strong> {loan.status_string}</p>
        </div>
        <div className="two-col">
          <p><strong>الأولوية:</strong> {loan.priority_string}</p>
          <p><strong>تعليمات:</strong> {loan.instructions}</p>
        </div>
      </section>

      <section>
        <h2>بيانات المشروع</h2>
        <div className="two-col">
          <p><strong>نوع المشروع:</strong> {projectType(feasibility.details?.type)}</p>
          <p><strong>مكان المشروع:</strong> {feasibility.details?.address}</p>
        </div>
        <div className="two-col">
          <p><strong>طريقة التواصل:</strong> {contactType(feasibility.details?.contact)}</p>
          <p><strong>وصف التواصل:</strong> {feasibility.details?.description}</p>
        </div>
        <p><strong>رقم الجوال:</strong> {feasibility.details?.phone}</p>
      </section>

      <section>
        <h2>نقاط القوة والضعف</h2>
        <div className="grid-2">
          <div className="card">
            <h3>نقاط القوة</h3>
            <p>{feasibility.evaluation?.strength}</p>
          </div>
          <div className="card">
            <h3>نقاط الضعف</h3>
            <p>{feasibility.evaluation?.weaknesses}</p>
          </div>
          <div className="card">
            <h3>الفرص</h3>
            <p>{feasibility.evaluation?.opportunities}</p>
          </div>
          <div className="card">
            <h3>التهديدات</h3>
            <p>{feasibility.evaluation?.threats}</p>
          </div>
        </div>
      </section>

      <section>
        <h2>الجانب الفني</h2>
        <table>
          <thead>
            <tr>
              <th>الرخصة</th>
              <th>الجهة المصدرة</th>
              <th>التكلفة</th>
            </tr>
          </thead>
          <tbody>
            {feasibility.license?.license?.map((l, i) => (
              <tr key={i}>
                <td>{l}</td>
                <td>{feasibility.license.from[i]}</td>
                <td>{feasibility.license.cost[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {feasibility.upload && (
          <p>📎 <a href={feasibility.upload} target="_blank" rel="noreferrer">عرض المرفق</a></p>
        )}
      </section>

      <section>
        <h2>الهيكل التنظيمي</h2>
        <table>
          <thead>
            <tr>
              <th>الوظيفة</th>
              <th>الراتب</th>
              <th>عدد الموظفين</th>
            </tr>
          </thead>
          <tbody>
            {feasibility.organization_structure?.job?.map((j, i) => (
              <tr key={i}>
                <td>{j}</td>
                <td>{feasibility.organization_structure.sallary[i]}</td>
                <td>{feasibility.organization_structure.empcount[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>مصروفات التأسيس</h2>
        <table>
          <thead>
            <tr>
              <th>البيان</th>
              <th>الرسوم</th>
            </tr>
          </thead>
          <tbody>
            {feasibility.establishment_fees?.establishmentstatment?.map((s, i) => (
              <tr key={i}>
                <td>{s}</td>
                <td>{feasibility.establishment_fees.establishmentfees[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>الأصول الثابتة</h2>
        <table>
          <thead>
            <tr>
              <th>البيان</th>
              <th>العدد</th>
              <th>القيمة</th>
            </tr>
          </thead>
          <tbody>
            {feasibility.fixed_assets?.assetname?.map((a, i) => (
              <tr key={i}>
                <td>{a}</td>
                <td>{feasibility.fixed_assets.assetcount[i]}</td>
                <td>{feasibility.fixed_assets.assetvalue[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>المنتجات والإيرادات</h2>
        <table>
          <thead>
            <tr>
              <th>اسم المنتج</th>
              <th>تكلفة المنتج</th>
              <th>قدرة البيع</th>
              <th>الإيراد الشهري</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {feasibility.products_monthly_income?.productname?.map((p, i) => (
              <tr key={i}>
                <td>{p}</td>
                <td>{feasibility.products_monthly_income.productcost[i]}</td>
                <td>{feasibility.products_monthly_income.sell[i]}</td>
                <td>{feasibility.products_monthly_income.income[i]}</td>
                <td>{feasibility.products_monthly_income.netincome[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="print-footer no-print">
        <button onClick={() => window.print()}>🖨️ طباعة التقرير</button>
      </div>
    </div>
  );
};

export default Fstudy;
