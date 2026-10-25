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

function Depreciationreport() {
  const [illnesses, setIllnesses] = useState([{ id: 1 }]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [actualQuantities, setActualQuantities] = useState({});
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [itemsinstock , setIemsinstock] = useState([]);
  const [warehouseId, setWarehouseId] = useState("");
  const [warehouseId2, setWarehouseId2] = useState("");
  const [filterItems , setFilterItems] = useState([]);
  const [filterItems2 , setFilterItems2] = useState([]);
  const [actualamount , setActualAmount] = useState(0);
  const [settlements , setSettlements] = useState([]);


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
      const res = await API.get("/settlementbill/depreciation");
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





  
  return (
    <>
      <Title
        title="فواتير الاهلاك"
        icon={<FontAwesomeIcon icon={faFileInvoiceDollar} />}
        style={{ width: "unset" }}
      />
      <div className="settlementreport">
        <div className="settlementreport-form">
          

          <SelectComponent
            placeholder="اختر المخزن"
            label="المخزن"
            containerStyle={{ width: "30%" }}
            className='settwidth'
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
              {filterItems2 && filterItems2.length > 0 ?
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
              )) : <td span={2}>لا يوجد بيانات</td>}
            </tbody>
          </table>
        </div>
      </div>

  
    </>
  );
}

export default Depreciationreport;
