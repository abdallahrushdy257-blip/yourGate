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
import UploadInput from "../../components/UploadInput";
import TableComponent from "../../components/TableComponent";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router";
import AdminLayout from "../../layouts/AdminLayouts";
import { useParams } from "react-router";

function OrgaminzationRequest() {
  const columns = [
    { name: "  رقم الطلب", key: "code" },
    { name: "  اسم الطلب", key: "title" },
    { name: " الوصف  ", key: "description" },
    { name: "   تاريخ ", key: "date" },
    { name: "الحالة", key: "status" },
    { name: "", key: "actions" },
  ];
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [upload, setUpload] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const navigate = useNavigate();
  const { id } = useParams();

  const handleArchive = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    //formData.append('id', id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("upload", upload);
    formData.append("date", date);

    try {
      const res = await API.post(
        `organization/${id}/requests/store`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const data = await res;
      if (data.status === 200) {
        setTitle("");
        setDescription("");
        setUpload("");
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
          API.get(`/organization/requests/${id}/delete`)
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
    { label: "عرض الطلب", route: "/organization/requests" },
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
          apiUrl={`/organization/${id}/requests`}
          columns={columns}
          title="الطلبات"
          triggerReload={tableReloadKey}
          dropdownOptions={dropdownOptions}
          search={false}
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
            label="اسم الطلب"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          />
          {error && error.title && (
            <span className="error">{error.title[0]}</span>
          )}
          <RegisterTextbox
            label="الوصف"
            type="text"
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && error.description && (
            <span className="error">{error.description[0]}</span>
          )}
          <p style={{ textAlign: "right" }}> التاريخ</p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="custom-datepicker"
          />
          {error && error.date && (
            <span className="error">{error.date[0]}</span>
          )}
          <br /> <br /> <br />
          <UploadInput
            id="chieftain"
            parentStyle={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
            }}
            label="المرفقات  "
            onChange={(e) => setUpload(e.target.files[0])}
            name="upload"
          />
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

export default OrgaminzationRequest;
