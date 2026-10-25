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

function MonthlyWorking({ goNextTab }) {
  const [formData, setFormData] = useState({
    pname: [""],
    paymentfees: [""],
  });

  const [workingGroup, setWorkingGroup] = useState([{ id: 1 }]);
  const [showMinus, setShowMinus] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  // ✅ إضافة رأس مال عامل جديد
  const handleAddWorking = () => {
    setFormData((prev) => ({
      ...prev,
      pname: [...prev.pname, ""],
      paymentfees: [...prev.paymentfees, ""],
    }));
    setWorkingGroup((prev) => [...prev, { id: prev.length + 1 }]);
    setShowMinus(true);
  };

  // ✅ حذف آخر رأس مال عامل
  const handleMinusWorking = () => {
    const newGroup = workingGroup.slice(0, -1);
    const newPnames = formData.pname.slice(0, -1);
    const newFees = formData.paymentfees.slice(0, -1);

    setWorkingGroup(newGroup);
    setFormData({
      ...formData,
      pname: newPnames,
      paymentfees: newFees,
    });

    if (newGroup.length <= 1) setShowMinus(false);
  };

  // ✅ تحديث البيان
  const handleMonthlyChange = (index, value) => {
    const updated = [...formData.pname];
    updated[index] = value;
    setFormData({ ...formData, pname: updated });
  };

  // ✅ تحديث الرسوم
  const handleFeesChange = (index, value) => {
    const updated = [...formData.paymentfees];
    updated[index] = value;
    setFormData({ ...formData, paymentfees: updated });
  };

  // ✅ إرسال البيانات
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});

    // تحقق من صحة الإدخال
    if (formData.pname.some((v) => v.trim() === "")) {
      setError({ pname: "حقل البيان مطلوب" });
      setLoading(false);
      return;
    }

    if (formData.paymentfees.some((v) => v === "")) {
      setError({ paymentfees: "حقل الرسوم مطلوب" });
      setLoading(false);
      return;
    }

    const monthlyData = {
      pname: formData.pname,
      paymentfees: formData.paymentfees,
    };

    try {
      const res = await API.post(
        `/feasibilitystudies/updatemonthlyworking`,
        { monthly_working: monthlyData, id },
        { headers: { "Content-Type": "application/json" } }
      );
      setLoading(false);
      window.alert("تم حفظ رأس المال العامل بنجاح");
      goNextTab();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      <Title
        title="إضافة رأس المال العامل الشهري"
       
        icon={<FontAwesomeIcon icon={faHandHoldingDollar} />}
      />
      <div className="statementofaccount">
        <div className="statementofaccountForm">
          <div className="titleaddcon">
            <h5>
              إضافة رأس مال عامل
              <span
                className="addillness addillness2"
                onClick={handleAddWorking}
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
                  onClick={handleMinusWorking}
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

          {workingGroup.map((item, index) => (
            <div className="warrantorRow" key={item.id}>
              <RegisterTextbox
                parentStyle={{ width: "45%" }}
                id={`pname-${item.id}`}
                label="البيان"
                type="text"
                stylee={{ width: "45%" }}
                value={formData.pname[index]}
                onChange={(e) => handleMonthlyChange(index, e.target.value)}
              />
              {error.pname && <span className="error">{error.pname}</span>}

              <RegisterTextbox
                parentStyle={{ width: "45%" }}
                id={`paymentfees-${item.id}`}
                label="الرسوم"
                type="number"
                stylee={{ width: "45%" }}
                value={formData.paymentfees[index]}
                onChange={(e) => handleFeesChange(index, e.target.value)}
              />
              {error.paymentfees && <span className="error">{error.paymentfees}</span>}
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
            text={loading ? <Spinner animation="border" size="sm" /> : "حفظ البيانات"}
            onClick={handleSubmit}
            stylee={{ width: "150px", height: "40px", fontSize: "16px" }}
            disabled={loading}
          />
        </div>
      </div>
    </>
  );
}

export default MonthlyWorking;
