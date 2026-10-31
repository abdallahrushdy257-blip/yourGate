import './AddWarrantor.css'
import Title from "../../../components/title";
import RegisterTextbox from "../../../components/RegisterTextBox";
import CustomButton from "../../../components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { useState , useEffect } from 'react';
import API from '../../../api/axiosConfig';
import { useNavigate , useParams } from 'react-router';
import { Spinner } from 'react-bootstrap';

function EditWarrantor() {
    const { id } = useParams();
    const [error , setError] = useState({});
    const [isSubmitting , setIsSubmitting] = useState(false);
    const [warrantorData , setWarrantorData] = useState([]);

    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const mForm = new FormData();
        mForm.append('id' , id);
        mForm.append('name' , warrantorData.name);
        mForm.append('address' , warrantorData.address);
        mForm.append('phone' , warrantorData.phone);
        mForm.append('email' , warrantorData.email);
        mForm.append('type' , warrantorData.type);
        mForm.append('idnumber' , warrantorData.idnumber);
        try {
        const res = await API.post('/warrantor/update' , mForm );

        const data = await res;
        if (data.status === 200) {
            navigate('/warrantors');
        } else {
            setError(data.data.errors);
            setIsSubmitting(false);
        }
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            setError(error.response.data.errors);
        }

    };
    const getWarrantor = async () => {
        try {
            const res = await API.get(`/warrantor/${id}`);
            const data = await res;
            setWarrantorData(data.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getWarrantor();
    }, []);
    return (
        <>
            <Title title="تعديل كفيل"  icon={<FontAwesomeIcon icon={faHandHoldingDollar} />} />
            <div className="statementofaccount">
                <div className="statementofaccountForm">
                    <div className='warrantorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="name"
                            label='إسم الكفيل'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={warrantorData.name}
                            onChange={(e) => setWarrantorData({ ...warrantorData, name: e.target.value })}
                        />
                        { error && error.name && <span className="error">{error.name}</span>}
                        
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="type"
                            label='جهة عمل الكفيل'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={warrantorData.type}
                            onChange={(e) => setWarrantorData({ ...warrantorData, type: e.target.value })} 
                        />
                        { error && error.type && <span className="error">{error.type}</span>}
                    </div>
                    <div className='warrantorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="address"
                            label=' العنوان'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={warrantorData.address}
                            onChange={(e) => setWarrantorData({ ...warrantorData, address: e.target.value })}//setAddress(e.target.value)}
                        />
                        { error && error.address && <span className="error">{error.address}</span>}
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="phone"
                            label='رقم الجوال'
                            type="number"
                            stylee={{ width: "45%" }}
                            value={warrantorData.phone}
                            onChange={(e) => setWarrantorData({ ...warrantorData, phone: e.target.value })}//setPhone(e.target.value)}
                        />
                        { error && error.phone && <span className="error">{error.phone}</span>}
                    </div>

                    <div className='warrantorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="email"
                            label='البريد الإلكتروني'
                            type="email"
                            stylee={{ width: "45%" }}
                            value={warrantorData.email}
                            onChange={(e) => setWarrantorData({ ...warrantorData, email: e.target.value })}//setEmail(e.target.value)}
                        />
                        { error && error.email && <span className="error">{error.email}</span>}
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="idnumber"
                            label='رقم الهوية '
                            type="text"
                            stylee={{ width: "45%" }}
                            value={warrantorData.idnumber}
                            onChange={(e) => setWarrantorData({ ...warrantorData, idnumber: e.target.value })}//setIdnumber(e.target.value)}
                        />
                        { error && error.idnumber && <span className="error">{error.idnumber}</span>}
                    </div>

                   


                   { 
                    isSubmitting ? <Spinner animation="border" variant="primary" /> :
                    <CustomButton
                        text="تعديل"
                        onClick={handleSubmit}
                        className="addClientBtn"
                    />}
                </div>
            </div>
        </>
    )
}

export default EditWarrantor