//import './AddWarrantor.css'
import Title from "../../../../components/title";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import CustomButton from "../../../../components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import UploadInput from "../../../../components/UploadInput";
import { useState } from "react";
import API from "../../../../api/axiosConfig";
import {  useParams } from "react-router";
import { Spinner } from "react-bootstrap";

function TechnicalSide({ goNextTab }) {
  const [formData, updateFormData] = useState({
    license: [""],
    from: [""],
    cost: [""],
  });
  const { id } = useParams();
  const [upload, setUpload] = useState('');
  const [licensegroup, setLicensegroup] = useState([{ id: 1 }]);
  const [showMinus, setShowMinus] = useState(false);
  // const addLicense = () => {
  //   updateFormData((prev) => ({
  //     ...prev,
  //     license: [...prev.license, ""],
  //     from: [...prev.from, ""],
  //     cost: [...prev.cost, ""],
  //   }));
  // };

  const handleAddlicense = () => {
    updateFormData(prev => ({
        ...prev,
        license: [...prev.license, ""],
        from: [...prev.from, ""],
        cost: [...prev.cost, ""],
    }));

    setLicensegroup(prev => [...prev, { id: prev.length + 1 }]);
    setShowMinus(true);
};

  const handleMinuslicense = () => {
    const newLicenseGroup = licensegroup.slice(0, -1);
    const newLicense = formData.license.slice(0, -1);
    const newFrom = formData.from.slice(0, -1);
    const newCost = formData.cost.slice(0, -1);

    setLicensegroup(newLicenseGroup);
    updateFormData({
      ...formData,
      license: newLicense,
      from: newFrom,
      cost: newCost,
    });

    if (newLicenseGroup.length <= 1) {
      setShowMinus(false);
    }
  };

  const handleLicense = (index, value) => {
    const newInputs = [...formData.license];
    newInputs[index] = value;
    updateFormData({
      ...formData,
      license: newInputs,
    });
  };

  const handleFrom = (index, value) => {
    const newInputs = [...formData.from];
    newInputs[index] = value;
    updateFormData({
      ...formData,
      from: newInputs,
    });
  };

  const handleCost = (index, value) => {
    const newInputs = [...formData.cost];
    newInputs[index] = value;
    updateFormData({
      ...formData,
      cost: newInputs,
    });
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const handleLicenseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData.license.some((l) => l.trim() === "")) {
      setError({ license: "حقل الترخيص مطلوب" });
      setLoading(false);
      return;
    }

    if (formData.from.some((f) => f.trim() === "")) {
      setError({ from: "حقل الجهة المصدرة مطلوب" });
      setLoading(false);
      return;
    }

    if (formData.cost.some((c) => c === "")) {
      setError({ cost: "حقل التكلفة مطلوب" });
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();
      form.append("id", id);
      form.append("upload", upload);
      form.append("technical_side", JSON.stringify(formData));

      const res = await API.post(
        `/feasibilitystudies/updatetechnicalside`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        setLoading(false);
        window.alert("تم اضافة الجانب الفني بنجاح");
        goNextTab();
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.errors || {});
    }
  };

  return (
    <>
      <Title
        title="إضافة الجانب الفني"
        icon={<FontAwesomeIcon icon={faHandHoldingDollar} />}
      />
      <div className="statementofaccount">
        <div className="statementofaccountForm">
          <div className="titleaddcon">
            <h5>
              اضافة ترخيص
              <span
                className="addillness addillness2"
                onClick={handleAddlicense}
                style={{
                  cursor: "pointer",
                  borderRadius: "20px",
                  marginLeft: "10px",
                  color: "green",
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </span>
              {licensegroup.length > 1 && (
                <span
                  className="addillness addillness2"
                  onClick={handleMinuslicense}
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
          {formData.license.map((item, index) => (
            <div className="warrantorRow" key={index}>
              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id={`license-${index}`}
                label="الترخيص"
                type="text"
                stylee={{ width: "45%" }}
                value={formData.license[index]}
                onChange={(e) => handleLicense(index, e.target.value)}
                required={true}
              />
              {error && error.formData && error.formData.license && (
                <span className="error">{error.formData}</span>
              )}
              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id={`from-${index}`}
                label="الجهة المصدرة"
                type="text"
                stylee={{ width: "45%" }}
                value={formData.from[index]}
                onChange={(e) => handleFrom(index, e.target.value)}
                required={true}
              />
              {error && error.from && (
                <span className="error">{error.from}</span>
              )}
              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id={`cost-${index}`}
                label="التكلفة"
                type="number"
                stylee={{ width: "45%" }}
                value={formData.cost[index]}
                onChange={(e) => handleCost(index, e.target.value)}
                required={true}
              />
              {error && error.cost && (
                <span className="error">{error.cost}</span>
              )}
            </div>
          ))}
          <UploadInput
            parentStyle={{ width: "45%" }}
            id="upload"
            label="رسم كروكي للموقع ان وجد"
            type="file"
            stylee={{ width: "45%" }}
            onChange={(e) => setUpload(e.target.files[0])}
            value={upload}
          />
          {/* { error && error.upload && <span className="error">{error.upload}</span>} */}
        </div>
        <div
          className="swotSubmitLicense"
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
            onClick={handleLicenseSubmit}
            stylee={{ width: "150px", height: "40px", fontSize: "16px" }}
            disabled={loading}
          />
        </div>
      </div>
    </>
  );
}

export default TechnicalSide;
