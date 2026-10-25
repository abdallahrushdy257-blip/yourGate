import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import {
  faFileInvoiceDollar,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import "./ReceiptVoucher.css";
import { useEffect, useRef, useState, useContext } from "react";
import JsBarcode from "jsbarcode";
import PrintHead from "../../components/PrintHead";
import PrintFooter from "../../components/PrintFooter";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import { useParams } from "react-router";
import { AppContext } from "../../context/AuthContext";
import { toArabicWord } from "number-to-arabic-words/dist/index-node.js";
import RegisterTextbox from "../../components/RegisterTextBox";
import { use } from "react";

function ReceiptVoucherView(props) {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const { user } = useContext(AppContext);
  const getRecieveVoucher = async () => {
    try {
      const response = await API.get(`/shoptransaction/${id}/shop/showrec`);
      const data = await response;
      setRows(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.response.data.errors);
    }
  };

  const barcodeRef = useRef(null);

  useEffect(() => {
    const newBarcode =
      rows && rows.invoice_number ? rows.invoice_number : "442002";

    if (barcodeRef.current && loading === false) {
      JsBarcode(barcodeRef.current, newBarcode, {
        format: "CODE128",
        displayValue: true,
      });
    }
  }, [loading]);

  useEffect(() => {
    getRecieveVoucher();
  }, []);

  return loading ? (
    <TestPreLoader />
  ) : (
    <>
      <Title
        title="سند قبض"
        icon={<FontAwesomeIcon icon={faFileInvoiceDollar} />}
      />

      <div className="moneycontainer mt-5">
        <div className="no-screen print-only">
          <PrintHead title="سند قبض" />
        </div>

        <button
          className="printmoneybtn no-print"
          onClick={() => window.print()}
        >
          <FontAwesomeIcon className="printmoney" icon={faPrint} />
        </button>
        <fieldset className="ssss p-4 custom-fieldset print-voucher-fieldset">
          <div className="form_barcode">
            <div className="badll">
              <div>
                <svg ref={barcodeRef} className="barcodoo"></svg>
                {/* Barcode */}
              </div>
            </div>

            <div className="form_barcode_textbox">
              <div className="receipt-row-group">
                <div className="receipt-item">
                  <span className="receipt-label">المبلغ المستلم:</span>
                  <span className="receipt-value">
                    {rows && rows.amount} ريال
                  </span>
                </div>
                <div className="receipt-item">
                  <span className="receipt-label">بواسطة:</span>
                  <span className="receipt-value">
                    {user && user.user.name}
                  </span>
                </div>
              </div>

              <div className="receipt-row-group">
                <div className="receipt-item">
                  <span className="receipt-label">مقابل:</span>
                  <span className="receipt-value">
                    {rows && rows.description}
                  </span>
                </div>
                <div className="receipt-item">
                  <span className="receipt-label">المبلغ بالأحرف:</span>
                  <span className="receipt-value">{`${toArabicWord(parseInt(rows && rows.amount))} ريال سعودي`}</span>
                </div>
              </div>

              <div className="receipt-row-group">
                <div className="receipt-item">
                  <span className="receipt-label">تاريخ التحويل:</span>
                  <span className="receipt-value">{rows && rows.date}</span>
                </div>
                <div className="receipt-item">
                  <span className="receipt-label">طريقة التحويل:</span>
                  <span className="receipt-value">
                    {rows && rows.transaction_type_string}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
        <div className="no-screen print-only">
          <PrintFooter />
        </div>
      </div>
    </>
  );
}

export default ReceiptVoucherView;
