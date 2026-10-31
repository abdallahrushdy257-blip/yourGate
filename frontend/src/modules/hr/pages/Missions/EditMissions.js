import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../../components/title";
import "../../../../pages/AddNewClient/addnewclient.css";
import { faListCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import RegisterSelect from "../../../../components/RegisterSelect";
import CustomButton from "../../../../components/CustomButton";
import UploadInput from "../../../../components/UploadInput";
import { useEffect, useState } from "react";
import "./missions.css";
import { error } from "highcharts";
import API from "../../../../api/axiosConfig";
import TestPreLoader from "../../../../pages/TestPreLoader/TestPreLoader";
import { useNavigate , useParams } from "react-router";

function EditMissions() {
  const { id } = useParams();
  const [mission, setMission] = useState([]);
  const [missionType, setMissionType] = useState("");
  const [missionTitle, setMissionTitle] = useState("");
  const [missionDescription, setMissionDescription] = useState("");
  const [missionDate, setMissionDate] = useState(new Date().toISOString().substr(0, 10));
  const [missionEndDate, setMissionEndDate] = useState(new Date().toISOString().substr(0, 10));
  const [missionfile, setMissionFile] = useState("");
  const [error, setError] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getMissionDetails = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/missions/${id}`);
      const data = await res;
      if (data.status === 200) {
        setMission(data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.errors);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMissionDetails();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const mForm = new FormData();
    mForm.append("mission_type", mission.mission_type);
    mForm.append("title", mission.title);
    mForm.append("description", mission.description);
    mForm.append("start_date", mission.start_date);
    mForm.append("end_date", mission.end_date);
    mForm.append("upload", mission.upload);
    //mForm.append("incharge", JSON.stringify(selectedEmployees));
    mForm.append("id", id);
    setIsSubmitting(true);
    API.post("/missions/update", mForm, {
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
      console.log(data.data);
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

   const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
  const [day, month, year] = dateStr.split("-");
  if (!day || !month || !year) return "";
  return `${year}-${month}-${day}`; // yyyy-MM-dd
};


  return loading ? (
    <TestPreLoader />
  ) : (
    <>
      <div className="addnewclientContaner">
        <Title
          title="تعديل المهمة"
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
              onChange={(e) => setMission({...mission , title: e.target.value})}
              value={mission.title}
              // error={error.title}
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
              onChange={(e) => setMission({...mission , mission_type: e.target.value})}
              value={mission.mission_type}
              // error={error.mission_type}
            />
            {error && error.missionType && (
              <p className="error">{error.mission.mission_type}</p>
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
                onChange={(e) => setMission({...mission , start_date: e.target.value})}
                value={formatDateForInput(mission.start_date)}
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
                onChange={(e) => setMission({...mission , end_date: e.target.value})}
                value={formatDateForInput(mission.end_date)}
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
              name="description"
              onChange={(e) => setMission({...mission , description: e.target.value})}
              value={mission.description}
            />
            {error && error.missionDescription && (
              <p className="error">{error.missionDescription}</p>
            )}
            
          </div>
         


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

export default EditMissions;
