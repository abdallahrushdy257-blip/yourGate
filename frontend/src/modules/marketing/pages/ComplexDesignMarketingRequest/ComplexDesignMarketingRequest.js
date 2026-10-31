import { Form, Tabs, Tab, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullhorn,
  faEnvelopeOpenText,
} from "@fortawesome/free-solid-svg-icons";

import RegisterTextbox from "../../../../components/RegisterTextBox";
import UploadInput from "../../../../components/UploadInput";
import CustomButton from "../../../../components/CustomButton";
import Title from "../../../../components/title";
import RegisterTextarea from "../../../../components/RegisterTextarea";

import { marketingService } from "../../services/marketingService";
import "../../../../pages/CompletingData/CompletingData.css";
import "./complexdesignmarketingrequest.css";
import "../SendDesignRequest/SendDesignRequest.css";

function ComplexDesignMarketingRequest() {
  const [activeTab, setActiveTab] = useState("form1");
  const navigate = useNavigate();
  const { id } = useParams();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [upload1, setUpload1] = useState(null);
  const [upload2, setUpload2] = useState(null);
  const [note, setNote] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const marktingType = 2;
  const designType = 1;

  const getProject = async () => {
    try {
      const response = await marketingService.getProject(id);
      setRows(response.data);
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.errors || {});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
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
        setDescription("");
        setUpload1(null);
        setUpload2(null);
        setNote("");
        setActiveTab("form2");
        setIsSubmit(false);
      }
      setError({});
    } catch (err) {
      setIsSubmit(false);
      setError(err?.response?.data?.errors || {});
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    const mForm = new FormData();
    mForm.append("id", id);
    mForm.append("upload", upload1);
    mForm.append("upload2", upload2);
    mForm.append("note", note);
    mForm.append("description", description);
    mForm.append("type", designType);
    try {
      const res = await marketingService.submitProjectDetails(mForm);
      if (res.status === 200) {
        navigate("/projectStatus");
      }
    } catch (err) {
      setIsSubmit(false);
      setError(err?.response?.data?.errors || {});
    }
  };

  useEffect(() => {
    getProject();
  }, [id]);

  return (
    <div className="complete-form-container complexdesignmarketingrequest">
      <Tabs
        id="completing-data-tabs"
        activeKey={activeTab}
        className="mb-3 completeDatatabs"
        style={{ direction: "rtl" }}
      >
        <Tab eventKey="form1" title="1">
          <div className="senddesignrequest">
            <Title
              title="ارسال طلب تسويق"
              icon={<FontAwesomeIcon icon={faBullhorn} />}
              style={{ width: "unset" }}
            />
            <Form
              onSubmit={handleSubmit}
              className="sendDesignForm"
              encType="multipart/form-data"
            >
              <div className="designnrequest mergedReqClass">
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
                      id="documentUpload1"
                      parentStyle={{ marginBottom: "unset" }}
                      label="مرفقات"
                      name="documentUpload1"
                      onChange={(e) => setUpload1(e.target.files[0])}
                      error={error.upload}
                    />
                  </div>
                  <div className="design-files">
                    <UploadInput
                      id="documentUpload2"
                      parentStyle={{ marginBottom: "unset" }}
                      label="الصور"
                      name="documentUpload2"
                      onChange={(e) => setUpload2(e.target.files[0])}
                      error={error.upload2}
                    />
                  </div>
                </div>
                <div className="design-description"></div>
                <RegisterTextarea
                  label="متطلبات التسويق"
                  stylee={{ width: "100%" }}
                  parentStyle={{ width: "55%", marginBottom: "20px" }}
                  name="description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  error={error.description}
                />
                <RegisterTextarea
                  label="نظره عامة عن التسويق"
                  stylee={{ width: "100%" }}
                  parentStyle={{ width: "55%", marginBottom: "20px" }}
                  name="note"
                  onChange={(e) => setNote(e.target.value)}
                  value={note}
                  error={error.note}
                />
              </div>
            </Form>
          </div>
        </Tab>
        <Tab eventKey="form2" title="2">
          <div className="senddesignrequest">
            <Title
              title="ارسال طلب تصميم"
              icon={<FontAwesomeIcon icon={faEnvelopeOpenText} />}
              style={{ width: "unset" }}
            />
            <Form onSubmit={handleSubmit2} className="sendDesignForm">
              <div className="designnrequest mergedReqClass">
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
                      id="documentUpload3"
                      parentStyle={{ marginBottom: "unset" }}
                      label="مرفقات"
                      name="documentUpload1"
                      onChange={(e) => setUpload1(e.target.files[0])}
                      error={error.upload}
                    />
                  </div>
                  <div className="design-files">
                    <UploadInput
                      id="documentUpload4"
                      parentStyle={{ marginBottom: "unset" }}
                      label="الصور"
                      name="documentUpload2"
                      onChange={(e) => setUpload2(e.target.files[0])}
                      error={error.upload2}
                    />
                  </div>
                </div>
                <RegisterTextarea
                  label="متطلبات التصميم"
                  stylee={{ width: "100%" }}
                  parentStyle={{ width: "55%", marginBottom: "20px" }}
                  name="description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  error={error.description}
                />
                <RegisterTextarea
                  label="نظره عامة عن المشروع"
                  stylee={{ width: "100%" }}
                  parentStyle={{ width: "55%", marginBottom: "20px" }}
                  name="note"
                  onChange={(e) => setNote(e.target.value)}
                  value={note}
                  error={error.note}
                />
              </div>
            </Form>
          </div>
        </Tab>
      </Tabs>
      <div className="navigation-buttons">
        {activeTab === "form1" &&
          (isSubmit ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <CustomButton text="ارسال" onClick={handleSubmit} />
          ))}
        {activeTab === "form2" &&
          (isSubmit ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <CustomButton text="إرسال" onClick={handleSubmit2} />
          ))}
      </div>
    </div>
  );
}

export default ComplexDesignMarketingRequest;

