import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./ForgotPassword.css";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import CustomButton from "../../components/CustomButton";
import { useState } from "react";

function ForgotPassword() {
  const [successMessage, setSuccessMessage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("تم ارسال رسالة الي بريدك الالكتروني");
  };

  return (
    <>
      <div className="forgotpassword">
        <Title
          title="إرسال رمز تأكيد"
          icon={<FontAwesomeIcon icon={faLock} />}
        />

        <Form className="forgotpassword-form" onSubmit={handleSubmit}>
          <RegisterTextbox
            id="email"
            label="البريد الإلكتروني"
            type="email"
            parentStyle={{
              width: "45%",
            }}
            stylee={{
              width: "30%",
            }}
          />
          {successMessage && (
            <p className="forgetsuccess" >{successMessage} </p>
          )}
          <CustomButton text="ارسال رمز التأكيد" />
        </Form>
      </div>
    </>
  );
}

export default ForgotPassword;
