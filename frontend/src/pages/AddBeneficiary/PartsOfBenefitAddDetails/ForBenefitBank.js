import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Title from '../../../components/title'
import '../addBeneficiary.css'
import { faBank } from '@fortawesome/free-solid-svg-icons'
import RegisterTextbox from '../../../components/RegisterTextBox'
import CustomButton from '../../../components/CustomButton'
import { Form , Spinner } from 'react-bootstrap'
import { useNavigate , useParams } from 'react-router'
import UploadInput from '../../../components/UploadInput'
import API from '../../../api/axiosConfig'
import { useEffect, useState } from 'react'


function ForBenefitBank({ onNext }) {
    const navigate = useNavigate()
    const { id } = useParams()
    const [name , setName] = useState('');
    const [branch , setBranch] = useState('');
    const [iban , setIban] = useState('');
    const [upload , setUpload] = useState('');
    const [isSubmitting , setIsSubmitted] = useState(false);
    const [error , setError] = useState('');
    const [rows , setRows] = useState([]);

    // const getBankDetails = async () => {
    //     try {
    //         const res = await API.get(`/humancasedetails/get/${id}`);
    //         const data = await res;
    //         if (data.status === 200) {
    //             setRows(data.data);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         setError(error.response.data.errors);
    //     }
    // }

    // useEffect(() => {
    //     getBankDetails();
    // }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        const formData = new FormData();
        formData.append('name' , name);
        formData.append('branch' , branch);
        formData.append('iban' , iban);
        formData.append('upload' , upload);
        try {
            const res = await API.post(`/hcrequest/${id}/banks` , formData , {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const data = await res;
            if (data.status === 200) {
               onNext();
            }
        } catch (error) {
            console.error(error);
            setIsSubmitted(false);
            setError(error.response.data.errors);
        }
        
    };


    return (
        <>
            <div className='AddBeneficiary'>
                <Title
                    title="البيانات البنكية"
                    icon={<FontAwesomeIcon icon={faBank} />}
                />
                <Form className='AddBeneficiaryContainer' onSubmit={handleSubmit} encType='multipart/form-data'>
                    <div className='AddBeneficiaryContainerRow'>
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="bankName"
                            label="إسم البنك"
                            type="text"
                            stylee={{
                                width: "55%",
                            }}
                            name="bankName"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />{error && error.name && <span className='error'>{error.name}</span>}
                    </div>

                    <div className='AddBeneficiaryContainerRow'>
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="branch"
                            label="الفرع"
                            type="text"
                            stylee={{
                                width: "55%",
                            }}
                            name="branch"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                        />{error && error.branch && <span className='error'>{error.branch}</span>}

                    </div>
                    <div className='AddBeneficiaryContainerRow'>
                        <RegisterTextbox
                            parentStyle={{
                                width: "30%",
                            }}
                            id="ibanNum"
                            label="رقم IBAN"
                            type="text"
                            stylee={{
                                width: "55%",
                            }}
                            name="iban"
                            value={iban}
                            onChange={(e) => setIban(e.target.value)}
                        />{error && error.iban && <span className='error'>{error.iban}</span>}

                    </div>


                    
                    <div className='AddBeneficiaryContainerRow'>
                        <UploadInput
                            id="chieftain"
                            parentStyle={{
                                marginBottom: "20px",
                                display: "flex",
                                alignItems: "center",
                            }}
                            label="صورة رقم IBAN"
                            onChange={(e) => setUpload(e.target.files[0])}
                            name="upload"
                        />

                    </div>
                    



                    <div className='AddBeneficiaryContainerRow'>
                    { isSubmitting ? <Spinner animation="border" variant="primary" /> :
                        <CustomButton text="حفظ" onClick={handleSubmit} />
                    }
                    </div>

                </Form>
            </div>
        </>
    )
}

export default ForBenefitBank