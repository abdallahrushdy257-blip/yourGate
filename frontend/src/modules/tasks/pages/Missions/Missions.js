import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './missions.css'
import { faList } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import Title from "../../../../components/title";
import TableComponent from "../../../../components/TableComponent";
import API from "../../../../api/axiosConfig";
import { Modal, Form, Spinner } from 'react-bootstrap';
import RegisterTextbox from "../../../../components/RegisterTextBox";
import RegisterSelect from "../../../../components/RegisterSelect";
import CustomButton from "../../../../components/CustomButton";
import UploadInput from "../../../../components/UploadInput";
import { faListCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import TestPreLoader from "../../../../pages/TestPreLoader/TestPreLoader";
import { useEffect } from 'react';
import NewButton from "../../../../components/NewButton";

function Missions() {
    const columns = [
        // { name: "الاسم", key: "name" },
        { name: "عنوان المهمة", key: "title" },
        { name: "تاريخ البداية", key: "start_date" },
        { name: "تاريخ النهاية", key: "end_date" },
        { name: "حالة المهمة", key: "status" },
        { name: "", key: "actions" },
    ];


    const [rows, setRows] = useState([]);
    const [tableReloadKey, setTableReloadKey] = useState(Date.now());
    const [showModal, setShowModal] = useState(false);

    // Form states from AddMissions
    const [missionType, setMissionType] = useState("");
    const [missionTitle, setMissionTitle] = useState("");
    const [missionDescription, setMissionDescription] = useState("");
    const [missionDate, setMissionDate] = useState(new Date().toISOString().substr(0, 10));
    const [missionEndDate, setMissionEndDate] = useState(new Date().toISOString().substr(0, 10));
    const [missionfile, setMissionFile] = useState("");
    const [formError, setFormError] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formLoading, setFormLoading] = useState(true);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [employeesOptions, setEmployeesOptions] = useState([]);

    const handleClose = () => {
        setShowModal(false);
        resetForm();
    };
    const handleShow = () => setShowModal(true);

    const resetForm = () => {
        setMissionType("");
        setMissionTitle("");
        setMissionDescription("");
        setMissionDate(new Date().toISOString().substr(0, 10));
        setMissionEndDate(new Date().toISOString().substr(0, 10));
        setMissionFile("");
        setFormError([]);
        setSelectedEmployees([]);
        setIsSubmitting(false);
    };

    const getAllEmp = async () => {
        try {
            const response = await API.get("missions/eams");
            setEmployeesOptions(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setFormLoading(false);
        }
    };

    useEffect(() => {
        getAllEmp();
    }, []);

    const handleAddEmployee = (event) => {
        const selectedValue = event.target.value;
        if (selectedValue && !selectedEmployees.includes(selectedValue)) {
            setSelectedEmployees([...selectedEmployees, selectedValue]);
        }
    };

    const handleRemoveEmployee = (employee) => {
        setSelectedEmployees(selectedEmployees.filter((emp) => emp !== employee));
    };

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
                if (res.status === 200 || res.status === 201) {
                    handleClose();
                    setTableReloadKey(Date.now());
                }
            })
            .catch((error) => {
                console.error(error);
                if (error.response && error.response.data && error.response.data.errors) {
                    setFormError(error.response.data.errors);
                }
                setIsSubmitting(false);
            });
    };

    const selectedEmployeeNames = selectedEmployees.map((employeeId) => {
        const cleanId = employeeId.split(",")[0];
        const employee = employeesOptions.find((e) => e.id === cleanId);
        return employee ? employee.name : employeeId;
    });




    const dropdownOptions = [
        { label: "عرض", route: "/showMissions/:id" },
        { label: "تعديل", route: "/editMissions/:id" },
        { label: "حذف", action: (id) => { 
            if (window.confirm("هل أنت متأكد من حذف هذه المهمة؟")) {
                // Call API to delete the mission
                API.get(`/missions/${id}/delete`)
                    .then((response) => {
                        alert("تم حذف المهمة بنجاح");
                        // Refresh the table data
                        setRows(rows.filter(row => row.id !== id));
                    })
                    .catch((error) => {
                        console.error("There was an error deleting the mission!", error);
                        alert("حدث خطأ أثناء حذف المهمة");
                    });
            }
            }
         }
    ];

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
                .join(",")
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

    const modifyRow = (row) => {
        let newRow = { ...row };
        newRow.status = row.status === 1 ? "قيد التنفيذ" : "مكتملة ";
        return newRow;
    }

    return (
        <>
                {/* <NewButton onClick={handleShow} /> */}
            <div className='missions'>
                <Title
                    title="المهام"
                    icon={<FontAwesomeIcon icon={faList} />}
                    style={{ width: "unset" }}
                />
                <TableComponent
                    apiUrl={"/missions"}
                    columns={columns}
                    search={false}
                    dropdownOptions={dropdownOptions}
                    handleDownload={handleDownload}
                    transformRowFn={modifyRow}
                    triggerReload={tableReloadKey}
                    addBtn={true}
                    onAddClick={handleShow}
                />
            </div>

            <Modal show={showModal} onHide={handleClose} size="md" centered style={{ direction: "rtl" }}>
                <Modal.Header closeButton style={{ direction: "ltr" }}>
                    <Modal.Title>إضافة مهمة جديدة</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ paddingBottom: "0" }}>
                    {formLoading ? (
                        <TestPreLoader />
                    ) : (
                        <Form className="addnewclientContanerForm">
                            <div className="addClientsInputs">
                                <RegisterTextbox
                                    parentStyle={{ width: "45%", marginBottom: "20px" }}
                                    id="tit"
                                    label="عنوان المهمة"
                                    type="text"
                                    stylee={{ width: "45%" }}
                                    name="title"
                                    onChange={(e) => setMissionTitle(e.target.value)}
                                    value={missionTitle}
                                    error={formError.title}
                                />

                                <RegisterSelect
                                    id="empname"
                                    label="نوع المهمة"
                                    stylee={{ width: "45% !important" }}
                                    parentStyle={{ width: "45%", marginBottom: "20px" }}
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
                                    error={formError.mission_type}
                                />
                            </div>
                            <div className="addClientsInputs">
                                <div style={{ width: "45%", display: "flex", alignItems: "right", flexDirection: "column" }}>
                                    <p style={{ textAlign: "right" }}>تاريخ بداية المهمة</p>
                                    <input
                                        type="date"
                                        id="date"
                                        onChange={(e) => setMissionDate(e.target.value)}
                                        value={missionDate}
                                        className="custom-datepicker"
                                        style={{ width: "100%" }}
                                    />
                                    {formError.start_date && <p className="error" style={{ color: "red" }}>{formError.start_date}</p>}
                                </div>

                                <div style={{ width: "45%", display: "flex", flexDirection: "column", textAlign: "right" }}>
                                    <p style={{ textAlign: "right" }}>تاريخ انتهاء المهمة</p>
                                    <input
                                        type="date"
                                        id="date_end"
                                        onChange={(e) => setMissionEndDate(e.target.value)}
                                        value={missionEndDate}
                                        className="custom-datepicker"
                                        style={{ width: "100%" }}
                                    />
                                    {formError.end_date && <p className="error" style={{ color: "red" }}>{formError.end_date}</p>}
                                </div>
                            </div>
                            <div className="addClientsInputs">
                                <RegisterTextbox
                                    parentStyle={{ width: "45%" }}
                                    id="status"
                                    label="تفاصيل المهمة"
                                    type="text"
                                    stylee={{ width: "45%" }}
                                    name="status"
                                    onChange={(e) => setMissionDescription(e.target.value)}
                                    value={missionDescription}
                                    error={formError.description}
                                />
                                <RegisterSelect
                                    id="empnames"
                                    label="الأشخاص المسؤولين عن المهمة"
                                    stylee={{ width: "45% !important" }}
                                    parentStyle={{ width: "45%" }}
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
                                <div className="selectedEmployees" style={{ padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "8px", marginBottom: "15px" }}>
                                    <h4 style={{ fontSize: "16px", marginBottom: "10px" }}>الموظفون المحددون:</h4>
                                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                        {selectedEmployeeNames.map((employeeName, index) => (
                                            <li key={selectedEmployees[index]} className="employeeItem" style={{ backgroundColor: "#e9ecef", padding: "5px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                                                {employeeName}
                                                <FontAwesomeIcon
                                                    icon={faTimes}
                                                    className="removeIcon"
                                                    style={{ cursor: "pointer", color: "#dc3545" }}
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
                                    parentStyle={{ marginBottom: "20px", display: "flex", alignItems: "center" }}
                                    label="المرفقات"
                                    onChange={(e) => setMissionFile(e.target.files[0])}
                                    error={formError.upload}
                                />
                            </div>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ borderTop: "none", justifyContent: "center", paddingBottom: "20px" }}>
                    {isSubmitting ? (
                        <Spinner animation="border" variant="primary" />
                    ) : (
                        <CustomButton
                            text="حفظ"
                            onClick={handleSubmit}
                            className="addClientBtn"
                            style={{ width: "150px" }}
                        />
                    )}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Missions