import React, { useState } from "react";
import "../CreateLoan/createLoan.css";
import RegisterTextbox from "../../components/RegisterTextBox";
import Title from "../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBank,
  faDatabase,
  faGraduationCap,
  faHandshake,
  faNotesMedical,
  faPeopleRoof,
  faPersonHarassing,
  faPhoneVolume,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "./addBeneficiary.css";
import RegisterSelect from "../../components/RegisterSelect";
import UploadInput from "../../components/UploadInput";
import RegisterRadio from "../../components/Radio";

import dayjs from "dayjs";

function AddBeneficiaryAll() {
  const tabs = [
    "beneficiary",
    "mainbeneficiarydata",
    "bankdata",
    "qualificationposition",
    "housingdata",
    "healthdata",
    "dependentsdata",
  ];
  const [activeTab, setActiveTab] = useState("beneficiary");

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

  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [dateErrors, setDateErrors] = useState({ dob: "", idDate: "" });

  const handleDobChange = (e) => {
    // نجرب الاتنين: لو e هو event بناخد e.target.value، لو هو string مباشرة نستخدمه
    const newValue = e && e.target ? e.target.value : e;
    setDob(newValue);

    if (!newValue) {
      setAge("");
      setDateErrors((prev) => ({ ...prev, dob: "" }));
      return;
    }

    const selectedDate = dayjs(newValue);
    const today = dayjs();

    if (!selectedDate.isValid()) {
      setDateErrors((prev) => ({ ...prev, dob: "تاريخ غير صحيح" }));
      setAge("");
      return;
    }

    if (selectedDate.isAfter(today)) {
      setDateErrors((prev) => ({
        ...prev,
        dob: "تاريخ الميلاد لا يمكن أن يكون في المستقبل",
      }));
      setAge("");
      return;
    }

    setDateErrors((prev) => ({ ...prev, dob: "" }));

    let calculatedAge = today.year() - selectedDate.year();
    if (
      today.month() < selectedDate.month() ||
      (today.month() === selectedDate.month() &&
        today.date() < selectedDate.date())
    ) {
      calculatedAge--;
    }
    setAge(calculatedAge);
  };

  const [cardNum, setCardNum] = useState("");
  const [mobileNum, setMobileNum] = useState("");
  const [errors, setErrors] = useState({});

  const handleCardNumChange = (e) => {
    const value = e && e.target ? e.target.value : e;
    setCardNum(value);
    if (value.length !== 10) {
      setErrors((prevState) => ({
        ...prevState,
        cardnum: "رقم الهوية يجب ان يكون 10 أرقام",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, cardnum: "" }));
    }
  };

  const handlePhoneNumChange = (e) => {
    const value = e && e.target ? e.target.value : e;
    setMobileNum(value);
    if (value.length !== 10) {
      setErrors((prevState) => ({
        ...prevState,
        phonenum: "رقم الجوال يجب ان يكون 10 أرقام",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, phonenum: "" }));
    }
  };

  const [idExpirationDate, setIdExpirationDate] = useState("");

  const handleIdDateChange = (e) => {
    const value = e && e.target ? e.target.value : e;
    setIdExpirationDate(value);

    if (!value) {
      setDateErrors((prev) => ({ ...prev, idDate: "" }));
      return;
    }

    const selectedDate = dayjs(value);
    const today = dayjs().startOf("day");

    if (!selectedDate.isValid()) {
      setDateErrors((prev) => ({ ...prev, idDate: "تاريخ غير صحيح" }));
      return;
    }

    if (selectedDate.isBefore(today)) {
      setDateErrors((prev) => ({
        ...prev,
        idDate: "تاريخ انتهاء الهوية لا يمكن أن يكون في الماضي",
      }));
    } else {
      setDateErrors((prev) => ({ ...prev, idDate: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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

  const [dobMap, setDobMap] = useState({});
  const [ageMap, setAgeMap] = useState({});

  const handleDobChange2 = (id, e) => {
    // نجرب الاتنين: لو e هو event بناخد e.target.value، لو هو string مباشرة نستخدمه
    const newValue = e && e.target ? e.target.value : e;
    setDobMap((prev) => ({ ...prev, [id]: newValue }));

    if (!newValue) {
      setAgeMap((prev) => ({ ...prev, [id]: "" }));
      return;
    }

    const birthDate = dayjs(newValue);
    if (!birthDate.isValid()) return;

    const today = dayjs();
    let calculatedAge = today.year() - birthDate.year();
    if (
      today.month() < birthDate.month() ||
      (today.month() === birthDate.month() && today.date() < birthDate.date())
    ) {
      calculatedAge--;
    }
    setAgeMap((prev) => ({ ...prev, [id]: calculatedAge }));
  };

  const [healthStatus, setHealthStatus] = useState("");
  const [illnesses, setIllnesses] = useState([{ id: 1 }]);
  const [dependents, setDependents] = useState([{ id: 1 }]);
  const [housingExpenses, setHousingExpenses] = useState([{ id: 1 }]);

  const handleAddHousingExpense = () => {
    setHousingExpenses([
      ...housingExpenses,
      { id: housingExpenses.length + 1 },
    ]);
  };

  const handleRadioChange = (value) => {
    setHealthStatus(value);
  };

  const handleAddIllness = () => {
    setIllnesses([...illnesses, { id: illnesses.length + 1 }]);
  };

  const handleAddDependent = () => {
    setDependents([...dependents, { id: dependents.length + 1 }]);
  };

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
                title="إضافة مستفيد"
                icon={<FontAwesomeIcon icon={faPersonHarassing} />}
              />
              <div className="AddBeneficiaryContainer">
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="benName"
                    label="إسم المستفيد"
                    type="text"
                    stylee={{ width: "55%" }}
                  />
                  <RegisterSelect
                    id="fileStatus"
                    label="حالة المستفيد"
                    stylee={{ width: "55%" }}
                    parentStyle={{ width: "30%", marginBottom: "20px" }}
                    options={[
                      { value: "", label: "اختر الحالة" },
                      { value: "temp", label: "مستفيد مؤقت" },
                      { value: "perm", label: "مستفيد دائم" },
                    ]}
                  />
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    disabled={true}
                    parentStyle={{ width: "30%" }}
                    id="createdBy"
                    label="انشأ بواسطة"
                    type="text"
                    stylee={{ width: "55%" }}
                  />
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="updateDate"
                    label="تاريخ التحديث"
                    type="date"
                    stylee={{ width: "55%" }}
                  />
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    disabled={true}
                    parentStyle={{ width: "30%" }}
                    id="happendby"
                    label="حدث بواسطة"
                    type="text"
                    stylee={{ width: "55%" }}
                  />
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="createDate"
                    label="تاريخ الإنشاء"
                    type="date"
                    stylee={{ width: "55%" }}
                  />
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
              <div className="AddBeneficiaryContainer">
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="name"
                    label="الإسم"
                    type="text"
                    stylee={{ width: "55%" }}
                  />
                  <RegisterSelect
                    id="sex"
                    label="النوع"
                    stylee={{ width: "30%" }}
                    parentStyle={{ width: "30%", marginBottom: "20px" }}
                    options={[
                      { value: "", label: "اختر النوع" },
                      { value: "ذكر", label: "ذكر" },
                      { value: "أنثي", label: "أنثي" },
                    ]}
                  />
                </div>

                <div className="AddBeneficiaryContainerRow">
                  <div style={{ width: "30%" }}>
                    <RegisterTextbox
                      parentStyle={{ width: "100%" }}
                      id="dob"
                      label="تاريخ الميلاد"
                      type="date"
                      stylee={{
                        width: "55%",
                        borderColor: dateErrors.dob ? "red" : "",
                      }}
                      value={dob}
                      onChange={handleDobChange}
                    />
                    {dateErrors.dob && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          display: "block",
                          marginTop: "4px",
                        }}
                      >
                        {dateErrors.dob}
                      </span>
                    )}
                  </div>
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="age"
                    label="العمر"
                    type="number"
                    stylee={{ width: "55%" }}
                    value={age}
                    readOnly
                  />
                </div>

                <div className="AddBeneficiaryContainerRow">
                  <RegisterSelect
                    id="relation"
                    label="الحالة الإجتماعية"
                    stylee={{ width: "30%" }}
                    parentStyle={{ width: "30%", marginBottom: "20px" }}
                    options={[
                      { value: "", label: "اختر الحالة الإجتماعية" },
                      { value: "أعزب", label: "أعزب" },
                      { value: "متزوج", label: "متزوج" },
                      { value: "مطلق", label: "مطلق" },
                      { value: "أرمل", label: "أرمل" },
                    ]}
                  />
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="nationality"
                    label="الجنسية"
                    type="text"
                    stylee={{ width: "55%" }}
                  />
                </div>

                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="idnum"
                    label="رقم الهوية"
                    type="number"
                    onChange={handleCardNumChange}
                    stylee={{ width: "55%" }}
                    onBlur={(e) => {
                      const val = e && e.target ? e.target.value : e;
                      if (val.length !== 10) {
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
                  />
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="phoneNum"
                    label="رقم الجوال"
                    type="number"
                    stylee={{ width: "55%" }}
                    onChange={handlePhoneNumChange}
                  />
                </div>

                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="email"
                    label="البريد الإلكتروني"
                    type="email"
                    stylee={{ width: "55%" }}
                  />
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="accNumber"
                    label="رقم الحساب"
                    type="text"
                    stylee={{ width: "55%" }}
                  />
                </div>

                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="idSource"
                    label="مصدر الهوية"
                    type="text"
                    stylee={{ width: "55%" }}
                  />
                  <div style={{ width: "30%" }}>
                    <RegisterTextbox
                      parentStyle={{ width: "100%" }}
                      id="idDate"
                      label="تاريخ انتهاء الهوية"
                      type="date"
                      value={idExpirationDate}
                      onChange={handleIdDateChange}
                      stylee={{
                        width: "55%",
                        borderColor: dateErrors.idDate ? "red" : "",
                      }}
                    />
                    {dateErrors.idDate && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          display: "block",
                          marginTop: "4px",
                        }}
                      >
                        {dateErrors.idDate}
                      </span>
                    )}
                  </div>
                </div>

                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="moreNotes"
                    label="ملاحظات اضافية"
                    type="text"
                    stylee={{ width: "55%" }}
                  />
                </div>

                <div className="AddBeneficiaryContainerRow">
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
              <div className="AddBeneficiaryContainer">
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="bankName"
                    label="إسم البنك"
                    type="text"
                    stylee={{ width: "55%" }}
                  />
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="branch"
                    label="الفرع"
                    type="text"
                    stylee={{ width: "55%" }}
                  />
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="ibanNum"
                    label="رقم IBAN"
                    type="number"
                    stylee={{ width: "55%" }}
                  />
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <UploadInput
                    id="chieftain"
                    parentStyle={{
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    label="صورة رقم IBAN"
                  />
                </div>
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
              <div className="AddBeneficiaryContainer">
                <div className="AddBeneficiaryContainerRow">
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="edLevel"
                    label="المستوي التعليمي"
                    type="text"
                    stylee={{ width: "55%" }}
                  />
                </div>
                <div className="AddBeneficiaryContainerRow">
                  <RegisterSelect
                    id="canwork"
                    label="يستطيع العمل"
                    stylee={{ width: "30%" }}
                    parentStyle={{ width: "30%", marginBottom: "20px" }}
                    options={[
                      { value: "", label: "اختر" },
                      { value: "نعم", label: "نعم" },
                      { value: "لا", label: "لا" },
                    ]}
                  />
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="job"
                    label="المهنة"
                    type="text"
                    stylee={{ width: "55%" }}
                  />
                </div>

                <div>
                  <div className="titleaddcon">
                    <h5>
                      مصادر الدخل
                      <span
                        className="addillness addillness2"
                        onClick={handleAddIncomeSource}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </span>
                    </h5>
                  </div>
                  {incomeSources.map((source) => (
                    <div key={source.id} className="AddBeneficiaryContainerRow">
                      <RegisterTextbox
                        parentStyle={{ width: "30%" }}
                        id={`incomesources-${source.id}`}
                        label="اسم المصدر"
                        type="text"
                        stylee={{ width: "55%" }}
                      />
                      <RegisterTextbox
                        parentStyle={{ width: "30%" }}
                        id={`souramount-${source.id}`}
                        label="القيمة"
                        type="text"
                        stylee={{ width: "55%" }}
                      />
                      <UploadInput
                        id={`salary-${source.id}`}
                        parentStyle={{
                          marginBottom: "20px",
                          display: "flex",
                          alignItems: "center",
                        }}
                        label="مشهد الراتب"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <div className="titleaddcon">
                    <h5>
                      الدورات التدريبية
                      <span
                        className="addillness addillness2"
                        onClick={handleAddTrainingCourse}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </span>
                    </h5>
                  </div>
                  {trainingCourses.map((course) => (
                    <div key={course.id} className="AddBeneficiaryContainerRow">
                      <RegisterTextbox
                        parentStyle={{ width: "30%" }}
                        id={`coursesname-${course.id}`}
                        label="اسم الدورة"
                        type="text"
                        stylee={{ width: "55%" }}
                      />
                      <RegisterTextbox
                        parentStyle={{ width: "30%" }}
                        id={`coursesdate-${course.id}`}
                        label="تاريخ الحصول عليها"
                        type="date"
                        stylee={{ width: "55%" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  parentStyle={{ width: "30%" }}
                  id="extraNotes"
                  label="ملاحظات اضافية"
                  type="text"
                  stylee={{ width: "55%" }}
                />
              </div>
              <div className="AddBeneficiaryContainerRow">
                <UploadInput
                  id="salary"
                  parentStyle={{
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  label="صورة مشهد الراتب"
                />
              </div>
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
              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  parentStyle={{ width: "30%" }}
                  id="state"
                  label="القطاع (المحافظة)"
                  type="text"
                  stylee={{ width: "55%" }}
                />
                <RegisterTextbox
                  parentStyle={{ width: "30%" }}
                  id="village"
                  label="القرية (الحي)"
                  type="text"
                  stylee={{ width: "55%" }}
                />
              </div>
              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  parentStyle={{ width: "30%" }}
                  id="nationalAdress"
                  label="العنوان الوطني"
                  type="text"
                  stylee={{ width: "55%" }}
                />
                <RegisterTextbox
                  parentStyle={{ width: "30%" }}
                  id="summaryadress"
                  label="العنوان المختصر"
                  type="text"
                  stylee={{ width: "55%" }}
                />
              </div>
              <div className="AddBeneficiaryContainerRow">
                <RegisterSelect
                  id="hometype"
                  label="نوع السكن"
                  stylee={{ width: "30%" }}
                  parentStyle={{ width: "30%", marginBottom: "20px" }}
                  options={[
                    { value: "", label: "اختر النوع" },
                    { value: "تمليك", label: "تمليك" },
                    { value: "إيجار", label: "إيجار" },
                  ]}
                />
                <RegisterTextbox
                  parentStyle={{ width: "30%" }}
                  id="ownership"
                  label="ملكية السكن"
                  type="text"
                  stylee={{ width: "55%" }}
                />
              </div>
              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  parentStyle={{ width: "30%" }}
                  id="month"
                  label="الإيجار الشهري للسكن"
                  type="number"
                  stylee={{ width: "55%" }}
                />
                <RegisterTextbox
                  parentStyle={{ width: "30%" }}
                  id="cars"
                  label="عدد السيارات المملوكة"
                  type="number"
                  stylee={{ width: "55%" }}
                />
              </div>
              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  parentStyle={{ width: "30%" }}
                  id="lands"
                  label="عدد الأراضي المملوكة"
                  type="number"
                  stylee={{ width: "55%" }}
                />
                <RegisterTextbox
                  parentStyle={{ width: "30%" }}
                  id="components"
                  label="مكونات السكن"
                  type="text"
                  stylee={{ width: "55%" }}
                />
              </div>
              <div className="AddBeneficiaryContainerRow">
                <RegisterTextbox
                  parentStyle={{ width: "30%" }}
                  id="furniture"
                  label="اثاث الشقة"
                  type="number"
                  stylee={{ width: "55%" }}
                />
                <RegisterTextbox
                  parentStyle={{ width: "30%" }}
                  id="personperMonth"
                  label="تكاليف الشهر للفرد"
                  type="text"
                  stylee={{ width: "55%" }}
                />
              </div>

              <div className="direc">
                <div className="titleaddcon">
                  <h5>
                    مصروفات السكن
                    <span
                      className="addillness addillness2"
                      onClick={handleAddHousingExpense}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                  </h5>
                </div>
                {housingExpenses.map((expense) => (
                  <div key={expense.id} className="AddBeneficiaryContainerRow">
                    <RegisterTextbox
                      parentStyle={{ width: "30%" }}
                      id={`monthly-bill-${expense.id}`}
                      label="الفاتورة الشهرية"
                      type="number"
                      stylee={{ width: "55%" }}
                    />
                    <RegisterTextbox
                      parentStyle={{ width: "30%" }}
                      id={`value-${expense.id}`}
                      label="القيمة"
                      type="number"
                      stylee={{ width: "55%" }}
                    />
                  </div>
                ))}
              </div>

              <div className="AddBeneficiaryContainerRow">
                <UploadInput
                  id="invoice"
                  parentStyle={{
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  label="صورة فاتورة الكهرباء"
                />
                <UploadInput
                  id="chieftain"
                  parentStyle={{
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  label="صورة ملكية الشقة"
                />
              </div>
            </div>
          </>
        );

      case "healthdata":
        return (
          <>
            <div className="AddBeneficiary">
              <Title
                title="البيانات الصحية"
                icon={<FontAwesomeIcon icon={faNotesMedical} />}
              />
              <div className="AddBeneficiaryContainer">
                <div className="sexType">
                  <h5 className="radTitle">الحالة الصحية</h5>
                  <div className="clientRadios clientRadios3">
                    <RegisterRadio
                      label="سليما"
                      value="good"
                      onChange={() => handleRadioChange("good")}
                    />
                    <RegisterRadio
                      label="مريضا"
                      value="sick"
                      onChange={() => handleRadioChange("sick")}
                    />
                  </div>
                </div>

                {healthStatus === "good" ? (
                  <div className="message-container">
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "18px",
                        color: "gray",
                      }}
                    >
                      لا يوجد تفاصيل لعرضها
                    </p>
                  </div>
                ) : (
                  <>
                    <span className="addillness" onClick={handleAddIllness}>
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
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
                            <th>صورة التقرير الصحية</th>
                          </tr>
                        </thead>
                        <tbody>
                          {illnesses.length > 0 ? (
                            illnesses.map((illness) => (
                              <tr key={illness.id} className="selected-row">
                                <td>
                                  <RegisterTextbox
                                    id={`name-${illness.id}`}
                                    type="text"
                                    stylee={{ width: "100%" }}
                                  />
                                </td>
                                <td>
                                  <RegisterTextbox
                                    id={`type-${illness.id}`}
                                    type="text"
                                    stylee={{ width: "100%" }}
                                  />
                                </td>
                                <td>
                                  <RegisterTextbox
                                    id={`danger-${illness.id}`}
                                    type="text"
                                    stylee={{ width: "100%" }}
                                  />
                                </td>
                                <td>
                                  <RegisterTextbox
                                    id={`midtype-${illness.id}`}
                                    type="text"
                                    stylee={{ width: "100%" }}
                                  />
                                </td>
                                <td>
                                  <RegisterTextbox
                                    id={`cost-${illness.id}`}
                                    type="number"
                                    stylee={{ width: "100%" }}
                                  />
                                </td>
                                <td>
                                  <RegisterTextbox
                                    id={`notes-${illness.id}`}
                                    type="text"
                                    stylee={{ width: "100%" }}
                                  />
                                </td>
                                <td>
                                  <UploadInput
                                    id={`reportImage-${illness.id}`}
                                    parentStyle={{
                                      marginBottom: "10px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                    label="رفع صورة"
                                  />
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" style={{ textAlign: "center" }}>
                                لا توجد أمراض
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
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
              <div className="AddBeneficiaryContainer">
                <span className="addillness" onClick={handleAddDependent}>
                  <FontAwesomeIcon icon={faPlus} />
                </span>
                <div className="duplicatedContent">
                  {dependents.map((dep) => (
                    <div key={dep.id} className="duplicatedContent2">
                      <div className="AddBeneficiaryContainerRow">
                        <RegisterTextbox
                          parentStyle={{ width: "30%" }}
                          id={`name-${dep.id}`}
                          label="الإسم"
                          type="text"
                          stylee={{ width: "55%" }}
                        />
                        <RegisterSelect
                          id={`sex-${dep.id}`}
                          label="نوع الجنس"
                          stylee={{ width: "30%" }}
                          parentStyle={{ width: "30%", marginBottom: "20px" }}
                          options={[
                            { value: "", label: "اختر النوع" },
                            { value: "ذكر", label: "ذكر" },
                            { value: "أنثي", label: "أنثي" },
                          ]}
                        />
                      </div>
                      <div className="AddBeneficiaryContainerRow">
                        <RegisterTextbox
                          parentStyle={{ width: "30%" }}
                          id={`relative-${dep.id}`}
                          label="صلة القرابة"
                          type="text"
                          stylee={{ width: "55%" }}
                        />
                        <RegisterTextbox
                          parentStyle={{ width: "30%" }}
                          id={`status-${dep.id}`}
                          label="الحالة الصحية"
                          type="text"
                          stylee={{ width: "55%" }}
                        />
                      </div>
                      <div className="AddBeneficiaryContainerRow">
                        <RegisterTextbox
                          parentStyle={{ width: "30%" }}
                          id={`followerdob-${dep.id}`}
                          label="تاريخ الميلاد"
                          type="date"
                          stylee={{ width: "55%" }}
                          value={dobMap[dep.id] || ""}
                          onChange={(e) => handleDobChange2(dep.id, e)}
                        />
                        <RegisterTextbox
                          parentStyle={{ width: "30%" }}
                          id={`followerage-${dep.id}`}
                          label="العمر"
                          type="number"
                          stylee={{ width: "55%" }}
                          value={
                            ageMap[dep.id] !== undefined ? ageMap[dep.id] : ""
                          }
                          readOnly
                        />
                      </div>
                      <div className="AddBeneficiaryContainerRow">
                        <RegisterTextbox
                          parentStyle={{ width: "30%" }}
                          id={`academicstage-${dep.id}`}
                          label="وصف المرحلة الدراسية"
                          type="text"
                          stylee={{ width: "55%" }}
                        />
                        <RegisterTextbox
                          parentStyle={{ width: "30%" }}
                          id={`fees-${dep.id}`}
                          label="المصروفات الدراسية بالعام"
                          type="number"
                          stylee={{ width: "55%" }}
                        />
                      </div>
                      <div className="AddBeneficiaryContainerRow">
                        <RegisterTextbox
                          parentStyle={{ width: "30%" }}
                          id={`cardnum-${dep.id}`}
                          label="رقم الهوية"
                          type="text"
                          stylee={{ width: "55%" }}
                        />
                        <RegisterTextbox
                          parentStyle={{ width: "30%" }}
                          id={`phone-${dep.id}`}
                          label="رقم الجوال"
                          type="number"
                          stylee={{ width: "55%" }}
                        />
                      </div>
                      <div className="AddBeneficiaryContainerRow">
                        <RegisterTextbox
                          parentStyle={{ width: "30%" }}
                          id={`cardnumdate-${dep.id}`}
                          label="تاريخ انتهاء الهوية"
                          type="date"
                          stylee={{ width: "55%" }}
                        />
                        <RegisterTextbox
                          parentStyle={{ width: "30%" }}
                          id={`notes-${dep.id}`}
                          label="ملاحظات اضافية"
                          type="text"
                          stylee={{ width: "55%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="createloan">
      <form onSubmit={handleSubmit}>
        <div className="divre">
          <div className="myTabs myTabs2">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`loantab ${activeTab === tab ? "active" : ""} loantab2`}
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
                            : "7"}
              </button>
            ))}
          </div>
          <div className="line"></div>
        </div>

        <div className="tabContent">{renderContent()}</div>

        <div className="navigationButtons">
          {activeTab !== "dependentsdata" ? (
            <button
              className="loanbtn nextButton"
              onClick={handleNext}
              disabled={tabs.indexOf(activeTab) === tabs.length - 1}
              type="button"
            >
              التالي
            </button>
          ) : (
            <button type="submit" className="loanbtn saveButton">
              حفظ
            </button>
          )}
          {activeTab !== "beneficiary" && (
            <button
              className="loanbtn backButton"
              onClick={handleBack}
              type="button"
            >
              السابق
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddBeneficiaryAll;
