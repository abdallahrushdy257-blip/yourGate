import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import { faFileInvoice, faPlus } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../components/RegisterTextBox";
import "../../ReceiptVoucher/ReceiptVoucher.css";
import { Form, Spinner } from "react-bootstrap";
import CustomButton from "../../../components/CustomButton";
import RegisterSelect from "../../../components/RegisterSelect";
import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { useNavigate, useParams } from "react-router";
import RegisterRadio from "../../../components/Radio";
import API from "../../../api/axiosConfig";
import TestPreLoader from "../../TestPreLoader/TestPreLoader";

function GeneralPaymentVoucherCash(props) {

  const barcodeRef = useRef(null);
  const navigate = useNavigate('/')
  const [selectedAccount, setSelectedAccount] = useState({ value: "", name: "" });
  const [selectedPay, setSelectedPay] = useState({ value: "", name: "" });
  const [money, setMoney] = useState("");
  const [loading, setLoading] = useState(true);
  const [date , setDate] = useState(new Date().toISOString().substr(0, 10));
  const [amount , setAmount] = useState(0);
  const [selDonor , setSelDonor] = useState('');
  const [type , setType] = useState(0);
  const [error , setError] = useState([]);
  const [message , setMessage] = useState([]);
  const {id} = useParams();
  const [isSubmitting , setIsSubmitting] = useState(false);
  const [account , setAccount] = useState([]);
  const [debt , setDebt] = useState('');
  const [description , setDescription] = useState('');
  const [cridet , setCridet] = useState('');
  const [typeVoucher , setTypeVoucher] = useState(1);
  const [payableAccount , setPayableAccount] = useState([]);


  useEffect(() => {
    const barcodeNum = '442002';
    if (barcodeRef.current && loading === false) {
      JsBarcode(barcodeRef.current, barcodeNum, {
        format: "CODE128",
        displayValue: false,
        fontSize: 14,
      });
    }
  }, [loading]);

  const [hasTax, setHasTax] = useState(false);
  const handleTaxChange = (e) => {
    setHasTax(e.target.value === "yes");
  };


  const [paymentType, setPaymentType] = useState("");
  const [paymentTypeError, setPaymentTypeError] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!selectedPay) {
      setPaymentTypeError("يجب اختيار نوع الحالة");
      return;
    } else {
      setPaymentTypeError("");
    }
    try {
      const res = await API.post("/generalvoucher/storecashvoucher", {
        amount: amount,
        type: type,
        description: description,
        date: date,
        fromaccount: debt,
        toaccount: cridet,
        typevoucher: typeVoucher
      });
      const data = await res;  
      if (data.status === 200) {
        navigate(`/accountingEntry`);
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
    const res = await API.get("/generalvoucher/fromaccount");
    const data = await res;
    setAccount(data.data);
    console.log(data.data);
    setLoading(false);
  } catch (error) {
    console.error(error);

  }
};

const getPayableAccount = async () => {
  try {
    const res = await API.get("/transactions/components/donations");
    const data = await res;
    setPayableAccount(data.data);
    setLoading(false);
  } catch (error) {
    console.error(error);

  }
};
useEffect(() => {
  getAccount();
  getPayableAccount();
}, []);

  return (
    loading ? <TestPreLoader /> :
      <>
        <div className="ReceiptVoucher">
          <Title
            title="سند صرف"
            icon={<FontAwesomeIcon icon={faFileInvoice} />}

          />
          <span style={{textAlign: "center" , display:"flex" , justifyContent:"center" , alignItems:"center"}}></span>
          <Form onSubmit={handleSubmit}>
            <div className="ReceiptContainer">

              <div className="vouHead">
    
                <div className="mb-3" style={{ display: 'flex', width: '30%', flexDirection: 'column', }}>
                  <p>تاريخ السند</p>
                  <input
                    type="date"
                    id="date"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                    className="custom-datepicker datevou"
                    style={{ width: "unSet" , padding: '6px' }}

                  />
                </div>
                {error && error.date && <span className="error">{error.date}</span>}
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
                  onChange={(e) => setAmount(e.target.value)}
                  name="amount"
                  value={amount}
                />
                {error && error.amount && <span className="error">{error.amount}</span>}

              </div>
              <div className="vouHead">
                <RegisterSelect
                  id="acc"
                  label=" من حساب"
                  stylee={{
                    width: "35% !important",
                  }}
                  parentStyle={{
                    width: "30%",
                    marginBottom: "20px",
                  }}
                  options={[
                    { value: "", label: "إختر الحساب" },
                    ...payableAccount.map((account) => ({
                      value: account.id,
                      label: account.name,
                    }))
                  ]}
                  value={cridet}
                  onChange={(e) => setDebt(e.target.value)}
                />
                {error && error.cridet && <span className="error">{error.cridet}</span>}
                <RegisterSelect
                id="acc"
                label="الى حساب القبض"
                stylee={{
                  width: "35% !important",
                }}
                parentStyle={{
                  width: "30%",
                  marginBottom: "20px",
                }}
                options={[
                  { value: "", label: "إختر الحساب" },
                  ...account.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))
                ]}
                value={cridet}
                onChange={(e) => setCridet(e.target.value)}
              />
              {error && error.cridet && <div className="error">{error.cridet}</div>}
            </div>

            <div className="vouHead">

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
                name="type"
                onChange={(e) => {setType(e.target.value)}} />
                  {error && error.type && <div className="error">{error.type}</div>}
             
               <RegisterSelect
                id="donor"
                label="نوع حساب الترحيل "
                stylee={{
                  width: "35% !important",
                }}
                parentStyle={{
                  width: "30%",
                  marginBottom: "20px",
                }}
                options={[
                  { value: "", label: "إختر نوع الحساب" },
                  { value: "1", label: "مقيدة" },
                  { value: "2", label: "غير مقيدة " },
                ]}
                name="typevoucher"
                value={typeVoucher}
                onChange={(e) => {setTypeVoucher(e.target.value)}} 
                />
                {error && error.typevoucher && <div className="error">{error.typevoucher}</div>}
              </div>
               <div className="vouHead">
             
               <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="badget"
                label="الوصف"
                type="text"
                stylee={{
                  width: "35%",
                }}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
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

            {
              isSubmitting ? <Spinner animation="border" variant="primary" style={{ display: 'block', margin: 'auto' }} /> :
                <div className="signaturebuttonCon">
                  <CustomButton text="إدفع الآن" />
                </div>}
          </Form>
        </div>
      </>
  );
}

export default GeneralPaymentVoucherCash;
