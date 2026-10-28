import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faXmark } from "@fortawesome/free-solid-svg-icons";
import "../CaseDetails/CaseDetails.css";
import "./addDonor.css";
import TableComponent from "../../components/TableComponent";
import NewButton from "../../components/NewButton";
import { Button, Modal, Spinner, Row, Col } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import API from "../../api/axiosConfig";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";

function ShowDonors(props) {
  // ── Table ──────────────────────────────────────────────
  const columns = [
    { name: "إسم المانح", key: "name" },
    { name: "العنوان", key: "address" },
    { name: "رقم الجوال", key: "phone" },
    { name: "البريد الالكتروني", key: "email" },
    { name: "صفة المانح", key: "type_string" },
    { name: "الاهتمام", key: "interest" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions = [
    {
      label: "تعديل",
      action: (id, record) => handleEditOpen(id, record),
    },
    { label: "سند قبض", route: "/donerreceiptvoucher/:id" },
    {
      label: "حذف",
      action: (id) => {
        setItemToDelete(id);
        setShowConfirm(true);
      },
    },
  ];

  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await API.delete(`/donor/${itemToDelete}`);
      if (res.status === 200 || res.status === 204) {
        toast.success("تم حذف المانح بنجاح");
        setTableReloadKey(Date.now());
        setShowConfirm(false);
      }
    } catch (err) {
      console.error("Error deleting donor:", err);
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  // ── Modal state ─────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [identificationDescription, setIdentificationDescription] =
    useState("");
  const [interests, setInterests] = useState([]);
  const [donorInterest, setDonorInterest] = useState("");

  const getInterests = async () => {
    try {
      const res = await API.get("/donorinterest/all");
      setInterests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (showModal) getInterests();
  }, [showModal]);

  const resetForm = () => {
    setName("");
    setAddress("");
    setPhone("");
    setEmail("");
    setType("");
    setIdentificationNumber("");
    setIdentificationDescription("");
    setDonorInterest("");
    setError({});
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
    setIdentificationNumber(record.identification_number || "");
    setIdentificationDescription(record.identification_description || "");
    setDonorInterest(
      record.interest_id
        ? String(record.interest_id)
        : record.donorInterests
        ? String(record.donorInterests)
        : ""
    );
    setShowModal(true);
    getInterests();

    try {
      const res = await API.get(`/donor/${id}`);
      const data = res.data;
      if (data) {
        if (data.name !== undefined) setName(data.name || "");
        if (data.address !== undefined) setAddress(data.address || "");
        if (data.phone !== undefined) setPhone(data.phone || "");
        if (data.email !== undefined) setEmail(data.email || "");
        if (data.type !== undefined) setType(data.type ? String(data.type) : "");
        if (data.identification_number !== undefined)
          setIdentificationNumber(data.identification_number || "");
        if (data.identification_description !== undefined)
          setIdentificationDescription(data.identification_description || "");
        if (data.interest_id !== undefined)
          setDonorInterest(data.interest_id ? String(data.interest_id) : "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!name){
          return toast.error("اسم المانح مطلوب")
        }
        if(!phone){
          return toast.error("رقم الجوال مطلوب")
        }
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
    mForm.append("identification_number", identificationNumber);
    mForm.append("identification_description", identificationDescription);
    mForm.append("donorInterests", donorInterest);
    try {
      const endpoint = editingId ? "/donor/update" : "/donor/store";
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

  // ── Render ──────────────────────────────────────────────
  return (
    <>
      <div className="printcasedata-container">
        <TableComponent
          apiUrl="/donor"
          columns={columns}
          title="تقرير المانحين"
          titleIcon={<FontAwesomeIcon icon={faReceipt} />}
          dropdownOptions={dropdownOptions}
          searchDate={false}
          placeholderSearch="إسم المانح"
          triggerReload={tableReloadKey}
          addBtn={true}
          addBtnName="مانح"
          onAddClick={() => {
            resetForm();
            setEditingId(null);
            setShowModal(true);
          }}
        />
      </div>

      {/* ── Add / Edit Donor Modal ── */}
      <Modal
        show={showModal}
        onHide={handleClose}
        className="modal-table archModal donor-modal"
        centered
        size="md"
      >
        <Modal.Header>
          <Modal.Title>{editingId ? "تعديل مانح" : "إضافة مانح"}</Modal.Title>
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
                id="donor-name"
                label="إسم المانح"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={error.name}
              />
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="donor-email"
                label="البريد الإلكتروني"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error.email}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="donor-phone"
                label="رقم الجوال"
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={error.phone}
              />
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="donor-address"
                label="العنوان"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={error.address}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <RegisterTextbox
                id="donor-id-number"
                label="رقم الهوية"
                type="text"
                value={identificationNumber}
                onChange={(e) => setIdentificationNumber(e.target.value)}
                error={error.identification_number}
              />
            </Col>
            <Col md={6}>
              <RegisterTextbox
                id="donor-id-desc"
                label="وصف الهوية"
                type="text"
                value={identificationDescription}
                onChange={(e) => setIdentificationDescription(e.target.value)}
                error={error.identification_description}
              />
            </Col>
          </Row>

          <Row style={{ marginBottom: "0" }}>
            <Col md={6}>
              <RegisterSelect
                id="donor-type"
                label="صفة المانح"
                options={[
                  { value: "", label: "إختر الصفة" },
                  { value: "1", label: "أفراد" },
                  { value: "2", label: "مؤسسة أهلية" },
                  { value: "3", label: "مؤسسة تجارية" },
                  { value: "4", label: "منصة حكومية" },
                ]}
                onChange={(e) => setType(e.target.value)}
                value={type}
                error={error.type}
              />
            </Col>
            <Col md={6}>
              <RegisterSelect
                id="donor-interest"
                label="نوع الاهتمام"
                options={[
                  { value: "", label: "إختر نوع الاهتمام" },
                  ...interests.map((i) => ({ value: i.id, label: i.name })),
                ]}
                onChange={(e) => setDonorInterest(e.target.value)}
                value={donorInterest}
                error={error.donorInterests}
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
        message="هل أنت متأكد من حذف هذا المانح؟ لا يمكن التراجع عن هذا الإجراء."
      />
    </>
  );
}

export default ShowDonors;
