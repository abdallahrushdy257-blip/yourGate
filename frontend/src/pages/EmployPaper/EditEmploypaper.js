import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";

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
  const navigate = useNavigate();
  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  //=================================================
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [type, setType] = useState("");
  const [isSubmitting , setIsSubmitting] = useState(false)



  const getemployeepaper = async () => {
    try {
      const res = await API.get(`/employeepapers/${id}`);
      const data = await res;
      if (data.status === 200) {
        setRows(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  }

  useEffect(() => {
    getemployeepaper();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const mFormData = new FormData();
    mFormData.append("name", rows.name);
    mFormData.append("description", rows.description);

    mFormData.append("note", rows.note);

    mFormData.append("id", id);
    try {
      const res = await API.post(`/employeepapers/update`, mFormData);
      const data = await res;
      if (data.status === 200) {
        navigate("/employpaper");
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
            title="تعديل المستند"
            icon={<FontAwesomeIcon icon={faUsers} />}
            style={{ width: "unset" }}

          />
          <Form className="global-form-container" onSubmit={handleSubmit}>
            <div className="jobTitle-inputs">
              <div className="jobTitleRow">
                <div className="jobTitleAlertcont">
                  <RegisterTextbox
                    parentStyle={{
                      width: "80%",
                    }}
                    id="name"
                    label="اسم المستند "
                    type="text"
                    stylee={{
                      width: "100%",
                    }}
                    value={rows && rows.name}
                    onChange={(e) => {
                      setRows({...rows, name: e.target.value});
                    }}
                  />{error && error.name && <span className="error">{error.name}</span>}
                </div>
                <div className="jobTitleAlertcont">
                  <RegisterTextbox
                    parentStyle={{
                      width: "80%",
                    }}
                    id="jobDesc"
                    label="وصف المستند "
                    type="text"
                    stylee={{
                      width: "100%",
                    }}
                    value={rows && rows.description}
                    onChange={(e) => {
                      setRows({...rows, description: e.target.value});
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
                    parentStyle={{ width: "80%" }}
                    options={[
                      { value: "", label: "اختر نوع المستند" },
                      { value: "1", label: "الزامي" },
                      { value: "2", label: "اضافي" },
                    ]}
                    value={ rows && rows.note}
                    onChange={(e) => {
                      setRows({...rows, note: e.target.value});
                    }}
                  />
                  {error && error.mangerjobtitle && <span className="error">{error.mangerjobtitle}</span>}
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
