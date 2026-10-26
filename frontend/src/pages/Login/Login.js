import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faArrowRight,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import logoLight from "../../logo-light.svg";
import logoDark from "../../logo-dark.svg";
import { ThemeContext } from "../../context/theme-context";
import { AppContext } from "../../context/AuthContext";
import API from "../../api/axiosConfig";
import "./login.css";

function Login(props) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { theme } = useContext(ThemeContext);
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const Logo = theme === "light" ? logoLight : logoDark;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError({});
    setPasswordError("");

    if (password.length <= 7) {
      setPasswordError("كلمة المرور يجب أن تكون أكثر من 7 أحرف");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await API.post("/login", {
        email: email,
        password: password,
      });

      if (res.data.errors) {
        setError(res.data.errors);
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

      if (res.data.user) {
        if (
          res.data.user.organization_id === 0 &&
          res.data.user.email_verified === 1 &&
          res.data.user.is_admin === false
        ) {
          navigate("/complete");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      setIsSubmitting(false);
      if (err.response?.data?.errors) {
        setError(err.response.data.errors);
      } else {
        setError({ general: ["حدث خطأ في الاتصال بالخادم، يُرجى المحاولة لاحقاً"] });
      }
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Return to Landing Page */}
      <Link to="/" className="auth-back-home" title="الرجوع للرئيسية">
        <FontAwesomeIcon icon={faArrowRight} />
        <span>الرئيسية</span>
      </Link>

      <div className="auth-card">
        {/* Header with Branded Logo */}
        <div className="auth-header">
          <div className="auth-logo-badge" onClick={() => navigate("/")}>
            <img src={Logo} alt="بوابتك" className="auth-logo-img" />
          </div>
          <h1 className="auth-title">تسجيل الدخول</h1>
          <p className="auth-subtitle">
            أهلاً بك مجدداً، أدخل بياناتك للمتابعة إلى حسابك في بوابتك
          </p>
        </div>

        {/* General Error Banner */}
        {error.general && (
          <div className="auth-banner-error">
            <FontAwesomeIcon icon={faCircleExclamation} style={{ marginLeft: "6px" }} />
            {error.general[0]}
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="auth-field-group">
            <label className="auth-label" htmlFor="email-input">
              البريد الإلكتروني
            </label>
            <div className="auth-input-wrapper">
              <FontAwesomeIcon icon={faEnvelope} className="auth-input-icon" />
              <input
                id="email-input"
                className="auth-input"
                type="email"
                placeholder="example@yourgate.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            {error.email && (
              <span className="auth-error-msg">
                <FontAwesomeIcon icon={faCircleExclamation} />
                {error.email[0]}
              </span>
            )}
            {error.verify && (
              <span className="auth-error-msg">
                <FontAwesomeIcon icon={faCircleExclamation} />
                {error.verify[0]}
              </span>
            )}
            {error.confirm && (
              <span className="auth-error-msg">
                <FontAwesomeIcon icon={faCircleExclamation} />
                {error.confirm[0]}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="auth-field-group">
            <div className="auth-label-row">
              <label className="auth-label" htmlFor="password-input">
                كلمة المرور
              </label>
              <Link to="/forgot-password" className="auth-forgot-link">
                نسيت كلمة المرور؟
              </Link>
            </div>
            <div className="auth-input-wrapper">
              <FontAwesomeIcon icon={faLock} className="auth-input-icon" />
              <input
                id="password-input"
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {passwordError && (
              <span className="auth-error-msg">
                <FontAwesomeIcon icon={faCircleExclamation} />
                {passwordError}
              </span>
            )}
            {error.password && (
              <span className="auth-error-msg">
                <FontAwesomeIcon icon={faCircleExclamation} />
                {error.password[0]}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        {/* Footer Link to Registration */}
        <div className="auth-footer">
          <span>ليس لديك حساب جمعية؟</span>
          <Link to="/charityregistration" className="auth-switch-link">
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
