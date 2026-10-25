import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import "../CaseDetails/CaseDetails.css";
import API from "../../api/axiosConfig";
import TableComponent from "../../components/TableComponent";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../../components/title";
import { Modal, Form, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import CustomButton from "../../components/CustomButton";

function ShowDependData(props) {

    const columns = [
        { name: "إسم التابع", key: "name" },
        { name: " تاريخ الميلاد", key: "dateofbirth" },
        { name: "رقم الهاتف", key: "phone" },
        { name: "صلة القرابة", key: "relation" },
        { name: "النوع", key: "gender" },
        { name: "ملاحظات", key: "note" },
        { name: "", key: "actions" },
    ];
    const navigate = useNavigate();
    const params = useParams();
    const id = props?.id || params?.id;
    const [rows, setRows] = useState([]);

    // --- Dependents Modal State ---
    const [showModal, setShowModal] = useState(false);
    const [tableReloadKey, setTableReloadKey] = useState(Date.now());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState({});
    const [dependents, setDependents] = useState([{ id: 1 }]);
    const [showMinus, setShowMinus] = useState(false);

    const [name, setName] = useState(['']);
    const [gender, setGender] = useState(['']);
    const [dob, setDob] = useState(['']);
    const [relation, setRelation] = useState(['']);
    const [health, setHealth] = useState(['']);
    const [grade, setGrade] = useState(['']);
    const [gradeCost, setGardeCost] = useState(['']);
    const [nationalid, setNationalid] = useState(['']);
    const [idexpire, setIdexpire] = useState(['']);
    const [phone, setPhone] = useState(['']);
    const [notes, setNotes] = useState(['']);
    const [idSource, setIdSource] = useState(['']);

    const [dateErrors, setDateErrors] = useState([]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        resetForm();
    };

    const resetForm = () => {
        setDependents([{ id: 1 }]);
        setName(['']);
        setGender(['']);
        setDob(['']);
        setRelation(['']);
        setHealth(['']);
        setGrade(['']);
        setGardeCost(['']);
        setNationalid(['']);
        setIdexpire(['']);
        setPhone(['']);
        setNotes(['']);
        setIdSource(['']);
        setError({});
        setDateErrors([]);
        setShowMinus(false);
    };

    const handleAddDependent = () => {
        setDependents([...dependents, { id: dependents.length + 1 }]);
        setName([...name, ""]);
        setGender([...gender, ""]);
        setNationalid([...nationalid, ""]);
        setRelation([...relation, ""]);
        setDob([...dob, ""]);
        setHealth([...health, ""]);
        setIdexpire([...idexpire, ""]);
        setIdSource([...idSource, ""]);
        setGrade([...grade, ""]);
        setGardeCost([...gradeCost, ""]);
        setPhone([...phone, ""]);
        setNotes([...notes, ""]);
        setDateErrors([...dateErrors, { dob: "", idexpire: "" }]);
        setShowMinus(true);
    };

    const handleMinusDependent = () => {
        setDependents(dependents.slice(0, -1));
        setName(name.slice(0, -1));
        setGender(gender.slice(0, -1));
        setNationalid(nationalid.slice(0, -1));
        setRelation(relation.slice(0, -1));
        setDob(dob.slice(0, -1));
        setHealth(health.slice(0, -1));
        setIdexpire(idexpire.slice(0, -1));
        setIdSource(idSource.slice(0, -1));
        setGrade(grade.slice(0, -1));
        setGardeCost(gradeCost.slice(0, -1));
        setPhone(phone.slice(0, -1));
        setNotes(notes.slice(0, -1));
        setDateErrors(dateErrors.slice(0, -1));
        if (dependents.length === 2) setShowMinus(false);
    };

    const handleFormChange = (setter, index, value) => {
        setter((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    };

    const mergeDependents = () => {
        // Skip index 0 because the form indices start from 1 based on dep.id logic
        return name.map((item, index) => ({
            name: item,
            gender: gender[index],
            nationalid: nationalid[index],
            relation: relation[index],
            notes: notes[index],
            dob: dob[index],
            health: health[index],
            idexpire: idexpire[index],
            idsource: idSource[index],
            grade: grade[index],
            gradecost: gradeCost[index],
            phone: phone[index],
        })).slice(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Date validation for each dependent
        const today = new Date().toLocaleDateString('en-CA');
        let hasDateErrors = false;
        let newDateErrors = [...dateErrors];

        dependents.forEach((dep, idx) => {
            const index = dep.id;
            const currentDob = dob[index];
            const currentIdExpire = idexpire[index];
            
            let depErrors = { dob: "", idexpire: "" };

            if (currentDob && currentDob > today) {
                depErrors.dob = "تاريخ الميلاد لا يمكن أن يكون في المستقبل";
                hasDateErrors = true;
            }

            if (currentIdExpire && currentIdExpire < today) {
                depErrors.idexpire = "تاريخ انتهاء الهوية لا يمكن أن يكون في الماضي";
                hasDateErrors = true;
            }
            newDateErrors[idx] = depErrors;
        });

        if (hasDateErrors) {
            setDateErrors(newDateErrors);
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('id', id);
        formData.append('data', JSON.stringify(mergeDependents()));
        try {
            const response = await API.post('/humancasedetails/dependants/store', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.status === 200) {
                handleClose();
                setTableReloadKey(Date.now());
            }
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.errors || {});
        } finally {
            setIsSubmitting(false);
        }
    };


    const dropdownOptions = [
        { label: "تعديل", route: `/editDependentsData/:id` },

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
        newRow.gender = row.gender === 0 ? "ذكر" : "أنثى";
        return newRow;
    };

    return (

        <>
            <div className="printcasedata-container employpaper ">
                <Title title="بيانات التابعين" style={{ width: "unset" }} classname='rmtit' icon={<FontAwesomeIcon icon={faReceipt} />} />


                <TableComponent
                    apiUrl={`/humancasedetails/showdependantsdata/${id}`}
                    columns={columns}
                    dropdownOptions={dropdownOptions}
                    searchDate={false}
                    transformRowFn={modifyRow}
                    triggerReload={tableReloadKey}
                    addBtn={true}
                    addBtnName="تابع جديد"
                    onAddClick={handleShow}
                />

                <Modal show={showModal} onHide={handleClose} size="lg" centered className="archModal">
                    <Modal.Header closeButton>
                        <Modal.Title>إضافة تابع جديد</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ direction: "rtl" }}>
                        <Form className="global-form-container" style={{ width: "100%", margin: "0" }} onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <span className="addillness" onClick={handleAddDependent} style={{ borderRadius: "20px", color: "green", marginLeft: "10px", cursor: "pointer" }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </span>
                                {showMinus && (
                                    <span className="addillness" onClick={handleMinusDependent} style={{ borderRadius: "20px", color: "red", cursor: "pointer" }}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </span>
                                )}
                            </div>

                            <div className="duplicatedContent">
                                {dependents.map((dep, idx) => (
                                    <div className="AddBeneficiaryContainerRow2" key={idx} style={{ gap: "10px", marginBottom: "20px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                                        <RegisterTextbox
                                            parentStyle={{ width: "100%", marginBottom: "16px" }}
                                            label="الاسم"
                                            type="text"
                                            onChange={(e) => handleFormChange(setName, dep.id, e.target.value)}
                                            error={error[`data.${idx}.name`]}
                                        />
                                        <RegisterSelect
                                            label="نوع الجنس"
                                            parentStyle={{ width: "100%" }}
                                            options={[
                                                { value: "", label: "اختر النوع" },
                                                { value: "0", label: "ذكر" },
                                                { value: "1", label: "أنثي" },
                                            ]}
                                            onChange={(e) => handleFormChange(setGender, dep.id, e.target.value)}
                                            error={error[`data.${idx}.gender`]}
                                        />
                                        <RegisterTextbox
                                            parentStyle={{ width: "100%", marginBottom: "16px" }}
                                            label="رقم الهوية"
                                            type="text"
                                            onChange={(e) => handleFormChange(setNationalid, dep.id, e.target.value)}
                                            error={error[`data.${idx}.nationalid`]}
                                        />
                                        <RegisterTextbox
                                            parentStyle={{ width: "100%", marginBottom: "16px" }}
                                            label="صلة القرابة"
                                            type="text"
                                            onChange={(e) => handleFormChange(setRelation, dep.id, e.target.value)}
                                            error={error[`data.${idx}.relation`]}
                                        />
                                        <div style={{ display: "flex", flexDirection: "column", width: "100%", marginBottom: "16px" }}>
                                            <label style={{marginBottom: "8px"}}  className='register-label'>تاريخ الميلاد</label>
                                            <input
                                                type="date"
                                                className='custom-datepicker'
                                                style={{ width: "100%", borderColor: dateErrors[idx]?.dob ? "red" : "" }}
                                                onChange={(e) => {
                                                    handleFormChange(setDob, dep.id, e.target.value);
                                                    setDateErrors(prev => {
                                                        const next = [...prev];
                                                        if (next[idx]) next[idx].dob = "";
                                                        return next;
                                                    });
                                                }}
                                            />
                                            {dateErrors[idx]?.dob && <span className="error" style={{ color: "red", fontSize: "12px" }}>{dateErrors[idx].dob}</span>}
                                            {error[`data.${idx}.dob`] && <span className="error">{error[`data.${idx}.dob`]}</span>}
                                        </div>
                                        <RegisterTextbox
                                            parentStyle={{ width: "100%", marginBottom: "16px" }}
                                            label="الحالة الصحية"
                                            type="text"
                                            onChange={(e) => handleFormChange(setHealth, dep.id, e.target.value)}
                                        />
                                        <div style={{ display: "flex", flexDirection: "column", width: "100%", marginBottom: "16px" }}>
                                            <label style={{marginBottom: "8px"}} className='register-label'>تاريخ انتهاء الهوية</label>
                                            <input
                                                type="date"
                                                className='custom-datepicker'
                                                style={{ width: "100%", borderColor: dateErrors[idx]?.idexpire ? "red" : "" }}
                                                onChange={(e) => {
                                                    handleFormChange(setIdexpire, dep.id, e.target.value);
                                                    setDateErrors(prev => {
                                                        const next = [...prev];
                                                        if (next[idx]) next[idx].idexpire = "";
                                                        return next;
                                                    });
                                                }}
                                            />
                                            {dateErrors[idx]?.idexpire && <span className="error" style={{ color: "red", fontSize: "12px" }}>{dateErrors[idx].idexpire}</span>}
                                        </div>
                                        <RegisterTextbox
                                            parentStyle={{ width: "100%", marginBottom: "16px" }}
                                            label="مصدر الهوية"
                                            type="text"
                                            onChange={(e) => handleFormChange(setIdSource, dep.id, e.target.value)}
                                        />
                                        <RegisterTextbox
                                            parentStyle={{ width: "100%", marginBottom: "16px" }}
                                            label="المرحلة الدراسية"
                                            type="text"
                                            onChange={(e) => handleFormChange(setGrade, dep.id, e.target.value)}
                                        />
                                        <RegisterTextbox
                                            parentStyle={{ width: "100%", marginBottom: "16px" }}
                                            label="المصروفات الدراسية"
                                            type="number"
                                            onChange={(e) => handleFormChange(setGardeCost, dep.id, e.target.value)}
                                        />
                                        <RegisterTextbox
                                            parentStyle={{ width: "100%", marginBottom: "16px" }}
                                            label="رقم الجوال"
                                            type="number"
                                            onChange={(e) => handleFormChange(setPhone, dep.id, e.target.value)}
                                        />
                                        <RegisterTextbox
                                            parentStyle={{ width: "100%", marginBottom: "16px" }}
                                            label="الملاحظات الاضافية"
                                            type="text"
                                            onChange={(e) => handleFormChange(setNotes, dep.id, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="AddBeneficiaryContainerRow" style={{ textAlign: "center", marginTop: "20px" }}>
                                {isSubmitting ? (
                                    <Spinner animation="border" variant="primary" />
                                ) : (
                                    <CustomButton text="حفظ" />
                                )}
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
}

export default ShowDependData;
