import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./addBeneficiary.css";
import { faNotesMedical } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
import CustomButton from "../../components/CustomButton";
import { Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import UploadInput from "../../components/UploadInput";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";

function EditHealthData() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [degree, setDegree] = useState("");
  const [notes, setNotes] = useState("");
  const [trtype, setTrtype] = useState("");
  const [trcost, setTrcost] = useState("");
  const [upload, setUpload] = useState(null);
  const [humancaseId, setHumancaseId] = useState("");

  const [error, setError] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch health data
  const fetchHealthData = async () => {
    try {
      const response = await API.get(`/humancasedetails/show/${id}/health`);
      if (response.data) {
        const health = response.data;
        setName(health.disease_name || "");
        setType(health.disease_type || "");
        setDegree(health.disease_degree || "");
        setNotes(health.notes || "");
        setTrtype(health.treatment_type || "");
        setTrcost(health.treatment_cost || "");
        setHumancaseId(health.humancase_id || "");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError({});

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);
      formData.append("degree", degree);
      formData.append("notes", notes);
      formData.append("trtype", trtype);
      formData.append("trcost", trcost);
      if (upload) {
        formData.append("upload", upload);
      }

      const response = await API.post(
        `/humancasedetails/update/healthdata/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        navigate(`/showHealthData/${humancaseId}`);
      }
    } catch (error) {
      console.error("خطأ في الحفظ:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        setError(error.response.data.errors);
      }
      setSubmitting(false);
    }
  };

  return isLoading ? (
    <TestPreLoader />
  ) : (
    <div className="AddBeneficiary">
      <Title
        title="تعديل البيانات الصحية"
        icon={<FontAwesomeIcon icon={faNotesMedical} />}
      />
      <Form className="AddBeneficiaryContainer" onSubmit={handleSubmit}>
        <div className="AddBeneficiaryContainerRow2 editBeneficiary">
          <RegisterTextbox
            parentStyle={{ width: "30%" }}
            id="name"
            label="اسم المرض"
            type="text"
            stylee={{ width: "55%" }}
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error.name}
          />
          <RegisterTextbox
            parentStyle={{ width: "30%" }}
            id="type"
            label="نوع المرض"
            type="text"
            stylee={{ width: "55%" }}
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            error={error.type}
          />
          <RegisterTextbox
            parentStyle={{ width: "30%" }}
            id="trtype"
            label="نوع العلاج"
            type="text"
            stylee={{ width: "55%" }}
            name="trtype"
            value={trtype}
            onChange={(e) => setTrtype(e.target.value)}
            error={error.trtype}
          />
          <RegisterTextbox
            parentStyle={{ width: "30%" }}
            id="trcost"
            label="تكلفة العلاج"
            type="number"
            stylee={{ width: "55%" }}
            name="trcost"
            value={trcost}
            onChange={(e) => setTrcost(e.target.value)}
            error={error.trcost}
          />
          <RegisterTextbox
            parentStyle={{ width: "30%" }}
            id="notes"
            label="ملاحظات"
            type="text"
            stylee={{ width: "55%" }}
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            error={error.notes}
          />
          <RegisterTextbox
            id="degree"
            parentStyle={{ width: "30%" }}
            label="خطورة المرض"
            type="text"
            stylee={{ width: "100%" }}
            name="degree"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            error={error.degree}
          />
        </div>

        <UploadInput
          id="reportImage"
          parentStyle={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
          }}
          label="صورة التقارير الصحية"
          name="upload"
          onChange={(e) => setUpload(e.target.files[0])}
        />
        {error.upload && <span className="error">{error.upload[0]}</span>}

        <div className="AddBeneficiaryContainerRow">
          {isSubmitting ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <CustomButton text="حفظ" type="submit" />
          )}
        </div>
      </Form>
    </div>
  );
}

export default EditHealthData;
