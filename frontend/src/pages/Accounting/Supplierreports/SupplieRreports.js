import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectComponent from "../../../components/SelectComponent";
import Title from "../../../components/title";
import {
  faReceipt,
  faXmark,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";

import RegisterTextbox from "../../../components/RegisterTextBox";
import CustomButton from "../../../components/CustomButton";
import "../AccountingEntry/AccountingEntry.css";
import "../CustomerReport/CustomerReport.css";
import Tablecomponent from "../../../components/TableComponent";
import API from "../../../api/axiosConfig";

function SupplieRreports() {
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [supplierData, setSupplierData] = useState({
    name: "",
    phone: "",
    email: "",
    balance: 0,
    description: "",
  });
  const [formMessage, setFormMessage] = useState("");
  const [closeModal, setcloseModal] = useState(false);

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
    formData.append("name", supplierData.name);
    formData.append("phone", supplierData.phone);
    formData.append("email", supplierData.email);
    formData.append("balance", supplierData.balance);
    formData.append("description", supplierData.description);
    formData.append("type", 2);
    try {
      const response = await API.post("/vendor/vendorstore", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      setShowAddSupplierModal(false);
    } catch (error) {
      console.error("Error adding supplier:", error);
      setFormMessage(error.response.data.message);
    }
  };

  return (
    <>
      <Title
        title="تقرير الموردين"
        icon={<FontAwesomeIcon icon={faReceipt} />}
      />
      <div className="CustomerReport">
        <div className="form-CustomerReport">
          <div className="add-clint-btn-con">
            <button
              onClick={() => setShowAddSupplierModal(true)}
              className="addrowInvoice"
            >
              اضافة مورد
            </button>
          </div>

          <SelectComponent
            label="اسم المورد"
            placeholder="supplierName"
            containerStyle={{ width: "20%" }}
          />
        </div>
      </div>

      <div className="table-rportconyaner">
        <Tablecomponent apiUrl={"/vendor/"} columns={columns} search={false} />
      </div>

      <Modal
        show={showAddSupplierModal}
        onHide={() => {
          setShowAddSupplierModal(false);
          setFormMessage("");
          setSupplierData({
            name: "",
            phone: "",
            email: "",
            balance: 0,
            description: "",
          });
        }}
        centered
        size="lg"
        className="add-client-modal"
      >
        <Modal.Header className="head-dedtal">
          <Modal.Title className="modal-title-custom  tableEntry">
            اضافة مورد
            <FontAwesomeIcon icon={faPlusSquare} className="icon-addclint" />
          </Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            // onClick={closeModal}
            onClick={() => setShowAddSupplierModal(false)}
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
                  label="اسم المورد"
                  type="text"
                  value={supplierData.name}
                  required
                  onChange={(e) =>
                    setSupplierData({ ...supplierData, name: e.target.value })
                  }
                />

                <RegisterTextbox
                  id="phone"
                  label="رقم الجوال"
                  type="tel"
                  value={supplierData.phone}
                  required
                  onChange={(e) =>
                    setSupplierData({ ...supplierData, phone: e.target.value })
                  }
                />

                <RegisterTextbox
                  id="email"
                  label="البريد الإلكتروني"
                  type="email"
                  value={supplierData.email}
                  required
                  onChange={(e) =>
                    setSupplierData({ ...supplierData, email: e.target.value })
                  }
                />

                <RegisterTextbox
                  id="balance"
                  label="الرصيد"
                  type="number"
                  value={supplierData.balance}
                  required
                  onChange={(e) =>
                    setSupplierData({
                      ...supplierData,
                      balance: e.target.value,
                    })
                  }
                />
              </div>
              <div className="input-des-addsupplier">
                <RegisterTextbox
                  id="description"
                  label="الوصف"
                  type="text"
                  value={supplierData.description}
                  parentStyle={{ width: "100%" }}
                  stylee={{ width: "100%" }}
                  required
                  onChange={(e) =>
                    setSupplierData({
                      ...supplierData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <CustomButton text="حفظ" type="submit" onClick={addclint} />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default SupplieRreports;
