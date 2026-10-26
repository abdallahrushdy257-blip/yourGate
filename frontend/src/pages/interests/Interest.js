import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Interest.css";
import { useState } from "react";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";

import TableComponent from "../../components/TableComponent";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router";
import NewButton from "../../components/NewButton";
import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "react-toastify";

function Interest() {
  const columns = [
    { name: "الاسم", key: "name" },
    { name: "الوصف", key: "description" },
    { name: "", key: "actions" },
  ];
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const [id, setId] = useState("");
  const [oldname, setOldName] = useState("");
  const [olddescription, setOldDescription] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const modifyRow = (row) => {
    let newRow = { ...row };
    newRow.upload = `<a class="btn btn-primary" href="${newRow.upload}" target="_blank">عرض</a>`;
    return newRow;
  };
  const handleArchive = async (e) => {
    e.preventDefault();
    if(!name){
              return toast.error("الاسم مطلوب")
            }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    try {
      const res = await API.post(`/donorinterest/store`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res;
      if (data.status === 200) {
        setName("");
        setDescription("");
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
      label: "تعديل",
      action: (id, record) => {
        setShowModal2(true);
        setId(id);
        setOldName(record.name);
        setOldDescription(record.description);
      },
    },
    {
      label: "حذف",
      action: (id) => {
        setItemToDelete(id);
        setShowConfirm(true);
      },
    },
  ];

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await API.get(`/donorinterest/${itemToDelete}/delete`);
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

  const handelEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", oldname);
    formData.append("description", olddescription);
    formData.append("id", id);
    try {
      const res = await API.post(`/donorinterest/update`, formData);
      const data = await res;
      if (data.status === 200) {
        setShowModal2(false);
        setIsSubmitting(false);
        setRows(data.data);
        setTableReloadKey(Date.now());
        setError([]);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setError(error.response?.data?.errors || {});
    }
  };

  return (
    <>
      <div className="printcasedata-container">
        <TableComponent
          apiUrl="/donorinterest"
          columns={columns}
          title="إهتمامات المانحون"
          transformRowFn={modifyRow}
          triggerReload={tableReloadKey}
          dropdownOptions={dropdownOptions}
          searchDate={false}
          addBtn={true}
          onAddClick={() => setShowModal(true)}
        />
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table small-modall archModal"
        dialogClassName="fit-content-modal"
      >
        <Modal.Header>
          <Modal.Title>إضافة اهتمام</Modal.Title>
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
            label="الوصف"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && error.description && (
            <span className="error">{error.description[0]}</span>
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

      <Modal
        show={showModal2}
        onHide={() => setShowModal2(false)}
        className="modal-table small-modall archModal"
        dialogClassName="fit-content-modal"
      >
        <Modal.Header>
          <Modal.Title>تعديل اهتمام</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            style={{ width: "fit-content" }}
            variant="link"
            onClick={() => setShowModal2(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <RegisterTextbox
            label="الاسم"
            type="text"
            value={oldname}
            onChange={(e) => setOldName(e.target.value || oldname)}
          />
          {error && error.name && (
            <span className="error">{error.name[0]}</span>
          )}
          <RegisterTextbox
            label="الوصف"
            type="text"
            value={olddescription}
            onChange={(e) => setOldDescription(e.target.value)}
          />
          {error && error.description && (
            <span className="error">{error.description[0]}</span>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal2(false)}>
            إغلاق
          </Button>
          {isSubmitting ? (
            <Button variant="primary" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handelEdit}>
              حفظ
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        isSubmitting={isDeleting}
        message="هل أنت متأكد من حذف هذا الاهتمام؟ لا يمكن التراجع عن هذا الإجراء."
      />
    </>
  );
}

export default Interest;
