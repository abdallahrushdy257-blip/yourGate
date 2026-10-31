import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./leavetype.css";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import { Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Title from "../../../../components/title";
import CustomButton from "../../../../components/CustomButton";
import { useEffect, useState } from "react";
import { hrService } from "../../services/hrService";

function EditLeave() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const res = await hrService.getVacation(id);
        if (res.status === 200) {
          const data = res.data;
          setName(data.name || "");
          setDescription(data.description || "");
          setDays(data.days || 0);
        }
      } catch (err) {
        console.error(err);
        setMessage("تعذر تحميل بيانات الإجازة");
      }
    };
    fetchLeave();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const mFormData = new FormData();
    mFormData.append("id", id);
    mFormData.append("name", name);
    mFormData.append("description", description);
    mFormData.append("days", days);

    try {
      const res = await hrService.updateVacation(mFormData);
      if (res.status === 200) {
        navigate("/hrreport/vacdetails");
      } else {
        setError(res.data.errors);
      }
    } catch (err) {
      setError(err.response?.data?.errors || {});
      setMessage(err.response?.data?.message || "حدث خطأ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="investigations">
      <Title title="تعديل إجازة" icon={<FontAwesomeIcon icon={faPlusCircle} />} />

      <Form
        className="global-form-container w-25"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <RegisterTextbox
          parentStyle={{ marginBottom: "20px" }}
          id="name"
          label="اسم الإجازة"
          type="text"
          stylee={{ width: "30%" }}
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error?.name}
        />

        <RegisterTextbox
          parentStyle={{ marginBottom: "20px" }}
          id="leaveDesc"
          label="وصف الإجازة"
          type="text"
          stylee={{ width: "30%" }}
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={error?.description}
        />

        <RegisterTextbox
          parentStyle={{}}
          id="days"
          label="عدد الايام"
          type="number"
          stylee={{ width: "40%" }}
          name="days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          error={error?.days}
        />

        {isSubmitting ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <CustomButton text="حفظ" className="addClietBtn" />
          </div>
        )}

        {message && <div className="error">{message}</div>}
      </Form>
    </div>
  );
}

export default EditLeave;
