import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../../components/title";
import "./Investigations.css";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import { Form, Spinner, Modal } from "react-bootstrap";
import CustomButton from "../../../../components/CustomButton";
import RegisterTextarea from "../../../../components/RegisterTextarea";
import UploadInput from "../../../../components/UploadInput";
import RegisterSelect from "../../../../components/RegisterSelect";
import { hrService } from "../../services/hrService";

function InvestigationsModal({
  show,
  handleClose,
  employeeId,
  onSuccess,
  initialData = null,
}) {
  const [reason, setReason] = useState("");
  const [investigatorId, setInvestigatorId] = useState("");
  const [result, setResult] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [description, setDescription] = useState("");
  const [attach, setAttach] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show) {
      hrService
        .getEmployees()
        .then((res) => {
          const data = res.data?.data || res.data || [];
          setEmployees(data);
        })
        .catch((err) => console.error(err));
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      if (initialData) {
        setReason(initialData.reason || "");
        setInvestigatorId(
          initialData.investigator_id || initialData.investigator || ""
        );
        setResult(initialData.result || "");
        setDate(
          initialData.date
            ? initialData.date.substr(0, 10)
            : new Date().toISOString().substr(0, 10)
        );
        setDescription(initialData.description || "");
        setSelectedEmployee(initialData.employee_id || employeeId || "");
      } else {
        setReason("");
        setInvestigatorId("");
        setResult("");
        setDate(new Date().toISOString().substr(0, 10));
        setDescription("");
        setAttach(null);
        setSelectedEmployee(employeeId || "");
      }
      setError({});
    }
  }, [show, initialData, employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const mForm = new FormData();
    mForm.append("reason", reason);
    mForm.append("investigator_id", investigatorId);
    mForm.append("result", result);
    mForm.append("date", date);
    mForm.append("description", description);
    if (attach) mForm.append("attach", attach);

    const targetEmpId = employeeId || selectedEmployee;
    if (targetEmpId) {
      mForm.append("employee_id", targetEmpId);
    }

    try {
      const response = initialData
        ? await hrService.updateInvestigation(initialData.id, mForm)
        : await hrService.createInvestigation(mForm);

      if (response.status === 200 || response.status === 201) {
        setIsSubmitting(false);
        handleClose();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setIsSubmitting(false);
      if (err.response?.data?.errors) {
        setError(err.response.data.errors);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Title
            title={initialData ? "تعديل تحقيق" : "إضافة تحقيق"}
            icon={<FontAwesomeIcon icon={faPlusCircle} />}
          />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-2 gap-3">
            {!employeeId && (
              <RegisterSelect
                id="employee_id"
                label="المحقق معه *"
                parentStyle={{ width: "100%" }}
                stylee={{ width: "100%" }}
                options={[
                  { value: "", label: "اختر الموظف المحقق معه..." },
                  ...employees.map((emp) => ({
                    value: emp.id,
                    label: emp.name,
                  })),
                ]}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                value={selectedEmployee}
                error={error && error.employee_id}
              />
            )}

            <RegisterSelect
              id="investigator_id"
              label="المُحقِّق *"
              parentStyle={{ width: "100%" }}
              stylee={{ width: "100%" }}
              options={[
                { value: "", label: "اختر المحقق..." },
                ...employees.map((emp) => ({
                  value: emp.id,
                  label: emp.name,
                })),
              ]}
              onChange={(e) => setInvestigatorId(e.target.value)}
              value={investigatorId}
              error={error && (error.investigator_id || error.investigator)}
            />

            <RegisterTextbox
              parentStyle={{}}
              id="reason"
              label="السبب"
              type="text"
              stylee={{ width: "100%" }}
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={error && error.reason}
            />

            <RegisterTextbox
              parentStyle={{}}
              id="result"
              label="النتيجة"
              type="text"
              stylee={{ width: "100%" }}
              name="result"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              error={error && error.result}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "start",
              }}
            >
              <label className="label-invoice mb-[.5rem]">التاريخ</label>
              <input
                type="date"
                className="custom-datepicker"
                value={date}
                style={{ width: "100%" }}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <RegisterTextarea
              id="description2"
              label="الوصف"
              parentStyle={{ width: "100%" }}
              stylee={{ height: "100px", width: "100%" }}
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={error && error.description}
            />

            <UploadInput
              id="documentUpload"
              parentStyle={{
                marginTop: "10px",
                marginBottom: "20px",
                display: "flex",
                cols: "2",
              }}
              label="إرفاق صورة"
              name="attach"
              onChange={(e) => setAttach(e.target.files[0])}
              error={error && error.attach}
            />
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {isSubmitting ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <CustomButton
                text={initialData ? "حفظ التعديلات" : "حفظ"}
                type="submit"
              />
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default InvestigationsModal;
