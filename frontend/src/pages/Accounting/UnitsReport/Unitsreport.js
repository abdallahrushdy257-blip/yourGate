import {
  faWeightHanging,
  faPlus,
  faFileInvoice,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Title from "../../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import { Modal, Button } from "react-bootstrap";
import RegisterTextbox from "../../../components/RegisterTextBox";
import RegisterSelect from "../../../components/RegisterSelect";
import "../WarehouseReport/Warehousereport.css";
import TableComponent from "../../../components/TableComponent";
import API from "../../../api/axiosConfig";

function UnitsReport() {
  const [showModal, setShowModal] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [unitData, setUnitData] = useState({
    name: "",
    desc: "",
    sub: 0,
  });

  const addUnit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", unitData.name);
    formData.append("description", unitData.desc);
    formData.append("parent", unitData.sub);
    try {
      const response = await API.post("/unit/store", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.data;
      setShowModal(false);
      getAllUnits();
    } catch (error) {
      console.error("Error adding warehouse:", error);
      setFormMessage(error.response.data.message);
    }
  };

  const getAllUnits = async () => {
    try {
      const response = await API.post("/unit/");
      const data = response.data;
      setUnits(data);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const [units, setUnits] = useState([]);
  useEffect(() => {
    getAllUnits();
  }, []);

  const columns = [
    { name: "الاسم", key: "name" },
    { name: "الوصف", key: "description" },
    { name: "التصنيف الفرعي", key: "parent" },
  ];

  return (
    <>
      <Title
        title="تقرير الوحدات"
        icon={<FontAwesomeIcon icon={faWeightHanging} />}
      />
      <div className="Warehousereport">
        <div className="warehouse-report">
          <span className="add-row-ta" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faPlus} />
            إضافة وحدة
          </span>
        </div>

        <TableComponent
          apiUrl="/unit/"
          columns={columns}
          search={false}
          refreshData={true}
        />
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table small-modall"
      >
        <Modal.Header>
          <Modal.Title>
            إضافة وحدة
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
            label="إسم الوحدة"
            type="text"
            value={unitData.name}
            onChange={(e) => setUnitData({ ...unitData, name: e.target.value })}
            required
          />
          <RegisterTextbox
            label="الوصف"
            type="text"
            value={unitData.desc}
            onChange={(e) => setUnitData({ ...unitData, desc: e.target.value })}
          />
          <RegisterSelect
            label="التصنيف الفرعي"
            value={unitData.sub}
            onChange={(e) => setUnitData({ ...unitData, sub: e.target.value })}
            options={[
              { value: "0", label: "لايوجد" },
              ...units.map((unit) => ({
                value: unit.id,
                label: unit.name,
              })),
            ]}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            اغلاق
          </Button>
          <Button variant="primary" onClick={addUnit}>
            حفظ
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UnitsReport;
