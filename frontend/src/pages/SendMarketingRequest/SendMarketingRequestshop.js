import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { Form , Spinner } from "react-bootstrap";
import "../SendDesignRequest/SendDesignRequest.css";
import UploadInput from "../../components/UploadInput";
import CustomButton from "../../components/CustomButton";
import { useState , useEffect } from "react";
import API from "../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import RegisterTextarea from "../../components/RegisterTextarea";
import RegisterTextbox from "../../components/RegisterTextBox";
import { BASE_URL } from "../../api/axiosConfig";

function SendMarketingRequestshop() {

  const {id} = useParams();

  const navigate = useNavigate();

  const [upload1, setUpload1] = useState(null);
  const [upload2, setUpload2] = useState(null);
  const [note, setNote] = useState("");
  const [description, setDescription] = useState("");
  const marktingType = 2;
  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(true);
 
  const [error, setError] = useState({});
  const [isSubmitting , setIsSubmitting] = useState(false);

  const [message, setMessage] = useState({});
  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mForm = new FormData();
    mForm.append("id", id);
    mForm.append("upload", upload1);
    mForm.append("upload2", upload2);
    mForm.append("note", note);
    mForm.append("description", description);
    mForm.append("type", marktingType);

    try{
      const res = await API.post("/shopdetails/store", mForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        const data = await res;
        if (data.status === 200) {
          navigate("/casedetails");
        }
      
    }catch(error){
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
      setIsSubmitting(false);
    }
   
  }
  
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
      <div className="senddesignrequest ">
        <Title
          title="ارسال طلب تسويق"
          icon={<FontAwesomeIcon icon={faBullhorn} />}
          style={{ width: "unset" }}
        />
        <Form className="global-form-container" onSubmit={handleSubmit}>
          <div className="designnrequest">
            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              id="name"
              label="إسم الحالة"
              type="text"
              stylee={{
                width: "55%",
              }}
              value={rows && rows.title}
              disabled
            />
            <div style={{width:"80%"}} className="design-filesCon">
              <div className="design-files">
                <UploadInput
                  id="documentUpload"
                  parentStyle={{
                    marginBottom: "unset",
                  }}
                  label="مرفقات"
                  onChange={(e) => setUpload1(e.target.files[0])}
                />
                { error && error.upload && (
                  <div className="error">{error.upload}</div>
                )}
              </div>

              <div className="design-files">
                <UploadInput
                  id="documentUpload2"
                  parentStyle={{
                    marginBottom: "unset",
                  }}
                  label="صور"
                  onChange={(e) => setUpload2(e.target.files[0])}
                />
                { error && error.upload2 && (
                  <div className="error">{error.upload2}</div>
                )}
              </div>
              </div>
              <RegisterTextarea
              label="متطلبات التسويق"
              stylee={{ width: "100%" }}
              parentStyle={{
                width: "80%",
                marginBottom: "20px",
              }}
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
            { error && error.description && (
              <div className="error">{error.description}</div>
            )}
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
            />
            <a href={`${BASE_URL}/download/marketingcontract`} target="_blank" className="btn btn-link">تحميل العقد</a>
            { error && error.note && (
              <div className="error">{error.note}</div>
            )}
            <span style={{ color:"red", padding:"5px" }} >* سيتم التواصل معكم من خلال خدمة العملاء في خلال 48 ساعة</span>


           { isSubmitting ? <Spinner animation="border" variant="primary" /> : <CustomButton text="إرسال" />}
          </div>
        </Form>
      </div>
    </>
  );
}

export default SendMarketingRequestshop;
