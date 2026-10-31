import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { faPlus, faXmark, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import TableComponent from "../../components/TableComponent";
import API from "../../api/axiosConfig";
import { useParams } from "react-router";
import RegisterSelect from "../../components/RegisterSelect";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import RiskMitigation from "./RiskMitigation";

function ProjectRisk() {
  const columns = [
    { name: "المرحلة", key: "phase_name" },
    { name: "وصف الخطر", key: "description" },
    { name: "مستوى التأثير", key: "impact_level_string" },
    { name: "الاحتمالية", key: "probability_string" },
    { name: "خطة وإجراءات التخفيف", key: "mitigation_description" },
    { name: "التأثير بعد التخفيف", key: "mitigation_impact" },
    { name: "الاحتمالية بعد التخفيف", key: "mitigation_probability" },
    { name: "الحالة", key: "status_string" },
    { name: "", key: "actions" },
  ];
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [phases, setPhases] = useState("");
  const [description, setDescription] = useState("");
  const [impectlevel, setImpactLevel] = useState("1");
  const [probability, setProbability] = useState("1");
  const [showModal, setShowModal] = useState(false);
  const [showMitigationModal, setShowMitigationModal] = useState(false);
  const [selectedRiskId, setSelectedRiskId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const handleOpenMitigation = (riskId) => {
    setSelectedRiskId(riskId);
    setShowMitigationModal(true);
  };

  const modifyRow = (row) => {
    const newRow = { ...row };

    // Format mitigation description
    if (
      !newRow.mitigation_description ||
      newRow.mitigation_description === "لم يتم تسجيل خطة تخفيف بعد"
    ) {
      newRow.mitigation_description = `<span class="badge bg-light text-muted border">لا توجد خطة بعد</span>`;
    } else {
      newRow.mitigation_description = `<span class="fw-semibold text-dark">${newRow.mitigation_description}</span>`;
    }

    // Format badges
    let impactBadge = "badge bg-warning text-dark";
    if (newRow.impact_level_string === "مرتفع") impactBadge = "badge bg-danger";
    if (newRow.impact_level_string === "منخفض") impactBadge = "badge bg-success";
    newRow.impact_level_string = `<span class="${impactBadge} px-2 py-1">${newRow.impact_level_string || "متوسط"}</span>`;

    let probBadge = "badge bg-warning text-dark";
    if (newRow.probability_string === "مرتفع") probBadge = "badge bg-danger";
    if (newRow.probability_string === "منخفض") probBadge = "badge bg-success";
    newRow.probability_string = `<span class="${probBadge} px-2 py-1">${newRow.probability_string || "متوسط"}</span>`;

    let mitImpactBadge = "badge bg-secondary";
    if (newRow.mitigation_impact === "مرتفع") mitImpactBadge = "badge bg-danger";
    else if (newRow.mitigation_impact === "متوسط") mitImpactBadge = "badge bg-warning text-dark";
    else if (newRow.mitigation_impact === "منخفض") mitImpactBadge = "badge bg-success";
    newRow.mitigation_impact = `<span class="${mitImpactBadge} px-2 py-1">${newRow.mitigation_impact || "لم يحدد"}</span>`;

    let mitProbBadge = "badge bg-secondary";
    if (newRow.mitigation_probability === "مرتفع") mitProbBadge = "badge bg-danger";
    else if (newRow.mitigation_probability === "متوسط") mitProbBadge = "badge bg-warning text-dark";
    else if (newRow.mitigation_probability === "منخفض") mitProbBadge = "badge bg-success";
    newRow.mitigation_probability = `<span class="${mitProbBadge} px-2 py-1">${newRow.mitigation_probability || "لم يحدد"}</span>`;

    let statusBadge = "badge bg-info text-dark";
    if (newRow.status_string === "مغلق") statusBadge = "badge bg-success";
    if (newRow.status_string === "قيد المعالجة") statusBadge = "badge bg-primary";
    newRow.status_string = `<span class="${statusBadge} px-2 py-1">${newRow.status_string || "مفتوح"}</span>`;

    return newRow;
  };

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
        setImpactLevel("1");
        setProbability("1");
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
    {
      label: "خطة التخفيف",
      action: (riskId) => handleOpenMitigation(riskId),
    },
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
          title="مخاطر المشروع وخطة التخفيف"
          transformRowFn={modifyRow}
          triggerReload={tableReloadKey}
          dropdownOptions={dropdownOptions}
          onAddClick={() => setShowModal(true)}
          addBtn={true}
        />
      </div>

      <RiskMitigation
        show={showMitigationModal}
        onHide={() => setShowMitigationModal(false)}
        riskId={selectedRiskId}
        onSuccess={() => setTableReloadKey(Date.now())}
      />
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
