import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../../components/title";
import "./jobTitle.css";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import { Form, Spinner } from "react-bootstrap";
import CustomButton from "../../../../components/CustomButton";
import RegisterSelect from "../../../../components/RegisterSelect";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TestPreLoader from "../../../../pages/TestPreLoader/TestPreLoader";
import { hrService } from "../../services/hrService";

function EditJobTitle() {
  const [rows2, setRows2] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mangerjobtitle, setMangerjobtitle] = useState("");
  const [note, setNote] = useState("");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getJobtitleOne = async () => {
    try {
      const res = await hrService.getJobTitle(id);
      if (res.status === 200) {
        setName(res.data.title);
        setDescription(res.data.description);
        setDays(res.data.workdayspermonth);
        setHours(res.data.workhoursperday);
        setMangerjobtitle(res.data.parent_id);
        setNote(res.data.note);
        setLoading(false);
      }
    } catch (err) {
      setError(err?.response?.data?.errors || {});
      setLoading(false);
    }
  };

  const getJobtitle = async () => {
    try {
      const res = await hrService.getJobTitles();
      if (res.status === 200) {
        setRows2(res.data);
      }
    } catch (err) {
      setError(err?.response?.data?.errors || {});
    }
  };

  useEffect(() => {
    getJobtitle();
    getJobtitleOne();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mFormData = new FormData();
    mFormData.append("name", name);
    mFormData.append("description", description);
    mFormData.append("days", days);
    mFormData.append("hours", hours);
    mFormData.append("mangerjobtitle", mangerjobtitle);
    mFormData.append("note", note);
    mFormData.append("id", id);
    try {
      const res = await hrService.updateJobTitle(mFormData);
      if (res.status === 200) {
        navigate("/jobtitle");
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
        title="تعديل المسمي الوظيفي"
        icon={<FontAwesomeIcon icon={faUsers} />}
        style={{ width: "unset" }}
      />
      <Form className="jobTitle-form" onSubmit={handleSubmit}>
        <div className="jobTitle-inputs">
          <div className="jobTitleRow">
            <div className="jobTitleAlertcont">
              <RegisterTextbox
                parentStyle={{ width: "100%" }}
                id="name"
                label="اسم المسمي الوظيفي"
                type="text"
                stylee={{ width: "100%" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {error && error.name && (
                <span className="error">{error.name}</span>
              )}
            </div>
            <div className="jobTitleAlertcont">
              <RegisterTextbox
                parentStyle={{ width: "100%" }}
                id="jobDesc"
                label="وصف المسمي الوظيفي"
                type="text"
                stylee={{ width: "100%" }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                label="الرئيس المباشر"
                stylee={{ width: "100%" }}
                parentStyle={{ width: "100%" }}
                options={[
                  { value: "", label: "اختر المدير المباشر" },
                  { value: "0", label: "لا يوجد" },
                  ...rows2.map((item) => ({
                    value: item.id,
                    label: item.title,
                  })),
                ]}
                value={mangerjobtitle}
                onChange={(e) => setMangerjobtitle(e.target.value)}
              />
              {error && error.mangerjobtitle && (
                <span className="error">{error.mangerjobtitle}</span>
              )}
            </div>
            <div className="jobTitleAlertcont">
              <RegisterTextbox
                parentStyle={{ width: "100%" }}
                id="days"
                label="عدد الايام"
                type="number"
                stylee={{ width: "100%" }}
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
              {error && error.days && (
                <span className="error">{error.days}</span>
              )}
            </div>
          </div>

          <div className="jobTitleRow">
            <div className="jobTitleAlertcont">
              <RegisterTextbox
                parentStyle={{ width: "100%" }}
                id="hours"
                label="عدد الساعات"
                type="number"
                stylee={{ width: "100%" }}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
              {error && error.hours && (
                <span className="error">{error.hours}</span>
              )}
            </div>
            <div className="jobTitleAlertcont">
              <RegisterTextbox
                parentStyle={{ width: "100%" }}
                id="vocadays"
                label="ملاحظات اخري"
                type="text"
                stylee={{ width: "100%" }}
                value={note}
                onChange={(e) => setNote(e.target.value)}
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

export default EditJobTitle;

