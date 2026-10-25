import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "../AddNewClient/addnewclient.css"
import { faListCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import UploadInput from "../../components/UploadInput";
import { useState } from "react";
import './missions.css'
import CustomButton from "../../components/CustomButton";


function ShowMissionsEmp() {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const [attachments, setAttachments] = useState(["file1.pdf", "file2.png"]); 

    return (
        <>
            <div className="addnewclientContaner">
                <Title
                    title="عرض المهمة "
                    icon={<FontAwesomeIcon icon={faListCheck} />}
                />
                <Form className="addnewclientContanerForm">

                    <div className="addClientsInputs">
                        <RegisterTextbox
                            parentStyle={{
                                width: "40%",
                            }}
                            id="tit"
                            label='عنوان المهمة'
                            type="text"
                            stylee={{
                                width: "30%",
                            }}
                            disabled={true}

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
                            disabled={true}
                            options={[
                                { value: "", label: "نوع المهمة" },
                            ]}
                        />

                    </div>
                    <div className="addClientsInputs">
                        <RegisterTextbox
                            parentStyle={{
                                width: "40%",
                            }}
                            id="date"
                            label='تاريخ بداية المهمة'
                            type="date"
                            stylee={{
                                width: "30%",
                            }}
                            disabled={true}
                        />

                        <RegisterTextbox
                            parentStyle={{
                                width: "40%",
                            }}
                            id="edate"
                            label='تاريخ إنتهاء المهمة'
                            type="date"
                            stylee={{
                                width: "30%",
                            }}
                            disabled={true}
                        />

                    </div>
                    <div className="addClientsInputs">
                        <RegisterTextbox
                            parentStyle={{
                                width: "40%",
                            }}
                            id="status"
                            label='تفاصيل المهمة'
                            type="text"
                            stylee={{
                                width: "30%",
                            }}
                            disabled={true}
                        />

                        <RegisterTextbox
                            parentStyle={{
                                width: "40%",
                            }}
                            id="reply"
                            label='الرد'
                            type="text"
                            stylee={{
                                width: "30%",
                            }}
                        />

                    </div>


                     <div className="addClientsInputs ">
                        <div
                            id="attachments"
                            style={{
                                marginBottom: "20px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                            }}
                        >
                            <label>المرفقات</label>
                            {attachments.length > 0 ? (
                                <div className="missattach">
                                    {attachments.map((file, index) => (
                                        <span key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <img src={file} alt="test" />
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p>لا توجد مرفقات.</p>
                            )}
                        </div>
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

export default ShowMissionsEmp