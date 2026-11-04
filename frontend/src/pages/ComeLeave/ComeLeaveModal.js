import { Modal, Form, Spinner, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKeyboard, faQrcode } from "@fortawesome/free-solid-svg-icons";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterTextbox from "../../components/RegisterTextBox";
import API from "../../api/axiosConfig";
import { toast } from "react-toastify";

const ComeLeaveModal = ({ show, handleClose, onSuccess }) => {
  const [registerType, setRegisterType] = useState("يدوي");
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("1"); // 1 = حضور, 2 = إنصراف
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const res = await API.post("employees");
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setEmployees(list);
      } catch (err) {
        console.error("Error loading employees:", err);
      }
    };

    if (show) {
      getEmployees();

      const now = new Date();
      const currentDate = now.toISOString().split("T")[0];
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${hours}:${minutes}`;

      setDate(currentDate);
      setTime(currentTime);
      setType("1");
      setName("");
      setError(null);
    }
  }, [show]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!name) {
      toast.error(registerType === "يدوي" ? "يرجى اختيار الموظف" : "يرجى إدخال QR للموظف");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const mForm = new FormData();
    mForm.append("name", name);
    mForm.append("type", type);
    mForm.append("date", date);
    mForm.append("time", time);
    mForm.append("method", registerType);

    try {
      const res = await API.post("/attendances/store", mForm);
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data?.message || "تم تسجيل الحضور والانصراف بنجاح");
        handleClose();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.errors);
        toast.error(err.response.data.message || "حدث خطأ أثناء التسجيل");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="md" centered className="comeleave-modal" dir="rtl">
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-end" style={{ fontSize: "1.15rem", fontWeight: 700 }}>
          تسجيل حضور وانصراف
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-3 p-md-4">
        <Form onSubmit={handleSubmit} style={{ direction: "rtl" }}>
          {/* تبويبات نوع التسجيل */}
          <div className="mb-4">
            <div
              className="d-flex p-1 rounded-pill"
              style={{
                background: "rgba(194, 154, 100, 0.12)",
                border: "1.5px solid rgba(194, 154, 100, 0.35)",
                maxWidth: "340px",
                margin: "0 auto",
              }}
            >
              <button
                type="button"
                onClick={() => setRegisterType("يدوي")}
                className="btn d-flex align-items-center justify-content-center gap-2 flex-grow-1 rounded-pill"
                style={{
                  background:
                    registerType === "يدوي"
                      ? "linear-gradient(135deg, #c29a64 0%, #a87e45 100%)"
                      : "transparent",
                  color: registerType === "يدوي" ? "#fff" : "var(--text-color, #493d2c)",
                  fontWeight: registerType === "يدوي" ? 700 : 600,
                  fontSize: "14px",
                  padding: "8px 16px",
                  border: "none",
                  boxShadow:
                    registerType === "يدوي"
                      ? "0 4px 10px rgba(168, 126, 69, 0.35)"
                      : "none",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon icon={faKeyboard} />
                <span>تسجيل يدوي</span>
              </button>

              <button
                type="button"
                onClick={() => setRegisterType("QR")}
                className="btn d-flex align-items-center justify-content-center gap-2 flex-grow-1 rounded-pill"
                style={{
                  background:
                    registerType === "QR"
                      ? "linear-gradient(135deg, #c29a64 0%, #a87e45 100%)"
                      : "transparent",
                  color: registerType === "QR" ? "#fff" : "var(--text-color, #493d2c)",
                  fontWeight: registerType === "QR" ? 700 : 600,
                  fontSize: "14px",
                  padding: "8px 16px",
                  border: "none",
                  boxShadow:
                    registerType === "QR"
                      ? "0 4px 10px rgba(168, 126, 69, 0.35)"
                      : "none",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon icon={faQrcode} />
                <span>مسح كود QR</span>
              </button>
            </div>
          </div>

          <div className="row justify-content-center">
            {registerType === "يدوي" ? (
              <div className="col-12 col-lg-6 mb-3">
                <RegisterSelect
                  id="empName"
                  label="إسم الموظف"
                  options={[
                    { value: "", label: "اختر موظفاً..." },
                    ...employees.map((emp) => ({
                      value: emp.id,
                      label: `${emp.name}${emp.jobname ? ` (${emp.jobname})` : ""}`,
                    })),
                  ]}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={error && error.name}
                  parentStyle={{ width: "100%" }}
                  stylee={{ width: "100%" }}
                />
              </div>
            ) : (
              <div className="col-12 col-lg-6 mb-3">
                <RegisterTextbox
                  id="QR"
                  label="QR Code أو الرقم القومي"
                  type="text"
                  placeholder="امسح أو أدخل كود الموظف..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={error && error.name}
                  autoFocus
                  parentStyle={{ width: "100%" }}
                  stylee={{ width: "100%" }}
                />
              </div>
            )}

            <div className="col-12 col-lg-6 mb-3">
              <RegisterSelect
                id="type"
                label="حضور - إنصراف"
                options={[
                  { value: "1", label: "حضور" },
                  { value: "2", label: "إنصراف" },
                ]}
                value={type}
                onChange={(e) => setType(e.target.value)}
                error={error && error.type}
                parentStyle={{ width: "100%" }}
                stylee={{ width: "100%" }}
              />
            </div>

            {/* حقل التاريخ */}
            <div className="col-12 col-lg-6 mb-3">
              <Form.Group className="responParent" controlId="attendance_date" style={{ width: "100%" }}>
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
            </div>

            {/* حقل الوقت */}
            <div className="col-12 col-lg-6 mb-3">
              <RegisterTextbox
                id="time"
                label="الوقت"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                error={error && error.time}
                parentStyle={{ width: "100%" }}
                stylee={{ width: "100%" }}
              />
            </div>
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="d-flex justify-content-center gap-3 mt-4">
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
                padding: "8px 28px",
              }}
            >
              {isSubmitting ? <Spinner animation="border" size="sm" /> : "حفظ"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ComeLeaveModal;