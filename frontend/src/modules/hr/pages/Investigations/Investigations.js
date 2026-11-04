import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGavel } from "@fortawesome/free-solid-svg-icons";
import { Form, Spinner, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import RegisterTextarea from "../../../../components/RegisterTextarea";
import UploadInput from "../../../../components/UploadInput";
import RegisterSelect from "../../../../components/RegisterSelect";
import API from "../../../../api/axiosConfig";
import "./Investigations.css";

function InvestigationsModal({
  show,
  handleClose,
  employeeId,
  onSuccess,
  initialData = null,
}) {
  const [reason, setReason] = useState("");
  const [investigatorId, setInvestigatorId] = useState("");
  const [result, setResult] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [description, setDescription] = useState("");
  const [attach, setAttach] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // جلب قائمة الموظفين
  useEffect(() => {
    if (show) {
      hrService
        .getEmployees()
        .then((res) => {
          const data = res.data?.data || res.data || [];
          setEmployees(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Error fetching employees:", err));
    }
  }, [show]);

  // تعبئة البيانات في حالة التعديل أو التهيئة
  useEffect(() => {
    if (show) {
      if (initialData) {
        setReason(initialData.reason || "");
        setInvestigatorId(
          initialData.investigator_id || initialData.investigator || ""
        );
        setResult(initialData.result || "");
        setDate(
          initialData.date
            ? initialData.date.substr(0, 10)
            : new Date().toISOString().substr(0, 10)
        );
        setDescription(initialData.description || "");
        setSelectedEmployee(initialData.employee_id || employeeId || "");
        setAttach(null);
      } else {
        setReason("");
        setInvestigatorId("");
        setResult("");
        setDate(new Date().toISOString().substr(0, 10));
        setDescription("");
        setAttach(null);
        setSelectedEmployee(employeeId || "");
      }
      setError({});
    }
  }, [show, initialData, employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    const targetEmpId = employeeId || selectedEmployee;
    if (!targetEmpId) {
      toast.warning("يرجى اختيار الموظف المحقق معه");
      return;
    }

    setIsSubmitting(true);

    const mForm = new FormData();
    mForm.append("employee_id", targetEmpId);
    mForm.append("investigator_id", investigatorId || "");
    mForm.append("reason", reason || "");
    mForm.append("result", result || "");
    mForm.append("date", date);
    mForm.append("description", description || "");
    if (attach) {
      mForm.append("attach", attach);
    }

    try {
      const response = initialData
        ? await hrService.updateInvestigation(initialData.id, mForm)
        : await hrService.createInvestigation(mForm);

      if (response.status === 200 || response.status === 201 || response.data?.success) {
        toast.success(initialData ? "تم تعديل التحقيق بنجاح" : "تم حفظ التحقيق الإداري بنجاح");
        setIsSubmitting(false);
        handleClose();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error("Error saving investigation:", err);
      setIsSubmitting(false);
      if (err.response?.data?.errors) {
        setError(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || "حدث خطأ أثناء حفظ التحقيق");
      }
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      dir="rtl"
      className="investigations-modal"
    >
      <Modal.Header
        closeButton
        style={{
          borderBottom: "1.5px solid rgba(194, 154, 100, 0.25)",
          padding: "16px 24px",
          background: "var(--surface-color, #fff)",
        }}
      >
        <Modal.Title
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "var(--main-color, #493d2c)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FontAwesomeIcon icon={faGavel} style={{ color: "#c29a64" }} />
          <span>{initialData ? "تعديل تحقيق إداري" : "إضافة تحقيق إداري جديد"}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-3 p-md-4" style={{ background: "var(--background-color, #fdfbf9)" }}>
        <Form onSubmit={handleSubmit} style={{ direction: "rtl" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {/* المحقق معه */}
            <div>
              <RegisterSelect
                id="employee_id"
                label="المحقق معه *"
                parentStyle={{ width: "100%" }}
                stylee={{ width: "100%" }}
                options={[
                  { value: "", label: "اختر الموظف المحقق معه..." },
                  ...employees.map((emp) => ({
                    value: emp.id,
                    label: emp.name + (emp.jobname ? ` (${emp.jobname})` : ""),
                  })),
                ]}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                value={selectedEmployee}
                error={error && error.employee_id}
              />
            </div>

            {/* المحقق */}
            <div>
              <RegisterSelect
                id="investigator_id"
                label="المُحقِّق المسؤول *"
                parentStyle={{ width: "100%" }}
                stylee={{ width: "100%" }}
                options={[
                  { value: "", label: "اختر المحقق..." },
                  ...employees.map((emp) => ({
                    value: emp.id,
                    label: emp.name + (emp.jobname ? ` (${emp.jobname})` : ""),
                  })),
                ]}
                onChange={(e) => setInvestigatorId(e.target.value)}
                value={investigatorId}
                error={error && (error.investigator_id || error.investigator)}
              />
            </div>

            {/* سبب التحقيق */}
            <div>
              <RegisterTextbox
                parentStyle={{ width: "100%" }}
                id="reason"
                label="سبب التحقيق"
                type="text"
                placeholder="أدخل سبب أو موضوع التحقيق..."
                stylee={{ width: "100%" }}
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                error={error && error.reason}
              />
            </div>

            {/* النتيجة */}
            <div>
              <RegisterTextbox
                parentStyle={{ width: "100%" }}
                id="result"
                label="النتيجة / الإجراء المتخذ"
                type="text"
                placeholder="النتيجة أو القرار الإداري..."
                stylee={{ width: "100%" }}
                name="result"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                error={error && error.result}
              />
            </div>

            {/* التاريخ */}
            <div>
              <Form.Group className="responParent" controlId="investigation_date" style={{ width: "100%" }}>
                <Form.Label className="register-label" style={{ direction: "rtl", marginBottom: "6px" }}>
                  تاريخ التحقيق <span style={{ color: "red" }}>*</span>
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
            </div>

            {/* إرفاق مستند أو صورة */}
            <div>
              <UploadInput
                id="investigationAttachment"
                parentStyle={{ width: "100%" }}
                label="إرفاق مستند أو محضر"
                name="attach"
                defaultUrl={initialData?.attachment_url || initialData?.attach}
                onChange={(e) => setAttach(e.target.files[0])}
                error={error && error.attach}
              />
            </div>

            {/* تفاصيل ووصف التحقيق */}
            <div style={{ gridColumn: "span 2" }}>
              <RegisterTextarea
                id="description"
                label="تفاصيل ومحضر التحقيق"
                parentStyle={{ width: "100%" }}
                stylee={{ height: "90px", width: "100%" }}
                placeholder="أدخل ملخص الجلسة وأقوال المحقق معه والتوصيات..."
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={error && error.description}
              />
            </div>
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              gap: "12px",
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(194, 154, 100, 0.15)",
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              className="btn rounded-pill px-4"
              style={{
                border: "1.5px solid rgba(194, 154, 100, 0.4)",
                color: "var(--text-color, #493d2c)",
                background: "transparent",
                fontWeight: 600,
                fontSize: "14px",
                padding: "8px 24px",
              }}
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn rounded-pill px-5"
              style={{
                background: "linear-gradient(135deg, #c29a64 0%, #a87e45 100%)",
                color: "#fff",
                border: "none",
                fontWeight: 700,
                fontSize: "15px",
                padding: "8px 36px",
                boxShadow: "0 4px 14px rgba(168, 126, 69, 0.35)",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "all 0.25s ease",
              }}
            >
              {isSubmitting ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Spinner animation="border" size="sm" />
                  <span>جاري الحفظ...</span>
                </div>
              ) : (
                <span>{initialData ? "حفظ التعديلات" : "حفظ التحقيق"}</span>
              )}
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default InvestigationsModal;
