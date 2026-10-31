import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";
import { Form , Spinner } from "react-bootstrap";
import RegisterTextarea from "../../components/RegisterTextarea";
import RegisterTextbox from "../../components/RegisterTextBox";
import "./SendDesignRequest";
import UploadInput from "../../components/UploadInput";
import CustomButton from "../../components/CustomButton";
import { useNavigate , useParams } from "react-router-dom";
import { useState , useEffect } from "react";
import API from "../../api/axiosConfig";



function SendDesignRequestshop() {

  const { id } = useParams();
const navigate = useNavigate();
const [error, setError] = useState({});
const [loading, setLoading] = useState(true);
const [rows, setRows] = useState([]);
  const [message, setMessage] = useState({});
  const [upload1 , setUpload1] = useState('');
  const [upload2 , setUpload2] = useState('');
  const [note , setNote] = useState("");
  const [description , setDescription] = useState("");
  const [isSubmitting , setIsSubmitting] = useState(false);
  const designType = 1;
  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mForm = new FormData();
    mForm.append("id", id);
    mForm.append("upload", upload1);
    mForm.append("upload2", upload2);
    mForm.append("note", note);
    mForm.append("description", description);
    mForm.append("type", designType);
    try {
      const res = await API.post("/shopdetails/store", mForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res;
      if (data.status === 200) {
      
        navigate("/casedetails");
        
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  };

  const getShop = async () => {
    try {
      const response = await API.get(`/shop/${id}/view`);
      const data = await response;
      setRows(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  };

   useEffect(() => {
      getShop();
    }, []);
  return (
    <>
      <div className="senddesignrequest">
        <Title
          title="ارسال طلب تصميم"
          icon={<FontAwesomeIcon icon={faEnvelopeOpenText} />}
          style={{ width: "unset" }}
        />
        <Form className="global-form-container" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="designnrequest">
            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              id="name"
              label="إسم الحالة"
              type="text"
              style={{
                width: "80%",
              }}
              value={rows && rows.title}
              disabled
            />
            <div className="design-filesCon" style={{width:"80%"}}>
              <div>
                <UploadInput
                  id="documentUpload"
                  parentStyle={{
                    marginBottom: "unset",
                  }}
                  label="مرفقات"
                onChange={(e) => setUpload1(e.target.files[0])}
                value={upload1}
                />
                {error && error.upload && (
                  <div className="error">{error.upload}</div>
                )}
              </div>

              <div>
                <UploadInput
                  id="documentUpload2"
                  parentStyle={{
                    marginBottom: "unset",
                  }}
                  label="صور"
                  onChange={(e) => setUpload2(e.target.files[0])}
                  value={upload2}
                />
                 {error && error.upload2 && (
                  <div className="error">{error.upload2}</div>
                )}
              </div>
            </div>
            <div style={{width:"calc(100% - 30px)",marginTop:"20px",display:"flex",alignItems:"center",gap:"10px", justifyContent:"space-between"}}>
            
            <RegisterTextarea
              label="متطلبات التصميم"
              stylee={{ width: "100%" }}
              parentStyle={{
                width: "80%",
                marginBottom: "20px",
              }}
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              error={error.description}
            />
            {/* { error && error.description && (
              <div className="error">{error.description}</div>
            )} */}
            <RegisterTextarea
              label="نظره عامة عن المشروع"
              stylee={{ width: "100%" }}
              parentStyle={{
                width: "80%",
                marginBottom: "20px",
              }}
              name="note"
              onChange={(e) => setNote(e.target.value)}
              value={note}
              error={error.note}

            />
            </div>
            {/* { error && error.note && (
              <div className="error">{error.note}</div>
            )} */}
            <span style={{ color:"red", padding:"5px" }} >* سيتم إرسال التصميمات اليكم في خلال 48 ساعة</span>

            {
              isSubmitting ? <Spinner animation="border" variant="primary" /> :
              <CustomButton text="إرسال" />
            }
           
          </div>
        </Form>
      </div>
    </>
  );
}

export default SendDesignRequestshop;
