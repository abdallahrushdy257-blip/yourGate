import './addDonor.css'
import Title from "../../components/title";
import RegisterTextbox from "../../components/RegisterTextBox";
import CustomButton from "../../components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import RegisterSelect from '../../components/RegisterSelect';
import { useParams } from 'react-router';
import API from '../../api/axiosConfig';
import { useState , useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Spinner } from 'react-bootstrap';
import TestPreLoader from '../TestPreLoader/TestPreLoader';

function EditDonor () {

    const { id } = useParams();
    const navigate = useNavigate();

    const [error , setError] = useState({});
    const [isSubmitting , setIsSubmitting] = useState(false);
    const [donor , setDonor] = useState([]);
    const [loading , setLoading] = useState(true);
    const [interests , setInterests] = useState([]);

    const getDoner = async () => {
        try {
          const res = await API.get(`/donor/${id}`);
          const data = await res;
          setDonor(data.data);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setError(error.response.data.errors);
          setLoading(false);
        }
      };

      useEffect(() => {
        getDoner();
      }, []);
    
    const handleSubmit = async(e) => {

        e.preventDefault();
        const formData = new FormData();
        formData.append('name' , donor.name);
        formData.append('address' , donor.address);
        formData.append('phone' , donor.phone);
        formData.append('email' , donor.email);
        formData.append('type' , donor.type);
        formData.append('id' , id);
        formData.append('identification_number', donor.identification_number);
        formData.append('identification_description', donor.identification_description);
        formData.append('donorInterests', donor.interest_id);
        setIsSubmitting(true);
        await API.post(`/donor/update` , formData)
        .then(res => {
            const data =  res.data;
            
                navigate('/donors');
          
        })
        .catch(err => {
            console.error(err);
            setIsSubmitting(false);
            setError(err.response.data.errors);
        })
    };
    const getInterests = async () => {
        try {
            const res = await API.get('/donorinterest/all');
            const data = await res;
            setInterests(data.data);
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    useEffect(() => {
        getInterests();
    }, []);
    return (
        loading ? <TestPreLoader /> :
        <>
            <Title title="تعديل مانح"  icon={<FontAwesomeIcon icon={faHandHoldingDollar} />} />
            <div style={{width:"60%",maxWidth:"100%"}} className="global-form-container">
                <div className="donorForm">
                    <div className='donorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="email"
                            label='البريد الإلكتروني'
                            type="email"
                            stylee={{ width: "45%" }}
                            value={donor.email}
                            onChange={(e) => setDonor({...donor , email: e.target.value})}
                        />
                        { error && error.email && <span className="error">{error.email}</span>}
                        <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="name"
                            label='إسم المانح'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={donor.name}
                            onChange={(e) => setDonor({...donor , name: e.target.value})}
                        />
                        { error && error.name && <span className="error">{error.name}</span>}
                       
                    </div>
                    <div className='donorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="address"
                            label=' العنوان'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={donor.address}
                            onChange={(e) => setDonor({...donor , address: e.target.value})}
                        />
                        { error && error.address && <span className="error">{error.address}</span>}
                        <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="phone"
                            label='رقم الجوال'
                            type="number"
                            stylee={{ width: "45%" }}
                            value={donor.phone}
                            onChange={(e) => setDonor({...donor , phone: e.target.value})}
                        />
                        { error && error.phone && <span className="error">{error.phone}</span>}
                    </div>

                    <div className='donorRow'>
                         <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="identification_number"
                            label='رقم الهوية'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={donor.identification_number}
                            onChange={(e) => setDonor({...donor , identification_number: e.target.value})}
                        />
                        { error && error.identification_number && <span className="error">{error.identification_number}</span>}
                       <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="identification_description"
                            label='وصف الهوية'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={donor.identification_description}
                            onChange={(e) => setDonor({...donor , identification_description: e.target.value})}
                        />
                        { error && error.identification_description && <span className="error">{error.identification_description}</span>}
                    </div>

                    <div className='donorRow'>
                         <RegisterSelect
                            id="type"
                            label="صفة المانح"
                            stylee={{
                                width: "45% !important",
                            }}
                            parentStyle={{
                                width: "30%",
                                marginBottom: "20px",
                            }}
                            options={[
                                { value: "", label: "إختر الصفة" },
                                { value: "1", label: "أفراد" },
                                { value: "2", label: " مؤسسة أهلية" },
                                { value: "3", label: " مؤسسة تجارية" },
                                { value: "4", label: " منصة حكومية" },
                            ]}
                            onChange={(e) => setDonor({...donor , type: e.target.value})}
                            value={donor.type}
                        />
                        { error && error.type && <span className="error">{error.type}</span>}
                        <RegisterSelect
                            id="donorInterests"
                            label="نوع الاهتمام"
                            stylee={{
                                width: "45% !important",
                            }}
                            parentStyle={{
                                width: "30%",
                                marginBottom: "20px",
                            }}
                            options={interests.map((interest) => ({ value: interest.id, label: interest.name }))}
                            onChange={(e) => setDonor({...donor , interest_id: e.target.value})}
                            value={donor.interest_id}
                        />
                        { error && error.donorInterests && <span className="error">{error.donorInterests}</span>}
                   
                    </div>

                   


                   { 
                    isSubmitting ? <Spinner animation="border" variant="primary" /> :
                    <CustomButton
                        text="تعديل"
                        onClick={handleSubmit}
                        className="edit-donor"
                    />}
                </div>
            </div>
        </>
    )
}

export default EditDonor 











