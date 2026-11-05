import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill,
  faCalculator,
  faFileInvoiceDollar,
  faPrint,
  faUserTie,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import TableComponent from "../../../../components/TableComponent";
import API from "../../../../api/axiosConfig";
import { toLocal } from "../../../../Utils/toLocal";
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
        <Modal.Header closeButton style={{ borderBottom: "1.5px solid rgba(194, 154, 100, 0.25)" }}>
          <Modal.Title className="d-flex align-items-center gap-2" style={{ color: "var(--text-color, #493d2c)", fontWeight: 700 }}>
            <FontAwesomeIcon icon={faFileInvoiceDollar} style={{ color: "#c29a64" }} />
            <span>سند صرف راتب للموظف</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4" id="printable-payroll-voucher">
          {voucherModal.data && (
            <div className="voucher-content-card">
              {/* رأس السند */}
              <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
                <div>
                  <h5 className="fw-bold mb-1" style={{ color: "var(--text-color, #493d2c)" }}>
                    سند صرف راتب (مسير مرتبات)
                  </h5>
                  <p className="text-muted mb-0 small">
                    رقم السند: PAY-{String(voucherModal.data.id).padStart(6, "0")}
                  </p>
                </div>
                <div className="text-start">
                  <span className="badge px-3 py-2" style={{ background: "rgba(194, 154, 100, 0.15)", color: "#926830", fontSize: "13px" }}>
                    {monthName} {selectedYear}
                  </span>
                </div>
              </div>

              {/* بيانات الموظف */}
              <div className="row g-3 p-3 rounded mb-4" style={{ background: "rgba(194, 154, 100, 0.08)", border: "1px solid rgba(194, 154, 100, 0.2)" }}>
                <div className="col-md-6">
                  <span className="text-muted small d-block">إسم الموظف:</span>
                  <span className="fw-bold">{voucherModal.data.employee?.name || voucherModal.data.name}</span>
                </div>
                <div className="col-md-6">
                  <span className="text-muted small d-block">المسمى الوظيفي:</span>
                  <span>{voucherModal.data.employee?.jobname || "موظف"}</span>
                </div>
                {voucherModal.data.employee?.iban && (
                  <div className="col-md-12">
                    <span className="text-muted small d-block">الآيبان البنكي (IBAN):</span>
                    <span className="font-monospace">{voucherModal.data.employee.iban}</span>
                  </div>
                )}
              </div>

              {/* جدول المفردات المالية */}
              <table className="table table-bordered text-center align-middle mb-4">
                <thead style={{ background: "rgba(194, 154, 100, 0.15)" }}>
                  <tr>
                    <th>البند</th>
                    <th>الاستحقاقات (+)</th>
                    <th>الاستقطاعات (-)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-start pe-3">الراتب الأساسي</td>
                    <td className="text-success fw-bold">{toLocal(voucherModal.data.basic || 0)} ر.س</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td className="text-start pe-3">إجمالي البدلات</td>
                    <td className="text-success">{toLocal(voucherModal.data.allowance || 0)} ر.س</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td className="text-start pe-3">مكافآت وحوافز</td>
                    <td className="text-success">{toLocal(voucherModal.data.additions || 0)} ر.س</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td className="text-start pe-3">خصومات وجزاءات</td>
                    <td>-</td>
                    <td className="text-danger">{toLocal(Number(voucherModal.data.deductions || 0) + Number(voucherModal.data.investigations || 0))} ر.س</td>
                  </tr>
                  <tr>
                    <td className="text-start pe-3">خصم الغياب</td>
                    <td>-</td>
                    <td className="text-danger">{toLocal(voucherModal.data.absence || 0)} ر.س</td>
                  </tr>
                  <tr>
                    <td className="text-start pe-3">التأمين الاجتماعي</td>
                    <td>-</td>
                    <td className="text-danger">{toLocal(voucherModal.data.socialinsurance || 0)} ر.س</td>
                  </tr>
                  <tr style={{ background: "rgba(194, 154, 100, 0.2)", fontSize: "16px" }}>
                    <td className="text-start pe-3 fw-bold">صافي الراتب المستحق للصرف</td>
                    <td colSpan="2" className="fw-bold" style={{ color: "#875f28", fontSize: "18px" }}>
                      {toLocal(voucherModal.data.net || 0)} ر.س
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* التوقيعات الرسمية */}
              <div className="row text-center mt-4 pt-3 border-top g-3">
                <div className="col-4">
                  <span className="small text-muted d-block mb-4">توقيع الموظف المستلم</span>
                  <div style={{ borderBottom: "1px dashed #aaa", width: "80%", margin: "0 auto" }}></div>
                </div>
                <div className="col-4">
                  <span className="small text-muted d-block mb-4">المحاسب المسؤول</span>
                  <div style={{ borderBottom: "1px dashed #aaa", width: "80%", margin: "0 auto" }}></div>
                </div>
                <div className="col-4">
                  <span className="small text-muted d-block mb-4">اعتماد المدير المالي</span>
                  <div style={{ borderBottom: "1px dashed #aaa", width: "80%", margin: "0 auto" }}></div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-outline-secondary rounded-pill px-4"
            onClick={handleCloseVoucher}
          >
            إغلاق
          </button>
          <button
            type="button"
            className="btn payroll-calc-btn d-flex align-items-center gap-2"
            onClick={() => window.print()}
          >
            <FontAwesomeIcon icon={faPrint} />
            <span>طباعة السند</span>
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Payroll;