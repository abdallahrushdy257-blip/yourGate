import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./associationMembers.css";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Form, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import CustomButton from "../../components/CustomButton";
import "../AddNewClient/addnewclient.css";
import UploadInput from "../../components/UploadInput";
import RegisterSelect from "../../components/RegisterSelect";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router";
import { useState } from "react";

function AssociationMembers() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});
  const [name, setName] = useState(
    () => sessionStorage.getItem("assemblyname") || ""
  );
  const [dob, setDob] = useState(
    () =>
      sessionStorage.getItem("assemblydob") ||
      new Date().toISOString().substr(0, 10)
  );
  const [nationalid, setNationalid] = useState(
    () => sessionStorage.getItem("assemblyid") || ""
  );
  const [idexpire, setIdexpire] = useState(
    () =>
      sessionStorage.getItem("assemblyidexpire") ||
      new Date().toISOString().substr(0, 10)
  );
  const [startjoin, setStartjoin] = useState(
    () =>
      sessionStorage.getItem("assemblystartjoin") ||
      new Date().toISOString().substr(0, 10)
  );
  const [endjoin, setEndjoin] = useState(
    () =>
      sessionStorage.getItem("assemblyendjoin") ||
      new Date().toISOString().substr(0, 10)
  );
  const [membertype, setMembertype] = useState(
    () => sessionStorage.getItem("assemblymembertype") || ""
  );
  const [startmember, setStartmember] = useState(
    () =>
      sessionStorage.getItem("assemblystartmember") ||
      new Date().toISOString().substr(0, 10)
  );
  const [job, setJob] = useState(
    () => sessionStorage.getItem("assemblyjob") || ""
  );
  const [jobAddress, setJobAddress] = useState(
    () => sessionStorage.getItem("assemblyjobAddress") || ""
  );
  const [fees, setFees] = useState(
    () => sessionStorage.getItem("assemblyfees") || ""
  );
  const [notes, setNotes] = useState(
    () => sessionStorage.getItem("assemblynotes") || ""
  );
  const [upload, setUpload] = useState(
    () => sessionStorage.getItem("assemblyupload") || ""
  );
  const [status, setStatus] = useState(
    () => sessionStorage.getItem("assemblystatus") || ""
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("nationalid", nationalid);
    formData.append("idexpire", idexpire);
    formData.append("startjoin", startjoin);
    formData.append("endjoin", endjoin);
    formData.append("membertype", membertype);
    formData.append("startmember", startmember);
    formData.append("job", job);
    formData.append("jobAddress", jobAddress);
    formData.append("fees", fees);
    formData.append("notes", notes);
    formData.append("status", status);
    formData.append("upload", upload);
    try {
      const res = await API.post("/assemblymembers/store", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = await res;
      if (data.status === 200) {
        navigate("/associationMembersReport");
        sessionStorage.clear();
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      setError(error.response.data.errors);
    }
  };

  const memberTypeOptionsByStatus = {
    1: [
      { value: "", label: "إختر نوع العضوية" },
      { value: "4", label: "عضو مجلس" },
      { value: "5", label: "رئيس مجلس" },
      { value: "6", label: "نائب رئيس" },
      { value: "7", label: "عضو لجنة" },
    ],
    2: [
      { value: "", label: "إختر نوع العضوية" },
      { value: "1", label: "داعمة" },
      { value: "2", label: "فخرية" },
      { value: "3", label: "عادية" },
    ],
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    setMembertype(""); // reset
    sessionStorage.setItem("assemblystatus", value);
    sessionStorage.removeItem("assemblymembertype");
  };

  return (
    <>
      <div className="associationMembersContainer">
        <Title
          title="إضافة عضو "
          icon={<FontAwesomeIcon icon={faUserPlus} />}
        />
        <Form className="addnewclientContanerForm addsubli addmem ">
          <div className="addClientsInputs associationmem">
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
              onChange={(e) => {
                setName(e.target.value);
                sessionStorage.setItem("assemblyname", e.target.value);
              }}
              value={name}
            />

            <div className="custom-datepicker-container">
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
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  sessionStorage.setItem("assemblydob", e.target.value);
                }}
                className="custom-datepicker"
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {error && error.name && (
              <p className="error" style={{ width: "40%" }}>
                {error.name}
              </p>
            )}
            {error && error.dob && <p className="error">{error.dob}</p>}
          </div>
          <div className="addClientsInputs associationmem">
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
              onChange={(e) => {
                setNationalid(e.target.value);
                sessionStorage.setItem("assemblyid", e.target.value);
              }}
              value={nationalid}
            />

            <div className="custom-datepicker-container">
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
                value={idexpire}
                onChange={(e) => {
                  setIdexpire(e.target.value);
                  sessionStorage.setItem("assemblyidexpire", e.target.value);
                }}
                className="custom-datepicker"
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {error && error.nationalid && (
              <p className="error" style={{ width: "40%" }}>
                {error.nationalid}
              </p>
            )}
            {error && error.idexpire && (
              <p className="error">{error.idexpire}</p>
            )}
          </div>
          <div className="addClientsInputs associationmem">
            <div className="custom-datepicker-container">
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
                value={startjoin}
                onChange={(e) => {
                  setStartjoin(e.target.value);
                  sessionStorage.setItem("assemblystartjoin", e.target.value);
                }}
                className="custom-datepicker"
                style={{ width: "100%" }}
              />
            </div>

            <div className="custom-datepicker-container">
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
                value={endjoin}
                onChange={(e) => {
                  setEndjoin(e.target.value);
                  sessionStorage.setItem("assemblyendjoin", e.target.value);
                }}
                className="custom-datepicker"
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {error && error.startjoin && (
              <p className="error">{error.startjoin}</p>
            )}
            {error && error.endjoin && (
              <p className="error" style={{ width: "40%" }}>
                {error.endjoin}
              </p>
            )}
          </div>
          <div className="addClientsInputs associationmem">
            <RegisterSelect
              id="status"
              label="نوع العضو"
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
              onChange={handleStatusChange}
              value={status}
            />

            <RegisterSelect
              id="type"
              label="نوع العضوية"
              parentStyle={{
                width: "40%",
                marginBottom: "20px",
              }}
              options={
                memberTypeOptionsByStatus[status] || [
                  { value: "", label: "إختر نوع العضوية" },
                ]
              }
              name="type"
              onChange={(e) => {
                setMembertype(e.target.value);
                sessionStorage.setItem("assemblymembertype", e.target.value);
              }}
              value={membertype}
              disabled={!status}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {error && error.membertype && (
              <p className="error" style={{ width: "40%" }}>
                {error.membertype}
              </p>
            )}
            {error && error.status && (
              <p className="error" style={{ width: "40%" }}>
                {error.status}
              </p>
            )}
          </div>
          <div className="addClientsInputs associationmem">
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
              onChange={(e) => {
                setJob(e.target.value);
                sessionStorage.setItem("assemblyjob", e.target.value);
              }}
              value={job}
            />

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
              onChange={(e) => {
                setJobAddress(e.target.value);
                sessionStorage.setItem("assemblyjobAddress", e.target.value);
              }}
              value={jobAddress}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {error && error.job && (
              <p className="error" style={{ width: "40%" }}>
                {error.job}
              </p>
            )}
            {error && error.jobAddress && (
              <p className="error">{error.jobAddress}</p>
            )}
          </div>
          <div className="addClientsInputs associationmem">
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
              onChange={(e) => {
                setFees(e.target.value);
                sessionStorage.setItem("assemblyfees", e.target.value);
              }}
              value={fees}
            />
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
              onChange={(e) => {
                setNotes(e.target.value);
                sessionStorage.setItem("assemblynotes", e.target.value);
              }}
              value={notes}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {error && error.fees && (
              <p className="error" style={{ width: "40%" }}>
                {error.fees}
              </p>
            )}
            {error && error.notes && <p className="error">{error.notes}</p>}
          </div>
          <div className="addClientsInputs associationmem addClientsInputs22">
            <div className="custom-datepicker-container">
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
                value={startmember}
                onChange={(e) => {
                  setStartmember(e.target.value);
                  sessionStorage.setItem("assemblystartmember", e.target.value);
                }}
                className="custom-datepicker"
                style={{ width: "100%" }}
              />
            </div>

            <UploadInput
              id="paper"
              parentStyle={{
                marginTop: "20px",
                display: "flex",
                alignItems: "left",
                width: "35%",
              }}
              label="إرفاق اوراق اخري"
              onChange={(e) => {
                setUpload(e.target.files[0]);
                sessionStorage.setItem("assemblyupload", e.target.files[0]);
              }}
            />
          </div>
          {error && error.startmember && (
            <p className="error">{error.startmember}</p>
          )}
          {isSubmitting ? (
            <Spinner
              animation="border"
              variant="primary"
              style={{ display: "block", margin: "auto" }}
            />
          ) : (
            <CustomButton
              text="حفظ"
              onClick={handleSubmit}
              className="addClientBtn"
            />
          )}
        </Form>
      </div>
    </>
  );
}

export default AssociationMembers;
