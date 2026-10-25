import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./employPaper.css";
import { faPaperclip, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
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

function EmployPaper() {
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
    { name: "النوع", key: "note" },
    { name: "", key: "actions" },
  ];
  const dropdownOptions = [
    // { label: "تعديل", route: "/editemploypaper/:id" },
    { label: "تعديل", route: "/editemploypaper/:id" },
  ];
  const dummyData = [
    { id: 1, name: "سجل الشرطة", description: "مستند رسمي مطلوب عند التعيين", note: 1 },
    { id: 2, name: "شهادة ميلاد", description: "مستند إضافي للملف", note: 2 },
    { id: 3, name: "شهادة خبرة", description: "مستند يوضح الخبرة السابقة", note: 1 },
  ];
  const handelSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mFormData = new FormData();
    mFormData.append("name", name);
    mFormData.append("description", description);
    mFormData.append("note", note);
    try {
      const res = await API.post("/employeepapers/store", mFormData);
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
    } finally {
      setIsSubmitting(false);
    }
  };
  const modifyRow = (row) => {
    let newRow = { ...row };
    newRow.note = row.note === 1 ? "إلزامي" : "إضافي";
    return newRow;
  };
  return (
    <>
      <div className="employpaper">
        <Title
          title="مستندات الموظف"
          style={{ width: "unset" }}
          classname="rmtit"
          icon={<FontAwesomeIcon icon={faPaperclip} />}
        />
        {/* <div className="archive-report">
                    <span className="add-row-ta archiveAdd" onClick={() => setShowModal(true)}>
                        <FontAwesomeIcon icon={faPlus} /> إضافة
                    </span>
                </div> */}

        <TableComponent
          addBtn={true}
          onAddClick={() => setShowModal(true)}
          apiUrl="/employeepapers"
          data={dummyData}
          columns={columns}
          // title="مستندات الموظف"
          transformRowFn={modifyRow}
          triggerReload={tableReloadKey}
          dropdownOptions={dropdownOptions}
        />
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table small-modall employpaper-model archModal"
        centered
        size="md"
      >
        <Modal.Header>
          <Modal.Title className="fs-5">إضافة مستند</Modal.Title>
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
            />
            {error && error.name && <div className="error">{error.name}</div>}
            <RegisterSelect
              id="status"
              label="الأهمية"
              style={{ width: "45%" }}
              parentStyle={{ width: "100%", direction: "rtl" }}
              options={[
                { value: "1", label: "إلزامي" },
                { value: "2", label: "إضافي" },
              ]}
              name="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            {error && error.note && <div className="error">{error.note}</div>}
            <RegisterTextarea
              parentStyle={{ width: "100%" }}
              id="description"
              label="الوصف"
              type="text"
              style={{ width: "45%" }}
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

export default EmployPaper;
