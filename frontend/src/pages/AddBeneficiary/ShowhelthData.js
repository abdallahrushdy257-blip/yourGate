import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import API from "../../api/axiosConfig";
import TableComponent from "../../components/TableComponent";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../../components/title";
import { Modal, Form, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import UploadInput from "../../components/UploadInput";
import CustomButton from "../../components/CustomButton";
import { faPlus, faReceipt, faMinus } from "@fortawesome/free-solid-svg-icons";

function ShowhealthData(props) {
  const columns = [
    { name: "إسم المرض", key: "disease_name" },
    { name: " نوع المرض", key: "disease_type" },
    { name: "نوع العلاج", key: "treatment_type" },
    { name: "تكلفة العلاج", key: "treatment_cost" },
    { name: " خطورة المرض", key: "disease_degree" },
    { name: " ملاحظات", key: "notes" },
    { name: "", key: "actions" },
  ];
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const id = props?.id || params?.id;

  // --- HealthData Modal State ---
  const [showModal, setShowModal] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const [healthStatus, setHealthStatus] = useState("good");
  const [illnesses, setIllnesses] = useState([{ id: 1 }]);
  const [name, setName] = useState([""]);
  const [type, setType] = useState([""]);
  const [degree, setDegree] = useState([""]);
  const [notes, setNotes] = useState([""]);
  const [upload, setUpload] = useState("");
  const [trtype, setTrtype] = useState([""]);
  const [trcost, setTrcost] = useState([""]);
  const [formError, setFormError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMinus, setShowMinus] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setIllnesses([{ id: 1 }]);
    setName([""]);
    setType([""]);
    setDegree([""]);
    setNotes([""]);
    setTrtype([""]);
    setTrcost([""]);
    setUpload("");
    setFormError({});
  };

  const handleAddIllness = () => {
    setIllnesses([...illnesses, { id: illnesses.length + 1 }]);
    setName([...name, ""]);
    setType([...type, ""]);
    setDegree([...degree, ""]);
    setNotes([...notes, ""]);
    setTrtype([...trtype, ""]);
    setTrcost([...trcost, ""]);
    setShowMinus(true);
  };

  const handleMinusIllness = () => {
    setIllnesses(illnesses.slice(0, -1));
    setName(name.slice(0, -1));
    setType(type.slice(0, -1));
    setDegree(degree.slice(0, -1));
    setNotes(notes.slice(0, -1));
    setTrtype(trtype.slice(0, -1));
    setTrcost(trcost.slice(0, -1));
    if (illnesses.length === 2) setShowMinus(false);
  };

  const handleFormChange = (setter, index, value) => {
    setter((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const mergeIllnesses = () => {
    return name.map((item, index) => ({
      name: item,
      type: type[index],
      degree: degree[index],
      notes: notes[index],
      trtype: trtype[index],
      trcost: trcost[index],
    })).slice(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const healthDataJson = JSON.stringify(mergeIllnesses());
    const formData = new FormData();
    formData.append("illness", healthDataJson);
    formData.append("upload", upload);
    formData.append("id", id);

    try {
      const response = await API.post("/humancasedetails/health/store", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        handleClose();
        setTableReloadKey(Date.now());
      }
    } catch (err) {
      setFormError(err.response?.data?.message || {});
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const getHumanCases = async () => {
  //     try {
  //         const res = await API.post(`/healthdata/${id}`);
  //         const data = await res;
  //         if (data.status === 200) {
  //             setRows(data.data);
  //             setLoading(false);
  //         }
  //     } catch (error) {
  //         console.error(error);
  //         setError(error.response.data.errors);
  //     }
  // };
  // useEffect(() => {
  //     getHumanCases();
  // }, []);
  const dropdownOptions = [{ label: "تعديل", route: "/edithealthData/:id" }];

  const handleDownload = (selectedRows) => {
    const selectedData = rows.filter((row) => selectedRows.includes(row.id));
    if (selectedData.length === 0) {
      alert("Please select at least one row.");
      return;
    }

    const csvHeader = columns
      .filter((col) => col.key !== "actions")
      .map((col) => col.name)
      .join(",");

    const csvRows = selectedData.map((row) =>
      columns
        .filter((col) => col.key !== "actions")
        .map((col) => `"${row[col.key] || ""}"`)
        .join(","),
    );

    const csvContent = `${csvHeader}\n${csvRows.join("\n")}`;

    const bom = "\uFEFF";
    const finalContent = bom + csvContent;

    const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "selected_rows_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // useEffect(() => {
  //     getHumanCases();
  // }, []);

  return (
    <>
      <div className=" employpaper">
        <Title
          title="البيانات الصحية"
          style={{ width: "unset" }}
          classname="rmtit"
          icon={<FontAwesomeIcon icon={faReceipt} />}
        />

        <TableComponent
          apiUrl={`/humancasedetails/showhealthdata/${id}`}
          columns={columns}
          dropdownOptions={dropdownOptions}
          searchDate={false}
          triggerReload={tableReloadKey}
          addBtn={true}
          addBtnName="مرض جديد"
          onAddClick={handleShow}
        />

        <Modal show={showModal} onHide={handleClose} size="xl" centered className="archModal">
          <Modal.Header closeButton>
            <Modal.Title>إضافة بيانات صحية</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ direction: "rtl" }}>
            {formError && <span className="error">{formError === 0 ? "يجب ادخال البيانات الصحية" : ""}</span>}
            <Form className="global-form-container" style={{ width: "100%", margin: "0" }} onSubmit={handleSubmit}>
              <div>
                <span className="addillness" onClick={handleAddIllness} style={{ borderRadius: "20px", color: "green", marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faPlus} />
                </span>
                {showMinus && (
                  <span className="addillness" onClick={handleMinusIllness} style={{ borderRadius: "20px", color: "red", cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faMinus} />
                  </span>
                )}
                <div className="duplicatedContent">
                  {illnesses.map((illness, idx) => (
                    <div className="AddBeneficiaryContainerRow2" key={idx} style={{ gap: "10px", marginBottom: "20px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                      <RegisterTextbox
                        parentStyle={{ width: "100%" }}
                        label="اسم المرض"
                        type="text"
                        onChange={(e) => handleFormChange(setName, illness.id, e.target.value)}
                      />
                      <RegisterTextbox
                        parentStyle={{ width: "100%" }}
                        label="نوع المرض"
                        type="text"
                        onChange={(e) => handleFormChange(setType, illness.id, e.target.value)}
                      />
                      <RegisterTextbox
                        parentStyle={{ width: "100%" }}
                        label="نوع العلاج"
                        type="text"
                        onChange={(e) => handleFormChange(setTrtype, illness.id, e.target.value)}
                      />
                      <RegisterTextbox
                        parentStyle={{ width: "100%" }}
                        label="تكلفة العلاج"
                        type="number"
                        onChange={(e) => handleFormChange(setTrcost, illness.id, e.target.value)}
                      />
                      <RegisterTextbox
                        parentStyle={{ width: "100%" }}
                        label="ملاحظات"
                        type="text"
                        onChange={(e) => handleFormChange(setNotes, illness.id, e.target.value)}
                      />
                      <RegisterTextbox
                        parentStyle={{ width: "100%" }}
                        label="خطورة المرض"
                        type="text"
                        onChange={(e) => handleFormChange(setDegree, illness.id, e.target.value)}
                      />
                    </div>
                  ))}
                  <UploadInput
                    id="reportImage"
                    parentStyle={{ marginBottom: "20px", display: "flex", alignItems: "center" }}
                    label="صورة التقارير الصحية"
                    name="upload"
                    onChange={(e) => setUpload(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="AddBeneficiaryContainerRow" style={{ textAlign: "center", marginTop: "20px" }}>
                {isSubmitting ? (
                  <Spinner animation="border" variant="primary" />
                ) : (
                  <CustomButton text="حفظ" />
                )}
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default ShowhealthData;
