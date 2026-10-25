import "./monthlySalary.css";
import Title from "../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import CustomButton from "../../components/CustomButton";

function MonthlySalary() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/paymentvoucher")
  };

  return (
    <>
      <div className="monthlysalary-con">
        <Title
          title="الراتب الشهري"
          icon={<FontAwesomeIcon icon={faSackDollar} />}
          style={{ width: "unset" }}
        />
        <Form onSubmit={handleSubmit}>
          {" "}
          <div className="monthlysalary-inputsCon">
            <div className="monthlysalary-inputs">
              <RegisterTextbox
                parentStyle={{ width: "60%" }}
                id="vacDescription"
                label="رقم الموظف"
                type="number"
                stylee={{ width: "45%" }}
                disabled={true}
              />
              <RegisterTextbox
                parentStyle={{ width: "60%" }}
                id="vacDescription"
                label="القسم"
                type="text"
                stylee={{ width: "45%" }}
              />
              <RegisterTextbox
                parentStyle={{ width: "60%" }}
                id="vacDescription"
                label="الخصومات"
                type="number"
                stylee={{ width: "45%" }}
              />
              <RegisterTextbox
                parentStyle={{ width: "60%" }}
                id="vacDescription"
                label="عدد ايام الغياب"
                type="number"
                stylee={{ width: "45%" }}
              />
            </div>
            <div className="monthlysalary-inputs">
              <RegisterTextbox
                parentStyle={{ width: "60%" }}
                id="vacDescription"
                label="إسم الموظف"
                type="text"
                stylee={{ width: "45%" }}
              />
              <RegisterTextbox
                parentStyle={{ width: "60%" }}
                id="vacDescription"
                label="المبلغ الكلي"
                type="number"
                stylee={{ width: "45%" }}
                disabled={true}
              />
              <RegisterTextbox
                parentStyle={{ width: "60%" }}
                id="vacDescription"
                label="المبلغ المصروف"
                type="number"
                stylee={{ width: "45%" }}
              />
              <RegisterTextbox
                parentStyle={{ width: "60%" }}
                id="vacDescription"
                label="تاريخ صرف الراتب"
                type="date"
                stylee={{ width: "45%" }}
              />
            </div>
          </div>
          <CustomButton text="حفظ" />

        </Form>
      </div>
    </>
  );
}

export default MonthlySalary;
