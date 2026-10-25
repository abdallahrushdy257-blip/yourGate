import './AddWarrantor.css'
import Title from "../../components/title";
import RegisterTextbox from "../../components/RegisterTextBox";
import CustomButton from "../../components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import RegisterSelect from '../../components/RegisterSelect';
import { useState } from 'react';
import API from '../../api/axiosConfig';
import { useNavigate } from 'react-router';
import { Spinner } from 'react-bootstrap';
import { text } from '@fortawesome/fontawesome-svg-core';

function AddWarrantor() {

    const [name, setName] = useState(() => sessionStorage.getItem('warrantorname') || '');
    const [address, setAddress] = useState(() => sessionStorage.getItem('warrantoraddress') || '');
    const [phone, setPhone] = useState(() => sessionStorage.getItem('warrantorphone') || '');
    const [email, setEmail] = useState(() => sessionStorage.getItem('warrantoremail') || '');
    const [type, setType] = useState(() => sessionStorage.getItem('warrantortype') || '');
    const [idnumber, setIdnumber] = useState(() => sessionStorage.getItem('warrantoridnumber') || '');
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
        mForm.append('idnumber', idnumber);
        try {
            const res = await API.post('/warrantor/store', mForm);

            const data = await res;
            if (data.status === 200) {
                sessionStorage.removeItem('warrantorname');
                sessionStorage.removeItem('warrantoraddress');
                sessionStorage.removeItem('warrantorphone');
                sessionStorage.removeItem('warrantoremail');
                sessionStorage.removeItem('warrantortype');
                sessionStorage.removeItem('warrantoridnumber');
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
   
    return (
        <>
            <Title title="إضافة كفيل"  icon={<FontAwesomeIcon icon={faHandHoldingDollar} />}  />
            <div className="statementofaccount">
                <div className="statementofaccountForm">
                    <div className='warrantorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="name"
                            label='إسم الكفيل'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={name}
                            onChange={
                                (e) => {
                                    setName(e.target.value)
                                    sessionStorage.setItem('warrantorname', e.target.value)
                                }
                            }
                            error={error.name}
                        />
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="type"
                            label='جهة عمل الكفيل'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={type}
                            onChange={
                                (e) => {
                                    setType(e.target.value)
                                    sessionStorage.setItem('warrantortype', e.target.value)
                                }
                            }
                            error={error.type}

                        />
                    </div>
                    {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {error && error.name && <span className="error" style={{ marginLeft: "60px" }}>{error.name}</span>}
                        {error && error.type && <span className="error" style={{ marginRight: "60px" }}>{error.type}</span>}
                    </div> */}
                    <div className='warrantorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="address"
                            label=' العنوان'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={address}
                            onChange={
                                (e) => {
                                    setAddress(e.target.value)
                                    sessionStorage.setItem('warrantoraddress', e.target.value)
                                }
                            }
                            error={error.address}

                        />

                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="phone"
                            label='رقم الجوال'
                            type="number"
                            stylee={{ width: "45%" }}
                            value={phone}
                            onChange={
                                (e) => {
                                    setPhone(e.target.value)
                                    sessionStorage.setItem('warrantorphone', e.target.value)
                                }
                            }
                            error={error.phone}
                        />

                    </div>
                    {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {error && error.address && <span className="error" style={{ marginLeft: "60px" }}>{error.address}</span>}
                        {error && error.phone && <span className="error" style={{ marginRight: "60px" }}>{error.phone}</span>}
                    </div> */}
                    <div className='warrantorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="email"
                            label='البريد الإلكتروني'
                            type="email"
                            stylee={{ width: "45%" }}
                            value={email}
                            onChange={
                                (e) => {
                                    setEmail(e.target.value)
                                    sessionStorage.setItem('warrantoremail', e.target.value)
                                }
                            }
                            error={error.email}

                        />

                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="idnumber"
                            label='رقم الهوية '
                            type="text"
                            stylee={{ width: "45%" }}
                            value={idnumber}
                            onChange={
                                (e) => {
                                    setIdnumber(e.target.value)
                                    sessionStorage.setItem('warrantoridnumber', e.target.value)
                                }
                            }
                            error={error.idnumber}

                        />

                    </div>
                    {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {error && error.email && <span className="error" style={{ marginLeft: "60px" }}>{error.email}</span>}
                        {error && error.idnumber && <span className="error" style={{ marginRight: "60px" }}>{error.idnumber}</span>}
                    </div> */}



                    {
                        isSubmitting ? <Spinner animation="border" variant="primary" /> :
                            <CustomButton
                                text="حفظ"
                                onClick={handleSubmit}
                                className="addClientBtn"
                            />}
                </div>
            </div>
        </>
    )
}

export default AddWarrantor