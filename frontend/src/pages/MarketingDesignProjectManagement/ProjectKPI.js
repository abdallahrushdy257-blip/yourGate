import { useEffect, useState } from "react";
import { projectService } from "../../modules/projects";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import "./ProjectKPI.css";

function ProjectKPI({
  show: propShow,
  onHide: propOnHide,
  projectId: propProjectId,
  onSuccess: propOnSuccess,
}) {
  const { id: paramId } = useParams();
  const id = propProjectId || paramId;
  const navigate = useNavigate();

  const [show, setShow] = useState(propShow !== undefined ? propShow : true);
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        navigate(`/projectkpiview/${id}`);
      }
    }
  };

  const calculateStatus = (actual, target) => {
    if (actual === null || actual === "" || isNaN(actual)) return "خطر";
    const act = Number(actual);
    const tgt = Number(target) || 100;
    if (act >= tgt) return "ممتاز";
    if (act >= tgt * 0.8) return "تحذير";
    return "خطر";
  };

  const getKpis = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await projectService.getKpiQuizs();
      const defaultList = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      try {
        const existingRes = await projectService.getProjectKpis(id);
        const existingList =
          existingRes.data?.data || existingRes.data || [];
        if (Array.isArray(existingList) && existingList.length > 0) {
          const merged = defaultList.map((quizItem) => {
            const match = existingList.find(
              (ex) => ex.quiz === quizItem.quiz || ex.kpi_id === quizItem.id
            );
            if (match) {
              const act = match.actual !== undefined ? match.actual : "";
              return {
                ...quizItem,
                actual: act,
                status:
                  match.status ||
                  calculateStatus(act, quizItem.target),
              };
            }
            return {
              ...quizItem,
              actual: "",
              status: calculateStatus("", quizItem.target),
            };
          });
          setKpis(merged);
          return;
        }
      } catch (err) {
        // ignore if not found yet
      }

      setKpis(
        defaultList.map((item) => ({
          ...item,
          actual: "",
          status: calculateStatus("", item.target),
        }))
      );
    } catch (error) {
      console.error("There was an error fetching KPIs!", error);
      setKpis([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getKpis();
  }, [id]);

  const handleChange = (index, value) => {
    const updated = [...kpis];
    updated[index].actual = value;
    updated[index].status = calculateStatus(value, updated[index].target);
    setKpis(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        project_id: Number(id),
        kpis: (Array.isArray(kpis) ? kpis : []).map((k) => ({
          kpi_id: k.id,
          target:
            k.target !== "" && k.target !== null && !isNaN(k.target)
              ? Number(k.target)
              : 100,
          actual:
            k.actual !== "" && k.actual !== null && !isNaN(k.actual)
              ? Number(k.actual)
              : 0,
          quiz: k.quiz || k.title || null,
        })),
      };

      const res = await projectService.saveProjectKpis(payload);

      if (res.status === 200 || res.status === 201) {
        toast.success("تم حفظ مؤشرات الأداء بنجاح");
        if (propOnSuccess) {
          propOnSuccess();
        }
        if (propOnHide) {
          propOnHide();
        } else {
          navigate(`/projectkpiview/${id}`);
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg =
        error.response?.data?.message || "حدث خطأ أثناء حفظ مؤشرات الأداء";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBadge = (status) => {
    if (status === "ممتاز") {
      return <span className="status-badge-ok">ممتاز</span>;
    }
    if (status === "تحذير") {
      return <span className="status-badge-warning">تحذير</span>;
    }
    return <span className="status-badge-danger">خطر</span>;
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      className="project-kpi-modal"
      dir="rtl"
    >
      <Modal.Header className="d-flex justify-content-between align-items-center">
        <Modal.Title className="d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faChartLine} className="text-warning" />
          <span>مؤشرات الأداء للمشروع</span>
        </Modal.Title>
        <button
          type="button"
          className="btn-close m-0"
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div
            className="d-flex flex-column align-items-center justify-content-center py-5"
            style={{ minHeight: "220px" }}
          >
            <Spinner animation="border" variant="warning" />
            <span className="mt-3 text-muted fw-semibold">
              جاري تحميل مؤشرات الأداء...
            </span>
          </div>
        ) : kpis.length === 0 ? (
          <div className="text-center py-5 text-muted">
            لا توجد مؤشرات أداء محددة لهذا المشروع
          </div>
        ) : (
          <form id="project-kpi-form" onSubmit={handleSubmit}>
            <div className="d-flex flex-column gap-3">
              {kpis.map((kpi, index) => (
                <div key={kpi.id || index} className="kpi-modal-card">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="kpi-title">{kpi.quiz || kpi.title}</div>
                    <div>{renderBadge(kpi.status)}</div>
                  </div>

                  <div className="row g-3 align-items-center">
                    <div className="col-12 col-md-6">
                      <label className="form-label small text-muted mb-1 fw-bold">
                        القيمة المتوقعة (المستهدفة)
                      </label>
                      <input
                        type="text"
                        className="form-control text-center fw-bold bg-white"
                        value={
                          kpi.target !== undefined && kpi.target !== null
                            ? kpi.target
                            : 100
                        }
                        disabled
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small text-muted mb-1 fw-bold">
                        القيمة الحالية (المحققة)
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="form-control text-center fw-bold"
                        value={
                          kpi.actual !== undefined && kpi.actual !== null
                            ? kpi.actual
                            : ""
                        }
                        placeholder="أدخل القيمة الحالية"
                        onChange={(e) => handleChange(index, e.target.value)}
                        autoFocus={index === 0}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </form>
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
          form="project-kpi-form"
          className="btn-kpi-save"
          disabled={isSubmitting || loading || kpis.length === 0}
        >
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" className="ms-2" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCheck} className="ms-1" />
              حفظ القيم
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProjectKPI;
