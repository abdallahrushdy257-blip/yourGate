import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./salesInvoice.css";

import {
  faFileInvoice,
  faTrash,
  faTrashCan,
  faXmark,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../../../components/CustomButton";
import { Form } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import SelectComponent from "../../../components/SelectComponent";
import Title from "../../../components/title";
import RegisterTextbox from "../../../components/RegisterTextBox";
import React, { useRef } from "react";
import JsBarcode from "jsbarcode";
import { useNavigate } from "react-router-dom";
import API from "../../../api/axiosConfig";

function NewSalesRefundInvoice() {
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
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState("14");
  const [finalTotal, setFinalTotal] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [isPaidValid, setIsPaidValid] = useState(true);
  const [invoiceCode, setInvoiceCode] = useState("123456");
  const navigate = useNavigate();
  const [hasDiscount, setHasDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [paymentType, setPaymentType] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const barcodeRef = useRef(null);
  const [client, setClient] = useState([]);
  const [chooseVendor, setChooseVendor] = useState("");
  const [warehousAccount, setWarehousAccount] = useState([]);
  const [warehous, setWarehous] = useState([]);
  const [date, setDate] = useState(
    new Date(new Date()).toISOString().split("T")[0],
  );
  const [barcode, setBarcode] = useState("");
  const [purchuseitem, setPurchuseitem] = useState([]);
  const [total, setTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedStore, setSelectedStore] = useState("");

  const [netTotal, setNetTotal] = useState(0);

  const handleDiscountChange = (value) => {
    console.clear();
    let finalValue = 0;
    let selectedType = discounttype;
    let discountValue = 0;

    if (selectedType === 0) {
      //percentage
      discountValue = parseFloat(value);

      var math1 = (parseFloat(grandTotal) * parseFloat(discountValue)) / 100;
      finalValue = parseFloat(parseFloat(grandTotal) - math1).toFixed(2);
    } else {
      //amount
      discountValue = parseFloat(value);
      finalValue = parseFloat(
        parseFloat(grandTotal) - parseFloat(discountValue),
      ).toFixed(2);
    }

    setNetTotal(finalValue);
    setDiscount(discountValue);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };
  // if delete we will minus total
  const handleClearRow = (index) => {
    const updatedData = [...purchuseitem];
    updatedData.splice(index, 1);
    setPurchuseitem(updatedData);
  };

  const handlePaidAmountChange = (e) => {
    const paid = parseFloat(e.target.value) || 0;
    setPaidAmount(paid);
    const remain = parseFloat(grandTotal);
    const total = parseFloat(netTotal);
    if (total == 0) {
      setRemainingBalance(remain - paid);
    } else {
      setRemainingBalance(total - paid);
    }
  };

  const handleDeleteRequest = (index) => {
    const row = purchuseitem[index];
    const isRowEmpty =
      row.item_id === null &&
      row.unit_id === null &&
      row.purchase === 0 &&
      row.quantity === 1 &&
      total === 0;

    if (isRowEmpty) {
      handleClearRow(index);
    } else {
      setRowToDelete(index);
      setShowDeleteModal(true);
    }
  };

  // barcode
  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, invoiceCode, {
        format: "CODE128",
        displayValue: true,
      });
    }
  }, []);

  const addVendor = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", supplierData.name);
    formData.append("phone", supplierData.phone);
    formData.append("email", supplierData.email);
    formData.append("balance", supplierData.balance);
    formData.append("description", supplierData.description);
    formData.append("type", 1);
    try {
      const response = await API.post("/client/clientstore", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      getAllClient();
      setShowAddSupplierModal(false);
    } catch (error) {
      console.error("Error adding supplier:", error);
      setFormMessage(error.response.data.message);
    }
  };

  const handleShowAddSupplierModal = () => {
    setShowAddSupplierModal(true);
  };

  const getAllClient = async () => {
    try {
      const response = await API.get("/client/all");
      const data = response.data;
      data.push({
        id: "",
        name: "اضافة عميل جديد",
        phone: "",
        email: "",
      });
      setClient(data);
    } catch (error) {
      console.error("Error fetching level 4 accounts:", error);
    }
  };

  const getInvoiceCode = async () => {
    try {
      const response = await API.post("warehouse/transaction/invoicecode", {
        type: paymentType === "0" ? "rrs" : "rws",
      });
      const data = response.data;
      setInvoiceCode(data.code);
    } catch (error) {
      console.error("Error fetching invoice code:", error);
    }
  };

  const getAllWarehousesAccount = async () => {
    try {
      const response = await API.post(
        "warehouse/transaction/warehousecontentcode",
      );
      const data = response.data;
      setWarehousAccount(data);
    } catch (error) {
      console.error("Error fetching level 4 accounts:", error);
    }
  };
  const getAllWarehouses = async () => {
    try {
      const response = await API.post("warehouse/all");
      const data = response.data;
      setWarehous(data);
    } catch (error) {
      console.error("Error fetching level 4 accounts:", error);
    }
  };
  useEffect(() => {
    getInvoiceCode();
    getAllClient();
    getAllWarehousesAccount();
    getAllWarehouses();
  }, []);

  const [allVendorData, setAllVendorData] = useState({
    id: "",
    phone: "",
  });
  const [phone, setPhone] = useState([]);
  const handleNameChange = (selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : "";
    setChooseVendor(selectedValue);
    setAllVendorData({
      ...allVendorData,
      id: selectedValue,
      phone: "",
    });
    if (selectedValue === "") {
      return handleShowAddSupplierModal();
    }
    const selectedVendor = client.filter((item) => item.id === selectedValue);
    if (selectedVendor) {
      setPhone(selectedVendor);
    }
  };

  const fetchProductByBarcode = async (barcode) => {
    try {
      const response = await API.post("/items/barcode", { barcode });
      const product = response.data;
      // Check if product exists
      if (Object.keys(product).length === 0) {
        alert("Product not found");
        return;
      }
      // Check if already added
      const exists = purchuseitem.find((p) => p.id === product.id);
      if (exists) {
        // Increase quantity if already scanned
        const updatedProducts = purchuseitem.map((p) =>
          p.id === product.id
            ? {
                ...p,
                quantity: p.quantity + 1,
                total: (p.quantity + 1) * p.selling,
              }
            : p,
        );
        //console.log("updatedProducts", updatedProducts);
        setPurchuseitem(updatedProducts);
        recalculateTotal(updatedProducts);
      } else {
        // New product, quantity 1
        const updatedProducts = [
          ...purchuseitem,
          { ...product, quantity: 1, total: product.selling },
        ];
        setPurchuseitem(updatedProducts);
        recalculateTotal(updatedProducts);
      }
    } catch (error) {
      console.error("Product not found!", error);
      alert("Product not found");
    }
  };

  const handleBarcodeChange = (e) => {
    e.preventDefault();
    if (barcode.trim() !== "") {
      fetchProductByBarcode(barcode.trim());
      setBarcode("");
    }
  };

  const recalculateTotal = (products) => {
    const total = products.reduce((sum, p) => sum + parseFloat(p.total), 0);
    const TotalAfterTAx = total + (total * parseFloat(tax)) / 100;
    setGrandTotal(TotalAfterTAx);
  };

  const [showDiscount, setShowDiscount] = useState(false);
  const handleShowDiscount = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setHasDiscount(1);
      setShowDiscount(true);
    } else {
      setHasDiscount(0);
      setShowDiscount(false);
    }
  };
  const [discounttype, setDiscountType] = useState(0);
  const handleDiscountRadioChange = (e) => {
    setDiscountType(e.target.id === "percentageRadio" ? 0 : 1);
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedProducts = [...purchuseitem];
    updatedProducts[index].quantity = quantity;
    updatedProducts[index].total = quantity * updatedProducts[index].selling;
    setPurchuseitem(updatedProducts);
    recalculateTotal(updatedProducts);
  };

  // const handlePurchaseChange = (index, purchase) => {
  //   const updatedProducts = [...purchuseitem];
  //   updatedProducts[index].purchase = purchase;
  //   updatedProducts[index].total = purchase * updatedProducts[index].quantity;
  //   setPurchuseitem(updatedProducts);
  //   recalculateTotal(updatedProducts);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("vendor_id", chooseVendor);
    formData.append("paymentmethod", paymentMethod);
    formData.append("date", date);
    formData.append("selectedaccount", selectedAccount);
    formData.append("warehouse_id", selectedStore);
    formData.append("items", JSON.stringify(purchuseitem));
    formData.append("tax", tax);
    formData.append("totalaftertax", grandTotal);
    formData.append("totalafterdiscount", netTotal);
    formData.append("paid", paidAmount);
    formData.append("remaining", remainingBalance);
    formData.append("hasdiscount", hasDiscount);
    formData.append("discounttype", discounttype);
    formData.append("discount", discount);
    formData.append("methodtype", paymentType);
    try {
      const response = await API.post(
        "warehouse/transaction/selling/return",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = response.data;
      navigate(`/printpurchase/${data.id}`);
      //console.log("Invoice created successfully:", data);
    } catch (error) {
      console.error("Error adding supplier:", error);
      setFormMessage(error.response.data.message);
    }
  };

  return (
    <>
      <div className="salesinvoice">
        <Title
          className="title-buy"
          title="فاتورة مردود مبيعات"
          icon={<FontAwesomeIcon icon={faFileInvoice} />}
        />
        <div className="paymentMethod">
          <div className="invoiceNumber" style={{ display: "block" }}>
            <span>رقم الفاتورة</span> <span>: {invoiceCode}</span>
          </div>
          <div style={{ flexDirection: "row" }}>
            <div className="paymentMethod1">
              <span>طريقة الدفع</span>
              <Form.Check
                label="كاش"
                type="radio"
                value="0"
                onChange={handlePaymentMethodChange}
                checked={paymentMethod === "0"}
              />

              <Form.Check
                label="آجل"
                type="radio"
                value="1"
                onChange={handlePaymentMethodChange}
                checked={paymentMethod === "1"}
              />
              <span>طريقة البيع</span>
              <Form.Check
                label="تجزئة"
                type="radio"
                value="0"
                onChange={handlePaymentTypeChange}
                checked={paymentType === "0"}
              />

              <Form.Check
                label="جملة"
                type="radio"
                value="1"
                onChange={handlePaymentTypeChange}
                checked={paymentType === "1"}
              />
            </div>
          </div>
        </div>
        <div className="salesinvoiceInfo">
          <div className="Invoicesinput">
            <SelectComponent
              label="اسم العميل"
              placeholder="supplierName"
              containerStyle={{
                width: "20%",
              }}
              options={client.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              onChange={handleNameChange}
            />

            <RegisterTextbox
              id="phone"
              label="رقم الجوال"
              type="number"
              parentStyle={{ width: "20%" }}
              value={phone && phone.length > 0 ? phone[0].phone : ""}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label className="label-invoice">التاريخ</label>
              <input
                type="date"
                className="custom-datepicker"
                value={date}
                style={{ width: "100%" }}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="salesinvoiceInfo">
          <div className="Invoicesinput2">
            <div className="eerr-sap">
              <SelectComponent
                label="اختر حساب الدفع"
                containerStyle={{
                  width: "100%",
                }}
                options={warehousAccount.map((item) => ({
                  value: item.id,
                  label: item.name + " - " + item.code,
                }))}
                onChange={(e) => setSelectedAccount(e.value)}
              />
            </div>

            <SelectComponent
              label="المخزن"
              containerStyle={{
                width: "20%",
              }}
              options={warehous.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              onChange={(e) => setSelectedStore(e.value)}
            />
          </div>
        </div>

        <div className="salesinvoiceTable">
          <form onSubmit={handleBarcodeChange}>
            <RegisterTextbox
              parentStyle={{ width: "100%", marginBottom: "10px" }}
              type="text"
              placeholder="باركود"
              onChange={(e) => setBarcode(e.target.value)}
              autoFocus
              value={barcode}
            />
          </form>
          <div className="invoiceTableContainer">
            <table className="invoicetable mt-3">
              <thead className="invoicetable-thead">
                <tr>
                  <th>اسم الصنف</th>
                  <th>الوحدة</th>
                  <th>السعر</th>
                  <th>الكمية</th>
                  <th>الضريبه</th>
                  <th>الإجمالي</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="invoicetable-tbody">
                {purchuseitem && purchuseitem.length > 0 ? (
                  purchuseitem.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <p>{row.name}</p>
                      </td>
                      <td>
                        <p>{row.unit}</p>
                      </td>
                      <td>
                        {/* <input
                type="number"
                min="1"
                onChange={(e) =>
                  handlePurchaseChange(index, parseInt(e.target.value) || 1)
                }
                className="border px-2 py-1 w-20"
                style={{ width: "100%" , backgroundColor:"var(--background-color)" , border:"none !important" , color:"var(--text-color)" , borderRadius:"20px"}}
                value={row.purchase} 
              /> */}
                        <p>
                          {paymentType === "0" ? row.selling : row.wholesale}
                        </p>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          onChange={(e) =>
                            handleQuantityChange(
                              index,
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="border px-2 py-1 w-20"
                          style={{
                            width: "100%",
                            backgroundColor: "var(--background-color)",
                            border: "none !important",
                            color: "var(--text-color)",
                            borderRadius: "20px",
                          }}
                          value={row.quantity}
                        />
                      </td>
                      <td>
                        <p>{tax}</p>
                      </td>
                      <td>
                        <p>{row.total}</p>
                      </td>

                      <td>
                        <span
                          className="clearRowBtn"
                          onClick={() => handleDeleteRequest(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data-row">
                      لا توجد بيانات
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chooseacount">
          <div style={{ direction: "rtl" }}>
            <span> خصم : </span>
            <input
              type="checkbox"
              className="check-box"
              onChange={handleShowDiscount}
            />
          </div>
          <div className="chooseaccountrow">
            {showDiscount && (
              <>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>طريقة الخصم</span>
                  <Form.Check
                    name="discountradio"
                    label="نسبه"
                    type="radio"
                    id="percentageRadio"
                    onChange={handleDiscountRadioChange}
                    checked={discounttype === 0}
                  />

                  <Form.Check
                    name="discountradio"
                    label="قيمة"
                    type="radio"
                    id="valueRadio"
                    onChange={handleDiscountRadioChange}
                    checked={discounttype === 1}
                  />
                </div>

                <div>
                  <RegisterTextbox
                    className="input-nsba"
                    label="الخصم"
                    type="number"
                    //value={discount}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    parentStyle={{ width: "100%" }}
                  />
                </div>
              </>
            )}
            <RegisterTextbox
              label="ج بعد الضريبة"
              type="text"
              value={grandTotal}
              disabled={true}
              parentStyle={{ width: "10%" }}
            />

            <RegisterTextbox
              label=" ج بعد الخصم"
              type="text"
              value={netTotal}
              disabled={true}
              parentStyle={{ width: "10%" }}
            />

            <RegisterTextbox
              label="المدفوع"
              type="text"
              value={paidAmount}
              onChange={handlePaidAmountChange}
              parentStyle={{ width: "10%" }}
            />

            <RegisterTextbox
              label="المتبقي"
              type="number"
              value={remainingBalance.toFixed(2)}
              disabled={true}
              parentStyle={{ width: "10%" }}
            />

            <div className=" dddd">
              <svg ref={barcodeRef} className=" ss"></svg>
            </div>
          </div>

          <div className="InvoiceButton">
            <CustomButton text="حفظ" onClick={handleSubmit} />
          </div>
        </div>
      </div>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        className="custom-delete-modal"
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body className="modl-delete">
          <div className="circl-trash">
            <FontAwesomeIcon icon={faTrashCan} className="trash-ic" />
          </div>
          هل انت متاكد من حذف السطر
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            className="cancel-btn"
          >
            الغاء
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleClearRow(rowToDelete);
              setShowDeleteModal(false);
            }}
            className="confirm-delete-btn"
          >
            مسح
          </Button>
        </Modal.Footer>
      </Modal>
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
            اضافة عميل
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
                  label="اسم العميل"
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
              <CustomButton text="حفظ" type="submit" onClick={addVendor} />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NewSalesRefundInvoice;
