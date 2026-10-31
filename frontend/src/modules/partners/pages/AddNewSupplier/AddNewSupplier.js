import "../AddNewClient/addnewclient.css";
import { useState } from "react";
import Title from "../../../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import CustomButton from "../../../../components/CustomButton";
import { Form } from "react-bootstrap";

function AddNewSupplier() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);

    if (value.replace(/[^0-9]/g, "").length > 10) {
      setPhoneError("رقم الجوال يجب أن يتكون من 10 أرقام فقط");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="addnewclientContaner">
      <Title
        title="إضافة مورد جديد"
        icon={<FontAwesomeIcon icon={faUserPlus} />}
      />
      <Form className="addnewclientContanerForm addsubli ">
        <div className="addClientsInputs">
          <RegisterTextbox
            parentStyle={{ width: "40%" }}
            id="clientName"
            label="إسم المورد"
            type="text"
            stylee={{ width: "30%" }}
          />
          <RegisterTextbox
            parentStyle={{ width: "40%" }}
            id="clientName"
            label="كود المورد"
            type="number"
            stylee={{ width: "30%" }}
          />
        </div>
        <div className="addClientsInputs">
          <RegisterTextbox
            parentStyle={{ width: "40%" }}
            id="clientEmail"
            label="البريد الإلكتروني للمورد"
            type="email"
            stylee={{ width: "30%" }}
          />
          <RegisterTextbox
            parentStyle={{ width: "40%" }}
            id="phoneNum"
            label="رقم الجوال"
            type="number"
            value={phoneNumber}
            onChange={handlePhoneChange}
            stylee={{ width: "30%" }}
          />
          {phoneError && (
            <div style={{ color: "red", fontSize: "12px" }}>{phoneError}</div>
          )}
        </div>
        <div className="addClientsInputs">
          <RegisterTextbox
            parentStyle={{ width: "40%" }}
            id="openBud"
            label="الرصيد الإفتتاحي"
            type="number"
            stylee={{ width: "30%" }}
          />
          <RegisterTextbox
            parentStyle={{ width: "40%" }}
            id="phoneNum"
            label="الوصف"
            type="text"
            stylee={{ width: "30%" }}
          />
        </div>

        <div className="addClientsInputs">
          <RegisterTextbox
            parentStyle={{ width: "40%" }}
            id="accountNum"
            label="رقم الحساب"
            type="number"
            stylee={{ width: "30%" }}
          />
          <RegisterTextbox
            parentStyle={{ width: "40%" }}
            id="accountNum"
            label="بيانات اخري"
            type="text"
            stylee={{ width: "30%" }}
          />
        </div>
        <CustomButton
          text="حفظ"
          onClick={handleSubmit}
          className="addClientBtn"
        />
      </Form>
    </div>
  );
}

export default AddNewSupplier;
