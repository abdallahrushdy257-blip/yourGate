import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import {
  faFileInvoice,
  faFileInvoiceDollar,
  faPlus,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../components/RegisterTextBox";
import SelectComponent from "../../../components/SelectComponent";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./Settlementreport.css";
import API from "../../../api/axiosConfig";

function Settlementreport() {
  const [illnesses, setIllnesses] = useState([{ id: 1 }]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [actualQuantities, setActualQuantities] = useState({});
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [itemsinstock, setIemsinstock] = useState([]);
  const [warehouseId, setWarehouseId] = useState("");
  const [warehouseId2, setWarehouseId2] = useState("");
  const [filterItems, setFilterItems] = useState([]);
  const [filterItems2, setFilterItems2] = useState([]);
  const [actualamount, setActualAmount] = useState(0);
  const [settlements, setSettlements] = useState([]);

  const handleAddIllness = () => {
    setIllnesses([...illnesses, { id: illnesses.length + 1 }]);
  };

  const handleDeleteIllness = (id) => {
    setIllnesses(illnesses.filter((illness) => illness.id !== id));
  };
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const getWarehouses = async () => {
    try {
      const res = await API.post("/warehouse");
      const data = await res;
      if (data.status === 200) {
        setWarehouses(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getItemsinStock = async () => {
    try {
      const res = await API.post("/stock");
      const data = await res;
      if (data.status === 200) {
        setIemsinstock(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllSettlements = async () => {
    try {
      const res = await API.get("/settlementbill/settlement");
      const data = await res;
      if (data.status === 200) {
        setSettlements(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWarehouses();
    getItemsinStock();
    getAllSettlements();
  }, []);

  const handleSelectWarhouse = (selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : "";
    setWarehouseId(selectedValue);
    const data = itemsinstock.filter((item) => item.wid === selectedValue);
    setFilterItems(data);
  };

  const handleSelectWarhouse2 = (selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : "";
    setWarehouseId2(selectedValue);
    const data = settlements.filter((item) => item.wid === selectedValue);
    setFilterItems2(data);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const fData = new FormData();
    fData.append("items", JSON.stringify(filterItems));
    fData.append("warehouse_id", warehouseId);
    try {
      const res = await API.post("stock/updatestock ", fData);
      const data = await res;
      if (data.status === 200) {
        handleCloseModal();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleActualAmountChange = (id, value) => {
    setActualAmount(value);
    filterItems.filter((item) => item.id === id)[0].actualamount = value;
    setFilterItems([...filterItems]);
  };

  return (
    <>
      <Title
        title="فواتير التسوية"
        icon={<FontAwesomeIcon icon={faFileInvoiceDollar} />}
        style={{ width: "unset" }}
      />
      <div className="settlementreport">
        <div className="settlementreport-form">
          <div className="btn-settlementreport-form">
            <span
              className="add-row-ta settlementBtn btn btn-secondary"
              onClick={handleShowModal}
            >
              <FontAwesomeIcon icon={faPlus} /> فاتورة جديدة
            </span>
          </div>

          <SelectComponent
            placeholder="اختر المخزن"
            label="المخزن"
            containerStyle={{ width: "30%" }}
            className="settwidth"
            options={warehouses.map((wh) => ({
              value: wh.id,
              label: wh.name,
            }))}
            onChange={(selected) => {
              handleSelectWarhouse2(selected);
            }}
          />
        </div>

        <div className="transfer-table">
          <table className="table-rport">
            <thead>
              <tr className="vac-table-header selected-row mm">
                <th>رقم الفاتورة</th>
                <th>التاريخ </th>
                <th>قيمة التسويه</th>
                <th>المخزن</th>
              </tr>
            </thead>
            <tbody>
              {filterItems2 && filterItems2.length > 0 ? (
                filterItems2.map((items) => (
                  <tr key={items.id}>
                    <td>
                      <p>{items.invoicenumber}</p>
                    </td>
                    <td>
                      <p>{items.date}</p>
                    </td>
                    <td>
                      <p>{items.totalvalue}</p>
                    </td>
                    <td>
                      <p>{items.warehouse}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <td span={2}>لا يوجد بيانات</td>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} className="sett-modal">
        <Modal.Header>
          <Modal.Title className="modalTit">فاتورة تسوية</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={handleCloseModal}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settlementreport1">
            <SelectComponent
              placeholder="اختر المخزن"
              label="اختر المخزن"
              containerStyle={{ width: "20%", marginBottom: "3px" }}
              className="settwidth"
              options={warehouses.map((wh) => ({
                value: wh.id,
                label: wh.name,
              }))}
              onChange={(selected) => {
                handleSelectWarhouse(selected);
              }}
            />

            <div className="adda">
              <span
                className="add-row-ta btn btn-secondary addset"
                onClick={handleAddIllness}
              >
                <FontAwesomeIcon icon={faPlus} />
                اضافة صف
              </span>
            </div>
          </div>
          <table className="vac-custom-table tranfer-table">
            <thead>
              <tr className="vac-table-header selected-row mm">
                <th></th>
                <th>الإسم</th>
                <th>الوحده</th>
                <th> الكمية المسجلة</th>
                <th>الكمية الفعلية</th>
                <th>العجز</th>
                <th>الزيادة</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {filterItems.length > 0 ? (
                filterItems.map((items, index) => (
                  <tr key={items.id} className="selected-row">
                    <td className="seral-trans">{index + 1}</td>
                    <td>
                      <RegisterTextbox
                        placeholder="اختر الصنف"
                        value={items.name}
                        selectStyle={{ width: "100%" }}
                        containerStyle={{ width: "100%" }}
                        disabled
                      />
                    </td>

                    <td>
                      <RegisterTextbox
                        value={items.unit_name}
                        selectStyle={{ width: "100%" }}
                        containerStyle={{ width: "100%" }}
                        disabled
                      />
                    </td>

                    <td>{items.count || 0}</td>
                    <td>
                      <RegisterTextbox
                        id={`actual-${items.id}`}
                        type="number"
                        stylee={{ width: "100%" }}
                        containerStyle={{ width: "100%" }}
                        onChange={(e) =>
                          handleActualAmountChange(items.id, e.target.value)
                        }
                      />
                    </td>
                    <td>{actualQuantities[index]?.shortage || 0}</td>
                    <td>{actualQuantities[index]?.surplus || 0}</td>
                    <td className="dlete-trans">
                      <FontAwesomeIcon
                        className="clearRowBtn"
                        icon={faTrash}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteIllness(items.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    لا يوجد بيانات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            اغلاق
          </Button>
          <Button variant="secondary" onClick={handleSave}>
            حفظ
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Settlementreport;
