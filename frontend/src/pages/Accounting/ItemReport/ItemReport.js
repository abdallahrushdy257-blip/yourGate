import {
  faFileInvoice,
  faPlus,
  faWeightHanging,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../../components/TableComponent";
import Title from "../../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import RegisterTextbox from "../../../components/RegisterTextBox";
import API from "../../../api/axiosConfig";
import RegisterSelect from "../../../components/RegisterSelect";

function Itemsreport() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [itemName, setItemName] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [categorySub, setCategorySub] = useState(0);

  const getAllUnits = async () => {
    try {
      const response = await API.post("/category/");
      const data = response.data;
      setItems(data);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  useEffect(() => {
    getAllUnits();
  }, []);

  const columns = [
    { name: "الاسم", key: "name" },
    { name: "الوصف", key: "description" },
    { name: "التصنيف الفرعي", key: "parent" },
  ];

  const addCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("description", itemDescription);
    formData.append("parent", categorySub);
    try {
      const response = await API.post("/category/store", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.data;
      setShowModal(false);
    } catch (error) {
      console.error("Error adding warehouse:", error);
      setFormMessage(error.response.data.message);
    }
  };

  return (
    <>
      <Title
        title="تقرير التصنيفات"
        icon={<FontAwesomeIcon icon={faWeightHanging} />}
      />
      <div className="Warehousereport">
        <div className="warehouse-report">
          <span className="add-row-ta" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faPlus} />
            اضافة تصنيف
          </span>
        </div>
        <TableComponent columns={columns} apiUrl={"/category"} search={false} />
      </div>

      {/* مودال إضافة عنصر جديد */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table small-modall"
      >
        <Modal.Header>
          <Modal.Title>
            اضافة تنصيف
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
            label="اسم التصنيف"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <RegisterTextbox
            label="الوصف"
            type="text"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
          />
          <RegisterSelect
            label="التصنيف الفرعي"
            value={categorySub}
            onChange={(e) => setCategorySub(e.target.value)}
            options={[
              { value: "0", label: "لايوجد" },
              ...items.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            اغلاق
          </Button>
          <Button variant="primary" onClick={addCategory}>
            حفظ
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Itemsreport;
