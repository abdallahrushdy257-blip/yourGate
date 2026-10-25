import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
import "../ReceiptVoucher/ReceiptVoucher.css";
import { Form, Spinner } from "react-bootstrap";
import CustomButton from "../../components/CustomButton";
import RegisterSelect from "../../components/RegisterSelect";
import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { useNavigate, useParams } from "react-router";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
function EndowmentsVoucher(props) {
  const barcodeRef = useRef(null);
  const navigate = useNavigate("/");
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [account, setAccount] = useState("");
  const [type, setType] = useState(0);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [paymenttype, setPaymenttype] = useState("");

  const getAccounts = async () => {
    try {
      const res = await API.get("/transactions/components/donations");
      const data = await res;
      setRows(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
  
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  useEffect(() => {
    const barcodeNum = "442002";
    if (barcodeRef.current && loading === false) {
      JsBarcode(barcodeRef.current, barcodeNum, {
        format: "CODE128",
        displayValue: false,
        fontSize: 14,
      });
    }
  }, [loading]);

  const [paymentTypeError, setPaymentTypeError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("date", date);
    formData.append("amount", amount);
    formData.append("account", account);
    formData.append("type", type);
    formData.append("description", description);
    formData.append("id", id);
    formData.append("paymenttype", paymenttype);
    try {
      const res = await API.post("/endowments/paymentvoucher", formData);
      const data = await res;
      if (data.status === 200) {
        navigate("/paymentsDue");
      } else {
        setError(data.data.errors);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setError(error.response.data.errors);
    }
  };

  return loading ? (
    <TestPreLoader />
  ) : (
    <>
      <div className="ReceiptVoucher">
        <Title
          title="سند صرف"
          icon={<FontAwesomeIcon icon={faFileInvoice} />}
        />
        <Form onSubmit={handleSubmit}>
          <div className="ReceiptContainer">
            <div className="vouHead">
              <div
                className="mb-3"
                style={{
                  display: "flex",
                  width: "30%",
                  flexDirection: "column",
                }}
              >
                <p>تاريخ السند</p>
                <input
                  type="date"
                  id="date"
                  onChange={(e) => setDate(e.target.value)}
                  value={date}
                  className="custom-datepicker datevou"
                  style={{ width: "unSet", padding: "6px" }}
                />
              </div>
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="amount"
                label="المبلغ"
                type="number"
                stylee={{
                  width: "30%",
                }}
                min={1}
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {error && error.date && (
                <span className="error">{error.date}</span>
              )}
              {error && error.amount && (
                <span className="error">{error.amount}</span>
              )}
            </div>
            <div className="vouHead">
              <RegisterSelect
                id="acc"
                label="الحساب المدفوع منه"
                stylee={{
                  width: "35% !important",
                }}
                parentStyle={{
                  width: "30%",
                  marginBottom: "20px",
                }}
                options={[
                  { value: "", label: "إختر الحساب" },
                  ...rows.map((row) => ({ value: row.id, label: row.name })),
                ]}
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />
              <RegisterSelect
                id="location"
                label="نوع التحويل"
                stylee={{
                  width: "35% !important",
                }}
                parentStyle={{
                  width: "30%",
                  marginBottom: "20px",
                }}
                options={[
                  { value: "", label: "إختر النوع" },
                  { value: "1", label: "الشبكة" },
                  { value: "2", label: "تحويل" },
                  { value: "3", label: "إيداع" },
                  { value: "4", label: "شيك" },
                  { value: "5", label: "نقدي" },
                  { value: "6", label: "KNET" },
                ]}
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {error && error.account && (
                <span className="error">{error.account}</span>
              )}
              {error && error.type && (
                <span className="error">{error.type}</span>
              )}
            </div>

            <div className="vouHead">
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="badget"
                label=" وصف"
                type="text"
                stylee={{
                  width: "35%",
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <RegisterSelect
                id="status"
                label="نوع الصرف"
                stylee={{ width: "35%" }}
                parentStyle={{ width: "30%" }}
                options={[
                  { value: "", label: "اختر نوع الصرف" },
                  { value: "1", label: "مصاريف تشغيلية" },
                  { value: "2", label: "مصاريف وقف" },
                ]}
                value={paymenttype}
                onChange={(e) => setPaymenttype(e.target.value)}
              />
            </div>
            {error && error.description && (
              <span className="error">{error.description}</span>
            )}
            {error && error.paymenttype && (
              <div
                style={{
                  color: "red",
                  fontSize: "12px",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
              >
                {error.gender}
              </div>
            )}
          </div>

          <div className="signatureCon1">
            {/* <img
                className="barCode"
                src="https://i.pinimg.com/564x/5a/b4/fe/5ab4fec6fe13a25fb4649c2385245485.jpg"
                alt="bar"
              /> */}

            <svg ref={barcodeRef}></svg>
          </div>

          {paymentTypeError && (
            <p
              style={{
                color: "red",
                width: "85%",
                textAlign: "right",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {paymentTypeError}
            </p>
          )}
          {isSubmitting ? (
            <Spinner
              animation="border"
              variant="primary"
              style={{ display: "block", margin: "auto" }}
            />
          ) : (
            <div className="signaturebuttonCon">
              <CustomButton text="إدفع الآن" />
            </div>
          )}
        </Form>
      </div>
    </>
  );
}

export default EndowmentsVoucher;
