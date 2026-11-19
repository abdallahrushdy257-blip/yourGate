import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill,
  faCalculator,
  faFileInvoiceDollar,
  faPrint,
  faUserTie,
  faCalendarAlt,
  faCheckCircle,
  faBuilding,
  faCreditCard,
  faStamp,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import TableComponent from "../../../../components/TableComponent";
import API from "../../../../api/axiosConfig";
import { toLocal } from "../../../../shared/Utils/toLocal";
import "./payroll.css";

// قائمة الشهور العربية
const MONTHS_LIST = [
  { value: "01", label: "يناير" },
  { value: "02", label: "فبراير" },
  { value: "03", label: "مارس" },
  { value: "04", label: "إبريل" },
  { value: "05", label: "مايو" },
  { value: "06", label: "يونيو" },
  { value: "07", label: "يوليو" },
  { value: "08", label: "أغسطس" },
  { value: "09", label: "سبتمبر" },
  { value: "10", label: "أكتوبر" },
  { value: "11", label: "نوفمبر" },
  { value: "12", label: "ديسمبر" },
];

// توليد قائمة السنوات
const YEARS_LIST = Array.from({ length: 9 }, (_, i) => 2022 + i);

function Payroll() {
  const currentDate = new Date();
  const currentMonthStr = String(currentDate.getMonth() + 1).padStart(2, "0");
  const currentYearStr = String(currentDate.getFullYear());

  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [selectedYear, setSelectedYear] = useState(currentYearStr);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  // حالة مودال سند الصرف
  const [voucherModal, setVoucherModal] = useState({
    show: false,
    data: null,
  });

  const selectedMonthObj = MONTHS_LIST.find((m) => m.value === selectedMonth);
  const monthName = selectedMonthObj ? selectedMonthObj.label : "";

  // إعادة احتساب المسير تلقائياً من الباك إند
  const handleCalculatePayroll = async () => {
    setIsCalculating(true);
    try {
      const res = await API.post("/payroll/calculate", {
        year: Number(selectedYear),
        month: Number(selectedMonth),
      });
      if (res.data?.success || res.status === 200) {
        toast.success(`تم احتساب مسير مرتبات ${monthName} ${selectedYear} بنجاح`);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error calculating payroll:", err);
      toast.error(err.response?.data?.message || "فشل في احتساب مسير الرواتب");
    } finally {
      setIsCalculating(false);
    }
  };

  // حذف سجل مسير
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا السجل من المسير؟")) return;
    try {
      const res = await API.delete(`/payroll/${id}`);
      if (res.data?.success || res.status === 200) {
        toast.success("تم حذف السجل بنجاح");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error deleting payroll row:", err);
      toast.error("فشل في حذف السجل");
    }
  };

  // فتح سند الصرف
  const handleOpenVoucher = (row) => {
    setVoucherModal({
      show: true,
      data: row,
    });
  };

  // إغلاق مودال سند الصرف
  const handleCloseVoucher = () => {
    setVoucherModal({
      show: false,
      data: null,
    });
  };

  // أعمدة الجدول الموحدة
  const columns = [
    { name: "إسم الموظف", key: "name" },
    { name: "الأساسي", key: "basic" },
    { name: "البدلات", key: "allowance" },
    { name: "مكافآت", key: "additions" },
    { name: "خصومات", key: "deductions" },
    { name: "غياب", key: "absence" },
    { name: "جزاءات", key: "investigations" },
    { name: "التأمين الاجتماعي", key: "socialinsurance" },
    { name: "الصافي", key: "net" },
    { name: "", key: "actions" },
  ];

  // خيارات قائمة الإجراءات
  const dropdownOptions = [
    {
      label: "سند صرف",
      action: (id, record) => handleOpenVoucher(record),
    },
    {
      label: "حذف",
      action: (id) => handleDelete(id),
    },
  ];

  // تعديل وتنسيق البيانات داخل الجدول
  const modifyRow = (row) => {
    let newRow = { ...row };
    newRow.name = row.name || row.employee?.name || "-";
    newRow.basic = `${toLocal(row.basic || 0)} ر.س`;
    newRow.allowance = `${toLocal(row.allowance || 0)} ر.س`;
    newRow.additions = `${toLocal(row.additions || 0)} ر.س`;
    newRow.deductions = `${toLocal(row.deductions || 0)} ر.س`;
    newRow.absence = `${toLocal(row.absence || 0)} ر.س`;
    newRow.investigations = `${toLocal(row.investigations || 0)} ر.س`;
    newRow.socialinsurance = `${toLocal(row.socialinsurance || 0)} ر.س`;
    newRow.net = `<span class="payroll-net-badge">${toLocal(row.net || 0)} ر.س</span>`;
    return newRow;
  };

  return (
    <>
      <div className="payroll-page-wrapper hrReports-tabel">
        {/* شريط اختيار الشهر والسنة وإعادة الاحتساب */}
        <div className="payroll-filters-bar d-flex flex-wrap gap-3 justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="payroll-period-title">
              مسير مرتبات شهر {monthName} {selectedYear}
            </span>
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            {/* اختيار الشهر */}
            <div style={{ minWidth: "140px" }}>
              <Form.Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="payroll-select"
              >
                {MONTHS_LIST.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </Form.Select>
            </div>

            {/* اختيار السنة */}
            <div style={{ minWidth: "120px" }}>
              <Form.Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="payroll-select"
              >
                {YEARS_LIST.map((yr) => (
                  <option key={yr} value={String(yr)}>
                    {yr}
                  </option>
                ))}
              </Form.Select>
            </div>

            {/* زر إعادة احتساب المسير */}
            <button
              type="button"
              onClick={handleCalculatePayroll}
              disabled={isCalculating}
              className="btn payroll-calc-btn d-flex align-items-center gap-2"
            >
              {isCalculating ? (
                <>
                  <Spinner animation="border" size="sm" />
                  <span>جاري الاحتساب...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCalculator} />
                  <span>إعادة احتساب المسير</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* الجدول الموحد المربوط بالباك إند */}
        <TableComponent
          key={`${selectedYear}-${selectedMonth}-${refreshKey}`}
          apiUrl={`/payroll?year=${selectedYear}&month=${selectedMonth}`}
          columns={columns}
          titleIcon={<FontAwesomeIcon icon={faMoneyBill} />}
          title={`مسيرات الرواتب - ${monthName} ${selectedYear}`}
          dropdownOptions={dropdownOptions}
          transformRowFn={modifyRow}
          search
        />
      </div>

      {/* مودال سند الصرف الرسمي الأنيق */}
      <Modal
        show={voucherModal.show}
        onHide={handleCloseVoucher}
        size="lg"
        centered
        dir="rtl"
        className="payroll-voucher-modal"
      >
        <Modal.Header closeButton className="voucher-modal-header">
          <Modal.Title className="d-flex align-items-center gap-2">
            <div className="voucher-title-icon">
              <FontAwesomeIcon icon={faFileInvoiceDollar} />
            </div>
            <div>
              <div className="voucher-title-text">سند صرف راتب للموظف</div>
              <div className="voucher-subtitle-text">كشف الاستحقاقات والاستقطاعات المالية المعتمد</div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4" id="printable-payroll-voucher">
          {voucherModal.data && (
            <div className="voucher-paper">
              {/* ترويسة السند الرسمية */}
              <div className="voucher-top-hero">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="voucher-badge-icon">
                      <FontAwesomeIcon icon={faBuilding} />
                    </div>
                    <div>
                      <h4 className="voucher-main-heading mb-1">
                        مسير رواتب واستحقاقات
                      </h4>
                      <div className="voucher-doc-id">
                        رقم الإشعار المالي: <span className="fw-bold">PAY-{String(voucherModal.data.id).padStart(6, "0")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="voucher-period-badge">
                    <FontAwesomeIcon icon={faCalendarAlt} className="ms-2" />
                    <span>مسير شهر: <strong>{monthName} {selectedYear}</strong></span>
                  </div>
                </div>
              </div>

              {/* بطاقة معلومات الموظف */}
              <div className="voucher-emp-strip">
                <div className="row g-3">
                  <div className="col-md-4 col-sm-6">
                    <div className="voucher-info-item">
                      <span className="voucher-info-label">اسم الموظف:</span>
                      <span className="voucher-info-val fw-bold">
                        <FontAwesomeIcon icon={faUserTie} className="ms-2 opacity-75" />
                        {voucherModal.data.employee?.name || voucherModal.data.name}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6">
                    <div className="voucher-info-item">
                      <span className="voucher-info-label">المسمى الوظيفي:</span>
                      <span className="voucher-info-val">
                        {voucherModal.data.employee?.jobname || "موظف"}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12">
                    <div className="voucher-info-item">
                      <span className="voucher-info-label">الآيبان البنكي (IBAN):</span>
                      <span className="voucher-info-val font-monospace">
                        <FontAwesomeIcon icon={faCreditCard} className="ms-2 opacity-75" />
                        {voucherModal.data.employee?.iban || "غير مسجل"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* جدول المفردات المالية الأنيق */}
              <div className="voucher-table-wrapper">
                <table className="voucher-table">
                  <thead>
                    <tr>
                      <th className="text-end pe-4">بند الراتب / المعاملة</th>
                      <th className="text-center">الاستحقاقات (+)</th>
                      <th className="text-center">الاستقطاعات (-)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="voucher-item-name text-end pe-4">الراتب الأساسي</td>
                      <td className="text-center voucher-val-credit">{toLocal(voucherModal.data.basic || 0)} ر.س</td>
                      <td className="text-center voucher-dash">-</td>
                    </tr>
                    <tr>
                      <td className="voucher-item-name text-end pe-4">إجمالي البدلات المعتمدة</td>
                      <td className="text-center voucher-val-credit">{toLocal(voucherModal.data.allowance || 0)} ر.س</td>
                      <td className="text-center voucher-dash">-</td>
                    </tr>
                    <tr>
                      <td className="voucher-item-name text-end pe-4">مكافآت وحوافز إضافية</td>
                      <td className="text-center voucher-val-credit">{toLocal(voucherModal.data.additions || 0)} ر.س</td>
                      <td className="text-center voucher-dash">-</td>
                    </tr>
                    <tr>
                      <td className="voucher-item-name text-end pe-4">خصومات وجزاءات إدارية</td>
                      <td className="text-center voucher-dash">-</td>
                      <td className="text-center voucher-val-debit">
                        {toLocal(Number(voucherModal.data.deductions || 0) + Number(voucherModal.data.investigations || 0))} ر.س
                      </td>
                    </tr>
                    <tr>
                      <td className="voucher-item-name text-end pe-4">خصم أيام الغياب والغياب بدون إذن</td>
                      <td className="text-center voucher-dash">-</td>
                      <td className="text-center voucher-val-debit">{toLocal(voucherModal.data.absence || 0)} ر.س</td>
                    </tr>
                    <tr>
                      <td className="voucher-item-name text-end pe-4">حصة الموظف في التأمينات الاجتماعية</td>
                      <td className="text-center voucher-dash">-</td>
                      <td className="text-center voucher-val-debit">{toLocal(voucherModal.data.socialinsurance || 0)} ر.س</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* كرت صافي الراتب المميز */}
              <div className="voucher-net-banner">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="voucher-net-icon">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div>
                      <div className="voucher-net-label">صافي الراتب المستحق للصرف</div>
                      <div className="voucher-net-sub">المبلغ النهائي المحول إلى الحساب البنكي للموظف</div>
                    </div>
                  </div>
                  <div className="voucher-net-amount">
                    {toLocal(voucherModal.data.net || 0)} <span className="voucher-currency">ر.س</span>
                  </div>
                </div>
              </div>

              {/* التوقيعات الرسمية المعتمدة */}
              <div className="voucher-signatures">
                <div className="row text-center g-3">
                  <div className="col-4">
                    <div className="voucher-sig-card">
                      <span className="voucher-sig-title">توقيع الموظف المستلم</span>
                      <div className="voucher-sig-line"></div>
                      <span className="voucher-sig-desc">إقرار بالاستلام والمراجعة</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="voucher-sig-card">
                      <span className="voucher-sig-title">المحاسب المسؤول</span>
                      <div className="voucher-sig-line"></div>
                      <span className="voucher-sig-desc">إعداد وتدقيق الحسابات</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="voucher-sig-card">
                      <span className="voucher-sig-title">اعتماد المدير المالي</span>
                      <div className="voucher-sig-line"></div>
                      <span className="voucher-sig-desc">ختم واعتماد الصرف</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="voucher-modal-footer d-flex justify-content-between">
          <button
            type="button"
            className="voucher-btn-cancel"
            onClick={handleCloseVoucher}
          >
            إغلاق
          </button>
          <button
            type="button"
            className="voucher-btn-print d-flex align-items-center gap-2"
            onClick={() => window.print()}
          >
            <FontAwesomeIcon icon={faPrint} />
            <span>طباعة السند الرسمي</span>
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Payroll;