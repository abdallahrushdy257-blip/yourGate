import React, { useEffect, useState } from "react";
import "./addNewEmployee.css";
import { Form, Modal, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTable,
  faUserPlus,
  faClipboardUser,
  faPercent,
} from "@fortawesome/free-solid-svg-icons";
import Title from "../../components/title";
import RegisterTextbox from "../../components/RegisterTextBox";
import UploadInput from "../../components/UploadInput";
import RegisterSelect from "../../components/RegisterSelect";
import { useParams } from "react-router";
import CustomButton from "../../components/CustomButton";
import { useNavigate } from "react-router";
import API from "../../api/axiosConfig";
import TestPreloader from "../TestPreLoader/TestPreLoader";
import "react-datepicker/dist/react-datepicker.css";
import TableComponent from "../../components/TableComponent";
import { toast } from "react-toastify";

function AddNewEmployee() {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState({});
  const [incomeTaxType, setIncomeTaxType] = useState("value");
  const { startingTab } = useParams();

  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [iban, setIban] = useState("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("");
  const [qualification, setQualification] = useState("");
  const [upload, setUpload] = useState("");
  const [workType, setWorkType] = useState("");

  const shouldShowAllTabs = ["general", "job", "salary"].includes(startingTab);

  const [workDate, setWorkDate] = useState(
    new Date().toISOString().substr(0, 10),
  );
  const [dob, setDob] = useState(new Date().toISOString().substr(0, 10));
  const [status, setStatus] = useState(0);
  const [idexpireDate, setIdexpireDate] = useState(
    new Date().toISOString().substr(0, 10),
  );
  const [jobtitle, setJobtitle] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idtype, setIdtype] = useState(0);
  const [idnumber, setIdnumber] = useState("");
  const [gender, setGender] = useState("");
  const [empid, setEmpid] = useState("");
  const [expirehire, setExpirehire] = useState(
    new Date().toISOString().substr(0, 10),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitting2, setIsSubmitting2] = useState(false);
  const [house, setHouse] = useState(0);
  const [transportation, setTransportation] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [life, setLife] = useState(0);
  const [work, setWork] = useState(0);
// حالة لتخزين المستندات المتعددة
const [documents, setDocuments] = useState([{ title: "", file: null }]);

// دالة لإضافة حقل مستند جديد
const handleAddDocument = () => {
  setDocuments([...documents, { title: "", file: null }]);
};

// دالة لحذف حقل مستند معين
const handleRemoveDocument = (index) => {
  const updatedDocs = documents.filter((_, i) => i !== index);
  setDocuments(updatedDocs);
};

// دالة لتحديث عنوان المستند
const handleDocTitleChange = (index, value) => {
  const updatedDocs = [...documents];
  updatedDocs[index].title = value;
  setDocuments(updatedDocs);
};

// دالة لتحديث ملف المستند
const handleDocFileChange = (index, file) => {
  const updatedDocs = [...documents];
  updatedDocs[index].file = file;
  setDocuments(updatedDocs);
};
  const columns = [
    { name: "إسم الموظف", key: "name" },
    { name: "رقم الهوية", key: "nationalid" },
    { name: "رقم الجوال", key: "phone" },
    { name: "تاريخ التعيين", key: "dateofhire" },
    { name: "المسمي الوظيفي", key: "jobname" },
    { name: "", key: "actions" },
  ];

  const dummyData = [
    {
      id: 1,
      name: "أحمد محمد علي",
      nationalid: "1023456789",
      phone: "0501234567",
      dateofhire: "2023-01-15",
      jobname: "مدير مشاريع",
    },
    {
      id: 2,
      name: "سارة إبراهيم",
      nationalid: "1023456790",
      phone: "0502345678",
      dateofhire: "2022-09-10",
      jobname: "محاسب",
    },
    {
      id: 3,
      name: "محمد خالد",
      nationalid: "1023456791",
      phone: "0503456789",
      dateofhire: "2021-06-20",
      jobname: "موظف استقبال",
    },
    {
      id: 4,
      name: "ريم عبدالله",
      nationalid: "1023456792",
      phone: "0504567890",
      dateofhire: "2020-11-05",
      jobname: "أخصائي موارد بشرية",
    },
    {
      id: 5,
      name: "يوسف حسن",
      nationalid: "1023456793",
      phone: "0505678901",
      dateofhire: "2024-02-01",
      jobname: "مطور برمجيات",
    },
    {
      id: 6,
      name: "منى السيد",
      nationalid: "1023456794",
      phone: "0506789012",
      dateofhire: "2019-08-18",
      jobname: "سكرتير تنفيذي",
    },
    {
      id: 7,
      name: "خالد محمود",
      nationalid: "1023456795",
      phone: "0507890123",
      dateofhire: "2022-04-30",
      jobname: "مشرف ميداني",
    },
    {
      id: 8,
      name: "هبة علي",
      nationalid: "1023456796",
      phone: "0508901234",
      dateofhire: "2023-12-12",
      jobname: "أخصائي تسويق",
    },
    {
      id: 9,
      name: "طارق جمال",
      nationalid: "1023456797",
      phone: "0509012345",
      dateofhire: "2021-03-25",
      jobname: "محلل بيانات",
    },
    {
      id: 10,
      name: "نجلاء مصطفى",
      nationalid: "1023456798",
      phone: "0501122334",
      dateofhire: "2020-07-14",
      jobname: "مدير موارد بشرية",
    },
  ];

  const dropdownOptions = [
    // { label: "إضافة مكافآة او خصم ", route: "/discounts/:id" },
    // { label: "إضافة تحقيق ", route: "/investigations/:id" },
    // { label: " مستندات التوظيف", route: "/employeepaper/:id" },
    { label: "تعديل", route: "/editemployee/:id" },
    { label: "كارت الموظف", route: "/showEmployeeCard/:id" },
    { label: "عرض", route: "/showEmployee/:id" },
  ];

  const getJobtitle = async () => {
    try {
      const res = await API.post("/jobtitle");
      if (res.status === 200) {
        setRows(res.data || []);
      }
    } catch (error) {
      console.error("API Error:", error);
      if (error.response?.data) {
        setError(error.response.data.errors || {});
        setMessage(error.response.data.message || "An error occurred");
      }
    } finally {
      // هذا السطر يضمن اختفاء الـ Preloader فوراً مهما كانت النتيجة
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobtitle();
  }, []);

  const resetForm = () => {
    setName("");
    setEmail("");
    setIban("");
    setAddress("");
    setNationality("");
    setQualification("");
    setUpload("");
    setWorkType("");
    setWorkDate(new Date().toISOString().substr(0, 10));
    setDob(new Date().toISOString().substr(0, 10));
    setStatus(0);
    setIdexpireDate(new Date().toISOString().substr(0, 10));
    setJobtitle("");
    setIdtype(0);
    setIdnumber("");
    setGender("");
    setEmpid("");
    setExpirehire(new Date().toISOString().substr(0, 10));
    setHouse(0);
    setTransportation(0);
    setCommunication(0);
    setLife(0);
    setWork(0);
    setError({});
    setActiveTab(0);
  };

  useEffect(() => {
    if (startingTab) {
      switch (startingTab) {
        case "general":
          setActiveTab(0);
          break;
        case "salary":
          setActiveTab(1);
          break;
        case "documents":
          setActiveTab(2);
          break;
        default:
          setActiveTab(0);
      }
    }
  }, [startingTab]);

  const handleTabClick = (tabIndex) => {
    if (shouldShowAllTabs || tabIndex <= activeTab) {
      setActiveTab(tabIndex);
    }
  };

  const handleIncomeTaxTypeChange = (e) => {
    setIncomeTaxType(e.target.value);
  };

  const [salaryDetails, setSalaryDetails] = useState({
    mainBudget: "",
    socialWelfare: "",
  });

  const handleCardNumChange = (e) => {
    const { value } = e.target;
    if (value.length <= 10) {
      setSalaryDetails((prevState) => ({
        ...prevState,
        cardnum: value,
      }));
      setError((prevState) => ({ ...prevState, cardnum: "" }));
    } else {
      setError((prevState) => ({
        ...prevState,
        cardnum: "الرقم التعريفي لا يمكن أن يزيد عن 10 أرقام",
      }));
    }
  };

  const handleMobileNumChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length <= 10) {
      setSalaryDetails((prev) => ({
        ...prev,
        mobnum: value,
      }));
    }
  };

  const calculateTotal = () => {
    const basic = parseFloat(salaryDetails.mainBudget) || 0;
    const social = parseFloat(salaryDetails.socialWelfare) || 0;

    const total =
      basic +
      (parseFloat(house) || 0) +
      (parseFloat(transportation) || 0) +
      (parseFloat(communication) || 0) +
      (parseFloat(life) || 0) +
      (parseFloat(work) || 0) -
      social;

    return total.toFixed(2);
  };

  const handleSalaryChange = (e) => {
    const { id, value } = e.target;
    setSalaryDetails((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleNextTab = async (e) => {
    e.preventDefault();

    // const cardNum = salaryDetails.cardnum;
    // const mobileNum = salaryDetails.mobnum;

    // if (!salaryDetails.mobnum || salaryDetails.mobnum.length !== 10) {
    //   setError((prev) => ({
    //     ...prev,
    //     mobnum: "رقم الجوال يجب أن يكون 10 أرقام",
    //   }));
    //   return;
    // }

    // if (cardNum && cardNum.length !== 10) {
    //   setError((prevState) => ({
    //     ...prevState,
    //     cardnum: "رقم الهوية يجب ان يكون 10 أرقام",
    //   }));
    //   return;
    // } else {
    //   setError((prevState) => ({ ...prevState, cardnum: "" }));
    // }

    // if (mobileNum && mobileNum.length !== 10) {
    //   setError((prevState) => ({
    //     ...prevState,
    //     mobnum: "رقم الجوال يجب ان يكون 10 أرقام",
    //   }));
    //   return;
    // } else {
    //   setError((prevState) => ({ ...prevState, mobnum: "" }));
    // }
    // setIsSubmitting(true);
    // const mFormData = new FormData();
    // mFormData.append("name", name);
    // mFormData.append("dob", dob);
    // mFormData.append("workdate", workDate);
    // mFormData.append("status", status);
    // mFormData.append("phone", salaryDetails.mobnum);
    // mFormData.append("iban", iban);
    // mFormData.append("idexpiredate", idexpireDate);
    // mFormData.append("gender", gender);
    // mFormData.append("idtype", idtype);
    // mFormData.append("idnumber", idnumber);
    // mFormData.append("address", address);
    // mFormData.append("email", email);
    // mFormData.append("nationality", nationality);
    // mFormData.append("jobtitle", jobtitle);
    // mFormData.append("qualification", qualification);
    // mFormData.append("expirehire", expirehire);
    // mFormData.append("upload", upload);
    // // إرسال المستندات المتعددة
    // documents.forEach((doc, index) => {
    //   if (doc.file) {
    //     mFormData.append(`documents[${index}][title]`, doc.title);
    //     mFormData.append(`documents[${index}][file]`, doc.file);
    //   }
    // });
    // mFormData.append("worktype", workType);
    // try {
    //   const res = API.post("/employees/store", mFormData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   });
    //   const data = await res;
    //   if (data.status === 200) {
    //     setEmpid(data.data.id);
    //     setActiveTab(activeTab + 1);
    //   } else {
    //     setError(data.data.errors);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   setIsSubmitting(false);
    //   setError(error.response.data.errors);
    //   setMessage(error.response.data.message);
    // }
    setActiveTab((prev) => prev + 1);
  };
  const [salarydescription, setSalarydescription] = useState("");
  const [type, setType] = useState("");

  const handleNextTab2 = async (e) => {
    e.preventDefault();
    // setIsSubmitting2(true);
    // const mForm = new FormData();
    // mForm.append("basic", salaryDetails.mainBudget);
    // mForm.append("employees_id", empid);
    // mForm.append("socialinsurance", salaryDetails.socialWelfare);
    // mForm.append("account", type);
    // mForm.append("house", house);
    // mForm.append("communication", communication);
    // mForm.append("transport", transportation);
    // mForm.append("life", life);
    // mForm.append("work", work);
    // try {
    //   const res = await API.post("/salary/store", mForm);
    //   const data = await res;
    //   if (data.status === 200) {
    //     setShowModal(false);
    //     setRefreshKey((prev) => prev + 1);
    //     resetForm();
    //     toast.success("تم إضافة الموظف بنجاح");
    //   } else {
    //     setError(data.data.errors);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   setIsSubmitting2(false);
    //   setError(error.response.data.errors);
    //   setMessage(error.response.data.message);
    // }
    setActiveTab((prev) => prev + 1);
  };

  return loading ? (
    <TestPreloader />
  ) : (
    <div className="addnewemployee-container">
      <div className="employee-list-page" style={{ padding: "20px" }}>
        <TableComponent
          key={refreshKey}
          apiUrl="/employees"
          data={dummyData}
          columns={columns}
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          title="إدارة الموظفين"
          addBtn={true}
          onAddClick={() => {
            resetForm();
            setShowModal(true);
          }}
          dropdownOptions={dropdownOptions}
          searchDate={false}
        />
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        className="add-employee-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>إضافة موظف جديد</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="addnewemployee">
            <div className="addnewemployee-tabs">
              <div
                className={`addemp-tab ${activeTab === 0 ? "active" : ""}`}
                onClick={() => handleTabClick(0)}
              >
                1
              </div>

              <div
                className={`addemp-tab ${activeTab === 1 ? "active" : ""}`}
                onClick={() => handleTabClick(1)}
              >
                2
              </div>
              <div
                className={`addemp-tab ${activeTab === 2 ? "active" : ""}`}
                onClick={() => handleTabClick(2)}
              >
                3
              </div>
              <hr className="addHr" />
            </div>

            <div className="addnewemployee-content">
              {activeTab === 0 && (
                <Form onSubmit={handleNextTab} encType="multipart/form-data">
                  <div className="addempTitle">
                    <Title
                      title="البيانات العامة للموظف"
                      className="marketingtitle"
                      icon={<FontAwesomeIcon icon={faUserPlus} />}
                    />{" "}
                    <div className="addnewemployee-form1">
                      <div className="addnewemployee-sec1">
                        <RegisterTextbox
                          parentStyle={{
                            width: "80%",
                            marginBottom:"1rem"
                          }}
                          id="empname"
                          label="إسم الموظف"
                          type="text"
                          stylee={{
                            width: "55%",
                          }}
                          name="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />

                        {error && error.name && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {error.name}
                          </div>
                        )}
                        {/* <RegisterTextbox
                      parentStyle={{
                        width: "80%",
                      }}
                      id="dob"
                      label="تاريخ الميلاد"
                      type="date"
                      onChange={handleDobChange}
                      stylee={{
                        width: "55%",
                      }}
                    /> */}
                        <div className="responParent mb-3" style={{ width: "100%" }}>
                          <p className="datelable">تاريخ الميلاد</p>
                          <input
                            type="date"
                            id="date"
                            onChange={(e) => setDob(e.target.value)}
                            value={dob}
                            className="custom-datepicker"
                            style={{ height: "42px" }}
                          />
                        </div>
                        {error && error.dob && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {error.dob}
                          </div>
                        )}
                        {/* <RegisterTextbox
                      parentStyle={{
                        width: "80%",
                      }}
                      id="workdate"
                      label="تاريخ الإلتحاق بالعمل"
                      type="date"
                      onChange={handleWorkDateChange}
                      stylee={{
                        width: "55%",
                      }}
                      name="workdate"
                    /> */}
                        <div className="responParent" style={{ width: "100%" }}>
                          <p className="datelable">تاريخ الإلتحاق بالعمل</p>
                          <input
                            type="date"
                            id="date"
                            onChange={(e) => setWorkDate(e.target.value)}
                            value={workDate}
                            className="custom-datepicker"
                            style={{ height: "42px" }}
                          />
                        </div>
                        {error && error.workDate && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {error.workDate}
                          </div>
                        )}
                        {/* <RegisterTextbox
                      parentStyle={{
                        width: "80%",
                      }}
                      id="dob"
                      label="تاريخ انتهاء التعاقد"
                      type="date"
                      stylee={{
                        width: "55%",
                      }}
                    /> */}
                        <div className="responParent" style={{ width: "100%" }}>
                          <p className="datelable">تاريخ انتهاء التعاقد</p>
                          <input
                            type="date"
                            id="date"
                            onChange={(e) => setExpirehire(e.target.value)}
                            value={expirehire}
                            className="custom-datepicker"
                            style={{ height: "42px" }}
                          />
                        </div>
                        {error && error.expirehire && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {error.expirehire}
                          </div>
                        )}
                        <RegisterSelect
                          id="status"
                          label="الحالة الإجتماعية"
                          stylee={{ width: "55%" }}
                          parentStyle={{ width: "80%" }}
                          options={[
                            { value: "", label: "اختر الحالة الاجتماعية" },
                            { value: 1, label: "متزوج" },
                            { value: 2, label: "أرمل" },
                            { value: 3, label: "مطلق" },
                            { value: 4, label: "اعزب" },
                          ]}
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        />
                        {error && error.status && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {error.status}
                          </div>
                        )}
                        <RegisterTextbox
                          type="text"
                          id="phone"
                          label="رقم الجوال"
                          stylee={{ width: "55%" }}
                          parentStyle={{ width: "80%" }}
                          inputMode="numeric"
                          value={salaryDetails.mobnum || ""}
                          onChange={handleMobileNumChange}
                          prefix="+966"
                        />
                        {error.phone && (
                          <div style={{ color: "red", fontSize: "0.8em" }}>
                            {error.phone ==
                            "رقم الهاتف يجب ان يكون 10 ارقام على الاقل"
                              ? "رقم الجوال يجب ان يكون 10 ارقام على الاقل"
                              : error.phone}
                          </div>
                        )}
                        <RegisterTextbox
                          parentStyle={{
                            width: "80%"
                            ,marginBottom:"1rem"
                          }}
                          id="iban"
                          label="رقم IBAN"
                          type="text"
                          stylee={{
                            width: "55%",
                          }}
                          name="iban"
                          value={iban}
                          onChange={(e) => setIban(e.target.value)}
                        />
                        {error && error.iban && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {error.iban}
                          </div>
                        )}
                        {/* <RegisterTextbox
                      parentStyle={{
                        width: "80%",
                      }}
                      id="idexpiredate"
                      label="تاريخ انتهاء الهوية "
                      type="date"
                      stylee={{
                        width: "55%",
                      }}
                      onChange={handleidexpireDateChange}
                      name="idexpiredate"
                    /> */}
                        <div className="responParent" style={{ width: "100%" }}>
                          <p className="datelable">تاريخ انتهاء الهوية</p>
                          <input
                            type="date"
                            id="date"
                            onChange={(e) => setIdexpireDate(e.target.value)}
                            value={idexpireDate}
                            className="custom-datepicker"
                            style={{ height: "42px" }}
                          />
                        </div>
                        <UploadInput
                          id="empdocumentUpload"
                          parentStyle={{
                            marginBottom: "20px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          label="رفع الصورة الشخصية"
                          name="upload"
                          onChange={(e) => {
                            setUpload(e.target.files[0]);
                          }}
                          accept="image/*"
                        />
                      </div>
                      <div className="addnewemployee-sec1">
                        <RegisterSelect
                          id="status"
                          label="النوع"
                          stylee={{ width: "55%" }}
                          parentStyle={{ width: "80%" }}
                          options={[
                            { value: "", label: "اختر النوع" },
                            { value: "0", label: "ذكر" },
                            { value: "1", label: "أنثي" },
                          ]}
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        />
                        {error && error.gender && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {error.gender}
                          </div>
                        )}
                        <RegisterSelect
                          id="status"
                          label="الهوية"
                          stylee={{ width: "55%" }}
                          parentStyle={{ width: "80%" }}
                          options={[
                            { value: "", label: "اختر نوع الهوية" },
                            { value: "1", label: "رقم الهوية" },
                            { value: "2", label: "رقم الاقامة" },
                          ]}
                          value={idtype}
                          onChange={(e) => setIdtype(e.target.value)}
                        />
                        {error && error.idtype && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {error.idtype}
                          </div>
                        )}
                        <RegisterTextbox
                          parentStyle={{
                            width: "80%",
                          }}
                          id="idnumber"
                          label={
                            idtype == 0
                              ? "الرقم"
                              : idtype == 1
                                ? "رقم الهوية"
                                : "رقم الاقامة"
                          }
                          type="text"
                          stylee={{
                            width: "55%",
                          }}
                          name="idnumber"
                          value={idnumber}
                          onChange={(e) => setIdnumber(e.target.value)}
                        />
                        {error && error.idnumber && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {error.idnumber ==
                            "The idnumber field must be at least 10 characters."
                              ? "رقم الهوية يجب ان يكون 10 ارقام على الاقل "
                              : error.idnumber}
                          </div>
                        )}

                        <RegisterTextbox
                          parentStyle={{
                            width: "80%",
                          }}
                          id="address"
                          label="العنوان"
                          type="text"
                          stylee={{
                            width: "55%",
                          }}
                          name="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                        {error && error.address && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {error.address}
                          </div>
                        )}

                        <RegisterTextbox
                          parentStyle={{
                            width: "80%"
                            ,marginBottom:"1rem"
                          }}
                          id="empemail"
                          label="البريد الإلكتروني"
                          type="email"
                          stylee={{
                            width: "55%",
                          }}
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        {error && error.email && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {error.email}
                          </div>
                        )}

                        <RegisterTextbox
                          parentStyle={{
                            width: "80%",
                          }}
                          id="empname"
                          label="الجنسية"
                          type="text"
                          stylee={{
                            width: "55%",
                          }}
                          name="nationality"
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                        />
                        {error && error.nationality && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {error.nationality}
                          </div>
                        )}
                        <RegisterSelect
                          id="jobtitle"
                          label="المسمى الوظيفي"
                          parentStyle={{
                            width: "80%",
                          }}
                          stylee={{ width: "55%" }}
                          options={[
                            { value: "", label: " اختر المسمى الوظيفي " },
                            { value: "0", label: " لا يوجد" },
                            ...rows.map((row) => ({
                              value: row.id,
                              label: row.title,
                            })),
                          ]}
                          name="jobtitle"
                          value={jobtitle}
                          onChange={(e) => setJobtitle(e.target.value)}
                        />
                        {error && error.jobtitle && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {error.jobtitle}
                          </div>
                        )}
                        <RegisterTextbox
                          parentStyle={{
                            width: "80%",
                          }}
                          id="degree"
                          label="المؤهل"
                          type="text"
                          stylee={{
                            width: "55%",
                          }}
                          name="quaification"
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                        />
                        {error && error.quaification && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {error.quaification}
                          </div>
                        )}
                        <RegisterSelect
                          parentStyle={{
                            width: "80%",
                          }}
                          id="worktype"
                          label="نوع العمل"
                          stylee={{
                            width: "50%",
                          }}
                          options={[
                            { value: "", label: "اختر نوع العمل" },
                            { value: "0", label: "دوام كامل" },
                            { value: "1", label: "دوام جزئي" },
                          ]}
                          name="worktype"
                          value={workType}
                          onChange={(e) => setWorkType(e.target.value)}
                        />
                        {error && error.worktype && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {error.worktype}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="addnewemployee-sec2"></div>
                  </div>
                  <div className="addnewemployee-btnCon">
                    {isSubmitting ? (
                      <Spinner animation="border" variant="primary" />
                    ) : (
                      <CustomButton text="التالي" />
                    )}
                  </div>
                </Form>
              )}
            </div>
            <div className="addnewemployee-salary w-100">
            {activeTab === 1 && (
              <Form onSubmit={handleNextTab2} className="w-100 px-2 px-md-3">
                <Title
                  title="راتب الموظف"
                  className="marketingtitle text-center mb-4"
                  icon={<FontAwesomeIcon icon={faClipboardUser} />}
                />

                {/* استخدام Bootstrap Grid يضمن استجابة الشاشة تلقائياً */}
                <div className="row g-3 justify-content-center">
                  
                  {/* 1. الراتب الأساسي */}
                  <div className="col-12 col-sm-6">
                    <RegisterTextbox
                      id="mainBudget"
                      label="الراتب الأساسي"
                      type="number"
                      value={salaryDetails.mainBudget}
                      onChange={handleSalaryChange}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>

                  {/* 2. التأمين الاجتماعي */}
                  <div className="col-12 col-sm-6">
                    <RegisterTextbox
                      id="socialWelfare"
                      label="التأمين الاجتماعي"
                      type="number"
                      value={salaryDetails.socialWelfare}
                      onChange={handleSalaryChange}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>

                  {/* 3. بدل السكن */}
                  <div className="col-12 col-sm-6">
                    <RegisterTextbox
                      id="house"
                      label="بدل السكن"
                      type="number"
                      value={house}
                      onChange={(e) => setHouse(e.target.value)}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>

                  {/* 4. بدل المواصلات */}
                  <div className="col-12 col-sm-6">
                    <RegisterTextbox
                      id="transport"
                      label="بدل المواصلات"
                      type="number"
                      value={transportation}
                      onChange={(e) => setTransportation(e.target.value)}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>

                  {/* 5. بدل اتصال */}
                  <div className="col-12 col-sm-6">
                    <RegisterTextbox
                      id="communication"
                      label="بدل اتصال"
                      type="number"
                      value={communication}
                      onChange={(e) => setCommunication(e.target.value)}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>

                  {/* 6. بدل اعاشة */}
                  <div className="col-12 col-sm-6">
                    <RegisterTextbox
                      id="life"
                      label="بدل اعاشة"
                      type="number"
                      value={life}
                      onChange={(e) => setLife(e.target.value)}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>

                  {/* 7. بدل طبيعة عمل */}
                  <div className="col-12 col-sm-6">
                    <RegisterTextbox
                      id="work"
                      label="بدل طبيعة عمل"
                      type="number"
                      value={work}
                      onChange={(e) => setWork(e.target.value)}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>

                  {/* 8. نسبة التأمين الاجتماعي */}
                  <div className="col-12 col-sm-6">
                    <RegisterTextbox
                      id="socialWelfareRatio"
                      label="نسبة التأمين الاجتماعي"
                      type="number"
                      onChange={(e) => {
                        const { id, value } = e.target;
                        setSalaryDetails((prevState) => ({
                          ...prevState,
                          [id]: value <= 100 ? value : prevState[id],
                          socialWelfare:
                            value <= 100
                              ? ((value * prevState.mainBudget) / 100).toFixed(1)
                              : prevState.socialWelfareRatio,
                        }));
                      }}
                      value={salaryDetails.socialWelfareRatio}
                      prefix={<FontAwesomeIcon icon={faPercent} />}
                      customPrefixLeft="4px"
                      parentStyle={{ width: "100%" }}
                    />
                  </div>

                  {/* 9. حساب ترحيل الراتب */}
                  <div className="col-12 col-sm-6">
                    <RegisterSelect
                      id="jobtitle"
                      label="حساب ترحيل الراتب"
                      options={[
                        { value: "", label: " اختر حساب ترحيل الراتب " },
                        {
                          value: "41101001,41101002,41101003,41101004,41101005,41101006,41101007,41101008",
                          label: "الرواتب والأجور النقدية",
                        },
                        {
                          value: "42301001,42301002,42301003,42301004,42301005,42301006,42301007,42301008",
                          label: "مصاريف التشغيل المحمله على النشاط",
                        },
                        {
                          value: "44101001,44101002,44101003,44101004,44101005,44101006,44101007,44101008",
                          label: "مصاريف جمع الاموال",
                        },
                      ]}
                      name="type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      parentStyle={{ width: "100%" }}
                    />
                    {error && error.account && (
                      <div className="text-danger fs-6 mt-1">{error.account}</div>
                    )}
                  </div>

                  {/* 10. الإجمالي */}
                  <div className="col-12 col-sm-6">
                    <RegisterTextbox
                      label="الإجمالي"
                      value={calculateTotal()}
                      disabled
                      stylee={{
                        backgroundColor: "var(--background-color)",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                      parentStyle={{ width: "100%" }}
                    />
                  </div>
                </div>

                {/* زر الحفظ متمركز وبمسافة متناسقة */}
                <div className="d-flex justify-content-center mt-4 mb-2">
                  {isSubmitting2 ? (
                    <Spinner animation="border" variant="primary" />
                  ) : (
                    <CustomButton text="حفظ" />
                  )}
                </div>
              </Form>
            )}
          </div>
           <div>
  {activeTab === 2 && (
    <div
      className="dynamic-documents-section"
       style={{ width: "80%", marginTop: "",margin:"20px auto 0" }}
    >
      {/* قسم رفع المستندات المتعددة */}

      <p
        className="datelable"
        style={{ fontWeight: "bold", marginBottom: "10px" }}
      >
        مستندات الموظف الإضافية
      </p>

      {documents.map((doc, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
            position: "relative",
          }}
        >
          {documents.length > 1 && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              style={{ position: "absolute", top: "10px", left: "10px" }}
              onClick={() => handleRemoveDocument(index)}
            >
              حذف
            </button>
          )}

          <RegisterTextbox
            parentStyle={{ width: "100%", marginBottom: "10px" }}
            id={`doc-title-${index}`}
            label={`عنوان المستند ${index + 1}`}
            type="text"
            stylee={{ width: "100%" }}
            value={doc.title}
            onChange={(e) =>
              handleDocTitleChange(index, e.target.value)
            }
          />

          <UploadInput
            id={`doc-file-${index}`}
            parentStyle={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
            }}
            label="اختر الملف"
            onChange={(e) =>
              handleDocFileChange(index, e.target.files[0])
            }
            accept=".pdf,.doc,.docx,image/*"
          />

          {doc.file && (
            <span style={{ fontSize: "12px", color: "green" }}>
              ملف تم اختياره: {doc.file.name}
            </span>
          )}
        </div>
      ))}

      <button
        type="button"
        className="btn btn-secondary"
        style={{ marginTop: "10px", width: "100%" }}
        onClick={handleAddDocument}
      >
        + إضافة مستند آخر
      </button>
    </div>
  )}
</div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddNewEmployee;
