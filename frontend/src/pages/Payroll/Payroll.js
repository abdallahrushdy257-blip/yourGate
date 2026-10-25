import "./payroll.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
// import API from "../../api/axiosConfig"; // تم إيقاف الـ API مؤقتاً
import HRreports from "../HRreports/HRreports";
import { Container, Button, Spinner, Form } from "react-bootstrap";
import Title from "../../components/title";
import { toLocal } from "../../Utils/toLocal";

// ==========================================
// 📌 بيانات ثباتية مؤقتة (Static Dummy Data)
// ==========================================
const DUMMY_PAYROLLS = [
  {
    id: 1,
    employee: { id: 101, name: "أحمد محمود علي" },
    basic: 6000,
    allowance: 1000,
    additions: 500,
    deductions: 200,
    absence: 0,
    investigations: 0,
    socialinsurance: 400,
    net: 6900,
  },
  {
    id: 2,
    employee: { id: 102, name: "محمد السيد إبراهيم" },
    basic: 8500,
    allowance: 1200,
    additions: 0,
    deductions: 300,
    absence: 250,
    investigations: 100,
    socialinsurance: 550,
    net: 8500,
  },
  {
    id: 3,
    employee: { id: 103, name: "سارة حسن عبد الله" },
    basic: 5000,
    allowance: 800,
    additions: 300,
    deductions: 0,
    absence: 0,
    investigations: 0,
    socialinsurance: 350,
    net: 5750,
  },
  {
    id: 4,
    employee: { id: 104, name: "عمر خالد منصور" },
    basic: 7000,
    allowance: 900,
    additions: 1000,
    deductions: 150,
    absence: 300,
    investigations: 0,
    socialinsurance: 450,
    net: 8000,
  },
];

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

// توليد قائمة السنوات (من 2020 وحتى 2030)
const YEARS_LIST = Array.from({ length: 11 }, (_, i) => 2020 + i);

function Payroll() {
  const currentDate = new Date();
  const currentMonthStr = String(currentDate.getMonth() + 1).padStart(2, "0");
  const currentYearStr = String(currentDate.getFullYear());

  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [selectedYear, setSelectedYear] = useState(currentYearStr);

  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // محاكاة حساب وتفريغ الرواتب للشهر والسنة المختارين
  const calculatePayroll = () => {
    setLoading(true);
    setMessage("");

    setTimeout(() => {
      const monthObj = MONTHS_LIST.find((m) => m.value === selectedMonth);
      const monthName = monthObj ? monthObj.label : "";
      
      if (selectedMonth && selectedYear) {
        setMessage(`مسير مرتبات شهر ${monthName} ${selectedYear}`);
        setPayrolls(DUMMY_PAYROLLS);
      } else {
        setPayrolls([]);
      }
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    if (!selectedMonth || !selectedYear) return;
    calculatePayroll();
  }, [selectedMonth, selectedYear]);

  return (
    <>
      {/* <HRreports activeTab="salaryreport" /> */}
      <Container className="pt-4">
        <Title
          title="مسيرات الرواتب"
          icon={<FontAwesomeIcon icon={faMoneyBill} />}
          style={{ width: "unset" }}
          classname="rmtit"
        />

        {/* قوائم التصفية بالشهر والسنة */}
        <div className="calc-actions d-flex gap-3 justify-content-end align-items-center mb-3">
          {/* اختيار الشهر */}
          <div style={{ width: "160px" }}>
            <Form.Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-center shadow-sm"
              style={{ borderRadius: "8px" }}
            >
              <option value="">اختر الشهر</option>
              {MONTHS_LIST.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Form.Select>
          </div>

          {/* اختيار السنة */}
          <div style={{ width: "140px" }}>
            <Form.Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-center shadow-sm"
              style={{ borderRadius: "8px" }}
            >
              <option value="">اختر السنة</option>
              {YEARS_LIST.map((yr) => (
                <option key={yr} value={String(yr)}>
                  {yr}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">جاري تحميل مسير الرواتب...</p>
          </div>
        ) : (
          <>
            {message && <h5 className="text-center my-3">{message}</h5>}

            {/* جدول المرتبات */}
            {payrolls.length > 0 && (
              <div className="mt-4">
                <table className="printTabel">
                  <thead className="printTabelHead">
                    <tr>
                      <th>م</th>
                      <th>إسـم الموظف</th>
                      <th>الأساسي</th>
                      <th>البدلات</th>
                      <th>مكافآت</th>
                      <th>خصومات</th>
                      <th>غياب</th>
                      <th>جزاءات</th>
                      <th>التأمين الاجتماعي</th>
                      <th>الصافي</th>
                      <th>إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrolls.map((row, index) => (
                      <tr key={row.id}>
                        <td>{index + 1}</td>
                        <td>{row.employee.name}</td>
                        <td>{toLocal(row.basic)}</td>
                        <td>{toLocal(row.allowance)}</td>
                        <td>{toLocal(row.additions)}</td>
                        <td>{toLocal(row.deductions)}</td>
                        <td>{toLocal(row.absence)}</td>
                        <td>{toLocal(row.investigations)}</td>
                        <td>{toLocal(row.socialinsurance)}</td>
                        <td className="fw-bold">{toLocal(row.net)}</td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              alert(
                                `عرض سند صرف للموظف: ${row.employee.name} (ستاتيك)`
                              );
                            }}
                          >
                            سند صرف
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}

export default Payroll;