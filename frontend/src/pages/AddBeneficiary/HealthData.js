import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./addBeneficiary.css";
import {
  faDatabase,
  faNotesMedical,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
import CustomButton from "../../components/CustomButton";
import { Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import RegisterRadio from "../../components/Radio";
import { useState } from "react";
import UploadInput from "../../components/UploadInput";
import API from "../../api/axiosConfig";

function HealthData() {
  const [healthStatus, setHealthStatus] = useState("good");
  const [illnesses, setIllnesses] = useState([{ id: 1 }]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState([""]);
  const [type, setType] = useState([""]);
  const [degree, setDegree] = useState([""]);
  const [notes, setNotes] = useState([""]);
  const [upload, setUpload] = useState("");
  const [trtype, setTrtype] = useState([""]);
  const [trcost, setTrcost] = useState([""]);
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMinus, setShowMinus] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const healthData = JSON.stringify(
      mergeIllnesses(name, type, degree, notes, trtype, trcost).slice(
        1,
        name.length,
      ),
    );
    setIsSubmitting(true);
    const formData = new FormData();

    formData.append("illness", healthData);
    formData.append("upload", upload);
    formData.append("id", id);
    try {
      const response = await API.post(
        "/humancasedetails/health/store",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const data = await response;
      //console.log(data);
      if (data.status === 200) {
        navigate("/beneficiary");
      }
    } catch (error) {
      setIsSubmitting(false);
      setError(error.response.data.message);
      console.error(error);
    }
  };
  const handleRadioChange = (value) => {
    setHealthStatus(value);
  };

  const addIllnessgroup = () => {
    setName(...name, "");
    setType(...type, "");
    setDegree(...degree, "");
    setNotes(...notes, "");
    setTrtype(...trtype, "");
    setTrcost(...trcost, "");
  };

  const handleAddIllness = () => {
    setIllnesses([...illnesses, { id: illnesses.length + 1 }]);
    addIllnessgroup();
    setShowMinus(true);
  };

  const handleMinusIllness = () => {
    setShowMinus(true);
    setIllnesses(illnesses.slice(0, -1));
    setName(name.slice(0, -1));
    setType(type.slice(0, -1));
    setDegree(degree.slice(0, -1));
    setNotes(notes.slice(0, -1));
    setTrtype(trtype.slice(0, -1));
    setTrcost(trcost.slice(0, -1));
    if (illnesses.length === 2) {
      setShowMinus(false);
    }
  };

  const handleName = (index, value) => {
    const newInputs = [...name];
    newInputs[index] = value; // Update the correct input field
    setName(newInputs);
  };

  const handleType = (index, value) => {
    const newInputs = [...type];
    newInputs[index] = value; // Update the correct input field
    setType(newInputs);
  };

  const handleDegree = (index, value) => {
    const newInputs = [...degree];
    newInputs[index] = value; // Update the correct input field
    setDegree(newInputs);
  };

  const handleNotes = (index, value) => {
    const newInputs = [...notes];
    newInputs[index] = value; // Update the correct input field
    setNotes(newInputs);
  };

  const handleTrtype = (index, value) => {
    const newInputs = [...trtype];
    newInputs[index] = value; // Update the correct input field
    setTrtype(newInputs);
  };

  const handleTrcost = (index, value) => {
    const newInputs = [...trcost];
    newInputs[index] = value; // Update the correct input field
    setTrcost(newInputs);
  };
  const mergeIllnesses = (name, type, degree, notes, trtype, trcost) => {
    var newItem = [];
    name.map((item, index) =>
      newItem.push({
        name: item,
        type: type[index],
        degree: degree[index],
        notes: notes[index],
        trtype: trtype[index],
        trcost: trcost[index],
      }),
    );
    return newItem;
  };
  return (
    <>
      <div className="AddBeneficiary">
        <Title
          title="البيانات الصحية"
          icon={<FontAwesomeIcon icon={faNotesMedical} />}
        />
        {error && (
          <span className="error">
            {error == 0 ? "يجب ادخال البيانات الصحية" : ""}
          </span>
        )}
        <Form className="AddBeneficiaryContainer" onSubmit={handleSubmit}>
          {/* <div className="sexType">
            <h5 className="radTitle">الحالة الصحية</h5>
            <div className="clientRadios clientRadios3">
              <RegisterRadio
                label="سليما"
                value="good"
                onChange={() => handleRadioChange("good")}
                defaultChecked
              />
              <RegisterRadio
                label="مريضا"
                value="sick"
                onChange={() => handleRadioChange("sick")}
              />
            </div>
          </div> */}

          {/* {healthStatus === "good" ? (
            <div className="message-container">
              <p
                style={{ textAlign: "center", fontSize: "18px", color: "gray" }}
              >
                لا يوجد تفاصيل لعرضها
              </p>
            </div>
          ) : ( */}
          <div>
            <span
              className="addillness"
              onClick={handleAddIllness}
              style={{
                borderRadius: "20px",
                color: "green",
                marginLeft: "10px",
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </span>
            {showMinus && (
              <span
                className="addillness"
                onClick={handleMinusIllness}
                style={{ borderRadius: "20px", color: "red" }}
              >
                <FontAwesomeIcon icon={faMinus} />
              </span>
            )}
            <div className="duplicatedContent">
              {illnesses.map((illness, value) => (
                <div className="AddBeneficiaryContainerRow2" key={illness.id}>
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                      marginBottom: "10px",
                    }}
                    id={`name-${illness.id}`}
                    label="اسم المرض"
                    type="text"
                    stylee={{
                      width: "55%",
                    }}
                    name="name"
                    onChange={(e) => handleName(illness.id, e.target.value)}
                  />
                  {error && error.name && (
                    <span className="error">{error.name[0]}</span>
                  )}
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                      marginBottom: "10px",
                    }}
                    id={`type-${illness.id}`}
                    label="نوع المرض"
                    type="text"
                    stylee={{
                      width: "55%",
                    }}
                    name="type"
                    onChange={(e) => handleType(illness.id, e.target.value)}
                  />
                  {error && error.type && (
                    <span className="error">{error.type[0]}</span>
                  )}

                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                      marginBottom: "10px",
                    }}
                    id={`midtype-${illness.id}`}
                    label="نوع العلاج"
                    type="text"
                    stylee={{
                      width: "55%",
                    }}
                    name="trtype"
                    onChange={(e) => handleTrtype(illness.id, e.target.value)}
                  />
                  {error && error.trtype && (
                    <span className="error">{error.trtype[0]}</span>
                  )}
                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id={`cost-${illness.id}`}
                    label="تكلفة العلاج"
                    type="number"
                    stylee={{
                      width: "55%",
                    }}
                    name="trcost"
                    onChange={(e) => handleTrcost(illness.id, e.target.value)}
                  />
                  {error && error.trcost && (
                    <span className="error">{error.trcost[0]}</span>
                  )}

                  <RegisterTextbox
                    parentStyle={{
                      width: "30%",
                    }}
                    id={`notes-${illness.id}`}
                    label="ملاحظات"
                    type="text"
                    stylee={{
                      width: "55%",
                    }}
                    name="notes"
                    onChange={(e) => handleNotes(illness.id, e.target.value)}
                  />
                  {error && error.notes && (
                    <span className="error">{error.notes[0]}</span>
                  )}
                  <RegisterTextbox
                    id={`danger-${illness.id}`}
                    parentStyle={{
                      width: "30%",
                    }}
                    label="خطورة المرض"
                    type="text"
                    stylee={{ width: "100%" }}
                    name="degree"
                    onChange={(e) => handleDegree(illness.id, e.target.value)}
                  />
                  {error && error.degree && (
                    <span className="error">{error.degree[0]}</span>
                  )}
                </div>
              ))}
              <UploadInput
                id="reportImage"
                parentStyle={{
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
                label="صورة التقارير الصحية"
                name="upload"
                onChange={(e) => setUpload(e.target.files[0])}
                value={upload}
              />
              {error && error.upload && (
                <span className="error">{error.upload[0]}</span>
              )}
            </div>
          </div>
          {/* )}
           */}

          <div className="AddBeneficiaryContainerRow">
            {isSubmitting ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <CustomButton text="حفظ" />
            )}
          </div>
        </Form>
      </div>
    </>
  );
}

export default HealthData;
