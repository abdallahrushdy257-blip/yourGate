import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoice,
  faMoneyBillWave,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Spinner, Form, Row, Col } from "react-bootstrap";
import JsBarcode from "jsbarcode";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axiosConfig";
import { toast } from "react-toastify";
import "../MarketingDesignProjectManagement/ProjectKPI.css";

function PaymentVoucherProject({
  show: propShow,
  onHide: propOnHide,
  projectId: propProjectId,
  onSuccess: propOnSuccess,
}) {
  const barcodeRef = useRef(null);
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const initialId = propProjectId || paramId || "";

  const [activeProjectId, setActiveProjectId] = useState(initialId);
  const [allProjects, setAllProjects] = useState([]);
  const [show, setShow] = useState(propShow !== undefined ? propShow : true);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [amount, setAmount] = useState("");
  const [cridet, setCridet] = useState("");
  const [selHumancases, setSelHumancases] = useState("0");
  const [type, setType] = useState("2");
  const [description, setDescription] = useState("");

  const [humancases, setHumancases] = useState([]);
  const [account, setAccount] = useState([]);
  const [projectData, setProjectData] = useState({});
  const [error, setError] = useState({});

  useEffect(() => {
    if (propShow !== undefined) {
      setShow(propShow);
    }
  }, [propShow]);

  useEffect(() => {
    const currentId = propProjectId || paramId || "";
    setActiveProjectId(currentId);
  }, [propProjectId, paramId]);

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

  // 1. Fetch initial dependencies (accounts, and projects if needed)
  useEffect(() => {
    if (!show) return;

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const requests = [API.get("/transactions/components/donations")];
        if (!initialId) {
          requests.push(API.get("/projects"));
        }

        const results = await Promise.allSettled(requests);

        if (results[0].status === "fulfilled") {
          const accData = results[0].value.data?.data || results[0].value.data || [];
          const list = Array.isArray(accData) ? accData : [];
          setAccount(list);
          if (list.length > 0 && !cridet) {
            setCridet(list[0].id);
          }
        }

        if (results[1] && results[1].status === "fulfilled") {
          const projData = results[1].value.data?.data || results[1].value.data || [];
          const list = Array.isArray(projData) ? projData : [];
          setAllProjects(list);
          if (list.length > 0 && !activeProjectId) {
            setActiveProjectId(String(list[0].id));
          }
        }
      } catch (err) {
        console.error("Error fetching initial voucher dependencies:", err);
      } finally {
        if (!activeProjectId && initialId) {
          // If we had an initialId, wait for its specific fetch
        } else {
          setLoading(false);
        }
      }
    };

    fetchInitialData();
  }, [show, initialId]);

  // 2. Fetch specific project details & phases whenever activeProjectId changes
  useEffect(() => {
    if (!activeProjectId || !show) {
      if (!initialId) setLoading(false);
      return;
    }

    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        const [phasesRes, projRes] = await Promise.allSettled([
          API.get(`/projectphase/${activeProjectId}/all`),
          API.get(`/projects/${activeProjectId}`),
        ]);

        if (phasesRes.status === "fulfilled") {
          const list = Array.isArray(phasesRes.value.data)
            ? phasesRes.value.data
            : phasesRes.value.data?.data || [];
          setHumancases(Array.isArray(list) ? list : []);
        }

        if (projRes.status === "fulfilled") {
          const p = projRes.value.data?.data || projRes.value.data || {};
          setProjectData(p);
        }
      } catch (err) {
        console.error("Error fetching project phases/details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [activeProjectId, show]);

  useEffect(() => {
    if (barcodeRef.current && !loading && show) {
      try {
        JsBarcode(barcodeRef.current, `PV-${activeProjectId || "000"}-${Date.now().toString().slice(-4)}`, {
          format: "CODE128",
          displayValue: false,
          height: 35,
          width: 1.5,
          margin: 0,
        });
      } catch (e) {
        // barcode format fallback
      }
    }
  }, [loading, show, activeProjectId]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!activeProjectId) {
      toast.warning("يرجى اختيار المشروع أولاً");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.warning("يرجى إدخال مبلغ صحيح لسند الصرف");
      return;
    }

    if (!cridet) {
      toast.warning("يرجى اختيار الحساب المدفوع عليه");
      return;
    }

    setIsSubmitting(true);
    setError({});

    try {
      const payload = {
        amount: Number(amount),
        selhuman: selHumancases || "0",
        type: type || "2",
        date: date,
        project_id: activeProjectId,
        account: cridet,
        description: description,
        notes: description,
        balanceid: projectData && projectData.accounts_id ? projectData.accounts_id : 0,
      };

      const res = await API.post("/shoptransaction/storepayprojects", payload);

      if (res.status === 200 || res.status === 201) {
        toast.success("تم إصدار سند الصرف بنجاح");
        if (propOnSuccess) propOnSuccess();
        handleClose();
      } else {
        setError(res.data?.errors || {});
        toast.error("فشل في إصدار سند الصرف");
      }
    } catch (err) {
      console.error("Payment voucher error:", err);
      const errorData = err.response?.data?.errors || {};
      setError(errorData);
      toast.error(
        err.response?.data?.message || "حدث خطأ أثناء إصدار سند الصرف"
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
      className="project-kpi-modal"
      backdrop="static"
    >
      <Modal.Header className="d-flex justify-content-between align-items-center">
        <Modal.Title className="d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faMoneyBillWave} className="text-warning" />
          <span className="fw-bold">
            {projectData.name
              ? `سند صرف للمشروع (${projectData.name})`
              : activeProjectId
              ? `سند صرف للمشروع #${activeProjectId}`
              : "إصدار سند صرف لمشروع"}
          </span>
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
            <div className="mt-2 text-muted small">جاري تحميل بيانات السند...</div>
          </div>
        ) : (
          <Form id="payment-voucher-project-form" onSubmit={handleSubmit}>
            <Row className="g-3">
              {/* Project selector if opened globally */}
              {!initialId && (
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-muted mb-1">
                      المشروع المستهدف *
                    </Form.Label>
                    <Form.Select
                      value={activeProjectId}
                      onChange={(e) => setActiveProjectId(e.target.value)}
                      style={{ height: "42px", borderRadius: "8px", fontWeight: "600" }}
                      required
                    >
                      <option value="">-- اختر المشروع المستهدف --</option>
                      {allProjects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (الميزانية: {p.total || p.budget || 0} ر.س)
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              )}

              {/* Date */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted mb-1">تاريخ السند *</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ height: "42px", borderRadius: "8px" }}
                    required
                  />
                  {error.date && <div className="text-danger small mt-1">{error.date[0]}</div>}
                </Form.Group>
              </Col>

              {/* Amount */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted mb-1">المبلغ (ر.س) *</Form.Label>
                  <Form.Control
                    type="number"
                    min="0.01"
                    step="any"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ height: "42px", borderRadius: "8px" }}
                    required
                  />
                  {error.amount && <div className="text-danger small mt-1">{error.amount[0]}</div>}
                </Form.Group>
              </Col>

              {/* Account */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted mb-1">الحساب المدفوع عليه *</Form.Label>
                  <Form.Select
                    value={cridet}
                    onChange={(e) => setCridet(e.target.value)}
                    style={{ height: "42px", borderRadius: "8px" }}
                    required
                  >
                    <option value="">إختر الحساب...</option>
                    {(Array.isArray(account) ? account : []).map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </Form.Select>
                  {error.account && <div className="text-danger small mt-1">{error.account[0]}</div>}
                </Form.Group>
              </Col>

              {/* Project Phase */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted mb-1">مرحلة المشروع</Form.Label>
                  <Form.Select
                    value={selHumancases}
                    onChange={(e) => setSelHumancases(e.target.value)}
                    style={{ height: "42px", borderRadius: "8px" }}
                  >
                    <option value="0">لا توجد مرحلة محددة (المشروع ككل)</option>
                    {(Array.isArray(humancases) ? humancases : []).map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Transfer Type */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted mb-1">نوع التحويل / الدفع</Form.Label>
                  <Form.Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{ height: "42px", borderRadius: "8px" }}
                  >
                    <option value="1">الشبكة</option>
                    <option value="2">تحويل بنكي</option>
                    <option value="3">إيداع</option>
                    <option value="4">شيك</option>
                    <option value="5">نقدي</option>
                    <option value="6">KNET</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Description */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted mb-1">الوصف والبيان</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="أدخل بيان أو سبب الصرف..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ height: "42px", borderRadius: "8px" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Barcode visual preview */}
            <div className="d-flex justify-content-center align-items-center mt-3 pt-3 border-top">
              <svg ref={barcodeRef} style={{ maxWidth: "200px" }}></svg>
            </div>
          </Form>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between align-items-center">
        <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
          إلغاء
        </Button>
        <Button
          type="submit"
          form="payment-voucher-project-form"
          className="btn-kpi-save"
          disabled={isSubmitting || loading}
          style={{ minWidth: "140px" }}
        >
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" className="ms-2" />
              جاري التنفيذ...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCheck} className="ms-1" />
              إصدار السند الآن
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PaymentVoucherProject;
