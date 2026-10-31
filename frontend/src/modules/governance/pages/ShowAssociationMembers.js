import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import "./associationMembers.css";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import RegisterTextbox from "../../../components/RegisterTextBox";
import CustomButton from "../../../components/CustomButton";
import "../../../pages/AddNewClient/addnewclient.css";
import UploadInput from "../../../components/UploadInput";
import RegisterSelect from "../../../components/RegisterSelect";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/axiosConfig";
import Spinner from "react-bootstrap/Spinner";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

function ShowAssociationMembers() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams();
  const [error, setError] = useState({});
  const [name, setName] = useState("");
  const [dob, setDob] = useState(new Date().toISOString().substr(0, 10));
  const [nationalid, setNationalid] = useState("");
  const [idexpire, setIdexpire] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [startjoin, setStartjoin] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [endjoin, setEndjoin] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [membertype, setMembertype] = useState("");
  const [startmember, setStartmember] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [job, setJob] = useState("");
  const [jobAddress, setJobAddress] = useState("");
  const [fees, setFees] = useState("");
  const [notes, setNotes] = useState("");
  const [upload, setUpload] = useState("");
  const [status, setStatus] = useState("");
  const [member , setMember] = useState([]);

  async function getMember() {
        try {
            const res = await API.get(`/assemblymembers/${id}`);
            const data = await res;
            if (data.status === 200) {
                setMember(data.data);
            }
        } catch (error) {
            console.log(error);
            setError(error.response.data.errors);
        }
    }
    useEffect(() => {
        getMember();
    }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", member.name);
    formData.append("dob", member.dateofbirth);
    formData.append("nationalid", member.nationalid);
    formData.append("idexpire", member.nationalid_expire);
    formData.append("startjoin", member.start_subscription_date);
    formData.append("endjoin", member.end_subscription_date);
    formData.append("membertype", member.subscription_type);
    formData.append("startmember", member.start_membership_date);
    formData.append("job", member.job);
    formData.append("jobAddress", member.jobaddress);
    formData.append("fees", member.subscription_fees);
    formData.append("notes", member.notes);
    formData.append("status", member.status);
    formData.append("upload", upload);
    try {
      const res = await API.post("/assemblymembers/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = await res;
      if (data.status === 200) {
        navigate("/associationMembersReport");
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      setError(error.response.data.errors);
    }
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
  const [day, month, year] = dateStr.split("-");
  if (!day || !month || !year) return "";
  return `${year}-${month}-${day}`; // yyyy-MM-dd
};

  return (
    <>
      <div className="addnewclientContaner">
        <Title
          title="تعديل اعضاء الجمعية العمومية "
          icon={<FontAwesomeIcon icon={faUserPlus} />}
        />
        <Form className="addnewclientContanerForm addsubli addmem ">
          <div className="addClientsInputs">
            <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="name"
              label="إسم العضو"
              type="text"
              stylee={{
                width: "30%",
              }}
              name="name"
              onChange={(e) => setMember({...member, name:e.target.value})}
              value={member.name || ""} //setName(e.target.value)
            />
            {error && error.name && <p className="error">{error.name}</p>}
           
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "0",
                width: "40%",
              }}
            >
              <label
                className="register-label"
                style={{ width: "60%", marginBottom: "5px" }}
              >
                تاريخ الميلاد
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formatDateForInput(member.dateofbirth)}
                onChange={(e) => setMember({ ...member,dateofbirth: e.target.value})} //setDob(e.target.value)}
                className="custom-datepicker"
                style={{ width: "100%" }}
              />
            </div>
            {error && error.dob && <p className="error">{error.dob}</p>}
          </div>
          <div className="addClientsInputs">
            <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="id"
              label="رقم الهوية"
              type="number"
              stylee={{
                width: "30%",
              }}
              name="nationalid"
              onChange={(e) => setMember({ ...member,nationalid: e.target.value})} //setNationalid(e.target.value)}
              value={member.nationalid}
            />
            {error && error.nationalid && (
              <p className="error">{error.nationalid}</p>
            )}
            {/* <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="iddate"
              label="تاريخ انتهاءالهوية"
              type="date"
              stylee={{
                width: "30%",
              }}
              name="idexpire"
              onChange={handleIdExpireChange}
            /> */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "0",
                width: "40%",
              }}
            >
              <label
                className="register-label"
                style={{ width: "100%", marginBottom: "5px" }}
              >
                تاريخ انتهاء الهوية
              </label>
              <input
                type="date"
                id="iddate"
                name="iddate"
                value={formatDateForInput(member.nationalid_expire)}
                onChange={(e) => setMember({...member, nationalid_expire: e.target.value})} //setIdexpire(e.target.value)}
                className="custom-datepicker"
                style={{ width: "100%" }}
              />
            </div>
            {error && error.idexpire && (
              <p className="error">{error.idexpire}</p>
            )}
          </div>
          <div className="addClientsInputs">
            {/* <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="memstartdate"
              label="تاريخ بدايةالاشتراك"
              type="date"
              stylee={{
                width: "30%",
              }}
              name="startjoin"
              onChange={handleStartjoinChange}
            /> */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "0",
                width: "40%",
              }}
            >
              <label
                className="register-label"
                style={{ width: "100%", marginBottom: "5px" }}
              >
                تاريخ بداية الاشتراك
              </label>
              <input
                type="date"
                id="memstartdate"
                name="memstartdate"
                value={formatDateForInput(member.start_subscription_date)}
                onChange={(e) => setMember({...member, start_subscription_date: e.target.value})} //setStartjoin(e.target.value)}
                className="custom-datepicker"
                style={{ width: "100%" }}
              />
            </div>
            {error && error.startjoin && (
              <p className="error">{error.startjoin}</p>
            )}
            {/* <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="memenddate"
              label="تاريخ انتهاء الاشتراك"
              type="date"
              stylee={{
                width: "30%",
              }}
              name="endjoin"
              onChange={handleEndjoinChange}
            /> */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "0",
                width: "40%",
              }}
            >
              <label
                className="register-label"
                style={{ width: "60%", marginBottom: "5px" }}
              >
                تاريخ انتهاء الاشتراك
              </label>
              <input
                type="date"
                id="memenddate"
                name="memenddate"
                value={formatDateForInput(member.end_subscription_date)}
                onChange={(e) => setMember({ ...member,end_subscription_date: e.target.value})} //setEndjoin(e.target.value)}
                className="custom-datepicker"
                style={{ width: "100%" }}
              />
            </div>

            {error && error.endjoin && <p className="error">{error.endjoin}</p>}
          </div>
          <div className="addClientsInputs">
            <RegisterSelect
              id="type"
              label="نوع العضوية"
              stylee={{
                width: "30% !important",
              }}
              parentStyle={{
                width: "40%",
                marginBottom: "20px",
              }}
              options={[
                { value: "", label: "إختر نوع العضوية" },
                { value: "1", label: "داعمة" },
                { value: "2", label: "فخرية" },
                { value: "3", label: "عادية" },
              ]}
              name="type"
              onChange={(e) => setMember({...member, subscription_type: e.target.value})} //setMembertype(e.target.value)}
              value={member.subscription_type}
            />
            {error && error.membertype && (
              <p className="error">{error.membertype}</p>
            )}

            {/* <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="iddate"
              label="تاريخ بداية العضوية"
              type="date"
              stylee={{
                width: "30%",
              }}
              name="iddate"
              onChange={handleStartMemberChange}
            /> */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "0",
                width: "40%",
              }}
            >
              <label
                className="register-label"
                style={{ width: "100%", marginBottom: "5px" }}
              >
                تاريخ بداية العضوية
              </label>
              <input
                type="date"
                id="iddate"
                name="iddate"
                value={formatDateForInput(member.start_membership_date)}
                onChange={(e) => setMember({ ...member,start_membership_date: e.target.value})} //setStartmember(e.target.value)}
                className="custom-datepicker"
                style={{ width: "100%" }}
              />
            </div>
            {error && error.startmember && (
              <p className="error">{error.startmember}</p>
            )}
          </div>

          <div className="addClientsInputs">
            <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="job"
              label="المهنة"
              type="text"
              stylee={{
                width: "30%",
              }}
              name="job"
              onChange={(e) => setMember({...member, job: e.target.value})} //setJob(e.target.value)}
              value={member.job}
            />
            {error && error.job && <p className="error">{error.job}</p>}
            <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="workaddress"
              label="عنوان العمل"
              type="text"
              stylee={{
                width: "30%",
              }}
              name="workaddress"
              onChange={(e) => setMember({...member, jobaddress: e.target.value})} //setJobAddress(e.target.value)}
              value={member.jobaddress}
            />
            {error && error.jobAddress && (
              <p className="error">{error.jobAddress}</p>
            )}
          </div>
          <div className="addClientsInputs">
            <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="moneyperyear"
              label="قيمةالإشتراك السنوي"
              type="number"
              stylee={{
                width: "30%",
              }}
              name="moneyperyear"
              onChange={(e) => setMember({ ...member,subscription_fees: e.target.value})} //setFees(e.target.value)}
              value={member.subscription_fees}
            />
            {error && error.fees && <p className="error">{error.fees}</p>}
            <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="notes"
              label="ملاحظات اخري"
              type="text"
              stylee={{
                width: "30%",
              }}
              name="notes"
              onChange={(e) => setMember({...member, notes: e.target.value})} //setNotes(e.target.value)}
              value={member.notes}
            />
            {error && error.notes && <p className="error">{error.notes}</p>}
          </div>
          <div className="addClientsInputs addClientsInputs22">
            <RegisterSelect
              id="status"
              label="نوع العضو"
              stylee={{
                width: "30% !important",
              }}
              parentStyle={{
                width: "40%",
                marginBottom: "20px",
              }}
              options={[
                { value: "", label: "إختر نوع العضو" },
                { value: "1", label: "عضو مجلس ادارة" },
                { value: "2", label: "عضو جمعية عمومية" },
              ]}
              name="status"
              onChange={(e) => setMember({...member, status: e.target.value})} //setStatus(e.target.value)}
              value={member.status}
            />
            {error && error.status && <p className="error">{error.status}</p>}
            <UploadInput
              id="paper"
              parentStyle={{
                marginTop: "20px",
                display: "flex",
                alignItems: "left",
                width: "35%",
              }}
              label="إرفاق اوراق اخري"
              onChange={(e) => setUpload(e.target.files[0])}
            />
          </div>
          {isSubmitting ? (
            <Spinner
              animation="border"
              variant="primary"
              style={{ display: "block", margin: "auto" }}
            />
          ) : (
            <CustomButton
              text="تعديل"
              onClick={handleSubmit}
              className="addClientBtn"
            />
          )}
        </Form>
      </div>
    </>
  );
}

export default ShowAssociationMembers;
