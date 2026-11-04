import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faCut, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Form, Spinner, Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import API from "../../api/axiosConfig";
import "./Discounts.css";

function DiscountsModal({ show, handleClose, employeeId, onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState(employeeId || "");
  const [selectedValue, setSelectedValue] = useState("1"); // 0 = أيام, 1 = مال
  const [type, setType] = useState("0"); // 0 = مكافأة, 1 = خصم
  const [reason, setReason] = useState("");
  const [amountType, setAmountType] = useState(1);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [error, setError] = useState({});
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [account, setAccount] = useState([]);
  const [accounttree, setAccounttree] = useState("");

  const handleSelectChange = (e) => {
    const val = e.target.value;
    setSelectedValue(val);
    setAmountType(Number(val));
  };

  const getLookups = async () => {
    try {
      const [empRes, accRes] = await Promise.all([
        API.post("employees"),
        API.get("transactions/components/donations"),
      ]);

      const empList = Array.isArray(empRes.data) ? empRes.data : empRes.data?.data || [];
      setEmployees(empList.map((emp) => ({
        value: emp.id,
        label: `${emp.name}${emp.jobname ? ` (${emp.jobname})` : ""}`,
      })));

      const accList = Array.isArray(accRes.data)
        ? accRes.data
        : (accRes.data?.data || []);
      setAccount(accList);
    } catch (err) {
      console.error("Error loading lookups in DiscountsModal:", err);
    }
  };

  useEffect(() => {
    if (show) {
      getLookups();
      setSelectedEmpId(employeeId || "");
      setType("0");
      setReason("");
      setAmountType(1);
      setSelectedValue("1");
      setAmount("");
      setDate(new Date().toISOString().substr(0, 10));
      setDescription("");
      setError({});
    }
  }, [show, employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    const finalEmpId = employeeId || selectedEmpId;
    if (!finalEmpId) {
      toast.warning("يرجى اختيار الموظف");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.warning("يرجى إدخال القيمة بشكل صحيح");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      employee_id: finalEmpId,
      id: finalEmpId,
      type: Number(type),
      reason: reason || (type === "0" ? "مكافأة وحوافز" : "خصم راتب"),
      amounttype: Number(amountType),
      amount: Number(amount),
      date: date,
      description: description || null,
      component: accounttree || null,
    };

    try {
      const res = await API.post("/salaryactions/store", payload);
      if (res.data && (res.data.success || res.status === 200 || res.status === 201)) {
        toast.success(res.data.message || "تم حفظ المعاملة بنجاح");
        handleClose();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          setError(err.response.data.errors);
        }
        toast.error(err.response.data.message || "حدث خطأ أثناء الحفظ");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeSelect = (newType) => {
    setType(newType);
    setReason("");
  };

  return (
    <Modal show={show} onHide={handleClose} size="md" centered dir="rtl" className="discounts-modal">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700 }}>
          {type === "0" ? "إضافة مكافأة جديدة" : "إضافة خصم جديد"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-3 p-md-4">
        <Form onSubmit={handleSubmit} style={{ direction: "rtl" }}>
          {/* تبويبات النوع (Pill Tabs Switcher) */}
          <div className="mb-4">
            <div
              className="d-flex p-1 rounded-pill"
              style={{
                background: "rgba(194, 154, 100, 0.12)",
                border: "1.5px solid rgba(194, 154, 100, 0.35)",
                maxWidth: "320px",
                margin: "0 auto",
              }}
            >
              <button
                type="button"
                onClick={() => handleTypeSelect("0")}
                className="btn d-flex align-items-center justify-content-center gap-2 flex-grow-1 rounded-pill"
                style={{
                  background:
                    type === "0"
                      ? "linear-gradient(135deg, #c29a64 0%, #a87e45 100%)"
                      : "transparent",
                  color: type === "0" ? "#fff" : "var(--text-color, #493d2c)",
                  fontWeight: type === "0" ? 700 : 600,
                  fontSize: "14px",
                  padding: "8px 16px",
                  border: "none",
                  boxShadow:
                    type === "0"
                      ? "0 4px 10px rgba(168, 126, 69, 0.35)"
                      : "none",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon icon={faGift} />
                <span>مكافأة</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSelect("1")}
                className="btn d-flex align-items-center justify-content-center gap-2 flex-grow-1 rounded-pill"
                style={{
                  background:
                    type === "1"
                      ? "linear-gradient(135deg, #c29a64 0%, #a87e45 100%)"
                      : "transparent",
                  color: type === "1" ? "#fff" : "var(--text-color, #493d2c)",
                  fontWeight: type === "1" ? 700 : 600,
                  fontSize: "14px",
                  padding: "8px 16px",
                  border: "none",
                  boxShadow:
                    type === "1"
                      ? "0 4px 10px rgba(168, 126, 69, 0.35)"
                      : "none",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon icon={faCut} />
                <span>خصم</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {/* اختيار الموظف إذا لم يكن محدداً مسبقاً */}
            {!employeeId && (
              <div style={{ gridColumn: "span 2" }}>
                <RegisterSelect
                  id="emp_select"
                  label="الموظف"
                  required
                  options={[
                    { value: "", label: "اختر الموظف..." },
                    ...employees,
                  ]}
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  parentStyle={{ width: "100%" }}
                  stylee={{ width: "100%" }}
                />
              </div>
            )}

            {/* السبب */}
            {type === "0" ? (
              <RegisterSelect
                id="award_reason"
                label="السبب / البند"
                parentStyle={{ width: "100%" }}
                stylee={{ width: "100%" }}
                options={[
                  { value: "", label: "اختر بند المكافأة..." },
                  { value: "بدل السكن", label: "بدل السكن" },
                  { value: "بدل المواصلات", label: "بدل المواصلات" },
                  { value: "بدل اتصال", label: "بدل اتصال" },
                  { value: "بدل إعاشة", label: "بدل إعاشة" },
                  { value: "العمل الإضافي", label: "العمل الإضافي" },
                  { value: "مكافآت وحوافز سنوية", label: "مكافآت وحوافز سنوية" },
                  { value: "مكافآت وحوافز موسمية", label: "مكافآت وحوافز موسمية" },
                  { value: "مكافأة تميز وإنجاز", label: "مكافأة تميز وإنجاز" },
                ]}
                onChange={(e) => setReason(e.target.value)}
                value={reason}
              />
            ) : (
              <RegisterSelect
                id="deduction_reason"
                label="السبب / البند"
                parentStyle={{ width: "100%" }}
                stylee={{ width: "100%" }}
                options={[
                  { value: "", label: "اختر نوع الخصم..." },
                  { value: "خصومات الرواتب", label: "خصومات الرواتب" },
                  { value: "خصم غياب بدون إذن", label: "خصم غياب بدون إذن" },
                  { value: "خصم تأخير متكرر", label: "خصم تأخير متكرر" },
                  { value: "جزاء إداري", label: "جزاء إداري" },
                  { value: "خصومات تشغيلية", label: "خصومات تشغيلية" },
                ]}
                onChange={(e) => setReason(e.target.value)}
                value={reason}
              />
            )}

            {/* الوصف */}
            <RegisterTextbox
              parentStyle={{ width: "100%" }}
              id="description"
              label="الوصف / الملاحظات"
              type="text"
              placeholder="أدخل تفاصيل إضافية..."
              stylee={{ width: "100%" }}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />

            {/* حقل اليوم (التاريخ) */}
            <Form.Group className="responParent" controlId="action_date" style={{ width: "100%" }}>
              <Form.Label className="register-label" style={{ direction: "rtl" }}>
                التاريخ <span style={{ color: "red" }}>*</span>
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>

            {/* نوع القيمة */}
            <RegisterSelect
              id="amount_type"
              label="نوع القيمة"
              parentStyle={{ width: "100%" }}
              stylee={{ width: "100%" }}
              options={[
                { value: "1", label: "مبلغ مالي (ر.س)" },
                { value: "0", label: "أيام عمل" },
              ]}
              onChange={handleSelectChange}
              value={selectedValue}
            />

            {/* القيمة */}
            <div style={{ gridColumn: "span 2" }}>
              <RegisterTextbox
                parentStyle={{ width: "100%" }}
                id="amount"
                label={selectedValue === "0" ? "عدد الأيام" : "القيمة المالية (ر.س)"}
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder={selectedValue === "0" ? "مثال: 1 أو 2" : "مثال: 500"}
                stylee={{ width: "100%" }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* حساب الترحيل */}
            <div style={{ gridColumn: "span 2" }}>
              <RegisterSelect
                id="account_tree"
                label="حساب ترحيل الراتب"
                parentStyle={{ width: "100%" }}
                stylee={{ width: "100%" }}
                options={[
                  { value: "", label: "اختر حساب الترحيل (اختياري)..." },
                  ...(Array.isArray(account) ? account : []).map((acc) => ({
                    value: acc.id || acc.account_number || acc.value,
                    label: acc.name || acc.label,
                  })),
                ]}
                onChange={(e) => setAccounttree(e.target.value)}
                value={accounttree}
              />
            </div>
          </div>

          <Modal.Footer className="mt-4 px-0 pb-0">
            <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: "linear-gradient(135deg, #c29a64 0%, #a87e45 100%)",
                border: "none",
                fontWeight: 600,
                padding: "8px 26px",
              }}
            >
              {isSubmitting ? <Spinner animation="border" size="sm" /> : "حفظ"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default DiscountsModal;