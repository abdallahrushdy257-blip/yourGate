import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import "./moneyreceiptreports.css";
import {
  faFileInvoiceDollar,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import SelectComponent from "../../../components/SelectComponent";
import RegisterTextbox from "../../../components/RegisterTextBox";
import { useEffect, useRef, useState, useContext } from "react";
import JsBarcode from "jsbarcode";
import { useParams } from "react-router";
import API from "../../../api/axiosConfig";
import { AppContext } from "../../../context/AuthContext";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";
import { toArabicWord } from "number-to-arabic-words/dist/index-node.js";
import PrintHead from "../../../components/PrintHead";
import PrintFooter from "../../../components/PrintFooter";
function Moneyreceiptreports() {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState({});
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  const barcodeRef = useRef(null);      
const barcodePrintRef = useRef(null);

  useEffect(() => {
  const newBarcode = rows?.invoice_number || "442002";

  if (barcodeRef.current && loading === false) {
    JsBarcode(barcodeRef.current, newBarcode, {
      format: "CODE128",
      displayValue: true,
    });
  }

  if (barcodePrintRef.current && loading === false) {
    JsBarcode(barcodePrintRef.current, newBarcode, {
      format: "CODE128",
      displayValue: true,
    });
  }
}, [loading]);

  const getTransactions = async () => {
    try {
      const res = await API.get(`/shoptransaction/${id}/assembly`);
      const data = await res;
      setLoading(false);
      setRows(data.data);
    } catch (error) {
      setError(error.response.data.errors);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);
  //console.log(user);
  return loading ? (
    <TestPreLoader />
  ) : (
    <>
      <div className="w-100 text-center">
        <PrintHead />
      </div>
      <Title
        title="سند قبض"
        // اسم المانح - سند قبض
        icon={<FontAwesomeIcon icon={faFileInvoiceDollar} />}
      />

      <div className="moneycontainer no-print">
        <button className="printmoneybtn " onClick={() => window.print()}>
          <FontAwesomeIcon className="printmoney" icon={faPrint} />
        </button>
        <fieldset className="ssss custom-fieldset">
          <div className="form_barcode">
            <div className="badll ">
              <div>
                <svg ref={barcodeRef} className="barcodoo"></svg>
                {/* Barcode */}
              </div>
            </div>

            <div className="form_barcode_textbox">
              <div className="Moneyreceiptreports-formbody">
                <RegisterTextbox
                  parentStyle={{ width: "250px" }}
                  id="receivedAmount"
                  label="المبلغ المستلم"
                  type="text"
                  value={rows && rows.amount}
                  disable={true}
                />
                <RegisterTextbox
                  parentStyle={{ width: "250px" }}
                  id="receivedBy"
                  label="بواسطة"
                  type="text"
                  value={user && user.user.name}
                  disable={true}
                />
              </div>
              <div className="Moneyreceiptreports-formbody">
                <RegisterTextbox
                  parentStyle={{ width: "250px" }}
                  id="against"
                  label="مقابل"
                  type="text"
                  value={rows && rows.description}
                />
                <RegisterTextbox
                  parentStyle={{ width: "250px" }}
                  id="amount_in_words"
                  label="المبلغ بالاحرف"
                  type="text"
                  value={`${toArabicWord(parseInt(rows && rows.amount))} ريال سعودي`}
                />
              </div>
              <div className="Moneyreceiptreports-formbody">
                <RegisterTextbox
                  parentStyle={{ width: "250px" }}
                  id="on_account_of"
                  label=" تاريخ التحويل"
                  type="text"
                  value={rows && rows.date}
                />
                <RegisterTextbox
                  parentStyle={{ width: "250px" }}
                  id="on_account_of"
                  label="طريقة التحويل"
                  type="text"
                  value={rows && rows.transaction_type_string}
                />
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      {/* عايز اعمل صفحه طباعة مخصصه فقطه للطباعه */}
      {/* ── PRINT ONLY VERSION ── */}
<div className="print-only receipt-print-container">
  <div className="receipt-print-box">

    {/* Header */}
    <div className="receipt-print-header">
      <h2>سند قبض</h2>
      <div className="receipt-invoice-num">
        رقم السند: <span>{rows?.invoice_number || "442002"}</span>
      </div>
    </div>

    {/* Barcode */}
    <div className="receipt-barcode-section">
      <svg ref={barcodePrintRef} className="barcodoo"></svg>
    </div>

    {/* Fields Grid */}
    <div className="receipt-print-grid">
      <div className="receipt-print-field">
        <span className="receipt-field-label">المبلغ المستلم</span>
        <span className="receipt-field-value">{rows?.amount} ريال</span>
      </div>
      <div className="receipt-print-field">
        <span className="receipt-field-label">بواسطة</span>
        <span className="receipt-field-value">{user?.user?.name}</span>
      </div>
      <div className="receipt-print-field">
        <span className="receipt-field-label">المبلغ بالأحرف</span>
        <span className="receipt-field-value">
          {`${toArabicWord(parseInt(rows?.amount))} ريال سعودي`}
        </span>
      </div>
      <div className="receipt-print-field">
        <span className="receipt-field-label">مقابل</span>
        <span className="receipt-field-value">{rows?.description}</span>
      </div>
      <div className="receipt-print-field">
        <span className="receipt-field-label">تاريخ التحويل</span>
        <span className="receipt-field-value">{rows?.date}</span>
      </div>
      <div className="receipt-print-field">
        <span className="receipt-field-label">طريقة التحويل</span>
        <span className="receipt-field-value">{rows?.transaction_type_string}</span>
      </div>
    </div>

    {/* Signature Row */}
    <div className="receipt-print-signatures">
      <div className="receipt-signature-box">
        <span>توقيع المستلم</span>
        <div className="receipt-signature-line"></div>
      </div>
      <div className="receipt-signature-box">
        <span>توقيع المسؤول</span>
        <div className="receipt-signature-line"></div>
      </div>
    </div>

  </div>
  </div>
      <div className="w-100">
        <PrintFooter />
      </div>
    </>
  );
}

export default Moneyreceiptreports;
