import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsersBetweenLines,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import TableComponent from "../../components/TableComponent";
import NewButton from "../../components/NewButton";
import { Modal, Row, Col, Button, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import API from "../../api/axiosConfig";
import "./committee.css";

function Committee() {
  const [showModal, setShowModal] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [boardMembers, setBoardMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  const columns = [
    { name: " اسم اللجنة", key: "name" },
    { name: "وصف اللجنة", key: "description" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions = [
    { label: "الاعضاء", route: "/committeemembers/:id" },
  ];

  const getBoardMembers = async () => {
    try {
      const res = await API.get(
        "/associationcommittee/components/assemblymembers",
      );
      setBoardMembers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (showModal) {
      getBoardMembers();
    }
  }, [showModal]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setSelectedMembers([]);
    setError({});
  };

  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("members", JSON.stringify(selectedMembers));

    try {
      const res = await API.post("/associationcommittee/store", formData);
      if (res.status === 200 || res.status === 201) {
        handleClose();
        setTableReloadKey(Date.now());
      } else {
        setError(res.data.errors || {});
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="printcasedata-container">
        {/* <NewButton name={"لجنة"} onClick={() => setShowModal(true)} /> */}
        <TableComponent
          apiUrl="/associationcommittee"
          columns={columns}
          title="تقرير اللجان"
          titleIcon={<FontAwesomeIcon icon={faUsersBetweenLines} />}
          dropdownOptions={dropdownOptions}
          searchDate={false}
          addBtn={true}
          onAddClick={() => setShowModal(true)}
          addBtnName="لجنة"
          triggerReload={tableReloadKey}
        />
      </div>

      {/* Add Committee Modal */}
      <Modal
        show={showModal}
        onHide={handleClose}
        className="modal-table smallModal archModal donor-modal"
        dialogClassName="fit-content-modal"
        centered
        size="sm"
      >
        <Modal.Header>
          <Modal.Title>تشكيل لجنة جديدة</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ paddingBottom: "0", direction: "rtl" }}>
          <form onSubmit={handleSubmit}>
            <RegisterTextbox
              id="name"
              label="اسم اللجنة"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={error.name}
            />
            <RegisterTextbox
              id="description"
              label="وصف اللجنة"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={error.description}
            />

            <p style={{ fontWeight: "bold", marginTop: "15px" }}>
              أعضاء الجمعية
            </p>
            <div
              className="committee-members"
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "10px",
                maxHeight: "200px",
                overflowY: "auto",
                marginBottom: "15px",
              }}
            >
              {boardMembers?.map((member) => (
                <label
                  key={member?.id}
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers?.some((m) => m.id === member?.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMembers([
                          ...selectedMembers,
                          { id: member?.id, name: member?.name, role: "عضو" },
                        ]);
                      } else {
                        setSelectedMembers(
                          selectedMembers.filter((m) => m.id !== member?.id),
                        );
                      }
                    }}
                    style={{ marginLeft: "8px" }}
                  />
                  {member?.name}
                </label>
              ))}
            </div>

            {selectedMembers?.length > 0 && (
              <p style={{ fontWeight: "bold" }}>تحديد الأدوار</p>
            )}
            <Row
              style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              {selectedMembers?.map((member, index) => (
                <Col key={member?.id} style={{ marginBottom: "10px" }}>
                  <div
                    style={{
                      border: "1px solid #eee",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        marginBottom: "5px",
                        textDecoration: "underline",
                      }}
                    >
                      {member?.name}
                    </p>
                    <RegisterSelect
                      id={`role-${member?.id}`}
                      label="الدور"
                      options={[
                        { value: "رئيس اللجنة", label: "رئيس اللجنة" },
                        { value: "نائب رئيس", label: "نائب رئيس" },
                        { value: "عضو", label: "عضو" },
                      ]}
                      value={member?.role}
                      onChange={(e) => {
                        const updated = [...selectedMembers];
                        updated[index].role = e.target.value;
                        setSelectedMembers(updated);
                      }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </form>
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
              حفظ
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Committee;
