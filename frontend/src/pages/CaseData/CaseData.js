import Title from "../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "./CaseDate.css";
import RegisterTextarea from "../../components/RegisterTextarea";
import RegisterTextbox from "../../components/RegisterTextBox";
import UploadInput from "../../components/UploadInput";
import { Form } from "react-bootstrap";
import CustomButton from "../../components/CustomButton";
import API from "../../api/axiosConfig";
import { useState , useEffect , useRef } from "react";
import { useNavigate , useParams } from "react-router-dom";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import caseimage from '../../case.png'
import { color } from "highcharts";

const CaseData = (props) => {

  const [rows , setRows] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);
  const currentUrl = window.location.href;

  const getCase = async () => {
    try {
      const res = API.get(`/shop/${id}/view`);
      const data = await res;
      console.log(data.data);
      if (data.status === 200) {
        setRows(data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  useEffect(() => {
    getCase()
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert("تم نسخ الرابط بنجاح");
    }).catch(err => console.error("Failed to copy:", err));
  };

  const adbyus = async (e) => {
    e.preventDefault();
    const mForm = new FormData();
    mForm.append("id", id);
    try {
      const res = await API.post(`/ads/shop/store` , mForm);
      const data = await res;
      if (data.status === 200) {
        alert("تم ارسال الاعلان بنجاح");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const goback = () => {
    navigate('/casedetails');
  };
  return (
    loading ? <TestPreLoader /> :
    <div style={{height:"97dvh",width:"100%",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
  <div className="case-card">
    {/* صورة الحالة */}
    <div className="case-card-image">
      <img src={caseimage} alt="حالة" />
    </div>

    {/* بيانات الحالة */}
    <div className="case-card-info">
      <Title 
      className="case-title"
        title={rows?.title || "عنوان الحالة"}
        icon={<FontAwesomeIcon icon={faPenToSquare} />}
      />

      <div className="case-fields">
        <RegisterTextarea
          id="completedescription"
          label="مسمي الحالة"
          disabled
          value={rows?.title}
        />
        <RegisterTextarea
          id="casetype"
          label="نوع الحالة"
          disabled
          value={rows?.casetype}
        />
        <RegisterTextarea
          id="casedesc"
          label="وصف الحالة"
          disabled
          value={rows?.description}
        />
        <RegisterTextarea
          id="totalbudget"
          label="مبلغ الدعم الكلي"
          disabled
          value={rows?.total}
        />
        <RegisterTextbox
          id="chname"
          label="اسم الجمعية"
          type="text"
          disabled
          value={rows?.organization?.name}
        />
        <RegisterTextbox
          id="bankname"
          label="وصف إضافي"
          type="text"
          disabled
          value={rows?.description2}
        />
      </div>

    </div>
  </div>
      {/* أزرار الكارت */}
      <div className="case-card-buttons">
        <CustomButton text="نسخ رابط الحالة" onClick={copyToClipboard} />
        <CustomButton text="الإعلان بواسطتنا" onClick={adbyus} />
        <CustomButton text="ذهاب الى صفحة الحالة" onClick={goback} />
      </div>
</div>

  );
};

export default CaseData;
