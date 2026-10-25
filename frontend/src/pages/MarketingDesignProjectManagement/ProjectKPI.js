import { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import RegisterTextBox from "../../components/RegisterTextBox";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ProjectKPI.css";
import Title from "../../components/title";
import TestPreLoader from "../TestPreLoader/TestPreLoader";

function ProjectKPI() {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const getKpis = async () => {
    try {
      const res = await API.get(`/kpi/quizs`);
      setKpis(res.data);
    } catch (error) {
      console.error("There was an error!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getKpis();
  }, []);

  const calculateStatus = (actual, target) => {
    if (actual === null || actual === "") return null;
    if (+actual >= target) return "ممتاز";
    if (+actual >= target * 0.8) return "تحذير";
    return "خطر";
  };

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
        project_id: id,
        kpis: kpis.map((k) => ({
          kpi_id: k.id,
          actual: k.actual,
        })),
      };

      const res = await API.post(`projectkpi/store`, payload);
      
      if (res.status === 200 || res.status === 201) {
        toast.success("تم حفظ القيم بنجاح");
        navigate(`/projectkpiview/${id}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg = error.response?.data?.message || "حدث خطأ أثناء حفظ القيم";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <TestPreLoader />;

  return (
    <form onSubmit={handleSubmit}>
      <Title
        title="مؤشرات الاداء"
        style={{ width: "unset", marginBottom: "20px" }}
      />
      <br />
      {kpis.map((kpi, index) => (
        <div key={kpi.id} className="kpi-row">
          <RegisterTextBox
            parentStyle={{ width: "100%" }}
            id="vacDescription"
            label="المؤشر"
            value={kpi.quiz}
            stylee={{ width: "45%" }}
            disabled={true}
          />

          <RegisterTextBox
            parentStyle={{ width: "60%" }}
            id="vacDescription"
            label="القيمةالمتوقعة"
            value={kpi.target}
            stylee={{ width: "45%" }}
            disabled={true}
          />

          <RegisterTextBox
            parentStyle={{ width: "60%" }}
            id="vacDescription"
            label="القيمة الحالية"
            value={kpi.actual}
            stylee={{ width: "45%" }}
            onChange={(e) => handleChange(index, e.target.value)}
          />

          <RegisterTextBox
            parentStyle={{ width: "60%" }}
            id="vacDescription"
            label="الحالة"
            value={kpi.status}
            stylee={{ width: "45%" }}
            disabled={true}
            className={`status ${kpi.status}`}
          />
        </div>
      ))}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <button 
          type="submit" 
          variant="primary" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "جاري الحفظ..." : "حفظ القيم"}
        </button>
      </div>
    </form>
  );
}

export default ProjectKPI;
