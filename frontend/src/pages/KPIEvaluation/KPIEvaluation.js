import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./kpievaluation.css";
import {
  faChartSimple,
  faCirclePlus,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import RegisterSelect from "../../components/RegisterSelect";
import { Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import KpiTextbox from "../../components/KpiTextbox";
import API from "../../api/axiosConfig";

function KPIEvaluation() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [rows, setRows] = useState([]);       // الأسئلة من الـ DB
  const [quizs, setQuizs] = useState([]);     // الدرجات
  const [note, setNote] = useState([]);       // الملاحظات
  const [noteStates, setNoteStates] = useState([]); // حالة فتح الملاحظة
  const [isSpinner, setIsSpinner] = useState(false);

  const selectOptions = [
    { value: "", label: "إجمالي الدرجات" },
    { value: "95", label: "90-100" },
    { value: "85", label: "80-89" },
    { value: "75", label: "70-79" },
    { value: "65", label: "60-69" },
    { value: "55", label: "أقل من 60" },
  ];

  // ✅ تحميل الأسئلة من الـ API
  useEffect(() => {
    const getQuiz = async () => {
      try {
        const response = await API.get("/quizs/all");
        const data = response.data;

        setRows(data);
        setQuizs(Array(data.length).fill(""));  // نجهز مصفوفة بنفس الطول
        setNote(Array(data.length).fill(""));
        setNoteStates(Array(data.length).fill(false));
      } catch (error) {
        console.error(error);
      }
    };
    getQuiz();
  }, []);

  // ✅ تحديث الدرجة
  const handlequizs = (index, value) => {
    const newInputs = [...quizs];
    newInputs[index] = value;
    setQuizs(newInputs);
  };

  // ✅ تحديث الملاحظة
  const handlenote = (index, value) => {
    const newInputs = [...note];
    newInputs[index] = value;
    setNote(newInputs);
  };

  // ✅ فتح/غلق الملاحظات
  const toggleNoteInput = (index) => {
    setNoteStates((prevStates) =>
      prevStates.map((state, i) => (i === index ? !state : state))
    );
  };

  // ✅ تجهيز البيانات للإرسال
  const mergeQuiz = (quizs, note) => {
    return rows.map((row, index) => ({
      question_id: row.id,
      question: row.question,
      grade: quizs[index] || "",
      note: note[index] || "",
    }));
  };

  // ✅ إرسال البيانات
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSpinner(true);

    const mForm = new FormData();
    mForm.append("id", id);
    mForm.append("quiz", JSON.stringify(mergeQuiz(quizs, note)));

    try {
      const res = await API.post("/evaluation/storequizs", mForm);
      if (res.status === 200) {
        navigate("/jobperformanceevaluation");
      }
    } catch (error) {
      setIsSpinner(false);
    }
  };

  return (
    <div className="kpievaluation">
      <Title
        title="التقييم"
        icon={<FontAwesomeIcon icon={faChartSimple} />}
        style={{ width: "unset" }}
      />

      <Form className="kpievaluation-inputs" onSubmit={handleSubmit}>
        {rows.map((row, index) => (
          <div className="kpievaluation-input" key={row.id}>
            <RegisterSelect
              id={row.id}
              stylee={{ width: "45% !important" }}
              parentStyle={{ width: "25%", marginBottom: "20px" }}
              label={row.question}
              onChange={(e) => handlequizs(index, e.target.value)}
              options={selectOptions}
            />

            {!noteStates[index] ? (
              <>
                <FontAwesomeIcon
                  icon={faCirclePlus}
                  className="addnotekpi"
                  onClick={() => toggleNoteInput(index)}
                />
                <p className="addnotekpitext">أضف ملاحظة</p>
              </>
            ) : (
              <>
                <KpiTextbox
                  id={`note${index + 1}`}
                  label={`اضف ملاحظة للسؤال ${index + 1}`}
                  parentStyle={{
                    width: "30%",
                    marginBottom: "20px",
                  }}
                  stylee={{ height: "100px" }}
                  rows={5}
                  placeholder=""
                  onChange={(e) => handlenote(index, e.target.value)}
                />
                <FontAwesomeIcon
                  icon={faX}
                  className="closenotekpi"
                  onClick={() => toggleNoteInput(index)}
                />
              </>
            )}
          </div>
        ))}

        {isSpinner ? (
          <Spinner
            style={{ marginTop: "15px" }}
            animation="border"
            variant="primary"
          />
        ) : (
          <button
            className="kpi-button"
            type="submit"
            style={{ marginTop: "15px" }}
          >
            إرسال
          </button>
        )}
      </Form>
    </div>
  );
}

export default KPIEvaluation;
