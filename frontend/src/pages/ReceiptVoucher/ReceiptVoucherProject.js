import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
import "./ReceiptVoucher.css";
import { Form , Spinner } from "react-bootstrap";
import CustomButton from "../../components/CustomButton";
import RegisterSelect from "../../components/RegisterSelect";
import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { useNavigate , useParams } from "react-router";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";

function ReceiptVoucherProject(props) {

  const barcodeRef = useRef(null);
  const navigate = useNavigate('/')
  const [selectedPay, setSelectedPay] = useState({ value: "", name: "" });
  const [donor , setDonor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date , setDate] = useState(new Date().toISOString().substr(0, 10));
  const [amount , setAmount] = useState(0);
  const [selDonor , setSelDonor] = useState('');
  const [type , setType] = useState(0);
  const [error , setError] = useState([]);
  const [message , setMessage] = useState([]);
  const [isSubmitting , setIsSubmitting] = useState(false);
  const {id} = useParams();
  const [account , setAccount] = useState([]);
  const [debt , setDebt] = useState('');
  const [rows, setRows] = useState([]);

  
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
      const res = await API.post("/shoptransaction/storerecprojects", {
        amount: amount,
        seldonor: selDonor,
        type: type,
        date: date,
        project_id: id,
        account: debt,
        balanceid: rows && rows.accounts_id ? rows.accounts_id : 0,
      });
      const data = await res;  
      if (data.status === 200) {
        navigate(`/projectStatus`);
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

const getDoner = async () => {
  try {
    const res = await API.post("/donor");
    const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
    setDonor(Array.isArray(list) ? list : []);
  } catch (error) {
    console.error(error);
    setDonor([]);
  }
};

const getAccount = async () => {
  try {
    const res = await API.get("/transactions/components/donations");
    const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
    setAccount(Array.isArray(list) ? list : []);
  } catch (error) {
    console.error(error);
    setAccount([]);
  }
};

const getProject = async () => {
  try {
    const response = await API.get(`/projects/${id}`);
    const projectData = response.data?.data || response.data || {};
    setRows(projectData);
  } catch (error) {
    console.log(error);
    setRows({});
  }
};
 
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    await Promise.allSettled([getDoner(), getAccount(), getProject()]);
    setLoading(false);
  };
  fetchData();
}, [id]);
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
             
               <div style={{    display: 'flex',width: '30%',flexDirection: 'column', marginBottom: '10px'}}>
                <p style={{marginBottom: '5px'}}>تاريخ السند</p>
                
              <input
                type="date"
                id="date"
                onChange={(e) => setDate(e.target.value)}
                value={date}
                className="custom-datepicker"
                style={{ width: "100%" }}
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
                min={1}
              />
              {error && error.amount && <div className="error">{error.amount}</div>}
            </div>
             <div className="vouHead">{rows && rows.paymenttype == 0 ? 'يجب دفع قمية السهم او مضاعفاته و التي تساوي ' + rows.moneyamount : ''}</div>
            <div className="vouHead">

              <RegisterSelect
                id="acc"
                label="إختر حساب القبض"
                stylee={{
                  width: "35% !important",
                }}
                parentStyle={{
                  width: "30%",
                  marginBottom: "20px",
                }}
                options={[
                  { value: "", label: "إختر الحساب" },
                  ...(Array.isArray(account) ? account : []).map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))
                ]}
                value={debt}
                onChange={(e) => setDebt(e.target.value)}
              />
              {error && error.debt && <div className="error">{error.debt}</div>}

              <RegisterSelect
                id="benf"
                label="المانح"
                stylee={{
                  width: "35% !important",
                }}
                parentStyle={{
                  width: "30%",
                  marginBottom: "20px",
                }}
                options={[
                  { value: "", label: "إختر المانح" },
                  { value: "0", label: "لا يوجد المانح" },
                  ...(Array.isArray(donor) ? donor : []).map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))
                ]}
                name="seldonor"
                value={selDonor}
                onChange={(e) =>  setSelDonor(e.target.value) }
              />
              {error && error.seldonor && <div className="error">{error.seldonor}</div>}
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
                onChange={(e) => setType(e.target.value)} />
                  {error && error.type && <div className="error">{error.type}</div>}
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="badget"
                label=" الوصف"
                type="text"
                stylee={{
                  width: "35%",
                }}
              />
            </div>
          </div>
          <div className="signatureCon1">
             


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

export default ReceiptVoucherProject;
