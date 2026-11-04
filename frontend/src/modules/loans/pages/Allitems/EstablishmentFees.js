//import './AddWarrantor.css'
import Title from "../../../../components/title";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import CustomButton from "../../../../components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import API from "../../../../api/axiosConfig";
import { useParams } from "react-router";
import { Spinner } from "react-bootstrap";

function EstablishmentFees({ goNextTab }) {
  const [formData, updateFormData] = useState({
    establishmentstatment: [""],
    establishmentfees: [""],
  });
  const { id } = useParams();
  const [error, setError] = useState({});
  const [feesGroup, setFeesGroup] = useState([{ id: 1 }]);
  const [showMinus, setShowMinus] = useState(false);
  const [loading, setLoading] = useState(false);

  // إضافة صف جديد
  const handleAddFees = () => {
    updateFormData((prev) => ({
      ...prev,
      establishmentstatment: [...prev.establishmentstatment, ""],
      establishmentfees: [...prev.establishmentfees, ""],
    }));
    setFeesGroup((prev) => [...prev, { id: prev.length + 1 }]);
    setShowMinus(true);
  };

  // حذف آخر صف
  const handleMinusFees = () => {
    const newFeesGroup = feesGroup.slice(0, -1);
    const newStatment = formData.establishmentstatment.slice(0, -1);
    const newFees = formData.establishmentfees.slice(0, -1);

    setFeesGroup(newFeesGroup);
    updateFormData({
      ...formData,
      establishmentstatment: newStatment,
      establishmentfees: newFees,
    });

    if (newFeesGroup.length <= 1) {
      setShowMinus(false);
    }
  };

  // تحديث بيان المصروف
  const handleStatmentChange = (index, value) => {
    const newInputs = [...formData.establishmentstatment];
    newInputs[index] = value;
    updateFormData({
      ...formData,
      establishmentstatment: newInputs,
    });
  };

  // تحديث الرسوم
  const handleFeesChange = (index, value) => {
    const newInputs = [...formData.establishmentfees];
    newInputs[index] = value;
    updateFormData({
      ...formData,
      establishmentfees: newInputs,
    });
  };

  // إرسال البيانات
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.establishmentstatment.some((v) => v.trim() === "")) {
      setError({ establishmentstatment: "حقل البيان مطلوب" });
      setLoading(false);
      return;
    }

    if (formData.establishmentfees.some((v) => v.trim() === "")) {
      setError({ establishmentfees: "حقل الرسوم مطلوب" });
      setLoading(false);
      return;
    }

    const establishmentfeesData = {
      establishmentstatment: formData.establishmentstatment,
      establishmentfees: formData.establishmentfees,
    };

    try {
      const res = await API.post(
        `/feasibilitystudies/updateestablishmentfees`,
        { establishmentfees: establishmentfeesData, id },
        { headers: { "Content-Type": "application/json" } }
      );
      setLoading(false);
      window.alert("تم حفظ مصروفات التأسيس بنجاح");
      goNextTab();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Title
        title="إضافة مصروفات التأسيس"
      
        icon={<FontAwesomeIcon icon={faHandHoldingDollar} />}
      />
      <div className="statementofaccount">
        <div className="statementofaccountForm">
          <div className="titleaddcon">
            <h5>
              إضافة مصروف
              <span
                className="addillness addillness2"
                onClick={handleAddFees}
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
                  onClick={handleMinusFees}
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

          {feesGroup.map((item, index) => (
            <div className="warrantorRow" key={item.id}>
              <RegisterTextbox
                parentStyle={{ width: "45%" }}
                id={`establishmentstatment-${item.id}`}
                label="البيان"
                type="text"
                stylee={{ width: "45%" }}
                value={formData.establishmentstatment[index]}
                onChange={(e) => handleStatmentChange(index, e.target.value)}
                required={true}
              />
              {error.establishmentstatment && (
                <span className="error">{error.establishmentstatment}</span>
              )}

              <RegisterTextbox
                parentStyle={{ width: "45%" }}
                id={`establishmentfees-${item.id}`}
                label="الرسوم"
                type="number"
                stylee={{ width: "45%" }}
                value={formData.establishmentfees[index]}
                onChange={(e) => handleFeesChange(index, e.target.value)}
                required={true}
              />
              {error.establishmentfees && (
                <span className="error">{error.establishmentfees}</span>
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
            onClick={handleSubmit}
            stylee={{ width: "150px", height: "40px", fontSize: "16px" }}
            disabled={loading}
          />
        </div>
      </div>
    </>
  );
}

export default EstablishmentFees;
