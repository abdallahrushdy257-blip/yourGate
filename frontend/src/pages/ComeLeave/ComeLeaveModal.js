import { Modal, Form, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterRadio from "../../components/Radio";
import CustomButton from "../../components/CustomButton";
import API from "../../api/axiosConfig";

const ComeLeaveModal = ({ show, handleClose, onSuccess }) => {
  const [registerType, setRegisterType] = useState("يدوي");
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  
  // 1. إضافة State للتاريخ والوقت
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const res = await API.post("employees");
        if (res.status === 200) {
          setEmployees(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (show) {
      getEmployees();

      // 2. تعيين التاريخ والوقت الحالي تلقائياً عند فتح المودال
      const now = new Date();
      
      // التنسيق: YYYY-MM-DD
      const currentDate = now.toISOString().split("T")[0];
      
      // التنسيق: HH:MM
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${hours}:${minutes}`;

      setDate(currentDate);
      setTime(currentTime);
    }
  }, [show]);

  const handleRadioChange = (e) => {
    setRegisterType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage("");

    const mForm = new FormData();
    mForm.append("name", name);
    mForm.append("type", type);
    
    // 3. إرسال التاريخ والوقت للـ Backend
    mForm.append("date", date);
    mForm.append("time", time);

    try {
      const res = await API.post("attendances/store", mForm);
      if (res.status === 200) {
        setMessage(res.data.message || "تم الحفظ بنجاح");
        setTimeout(() => {
          handleClose();
          if (onSuccess) onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setError(error.response.data.errors);
        setMessage(error.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <Modal show={show} onHide={handleClose} size="md" centered className="comeleave-modal">
    <Modal.Header closeButton>
      <Modal.Title className="w-100 text-center text-lg-end">تسجيل حضور وانصراف</Modal.Title>
    </Modal.Header>
    <Modal.Body className="p-3 p-md-4">
      <Form onSubmit={handleSubmit} style={{ direction: "rtl" }}>
        
        {/* اختيار نوع التسجيل */}
        <div className="radioContainer mb-4 d-flex flex-column align-items-center align-items-lg-start">
          <h5 className="mb-3">نوع التسجيل</h5>
          <div className="d-flex gap-4 justify-content-center">
            <RegisterRadio
              label="يدوي"
              value="يدوي"
              checked={registerType === "يدوي"}
              onChange={handleRadioChange}
            />
            <RegisterRadio
              label="QR"
              value="QR"
              checked={registerType === "QR"}
              onChange={handleRadioChange}
            />
          </div>
        </div>

        {message && (
          <div className={`alert ${error ? "alert-danger" : "alert-success"} text-center`}>
            {message}
          </div>
        )}

        {/* شبكة المدخلات: col-12 للفون والتابلت (تحت بعض) و col-lg-6 للشاشات الكبيرة */}
        <div className="row justify-content-center">
          {registerType === "يدوي" ? (
            <div className="col-12 col-lg-6 mb-3 d-flex justify-content-center">
              <RegisterSelect
                id="empName"
                label="إسم الموظف"
                options={[
                  { value: "", label: " اختر موظفا" },
                  ...employees.map((emp) => ({
                    value: emp.id,
                    label: emp.name,
                  })),
                ]}
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={error && error.name}
                parentStyle={{ width: "100%" }}
              />
            </div>
          ) : (
            <div className="col-12 col-lg-6 mb-3 d-flex justify-content-center">
              <RegisterTextbox
                id="QR"
                label="QR Code"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={error && error.name}
                autoFocus
                parentStyle={{ width: "100%" }}
              />
            </div>
          )}

          <div className="col-12 col-lg-6 mb-3 d-flex justify-content-center">
            <RegisterSelect
              id="type"
              label="حضور - إنصراف"
              options={[
                { value: "", label: "إختر" },
                { value: "1", label: "حضور" },
                { value: "2", label: "إنصراف" },
              ]}
              value={type}
              onChange={(e) => setType(e.target.value)}
              error={error && error.type}
              parentStyle={{ width: "100%" }}
            />
          </div>

          {/* 4. حقل التاريخ */}
          <div className="col-12 col-lg-6 mb-3 d-flex justify-content-center">
            <div className="responParent" style={{ width: "100%" }}>
              <p style={{ marginBottom: "10px", textAlign: "right", width: "100%" }} className="mb-1">
                التاريخ
              </p>
              <input
                type="date"
                className="custom-datepicker mb-3"
                style={{ width: "100%", boxSizing: "border-box" }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* 5. حقل الوقت */}
          <div className="col-12 col-lg-6 mb-3 d-flex justify-content-center">
            <RegisterTextbox
              id="time"
              label="الوقت"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              error={error && error.time}
              parentStyle={{ width: "100%" }}
            />
          </div>
        </div>

        {/* زر الحفظ متمركز في المنتصف للشاشات الصغيرة وفي اليمين للكمبيوتر */}
        <div className="d-flex justify-content-center justify-content-lg-center mt-4">
          {isSubmitting ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <CustomButton text="حفظ" />
          )}
        </div>
      </Form>
    </Modal.Body>
  </Modal>
);
};

export default ComeLeaveModal;