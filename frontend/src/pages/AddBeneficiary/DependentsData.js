import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Title from '../../components/title';
import './addBeneficiary.css';
import { faPeopleRoof, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import RegisterTextbox from '../../components/RegisterTextBox';
import CustomButton from '../../components/CustomButton';
import { Form, Spinner, SplitButton } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import RegisterRadio from '../../components/Radio';
import { useState } from 'react';
import UploadInput from '../../components/UploadInput';
import RegisterSelect from '../../components/RegisterSelect';
import API from '../../api/axiosConfig';

function DependentsData() {
    const [illnesses, setIllnesses] = useState([{ id: 1 }]);
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState(['']);
    const [gender, setGender] = useState(['']);
    const [dob, setDob] = useState([]);
    const [relation, setRelation] = useState(['']);
    const [health, setHealth] = useState(['']);
    const [grade, setGrade] = useState(['']);
    const [gradeCost, setGardeCost] = useState(['']);
    const [nationalid, setNationalid] = useState(['']);
    const [idexpire, setIdexpire] = useState([]);
    const [phone, setPhone] = useState(['']);
    const [notes, setNotes] = useState(['']);
    const [idSource, setIdSource] = useState(['']);
    const [error, setError] = useState({});
    const [isSubmitting, setSubmitting] = useState(false);
    const [showMinus, setShowMinus] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData();
        formData.append('id', id);
        formData.append('data', JSON.stringify(mergeDependents(name, gender, nationalid, relation, dob, health, idexpire, idSource, grade, gradeCost, phone, notes).slice(1, name.length)));
        try {
            const response = await API.post('/humancasedetails/dependants/store', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const data = await response;
            if (data.status == 200) {
                navigate('/beneficiary');
            }
        } catch (error) {
            console.error(error);
            setSubmitting(false);
            setError(error.response.data.errors);
        }

    };


    const handleAddIllness = () => {
        setIllnesses([...illnesses, { id: illnesses.length + 1 }]);
        addDependent();
        setShowMinus(true);
    };

    const handleMinusIllness = () => {
        setShowMinus(true);
        setIllnesses(illnesses.slice(0, -1));
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
        if (illnesses.length === 2) {
            setShowMinus(false);
        }
    };

    const addDependent = () => {
        setName(...name, "");
        setGender(...gender, "");
        setNationalid(...nationalid, "");
        setRelation(...relation, "");
        setDob(...dob, "");
        setHealth(...health, "");
        setIdexpire(...idexpire, "");
        setIdSource(...idSource, "");
        setGrade(...grade, "");
        setGardeCost(...gradeCost, "");
        setPhone(...phone, "");
        setNotes(...notes, "");
    };

    const handleName = (index, value) => {
        const newInputs = [...name];
        newInputs[index] = value; // Update the correct input field
        setName(newInputs);
    };

    const handleGender = (index, value) => {
        const newInputs = [...gender];
        newInputs[index] = value; // Update the correct input field
        setGender(newInputs);
    };
    const formatDate = (dateObj) => {
        return dateObj.toISOString().split('T')[0]; // "yyyy-MM-dd"
    };
    const handleDob = (index, value) => {
        const newInputs = [...dob];
        newInputs[index] = (value); // Update the correct input field
        setDob(newInputs);
    }
    const handleRelation = (index, value) => {
        const newInputs = [...relation];
        newInputs[index] = value; // Update the correct input field
        setRelation(newInputs);
    }
    const handleHealth = (index, value) => {
        const newInputs = [...health];
        newInputs[index] = value; // Update the correct input field
        setHealth(newInputs);
    };
    const handleGrade = (index, value) => {
        const newInputs = [...grade];
        newInputs[index] = value; // Update the correct input field
        setGrade(newInputs);
    };
    const handleGradeCost = (index, value) => {
        const newInputs = [...gradeCost];
        newInputs[index] = value; // Update the correct input field
        setGardeCost(newInputs);
    };
    const handleNationalid = (index, value) => {
        const newInputs = [...nationalid];
        newInputs[index] = value; // Update the correct input field
        setNationalid(newInputs);
    };
    const handleIdexpire = (index, value) => {
        const newInputs = [...idexpire];
        newInputs[index] = (value); // Update the correct input field
        setIdexpire(newInputs);
    };
    const handleIdSource = (index, value) => {
        const newInputs = [...idSource];
        newInputs[index] = value; // Update the correct input field
        setIdSource(newInputs);
    };
    const handlePhone = (index, value) => {
        const newInputs = [...phone];
        newInputs[index] = value; // Update the correct input field
        setPhone(newInputs);
    };
    const handleNotes = (index, value) => {
        const newInputs = [...notes];
        newInputs[index] = value; // Update the correct input field
        setNotes(newInputs);
    };

    const mergeDependents = (name, gender, nationalid, relation, dob, health, idexpire, idSource, grade, gradeCost, phone, notes) => {
        var newItem = [];
        name.map((item, index) => (
            newItem.push({
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

            })
        ));
        return newItem;
    }

    //   const formatteddob = dob.map((d) => {
    //     if (!d) return "";
    //     const date = new Date(d);
    //     return date.toISOString().split('T')[0]; // YYYY-MM-DD
    // });

    // const formattedidexpire = idexpire.map((d) => {
    //     if (!d) return "";
    //     const date = new Date(d);
    //     return date.toISOString().split('T')[0]; // YYYY-MM-DD
    // });
    return (
        <>
            <div className='AddBeneficiary'>
                <Title
                    title="بيانات التابعين"
                    icon={<FontAwesomeIcon icon={faPeopleRoof} />}
                />
                <Form className='AddBeneficiaryContainer' onSubmit={handleSubmit}>

                    <span className='addillness' onClick={handleAddIllness} style={{ borderRadius: "50%", color: "green", marginLeft: "10px" }}>
                        <FontAwesomeIcon icon={faPlus} />
                    </span>
                    {
                        showMinus && (
                            <span className='addillness' on Click={handleMinusIllness} style={{ borderRadius: "50%", color: "red" }}>
                                <FontAwesomeIcon icon={faMinus} />
                            </span>
                        )
                    }
                    <div className='duplicatedContent'>
                        {illnesses.map((illness, value) => (
                            <>
                                <div className='AddBeneficiaryContainerRow2' key={illness.id} style={{ border: "1px solid var(--text-color)", padding: "10px", marginBottom: "20px", borderRadius: "10px" }}>
                                    <div className='AddBeneficiaryContainerRow'  >
                                        <RegisterTextbox
                                            parentStyle={{
                                                width: "20%",
                                            }}
                                            id={`name-${illness.id}`}
                                            label="الاسم"
                                            type="text"
                                            stylee={{
                                                width: "55%",
                                            }}
                                            name="name"
                                            onChange={(e) => handleName(illness.id, e.target.value)}
                                        />{error && error.name && <span className='error'>{error.name}</span>}
                                        <RegisterSelect
                                            id={`sex-${illness.id}`}
                                            label="نوع الجنس"
                                            stylee={{ width: "20%" }}
                                            parentStyle={{ width: "20%", marginBottom: "20px" }}
                                            options={[
                                                { value: "", label: "اختر النوع" },
                                                { value: "0", label: "ذكر" },
                                                { value: "1", label: "أنثي" },
                                            ]}
                                            onChange={(e) => handleGender(illness.id, e.target.value)}
                                        />{error && error.gender && <span className='error'>{error.gender}</span>}
                                    </div>
                                    <div className='AddBeneficiaryContainerRow' >
                                        <RegisterTextbox
                                            parentStyle={{
                                                width: "20%",
                                            }}
                                            id={`cardnum-${illness.id}`}
                                            label="رقم الهوية"
                                            type="text"
                                            stylee={{
                                                width: "55%",
                                            }}
                                            name="nationalid"
                                            onChange={(e) => handleNationalid(illness.id, e.target.value)}
                                        />{error && error.nationalid && <span className='error'>{error.nationalid}</span>}
                                        <RegisterTextbox
                                            parentStyle={{
                                                width: "20%",
                                            }}
                                            id={`relative-${illness.id}`}
                                            label="صلة القرابة"
                                            type="text"
                                            stylee={{
                                                width: "55%",
                                            }}
                                            name="relation"
                                            onChange={(e) => handleRelation(illness.id, e.target.value)}
                                        />{error && error.relation && <span className='error'>{error.relation}</span>}
                                    </div>
                                    <div className='AddBeneficiaryContainerRow' >

                                        <div style={{ display: "flex", flexDirection: "column", margin: "0", width: "20%" }}>
                                            <label className='register-label' style={{ width: "60%", marginBottom: "10px" }}>تاريخ الميلاد</label>
                                            <input
                                                type="date"
                                                id={`dob-${illness.id}`}
                                                name="dateofbirth"
                                                onChange={(e) => handleDob(illness.id, e.target.value)}
                                                className='custom-datepicker'
                                                style={{ width: "100%" }}
                                                value={dob[illness.id] || new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                        {error && error.dob && <span className='error'>{error.dob}</span>}
                                        <RegisterTextbox
                                            parentStyle={{ width: "20%", }}
                                            id={`status-${illness.id}`}
                                            label="الحالة الصحية"
                                            type="text"
                                            stylee={{ width: "55%", }}
                                            name="healthstatus"
                                            onChange={(e) => handleHealth(illness.id, e.target.value)}
                                        />
                                        {error && error.health && <span className='error'>{error.health}</span>}
                                    </div>
                                    <div className='AddBeneficiaryContainerRow' >

                                        <div style={{ display: "flex", flexDirection: "column", margin: "0", width: "20%" }}>
                                            <label className='register-label' style={{ width: "60%", marginBottom: "10px" }}>تاريخ انتهاء الهوية</label>
                                            <input
                                                type="date"
                                                id={`idexpire-${illness.id}`}
                                                name="idexpire"
                                                onChange={(e) => handleIdexpire(illness.id, e.target.value)}
                                                className='custom-datepicker'
                                                style={{ width: "100%" }}
                                                defaultValue={new Date().toISOString().split('T')[0]}

                                            />
                                        </div>
                                        {error && error.idexpire && <span className='error'>{error.idexpire}</span>}
                                        <RegisterTextbox
                                            parentStyle={{ width: "20%", }}
                                            id={`idsource-${illness.id}`}
                                            label="مصدر الهوية"
                                            type="text"
                                            stylee={{ width: "55%", }}
                                            name="idsource"
                                            onChange={(e) => handleIdSource(illness.id, e.target.value)}
                                        />{error && error.idsource && <span className='error'>{error.idsource}</span>}
                                    </div>
                                    <div className='AddBeneficiaryContainerRow' >
                                        <RegisterTextbox
                                            parentStyle={{
                                                width: "20%",
                                            }}
                                            id={`academicstage-${illness.id}`}
                                            label="المرحلة الدراسية"
                                            type="number"
                                            stylee={{
                                                width: "55%",
                                            }}
                                            name="academicstage"
                                            onChange={(e) => handleGrade(illness.id, e.target.value)}
                                        />
                                        {error && error.grade && <span className='error'>{error.grade}</span>}
                                        <RegisterTextbox
                                            parentStyle={{ width: "20%", }}
                                            id={`fees-${illness.id}`}
                                            label="المصروفات الدراسية"
                                            type="number"
                                            stylee={{ width: "55%", }}
                                            name="fees"
                                            onChange={(e) => handleGradeCost(illness.id, e.target.value)}
                                        />
                                        {error && error.gradeCost && <span className='error'>{error.gradeCost}</span>}
                                    </div>
                                    <div className='AddBeneficiaryContainerRow' >
                                        <RegisterTextbox
                                            parentStyle={{
                                                width: "20%",
                                            }}
                                            id={`phone-${illness.id}`}
                                            label="رقم الجوال"
                                            type="number"
                                            stylee={{
                                                width: "55%",
                                            }}
                                            name="phone"
                                            onChange={(e) => handlePhone(illness.id, e.target.value)}
                                        />{error && error.phone && <span className='error'>{error.phone}</span>}
                                        <RegisterTextbox
                                            parentStyle={{ width: "20%", }}
                                            id={`age-${illness.id}`}
                                            label="الملاحظات الاضافية"
                                            type="text"
                                            stylee={{ width: "55%", }}
                                            name="notes"
                                            onChange={(e) => handleNotes(illness.id, e.target.value)}
                                        />{error && error.notes && <span className='error'>{error.notes}</span>}
                                    </div>
                                </div>

                            </>
                        ))}
                    </div>


                    <div className='AddBeneficiaryContainerRow'>
                        {isSubmitting ? <Spinner animation="border" variant="primary" /> :
                            <CustomButton text="حفظ" />
                        }
                    </div>
                </Form>
            </div>
        </>
    );
}

export default DependentsData;