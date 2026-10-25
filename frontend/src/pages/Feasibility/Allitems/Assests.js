//import './AddWarrantor.css'
import Title from "../../../components/title";
import RegisterTextbox from "../../../components/RegisterTextBox";
import CustomButton from "../../../components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import API from "../../../api/axiosConfig";
import { useParams } from "react-router";
import { Spinner } from "react-bootstrap";

function Assets({ goNextTab }) {
  const [formData, updateFormData] = useState({
    assetname: [""],
    assetcount: [""],
    assetvalue: [""],
  });
  const [assetsGroup, setAssetsGroup] = useState([{ id: 1 }]);
  const [showMinus, setShowMinus] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  // ✅ إضافة أصل جديد
  const handleAddAsset = () => {
    updateFormData((prev) => ({
      ...prev,
      assetname: [...prev.assetname, ""],
      assetcount: [...prev.assetcount, ""],
      assetvalue: [...prev.assetvalue, ""],
    }));
    setAssetsGroup((prev) => [...prev, { id: prev.length + 1 }]);
    setShowMinus(true);
  };

  // ✅ حذف آخر أصل
  const handleMinusAsset = () => {
    const newGroup = assetsGroup.slice(0, -1);
    const newNames = formData.assetname.slice(0, -1);
    const newCounts = formData.assetcount.slice(0, -1);
    const newValues = formData.assetvalue.slice(0, -1);

    setAssetsGroup(newGroup);
    updateFormData({
      ...formData,
      assetname: newNames,
      assetcount: newCounts,
      assetvalue: newValues,
    });

    if (newGroup.length <= 1) setShowMinus(false);
  };

  // ✅ تحديث القيم داخل الحقول
  const handleAssetNameChange = (index, value) => {
    const newInputs = [...formData.assetname];
    newInputs[index] = value;
    updateFormData({ ...formData, assetname: newInputs });
  };

  const handleAssetCountChange = (index, value) => {
    const newInputs = [...formData.assetcount];
    newInputs[index] = value;
    updateFormData({ ...formData, assetcount: newInputs });
  };

  const handleAssetValueChange = (index, value) => {
    const newInputs = [...formData.assetvalue];
    newInputs[index] = value;
    updateFormData({ ...formData, assetvalue: newInputs });
  };

  // ✅ إرسال البيانات
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.assetname.some((v) => v.trim() === "")) {
      setError({ assetname: "حقل البيان مطلوب" });
      setLoading(false);
      return;
    }

    if (formData.assetcount.some((v) => v === "")) {
      setError({ assetcount: "حقل عدد الأصول مطلوب" });
      setLoading(false);
      return;
    }

    if (formData.assetvalue.some((v) => v === "")) {
      setError({ assetvalue: "حقل القيمة مطلوب" });
      setLoading(false);
      return;
    }

    const assetsData = {
      assetname: formData.assetname,
      assetcount: formData.assetcount,
      assetvalue: formData.assetvalue,
    };

    try {
      const res = await API.post(
        `/feasibilitystudies/updateassets`,
        { assets: assetsData, id },
        { headers: { "Content-Type": "application/json" } }
      );
      setLoading(false);
      window.alert("تم حفظ الأصول بنجاح");
      goNextTab();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      <Title
        title="إضافة الأصول الثابتة"
      
        icon={<FontAwesomeIcon icon={faHandHoldingDollar} />}
      />
      <div className="statementofaccount">
        <div className="statementofaccountForm">
          <div className="titleaddcon">
            <h5>
              إضافة أصل
              <span
                className="addillness addillness2"
                onClick={handleAddAsset}
                style={{
                  cursor: "pointer",
                  borderRadius: "20px",
                  color: "green",
                  marginLeft: "10px",
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </span>
              {showMinus && (
                <span
                  className="addillness addillness2"
                  onClick={handleMinusAsset}
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

          {assetsGroup.map((item, index) => (
            <div className="warrantorRow" key={item.id}>
              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id={`assetname-${item.id}`}
                label="البيان"
                type="text"
                stylee={{ width: "45%" }}
                value={formData.assetname[index]}
                onChange={(e) => handleAssetNameChange(index, e.target.value)}
              />
              {error.assetname && <span className="error">{error.assetname}</span>}

              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id={`assetcount-${item.id}`}
                label="عدد الأصول"
                type="number"
                stylee={{ width: "45%" }}
                value={formData.assetcount[index]}
                onChange={(e) => handleAssetCountChange(index, e.target.value)}
              />
              {error.assetcount && <span className="error">{error.assetcount}</span>}

              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id={`assetvalue-${item.id}`}
                label="القيمة"
                type="number"
                stylee={{ width: "45%" }}
                value={formData.assetvalue[index]}
                onChange={(e) => handleAssetValueChange(index, e.target.value)}
              />
              {error.assetvalue && <span className="error">{error.assetvalue}</span>}
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

export default Assets;
