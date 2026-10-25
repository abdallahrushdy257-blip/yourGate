import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Title from '../../components/title'
import './addBeneficiary.css'
import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import RegisterTextbox from '../../components/RegisterTextBox'
import CustomButton from '../../components/CustomButton'
import { Form } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import RegisterSelect from '../../components/RegisterSelect'
import { useState } from 'react'

function MainBeneficiaryData() {
    const navigate = useNavigate()
    const [cardNum, setCardNum] = useState('');
    const [mobileNum, setMobileNum] = useState('');
    const [errors, setErrors] = useState({});

    const handleCardNumChange = (e) => {
        const { value } = e.target;
        setCardNum(value); 
        if (value.length !== 10) {
            setErrors((prevState) => ({
                ...prevState,
                cardnum: "رقم الهوية يجب ان يكون 10 أرقام",
            }));
        } else {
            setErrors((prevState) => ({
                ...prevState,
                cardnum: "",
            }));
        }
    };
    
    const handlePhoneNumChange = (e) => {
        const { value } = e.target;
        setMobileNum(value);
        if (value.length !== 10) {
            setErrors((prevState) => ({
                ...prevState,
                phonenum: "رقم الجوال يجب ان يكون 10 أرقام",
            }));
        } else {
            setErrors((prevState) => ({
                ...prevState,
                phonenum: "",
            }));
        }
    };
    


    const handleSubmit = (e) => {
        e.preventDefault();
    
        let hasErrors = false;
    
        if (cardNum.length !== 10) {
            setErrors((prevState) => ({
                ...prevState,
                cardnum: "رقم الهوية يجب ان يكون 10 أرقام",
            }));
            hasErrors = true;
        }
    
        if (mobileNum.length !== 10) {
            setErrors((prevState) => ({
                ...prevState,
                phonenum: "رقم الجوال يجب ان يكون 10 أرقام",
            }));
            hasErrors = true;
        }
    
    
        if (!hasErrors) {
            navigate('/additionainformation');
        }
    };
    
    return (
        <>
            <div className='AddBeneficiary'>
                <Title
                    title="البيانات الاساسية"
                    icon={<FontAwesomeIcon icon={faDatabase} />}
                />
                <Form className='AddBeneficiaryContainer' onSubmit={handleSubmit}>
                    <div className='AddBeneficiaryContainerRow'>
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="name"
                            label="الإسم"
                            type="text"
                            stylee={{
                                width: "55%",
                            }}
                        />{" "}
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="dob"
                            label="تاريخ الميلاد"
                            type="date"
                            stylee={{
                                width: "55%",
                            }}
                        />{" "}
                    </div>
                    <div className='AddBeneficiaryContainerRow'>
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="idnum"
                            label="رقم الهوية"
                            type="number"
                            onChange={handleCardNumChange}
                            stylee={{
                                width: "55%",
                            }}
                            onBlur={(e) => {
                                if (e.target.value.length !== 10) {
                                    setErrors((prevState) => ({
                                        ...prevState,
                                        cardnum: "رقم الهوية يجب ان يكون 10 أرقام",
                                    }));
                                } else {
                                    setErrors((prevState) => ({
                                        ...prevState,
                                        cardnum: "",
                                    }));
                                }
                            }}
                        />{" "}

                        <RegisterSelect
                            id="sex"
                            label="النوع"
                            stylee={{ width: "30%" }}
                            parentStyle={{ width: "30%", marginBottom: "20px" }}
                            options={[
                                { value: "", label: "اختر النوع" },
                                { value: "ذكر", label: "ذكر" },
                                { value: "أنثي", label: "أنثي" },
                            ]}
                        />
                    </div>

                    <div className='AddBeneficiaryContainerRow'>
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="benform"
                            label="نموذج بيانات المستفيد"
                            type="text"
                            stylee={{
                                width: "55%",
                            }}
                        />{" "}
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="age"
                            label="العمر"
                            type="number"
                            stylee={{
                                width: "55%",
                            }}
                        />{" "}
                    </div>

                    <div className='AddBeneficiaryContainerRow'>
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="phoneNum"
                            label="رقم الجوال"
                            type="number"
                            stylee={{
                                width: "55%",
                            }}
                        onChange={handlePhoneNumChange}
                        />{" "}
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="accNumber"
                            label="رقم الحساب"
                            type="text"
                            stylee={{
                                width: "55%",
                            }}
                        />{" "}
                    </div>
                    <div className='AddBeneficiaryContainerRow'>
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="email"
                            label="البريد الإلكتروني"
                            type="email"
                            stylee={{
                                width: "55%",
                            }}
                        />{" "}
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="nationality"
                            label="الجنسية"
                            type="text"
                            stylee={{
                                width: "55%",
                            }}
                        />{" "}
                    </div>
                    <div className='AddBeneficiaryContainerRow'>
                        <RegisterSelect
                            id="relation"
                            label="الحالة الإجتماعية"
                            stylee={{ width: "30%" }}
                            parentStyle={{ width: "30%", marginBottom: "20px" }}
                            options={[
                                { value: "", label: "اختر الحالة الإجتماعية" },
                                { value: "أعزب", label: "أعزب" },
                                { value: "متزوج", label: "متزوج" },
                                { value: "مطلق", label: "مطلق" },
                                { value: "أرمل", label: "أرمل" },
                            ]}
                        />
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="enrollmentDate"
                            label="تاريخ التسجيل"
                            type="date"
                            stylee={{
                                width: "55%",
                            }}
                        />{" "}
                    </div>
                    
                    <div className='AddBeneficiaryContainerRow' style={{ color: 'red', fontSize: '0.8em' }}>
                        {errors.cardnum && (
                            <div style={{ color: 'red', fontSize: '0.8em' }}>
                                {errors.cardnum}
                            </div>
                        )}
                        {errors.phonenum && (
                            <div style={{ color: 'red', fontSize: '0.8em' }}>
                                {errors.phonenum}
                            </div>
                        )}
                    </div>
                   
                    <div className='AddBeneficiaryContainerRow'>
                        <CustomButton text="حفظ" />
                    </div>

                </Form>
            </div>
        </>
    )
}

export default MainBeneficiaryData