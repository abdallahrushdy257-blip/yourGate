import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import { t } from "i18next";
import "./moneyreceiptreports.css";
import {
  faFileExcel,
  faFileInvoice,
  faFileInvoiceDollar,
  faPlus,
  faPrint,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import SelectComponent from "../../components/SelectComponent";
import AccountingTable from "../../components/AccountingTable";
import RegisterTextbox from "../../components/RegisterTextBox";
import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

function Moneyreceiptreports() {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const token = localStorage.getItem("authToken");

  const [level4Accounts, setLevel4Accounts] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accountsData, setAccountsData] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    invoice_number: "",
    payment_account_id: "",
    receiver_account_id: "",
    value: "",
  });

  const [tableData, setTableData] = useState([]);

  return (
    <>
      <Title
        title={t("money_receipt_report")}
        icon={<FontAwesomeIcon icon={faFileInvoiceDollar} />}
      />
      <div className="moneyreceiptreports">
        <div className="Moneyreceiptreports-form">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <RegisterTextbox
              parentStyle={{ width: "100%" }}
              id="searchBox"
              type="text"
            />
          </div>
          <RegisterTextbox
            parentStyle={{ width: "13%" }}
            id="fromDate"
            label={t("from")}
            type="date"
          />
          <RegisterTextbox
            parentStyle={{ width: "13%" }}
            id="toDate"
            label={t("to")}
            type="date"
          />
        </div>

        <div className="icons-Excel">
          <div className="btn-Moneyreceiptreports-form">
            <span className="add-row-ta" onClick={handleShowModal}>
              <FontAwesomeIcon icon={faPlus} /> {t("new_invoice")}
            </span>
          </div>
          <span className="export-icon">
            <FontAwesomeIcon icon={faFileExcel} title={t("export_to_excel")} />
          </span>

          <span className="print-icon">
            <FontAwesomeIcon icon={faPrint} title={t("print_report")} />
          </span>
        </div>
        <div className="Moneyreceiptreports-table">
          <AccountingTable
            data={tableData}
            columns={[
              { key: "id", name: t("serail-number") },
              { key: "user", name: t("client_name") },
              { key: "invoisnum", name: t("invoice_number") },
              { key: "numtranzaction", name: t("transaction_number") },
              { key: "date", name: t("date") },
              { key: "value", name: t("amount") },
            ]}
            tableContainerClass="table-Moneyreceiptreports"
          />
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="Moneyreceiptreports-modal"
      >
        <Modal.Header>
          <Modal.Title>
            {t("money_receipt_invoice")}
            <FontAwesomeIcon icon={faFileInvoice} className="transfer-ic" />
          </Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={handleCloseModal}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="Moneyreceiptreports-mainform">
            <div className="Moneyreceiptreports-formbody">
              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id="date"
                label={t("date")}
                type="date"
                name="date"
                value={formData.date}
              />
              <SelectComponent
                placeholder={t("Choose-Account-Receivable")}
                label={t("Choose-Account-Receivable")}
                containerStyle={{ width: "30%" }}
                options={level4Accounts}
                name="payment_account_id"
                value={formData.payment_account_id}
              />

              <SelectComponent
                placeholder={t("account_name")}
                label={t("account_name")}
                containerStyle={{ width: "30%" }}
                options={level4Accounts}
                name="receiver_account_id"
                value={formData.receiver_account_id}
              />
            </div>
            <div className="Moneyreceiptreports-formbody formbody2">
              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id="invoiceNumber"
                label={t("invoice_number")}
                type="text"
                name="invoice_number"
                value={formData.invoice_number}
              />
              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                id="amount"
                label={t("amount")}
                type="number"
                name="value"
                value={formData.value}
              />
            </div>
          </div>
          <div className="Moneyreceiptreports-formbody">
            <RegisterTextbox
              parentStyle={{ width: "30%" }}
              id="receivedAmount"
              label={t("received_amount")}
              type="number"
            />
            <RegisterTextbox
              parentStyle={{ width: "30%" }}
              id="receivedBy"
              label={t("received_by")}
              type="text"
            />
          </div>
          <div className="Moneyreceiptreports-formbody">
            <img
              className="barCode-"
              src="https://i.pinimg.com/564x/5a/b4/fe/5ab4fec6fe13a25fb4649c2385245485.jpg"
              alt="bar"
            />
            <RegisterTextbox
              parentStyle={{ width: "30%" }}
              id="against"
              label={t("against")}
              type="text"
            />
            <RegisterTextbox
              parentStyle={{ width: "30%" }}
              id="amount_in_words"
              label={t("amount_in_words")}
              type="text"
            />
          </div>
          <div className="Moneyreceiptreports-formbody">
            <RegisterTextbox
              parentStyle={{ width: "30%" }}
              id="on_account_of"
              label={t("on_account_of")}
              type="text"
            />
            <SelectComponent
              label={t("payment_method")}
              containerStyle={{
                width: "30%",
              }}
              placeholder={t("payment_method")}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {t("close")}
          </Button>
          <Button variant="secondary">{t("save")}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Moneyreceiptreports;
