import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import { faFileInvoice, faPlus } from "@fortawesome/free-solid-svg-icons";
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
import { text } from "@fortawesome/fontawesome-svg-core";
//import { set } from "react-datepicker/dist/date_utils";

function DonerReceiptVoucher(props) {
  const barcodeRef = useRef(null);
  const navigate = useNavigate("/");
  const [selectedAccount, setSelectedAccount] = useState({
    value: "",
    name: "",
  });
  const [selectedPay, setSelectedPay] = useState({ value: "", name: "" });
  const [money, setMoney] = useState("");
  const [donor, setDonor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState(0);
  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [account, setAccount] = useState([]);
  const [debt, setDebt] = useState("");
  const [description, setDescription] = useState("");
  const [code , setCode] = useState("");

  // useEffect(() => {

  //   const barcodeNum = "442002";
  //   if (barcodeRef.current && loading === false) {
  //     JsBarcode(barcodeRef.current, barcodeNum, {
  //       format: "CODE128",
  //       displayValue: false,
  //       fontSize: 14,
  //     });
  //   }
  // }, [loading]);
  useEffect(() => {
    // const qrValue = `Voucher ID: ${id} | Amount: ${amount} | Date: ${date}`;
  const qrValue = `${window.location.origin}/voucher/${id}`;
    if (barcodeRef.current && loading === false) {
      window.QRCode.toCanvas(
        barcodeRef.current,
        qrValue,
        { width: 120, margin: 1 },
        function (error) {
          if (error) console.error(error);
        }
      );
    }
  }, [loading, id, amount, date]);
  const [hasTax, setHasTax] = useState(false);
  const handleTaxChange = (e) => {
    setHasTax(e.target.value === "yes");
  };

  const [paymentType, setPaymentType] = useState("");
  const [paymentTypeError, setPaymentTypeError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!selectedPay) {
      setPaymentTypeError("يجب اختيار نوع الحالة");
      return;
    } else {
      setPaymentTypeError("");
    }
    try {
      const res = await API.post("/donor/receipt", {
        amount: amount,
        date: date,
        account: debt,
        id: id,
        description: description,
        type: type,
        code: code
      });
      const data = await res;
      if (data.status === 200) {
        navigate(`/donors`);
      } else {
        setError(data.data.errors);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }

  };

  const getAccount = async () => {
    try {
      const res = await API.get("/transactions/components/donations");
      const data = await res;
      setAccount(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };


  
    const getDonor = async () => {
        try {
            const res = await API.get("/donor/" + id);
            const data = await res;
            if (data.status === 200) {
                setDonor(data.data);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getDonor();
    }, []);


  useEffect(() => {
    getAccount();
  }, []);
  return loading ? (
    <TestPreLoader />
  ) : (
    <>
      <div className="ReceiptVoucher">
        <Title
          title={` ${donor.name}  - سند قبض `}
          icon={<FontAwesomeIcon icon={faFileInvoice} />}
        />
        {/* {message && <div className="alert alert-danger">{message}</div>} */}
        <Form className="global-form-container" style={{ width: "70%" }} onSubmit={handleSubmit}>
          <div className="ReceiptContainer">
            <div className="vouHead">
              <div
                style={{
                  display: "flex",
                  width: "34%",
                  flexDirection: "column",
                  marginBottom: "20px",
                }}
              >
                <p style={{ fontWeight: "600", marginBottom: "10px" }}>تاريخ السند</p>

                <input
                  type="date"
                  id="date"
                  onChange={(e) => setDate(e.target.value)}
                  value={date}
                  className="custom-datepicker"
                />
              </div>
              {error && error.date && <div className="error">{error.date}</div>}
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="amount"
                label="المبلغ"
                type="number"
                stylee={{
                  width: "35%",
                }}
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={1}
              />
              {error && error.amount && (
                <div className="error">{error.amount}</div>
              )}
            </div>
            <div className="vouHead" style={{ width: "90%", justifyContent: "space-between" }}>
              <RegisterSelect
                id="acc"
                label="إختر حساب القبض"
                stylee={{
                  width: "30% !important",
                }}
                parentStyle={{
                  width: "35%",
                  marginBottom: "20px",
                  marginRight: "13%",
                }}
                options={[
                  { value: "", label: "إختر الحساب" },
                  ...account.map((item) => ({
                    value: item.id,
                    label: item.name ,
                  })),
                ]}

                value={debt}
                onChange={(e) => setDebt(e.target.value)}
              />


              <RegisterSelect
                id="location"
                label="نوع التحويل"
                stylee={{
                  width: "30% !important",
                }}
                parentStyle={{
                  width: "35%",
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
                name="type"
                onChange={(e) => {
                  setType(e.target.value);
                }}
              />

            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              {error && error.account && <span className="error">{error.account}</span>}
              {error && error.type && <span className="error" style={{ width: "100%" }}>{error.type}</span>}
            </div>
            <div className="vouHead">


              <RegisterTextbox
                parentStyle={{
                  width: "35%",
                }}
                id="badget"
                label="الوصف"
                type="text"
                stylee={{
                  width: "35%",
                }}
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}

              />
                <RegisterSelect
                id="donationType"
                label=" نوع التبرع"
                stylee={{
                  width: "30% !important",
                }}
                parentStyle={{
                  width: "35%",
                }}
                options={[
                  { value: "", label: "إختر النوع" },
                  { value: "31201001", label: "تبرع عام" },
                  { value: "31101", label: "زكاة" },
                  { value: "31201003", label: "كفارة" },

                ]}
                name="code"
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />

            </div>
          </div>
          <div className="signatureCon1">
            {/* <svg ref={barcodeRef}></svg> */}
                        <canvas ref={barcodeRef}></canvas>
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
              <CustomButton text="إستلام الآن" className="mb-3" />
            </div>
          )}
        </Form>
      </div>
    </>
  );
}

export default DonerReceiptVoucher;
