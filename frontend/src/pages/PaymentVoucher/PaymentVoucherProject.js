import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Spinner, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import JsBarcode from "jsbarcode";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import API from "../../api/axiosConfig";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterTextarea from "../../components/RegisterTextarea";

function PaymentVoucherProject(props) {
  // Support both Modal usage (props.show) and URL route usage (/paymentvoucherproject/:id)
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const isModalControlled = props.show !== undefined;
  const [internalShow, setInternalShow] = useState(true);
  const show = isModalControlled ? props.show : internalShow;

  const projectId = props.projectId || routeId;

  const handleClose = () => {
    if (isModalControlled) {
      if (props.onHide) props.onHide();
    } else {
      setInternalShow(false);
      navigate(-1);
    }
  };

  const barcodeRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [project, setProject] = useState(null);
  const [humancases, setHumancases] = useState([]);
  const [account, setAccount] = useState([]);

  // Form states
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [amount, setAmount] = useState("");
  const [cridet, setCridet] = useState("");
  const [selHumancases, setSelHumancases] = useState("");
  const [type, setType] = useState("1");
  const [description, setDescription] = useState("");
  const [error, setError] = useState({});

  // Generate barcode
  useEffect(() => {
    if (show && barcodeRef.current) {
      try {
        const barcodeNum = `442002`;
        JsBarcode(barcodeRef.current, barcodeNum, {
          format: "CODE128",
          displayValue: false,
          fontSize: 14,
          height: 36,
          margin: 0,
        });
      } catch (err) {
        console.error("Barcode render error:", err);
      }
    }
  }, [show, loading]);

  // Load project, phases, accounts
  useEffect(() => {
    if (!show || !projectId) return;

    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError({});

      try {
        const [phasesRes, accountsRes, projectRes] = await Promise.allSettled([
          API.get(`/projectphase/${projectId}/all`),
          API.get("/transactions/components/donations"),
          API.get(`/projects/${projectId}`),
        ]);

        if (!isMounted) return;

        if (phasesRes.status === "fulfilled" && phasesRes.value?.data) {
          const list = Array.isArray(phasesRes.value.data)
            ? phasesRes.value.data
            : phasesRes.value.data?.data || [];
          setHumancases(Array.isArray(list) ? list : []);
        }

        if (accountsRes.status === "fulfilled" && accountsRes.value?.data) {
          const list = Array.isArray(accountsRes.value.data)
            ? accountsRes.value.data
            : accountsRes.value.data?.data || [];
          setAccount(Array.isArray(list) ? list : []);
        }

        if (projectRes.status === "fulfilled" && projectRes.value?.data) {
          const p = projectRes.value.data?.data || projectRes.value.data || {};
          setProject(p);
        }
      } catch (err) {
        console.error("Error loading project voucher data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [show, projectId]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const localErrors = {};
    if (!date) localErrors.date = "تاريخ السند مطلوب";
    if (!amount || parseFloat(amount) <= 0) localErrors.amount = "المبلغ مطلوب ويجب أن يكون أكبر من صفر";
    if (!cridet) localErrors.cridet = "يرجى اختيار الحساب المدفوع عليه";
    if (!type) localErrors.type = "يرجى اختيار نوع التحويل";

    if (Object.keys(localErrors).length > 0) {
      setError(localErrors);
      return;
    }

    setIsSubmitting(true);
    setError({});

    try {
      const payload = {
        amount: parseFloat(amount),
        selhuman: selHumancases || "0",
        type: type,
        date: date,
        project_id: projectId,
        account: cridet,
        balanceid: project && project.accounts_id ? project.accounts_id : 0,
        description: description || "",
      };

      const res = await API.post("/shoptransaction/storepayprojects", payload);

      if (res.status === 200 || res.status === 201) {
        toast.success("تم إصدار سند الصرف بنجاح");
        if (props.onSuccess) {
          props.onSuccess();
        }
        handleClose();
      } else {
        if (res.data?.errors) {
          setError(res.data.errors);
        } else if (res.data?.message) {
          toast.error(res.data.message);
        }
      }
    } catch (err) {
      console.error("Error submitting voucher:", err);
      if (err.response?.data?.errors) {
        setError(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || "فشلت عملية إنشاء سند الصرف");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      size="md"
      show={show}
      onHide={handleClose}
      className="modal-table archModal donor-modal"
      dialogClassName="fit-content-modal"
      centered
    >
      <Modal.Header>
        <Modal.Title className="w-100 text-center">سند صرف</Modal.Title>
        <Button
          className="custom-close-button cls-btn"
          variant="link"
          onClick={handleClose}
        >
          <FontAwesomeIcon icon={faXmark} className="closeModal" />
        </Button>
      </Modal.Header>

      <Modal.Body className="p-4" style={{ direction: "rtl" }}>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <div className="mt-2 text-muted" style={{ fontSize: "13px" }}>
              جاري تحميل البيانات...
            </div>
          </div>
        ) : (
          <Form
            onSubmit={handleSubmit}
            className="global-form-container border-0 shadow-none p-0 bg-transparent"
          >
            {/* Date & Amount */}
            <Row className="mb-3">
              <Col md={6}>
                <div className="mb-3">
                  <p className="mb-2" style={{ textAlign: "right", fontSize: "13px", fontWeight: "700" }}>
                    تاريخ السند
                  </p>
                  <input
                    type="date"
                    id="date"
                    className="custom-datepicker w-100"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  {error && error.date && (
                    <small className="text-danger d-block mt-1">
                      {Array.isArray(error.date) ? error.date[0] : error.date}
                    </small>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <RegisterTextbox
                  id="amount"
                  label="المبلغ"
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  error={error && (Array.isArray(error.amount) ? error.amount[0] : error.amount)}
                  placeholder="0.00"
                />
              </Col>
            </Row>

            {/* Account & Phase */}
            <Row className="mb-3">
              <Col md={6}>
                <RegisterSelect
                  id="acc"
                  label="الحساب المدفوع عليه"
                  options={[
                    { value: "", label: "إختر الحساب" },
                    ...(Array.isArray(account) ? account : []).map((acc) => ({
                      value: acc.id,
                      label: acc.name,
                    })),
                  ]}
                  value={cridet}
                  onChange={(e) => setCridet(e.target.value)}
                  error={error && (Array.isArray(error.cridet) ? error.cridet[0] : error.cridet)}
                />
              </Col>
              <Col md={6}>
                <RegisterSelect
                  id="benf"
                  label="المرحلة"
                  options={[
                    { value: "", label: "إختر المرحلة" },
                    { value: "0", label: "لا يوجد مرحلة" },
                    ...(Array.isArray(humancases) ? humancases : []).map((humancase) => ({
                      value: humancase.id,
                      label: humancase.name,
                    })),
                  ]}
                  value={selHumancases}
                  onChange={(e) => setSelHumancases(e.target.value)}
                />
              </Col>
            </Row>

            {/* Transfer Type & Description */}
            <Row className="mb-3">
              <Col md={6}>
                <RegisterSelect
                  id="location"
                  label="نوع التحويل"
                  options={[
                    { value: "", label: "إختر النوع" },
                    { value: "1", label: "الشبكة" },
                    { value: "2", label: "تحويل" },
                    { value: "3", label: "إيداع" },
                    { value: "4", label: "شيك" },
                    { value: "5", label: "نقدي" },
                    { value: "6", label: "KNET" },
                  ]}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  error={error && (Array.isArray(error.type) ? error.type[0] : error.type)}
                />
              </Col>
              <Col md={6}>
                <RegisterTextbox
                  id="description"
                  label="الوصف"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="الوصف أو سبب الصرف..."
                />
              </Col>
            </Row>

            {/* Barcode section identical to original voucher */}
            <div
              className="d-flex justify-content-center align-items-center my-3 py-2"
              style={{ direction: "ltr" }}
            >
              <svg ref={barcodeRef}></svg>
            </div>

            {/* Action Buttons styled exactly like other project modals */}
            <div className="d-flex justify-content-center gap-2 mt-4 mb-2">
              {isSubmitting ? (
                <Button variant="primary" disabled className="px-5 py-2 fw-bold" style={{ minWidth: "120px" }}>
                  <Spinner animation="border" size="sm" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  type="submit"
                  className="px-5 py-2 fw-bold"
                  style={{ minWidth: "120px" }}
                >
                  إدفع الآن
                </Button>
              )}
              <Button
                variant="secondary"
                type="button"
                className="px-4 py-2"
                onClick={handleClose}
                disabled={isSubmitting}
                style={{ minWidth: "100px" }}
              >
                إلغاء
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default PaymentVoucherProject;
