import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Title from "../../components/title"
import { faUserSecret } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import API from "../../api/axiosConfig"
import './Verify.css'
function Verify() {
    const {id} = useParams();
const navigate = useNavigate();
const [loading, setLoading] = useState(true);
const [error, setError] = useState({});

const getVerify = async () => {
  try {
    const res = API.get(`/${id}/verify`);
    const data = await res;
    if (data.status === 200) {
      setLoading(false);
      navigate("/login");
    }
  } catch (error) {
    setError(error.response.data.message);
  }
}

useEffect(() => {
  getVerify();
}, []);
    return (
        <>
            <div className="verfiy">
                <Title
                    title="يتم تفعيل الحساب"
                    className="marketingtitle"
                    icon={<FontAwesomeIcon icon={faUserSecret} />}
                />
                {/* {error && <div className="error">{error}</div>} */}
                <div className="spinnerContainer">
                    <div className="spinner"></div>
                </div>
                <div className="waitSpinner">... إنتظر</div>
            </div>
        </>
    )
}

export default Verify