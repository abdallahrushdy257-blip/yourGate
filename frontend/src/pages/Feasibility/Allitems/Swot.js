//import './AddWarrantor.css'
import Title from "../../../components/title";
import RegisterTextbox from "../../../components/RegisterTextBox";
import RegisterTextarea from "../../../components/RegisterTextarea";
import CustomButton from "../../../components/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import API from '../../../api/axiosConfig';
import { useNavigate , useParams } from 'react-router';
import { Spinner } from 'react-bootstrap';

function Swot({ goNextTab }) {

    const { id } = useParams();
    const [strength, setStrength] = useState('');
    const [weaknesses, setWeaknesses] = useState('');
    const [opportunities, setOpportunities] = useState('');
    const [threats, setThreats] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    const handleSwot = async (e) => {
        e.preventDefault();
        if (!strength.trim()) {
            setError({ strength: "حقل نقاط القوة مطلوب" });
            return;
        }
        if (!weaknesses.trim()) {
            setError({ weaknesses: "حقل نقاط الضعف مطلوب" });
            return;
        }
        if (!opportunities.trim()) {
            setError({ opportunities: "حقل الفرص مطلوب" });
            return;
        }
        if (!threats.trim()) {
            setError({ threats: "حقل المخاطر مطلوب" });
            return;
        }
        
        setLoading(true);
        const swot = {
            strength: strength,
            weaknesses: weaknesses,
            opportunities: opportunities,
            threats: threats,
        };
        try {
            const res = await API.post(`/feasibilitystudies/updateswot`, {
                swot: swot,
                id: id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await res;
            if (data.status === 200) {
                setLoading(false);
                //here i want to go to the next page
                window.alert("تم اضافة تحليل سوات بنجاح");
                if (goNextTab) {
                    goNextTab();
                }
            }
        } catch (error) {
            setError(error.response.data.errors);
            setLoading(false);
        }
    };
    
    return (
        <>
            <Title title="إضافة نقاط القوةو الضعف" icon={<FontAwesomeIcon icon={faHandHoldingDollar} />} />
            <div className="statementofaccount">
                <div className="statementofaccountForm">
                    <div className='warrantorRow'>
                        <RegisterTextarea
                            parentStyle={{ width: "45%" }}
                            id="strength"
                            label='نقاط القوة'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={strength}
                            onChange={(e) => setStrength(e.target.value)}
                            required = {true}
                        />
                        { error && error.strength && <span className="error">{error.strength}</span>}
                        <RegisterTextarea
                            parentStyle={{ width: "45%" }}
                            id="weaknesses"
                            label='نقاط الضعف'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={weaknesses}
                            onChange={(e) => setWeaknesses(e.target.value)}
                            required = {true}
                        />
                        { error && error.weaknesses && <span className="error">{error.weaknesses}</span>}
                        <RegisterTextarea
                            parentStyle={{ width: "45%" }}
                            id="opportunities"
                            label='الفرص التي يمكن استغلالها'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={opportunities}
                            onChange={(e) => setOpportunities(e.target.value)}
                            required = {true}
                        />
                        { error && error.opportunities && <span className="error">{error.opportunities}</span>}
                        <RegisterTextarea
                            parentStyle={{ width: "45%" }}
                            id="threats"
                            label='المخاطر التي يمكن مواجهتها'
                            type="text"
                            stylee={{ width: "45%" }}
                            value={threats}
                            onChange={(e) => setThreats(e.target.value)}
                            required = {true}
                        />
                        { error && error.threats && <span className="error">{error.threats}</span>}
                    </div>
                      <div className="swotSubmitBtn">
                        <CustomButton
                            text={loading ? <Spinner animation="border" size="sm" /> : "حفظ البيانات"}
                            onClick={handleSwot}
                            stylee={{ width: "150px", height: "40px", fontSize: "16px" }}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Swot