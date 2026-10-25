import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Title from '../../components/title'
import './employPaper.css'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import RegisterTextbox from '../../components/RegisterTextBox'
import UploadInput from '../../components/UploadInput'
import { Form , Spinner } from 'react-bootstrap'
import CustomButton from '../../components/CustomButton'
import React , { useState  , useEffect} from 'react'
import API from '../../api/axiosConfig'
import { useNavigate , useParams } from 'react-router-dom'
function AddEmpPaper() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [name , setName] = useState('');
    const [file , setFile] = useState('');
    const [error , setError] = useState([]);
    const [message , setMessage] = useState([]);
    const [isSubmitting , setIsSubmitting] = useState(false);
    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name' , name);
        formData.append('file' , file);
        formData.append('id' , id);
        try {
        const res = await API.post(`/employeeuploads/store` , formData , {
            headers: {
                'Content-Type': 'multipart/form-data'
        }
    })
    const data = await res;
    if (data.status === 200) {
        navigate('/hrreport/employees');
    } else {
        setError(data.data.errors);
    }
    } catch (error) {
        console.error(error);
        setIsSubmitting(false);
        setError(error.response.data.errors);
        setMessage(error.response.data.message);
    }
    }
    return (
        <>
            <div className='AddEmpPaper'>
                <Title
                    title="إضافة اوراق توظيف"
                    className="marketingtitle"
                    icon={<FontAwesomeIcon icon={faPlusCircle} />}
                />
                <Form className='AddEmpPaperCon' onSubmit={handleSubmit} encType='multipart/form-data'>
                    <div className='AddEmpPaperRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="name"
                            label="الورقة 1"
                            type="text"
                            stylee={{ width: "45%" }}
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            name="name"
                        />
                        <UploadInput
                            id="documentUpload"
                            parentStyle={{
                                marginBottom: "20px",
                                display: "unset",
                            }}
                            label="إرفع الورقة 1"
                            onChange={(e) => setFile(e.target.files[0])}
                            name="file"
                            style={{
                                margin: '30px 0 0 0',

                            }}
                        />
                    </div>
                   {
                          isSubmitting ? <Spinner animation="border" variant="primary" /> :
                   <CustomButton
                        text="حفظ"
                        className="addPaperBtn"
                    />}
                </Form>

            </div>
        </>
    )
}

export default AddEmpPaper