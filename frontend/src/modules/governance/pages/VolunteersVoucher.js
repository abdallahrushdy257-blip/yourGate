import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "./../../../components/title";
import { faFileInvoice, faPlus } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "./../../../components/RegisterTextBox";
import { Form , Spinner } from "react-bootstrap";
import CustomButton from "./../../../components/CustomButton";
import RegisterSelect from "./../../../components/RegisterSelect";
import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { useNavigate, useParams } from "react-router";
import API from "./../../../api/axiosConfig";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

function VolunteersVoucher(props) {

  const barcodeRef = useRef(null);
  const navigate = useNavigate('/')
  const [hasTax, setHasTax] = useState(false);
  const handleTaxChange = (e) => {
    setHasTax(e.target.value === "yes");
  };

  const [selectedAccount, setSelectedAccount] = useState({ value: "", name: "" });
  const [selectedPay, setSelectedPay] = useState({ value: "", name: "" });
  const [money, setMoney] = useState("");
  const [tax, setTax] = useState("");
  const [humancases, setHumancases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [amount, setAmount] = useState(0);
  const [selHumancases, setSelHumancases] = useState('');
  const [type, setType] = useState(0);
  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);
  const { id } = useParams();
 const [isSubmitting , setIsSubmitting] = useState(false);
  const [account, setAccount] = useState([]);
  const [cridet, setCridet] = useState('');
  const [rows, setRows] = useState([]);
  const [note, setNote] = useState('');

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

  



  const getAccount = async () => {
      try {
        const res = await API.get("/transactions/components/donations");
        const data = await res;
        console.log(data);
        setAccount(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
    
      }
    };



  useEffect(() => {
    getAccount();
  }, []);

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
      const res = API.post("volunteers/voucher/payment", {
        amount: amount,
        type: type,
        date: date,
        volunteer_id: id,
        account: cridet,
        notes:note
      });
      const data = await res;
      if (data.status === 200) {
        navigate(`/hrreport/volunteers`);
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

  console.log(type)
  return (
    loading ? <TestPreLoader /> :
      <>
        <div className="ReceiptVoucher">
          <Title
            title="سند صرف"
            icon={<FontAwesomeIcon icon={faFileInvoice} />}
          />
          <Form onSubmit={handleSubmit}>
            <div className="ReceiptContainer">

              <div className="vouHead">
               
                 <div style={{    display: 'flex',width: '30%',flexDirection: 'column', marginBottom: '10px'}}>
                <p>تاريخ السند</p>
                
              <input
                type="date"
                id="date"
                onChange={(e) => setDate(e.target.value)}
                value={date}
                className="custom-datepicker"
                style={{ width: "100%" }}
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
                  min={1}
                />
                {error && error.amount && <span className="error">{error.amount}</span>}

              </div>
              <div className="vouHead">
                <RegisterSelect
                  id="acc"
                  label="الحساب المدفوع عليه"
                  stylee={{
                    width: "35% !important",
                  }}
                  parentStyle={{
                    width: "30%",
                    marginBottom: "20px",
                  }}
                  options={[
                    { value: "", label: "إختر الحساب" },
                    ...account.map((account) => ({
                      value: account.id,
                      label: account.name,
                    }))
                  ]}
                  value={cridet}
                  onChange={(e) => setCridet(e.target.value)}
                />
                {error && error.cridet && <span className="error">{error.cridet}</span>}
                
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
                  // value={selectedPay}
                  onChange={(e) => setType(e.target.value)}
                  name="type"
                  value={type}
                />
                {error && error.type && <span className="error">{error.type}</span>}
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
                    onChange={(e) => setNote(e.target.value)}
                    name="note"
                    value={note}
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
         isSubmitting ? <Spinner animation="border" variant="primary" style={{display:'block' , margin:'auto' }}/> :
         <div className="signaturebuttonCon">
            <CustomButton text="إدفع الآن" />
          </div>}
          </Form>
        </div>
      </>
  );
}

export default VolunteersVoucher;
