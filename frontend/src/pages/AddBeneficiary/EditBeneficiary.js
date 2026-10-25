import React, { useState } from "react";
import "../CreateLoan/createLoan.css";
import RegisterTextbox from "../../components/RegisterTextBox";
import Title from "../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import "./addBeneficiary.css";
import RegisterSelect from "../../components/RegisterSelect";
import { useParams } from "react-router-dom";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router";
import { Spinner } from "react-bootstrap";
import { useEffect } from "react";
import TestPreLoader from "../TestPreLoader/TestPreLoader";

function EditBeneficiary() {
  const { id } = useParams();
  const [dob, setDob] = useState(new Date().toISOString().substr(0, 10));
  const [age, setAge] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [mobileNum, setMobileNum] = useState(0);
  const [errors, setErrors] = useState({});
  const [dobMap, setDobMap] = useState({});
  const [ageMap, setAgeMap] = useState({});
  const [name, setName] = useState("");
  const [error, setError] = useState({});
  const [message, setMessage] = useState({});
  const [gender, setGender] = useState(0);
  const [status, setStatus] = useState(0);
  const [nationality, setNationality] = useState("");
  const [email, setEmail] = useState("");
  const [accnumber, setAccnumber] = useState(0);
  const [idnumber, setIdnumber] = useState(0);
  const [idsource, setIdsource] = useState("");
  const [iddate, setIddate] = useState(new Date().toISOString().substr(0, 10));
  const [note, setNote] = useState("");
  const [humancasetype, setHumancasetype] = useState(1); // Assuming 1 is the default value for humancasetype
  const [isSubmitting, setSubmitting] = useState(false);
  const [dateErrors, setDateErrors] = useState({ dob: "", iddate: "" });
  const navigate = useNavigate();
  const [humancases, setHumancases] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCardNumChange = (e) => {
    const { value } = e.target;
    setHumancases({
      ...humancases,
      details: { ...humancases.details, id_number: value },
    });
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
    setMobileNum({
      ...humancases,
      details: { ...humancases.details, phone_number: value },
    });
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

  const getHumancase = async () => {
    try {
      const res = await API.get(`/humancases/${id}`);
      const data = await res;
      setHumancases(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toLocaleDateString("en-CA");
    let validationErrors = {};

    if (formatDateForInput(humancases.dateofbirth) > today) {
      validationErrors.dob = "تاريخ الميلاد لا يمكن أن يكون في المستقبل";
    }
    if (humancases.details.id_expiration_date < today) {
      validationErrors.iddate = "تاريخ انتهاء الهوية لا يمكن أن يكون في الماضي";
    }

    if (Object.keys(validationErrors).length > 0) {
      setDateErrors(validationErrors);
      return;
    }

    let formErrors = {};
    if (humancases.details.id_number.length !== 10) {
      formErrors.cardnum = "رقم الهوية يجب ان يكون 10 أرقام";
    }
    if (humancases.details.phone_number.length !== 10) {
      formErrors.phonenum = "رقم الجوال يجب ان يكون 10 أرقام";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setSubmitting(true);
    const formData = new FormData(e.target);
    formData.append("id", id);
    formData.append("name", humancases.name);
    formData.append("gender", humancases.gender);
    formData.append("status", humancases.status);
    formData.append("nationality", humancases.details.nationality);
    formData.append("email", humancases.details.email);
    formData.append("accnumber", humancases.details.account_number);
    formData.append("idnumber", humancases.details.id_number);
    formData.append("idsource", humancases.details.idsource);
    formData.append("iddate", humancases.details.id_expiration_date);
    formData.append("note", humancases.details.note);
    formData.append("familycount", humancases.details.family_count);
    formData.append("phonenum", humancases.details.phone_number);
    formData.append("humancasetype", humancases.type); // Assuming 1 is the default value for humancasetype
    formData.append("dob", humancases.dateofbirth);
    try {
      const res = await API.post(`/humancases/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res;
      if (data.status === 200) {
        navigate("/beneficiary");
      } else {
        setError(data.data.errors);
      }
    } catch (error) {
      setSubmitting(false);
      setError(error.response?.data?.errors || {});
      setMessage(error.response?.data?.message || "");
    }
  };

  useEffect(() => {
    getHumancase();
  }, []);

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("-");
    if (!day || !month || !year) return "";
    return `${year}-${month}-${day}`; // yyyy-MM-dd
  };
  return loading ? (
    <TestPreLoader />
  ) : (
    <div className="createloan">
      <Title
        title=" تعديل البيانات الاساسية"
        icon={<FontAwesomeIcon icon={faDatabase} />}
      />
      <form
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "5px",
          width: "60%",
          justifySelf: "center",
        }}
        onSubmit={handleSubmit}
      >
        <div className="AddBeneficiary">
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
                value={humancases ? humancases.name : ""}
                onChange={(e) =>
                  setHumancases({ ...humancases, name: e.target.value })
                }
              />
              {error && error.name && (
                <span className="error">{error.name}</span>
              )}
              <RegisterSelect
                id="sex"
                label="النوع"
                stylee={{ width: "30%" }}
                parentStyle={{ width: "30%", marginBottom: "20px" }}
                options={[
                  { value: "", label: "اختر النوع" },
                  { value: "0", label: "ذكر" },
                  { value: "1", label: "أنثي" },
                ]}
                name="gender"
                value={humancases.gender}
                onChange={(e) =>
                  setHumancases({ ...humancases, gender: e.target.value })
                } // Assuming 1 is the default value for gender(e.target.value)}
              />
              {error && error.gender && (
                <span className="error">{error.gender}</span>
              )}
            </div>

            <div className="AddBeneficiaryContainerRow">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "right",
                  width: "30%",
                }}
              >
                <p style={{ marginBottom: "10px" }}>تاريخ الميلاد</p>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formatDateForInput(humancases.dateofbirth)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setHumancases({
                      ...humancases,
                      dateofbirth: value,
                    });

                    const today = new Date().toLocaleDateString("en-CA");
                    if (value > today) {
                      setDateErrors((prev) => ({
                        ...prev,
                        dob: "تاريخ الميلاد لا يمكن أن يكون في المستقبل",
                      }));
                    } else {
                      setDateErrors((prev) => ({ ...prev, dob: "" }));
                    }
                  }}
                  className="custom-datepicker"
                  style={{
                    width: "100%",
                    borderColor: dateErrors.dob ? "red" : "",
                  }}
                />
              </div>
              {dateErrors.dob && (
                <span className="error" style={{ color: "red" }}>
                  {dateErrors.dob}
                </span>
              )}
              <RegisterSelect
                id="relation"
                label="حالة المستفيد"
                stylee={{ width: "30%" }}
                parentStyle={{ width: "30%", marginBottom: "20px" }}
                options={[
                  { value: "", label: "اختر الحالة المستفيد" },
                  { value: "1", label: "مؤقت" },
                  { value: "2", label: "دائم" },
                ]}
                name="status"
                value={humancases.type}
                onChange={(e) =>
                  setHumancases({ ...humancases, type: e.target.value })
                } // Assuming 1 is the default value for gender(e.target.value)}
              />
              {error && error.humancasetype && (
                <span className="error">{error.humancasetype}</span>
              )}

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
                  value={humancases.status}
                  onChange={(e) =>
                    setHumancases({ ...humancases, status: e.target.value })
                  } // Assuming 1 is the default value for gender(e.target.value)}
                />
                {error && error.status && (
                  <span className="error">{error.status}</span>
                )}
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
                  value={humancases.details.nationality}
                  onChange={(e) =>
                    setHumancases({
                      ...humancases,
                      details: {
                        ...humancases.details,
                        nationality: e.target.value,
                      },
                    })
                  } // Assuming 1 is the default value for gender(e.target.value)}
                />
                {error && error.nationality && (
                  <span className="error">{error.nationality}</span>
                )}
              </div>
              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  parentStyle={{
                    width: "30%",
                  }}
                  id="idnum"
                  label="عدد افراد الأسرة"
                  type="number"
                  stylee={{
                    width: "55%",
                  }}
                  value={humancases.details.family_count}
                  name="cardnum"
                />
                {error && error.cardnum && (
                  <span className="error">{error.cardnum}</span>
                )}
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
                  value={humancases.details.phone_number}
                />
                {error && error.phonenum && (
                  <span className="error">{error.phonenum}</span>
                )}
              </div>
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
                  value={humancases.details.email}
                  onChange={(e) =>
                    setHumancases({
                      ...humancases,
                      details: { ...humancases.details, email: e.target.value },
                    })
                  } // Assuming 1 is the default value for gender(e.target.value)}
                />
                {error && error.email && (
                  <span className="error">{error.email}</span>
                )}
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
                  value={humancases.details.account_number}
                  onChange={(e) =>
                    setHumancases({
                      ...humancases,
                      details: {
                        ...humancases.details,
                        account_number: e.target.value,
                      },
                    })
                  } // Assuming 1 is the default value for gender(e.target.value)}
                />
                {error && error.accnumber && (
                  <span className="error">{error.accnumber}</span>
                )}
              </div>
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
                  value={humancases.details.id_number}
                  onChange={(e) =>
                    humancases({
                      ...humancases,
                      details: {
                        ...humancases.details,
                        id_number: e.target.value,
                      },
                    })
                  } // Assuming 1 is the default value for gender(e.target.value)}
                />
                {error && error.idnumber && (
                  <span className="error">{error.idnumber}</span>
                )}
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
                  value={humancases.details.idsource}
                  onChange={(e) =>
                    setHumancases({ ...humancases, idsource: e.target.value })
                  } // Assuming 1 is the default value for gender(e.target.value)}
                />
                {error && error.idsource && (
                  <span className="error">{error.idsource}</span>
                )}
              </div>
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
                      setHumancases({
                        ...humancases,
                        details: {
                          ...humancases.details,
                          id_expiration_date: value,
                        },
                      });

                      const today = new Date().toLocaleDateString("en-CA");
                      if (value < today) {
                        setDateErrors((prev) => ({
                          ...prev,
                          iddate:
                            "تاريخ انتهاء الهوية لا يمكن أن يكون في الماضي",
                        }));
                      } else {
                        setDateErrors((prev) => ({ ...prev, iddate: "" }));
                      }
                    }}
                    value={humancases.details.id_expiration_date}
                    style={{
                      width: "100%",
                      borderColor: dateErrors.iddate ? "red" : "",
                    }}
                  />
                </div>
                {dateErrors.iddate && (
                  <span className="error" style={{ color: "red" }}>
                    {dateErrors.iddate}
                  </span>
                )}
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
                  value={humancases.details.note}
                  onChange={(e) =>
                    setHumancases({
                      ...humancases,
                      details: { ...humancases.details, note: e.target.value },
                    })
                  } // Assuming 1 is the default value for gender(e.target.value)}
                />
                {error && error.note && (
                  <span className="error">{error.note}</span>
                )}
              </div>
              <div
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
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
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

export default EditBeneficiary;
