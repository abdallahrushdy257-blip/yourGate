import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./leavetype.css";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import { Form, Spinner, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import TableComponent from "../../../../components/TableComponent";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Title from "../../../../components/title";
import { hrService } from "../../services/hrService";

function LeaveType() {
  const [error, setError] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());

  const columns = [
    { name: "الاسم", key: "name" },
    { name: "الوصف", key: "description" },
    { name: "عدد الايام", key: "days" },
    { name: "", key: "actions" },
  ];
  const dropdownOptions = [{ label: "تعديل", route: "/editLeave/:id" }];
  const dummyData = [
    { id: 1, name: "إجازة سنوية", description: "إجازة اعتيادية للموظفين", days: 21 },
    { id: 2, name: "إجازة مرضية", description: "إجازة حسب الشهادة الطبية", days: 7 },
    { id: 3, name: "إجازة وضع", description: "إجازة خاصة بالموظفة الحامل", days: 90 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mFormData = new FormData();
    mFormData.append("name", name);
    mFormData.append("description", description);
    mFormData.append("days", days);
    try {
      const res = await hrService.createVacation(mFormData);
      if (res.status === 200) {
        setTableReloadKey(Date.now());
        setShowModal(false);
      } else {
        setError(res.data.errors);
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err?.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="employpaper">
        <Title
          title=" انواع الإجازات"
          style={{ width: "unset" }}
          classname="rmtit"
        />

        <TableComponent
          addBtn={true}
          onAddClick={() => setShowModal(true)}
          apiUrl="/vacations"
          data={dummyData}
          columns={columns}
          triggerReload={tableReloadKey}
          searchDate={false}
          dropdownOptions={dropdownOptions}
        />
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table small-modall archModal"
        centered
        size="md"
      >
        <Modal.Header>
          <Modal.Title>إضافة إجازة</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="jobtitle-container">
            <Form className="jobTitle-form" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-2">
                <RegisterTextbox
                  parentStyle={{ width: "100%" }}
                  id="name"
                  label="  اسم الإجازة"
                  type="text"
                  stylee={{ width: "100%" }}
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {error && error.name && (
                  <span className="error">{error.name}</span>
                )}
                <RegisterTextbox
                  parentStyle={{ width: "100%" }}
                  id="leaveDesc"
                  label="وصف الإجازة"
                  type="text"
                  stylee={{ width: "100%" }}
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {error && error.description && (
                  <span className="error">{error.description}</span>
                )}

                <RegisterTextbox
                  parentStyle={{ width: "100%" }}
                  id="days"
                  label="عدد الايام"
                  type="number"
                  stylee={{ width: "100%" }}
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                />
                {error && error.days && (
                  <span className="error">{error.days}</span>
                )}
              </div>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="my-3"
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            إغلاق
          </Button>
          {isSubmitting ? (
            <Button className="my-3" variant="primary" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button className="my-3" variant="primary" onClick={handleSubmit}>
              حفظ
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LeaveType;
