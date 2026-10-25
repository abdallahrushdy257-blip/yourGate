import React, { useState } from "react";
import "../CreateLoan/createLoan.css";
import RegisterTextbox from "../../components/RegisterTextBox";
import Title from "../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import "./addBeneficiary.css";
import RegisterSelect from "../../components/RegisterSelect";

import dayjs from "dayjs";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router";
import { Spinner } from "react-bootstrap";

function AddBenef() {
  const [dob, setDob] = useState(
    () =>
      sessionStorage.getItem("beneficary_dob") ||
      new Date().toISOString().substr(0, 10)
  );
  const [age, setAge] = useState(
    () => sessionStorage.getItem("beneficary_age") || ""
  );
  const [cardNum, setCardNum] = useState(
    () => sessionStorage.getItem("beneficary_cardNum") || ""
  );
  const [mobileNum, setMobileNum] = useState(
    () => sessionStorage.getItem("beneficary_mobileNum") || 0
  );
  const [errors, setErrors] = useState({});
  const [dobMap, setDobMap] = useState({});
  const [ageMap, setAgeMap] = useState({});
  const [name, setName] = useState(
    () => sessionStorage.getItem("beneficary_name") || ""
  );
  const [error, setError] = useState({});
  const [message, setMessage] = useState({});
  const [gender, setGender] = useState(() => sessionStorage.getItem('beneficary_gender') || '');
  const [status, setStatus] = useState(() => sessionStorage.getItem('beneficary_status') || '');
  const [nationality, setNationality] = useState(() => sessionStorage.getItem('beneficary_nationality') || '');
  const [email, setEmail] = useState(() => sessionStorage.getItem('beneficary_email') || '');
  const [accnumber, setAccnumber] = useState(() => sessionStorage.getItem('beneficary_accnumber') || '');
  const [idnumber, setIdnumber] = useState(() => sessionStorage.getItem('beneficary_idnumber') || '');
  const [idsource, setIdsource] = useState(() => sessionStorage.getItem('beneficary_idsource') || '');
  const [iddate, setIddate] = useState(() => sessionStorage.getItem('beneficary_iddate') || new Date().toISOString().substr(0, 10));
  const [note, setNote] = useState(() => sessionStorage.getItem('beneficary_note') || '');
  const [humancasetype, setHumancasetype] = useState(() => sessionStorage.getItem('beneficary_humancasetype') || ''); // Assuming 1 is the default value for humancasetype
  const [isSubmitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCardNumChange = (e) => {
    const { value } = e.target;
    setCardNum(value);
    sessionStorage.setItem("beneficary_cardNum", value);
    if (value.length !== 10) {
      setErrors((prevState) => ({
        ...prevState,
        cardnum: "رقم الهوية يجب ان يكون 10 أرقام",
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        cardnum: "",
      }));
    }
  };

  const handlePhoneNumChange = (e) => {
    const { value } = e.target;
    setMobileNum(value);
    sessionStorage.setItem("beneficary_mobileNum", value);
    if (value.length !== 10) {
      setErrors((prevState) => ({
        ...prevState,
        phonenum: "رقم الجوال يجب ان يكون 10 أرقام",
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        phonenum: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    formData.append("name", name);
    formData.append("gender", gender);
    formData.append("status", status);
    formData.append("nationality", nationality);
    formData.append("email", email);
    formData.append("accnumber", accnumber);
    formData.append("idnumber", idnumber);
    formData.append("idsource", idsource);
    formData.append("iddate", iddate);
    formData.append("note", note);
    formData.append("familycount", cardNum);
    formData.append("phonenum", mobileNum);
    formData.append("humancasetype", humancasetype); // Assuming 1 is the default value for humancasetype
    formData.append("dob", dob);
    try {
      const res = await API.post(`/humancases/store`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res;
      if (data.status === 200) {
        sessionStorage.removeItem("beneficary_dob");
        sessionStorage.removeItem("beneficary_age");
        sessionStorage.removeItem("beneficary_cardNum");
        sessionStorage.removeItem("beneficary_mobileNum");
        sessionStorage.removeItem("beneficary_name");
        sessionStorage.removeItem("beneficary_gender");
        sessionStorage.removeItem("beneficary_status");
        sessionStorage.removeItem("beneficary_nationality");
        sessionStorage.removeItem("beneficary_email");
        sessionStorage.removeItem("beneficary_accnumber");
        sessionStorage.removeItem("beneficary_idnumber");
        sessionStorage.removeItem("beneficary_idsource");
        sessionStorage.removeItem("beneficary_iddate");
        sessionStorage.removeItem("beneficary_note");
        sessionStorage.removeItem("beneficary_humancasetype");
        navigate("/beneficiary");
      } else {
        setError(data.data.errors);
      }
    } catch (error) {
      setSubmitting(false);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }

    let hasErrors = false;

    if (cardNum.length !== 10) {
      setErrors((prevState) => ({
        ...prevState,
        cardnum: "رقم الهوية يجب ان يكون 10 أرقام",
      }));
      hasErrors = true;
    }

    if (mobileNum.length !== 10) {
      setErrors((prevState) => ({
        ...prevState,
        phonenum: "رقم الجوال يجب ان يكون 10 أرقام",
      }));
      hasErrors = true;
    }
  };

  return (
    <div className="createloan">
      <form onSubmit={handleSubmit}>
        <div className="AddBeneficiary">
          <Title
            title="إضافة مستفيد"
            icon={<FontAwesomeIcon icon={faDatabase} />}
          />
          <div className="AddBeneficiaryContainer" onSubmit={handleSubmit}>
            <div className="AddBeneficiaryContainerRow">
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="name"
                label="الإسم"
                type="text"
                stylee={{
                  width: "55%",
                }}
                name="name"
                value={name}
                onChange={(e) => {
                  const value = e.target.value;
                  setName(value);
                  sessionStorage.setItem("beneficary_name", value);
                }}
                error={error.name}
              />
              <RegisterSelect
                id="sex"
                label="نوع الجنس"
                stylee={{ width: "30%" }}
                parentStyle={{ width: "30%", marginBottom: "20px" }}
                options={[
                  { value: "", label: "اختر نوع الجنس" },
                  { value: "0", label: "ذكر" },
                  { value: "1", label: "أنثي" },
                ]}
                name="gender"
                value={gender}
                onChange={(e) => {
                  const value = e.target.value;
                  setGender(value);
                  sessionStorage.setItem("beneficary_gender", value);
                }}
                error={error.gender}
              />
            </div>
            {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
              {error && error.name && <span className="error">{error.name}</span>}
              {error && error.gender && <span className="error">{error.gender}</span>}
            </div> */}

            <div className="AddBeneficiaryContainerRow">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "right",
                  width: "30%",
                }}
                className="mb-3"
              >
                <p style={{ marginBottom: "10px" }}>تاريخ الميلاد</p>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  onChange={(e) => {
                    const value = e.target.value;
                    setDob(value);
                    sessionStorage.setItem("beneficary_dob", value);
                  }}
                  value={dob}
                  className="custom-datepicker"
                  style={{ width: "100%" }}
                  error={error.dob}
                />
              </div>

              <RegisterSelect
                id="relation"
                label="حالة المستفيد"
                stylee={{ width: "30%" }}
                parentStyle={{ width: "30%", marginBottom: "20px" }}
                options={[
                  { value: "", label: "اختر حالة المستفيد" },
                  { value: "1", label: "مؤقت" },
                  { value: "2", label: "دائم" },
                ]}
                name="status"
                value={humancasetype}
                onChange={(e) => {
                  const value = e.target.value;
                  setHumancasetype(value);
                  sessionStorage.setItem("beneficary_humancasetype", value);
                }}
                error={error.humancasetype}
              />
            </div>
            {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
              {error && error.dob && <span className="error">{error.dob}</span>}
              {error && error.humancasetype && <span className="error">{error.humancasetype}</span>}
            </div> */}

            <div className="AddBeneficiaryContainerRow">
              <RegisterSelect
                id="relation"
                label="الحالة الإجتماعية"
                stylee={{ width: "30%" }}
                parentStyle={{ width: "30%", marginBottom: "20px" }}
                options={[
                  { value: "", label: "اختر الحالة الإجتماعية" },
                  { value: "1", label: "أعزب" },
                  { value: "2", label: "متزوج" },
                  { value: "3", label: "مطلق" },
                  { value: "4", label: "أرمل" },
                ]}
                name="status"
                value={status}
                onChange={(e) => {
                  const value = e.target.value;
                  setStatus(value);
                  sessionStorage.setItem("beneficary_status", value);
                }}
                error={error.status}
              />
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="nationality"
                label="الجنسية"
                type="text"
                stylee={{
                  width: "55%",
                }}
                name="nationality"
                value={nationality}
                onChange={(e) => {
                  const value = e.target.value;
                  setNationality(value);
                  sessionStorage.setItem("beneficary_nationality", value);
                }}
                error={error.nationality}
              />
            </div>
            {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
              {error && error.status && <span className="error">{error.status}</span>}
              {error && error.nationality && <span className="error">{error.nationality}</span>}
            </div> */}

            <div className="AddBeneficiaryContainerRow">
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="idnum"
                label="عدد افراد الأسرة"
                type="number"
                onChange={handleCardNumChange}
                stylee={{
                  width: "55%",
                }}
                onBlur={(e) => {
                  if (e.target.value.length !== 10) {
                    setErrors((prevState) => ({
                      ...prevState,
                      cardnum: "رقم الهوية يجب ان يكون 10 أرقام",
                    }));
                  } else {
                    setErrors((prevState) => ({
                      ...prevState,
                      cardnum: "",
                    }));
                  }
                }}
                name="cardnum"
                error={error.cardnum}
              />
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="phoneNum"
                label="رقم الجوال"
                type="number"
                stylee={{
                  width: "55%",
                }}
                onChange={handlePhoneNumChange}
                error={errors.phonenum}
              />
            </div>
            {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
              {error && error.cardnum && <span className="error">{error.cardnum}</span>}
              {error && error.phonenum && <span className="error">{error.phonenum}</span>}
            </div> */}

            <div className="AddBeneficiaryContainerRow">
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="email"
                label="البريد الإلكتروني"
                type="email"
                stylee={{
                  width: "55%",
                }}
                name="email"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  sessionStorage.setItem("beneficary_email", value);
                }}
                error={error.email}
              />
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="accNumber"
                label="رقم الحساب"
                type="text"
                stylee={{
                  width: "55%",
                }}
                name="accnumber"
                value={accnumber}
                onChange={(e) => {
                  const value = e.target.value;
                  setAccnumber(value);
                  sessionStorage.setItem("beneficary_accnumber", value);
                }}
                error={error.accnumber}
              />
            </div>
            {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
              {error && error.email && <span className="error">{error.email}</span>}
              {error && error.accnumber && <span className="error">{error.accnumber}</span>}
            </div> */}

            <div className="AddBeneficiaryContainerRow">
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="idnumber"
                label="رقم الهوية"
                type="number"
                stylee={{
                  width: "55%",
                }}
                name="idnumber"
                value={idnumber}
                onChange={(e) => {
                  const value = e.target.value;
                  setIdnumber(value);
                  sessionStorage.setItem("beneficary_idnumber", value);
                }}
                error={error.idnumber}
              />
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="idSource"
                label="مصدر الهوية"
                type="text"
                stylee={{
                  width: "55%",
                }}
                name="idsource"
                value={idsource}
                onChange={(e) => {
                  const value = e.target.value;
                  setIdsource(value);
                  sessionStorage.setItem("beneficary_idsource", value);
                }}
                error={error.idsource}
              />
            </div>
            {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
              {error && error.idnumber && <span className="error">{error.idnumber}</span>}
              {error && error.idsource && <span className="error">{error.idsource}</span>}
            </div> */}

            <div className="AddBeneficiaryContainerRow">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "right",
                  width: "30%",
                  marginBottom: "20px",
                }}
              >
                <p style={{ marginBottom: "10px" }}>تاريخ انتهاء الهوية</p>
                <input
                  type="date"
                  name="iddate"
                  className="custom-datepicker"
                  onChange={(e) => {
                    const value = e.target.value;
                    setIddate(value);
                    sessionStorage.setItem("beneficary_iddate", value);
                  }}
                  value={iddate}
                  style={{ width: "100%" }}
                  error={error.iddate}
                />
              </div>

              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="moreNotes"
                label="ملاحظات اضافية"
                type="text"
                stylee={{
                  width: "55%",
                }}
                name="morenotes"
                value={note}
                onChange={(e) => {
                  const value = e.target.value;
                  setNote(value);
                  sessionStorage.setItem("beneficary_note", value);
                }}
                error={error.note}
              />
            </div>
            {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
              {error && error.iddate && <span className="error">{error.iddate}</span>}
              {error && error.note && <span className="error">{error.note}</span>}
            </div> */}

            {/* <div
              className="AddBeneficiaryContainerRow"
              style={{ color: "red", fontSize: "0.8em" }}
            >
              {errors.cardnum && (
                <div style={{ color: "red", fontSize: "0.8em" }}>
                  {errors.cardnum}
                </div>
              )}
              {errors.phonenum && (
                <div style={{ color: "red", fontSize: "0.8em" }}>
                  {errors.phonenum}
                </div>
              )}
            </div> */}
          </div>
          
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {isSubmitting ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <button type="submit" className=" loanbtn saveButton" id="save">
              حفظ
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddBenef;
