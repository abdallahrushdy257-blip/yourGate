import "./addDonor.css";
import Title from "../../components/title";
import RegisterTextbox from "../../components/RegisterTextBox";
import CustomButton from "../../components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import RegisterSelect from "../../components/RegisterSelect";
import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router";
import { Spinner } from "react-bootstrap";

function AddDonor() {
  const [name, setName] = useState(
    () => sessionStorage.getItem("donor_name") || "",
  );
  const [address, setAddress] = useState(
    () => sessionStorage.getItem("donor_address") || "",
  );
  const [phone, setPhone] = useState(
    () => sessionStorage.getItem("donor_phone") || "",
  );
  const [email, setEmail] = useState(
    () => sessionStorage.getItem("donor_email") || "",
  );
  const [type, setType] = useState(
    () => sessionStorage.getItem("donor_type") || "",
  );
  const [identification_number, setIdentification_number] = useState(
    () => sessionStorage.getItem("donor_identification_number") || "",
  );
  const [identification_description, setIdentification_description] = useState(
    () => sessionStorage.getItem("donor_identification_description") || "",
  );
  const [interests, setInterests] = useState([]);
  const [donorInterests, setDonorInterests] = useState(
    () => sessionStorage.getItem("donor_interests") || "",
  );

  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mForm = new FormData();
    mForm.append("name", name);
    mForm.append("address", address);
    mForm.append("phone", phone);
    mForm.append("email", email);
    mForm.append("type", type);
    mForm.append("identification_number", identification_number);
    mForm.append("identification_description", identification_description);
    mForm.append("donorInterests", donorInterests);
    try {
      const res = await API.post("/donor/store", mForm);
      const data = await res;
      if (data.status === 200) {
        sessionStorage.removeItem("donor_name");
        sessionStorage.removeItem("donor_address");
        sessionStorage.removeItem("donor_phone");
        sessionStorage.removeItem("donor_email");
        sessionStorage.removeItem("donor_type");
        sessionStorage.removeItem("donor_identification_number");
        sessionStorage.removeItem("donor_identification_description");
        sessionStorage.removeItem("donor_interests");
        navigate("/donors");
      } else {
        setError(data.data.errors);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setError(error.response.data.errors);
    }
  };

  const getInterests = async () => {
    try {
      const res = await API.get("/donorinterest/all");
      const data = await res;
      setInterests(data.data);
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    getInterests();
  }, []);

  return (
    <div style={{position:"absolute", zIndex: 9999,top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"100%",height:"100%",backgroundColor:"rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center"}}>
      <div className="addDonorContainer global-form-container" style={{width: "auto", minWidth: "700px", margin: "0"}}>
      <Title
        title="إضافة مانح"
        className="marketingtitle text-center"
        icon={<FontAwesomeIcon icon={faHandHoldingDollar} />}
      />
        <div className="donorForm">
          <div className="donorRow">
            <RegisterTextbox
              parentStyle={{ width: "30%" }}
              id="email"
              label="البريد الإلكتروني"
              type="email"
              stylee={{ width: "45%" }}
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);
                sessionStorage.setItem("donor_email", value);
              }}
              error={error.email}
            />
            <RegisterTextbox
              parentStyle={{ width: "30%" }}
              id="name"
              label="إسم المانح"
              type="text"
              stylee={{ width: "45%" }}
              value={name}
              onChange={(e) => {
                const value = e.target.value;
                setName(value);
                sessionStorage.setItem("donor_name", value);
              }}
              error={error.name}
            />
          </div>
          {/* <div className='error'>
                        { error && error.name && <span style={{marginLeft:"10%"}}>{error.name} </span>}
                        { error && error.type && <span style={{marginRight:"10%"}}>{error.type} </span>}
                        </div> */}
          <div className="donorRow">
            <RegisterTextbox
              parentStyle={{ width: "30%" }}
              id="address"
              label=" العنوان"
              type="text"
              stylee={{ width: "45%" }}
              value={address}
              onChange={(e) => {
                const value = e.target.value;
                setAddress(value);
                sessionStorage.setItem("donor_address", value);
              }}
              error={error.address}
            />
            {/* { error && error.address && <span className="error">{error.address}</span>} */}
            <RegisterTextbox
              parentStyle={{ width: "30%" }}
              id="phone"
              label="رقم الجوال"
              type="number"
              stylee={{ width: "45%" }}
              value={phone}
              onChange={(e) => {
                const value = e.target.value;
                setPhone(value);
                sessionStorage.setItem("donor_phone", value);
              }}
              error={error.phone}
            />
            {/* { error && error.phone && <span className="error">{error.phone}</span>} */}
          </div>

          <div className="donorRow">
            <RegisterTextbox
              parentStyle={{ width: "30%" }}
              id="identification_description"
              label="وصف الهوية"
              type="text"
              stylee={{ width: "45%" }}
              value={identification_description}
              onChange={(e) => {
                const value = e.target.value;
                setIdentification_description(value);
                sessionStorage.setItem(
                  "donor_identification_description",
                  value,
                );
              }}
              error={error.identification_description}
            />
            <RegisterTextbox
              parentStyle={{ width: "30%" }}
              id="identification_number"
              label="رقم الهوية"
              type="text"
              stylee={{ width: "45%" }}
              value={identification_number}
              onChange={(e) => {
                const value = e.target.value;
                setIdentification_number(value);
                sessionStorage.setItem("donor_identification_number", value);
              }}
              error={error.identification_number}
            />
            {/* { error && error.email && <span className="error">{error.email}</span>} */}
          </div>
          <div className="donorRow">
            <RegisterSelect
              id="type"
              label="صفة المانح"
              stylee={{
                width: "45% !important",
              }}
              parentStyle={{
                width: "30%",
                marginBottom: "20px",
              }}
              options={[
                { value: "", label: "إختر الصفة" },
                { value: "1", label: "أفراد" },
                { value: "2", label: " مؤسسة أهلية" },
                { value: "3", label: " مؤسسة تجارية" },
                { value: "4", label: " منصة حكومية" },
              ]}
              onChange={(e) => {
                const value = e.target.value;
                setType(value);
                sessionStorage.setItem("donor_type", value);
              }}
              value={type}
              error={error.type}
            />
            <RegisterSelect
              id="interst"
              label=" نوع الاهتمام"
              stylee={{
                width: "45% !important",
              }}
              parentStyle={{
                width: "30%",
                marginBottom: "20px",
              }}
              options={[
                { value: "", label: "إختر نوع الاهتمام" },
                ...interests.map((interest) => ({
                  value: interest.id,
                  label: interest.name,
                })),
              ]}
              onChange={(e) => {
                const value = e.target.value;
                setDonorInterests(value);
                sessionStorage.setItem("donor_interests", value);
              }}
              value={donorInterests}
              error={error.donorInterests}
            />
          </div>

          {isSubmitting ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <CustomButton
              text="حفظ"
              onClick={handleSubmit}
              className="addClientBtn add-donor"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AddDonor;
