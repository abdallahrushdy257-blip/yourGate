import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./addBeneficiary.css";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import { faPlus , faMinus } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../../components/CustomButton";
import { Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import UploadInput from "../../components/UploadInput";
import { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import { Spinner } from "react-bootstrap";

function QualificationPosition(props) {
  const navigate = useNavigate();
  const params = useParams();
  const id = props?.id || params?.id;
  const [incomeSources, setIncomeSources] = useState([{ id: 1 }]);
  const [trainingCourses, setTrainingCourses] = useState([{ id: 1 }]);
  const [level, setLevel] = useState('');
  const [canwork, setCanwork] = useState('');
  const [job, setJob] = useState('');
  const [notes, setNotes] = useState('');
  const [sourceamount, setSourceamount] = useState(['']);
  const [sourcename, setSourcename] = useState(['']);
  const [sourceupload, setSourceupload] = useState("");
  const [coursetitle, setCoursetitle] = useState(['']);
  const [courseupload, setCourseupload] = useState("");
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [courseaddress, setCourseaddress] = useState(['']);
  const [showMinus, setShowMinus] = useState(false);
  const [showMinus1, setShowMinus1] = useState(false);
  const [rows , setRows] = useState([]);

  const addSource = () => {
    setSourceamount([...sourceamount, ""]); // Add a new empty input
    setSourcename([...sourcename, ""]); // Add a new empty input
  };

  const addCource = () => {
    setCoursetitle([...coursetitle, ""]); // Add a new empty input
    setCourseaddress([...courseaddress, ""]); // Add a new empty input
  };

  const mergeSource = (sourcename, amount) => {
    var newItem = [];
    //console.log('name', sourcename, 'amount', amount);
    sourcename.map((item, index) => (
      newItem.push({
        sourcename: item,
        sourceamount: amount[index],
      })
    ));
    return newItem;
  };

  const mergeCourse = (coursetitle, courseaddress) => {
    var newItem = [];
    coursetitle.map((item, index) => (
      newItem.push({
        coursetitle: item,
        courseaddress: courseaddress[index],
      })
    ));
    return newItem;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    formData.append('id', id);
    formData.append("level", rows && rows.work_education && rows.work_education.educationlevel ? rows.work_education.educationlevel : '');
    formData.append("canwork", rows && rows.work_education ? rows.work_education.canwork == true ? "1" : "0" : '');
    formData.append("job", rows && rows.work_education && rows.work_education.job ? rows.work_education.job : '');
    formData.append("note", rows && rows.work_education && rows.work_education.notes ? rows.work_education.notes : '');
    formData.append('source', JSON.stringify(mergeSource(sourcename, sourceamount)));
    formData.append('course', JSON.stringify(mergeCourse(coursetitle, courseaddress)));
    formData.append('sourceupload', sourceupload);
    formData.append('courseupload', courseupload);
    try {
      const res = await API.post('/humancasedetails/qualifications/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const data = await res;
      if (data.status === 200) {
        if (props?.onClose) {
          props.onClose();
        } else {
          navigate('/beneficiary');
        }
      }
    } catch (error) {
      console.log(error)
      setIsSubmitting(false);
      setError(error.response.data.errors);
    }
  };

  const handleAddIncomeSource = () => {
    setIncomeSources([...incomeSources, { id: incomeSources.length + 1 }]);
    addSource();
    setShowMinus1(true);
  };

  const handleMinusIncomeSource = () => {
    setShowMinus1(true);
    setIncomeSources(incomeSources.slice(0, -1));
    setSourceamount(sourceamount.slice(0, -1));
    setSourcename(sourcename.slice(0, -1));
    if (incomeSources.length === 2) {
      setShowMinus1(false);
    }
  }

  const handleAddTrainingCourse = () => {
    setTrainingCourses([
      ...trainingCourses,
      { id: trainingCourses.length + 1 },
    ]);
    addCource();
    setShowMinus(true);
  
  };

  const handleMinusTrainingCourse = () => {
setShowMinus(true);
    setTrainingCourses(trainingCourses.slice(0, -1));
    setCoursetitle(coursetitle.slice(0, -1));
    setCourseaddress(courseaddress.slice(0, -1));
    if (trainingCourses.length === 2) {
      setShowMinus(false);
    }
  }

  const handleSourceName = (index, value) => {
    const newInputs = [...sourcename];
    newInputs[index] = value; // Update the correct input field
    setSourcename(newInputs);
  };

  const handleSourceAmount = (index, value) => {
    const newInputs = [...sourceamount];
    newInputs[index] = value; // Update the correct input field
    setSourceamount(newInputs);
  };

  // const handleSourceUpload = (index, value) => {
  //   const newInputs = [...sourceupload];
  //   newInputs[index] = value; // Update the correct input field
  //   setSourceupload(newInputs);
  // };

  const handleCourceTitle = (index, value) => {
    const newInputs = [...coursetitle];
    newInputs[index] = value; // Update the correct input field
    setCoursetitle(newInputs);
  };

  const handleCourceAddress = (index, value) => {
    const newInputs = [...courseaddress];
    newInputs[index] = value; // Update the correct input field
    setCourseaddress(newInputs);
  };




  const getAllData = async () => {
        try {
            const res = await API.get(`/humancasedetails/get/${id}`);
            const data = await res;
            if (data.status === 200) {
                setRows(data.data);
            }
        } catch (error) {
            console.error(error);
            setError(error.response.data.errors);
        }
    }

    useEffect(() => {
        getAllData();
    }, []);
  return (
    <>
      <div className="AddBeneficiary">
        <Title
          title="المؤهل والوظيفة"
          icon={<FontAwesomeIcon icon={faGraduationCap} />}
        />
        <Form className="global-form-container" onSubmit={handleSubmit}>
          <div className="AddBeneficiaryContainer">
            <div className="AddBeneficiaryContainerRow">
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="edLevel"
                label="المستوي التعليمي"
                type="text"
                stylee={{
                  width: "55%",
                }}
                name="level"
                onChange={(e) => setRows({ ...rows, work_education: { ...rows.work_education, educationlevel: e.target.value } })}
                value={rows && rows.work_education && rows.work_education.educationlevel ? rows.work_education.educationlevel : level}
                //disabled = { rows && rows.work_education && rows.work_education.educationlevel ? true : false }
              />
              <RegisterSelect
                id="canwork"
                label="يستطيع العمل"
                stylee={{ width: "30%" }}
                parentStyle={{ width: "30%", marginBottom: "20px" }}
                options={[
                  { value: "", label: "اختر" },
                  { value: "1", label: "نعم" },
                  { value: "0", label: "لا" },
                ]}
                name="canwork"
                onChange={(e) => setRows({ ...rows, work_education: { ...rows.work_education, canwork: e.target.value } })}
                value={rows && rows.work_education ? rows.work_education.canwork == true ? "1" : "0" : canwork}
                //disabled = { rows && rows.work_education && rows.work_education.canwork ? true : false }
              />

            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {error && error.level && <span className="error" style={{ marginLeft: "20px" }}>{error.level}</span>}
              {error && error.canwork && <span className="error" style={{ marginRight: "10px" }}>{error.canwork}</span>}
            </div>
            <div className="AddBeneficiaryContainerRow">

              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="job"
                label="المهنة"
                type="text"
                stylee={{
                  width: "55%",
                }}
                name="job"
                onChange={(e) => setRows({ ...rows, work_education: { ...rows.work_education, job: e.target.value } })}
                value={rows && rows.work_education && rows.work_education.job ? rows.work_education.job : job}
                //disabled = { rows && rows.work_education && rows.work_education.job ? true : false }
              />{error && error.job && <span className="error">{error.job}</span>}
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="extraNotes"
                label="ملاحظات اضافية"
                type="text"
                stylee={{
                  width: "55%",
                }}
                name="extraNotes"
                onChange={(e) => setRows({ ...rows, work_education: { ...rows.work_education, notes: e.target.value } })}
                value={rows && rows.work_education && rows.work_education.notes}
                //disabled = { rows && rows.work_education && rows.work_education.educationlevel ? true : false }
              />{error && error.extraNotes && <span className="error">{error.extraNotes}</span>}
            </div>
            <div>
              <div className="titleaddcon">
                <h5>
                  مصادر الدخل
                  <span
                    className="addillness addillness2"
                    onClick={handleAddIncomeSource}
                    style={{ color: "green" , borderRadius: "50px" , marginLeft: "10px" }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </span>
                  {
                    showMinus1 && (
                      <span
                        className="addillness addillness2"
                        onClick={handleMinusIncomeSource}
                        style={{ color: "red" , borderRadius: "50px" }}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </span>
                    )
                  }
                </h5>
              </div>
              {incomeSources.map((source, value) => (
                <div key={source.id} className="AddBeneficiaryContainerRow" style={{ border: "1px solid var(--text-color)" , borderRadius: "10px" , padding: "10px"}}>
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id={`incomesources-${source.id}`}
                    label="اسم المصدر"
                    type="text"
                    stylee={{ width: "55%" }}
                    name="incomesources"
                    onChange={(e) => handleSourceName(source.id, e.target.value)}

                  />
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id={`souramount-${source.id}`}
                    label="القيمة"
                    type="text"
                    stylee={{ width: "55%" }}
                    name="souramount"
                    onChange={(e) => handleSourceAmount(source.id, e.target.value)}
                  />

                </div>
              ))}
            </div>

            <div>
              <div className="titleaddcon">
                <h5>
                  الدورات التدريبية
                  <span
                    className="addillness addillness2"
                    onClick={handleAddTrainingCourse}
                    style={{ color: "green" , borderRadius: "50px" , marginLeft: "10px" }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </span>
                  {
                    showMinus &&
                    <span
                      className="addillness addillness2"
                      onClick={handleMinusTrainingCourse}
                      style={{ color: "red" , borderRadius: "50px" }}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </span>
                  }
                </h5>
              </div>
              {trainingCourses.map((course, value) => (
                <div key={course.id} className="AddBeneficiaryContainerRow" style={{ border: "1px solid var(--text-color)" , borderRadius: "10px" , padding: "10px"}}>
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id={`coursesname-${course.id}`}
                    label="اسم الدورة"
                    type="text"
                    stylee={{ width: "55%" }}
                    name="coursesname"
                    onChange={(e) => handleCourceTitle(course.id, e.target.value)}
                  />
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id={`coursesdate-${course.id}`}
                    label=" مكان الحصول على الدورة"
                    type="text"
                    stylee={{ width: "55%" }}
                    name="courseaddress"
                    onChange={(e) => handleCourceAddress(course.id, e.target.value)}
                  />

                </div>
              ))}
            </div>
          </div>

          <div className="AddBeneficiaryContainerRow">

            <UploadInput
              id={`salary`}
              parentStyle={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
              label="مشهد الراتب"
              name="salary"
              onChange={(e) => setSourceupload(e.target.files[0])}
            />
           
       

          <UploadInput
            id="trainingcourse"
            parentStyle={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
            }}
            label="صور الدورات التدريبة"
            name="salary"
            onChange={(e) => setCourseupload(e.target.files[0])}
            value={courseupload}
          />
         

      </div >
      <div style={{ display: "flex", alignItems: "space-between" }}>
        
        {error && error.sourceupload && <span className="error" style={{ marginLeft: "10px", marginBottom: "5px" }}>{error.sourceupload}</span>}
         
        {error && error.courseupload && <span className="error" style={{ marginRight: "10px", marginBottom: "5px" }}>{error.courseupload}</span>}
      </div>



      <div className="AddBeneficiaryContainerRow">
        {isSubmitting ? <Spinner animation="border" variant="primary" /> :
          <CustomButton text="حفظ" />
        }
      </div>
    </Form >
      </div >
    </>
  );
}

export default QualificationPosition;
