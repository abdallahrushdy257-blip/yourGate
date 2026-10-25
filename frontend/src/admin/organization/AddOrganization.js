import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./jobTitle.css";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
import { Form, Spinner } from "react-bootstrap";
import CustomButton from "../../components/CustomButton";
import RegisterSelect from "../../components/RegisterSelect";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import API from "../../api/axiosConfig";

function AddOrganization() {
  const navigate = useNavigate();
  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city , setCity] = useState("");
  const [region , setRegion] = useState("");
  const [email , setEmail] = useState("");
  const [website , setWebsite] = useState("");
  const [regnub , setRegnub] = useState("");
  const [textregnub , setTextregnub] = useState("");
  const [taxNmber , setTaxNmber] = useState("");
  const [logo , setLogo] = useState(null);
  const [eclecstamp , setEclecstamp] = useState(null);
  const [ document , setDocument] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mFormData = new FormData();
    mFormData.append("name", name);
    mFormData.append("phone", phone);
    mFormData.append("address", address);
    mFormData.append("city", city);
    mFormData.append("region", region);
    mFormData.append("note", note);
    try {
      const res = await API.post("/jobtitle/store", mFormData);
      const data = await res;
      if (data.status === 200) {
        navigate("/hrreport/jobtitles");
      } else {
        setError(data.data.errors);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  };

  const getJobtitle = async () => {
    try {
      const res = await API.post("/jobtitle");
      const data = await res;
      console.log(data.data);
      if (data.status === 200) {
        setRows(data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  };
  useEffect(() => {
    getJobtitle();
  }, []);
  return (
    <>
      <div className="jobtitle-container">
        <Title
          title="المسمي الوظيفي"
          icon={<FontAwesomeIcon icon={faUsers} />}
          style={{ width: "unset" }}
        />
        <Form className="jobTitle-form" onSubmit={handleSubmit}>
          <div className="jobTitle-inputs">
            <div className="jobTitleRow">
              <div className="jobTitleAlertcont">
                <RegisterTextbox
                  parentStyle={{ width: "80%" }}
                  id="name"
                  label="اسم المسمي الوظيفي"
                  type="text"
                  stylee={{ width: "100%" }}
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {error?.name && <span className="error">{error.name}</span>}
              </div>

              <div className="jobTitleAlertcont">
                <RegisterTextbox
                  parentStyle={{ width: "80%" }}
                  id="jobDesc"
                  label="وصف المسمي الوظيفي"
                  type="text"
                  stylee={{ width: "100%" }}
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {error?.description && (
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
                  parentStyle={{ width: "80%" }}
                  options={[
                    { value: "", label: " اختر المدير المباشر " },
                    { value: "0", label: " لا يوجد" },
                    ...rows.map((row) => ({
                      value: row.id,
                      label: row.title,
                    })),
                  ]}
                  name="mangerjobtitle"
                  value={mangerjobtitle}
                  onChange={(e) => setMangerjobtitle(e.target.value)}
                />
                {error?.mangerjobtitle && (
                  <span className="error">{error.mangerjobtitle}</span>
                )}
              </div>

              <div className="jobTitleAlertcont">
                <RegisterTextbox
                  parentStyle={{ width: "80%" }}
                  id="days"
                  label="عدد أيام الدوام في الأسبوع"
                  type="number"
                  stylee={{ width: "100%" }}
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                />
                {error?.days && <span className="error">{error.days}</span>}
              </div>
            </div>

            <div className="jobTitleRow">
              <div className="jobTitleAlertcont">
                <RegisterTextbox
                  parentStyle={{ width: "80%" }}
                  id="hours"
                  label="عدد ساعات العمل اليومية"
                  type="number"
                  stylee={{ width: "100%" }}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
                {error?.hours && <span className="error">{error.hours}</span>}
              </div>

              <div className="jobTitleAlertcont">
                <RegisterTextbox
                  parentStyle={{ width: "80%" }}
                  id="vocadays"
                  label="ملاحظات اخري"
                  type="text"
                  stylee={{ width: "100%" }}
                  name="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                {error?.note && <span className="error">{error.note}</span>}
              </div>
            </div>

            <div className="jobTitleRow mt-4">
              {isSubmitting ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <button type="submit" className="jobtitle-submit">
                  حفظ
                </button>
              )}
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}

export default AddOrganization;
