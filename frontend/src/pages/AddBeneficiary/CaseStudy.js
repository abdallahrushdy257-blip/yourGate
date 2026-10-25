import React, { useState, useEffect } from "react";
import "../CreateLoan/createLoan.css";
import RegisterTextbox from "../../components/RegisterTextBox";
import Title from "../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBank,
  faDatabase,
  faGraduationCap,
  faFileContract,
  faNotesMedical,
  faPeopleRoof,
  faPersonHarassing,
  faPhoneVolume,
  faPlus,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import "./addBeneficiary.css";
import RegisterSelect from "../../components/RegisterSelect";
import UploadInput from "../../components/UploadInput";
import RegisterRadio from "../../components/Radio";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import { useNavigate, useParams } from "react-router";
import CustomTable from "../../components/CustomTable";
import RegisterTextarea from "../../components/RegisterTextarea";

import dayjs from "dayjs";
import PrintCaseStudy from "../../components/PrintCaseStudy";

function CaseStudy(props) {
  const tabs = [
    "beneficiary",
    "mainbeneficiarydata",
    "bankdata",
    "qualificationposition",
    "housingdata",
    "healthdata",
    "dependentsdata",
    "Decision",
  ];
  const [activeTab, setActiveTab] = useState("beneficiary");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const params = useParams();
  const id = props?.id || params?.id;
  const [decision, setDecision] = useState("");
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const getAllData = async () => {
    try {
      const res = await API.get(`/humancasedetails/get/${id}`);
      // const data = await res;
      // if (data.status === 200) {
      if (res.status === 200) {
        // setRows(data.data);
        setRows(res.data);

        setLoading(false);
        console.log(rows.details.bankdetails_upload);
      }
    } catch (error) {
      console.error(error);
      // setError(error.response.data.errors);
      setError(error.response?.data?.errors);
    }
  };

  const handleDecision = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", id);
    formData.append("decision", decision);
    formData.append("note", note);
    try {
      const res = await API.post("/humancases/update/status", formData);
      // const data = await res;
      // if (data.status === 200) {
      if (res.status === 200) {
        if (props?.onClose) {
          props.onClose();
        } else {
          navigate("/beneficiary");
        }
      }
    } catch (error) {
      console.error(error);
      // setError(error.response.data.errors);
      setError(error.response?.data?.errors);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);
  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const [dob, setDob] = useState(null);
  const [age, setAge] = useState("");

  const handleDobChange = (newValue) => {
    setDob(newValue);

    if (newValue) {
      const birthDate = dayjs(newValue);
      const today = dayjs();
      let calculatedAge = today.year() - birthDate.year();

      if (
        today.month() < birthDate.month() ||
        (today.month() === birthDate.month() && today.date() < birthDate.date())
      ) {
        calculatedAge--;
      }

      setAge(calculatedAge);
    } else {
      setAge("");
    }
  };

  const [cardNum, setCardNum] = useState("");
  const [mobileNum, setMobileNum] = useState("");
  const [errors, setErrors] = useState({});

  const [dobMap, setDobMap] = useState({});
  const [ageMap, setAgeMap] = useState({});

  const handleDobChange2 = (id, newValue) => {
    setDobMap((prev) => ({ ...prev, [id]: newValue }));

    if (newValue) {
      const birthDate = dayjs(newValue);
      const today = dayjs();
      let calculatedAge = today.year() - birthDate.year();

      if (
        today.month() < birthDate.month() ||
        (today.month() === birthDate.month() && today.date() < birthDate.date())
      ) {
        calculatedAge--;
      }

      setAgeMap((prev) => ({ ...prev, [id]: calculatedAge }));
    } else {
      setAgeMap((prev) => ({ ...prev, [id]: "" }));
    }
  };

  // const [healthStatus, setHealthStatus] = useState('');
  const [illnesses, setIllnesses] = useState([{ id: 1 }]);
  const [dependents, setDependents] = useState([{ id: 1 }]);
  const [housingExpenses, setHousingExpenses] = useState([{ id: 1 }]);

  const handleAddHousingExpense = () => {
    setHousingExpenses([
      ...housingExpenses,
      { id: housingExpenses.length + 1 },
    ]);
  };

  // const handleRadioChange = (value) => {
  //     setHealthStatus(value);
  // };

  // const handleAddIllness = () => {
  //     setIllnesses([...illnesses, { id: illnesses.length + 1 }]);
  // };

  // const handleAddDependent = () => {
  //     setDependents([...dependents, { id: dependents.length + 1 }]);
  // };

  const [incomeSources, setIncomeSources] = useState([{ id: 1 }]);

  const [trainingCourses, setTrainingCourses] = useState([{ id: 1 }]);

  const handleAddIncomeSource = () => {
    setIncomeSources([...incomeSources, { id: incomeSources.length + 1 }]);
  };

  const handleAddTrainingCourse = () => {
    setTrainingCourses([
      ...trainingCourses,
      { id: trainingCourses.length + 1 },
    ]);
  };
  const renderContent = () => {
    switch (activeTab) {
      case "beneficiary":
        return (
          <>
            <div className="AddBeneficiary">
              <Title
                title="بيانات مستفيد"
                icon={<FontAwesomeIcon icon={faPersonHarassing} />}
              />
              <div className="global-form-container">
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id="benName"
                    label="إسم المستفيد"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={rows && rows.case && rows.case.name}
                    disabled
                  />
                  <RegisterSelect
                    id="fileStatus"
                    label="حالة المستفيد"
                    stylee={{ width: "40%" }}
                    parentStyle={{ width: "30%" }}
                    options={[
                      { value: "", label: "اختر الحالة" },
                      { value: "1", label: "مستفيد مؤقت" },
                      { value: "2", label: "مستفيد دائم" },
                    ]}
                    value={rows && rows.case && rows.case.type}
                    disabled
                  />
                </div>

                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    disabled={true}
                    parentStyle={{
                      width: "30%",
                    }}
                    id="createdBy"
                    label="انشأ بواسطة"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.case &&
                      rows.case.details &&
                      rows.case.details.email
                    }
                    readOnly
                  />{" "}
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id="updateDate"
                    label="تاريخ التحديث"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.case &&
                      new Date(rows.case.updated_at).toISOString().substr(0, 10)
                    }
                    disabled
                  />{" "}
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    disabled={true}
                    parentStyle={{
                      width: "30%",
                    }}
                    id="happendby"
                    label="حدث بواسطة"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.case &&
                      rows.case.details &&
                      rows.case.details.email
                    }
                    readOnly
                  />{" "}
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id="createDate"
                    label="تاريخ الإنشاء"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.case &&
                      new Date(rows.case.created_at).toISOString().substr(0, 10)
                    }
                    disabled
                  />{" "}
                </div>
              </div>
            </div>
          </>
        );
      case "mainbeneficiarydata":
        return (
          <>
            <div className="AddBeneficiary">
              <Title
                title="البيانات الاساسية"
                icon={<FontAwesomeIcon icon={faDatabase} />}
              />
              <div className="global-form-container">
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{
                      width: "20%",
                    }}
                    id="name"
                    label="الإسم"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={rows && rows.case && rows.case.name}
                    disabled
                  />{" "}
                  <RegisterSelect
                    id="sex"
                    label="النوع"
                    stylee={{ width: "30%" }}
                    parentStyle={{ width: "20%", marginBottom: "20px" }}
                    options={[
                      { value: "", label: "اختر النوع" },
                      { value: "0", label: "ذكر" },
                      { value: "1", label: "أنثي" },
                    ]}
                    value={rows && rows.case && rows.case.gender}
                    disabled
                  />
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{ width: "20%" }}
                    id="dob"
                    label="تاريخ الميلاد"
                    type="text"
                    stylee={{ width: "40%" }}
                    value={rows && rows.case && rows.case.dateofbirth}
                    disabled
                  />
                  <RegisterSelect
                    id="relation"
                    label="الحالة الإجتماعية"
                    stylee={{ width: "30%" }}
                    parentStyle={{ width: "20%", marginBottom: "20px" }}
                    options={[
                      { value: "", label: "اختر الحالة الإجتماعية" },
                      { value: "0", label: "أعزب" },
                      { value: "1", label: "متزوج" },
                      { value: "2", label: "مطلق" },
                      { value: "3", label: "أرمل" },
                    ]}
                    value={rows && rows.case && rows.case && rows.case.status}
                    disabled
                  />
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{
                      width: "20%",
                    }}
                    id="nationality"
                    label="الجنسية"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.case &&
                      rows.case.details &&
                      rows.case.details.nationality
                    }
                  />{" "}
                  <RegisterTextbox
                    parentStyle={{
                      width: "20%",
                    }}
                    id="idnum"
                    label="رقم الهوية"
                    type="number"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.case &&
                      rows.case.details &&
                      rows.case.details.id_number
                    }
                    disabled
                  />{" "}
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{
                      width: "20%",
                    }}
                    id="phoneNum"
                    label="رقم الجوال"
                    type="number"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.case &&
                      rows.case.details &&
                      rows.case.details.phone_number
                    }
                    disabled
                  />{" "}
                  <RegisterTextbox
                    parentStyle={{
                      width: "20%",
                    }}
                    id="email"
                    label="البريد الإلكتروني"
                    type="email"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.case &&
                      rows.case.details &&
                      rows.case.details.email
                    }
                    disabled
                  />{" "}
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{
                      width: "20%",
                    }}
                    id="accNumber"
                    label="رقم الحساب"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.case &&
                      rows.case.details &&
                      rows.case.details.account_number
                    }
                    disabled
                  />{" "}
                  <RegisterTextbox
                    parentStyle={{
                      width: "20%",
                    }}
                    id="idSource"
                    label="مصدر الهوية"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.case &&
                      rows.case.details &&
                      rows.case.details.id_number
                    }
                    disabled
                  />{" "}
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{
                      width: "20%",
                    }}
                    id="idDate"
                    label="تاريخ انتهاء الهوية"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.case &&
                      rows.case.details &&
                      rows.case.details.id_expiration_date
                    }
                    disabled
                  />{" "}
                  <RegisterTextbox
                    parentStyle={{
                      width: "20%",
                    }}
                    id="moreNotes"
                    label="ملاحظات اضافية"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.case &&
                      rows.case.details &&
                      rows.case.details.note
                    }
                    disabled
                  />{" "}
                </div>
              </div>
            </div>
          </>
        );
      case "bankdata":
        return (
          <>
            <div className="AddBeneficiary">
              <Title
                title="البيانات البنكية"
                icon={<FontAwesomeIcon icon={faBank} />}
              />
              <div className="global-form-container">
                {rows && rows.details && rows.details.bankdetails !== null ? (
                  <>
                    <div className="AddBeneficiaryContainerRow">
                      <RegisterTextbox
                        parentStyle={{
                          width: "30%",
                        }}
                        id="bankName"
                        label="إسم البنك"
                        type="text"
                        stylee={{
                          width: "40%",
                        }}
                        value={
                          rows && rows.details && rows.details.bankdetails
                            ? rows.details.bankdetails.name
                            : "لا يوجد بيانات حاليا"
                        }
                        disabled
                      />{" "}
                    </div>

                    <div className="AddBeneficiaryContainerRow">
                      <RegisterTextbox
                        parentStyle={{
                          width: "30%",
                        }}
                        id="branch"
                        label="الفرع"
                        type="text"
                        stylee={{
                          width: "40%",
                        }}
                        value={
                          rows &&
                          rows.details &&
                          rows.details.bankdetails &&
                          rows.details.bankdetails.branch
                            ? rows.details.bankdetails.branch
                            : "لا يوجد بيانات حاليا"
                        }
                        disabled
                      />{" "}
                    </div>
                    <div className="AddBeneficiaryContainerRow">
                      <RegisterTextbox
                        parentStyle={{
                          width: "30%",
                        }}
                        id="ibanNum"
                        label="رقم IBAN"
                        type="text"
                        stylee={{
                          width: "40%",
                        }}
                        value={
                          rows &&
                          rows.details &&
                          rows.details.bankdetails &&
                          rows.details.bankdetails.iban
                            ? rows.details.bankdetails.iban
                            : "لا يوجد بيانات حاليا"
                        }
                        disabled
                      />{" "}
                    </div>

                    <div
                      className="d-flex justify-content-center flex-column text-end mt-3 m-auto"
                      style={{ width: "30%" }}
                    >
                      <h6>صورة بيانات البنك</h6>
                      <div
                        style={{
                          width: "100%",
                          margin: "10px auto 5px",
                          textAlign: "center",
                          border: "3px solid var(--border-color)",
                          borderRadius: "10px",
                          padding: "20px",
                        }}
                      >
                        {rows?.details?.bankdetails_upload ? (
                          <img
                            src={rows.details.bankdetails_upload}
                            alt="صورة بيانات البنك"
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              borderRadius: "10px",
                            }}
                          />
                        ) : (
                          <h4 style={{ color: "var(--text-color)" }}>
                            لا توجد صورة حالياً
                          </h4>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3
                      style={{
                        textAlign: "center",
                        color: "var(--text-color)",
                      }}
                    >
                      لا يوجد بيانات حاليا
                    </h3>
                  </>
                )}
              </div>
            </div>
          </>
        );
      case "qualificationposition":
        return (
          <>
            <div className="AddBeneficiary">
              <Title
                title="المؤهل والوظيفة"
                icon={<FontAwesomeIcon icon={faGraduationCap} />}
              />
              {rows && rows.work_education !== null ? (
                <>
  <div className="AddBeneficiaryContainer custom-data-view">
  {/* القسم الأول: المؤهلات والوظائف */}
  <div className="data-section">
    <h3 className="section-title">المؤهلات والوظائف</h3>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"20px",margin:"auto"}}>
      <div className="info-item">
        <label>المؤهل الدراسي:</label>
        <span>{rows?.work_education?.educationlevel || "غير محدد"}</span>
      </div>
      <div className="info-item">
        <label>الوظيفة الحالية:</label>
        <span>{rows?.work_education?.job || "لا يوجد"}</span>
      </div>
      <div className="info-item">
        <label>القدرة على العمل:</label>
        <span className={rows?.work_education?.canwork == 0 ? "status-no" : "status-yes"}>
          {rows?.work_education?.canwork == 0 ? "لا يستطيع" : "نعم يستطيع"}
        </span>
      </div>
    </div>
  </div>

  {/* القسم الثاني: الدخل */}
  <div className="data-section">
    <h3 className="section-title">بيانات الدخل</h3>
    {rows?.work_education?.incomesource?.length > 0 ? (
      rows.work_education.incomesource.map((income, index) => (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"20px",margin:"auto"}} className=" income-row" key={index}>
          <div className="info-item">
            <label>مصدر الدخل:</label>
            <span>{income.name}</span>
          </div>
          <div className="info-item">
            <label>قيمة الراتب:</label>
            <span className="amount">{income.amount} ريال</span>
          </div>
          <div className="info-item">
            <label>مرفق الدخل:</label>
            <div className="image-preview">
              {rows?.work_education?.incomesource_upload ? (
                <img src={rows.work_education.incomesource_upload} alt="مرفق الدخل" />
              ) : (
                <span className="no-data">لا يوجد مرفق</span>
              )}
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="empty-state">لا توجد بيانات دخل مسجلة</p>
    )}
  </div>

  {/* القسم الثالث: الدورات التدريبية */}
  <div className="data-section">
    <h3 className="section-title">الدورات التدريبية</h3>
    {rows?.work_education?.courses?.length > 0 ? (
      rows.work_education.courses.map((training, index) => (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"20px",margin:"auto"}} className="course-row" key={index}>
          <div className="info-item">
            <label>اسم الدورة:</label>
            <span>{training.title}</span>
          </div>
          <div className="info-item">
            <label>الجهة المنظمة:</label>
            <span>{training.address}</span>
          </div>
          <div className="info-item">
            <label>الشهادة:</label>
            <div className="image-preview">
              {rows?.work_education?.courses_upload ? (
                <img src={rows.work_education.courses_upload} alt="شهادة الدورة" />
              ) : (
                <span className="no-data">لا يوجد صورة</span>
              )}
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="empty-state danger">لا توجد دورات تدريبية حالياً</p>
    )}
  </div>
</div>
</>
              ) : (
                <>
                  <h3 style={{ textAlign: "center", color: "red" }}>
                    لا يوجد بيانات حاليا
                  </h3>
                </>
              )}
            </div>
          </>
        );
      case "housingdata":
        return (
          <>
            <div className="AddBeneficiary">
              <Title
                title="بيانات السكن"
                icon={<FontAwesomeIcon icon={faPeopleRoof} />}
              />
              {console.log(rows)}
              {rows &&
              rows.details &&
              rows.details.personalfeesdetails &&
              rows.details.personalfeesdetails.length > 0 ? (
                <div className="global-form-container">
                  <div className="AddBeneficiaryContainerRow ">
                    <RegisterTextbox
                      parentStyle={{
                        width: "30%",
                      }}
                      id="state"
                      label="القطاع (المحافظة)"
                      type="text"
                      stylee={{
                        width: "40%",
                      }}
                      value={
                        rows &&
                        rows.details &&
                        rows.details.personalfeesdetails &&
                        rows.details.personalfeesdetails.state
                      }
                      disabled
                    />{" "}
                    <RegisterTextbox
                      parentStyle={{
                        width: "30%",
                      }}
                      id="village"
                      label="القرية (الحي)"
                      type="text"
                      stylee={{
                        width: "40%",
                      }}
                      value={
                        rows &&
                        rows.details &&
                        rows.details.personalfeesdetails &&
                        rows.details.personalfeesdetails.village
                      }
                      disabled
                    />{" "}
                  </div>
                  <div className="AddBeneficiaryContainerRow">
                    <RegisterTextbox
                      parentStyle={{
                        width: "30%",
                      }}
                      id="nationalAdress"
                      label="العنوان الوطني"
                      type="text"
                      stylee={{
                        width: "40%",
                      }}
                      value={
                        rows &&
                        rows.details.personalfeesdetails &&
                        rows.details.personalfeesdetails.nationalAddress
                      }
                      disabled
                    />{" "}
                    <RegisterTextbox
                      parentStyle={{
                        width: "30%",
                      }}
                      id="summaryadress"
                      label="العنوان المختصر"
                      type="text"
                      stylee={{
                        width: "40%",
                      }}
                      value={
                        rows &&
                        rows.details.personalfeesdetails &&
                        rows.details.personalfeesdetails.summaryAddress
                      }
                      disabled
                    />{" "}
                  </div>
                  <div className="AddBeneficiaryContainerRow">
                    <RegisterTextbox
                      parentStyle={{
                        width: "30%",
                      }}
                      id="summaryadress"
                      label="نوع السكن "
                      type="text"
                      stylee={{
                        width: "40%",
                      }}
                      value={
                        rows &&
                        rows.details.personalfeesdetails &&
                        rows.details.personalfeesdetails.homeType
                      }
                      disabled
                    />
                    <RegisterTextbox
                      parentStyle={{
                        width: "30%",
                      }}
                      id="ownership"
                      label="ملكية السكن"
                      type="text"
                      stylee={{
                        width: "40%",
                      }}
                      value={
                        rows &&
                        rows.details.personalfeesdetails &&
                        rows.details.personalfeesdetails.homeOwnership
                      }
                      disabled
                    />
                  </div>
                  <div className="AddBeneficiaryContainerRow">
                    <RegisterTextbox
                      parentStyle={{
                        width: "30%",
                      }}
                      id="month"
                      label="الإيجار الشهري للسكن"
                      type="number"
                      stylee={{
                        width: "40%",
                      }}
                      value={
                        rows &&
                        rows.details.personalfeesdetails &&
                        rows.details.personalfeesdetails.rent
                      }
                      disabled
                    />
                    <RegisterTextbox
                      parentStyle={{
                        width: "30%",
                      }}
                      id="cars"
                      label="عدد السيارات المملوكة"
                      type="number"
                      stylee={{
                        width: "40%",
                      }}
                      value={
                        rows &&
                        rows.details.personalfeesdetails &&
                        rows.details.personalfeesdetails.cars
                      }
                      disabled
                    />
                  </div>

                  <div className="AddBeneficiaryContainerRow">
                    <RegisterTextbox
                      parentStyle={{
                        width: "30%",
                      }}
                      id="lands"
                      label="عدد الأراضي المملوكة"
                      type="number"
                      stylee={{
                        width: "40%",
                      }}
                      value={
                        rows &&
                        rows.details.personalfeesdetails &&
                        rows.details.personalfeesdetails.lands
                      }
                      disabled
                    />
                    <RegisterTextbox
                      parentStyle={{
                        width: "30%",
                      }}
                      id="components"
                      label="مكونات السكن"
                      type="text"
                      stylee={{
                        width: "40%",
                      }}
                      value={
                        rows &&
                        rows.details.personalfeesdetails &&
                        rows.details.personalfeesdetails.components
                      }
                      disabled
                    />
                  </div>
                  <div className="AddBeneficiaryContainerRow">
                    <RegisterTextbox
                      parentStyle={{
                        width: "30%",
                      }}
                      id="furniture"
                      label="اثاث الشقة"
                      type="text"
                      stylee={{
                        width: "40%",
                      }}
                      value={
                        rows &&
                        rows.details.personalfeesdetails &&
                        rows.details.personalfeesdetails.furniture
                      }
                      disabled
                    />
                    <RegisterTextbox
                      parentStyle={{
                        width: "30%",
                      }}
                      id="personperMonth"
                      label="تكاليف الشهر للفرد"
                      type="text"
                      stylee={{
                        width: "40%",
                      }}
                      value={
                        rows &&
                        rows.details.personalfeesdetails &&
                        rows.details.personalfeesdetails.cost
                      }
                      disabled
                    />
                  </div>

                  <h3
                    style={{
                      direction: "rtl",
                      marginRight: "12%",
                      marginTop: "30px",
                    }}
                  >
                    {" "}
                    مصروفات السكن{" "}
                  </h3>
                  <table
                    style={{
                      width: "75%",
                      margin: "auto",
                      direction: "rtl",
                      textAlign: "center",
                      borderCollapse: "collapse",
                      padding: "20px",
                    }}
                    className="styledTable"
                  >
                    <tr>
                      <th> الفاتورة الشهرية</th>
                      <th>القيمة</th>
                    </tr>

                    {rows &&
                    rows.details.personalfeesdetails &&
                    JSON.parse(rows.details.personalfeesdetails.bill) &&
                    JSON.parse(rows.details.personalfeesdetails.bill).length >
                      0 ? (
                      JSON.parse(rows.details.personalfeesdetails.bill).map(
                        (bill, index) => (
                          <tr key={index}>
                            <td>{bill.bill}</td>
                            <td>{bill.amount}</td>
                          </tr>
                        ),
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          style={{
                            textAlign: "center",
                            fontSize: "20px",
                            color: "var(--text-color)",
                            margin: "20px",
                          }}
                        >
                          لا يوجد بيانات حاليا
                        </td>
                      </tr>
                    )}
                  </table>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "space-evenly",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: "20px",
                        width: "60%",
                      }}
                    >
                      {rows.details.personalfeesdetails_upload1 &&
                      rows.details.personalfeesdetails_upload1 !== "" ? (
                        <h5>صورة ملكية السكن </h5>
                      ) : (
                        <h5>لا توجد صورة لملكية السكن </h5>
                      )}

                      {/* {rows.details.personalfeesdetails_upload2 &&
                      rows.details.personalfeesdetails_upload2 !== "" ? (
                        <a
                          href={rows.details.personalfeesdetails_upload1}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </a>
                      ) : null} */}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      {rows.details.personalfeesdetails_upload1 &&
                      rows.details.personalfeesdetails_upload1 !== "" ? (
                        <h5>صورة فاتورة الكهرباء</h5>
                      ) : (
                        <h5>لا توجد صورة لفاتورة الكهرباء </h5>
                      )}
                      {rows.details.personalfeesdetails_upload2 &&
                      rows.details.personalfeesdetails_upload2 !== "" ? (
                        <a
                          href={rows.details.personalfeesdetails_upload2}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="message-container">
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "25px",
                      color: "red",
                      margin: "30px",
                    }}
                  >
                    لا يوجد بيانات حاليا
                  </p>
                </div>
              )}
            </div>
          </>
        );
      case "healthdata":
        return (
          <>
           <div className="AddBeneficiary health-data-section">
  <Title
    title="البيانات الصحية"
    icon={<FontAwesomeIcon icon={faNotesMedical} />}
  />

  <div className="health-cards-container">
    {rows.health.length > 0 ? (
      rows.health.map((illness) => (
        <div key={illness.id} className="health-card">
          <div className="card-grid">
            <div className="info-group">
              <label>اسم المرض</label>
              <div className="value-box">{illness.disease_name}</div>
            </div>

            <div className="info-group">
              <label>نوع المرض</label>
              <div className="value-box">{illness.disease_type}</div>
            </div>

            <div className="info-group">
              <label>خطورة المرض</label>
              <div className="value-box danger-level">{illness.disease_degree}</div>
            </div>

            <div className="info-group">
              <label>نوع العلاج</label>
              <div className="value-box">{illness.treatment_type}</div>
            </div>

            <div className="info-group">
              <label>تكلفة العلاج</label>
              <div className="value-box cost-value">{illness.treatment_cost} ريال</div>
            </div>

            <div className="info-group full-width">
              <label>ملاحظات</label>
              <div className="value-box notes-box">{illness.notes || "لا توجد ملاحظات"}</div>
            </div>
            
            <div className="info-group full-width">
              <label>التقرير الطبي</label>
              <div className="report-preview">
                 {illness.attachment ? (
                    <img src={illness.attachment} alt="التقرير الطبي" />
                 ) : (
                    <span className="no-data">لا يوجد تقرير مرفق</span>
                 )}
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="empty-health">
        <FontAwesomeIcon icon={faNotesMedical} size="2x" style={{marginBottom: '10px', opacity: 0.5}} />
        <p>لا توجد بيانات صحية مسجلة حالياً</p>
      </div>
    )}
  </div>
</div>
          </>
        );
      case "dependentsdata":
        return (
          <>
            <div className="AddBeneficiary">
              <Title
                title="بيانات التابعين"
                icon={<FontAwesomeIcon icon={faPeopleRoof} />}
              />
              <div className="global-form-container">
                {/* <span className='addillness' onClick={handleAddDependent}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </span> */}
                <div
                  className="duplicatedContent"
                  style={{ marginTop: "50px" }}
                >
                  <table className="vac-custom-table">
                    <thead>
                      <tr className="vac-table-header selected-row">
                        <th>الأسم</th>
                        <th> الجنس</th>
                        <th> درجة القرابة</th>
                        <th> تارخ الميلاد</th>
                        <th> الجوال</th>
                        <th>ملاحظات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.dependants.length > 0 ? (
                        rows.dependants.map((dependants) => (
                          <tr key={dependants.id} className="selected-row">
                            <td>
                              <RegisterTextbox
                                id={`name-${dependants.id}`}
                                label="الأسم"
                                type="text"
                                stylee={{ width: "100%" }}
                                value={dependants.name}
                                disabled
                              />
                            </td>
                            <td>
                              <RegisterTextbox
                                id={`type-${dependants.id}`}
                                label="الجنس"
                                type="text"
                                stylee={{ width: "100%" }}
                                value={dependants.gender === 0 ? "ذكر" : "أنثى"}
                                disabled
                              />
                            </td>
                            <td>
                              <RegisterTextbox
                                id={`danger-${dependants.id}`}
                                label="درجة القرابة"
                                type="text"
                                stylee={{ width: "100%" }}
                                value={dependants.relation}
                                disabled
                              />
                            </td>
                            <td>
                              <RegisterTextbox
                                id={`midtype-${dependants.id}`}
                                label="تاريخ الميلاد"
                                type="text"
                                stylee={{ width: "100%" }}
                                value={dependants.dateofbirth}
                                disabled
                              />
                            </td>
                            <td>
                              <RegisterTextbox
                                id={`cost-${dependants.id}`}
                                label="الجوال"
                                type="number"
                                stylee={{ width: "100%" }}
                                value={dependants.phone}
                                disabled
                              />
                            </td>
                            <td>
                              <RegisterTextbox
                                id={`notes-${dependants.id}`}
                                label="ملاحظات"
                                type="text"
                                stylee={{ width: "100%" }}
                                value={dependants.note}
                                disabled
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            style={{
                              textAlign: "center",
                              fontSize: "20px",
                              color: "var(--text-color)",
                              margin: "20px",
                            }}
                          >
                            لا يوجد أقارب
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        );
      case "Decision":
        return (
          <>
            <div className="AddBeneficiary">
              <Title
                title="القرار"
                icon={<FontAwesomeIcon icon={faFileContract} />}
              />
              <div className="global-form-container">
                {rows && rows.case && rows.case.status == 2 ? (
                  <h3 style={{ textAlign: "center", color: "green" }}>
                    تم قبول الحالة
                  </h3>
                ) : (
                  <form
                    className="decisionForm"
                    style={{ width: "50%", margin: "auto" }}
                  >
                    <RegisterSelect
                      label="القرار"
                      id="decision"
                      options={[
                        { value: "1", label: "قيد المراجعة" },
                        { value: "2", label: "موافقة" },
                        { value: "3", label: "رفض" },
                      ]}
                      value={decision}
                      onChange={(e) => setDecision(e.target.value)}
                      stylee={{ width: "100%" }}
                    />
                    {error && error.decision && (
                      <span className="error">{error.decision}</span>
                    )}
                    <RegisterTextarea
                      label="ملاحظات"
                      id="notes"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      stylee={{ width: "100%" }}
                    />
                    {error && error.note && (
                      <span className="error">{error.note}</span>
                    )}
                    <div style={{textAlign:"center",marginTop:"8px"}} className="buttons">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleDecision}
                      >
                        حفظ
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderAllContent = () => {
    return (
      <div>
        <>
          <div className="AddBeneficiary">
            <Title title="بيانات مستفيد" />
            <div className="AddBeneficiaryContainer">
              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  parentStyle={{
                    width: "100%",
                  }}
                  id="benName"
                  label="إسم المستفيد"
                  type="text"
                  stylee={{
                    width: "100%",
                  }}
                  value={rows && rows.case && rows.case.name}
                  disabled
                />
                <RegisterSelect
                  id="fileStatus"
                  label="حالة المستفيد"
                  stylee={{ width: "40%" }}
                  parentStyle={{ width: "30%" }}
                  options={[
                    { value: "", label: "اختر الحالة" },
                    { value: "1", label: "مستفيد مؤقت" },
                    { value: "2", label: "مستفيد دائم" },
                  ]}
                  value={rows && rows.case && rows.case.type}
                  disabled
                />
              </div>

              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  disabled={true}
                  parentStyle={{
                    width: "30%",
                  }}
                  id="createdBy"
                  label="انشأ بواسطة"
                  type="text"
                  stylee={{
                    width: "40%",
                  }}
                  value={
                    rows &&
                    rows.case &&
                    rows.case.details &&
                    rows.case.details.email
                  }
                  readOnly
                />{" "}
                <RegisterTextbox
                  parentStyle={{
                    width: "30%",
                  }}
                  id="updateDate"
                  label="تاريخ التحديث"
                  type="text"
                  stylee={{
                    width: "40%",
                  }}
                  value={
                    rows &&
                    rows.case &&
                    new Date(rows.case.updated_at).toISOString().substr(0, 10)
                  }
                  disabled
                />{" "}
              </div>
              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  disabled={true}
                  parentStyle={{
                    width: "30%",
                  }}
                  id="happendby"
                  label="حدث بواسطة"
                  type="text"
                  stylee={{
                    width: "40%",
                  }}
                  value={
                    rows &&
                    rows.case &&
                    rows.case.details &&
                    rows.case.details.email
                  }
                  readOnly
                />{" "}
                <RegisterTextbox
                  parentStyle={{
                    width: "30%",
                  }}
                  id="createDate"
                  label="تاريخ الإنشاء"
                  type="text"
                  stylee={{
                    width: "40%",
                  }}
                  value={
                    rows &&
                    rows.case &&
                    new Date(rows.case.created_at).toISOString().substr(0, 10)
                  }
                  disabled
                />{" "}
              </div>
            </div>
          </div>
        </>

        <>
          <div className="AddBeneficiary">
            <Title title="البيانات الاساسية" />
            <div className="AddBeneficiaryContainer">
              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  parentStyle={{
                    width: "20%",
                  }}
                  id="name"
                  label="الإسم"
                  type="text"
                  stylee={{
                    width: "40%",
                  }}
                  value={rows && rows.case && rows.case.name}
                  disabled
                />{" "}
                <RegisterSelect
                  id="sex"
                  label="النوع"
                  stylee={{ width: "30%" }}
                  parentStyle={{ width: "20%", marginBottom: "20px" }}
                  options={[
                    { value: "", label: "اختر النوع" },
                    { value: "0", label: "ذكر" },
                    { value: "1", label: "أنثي" },
                  ]}
                  value={rows && rows.case && rows.case.gender}
                  disabled
                />
              </div>
              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  parentStyle={{ width: "20%" }}
                  id="dob"
                  label="تاريخ الميلاد"
                  type="text"
                  stylee={{ width: "40%" }}
                  value={rows && rows.case && rows.case.dateofbirth}
                  disabled
                />
                <RegisterSelect
                  id="relation"
                  label="الحالة الإجتماعية"
                  stylee={{ width: "30%" }}
                  parentStyle={{ width: "20%", marginBottom: "20px" }}
                  options={[
                    { value: "", label: "اختر الحالة الإجتماعية" },
                    { value: "0", label: "أعزب" },
                    { value: "1", label: "متزوج" },
                    { value: "2", label: "مطلق" },
                    { value: "3", label: "أرمل" },
                  ]}
                  value={rows && rows.case && rows.case && rows.case.status}
                  disabled
                />
              </div>
              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  parentStyle={{
                    width: "20%",
                  }}
                  id="nationality"
                  label="الجنسية"
                  type="text"
                  stylee={{
                    width: "40%",
                  }}
                  value={
                    rows &&
                    rows.case &&
                    rows.case.details &&
                    rows.case.details.nationality
                  }
                />{" "}
                <RegisterTextbox
                  parentStyle={{
                    width: "20%",
                  }}
                  id="idnum"
                  label="رقم الهوية"
                  type="number"
                  stylee={{
                    width: "40%",
                  }}
                  value={
                    rows &&
                    rows.case &&
                    rows.case.details &&
                    rows.case.details.id_number
                  }
                  disabled
                />{" "}
              </div>
              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  parentStyle={{
                    width: "20%",
                  }}
                  id="phoneNum"
                  label="رقم الجوال"
                  type="number"
                  stylee={{
                    width: "40%",
                  }}
                  value={
                    rows &&
                    rows.case &&
                    rows.case.details &&
                    rows.case.details.phone_number
                  }
                  disabled
                />{" "}
                <RegisterTextbox
                  parentStyle={{
                    width: "20%",
                  }}
                  id="email"
                  label="البريد الإلكتروني"
                  type="email"
                  stylee={{
                    width: "40%",
                  }}
                  value={
                    rows &&
                    rows.case &&
                    rows.case.details &&
                    rows.case.details.email
                  }
                  disabled
                />{" "}
              </div>
              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  parentStyle={{
                    width: "20%",
                  }}
                  id="accNumber"
                  label="رقم الحساب"
                  type="text"
                  stylee={{
                    width: "40%",
                  }}
                  value={
                    rows &&
                    rows.case &&
                    rows.case.details &&
                    rows.case.details.account_number
                  }
                  disabled
                />{" "}
                <RegisterTextbox
                  parentStyle={{
                    width: "20%",
                  }}
                  id="idSource"
                  label="مصدر الهوية"
                  type="text"
                  stylee={{
                    width: "40%",
                  }}
                  value={
                    rows &&
                    rows.case &&
                    rows.case.details &&
                    rows.case.details.id_number
                  }
                  disabled
                />{" "}
              </div>
              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  parentStyle={{
                    width: "20%",
                  }}
                  id="idDate"
                  label="تاريخ انتهاء الهوية"
                  type="text"
                  stylee={{
                    width: "40%",
                  }}
                  value={
                    rows &&
                    rows.case &&
                    rows.case.details &&
                    rows.case.details.id_expiration_date
                  }
                  disabled
                />{" "}
                <RegisterTextbox
                  parentStyle={{
                    width: "20%",
                  }}
                  id="moreNotes"
                  label="ملاحظات اضافية"
                  type="text"
                  stylee={{
                    width: "40%",
                  }}
                  value={
                    rows &&
                    rows.case &&
                    rows.case.details &&
                    rows.case.details.note
                  }
                  disabled
                />{" "}
              </div>
            </div>
          </div>
        </>

        <>
          <div className="AddBeneficiary">
            <Title title="البيانات البنكية" />
            <div className="AddBeneficiaryContainer">
              {rows &&
              rows.details &&
              rows.details.bankdetails !== null &&
              rows.details.bankdetails.length > 0 ? (
                <>
                  <div className="AddBeneficiaryContainerRow">
                    <RegisterTextbox
                      parentStyle={{
                        width: "30%",
                      }}
                      id="bankName"
                      label="إسم البنك"
                      type="text"
                      stylee={{
                        width: "40%",
                      }}
                      value={
                        rows &&
                        rows.details &&
                        rows.details.bankdetails &&
                        rows.details.bankdetails.length > 0
                          ? rows.details.bankdetails.name
                          : "لا يوجد بيانات حاليا"
                      }
                      disabled
                    />{" "}
                  </div>

                  <div className="AddBeneficiaryContainerRow">
                    <RegisterTextbox
                      parentStyle={{
                        width: "30%",
                      }}
                      id="branch"
                      label="الفرع"
                      type="text"
                      stylee={{
                        width: "40%",
                      }}
                      value={
                        rows &&
                        rows.details &&
                        rows.details.bankdetails &&
                        rows.details.bankdetails.branch
                          ? rows.details.bankdetails.branch
                          : "لا يوجد بيانات حاليا"
                      }
                      disabled
                    />{" "}
                  </div>
                  <div className="AddBeneficiaryContainerRow">
                    <RegisterTextbox
                      parentStyle={{
                        width: "30%",
                      }}
                      id="ibanNum"
                      label="رقم IBAN"
                      type="text"
                      stylee={{
                        width: "40%",
                      }}
                      value={
                        rows &&
                        rows.details &&
                        rows.details.bankdetails &&
                        rows.details.bankdetails.iban
                          ? rows.details.bankdetails.iban
                          : "لا يوجد بيانات حاليا"
                      }
                      disabled
                    />{" "}
                  </div>
                </>
              ) : (
                <>
                  <h3
                    style={{ textAlign: "center", color: "var(--text-color)" }}
                  >
                    لا يوجد بيانات حاليا
                  </h3>
                </>
              )}
            </div>
          </div>
        </>

        <>
          <div className="AddBeneficiary">
            <Title title="المؤهل والوظيفة" />
            {rows && rows.work_education !== null ? (
              <>
                <div className="AddBeneficiaryContainer">
                  <h3 style={{ marginRight: "10%" }}>المؤهلات والوظائف</h3>
                  <table
                    style={{
                      width: "80%",
                      margin: "auto",
                      direction: "rtl",
                      textAlign: "center",
                      borderCollapse: "collapse",
                      border: "1px solid var(--text-color)",
                      padding: "20px",
                    }}
                    className="styledTable"
                  >
                    <tr
                      style={{
                        border: "1px solid var(--text-color)",
                        margin: "20px",
                      }}
                    >
                      <th>المؤهل</th>
                      <th>الوظيفة</th>
                      <th>يستطيع العمل</th>
                    </tr>
                    <tr>
                      {/* we have to redesign this part */}
                      <td>
                        {rows &&
                          rows.work_education &&
                          rows.work_education.educationlevel}
                      </td>
                      <td>
                        {rows && rows.work_education && rows.work_education.job}
                      </td>
                      <td>
                        {rows &&
                        rows.work_education &&
                        rows.work_education.canwork == 0
                          ? "لا"
                          : "نعم"}
                      </td>
                    </tr>
                  </table>
                  <h3 style={{ marginRight: "10%" }}>الدخل</h3>
                  <table
                    style={{
                      width: "80%",
                      margin: "auto",
                      direction: "rtl",
                      textAlign: "center",
                      borderCollapse: "collapse",
                      border: "1px solid var(--text-color)",
                      padding: "20px",
                    }}
                    className="styledTable"
                  >
                    <tr
                      style={{
                        border: "1px solid var(--text-color)",
                        margin: "20px",
                      }}
                    >
                      <th>مصدر الدخل</th>
                      <th>الراتب</th>
                    </tr>
                    {rows &&
                    rows.work_education &&
                    rows.work_education.incomesource &&
                    rows.work_education.incomesource.length > 0 ? (
                      rows.work_education.incomesource.map((income, index) => (
                        <tr key={index}>
                          <td>{income.name}</td>
                          <td>{income.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          style={{
                            textAlign: "center",
                            fontSize: "20px",
                            color: "var(--text-color)",
                            margin: "20px",
                          }}
                        >
                          لا يوجد بيانات حاليا
                        </td>
                      </tr>
                    )}
                  </table>
                  <h3 style={{ marginRight: "10%" }}>الدورات التدريبية</h3>
                  <table
                    style={{
                      width: "80%",
                      margin: "auto",
                      direction: "rtl",
                      textAlign: "center",
                      borderCollapse: "collapse",
                      border: "1px solid var(--text-color)",
                      padding: "20px",
                    }}
                    className="styledTable"
                  >
                    <tr
                      style={{
                        border: "1px solid var(--text-color)",
                        margin: "20px",
                      }}
                    >
                      <th>اسم الدورة</th>
                      <th>مكان الحصول عليها</th>
                    </tr>

                    {rows &&
                    rows.work_education &&
                    rows.work_education.courses &&
                    rows.work_education.courses.length > 0 ? (
                      rows.work_education.courses.map((training, index) => (
                        <tr key={index}>
                          <td>{training.title}</td>
                          <td>{training.address}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          style={{
                            textAlign: "center",
                            fontSize: "20px",
                            color: "var(--text-color)",
                            margin: "20px",
                          }}
                        >
                          لا يوجد بيانات حاليا
                        </td>
                      </tr>
                    )}
                  </table>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ textAlign: "center", color: "var(--text-color)" }}>
                  لا يوجد بيانات حاليا
                </h3>
              </>
            )}
          </div>
        </>

        <>
          <div className="AddBeneficiary">
            <Title title="بيانات السكن" />
            {rows &&
            rows.details &&
            rows.details.personalfeesdetails &&
            rows.details.personalfeesdetails.length > 0 ? (
              <>
                <div className="AddBeneficiaryContainerRow ">
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id="state"
                    label="القطاع (المحافظة)"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.details &&
                      rows.details.personalfeesdetails &&
                      rows.details.personalfeesdetails.state
                    }
                    disabled
                  />{" "}
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id="village"
                    label="القرية (الحي)"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.details &&
                      rows.details.personalfeesdetails &&
                      rows.details.personalfeesdetails.village
                    }
                    disabled
                  />{" "}
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id="nationalAdress"
                    label="العنوان الوطني"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.details.personalfeesdetails &&
                      rows.details.personalfeesdetails.nationalAddress
                    }
                    disabled
                  />{" "}
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id="summaryadress"
                    label="العنوان المختصر"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.details.personalfeesdetails &&
                      rows.details.personalfeesdetails.summaryAdDress
                    }
                    disabled
                  />{" "}
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id="summaryadress"
                    label="نوع السكن "
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.details.personalfeesdetails &&
                      rows.details.personalfeesdetails.homeType
                    }
                    disabled
                  />
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id="ownership"
                    label="ملكية السكن"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.details.personalfeesdetails &&
                      rows.details.personalfeesdetails.homeOwnership
                    }
                    disabled
                  />
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id="month"
                    label="الإيجار الشهري للسكن"
                    type="number"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.details.personalfeesdetails &&
                      rows.details.personalfeesdetails.rent
                    }
                    disabled
                  />
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id="cars"
                    label="عدد السيارات المملوكة"
                    type="number"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.details.personalfeesdetails &&
                      rows.details.personalfeesdetails.cars
                    }
                    disabled
                  />
                </div>

                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id="lands"
                    label="عدد الأراضي المملوكة"
                    type="number"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.details.personalfeesdetails &&
                      rows.details.personalfeesdetails.lands
                    }
                    disabled
                  />
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id="components"
                    label="مكونات السكن"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.details.personalfeesdetails &&
                      rows.details.personalfeesdetails.components
                    }
                    disabled
                  />
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id="furniture"
                    label="اثاث الشقة"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.details.personalfeesdetails &&
                      rows.details.personalfeesdetails.furniture
                    }
                    disabled
                  />
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id="personperMonth"
                    label="تكاليف الشهر للفرد"
                    type="text"
                    stylee={{
                      width: "40%",
                    }}
                    value={
                      rows &&
                      rows.details.personalfeesdetails &&
                      rows.details.personalfeesdetails.cost
                    }
                    disabled
                  />
                </div>

                <h3 style={{ direction: "rtl", marginRight: "12%" }}>
                  {" "}
                  مصروفات السكن{" "}
                </h3>
                <table
                  style={{
                    width: "75%",
                    margin: "auto",
                    direction: "rtl",
                    textAlign: "center",
                    borderCollapse: "collapse",
                    border: "1px solid var(--text-color)",
                    padding: "20px",
                  }}
                  className="styledTable"
                >
                  <tr
                    style={{
                      border: "1px solid var(--text-color)",
                      margin: "20px",
                    }}
                  >
                    <th> الفاتورة الشهرية</th>
                    <th>القيمة</th>
                  </tr>

                  {rows &&
                  rows.details.personalfeesdetails &&
                  JSON.parse(rows.details.personalfeesdetails.bill) &&
                  JSON.parse(rows.details.personalfeesdetails.bill).length >
                    0 ? (
                    JSON.parse(rows.details.personalfeesdetails.bill).map(
                      (bill, index) => (
                        <tr key={index}>
                          <td>{bill.bill}</td>
                          <td>{bill.amount}</td>
                        </tr>
                      ),
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        style={{
                          textAlign: "center",
                          fontSize: "20px",
                          color: "var(--text-color)",
                          margin: "20px",
                        }}
                      >
                        لا يوجد بيانات حاليا
                      </td>
                    </tr>
                  )}
                </table>
              </>
            ) : (
              <div className="message-container">
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "25px",
                    color: "red",
                    margin: "30px",
                  }}
                >
                  لا يوجد تفاصيل لعرضها
                </p>
              </div>
            )}
          </div>
        </>

        <>
          <div className="AddBeneficiary">
            <Title title="البيانات الصحية" />
            <>
              <div className="duplicatedContent">
                <table className="vac-custom-table">
                  <thead>
                    <tr className="vac-table-header selected-row">
                      <th>اسم المرض</th>
                      <th>نوع المرض</th>
                      <th>خطورة المرض</th>
                      <th>نوع العلاج</th>
                      <th>تكلفة العلاج</th>
                      <th>ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.health.length > 0 ? (
                      rows.health.map((illness) => (
                        <tr key={illness.id} className="selected-row">
                          <td>
                            <RegisterTextbox
                              id={`name-${illness.id}`}
                              type="text"
                              stylee={{ width: "100%" }}
                              value={illness.disease_name}
                              disabled
                            />
                          </td>
                          <td>
                            <RegisterTextbox
                              id={`type-${illness.id}`}
                              // label="نوع المرض"
                              type="text"
                              stylee={{ width: "100%" }}
                              value={illness.disease_type}
                              disabled
                            />
                          </td>
                          <td>
                            <RegisterTextbox
                              id={`danger-${illness.id}`}
                              // label="خطورة المرض"
                              type="text"
                              stylee={{ width: "100%" }}
                              value={illness.disease_degree}
                              disabled
                            />
                          </td>
                          <td>
                            <RegisterTextbox
                              id={`midtype-${illness.id}`}
                              // label="نوع العلاج"
                              type="text"
                              stylee={{ width: "100%" }}
                              value={illness.treatment_type}
                              disabled
                            />
                          </td>
                          <td>
                            <RegisterTextbox
                              id={`cost-${illness.id}`}
                              // label="تكلفة العلاج"
                              type="number"
                              stylee={{ width: "100%" }}
                              value={illness.treatment_cost}
                              disabled
                            />
                          </td>
                          <td>
                            <RegisterTextbox
                              id={`notes-${illness.id}`}
                              // label="ملاحظات"
                              type="text"
                              stylee={{ width: "100%" }}
                              value={illness.notes}
                              disabled
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          style={{
                            textAlign: "center",
                            fontSize: "20px",
                            color: "var(--text-color)",
                            margin: "20px",
                          }}
                        >
                          لا توجد أمراض
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          </div>
        </>

        <>
          <div className="AddBeneficiary">
            <Title title="بيانات التابعين" />
            <div className="AddBeneficiaryContainer">
              {/* <span className='addillness' onClick={handleAddDependent}>
                                <FontAwesomeIcon icon={faPlus} />
                            </span> */}
              <div className="duplicatedContent">
                <table className="vac-custom-table">
                  <thead>
                    <tr className="vac-table-header selected-row">
                      <th>الأسم</th>
                      <th> الجنس</th>
                      <th> درجة القرابة</th>
                      <th> تارخ الميلاد</th>
                      <th> الجوال</th>
                      <th>ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.dependants.length > 0 ? (
                      rows.dependants.map((dependants) => (
                        <tr key={dependants.id} className="selected-row">
                          <td>
                            <RegisterTextbox
                              id={`name-${dependants.id}`}
                              type="text"
                              stylee={{ width: "100%" }}
                              value={dependants.name}
                              disabled
                            />
                          </td>
                          <td>
                            <RegisterTextbox
                              id={`type-${dependants.id}`}
                              type="text"
                              stylee={{ width: "100%" }}
                              value={dependants.gender === 0 ? "ذكر" : "أنثى"}
                              disabled
                            />
                          </td>
                          <td>
                            <RegisterTextbox
                              id={`danger-${dependants.id}`}
                              type="text"
                              stylee={{ width: "100%" }}
                              value={dependants.relation}
                              disabled
                            />
                          </td>
                          <td>
                            <RegisterTextbox
                              id={`midtype-${dependants.id}`}
                              type="text"
                              stylee={{ width: "100%" }}
                              value={dependants.dateofbirth}
                              disabled
                            />
                          </td>
                          <td>
                            <RegisterTextbox
                              id={`cost-${dependants.id}`}
                              // label="تكلفة العلاج"
                              type="number"
                              stylee={{ width: "100%" }}
                              value={dependants.phone}
                              disabled
                            />
                          </td>
                          <td>
                            <RegisterTextbox
                              id={`notes-${dependants.id}`}
                              // label="ملاحظات"
                              type="text"
                              stylee={{ width: "100%" }}
                              value={dependants.note}
                              disabled
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          style={{
                            textAlign: "center",
                            fontSize: "20px",
                            color: "var(--text-color)",
                            margin: "20px",
                          }}
                        >
                          لا يوجد أقارب
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      </div>
    );
  };

  // New
 const handleFullPrint = () => {
  const printContents = document.getElementById("printSection").innerHTML;

  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;

  doc.open();
  doc.write(`
    <html>
      <head>
        <title>طباعة</title>
        <style>
          .print-container {
  direction: rtl;
  font-family: Arial;
  padding: 20px;
}

.print-section {
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 15px;
}

.print-section h2 {
  border-bottom: 2px solid #333;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

.print-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.print-field {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed #ccc;
  padding: 5px 0;
}

.print-field strong {
  word-break: break-word;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: right;
}

.empty {
  text-align: center;
  color: gray;
}
        </style>
      </head>
      <body>${printContents}</body>
    </html>
  `);
  doc.close();

  iframe.contentWindow.focus();
  iframe.contentWindow.print();

  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
};

  return loading ? (
    <>
      <TestPreLoader />{" "}
    </>
  ) : (
    <>
      <div id="printSection" className="print-only">
        {<PrintCaseStudy data={rows} />}
      </div>

      <div className="createloan">
        <form>
          <div className="divre">
            <div className="myTabs myTabs2" style={{ direction: "rtl" }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`loantab ${
                    activeTab === tab ? "active" : ""
                  } loantab2`}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab === "beneficiary"
                    ? "1"
                    : tab === "mainbeneficiarydata"
                      ? "2"
                      : tab === "bankdata"
                        ? "3"
                        : tab === "qualificationposition"
                          ? "4"
                          : tab === "housingdata"
                            ? "5"
                            : tab === "healthdata"
                              ? "6"
                              : tab === "dependentsdata"
                                ? "7"
                                : tab === "Decision"
                                  ? "8"
                                  : ""}
                </button>
              ))}
            </div>
            <div className="line"></div>
          </div>
          <div className="tabContent">{renderContent()}</div>

          <div className="navigationButtons">
            {activeTab !== "Decision" ? (
              <button
                className=" loanbtn nextButton"
                onClick={handleNext}
                disabled={tabs.indexOf(activeTab) === tabs.length - 1}
                type="button"
              >
                التالي
              </button>
            ) : (
              <p></p>
            )}
            {activeTab !== "beneficiary" && (
              <button
                className=" loanbtn backButton"
                onClick={handleBack}
                type="button"
              >
                السابق
              </button>
            )}
            {activeTab === "Decision" && (
              <button
                className="loanbtn submitButton"
                type="button"
                onClick={handleFullPrint}
              >
                طباعة
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default CaseStudy;
