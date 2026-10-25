import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import "../addBeneficiary.css";
import {
  faPeopleRoof,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../components/RegisterTextBox";
import CustomButton from "../../../components/CustomButton";
import { Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import RegisterSelect from "../../../components/RegisterSelect";
import API from "../../../api/axiosConfig";

const emptyDependent = {
  name: "",
  gender: "",
  nationalid: "",
  relation: "",
  dob: "",
  health: "",
  idexpire: "",
  idsource: "",
  grade: "",
  gradecost: "",
  phone: "",
  notes: "",
};

function ForBenefitDependentsData({ onNext }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dependents, setDependents] = useState([emptyDependent]);
  const [error, setError] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);

  /* ===============================
     Handlers
  =============================== */

  const handleChange = (index, field, value) => {
    const updated = [...dependents];
    updated[index][field] = value;
    setDependents(updated);
  };

  const addDependent = () => {
    setDependents([...dependents, { ...emptyDependent }]);
  };

  const removeDependent = () => {
    if (dependents.length > 1) {
      setDependents(dependents.slice(0, -1));
    }
  };

  /* ===============================
     Submit
  =============================== */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("data", JSON.stringify(dependents));

    try {
      const res = await API.post(
        `/hcrequest/${id}/dependantdetails`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        alert("تم الحفظ بنجاح");
        navigate("/");
      }
    } catch (err) {
      setSubmitting(false);
      setError(err.response?.data?.errors || {});
    }
  };

  /* ===============================
     UI
  =============================== */

  return (
    <div className="AddBeneficiary">
      <Title
        title="بيانات التابعين"
        icon={<FontAwesomeIcon icon={faPeopleRoof} />}
      />

      <Form className="AddBeneficiaryContainer" onSubmit={handleSubmit}>
        <span
          className="addillness"
          onClick={addDependent}
          style={{ color: "green", marginLeft: "10px" }}
        >
          <FontAwesomeIcon icon={faPlus} />
        </span>

        {dependents.length > 1 && (
          <span
            className="addillness"
            onClick={removeDependent}
            style={{ color: "red" }}
          >
            <FontAwesomeIcon icon={faMinus} />
          </span>
        )}

        <div className="duplicatedContent">
          {dependents.map((dep, index) => (
            <div
              key={index}
              className="AddBeneficiaryContainerRow2"
              style={{
                border: "1px solid var(--text-color)",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "10px",
              }}
            >
              <RegisterTextbox
                label="الاسم"
                onChange={(e) =>
                  handleChange(index, "name", e.target.value)
                }
              />

              <RegisterSelect
                label="نوع الجنس"
                options={[
                  { value: "", label: "اختر النوع" },
                  { value: "0", label: "ذكر" },
                  { value: "1", label: "أنثى" },
                ]}
                onChange={(e) =>
                  handleChange(index, "gender", e.target.value)
                }
              />

              <RegisterTextbox
                label="رقم الهوية"
                onChange={(e) =>
                  handleChange(index, "nationalid", e.target.value)
                }
              />

              <RegisterTextbox
                label="صلة القرابة"
                onChange={(e) =>
                  handleChange(index, "relation", e.target.value)
                }
              />

              <input
                type="date"
                className="custom-datepicker"
                onChange={(e) =>
                  handleChange(index, "dob", e.target.value)
                }
              />

              <RegisterTextbox
                label="الحالة الصحية"
                onChange={(e) =>
                  handleChange(index, "health", e.target.value)
                }
              />

              <input
                type="date"
                className="custom-datepicker"
                onChange={(e) =>
                  handleChange(index, "idexpire", e.target.value)
                }
              />

              <RegisterTextbox
                label="مصدر الهوية"
                onChange={(e) =>
                  handleChange(index, "idsource", e.target.value)
                }
              />

              <RegisterTextbox
                label="المرحلة الدراسية"
                type="number"
                onChange={(e) =>
                  handleChange(index, "grade", e.target.value)
                }
              />

              <RegisterTextbox
                label="المصروفات الدراسية"
                type="number"
                onChange={(e) =>
                  handleChange(index, "gradecost", e.target.value)
                }
              />

              <RegisterTextbox
                label="رقم الجوال"
                type="number"
                onChange={(e) =>
                  handleChange(index, "phone", e.target.value)
                }
              />

              <RegisterTextbox
                label="ملاحظات"
                onChange={(e) =>
                  handleChange(index, "notes", e.target.value)
                }
              />
            </div>
          ))}
        </div>

        <div className="AddBeneficiaryContainerRow">
          {isSubmitting ? (
            <Spinner animation="border" />
          ) : (
            <CustomButton text="حفظ" />
          )}
        </div>
      </Form>
    </div>
  );
}

export default ForBenefitDependentsData;
