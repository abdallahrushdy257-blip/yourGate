import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Spinner, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router";
import { projectService } from "../../modules/projects";
import { toast } from "react-toastify";

function RiskMitigation({
  show: propShow,
  onHide: propOnHide,
  riskId: propRiskId,
  onSuccess: propOnSuccess,
}) {
  const { id: paramId } = useParams();
  const id = propRiskId || paramId;
  const navigate = useNavigate();

  const [show, setShow] = useState(propShow !== undefined ? propShow : true);
  const [risk, setRisk] = useState(null);
  const [description, setDescription] = useState("");
  const [impactlevel, setImpactLevel] = useState("1");
  const [probability, setProbability] = useState("1");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    if (propShow !== undefined) {
      setShow(propShow);
    }
  }, [propShow]);

  const handleClose = () => {
    setShow(false);
    if (propOnHide) {
      propOnHide();
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/projectrisks");
      }
    }
  };

  const getRiskDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await projectService.getRiskMitigation(id);
      const data = res.data?.data || res.data || {};
      setRisk(data);

      const existingDesc =
        data.mitigation_description &&
        data.mitigation_description !== "لم يتم تسجيل خطة تخفيف بعد"
          ? data.mitigation_description
          : data.action_plan || "";
      setDescription(existingDesc);

      if (data.mitigation_impactlevel) {
        setImpactLevel(String(data.mitigation_impactlevel));
      } else {
        setImpactLevel("1");
      }

      if (data.mitigation_probability) {
        setProbability(String(data.mitigation_probability));
      } else {
        setProbability("1");
      }
    } catch (err) {
      console.error("Error fetching risk details:", err);
      toast.error("فشل في تحميل بيانات الخطر");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRiskDetails();
  }, [id]);

  const handleMitigation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const payload = {
      risk_id: Number(id),
      description: description,
      impactlevel: Number(impactlevel) || 1,
      probability: Number(probability) || 1,
      status: "قيد المعالجة",
    };

    try {
      const res = await projectService.saveRiskMitigation(payload);
      if (res.status === 200 || res.status === 201) {
        toast.success("تم حفظ خطة التخفيف بنجاح");
        if (propOnSuccess) {
          propOnSuccess();
        }
        handleClose();
      }
    } catch (err) {
      console.error("Submission error:", err);
      const errs = err.response?.data?.errors || {};
      setError(errs);
      toast.error(
        err.response?.data?.message || "حدث خطأ أثناء حفظ خطة التخفيف"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      dir="rtl"
      className="project-kpi-modal risk-mitigation-modal"
    >
      <Modal.Header className="d-flex justify-content-between align-items-center">
        <Modal.Title className="d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faShieldHalved} className="text-warning" />
          <span>خطة تخفيف المخاطر</span>
        </Modal.Title>
        <button
          type="button"
          className="btn-close m-0"
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </Modal.Header>

      <Modal.Body className="p-4">
        {loading ? (
          <div
            className="d-flex flex-column align-items-center justify-content-center py-5"
            style={{ minHeight: "200px" }}
          >
            <Spinner animation="border" variant="warning" />
            <span className="mt-3 text-muted fw-semibold">
              جاري تحميل تفاصيل الخطر وخطة التخفيف...
            </span>
          </div>
        ) : (
          <>
            {risk && (
              <div
                className="p-3 mb-4 rounded-3 border"
                style={{
                  backgroundColor: "var(--input-background, #fdf6ec)",
                  borderColor: "rgba(200, 146, 74, 0.3)",
                }}
              >
                <div className="fw-bold mb-2 pb-2 border-bottom d-flex justify-content-between align-items-center">
                  <span>تفاصيل الخطر المحدد</span>
                  <Badge
                    bg={risk.status === "مغلق" ? "success" : "info"}
                    className="px-3 py-1 fs-6"
                  >
                    {risk.status_string || risk.status || "قيد المعالجة"}
                  </Badge>
                </div>
                <div className="row g-2 small">
                  <div className="col-12 col-md-4">
                    <strong>المرحلة: </strong>
                    <span>{risk.phase_name || "المشروع ككل"}</span>
                  </div>
                  <div className="col-6 col-md-4">
                    <strong>مستوى التأثير الأصلي: </strong>
                    <Badge
                      bg={
                        risk.impactlevel === 3
                          ? "danger"
                          : risk.impactlevel === 1
                          ? "success"
                          : "warning"
                      }
                      text={risk.impactlevel === 2 ? "dark" : "white"}
                      className="px-2 py-1"
                    >
                      {risk.impact_level_string || "متوسط"}
                    </Badge>
                  </div>
                  <div className="col-6 col-md-4">
                    <strong>الاحتمالية الأصلية: </strong>
                    <Badge
                      bg={
                        risk.probability === 3
                          ? "danger"
                          : risk.probability === 1
                          ? "success"
                          : "warning"
                      }
                      text={risk.probability === 2 ? "dark" : "white"}
                      className="px-2 py-1"
                    >
                      {risk.probability_string || "متوسط"}
                    </Badge>
                  </div>
                  <div className="col-12 mt-2">
                    <strong>وصف الخطر: </strong>
                    <span className="text-muted">
                      {risk.description || "لا يوجد وصف مسجل"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <form id="risk-mitigation-form" onSubmit={handleMitigation}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small text-muted mb-1 fw-bold">
                    مستوى التأثير بعد التخفيف
                  </label>
                  <select
                    className="form-select fw-semibold"
                    value={impactlevel}
                    onChange={(e) => setImpactLevel(e.target.value)}
                    style={{ height: "42px", borderRadius: "8px" }}
                  >
                    <option value="1">منخفض</option>
                    <option value="2">متوسط</option>
                    <option value="3">مرتفع</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small text-muted mb-1 fw-bold">
                    الاحتمالية بعد التخفيف
                  </label>
                  <select
                    className="form-select fw-semibold"
                    value={probability}
                    onChange={(e) => setProbability(e.target.value)}
                    style={{ height: "42px", borderRadius: "8px" }}
                  >
                    <option value="1">منخفض</option>
                    <option value="2">متوسط</option>
                    <option value="3">مرتفع</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label small text-muted mb-1 fw-bold">
                    إجراءات وخطة التخفيف <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="أدخل الإجراءات والخطوات الوقائية لتخفيف أثر هذا الخطر..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ borderRadius: "8px" }}
                    required
                  />
                  {error && error.description && (
                    <div className="text-danger small mt-1">
                      {error.description[0]}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between align-items-center">
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          form="risk-mitigation-form"
          className="btn-kpi-save"
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" className="ms-2" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCheck} className="ms-1" />
              حفظ خطة التخفيف
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RiskMitigation;
