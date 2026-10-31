
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import { faFileInvoice, faPlus } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
import "../ReceiptVoucher/ReceiptVoucher.css";
import { Form , Spinner } from "react-bootstrap";
import CustomButton from "../../components/CustomButton";
import RegisterSelect from "../../components/RegisterSelect";
import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { useNavigate , useParams } from "react-router";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";

//import { set } from "react-datepicker/dist/date_utils";

function AssociationMembersRecieve(props) {

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rows, setRows] = useState([]);
  const [account, setAccount] = useState([]);
  const [cridet, setCridet] = useState('');
  const [description, setDescription] = useState('');
useEffect(() => {
  if (!barcodeRef.current || loading) return;

  JsBarcode(barcodeRef.current, "442002", {
    format: "CODE128",
    displayValue: false,
    fontSize: 14,
    height: 60,
    width: 2,
  });
}, [loading]); // ← يرسم الباركود بعد انتهاء التحميل
 



  

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
      const res = API.post(`/receiptorg/assembly/paid/store`, {
        amount: amount,
        id: id,
        type: type,
        date: date,
        description: description,
        account: cridet
      });
      const data = await res;
      if (data.status === 200) {
        navigate(`/associationMembersReport`);
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

  useEffect(() => {
    getAccount();
  }, []);

  return (
    loading ? <TestPreLoader /> :
      <>
        <div className="ReceiptVoucher">
          <Title
            title="سند دفع مكافأة حضور اجتماع جمعية"
            icon={<FontAwesomeIcon icon={faFileInvoice} />}

          />
          <span style={{textAlign: "center" , display:"flex" , justifyContent:"center" , alignItems:"center"}}>{rows && rows.human_cases_id && rows.humans_cases_id !== 0 && rows.human_case && rows.human_case.name}</span>
          <Form onSubmit={handleSubmit}>
            <div className="ReceiptContainer">

              <div className="vouHead">
               
                <div className="mb-3" style={{ display: 'flex', width: '30%', flexDirection: 'column', }}>
                  <p style={{fontWeight: '600'}}>تاريخ السند</p>
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
                  min={1}
                />
                {error && error.amount && <span className="error">{error.amount}</span>}

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
                    ...account.map((account) => ({
                      value: account.id,
                      label: account.name,
                    }))
                  ]}
                  value={cridet}
                  onChange={(e) => setCridet(e.target.value)}
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
                  // value={selectedPay}
                  onChange={(e) => setType(e.target.value)}
                  name="type"
                  value={type}
                />
               
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                 {error && error.account && <span className="error">{error.account}</span>}
                  {error && error.type && <span className="error">{error.type}</span>}
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
                  name="description"
                  value={description}
                />
                 
              </div>
            </div>


            <div className="signatureCon1">
              {/* <img
                className="barCode"
                src="https://i.pinimg.com/564x/5a/b4/fe/5ab4fec6fe13a25fb4649c2385245485.jpg"
                alt="bar"
              /> */}


                  {/* <svg ref={barcodeRef}></svg> */}

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
                  <CustomButton text=" حفظ" />
                </div>}
          </Form>
        </div>
      </>
  );
}

export default AssociationMembersRecieve;
