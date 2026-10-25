import '../AddDonor/addDonor.css'
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

function EditUser () {

    const { id } = useParams();
    const navigate = useNavigate();

    const [error , setError] = useState({});
    const [isSubmitting , setIsSubmitting] = useState(false);
    const [user , setUser] = useState([]);
    const [loading , setLoading] = useState(true);
    const [group , setGroup] = useState([]);

    const getGroups = async () => {
        try {
            const res = await API.post(`/permissions`);
            const data = await res;
            if (data.status === 200) {
                setGroup(data.data);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(true);
        }   
    }

    
    const getUser = async () => {
        try {
          const res = await API.get(`/orgusers/${id}`);
          const data = await res;
          setUser(data.data);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setError(error.response.data.errors);
          setLoading(false);
        }
      };

      useEffect(() => {
        getUser();
         getGroups();
      }, []);
    
    const handleSubmit = async(e) => {

        e.preventDefault();
        const formData = new FormData();
        formData.append('name' , user.name);
        formData.append('address' , user.address);
        formData.append('phone' , user.phone);
        formData.append('email' , user.email);
        formData.append('password' , user.password);
        formData.append('representative' , user.representative);
        formData.append('group' , user.group_id);
        formData.append('id' , id);
        setIsSubmitting(true);
        await API.post(`/orgusers/update` , formData)
        .then(res => {
            const data =  res.data;
            
                navigate('/users');
          
        })
        .catch(err => {
            console.error(err);
            setIsSubmitting(false);
            setError(err.response.data.errors);
        })
    };
    return (
        loading ? <TestPreLoader /> :
        <>
            <Title title="تعديل مستخدم" className="marketingtitle" icon={<FontAwesomeIcon icon={faHandHoldingDollar} />} />
            <div className="statementofaccount">
                <div className="statementofaccountForm">
                    <div className='donorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="name"
                            label='إسم المستخدم'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={user.name}
                            onChange={(e) => setUser({...user , name: e.target.value})}
                        />
                        { error && error.name && <span className="error">{error.name}</span>}
                         <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="password"
                            label='كلمة المرور'
                            type="password"
                            stylee={{ width: "45%" }}
                            value={user.password}
                            onChange={(e) => setUser({...user , password: e.target.value})}
                        />
                        { error && error.password && <span className="error">{error.password}</span>}
                    </div>
                    <div className='donorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="address"
                            label=' العنوان'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={user.address}
                            onChange={(e) => setUser({...user , address: e.target.value})}
                        />
                        { error && error.address && <span className="error">{error.address}</span>}
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="phone"
                            label='رقم الجوال'
                            type="number"
                            stylee={{ width: "45%" }}
                            value={user.phone}
                            onChange={(e) => setUser({...user , phone: e.target.value})}
                        />
                        { error && error.phone && <span className="error">{error.phone}</span>}
                    </div>

                    <div className='donorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            id="email"
                            label='البريد الإلكتروني'
                            type="email"
                            stylee={{ width: "45%" }}
                            value={user.email}
                            onChange={(e) => setUser({...user , email: e.target.value})}
                        />
                        { error && error.email && <span className="error">{error.email}</span>}
                       
                    </div>

                    <div className='donorRow'>
                        <RegisterSelect
                            id="group"
                            label="المجموعة"
                             options={[
                                { value: "", label: "اختر المجموعة" },
                        ...group.map((grp) => ({
                          value: grp.id,
                          label: grp.name,
                        })),
                      ]}
                            onChange={(e) => setUser({...user , group_id: e.target.value})}
                            value={user.group_id}
                        />
                        { error && error.group_id && <span className="error">{error.group_id}</span>}
                    </div>

                    <RegisterSelect
                            id="type"
                            label=" ممثل الجمعية"
                            stylee={{
                                width: "45% !important",
                            }}
                            parentStyle={{
                                width: "45%",
                                marginBottom: "20px",
                            }}
                            options={[
                                { value: "", label: "إختر الصفة" },
                                { value: "0", label: "نعم" },
                                { value: "1", label: " لا" },

                            ]}
                            onChange={(e) => setUser({...user , representative: e.target.value})}
                            value={user.representative}
                        />
                        { error && error.representative && <span className="error">{error.representative}</span>}

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

export default EditUser 











