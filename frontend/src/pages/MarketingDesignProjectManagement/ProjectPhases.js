import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Spinner, Form, Row, Col } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import TableComponent from "../../components/TableComponent";
import API from "../../api/axiosConfig";
import { useParams } from "react-router";
import RegisterSelect from "../../components/RegisterSelect";
import CustomButton from "../../components/CustomButton";
import { toast } from "react-toastify";

function ProjectPhases() {
  const columns = [
    { name: "الاسم", key: "name" },
    { name: " بداية المرحلة", key: "start_date" },
    { name: "نهاية المرحلة", key: "end_date" },
    { name: "الأولوية", key: "priority_string" },
    { name: "الميزانية", key: "budget" },
    { name: "الحالة", key: "status_string" },
    { name: "", key: "actions" },
  ];
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [name, setName] = useState("");
  const [startdate, setStartdate] = useState(
    new Date().toISOString().substr(0, 10),
  );
  const [enddate, setEnddate] = useState(
    new Date().toISOString().substr(0, 10),
  );
  const [priority, setPriority] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const [description, setDescription] = useState("");
  const { id } = useParams();
  const [phaseid, setphaseId] = useState(null);
  const [performancesummary, setPerformancesummary] = useState("");
  const [remainingwork, setRemainingwork] = useState("");

  const handleCompletePhase = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("performance_summary", performancesummary);
    formData.append("remaining_work", remainingwork);
    formData.append("phase_id", phaseid);
    formData.append("project_id", id);

    try {
      const res = await API.post(`/projectprogress/phase/complete`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res;
      if (data.status === 200) {
        setPerformancesummary("");
        setRemainingwork("");
        setError([]);

        setShowModal2(false);
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

  const handlePhase = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("startdate", startdate);
    formData.append("enddate", enddate);
    formData.append("priority", priority);
    formData.append("budget", budget);
    formData.append("status", status);
    formData.append("description", description);
    formData.append("project_id", id);

    try {
      const res = await API.post(`/projectphase/store`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res;
      if (data.status === 200) {
        setName("");
        setStartdate("");
        setEnddate("");
        setPriority("");
        setBudget("");
        setStatus("");
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
      label: "اكتمال المرحلة",
      action: (id, record) => {
        if (record.status === 3) {
          toast.error("لا يمكن تعديل مشروع ملغي");
        } else if (record.status === 2) {
          toast.error("المرحلة مكتملة بالفعل");
        } else {
          setShowModal2(true);
          setphaseId(id);
        }
      },
    },

    {
      label: "الغاء",
      visibleIf: (record) => record.status !== 3 && record.status !== 2,
      action: (id, record) => {
        const cancelProject = async () => {
          try {
            const response = await API.get(
              `/projectphase/${record.id}/status/cancel`,
            );
            if (response.status === 200) {
              setTableReloadKey(Date.now());
            }
          } catch (error) {
            console.log(error);
          }
        };
        cancelProject();
      },
    },
    {
      label: "تفعيل",
      visibleIf: (record) => record.status === 3,
      action: (id, record) => {
        const activateProject = async () => {
          try {
            const response = await API.get(
              `/projectphase/${record.id}/status/activate`,
            );
            if (response.status === 200) {
              setTableReloadKey(Date.now());
            }
          } catch (error) {
            console.log(error);
          }
        };
        activateProject();
      },
    },
  ];

  return (
    <>
      <div className="printcasedata-container">
        {/* <div className="archive-report">
                    <span className="add-row-ta archiveAdd" onClick={() => setShowModal(true)}>
                        <FontAwesomeIcon icon={faPlus} /> إضافة
                    </span>
                </div> */}

        <TableComponent
          apiUrl={`/projectphase/${id}`}
          columns={columns}
          title=" مراحل المشروع"
          triggerReload={tableReloadKey}
          dropdownOptions={dropdownOptions}
          onAddClick={() => setShowModal(true)}
          addBtn={true}
        />
      </div>
      <Modal
        size="md"
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table archModal donor-modal"
        dialogClassName="fit-content-modal"
        centered
      >
        <Modal.Header>
          <Modal.Title className="w-100 text-center">
            إضافة مرحلة جديدة
          </Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ direction: "rtl" }}>
          <Form className="global-form-container border-0 shadow-none p-0 bg-transparent">
            <Row className="mb-3">
              <Col md={12}>
                <RegisterTextbox
                  label="اسم المرحلة"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={error && error.name && error.name[0]}
                  placeholder="أدخل اسم المرحلة"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <RegisterTextbox
                  label="بداية المرحلة"
                  type="date"
                  value={startdate}
                  onChange={(e) => setStartdate(e.target.value)}
                  error={error && error.startdate && error.startdate[0]}
                />
              </Col>
              <Col md={6}>
                <RegisterTextbox
                  label="نهاية المرحلة"
                  type="date"
                  value={enddate}
                  onChange={(e) => setEnddate(e.target.value)}
                  error={error && error.enddate && error.enddate[0]}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <RegisterSelect
                  id="priority"
                  label="الأولوية"
                  options={[
                    { value: "", label: "اختر الأولوية" },
                    { value: "0", label: "منخفض" },
                    { value: "1", label: "متوسط" },
                    { value: "2", label: "عالي" },
                  ]}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  error={error && error.priority && error.priority[0]}
                />
              </Col>
              <Col md={6}>
                <RegisterTextbox
                  label="الميزانية"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  error={error && error.budget && error.budget[0]}
                  placeholder="0.00"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <RegisterSelect
                  id="status"
                  label="الحالة"
                  options={[
                    { value: "", label: "اختر الحالة" },
                    { value: "0", label: "قيد الانشاء" },
                    { value: "1", label: "قيد التنفيذ" },
                  ]}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <RegisterTextbox
                  label="الوصف"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={error && error.description && error.description[0]}
                  placeholder="وصف المرحلة..."
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-center mt-4">
              {isSubmitting ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <Button
                  variant="primary"
                  onClick={handlePhase}
                  className="px-5 py-2 fw-bold"
                  style={{ borderRadius: "10px" }}
                >
                  حفظ المرحلة
                </Button>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        size="md"
        show={showModal2}
        onHide={() => setShowModal2(false)}
        className="modal-table archModal donor-modal"
        dialogClassName="fit-content-modal"
        centered
      >
        <Modal.Header>
          <Modal.Title className="w-100 text-center">إكمال المرحلة</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal2(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ direction: "rtl" }}>
          <Form className="global-form-container border-0 shadow-none p-0 bg-transparent">
            <Row className="mb-3">
              <Col md={12}>
                <RegisterTextbox
                  label="ملخص الأداء"
                  type="text"
                  value={performancesummary}
                  onChange={(e) => setPerformancesummary(e.target.value)}
                  error={
                    error &&
                    error.performance_summary &&
                    error.performance_summary[0]
                  }
                  placeholder="اكتب ملخصاً لما تم إنجازه..."
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <RegisterTextbox
                  label="العمل المتبقي"
                  type="text"
                  value={remainingwork}
                  onChange={(e) => setRemainingwork(e.target.value)}
                  error={
                    error && error.remaining_work && error.remaining_work[0]
                  }
                  placeholder="المهام التي لم تكتمل بعد..."
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-center mt-4">
              {isSubmitting ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <Button
                  variant="primary"
                  onClick={handleCompletePhase}
                  className="px-5 py-2 fw-bold"
                  style={{ borderRadius: "10px" }}
                >
                  إكمال وحفظ
                </Button>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProjectPhases;
