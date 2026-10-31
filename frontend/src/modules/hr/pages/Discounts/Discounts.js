import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../../components/title";
import "./Discounts.css";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import { Form, Spinner, Modal } from "react-bootstrap";
import CustomButton from "../../../../components/CustomButton";
import RegisterSelect from "../../../../components/RegisterSelect";
import RegisterRadio from "../../../../components/Radio";
import { hrService } from "../../services/hrService";

function DiscountsModal({ show, handleClose, employeeId, onSuccess }) {
  const [selectedValue, setSelectedValue] = useState("");
  const [type, setType] = useState("0");
  const [reason, setReason] = useState("");
  const [amountType, setAmountType] = useState(0);
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [error, setError] = useState({});
  const [showAward, setShowAward] = useState(true);
  const [showDeduction, setShowDeduction] = useState(false);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [account, setAccount] = useState([]);
  const [accounttree, setAccounttree] = useState("");

  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value);
    setAmountType(e.target.value);
  };

  const getAccount = async () => {
    try {
      const res = await hrService.getDonationAccounts();
      if (res.status === 200) {
        setAccount(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (show) {
      getAccount();
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const mForm = new FormData();
    mForm.append("type", type);
    mForm.append("reason", reason);
    mForm.append("amounttype", amountType);
    mForm.append("amount", amount);
    mForm.append("date", date);
    mForm.append("description", description);
    if (employeeId) {
      mForm.append("id", employeeId);
    }
    mForm.append("component", accounttree);

    try {
      const res = await hrService.createSalaryAction(mForm);
      if (res.status === 200) {
        setIsSubmitting(false);
        handleClose();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setIsSubmitting(false);
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors);
      }
    }
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setType(value);

    if (value === "0") {
      setShowAward(true);
      setShowDeduction(false);
    } else {
      setShowAward(false);
      setShowDeduction(true);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Title
            title="إضافة خصم او مكافآة"
            icon={<FontAwesomeIcon icon={faPlusCircle} />}
          />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="investigationsContainer" onSubmit={handleSubmit}>
          <div className="flex gap-8 justify-start items-center">
            <h5>النوع</h5>
            <div className="clientRadios clientRadios3">
              <RegisterRadio
                name="type"
                label="مكافآة"
                value="0"
                checked={type === "0"}
                onChange={handleTypeChange}
              />
              <RegisterRadio
                name="type"
                label="خصم"
                value="1"
                checked={type === "1"}
                onChange={handleTypeChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {showAward && (
              <RegisterSelect
                id="drop"
                label="السبب"
                stylee={{ width: "45% !important" }}
                parentStyle={{ width: "100%", marginBottom: "20px" }}
                options={[
                  { value: "0", label: "إختر المكافأة" },
                  { value: "41101002", label: "بدل السكن" },
                  { value: "41101003", label: "بدل المواصلات" },
                  { value: "41101004", label: "بدل اتصال" },
                  { value: "41101005", label: "بدل اعاشة" },
                  { value: "41101006", label: "بدل طبيعة عمل" },
                  { value: "41101007", label: "العمل الإضافي" },
                  { value: "41102001", label: "الإجازات" },
                  { value: "41102002", label: "تذاكر السفر" },
                  { value: "41102005", label: "مكافات وحوافز موسمية" },
                  { value: "41102006", label: "مكافات وحوافز سنوية" },
                  { value: "41102008", label: "مصاريف الطعام" },
                  { value: "41102009", label: "بدل اثاث" },
                  { value: "41102010", label: "مصاريف حكومية - تجديد إقامات" },
                  { value: "41102011", label: "مصاريف حكومية - تأشيرات" },
                  { value: "41102012", label: "مصاريف حكومية - نقل كفالات" },
                  { value: "41102013", label: "مصاريف حكومية - رسوم" },
                  { value: "41102014", label: "رسوم المدارس" },
                  { value: "41102015", label: "ملابس العمال الموحد" },
                  { value: "41102019", label: "بدل الانتداب" },
                  { value: "41102020", label: "تعويضات نهاية الخدمة" },
                  { value: "42301002", label: "مصاريف التشغيل مزايا.وحوافز" },
                  { value: "44102", label: "مصاريف جمع الاموال مزايا وحوافز." },
                ]}
                onChange={(e) => setReason(e.target.value)}
                value={reason}
              />
            )}

            {showDeduction && (
              <RegisterSelect
                id="drop1"
                label="السبب"
                stylee={{ width: "45% !important" }}
                parentStyle={{ width: "100%", marginBottom: "20px" }}
                options={[
                  { value: "0", label: "إختر الخصم" },
                  { value: "41101009", label: "خصومات الرواتب" },
                  { value: "42301006", label: "خصومات مصاريف التشغيل" },
                  { value: "44106", label: "خصومات مصاريف جمع الاموال" },
                ]}
                onChange={(e) => setReason(e.target.value)}
                value={reason}
              />
            )}
            {error?.reason && <p style={{ color: "red" }}>{error.reason}</p>}

            <RegisterTextbox
              parentStyle={{ width: "100%" }}
              id="reason"
              label="الوصف"
              type="text"
              stylee={{ width: "100%" }}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
            {error?.description && (
              <p style={{ color: "red" }}>{error.description}</p>
            )}
            <div>
              <p
                style={{
                  marginTop: "10px",
                  marginBottom: "5px",
                  textAlign: "start",
                }}
              >
                اليوم
              </p>
              <input
                type="date"
                id="date"
                onChange={(e) => setDate(e.target.value)}
                value={date}
                className="custom-datepicker"
                style={{ width: "100%", marginBottom: "15px" }}
              />
              {error?.date && <p style={{ color: "red" }}>{error.date}</p>}
            </div>

            <RegisterSelect
              id="value"
              label="القيمة"
              stylee={{ width: "45% !important" }}
              parentStyle={{ width: "100%", marginBottom: "20px" }}
              options={[
                { value: "default", label: "إختر الحالة" },
                { value: "0", label: "الأيام" },
                { value: "1", label: "المال" },
              ]}
              onChange={handleSelectChange}
              value={amountType ? amountType : "default"}
            />

            {selectedValue === "0" && (
              <RegisterTextbox
                parentStyle={{ width: "100%" }}
                id="days"
                label="عدد الأيام"
                type="number"
                stylee={{ width: "100%" }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            )}
            {selectedValue === "1" && (
              <RegisterTextbox
                parentStyle={{ width: "100%" }}
                id="money"
                label="قيمة المال"
                type="number"
                stylee={{ width: "100%" }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            )}
            {error?.amount && <p style={{ color: "red" }}>{error.amount}</p>}

            {showAward && (
              <RegisterSelect
                id="value"
                label="حساب ترحيل الراتب"
                stylee={{ width: "45% !important" }}
                parentStyle={{ width: "100%", marginBottom: "20px" }}
                options={[
                  { value: "0", label: "إختر حساب الترحيل" },
                  ...account.map((acc) => ({
                    value: acc.id,
                    label: acc.name,
                  })),
                ]}
                onChange={(e) => setAccounttree(e.target.value)}
                value={accounttree}
              />
            )}

            {showDeduction && (
              <RegisterSelect
                id="value"
                label="حساب الترحيل"
                stylee={{ width: "45% !important" }}
                parentStyle={{ width: "100%", marginBottom: "20px" }}
                options={[
                  { value: "0", label: "إختر حساب الترحيل" },
                  {
                    value: "9e5000f6-d504-42c0-8562-a010a116bf50",
                    label: "الرواتب والأجور النقدية",
                  },
                  {
                    value: "9e50010a-9984-4062-b3ab-9facd6849180",
                    label: "مصاريف التشغيل المحمله على النشاط",
                  },
                  {
                    value: "9e50010e-6ab8-4e88-b916-d593124ed685",
                    label: "مصاريف جمع الاموال",
                  },
                ]}
                onChange={(e) => setAccounttree(e.target.value)}
                value={accounttree}
              />
            )}
            {error?.component && (
              <p style={{ color: "red" }}>{error.component}</p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            {isSubmitting ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <CustomButton text="حفظ" className="addClientBtn" type="submit" />
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default DiscountsModal;
