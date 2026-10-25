import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./showJobPerformanceEvaluation.css";
import { faKipSign } from "@fortawesome/free-solid-svg-icons";
import Title from "../../components/title";
import RegisterTextbox from "../../components/RegisterTextBox";
import { Form } from "react-bootstrap";
import RegisterTextarea from "../../components/RegisterTextarea";
import { useNavigate } from "react-router";

function ShowJobPerformanceEvaluation() {
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/showperformance')
  };

  return (
    <>
      <div className="showJobPerformanceEvaluation">
        <Title
          title="عرض تقيم الاداء الوظيفي"
          icon={<FontAwesomeIcon icon={faKipSign} />}
          style={{ width: "unset" }}
        />
        <Form
          className="showJobPerformanceEvaluation-inputsCon"
          onSubmit={handleSubmit}
        >
          <div className="showJobPerformanceEvaluation-inputs">
            <RegisterTextbox
              parentStyle={{
                width: "30%",
              }}
              id="formdata"
              label="تاريخ النموذج"
              type="date"
              stylee={{
                width: "50%",
              }}
              disabled={true}
            />
            <RegisterTextbox
              parentStyle={{
                width: "30%",
              }}
              id="kpinum"
              label="رقم المرجع"
              type="number"
              stylee={{
                width: "50%",
              }}
              disabled={true}
            />
            <RegisterTextbox
              parentStyle={{
                width: "30%",
              }}
              id="evaluationtime"
              label="فترة التقييم"
              type="text"
              stylee={{
                width: "50%",
              }}
              disabled={true}
            />
          </div>

          <div className="showJobPerformanceEvaluation-inputs">
            <RegisterTextbox
              parentStyle={{
                width: "30%",
              }}
              id="empname"
              label="إسم الموظف"
              type="text"
              stylee={{
                width: "50%",
              }}
              disabled={true}
            />
            <RegisterTextbox
              parentStyle={{
                width: "30%",
              }}
              id="jobnum"
              label="الرقم الوظيفي"
              type="number"
              stylee={{
                width: "50%",
              }}
              disabled={true}
            />
            <RegisterTextbox
              parentStyle={{
                width: "30%",
              }}
              id="idnunm"
              label="رقم الهوية"
              type="number"
              stylee={{
                width: "50%",
              }}
              disabled={true}
            />
          </div>

          <div className="JobPerformanceEvaluation-inputs">
            <RegisterTextbox
              parentStyle={{
                width: "30%",
              }}
              id="management"
              label="الإدارة"
              type="text"
              stylee={{
                width: "50%",
              }}
              disabled={true}
            />
            <RegisterTextbox
              parentStyle={{
                width: "30%",
              }}
              id="department"
              label="القسم"
              type="text"
              stylee={{
                width: "50%",
              }}
              disabled={true}
            />
            <RegisterTextbox
              parentStyle={{
                width: "30%",
              }}
              id="emprname"
              label="اسم المسؤول"
              type="text"
              stylee={{
                width: "50%",
              }}
              disabled={true}
            />
          </div>

          <div className="JobPerformanceEvaluation-inputs">
            <RegisterTextbox
              parentStyle={{
                width: "30%",
              }}
              id="reviewgoal"
              label="الهدف من القييم"
              type="text"
              stylee={{
                width: "50%",
              }}
              disabled={true}
            />
            <RegisterTextbox
              parentStyle={{
                width: "30%",
              }}
              id="reviewtype"
              label="نوع التقييم"
              type="text"
              stylee={{
                width: "50%",
              }}
              disabled={true}
            />
            <RegisterTextbox
              parentStyle={{
                width: "30%",
              }}
              id="reviewgoal"
              label="نتيجة التقييم"
              type="text"
              stylee={{
                width: "50%",
              }}
              disabled={true}
            />
          </div>

          <div className="showJobPerformanceEvaluation-inputs">
            <RegisterTextarea
              id="notes"
              label="أضف ملاحظات"
              parentStyle={{
                width: "35%",
                marginBottom: "20px",
              }}
              stylee={{
                height: "100px",
              }}
              rows={5}
            />
          </div>
          <button className="kpi-button" type="submit">
            عرض النموذج
          </button>
        </Form>
      </div>
    </>
  );
}

export default ShowJobPerformanceEvaluation;
