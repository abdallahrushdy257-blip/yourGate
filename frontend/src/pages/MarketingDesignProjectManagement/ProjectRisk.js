import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import TableComponent from "../../components/TableComponent";
import API from "../../api/axiosConfig";
import { useParams } from "react-router";
import RegisterSelect from "../../components/RegisterSelect";
import TestPreLoader from "../TestPreLoader/TestPreLoader";

function ProjectRisk() {
  const columns = [
    { name: "المرحلة", key: "phase_name" },
    { name: " الوصف", key: "description" },
    { name: "مستوى التأثير", key: "impact_level_string" },
    { name: "الاحتمالية", key: "probability_string" },
    { name: "الحالة", key: "status_string" },
    { name: "", key: "actions" },
  ];
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [phases, setPhases] = useState("");
  const [description, setDescription] = useState("");
  const [impectlevel, setImpactLevel] = useState(Date.now());
  const [probability, setProbability] = useState(Date.now());
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const handleRisk = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("project_id", id);
    formData.append("phase_id", phases);
    formData.append("description", description);
    formData.append("impactlevel", impectlevel);
    formData.append("probability", probability);

    try {
      const res = await API.post(`/projectrisk/risk/store`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res;
      if (data.status === 200 || data.status === 201) {
        setPhases("");
        setDescription("");
        setImpactLevel("");
        setProbability("");
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

  const dropdownOptions = [
    { label: "خطة التخفيف", route: `/riskmitigation/:id` },
  ];

  const [phase, setPhase] = useState([]);

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

  useEffect(() => {
    getPhases();
  }, []);

  if (loading) return <TestPreLoader />;
  return (
    <>
      <div className="printcasedata-container">
        <TableComponent
          apiUrl={`/projectrisk/${id}`}
          columns={columns}
          title=" مخاطر المشروع"
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
            إضافة مخاطر جديدة
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
          <form onSubmit={handleRisk}>
            <div className="row g-3">
              <div className="col-md-12">
                <RegisterSelect
                  id="phase"
                  label="المرحلة"
                  options={[
                    { value: "", label: "اختر المرحلة" },
                    ...(Array.isArray(phase) ? phase : []).map((p) => ({ value: p.id, label: p.name })),
                  ]}
                  name="phases"
                  value={phases}
                  onChange={(e) => setPhases(e.target.value)}
                />
                {error && error.phases && (
                  <span className="error">{error.phases[0]}</span>
                )}
              </div>

              <div className="col-md-6">
                <RegisterSelect
                  id="impectlevel"
                  label="مستوى التأثير"
                  options={[
                    { value: "", label: "اختر مستوى التأثير" },
                    { value: "0", label: "منخفض" },
                    { value: "1", label: "متوسط" },
                    { value: "2", label: "مرتفع" },
                  ]}
                  name="impactLevel"
                  value={impectlevel}
                  onChange={(e) => setImpactLevel(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <RegisterSelect
                  id="probability"
                  label="الاحتمالية"
                  options={[
                    { value: "", label: "اختر الاحتمالية" },
                    { value: "0", label: "منخفض" },
                    { value: "1", label: "متوسط" },
                    { value: "2", label: "مرتفع" },
                  ]}
                  name="probability"
                  value={probability}
                  onChange={(e) => setProbability(e.target.value)}
                />
              </div>

              <div className="col-md-12">
                <RegisterTextbox
                  label="وصف المخاطر"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {error && error.description && (
                  <span className="error">{error.description[0]}</span>
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
                  حفظ المخاطر
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
    </>
  );
}

export default ProjectRisk;
