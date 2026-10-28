import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import TableComponent from "../../components/TableComponent";
import ConfirmModal from "../../components/ConfirmModal";
import API from "../../api/axiosConfig";
import { useNavigate, useParams } from "react-router";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import RegisterSelect from "../../components/RegisterSelect";

function ProjectMember() {
  const columns = [
    { name: "اسم المسئول", key: "responsible_name" },
    { name: "اسم المرحلة", key: "phase_name" },
    { name: "نوع المسئول", key: "responsible_type_string" },
    { name: "الدور", key: "role" },
    { name: "المهام", key: "responsibility" },

    { name: "", key: "actions" },
  ];
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [task, setTask] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const [phase, setPhase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [phases, setPhases] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [employees, setEmployees] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [showemployeeselect, setShowEmployeesSelect] = useState(false);
  const [showvolunteerselect, setShowVolunteerSelect] = useState(false);
  const [type, setType] = useState("");
  const [employeesValue, setEmployeesValue] = useState("");
  const [volunteersValue, setVolunteersValue] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [role, setRole] = useState("");

  // Confirm Modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleArchive = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("responsible_type", type);
    formData.append(
      "responsible_id",
      type === "1" ? employeesValue : volunteersValue,
    );
    formData.append("responsibility", responsibility);
    formData.append("project_id", id);
    formData.append("phase_id", phases);
    formData.append("role", role);

    try {
      const res = await API.post(`/projectassignment/store`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res;
      if (data.status === 200 || data.status === 201) {
        setName("");
        setTitle("");
        setTask("");
        setError([]);

        setShowModal(false);
        setIsSubmitting(false);
        setRows(data.data);
        setTableReloadKey(Date.now());
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setError(error.response?.data?.errors || {});
    }
  };

  const getPhases = async () => {
    try {
      const response = await API.get(`/projectphase/${id}/all`);
      const data = await response;
      const list = Array.isArray(data.data) ? data.data : (data.data?.data || []);
      setPhase(list);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.errors || {});
      setMessage(error.response?.data?.message || "");
      setPhase([]);
      setLoading(false);
    }
  };

  const getallEmployees = async () => {
    try {
      const response = await API.get(`/employees/all`);
      const data = await response;
      const list = Array.isArray(data.data) ? data.data : (data.data?.data || []);
      setEmployees(list);
      setLoading(false);
      setShowEmployeesSelect(true);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.errors || {});
      setMessage(error.response?.data?.message || "");
      setEmployees([]);
    }
  };

  const getAllVolunteers = async () => {
    try {
      const response = await API.get(`/volunteers/all`);
      const data = await response;
      const list = Array.isArray(data.data) ? data.data : (data.data?.data || []);
      setVolunteers(list);
      setLoading(false);
      setShowVolunteerSelect(true);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.errors || {});
      setMessage(error.response?.data?.message || "");
      setVolunteers([]);
    }
  };

  useEffect(() => {
    getPhases();
    getallEmployees();
    getAllVolunteers();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await API.get(`/projectassignment/${deleteId}/delete`);
      if (res.status === 200) {
        setTableReloadKey(Date.now());
        setShowConfirm(false);
      }
    } catch (error) {
      console.error("There was an error!", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const dropdownOptions = [
    { label: "حذف", action: (id) => handleDeleteClick(id) },
  ];

  const handleTypeChange = (e) => {
    setShowEmployeesSelect(false);
    setShowVolunteerSelect(false);
    const value = e.target.value;
    setType(value);
    if (value === "1") {
      setShowEmployeesSelect(true);
      setShowVolunteerSelect(false);
    } else {
      setShowVolunteerSelect(true);
      setShowEmployeesSelect(false);
    }
  };

  if (loading) return <TestPreLoader />;

  return (
    <>
      <div className="printcasedata-container">
        <TableComponent
          apiUrl={`/projectassignment/${id}`}
          columns={columns}
          title="اعضاء المشروع"
          triggerReload={tableReloadKey}
          dropdownOptions={dropdownOptions}
          onAddClick={() => setShowModal(true)}
          addBtn={true}
        />
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table archModal donor-modal"
        centered
        size="md"
      >
        <Modal.Header>
          <Modal.Title className="w-100 text-center">
            إضافة مسئول للمشروع
          </Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleArchive}>
            <div className="row g-3">
              <div className="col-md-6">
                <RegisterSelect
                  id="type"
                  label="نوع المسئول"
                  options={[
                    { value: "", label: "اختر النوع" },
                    { value: "1", label: "موظف" },
                    { value: "2", label: "متطوع" },
                  ]}
                  name="type"
                  value={type}
                  onChange={handleTypeChange}
                />
              </div>
              <div className="col-md-6">
                <RegisterSelect
                  id="phase"
                  label="المرحلة المرتبطة"
                  options={[
                    { value: "", label: "اختر المرحلة" },
                    ...(Array.isArray(phase) ? phase : []).map((p) => ({ value: p.id, label: p.name })),
                  ]}
                  name="phases"
                  value={phases}
                  onChange={(e) => setPhases(e.target.value)}
                />
              </div>

              {showemployeeselect && (
                <div className="col-md-12">
                  <RegisterSelect
                    id="employee"
                    label="اختيار الموظف"
                    options={[
                      { value: "", label: "اختر الموظف" },
                      ...(Array.isArray(employees) ? employees : []).map((e) => ({ value: e.id, label: e.name })),
                    ]}
                    name="employees"
                    value={employeesValue}
                    onChange={(e) => setEmployeesValue(e.target.value)}
                  />
                </div>
              )}

              {showvolunteerselect && (
                <div className="col-md-12">
                  <RegisterSelect
                    id="volunteer"
                    label="اختيار المتطوع"
                    options={[
                      { value: "", label: "اختر المتطوع" },
                      ...(Array.isArray(volunteers) ? volunteers : []).map((v) => ({
                        value: v.id,
                        label: v.name,
                      })),
                    ]}
                    name="volunteers"
                    value={volunteersValue}
                    onChange={(e) => setVolunteersValue(e.target.value)}
                  />
                </div>
              )}

              <div className="col-md-6">
                <RegisterTextbox
                  label="الدور الوظيفي"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
                {error && error.role && (
                  <span className="error">{error.role[0]}</span>
                )}
              </div>
              <div className="col-md-6">
                <RegisterTextbox
                  label="المسئوليات"
                  type="text"
                  value={responsibility}
                  onChange={(e) => setResponsibility(e.target.value)}
                />
                {error && error.responsibility && (
                  <span className="error">{error.responsibility[0]}</span>
                )}
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-center gap-2">
              {isSubmitting ? (
                <Button
                  className="premium-btn primary"
                  disabled
                  style={{ minWidth: "120px" }}
                >
                  <Spinner animation="border" size="sm" />
                </Button>
              ) : (
                <Button
                  className="premium-btn primary"
                  type="submit"
                  style={{ minWidth: "120px" }}
                >
                  حفظ البيانات
                </Button>
              )}
              <Button
                className="premium-btn secondary"
                onClick={() => setShowModal(false)}
                style={{ minWidth: "120px" }}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        isSubmitting={isDeleting}
        title="تأكيد حذف المسئول"
        message="هل أنت متأكد من حذف هذا المسئول من المشروع؟"
      />
    </>
  );
}

export default ProjectMember;
