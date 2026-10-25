import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./ForgotPassword.css";
import { faUnlock } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import CustomButton from "../../components/CustomButton";
import { useState } from "react";

function SetnewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length <= 8) {
      setPasswordError("كلمة السر يجب أن تكون أكثر من 8 أحرف");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("كلمة السر وتأكيد كلمة السر يجب أن تكون متطابقة");
      return;
    }

    setPasswordError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <>
      <div className="forgotpassword">
        <Title
          title="ادخال كلمة السر الجديدة"
          icon={<FontAwesomeIcon icon={faUnlock} />}
        />

        <Form className="forgotpassword-form" onSubmit={handleSubmit}>
          <RegisterTextbox
            id="password"
            value={password}
            label="كلمة السر الجديدة"
            type="password"
            parentStyle={{
              width: "45%",
            }}
            stylee={{
              width: "30%",
            }}
            onChange={handlePasswordChange}
          />
          <RegisterTextbox
            id="confirmPassword"
            value={confirmPassword}
            label="تأكيد كلمة السر"
            type="password"
            parentStyle={{
              width: "45%",
            }}
            stylee={{
              width: "30%",
            }}
            onChange={handleConfirmPasswordChange}
          />

          {passwordError && (
            <div
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            >
              {passwordError}
            </div>
          )}

          <CustomButton text="حفظ" />
        </Form>
      </div>
    </>
  );
}

export default SetnewPassword;
