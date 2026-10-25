import { Modal, Form, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import CustomButton from "../../components/CustomButton";
import UploadInput from "../../components/UploadInput"; // 1. تأكد من ضبط مسار استيراد الـ UploadInput الصحيح هنا
import API from "../../api/axiosConfig";

const JobPerformanceEvaluationModal = ({ show, handleClose }) => {
  const [reviewGoal, setReviewGoal] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [emp, setEmp] = useState("");
  const [period, setPeriod] = useState("");
  const [evaluator, setEvaluator] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null); // الـ State الخاصة بالملف المرفق
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const res = await API.post(`/employees`);
        if (res.status === 200) {
          setEmployees(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (show) {
      getEmployees();
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("date", date);
    formData.append("emp", emp);
    formData.append("period", period);
    formData.append("evaluator", evaluator);
    formData.append("reason", reason);
    formData.append("type", type);
    formData.append("description", description);

    // إضافة الملف المرفق إن وجد
    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      const res = await API.post(`evaluation/store`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        handleClose();
        navigate(`/kpievaluation/${res.data.id}`);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.errors) {
        setError(error.response.data.errors);
      }
      setIsSubmitting(false);
    }
  };

  const handleReviewGoalChange = (e) => {
    setReviewGoal(e.target.value);
    setReason(e.target.value);
  };

  return (
    <Modal show={show} onHide={handleClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>إضافة تقييم جديد</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form style={{ direction: "rtl" }} onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <RegisterSelect
                id="emp"
                label="إسم الموظف"
                options={[
                  { value: "0", label: "اختر اسم الموظف" },
                  ...employees.map((item) => ({
                    value: item.id,
                    label: item.name,
                  })),
                ]}
                value={emp}
                onChange={(e) => setEmp(e.target.value)}
                error={error && error.emp}
                parentStyle={{ width: "100%" }}
              />
            </div>
            <div className="col-md-6">
              <RegisterSelect
                id="evaluator"
                label="إسم المسئول"
                options={[
                  { value: "0", label: "اختر اسم المسئول" },
                  ...employees.map((item) => ({
                    value: item.id,
                    label: item.name,
                  })),
                ]}
                value={evaluator}
                onChange={(e) => setEvaluator(e.target.value)}
                error={error && error.evaluator}
                parentStyle={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="responParent col-md-6">
              <p style={{ marginBottom: "10px",textAlign:"start" }}>تاريخ النموذج</p>
              <input
                type="date"
                className="custom-datepicker"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              {error && error.date && (
                <span className="text-danger">{error.date}</span>
              )}
            </div>
            <div className="col-md-6">
              <RegisterTextbox
                id="evaluationtime"
                label="فترة التقييم"
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                error={error && error.period}
                parentStyle={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <RegisterSelect
                id="reviewgoal"
                label="الهدف من التقييم"
                options={[
                  { value: "0", label: "اختر الهدف من التقييم" },
                  { value: "1", label: "تقييم دوري" },
                  { value: "2", label: "فترة تجربة" },
                  { value: "3", label: "ترقية" },
                  { value: "4", label: "علاوة" },
                  { value: "5", label: "اخري" },
                ]}
                value={reviewGoal}
                onChange={handleReviewGoalChange}
                error={error && error.reviewGoal}
                parentStyle={{ width: "100%" }}
              />
            </div>
            <div className="col-md-6">
              <RegisterSelect
                id="reviewtype"
                label="نوع التقييم"
                options={[
                  { value: "0", label: "إختر نوع التقييم" },
                  { value: "1", label: "تقييم الموظف" },
                  { value: "2", label: "تقييم الرئيس المباشر" },
                ]}
                value={type}
                onChange={(e) => setType(e.target.value)}
                error={error && error.type}
                parentStyle={{ width: "100%" }}
              />
            </div>
            <div className="col-md-6">
              <RegisterTextbox
                id="description"
                label="الوصف"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={error && error.description}
                parentStyle={{ width: "100%" }}
              />
            </div>
          </div>

          {reviewGoal === "5" && (
            <div className="row mb-3">
              <div className="col-md-12">
                <RegisterTextbox
                  id="otherreviewgoal"
                  label="الهدف من التقييم (أخرى)"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={error && error.description}
                  parentStyle={{ width: "100%" }}
                />
              </div>
            </div>
          )}

          {/* 2. إضافة UploadInput الجاهز هنا */}
          <div className="row mb-3">
            <div className="col-md-12">
              <UploadInput
                id="evaluation-attachment"
                parentStyle={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
                label="رفع الملف (المرفق)"
                onChange={(e) => setAttachment(e.target.files[0])}
                accept=".pdf,.doc,.docx,image/*"
                error={error && error.attachment}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            {isSubmitting ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <CustomButton text="التالي" />
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default JobPerformanceEvaluationModal;