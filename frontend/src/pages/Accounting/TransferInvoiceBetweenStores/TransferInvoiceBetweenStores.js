import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import {
  faFileInvoice,
  faFileInvoiceDollar,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../components/RegisterTextBox";
// import SelectComponent from "../../../components/SelectComponent";
import RegisterSelect from "../../../components/RegisterSelect";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./TransferInvoiceBetweenStores.css";
import API from "../../../api/axiosConfig";

function TransferInvoiceBetweenStores() {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseModal2 = () => setShowModal2(false);
  const [barcode, setBarcode] = useState("");
  const [scannedCodes, setScannedCodes] = useState([]);
  const [itemValues, setItemValues] = useState({});
  const [fromStore, setFromStore] = useState("");
  const [toStore, setToStore] = useState("");
  const [itemid, setItemid] = useState("");
  const [details, setDetails] = useState([]);
  const [actualRecieved, setActualRecieved] = useState(0);

  const handleQuantityChange = (id, value) => {
    setItemValues((prevValues) => ({
      ...prevValues,
      [id]: { ...prevValues[id], quantity: value },
    }));
  };

  const putTheFinalItems = () => {
    const updatedFinalRecords = [];
    items.forEach((item) => {
      const itemData = {
        id: item.id,
        name: item.name,
        ...itemValues[item.id],
      };
      updatedFinalRecords.push(itemData);
    });
    return updatedFinalRecords;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const finaldata = putTheFinalItems();
    formData.append("items", JSON.stringify(finaldata));
    formData.append("from", fromStore);
    formData.append("to", toStore);
    try {
      const respone = await API.post("/stock/transfer", formData);
      const data = await respone.data;
      handleCloseModal();
    } catch (error) {
      console.error("Error adding warehouse:", error);
    }
  };

  const handleBarcodeChange = async (e) => {
    e.preventDefault();

    try {
      //Dont scan the same code
      if (scannedCodes.includes(barcode)) {
        console.error("Duplicate barcode");
        return;
      }
      const response = await API.post("/items/barcode", { barcode });
      const data = await response.data;
      var scItems = [...scannedCodes];
      scItems.push(barcode);
      setScannedCodes(scItems);
      setItems((priv) => [...priv, data]);
      //handleAddIllness();
    } catch (err) {
      // Perform any necessary actions with the barcode value
      console.log("Barcode:", barcode);
    }
  };

  const getWarehouses = async () => {
    try {
      const response = await API.post("/warehouse");
      const data = await response.data;
      setWarehouses(data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const getAllTrancefares = async () => {
    try {
      const response = await API.get("stock/transfer/report");
      const data = await response.data;
      setItems(data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };
  useEffect(() => {
    getWarehouses();
    getAllTrancefares();
  }, []);

  const handleShowModel2 = (item) => {
    setItemid(item);
    setShowModal2(true);
  };
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    const mForm = new FormData();
    mForm.append("id", itemid);
    mForm.append("items", JSON.stringify(details));
    try {
      const respone = await API.post("/stock/transfer/items/recieved", mForm);
      const data = await respone.data;
      handleCloseModal2();
    } catch (error) {
      console.error("Error adding warehouse:", error);
    }
  };

  const getTransfareDetails = async () => {
    try {
      const response = await API.post("stock/transfer/items", { id: itemid });
      const data = await response.data;
      setDetails(JSON.parse(data));
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const handleQuantityChange2 = (id, value) => {
    setActualRecieved(value);
    details.filter((item) => item.id === id)[0].quantity = value;
    setDetails([...details]);
  };

  return (
    <>
      <Title
        title="فاتورة تحويل بين مخازن"
        icon={<FontAwesomeIcon icon={faFileInvoiceDollar} />}
        style={{ width: "unset" }}
      />
      <div className="TransferInvoiceBetweenStores">
        <div className="warehouse-report  w-100 ">
          <span className="add-row-ta" onClick={handleShowModal}>
            <FontAwesomeIcon icon={faPlus} />
            فاتورة جديده
          </span>
        </div>
        <div className="transfer-table">
          <table className="table-rport w-100">
            <thead>
              <tr className="vac-table-header selected-row mm">
                <th></th>
                <th>رقم الفاتورة</th>
                <th>التاريخ</th>
                <th>من مخزن</th>
                <th>الي مخزن</th>
                <th> الحالة</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="selected-row mm">
                  <td>{index + 1}</td>
                  <td>{item.inv}</td>
                  <td>{item.date}</td>
                  <td>
                    <p>{item.fromw}</p>
                  </td>
                  <td>
                    <p>{item.tow}</p>
                  </td>
                  <td>
                    <p>{item.status}</p>
                  </td>
                  <td>
                    <button
                      onClick={() => handleShowModel2(item.id)}
                      className="btn btn-primary"
                    ></button>
                    استلام
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="transform-modal"
      >
        <Modal.Header>
          <Modal.Title style={{ width: "100%", textAlign: "center" }}>
            <FontAwesomeIcon icon={faFileInvoice} className="transfer-ic" />
            فاتورة تحويل بين مخازن
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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <form onSubmit={handleBarcodeChange}>
              <RegisterTextbox
                parentStyle={{ width: "100%" }}
                stylee={{ width: "50%" }}
                type="text"
                placeholder="باركود"
                onChange={(e) => setBarcode(e.target.value)}
                autoFocus
              />
            </form>
            <RegisterSelect
              selectStyle={{ width: "100%" }}
              containerStyle={{ width: "100%" }}
              stylee={{ width: "50%" }}
              options={[
                { value: "", label: "اختر المخزن" },
                ...warehouses.map((warehouse) => ({
                  label: warehouse.name,
                  value: warehouse.id,
                })),
              ]}
              onChange={(e) => setFromStore(e.target.value)}
            />
            <RegisterSelect
              selectStyle={{ width: "100%" }}
              containerStyle={{ width: "100%" }}
              stylee={{ width: "50%" }}
              options={[
                { value: "", label: "اختر المخزن" },
                ...warehouses.map((warehouse) => ({
                  label: warehouse.name,
                  value: warehouse.id,
                })),
              ]}
              onChange={(e) => setToStore(e.target.value)}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-trans">
              <div></div>
              <div className="adda">
                <span className="add-row-ta">
                  <FontAwesomeIcon icon={faPlus} /> اضافه صف
                </span>
              </div>
            </div>
            <table className="vac-custom-table tranfer-table">
              <thead>
                <tr className="vac-table-header selected-row mm">
                  <th></th>
                  <th>اسم الصنف</th>
                  <th>الوحدة</th>
                  <th>الكمية</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr key={index} className="selected-row">
                      <td className="seral-trans">{index + 1}</td>

                      <td>
                        <RegisterTextbox
                          // placeholder="الاسم"
                          selectStyle={{ width: "100%" }}
                          containerStyle={{
                            width: "100%",
                            marginBottom: "3px",
                          }}
                          value={item.name}
                          disabled={true}
                          onChange={(e) => setItems(e.target.value)}
                        />
                      </td>
                      <td>
                        <RegisterTextbox
                          selectStyle={{ width: "100%" }}
                          containerStyle={{ width: "100%" }}
                          value={item.unit}
                          disabled={true}
                        />
                      </td>
                      <td className="transrow">
                        <RegisterTextbox
                          type="number"
                          stylee={{ width: "100%" }}
                          placeholder={item.count}
                          parentStyle={{ marginBottom: "0px !important" }}
                          max={item.count}
                          min="1"
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      لا يوجد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            حفظ
          </Button>

          <Button variant="secondary" onClick={handleCloseModal}>
            اغلاق
          </Button>
        </Modal.Footer>
      </Modal>
      {/* =========================================== */}
      <Modal
        show={showModal2}
        onShow={getTransfareDetails}
        onHide={handleCloseModal2}
        className="transform-modal"
      >
        <Modal.Header>
          <Modal.Title style={{ width: "100%", textAlign: "center" }}>
            <FontAwesomeIcon icon={faFileInvoice} className="transfer-ic" />
            تفاصيل تحويل بين مخازن
          </Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={handleCloseModal2}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <form onSubmit={handleSubmit2}></form>
          </div>

          <div className="form-trans">
            <div></div>
            <div className="adda">
              <span className="add-row-ta">
                <FontAwesomeIcon icon={faPlus} /> اضافه صف
              </span>
            </div>
          </div>
          <table className="vac-custom-table tranfer-table">
            <thead>
              <tr className="vac-table-header selected-row mm">
                <th></th>
                <th>اسم الصنف</th>
                <th>الكمية</th>
                <th>الكمية المستلمة</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {details.length > 0 ? (
                details.map((item, index) => (
                  <tr key={index} className="selected-row">
                    <td className="seral-trans">{index + 1}</td>

                    <td>
                      <p>{item.name}</p>
                    </td>
                    <td className="transrow">
                      <p>{item.quantity}</p>
                    </td>
                    <td>
                      <RegisterTextbox
                        selectStyle={{ width: "100%" }}
                        containerStyle={{ width: "100%" }}
                        stylee={{ width: "50%" }}
                        type="number"
                        onChange={(e) =>
                          handleQuantityChange2(item.id, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    لا يوجد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit2}>
            حفظ
          </Button>

          <Button variant="secondary" onClick={handleCloseModal2}>
            اغلاق
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TransferInvoiceBetweenStores;
