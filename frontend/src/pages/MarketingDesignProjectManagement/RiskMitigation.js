import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faShieldHalved, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Spinner, Form } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import CustomButton from "../../components/CustomButton";
import Title from "../../components/title";
import API from "../../api/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function RiskMitigation() {
  const [description, setDescription] = useState("");
  const [impectlevel, setImpactLevel] = useState("");
  const [probability, setProbability] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const handleMitigation = async (e) => {
    e.preventDefault();

    if (!impectlevel && impectlevel !== 0) {
      return toast.error("يرجى اختيار مستوى التأثير");
    }
    if (!probability && probability !== 0) {
      return toast.error("يرجى اختيار الاحتمالية");
    }
    if (!description.trim()) {
      return toast.error("الوصف مطلوب");
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("risk_id", id);
    formData.append("description", description);
    formData.append("impactlevel", impectlevel);
    formData.append("probability", probability);

    try {
      const res = await API.post(`/projectrisk/mitigation/store`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("تم حفظ خطة التخفيف بنجاح");
        navigate(-1);
      }
    } catch (err) {
      console.error("Error submitting mitigation:", err);
      const errMsg =
        err.response?.data?.message || "حدث خطأ أثناء حفظ خطة التخفيف";
      toast.error(errMsg);
      setError(err.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="printcasedata-container" dir="rtl" style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <Title
          title="خطة تخفيف المخاطر"
          icon={<FontAwesomeIcon icon={faShieldHalved} />}
        />

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "10px",
            fontWeight: "700",
          }}
        >
          <FontAwesomeIcon icon={faArrowRight} />
          <span>رجوع</span>
        </button>
      </div>

      <div className="global-form-container" style={{ width: "80%", margin: "0 auto" }}>
        <Form onSubmit={handleMitigation} encType="multipart/form-data">
          <div className="row g-3">
            <div className="col-md-6">
              <RegisterSelect
                id="impectlevel"
                label="مستوى التأثير بعد المعالجة"
                stylee={{ width: "100%" }}
                parentStyle={{ width: "100%" }}
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
              {error && error.impactlevel && (
                <span className="error text-danger">{error.impactlevel[0]}</span>
              )}
            </div>

            <div className="col-md-6">
              <RegisterSelect
                id="probability"
                label="الاحتمالية بعد المعالجة"
                stylee={{ width: "100%" }}
                parentStyle={{ width: "100%" }}
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
              {error && error.probability && (
                <span className="error text-danger">{error.probability[0]}</span>
              )}
            </div>

            <div className="col-md-12">
              <RegisterTextbox
                label="وصف خطة وإجراءات التخفيف"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                stylee={{ width: "100%" }}
                parentStyle={{ width: "100%" }}
              />
              {error && error.description && (
                <span className="error text-danger">{error.description[0]}</span>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            {isSubmitting ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <CustomButton text="حفظ خطة التخفيف" />
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}

export default RiskMitigation;
