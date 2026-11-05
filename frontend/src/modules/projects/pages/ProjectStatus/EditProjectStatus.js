import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faCheck,
  faFolderOpen,
  faCoins,
  faCalendarDays,
  faBullhorn,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import API from "../../../../api/axiosConfig";
import { toast } from "react-toastify";
import "../KPI/ProjectKPI.css";

function EditProjectStatus({
  show: propShow,
  onHide: propOnHide,
  projectId: propProjectId,
  onSuccess: propOnSuccess,
}) {
  const { id: paramId } = useParams();
  const id = propProjectId || paramId;
  const navigate = useNavigate();

  const [show, setShow] = useState(propShow !== undefined ? propShow : true);
  const [loading, setLoading] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [error, setError] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    budget: "",
    startdate: "",
    deadline: "",
    marketingmethod: "0",
    description: "",
  });

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
        navigate("/projectStatus");
      }
    }
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("-");
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const getProject = async () => {
    if (!id || !show) return;
    setLoading(true);
    try {
      const response = await API.get(`/projects/${id}`);
      const data = response.data?.data || response.data || {};
      setFormData({
        name: data.name || data.title || "",
        budget: data.budget !== undefined ? data.budget : data.total || "",
        startdate: formatDateForInput(data.startdate || data.dateoflaunch || ""),
        deadline: formatDateForInput(data.deadline || ""),
        marketingmethod: String(data.marketingmethod || "0"),
        description: data.description || "",
      });
      setError({});
    } catch (err) {
      console.error("Error loading project:", err);
      toast.error("فشل في تحميل بيانات المشروع");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProject();
  }, [id, show]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmit(true);
    setError({});

    const mForm = new FormData();
    mForm.append("name", formData.name || "");
    mForm.append("description", formData.description || "");
    mForm.append("dateoflaunch", formData.startdate || "");
    mForm.append("deadline", formData.deadline || "");
    mForm.append("total", formData.budget || 0);
    mForm.append("marketingmethod", formData.marketingmethod || "0");
    mForm.append("id", id);

    try {
      const res = await API.post("/projects/update", mForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("تم تعديل بيانات المشروع بنجاح");
        if (propOnSuccess) propOnSuccess();
        handleClose();
      } else {
        setError(res.data?.errors || {});
        toast.error("فشل في تعديل بيانات المشروع");
      }
    } catch (err) {
      console.error("Update project error:", err);
      const errorData = err?.response?.data?.errors || {};
      setError(errorData);
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تعديل المشروع");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      dir="rtl"
      className="project-kpi-modal"
      backdrop="static"
    >
      <Modal.Header className="d-flex justify-content-between align-items-center">
        <Modal.Title className="d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faPenToSquare} className="text-warning" />
          <span className="fw-bold">تعديل بيانات المشروع #{id}</span>
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
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <div className="mt-2 text-muted small">جاري تحميل بيانات المشروع...</div>
          </div>
        ) : (
          <Form id="edit-project-form" onSubmit={handleSubmit}>
            <Row className="g-3">
              {/* Project Name */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted mb-1">
                    إسم المشروع *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="أدخل اسم المشروع"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    style={{ height: "42px", borderRadius: "8px" }}
                    required
                  />
                  {error.name && (
                    <div className="text-danger small mt-1">{error.name[0] || error.name}</div>
                  )}
                </Form.Group>
              </Col>

              {/* Total Budget */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted mb-1">
                    مبلغ الدعم الكلي (ر.س) *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    style={{ height: "42px", borderRadius: "8px" }}
                    required
                  />
                  {error.total && (
                    <div className="text-danger small mt-1">{error.total[0] || error.total}</div>
                  )}
                </Form.Group>
              </Col>

              {/* Start Date */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted mb-1">
                    تاريخ البدء *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.startdate}
                    onChange={(e) =>
                      setFormData({ ...formData, startdate: e.target.value })
                    }
                    style={{ height: "42px", borderRadius: "8px" }}
                    required
                  />
                  {error.dateoflaunch && (
                    <div className="text-danger small mt-1">
                      {error.dateoflaunch[0] || error.dateoflaunch}
                    </div>
                  )}
                </Form.Group>
              </Col>

              {/* Deadline */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted mb-1">
                    تاريخ الانتهاء (الموعد النهائي) *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    style={{ height: "42px", borderRadius: "8px" }}
                    required
                  />
                  {error.deadline && (
                    <div className="text-danger small mt-1">
                      {error.deadline[0] || error.deadline}
                    </div>
                  )}
                </Form.Group>
              </Col>

              {/* Marketing Mechanism */}
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted mb-1">
                    آلية التسويق
                  </Form.Label>
                  <Form.Select
                    value={formData.marketingmethod}
                    onChange={(e) =>
                      setFormData({ ...formData, marketingmethod: e.target.value })
                    }
                    style={{ height: "42px", borderRadius: "8px" }}
                  >
                    <option value="0">إختر الآلية...</option>
                    <option value="1">المانحون</option>
                    <option value="2">المنصات الحكومية</option>
                    <option value="3">متاجر الجمعيات</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Description */}
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted mb-1">
                    نبذة ووصف المشروع
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="أدخل نبذة تفصيلية عن مستهدفات وأنشطة المشروع..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    style={{ borderRadius: "8px", resize: "vertical" }}
                  />
                  {error.description && (
                    <div className="text-danger small mt-1">
                      {error.description[0] || error.description}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between align-items-center">
        <Button variant="secondary" onClick={handleClose} disabled={isSubmit}>
          إلغاء
        </Button>
        <Button
          type="submit"
          form="edit-project-form"
          className="btn-kpi-save"
          disabled={isSubmit || loading}
          style={{ minWidth: "140px" }}
        >
          {isSubmit ? (
            <>
              <Spinner animation="border" size="sm" className="ms-2" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCheck} className="ms-1" />
              حفظ التعديلات
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditProjectStatus;
