import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Form , Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterRadio from "../../components/Radio";
import { useState , useEffect } from "react";
import "./createAndManage.css";
import RegisterTextarea from "../../components/RegisterTextarea";
import { useNavigate , useParams } from "react-router";
import CustomButton from "../../components/CustomButton";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
function Editcasedetails() {
  const [isAssetsSelected, setIsAssetsSelected] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [numberOfAssets, setNumberOfAssets] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting , setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [subCategory , setSubCategory] = useState("");
  const [marketingmethod , setMarketingmethod] = useState("");
  const [ postDate , setPostDate] = useState("");
  const [deedlineDate , setDeedlineDate] = useState("");
  const [benf , setBenf] = useState("");
  const [description , setDescription] = useState("");
  const [description2 , setDescription2] = useState("");
  const [error , setError] = useState([]);
  const [message , setMessage] = useState([]);
  const handleRadioChange = (label) => {
    setIsAssetsSelected(label === "أسهم");
  };

  const handleTotalCostChange = (e) => {
    setRows({...rows , total : Number(e.target.value)});
  };

  const handleNumberOfAssetsChange = (e) => {
    setNumberOfAssets(Number(e.target.value));
  };

  const calculatePricePerAsset = () => {
    return numberOfAssets > 0 ? (totalCost / numberOfAssets).toFixed(2) : 0;
  };

  const handelSubmit = async(e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", rows.title);
    formData.append("casetype", rows.casetype);
    formData.append("subcasetype", rows.subcasetype);
    formData.append("showOtherTextbox", rows.showOtherTextbox);
    formData.append("marketingmethod", rows.marketingmethod);
    formData.append("total", rows.total);
    formData.append("dateoflaunch", rows.dateoflaunch);
    formData.append("dateofcompletion", rows.dateofcompletion);
    formData.append("benf", rows.human_cases_id);
    formData.append("description", rows.description);
    formData.append("description2", rows.description2);
    formData.append("id", id);
    try{
      const res = await API.post("/shop/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res.data;
      navigate("/casedetails");

    }catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setError(error.response.data.errors || {});
        setMessage(error.response.data.message || "حدث خطأ أثناء التحديث");
      } else {
        setMessage("حدث خطأ غير متوقع");
      }
    }
  };

  const [mainCategory, setMainCategory] = useState("");
  const [subOptions, setSubOptions] = useState([]);
  const [showOtherTextbox, setShowOtherTextbox] = useState(false);


  const [human, setHuman] = useState([]);
  const getHuman = async () => {
    try {
      const res = await API.post("/humancases");
      const data = await res.data;
      if (data.status === 200) {
        setHuman(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getCase = async () => {
    try {
      const res = await API.get(`/shop/${id}/view`);
      const data = await res;
      if (data.status === 200) {
        setRows(data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getHuman();
    getCase();
  }, []);

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
  const [day, month, year] = dateStr.split("-");
  if (!day || !month || !year) return "";
  return `${year}-${month}-${day}`; // yyyy-MM-dd
};
 
  return (
    loading ? <><TestPreLoader /> </> :
    <>
      <Title
        title={`تعديل - ${rows.title}`}
        icon={<FontAwesomeIcon icon={faPenToSquare} />}
      />
      {message && <div style={{ color: "red", fontSize: "12px" }}>{message}</div>}
      <div className="createManageCon">
        <Form className="global-form-container" onSubmit={handelSubmit} encType="multipart/form-data">
          <div className="createManege-inputs">
            <div className="case-name">
              <RegisterTextbox
                parentStyle={{
                  width: "90%",
                }}
                id="name"
                label="مسمي الحالة"
                type="text"
                stylee={{
                  width: "45%",
                }}
                value={rows.title}
                onChange={(e) => setRows({...rows , title : e.target.value})}
              />
              {error && error.name &&(
                <div style={{ color: "red", fontSize: "12px" }}>
                  {error.name}
                </div>
              )}
              <RegisterSelect
                id="location"
                label="نوع الحالة"
                stylee={{
                  width: "45% !important",
                }}
                parentStyle={{
                  width: "90%",
                  marginBottom: "20px",
                }}
                options={[
                  { value: "", label: "إختر الحالة" },
                  { value: "حالة اغاثة", label: "حالة اغاثة" },
                  { value: "حالة تنموية", label: "حالة تنموية" },
                  { value: "أخري", label: "أخري" },
                ]}
                value={rows.casetype}
                onChange={(e) => setRows({...rows , casetype : e.target.value})}
              />
              {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.mainCategory}</div>
              )}
             
                <RegisterSelect
                  id="subCategory"
                  label="نوع الحالة الفرعية"
                  stylee={{
                    width: "45% !important",
                  }}
                  parentStyle={{
                    width: "90%",
                    marginBottom: "20px",
                  }}
                  options={[
                    { value: "", label: "اختر الحالة الفرعية" },
                    ...subOptions,
                  ]}
                  value={rows.subcasetype}
                  onChange={(e) => setRows({...rows , subcasetype : e.target.value})} //setSubCategory(e.target.value)}
                />
               
            
               {error && (
                  <div style={{ color: "red", fontSize: "12px" }}>{error.subCategory}</div>
                )}
            
                <RegisterTextbox
                  id="otherCategory"
                  label="أدخل نوع الحالة"
                  placeholder=" أدخل نوع الحالة ان وجد"
                  type="text"
                  parentStyle={{
                    width: "90%",
                    marginBottom: "20px",
                  }}
                  value={rows.showOtherTextbox}
                  onChange={(e) => setRows({...rows , showOtherTextbox : e.target.value})} //setSubCategory(e.target.value)}
                />
            
              {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.subCategory}</div>
              )}
              
              <RegisterSelect
                id="mecanism"
                label="آلية التسويق"
                stylee={{
                  width: "45% !important",
                }}
                parentStyle={{
                  width: "90%",
                  marginBottom: "20px",
                }}
                options={[
                  { value: "0", label: "إختر الآلية" },
                  { value: '1', label: 'المناحين' },
                  { value: "2", label: "المنصات الحكومية" },
                  { value: "3", label: "متاجر الجمعيات" },
                ]}
                value={rows.marketingmethod}
                onChange={(e) => setRows({...rows , marketingmethod : e.target.value})} //setSubCategory(e.target.value)}
              />
              {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.marketingmethod}</div>
              )}
               
            </div>
            <div className="case-name">
              <RegisterTextbox
                parentStyle={{
                  width: "90%",
                }}
                id="totalCost"
                label="مبلغ الدعم الكلي"
                type="number"
                onChange={handleTotalCostChange}
                stylee={{
                  width: "30%",
                }}
                value={rows.total}

              />
              {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.totalCost}</div>
              )}
            
             <div className="mb-3">

              <p style={{marginBottom:"8px"}}>تاريخ النشر</p>
              <input
                type="date"
                id="date"
                onChange={(e) => setRows({...rows , dateoflaunch : e.target.value})} //setPostDate  (e.target.value)}
                value={formatDateForInput(rows.dateoflaunch)}
                className="custom-datepicker"
                />
                {error && (
                  <div style={{ color: "red", fontSize: "12px" }}>{error.postDate}</div>
                )}
                </div>
             <div className="mb-3">
               <p style={{marginBottom:"8px"}}>تاريخ الانتهاء</p>
              <input
                type="date"
                id="date"
                onChange={(e) => setRows({...rows , dateofcompletion : e.target.value})} //setPostDate  (e.target.value)}
                value={formatDateForInput(rows.dateofcompletion)}
                className="custom-datepicker"

              />
              {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.deedlineDate}</div>
              )}
              </div>
              <RegisterSelect
                id="benf"
                label="إسم المستفيد"
                stylee={{
                  width: "45% !important",
                }}
                parentStyle={{
                  width: "90%",
                  marginBottom: "20px",
                }}
                  options={[
                  { value: "", label: "إختر المستفيد" },
                  { value: "0", label: "لا يوجد مستفيد" },
                  ...human.map((item) => ({
                    value: item.id,
                    label: item.name,
                  })),
                ]}
                value={rows.human_cases_id == null ? "0" : rows.human_cases_id}
                onChange={(e) => setRows({...rows , human_cases_id : e.target.value})} //setSubCategory(e.target.value)}
              />
              {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.benf}</div>
              )}
              <div className="mb-3">
              <RegisterSelect
                id="mecanism"
                label="حساب ترحيل الحالة"
                stylee={{
                  width: "45% !important",
                }}
                parentStyle={{
                  width: "90%",
                  marginBottom: "20px",
                }}
                options={[
                  { value: "0", label: "إختر الحساب" },
                  { value: '9e5000ef-9e80-4388-b368-0b6f3e6710f6', label: 'تبرعات وهبات مقيدة – نقدية' },
                  { value: "9e5000f3-4d41-4579-8d16-123c5dcaacca", label: "تبرعات وهبات غير مقيدة – نقدية " },
                ]}
                value={rows.accounttree}
                onChange={(e) => setRows({...rows , accounttree : e.target.value})} //setSubCategory(e.target.value)}
              />
              {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.accounttree}</div>
              )}
              </div>
            </div>
          </div>

          <div className="createManege-inputs createManege-desc">
            <RegisterTextarea
              id="description"
              label="وصف الحالة"
              parentStyle={{
                width: "35%",
                marginBottom: "20px",
              }}
              stylee={{
                height: "100px",
              }}
              rows={5}
              placeholder="البيانات التي تظهر في كارت الحالة"
              onChange={(e) => setRows({...rows , description : e.target.value})} //setSubCategory(e.target.value)}
              value={rows.description}
            />
              {error && (

                <div style={{ color: "red", fontSize: "12px" }}>{error.description}</div>
              )}
            <RegisterTextarea
              id="description2"
              label="تكملة الوصف (لا تظهر في كارت الحالة)"
              parentStyle={{
                width: "40%",
                marginBottom: "20px",
              }}
              stylee={{
                height: "100px",
              }}
              rows={5}
              placeholder="البيانات التي لا تظهر في كارت الحالة"
              onChange={(e) => setRows({...rows , description2 : e.target.value})} //setSubCategory (e.target.value)}
              value={rows.description2}
            />
              {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.description2}</div>
              )}


          </div>

          {
            isSubmitting ? 
            <Spinner animation="border" variant="primary" style={{ display: "block" , margin: "auto"}}/>
           :
            <div className="createManege-inputs createManege-buttonCon ">
            <CustomButton text="تعديل الحالة" />
          </div>
          }
        </Form>
      </div>
    </>
  );
}

export default Editcasedetails;
