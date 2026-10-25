import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "../EmployPaper/employPaper.css";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import { Form, Spinner } from "react-bootstrap";
import { useState } from "react";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router";
import TableComponent from "../../components/TableComponent";
import { Button, Modal } from "react-bootstrap";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import RegisterTextarea from "../../components/RegisterTextarea";

function Roles() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const navigate = useNavigate();

  const columns = [
    { name: "الاسم", key: "name" },
    { name: "الوصف", key: "description" },
    { name: "", key: "actions" },
  ];

  const handelSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mFormData = new FormData();
    mFormData.append("name", name);
    mFormData.append("description", description);
    //mFormData.append("note", note);
    try {
      const res = await API.post("/permissions/store", mFormData);
      const data = await res;
      if (data.status === 200) {
        setTableReloadKey(Date.now());
        setShowModal(false);
      } else {
        setError(data.data.errors);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  };

  const dropdownOptions = [
    { label: "الأذونات", route: "/permissionsTabs/:id" },
    { label: "عرض", route: "/groupShow/:id" },
    { label: "تعديل الصلاحية", route: "/groupEdit/:id" },
    {
      label: "حذف الصلاحية",
      action: (id) => {
        if (window.confirm("هل أنت متأكد من حذف هذه المجموعه؟")) {
          API.get(`/permissions/${id}/delete`)
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
      <div className="employpaper">
        <Title
          title="الصلاحيات"
          style={{ width: "unset" }}
          classname="rmtit"
          icon={<FontAwesomeIcon icon={faPaperclip} />}
        />
        <div className="archive-report">
          <span
            className="add-row-ta archiveAdd"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> إضافة
          </span>
        </div>

        <TableComponent
          apiUrl="/permissions"
          columns={columns}
          triggerReload={tableReloadKey}
          dropdownOptions={dropdownOptions}
          search={true}
          searchDate={false}
        />
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table small-modall archModal"
      >
        <Modal.Header>
          <Modal.Title>إضافة دور</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form className="statementofaccountForm" onSubmit={handelSubmit}>
            <RegisterTextbox
              parentStyle={{ width: "100%" }}
              id="name"
              label="الإسم"
              type="text"
              style={{ width: "45%" }}
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={error && error.name}
            />
            <RegisterTextarea
              parentStyle={{ width: "100%" }}
              id="description"
              label="الوصف"
              type="text"
              style={{ width: "45%" }}
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={error && error.description}
            />
          </Form>
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
            <Button variant="primary" onClick={handelSubmit}>
              حفظ
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Roles;
