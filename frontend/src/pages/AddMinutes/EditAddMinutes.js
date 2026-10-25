import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import {
  faFileInvoice,
  faCheckCircle,
  faCalendarAlt,
  faStickyNote,
  faFileUpload,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Spinner, Container, Row, Col, Card } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import CustomButton from "../../components/CustomButton";
import UploadInput from "../../components/UploadInput";
import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";
import { useNavigate, useParams } from "react-router";

function EditAddMinutes() {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setSubmitting] = useState(false);

  const getMinutes = async () => {
    try {
      const res = await API.get(`/minutesheets/${id}`);
      if (res.status === 200) {
        setRows(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.errors) {
        setError(error.response.data.errors);
      }
    }
  };

  useEffect(() => {
    getMinutes();
  }, []);

  const normalizeDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-") && dateStr.split("-")[0].length === 4) {
      return dateStr;
    }
    const [day, month, year] = dateStr.split("-");
    if (!day || !month || !year) return dateStr;
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    const normalizedDate = normalizeDate(rows.date);
    if (normalizedDate && normalizedDate < today) {
      setError({ date: "تاريخ المحضر لا يمكن أن يكون في الماضي" });
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", rows.title);
    formData.append("date", rows.date);
    formData.append("note", rows.note);
    formData.append("paper", file);
    formData.append("id", id);

    try {
      API.post("/minutesheets/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          if (res.status === 200) {
            navigate("/addMinutesReport");
          }
        })
        .catch((err) => {
          console.error(err);
          setSubmitting(false);
          if (err.response && err.response.data.errors) {
            setError(err.response.data.errors);
          }
        });
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  };

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner animation="grow" variant="primary" />
      </div>
    );

  return (
    <Container className="py-5" style={{ direction: "rtl" }}>
      <div className="mb-4 text-center">
        <Title
          title="تعديل محضر اجتماع"
          icon={
            <FontAwesomeIcon
              icon={faFileInvoice}
              className="text-primary-gold"
            />
          }
        />
        <p style={{ color: "var(--text-color)" }} className="mt-2">
          تحديث بيانات المحضر والمستندات المرفقة
        </p>
      </div>

      <Row className="justify-content-center">
        <Col lg={10}>
          <Card
            className="luxury-card border-0 shadow-sm overflow-hidden"
            style={{
              background: "var(--card--background)",
              borderRadius: "20px",
            }}
          >
            <Card.Header className="bg-transparent border-0 pt-4 px-4">
              <div className="d-flex align-items-center">
                <div className="icon-badge ms-3">
                  <FontAwesomeIcon icon={faPlus} style={{ color: "#c5a059" }} />
                </div>
                <h5
                  className="mb-0"
                  style={{ fontWeight: "700", color: "var(--text-color)" }}
                >
                  تفاصيل المحضر
                </h5>
              </div>
            </Card.Header>

            <Card.Body className="p-4 p-md-5">
              <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                  <Col md={6}>
                    <div className="input-group-custom">
                      <label
                        className="form-label d-flex align-items-center"
                        style={{ color: "var(--text-color)" }}
                      >
                        <FontAwesomeIcon
                          icon={faStickyNote}
                          className="ms-2 opacity-50"
                        />
                        عنوان المحضر
                      </label>
                      <RegisterTextbox
                        parentStyle={{ width: "100%" }}
                        id="address"
                        type="text"
                        stylee={{ width: "100%", borderRadius: "12px" }}
                        value={rows.title || ""}
                        onChange={(e) =>
                          setRows({ ...rows, title: e.target.value })
                        }
                        placeholder="أدخل عنوان المحضر..."
                      />
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="input-group-custom">
                      <label
                        className="form-label d-flex align-items-center"
                        style={{ color: "var(--text-color)" }}
                      >
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="ms-2 opacity-50"
                        />
                        تاريخ المحضر
                      </label>
                      <input
                        type="date"
                        id="date"
                        className="form-control custom-datepicker"
                        style={{
                          borderRadius: "12px",
                          padding: "12px",
                          border: "1px solid var(--border-color)",
                          background: "var(--input-background, transparent)",
                          color: "var(--text-color)",
                        }}
                        onChange={(e) =>
                          setRows({ ...rows, date: e.target.value })
                        }
                        value={formatDateForInput(rows.date)}
                      />
                      {error.date && (
                        <p className="error text-danger small mt-2">
                          {error.date}
                        </p>
                      )}
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="input-group-custom">
                      <label
                        className="form-label d-flex align-items-center"
                        style={{ color: "var(--text-color)" }}
                      >
                        <FontAwesomeIcon
                          icon={faStickyNote}
                          className="ms-2 opacity-50"
                        />
                        ملاحظات إضافية
                      </label>
                      <RegisterTextbox
                        parentStyle={{ width: "100%" }}
                        id="notes"
                        type="text"
                        stylee={{ width: "100%", borderRadius: "12px" }}
                        value={rows.note || ""}
                        onChange={(e) =>
                          setRows({ ...rows, note: e.target.value })
                        }
                        placeholder="أدخل أي ملاحظات إضافية هنا..."
                      />
                    </div>
                  </Col>

                  <Col md={12}>
                    <div
                      className="upload-section p-4 rounded-4"
                      style={{
                        border: "2px dashed var(--border-color)",
                        background: "rgba(197, 160, 89, 0.05)",
                      }}
                    >
                      <div className="d-flex flex-column align-items-center">
                        <div className="mb-3">
                          <FontAwesomeIcon
                            icon={faFileUpload}
                            size="2x"
                            style={{ color: "#c5a059" }}
                          />
                        </div>
                        <UploadInput
                          id="paper"
                          parentStyle={{ width: "100%", textAlign: "center" }}
                          label="تحديث المستندات المرفقة (اختياري)"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                        {file && (
                          <p className="mt-2 text-success small">
                            تم اختيار: {file.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className="mt-5 d-flex justify-content-center">
                  {isSubmitting ? (
                    <button className="luxury-submit-btn disabled" disabled>
                      <Spinner animation="border" size="sm" className="me-2" />
                      جاري الحفظ...
                    </button>
                  ) : (
                    <button
                      style={{ marginLeft: "8px" }}
                      type="button"
                      className="luxury-submit-btn"
                      onClick={handleSubmit}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} className="ms-2" />
                      حفظ التعديلات
                    </button>
                  )}
                  <button
                    type="button"
                    className="luxury-cancel-btn ms-3"
                    onClick={() => navigate("/addMinutesReport")}
                  >
                    إلغاء
                  </button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
                .text-primary-gold {
                    color: #c5a059 !important;
                }
                .icon-badge {
                    width: 40px;
                    height: 40px;
                    background: rgba(197, 160, 89, 0.15);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .luxury-card {
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05) !important;
                }
                .input-group-custom .form-label {
                    font-weight: 600;
                    font-size: 0.9rem;
                    margin-bottom: 10px;
                }
                .luxury-submit-btn {
                    background: linear-gradient(135deg, #1a5c4d 0%, #2e8b57 100%);
                    color: white;
                    border: none;
                    padding: 12px 40px;
                    border-radius: 12px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(26, 92, 77, 0.2);
                    display: flex;
                    align-items: center;
                }
                .luxury-submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(26, 92, 77, 0.3);
                }
                .luxury-cancel-btn {
                    background: transparent;
                    color: #6c757d;
                    border: 1px solid var(--border-color);
                    padding: 12px 40px;
                    border-radius: 12px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                .luxury-cancel-btn:hover {
                    background: rgba(0,0,0,0.05);
                    color: #343a40;
                }
                .custom-datepicker:focus {
                    border-color: #c5a059;
                    box-shadow: 0 0 0 0.2rem rgba(197, 160, 89, 0.25);
                    outline: none;
                }
            `}</style>
    </Container>
  );
}

export default EditAddMinutes;
