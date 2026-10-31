import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield, faChartBar } from "@fortawesome/free-solid-svg-icons";
import Title from "../../../components/title";
import RegisterRadio from "../../../components/Radio";
import UploadInput from "../../../components/UploadInput";
import KpiTextbox from "../../../components/KpiTextbox";
import Select from "react-select";
import "./commitmentCompliance.css";
import { Form, Modal } from "react-bootstrap";
import CustomButton from "../../../components/CustomButton";
import API from "../../../api/axiosConfig";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";
import DonutChart from "../../../components/DonutChart";

var criteriaData = [
  {
    name: "معيار الامتثال و الالتزام",
    questions: [],
  },
  {
    name: "معيار الشفافية و الافصاح",
    questions: [],
  },
  {
    name: "معيار السلامة المالية",
    questions: [],
  },
];
const customStyles = {
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#ffff",
    borderRadius: "5px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#000"
      : state.isFocused
        ? "#e0e0e0"
        : "white",
    color: state.isSelected ? "#fff" : "#333",
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: "var(--card--background)",
    borderRadius: "5px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#000",
  }),
};

function CommitmentCompliance() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalquiz , setTotalquiz] = useState([]);

  const getQuestionsList = async () => {
    try {
      const response = await API.get("/governances/quizs");
      const data = await response;
      if (data.status === 200) {
        setRows(data.data);

        var items1 = [];
        var items2 = [];
        var items3 = [];

        data.data.map((item) => {
          if (item.sid == 1) {
            var myanswers = [];
            if (item.answers.answerno) {
              myanswers.push(item.answers.answerno);
            }
            if (item.answers.answeryes) {
              myanswers.push(item.answers.answeryes);
            }
            if (item.answers.answerhalfyes) {
              myanswers.push("نصف نعم");
            }
            items1.push({
              id: item.id,
              text: item.text,
              checks: myanswers,
              degree: item.degree,
              subject: item.subject,
              isAnswered: item.isAnswered,
            });
          } else if (item.sid == 2) {
            var myanswers = [];
            if (item.answers.answerno) {
              myanswers.push(item.answers.answerno);
            }
            if (item.answers.answeryes) {
              myanswers.push(item.answers.answeryes);
            }
            if (item.answers.answerhalfyes) {
              myanswers.push("نصف نعم");
            }
            items2.push({
              id: item.id,
              text: item.text,
              checks: myanswers,
              degree: item.degree,
              subject: item.subject,
              isAnswered: item.isAnswered,
            });
          } else if (item.sid == 3) {
            var myanswers = [];
            if (item.answers.answerno) {
              myanswers.push(item.answers.answerno);
            }
            if (item.answers.answeryes) {
              myanswers.push(item.answers.answeryes);
            }
            if (item.answers.answerhalfyes) {
              myanswers.push("نصف نعم");
            }
            items3.push({
              id: item.id,
              text: item.text,
              checks: myanswers,
              degree: item.degree,
              subject: item.subject,
              isAnswered: item.isAnswered,
            });
          }
        });

        criteriaData = [
          {
            name: "معيار الامتثال و الالتزام",
            questions: items1,
          },
          {
            name: "معيار الشفافية و الافصاح",
            questions: items2,
          },
          {
            name: "معيار السلامة المالية",
            questions: items3,
          },
        ];

        setSelectedCriteria(criteriaData[0]);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  async function submitData(id) {
    var url = document.getElementById(`urlarea_${id}`).value;
    var note = document.getElementById(`notearea_${id}`).value;
    var formData = new FormData();
    formData.append("url", url);
    formData.append("note", note);
    formData.append("id", id);
    try {
      const res = await API.post(`/governances/store`, formData);
      const data = await res;
      if (data.status === 200) {
        var row = document.getElementById(`row_${id}`);
        row.classList.add("submitted");
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  }

  const [nyid, setNyid] = useState([]);
  const getID = async () => {
    try {
      const res = await API.get(`/governances/submitted`);
      const data = await res;
      setNyid(data.data);
    } catch (error) {
      setError(error.response.data.errors);
    }
  };

  useEffect(() => {
    getQuestionsList();
    getID();
  }, []);

  const criteriaOptions = criteriaData.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const [selectedCriteria, setSelectedCriteria] = useState(criteriaData[0]);
  const [answers, setAnswers] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [show, setShow] = useState(false);
  const totalQuestions = selectedCriteria.questions.length;
  const answeredQuestions = Object.keys(answers).length;

  var completedRows = 0;
  if (selectedCriteria && selectedCriteria.questions) {
    completedRows = selectedCriteria.questions.filter((question) => {
      return answers[question.id] && uploadedFiles[question.id];
    }).length;
  }

  const progressPercentage = (completedRows / totalQuestions) * 100;
  const handleCriteriaChange = (selectedOption) => {
    const criteria = criteriaData.find((c) => c.name === selectedOption.value);
    setSelectedCriteria(criteria);
    setAnswers({});
    setUploadedFiles({});
  };

  const handleRadioChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleFileUpload = (questionId, file) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [questionId]: file,
    }));
  };

  const isRowComplete = (questionId) => {
    return answers[questionId] && uploadedFiles[questionId];
  };

  const handleShow = () => {
    setShow(true);
  };
  
  const getAnsweredQuestions = async () => {
      try {
        const res = await API.get(`governances/countquizs`);
        const data = await res;
        setTotalquiz(data.data);
      } catch (error) {
        setError(error.response.data.errors);
      }
    }
  useEffect(() => {
    
    getAnsweredQuestions(); 
  }, []);
  console.log(totalquiz);

  return loading ? (
    <TestPreLoader />
  ) : (

    <div className="commitmentcompliance">
      <Title title="الحوكمة" icon={<FontAwesomeIcon icon={faShield} />} />
      
      <Form className="commitmentcomplianceContainer" onSubmit={handleSubmit}>

        <div className="criteriaSelect" style={{ display: "flex", justifyContent: "center", marginBottom: "20px", flexDirection: "row", alignItems: "center" }}>

          <button className="btn btn-primary" onClick={handleShow}> {<FontAwesomeIcon icon={faChartBar} />}</button>
          <Select
            options={criteriaOptions}
            onChange={handleCriteriaChange}
            placeholder="معيار الامتثال و الالتزام"
            className="searchableDropdown"
            styles={customStyles}
          />
        </div>
      



        <div className="ReceiptTableCon">
          <div className="styledTableContainer">
            <table className="styledTable">
              <thead>
                <tr>
                  <th>تسلسل</th>
                  {/* <th>السؤال</th>
                  <th>الإجابة</th>
                  <th>الدرجة</th>
                  <th> الروابط</th> */}
                  <th> السؤال</th>
                  <th>حفظ</th>
                </tr>
              </thead>
              <tbody>
                {selectedCriteria.questions.map((question, index) => (
                  <tr
                    key={question.id}
                    className={ question.isAnswered ? "submitted" : ""}
                    id={"row_" + question.id}                  
                  >
                    <td>{index + 1}</td>
                    <td style={{ textAlign: "right" }}>
                      <span style={{ fontWeight: "bold", fontSize: "16px" }}>  السؤال :</span>
                      {question.text} <br />
                      <span style={{ fontWeight: "bold", fontSize: "16px" }}>   المؤشرات  :</span>
                      {question.subject} <br />
                      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "self-start", marginTop: "10px" }}>

                        {question &&
                          question.checks &&
                          question.checks.map((check, i) => (
                            <RegisterRadio
                              key={i}
                              label={check}
                              //value={check}
                              checked={answers[question.id] === check}
                              name={`question-${question.id}`}
                              onChange={() =>
                                handleRadioChange(question.id, check)
                              }

                              value={question.id}
                            />
                          ))}

                      </div>{" "}


                      <KpiTextbox
                        label="الروابط"
                        parentStyle={{
                          marginBottom: "20px",
                          margin: "auto",
                        }}
                        stylee={{
                          height: "100px",
                        }}
                        placeholder="من فضلك ادخل الرابط هنا"
                        disabled={false}
                        styleeParent={{
                          margin: "auto",
                          width: "100%"
                        }}
                        id={"urlarea_" + question.id}
                      />{" "}


                      <KpiTextbox
                        label="ملاحظات"
                        parentStyle={{
                          marginBottom: "20px",
                          margin: "auto",
                          width: "100%"
                        }}

                        placeholder="من فضلك ادخل الملاحظات هنا"
                        disabled={false}
                        styleeParent={{
                          margin: "auto",
                        }}
                        id={"notearea_" + question.id}
                      />{" "}


                      <span style={{ fontSize: "14px", fontWeight: "bold", textAlign: "center" }}>  الدرجة :
                        {
                          question.degree ? question["degree"] : "0"
                        }</span>
                    </td>

                    <td>
                      {
                        question.isAnswered ? "تمت الاجابة" : 
                        <div className="governbtn">
                        <CustomButton
                          text="√"
                          type="button"
                          onClick={() => submitData(question.id)}
                        />
                      </div>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </div>
        </div>
        
      </Form>
      <Modal show={show} onHide={() => setShow(false)} className="modal-table" >
        <Modal.Header closeButton>
          <Modal.Title> الحوكمة</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "auto", overflowY: "scroll" }}>
          <div className="modal-table-container" >
            <div className="uploadlogo">
              <DonutChart
                title="الامتثال و الالتزام"
                name1="الامتثال و الالتزام"
                name2="عدم الامتثال و الالتزام"
                subtitle="نسبة الامتثال و الالتزام"
                paid={ (parseInt(totalquiz && totalquiz.length > 0 && totalquiz[0]['answered_count']) ?? 0)}
                remaining={(totalquiz && totalquiz.length > 0 && totalquiz[0]['question_count'] - parseInt(totalquiz && totalquiz.length > 0 && totalquiz[0]['answered_count'])) ?? 0}
                total={(totalquiz && totalquiz.length > 0 && totalquiz[0]['question_count']) ?? 0}
              />
            </div>

            <div className="uploadlogo">
              <DonutChart
                title="الشفافية و الافصاح"
                name1="الشفافية و الافصاح"
                name2="عدم الشفافية و الافصاح"
                subtitle="نسبة الشفافية و الافصاح"
                paid={parseInt(totalquiz && totalquiz.length > 0 && totalquiz[1]['answered_count'])}
                remaining={(totalquiz && totalquiz.length > 0 && totalquiz[1]['question_count']) - (parseInt(totalquiz && totalquiz.length > 0 && totalquiz[1]['answered_count']))}
                total={totalquiz && totalquiz.length > 0 && totalquiz[1]['question_count'] }
              />
            </div>

            <div className="uploadlogo">
              <DonutChart
                title="السلامة المالية"
                name1="السلامة المالية"
                name2="عدم السلامة المالية"
                subtitle="نسبة السلامة المالية"
                paid={parseInt(totalquiz && totalquiz.length > 0 && totalquiz[2]['answered_count'])}
                remaining={(totalquiz && totalquiz.length > 0 && totalquiz[2]['question_count']) - (parseInt(totalquiz && totalquiz.length > 0 && totalquiz[2]['answered_count']))}
                total={totalquiz && totalquiz.length > 0 && totalquiz[2]['question_count']}
              />
            </div>

          </div>
        </Modal.Body>
      </Modal>
      {/* <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ height: `${progressPercentage}%` }}
        ></div>

        <div className="progress-text">
          {answeredQuestions} / {totalQuestions} تمت الإجابة
        </div>
      </div> */}
        {/* <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ height: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {answeredQuestions} / {totalQuestions} تمت الإجابة
          </div>
        </div>  */}
    </div>
     

  );
}

export default CommitmentCompliance;
