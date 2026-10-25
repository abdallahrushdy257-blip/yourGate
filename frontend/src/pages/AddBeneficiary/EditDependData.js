import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Title from '../../components/title';
import './addBeneficiary.css';
import { faPeopleRoof } from '@fortawesome/free-solid-svg-icons';
import RegisterTextbox from '../../components/RegisterTextBox';
import CustomButton from '../../components/CustomButton';
import { Form, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import RegisterSelect from '../../components/RegisterSelect';
import API from '../../api/axiosConfig';
import TestPreLoader from '../TestPreLoader/TestPreLoader';

function EditDependentsData() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [error, setError] = useState({});
    const [isSubmitting, setSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [relation, setRelation] = useState('');
    const [health, setHealth] = useState('');
    const [grade, setGrade] = useState('');
    const [gradeCost, setGradeCost] = useState('');
    const [nationalid, setNationalid] = useState('');
    const [idexpire, setIdexpire] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [idSource, setIdSource] = useState('');
    const [humancaseId, setHumancaseId] = useState('');

    const [dateErrors, setDateErrors] = useState({ dob: "", idexpire: "" });

    const fetchDependentData = async () => {
        try {
            const response = await API.get(`/humancasedetails/show/${id}/dependants`);
            if (response.data) {
                const dependent = response.data;
                setName(dependent.name || '');
                setGender(dependent.gender || '');
                setDob(dependent.dateofbirth || '');
                setRelation(dependent.relation || '');
                setHealth(dependent.healthstatus || '');
                setGrade(dependent.educationlevel || '');
                setGradeCost(dependent.educationfees || '');
                setNationalid(dependent.nationalid || '');
                setIdexpire(dependent.nationalid_expire || '');
                setPhone(dependent.phone || '');
                setNotes(dependent.note || '');
                setIdSource(dependent.nationalid_source || '');
                setHumancaseId(dependent.humancase_id || '');
            }
            setIsLoading(false);
        } catch (error) {
            console.error('خطا:', error);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchDependentData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Date validation
        const today = new Date().toLocaleDateString('en-CA');
        let hasDateErrors = false;
        let newDateErrors = { dob: "", idexpire: "" };

        if (dob && dob > today) {
            newDateErrors.dob = "تاريخ الميلاد لا يمكن أن يكون في المستقبل";
            hasDateErrors = true;
        }

        if (idexpire && idexpire < today) {
            newDateErrors.idexpire = "تاريخ انتهاء الهوية لا يمكن أن يكون في الماضي";
            hasDateErrors = true;
        }

        if (hasDateErrors) {
            setDateErrors(newDateErrors);
            return;
        }

        setSubmitting(true);

        try {
            const formData = {
                name: name,
                gender: gender,
                relation: relation,
                healthstatus: health,
                dateofbirth: dob,
                educationlevel: grade,
                educationfees: gradeCost,
                nationalid: nationalid,
                nationalid_expire: idexpire,
                phone: phone,
                nationalid_source: idSource,
                note: notes
            };

            const response = await API.post(`/humancasedetails/update/dependsdata/${id}`, formData);

            if (response.status === 200) {
                navigate(`/showDependentsData/${humancaseId}`);
            }
        } catch (error) {
            console.error('خطأ:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                setError(error.response.data.errors);
            }
            setSubmitting(false);
        }
    };

    

    return (
        isLoading ? <TestPreLoader /> :

            <>
                <div className='AddBeneficiary'>
                    <Title
                        title="تعديل بيانات التابع"
                        icon={<FontAwesomeIcon icon={faPeopleRoof} />}
                    />
                    <Form className='AddBeneficiaryContainer' onSubmit={handleSubmit}>

                        <div className='AddBeneficiaryContainerRow2 editBeneficiary' >
                            <div className='AddBeneficiaryContainerRow'>
                                <RegisterTextbox
                                    parentStyle={{ width: "20%" }}
                                    id="name"
                                    label="الاسم"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    error={error.name}
                                />
                                <RegisterSelect
                                    id="sex"
                                    label="نوع الجنس"
                                    stylee={{ width: "20%" }}
                                    parentStyle={{ width: "20%", marginBottom: "20px" }}
                                    options={[
                                        { value: "", label: "اختر النوع" },
                                        { value: "0", label: "ذكر" },
                                        { value: "1", label: "أنثي" },
                                    ]}
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    error={error.gender}
                                />
                            </div>

                            <div className='AddBeneficiaryContainerRow'>
                                <RegisterTextbox
                                    parentStyle={{ width: "20%" }}
                                    id="cardnum"
                                    label="رقم الهوية"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    name="nationalid"
                                    value={nationalid}
                                    onChange={(e) => setNationalid(e.target.value)}
                                    error={error.nationalid}
                                />
                                <RegisterTextbox
                                    parentStyle={{ width: "20%" }}
                                    id="relative"
                                    label="صلة القرابة"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    name="relation"
                                    value={relation}
                                    onChange={(e) => setRelation(e.target.value)}
                                    error={error.relation}
                                />
                            </div>

                            <div className='AddBeneficiaryContainerRow'>
                                <div style={{ display: "flex", flexDirection: "column", margin: "0", width: "20%" }}>
                                    <label className='register-label' style={{ width: "60%", marginBottom: "10px" }}>
                                        تاريخ الميلاد
                                    </label>
                                    <input
                                        type="date"
                                        id="dob"
                                        name="dateofbirth"
                                        className='custom-datepicker'
                                        style={{ width: "100%", borderColor: dateErrors.dob ? "red" : "" }}
                                        value={dob}
                                        onChange={(e) => {
                                            setDob(e.target.value);
                                            setDateErrors(prev => ({ ...prev, dob: "" }));
                                        }}
                                    />
                                    {dateErrors.dob && <span className='error' style={{ color: "red", fontSize: "12px" }}>{dateErrors.dob}</span>}
                                    {error.dateofbirth && <span className='error'>{error.dateofbirth}</span>}
                                </div>
                                <RegisterTextbox
                                    parentStyle={{ width: "20%" }}
                                    id="status"
                                    label="الحالة الصحية"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    name="healthstatus"
                                    value={health}
                                    onChange={(e) => setHealth(e.target.value)}
                                    error={error.healthstatus}
                                />
                            </div>

                            <div className='AddBeneficiaryContainerRow'>
                                <div style={{ display: "flex", flexDirection: "column", margin: "0", width: "20%" }}>
                                    <label className='register-label' style={{ width: "60%", marginBottom: "10px" }}>
                                        تاريخ انتهاء الهوية
                                    </label>
                                    <input
                                        type="date"
                                        id="idexpire"
                                        name="nationalid_expire"
                                        className='custom-datepicker'
                                        style={{ width: "100%", borderColor: dateErrors.idexpire ? "red" : "" }}
                                        value={idexpire}
                                        onChange={(e) => {
                                            setIdexpire(e.target.value);
                                            setDateErrors(prev => ({ ...prev, idexpire: "" }));
                                        }}
                                    />
                                    {dateErrors.idexpire && <span className='error' style={{ color: "red", fontSize: "12px" }}>{dateErrors.idexpire}</span>}
                                    {error.nationalid_expire && <span className='error'>{error.nationalid_expire}</span>}
                                </div>
                                <RegisterTextbox
                                    parentStyle={{ width: "20%" }}
                                    id="idsource"
                                    label="مصدر الهوية"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    name="nationalid_source"
                                    value={idSource}
                                    onChange={(e) => setIdSource(e.target.value)}
                                    error={error.nationalid_source}
                                />
                            </div>

                            <div className='AddBeneficiaryContainerRow'>
                                <RegisterTextbox
                                    parentStyle={{ width: "20%" }}
                                    id="academicstage"
                                    label="المرحلة الدراسية"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    name="educationlevel"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    error={error.educationlevel}
                                />
                                <RegisterTextbox
                                    parentStyle={{ width: "20%" }}
                                    id="fees"
                                    label="المصروفات الدراسية"
                                    type="number"
                                    stylee={{ width: "55%" }}
                                    name="educationfees"
                                    value={gradeCost}
                                    onChange={(e) => setGradeCost(e.target.value)}
                                    error={error.educationfees}
                                />
                            </div>

                            <div className='AddBeneficiaryContainerRow'>
                                <RegisterTextbox
                                    parentStyle={{ width: "20%" }}
                                    id="phone"
                                    label="رقم الجوال"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    name="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    error={error.phone}
                                />
                                <RegisterTextbox
                                    parentStyle={{ width: "20%" }}
                                    id="notes"
                                    label="الملاحظات الاضافية"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    name="note"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    error={error.note}
                                />
                            </div>
                        </div>

                        <div className='AddBeneficiaryContainerRow'>
                            {isSubmitting ? (
                                <Spinner animation="border" variant="primary" />
                            ) : (
                                <CustomButton text="حفظ" type="submit" />
                            )}
                        </div>
                    </Form>
                </div>
            </>
    );
}

export default EditDependentsData;