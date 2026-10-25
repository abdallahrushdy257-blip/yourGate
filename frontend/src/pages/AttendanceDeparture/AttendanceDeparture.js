import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./attendanceDeparture.css";
import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterTextbox from "../../components/RegisterTextBox";
import CustomButton from "../../components/CustomButton";
import { Form } from "react-bootstrap";

function AttendanceDeparture() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="attendanceDeparture">
        <Title
          title="الحضور والانصراف"
          icon={<FontAwesomeIcon icon={faPersonWalkingArrowRight} />}
        />
        <Form className="attendanceDeparture-form" onSubmit={handleSubmit}>
          <RegisterSelect
            id="name"
            label="إسم الموظف"
            stylee={{
              width: "45% !important",
            }}
            parentStyle={{
              width: "455px",
              marginBottom: "20px",
            }}
            options={[
              { value: "", label: "إسم الموظف" },
              { value: "محمد", label: "محمد" },
            ]}
          />

          <RegisterTextbox
            parentStyle={{
              width: "455px",
            }}
            id="come"
            label="وقت الحضور"
            type="time"
            stylee={{
              width: "45%",
            }}
          />
          <RegisterTextbox
            parentStyle={{
              width: "455px",
            }}
            id="leave"
            label="وقت الإنصراف"
            type="time"
            stylee={{
              width: "45%",
            }}
          />

          <RegisterTextbox
            parentStyle={{
              width: "455px",
            }}
            id="notes"
            label="ملاحظات اليوم"
            type="text"
            stylee={{
              width: "45%",
            }}
          />
          <CustomButton text="حفظ" />
        </Form>
      </div>
    </>
  );
}

export default AttendanceDeparture;
