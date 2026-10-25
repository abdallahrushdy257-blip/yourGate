import Title from "../../components/title";
import RegisterTextbox from "../../components/RegisterTextBox";
import "./statementOfAccount.css";
import CustomButton from "../../components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import RegisterRadio from "../../components/Radio";
import { useState } from "react";
import { Form } from "react-bootstrap";

function StatementOfAccount() {
  const [AccountType, setAccountType] = useState("عميل");

  const handleAccountTypeChange = (e) => {
    setAccountType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="statementofaccount">
        <Title title="كشف الحساب" className="marketingtitle" icon={<FontAwesomeIcon icon={faFileInvoice} />} />
        <Form className="statementofaccountForm" onSubmit={handleSubmit}>
          <div className="radioContainer radioContainer3">
            <h5>نوع الحساب</h5>
            <div className="clientRadios clientRadios3">
              <RegisterRadio
                label="عميل"
                value="عميل"
              checked={AccountType === "عميل"}
              onChange={handleAccountTypeChange}
              />
              <RegisterRadio
                label="مورد"
                value="مورد"
              checked={AccountType === "عميل"}
              onChange={handleAccountTypeChange}
              />
            </div>
          </div>
          <RegisterTextbox
            parentStyle={{ width: "45%" }}
            id="clientName"
            label={AccountType === "عميل" ? "إسم العميل" : "إسم المورد"}
            type="text"
            stylee={{ width: "45%" }}
          />
          <RegisterTextbox
            parentStyle={{ width: "45%" }}
            id="clientName"
            label={AccountType === "عميل" ? "كود العميل" : "كود المورد"}
            type="number"
            stylee={{ width: "45%" }}
          />
          <RegisterTextbox
            parentStyle={{ width: "45%" }}
            id="clientName"
            label="الرصيد الحالي"
            type="number"
            stylee={{ width: "45%" }}
          />

          <CustomButton
            text="حفظ"
            onClick={handleSubmit}
            className="addClientBtn"
          />
        </Form>
      </div>
    </>
  );
}

export default StatementOfAccount;
