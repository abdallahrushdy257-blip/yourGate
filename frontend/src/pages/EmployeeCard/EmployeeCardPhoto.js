import './employeeCard.css'
import "../Accounting/WarehouseReport/Warehousereport.css";
import Title from '../../components/title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';
import CustomButton from '../../components/CustomButton';
import UploadInput from '../../components/UploadInput';

function EmployeeCardPhoto() {


    const handleSubmit = (e) => {
        e.preventDefault();
    };


    return (
        <>
            <Title
                title="إضافة صورة"
                icon={<FontAwesomeIcon icon={faUser} />}
            />

            <div className='addCardPhoto'>
                <Form onSubmit={handleSubmit}>

                <UploadInput
                    id="photo"
                    parentStyle={{
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                    }}
                    label="اضافة صورة"
                />
                    <CustomButton
                        text="حفظ"
                        className='addCardPhoto-btn'
                    />
                </Form>
            </div>
        </>
    )
}

export default EmployeeCardPhoto