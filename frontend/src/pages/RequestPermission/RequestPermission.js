import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Title from '../../components/title';
import '../VacationRequest/VacationRequest.css'
import { faHand } from '@fortawesome/free-solid-svg-icons';
import RegisterSelect from '../../components/RegisterSelect';
import { Form } from 'react-bootstrap';
import CustomButton from '../../components/CustomButton';
import UploadInput from '../../components/UploadInput';

function RequestPermission() {
    const handleSibmit = (e) => {
        e.preventDefault()
    }
    return (
        <>
            <div className="vacationRequest-container">
                <Title
                    title="طلب إذن"
                    className="marketingtitle"
                    icon={<FontAwesomeIcon icon={faHand} />}
                />
                <Form onSubmit={handleSibmit}>
                    <div className="vacationInputs">
                        <RegisterSelect
                            id="empName"
                            label="إسم الموظف"
                            stylee={{ width: "45%" }}
                            parentStyle={{ width: "45%", marginBottom: "20px" }}
                            options={[
                                { value: "موظف1", label: "موظف 1" },
                                { value: "موظف2", label: "موظف 2" },
                                { value: "موظف3", label: "موظف 3" },
                            ]}
                        />

                        <RegisterSelect
                            id="vacType"
                            label="نوع الإذن"
                            stylee={{ width: "45%" }}
                            parentStyle={{ width: "45%", marginBottom: "20px" }}
                            options={[
                                { value: "dayPer", label: "إستئذان خلال اليوم" },
                                { value: "late", label: "تأخير عن الدوام" },
                                { value: "leave", label: "أنصراف مبكر" },
                                { value: "hospital", label: "مراجعة مستشفي خلال الدوام" },

                            ]}
                        />

                        <UploadInput
                            id="empdocumentUpload"
                            parentStyle={{
                                marginBottom: "20px",
                                display: "flex",
                                alignItems: "center",
                            }}
                            label="رفع صورة من الإذن 'إن وجد'"
                        />


                        <CustomButton text="حفظ" />
                    </div>
                </Form>
            </div>
        </>
    );
}

export default RequestPermission