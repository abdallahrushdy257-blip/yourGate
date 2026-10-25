import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import UploadInput from "../../components/UploadInput";
import { Form, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterRadio from "../../components/Radio";
import { useEffect, useState } from "react";
import "./createAndManage.css";
import RegisterTextarea from "../../components/RegisterTextarea";
import { useNavigate } from "react-router";
import CustomButton from "../../components/CustomButton";
import API from "../../api/axiosConfig";
import "react-datepicker/dist/react-datepicker.css";


function CreateAndManege(props) {
  const [name, setName] = useState("");
  const [isAssetsSelected, setIsAssetsSelected] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [numberOfAssets, setNumberOfAssets] = useState(0);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subOptions, setSubOptions] = useState([]);
  const [showOtherTextbox, setShowOtherTextbox] = useState(false);
  const [showOtherTextboxValue, setShowOtherTextboxValue] = useState("");
  const [document, setDocument] = useState('');
  const [postDate, setPostDate] = useState(new Date().toISOString().substr(0, 10));
  const [deedlineDate, setDeedlineDate] = useState(new Date().toISOString().substr(0, 10));
  const [benf, setBenf] = useState("");
  const [description, setDescription] = useState("");
  const [description2, setDescription2] = useState("");
  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [marketingmethod, setMarketingmethod] = useState(0);
  const [accounttree, setAccounttre] = useState('');
  const [human, setHuman] = useState([]);

  const handleRadioChange = (label) => {
    setIsAssetsSelected(label === "أسهم");
  };

  const handleTotalCostChange = (e) => {
    setTotalCost(Number(e.target.value));
  };

  const handleNumberOfAssetsChange = (e) => {
    setNumberOfAssets(Number(e.target.value));
  };

  const calculatePricePerAsset = () => {
    return numberOfAssets > 0 ? (totalCost / numberOfAssets).toFixed(2) : 0;
  };

  const getCase = async () => {
    try {
      const res = await API.post("/humancases");
      const data = await res;
      setHuman(data.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getCase();
  }, []);


  const handelSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mForm = new FormData();
    mForm.append('name', name);
    mForm.append('isAssetsSelected', isAssetsSelected);
    mForm.append('numberOfAssets', numberOfAssets);
    mForm.append('totalCost', totalCost);
    mForm.append('mainCategory', mainCategory);
    mForm.append('subCategory', subCategory);
    mForm.append('description', description);
    mForm.append('description2', description2);
    mForm.append('benf', benf);
    mForm.append('postDate', postDate);
    mForm.append('deedlineDate', deedlineDate);
    mForm.append('document', document);
    mForm.append('marketingmethod', marketingmethod);
    mForm.append('accounttree', accounttree);
    mForm.append('othertext', showOtherTextboxValue ? showOtherTextboxValue : '');
    try {
      const res = API.post("/shop/store", mForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res;
      if (data.status === 200) {
        // cahnge 1 with id
        navigate(`/casedata/${data.data.id}`);

        // navigate("/casedetails");
      } else {
        setError(data.data.errors);
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }


  };


  const handleMainCategoryChange = (e) => {
    const selectedValue = e.target.value;
    setMainCategory(selectedValue);

    if (selectedValue === "حالة اغاثة") {
      setSubOptions([
        { value: "صحية", label: "صحية" },
        { value: "طارئة ", label: "طارئة " },
        { value: "إجتماعية", label: "إجتماعية" },
      ]);
      setShowOtherTextbox(false);
    } else if (selectedValue === "حالة تنموية") {
      setSubOptions([
        { value: "دورات تدريبية", label: "دورات تدريبية" },
        { value: "دراسة", label: "دراسة" },
        { value: "إقامة مشاريع استراتيجية", label: "إقامة مشاريع استراتيجية" },
      ]);
      setShowOtherTextbox(false);
    } else if (selectedValue === "أخري") {
      setSubOptions([]);
      setShowOtherTextbox(true);
    } else {
      setSubOptions([]);
      setShowOtherTextbox(false);
    }
  };
  return (
    <>
      <Title
        title="إنشاء حالة جديدة"
        icon={<FontAwesomeIcon icon={faPenToSquare} />}
      />

      <div className="createManageCon">
        <Form onSubmit={handelSubmit} encType="multipart/form-data">
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {error && error.name && (
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
                value={mainCategory}
                onChange={handleMainCategoryChange}
                error={error.mainCategory}
              />
              {/* {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.mainCategory}</div>
              )} */}
              {subOptions.length > 0 && (
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
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  error={error.subCategory}
                />

              )}
              {/* {error && (
                  <div style={{ color: "red", fontSize: "12px" }}>{error.subCategory}</div>
                )} */}
              {showOtherTextbox && (
                <RegisterTextbox
                  id="otherCategory"
                  label="أدخل نوع الحالة"
                  type="text"
                  parentStyle={{
                    width: "90%",
                    marginBottom: "20px",
                  }}
                  value={showOtherTextboxValue}
                  onChange={(e) => setShowOtherTextboxValue(e.target.value)}
                  error={error.otherCategory}
                />
              )}
              {/* {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.subCategory}</div>
              )}
               */}
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
                  { value: '1', label: 'المانحون' },
                  { value: "2", label: "المنصات الحكومية" },
                  { value: "3", label: "متاجر الجمعيات" },
                ]}
                value={marketingmethod}
                onChange={(e) => setMarketingmethod(e.target.value)}
                error={error.marketingmethod}
              />
              {/* {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.marketingmethod}</div>
              )} */}

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
                value={accounttree}
                onChange={(e) => setAccounttre(e.target.value)}
                error={error.accounttree}
              />
              {/* {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.accounttree}</div>
              )} */}
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
                value={totalCost}
                error={error.totalCost}


              />
              {/* {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.totalCost}</div>
              )}
             */}

              <p style={{ marginBottom: "7px" }}>تاريخ النشر</p>
              <input
                type="date"
                id="date"
                onChange={(e) => setPostDate(e.target.value)}
                value={postDate}
                className="custom-datepicker"

              />
              {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.postDate}</div>
              )}

              <p style={{ marginTop: "10px" }}>تاريخ الانتهاء</p>
              <input
                type="date"
                id="date"
                onChange={(e) => setDeedlineDate(e.target.value)}
                value={deedlineDate}
                className="custom-datepicker"

              />
              {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.deedlineDate}</div>
              )}
              <RegisterSelect
                id="benf"
                label="إسم المستفيد"
                stylee={{
                  width: "45% !important",
                  marginTop: "7px",
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
                value={benf}
                onChange={(e) => setBenf(e.target.value)}
                error={error.benf}

              />
              {/* {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.benf}</div>
              )} */}
            </div>

            <div className="radiodatecon">
              <div
                onChange={(e) => handleRadioChange(e.target.value)}
                value={isAssetsSelected}
                className="radioCon"
              >
                <h5>تقسيم المبلغ إلى</h5>
                <RegisterRadio label="أسهم" value="أسهم" />
                <RegisterRadio label="قيمة" value="قيمة" />
              </div>
              {isAssetsSelected && (
                <div className="assetsCon">
                  <RegisterTextbox
                    id="numberOfAssets"
                    label="عدد الأسهم"
                    type="number"
                    onChange={handleNumberOfAssetsChange}
                    value={numberOfAssets}
                    parentStyle={{
                      width: "60%",
                      marginTop: "10px",
                    }}
                  />
                  <small style={{ display: "block", marginTop: "5px" }}>
                    سعر السهم الواحد: {calculatePricePerAsset()} ريال
                  </small>
                </div>
              )}
              <UploadInput
                id="document"
                parentStyle={{
                  marginBottom: "20px",
                  marginRight: "20px",
                  display: "unset",
                }}
                label="إرفاق صورة للحالة ان وجد"
                onChange={(e) => setDocument(e.target.files[0])}
                name="document"
              />
              {error && (
                <div style={{ color: "red", fontSize: "12px" }}>{error.document}</div>
              )}
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
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              error={error.description}
            />
            {/* {error && (

              <div style={{ color: "red", fontSize: "12px" }}>{error.description}</div>
            )} */}
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
              onChange={(e) => setDescription2(e.target.value)}
              value={description2}
              error={error.description2}
            />
            {/* {error && (
              <div style={{ color: "red", fontSize: "12px" }}>{error.description2}</div>
            )} */}


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

export default CreateAndManege;
