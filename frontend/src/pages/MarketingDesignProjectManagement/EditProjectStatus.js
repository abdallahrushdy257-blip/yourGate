import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
import "./MarketingDesignProjectManagement.css";
import RegisterTextarea from "../../components/RegisterTextarea";
import { Form, Spinner } from "react-bootstrap";
import CustomButton from "../../components/CustomButton";
import UploadInput from "../../components/UploadInput";
import API from "../../api/axiosConfig";
import "react-datepicker/dist/react-datepicker.css";
import RegisterSelect from "../../components/RegisterSelect";
import TestPreLoader from "../TestPreLoader/TestPreLoader";

function EditProjectStatus() {
  const [rows, setRows] = useState({});
  const [attachment, setAttachment] = useState("");
  const [error, setError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const getProject = async () => {
    try {
      const response = await API.get(`/projects/${id}`);
      setRows(response.data.data || {});
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.errors || {});
      setMessage(err?.response?.data?.message || "Error");
      setLoading(false);
    }
  };

  useEffect(() => {
    getProject();
  }, [id]);

  const handleTotalCostChange = (e) => {
    setRows({ ...rows, budget: Number(e.target.value) });
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    const mForm = new FormData();
    mForm.append("name", rows.name || "");
    mForm.append("description", rows.description || "");
    mForm.append("dateoflaunch", rows.startdate || "");
    mForm.append("deadline", rows.deadline || "");
    mForm.append("total", rows.budget || 0);
    mForm.append("marketingmethod", rows.marketingmethod || "");
    mForm.append("id", id);

    if (attachment) {
      mForm.append("attachment", attachment);
    }

    try {
      const res = await API.post("/projects/update", mForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        navigate("/projectStatus");
      }
    } catch (err) {
      setIsSubmit(false);
      setError(err?.response?.data?.errors || {});
    }
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("-");
      return `${year}-${month}-${day}`;
    }

    return "";
  };

  return loading ? (
    <TestPreLoader />
  ) : (
    <div className="marketingdesignprojectmanagement">
      <Title
        title="تعديل إدارة المشاريع"
        className="marketingtitle"
        icon={<FontAwesomeIcon icon={faBullhorn} />}
      />

      <Form
        onSubmit={handleSubmit}
        className="marketingdesignprojectmanagementForm"
        encType="multipart/form-data"
      >
        <div className="marketingdesign">
          <div className="marketInputCon">
            <RegisterTextbox
              parentStyle={{ width: "45%" }}
              id="name"
              label="إسم المشروع"
              value={rows.name || ""}
              onChange={(e) =>
                setRows({ ...rows, name: e.target.value })
              }
              type="text"
              stylee={{ width: "55%" }}
              name="name"
            />

            <RegisterTextbox
              parentStyle={{ width: "45%" }}
              id="totalCost"
              label="مبلغ الدعم الكلي"
              type="number"
              value={rows.budget || ""}
              onChange={handleTotalCostChange}
              stylee={{ width: "55%" }}
              name="total"
            />
          </div>

          {error.name && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {error.name}
            </div>
          )}

          {error.total && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {error.total}
            </div>
          )}

          <div className="marketInputCon">
            <div style={{ width: "45%" }}>
              <p>تاريخ البدء</p>
              <input
                type="date"
                value={formatDateForInput(rows.startdate || "")}
                onChange={(e) =>
                  setRows({ ...rows, startdate: e.target.value })
                }
                className="custom-datepicker"
              />
            </div>

            <div style={{ width: "45%" }}>
              <p>تاريخ الانتهاء</p>
              <input
                type="date"
                value={formatDateForInput(rows.deadline || "")}
                onChange={(e) =>
                  setRows({ ...rows, deadline: e.target.value })
                }
                className="custom-datepicker"
              />
            </div>
          </div>

          {error.dateoflaunch && (
            <span className="error">{error.dateoflaunch}</span>
          )}
          {error.deadline && (
            <span className="error">{error.deadline}</span>
          )}

          <div className="marketInputCon">
            <RegisterSelect
              id="mecanism"
              label="آلية التسويق"
              parentStyle={{ width: "45%", marginBottom: "20px" }}
              options={[
                { value: "0", label: "إختر الآلية" },
                { value: "1", label: "المانحون" },
                { value: "2", label: "المنصات الحكومية" },
                { value: "3", label: "متاجر الجمعيات" },
              ]}
              value={rows.marketingmethod || ""}
              onChange={(e) =>
                setRows({
                  ...rows,
                  marketingmethod: e.target.value,
                })
              }
            />

            <RegisterTextarea
              label="نبذة عن المشروع"
              stylee={{ width: "100%" }}
              value={rows.description || ""}
              onChange={(e) =>
                setRows({
                  ...rows,
                  description: e.target.value,
                })
              }
              parentStyle={{
                width: "45%",
                marginBottom: "20px",
              }}
              name="description"
            />
          </div>

          {error.description && (
            <span className="error">{error.description}</span>
          )}

          {isSubmit ? (
            <Spinner animation="border" />
          ) : (
            <div className="marketingbuttonCon">
              <CustomButton text="تعديل المشروع" />
            </div>
          )}
        </div>
      </Form>
    </div>
  );
}

export default EditProjectStatus;
