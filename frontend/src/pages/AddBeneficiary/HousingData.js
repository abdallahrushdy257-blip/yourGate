import React, { useState , useEffect } from 'react';
import '../CreateLoan/createLoan.css'
import RegisterTextbox from '../../components/RegisterTextBox';
import Title from '../../components/title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faPeopleRoof, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import './addBeneficiary.css'
import RegisterSelect from '../../components/RegisterSelect';
import UploadInput from '../../components/UploadInput';
import RegisterRadio from '../../components/Radio';
import { useNavigate, useParams } from 'react-router';
import API from '../../api/axiosConfig';
import { Spinner } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import CustomButton from '../../components/CustomButton'


function HousingData(props) {
    const [key, setKey] = useState('tab1'); 
    const navigate = useNavigate();
    const params = useParams();
    const id = props?.id || params?.id;
    const [housingExpenses, setHousingExpenses] = useState([{ id: 1 }]);
    const [homestate , setHomeState] = useState('')
    const [village , setVillage] = useState('')
    const [nationalAdress , setNationalAdress] = useState('')
    const [summaryAdress , setSummaryAdress] = useState('')
    const [homeType , setHomeType] = useState('')
    const [homeOwnership , setHomeOwnership] = useState('')
    const [rent , setRent] = useState('')   
    const [cars , setCars] = useState('')
    const [ lands , setLands] = useState('')
    const [ components , setComponents] = useState('')
    const [furniture , setFurniture] = useState('')
    const [cost , setCost] = useState('')
    const [ bill , setBill] = useState([])
    const [ amount , setAmount] = useState([])
    const [upload1 , setUpload1] = useState('')
    const [upload2 , setUpload2] = useState('')
    const [error , setError] = useState('')
    const [isSubmitting , setIsSubmitting] = useState(false)
    const [showMinus, setShowMinus] = useState(false);
    const [rows, setRows] = useState([]);

    const addBill = () => {
        setBill([...bill, ""]); // Add a new empty input
        setAmount([...amount, ""]); // Add a new empty input
      };
    
      // Function to handle changes in input fields
      const handleBillChange = (index, value) => {
        const newInputs = [...bill];
        newInputs[index] = value; // Update the correct input field
        setBill(newInputs);
      };

      const handleAmountChange = (index, value) => {
        const newInputs = [...amount];
        newInputs[index] = value; // Update the correct input field
        setAmount(newInputs);
      };

      const mergeItems = (bill, amount) => {
        var newItem = [];
        bill.map((item, index) => (
          newItem.push({
            bill: item,
            amount: amount[index],
          })
        ));
        return newItem;
      };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('state' , rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails.state ? rows.details.personalfeesdetails.state : homestate);
        formData.append('village' , rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails.village ? rows.details.personalfeesdetails.village : village);
        formData.append('nationalAdress' , rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails.nationalAdress ? rows.details.personalfeesdetails.nationalAdress : nationalAdress);
        formData.append('summaryAdress' , rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails.summaryAdress ? rows.details.personalfeesdetails.summaryAdress : summaryAdress);
        formData.append('homeType' , rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails.homeType ? rows.details.personalfeesdetails.homeType : homeType);
        formData.append('homeOwnership' , rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails.homeOwnership ? rows.details.personalfeesdetails.homeOwnership : homeOwnership);
        formData.append('rent' , rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails.rent ? rows.details.personalfeesdetails.rent : rent);
        formData.append('cars' , rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails.cars ? rows.details.personalfeesdetails.cars : cars);
        formData.append('lands' , rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails.lands ? rows.details.personalfeesdetails.lands : lands);
        formData.append('components' , rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails.components ? rows.details.personalfeesdetails.components : components);
        formData.append('furniture' , rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails.furniture ? rows.details.personalfeesdetails.furniture : furniture);
        formData.append('cost' , rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails.cost ? rows.details.personalfeesdetails.cost : cost);
        formData.append('bill' , JSON.stringify(mergeItems(bill , amount).slice(1, bill.length)));
        formData.append('id' , id);
        // formData.append('upload1' , upload1);
        // formData.append('upload2' , upload2);
        formData.append('personalfeesdetails_upload1' , upload1);
        formData.append('personalfeesdetails_upload2' , upload2);
        console.log(upload1, upload2);
        if (!upload1 && !upload2) {
  alert("من فضلك اختر الصور أولاً");
  return;
}

        try{
            const res = await API.post('/humancasedetails/update/personalfees' , formData , {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // const data = await res;
            const data =  res;
            // if(data.status === 200){
            if(res.status === 200){
                if (props?.onClose) {
                    props.onClose();
                } else {
                    navigate('/beneficiary');
                }
            }
        }catch(error){
            console.error(error);
            setError(error.response.data.errors);
            setIsSubmitting(false);
        }
    };

    const handleAddHousingExpense = () => {
        setHousingExpenses([...housingExpenses, { id: housingExpenses.length + 1 }]);
       addBill();
       setShowMinus(true);
    };

    const handleMinusHousingExpense = () => {
        setHousingExpenses(housingExpenses.slice(0, -1));
        setBill(bill.slice(0, -1));
        setAmount(amount.slice(0, -1));
        if (housingExpenses.length === 2){

            setShowMinus(false);
        }
    };

    const handleTabChange = (selectedKey) => {
        setKey(selectedKey);
    };

    const handleNext = () => {
        if (key === 'tab1') {
            setKey('tab2');
        } else if (key === 'tab2') {
            setKey('tab3');
        }
    };

    const handleBack = () => {
        if (key === 'tab3') {
            setKey('tab2');
        } else if (key === 'tab2') {
            setKey('tab1');
        }
    };

     const getHouseDetails = async () => {
        try {
            const res = await API.get(`/humancasedetails/get/${id}`);
            const data = await res;
            if (data.status === 200) {
                setRows(data.data);
            }
        } catch (error) {
            console.error(error);
            setError(error.response.data.errors);
        }
    }

    useEffect(() => {
        getHouseDetails();
    }, []);

    return (
        <>
            <div className='AddBeneficiary'>
                            <Title
                                title="بيانات السكن"
                                icon={<FontAwesomeIcon icon={faPeopleRoof} />}
                            />
                            <Form className="housing-form-container" onSubmit={handleSubmit}>
                            <div className='AddBeneficiaryContainerRow housingData '>
                                <RegisterTextbox
                                    parentStyle={{
                                        width: "30%",
                                    }}
                                    id="state"
                                    label="القطاع (المحافظة)"
                                    type="text"
                                    stylee={{
                                        width: "55%",
                                    }}
                                    name="state"
                                    onChange={(e) => setRows({ ...rows, details: { ...rows.details, personalfeesdetails: { ...rows.details.personalfeesdetails, state: e.target.value } } })}
                                    value={rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails ? rows.details.personalfeesdetails.state : ''}
                                />
                                <RegisterTextbox
                                    parentStyle={{
                                        width: "30%",
                                    }}
                                    id="village"
                                    label="القرية (الحي)"
                                    type="text"
                                    stylee={{
                                        width: "55%",
                                    }}
                                    name="village"
                                    onChange={(e) => setRows({ ...rows, details: { ...rows.details, personalfeesdetails: { ...rows.details.personalfeesdetails, village: e.target.value } } }) || setVillage(e.target.value)}
                                    value={rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails ? rows.details.personalfeesdetails.village : ''}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {error && error.state && <p className="error">{error.state}</p>}
                                {error && error.village && <p className="error">{error.village}</p>}
                            </div>
                            <div className='AddBeneficiaryContainerRow housingData'>
                                <RegisterTextbox
                                    parentStyle={{
                                        width: "30%",
                                    }}
                                    id="nationalAdress"
                                    label="العنوان الوطني"
                                    type="text"
                                    stylee={{
                                        width: "55%",
                                    }}
                                    name="nationalAdress"
                                    onChange={(e) => setRows({ ...rows, details: { ...rows.details, personalfeesdetails: { ...rows.details.personalfeesdetails, nationalAdress: e.target.value } } }) || setNationalAdress(e.target.value)}
                                    value={rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails ? rows.details.personalfeesdetails.nationalAdress : ''}
                                />
                                <RegisterTextbox
                                    parentStyle={{
                                        width: "30%",
                                    }}
                                    id="summaryadress"
                                    label="العنوان المختصر"
                                    type="text"
                                    stylee={{
                                        width: "55%",
                                    }}
                                    name="summaryAdress"
                                    onChange={(e) => setRows({ ...rows, details: { ...rows.details, personalfeesdetails: { ...rows.details.personalfeesdetails, summaryAdress: e.target.value } } }) || setSummaryAdress(e.target.value)}
                                    value={rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails ? rows.details.personalfeesdetails.summaryAdress : ''}
                                />
                            </div>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {error && error.nationalAdress && <p className="error">{error.nationalAdress}</p>}
                                {error && error.summaryAdress && <p className="error">{error.summaryAdress}</p>}
                            </div>
                            <div className="AddBeneficiaryContainerRow housingData">
                                <RegisterSelect
                                    id="hometype"
                                    label="نوع السكن"
                                    stylee={{ width: "30%" }}
                                    parentStyle={{ width: "30%", marginBottom: "20px" }}
                                    options={[
                                        { value: "", label: "اختر النوع" },
                                        { value: "0", label: "تمليك" },
                                        { value: "1", label: "إيجار" },
                                    ]}
                                    onChange={(e) => setRows({ ...rows, details: { ...rows.details, personalfeesdetails: { ...rows.details.personalfeesdetails, homeType: e.target.value } } }) || setHomeType(e.target.value)}
                                    value={rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails ? rows.details.personalfeesdetails.homeType : ''}
                                    name="homeType"
                                />
                                {error && error.homeType && <p className="error">{error.homeType}</p>}
                                <RegisterTextbox
                                    parentStyle={{
                                        width: '30%',
                                    }}
                                    id="ownership"
                                    label="ملكية السكن"
                                    type="text"
                                    stylee={{
                                        width: '55%',
                                    }}
                                    name="homeOwnership"
                                    onChange={(e) => setRows({ ...rows, details: { ...rows.details, personalfeesdetails: { ...rows.details.personalfeesdetails, homeOwnership: e.target.value } } }) || setHomeOwnership(e.target.value)}
                                    value={rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails ? rows.details.personalfeesdetails.homeOwnership : ''}
                                />
                                {error && error.homeOwnership && <p className="error">{error.homeOwnership}</p>}
                            </div>
                            <div className="AddBeneficiaryContainerRow housingData">
                                <RegisterTextbox
                                    parentStyle={{
                                        width: '30%',
                                    }}
                                    id="month"
                                    label="الإيجار الشهري للسكن"
                                    type="number"
                                    stylee={{
                                        width: '55%',
                                    }}
                                    name="rent"
                                    onChange={(e) => setRows({ ...rows, details: { ...rows.details, personalfeesdetails: { ...rows.details.personalfeesdetails, rent: e.target.value } } }) || setRent(e.target.value)}
                                    value={rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails ? rows.details.personalfeesdetails.rent : ''}
                                />
                                {error && error.rent && <p className="error">{error.rent}</p>}
                                <RegisterTextbox
                                    parentStyle={{
                                        width: '30%',
                                    }}
                                    id="cars"
                                    label="عدد السيارات المملوكة"
                                    type="number"
                                    stylee={{
                                        width: '55%',
                                    }}
                                    name="cars"
                                    onChange={(e) => setRows({ ...rows, details: { ...rows.details, personalfeesdetails: { ...rows.details.personalfeesdetails, cars: e.target.value } } }) || setCars(e.target.value)}
                                    value={rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails ? rows.details.personalfeesdetails.cars : ''}
                                />
                                {error && error.cars && <p className="error">{error.cars}</p>}
                            </div>

                            <div className="AddBeneficiaryContainerRow housingData">
                                <RegisterTextbox
                                    parentStyle={{
                                        width: '30%',
                                    }}
                                    id="lands"
                                    label="عدد الأراضي المملوكة"
                                    type="number"
                                    stylee={{
                                        width: '55%',
                                    }}
                                    name="lands"
                                    onChange={(e) => setRows({ ...rows, details: { ...rows.details, personalfeesdetails: { ...rows.details.personalfeesdetails, lands: e.target.value } } }) || setLands(e.target.value)}
                                    value={rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails ? rows.details.personalfeesdetails.lands : ''}
                                />
                                {error && error.lands && <p className="error">{error.lands}</p>}
                                <RegisterTextbox
                                    parentStyle={{
                                        width: '30%',
                                    }}
                                    id="components"
                                    label="مكونات السكن"
                                    type="text"
                                    stylee={{
                                        width: '55%',
                                    }}
                                    name="components"
                                    onChange={(e) => setRows({ ...rows, details: { ...rows.details, personalfeesdetails: { ...rows.details.personalfeesdetails, components: e.target.value } } }) || setComponents(e.target.value)}
                                    value={rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails ? rows.details.personalfeesdetails.components : ''}
                                />
                                {error && error.components && <p className="error">{error.components}</p>}
                            </div>
                            <div className="AddBeneficiaryContainerRow housingData">
                                <RegisterTextbox
                                    parentStyle={{
                                        width: '30%',
                                    }}
                                    id="furniture"
                                    label="مكونات الاثاث"
                                    type="text"
                                    stylee={{
                                        width: '55%',
                                    }}
                                    name="furniture"
                                    onChange={(e) => setRows({ ...rows, details: { ...rows.details, personalfeesdetails: { ...rows.details.personalfeesdetails, furniture: e.target.value } } }) || setFurniture(e.target.value)}
                                    value={rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails ? rows.details.personalfeesdetails.furniture : ''}
                                />
                                {error && error.furniture && <p className="error">{error.furniture}</p>}
                                <RegisterTextbox
                                    parentStyle={{
                                        width: '30%',
                                    }}
                                    id="personperMonth"
                                    label="تكاليف الشهر للفرد"
                                    type="text"
                                    stylee={{
                                        width: '55%',
                                    }}
                                    name="cost"
                                    onChange={(e) => setRows({ ...rows, details: { ...rows.details, personalfeesdetails: { ...rows.details.personalfeesdetails, cost: e.target.value } } }) || setCost(e.target.value)}
                                    value={rows.details && rows.details.personalfeesdetails && rows.details.personalfeesdetails ? rows.details.personalfeesdetails.cost : ''}
                                />
                            </div>
                            <div className='direc'>
                                <div className='housing-title-section'>
                                    <h5>
                                        مصروفات السكن
                                        <span className='addillness addillness2' onClick={handleAddHousingExpense} style={{ marginLeft: '15px' , color: 'var(--accent-color)' , cursor: 'pointer' , borderRadius: '50%' , border: '1px solid var(--accent-color)' , padding: '5px 10px' }}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </span>
                                        {
                                            showMinus && (
                                                <span className='addillness' onClick={handleMinusHousingExpense} style={{ marginLeft: '10px' , color: 'red' , cursor: 'pointer' , borderRadius: '50%' }}>
                                                    <FontAwesomeIcon icon={faMinus} />
                                                </span>
                                            )
                                        }
                                    </h5>
                                </div>

                                {housingExpenses.map((index , value) => (
                                    <div key={index.id} className='housing-expense-row'>
                                        <RegisterTextbox
                                            parentStyle={{
                                                width: "30%",
                                            }}
                                            id={`monthly-bill-${index.id}`}
                                            label="الفاتورة الشهرية"
                                            type="text"
                                            stylee={{
                                                width: "55%",
                                            }}
                                            name="bill"
                                            onChange={(e => 
                                                handleBillChange(index.id, e.target.value)
                                            )}
                                        />
                                        <RegisterTextbox
                                            parentStyle={{
                                                width: "30%",
                                            }}
                                            id={`value-${index.id}`}
                                            label="القيمة"
                                            type="number"
                                            stylee={{
                                                width: "55%",
                                            }}
                                            name="amount"
                                            //value={bill}
                                            onChange={(e => 
                                                handleAmountChange(index.id, e.target.value)
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="AddBeneficiaryContainerRow housingData">
                                <UploadInput
                                    id="invoice"
                                    parentStyle={{
                                        marginBottom: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                    label="صورة فاتورة الكهرباء "
                                    onChange={(e) => setUpload1(e.target.files[0])}
                                    value={upload1}
                                />
                                <UploadInput
                                    id="chieftain"
                                    parentStyle={{
                                        marginBottom: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                    label="صورة الملكية "
                                    onChange={(e) => setUpload2(e.target.files[0])}
                                    value={upload2}
                                />
                            </div>

                            <div className='AddBeneficiaryContainerRow housingData'>
                    { isSubmitting ? <Spinner animation="border" variant="primary" /> :
                        <CustomButton text="حفظ" />
                    }
                    </div>
                        </Form>
                        </div>

        </>
    );
}

export default HousingData;
