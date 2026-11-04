import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../../components/title";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import { Form, Spinner } from "react-bootstrap";
import CustomButton from "../../../../components/CustomButton";
import RegisterSelect from "../../../../components/RegisterSelect";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TestPreLoader from "../../../../pages/TestPreLoader/TestPreLoader";
import { hrService } from "../../services/hrService";
import "../JobTitle/jobTitle.css";

function EditEmploypaper() {
  const [rows, setRows] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getemployeepaper = async () => {
    try {
      const res = await hrService.getEmployeePaper(id);
      if (res.status === 200) {
        setRows(res.data);
      }
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.errors || {});
      setLoading(false);
    }
  };

  useEffect(() => {
    getemployeepaper();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mFormData = new FormData();
    mFormData.append("name", rows.name || "");
    mFormData.append("description", rows.description || "");
    mFormData.append("note", rows.note || "");
    mFormData.append("id", id);
    try {
      const res = await hrService.updateEmployeePaper(mFormData);
      if (res.status === 200) {
        navigate("/employpaper");
      } else {
        setError(res.data.errors);
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err?.response?.data?.errors || {});
    }
  };

  return loading ? (
    <TestPreLoader />
  ) : (
    <div className="jobtitle-container">
      <Title
        title="تعديل المستند"
        icon={<FontAwesomeIcon icon={faUsers} />}
        style={{ width: "unset" }}
      />
      <Form className="global-form-container" onSubmit={handleSubmit}>
        <div className="jobTitle-inputs">
          <div className="jobTitleRow">
            <div className="jobTitleAlertcont">
              <RegisterTextbox
                parentStyle={{ width: "80%" }}
                id="name"
                label="اسم المستند "
                type="text"
                stylee={{ width: "100%" }}
                value={rows && rows.name}
                onChange={(e) => setRows({ ...rows, name: e.target.value })}
              />
              {error && error.name && (
                <span className="error">{error.name}</span>
              )}
            </div>
            <div className="jobTitleAlertcont">
              <RegisterTextbox
                parentStyle={{ width: "80%" }}
                id="jobDesc"
                label="وصف المستند "
                type="text"
                stylee={{ width: "100%" }}
                value={rows && rows.description}
                onChange={(e) =>
                  setRows({ ...rows, description: e.target.value })
                }
              />
              {error && error.description && (
                <span className="error">{error.description}</span>
              )}
            </div>
          </div>
          <div className="jobTitleRow">
            <div className="jobTitleAlertcont">
              <RegisterSelect
                id="mangerjobtitle"
                label="نوع المستند"
                stylee={{ width: "100%" }}
                parentStyle={{ width: "80%" }}
                options={[
                  { value: "", label: "اختر نوع المستند" },
                  { value: "1", label: "الزامي" },
                  { value: "2", label: "اضافي" },
                ]}
                value={rows && rows.note}
                onChange={(e) => setRows({ ...rows, note: e.target.value })}
              />
              {error && error.note && (
                <span className="error">{error.note}</span>
              )}
            </div>
          </div>

          {isSubmitting ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <CustomButton text="حفظ" />
          )}
        </div>
      </Form>
    </div>
  );
}

export default EditEmploypaper;

