import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { Form, Spinner } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";

import Title from "../../../../components/title";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import RegisterTextarea from "../../../../components/RegisterTextarea";
import RegisterSelect from "../../../../components/RegisterSelect";
import CustomButton from "../../../../components/CustomButton";

import { marketingService } from "../../services/marketingService";
import "./MarketingDesignProjectManagement.css";

function MarketingDesignProjectManagement() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dateoflaunch, setDateoflaunch] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [deadline, setDeadline] = useState(
    new Date().toISOString().substr(0, 10)
  );

  const [total, setTotal] = useState(0);
  const [error, setError] = useState([]);
  const [marketingmethod, setMarketingmethod] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [accounttree, setAccounttre] = useState("");

  const navigate = useNavigate();

  const handleTotalCostChange = (e) => {
    setTotal(Number(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    const mForm = new FormData();
    mForm.append("name", name);
    mForm.append("description", description);
    mForm.append("dateoflaunch", dateoflaunch);
    mForm.append("deadline", deadline);
    mForm.append("total", total);
    mForm.append("marketingmethod", marketingmethod);
    mForm.append("accounttree", accounttree);

    try {
      const res = await marketingService.createProject(mForm);
      if (res.status === 200) {
        navigate("/projectStatus");
      }
    } catch (err) {
      setIsSubmit(false);
      setError(err?.response?.data?.errors || {});
    }
  };

  return (
    <div className="marketingdesignprojectmanagement">
      <Title
        title="إنشاء مشروع جديد"
        className="marketingtitle"
        icon={<FontAwesomeIcon icon={faBullhorn} />}
      />
      <Form
        onSubmit={handleSubmit}
        className="marketingdesignprojectmanagementForm"
        encType="multipart/form-data"
      >
        <div className="marketingdesign">
          <div className="marketInputCon">
            <RegisterTextbox
              parentStyle={{ width: "100%" }}
              id="name"
              label="إسم المشروع"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              stylee={{ width: "100%" }}
              name="name"
              error={error.name}
            />

            <RegisterTextbox
              parentStyle={{ width: "100%" }}
              id="totalCost"
              label="مبلغ الدعم الكلي"
              type="number"
              value={total}
              onChange={handleTotalCostChange}
              stylee={{ width: "100%" }}
              name="total"
              error={error.total}
            />
          </div>

          <div className="marketInputCon">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "50%",
                flexDirection: "column",
              }}
            >
              <p>تاريخ البدء</p>
              <input
                type="date"
                id="date"
                onChange={(e) => setDateoflaunch(e.target.value)}
                value={dateoflaunch}
                className="custom-datepicker"
                style={{ width: "100%" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "50%",
                flexDirection: "column",
              }}
            >
              <p>تاريخ الانتهاء</p>
              <input
                type="date"
                id="date"
                onChange={(e) => setDeadline(e.target.value)}
                value={deadline}
                className="custom-datepicker"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="marketInputCon">
            {error && error.dateoflaunch && (
              <span className="error">{error.dateoflaunch}</span>
            )}
            {error && error.deadline && (
              <span className="error">{error.deadline}</span>
            )}
          </div>

          <div className="marketInputCon">
            <RegisterSelect
              id="mecanism"
              label="حساب ترحيل الحالة"
              stylee={{ width: "50% !important" }}
              parentStyle={{ width: "50%", marginBottom: "20px" }}
              options={[
                { value: "0", label: "إختر الحساب" },
                {
                  value: "9e5000ef-9e80-4388-b368-0b6f3e6710f6",
                  label: "تبرعات وهبات مقيدة – نقدية",
                },
                {
                  value: "9e5000f3-4d41-4579-8d16-123c5dcaacca",
                  label: "تبرعات وهبات غير مقيدة – نقدية ",
                },
              ]}
              value={accounttree}
              onChange={(e) => setAccounttre(e.target.value)}
              error={error.accounttree}
            />

            <RegisterSelect
              id="mecanism"
              label="آلية التسويق"
              stylee={{ width: "50% !important" }}
              parentStyle={{ width: "50%", marginBottom: "20px" }}
              options={[
                { value: "0", label: "إختر الآلية" },
                { value: "1", label: "المانحون" },
                { value: "2", label: "المنصات الحكومية" },
                { value: "3", label: "متاجر الجمعيات" },
              ]}
              value={marketingmethod}
              onChange={(e) => setMarketingmethod(e.target.value)}
              error={error.marketingmethod}
            />
          </div>

          <div className="marketInputCon">
            <RegisterTextarea
              label="نبذة عن المشروع"
              stylee={{ width: "100%" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              parentStyle={{ width: "100%", marginBottom: "20px" }}
              name="description"
              error={error.description}
            />
          </div>

          {isSubmit ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <div className="marketingbuttonCon">
              <CustomButton text="حفظ" />
            </div>
          )}
        </div>
      </Form>
    </div>
  );
}

export default MarketingDesignProjectManagement;

