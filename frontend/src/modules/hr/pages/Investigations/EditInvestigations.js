import "./Investigations.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../../components/title";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import { Form, Spinner } from "react-bootstrap";
import CustomButton from "../../../../components/CustomButton";
import RegisterTextarea from "../../../../components/RegisterTextarea";
import UploadInput from "../../../../components/UploadInput";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hrService } from "../../services/hrService";

function EditInvestigations() {
  const [reason, setReason] = useState("");
  const [investigator, setInvestigator] = useState("");
  const [result, setResult] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [description, setDescription] = useState("");
  const [attach, setAttach] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvestigation = async () => {
      try {
        const res = await hrService.getInvestigation(id);
        const data = res.data;

        setReason(data.reason || "");
        setInvestigator(data.investigator || "");
        setResult(data.result || "");
        setDate(data.date || new Date().toISOString().substr(0, 10));
        setDescription(data.description || "");
        setEmployeeId(data.employee_id || "");
      } catch (err) {
        console.error(err);
        setMessage("تعذر تحميل بيانات التحقيق");
      }
    };

    fetchInvestigation();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const mForm = new FormData();
    mForm.append("id", id);
    mForm.append("reason", reason);
    mForm.append("investigator", investigator);
    mForm.append("result", result);
    mForm.append("date", date);
    mForm.append("description", description);
    mForm.append("employee_id", employeeId);

    if (attach) {
      mForm.append("attach", attach);
    }

    try {
      const response = await hrService.updateInvestigation(id, mForm);
      if (response.status === 200) {
        navigate("/hrreport/investigations");
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
      <Title title="تعديل تحقيق" icon={<FontAwesomeIcon icon={faEdit} />} />

      <Form
        className="investigationsContainer"
        onSubmit={handleUpdate}
        encType="multipart/form-data"
      >
        <div className="investRow">
          <RegisterTextbox
            parentStyle={{ width: "25%" }}
            id="reason"
            label="السبب"
            type="text"
            stylee={{ width: "30%" }}
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={error.reason}
          />
          <RegisterTextbox
            parentStyle={{ width: "25%" }}
            id="investigator"
            label="المحقق"
            type="text"
            stylee={{ width: "30%" }}
            name="investigator"
            value={investigator}
            onChange={(e) => setInvestigator(e.target.value)}
            error={error.investigator}
          />
        </div>

        <div className="investRow">
          <RegisterTextbox
            parentStyle={{ width: "25%" }}
            id="result"
            label="النتيجة"
            type="text"
            stylee={{ width: "40%" }}
            name="result"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            error={error.result}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "25%",
            }}
          >
            <p style={{ marginBottom: "10px" }}>التاريخ </p>
            <input
              type="date"
              id="date"
              onChange={(e) => setDate(e.target.value)}
              value={date}
              className="custom-datepicker"
              style={{ width: "100%" }}
            />
          </div>
          {error.date && <div className="error">{error.date}</div>}
        </div>

        <RegisterTextarea
          id="description2"
          label="الوصف"
          parentStyle={{ width: "30%", marginBottom: "20px" }}
          stylee={{ height: "100px" }}
          rows={5}
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={error.description}
        />

        <UploadInput
          id="documentUpload"
          parentStyle={{ marginBottom: "20px", display: "unset" }}
          label="إرفاق صورة"
          name="attach"
          onChange={(e) => setAttach(e.target.files[0])}
          error={error.attach}
        />

        {isSubmitting ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <CustomButton text="تحديث" className="addClientBtn" />
        )}
      </Form>
    </div>
  );
}

export default EditInvestigations;
