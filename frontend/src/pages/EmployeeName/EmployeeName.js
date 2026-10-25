import "./employeeName.css";
import Title from "../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
import { Form } from "react-bootstrap";

function EmployeeName() {
    const handleSubmit = (e) => {
        e.preventDefault()
    }
  return (
    <>
      <div className="employeeName-container">
        <Title
          title="اسم الموظف"
          className="marketingtitle"
          icon={<FontAwesomeIcon icon={faUser} />}
        />
        <Form onSubmit={handleSubmit} className="employeeName-form">
          <div className="employeeName-inputs">
            <div className="emp-times">
            <RegisterTextbox
              parentStyle={{
                width: "20%",
              }}
              id="arrivalTime"
              label="وقت الحضور"
              type="text"
              stylee={{
                width: "55%",
              }}
            />
            <RegisterTextbox
              parentStyle={{
                width: "20%",
              }}
              id="leaveTime"
              label="وقت الإنصراف"
              type="text"
              stylee={{
                width: "55%",
              }}
            />
            </div>
            
            <RegisterTextbox
              parentStyle={{
                width: "55%",
              }}
              id="dayNotes"
              label="ملاحظات اليوم"
              type="text"
              stylee={{
                width: "55%",
              }}
            />

            <button type="submit" className="vaca-submit">حفظ</button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default EmployeeName;
