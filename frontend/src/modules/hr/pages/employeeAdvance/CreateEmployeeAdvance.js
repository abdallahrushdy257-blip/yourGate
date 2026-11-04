import { useState, useMemo, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faTable,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form, Table, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import TableComponent from "../../../../components/TableComponent";
import RegisterSelect from "../../../../components/RegisterSelect";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import API from "../../../../api/axiosConfig";

function CreateEmployeeAdvance() {
  // ================= STATE MANAGEMENT =================
  const [employees, setEmployees] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [allAdvances, setAllAdvances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAdvance, setSelectedAdvance] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employee_id: "",
    payment_account_id: "",
    amount: "",
    months: "",
    start_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // جلب الموظفين وحسابات الخزينة/البنك
  const fetchLookups = useCallback(async () => {
    try {
      const [empRes, accRes] = await Promise.all([
        API.post("employees"),
        API.get("employeewithdrawal/accounts"),
      ]);

      const empList = Array.isArray(empRes.data)
        ? empRes.data
        : empRes.data?.data || [];
      setEmployees(
        empList.map((e) => ({
          value: e.id,
          label: `${e.name}${e.jobname ? ` (${e.jobname})` : ""}`,
        }))
      );

      const accList = Array.isArray(accRes.data)
        ? accRes.data
        : accRes.data?.data || [];
      setAccounts(
        accList.map((a) => ({
          value: a.id,
          label: a.name,
          balance: a.balance || 0,
        }))
      );
    } catch (err) {
      console.error("Error loading lookups:", err);
    }
  }, []);

  // جلب المسحوبات المجدولة
  const fetchAdvances = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("employee-advances");
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setAllAdvances(list);
    } catch (err) {
      console.error("Error loading advances:", err);
      toast.error("فشل في تحميل المسحوبات المجدولة");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  useEffect(() => {
    fetchAdvances();
  }, [fetchAdvances, refreshKey]);

  // دالة تحويل المبالغ لنص منسق
  const formatNum = (num) => {
    if (num === null || num === undefined || isNaN(Number(num))) return "0";
    return Number(num).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
  };

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value, id } = e.target;
    const fieldName = name || id;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
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
  };

  const handleShowDetails = (advance) => {
    setSelectedAdvance(advance);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAdvance(null);
  };

  // حفظ سلفة جديدة وحساب أقساطها عبر الـ API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.employee_id ||
      !formData.amount ||
      !formData.months ||
      !formData.start_date
    ) {
      toast.warning("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        employee_id: formData.employee_id,
        payment_account_id: formData.payment_account_id || null,
        amount: Number(formData.amount),
        months: Number(formData.months),
        start_date: formData.start_date,
        notes: formData.notes || null,
      };

      const res = await API.post("employee-advances/store", payload);
      if (res.data && res.data.success) {
        toast.success(res.data.message || "تم حفظ السلفة وتوليد الأقساط بنجاح");
        handleCloseModal();
        setRefreshKey((k) => k + 1);
      }
    } catch (err) {
      console.error("Error creating advance:", err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حفظ السلفة");
    } finally {
      setIsSubmitting(false);
    }
  };

  // تأكيد حذف السلفة
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await API.delete(`employee-advances/${deleteTarget.id}`);
      if (res.data && res.data.success) {
        toast.success(res.data.message || "تم حذف السلفة بنجاح");
        setDeleteTarget(null);
        setRefreshKey((k) => k + 1);
      }
    } catch (err) {
      console.error("Error deleting advance:", err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حذف السلفة");
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedAccountObj = accounts.find(
    (a) => a.value === Number(formData.payment_account_id)
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

  // خيارات القائمة المنسدلة للإجراءات
  const dropdownOptions = [
    {
      label: "عرض التفاصيل والأقساط",
      action: (id, record) => {
        handleShowDetails(record.original);
      },
    },
    {
      label: "حذف السلفة",
      action: (id, record) => {
        setDeleteTarget(record.original);
      },
    },
  ];

  const tableData = useMemo(() => {
    return allAdvances.map((item) => ({
      id: item.id,
      employeeName: item.employee?.name || "-",
      amountText: formatNum(item.amount),
      months: item.months,
      monthlyAmountText: formatNum(item.monthly_amount),
      start_date: item.start_date,
      original: item,
    }));
  }, [allAdvances]);

  return (
    <div className="p-4 rounded shadow-sm position-relative" dir="rtl">
      <style>
        {`
          .table>:not(caption)>*>*{
            color: var(--text-color) !important;
            background-color: transparent !important;
          }
        `}
      </style>

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
        triggerReload={refreshKey}
      />

      {/* ================= مودال إضافة سلفة ================= */}
      <Modal show={showModal} onHide={handleCloseModal} size="md" centered dir="rtl">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700 }}>
            إضافة سلفة مجدولة
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              {/* الموظف */}
              <Col md={6}>
                <RegisterSelect
                  id="employee_id"
                  label="الموظف"
                  required
                  value={formData.employee_id}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, employee_id: e.target.value }))
                  }
                  parentStyle={{ width: "100%" }}
                  stylee={{ width: "100%" }}
                  options={[
                    { value: "", label: "اختر الموظف..." },
                    ...employees,
                  ]}
                />
              </Col>

              {/* حساب الدفع */}
              <Col md={6}>
                <RegisterSelect
                  id="payment_account_id"
                  label="حساب الخزينة / البنك"
                  value={formData.payment_account_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      payment_account_id: e.target.value,
                    }))
                  }
                  parentStyle={{ width: "100%" }}
                  stylee={{ width: "100%" }}
                  options={[
                    { value: "", label: "اختر حساب الدفع..." },
                    ...accounts,
                  ]}
                />
                {selectedAccountObj && (
                  <small
                    className="text-success fw-bold d-block mt-1"
                    style={{ fontSize: "12px" }}
                  >
                    الرصيد المتاح: {formatNum(selectedAccountObj.balance)} ر.س
                  </small>
                )}
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
              <Col md={6}>
                <Form.Group className="responParent" controlId="advance_start_date" style={{ width: "100%" }}>
                  <Form.Label className="register-label" style={{ direction: "rtl" }}>
                    تاريخ بداية الخصم <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    required
                    className="register-textbox custom-datepicker"
                    style={{
                      width: "100%",
                      height: "45px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, start_date: e.target.value }))
                    }
                  />
                </Form.Group>
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
            <Button variant="secondary" onClick={handleCloseModal} disabled={isSubmitting}>
              إلغاء
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              style={{
                background: "linear-gradient(135deg, #c29a64 0%, #a87e45 100%)",
                border: "none",
                fontWeight: 600,
                padding: "8px 24px",
              }}
            >
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
        dir="rtl"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700 }}>
            تفاصيل السلفة والأقساط
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAdvance && (
            <div>
              {/* شبكة المعلومات الملخصة */}
              <div
                className="mb-4 p-3 rounded"
                style={{
                  background: "var(--surface-color, rgba(194, 154, 100, 0.08))",
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
                    <strong>{selectedAdvance.employee?.name || "-"}</strong>
                  </Col>
                  <Col xs={6} md={4}>
                    <small
                      className="d-block"
                      style={{ color: "var(--text-color)", opacity: 0.7 }}
                    >
                      إجمالي المبلغ
                    </small>
                    <strong>
                      {formatNum(selectedAdvance.summary?.amount || selectedAdvance.amount)} ر.س
                    </strong>
                  </Col>
                  <Col xs={6} md={4}>
                    <small
                      className="d-block"
                      style={{ color: "var(--text-color)", opacity: 0.7 }}
                    >
                      عدد الشهور
                    </small>
                    <strong>{selectedAdvance.summary?.months || selectedAdvance.months} شهور</strong>
                  </Col>
                  <Col xs={6} md={4}>
                    <small
                      className="d-block"
                      style={{ color: "var(--text-color)", opacity: 0.7 }}
                    >
                      القسط الشهري
                    </small>
                    <strong>
                      {formatNum(selectedAdvance.summary?.monthly_amount || selectedAdvance.monthly_amount)} ر.س
                    </strong>
                  </Col>
                  <Col xs={6} md={4}>
                    <small
                      className="d-block"
                      style={{ color: "var(--text-color)", opacity: 0.7 }}
                    >
                      تاريخ البداية
                    </small>
                    <strong>{selectedAdvance.summary?.start_date || selectedAdvance.start_date}</strong>
                  </Col>
                  <Col xs={6} md={4}>
                    <small
                      className="d-block"
                      style={{ color: "var(--text-color)", opacity: 0.7 }}
                    >
                      تاريخ النهاية
                    </small>
                    <strong>{selectedAdvance.summary?.end_date || selectedAdvance.end_date || "-"}</strong>
                  </Col>
                  <Col xs={12}>
                    <small
                      className="d-block"
                      style={{ color: "var(--text-color)", opacity: 0.7 }}
                    >
                      ملاحظات
                    </small>
                    <span>{selectedAdvance.summary?.notes || selectedAdvance.notes || "-"}</span>
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
                      <th>#</th>
                      <th>مبلغ القسط</th>
                      <th>تاريخ الاستحقاق</th>
                      <th>حالة السداد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedAdvance.installments || []).map((row, i) => (
                      <tr
                        key={row.id || i}
                        style={{
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <td>{row.installment_number || i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{formatNum(row.amount)} ر.س</td>
                        <td>{row.due_date}</td>
                        <td>
                          {row.status === "paid" ? (
                            <span
                              className="badge"
                              style={{
                                background: "#2e7d32",
                                color: "#fff",
                                padding: "6px 12px",
                              }}
                            >
                              تم السداد
                            </span>
                          ) : (
                            <span
                              className="badge"
                              style={{
                                background: "rgba(194, 154, 100, 0.2)",
                                color: "var(--text-color)",
                                border: "1px solid var(--border-color)",
                                padding: "6px 12px",
                              }}
                            >
                              قيد الانتظار
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
          <Button
            variant="primary"
            onClick={() => window.print()}
            style={{
              background: "linear-gradient(135deg, #c29a64 0%, #a87e45 100%)",
              border: "none",
              fontWeight: 600,
            }}
          >
            <FontAwesomeIcon icon={faPrint} className="me-1" /> طباعة التفاصيل
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ================= مودال تأكيد الحذف ================= */}
      <Modal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        centered
        size="sm"
        dir="rtl"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.1rem", fontWeight: 700 }}>
            تأكيد الحذف
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          هل أنت متأكد من حذف هذه السلفة نهائياً؟ <br />
          <small className="text-danger">سيتم حذف جدول الأقساط المرتبط بها.</small>
        </Modal.Body>
        <Modal.Footer className="justify-content-center gap-2">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            إلغاء
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "جاري الحذف..." : "حذف نهائي"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CreateEmployeeAdvance;
