import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import Logo from "../../logo-dark.svg";
import "./charityRegistration.css";
import { useState } from "react";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router";
// import FlagSu from "../../saudi-arabia.png";

function CharityRegistration(props) {
  const [representativeName, setRepresentativeName] = useState("");
  const [representativeEmail, setRepresentativeEmail] = useState("");
  const [representativePhone, setRepresentativePhone] = useState("");
  const [representativeAddress, setRepresentativeAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (/[A-Z]/.test(representativeEmail)) {
      setEmailError("البريد الإلكتروني يجب أن يكون بدون أحرف كبيرة");
      setFormError("يرجى تصحيح الأخطاء قبل إرسال النموذج");
      setIsSubmitting(false);
      return;
    } else {
      setEmailError("");
    }

    const phoneNumberLength = representativePhone.replace(/[^0-9]/g, "").length;
    if (phoneNumberLength !== 10) {
      setPhoneError("رقم الجوال يجب أن يتكون من 10 أرقام فقط");
      setFormError("يرجى تصحيح الأخطاء قبل إرسال النموذج");
      setIsSubmitting(false);
      return;
    }

    if (password.length <= 8) {
      setPasswordError("كلمة السر يجب أن تكون أكثر من 8 أحرف");
      setFormError("يرجى تصحيح الأخطاء قبل إرسال النموذج");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("كلمة السر وتأكيد كلمة السر يجب أن تكون متطابقة");
      setFormError("يرجى تصحيح الأخطاء قبل إرسال النموذج");
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await API.post("/register", {
        name: representativeName,
        email: representativeEmail,
        phone: representativePhone,
        address: representativeAddress,
        password: password,
        password_confirmation: confirmPassword
      });
      if (response.data.errors) {
        setError(response.data.errors);
        setIsSubmitting(false);
        return;
      } else {
        setSuccessMessage("تم ارسال رسالة الي بريدك الالكتروني");
        setPhoneError("");
        setPasswordError("");
        setEmailError("");
        setFormError("");
        setRepresentativeName("");
        setRepresentativeEmail("");
        setRepresentativePhone("");
        setRepresentativeAddress("");
        setPassword("");
        setConfirmPassword("");
        navigate("/login");
      }
    } catch (error) {
      console.clear();
      console.log(error);
      setIsSubmitting(false);
      if (error.response?.data?.errors) {
        setError(error.response.data.errors);
      } else {
        setError({ general: ["حدث خطأ في الاتصال بالخادم"] });
      }
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setRepresentativePhone(value);

    if (value.replace(/[^0-9]/g, "").length > 10) {
      setPhoneError("رقم الجوال يجب أن يتكون من 10 أرقام فقط");
    } else {
      setPhoneError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setRepresentativeEmail(e.target.value);
  };

  return (
    <Container>
      <div className="register-form-conatiner">
        <h1 className="register-title">
          إنشاء حساب جديد{" "}
          <FontAwesomeIcon className="register-icon" icon={faPenToSquare} />
        </h1>
        <div className="login-imageCont">
          <img src={Logo} alt="Login" className="regester-image" />
        </div>

        {successMessage && (
          <div
            style={{
              color: "#010101",
              fontSize: "16px",
              textAlign: "center",
              background: "#83f2ff",
              width: "45%",
              margin: "auto",
              padding: "2px",
              borderRadius: "10px",
              fontWeight: "600",
            }}
          >
            {successMessage}
          </div>
        )}

        <Form onSubmit={handleSubmit} className="register-form">
          <RegisterTextbox
            id="representativeName"
            label="اسم ممثل الجمعية"
            value={representativeName}
            onChange={(e) => setRepresentativeName(e.target.value)}
            type="text"
          />
          {error.name && (
            <div style={{ color: "red", fontSize: "12px" }}>{error.name}</div>
          )}
          <RegisterTextbox
            id="representativeEmail"
            label="البريد الالكتروني لممثل الجمعية"
            value={representativeEmail}
            onChange={handleEmailChange}
            type="email"
          />
          {emailError && (
            <div style={{ color: "red", fontSize: "12px" }}>{emailError}</div>
          )}
          {error.email && (
            <div style={{ color: "red", fontSize: "12px" }}>{error.email}</div>
          )}
          <div style={{ direction: "ltr" }}>
            <RegisterTextbox
              id="representativePhone"
              label="رقم جوال ممثل الجمعية"
              value={representativePhone}
              onChange={handlePhoneChange}
              type="number"
              prefix="+966"
              // flag={FlagSu}
              align="left"
            />
          </div>

          {phoneError && (
            <div style={{ color: "red", fontSize: "12px" }}>{phoneError}</div>
          )}
          {error.phone && (
            <div style={{ color: "red", fontSize: "12px" }}>{error.phone}</div>
          )}
          <RegisterTextbox
            id="representativeAddress"
            label="عنوان ممثل الجمعية"
            value={representativeAddress}
            onChange={(e) => setRepresentativeAddress(e.target.value)}
            type="text"
          />
          {error.address && (
            <div style={{ color: "red", fontSize: "12px" }}>{error.address}</div>
          )}
          <RegisterTextbox
            id="password"
            label="كلمة السر"
            value={password}
            onChange={handlePasswordChange}
            type="password"
          />
          {error.password && (
            <div style={{ color: "red", fontSize: "12px" }}>{error.password}</div>
          )}
          <RegisterTextbox
            id="confirmPassword"
            label="تأكيد كلمة السر"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            type="password"
          />

          {passwordError && (
            <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
              {passwordError}
            </div>
          )}

          {
            isSubmitting ?
              <Spinner animation="border" variant="primary" style={{ display: "block", margin: "auto" }} /> :
              <Button className="register-button" variant="primary" type="submit">
                إرسال طلب التسجيل
              </Button>
          }
        </Form>
      </div>
    </Container>
  );
}

export default CharityRegistration;
