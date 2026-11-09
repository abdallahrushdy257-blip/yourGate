
const PrintField = ({ label, value }) => (
  <div className="print-field">
    <span>{label}</span>
    <strong>{value || "—"}</strong>
  </div>
);

const Section = ({ title, children }) => (
  <div className="print-section">
    <h2>{title}</h2>
    <div className="print-grid">{children}</div>
  </div>
);

const TableSection = ({ title, headers, data }) => (
  <div className="print-section">
    <h2>{title}</h2>

    {data && data.length > 0 ? (
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell || "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="empty">لا يوجد بيانات</p>
    )}
  </div>
);

const PrintCaseStudy = ({ data }) => {
  const caseData = data?.case;
  const details = data?.details;
  const work = data?.work_education;
    console.log(caseData)

    const formateDate = (date) => {
      return new Date(date).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  return (
    <div className="print-container">

      {/* بيانات مستفيد */}
      <Section title="بيانات مستفيد">
        <PrintField label="اسم المستفيد" value={caseData?.name} />
        <PrintField label="حالة المستفيد" value={caseData?.type} />
        <PrintField label="أنشئ بواسطة" value={caseData?.details?.email} />
        <PrintField label="تاريخ الإنشاء" value={formateDate(caseData?.created_at)} />
        <PrintField label="حدث بواسطة" value={caseData?.details?.email} />
        <PrintField label="تاريخ التحديث" value={formateDate(caseData?.updated_at)} />
      </Section>

      {/* البيانات الأساسية */}
      <Section title="البيانات الأساسية">
        <PrintField label="الاسم" value={caseData?.name} />
        <PrintField label="النوع" value={caseData?.gender_string} />
        <PrintField label="تاريخ الميلاد" value={caseData?.dateofbirth} />
        <PrintField label="الحالة الاجتماعية" value={caseData?.status} />
        <PrintField label="الجنسية" value={caseData?.details?.nationality} />
        <PrintField label="رقم الهوية" value={caseData?.details?.id_number} />
        <PrintField label="رقم الجوال" value={caseData?.details?.phone_number} />
        <PrintField label="البريد الإلكتروني" value={caseData?.details?.email} />
        <PrintField label="رقم الحساب" value={caseData?.details?.account_number} />
        <PrintField label="تاريخ انتهاء الهوية" value={caseData?.details?.id_expiration_date} />
        <PrintField label="ملاحظات" value={caseData?.details?.note} />
      </Section>

      {/* البيانات البنكية */}
      <Section title="البيانات البنكية">
        <PrintField label="اسم البنك" value={details?.bankdetails?.name} />
        <PrintField label="الفرع" value={details?.bankdetails?.branch} />
        <PrintField label="IBAN" value={details?.bankdetails?.iban} />
      </Section>

      {/* المؤهل والوظيفة */}
      <Section title="المؤهل والوظيفة">
        <PrintField label="المؤهل" value={work?.educationlevel} />
        <PrintField label="الوظيفة" value={work?.job} />
        <PrintField
          label="يستطيع العمل"
          value={work?.canwork === 0 ? "لا" : "نعم"}
        />
      </Section>

      {/* الدخل */}
      <TableSection
        title="الدخل"
        headers={["مصدر الدخل", "الراتب"]}
        data={
          work?.incomesource?.map((i) => [i.name, i.amount]) || []
        }
      />

      {/* الدورات */}
      <TableSection
        title="الدورات التدريبية"
        headers={["اسم الدورة", "الجهة"]}
        data={
          work?.courses?.map((c) => [c.title, c.address]) || []
        }
      />

      {/* السكن */}
      <Section title="بيانات السكن">
        <PrintField label="المحافظة" value={details?.personalfeesdetails?.state} />
        <PrintField label="القرية" value={details?.personalfeesdetails?.village} />
        <PrintField label="العنوان" value={details?.personalfeesdetails?.nationalAddress} />
        <PrintField label="نوع السكن" value={details?.personalfeesdetails?.homeType} />
        <PrintField label="ملكية السكن" value={details?.personalfeesdetails?.homeOwnership} />
        <PrintField label="الإيجار" value={details?.personalfeesdetails?.rent} />
        <PrintField label="عدد السيارات" value={details?.personalfeesdetails?.cars} />
      </Section>

      {/* الأمراض */}
      <TableSection
        title="البيانات الصحية"
        headers={["المرض", "النوع", "الخطورة", "العلاج", "التكلفة"]}
        data={
          data?.health?.map((h) => [
            h.disease_name,
            h.disease_type,
            h.disease_degree,
            h.treatment_type,
            h.treatment_cost,
          ]) || []
        }
      />

      {/* التابعين */}
      <TableSection
        title="البيانات التابعين"
        headers={["الاسم", "النوع", "القرابة", "الميلاد", "الهاتف"]}
        data={
          data?.dependants?.map((d) => [
            d.name,
            d.gender === 0 ? "ذكر" : "أنثى",
            d.relation,
            d.dateofbirth,
            d.phone,
          ]) || []
        }
      />

    </div>
  );
};

export default PrintCaseStudy;