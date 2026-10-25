import { Form, Tabs, Tab } from "react-bootstrap";
import "./CompletingData.css";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import UploadInput from "../../components/UploadInput";
import { useState, useContext, useEffect } from "react";
// import FlagSu from "../../saudi-arabia.png";
import CustomButton from "../../components/CustomButton";
import { useNavigate } from "react-router";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import { AppContext } from "../../context/AuthContext";
import { error } from "highcharts";



function CompletingData() {
  const [phonenumber, setPhonenumber] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [document, setDocument] = useState(null);
  const [document2, setDocument2] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [activeTab, setActiveTab] = useState("form1");
  const [representativeName, setRepresentativeName] = useState("");
  const [representativeEmail, setRepresentativeEmail] = useState("");
  const [representativePhone, setRepresentativePhone] = useState("");
  const [representativeAddress, setRepresentativeAddress] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AppContext);
  const [specialization, setSpecialization] = useState({});
  const [enrollment, setEnrollment] = useState('');
  const [spec, setSpec] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [taxregister , setTaxregister] = useState('');
  const [taxnumber , setTaxnumber] = useState('');  
  const [stamp , setStamp] = useState('');



  const handleNext = () => {
    if (activeTab === "form1") {
      setActiveTab("form2");
    }
  };
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const handleBack = () => {
    if (activeTab === "form2") {
      setActiveTab("form1");
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (/[A-Z]/.test(representativeEmail)) {
      setEmailError("البريد الإلكتروني يجب أن يكون بدون أحرف كبيرة");
      setFormError("يرجى تصحيح الأخطاء قبل إرسال النموذج");
      return;
    } else {
      setEmailError("");
    }

    // const phoneNumberLength = representativePhone.replace(/[^0-9]/g, "").length;
    // if (phoneNumberLength !== 10) {
    //   setPhoneError("رقم الجوال يجب أن يتكون من 10 أرقام فقط");
    //   setFormError("يرجى تصحيح الأخطاء قبل إرسال النموذج");
    //   return;
    // }

    if (address.length === 0) {
      setAddressError("مطلوب ادخال العنوان");
      setFormError("يرجى تصحيح الأخطاء قبل إرسال النموذج");
      return;
    }

    setPhoneError("");
    setEmailError("");
    setFormError("");
    setAddressError("");

    setRepresentativeName("");
    setRepresentativeEmail("");
    setRepresentativePhone("");
    setRepresentativeAddress("");

    const mForm = new FormData;
    mForm.append('name', name);
    mForm.append('city', city);
    mForm.append('location', location);
    mForm.append('phonenumber', phonenumber);
    mForm.append('spec', spec);
    mForm.append('enrollment', enrollment);
    mForm.append('email', email);
    mForm.append('website', website);
    mForm.append('address', address);
    mForm.append('logo', document2);
    mForm.append('document', document);
    mForm.append('taxregister', taxregister);
    mForm.append('taxnumber', taxnumber);
    mForm.append('stamp', stamp);
    try {
      const res = API.post('verifyorganization', mForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = await res;
      console.log(data.status);
      if (data.status === 200) {
        navigate('/datareview')
      } else {
        setFormError(data.data.errors);
      }
    } catch (error) {
      console.log(error);
      setFormError(error.response.data.errors);
    }

  };
  // const handlePhoneChange = (e) => {
  //   const value = e.target.value;
  //   setRepresentativePhone(value);

  //   if (value.replace(/[^0-9]/g, "").length > 10) {
  //     setPhoneError("رقم الجوال يجب أن يتكون من 10 أرقام فقط");
  //   } else {
  //     setPhoneError("");
  //   }
  // };

  const handleEmailChange = (e) => {
    setRepresentativeEmail(e.target.value);
  };


  async function getSpecialities() {

    const response = API.get("verifyorganization/specializations");
    const data = await response;
    if (data.status === 200) {
      setSpecialization(data.data);
      console.log(data.data);
      setLoading(false);
    } else {
      console.log("data not found");
    }

  };

  useEffect(() => {
    getSpecialities();
  }, []);
  return (
    loading ? <TestPreLoader /> :
      <div className="complete-form-conatiner">
        <h1 className="complete-title">استكمال بيانات الجمعية</h1>
        <Tabs
          id="completing-data-tabs"
          activeKey={activeTab}
          onSelect={(tab) => setActiveTab(tab)}
          className="mb-3 completeDatatabs"
        >
          <Tab eventKey="form1" title="1">
            <div className="complete-form">
              <div className="register-form-conatiner">
                <Form>
                  <RegisterTextbox
                    id="representativeName"
                    label="اسم ممثل الجمعية"
                    value={user && user.user && user.user.name}
                    onChange={(e) => setRepresentativeName(e.target.value)}
                    type="text"
                    disabled
                  />
                  <RegisterTextbox
                    id="representativeEmail"
                    label="البريد الالكتروني لممثل الجمعية"
                    value={user && user.user && user.user.email}
                    onChange={handleEmailChange}
                    type="email"
                    disabled
                  />
                  {emailError && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {emailError}
                    </div>
                  )}
                  <div style={{ direction: "ltr" }}>
                    <RegisterTextbox
                      id="representativePhone"
                      label="رقم جوال ممثل الجمعية"
                      value={user && user.user && user.user.phone}
                      //onChange={handlePhoneChange}
                      type="number"
                      prefix="+966"
                      // flag={FlagSu}
                      align="left"
                      disabled
                    />
                  </div>

                  {phoneError && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {phoneError}
                    </div>
                  )}

                  <RegisterTextbox
                    id="representativeAddress"
                    label="عنوان ممثل الجمعية"
                    value={user && user.user && user.user.address}
                    onChange={(e) => setRepresentativeAddress(e.target.value)}
                    type="text"
                    disabled
                  />
                </Form>
              </div>
            </div>
          </Tab>

          <Tab eventKey="form2" title="2">
            <div className="complete-form">

              <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="complete-inputs">
                  <RegisterTextbox
                    parentStyle={{ width: "45%" }}
                    id="name"
                    label="اسم الجمعية"
                    type="text"
                    stylee={{ width: "45%" }}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {formError && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {formError.name}
                    </div>
                  )}
                  <div style={{ direction: "ltr", width: "45%" }}>
                    <RegisterTextbox
                      parentStyle={{ width: "100%" }}
                      id="phonenumber"
                      label="رقم هاتف الجمعية"
                      type="text"
                      stylee={{ width: "45%" }}
                      prefix="+966"
                      name="phonenumber"
                      value={phonenumber}
                      // flag={FlagSu}
                      onChange={(e) => setPhonenumber(e.target.value)}
                    />
                  </div>
                </div>
                {formError && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {formError.phonenumber}
                  </div>
                )}
                <div className="complete-inputs">
                  <RegisterTextbox
                    parentStyle={{ width: "45%" }}
                    id="city"
                    label="المدينة"
                    type="text"
                    stylee={{ width: "45%" }}
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  {formError && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {formError.city}
                    </div>
                  )}
                  {/* <RegisterSelect
                    id="location"
                    label="المنطقة"
                    stylee={{ width: "45%" }}
                    parentStyle={{ width: "45%", marginBottom: "20px" }}
                    options={[
                      { value: "جدة", label: "جدة" },
                      { value: "الرياض", label: "الرياض" },
                      { value: "مكة", label: "مكة" },
                    ]}
                    onChange={(e) => setLocation(e.target.value)}
                    value={location}
                    name="location"
                  /> */}
                  <RegisterTextbox
                    parentStyle={{ width: "45%" }}
                    id="location"
                    label="المنطقة"
                    type="text"
                    stylee={{ width: "45%" }}
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                {formError && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {formError.location}
                  </div>
                )}
                <div className="complete-inputs">
                  <RegisterTextbox
                    parentStyle={{ width: "45%" }}
                    id="enrollment"
                    label="رقم التسجيل"
                    type="num"
                    stylee={{ width: "45%" }}
                    name="enrollment"
                    value={enrollment}
                    onChange={(e) => setEnrollment(e.target.value)}
                  />
                  {formError && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {formError.enrollment}
                    </div>
                  )}
                  <RegisterSelect
                    id="specialization"
                    label="التخصص"
                    stylee={{ width: "45%" }}
                    parentStyle={{ width: "45%", marginBottom: "20px" }}
                    options={[{ value: "0", label: "اختر التخصص" }, ...specialization.map((spec, index) => ({ value: spec.id, label: spec.name }))]}
                    onChange={(e) => setSpec(e.target.value)}
                    value={spec}
                    name="spec"
                  />
                </div>
                {formError && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {formError.spec}
                  </div>
                )}
                <div className="complete-inputs">
                  <RegisterTextbox
                    parentStyle={{ width: "45%" }}
                    id="email"
                    label="البريد الإلكتروني"
                    type="email"
                    stylee={{ width: "45%" }}
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {formError && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {formError.email}
                    </div>
                  )}
                  <div style={{ direction: "ltr", width: "45%" }}>
                    <RegisterTextbox
                      parentStyle={{ width: "100%" }}
                      id="website"
                      label="الموقع الإلكتروني"
                      type="text"
                      stylee={{ width: "45%" }}
                      name="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>
                {formError && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {formError.website}
                  </div>
                )}
                
               <div className="complete-inputs">
                 <RegisterTextbox
                  parentStyle={{ width: "45%" }}
                  id="taxregister"
                  label="السجل الضريبي"
                  type="text"
                  stylee={{ width: "45%" }}
                  name="taxregister"
                  value={taxregister}
                  onChange={(e) => setTaxregister(e.target.value)}
                />
                {formError && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {formError.taxregister}
                  </div>
                )}
                
                <RegisterTextbox
                  parentStyle={{ width: "45%" }}
                  id="taxnumber"
                  label="رقم السجل الضريبي"
                  type="text"
                  stylee={{ width: "45%" }}
                  name="taxnumber"
                  value={taxnumber}
                  onChange={(e) => setTaxnumber(e.target.value)}
                />
                {formError && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {formError.taxnumber}
                  </div>
                )}
                </div>
                <div className="complete-inputs">
                  <RegisterTextbox
                    parentStyle={{ width: "45%" }}
                    id="address"
                    label="العنوان"
                    value={address}
                    onChange={handleAddressChange}
                    type="text"
                    stylee={{ width: "45%" }}
                  />
                </div>
                {formError && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {formError.address}
                  </div>
                )}
                <div
                  className="complete-inputs complete-inputs2"
                  style={{ direction: "rtl", marginTop: "2%" }}
                >
                  <h4 className="complete-papers">الأوراق والمستندات المطلوبة</h4>
                  <h6 className="complete-papers">1- شهادة تفويض الجمعية</h6>
                  <h6 className="complete-papers">2- تفويض ممثل الجمعية</h6>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <UploadInput
                      id="documentUpload"
                      parentStyle={{ marginBottom: "20px" }}
                      onChange={(e) => setDocument(e.target.files[0])}
                      label="الاوراق"
                      name="document"
                    />

                    <UploadInput
                      id="documentUpload2"
                      parentStyle={{ marginBottom: "20px" }}
                      onChange={(e) => setDocument2(e.target.files[0])}
                      label="لوجو الجمعية"
                      name="document2"
                    />

                     <UploadInput
                      id="stamoUpload2"
                      parentStyle={{ marginBottom: "20px" }}
                      onChange={(e) => setStamp(e.target.files[0])}
                      label=" ختم الجمعية"
                      name="stamp"
                    />
                  </div>
                  {phoneError && (
                    <div
                      className="phone-error"
                      style={{ color: "red", fontSize: "12px" }}
                    >
                      {phoneError}
                    </div>
                  )}
                  {addressError && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {addressError}
                    </div>
                  )}
                </div>

                <div style={{ direction: "ltr", width: "45%" }}></div>
              </Form>
            </div>
          </Tab>
        </Tabs>
        <div className="navigation-buttons">
          {activeTab === "form2" && (
            <CustomButton text="رجوع" onClick={handleBack} />
          )}
          {activeTab === "form1" && (
            <CustomButton text="التالي" onClick={handleNext} />
          )}
          {activeTab === "form2" && (
            <CustomButton text="إرسال" onClick={handleSubmit} />
          )}
        </div>
      </div>
  );
}

export default CompletingData;
