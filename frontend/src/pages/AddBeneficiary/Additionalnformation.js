import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Title from '../../components/title'
import './addBeneficiary.css'
import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import RegisterTextbox from '../../components/RegisterTextBox'
import CustomButton from '../../components/CustomButton'
import { Form } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import UploadInput from '../../components/UploadInput'

function Additionalnformation() {
    const navigate = useNavigate()


    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/membershipdata');
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
                            id="idSource"
                            label="مصدر الهوية"
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
                            id="idDate"
                            label="تاريخ انتهاء الهوية"
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
                            id="moreNotes"
                            label="ملاحظات اضافية"
                            type="text"
                            stylee={{
                                width: "55%",
                            }}
                        />{" "}

                    </div>
                    <div className='AddBeneficiaryContainerRow'>
                        <UploadInput
                            id="chieftain"
                            parentStyle={{
                                marginBottom: "20px",
                                display: "flex",
                                alignItems: "center",
                            }}
                            label="نموذج شيخ القبيلة"
                        />

                    </div>



                    <div className='AddBeneficiaryContainerRow'>
                        <CustomButton text="حفظ" />
                    </div>

                </Form>
            </div>
        </>
    )
}

export default Additionalnformation