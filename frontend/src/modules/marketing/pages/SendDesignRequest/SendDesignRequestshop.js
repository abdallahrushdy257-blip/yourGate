import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";
import { Form, Spinner } from "react-bootstrap";

import Title from "../../../../components/title";
import RegisterTextarea from "../../../../components/RegisterTextarea";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import UploadInput from "../../../../components/UploadInput";
import CustomButton from "../../../../components/CustomButton";

import { marketingService } from "../../services/marketingService";
import "./SendDesignRequest.css";

function SendDesignRequestshop() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [rows, setRows] = useState([]);
  const [upload1, setUpload1] = useState("");
  const [upload2, setUpload2] = useState("");
  const [note, setNote] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const designType = 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mForm = new FormData();
    mForm.append("id", id);
    mForm.append("upload", upload1);
    mForm.append("upload2", upload2);
    mForm.append("note", note);
    mForm.append("description", description);
    mForm.append("type", designType);

    try {
      const res = await marketingService.submitShopDetails(mForm);
      if (res.status === 200) {
        navigate("/casedetails");
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err?.response?.data?.errors || {});
    }
  };

  const getShop = async () => {
    try {
      const response = await marketingService.getShop(id);
      setRows(response.data);
    } catch (err) {
      setError(err?.response?.data?.errors || {});
    }
  };

  useEffect(() => {
    getShop();
  }, [id]);

  return (
    <div className="senddesignrequest">
      <Title
        title="ارسال طلب تصميم"
        icon={<FontAwesomeIcon icon={faEnvelopeOpenText} />}
        style={{ width: "unset" }}
      />
      <Form
        className="global-form-container"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="designnrequest">
          <RegisterTextbox
            parentStyle={{ width: "55%" }}
            id="name"
            label="إسم التصميم"
            type="text"
            style={{ width: "55%" }}
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
                value={upload1}
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
                value={upload2}
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

export default SendDesignRequestshop;

