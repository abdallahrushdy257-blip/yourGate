import { useState, useRef, useContext } from "react";
import CustomButton from "../../components/CustomButton";
import SettingTabs from "./SettingTabs";
import "./setting.css";
import { Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faDownload } from "@fortawesome/free-solid-svg-icons";
import UploadInput from "../../components/UploadInput";
import { AppContext } from "../../context/AuthContext";

function EnterSetting() {
    const [toggles, setToggles] = useState({
        comeLeave: true,
    });

    const handleToggle = (key) => {
        setToggles((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const { user } = useContext(AppContext);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    return (
        <div className="setting-container">
            <SettingTabs activeTab="enter" />

            <Form>
                <div className="printSrttingContent">

                    <div className="printSettingRow">
                        <p className="printRowText">ظهور الحضور و الانصراف علي الواجهة</p>
                        <div className="enterRowfile">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={toggles.comeLeave}
                                    onChange={() => handleToggle("comeLeave")}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    <div className="printSettingRow">
                        <p className="printRowText">بيانات المانحين</p>
                        <div className="enterRowfile">
                            <UploadInput
                                id="chieftain"
                                parentStyle={{
                                    marginBottom: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            />
                            <button type="button" className="UploadInputLabel icon-btn ">
                                <FontAwesomeIcon icon={faDownload} />
                            </button>

                        </div>
                    </div>

                    <div className="printSettingRow">
                        <p className="printRowText">بيانات المستفيدين</p>
                        <div className="enterRowfile">
                            <UploadInput
                                id="chieftain"
                                parentStyle={{
                                    marginBottom: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            />
                            <button type="button" className="UploadInputLabel icon-btn " >
                                <FontAwesomeIcon icon={faDownload} />
                            </button>

                        </div>
                    </div>

                    <div className="printSettingRow">
                        <p className="printRowText">شعار الجمعية</p>
                        <div className="enterRowfile">
                            <UploadInput
                                id="chieftain"
                                parentStyle={{
                                    marginBottom: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            />
                            <button type="button" className="UploadInputLabel icon-btn " >
                                <FontAwesomeIcon icon={faDownload} />
                            </button>

                        </div>
                    </div>

                    <div className="printSettingRow">
                        <p className="printRowText">الختم الإلكتروني</p>
                        <div className="enterRowfile">

                            <UploadInput
                                id="chieftain"
                                parentStyle={{
                                    marginBottom: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            />
                            <button type="button" className="UploadInputLabel icon-btn ">
                                <FontAwesomeIcon icon={faDownload} />
                            </button>

                        </div>
                    </div>


                    <div className="printSettingRow printSettingRow2">
                        <div className="settingDateContainer">
                            <p style={{ marginBottom: "10px" }}>تاريخ بداية السنه المالية</p>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                className="custom-datepicker"
                            />
                        </div>

                    </div>


                    <div className="printSettingRow printSettingRow2">
                        <div className="settingDateContainer">
                            <p style={{ marginBottom: "10px" }}>يوم صرف الراتب</p>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                className="custom-datepicker"
                            />
                        </div>

                    </div>


                    <div className="printSettingRow">
                        <p className="printRowText">إغلاق السنه المالية</p>
                        <div className="enterRowfile">

                            <div
                                className="rowfileclose"
                                onClick={() => setShowCloseModal(true)}
                                style={{ cursor: "pointer" }}
                            >
                                إغلاق
                            </div>

                        </div>
                    </div>

                    <div className="printSettingRow">
                        <p className="printRowText">حذف البيانات</p>
                        <div className="enterRowfile">

                            <div
                                className="rowfileclose"
                                onClick={() => setShowDeleteModal(true)}
                                style={{ cursor: "pointer" }}
                            >
                                حذف
                            </div>

                        </div>
                    </div>


                    <CustomButton text="حفظ" type="submit" />
                </div>
            </Form>



            <Modal className="enterModal" show={showCloseModal} onHide={() => setShowCloseModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>تأكيد الإغلاق</Modal.Title>
                </Modal.Header>
                <Modal.Body>هل أنت متأكد من إغلاق السنة المالية؟</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCloseModal(false)}>
                        إلغاء
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            setShowCloseModal(false);
                        }}
                    >
                        نعم، إغلاق
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal className="enterModal" show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>تأكيد الحذف</Modal.Title>
                </Modal.Header>
                <Modal.Body>هل أنت متأكد أنك تريد حذف جميع البيانات؟</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        إلغاء
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            setShowDeleteModal(false);
                        }}
                    >
                        نعم، حذف
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EnterSetting;
