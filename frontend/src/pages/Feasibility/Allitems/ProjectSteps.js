//import './AddWarrantor.css'
import Title from "../../../components/title";
import RegisterTextbox from "../../../components/RegisterTextBox";
import CustomButton from "../../../components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingDollar,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import RegisterSelect from "../../../components/RegisterSelect";
import UploadInput from "../../../components/UploadInput";
import { useState } from "react";
import API from "../../../api/axiosConfig";
import { useParams } from "react-router";
import { Spinner } from "react-bootstrap";

function OrganizationChart({ goNextTab }) {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    monthcount: [""],
    projectplace: [""],
    fesibility: [""],
    establishment: [""],
    marketing: [""],
    steps: [""],
    openning: [""],
  });

  const [upload2, setUpload2] = useState(null);
  const [stpesgroup, setStepesgroup] = useState([{ id: 1 }]);
  const [showMinus, setShowMinus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  // 🔹 Handlers for dynamic inputs
  const handleChange = (field, index, value) => {
    const newInputs = [...formData[field]];
    newInputs[index] = value;
    setFormData({
      ...formData,
      [field]: newInputs,
    });
  };

  const handleAddStepes = () => {
    setFormData({
      monthcount: [...formData.monthcount, ""],
      projectplace: [...formData.projectplace, ""],
      fesibility: [...formData.fesibility, ""],
      establishment: [...formData.establishment, ""],
      marketing: [...formData.marketing, ""],
      steps: [...formData.steps, ""],
      openning: [...formData.openning, ""],
    });

    setStepesgroup((prev) => [...prev, { id: prev.length + 1 }]);
    setShowMinus(true);
  };

  const handleMinusStepes = () => {
    const newGroup = stpesgroup.slice(0, -1);
    setFormData({
      monthcount: formData.monthcount.slice(0, -1),
      projectplace: formData.projectplace.slice(0, -1),
      fesibility: formData.fesibility.slice(0, -1),
      establishment: formData.establishment.slice(0, -1),
      marketing: formData.marketing.slice(0, -1),
      steps: formData.steps.slice(0, -1),
      openning: formData.openning.slice(0, -1),
    });

    setStepesgroup(newGroup);
    if (newGroup.length <= 1) setShowMinus(false);
  };

  // 🔹 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submit clicked ✅");
    // validation
    if (formData.monthcount.some((m) => m.trim() === "")) {
      setError({ monthcount: "عدد الأشهر مطلوب" });
      setLoading(false);
      return;
    }

    if (formData.projectplace.some((p) => p.trim() === "")) {
      setError({ projectplace: "مكان المشروع مطلوب" });
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();
      form.append("id", id);
      form.append("upload", upload2);
      form.append("steps_data", JSON.stringify(formData));

      const res = await API.post(
        `/feasibilitystudies/updateprojectsteps`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        setLoading(false);
        window.alert("تم حفظ خطوات تنفيذ المشروع بنجاح");
        goNextTab();
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.errors || {});
    }
  };

  return (
    <>
      <Title
        title="إضافة خطوات تنفيذ المشروع"
        
        icon={<FontAwesomeIcon icon={faHandHoldingDollar} />}
      />
      <div className="statementofaccount">
        <div className="statementofaccountForm">
          <div className="titleaddcon">
            <h5>
              اضافة خطوة أخرى
              <span
                className="addillness addillness2"
                onClick={handleAddStepes}
                style={{
                  cursor: "pointer",
                  borderRadius: "20px",
                  marginLeft: "10px",
                  color: "green",
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </span>
              {stpesgroup.length > 1 && (
                <span
                  className="addillness addillness2"
                  onClick={handleMinusStepes}
                  style={{
                    cursor: "pointer",
                    borderRadius: "20px",
                    color: "red",
                  }}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </span>
              )}
            </h5>
          </div>

          {stpesgroup.map((item, index) => (
            <div className="warrantorRow" key={index}>
              <RegisterSelect
                parentStyle={{ width: "30%" }}
                id={`monthcount-${index}`}
                label="عدد الأشهر"
                options={[
                  { value: "", label: "إختر العدد" },
                  ...[...Array(12)].map((_, i) => ({
                    value: i + 1,
                    label: `${i + 1}`,
                  })),
                ]}
                stylee={{ width: "45%" }}
                value={formData.monthcount[index]}
                onChange={(e) =>
                  handleChange("monthcount", index, e.target.value)
                }
                required={true}
              />

              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id={`projectplace-${index}`}
                label="مكان المشروع"
                type="text"
                stylee={{ width: "45%" }}
                value={formData.projectplace[index]}
                onChange={(e) =>
                  handleChange("projectplace", index, e.target.value)
                }
                required={true}
              />

              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id={`fesibility-${index}`}
                label="دراسة الجدوى"
                type="text"
                stylee={{ width: "45%" }}
                value={formData.fesibility[index]}
                onChange={(e) =>
                  handleChange("fesibility", index, e.target.value)
                }
              />

              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id={`establishment-${index}`}
                label="التأسيس"
                type="text"
                stylee={{ width: "45%" }}
                value={formData.establishment[index]}
                onChange={(e) =>
                  handleChange("establishment", index, e.target.value)
                }
              />

              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id={`marketing-${index}`}
                label="التسويق"
                type="text"
                stylee={{ width: "45%" }}
                value={formData.marketing[index]}
                onChange={(e) =>
                  handleChange("marketing", index, e.target.value)
                }
              />

              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id={`steps-${index}`}
                label="خطوات الترخيص"
                type="text"
                stylee={{ width: "45%" }}
                value={formData.steps[index]}
                onChange={(e) => handleChange("steps", index, e.target.value)}
              />

              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id={`openning-${index}`}
                label="الافتتاح"
                type="text"
                stylee={{ width: "45%" }}
                value={formData.openning[index]}
                onChange={(e) =>
                  handleChange("openning", index, e.target.value)
                }
              />
            </div>
          ))}

          <UploadInput
            parentStyle={{ width: "45%" }}
            id="upload2"
            label="إرفاق خطوات تنفيذ المشروع"
            type="file"
            stylee={{ width: "45%" }}
            onChange={(e) => setUpload2(e.target.files[0])}
            value={upload2}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <CustomButton
            text={
              loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "حفظ البيانات"
              )
            }
            onClick={handleSubmit}
            stylee={{ width: "150px", height: "40px", fontSize: "16px" }}
            disabled={loading}
          />
        </div>
      </div>
    </>
  );
}

export default OrganizationChart;
