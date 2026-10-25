import "./showperformance.css";
import Title from "../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterTextbox from "../../components/RegisterTextBox";
import { Form } from "react-bootstrap";

function ShowPerformance() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="showPerformance">
        <Title
          title="عرض تقيم الاداء الوظيفي"
          icon={<FontAwesomeIcon icon={faChartSimple} />}
          style={{ width: "unset" }}
        />

        <Form
          className="showPerformanceinputs-container"
          onSubmit={handleSubmit}
        >
          <div className="showPerformanceinputs">
            <RegisterSelect
              id="totalmarks"
              stylee={{
                width: "45% !important",
              }}
              parentStyle={{
                width: "20%",
                marginBottom: "20px",
              }}
              label="إجمالي الدرجات"
              options={[
                { value: "", label: "إجمالي الدرجات" },
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
              ]}
            />
            <RegisterSelect
              id="Recommendations"
              stylee={{
                width: "45% !important",
              }}
              parentStyle={{
                width: "20%",
                marginBottom: "20px",
              }}
              label="التوصيات"
              options={[
                { value: "", label: "التوصيات" },
                { value: "علاوة", label: "علاوة" },
                { value: "ترقية", label: "ترقية" },
                { value: "الإستغناء عنه", label: "الإستغناء عنه" },
                { value: "مكافأة", label: "مكافأة" },
                { value: "يحرم من العلاوة", label: "يحرم من العلاوة" },
                { value: "نقله الي مكان اخر", label: "نقله الي مكان اخر" },
              ]}
            />
          </div>

          <div className="showPerformanceinputs">
            <RegisterTextbox
              parentStyle={{
                width: "45%",
              }}
              id="notes"
              label="الملاحظات"
              type="text"
              stylee={{
                width: "100%",
              }}
            />
          </div>
          <div className="showPerformanceinputs">
            <RegisterTextbox
              parentStyle={{
                width: "45%",
              }}
              id="date"
              label="التاريخ"
              type="date"
              stylee={{
                width: "100%",
              }}
            />
          </div>
          <div className="showPerformanceinputs">
            <RegisterTextbox
              parentStyle={{
                width: "20%",
              }}
              id="employeecitation"
              label="توقيع الموظف"
              type="text"
              stylee={{
                width: "50%",
              }}
            />
            <RegisterTextbox
              parentStyle={{
                width: "20%",
              }}
              id="employercitation"
              label="توقيع المدير"
              type="text"
              stylee={{
                width: "50%",
              }}
            />
          </div>

          <button
            className="kpi-button"
            type="submit"
            style={{ marginTop: "15px" }}
          >
            حفظ
          </button>
        </Form>
      </div>
    </>
  );
}

export default ShowPerformance;
