
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import { faFileInvoice, faPlus } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../components/RegisterTextBox";
import "../../../pages/ReceiptVoucher/ReceiptVoucher.css";
import { Form , Spinner } from "react-bootstrap";
import CustomButton from "../../../components/CustomButton";
import RegisterSelect from "../../../components/RegisterSelect";
import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { useNavigate , useParams } from "react-router";
import API from "../../../api/axiosConfig";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

//import { set } from "react-datepicker/dist/date_utils";

function WarrantorsPayments(props) {

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
  const [laons , setLaons] = useState([]);


  useEffect(() => {
    const barcodeNum = '442002';
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, barcodeNum, {
        format: "CODE128",
        displayValue: false,
        fontSize: 14,
      });
    }
  }, []);

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
      const res = await API.post("/receiptorg/affiliate/store", {
        amount: amount,
        type: type,
        description: description,
        date: date,
        fromaccount: debt,
        toaccount: cridet,
        id: id
      });
      const data = await res;  
      if (data.status === 200) {
        navigate(`/warrantors`);
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
    setLoading(false);
  } catch (error) {
    console.error(error);

  }
};

const getAllLaons = async () => {
  try {
    const res = await API.get("/loans/allcases");
    const data = await res;
    setLaons(data.data);
    setLoading(false);
  } catch (error) {
    console.error(error);

  }
};
 
useEffect(() => {
  getAccount();
  getAllLaons();
}, []);
  return (
    loading ? <TestPreLoader /> :
    <>
    
      <div className="ReceiptVoucher">
        <Title
          title="سند قبض"
          icon={<FontAwesomeIcon icon={faFileInvoice} />}
        />
        {/* {message && <div className="alert alert-danger">{message}</div>} */}
        <Form onSubmit={handleSubmit}>

          <div className="ReceiptContainer">
            <div className="vouHead">
              
              <div style={{    display: 'flex',width: '34%',flexDirection: 'column',}}>
                <p>تاريخ السند</p>
                
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
                  width: "30%",
                }}
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {error && error.amount && <div className="error">{error.amount}</div>}
            </div>
            <div className="vouHead">

              <RegisterSelect
                id="acc"
                label="من حساب القبض"
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
                value={debt}
                onChange={(e) => setDebt(e.target.value)}
              />
              {error && error.debt && <div className="error">{error.debt}</div>}
              <RegisterSelect
                id="acc"
                label="القرض"
                stylee={{
                  width: "35% !important",
                }}
                parentStyle={{
                  width: "30%",
                  marginBottom: "20px",
                }}
                options={[
                  { value: "", label: "إختر الحساب" },
                  ...laons.map((item) => ({
                    value: item.id,
                    label: item.name + " - " + item.serial,
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
            isSubmitting ? <Spinner animation="border" variant="primary" style={{display:"block" , margin:"auto"}}/> :
            <div className="signaturebuttonCon">
            <CustomButton text="إستلام الآن" className='mb-3' />
          </div>}
        </Form>
      </div>
    </>
  );
}

export default WarrantorsPayments;
