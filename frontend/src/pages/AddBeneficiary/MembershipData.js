import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Title from '../../components/title'
import './addBeneficiary.css'
import { faHandshake } from '@fortawesome/free-solid-svg-icons'
import RegisterTextbox from '../../components/RegisterTextBox'
import CustomButton from '../../components/CustomButton'
import { Form } from 'react-bootstrap'
import { useNavigate } from 'react-router'

function MembershipData() {
    const navigate = useNavigate()


    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/bankdata');
    };


    return (
        <>
            <div className='AddBeneficiary'>
                <Title
                    title="بيانات الإنضمام للجمعية"
                    icon={<FontAwesomeIcon icon={faHandshake} />}
                />
                <Form className='AddBeneficiaryContainer' onSubmit={handleSubmit}>
                    <div className='AddBeneficiaryContainerRow'>
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="fileType"
                            label="نوع الملف"
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
                            id="exchangewarehouse"
                            label="مستودع الصرف"
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
                            id="archNum"
                            label="رقم ملف الأرشيف"
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
                            id="attributes"
                            label="الصفات"
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
                            id="needs"
                            label="الإحتياجات"
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

export default MembershipData