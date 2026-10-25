import './addhcvendor.css'
import Title from "../../components/title";
import RegisterTextbox from "../../components/RegisterTextBox";
import CustomButton from "../../components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import RegisterSelect from '../../components/RegisterSelect';
import { useState , useEffect } from 'react';
import API from '../../api/axiosConfig';
import { useNavigate } from 'react-router';
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router';


function Edithcvendor() {
    
    const [error, setError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams();
    const [hcvendor , setHcvendor] = useState([]);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const mForm = new FormData();
        mForm.append('name', hcvendor.name);
        mForm.append('address', hcvendor.address);
        mForm.append('phone', hcvendor.phone);
        mForm.append('email', hcvendor.email);
        mForm.append('type', hcvendor.type);
        mForm.append('description', hcvendor.description);
        mForm.append('identification_number', hcvendor.identification_number);
        mForm.append('identification_description', hcvendor.identification_description);
        mForm.append('region', hcvendor.region);
        mForm.append('id', id);
        try {
            const res = await API.post('/humancasevendor/update', mForm);
            const data = await res;
            if (data.status === 200) {
               
                navigate('/hcvendor');
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

    const getHcvendorDetails = async () => {
        try {
            const res = await API.get(`/humancasevendor/${id}`);
            const data = await res;
            if (data.status === 200) {
                setHcvendor(data.data);
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
    useEffect(() => {
        getHcvendorDetails();
    }, []);

  

    return (
        <>
            <Title title="إضافة مورد" className="marketingtitle text-center" icon={<FontAwesomeIcon icon={faHandHoldingDollar} />} />
            <div className="AddhcvendorContainer">
                <div className="global-form-container">
                    <div className='vendorRow'>
                       <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="email"
                            label='البريد الإلكتروني'
                            type="email"
                            stylee={{ width: "45%" }}
                            value={hcvendor.email}
                            onChange={(e) => {
                                setHcvendor({...hcvendor , email: e.target.value});
                            }}
                            error={error.email}
                        />
                        <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="name"
                            label='إسم المورد'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={hcvendor.name}
                            onChange={(e) => {
                                setHcvendor({...hcvendor , name: e.target.value});
                            }}
                            error={error.name}
                        />


                    </div>
                    {/* <div className='error'>
                        { error && error.name && <span style={{marginLeft:"10%"}}>{error.name} </span>}
                        { error && error.type && <span style={{marginRight:"10%"}}>{error.type} </span>}
                        </div> */}
                    <div className='vendorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="address"
                            label=' العنوان'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={hcvendor.address}
                            onChange={(e) => {
                                setHcvendor({...hcvendor , address: e.target.value});
                            }}
                            error={error.address}
                        />
                        {/* { error && error.address && <span className="error">{error.address}</span>} */}
                        <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="region"
                            label='المنطقة'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={hcvendor.region}
                            onChange={(e) => {
                                setHcvendor({...hcvendor , region: e.target.value});
                            }}
                            error={error.region}
                        />
                       
                        {/* { error && error.phone && <span className="error">{error.phone}</span>} */}
                    </div>

                    <div className='vendorRow'>
                         <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="identification_description"
                            label='وصف الهوية'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={hcvendor.identification_description}
                            onChange={(e) => {
                                setHcvendor({...hcvendor , identification_description: e.target.value});
                            }}
                            error={error.identification_description}
                        />
                         <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="identification_number"
                            label='رقم الهوية'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={hcvendor.identification_number}
                            onChange={(e) => {
                                setHcvendor({...hcvendor , identification_number: e.target.value});
                            }}
                            error={error.identification_number}
                        />
                        {/* { error && error.email && <span className="error">{error.email}</span>} */}
                        
                    </div>
                    <div className='vendorRow'>
                        <RegisterSelect
                            id="type"
                            label=" نوع المورد"
                            stylee={{
                                width: "45% !important",
                            }}
                            parentStyle={{
                                width: "30%",
                                marginBottom: "20px",
                            }}
                            options={[
                                { value: "", label: "إختر النوع" },
                                { value: "1", label: "داخلي" },
                                { value: "2", label: " خارجي " },
                               
                            ]}
                            onChange={(e) => {
                                const value = e.target.value;
                                setHcvendor({...hcvendor , type: value});
                            }}
                            value={hcvendor.type}
                            error={error.type}
                        />
                        
                             <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="phone"
                            label='رقم الجوال'
                            type="number"
                            stylee={{ width: "45%" }}
                            value={hcvendor.phone}
                            onChange={(e) => {
                                setHcvendor({...hcvendor , phone: e.target.value});
                            }}
                            error={error.phone}
                        />

                    </div>
                    <div className='vendorRow'>
                        
                         <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="description"
                            label='الوصف'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={hcvendor.description}
                            onChange={(e) => {
                                setHcvendor({...hcvendor , description: e.target.value});
                            }}
                            error={error.description}
                        />
                       
                    </div>

                    {
                        isSubmitting ? <Spinner animation="border" variant="primary" /> :
                            <div style={{display: "flex", justifyContent: "center",marginTop: "20px"}}>
                                <CustomButton
                                    text="حفظ"
                                    onClick={handleSubmit}
                                    className="add-vendor"
                                />
                            </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Edithcvendor;
