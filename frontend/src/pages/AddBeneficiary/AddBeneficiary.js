import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Title from '../../components/title'
import './addBeneficiary.css'
import { faPersonHarassing } from '@fortawesome/free-solid-svg-icons'
import RegisterTextbox from '../../components/RegisterTextBox'
import CustomButton from '../../components/CustomButton'
import { Form } from 'react-bootstrap'
import { useNavigate } from 'react-router'

function AddBeneficiary() {
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        navigate('/mainbeneficiarydata')
    }

    return (
        <>
            <div className='AddBeneficiary'>
                <Title
                    title="إضافة مستفيد"
                    icon={<FontAwesomeIcon icon={faPersonHarassing} />}
                />
                <Form className='AddBeneficiaryContainer' onSubmit={handleSubmit}>
                    <div className='AddBeneficiaryContainerRow'>
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="benName"
                            label="إسم المستفيد"
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
                            id="happendby"
                            label="حدث بواسطة"
                            type="text"
                            stylee={{
                                width: "55%",
                            }}
                        />{" "}
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="updateDate"
                            label="تاريخ التحديث"
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
                            id="createdBy"
                            label="انشأ بواسطة"
                            type="text"
                            stylee={{
                                width: "55%",
                            }}
                        />{" "}
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="createDate"
                            label="تاريخ الإنشاء"
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
                            id="datastatus"
                            label="حالة البيانات"
                            type="text"
                            stylee={{
                                width: "55%",
                            }}
                        />{" "}
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="fileStatus"
                            label="حالة الملف"
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
                            id="filetype"
                            label="نوع الملف"
                            type="text"
                            stylee={{
                                width: "55%",
                            }}
                        />{" "}
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="fileCategory"
                            label="فئة الملف"
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

export default AddBeneficiary