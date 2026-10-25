import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Form, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoice,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import Title from "../../components/title";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import CustomButton from "../../components/CustomButton";
import UploadInput from "../../components/UploadInput";
import API from "../../api/axiosConfig";
import RegisterTextarea from "../../components/RegisterTextarea";

function AddMinutes() {
  const navigate = useNavigate();

  const [membership, setMembership] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(
    sessionStorage.getItem("minutes_date") ||
      new Date().toISOString().substr(0, 10)
  );
  const [title, setTitle] = useState(
    sessionStorage.getItem("minutes_title") || ""
  );
  const [note, setNote] = useState(
    sessionStorage.getItem("minutes_note") || ""
  );
  const [file, setFile] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState("");

  // ⭐ الحل الصح
  const [attendees, setAttendees] = useState([{  }]);

  const [committees, setCommittees] = useState([{  }]);

  useEffect(() => {
    fetchMembership();
    fetchCommittee();
  }, []);

  const fetchMembership = async () => {
    const res = await API.post("/assemblymembers");
    setMembership(res.data);
    setLoading(false);
  };

  const fetchCommittee = async () => {
    const res = await API.post("/associationcommittee");
    setCommittee(res.data);
    setLoading(false);
  };

  const addRow = () => {
    setAttendees([...attendees, { member: "" }]);
    setCommittees([...committees, { committee: "" }]);
  };

  const removeRow = () => {
    if (attendees.length > 1) {
      setAttendees(attendees.slice(0, -1));
      setCommittees(committees.slice(0, -1));
    }
  };

  const handleNamesChange = (index, value) => {
    setAttendees((prev) =>
      prev.map((item, i) => (i === index ? { ...item,  value } : item))
    );
  };

  const handleCommitteeChange = (index, value) => {
    setCommittees((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item,  value } : item
      )
    );
  };

  const minutesreason = {
    1: [
      { value: "", label: "إختر نوع المحضر" },
      { value: "1", label: "عادية" },
      { value: "2", label: "غير عادية" },
    ],
    2: [
      { value: "", label: "إختر نوع المحضر" },
      { value: "3", label: "دوري" },
      { value: "4", label: "طارئة" },
      { value: "5", label: "لجان" },
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("note", note);
    formData.append("type", type);
    formData.append("reason", reason);
    formData.append("attendees", JSON.stringify(attendees));
    formData.append("committee", JSON.stringify(committees));

    if (file) formData.append("file", file);

    try {
      await API.post("/minutesheets/store", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/addMinutesReport");
    } catch (err) {
      setError(err.response?.data?.errors || {});
      setSubmitting(false);
    }
  };

  return (
    <div className="statementofaccount">
      <Title
        title="إضافة محضر"
        icon={<FontAwesomeIcon icon={faFileInvoice} />}
        style={{ marginBottom: "30px" }}
      />

      <Form onSubmit={handleSubmit}>
        {/* عنوان + تاريخ */}
        <div className="addClientsInputs">
          <RegisterTextbox
            parentStyle={{ width: "45%" }}
            label="عنوان المحضر"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div style={{ width: "45%" }}>
            <label>تاريخ المحضر</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="custom-datepicker"
            />
          </div>
        </div>

        {/* نوع الاجتماع */}
        <div className="addClientsInputs">
          <RegisterSelect
            label="نوع الاجتماع"
            parentStyle={{ width: "45%" }}
            options={[
              { value: "", label: "اختر" },
              { value: "1", label: "جمعية عمومية" },
              { value: "2", label: "مجلس إدارة" },
            ]}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />

          <RegisterSelect
            label="غرض الاجتماع"
            parentStyle={{ width: "45%" }}
            stylee={{ width: "40% !important" }}
            options={minutesreason[type] || []}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        {/* ملاحظات */}
        <RegisterTextarea
          label="ملاحظات"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        {/* الأعضاء + اللجان */}
        <div
          className="AddBeneficiaryContainer"
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            width: "100%",
          }}
        >
          <span className="addillness" onClick={addRow}>
            <FontAwesomeIcon icon={faPlus} />
          </span>

          {attendees.length > 1 && (
            <span
              className="addillness"
              onClick={removeRow}
              style={{ color: "red" }}
            >
              <FontAwesomeIcon icon={faMinus} />
            </span>
          )}

          {attendees.map((row, idx) => (
            <div
              key={idx}
              style={{ display: "flex", gap: "20px", marginBottom: "15px" }}
            >
              {/* العضو */}
              <RegisterSelect
                label="إسم العضو"
                parentStyle={{ width: "45%" }}
                options={[
                  { value: "", label: "إختر العضو" },
                  ...membership.map((m) => ({
                    value: m.id,
                    label: m.name,
                  })),
                ]}
                value={attendees[idx]?.member}
                onChange={(e) => handleNamesChange(idx, e.target.value)}
              />

              {/* اللجنة */}
              <RegisterSelect
                label="إسم اللجنة"
                parentStyle={{ width: "45%" }}
                options={[
                  { value: "", label: "إختر اللجنة" },
                  ...committee.map((c) => ({
                    value: c.id,
                    label: c.name,
                  })),
                ]}
                value={committees[idx]?.committee}
                onChange={(e) => handleCommitteeChange(idx, e.target.value)}
              />
            </div>
          ))}
        </div>

        <UploadInput
          label="إرفاق مستند"
          onChange={(e) => setFile(e.target.files[0])}
          id="file"
        />
        <div className="btncenter" style={{ margin: "20px 40%" }}>
          {isSubmitting ? <Spinner /> : <CustomButton text="حفظ" />}
        </div>
      </Form>
    </div>
  );
}

export default AddMinutes;
