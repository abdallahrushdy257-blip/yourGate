import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../../components/title";
import "../../../../pages/AddNewClient/addnewclient.css";
import { faListCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import RegisterSelect from "../../../../components/RegisterSelect";
import UploadInput from "../../../../components/UploadInput";
import { useState } from "react";
import './missions.css'
import API from "../../../../api/axiosConfig";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { color, error } from "highcharts";
import TestPreLoader from "../../../../pages/TestPreLoader/TestPreLoader";


function ShowMissions() {


    const [mission, setMission] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState([]);

    const { id } = useParams();

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

    const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";
        const [day, month, year] = dateStr.split("-");
        if (!day || !month || !year) return "";
        return `${year}-${month}-${day}`; // yyyy-MM-dd
    };


    return (
        <>
            <div className="addnewclientContaner">
                <Title
                    title="عرض المهمة "
                    icon={<FontAwesomeIcon icon={faListCheck} />}
                />
                <div className="addnewclientContanerForm">

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
                            onChange={(e) => setMission({ ...mission, title: e.target.value })}
                            value={mission.title}
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
                            onChange={(e) => setMission({ ...mission, mission_type: e.target.value })}
                            value={mission.mission_type}
                        // error={error.mission_type}
                        />
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
                                onChange={(e) => setMission({ ...mission, start_date: e.target.value })}
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
                                onChange={(e) => setMission({ ...mission, end_date: e.target.value })}
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
                            id="description"
                            label='تفاصيل المهمة'
                            type="text"
                            stylee={{
                                width: "30%",
                            }}
                            disabled={true}
                            name="description"
                            onChange={(e) => setMission({ ...mission, description: e.target.value })}
                            value={mission.description}
                        />


                    </div>


                    {
                        mission.upload ? (
                            <div className="addClientsInputs addClientsInputs3">
                                <img
                                    src={mission.upload}
                                    alt="صورة المهمة"
                                    style={{ width: "200px", height: "200px" }}
                                />
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center', color: 'red' }}>لا توجد صورة مرفوعة للمهمة.</p>
                        )
                    }
                    {/* <div className="addClientsInputs addClientsInputs3">

                        <RegisterTextbox
                            parentStyle={{
                                width: "40%",
                            }}
                            id="reply"
                            label='رد الموظف 1'
                            type="text"
                            stylee={{
                                width: "30%",
                            }}
                            disabled={true}
                        />

                    </div> */}


                </div>
            </div>
        </>
    );
}

export default ShowMissions