import React, { useEffect, useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardUser,
  faPercent,
  faUserPlus,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import Title from "../../components/title";
import RegisterTextbox from "../../components/RegisterTextBox";
import UploadInput from "../../components/UploadInput";
import RegisterSelect from "../../components/RegisterSelect";
import CustomButton from "../../components/CustomButton";
import API from "../../api/axiosConfig";
import TableComponent from "../../components/TableComponent";
import { toast } from "react-toastify";

function Volunteers() {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [iban, setIban] = useState("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("");
  const [qualification, setQualification] = useState("");
  const [upload, setUpload] = useState("");
  const [workDate, setWorkDate] = useState(
    new Date().toISOString().substr(0, 10),
  );
  const [dob, setDob] = useState(new Date().toISOString().substr(0, 10));
  const [status, setStatus] = useState(0);
  const [idexpireDate, setIdexpireDate] = useState(
    new Date().toISOString().substr(0, 10),
  );
  const [jobtitle, setJobtitle] = useState("");
  const [idtype, setIdtype] = useState(0);
  const [idnumber, setIdnumber] = useState("");
  const [gender, setGender] = useState("");
  const [expirehire, setExpirehire] = useState(
    new Date().toISOString().substr(0, 10),
  );
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [totalworkhours, setTotalWorkHours] = useState("");
  const [rewards, setRewards] = useState("");
  const [notes, setNotes] = useState("");
  const [upload2, setUpload2] = useState("");
  const [phone, setPhone] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setIban("");
    setAddress("");
    setNationality("");
    setQualification("");
    setUpload("");
    setWorkDate(new Date().toISOString().substr(0, 10));
    setDob(new Date().toISOString().substr(0, 10));
    setStatus(0);
    setIdexpireDate(new Date().toISOString().substr(0, 10));
    setJobtitle("");
    setIdtype(0);
    setIdnumber("");
    setGender("");
    setExpirehire(new Date().toISOString().substr(0, 10));
    setCity("");
    setRegion("");
    setCountry("");
    setTotalWorkHours("");
    setRewards("");
    setNotes("");
    setUpload2("");
    setPhone("");
    setError({});
  };

  const columns = [
    { name: "إسم المتطوع", key: "name" },
    { name: "رقم الهوية", key: "identification_number" },
    { name: "رقم الجوال", key: "phone" },
    { name: "تاريخ التعيين", key: "dateofhire" },
    { name: " نوع التطوع", key: "type" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions = [
    { label: "تعديل بيانات المتطوع ", route: "/editvolunteer/:id" },
    { label: " سند صرف ", route: "/volunteersVoucher/:id" },
    { label: " شهادة المتطوعين", route: "/volunteercertificate/:id" },
    { label: " حذف المتطوع", route: "/volunteerWorkHours/:id" },
  ];

  const dummyData = [
    {
      id: 1,
      name: "أحمد السالم",
      identification_number: "1023456789",
      phone: "0501234567",
      dateofhire: "2024-01-15",
      type: "تطوع عام",
    },
    {
      id: 2,
      name: "سارة محمد",
      identification_number: "1023456790",
      phone: "0502345678",
      dateofhire: "2023-09-10",
      type: "تطوع تخصصي",
    },
    {
      id: 3,
      name: "خالد إبراهيم",
      identification_number: "1023456791",
      phone: "0503456789",
      dateofhire: "2022-06-20",
      type: "تطوع عام",
    },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mFormData = new FormData();
    mFormData.append("name", name);
    mFormData.append("dateofbirth", dob);
    mFormData.append("dateofhire", workDate);
    mFormData.append("socialstatus", status);
    mFormData.append("phone", phone);
    mFormData.append("iban", iban);
    mFormData.append("idexpiredate", idexpireDate);
    mFormData.append("gender", gender);
    mFormData.append("idtype", idtype);
    mFormData.append("idnumber", idnumber);
    mFormData.append("address", address);
    mFormData.append("email", email);
    mFormData.append("nationality", nationality);
    mFormData.append("type", jobtitle);
    mFormData.append("qualification", qualification);
    mFormData.append("expirehire", expirehire);
    if (upload) mFormData.append("profile", upload);
    mFormData.append("city", city);
    mFormData.append("region", region);
    mFormData.append("country", country);
    mFormData.append("totalworkhours", totalworkhours);
    mFormData.append("rewards", rewards);
    mFormData.append("notes", notes);
    if (upload2) mFormData.append("upload", upload2);

    try {
      const res = await API.post("/volunteers/store", mFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        setShowModal(false);
        setRefreshKey((prev) => prev + 1);
        resetForm();
        toast.success("تم إضافة المتطوع بنجاح");
      } else {
        setError(res.data.errors || {});
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || {});
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="addnewemployee-container">
      <div className="employee-list-page">
        <TableComponent
          key={refreshKey}
          apiUrl="/volunteers"
          data={dummyData}
          columns={columns}
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          title="إدارة المتطوعين"
          dropdownOptions={dropdownOptions}
          searchDate={false}
          addBtn={true}
          onAddClick={() => setShowModal(true)}
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
          <Modal.Title>إضافة متطوع جديد</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="addnewemployee">
            <div className="addnewemployee-content">
              <Form onSubmit={handleSave} encType="multipart/form-data">
                <div className="addempTitle">
                  <Title
                    title="البيانات العامة للمتطوع"
                    className="marketingtitle"
                    icon={<FontAwesomeIcon icon={faUserPlus} />}
                  />{" "}
                  <div className="addnewemployee-form1">
                    <div className="addnewemployee-sec1">
                      <RegisterTextbox
                        parentStyle={{ width: "80%",marginBottom:"1rem" }}
                        id="empname"
                        label="إسم المتطوع"
                        type="text"
                        stylee={{ width: "55%" }}
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {error.name && (
                        <div
                          className="error-message text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          {error.name}
                        </div>
                      )}

                      <div className="responParent" style={{ width: "100%",marginBottom:"1rem" }}>
                        <p className="datelable">تاريخ الميلاد</p>
                        <input
                          type="date"
                          id="dob"
                          onChange={(e) => setDob(e.target.value)}
                          value={dob}
                          className="custom-datepicker"
                          style={{ height: "42px" }}
                        />
                      </div>

                      <div className="responParent" style={{ width: "100%" }}>
                        <p className="datelable">تاريخ الإلتحاق بالعمل</p>
                        <input
                          type="date"
                          id="workDate"
                          onChange={(e) => setWorkDate(e.target.value)}
                          value={workDate}
                          className="custom-datepicker"
                          style={{ height: "42px" }}
                        />
                      </div>

                      <div className="responParent" style={{ width: "100%" }}>
                        <p className="datelable">تاريخ انتهاء التعاقد</p>
                        <input
                          type="date"
                          id="expirehire"
                          onChange={(e) => setExpirehire(e.target.value)}
                          value={expirehire}
                          className="custom-datepicker"
                          style={{ height: "42px" }}
                        />
                      </div>

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

                      <RegisterTextbox
                        parentStyle={{ width: "80%", direction: "ltr" }}
                        id="phone"
                        label="رقم الجوال"
                        type="number"
                        stylee={{ width: "55%" }}
                        customPrefixLeft="4px"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        prefix="+966"
                      />
                      {error.phone && (
                        <div
                          className="error-message text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          {error.phone}
                        </div>
                      )}

                      <RegisterTextbox
                        parentStyle={{ width: "80%",marginBottom:"1rem" }}
                        id="iban"
                        label="رقم IBAN"
                        type="number"
                        stylee={{ width: "55%" }}
                        name="iban"
                        value={iban}
                        onChange={(e) => setIban(e.target.value)}
                      />

                      <div className="responParent" style={{ width: "100%" }}>
                        <p className="datelable">تاريخ انتهاء الهوية</p>
                        <input
                          type="date"
                          id="idexpireDate"
                          onChange={(e) => setIdexpireDate(e.target.value)}
                          value={idexpireDate}
                          className="custom-datepicker"
                          style={{ height: "42px" }}
                        />
                      </div>

                      <RegisterTextbox
                        parentStyle={{ width: "80%" }}
                        id="rewards"
                        label="المكافأة المالية"
                        type="text"
                        stylee={{ width: "55%" }}
                        name="rewards"
                        value={rewards}
                        onChange={(e) => setRewards(e.target.value)}
                      />

                      <RegisterTextbox
                        parentStyle={{ width: "80%" }}
                        id="qualification"
                        label="الشهادة"
                        type="text"
                        stylee={{ width: "55%" }}
                        name="qualification"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                      />
                    </div>

                    <div className="addnewemployee-sec1">
                      <RegisterSelect
                        id="gender"
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

                      <RegisterSelect
                        id="idtype"
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

                      <RegisterTextbox
                        parentStyle={{ width: "80%" }}
                        id="idnumber"
                        label={
                          idtype == 1
                            ? "رقم الهوية"
                            : idtype == 2
                              ? "رقم الاقامة"
                              : "الرقم"
                        }
                        type="text"
                        stylee={{ width: "55%" }}
                        name="idnumber"
                        value={idnumber}
                        onChange={(e) => setIdnumber(e.target.value)}
                      />

                      <RegisterTextbox
                        parentStyle={{ width: "80%" }}
                        id="address"
                        label="العنوان"
                        type="text"
                        stylee={{ width: "55%" }}
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />

                      <RegisterTextbox
                        parentStyle={{ width: "80%",marginBottom:"1rem" }}
                        id="email"
                        label="البريد الإلكتروني"
                        type="email"
                        stylee={{ width: "55%" }}
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      <RegisterTextbox
                        parentStyle={{ width: "80%" }}
                        id="nationality"
                        label="الجنسية"
                        type="text"
                        stylee={{ width: "55%" }}
                        name="nationality"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                      />

                      <RegisterSelect
                        id="jobtitle"
                        label=" نوع التطوع"
                        parentStyle={{ width: "80%" }}
                        stylee={{ width: "55%" }}
                        options={[
                          { value: "", label: " اختر نوع التطوع " },
                          { value: "0", label: " لا يوجد" },
                          { value: "1", label: "تطوع عام" },
                          { value: "2", label: "تطوع تخصصي" },
                        ]}
                        name="jobtitle"
                        value={jobtitle}
                        onChange={(e) => setJobtitle(e.target.value)}
                      />

                      <RegisterTextbox
                        parentStyle={{ width: "80%" }}
                        id="city"
                        label="المدينة"
                        type="text"
                        stylee={{ width: "55%" }}
                        name="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />

                      <RegisterTextbox
                        parentStyle={{ width: "80%" }}
                        id="totalworkhours"
                        label="عدد ساعات العمل"
                        type="text"
                        stylee={{ width: "55%" }}
                        name="totalworkhours"
                        value={totalworkhours}
                        onChange={(e) => setTotalWorkHours(e.target.value)}
                      />

                      <RegisterTextbox
                        parentStyle={{ width: "80%" }}
                        id="notes"
                        label="ملاحظات"
                        type="text"
                        stylee={{ width: "55%" }}
                        name="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="addnewemployee-sec2">
                    <UploadInput
                      id="profile"
                      parentStyle={{
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                      }}
                      label="رفع الصورة الشخصية"
                      name="upload"
                      onChange={(e) => setUpload(e.target.files[0])}
                      accept="image/*"
                    />
                    <UploadInput
                      id="upload"
                      parentStyle={{
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                      }}
                      label="رفع الشهادة"
                      name="upload2"
                      onChange={(e) => setUpload2(e.target.files[0])}
                      accept="image/*"
                    />
                  </div>
                </div>
                <div className="addnewemployee-btnCon">
                  {isSubmitting ? (
                    <Spinner animation="border" variant="primary" />
                  ) : (
                    <CustomButton text="حفظ" />
                  )}
                </div>
              </Form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Volunteers;
