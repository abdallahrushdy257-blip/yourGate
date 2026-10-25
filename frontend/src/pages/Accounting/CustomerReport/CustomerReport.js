import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectComponent from "../../../components/SelectComponent";
import Title from "../../../components/title";
import {
  faReceipt,
  faXmark,
  faEdit,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form } from "react-bootstrap";

import "./CustomerReport.css";
import RegisterTextbox from "../../../components/RegisterTextBox";
import CustomButton from "../../../components/CustomButton";
import "../AccountingEntry/AccountingEntry.css";
import Tablecomponent from "../../../components/TableComponent";
import API from "../../../api/axiosConfig";

function CustomerReport() {
  const [customers, setCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  const [clientData, setClientData] = useState({
    name: "",
    phone: "",
    email: "",
    balance: 0,
    description: "",
  });
  const [formMessage, setFormMessage] = useState("");

  const customerOptions = Array.isArray(customers)
    ? customers.map((customer) => ({
        value: customer.id,
        label: customer.name,
      }))
    : [];

  const closeModal = () => {
    setModalOpen(false);
    setShowAddClientModal(false);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setClientData((prev) => ({
      ...prev,
      [id]: id === "balance" ? Number(value) : value,
    }));
    if (formMessage) setFormMessage("");
  };

  const columns = [
    { name: "الاسم", key: "name" },
    { name: "الهاتف", key: "phone" },
    { name: "البريد الإلكتروني", key: "email" },
    { name: "الرصيد", key: "balance" },
    { name: "الوصف", key: "description" },
  ];

  const addclint = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", clientData.name);
    formData.append("phone", clientData.phone);
    formData.append("email", clientData.email);
    formData.append("balance", clientData.balance);
    formData.append("description", clientData.description);
    formData.append("type", 1);
    try {
      const response = await API.post("/client/clientstore", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      setShowAddClientModal(false);
    } catch (error) {
      console.error("Error adding supplier:", error);
      setFormMessage(error.response.data.message);
    }
  };

  return (
    <>
      <Title
        title="تقرير العملاء"
        icon={<FontAwesomeIcon icon={faReceipt} />}
      />
      <div className="CustomerReport">
        <div className="form-CustomerReport">
          <div className="add-clint-btn-con">
            <button
              onClick={() => setShowAddClientModal(true)}
              className="addrowInvoice"
            >
              اضافة عميل
              {<FontAwesomeIcon icon={faPlusSquare} />}
            </button>
          </div>

          <SelectComponent
            label="اسم العميل"
            placeholder="اختر اسم العميل"
            options={customerOptions}
            containerStyle={{ width: "20%" }}
          />
        </div>
      </div>
      <div className="table-rportconyaner">
        <Tablecomponent apiUrl={"/client/"} columns={columns} search={false} />
      </div>

      <Modal
        show={showAddClientModal}
        onHide={() => {
          setShowAddClientModal(false);
          setFormMessage("");
          setClientData({
            name: "",
            phone: "",
            email: "",
            balance: 0,
            description: "",
          });
        }}
        centered
        className="add-client-modal"
      >
        <Modal.Header className="head-dedtal">
          <Modal.Title className="modal-title-custom  tableEntry">
            اضافة عميل جديد
            <FontAwesomeIcon icon={faPlusSquare} className="icon-addclint" />
          </Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={closeModal}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <form className="input-AddSupplier">
            <div className="row g-3">
              <div className="col-md-12">
                <RegisterTextbox
                  id="name"
                  label="اسم العميل"
                  type="text"
                  value={clientData.name}
                  onChange={handleInputChange}
                  required
                />
                {formMessage && (
                  <div
                    className={`alert ${
                      formMessage.includes("خطأ")
                        ? "alert-danger"
                        : "alert-success"
                    }`}
                  >
                    {formMessage}
                  </div>
                )}{" "}
                <RegisterTextbox
                  id="phone"
                  label="رقم الجوال"
                  type="tel"
                  value={clientData.phone}
                  onChange={handleInputChange}
                />
                <RegisterTextbox
                  id="email"
                  label="البريد الإلكتروني"
                  type="email"
                  value={clientData.email}
                  onChange={handleInputChange}
                />
                <RegisterTextbox
                  id="balance"
                  label="الرصيد الافتتاحي"
                  type="number"
                  value={clientData.balance}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-des-addclint">
                <RegisterTextbox
                  id="description"
                  label="الوصف"
                  type="text"
                  value={clientData.description}
                  onChange={handleInputChange}
                  parentStyle={{ width: "100%" }}
                  stylee={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <CustomButton
                text="حفظ"
                type="submit"
                className="px-5"
                onClick={addclint}
              />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CustomerReport;
