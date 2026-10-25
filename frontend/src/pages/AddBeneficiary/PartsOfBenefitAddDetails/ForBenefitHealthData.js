import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import "../addBeneficiary.css";
import {
  faNotesMedical,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../components/RegisterTextBox";
import CustomButton from "../../../components/CustomButton";
import { Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import UploadInput from "../../../components/UploadInput";
import API from "../../../api/axiosConfig";

function ForBenefitHealthData({ onNext }) {
  const { id } = useParams();

  const [illnesses, setIllnesses] = useState([
    {
      name: "",
      type: "",
      degree: "",
      notes: "",
      trtype: "",
      trcost: "",
    },
  ]);

  const [upload, setUpload] = useState(null);
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===============================
     Handlers
  =============================== */

  const handleChange = (index, field, value) => {
    const updated = [...illnesses];
    updated[index][field] = value;
    setIllnesses(updated);
  };

  const handleAddIllness = () => {
    setIllnesses([
      ...illnesses,
      {
        name: "",
        type: "",
        degree: "",
        notes: "",
        trtype: "",
        trcost: "",
      },
    ]);
  };

  const handleRemoveIllness = () => {
    if (illnesses.length > 1) {
      setIllnesses(illnesses.slice(0, -1));
    }
  };

  /* ===============================
     Submit
  =============================== */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("illness", JSON.stringify(illnesses));
    if (upload) {
      formData.append("upload", upload);
    }

    try {
      const res = await API.post(
        `/hcrequest/${id}/healthdetails`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        onNext();
      }
    } catch (err) {
      setError(err.response?.data?.message || {});
      setIsSubmitting(false);
    }
  };

  /* ===============================
     UI
  =============================== */

  return (
    <div className="AddBeneficiary">
      <Title
        title="البيانات الصحية"
        icon={<FontAwesomeIcon icon={faNotesMedical} />}
      />

      <Form className="AddBeneficiaryContainer" onSubmit={handleSubmit}>
        <div>
          <span
            className="addillness"
            onClick={handleAddIllness}
            style={{ color: "green", marginLeft: "10px" }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </span>

          {illnesses.length > 1 && (
            <span
              className="addillness"
              onClick={handleRemoveIllness}
              style={{ color: "red" }}
            >
              <FontAwesomeIcon icon={faMinus} />
            </span>
          )}

          <div className="duplicatedContent">
            {illnesses.map((illness, index) => (
              <div className="AddBeneficiaryContainerRow2" key={index}>
                <RegisterTextbox
                  label="اسم المرض"
                  type="text"
                  onChange={(e) =>
                    handleChange(index, "name", e.target.value)
                  }
                />

                <RegisterTextbox
                  label="نوع المرض"
                  type="text"
                  onChange={(e) =>
                    handleChange(index, "type", e.target.value)
                  }
                />

                <RegisterTextbox
                  label="نوع العلاج"
                  type="text"
                  onChange={(e) =>
                    handleChange(index, "trtype", e.target.value)
                  }
                />

                <RegisterTextbox
                  label="تكلفة العلاج"
                  type="number"
                  onChange={(e) =>
                    handleChange(index, "trcost", e.target.value)
                  }
                />

                <RegisterTextbox
                  label="ملاحظات"
                  type="text"
                  onChange={(e) =>
                    handleChange(index, "notes", e.target.value)
                  }
                />

                <RegisterTextbox
                  label="خطورة المرض"
                  type="text"
                  onChange={(e) =>
                    handleChange(index, "degree", e.target.value)
                  }
                />
              </div>
            ))}

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
                  value={upload}
            />
          </div>
        </div>

        <div className="AddBeneficiaryContainerRow">
          {isSubmitting ? (
            <Spinner animation="border" />
          ) : (
            <CustomButton text="حفظ" onClick={handleSubmit} />
          )}
        </div>
      </Form>
    </div>
  );
}

export default ForBenefitHealthData;
