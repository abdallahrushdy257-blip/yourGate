//import './AddWarrantor.css'
import Title from "../../../../components/title";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import CustomButton from "../../../../components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import RegisterSelect from '../../../../components/RegisterSelect';
import { useState } from 'react';
import API from '../../../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router';
import { Spinner } from 'react-bootstrap';

function ProjectData({ goNextTab }) {

    const { id } = useParams();
    const [address, setAddress] = useState('');
    const [type, setType] = useState('');
    const [contact, setContact] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [message, setMessage] = useState('');
    const handleProjectData = async (e) => {
        e.preventDefault();
        setError({});
  
  // التحقق من القيم قبل الإرسال
  if (!address.trim()) {
    setError({ address: "حقل العنوان مطلوب" });
    return;
  }

  if (type === "") {
    setError({ type: "حقل النوع مطلوب" });
    return;
  }
        setLoading(true);
        setError({});
        const projectData = {
            address,
            type,
            contact,
            phone,
            description,
        };
        try {
            const res = await API.post(`/feasibilitystudies/store`, {
                project_data: projectData,
                id: id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res;
            if (data.status === 200) {
                setLoading(false);
                window.alert("تم اضافة بيانات المشروع بنجاح");
                if (goNextTab) {
                    goNextTab();
                }
                
            }
        } catch (error) {
            //console.error(error);
            setLoading(false);
            setError(error.response.data.errors);
            setMessage(error.response.data.message);
        }


    }
    return (
        <>
            <Title title="إضافة بيانات المشروع"  icon={<FontAwesomeIcon icon={faHandHoldingDollar} />} />
            <div className="statementofaccount">
                <div className="statementofaccountForm">
                    <div className='warrantorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="address"
                            label='مكان المشروع '
                            type="text"
                            stylee={{ width: "45%" }}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required={true}
                        />
                        
                        <RegisterSelect
                            id="type"
                            label="نوع المشروع"
                            stylee={{
                                width: "45% !important",
                            }}
                            parentStyle={{
                                width: "45%",
                                marginBottom: "20px",
                            }}
                            options={[
                                { value: "", label: "إختر الطريقة" },
                                { value: "1", label: "منزلي" },
                                { value: "2", label: "محل" },
                                { value: "3", label: "متنقل" },
                            ]}
                            onChange={(e) => setType(e.target.value)}
                            value={type}
                           required={true}
                        />
                        </div>
                        <div style={{display:'flex' , flexDirection:'row' , justifyContent:'space-evenly'}}>
                            { error && error.address && <span className="error">{error.address}</span>}
                            { error && error.type && <span className="error">{error.type}</span>}
                        </div>
                        {/* { error && error.type && <span className="error">{error.type}</span>} */}
                         <div className='warrantorRow'>
                        <RegisterSelect
                            id="cnotact"
                            label="طرق التواصل"
                            stylee={{
                                width: "45% !important",
                            }}
                            parentStyle={{
                                width: "45%",
                                marginBottom: "20px",
                            }}
                            options={[
                                { value: "", label: "إختر الطريقة" },
                                { value: "1", label: "واتساب" },
                                { value: "2", label: "سناب شات" },
                                { value: "3", label: "تويتر" },
                                { value: "4", label: "انستغرام" },
                                { value: "5", label: "موقع الالكتروني" },
                            ]}
                            onChange={(e) => setContact(e.target.value)}
                            value={contact}
                        />
                        {/* { error && error.contact && <span className="error">{error.contact}</span>} */}
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="description"
                            label='وصف طريقة التواصل'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {/* { error && error.description && <span className="error">{error.description}</span>} */}
                    </div>
                    <div className='warrantorRow'>

                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="phone"
                            label='رقم الجوال'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        {/* { error && error.phone && <span className="error">{error.phone}</span>} */}
                    </div>
                    {message && message !== "" && <div className="errorMessage" style={{color:'red'}}>{message}</div>}
                    <div className="warrantorSubmitBtn">
                        <CustomButton
                            text={loading ? <Spinner animation="border" size="sm" /> : "حفظ البيانات"}
                            onClick={handleProjectData}
                            stylee={{ width: "150px", height: "40px", fontSize: "16px" }}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectData;