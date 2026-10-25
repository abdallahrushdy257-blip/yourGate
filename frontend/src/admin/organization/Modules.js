import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import './archive.css'
import React, { useState } from "react";
import {
  faFolderOpen,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import Title from "../../components/title";
import TableComponent from "../../components/TableComponent";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router";
import AdminLayout from "../../layouts/AdminLayouts";

function Modules() {
  const columns = [
    { name: "الاسم", key: "name" },
    { name: "السعر خلال سنه", key: "price_peryear" },
    { name: "السعر خلال 3 سنين", key: "price_perthreeyears" },
    { name: "السعر خلال 5 سنين", key: "price_perfiveyears" },
    { name: "", key: "actions" },
  ];
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [pricePer3Year, setPricePer3Year] = useState(0);
  const [pricePer5Year, setPricePer5Year] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const navigate = useNavigate();

  const handleArchive = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price_peryear", price);
    formData.append("price_perthreeyears", pricePer3Year);
    formData.append("price_perfiveyears", pricePer5Year);

    try {
      const res = await API.post(`/subscription/modules/store`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res;
      if (data.status === 200) {
        setName("");
        setPrice(0);
        setPricePer3Year(0);
        setPricePer5Year(0);
        setError([]);

        setShowModal(false);
        setIsSubmitting(false);
        setRows(data.data);
        setTableReloadKey(Date.now());
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setError(error.response?.data?.errors || {});
    }
  };

  const dropdownOptions = [
    {
      label: "حذف",
      action: (id) => {
        if (window.confirm("هل أنت متأكد من حذف هذا المديول")) {
          API.get(`/subscription/modules/${id}/delete`)
            .then((res) => {
              if (res.status === 200) {
                setTableReloadKey(Date.now());
              }
            })
            .catch((error) => {
              console.error("There was an error!", error);
            });
        }
      },
    },
  ];

  return (
    <>
      <AdminLayout />
      <div className="printcasedata-container">
        <div className="archive-report">
          <span
            className="add-row-ta archiveAdd"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> إضافة
          </span>
        </div>

        <TableComponent
          apiUrl="/subscription/modules"
          columns={columns}
          title="الموديلات"
          triggerReload={tableReloadKey}
          dropdownOptions={dropdownOptions}
        />
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table small-modall archModal"
        dialogClassName="fit-content-modal"
      >
        <Modal.Header>
          <Modal.Title>إضافة مديول</Modal.Title>
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
            label="الاسم"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && error.name && (
            <span className="error">{error.name[0]}</span>
          )}

          <RegisterTextbox
            label="السعر خلال سنه"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {error && error.price_peryear && (
            <span className="error">{error.price_peryear[0]}</span>
          )}
          <RegisterTextbox
            label="السعر خلال 3 سنين"
            type="number"
            value={pricePer3Year}
            onChange={(e) => setPricePer3Year(e.target.value)}
          />
          {error && error.price_perthreeyears && (
            <span className="error">{error.price_perthreeyears[0]}</span>
          )}
          <RegisterTextbox
            label="السعر خلال 5 سنين"
            type="number"
            value={pricePer5Year}
            onChange={(e) => setPricePer5Year(e.target.value)}
          />
          {error && error.price_perfiveyears && (
            <span className="error">{error.price_perfiveyears[0]}</span>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إغلاق
          </Button>
          {isSubmitting ? (
            <Button variant="primary" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleArchive}>
              حفظ
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Modules;
