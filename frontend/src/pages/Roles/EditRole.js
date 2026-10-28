import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Title from '../../components/title'
import '../EmployPaper/employPaper.css'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import RegisterTextbox from '../../components/RegisterTextBox'
import RegisterSelect from '../../components/RegisterSelect'
import { Form, Spinner } from 'react-bootstrap'
import { useState , useEffect } from 'react'
import { settingsService } from '../../modules/settings'
import { useNavigate , useParams } from 'react-router'

import RegisterTextarea from '../../components/RegisterTextarea'


function EditRole() {
   const [group , setGroup] = useState({});
    const [error, setError] = useState([]);
    const [message, setMessage] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

  const getGroup = async () => {
    try {
      const res = await settingsService.getRole(id);
      const data = await res;
    setGroup(data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.errors);
      setLoading(false);
    }
  };

  useEffect(() => {
    getGroup();
  }, []);

    const handelSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true);
        const mFormData = new FormData();
        mFormData.append("name", group.name);
        mFormData.append("description", group.description);
        mFormData.append("id", id);
        try {
            const res = await settingsService.updateRole(mFormData)
            const data = await res;
            if (data.status === 200) {
                navigate('/roles');
            } else {
                setError(data.data.errors);
            }

        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            setError(error.response.data.errors);
            setMessage(error.response.data.message);
        };
    }



    return (
        <>

            
            <Title name="تعديل دور" />
            <Form onSubmit={handelSubmit} className='employ-paper-form'>
                <RegisterTextbox
                    parentStyle={{
                        marginBottom: '15px',
                        width: '50%',
                        margin: '0 auto',
                    }}
                    label="اسم الدور"
                    type="text"
                    value={group.name}
                    onChange={(e) => setGroup({ ...group, name: e.target.value })}
                />
                <RegisterTextarea
                    parentStyle={{
                        marginBottom: '15px',
                         width: '50%',
                        margin: '0 auto',
                    }}
                    label="وصف الدور"
                    type="text"
                    value={group.description}
                    onChange={(e) => setGroup({ ...group, description: e.target.value })}
                />
               <div style={{width: '100%', display:'flex' , justifyContent:'center'}}>
                <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting} style={{marginTop: "20px" , width: "10%" , padding:"10px"}}>
                    {isSubmitting ? (
                        <>                            <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        </>
                    ) : (
                        <>
                            حفظ
                        </>
                    )}
                </button>   
                </div>             
            </Form>

        </>
    )
}

export default EditRole