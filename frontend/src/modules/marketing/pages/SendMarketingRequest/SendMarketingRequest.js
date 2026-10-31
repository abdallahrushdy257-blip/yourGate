import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { Form, Spinner } from "react-bootstrap";

import Title from "../../../../components/title";
import RegisterTextarea from "../../../../components/RegisterTextarea";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import UploadInput from "../../../../components/UploadInput";
import CustomButton from "../../../../components/CustomButton";
import TestPreLoader from "../../../../pages/TestPreLoader/TestPreLoader";
import { BASE_URL } from "../../../../api/axiosConfig";

import { marketingService } from "../../services/marketingService";
import "../SendDesignRequest/SendDesignRequest.css";

function SendMarketingRequest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [upload1, setUpload1] = useState(null);
  const [upload2, setUpload2] = useState(null);
  const [note, setNote] = useState("");
  const [description, setDescription] = useState("");
  const marktingType = 2;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mForm = new FormData();
    mForm.append("id", id);
    mForm.append("upload", upload1);
    mForm.append("upload2", upload2);
    mForm.append("note", note);
    mForm.append("description", description);
    mForm.append("type", marktingType);

    try {
      const res = await marketingService.submitProjectDetails(mForm);
      if (res.status === 200) {
        navigate("/projectStatus");
      }
    } catch (err) {
      setError(err?.response?.data?.errors || {});
      setIsSubmitting(false);
    }
  };

  const getProject = async () => {
    try {
      const response = await marketingService.getProject(id);
      setRows(response.data);
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.errors || {});
      setLoading(false);
    }
  };

  useEffect(() => {
    getProject();
  }, [id]);

  if (loading) {
    return <TestPreLoader />;
  }

  return (
    <div className="senddesignrequest">
      <Title
        title="ارسال طلب تسويق"
        icon={<FontAwesomeIcon icon={faBullhorn} />}
        style={{ width: "unset" }}
      />
      <Form onSubmit={handleSubmit} className="sendDesignForm">
        <div className="designnrequest">
          <RegisterTextbox
            parentStyle={{ width: "55%" }}
            id="name"
            label="إسم المشروع"
            type="text"
            stylee={{ width: "55%" }}
            value={rows && rows.name}
            disabled
          />
          <div className="design-filesCon">
            <div className="design-files">
              <UploadInput
                id="documentUpload"
                parentStyle={{ marginBottom: "unset" }}
                label="مرفقات اخري"
                onChange={(e) => setUpload1(e.target.files[0])}
              />
              {error && error.upload && (
                <div className="error">{error.upload}</div>
              )}
            </div>

            <div className="design-files">
              <UploadInput
                id="documentUpload2"
                parentStyle={{ marginBottom: "unset" }}
                label="إرفاق صور"
                onChange={(e) => setUpload2(e.target.files[0])}
              />
              {error && error.upload2 && (
                <div className="error">{error.upload2}</div>
              )}
            </div>
          </div>

          <RegisterTextarea
            label="متطلبات التصميم"
            stylee={{ width: "100%" }}
            parentStyle={{ width: "55%", marginBottom: "20px" }}
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          {error && error.description && (
            <div className="error">{error.description}</div>
          )}

          <RegisterTextarea
            label="نظره عامة عن المشروع"
            stylee={{ width: "100%" }}
            parentStyle={{ width: "55%", marginBottom: "20px" }}
            name="note"
            onChange={(e) => setNote(e.target.value)}
            value={note}
          />
          {error && error.note && <div className="error">{error.note}</div>}

          <a
            href={`${BASE_URL}/download/marketingcontract`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-link"
          >
            تحميل العقد
          </a>

          {isSubmitting ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <CustomButton text="إرسال" />
          )}
        </div>
      </Form>
    </div>
  );
}

export default SendMarketingRequest;

