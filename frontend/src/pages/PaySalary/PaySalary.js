import { Form } from "react-bootstrap";
import "./PaySalary.css";
import Title from "../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
// import RegisterSelect from "../../components/RegisterSelect";
import CustomButton from "../../components/CustomButton";
import { useNavigate } from "react-router";

function PaySalary() {
    const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/paymentvoucher')
  };
  return (
    <>
      {/* <div className="paysalary"> */}
        <Form onSubmit={handleSubmit} className="paysalary">
          <div className="addempTitle">
            <Title
              title="عرض راتب الموظف"
              className="marketingtitle"
              icon={<FontAwesomeIcon icon={faMoneyBill} />}
            />{" "}
            </div>
            <div className="addnewemployee-form1">
              <div className="addnewemployee-sec1">
                <RegisterTextbox
                  parentStyle={{ width: "80%" }}
                  id="mainBudget"
                  label="الراتب الأساسي"
                  type="number"
                  stylee={{ width: "55%" }}
                  disabled={true}
                />{" "}
                <RegisterTextbox
                  parentStyle={{ width: "80%" }}
                  id="incentives"
                  label="الحوافز"
                  type="number"
                  stylee={{ width: "55%" }}
                  placeholder="ادخل الحوافز"
                />{" "}
                <RegisterTextbox
                  parentStyle={{ width: "80%" }}
                  id="healthInsurance"
                  label="التأمين الصحي"
                  type="number"
                  stylee={{ width: "55%" }}
                  disabled={true}
                />{" "}
                <RegisterTextbox
                  parentStyle={{ width: "80%" }}
                  id="housingallowance"
                  label="بدل سكن"
                  type="number"
                  stylee={{ width: "55%" }}
                  disabled={true}
                />{" "}
                <RegisterTextbox
                  parentStyle={{ width: "80%" }}
                  id="otherallowances"
                  label="بدلات اخري"
                  type="number"
                  stylee={{ width: "55%" }}
                  placeholder="ادخل بدلات اخري"
                />{" "}
              </div>
              <div className="addnewemployee-sec1">
                <RegisterTextbox
                  parentStyle={{ width: "80%" }}
                  id="extraSalary"
                  label="الراتب الإضافي"
                  type="number"
                  stylee={{ width: "55%" }}
                  placeholder="ادخل الراتب الإضافي"
                />{" "}
                <RegisterTextbox
                  parentStyle={{ width: "80%" }}
                  id="socialWelfare"
                  label="التأمين الاجتماعي"
                  type="number"
                  stylee={{ width: "55%" }}
                  disabled={true}
                />{" "}
                <div className="taxContainerpay">
                  {/* <RegisterSelect
                    id="incomeTaxType"
                    label="نوع ضريبة الدخل"
                    stylee={{ width: "55%" }}
                    parentStyle={{ width: "35%" }}
                    options={[
                      { value: "value", label: "قيمة ثابتة" },
                      { value: "percentage", label: "نسبة مئوية" },
                    ]}
                    disabled={true}
                  /> */}
                  <RegisterTextbox
                    parentStyle={{ width: "45%" }}
                    id="incomeTax"
                    label="نسبة ضريبة الدخل"
                    type="number"
                    v
                    stylee={{ width: "55%" }}
                    disabled={true}
                  />

                  <RegisterTextbox
                    parentStyle={{ width: "45%" }}
                    id="incomeTax"
                    label="قيمة ضريبة الدخل"
                    type="number"
                    stylee={{ width: "55%" }}
                    disabled={true}
                  />
                </div>
                <RegisterTextbox
                  parentStyle={{ width: "80%" }}
                  id="transportationallowance"
                  label="بدل مواصلات"
                  type="number"
                  stylee={{ width: "55%" }}
                  placeholder="ادخل بدل مواصلات"
                />{" "}
                <RegisterTextbox
                  parentStyle={{ width: "80%" }}
                  id="withdrawals"
                  label="مسحوبات"
                  type="number"
                  placeholder="ادخل المسحوبات"
                  disabled={true}
                  stylee={{ width: "55%" }}
                />{" "}
              </div>
            </div>
            <div className="addnewemployee-sec3">
              <RegisterTextbox
                parentStyle={{ width: "15%" }}
                id="totalBudget"
                label="الإجمالي"
                type="number"
                disabled={true}
                stylee={{ width: "55%" }}
              />{" "}
            </div>
          <div className="pay-btnCon">
            <CustomButton text="التالي" />
          </div>
        </Form>
      {/* </div> */}
    </>
  );
}

export default PaySalary;
