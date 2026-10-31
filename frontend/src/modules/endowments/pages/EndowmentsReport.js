import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomTable from "../../../components/CustomTable";
import { faLocationDot, faUsersBetweenLines, faPlus } from "@fortawesome/free-solid-svg-icons";
import "../../../pages/CaseDetails/CaseDetails.css";
import { useState, useEffect } from "react";
import TableComponent from "../../../components/TableComponent";
import { Modal, Form, Spinner } from 'react-bootstrap';
import RegisterTextbox from '../../../components/RegisterTextBox';
import RegisterSelect from '../../../components/RegisterSelect';
import UploadInput from '../../../components/UploadInput';
import Title from "../../../components/title";
import API from '../../../api/axiosConfig';
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";
import "../../../pages/CreateLoan/createLoan.css";
import "../../../pages/AddBeneficiary/addBeneficiary.css";
import './endowments.css';
import NewButton from "../../../components/NewButton";

function EndowmentsReport(params) {

    const columns = [
        { name: "اسم الوقف", key: "name" },
        { name: "تاريخ الصك", key: "date" },
        { name: "الحالة", key: "status_string" },
        { name: "النوع", key: "type" },
        { name: "إسم مسؤول الوقف", key: "empname" },
        { name: "", key: "actions" },
    ];

    const [rows, setRows] = useState([]);
    const [tableReloadKey, setTableReloadKey] = useState(Date.now());
    const [showModal, setShowModal] = useState(false);

    // Endowments form states
    const [activeTab, setActiveTab] = useState('one');
    const [type, setType] = useState("");
    const [formLoading, setFormLoading] = useState(true);
    const allowedTypes = ["عقار", "أرض", "سوق", "مزرعة"];
    const showTab2 = allowedTypes.includes(type);
    const tabs = showTab2 ? ['one', 'two', 'three'] : ['one', 'three'];

    const [formError, setFormError] = useState({});
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [endowmentnumber, setEndowmentnumber] = useState("");
    const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
    const [ownertype, setOwnertype] = useState("");
    const [endowmentsource, setEndowmentsource] = useState("");
    const [description1, setDescription1] = useState("");
    const [area, setArea] = useState("");
    const [houseamount, setHouseamount] = useState("");
    const [buildnumber, setBuildnumber] = useState("");
    const [streetname, setStreetname] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [zip, setZip] = useState("");
    const [state, setState] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [geolocation, setGeolocation] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [upload, setUpload] = useState("");
    const [casetype, setCasetype] = useState("");
    const [response, setResponse] = useState("");
    const [amount, setAmount] = useState("");
    const [annualfees, setAnnualfees] = useState("");
    const [netprofit, setNetprofit] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [account, setAccount] = useState('');

    const handleClose = () => {
        setShowModal(false);
        resetForm();
    };
    const handleShow = () => setShowModal(true);

    const resetForm = () => {
        setActiveTab('one');
        setType("");
        setName("");
        setDescription("");
        setEndowmentnumber("");
        setDate(new Date().toISOString().substr(0, 10));
        setOwnertype("");
        setEndowmentsource("");
        setDescription1("");
        setArea("");
        setHouseamount("");
        setBuildnumber("");
        setStreetname("");
        setCity("");
        setCountry("");
        setZip("");
        setState("");
        setZipcode("");
        setGeolocation("");
        setLatitude("");
        setLongitude("");
        setUpload("");
        setCasetype("");
        setResponse("");
        setAmount("");
        setAnnualfees("");
        setNetprofit("");
        setAccount("");
        setFormError({});
        setIsSubmitting(false);
    };

    const handleNext = () => {
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1]);
        }
    };

    const handleBack = () => {
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1]);
        }
    };

    const getEmployees = async () => {
        try {
            const res = await API.get("/endowments/employees");
            if (res.status === 200) {
                setEmployees(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setFormLoading(false);
        }
    };

    useEffect(() => {
        getEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('endowmentnumber', endowmentnumber);
        formData.append('date', date);
        formData.append('ownertype', ownertype);
        formData.append('endowmentsource', endowmentsource);
        formData.append('type', type);
        formData.append('description1', description1);
        formData.append('area', area);
        formData.append('houseamount', houseamount);
        formData.append('buildnumber', buildnumber);
        formData.append('streetname', streetname);
        formData.append('city', city);
        formData.append('country', country);
        formData.append('zip', zip);
        formData.append('state', state);
        formData.append('zipcode', zipcode);
        formData.append('geolocation', geolocation);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('upload', upload);
        formData.append('casetype', casetype);
        formData.append('response', response);
        formData.append('amount', amount);
        formData.append('annualfees', annualfees);
        formData.append('netprofit', netprofit);
        formData.append('account', account);

        try {
            const res = await API.post('/endowments/store', formData, {
                headers: { "Content-Type": "multipart/form-data", "Accept": "application/json" }
            });
            if (res.status === 200 || res.status === 201) {
                handleClose();
                setTableReloadKey(Date.now());
            }
        } catch (error) {
            console.log(error);
            setIsSubmitting(false);
            if (error.response && error.response.data && error.response.data.errors) {
                setFormError(error.response.data.errors);
            }
        }
    };

    const renderFormContent = () => {
        switch (activeTab) {
            case 'one':
                return (
                    <div className='endowments-form'>
                        <div className='endowmentsRow'>
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="إسم الوقف" type="text" stylee={{ width: "100%" }} name="name" onChange={(e) => setName(e.target.value)} value={name} error={formError.name} />
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="وصف الوقف" type="text" stylee={{ width: "100%" }} name="description" onChange={(e) => setDescription(e.target.value)} value={description} error={formError.description} />
                        </div>
                        <div className='endowmentsRow'>
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="رقم الصك" type="number" stylee={{ width: "100%" }} name="endowmentnumber" onChange={(e) => setEndowmentnumber(e.target.value)} value={endowmentnumber} error={formError.endowmentnumber} />
                            <div style={{ display: "flex", flexDirection: "column", width: "48%", marginBottom: "20px" }}>
                                <p style={{ marginBottom: "10px" }}>تاريخ انشاء الصك</p>
                                <input type="date" name="date" className="custom-datepicker" onChange={(e) => setDate(e.target.value)} value={date} style={{ width: "100%" }} />
                                {formError.date && <span className="error" style={{ color: "red" }}>{formError.date}</span>}
                            </div>
                        </div>
                        <div className='endowmentsRow'>
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="طريقة التملك" type="text" stylee={{ width: "100%" }} name="ownertype" onChange={(e) => setOwnertype(e.target.value)} value={ownertype} error={formError.ownertype} />
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="جهة اصدار الوقف" type="text" stylee={{ width: "100%" }} name="endowmentsource" onChange={(e) => setEndowmentsource(e.target.value)} value={endowmentsource} error={formError.endowmentsource} />
                        </div>
                        <div className='endowmentsRow'>
                            <RegisterSelect label="نوع الوقف" stylee={{ width: "100% !important" }} parentStyle={{ width: "48%" }} options={[
                                { value: "", label: "إختر النوع" },
                                { value: "أرض", label: "أرض" },
                                { value: "عقار", label: "عقار" },
                                { value: "سيارة", label: "سيارة" },
                                { value: "معدات", label: "معدات" },
                                { value: "سوق", label: "سوق" },
                                { value: "مزرعة", label: "مزرعة" },
                                { value: "تقنيات الكترونية", label: "تقنيات الكترونية" },
                                { value: "اخري", label: "اخري" },
                            ]} onChange={(e) => setType(e.target.value)} value={type} error={formError.type} />
                            <RegisterSelect label="الحساب الفرعي" stylee={{ width: "100% !important" }} parentStyle={{ width: "48%" }} options={[
                                { value: "", label: "إختر النوع" },
                                { value: "9e5000d7-6017-4785-b46c-8805d241d1c4", label: "استثمارات وقفية عقارية - اراضي" },
                                { value: "9e5000d7-7c3d-4a2d-a45b-91dec8e85ad6", label: "اسثمارات وقفية عقارية - مباني" },
                                { value: "9e5000d7-b02c-4e99-9e23-e030a7118503", label: " الأصول الثابتة الوقفية - أراضي" },
                                { value: "9e5000d8-3cad-42e3-a5ef-7da2ad630e7a", label: " الأصول الثابتة الوقفية - مباني" },
                                { value: "9e5000d8-7da3-4133-907d-3eecd5a07310", label: "الأصول الثابتة الوقفية - اللات و معدات" },
                                { value: "9e5000d9-400c-4cb5-9eaa-5086c84af5e1", label: "الاصول غير الملموسة - اوقاف" },
                                { value: "9e5000d9-6b43-4eda-a210-1bc075a5fe02", label: "اعمال رأسمالية تحت الانشاء" },
                                { value: "9e5000d9-d772-47e2-977b-dc39597de56c", label: " الموجودات الحيوية - أوقاف." },
                            ]} onChange={(e) => setAccount(e.target.value)} value={account} error={formError.account} />
                        </div>
                        {type === 'اخري' && (
                            <div className='endowmentsRow'>
                                <RegisterTextbox parentStyle={{ width: "100%" }} label="ادخل النوع" type="text" stylee={{ width: "100%" }} name="description1" onChange={(e) => setDescription1(e.target.value)} value={description1} error={formError.description1} />
                            </div>
                        )}
                    </div>
                );
            case 'two':
                return (
                    <div className='endowments-form'>
                        <div className='endowmentsRow'>
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="مساحة الوقف" type="text" stylee={{ width: "100%" }} name="area" onChange={(e) => setArea(e.target.value)} value={area} error={formError.area} />
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="عدد الوحدات السكنية" type="number" stylee={{ width: "100%" }} name="houseamount" onChange={(e) => setHouseamount(e.target.value)} value={houseamount} error={formError.houseamount} />
                        </div>
                        <div className='endowmentsRow'>
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="رقم المبني" type="number" stylee={{ width: "100%" }} name="buildnumber" onChange={(e) => setBuildnumber(e.target.value)} value={buildnumber} error={formError.buildnumber} />
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="إسم الشارع" type="text" stylee={{ width: "100%" }} name="streetname" onChange={(e) => setStreetname(e.target.value)} value={streetname} error={formError.streetname} />
                        </div>
                        <div className='endowmentsRow'>
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="إسم الحي" type="text" stylee={{ width: "100%" }} name="state" onChange={(e) => setState(e.target.value)} value={state} error={formError.state} />
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="المدينة" type="text" stylee={{ width: "100%" }} name="city" onChange={(e) => setCity(e.target.value)} value={city} error={formError.city} />
                        </div>
                        <div className='endowmentsRow'>
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="البلد" type="text" stylee={{ width: "100%" }} name="country" onChange={(e) => setCountry(e.target.value)} value={country} error={formError.country} />
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="الرمز البريدي" type="number" stylee={{ width: "100%" }} name="zipcode" onChange={(e) => setZipcode(e.target.value)} value={zipcode} error={formError.zipcode} />
                        </div>
                        <div className='endowmentsRow'>
                            <RegisterTextbox parentStyle={{ width: "100%" }} label="احداثيات العنوان" type="text" stylee={{ width: "100%" }} name="geolocation" onChange={(e) => setGeolocation(e.target.value)} value={geolocation} error={formError.geolocation} />
                        </div>
                        <div className='endowmentsRow'>
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="رأسي" type="text" stylee={{ width: "100%" }} prefix={<FontAwesomeIcon icon={faLocationDot} />} name="latitude" onChange={(e) => setLatitude(e.target.value)} value={latitude} error={formError.latitude} />
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="افقي" type="text" stylee={{ width: "100%" }} prefix={<FontAwesomeIcon icon={faLocationDot} />} name="longitude" onChange={(e) => setLongitude(e.target.value)} value={longitude} error={formError.longitude} />
                        </div>
                        <div className='endowmentsRow'>
                            <RegisterSelect label="الحالة" stylee={{ width: "100% !important" }} parentStyle={{ width: "100%" }} options={[
                                { value: "", label: "إختر الحالة" },
                                { value: "مؤجر", label: "مؤجر" },
                                { value: "غير مؤجر", label: "غير مؤجر" },
                                { value: "تشغيل ذاتي", label: "تشغيل ذاتي" },
                                { value: "قيد الإنشاء", label: "قيد الإنشاء" },
                                { value: "الصيانة", label: "الصيانة" },
                            ]} name="casetype" onChange={(e) => setCasetype(e.target.value)} value={casetype} error={formError.casetype} />
                        </div>
                    </div>
                );
            case 'three':
                return (
                    <div className='endowments-form'>
                        <div className='endowmentsRow'>
                            <RegisterSelect label="مسؤل الوقف" stylee={{ width: "100% !important" }} parentStyle={{ width: "48%" }} options={[
                                { value: "", label: "إختر المسؤول" },
                                ...employees.map((row) => ({ value: row.id, label: row.name }))
                            ]} name="response" onChange={(e) => setResponse(e.target.value)} value={response} error={formError.response} />
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="مصاريف الوقف" type="number" stylee={{ width: "100%" }} name="amount" onChange={(e) => setAmount(e.target.value)} value={amount} error={formError.amount} />
                        </div>
                        <div className='endowmentsRow'>
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="تكلفة التشغيل السنوية" type="number" stylee={{ width: "100%" }} name="annualfees" onChange={(e) => setAnnualfees(e.target.value)} value={annualfees} error={formError.annualfees} />
                            <RegisterTextbox parentStyle={{ width: "48%" }} label="الريع السنوي" type="number" stylee={{ width: "100%" }} name="netprofit" onChange={(e) => setNetprofit(e.target.value)} value={netprofit} error={formError.netprofit} />
                        </div>
                        <div className='endowmentsRow'>
                            <UploadInput id="documentUpload" parentStyle={{ width: "100%", marginBottom: "20px" }} label="مرفقات الوقف" onChange={(e) => setUpload(e.target.files[0])} name="upload" error={formError.upload} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    const [loading , setLoading] = useState(true);

//     const getEndowments = async () => {
//         try {
//             const res = await API.get("/endowments");
//             setRows(res.data);
//             setLoading(false);
//         } catch (error) {
//             console.log(error);
//         }
//     }
    const dropdownOptions = [
        { label: "تعديل", route: "/editEndowments/:id" },
    ];

// useEffect(() => {
//     getEndowments();
// }, []);
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

    return (
        <>
            {/* <NewButton onClick={handleShow} /> */}
            <div className="printcasedata-container">
                <TableComponent
                    apiUrl="/endowments"
                    columns={columns}
                    title="تقرير الأوقاف"
                    titleIcon={<FontAwesomeIcon icon={faLocationDot}/>}
                    dropdownOptions={dropdownOptions}
                    triggerReload={tableReloadKey}
                    addBtn={true}
                    onAddClick={handleShow}
                />
            </div>

            <Modal show={showModal} onHide={handleClose} size="lg" centered style={{ direction: "rtl" }}>
                <Modal.Header closeButton style={{ direction: "ltr" }}>
                    <Modal.Title>إضافة وقف جديد</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ paddingBottom: "0" }}>
                    <div className='createloan' style={{ border: "none", boxShadow: "none", padding: 0 }}>
                        <div className='divre'>
                            <div className='myTabs myTabs2' style={{ direction: "rtl", width: "100%" }}>
                                {tabs.map((tab, index) => (
                                    <button
                                        key={tab}
                                        className={`loantab ${activeTab === tab ? 'active' : ''} loantab2`}
                                        onClick={() => setActiveTab(tab)}
                                        type="button"
                                    >
                                        {tab === 'one' ? '1' : index + 1}
                                    </button>
                                ))}
                            </div>
                            <div className='line'></div>
                        </div>
                        <div className='tabContent' style={{ marginTop: "20px" }}>{renderFormContent()}</div>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: "none", justifyContent: "space-between", paddingBottom: "20px" }}>
                    <div className='navigationButtons' style={{ width: "100%", display: "flex", justifyContent: "space-between", margin: 0 }}>
                        {activeTab !== 'one' ? (
                            <button className=' loanbtn backButton' onClick={handleBack} type="button">
                                السابق
                            </button>
                        ) : <div></div>}
                        
                        {activeTab !== tabs[tabs.length - 1] ? (
                            <button className=' loanbtn nextButton' onClick={handleNext} type="button">
                                التالي
                            </button>
                        ) : (
                            isSubmitting ? <Spinner animation="border" variant="primary" /> :
                            <button type="button" className=' loanbtn saveButton' onClick={handleSubmit}>
                                حفظ
                            </button>
                        )}
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default EndowmentsReport
