import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faEye,
  faPrint,
  faPlus,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form, Table, Alert, Row, Col } from "react-bootstrap";
import TableComponent from "../../components/TableComponent";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterTextbox from "../../components/RegisterTextBox";

// 1. بيانات وهمية للموظفين
const INITIAL_EMPLOYEES = [
  { value: 1, label: "أحمد علي" },
  { value: 2, label: "سارة محمود" },
  { value: 3, label: "محمد إبراهيم" },
];

// 2. بيانات وهمية للحسابات المالية (حسابات الدفع)
const INITIAL_ACCOUNTS = [
  { value: 101, label: "الخزينة الرئيسية", balance: 50000 },
  { value: 102, label: "بنك مصر - حساب جاري", balance: 150000 },
  { value: 103, label: "البنك الأهلي", balance: 75000 },
];

// 3. بيانات وهمية ابتدائية للسلف واقساطها
const INITIAL_ADVANCES = [
  {
    id: 1,
    employee_id: 1,
    employee: { id: 1, name: "أحمد علي" },
    amount: 12000,
    months: 6,
    monthly_amount: 2000,
    start_date: "2026-01-01",
    payment_account_id: 101,
    notes: "سلفة طارئة لشراء مستلزمات",
    summary: {
      amount: 12000,
      months: 6,
      monthly_amount: 2000,
      start_date: "2026-01-01",
      end_date: "2026-06-01",
      notes: "سلفة طارئة لشراء مستلزمات",
      status: "نشطة",
    },
    installments: [
      { id: 101, amount: 2000, due_date: "2026-01-01", status: "paid" },
      { id: 102, amount: 2000, due_date: "2026-02-01", status: "paid" },
      { id: 103, amount: 2000, due_date: "2026-03-01", status: "unpaid" },
      { id: 104, amount: 2000, due_date: "2026-04-01", status: "unpaid" },
      { id: 105, amount: 2000, due_date: "2026-05-01", status: "unpaid" },
      { id: 106, amount: 2000, due_date: "2026-06-01", status: "unpaid" },
    ],
  },
  {
    id: 2,
    employee_id: 2,
    employee: { id: 2, name: "سارة محمود" },
    amount: 5000,
    months: 5,
    monthly_amount: 1000,
    start_date: "2026-03-01",
    payment_account_id: 102,
    notes: "سلفة علاجية",
    summary: {
      amount: 5000,
      months: 5,
      monthly_amount: 1000,
      start_date: "2026-03-01",
      end_date: "2026-07-01",
      notes: "سلفة علاجية",
      status: "نشطة",
    },
    installments: [
      { id: 201, amount: 1000, due_date: "2026-03-01", status: "paid" },
      { id: 202, amount: 1000, due_date: "2026-04-01", status: "unpaid" },
      { id: 203, amount: 1000, due_date: "2026-05-01", status: "unpaid" },
      { id: 204, amount: 1000, due_date: "2026-06-01", status: "unpaid" },
      { id: 205, amount: 1000, due_date: "2026-07-01", status: "unpaid" },
    ],
  },
];

function CreateEmployeeAdvanceStatic() {
  // ================= STATE MANAGEMENT =================
  const [employees] = useState(INITIAL_EMPLOYEES);
  const [accounts] = useState(INITIAL_ACCOUNTS);
  const [allAdvances, setAllAdvances] = useState(INITIAL_ADVANCES);

  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAdvance, setSelectedAdvance] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [alertData, setAlertData] = useState({ message: "", type: "" });

  const [formData, setFormData] = useState({
    employee_id: "",
    payment_account_id: "",
    amount: "",
    months: "",
    start_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // تصفية السلف حسب الموظف المختار من الفلتر العلوى
  const filteredAdvances = useMemo(() => {
    if (!selectedEmployeeFilter) return allAdvances;
    return allAdvances.filter(
      (adv) => adv.employee_id === Number(selectedEmployeeFilter),
    );
  }, [allAdvances, selectedEmployeeFilter]);

  // دالة تحويل المبالغ لنص منسق
  const formatNum = (num) => {
   if (num === null || num === undefined) return "";
    const formatted = Number(num).toLocaleString("en-US", {
  maximumFractionDigits: 0,
});
    return formatted;
  };

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      employee_id: "",
      payment_account_id: "",
      amount: "",
      months: "",
      start_date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setValidated(false);
  };

  const handleShowDetails = (advance) => {
    setSelectedAdvance(advance);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAdvance(null);
  };

  // محاكاة إنشاء سلفة جديدة وحساب أقساطها تلقائياً
  const handleSubmit = (e) => {
    e.preventDefault();
    setValidated(true);

    if (
      !formData.employee_id ||
      !formData.payment_account_id ||
      !formData.amount ||
      !formData.months ||
      !formData.start_date
    ) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const empObj = employees.find(
        (e) => e.value === Number(formData.employee_id),
      );
      const totalAmount = Number(formData.amount);
      const totalMonths = Number(formData.months);
      const monthlyAmount = totalAmount / totalMonths;

      // توليد جدول الأقساط الوهمي
      const installments = [];
      let startDateObj = new Date(formData.start_date);

      for (let i = 0; i < totalMonths; i++) {
        const dueDate = new Date(startDateObj);
        dueDate.setMonth(dueDate.getMonth() + i);

        installments.push({
          id: Date.now() + i,
          amount: monthlyAmount,
          due_date: dueDate.toISOString().split("T")[0],
          status: "unpaid",
        });
      }

      const endDateObj = new Date(startDateObj);
      endDateObj.setMonth(endDateObj.getMonth() + totalMonths - 1);

      const newAdvance = {
        id: Date.now(),
        employee_id: Number(formData.employee_id),
        employee: { id: empObj.value, name: empObj.label },
        amount: totalAmount,
        months: totalMonths,
        monthly_amount: monthlyAmount,
        start_date: formData.start_date,
        payment_account_id: Number(formData.payment_account_id),
        notes: formData.notes,
        summary: {
          amount: totalAmount,
          months: totalMonths,
          monthly_amount: monthlyAmount,
          start_date: formData.start_date,
          end_date: endDateObj.toISOString().split("T")[0],
          notes: formData.notes || "-",
          status: "نشطة",
        },
        installments: installments,
      };

      setAllAdvances((prev) => [newAdvance, ...prev]);
      showAlert("تم حفظ السلفة وتوليد الأقساط بنجاح", "success");
      setIsSubmitting(false);
      handleCloseModal();
    }, 400);
  };

  const showAlert = (message, type) => {
    setAlertData({ message, type });
    setTimeout(() => {
      setAlertData({ message: "", type: "" });
    }, 3000);
  };

  const selectedAccountObj = accounts.find(
    (a) => a.value === Number(formData.payment_account_id),
  );

  // ================= إعداد أعمدة وبيانات TableComponent =================
  const columns = [
    { name: "اسم الموظف", key: "employeeName" },
    { name: "قيمة السلفة", key: "amountText" },
    { name: "عدد الشهور", key: "months" },
    { name: "القسط الشهري", key: "monthlyAmountText" },
    { name: "تاريخ البداية", key: "start_date" },
    { name: "", key: "actions" },
  ];

  // خيارات القائمة المنسدلة للإجراءات (عرض التفاصيل فقط)
  const dropdownOptions = [
    {
      label: "عرض التفاصيل والأقساط",
      action: (id, record) => {
        handleShowDetails(record.original);
      },
    },
  ];

  const tableData = useMemo(() => {
    return filteredAdvances.map((item) => ({
      id: item.id,
      employeeName: item.employee?.name,
      amountText: formatNum(item.amount),
      months: item.months,
      monthlyAmountText: formatNum(item.monthly_amount),
      start_date: item.start_date,
      original: item,
    }));
  }, [filteredAdvances]);

  return (
    <div className="p-4  rounded shadow-sm position-relative">
      <style>
        {
          `.table>:not(caption)>*>*{
           color: var(--text-color) !important;
           background-color: transparent !important;
          }
          `
        }
      </style>
      {/* إشعار الرسائل */}
      {alertData.message && (
        <Alert
          variant={alertData.type === "success" ? "success" : "danger"}
          className="position-fixed top-0 start-50 translate-middle-x mt-3 z-3 shadow"
        >
          {alertData.message}
        </Alert>
      )}

      {/* جدول السلف الرئيسي من خلال TableComponent */}
      <TableComponent
        title="المسحوبات المجدولة"
        titleIcon={<FontAwesomeIcon icon={faTable} />}
        data={tableData}
        columns={columns}
        addBtn={true}
        addBtnName="سلفة جديد"
        onAddClick={() => setShowModal(true)}
        dropdownOptions={dropdownOptions}
        searchDate={false}
      />

      {/* ================= مودال إضافة سلفة ================= */}
      <Modal show={showModal} onHide={handleCloseModal} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>إضافة سلفة مجدولة</Modal.Title>
        </Modal.Header>

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              {/* الموظف */}
              <Col md={6}>
                <RegisterSelect
                  id="employee_id"
                  label="الموظف"
                  required
                  value={formData.employee_id}
                  onChange={handleChange}
                  parentStyle={{ width: "100%" }}
                  stylee={{ width: "100%" }}
                  options={[
                    { value: "", label: "اختر الموظف..." },
                    ...employees.map((e) => ({
                      value: e.value,
                      label: e.label,
                    })),
                  ]}
                />
              </Col>

              {/* مبلغ السلفة */}
              <Col md={6}>
                <RegisterTextbox
                  id="amount"
                  label="قيمة السلفة"
                  type="number"
                  required
                  min={1}
                  placeholder="مثال: 5000"
                  value={formData.amount}
                  onChange={handleChange}
                  parentStyle={{ width: "100%" }}
                  stylee={{ width: "100%" }}
                />
              </Col>

              {/* عدد الشهور */}
              <Col md={6}>
                <RegisterTextbox
                  id="months"
                  label="عدد الشهور (الأقساط)"
                  type="number"
                  required
                  min={1}
                  placeholder="مثال: 6"
                  value={formData.months}
                  onChange={handleChange}
                  parentStyle={{ width: "100%" }}
                  stylee={{ width: "100%" }}
                />
              </Col>

              {/* تاريخ بداية الخصم */}
              <div className="col-md-6 responParent">
                  <p style={{ width: "100%", textAlign: "right" }} className="mb-1">إلى تاريخ</p>
                  <input
                  style={{width: "100%"}}
                    type="date"
                    className="custom-datepicker mb-3"
                    value={formData.to}
                    onChange={(e) =>
                      setFormData({ ...formData, to: e.target.value })
                    }
                  />
                </div>

              {/* حساب الدفع */}
              <Col md={6} className="mx-auto">
                <RegisterSelect
                  id="payment_account_id"
                  label="حساب الخزينة / البنك"
                  required
                  value={formData.payment_account_id}
                  onChange={handleChange}
                  parentStyle={{ width: "100%" }}
                  stylee={{ width: "100%" }}
                  options={[
                    { value: "", label: "اختر حساب الدفع..." },
                    ...accounts.map((acc) => ({
                      value: acc.value,
                      label: acc.label,
                    })),
                  ]}
                />

                {selectedAccountObj && (
                  <small
                    className="text-success fw-bold"
                    style={{ display: "block", marginTop: "5px" }}
                  >
                    الرصيد الحالي: {formatNum(selectedAccountObj.balance)}
                  </small>
                )}
              </Col>

              {/* ملاحظات */}
              <Col md={6}>
                <RegisterTextbox
                  id="notes"
                  label="ملاحظات"
                  type="text"
                  placeholder="أدخل أي ملاحظات إضافية..."
                  value={formData.notes}
                  onChange={handleChange}
                  parentStyle={{ width: "100%" }}
                  stylee={{ width: "100%" }}
                />
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              إلغاء
            </Button>

            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : "حفظ السلفة"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ================= مودال عرض التفاصيل والجدول للأقساط ================= */}
      <Modal
        show={showDetailsModal}
        onHide={handleCloseDetailsModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>تفاصيل السلفة والأقساط</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAdvance && (
            <div>
              {/* شبكة المعلومات الملخصة */}
              <div
                className="mb-4 p-3 rounded"
                style={{
                  background: "var(--surface-color)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-color)",
                }}
              >
                <Row className="g-3">
                  <Col xs={6} md={4}>
                    <small
                      className="d-block"
                      style={{ color: "var(--text-color)", opacity: 0.7 }}
                    >
                      اسم الموظف
                    </small>
                    <strong>{selectedAdvance.employee?.name}</strong>
                  </Col>
                  <Col xs={6} md={4}>
                    <small
                      className="d-block"
                      style={{ color: "var(--text-color)", opacity: 0.7 }}
                    >
                      إجمالي المبلغ
                    </small>
                    <strong>
                      {formatNum(selectedAdvance.summary?.amount)}
                    </strong>
                  </Col>
                  <Col xs={6} md={4}>
                    <small
                      className="d-block"
                      style={{ color: "var(--text-color)", opacity: 0.7 }}
                    >
                      عدد الشهور
                    </small>
                    <strong>{selectedAdvance.summary?.months}</strong>
                  </Col>
                  <Col xs={6} md={4}>
                    <small
                      className="d-block"
                      style={{ color: "var(--text-color)", opacity: 0.7 }}
                    >
                      القسط الشهري
                    </small>
                    <strong>
                      {formatNum(selectedAdvance.summary?.monthly_amount)}
                    </strong>
                  </Col>
                  <Col xs={6} md={4}>
                    <small
                      className="d-block"
                      style={{ color: "var(--text-color)", opacity: 0.7 }}
                    >
                      تاريخ البداية
                    </small>
                    <strong>{selectedAdvance.summary?.start_date}</strong>
                  </Col>
                  <Col xs={6} md={4}>
                    <small
                      className="d-block"
                      style={{ color: "var(--text-color)", opacity: 0.7 }}
                    >
                      تاريخ النهاية
                    </small>
                    <strong>{selectedAdvance.summary?.end_date}</strong>
                  </Col>
                  <Col xs={12}>
                    <small
                      className="d-block"
                      style={{ color: "var(--text-color)", opacity: 0.7 }}
                    >
                      ملاحظات
                    </small>
                    <span>{selectedAdvance.summary?.notes || "-"}</span>
                  </Col>
                </Row>
              </div>

              {/* جدول الأقساط التفصيلي */}
              <h6
                className="fw-bold mb-3"
                style={{ color: "var(--text-color)" }}
              >
                جدول سداد الأقساط:
              </h6>
              <div className="table-responsive">
                <Table
                  bordered
                  size="sm"
                  className="text-center"
                  style={{
                    
                    borderColor: "var(--border-color)",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        color: "var(--text-color)",
                      }}
                    >
                      <th
                        style={{
                          borderColor: "var(--border-color)",
                          
                        }}
                      >
                        #
                      </th>
                      <th
                        style={{
                          borderColor: "var(--border-color)",
                          
                        }}
                      >
                        مبلغ القسط
                      </th>
                      <th
                        style={{
                          borderColor: "var(--border-color)",
                          
                        }}
                      >
                        تاريخ الاستحقاق
                      </th>
                      <th
                        style={{
                          borderColor: "var(--border-color)",
                          
                        }}
                      >
                        حالة السداد
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedAdvance.installments || []).map((row, i) => (
                      <tr
                        key={row.id}
                        style={{
                          
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <td style={{ borderColor: "var(--border-color)" }}>
                          {i + 1}
                        </td>
                        <td style={{ borderColor: "var(--border-color)" }}>
                          {formatNum(row.amount)}
                        </td>
                        <td style={{ borderColor: "var(--border-color)" }}>
                          {row.due_date}
                        </td>
                        <td style={{ borderColor: "var(--border-color)" }}>
                          {row.status === "paid" ? (
                            <span
                              className="badge"
                              style={{
                                background: "var(--buttonbackground-color)",
                                color: "var(--buttontext-color)",
                              }}
                            >
                              تم السداد
                            </span>
                          ) : (
                            <span
                              className="badge"
                              style={{
                                background: "var(--border-color)",
                                color: "var(--text-color)",
                              }}
                            >
                              غير مدفوع
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            إغلاق
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            <FontAwesomeIcon icon={faPrint} className="me-1" /> طباعة التفاصيل
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CreateEmployeeAdvanceStatic;
