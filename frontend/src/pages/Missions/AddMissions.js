import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "../AddNewClient/addnewclient.css";
import { faListCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import CustomButton from "../../components/CustomButton";
import UploadInput from "../../components/UploadInput";
import { useEffect, useState } from "react";
import "./missions.css";
import { error } from "highcharts";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import { useNavigate } from "react-router";

function AddMissions() {
  const [missionType, setMissionType] = useState("");
  const [missionTitle, setMissionTitle] = useState("");
  const [missionDescription, setMissionDescription] = useState("");
  const [missionDate, setMissionDate] = useState(new Date().toISOString().substr(0, 10));
  const [missionEndDate, setMissionEndDate] = useState(new Date().toISOString().substr(0, 10));
  const [missionfile, setMissionFile] = useState("");
  const [error, setError] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const mForm = new FormData();
    mForm.append("mission_type", missionType);
    mForm.append("title", missionTitle);
    mForm.append("description", missionDescription);
    mForm.append("start_date", missionDate);
    mForm.append("end_date", missionEndDate);
    mForm.append("upload", missionfile);
    mForm.append("incharge", JSON.stringify(selectedEmployees));
    setIsSubmitting(true);
    API.post("/missions/store", mForm, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        const data = res;
        if (data.status === 200) {
          navigate("/missions");
        }
      })
      .catch((error) => {
        console.error(error);
        setError(error.response.data.errors);
        setIsSubmitting(false);
      });
  };

  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [employeesOptions, setEmployeesOptions] = useState([]);

  const handleAddEmployee = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue && !selectedEmployees.includes(selectedValue)) {
      setSelectedEmployees([...selectedEmployees, selectedValue]);
    }
  };

  const handleRemoveEmployee = (employee) => {
    setSelectedEmployees(selectedEmployees.filter((emp) => emp !== employee));
  };

  const getAllEmp = async () => {
    try {
      const response = await API.get("missions/eams");
      const data = await response;
      setEmployeesOptions(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError(error.response.data.errors);
    }
  };

  useEffect(() => {
    getAllEmp();
  }, []);
  const selectedEmployeeNames = selectedEmployees.map((employeeId) => {
    const cleanId = employeeId.split(",")[0];

    const employee = employeesOptions.find((e) => {
      console.log("e.id:", e.id, "cleanId:", cleanId);
      return e.id === cleanId;
    });

    return employee ? employee.name : employeeId;
  });


  return loading ? (
    <TestPreLoader />
  ) : (
    <>
      <div className="addnewclientContaner">
        <Title
          title="إضافة مهمة جديدة"
          icon={<FontAwesomeIcon icon={faListCheck} />}
        />
        <Form className="addnewclientContanerForm">
          <div className="addClientsInputs">
            <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="tit"
              label="عنوان المهمة"
              type="text"
              stylee={{
                width: "30%",
              }}
              name="title"
              onChange={(e) => setMissionTitle(e.target.value)}
              value={missionTitle}
              error={error.title}
            />

            <RegisterSelect
              id="empname"
              label="نوع المهمة"
              stylee={{
                width: "30% !important",
              }}
              parentStyle={{
                width: "40%",
                marginBottom: "20px",
              }}
              options={[
                { value: "", label: "إختر نوع المهمة" },
                { value: "0", label: "مهمة عامة" },
                { value: "1", label: "مراجعة تقارير" },
                { value: "2", label: "إنشاء مشروع" },
                { value: "3", label: "متابعة تأهيل و تدريب" },
                { value: "4", label: "صرف مبلغ مالي" },
                { value: "5", label: "أمر صرف خاص" },
                { value: "6", label: "تقييم حالة" },
                { value: "7", label: "نقل مواد" },
                { value: "8", label: "تكليف مؤقت" },
                { value: "9", label: "زيارة ميدانية" },
                { value: "10", label: "زيارة داعم" },
                { value: "11", label: "زيارة مسؤول" },
                { value: "12", label: "زيارة شخصية اعتبارية" },
                { value: "13", label: "حضور فعالية" },
              ]}
              onChange={(e) => setMissionType(e.target.value)}
              value={missionType}
              error={error.mission_type}
            />
            {error && error.missionType && (
              <p className="error">{error.missionType}</p>
            )}
          </div>
          <div className="addClientsInputs">
            <div
              style={{
                width: "45%",
                display: "flex",
                alignItems: "right",
                flexDirection: "column",
              }}
            >
              <p>تاريخ بداية المهمة</p>
              <input
                type="date"
                id="date"
                onChange={(e) => setMissionDate(e.target.value)}
                value={missionDate}
                className="custom-datepicker"
              />
            </div>
            {error && error.missionDate && (
              <p className="error">{error.missionDate}</p>
            )}

            <div
              style={{ width: "40%", display: "flex", flexDirection: "column" }}
            >
              <p>تاريخ انتهاء المهمة</p>
              <input
                type="date"
                id="date"
                onChange={(e) => setMissionEndDate(e.target.value)}
                value={missionEndDate}
                className="custom-datepicker"
                style={{ width: "100%" }}
              />
            </div>

            {error && error.missionEndDate && (
              <p className="error">{error.missionEndDate}</p>
            )}
          </div>
          <div className="addClientsInputs">
            <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="status"
              label="تفاصيل المهمة"
              type="text"
              stylee={{
                width: "30%",
              }}
              name="status"
              onChange={(e) => setMissionDescription(e.target.value)}
              value={missionDescription}
            />
            {error && error.missionDescription && (
              <p className="error">{error.missionDescription}</p>
            )}
            <RegisterSelect
              id="empname"
              label="الأشخاص المسؤولين عن المهمة"
              stylee={{ width: "30% !important" }}
              parentStyle={{ width: "40%", marginBottom: "20px" }}
              options={[
                { value: "", label: "إختر الموظفين" },
                ...employeesOptions.map((option) => ({
                  value: [option.id, option.type],
                  label: option.name,
                }))
              ]}
              onChange={handleAddEmployee}
            />
          </div>
          {selectedEmployeeNames.length > 0 && (
            <div className="selectedEmployees">
              <h4>الموظفون المحددون:</h4>
              <ul>
                {selectedEmployeeNames.map((employeeName, index) => (
                  <li key={selectedEmployees[index]} className="employeeItem">
                    {employeeName}
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="removeIcon"
                      onClick={() => handleRemoveEmployee(selectedEmployees[index])}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}


          <div className="addClientsInputs addClientsInputs3">
            <UploadInput
              id="paper"
              parentStyle={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
              label="المرفقات"
              onChange={(e) => setMissionFile(e.target.files[0])}
            />
            {error && error.missionFile && (
              <p className="error">{error.missionFile}</p>
            )}
          </div>

          <CustomButton
            text="حفظ"
            onClick={handleSubmit}
            className="addClientBtn"
          />
        </Form>
      </div>
    </>
  );
}

export default AddMissions;
