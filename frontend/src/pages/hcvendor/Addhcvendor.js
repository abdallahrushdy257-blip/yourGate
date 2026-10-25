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


function Addhcvendor() {
    const [name, setName] = useState(() => sessionStorage.getItem('vendor_name') || '');
    const [address, setAddress] = useState(() => sessionStorage.getItem('vendor_address') || '');
    const [phone, setPhone] = useState(() => sessionStorage.getItem('vendor_phone') || '');
    const [email, setEmail] = useState(() => sessionStorage.getItem('vendor_email') || '');
    const [type, setType] = useState(() => sessionStorage.getItem('vendor_type') || '');
    const [identification_number, setIdentification_number] = useState(() => sessionStorage.getItem('vendor_identification_number') || '');
    const [identification_description, setIdentification_description] = useState(() => sessionStorage.getItem('vendor_identification_description') || '');
    const [interests, setInterests] = useState([]);
    const [region, setRegion] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const mForm = new FormData();
        mForm.append('name', name);
        mForm.append('address', address);
        mForm.append('phone', phone);
        mForm.append('email', email);
        mForm.append('type', type);
        mForm.append('description', description);
        mForm.append('identification_number', identification_number);
        mForm.append('identification_description', identification_description);
        mForm.append('region', region);
        try {
            const res = await API.post('/humancasevendor/store', mForm);
            const data = await res;
            if (data.status === 200) {
                sessionStorage.removeItem('vendor_name');
                sessionStorage.removeItem('vendor_address');
                sessionStorage.removeItem('vendor_phone');
                sessionStorage.removeItem('vendor_email');
                sessionStorage.removeItem('vendor_type');
                sessionStorage.removeItem('vendor_identification_number');
                sessionStorage.removeItem('vendor_identification_description');
                sessionStorage.removeItem('vendor_interests');
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

  

    return (
        <>
            <Title title="إضافة مورد" className="marketingtitle text-center" icon={<FontAwesomeIcon icon={faHandHoldingDollar} />} />
            <div className="AddhcvendorContainer">
                <div className="vendorForm mt-5">
                    <div className='vendorRow'>
                       <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="email"
                            label='البريد الإلكتروني'
                            type="email"
                            stylee={{ width: "45%" }}
                            value={email}
                            onChange={(e) => {
                                const value = e.target.value;
                                setEmail(value);
                                sessionStorage.setItem('vendor_email', value);
                            }}
                            error={error.email}
                        />
                        <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="name"
                            label='إسم المورد'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={name}
                            onChange={(e) => {
                                const value = e.target.value;
                                setName(value);
                                sessionStorage.setItem('vendor_name', value);
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
                            value={address}
                            onChange={(e) => {
                                const value = e.target.value;
                                setAddress(value);
                                sessionStorage.setItem('vendor_address', value);
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
                            value={region}
                            onChange={(e) => {
                                const value = e.target.value;
                                setRegion(value);
                                sessionStorage.setItem('vendor_region', value);
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
                            value={identification_description}
                            onChange={(e) => {
                                const value = e.target.value;
                                setIdentification_description(value);
                                sessionStorage.setItem('vendor_identification_description', value);
                            }}
                            error={error.identification_description}
                        />
                         <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="identification_number"
                            label='رقم الهوية'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={identification_number}
                            onChange={(e) => {
                                const value = e.target.value;
                                setIdentification_number(value);
                                sessionStorage.setItem('vendor_identification_number', value);
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
                                setType(value);
                                sessionStorage.setItem('vendor_type', value);
                            }}
                            value={type}
                            error={error.type}
                        />
                        
                             <RegisterTextbox
                            parentStyle={{ width: "30%" }}
                            id="phone"
                            label='رقم الجوال'
                            type="number"
                            stylee={{ width: "45%" }}
                            value={phone}
                            onChange={(e) => {
                                const value = e.target.value;
                                setPhone(value);
                                sessionStorage.setItem('vendor_phone', value);
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
                            value={description}
                            onChange={(e) => {
                                const value = e.target.value;
                                setDescription(value);
                                sessionStorage.setItem('vendor_description', value);
                            }}
                            error={error.description}
                        />
                       
                    </div>

                    {
                        isSubmitting ? <Spinner animation="border" variant="primary" /> :
                            <CustomButton
                                text="حفظ"
                                onClick={handleSubmit}
                                className="addClientBtn add-vendor"
                            />
                    }
                </div>
            </div>
        </>
    )
}

export default Addhcvendor;
