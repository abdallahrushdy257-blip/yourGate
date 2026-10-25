import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  { useEffect, useState } from "react";
import {  faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'react-bootstrap';
import RegisterTextbox from '../../components/RegisterTextBox';
import API from '../../api/axiosConfig';
import { useParams , useNavigate } from 'react-router';
import RegisterSelect from '../../components/RegisterSelect';
import TestPreLoader from '../TestPreLoader/TestPreLoader';
import Title from "../../components/title";
import { Form } from 'react-bootstrap';
import CustomButton from '../../components/CustomButton';

function RiskMitigation() {
    const columns = [
        { name: "المرحلة", key: "phase_name" },
        { name: " الوصف", key: "description" },
        { name: "مستوى التأثير", key: "impact_level_string" },
        { name: "الاحتمالية", key: "probability_string" },
        { name: "الحالة", key: "status_string" },
        { name: "", key: "actions" },
    ];
    const [rows, setRows] = useState([])
    const [error, setError] = useState([])
    const [phases, setPhases] = useState('')
    const [description, setDescription] = useState('');
    const [impectlevel, setImpactLevel] = useState(Date.now())
    const [probability, setProbability] = useState(Date.now())
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [message , setMessage] = useState('');
    const navigate = useNavigate();

    
    const handleMitigation = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('risk_id', id);
        formData.append('description', description);
        formData.append('impactlevel', impectlevel);
        formData.append('probability', probability);

        try {
            const res = await API.post(`/projectrisk/mitigation/store`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const data = await res;
            if (data.status === 200) {
                setPhases('');
                setDescription('');
                setImpactLevel('');
                setProbability('');
                setError([]);

            }
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            setError(error.response?.data?.errors || {});
        }
    };

    const dropdownOptions = [
        { label: "خطة التخفيف", route: `riskmitigation/${id}` },
    ];

    const [phase , setPhase] = useState({});

    const getPhases = async () => {
        try {
            const response = await API.get(`/projectphase/${id}/all`);
            const data = await response;
            setPhase(data.data);
            setLoading(false);
            navigate(-1);
        } catch (error) {
            console.log(error);
            setError(error.response.data.errors);
            setMessage(error.response.data.message);
        }
    };

    useEffect(() => {
        getPhases();
    }, []);

    if (loading) return <TestPreLoader />
    return (
         <>
      <Title
        title="إنشاء حالة جديدة"
        icon={<FontAwesomeIcon icon={faPenToSquare} />}
      />

      <div className="createManageCon">
        <Form onSubmit={handleMitigation} encType="multipart/form-data">
          <div className="createManege-inputs">
            <div className="case-name">
               <RegisterSelect id="impectlevel"
                  label=" مستوى التأثير"
                  stylee={{ width: "100%" }}
                  parentStyle={{ width: "80%" }}
                  options={[
                    { value: "", label: " اختر  مستوى التأثير " },
                    { value: "0", label: "  منخفض" },
                    { value: "1", label: "  متوسط" },
                    { value: "2", label: "  مرتفع" },
                    
                  ]}
                  name="impactLevel"
                  value={impectlevel}
                  onChange={(e) => setImpactLevel(e.target.value)}
                />
                 <RegisterSelect id="probability"
                  label=" الاحتمالية"
                  stylee={{ width: "100%" }}
                  parentStyle={{ width: "80%" }}
                  options={[
                    { value: "", label: " اختر  الاحتمالية " },
                    { value: "0", label: " منخفض " },
                    { value: "1", label: " متوسط" },
                    { value: "2", label: " مرتفع" },
                    
                  ]}
                  name="probability"
                  value={probability}
                  onChange={(e) => setProbability(e.target.value)}
                />
                    

                    <RegisterTextbox label="الوصف" type="text" value={description} onChange={(e) => setDescription(e.target.value)} stylee={{ width: "100%" }} parentStyle={{ width: "80%" }}/>
                    {error && error.description && <span className="error">{error.description[0]}</span>}

                  </div>
          </div>

          {
            isSubmitting ?
              <Spinner animation="border" variant="primary" style={{ display: "block", margin: "auto" }} />
              :
              <div className="createManege-inputs createManege-buttonCon ">
                <CustomButton text="حفظ" />
              </div>
          }
        </Form>
      </div>
    </>
    );
}
export default RiskMitigation;
