import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { faShieldHalved, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Spinner, Form, Card, Row, Col, Badge } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import API from "../../api/axiosConfig";
import { useParams, useNavigate } from "react-router";
import RegisterSelect from "../../components/RegisterSelect";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import Title from "../../components/title";
import CustomButton from "../../components/CustomButton";
import { toast } from "react-toastify";

function RiskMitigation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [risk, setRisk] = useState(null);
  const [description, setDescription] = useState("");
  const [impactlevel, setImpactLevel] = useState("1");
  const [probability, setProbability] = useState("1");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  const getRiskDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/projectrisk/mitigation/${id}`);
      const data = res.data?.data || res.data || {};
      setRisk(data);

      if (data.mitigation_description || data.action_plan) {
        setDescription(data.mitigation_description || data.action_plan || "");
      }
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
      const res = await API.post(`/projectrisk/mitigation/store`, payload);
      if (res.status === 200 || res.status === 201) {
        toast.success("تم حفظ خطة التخفيف بنجاح");
        navigate(-1);
      }
    } catch (err) {
      console.error("Submission error:", err);
      const errs = err.response?.data?.errors || {};
      setError(errs);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حفظ خطة التخفيف");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <TestPreLoader />;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <Title
          title="خطة تخفيف المخاطر"
          icon={<FontAwesomeIcon icon={faShieldHalved} />}
          style={{ width: "unset", margin: 0 }}
        />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-outline-secondary"
          style={{ borderRadius: "8px", fontWeight: "600" }}
        >
          <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: "6px" }} />
          العودة
        </button>
      </div>

      {risk && (
        <Card
          className="mb-4 shadow-sm"
          style={{
            background: "var(--card-bg, #fff)",
            border: "1px solid var(--border-color, #e2e8f0)",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <Card.Header
            style={{
              background: "transparent",
              borderBottom: "1px solid var(--border-color, #e2e8f0)",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            تفاصيل الخطر المحدد
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={3}>
                <strong>المرحلة: </strong>
                <span>{risk.phase_name || "المشروع ككل"}</span>
              </Col>
              <Col md={3}>
                <strong>مستوى التأثير الأصلي: </strong>
                <Badge bg={risk.impactlevel === 3 ? "danger" : risk.impactlevel === 1 ? "success" : "warning"}>
                  {risk.impact_level_string || "متوسط"}
                </Badge>
              </Col>
              <Col md={3}>
                <strong>الاحتمالية الأصلية: </strong>
                <Badge bg={risk.probability === 3 ? "danger" : risk.probability === 1 ? "success" : "warning"}>
                  {risk.probability_string || "متوسط"}
                </Badge>
              </Col>
              <Col md={3}>
                <strong>الحالة الحالية: </strong>
                <Badge bg={risk.status === "مغلق" ? "success" : "info"}>
                  {risk.status_string || "مفتوح"}
                </Badge>
              </Col>
              <Col md={12} className="mt-2">
                <strong>وصف الخطر: </strong>
                <p style={{ margin: "4px 0 0", color: "var(--text-secondary, #64748b)" }}>
                  {risk.description || "لا يوجد وصف"}
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <div className="createManageCon">
        <Form onSubmit={handleMitigation}>
          <div className="createManege-inputs">
            <div className="case-name">
              <RegisterSelect
                id="impectlevel"
                label="مستوى التأثير بعد التخفيف"
                stylee={{ width: "100%" }}
                parentStyle={{ width: "80%" }}
                options={[
                  { value: "", label: "اختر مستوى التأثير" },
                  { value: "1", label: "منخفض" },
                  { value: "2", label: "متوسط" },
                  { value: "3", label: "مرتفع" },
                ]}
                name="impactLevel"
                value={impactlevel}
                onChange={(e) => setImpactLevel(e.target.value)}
              />

              <RegisterSelect
                id="probability"
                label="الاحتمالية بعد التخفيف"
                stylee={{ width: "100%" }}
                parentStyle={{ width: "80%" }}
                options={[
                  { value: "", label: "اختر الاحتمالية" },
                  { value: "1", label: "منخفض" },
                  { value: "2", label: "متوسط" },
                  { value: "3", label: "مرتفع" },
                ]}
                name="probability"
                value={probability}
                onChange={(e) => setProbability(e.target.value)}
              />

              <RegisterTextbox
                label="إجراءات وخطة التخفيف"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                stylee={{ width: "100%" }}
                parentStyle={{ width: "80%" }}
                placeholder="أدخل تفاصيل خطة التخفيف والإجراءات الوقائية..."
                required
              />
              {error && error.description && (
                <span className="error">{error.description[0]}</span>
              )}
            </div>
          </div>

          {isSubmitting ? (
            <Spinner
              animation="border"
              variant="primary"
              style={{ display: "block", margin: "20px auto" }}
            />
          ) : (
            <div className="createManege-inputs createManege-buttonCon">
              <CustomButton text="حفظ خطة التخفيف" />
            </div>
          )}
        </Form>
      </div>
    </>
  );
}

export default RiskMitigation;
