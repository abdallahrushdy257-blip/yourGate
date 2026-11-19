import React, { useRef } from "react";
import { Modal, Button, Table, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faXmark,
  faFilePdf,
  faUser,
  faBank,
  faGraduationCap,
  faHouseUser,
  faNotesMedical,
  faUsers,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import "./BeneficiaryReportModal.css";

function BeneficiaryReportModal({ show, onHide, beneficiaryData }) {
  const printRef = useRef(null);

  if (!beneficiaryData) return null;

  const c = beneficiaryData.case || {};
  const d = beneficiaryData.details || {};
  const work = beneficiaryData.work_education || d.qualifications || d.work_education || {};
  const healthList = beneficiaryData.health || d.health || [];
  const dependentsList = beneficiaryData.dependants || d.dependants || [];
  const vouchers = d.vouchers || [];
  const home = d.home || d.personalfeesdetails || {};
  const bank = d.bankdetails || {};

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    // Clone content and remove icons to prevent font-awesome SVG scaling issues
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = printContent.innerHTML;

    // Remove any SVG or fontawesome icons completely from the printed HTML
    tempDiv.querySelectorAll("svg, .svg-inline--fa, i").forEach((el) => el.remove());

    const cleanHtml = tempDiv.innerHTML;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>ملف دراسة حالة المستفيد - ${c.name || ""}</title>
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
            background: ${c.case_status_string === "مرفوض" ? "#fef2f2" : "#f0fdf4"} !important;
            color: ${c.case_status_string === "مرفوض" ? "#991b1b" : "#166534"} !important;
            border: 1px solid ${c.case_status_string === "مرفوض" ? "#fecaca" : "#bbf7d0"};
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
            <div>رقم الملف: <strong>#{${c.id || "-"}}</strong></div>
            <div>تاريخ الإصدار: <strong>${new Date().toLocaleDateString("ar-EG")}</strong></div>
            <div>نوع الحالة: <strong>${c.humancasetype === "2" ? "مستفيد دائم" : "مستفيد مؤقت"}</strong></div>
          </div>
        </div>

        <!-- Summary Strip -->
        <div class="beneficiary-hero-strip">
          <div class="hero-field">
            <span class="hero-label">اسم المستفيد الكامل</span>
            <span class="hero-value">${c.name || "-"}</span>
          </div>
          <div class="hero-field">
            <span class="hero-label">رقم الهوية الوطنية / الإقامة</span>
            <span class="hero-value">${c.idnumber || "-"}</span>
          </div>
          <div class="hero-field">
            <span class="hero-label">رقم الجوال</span>
            <span class="hero-value" dir="ltr">${c.phonenum || "-"}</span>
          </div>
          <div class="hero-field">
            <span class="hero-label">قرار الحالة</span>
            <span class="hero-value status-tag">${c.case_status_string || "موافقة"}</span>
          </div>
        </div>

        <!-- Content Body -->
        <div class="document-sections-flow">
          ${cleanHtml}
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
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 450);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      className="modal-table beneficiary-report-modal"
      centered
      size="xl"
      scrollable
    >
      <Modal.Header>
        <Modal.Title>
          <FontAwesomeIcon icon={faFilePdf} className="me-2" style={{ color: "#c62828" }} />
          تقرير شامل للمستفيد
        </Modal.Title>
        <Button className="custom-close-button cls-btn" variant="link" onClick={onHide}>
          <FontAwesomeIcon icon={faXmark} className="closeModal" />
        </Button>
      </Modal.Header>

      <Modal.Body className="beneficiary-modal-body" style={{ direction: "rtl", maxHeight: "75vh", overflowY: "auto", padding: "24px" }}>
        <div ref={printRef}>
          {/* Report Preview Header */}
          <div className="report-preview-banner">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h4 className="fw-bold mb-1" style={{ color: "#8b6534" }}>تقرير بيانات ودراسة حالة المستفيد</h4>
                <div className="text-muted" style={{ fontSize: "12.5px" }}>
                  رقم الملف: <strong>#{c.id || "-"}</strong> | تاريخ الإصدار: <strong>{new Date().toLocaleDateString("ar-EG")}</strong>
                </div>
              </div>
              <div>
                <Badge
                  style={{
                    backgroundColor: c.case_status_string === "مرفوض" ? "#c62828" : "#2e7d32",
                    fontSize: "12px",
                    padding: "6px 14px",
                    borderRadius: "20px"
                  }}
                >
                  {c.case_status_string || "موافقة"}
                </Badge>
              </div>
            </div>
          </div>

          {/* 1. البيانات الأساسية */}
          <div className="section">
            <div className="section-title">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              البيانات الشخصية والأساسية
            </div>
            <div className="section-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">اسم المستفيد الكامل</span>
                  <span className="info-value">{c.name || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">النوع (الجنس)</span>
                  <span className="info-value">{c.gender_string || (c.gender === "0" ? "ذكر" : "أنثى")}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">الحالة الإجتماعية</span>
                  <span className="info-value">{c.social_status_string || c.status_string || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">تاريخ الميلاد</span>
                  <span className="info-value">{c.dateofbirth || c.dob || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">رقم الهوية</span>
                  <span className="info-value">{c.idnumber || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">مصدر الهوية</span>
                  <span className="info-value">{c.idsource || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">تاريخ انتهاء الهوية</span>
                  <span className="info-value">{c.iddate || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">رقم الجوال</span>
                  <span className="info-value" dir="ltr">{c.phonenum || c.phone || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">البريد الإلكتروني</span>
                  <span className="info-value">{c.email || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">الجنسية</span>
                  <span className="info-value">{c.nationality || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">عدد أفراد الأسرة</span>
                  <span className="info-value">{c.familycount ?? "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">حالة الملف</span>
                  <span className="info-value">{c.humancasetype === "2" ? "مستفيد دائم" : "مستفيد مؤقت"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">قرار دراسة الحالة</span>
                  <span className="info-value">{c.case_status_string || "موافقة"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">تاريخ الإنشاء</span>
                  <span className="info-value">{c.created_at ? new Date(c.created_at).toLocaleDateString("ar-EG") : "-"}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">ملاحظات إضافية</span>
                  <span className="info-value">{c.note || "لا توجد ملاحظات"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. البيانات البنكية */}
          <div className="section">
            <div className="section-title">
              <FontAwesomeIcon icon={faBank} className="me-2" />
              البيانات البنكية
            </div>
            <div className="section-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">اسم البنك</span>
                  <span className="info-value">{bank.name || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">الفرع</span>
                  <span className="info-value">{bank.branch || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">رقم الـ IBAN / الحساب</span>
                  <span className="info-value" dir="ltr">{bank.iban || c.accnumber || "-"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. المؤهل والوظيفة */}
          <div className="section">
            <div className="section-title">
              <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
              المؤهل العلمي والوظيفة
            </div>
            <div className="section-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">المؤهل الدراسي</span>
                  <span className="info-value">{work.educationlevel || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">الوظيفة الحالية</span>
                  <span className="info-value">{work.job || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">القدرة على العمل</span>
                  <span className="info-value">
                    {work.canwork === "0" || work.canwork === 0 ? "لا يستطيع العمل" : "نعم يستطيع العمل"}
                  </span>
                </div>
              </div>
              {Array.isArray(work.incomesource) && work.incomesource.length > 0 && (
                <>
                  <h6 style={{ marginTop: "14px", fontWeight: 700, color: "#5c4027", fontSize: "13px" }}>
                    مصادر الدخل:
                  </h6>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>مصدر الدخل</th>
                        <th>القيمة الشهرية</th>
                      </tr>
                    </thead>
                    <tbody>
                      {work.incomesource.map((inc, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{inc.name || inc.source || "-"}</td>
                          <td>{inc.amount ? `${inc.amount} ريال` : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>

          {/* 4. بيانات السكن */}
          <div className="section">
            <div className="section-title">
              <FontAwesomeIcon icon={faHouseUser} className="me-2" />
              بيانات السكن والمصروفات
            </div>
            <div className="section-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">المدينة / المحافظة</span>
                  <span className="info-value">{home.state || home.city || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">القرية / الحي</span>
                  <span className="info-value">{home.village || home.district || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">العنوان الوطني</span>
                  <span className="info-value">{home.nationalAddress || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">نوع السكن</span>
                  <span className="info-value">{home.homeType || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">ملكية السكن</span>
                  <span className="info-value">{home.homeOwnership || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">الإيجار الشهري</span>
                  <span className="info-value">{home.rent ? `${home.rent} ريال` : "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">عدد السيارات</span>
                  <span className="info-value">{home.cars || "0"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">أثاث السكن</span>
                  <span className="info-value">{home.furniture || "-"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. البيانات الصحية */}
          <div className="section">
            <div className="section-title">
              <FontAwesomeIcon icon={faNotesMedical} className="me-2" />
              البيانات الصحية ({healthList.length})
            </div>
            <div className="section-body">
              {healthList.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>اسم المرض</th>
                      <th>نوع المرض</th>
                      <th>درجة الخطورة</th>
                      <th>نوع العلاج</th>
                      <th>التكلفة الشهرية</th>
                      <th>ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthList.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item.disease_name || item.name || "-"}</td>
                        <td>{item.disease_type || item.type || "-"}</td>
                        <td className={item.disease_degree === "حرجة" ? "badge-danger" : "badge-warning"}>
                          {item.disease_degree || item.degree || "عادية"}
                        </td>
                        <td>{item.treatment_type || item.trtype || "-"}</td>
                        <td>{item.treatment_cost ? `${item.treatment_cost} ريال` : "-"}</td>
                        <td>{item.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">لا توجد بيانات صحية مسجلة</div>
              )}
            </div>
          </div>

          {/* 6. التابعين */}
          <div className="section">
            <div className="section-title">
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              بيانات التابعين ({dependentsList.length})
            </div>
            <div className="section-body">
              {dependentsList.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>اسم التابع</th>
                      <th>صلة القرابة</th>
                      <th>النوع</th>
                      <th>تاريخ الميلاد</th>
                      <th>رقم الهوية</th>
                      <th>الجوال</th>
                      <th>الحالة الصحية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dependentsList.map((dep, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td style={{ fontWeight: 700 }}>{dep.name || "-"}</td>
                        <td>{dep.relation || "-"}</td>
                        <td>{dep.gender === "female" || dep.gender === "1" ? "أنثى" : "ذكر"}</td>
                        <td>{dep.dateofbirth || dep.dob || "-"}</td>
                        <td>{dep.nationalid || dep.national_id || "-"}</td>
                        <td dir="ltr">{dep.phone || "-"}</td>
                        <td>{dep.health || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">لا يوجد تابعين مسجلين</div>
              )}
            </div>
          </div>

          {/* 7. سندات الصرف */}
          {vouchers.length > 0 && (
            <div className="section">
              <div className="section-title">
                <FontAwesomeIcon icon={faReceipt} className="me-2" />
                سندات الصرف ({vouchers.length})
              </div>
              <div className="section-body">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>المبلغ</th>
                      <th>تاريخ الصرف</th>
                      <th>طريقة الدفع</th>
                      <th>البيان</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vouchers.map((v, i) => (
                      <tr key={i}>
                        <td>{v.id || i + 1}</td>
                        <td style={{ fontWeight: 700, color: "#2e7d32" }}>
                          {v.amount ? `${v.amount} ريال` : "-"}
                        </td>
                        <td>{v.date || "-"}</td>
                        <td>{v.payment_method === "cash" ? "نقداً" : v.payment_method || "-"}</td>
                        <td>{v.description || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          إغلاق
        </Button>
        <Button
          variant="primary"
          onClick={handlePrint}
          style={{
            background: "linear-gradient(135deg, #b89358 0%, #946f36 100%)",
            border: "none",
            borderRadius: "10px",
          }}
        >
          <FontAwesomeIcon icon={faPrint} className="me-2" />
          طباعة التقرير
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BeneficiaryReportModal;
