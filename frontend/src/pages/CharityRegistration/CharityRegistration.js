import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faLocationDot,
  faLock,
  faEye,
  faEyeSlash,
  faArrowRight,
  faCircleExclamation,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import logoLight from "../../logo-light.svg";
import logoDark from "../../logo-dark.svg";
import { ThemeContext } from "../../context/theme-context";
import API from "../../api/axiosConfig";
import "./charityRegistration.css";
import "../Login/login.css";

function CharityRegistration(props) {
  const [representativeName, setRepresentativeName] = useState("");
  const [representativeEmail, setRepresentativeEmail] = useState("");
  const [representativePhone, setRepresentativePhone] = useState("");
  const [representativeAddress, setRepresentativeAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const Logo = theme === "light" ? logoLight : logoDark;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPhoneError("");
    setPasswordError("");
    setEmailError("");
    setFormError("");
    setError({});

    if (/[A-Z]/.test(representativeEmail)) {
      setEmailError("البريد الإلكتروني يجب أن يكون بدون أحرف كبيرة");
      setFormError("يرجى تصحيح الأخطاء قبل إرسال النموذج");
      return;
    }

    const phoneNumberLength = representativePhone.replace(/[^0-9]/g, "").length;
    if (phoneNumberLength !== 10) {
      setPhoneError("رقم الجوال يجب أن يتكون من 10 أرقام فقط");
      setFormError("يرجى تصحيح الأخطاء قبل إرسال النموذج");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("كلمة السر وتأكيد كلمة السر يجب أن تكونا متطابقتين");
      setFormError("يرجى تصحيح الأخطاء قبل إرسال النموذج");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await API.post("/register", {
        name: representativeName,
        email: representativeEmail,
        phone: representativePhone,
        address: representativeAddress,
        password: password,
        password_confirmation: confirmPassword,
      });

      if (response.data.errors) {
        setError(response.data.errors);
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("تم إرسال رسالة تفعيل إلى بريدك الإلكتروني بنجاح");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
      if (err.response?.data?.errors) {
        setError(err.response.data.errors);
      } else {
        setError({ general: ["حدث خطأ في الاتصال بالخادم، يُرجى المحاولة لاحقاً"] });
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

  return (
    <div className="register-page-wrapper">
      {/* Return to Landing Page */}
      <Link to="/" className="auth-back-home" title="الرجوع للرئيسية">
        <FontAwesomeIcon icon={faArrowRight} />
        <span>الرئيسية</span>
      </Link>

      <div className="register-card">
        {/* Header with Branded Logo */}
        <div className="register-header">
          <div className="register-logo-badge" onClick={() => navigate("/")}>
            <img src={Logo} alt="بوابتك" className="register-logo-img" />
          </div>
          <h1 className="register-title">إنشاء حساب جمعية جديد</h1>
          <p className="register-subtitle">
            سجّل جمعيتك الآن وانضم إلى منظومة بوابتك الذكية لإدارة الجمعيات
          </p>
        </div>

        {/* Success Message Banner */}
        {successMessage && (
          <div className="register-success-banner">
            <FontAwesomeIcon icon={faCheckCircle} style={{ marginLeft: "8px" }} />
            {successMessage}
          </div>
        )}

        {/* Form Error Banner */}
        {(formError || error.general) && (
          <div className="auth-banner-error">
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginLeft: "6px" }} />
            {formError || error.general[0]}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="register-grid">
            {/* 1. Representative Name */}
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="rep-name">
                اسم ممثل الجمعية <span style={{ color: "#ff5252" }}>*</span>
              </label>
              <div className="auth-input-wrapper">
                <FontAwesomeIcon icon={faUser} className="auth-input-icon" />
                <input
                  id="rep-name"
                  className="auth-input"
                  type="text"
                  placeholder="الاسم الثلاثي"
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                  required
                />
              </div>
              {error.name && (
                <span className="auth-error-msg">
                  <FontAwesomeIcon icon={faCircleExclamation} />
                  {error.name[0]}
                </span>
              )}
            </div>

            {/* 2. Representative Email */}
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="rep-email">
                البريد الإلكتروني <span style={{ color: "#ff5252" }}>*</span>
              </label>
              <div className="auth-input-wrapper">
                <FontAwesomeIcon icon={faEnvelope} className="auth-input-icon" />
                <input
                  id="rep-email"
                  className="auth-input"
                  type="email"
                  placeholder="charity@example.org"
                  value={representativeEmail}
                  onChange={(e) => setRepresentativeEmail(e.target.value)}
                  required
                />
              </div>
              {emailError && (
                <span className="auth-error-msg">
                  <FontAwesomeIcon icon={faCircleExclamation} />
                  {emailError}
                </span>
              )}
              {error.email && (
                <span className="auth-error-msg">
                  <FontAwesomeIcon icon={faCircleExclamation} />
                  {error.email[0]}
                </span>
              )}
            </div>

            {/* 3. Representative Phone */}
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="rep-phone">
                رقم جوال ممثل الجمعية <span style={{ color: "#ff5252" }}>*</span>
              </label>
              <div className="auth-input-wrapper">
                <FontAwesomeIcon icon={faPhone} className="auth-input-icon" />
                <input
                  id="rep-phone"
                  className="auth-input"
                  type="tel"
                  placeholder="05XXXXXXXX"
                  value={representativePhone}
                  onChange={handlePhoneChange}
                  style={{ paddingLeft: "55px" }}
                  required
                />
                <span className="register-phone-prefix">+966</span>
              </div>
              {phoneError && (
                <span className="auth-error-msg">
                  <FontAwesomeIcon icon={faCircleExclamation} />
                  {phoneError}
                </span>
              )}
              {error.phone && (
                <span className="auth-error-msg">
                  <FontAwesomeIcon icon={faCircleExclamation} />
                  {error.phone[0]}
                </span>
              )}
            </div>

            {/* 4. Representative Address */}
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="rep-address">
                عنوان ممثل الجمعية <span style={{ color: "#ff5252" }}>*</span>
              </label>
              <div className="auth-input-wrapper">
                <FontAwesomeIcon icon={faLocationDot} className="auth-input-icon" />
                <input
                  id="rep-address"
                  className="auth-input"
                  type="text"
                  placeholder="المدينة، الحي"
                  value={representativeAddress}
                  onChange={(e) => setRepresentativeAddress(e.target.value)}
                  required
                />
              </div>
              {error.address && (
                <span className="auth-error-msg">
                  <FontAwesomeIcon icon={faCircleExclamation} />
                  {error.address[0]}
                </span>
              )}
            </div>

            {/* 5. Password */}
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="reg-password">
                كلمة السر <span style={{ color: "#ff5252" }}>*</span>
              </label>
              <div className="auth-input-wrapper">
                <FontAwesomeIcon icon={faLock} className="auth-input-icon" />
                <input
                  id="reg-password"
                  className="auth-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="8 أحرف على الأقل"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {error.password && (
                <span className="auth-error-msg">
                  <FontAwesomeIcon icon={faCircleExclamation} />
                  {error.password[0]}
                </span>
              )}
            </div>

            {/* 6. Confirm Password */}
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="confirm-password">
                تأكيد كلمة السر <span style={{ color: "#ff5252" }}>*</span>
              </label>
              <div className="auth-input-wrapper">
                <FontAwesomeIcon icon={faLock} className="auth-input-icon" />
                <input
                  id="confirm-password"
                  className="auth-input"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="أعد إدخال كلمة السر"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {passwordError && (
                <span className="auth-error-msg">
                  <FontAwesomeIcon icon={faCircleExclamation} />
                  {passwordError}
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
            style={{ marginTop: "12px" }}
          >
            {isSubmitting ? "جاري إرسال الطلب..." : "إرسال طلب التسجيل"}
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="auth-footer">
          <span>لديك حساب جمعية بالفعل؟</span>
          <Link to="/login" className="auth-switch-link">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CharityRegistration;
