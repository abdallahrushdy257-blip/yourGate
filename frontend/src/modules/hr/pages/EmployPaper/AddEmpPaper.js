import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../../components/title";
import "./employPaper.css";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import UploadInput from "../../../../components/UploadInput";
import { Form, Spinner } from "react-bootstrap";
import CustomButton from "../../../../components/CustomButton";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hrService } from "../../services/hrService";

function AddEmpPaper() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [file, setFile] = useState("");
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);
    formData.append("id", id);
    try {
      const res = await hrService.uploadEmployeePaper(formData);
      if (res.status === 200) {
        navigate("/hrreport/employees");
      } else {
        setError(res.data.errors);
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err?.response?.data?.errors || {});
    }
  };

  return (
    <div className="AddEmpPaper">
      <Title
        title="إضافة اوراق توظيف"
        className="marketingtitle"
        icon={<FontAwesomeIcon icon={faPlusCircle} />}
      />
      <Form
        className="AddEmpPaperCon"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="AddEmpPaperRow">
          <RegisterTextbox
            parentStyle={{ width: "30%" }}
            id="name"
            label="الورقة 1"
            type="text"
            stylee={{ width: "45%" }}
            onChange={(e) => setName(e.target.value)}
            value={name}
            name="name"
          />
          <UploadInput
            id="documentUpload"
            parentStyle={{
              marginBottom: "20px",
              display: "unset",
            }}
            label="إرفع الورقة 1"
            onChange={(e) => setFile(e.target.files[0])}
            name="file"
            style={{
              margin: "30px 0 0 0",
            }}
          />
        </div>
        {isSubmitting ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <CustomButton text="حفظ" className="addPaperBtn" />
        )}
      </Form>
    </div>
  );
}

export default AddEmpPaper;

