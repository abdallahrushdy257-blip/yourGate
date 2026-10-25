import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faXmark } from "@fortawesome/free-solid-svg-icons";
import "../CaseDetails/CaseDetails.css";
import API from "../../api/axiosConfig";
import TableComponent from "../../components/TableComponent";
import NewButton from "../../components/NewButton";
import { Button, Modal, Spinner, Row, Col } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import ConfirmModal from "../../components/ConfirmModal";

function Hcvendor(props) {
  const columns = [
    { name: "إسم المورد", key: "name" },
    { name: "  العنوان", key: "address" },
    { name: "رقم الجوال", key: "phone" },
    { name: "البريد الالكتروني", key: "email" },
    { name: "النوع", key: "type_string" },
    { name: "", key: "actions" },
  ];

  const [tableReloadKey, setTableReloadKey] = useState(Date.now());

  // ── Modal state ─────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState(
    () => sessionStorage.getItem("vendor_name") || "",
  );
  const [address, setAddress] = useState(
    () => sessionStorage.getItem("vendor_address") || "",
  );
  const [phone, setPhone] = useState(
    () => sessionStorage.getItem("vendor_phone") || "",
  );
  const [email, setEmail] = useState(
    () => sessionStorage.getItem("vendor_email") || "",
  );
  const [type, setType] = useState(
    () => sessionStorage.getItem("vendor_type") || "",
  );
  const [identification_number, setIdentification_number] = useState(
    () => sessionStorage.getItem("vendor_identification_number") || "",
  );
  const [identification_description, setIdentification_description] = useState(
    () => sessionStorage.getItem("vendor_identification_description") || "",
  );
  const [region, setRegion] = useState(
    () => sessionStorage.getItem("vendor_region") || "",
  );
  const [description, setDescription] = useState(
    () => sessionStorage.getItem("vendor_description") || "",
  );

  const resetForm = () => {
    setName("");
    setAddress("");
    setPhone("");
    setEmail("");
    setType("");
    setIdentification_number("");
    setIdentification_description("");
    setRegion("");
    setDescription("");
    setError({});
    sessionStorage.removeItem("vendor_name");
    sessionStorage.removeItem("vendor_address");
    sessionStorage.removeItem("vendor_phone");
    sessionStorage.removeItem("vendor_email");
    sessionStorage.removeItem("vendor_type");
    sessionStorage.removeItem("vendor_identification_number");
    sessionStorage.removeItem("vendor_identification_description");
    sessionStorage.removeItem("vendor_region");
    sessionStorage.removeItem("vendor_description");
  };

  const handleClose = () => {
    resetForm();
    setEditingId(null);
    setShowModal(false);
  };

  const handleEditOpen = async (id, record) => {
    resetForm();
    setEditingId(id);
    setName(record.name || "");
    setAddress(record.address || "");
    setPhone(record.phone || "");
    setEmail(record.email || "");
    setType(record.type ? String(record.type) : "");
    setRegion(record.region || "");
    setDescription(record.description || "");
    setIdentification_number(record.identification_number || "");
    setIdentification_description(record.identification_description || "");
    setShowModal(true);

    try {
      const res = await API.get(`/humancasevendor/${id}`);
      const data = res.data;
      if (data) {
        if (data.name !== undefined) setName(data.name || "");
        if (data.address !== undefined) setAddress(data.address || "");
        if (data.phone !== undefined) setPhone(data.phone || "");
        if (data.email !== undefined) setEmail(data.email || "");
        if (data.type !== undefined) setType(data.type ? String(data.type) : "");
        if (data.region !== undefined) setRegion(data.region || "");
        if (data.description !== undefined) setDescription(data.description || "");
        if (data.identification_number !== undefined)
          setIdentification_number(data.identification_number || "");
        if (data.identification_description !== undefined)
          setIdentification_description(data.identification_description || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mForm = new FormData();
    if (editingId) {
      mForm.append("id", editingId);
    }
    mForm.append("name", name);
    mForm.append("address", address);
    mForm.append("phone", phone);
    mForm.append("email", email);
    mForm.append("type", type);
    mForm.append("description", description);
    mForm.append("identification_number", identification_number);
    mForm.append("identification_description", identification_description);
    mForm.append("region", region);
    try {
      const endpoint = editingId
        ? "/humancasevendor/update"
        : "/humancasevendor/store";
      const res = await API.post(endpoint, mForm);
      if (res.status === 200 || res.status === 201) {
        handleClose();
        setTableReloadKey(Date.now());
      } else {
        setError(res.data?.errors || {});
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await API.get(`/humancasevendor/${itemToDelete}/delete`);
      if (res.status === 200) {
        setTableReloadKey(Date.now());
        setShowConfirm(false);
      }
    } catch (error) {
      console.error("There was an error!", error);
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  const dropdownOptions = [
    {
      label: "تعديل",
      action: (id, record) => handleEditOpen(id, record),
    },
    {
      label: "حذف",
      action: (id) => {
        setItemToDelete(id);
        setShowConfirm(true);
      },
    },
  ];

  return (
    <>
      <div className="printcasedata-container">
        {/* <NewButton name={"مورد"} onClick={() => setShowModal(true)} /> */}
        <TableComponent
          apiUrl="/humancasevendor"
          columns={columns}
          title="تقرير الموردون"
          titleIcon={<FontAwesomeIcon icon={faReceipt} />}
          dropdownOptions={dropdownOptions}
          searchDate={false}
          placeholderSearch="إسم المورد"
          triggerReload={tableReloadKey}
          addBtn={true}
          onAddClick={() => {
            resetForm();
            setEditingId(null);
            setShowModal(true);
          }}
        />
      </div>

      {/* ── Add / Edit Supplier Modal ── */}
      <Modal
        show={showModal}
        onHide={handleClose}
        className="modal-table archModal donor-modal"
        dialogClassName="fit-content-modal"
        size="md"
        centered
      >
        <Modal.Header>
          <Modal.Title>{editingId ? "تعديل مورد" : "إضافة مورد"}</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ paddingBottom: "0", direction: "rtl" }}>
          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="vendor-name"
                label="إسم المورد"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  sessionStorage.setItem("vendor_name", e.target.value);
                }}
                error={error.name}
              />
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="vendor-email"
                label="البريد الإلكتروني"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  sessionStorage.setItem("vendor_email", e.target.value);
                }}
                error={error.email}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="vendor-phone"
                label="رقم الجوال"
                type="number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  sessionStorage.setItem("vendor_phone", e.target.value);
                }}
                error={error.phone}
              />
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="vendor-address"
                label="العنوان"
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  sessionStorage.setItem("vendor_address", e.target.value);
                }}
                error={error.address}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="vendor-region"
                label="المنطقة"
                type="text"
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  sessionStorage.setItem("vendor_region", e.target.value);
                }}
                error={error.region}
              />
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="vendor-description"
                label="الوصف"
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  sessionStorage.setItem("vendor_description", e.target.value);
                }}
                error={error.description}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="vendor-id-number"
                label="رقم الهوية"
                type="text"
                value={identification_number}
                onChange={(e) => {
                  setIdentification_number(e.target.value);
                  sessionStorage.setItem(
                    "vendor_identification_number",
                    e.target.value,
                  );
                }}
                error={error.identification_number}
              />
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="vendor-id-desc"
                label="وصف الهوية"
                type="text"
                value={identification_description}
                onChange={(e) => {
                  setIdentification_description(e.target.value);
                  sessionStorage.setItem(
                    "vendor_identification_description",
                    e.target.value,
                  );
                }}
                error={error.identification_description}
              />
            </Col>
          </Row>

          <Row style={{ marginBottom: "0" }}>
            <Col md={6}>
              <RegisterSelect
                id="vendor-type"
                label="نوع المورد"
                options={[
                  { value: "", label: "إختر النوع" },
                  { value: "1", label: "داخلي" },
                  { value: "2", label: "خارجي" },
                ]}
                onChange={(e) => {
                  setType(e.target.value);
                  sessionStorage.setItem("vendor_type", e.target.value);
                }}
                value={type}
                error={error.type}
              />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            إغلاق
          </Button>
          {isSubmitting ? (
            <Button variant="primary" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              {editingId ? "تعديل" : "حفظ"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        isSubmitting={isDeleting}
        message="هل أنت متأكد من حذف هذا المورد؟ لا يمكن التراجع عن هذا الإجراء."
      />
    </>
  );
}

export default Hcvendor;
