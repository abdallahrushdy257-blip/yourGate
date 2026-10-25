//import './AddWarrantor.css'
import Title from "../../../components/title";
import RegisterTextbox from "../../../components/RegisterTextBox";
import CustomButton from "../../../components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import RegisterSelect from "../../../components/RegisterSelect";
import UploadInput from "../../../components/UploadInput";
import { useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate, useParams } from "react-router";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from 'react-bootstrap';

function OrganizationChart({ goNextTab }) {
  const [formData, updateFormData] = useState({
    job: [""],
    sallary: [""],
    empcount: [""],
  });
  const { id } = useParams();
  const [error, setError] = useState({});
  const [empgroup, setEmpgroup] = useState([{ id: 1 }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMinus, setShowMinus] = useState(false);

  const addEmp = () => {
    updateFormData((prev) => ({
      ...prev,
      job: [...prev.job, ""],
      sallary: [...prev.sallary, ""],
      empcount: [...prev.empcount, ""],
    }));
  };
  const handleAddemployee = () => {
    //setEmpgroup([...empgroup, { id: empgroup.length + 1 }]);
    updateFormData((prev) => ({
      ...prev,
      job: [...prev.job, ""],
      sallary: [...prev.sallary, ""],
      empcount: [...prev.empcount, ""],
    }));
    setEmpgroup((prev) => [...prev, { id: prev.length + 1 }]);
    setShowMinus(true);
  };

  const handleMinusemployee = () => {
    const newEmpGroup = empgroup.slice(0, -1);
    const newJob = formData.job.slice(0, -1);
    const newSallary = formData.sallary.slice(0, -1);
    const newEmpcount = formData.empcount.slice(0, -1);

    setEmpgroup(newEmpGroup);
    updateFormData({
      ...formData,
      job: newJob,
      sallary: newSallary,
      empcount: newEmpcount,
    });

    if (newEmpGroup.length <= 1) {
      setShowMinus(false);
    }
  };

  const handleAddJob = (index, value) => {
    const newInputs = [...formData.job];
    newInputs[index] = value;
    updateFormData({
      ...formData,
      job: newInputs,
    });
  };

  const handleAddSallary = (index, value) => {
    const newInputs = [...formData.sallary];
    newInputs[index] = value;
    updateFormData({
      ...formData,
      sallary: newInputs,
    });
  };

  const handleAddcount = (index, value) => {
    const newInputs = [...formData.empcount];
    newInputs[index] = value;
    updateFormData({
      ...formData,
      empcount: newInputs,
    });
  };

  const [loading, setLoading] = useState(false);

  const handleOrgSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData.job.some((l) => l.trim() === "")) {
      setError({ job: "حقل الوظيفة مطلوب" });
      setLoading(false);
      return;
    }

    if (formData.sallary.some((f) => f.trim() === "")) {
      setError({ sallary: "حقل  المرتب مطلوب" });
      setLoading(false);
      return;
    }

    if (formData.empcount.some((c) => c === "")) {
      setError({ empcount: "حقل عدد الموظفين مطلوب" });
      setLoading(false);
      return;
    }
    const orgchart = {
      empcount: formData.empcount,
      job: formData.job,
      sallary: formData.sallary,
    };
    try {
      const res = await API.post(
        `/feasibilitystudies/updateorgchart`,
        { orgchart, id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res;
      setLoading(false);
      window.alert("تم اضافة الهيكل التنظيمي بنجاح");
      goNextTab();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Title
        title="إضافة الهيكل التنظيمي"
        
        icon={<FontAwesomeIcon icon={faHandHoldingDollar} />}
      />
      <div className="statementofaccount">
        <div className="statementofaccountForm">
          <div className="titleaddcon">
            <h5>
              اضافة وظيفة
              <span
                className="addillness addillness2"
                onClick={handleAddemployee}
                style={{
                  cursor: "pointer",
                  borderRadius: "20px",
                  marginLeft: "10px",
                  color: "green",
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </span>
              {showMinus && (
                <span
                  className="addillness addillness2"
                  onClick={handleMinusemployee}
                  style={{
                    cursor: "pointer",
                    borderRadius: "20px",
                    color: "red",
                  }}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </span>
              )}
            </h5>
          </div>
          {formData.job.map((item, index) => (
            <div className="warrantorRow" key={item.id}>
              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id={`job-${item.id}`}
                label="الوظيفة"
                type="text"
                stylee={{ width: "45%" }}
                value={formData.job[index]}
                onChange={(e) => handleAddJob(index, e.target.value)}
              />
              {error && error.job && <span className="error">{error.job}</span>}
              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id={`sallary-${item.id}`}
                label="الراتب"
                type="number"
                stylee={{ width: "45%" }}
                value={formData.sallary[index]}
                onChange={(e) => handleAddSallary(index, e.target.value)}
              />
              {error && error.sallary && (
                <span className="error">{error.sallary}</span>
              )}
              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id={`count-${item.id}`}
                label="عدد الموظفين"
                type="number"
                stylee={{ width: "45%" }}
                value={formData.empcount[index]}
                onChange={(e) => handleAddcount(index, e.target.value)}
              />
              {error && error.count && (
                <span className="error">{error.count}</span>
              )}
            </div>
          ))}
        </div>
        <div
          className="swotSubmitOrg"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <CustomButton
            text={
              loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "حفظ البيانات"
              )
            }
            onClick={handleOrgSubmit}
            stylee={{ width: "150px", height: "40px", fontSize: "16px" }}
            disabled={loading}
          />
        </div>
      </div>
    </>
  );
}

export default OrganizationChart;
