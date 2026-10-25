import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Title from '../../components/title'
import './addBeneficiary.css'
import { faPhoneVolume } from '@fortawesome/free-solid-svg-icons'
import RegisterTextbox from '../../components/RegisterTextBox'
import CustomButton from '../../components/CustomButton'
import { Form } from 'react-bootstrap'
import { useNavigate } from 'react-router'

function CallingData() {
    const navigate = useNavigate()


    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/qualificationposition');
    };


    return (
        <>
            <div className='AddBeneficiary'>
                <Title
                    title="بيانات الإتصال"
                    icon={<FontAwesomeIcon icon={faPhoneVolume} />}
                />
                <Form className='AddBeneficiaryContainer' onSubmit={handleSubmit}>
                    <div className='AddBeneficiaryContainerRow'>
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="phoneNumber"
                            label="رقم الجوال"
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
                            id="grphoneNumber"
                            label="رقم التيليفون الأرضي"
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
                            id="email"
                            label="البريد الإلكتروني"
                            type="email"
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
                            id="other"
                            label="اخري"
                            type="text"
                            stylee={{
                                width: "55%",
                            }}
                        />{" "}

                    </div>


                    <div className='AddBeneficiaryContainerRow'>
                        <CustomButton text="حفظ" />
                    </div>

                </Form>
            </div>
        </>
    )
}

export default CallingData