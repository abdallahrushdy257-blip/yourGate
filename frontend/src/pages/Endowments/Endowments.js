import React, { useState, useEffect } from "react";
import "../CreateLoan/createLoan.css";
import Title from "../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPlus } from "@fortawesome/free-solid-svg-icons";
import "../AddBeneficiary/addBeneficiary.css";
import "./endowments.css";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import UploadInput from "../../components/UploadInput";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router";
import { Spinner, Form } from "react-bootstrap";
import TestPreLoader from "../TestPreLoader/TestPreLoader";

function Endowments() {
  const tabsBase = ["one", "three"];
  const [activeTab, setActiveTab] = useState("one");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);

  const allowedTypes = ["عقار", "أرض", "سوق", "مزرعة"];
  const showTab2 = allowedTypes.includes(type) && "ok";

  const tabs = showTab2 ? ["one", "two", "three"] : ["one", "three"];
  const [error, setError] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [endowmentnumber, setEndowmentnumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [ownertype, setOwnertype] = useState("");
  const [endowmentsource, setEndowmentsource] = useState("");
  const [endowmenttype, setEndowmenttype] = useState("");
  const [description1, setDescription1] = useState("");
  const [area, setArea] = useState("");
  const [houseamount, setHouseamount] = useState("");
  const [buildnumber, setBuildnumber] = useState("");
  const [streetname, setStreetname] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [geolocation, setGeolocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [upload, setUpload] = useState("");
  const [casetype, setCasetype] = useState("");
  const [response, setResponse] = useState("");
  const [amount, setAmount] = useState("");
  const [paid, setPaid] = useState("");
  const [remain, setRemain] = useState("");
  const [annualfees, setAnnualfees] = useState("");
  const [netprofit, setNetprofit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [account, setAccount] = useState("");

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

  const getEmployee = async () => {
    try {
      const res = await API.get("/endowments/employees");
      const data = await res;
      if (data.status === 200) {
        setRows(data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.errors);
    }
  };

  useEffect(() => {
    getEmployee();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("endowmentnumber", endowmentnumber);
    formData.append("date", date);
    formData.append("ownertype", ownertype);
    formData.append("endowmentsource", endowmentsource);
    formData.append("type", type);
    formData.append("description1", description1);
    formData.append("area", area);
    formData.append("houseamount", houseamount);
    formData.append("buildnumber", buildnumber);
    formData.append("streetname", streetname);
    formData.append("city", city);
    formData.append("country", country);
    formData.append("zip", zip);
    formData.append("state", state);
    formData.append("zipcode", zipcode);
    formData.append("geolocation", geolocation);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("upload", upload);
    formData.append("casetype", casetype);
    formData.append("response", response);
    formData.append("amount", amount);
    formData.append("remain", remain);
    formData.append("annualfees", annualfees);
    formData.append("netprofit", netprofit);
    formData.append("account", account);
    try {
      const response = await API.post("/endowments/store", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      const data = await response.data;
      navigate("/endowmentsReport");
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      setError(error.response.data.errors);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "one":
        return (
          <>
            <div className="endowments">
              <div className="endowmentsRow">
                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="إسم الوقف"
                  type="text"
                  stylee={{
                    width: "55%",
                  }}
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  error={error.name}
                />
                {/* {error.name && <span className="error">{error.name}</span>} */}
                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="وصف الوقف"
                  type="text"
                  stylee={{
                    width: "55%",
                  }}
                  name="description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  error={error.description}
                />
                {/* {error.description && <span className="error">{error.description}</span>} */}
              </div>
              <div className="endowmentsRow">
                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="رقم الصك"
                  type="number"
                  stylee={{
                    width: "55%",
                  }}
                  name="endowmentnumber"
                  onChange={(e) => setEndowmentnumber(e.target.value)}
                  value={endowmentnumber}
                  error={error.endowmentnumber}
                />
                {/* {error.endowmentnumber && <span className="error">{error.endowmentnumber}</span>} */}
                {/* <RegisterTextbox
                                    parentStyle={{
                                        width: "40%",
                                    }}
                                    label="تاريخ الصك"
                                    type="date"
                                    stylee={{
                                        width: "55%",
                                    }}
                                    onChange={handleDateChange}
                                /> */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "right",
                    width: "40%",
                    marginBottom: "20px",
                  }}
                >
                  <p style={{ marginBottom: "10px" }}>تاريخ انشاء الصك</p>
                  <input
                    type="date"
                    name="date"
                    className="custom-datepicker"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                    style={{ width: "100%" }}
                  />
                </div>
                {error.date && <span className="error">{error.date}</span>}
              </div>
              <div className="endowmentsRow">
                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="طريقة التملك"
                  type="text"
                  stylee={{
                    width: "55%",
                  }}
                  name="ownertype"
                  onChange={(e) => setOwnertype(e.target.value)}
                  value={ownertype}
                  error={error.ownertype}
                />
                {/* {error.ownertype && <span className="error">{error.ownertype}</span>} */}
                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="جهة اصدار الوقف"
                  type="text"
                  stylee={{
                    width: "55%",
                  }}
                  name="endowmentsource"
                  onChange={(e) => setEndowmentsource(e.target.value)}
                  value={endowmentsource}
                  error={error.endowmentsource}
                />
                {/* {error.endowmentsource && <span className="error">{error.endowmentsource}</span>} */}
              </div>
              <div className="endowmentsRow">
                <RegisterSelect
                  label="نوع الوقف"
                  stylee={{
                    width: "55% !important",
                  }}
                  parentStyle={{
                    width: "40%",
                    // marginBottom: "20px",
                  }}
                  options={[
                    { value: "", label: "إختر النوع" },
                    { value: "أرض", label: "أرض" },
                    { value: "عقار", label: "عقار" },
                    { value: "سيارة", label: "سيارة" },
                    { value: "معدات", label: "معدات" },
                    { value: "سوق", label: "سوق" },
                    { value: "مزرعة", label: "مزرعة" },
                    { value: "تقنيات الكترونية", label: "تقنيات الكترونية" },
                    { value: "اخري", label: "اخري" },
                  ]}
                  onChange={(e) => setType(e.target.value)}
                  value={type}
                  error={error.type}
                />
                {/* {error.type && <span className="error">{error.type}</span>} */}

                <RegisterSelect
                  label="الحساب الفرعي"
                  stylee={{
                    width: "55% !important",
                  }}
                  parentStyle={{
                    width: "40%",
                    // marginBottom: "20px",
                  }}
                  options={[
                    { value: "", label: "إختر النوع" },
                    {
                      value: "9e5000d7-6017-4785-b46c-8805d241d1c4",
                      label: "استثمارات وقفية عقارية - اراضي",
                    },
                    {
                      value: "9e5000d7-7c3d-4a2d-a45b-91dec8e85ad6",
                      label: "اسثمارات وقفية عقارية - مباني",
                    },
                    {
                      value: "9e5000d7-b02c-4e99-9e23-e030a7118503",
                      label: " الأصول الثابتة الوقفية - أراضي",
                    },
                    {
                      value: "9e5000d8-3cad-42e3-a5ef-7da2ad630e7a",
                      label: " الأصول الثابتة الوقفية - مباني",
                    },
                    {
                      value: "9e5000d8-7da3-4133-907d-3eecd5a07310",
                      label: "الأصول الثابتة الوقفية - اللات و معدات",
                    },
                    {
                      value: "9e5000d9-400c-4cb5-9eaa-5086c84af5e1",
                      label: "الاصول غير الملموسة - اوقاف",
                    },
                    {
                      value: "9e5000d9-6b43-4eda-a210-1bc075a5fe02",
                      label: "اعمال رأسمالية تحت الانشاء",
                    },
                    {
                      value: "9e5000d9-d772-47e2-977b-dc39597de56c",
                      label: " الموجودات الحيوية - أوقاف.",
                    },
                  ]}
                  onChange={(e) => setAccount(e.target.value)}
                  value={account}
                  error={error.account}
                />
                {/* {error.account && <span className="error">{error.account}</span>} */}
              </div>
              <div className="endowmentsRow">
                {type === "اخري" && (
                  <RegisterTextbox
                    parentStyle={{
                      width: "40%",
                    }}
                    label="ادخل النوع"
                    type="text"
                    stylee={{
                      width: "55%",
                    }}
                    name="description1"
                    onChange={(e) => setDescription1(e.target.value)}
                    value={description1}
                    error={error.description1}
                  />
                )}
                {/* {error && error.description1 && <span className="error">{error.description1}</span>} */}
              </div>
            </div>
          </>
        );
      case "two":
        return (
          <>
            <div className="endowments">
              <div className="endowmentsRow">
                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="مساحة الوقف"
                  type="text"
                  stylee={{
                    width: "55%",
                  }}
                  name="area"
                  onChange={(e) => setArea(e.target.value)}
                  value={area}
                  error={error.area}
                />
                {/* {error.area && <span className="error">{error.area}</span>} */}
                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="عدد الوحدات السكنية"
                  type="number"
                  stylee={{
                    width: "55%",
                  }}
                  name="houseamount"
                  onChange={(e) => setHouseamount(e.target.value)}
                  value={houseamount}
                  error={error.houseamount}
                />
                {/* {error.houseamount && <span className="error">{error.houseamount}</span>} */}
              </div>
              <div className="endowmentsRow">
                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="رقم المبني"
                  type="number"
                  stylee={{
                    width: "55%",
                  }}
                  name="buildnumber"
                  onChange={(e) => setBuildnumber(e.target.value)}
                  value={buildnumber}
                  error={error.buildnumber}
                />
                {/* {error.buildnumber && <span className="error">{error.buildnumber}</span>} */}
                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="إسم الشارع"
                  type="text"
                  stylee={{
                    width: "55%",
                  }}
                  name="streetname"
                  onChange={(e) => setStreetname(e.target.value)}
                  value={streetname}
                  error={error.streetname}
                />
                {/* {error.streetname && <span className="error">{error.streetname}</span>} */}
              </div>

              <div className="endowmentsRow">
                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="إسم الحي"
                  type="text"
                  stylee={{
                    width: "55%",
                  }}
                  name="state"
                  onChange={(e) => setState(e.target.value)}
                  value={state}
                  error={error.state}
                />
                {/* {error.state && <span className="error">{error.state}</span>} */}
                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="المدينة"
                  type="text"
                  stylee={{
                    width: "55%",
                  }}
                  name="city"
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  error={error.city}
                />
                {/* {error.city && <span className="error">{error.city}</span>} */}
              </div>

              <div className="endowmentsRow">
                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="البلد"
                  type="text"
                  stylee={{
                    width: "55%",
                  }}
                  name="country"
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                  error={error.country}
                />
                {/* {error.country && <span className="error">{error.country}</span>} */}
                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="الرمز البريدي"
                  type="number"
                  stylee={{
                    width: "55%",
                  }}
                  name="zipcode"
                  onChange={(e) => setZipcode(e.target.value)}
                  value={zipcode}
                  error={error.zipcode}
                />
                {/* {error.zipcode && <span className="error">{error.zipcode}</span>} */}
              </div>

              <div className="endowmentsRow endowmentsRow2">
                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="احداثيات العنوان"
                  type="text"
                  stylee={{
                    width: "55%",
                  }}
                  name="geolocation"
                  onChange={(e) => setGeolocation(e.target.value)}
                  value={geolocation}
                  error={error.geolocation}
                />
                {/* {error.geolocation && <span className="error">{error.geolocation}</span>} */}
                <div className="locCon">
                  <RegisterTextbox
                    parentStyle={{
                      width: "40%",
                    }}
                    label="رأسي"
                    type="text"
                    stylee={{
                      width: "55%",
                    }}
                    prefix={<FontAwesomeIcon icon={faLocationDot} />}
                    name="latitude"
                    onChange={(e) => setLatitude(e.target.value)}
                    value={latitude}
                    error={error.latitude}
                  />
                  {/* {error.latitude && <span className="error">{error.latitude}</span>} */}
                  <RegisterTextbox
                    parentStyle={{
                      width: "40%",
                    }}
                    label="افقي"
                    type="text"
                    stylee={{
                      width: "55%",
                    }}
                    prefix={<FontAwesomeIcon icon={faLocationDot} />}
                    name="longitude"
                    onChange={(e) => setLongitude(e.target.value)}
                    value={longitude}
                    error={error.longitude}
                  />
                  {/* {error.longitude && <span className="error">{error.longitude}</span>} */}
                </div>
              </div>

              <div className="endowmentsRow">
                <RegisterSelect
                  label="الحالة"
                  stylee={{
                    width: "55% !important",
                  }}
                  parentStyle={{
                    width: "40%",
                    // marginBottom: "20px",
                  }}
                  options={[
                    { value: "", label: "إختر الحالة" },
                    { value: "مؤجر", label: "مؤجر" },
                    { value: "غير مؤجر", label: "غير مؤجر" },
                    { value: "تشغيل ذاتي", label: "تشغيل ذاتي" },
                    { value: "قيد الإنشاء", label: "قيد الإنشاء" },
                    { value: "الصيانة", label: "الصيانة" },
                  ]}
                  name="casetype"
                  onChange={(e) => setCasetype(e.target.value)}
                  value={casetype}
                  error={error.casetype}
                />
                {/* {error.casetype && <span className="error">{error.casetype}</span>} */}
              </div>
            </div>
          </>
        );
      case "three":
        return (
          <>
            <div className="endowments">
              <div className="endowmentsRow">
                <RegisterSelect
                  label="مسؤل الوقف"
                  stylee={{
                    width: "55% !important",
                  }}
                  parentStyle={{
                    width: "40%",
                    // marginBottom: "20px",
                  }}
                  options={[
                    { value: "", label: "إختر الحالة" },
                    ...rows.map((row) => ({
                      value: row.id,
                      label: row.name,
                    })),
                  ]}
                  name="response"
                  onChange={(e) => setResponse(e.target.value)}
                  value={response}
                  error={error.response}
                />
                {/* {error.response && <span className="error">{error.response}</span>} */}
                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="مصاريف الوقف"
                  type="number"
                  stylee={{
                    width: "55%",
                  }}
                  name="amount"
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                  error={error.amount}
                />
                {/* {error.amount && <span className="error">{error.amount}</span>} */}

                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="تكلفة التشغيل السنوية"
                  type="number"
                  stylee={{
                    width: "55%",
                  }}
                  name="annualfees"
                  onChange={(e) => setAnnualfees(e.target.value)}
                  value={annualfees}
                  error={error.annualfees}
                />
                {/* {error.annualfees && <span className="error">{error.annualfees}</span>} */}

                <RegisterTextbox
                  parentStyle={{
                    width: "40%",
                  }}
                  label="الريع السنوي"
                  type="number"
                  stylee={{
                    width: "55%",
                  }}
                  name="netprofit"
                  onChange={(e) => setNetprofit(e.target.value)}
                  value={netprofit}
                  error={error.netprofit}
                />
                {/* {error.netprofit && <span className="error">{error.netprofit}</span>} */}
                <div className="locCon"></div>
              </div>

              <div className="endowmentsRow"></div>
              <div className="endowmentsRow">
                <UploadInput
                  id="documentUpload"
                  parentStyle={{
                    marginBottom: "20px",
                    display: "unset",
                  }}
                  label="مرفقات الوقف"
                  onChange={(e) => setUpload(e.target.files[0])}
                  name="upload"
                  error={error.upload}
                />
                {/* {error.update && <span className="error">{error.update}</span>} */}
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
      <Title title="إضافة وقف جديد" icon={<FontAwesomeIcon icon={faPlus} />} />
      <Form onSubmit={handleSubmit}>
        <div className="divre">
          <div
            className="myTabs myTabs2"
            style={{ direction: "rtl", width: "100%" }}
          >
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`loantab ${activeTab === tab ? "active" : ""} loantab2`}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {/* {tab === 'one' ? '1' : tab === 'two' ? '2' : '3'} */}
                {tab === "one" ? "1" : index + 1}
              </button>
            ))}
          </div>
          <div className="line"></div>
        </div>
        <div className="tabContent">{renderContent()}</div>
      </Form>
      <div className="navigationButtons">
        {activeTab !== "three" ? (
          <button
            className=" loanbtn nextButton"
            onClick={handleNext}
            disabled={tabs.indexOf(activeTab) === tabs.length - 1}
            type="button"
          >
            التالي
          </button>
        ) : isSubmitting ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <button
            type="submit"
            className=" loanbtn saveButton"
            onClick={handleSubmit}
          >
            حفظ
          </button>
        )}
        {activeTab !== "one" && (
          <button
            className=" loanbtn backButton"
            onClick={handleBack}
            type="button"
          >
            السابق
          </button>
        )}
      </div>
    </div>
  );
}

export default Endowments;
