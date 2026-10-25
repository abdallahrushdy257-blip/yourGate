import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./jobTitle.css";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
import { Form , Spinner } from "react-bootstrap";
import CustomButton from "../../components/CustomButton";
import RegisterSelect from "../../components/RegisterSelect";
import API from "../../api/axiosConfig";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import TestPreLoader from "../TestPreLoader/TestPreLoader";


function EditJobTitle() {
  const [rows, setRows] = useState([]);
  const [rows2, setRows2] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  //=================================================
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mangerjobtitle, setMangerjobtitle] = useState("");
  const [note, setNote] = useState("");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [isSubmitting , setIsSubmitting] = useState(false)

  const getJobtitleOne = async () => {

    try {
      const res = await API.get(`/jobtitle/${id}`);
      const data = await res;
      if (data.status === 200) {
        // setRows(data.data);
        setName(data.data.title);
        setDescription(data.data.description);
        setDays(data.data.workdayspermonth);
        setHours(data.data.workhoursperday);
        setMangerjobtitle(data.data.parent_id);
        setNote(data.data.note);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  }

  const getJobtitle = async () => {
    try {
      const res = await API.post(`/jobtitle`);
      const data = await res;
      if (data.status === 200) {
        setRows2(data.data);
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  }

  useEffect(() => {
    getJobtitle();
    getJobtitleOne();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const mFormData = new FormData();
    mFormData.append("name", name);
    mFormData.append("description", description);
    mFormData.append("days", days);
    mFormData.append("hours", hours);
    mFormData.append("mangerjobtitle", mangerjobtitle);
    mFormData.append("note", note);
    mFormData.append("id", id);
    try {
      const res = await API.post(`/jobtitle/update`, mFormData);
      const data = await res;
      if (data.status === 200) {
        navigate("/jobtitle");
      } else {
        setError(data.data.errors);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false)
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  }
  return (
    loading ? <TestPreLoader /> :
      <>
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
                    parentStyle={{
                      width: "100%",
                    }}
                    id="name"
                    label="اسم المسمي الوظيفي"
                    type="text"
                    stylee={{
                      width: "100%",
                    }}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />{error && error.name && <span className="error">{error.name}</span>}
                </div>
                <div className="jobTitleAlertcont">
                  <RegisterTextbox
                    parentStyle={{
                      width: "100%",
                    }}
                    id="jobDesc"
                    label="وصف المسمي الوظيفي"
                    type="text"
                    stylee={{
                      width: "100%",
                    }}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />{error && error.description && <span className="error">{error.description}</span>}
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
                    onChange={(e) => {
                      setMangerjobtitle(e.target.value);
                    }}
                  />
                  {error && error.mangerjobtitle && <span className="error">{error.mangerjobtitle}</span>}
                </div>
                <div className="jobTitleAlertcont">
                  <RegisterTextbox
                    parentStyle={{
                      width: "100%",
                    }}
                    id="days"
                    label="عدد الايام"
                    type="number"
                    stylee={{
                      width: "100%",
                    }}
                    value={days}
                    onChange={(e) => {
                      setDays(e.target.value);
                    }}
                  />{error && error.days && <span className="error">{error.days}</span>}
                </div>
              </div>

              <div className="jobTitleRow">
                <div className="jobTitleAlertcont">
                  <RegisterTextbox
                    parentStyle={{
                      width: "100%",
                    }}
                    id="hours"
                    label="عدد الساعات"
                    type="number"
                    stylee={{
                      width: "100%",
                    }}
                    value={hours}
                    onChange={(e) => {
                      setHours(e.target.value);
                    }}
                  />{error && error.hours && <span className="error">{error.hours}</span>}
                </div>
                <div className="jobTitleAlertcont">
                  <RegisterTextbox
                    parentStyle={{
                      width: "100%",
                    }}
                    id="vocadays"
                    label="ملاحظات اخري"
                    type="text"
                    stylee={{
                      width: "100%",
                    }}
                    value={note}
                    onChange={(e) => {
                      setNote(e.target.value);
                    }}
                  />
                  {error && error.note && <span className="error">{error.note}</span>}
                </div>
              </div>

              {
                isSubmitting ? <Spinner animation="border" variant="primary" /> :
                <CustomButton text="حفظ" />}

            </div>
          </Form>
        </div>
      </>
  );
}

export default EditJobTitle;
