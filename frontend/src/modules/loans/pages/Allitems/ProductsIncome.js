import Title from "../../../../components/title";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import CustomButton from "../../../../components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import API from "../../../../api/axiosConfig";
import { useParams , useNavigate } from "react-router";
import { Spinner } from "react-bootstrap";

function ProductsIncome() {
  const [formData, setFormData] = useState({
    productname: [""],
    productcost: [""],
    sell: [""],
    productphone: [""],
    income: [""],
    netincome: [""],
  });

  const [productGroup, setProductGroup] = useState([{ id: 1 }]);
  const [showMinus, setShowMinus] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ إضافة منتج جديد
  const handleAddProduct = () => {
    setFormData((prev) => ({
      ...prev,
      productname: [...prev.productname, ""],
      productcost: [...prev.productcost, ""],
      sell: [...prev.sell, ""],
      productphone: [...prev.productphone, ""],
      income: [...prev.income, ""],
      netincome: [...prev.netincome, ""],
    }));
    setProductGroup((prev) => [...prev, { id: prev.length + 1 }]);
    setShowMinus(true);
  };

  // ✅ حذف آخر منتج
  const handleMinusProduct = () => {
    const newGroup = productGroup.slice(0, -1);
    const updatedData = {
      productname: formData.productname.slice(0, -1),
      productcost: formData.productcost.slice(0, -1),
      sell: formData.sell.slice(0, -1),
      productphone: formData.productphone.slice(0, -1),
      income: formData.income.slice(0, -1),
      netincome: formData.netincome.slice(0, -1),
    };

    setFormData(updatedData);
    setProductGroup(newGroup);
    if (newGroup.length <= 1) setShowMinus(false);
  };

  // ✅ تحديث القيم
  const handleChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  // ✅ حفظ البيانات
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});

    // تحقق من أن كل القيم مطلوبة
    if (formData.productname.some((v) => v.trim() === "")) {
      setError({ productname: "اسم المنتج مطلوب" });
      setLoading(false);
      return;
    }

    if (formData.productcost.some((v) => v === "")) {
      setError({ productcost: "تكلفة المنتج مطلوبة" });
      setLoading(false);
      return;
    }

    const productsData = {
      productname: formData.productname,
      productcost: formData.productcost,
      sell: formData.sell,
      productphone: formData.productphone,
      income: formData.income,
      netincome: formData.netincome,
    };

    try {
      const res = await API.post(
        `/feasibilitystudies/updateproductsincome`,
        { products_income: productsData, id },
        { headers: { "Content-Type": "application/json" } }
      );

      setLoading(false);
      window.alert("تم حفظ بيانات المنتجات والإيرادات بنجاح ✅");
      navigate('/loansData')
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      <Title
        title="إضافة المنتجات وإيرادها الشهري"
        
        icon={<FontAwesomeIcon icon={faHandHoldingDollar} />}
      />

      <div className="statementofaccount">
        <div className="statementofaccountForm">
          <div className="titleaddcon">
            <h5>
              إضافة منتج
              <span
                className="addillness addillness2"
                onClick={handleAddProduct}
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
                  onClick={handleMinusProduct}
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

          {productGroup.map((item, index) => (
            <div
              className="warrantorRow"
              key={item.id}
              style={{
                border: "1px solid var(--text-color)",
                borderRadius: "20px",
                padding: "20px",
                marginBottom: "15px",
              }}
            >
              <RegisterTextbox
                parentStyle={{ width: "45%" }}
                id={`product-${item.id}`}
                label="اسم المنتج"
                type="text"
                stylee={{ width: "45%" }}
                value={formData.productname[index]}
                onChange={(e) => handleChange("productname", index, e.target.value)}
              />
              {error.productname && <span className="error">{error.productname}</span>}

              <RegisterTextbox
                parentStyle={{ width: "45%" }}
                id={`productcost-${item.id}`}
                label="تكلفة المنتج"
                type="number"
                stylee={{ width: "45%" }}
                value={formData.productcost[index]}
                onChange={(e) => handleChange("productcost", index, e.target.value)}
              />
              {error.productcost && <span className="error">{error.productcost}</span>}

              <RegisterTextbox
                parentStyle={{ width: "45%" }}
                id={`sell-${item.id}`}
                label="قدرة البيع"
                type="number"
                stylee={{ width: "45%" }}
                value={formData.sell[index]}
                onChange={(e) => handleChange("sell", index, e.target.value)}
              />

              <RegisterTextbox
                parentStyle={{ width: "45%" }}
                id={`productphone-${item.id}`}
                label="سعر البيع"
                type="number"
                stylee={{ width: "45%" }}
                value={formData.productphone[index]}
                onChange={(e) => handleChange("productphone", index, e.target.value)}
              />

              <RegisterTextbox
                parentStyle={{ width: "45%" }}
                id={`income-${item.id}`}
                label="الإيراد الشهري"
                type="number"
                stylee={{ width: "45%" }}
                value={formData.income[index]}
                onChange={(e) => handleChange("income", index, e.target.value)}
              />

              <RegisterTextbox
                parentStyle={{ width: "45%" }}
                id={`netincome-${item.id}`}
                label="إجمالي الإيراد"
                type="number"
                stylee={{ width: "45%" }}
                value={formData.netincome[index]}
                onChange={(e) => handleChange("netincome", index, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* زر الحفظ */}
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

export default ProductsIncome;
