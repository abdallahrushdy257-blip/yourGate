import { Container, Form, Button, Spinner } from "react-bootstrap";
import Logo from "../../logo-dark.svg";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { useState, useContext } from "react";
import API from "../../api/axiosConfig";
import { AppContext } from "../../context/AuthContext";

function Login(props) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleLogin = async (e, password, setPasswordError) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (password.length <= 7) {
      setPasswordError("كلمة المرور يجب أن تكون أكثر من 7 أحرف");
      return;
    }

    try {
      const res = await API.post("/login", {
        email: email,
        password: password,
      });
      console.log(res)
      if (res.data.errors) {
        setError(res.data.errors);
        setIsSubmitting(false);
        return;
      }
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      if (res.data.user) {
        if (
          res.data.user.organization_id == 0 &&
          res.data.user.email_verified === 1 &&
          res.data.user.is_admin  === false
        ) {

          navigate(`/complete`);
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
      if (error.response?.data?.errors) {
        setError(error.response.data.errors);
      } else {
        setError({ general: ["حدث خطأ في الاتصال بالخادم"] });
      }
    }
  };



  return (
    <>
      <Container>
        {/* <RegisterNavbar /> */}
        <div className="login-container">
          <div className="login-section1">
            <div className="login-title">
              <h2>تسجيل الدخول</h2>
            </div>
            <div className="login-imageCont">
              <img src={Logo} alt="Login" className="login-image" />
            </div>
          </div>
          <div className="login-section2">
            <Form
              className="login-form"
              onSubmit={(e) => handleLogin(e, password, setPasswordError)}
            >
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  className="login-input"
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              {error.email && (
                <div
                  style={{ color: "red", fontSize: "12px", marginTop: "5px" }}
                >
                  {error.email[0]}
                </div>
              )}
              {error.verify && (
                <div
                  style={{ color: "red", fontSize: "12px", marginTop: "5px" }}
                >
                  {error.verify[0]}
                </div>
              )}

              {error.confirm && (
                <div
                  style={{ color: "red", fontSize: "12px", marginTop: "5px" }}
                >
                  {error.confirm[0]}
                </div>
              )}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  className="login-input"
                  type="password"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && (
                  <div
                    style={{ color: "red", fontSize: "12px", marginTop: "5px" }}
                  >
                    {passwordError}
                  </div>
                )}
                {error.password && (
                  <div
                    style={{ color: "red", fontSize: "12px", marginTop: "5px" }}
                  >
                    {error.password[0]}
                  </div>
                )}
                <Link className="forget-pass">نسيت كلمة المرور ؟</Link>
              </Form.Group>

              {/* Submit button */}
              <Button type="submit" className="login-sub" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    جاري الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </Form>
            <div className="login-sub">
              <Link
                to="/charityregistration"
                className="new-acc"
                id="new-acc"
                style={{
                  pointerEvents: isSubmitting ? "none" : "auto",
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Login;
