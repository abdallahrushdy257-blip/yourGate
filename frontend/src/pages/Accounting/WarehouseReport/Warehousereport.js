import {
  faFileInvoice,
  faPlus,
  faWarehouse,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Title from "../../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Warehousereport.css";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import RegisterTextbox from "../../../components/RegisterTextBox";
import CustomTable from "../../../components/CustomTable";
import TableComponent from "../../../components/TableComponent";
import API from "../../../api/axiosConfig";

function Warehousereport() {
  const [showModal, setShowModal] = useState(false);
  const columns = [
    { name: "الاسم", key: "name" },
    { name: "الهاتف", key: "phone" },
    { name: "العنوان", key: "address" },
    { name: "الوصف", key: "description" },
  ];
  const [formMessage, setFormMessage] = useState("");

  const addNewWarehouse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", warehouseData.name);
    formData.append("phone", warehouseData.phone);
    formData.append("address", warehouseData.address);
    formData.append("description", warehouseData.description);
    try {
      const response = await API.post("/warehouse/store", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      setShowModal(false);
    } catch (error) {
      console.error("Error adding warehouse:", error);
      setFormMessage(error.response.data.message);
    }
  };

  const [warehouseData, setWarehouseData] = useState({
    name: "",
    phone: "",
    address: "",
    description: "",
  });

  return (
    <>
      <Title title="المخازن" icon={<FontAwesomeIcon icon={faWarehouse} />} />
      <div className="Warehousereport">
        <div className="warehouse-report">
          <span className="add-row-ta" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faPlus} /> اضافة مخزن
          </span>
        </div>
        <div className="table-Warehousereport">
          <TableComponent
            apiUrl={"/warehouse/"}
            columns={columns}
            title="المخازن"
            titleIcon={<FontAwesomeIcon icon={faWarehouse} />}
            search={false}
          />
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table small-modall"
      >
        <Modal.Header>
          <Modal.Title>
            اضافة مخزن
            <FontAwesomeIcon icon={faFileInvoice} className="transfer-ic" />
          </Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <RegisterTextbox
            label="اسم المخزن"
            type="text"
            value={warehouseData.name}
            onChange={(e) =>
              setWarehouseData({ ...warehouseData, name: e.target.value })
            }
            required
          />

          <RegisterTextbox
            label="الهاتف"
            type="text"
            value={warehouseData.phone}
            onChange={(e) =>
              setWarehouseData({ ...warehouseData, phone: e.target.value })
            }
          />

          <RegisterTextbox
            label="العنوان"
            type="text"
            value={warehouseData.address}
            onChange={(e) =>
              setWarehouseData({ ...warehouseData, address: e.target.value })
            }
          />
          <RegisterTextbox
            label="الوصف"
            type="text"
            value={warehouseData.description}
            onChange={(e) =>
              setWarehouseData({
                ...warehouseData,
                description: e.target.value,
              })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            اغلاق
          </Button>
          <Button variant="primary" onClick={addNewWarehouse}>
            حفظ
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Warehousereport;
