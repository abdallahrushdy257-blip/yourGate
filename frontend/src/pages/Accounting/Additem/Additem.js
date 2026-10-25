import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import SelectComponent from "../../../components/SelectComponent";
import RegisterTextbox from "../../../components/RegisterTextBox";
import "./additem.css";
import { Form } from "react-bootstrap";
import { useState } from "react";
import CustomButton from "../../../components/CustomButton";
import API from "../../../api/axiosConfig";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Additem() {
  const [illnesses, setIllnesses] = useState([{ id: 1 }]);
  const [hasExpiryDate, setHasExpiryDate] = useState(false);
  const [secondTableRows, setSecondTableRows] = useState([{ id: 1 }]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [itemcategry, setItemCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantitiy] = useState(0);
  const [barcode, setBarcode] = useState('');
  const [error , setError] = useState([]);
  const [stores, setStores] = useState([]);
  const [store, setStore] = useState('');
  const [code , setCode] = useState(Math.floor(Math.random() * 1000000)); // Random code for demonstration

  const [wholesale, setWholesale] = useState(['']);
  const [retail, setRetail] = useState(['']);
 
  const [purchase, setPurchase] = useState(['']);
  const [storequantity, setStoreQuantity] = useState(['']);
  const [storeuint, setStoreUint] = useState(['']);
  const [substoreuint, setSubStoreUint] = useState(['']);
  const [storewh, setStoreWh] = useState(['']);
  const [productdate , setProductdate] = useState(new Date().toISOString().substr(0, 10));
  const [expiredate , setExpiredate] = useState(new Date().toISOString().substr(0, 10));
  const navigate = useNavigate();
  const [mainunit, setMainunit] = useState(['']);
  const [contain , setContain] = useState(['']);

  const handleAddIllness = () => {
    setIllnesses((prevIllnesses) => [
      ...prevIllnesses,
      {
        id: prevIllnesses.length + 1,
        barcode: "",
        total_quantity: 0,
        purchase_price: 0,
        retail_selling_price: 0,
        wholesale_selling_price: 0,
        unit_id: null,
      },
    ]);
    addDetails();
  };

  const addDetails = () => {
    setWholesale([...wholesale]);
    setRetail([...retail]);
    setBarcode([...barcode]);
    setPurchase([...purchase]);
    setMainunit([...mainunit]);
    setSubStoreUint([...substoreuint]);
    setContain([...contain]);
  }
  
  const handleContain = (id , value) => {
    const updatedContain = [...contain];
    updatedContain[id] = value;
    setContain(updatedContain);
  }

  const mergeDetails = (wholesale , retail , barcode  , purchase , mainunit , contain , substoreuint) => {
    var mergedDetails = [];
    
    wholesale.map((item , index) => {
      console.log(item);

      mergedDetails.push({
        wholesale: item,
        retail: retail[index],
        barcode: barcode[index],
        purchase: purchase[index],
        unit_id: mainunit[index],
        subunit_id: substoreuint[index],
        contain: contain[index],
      });
    });
    return mergedDetails;
  }
    

  const handleDeleteIllness = (id) => {
    setIllnesses((prevIllnesses) =>
      prevIllnesses.filter((illness) => illness.id !== id)
    );
  };

  const handleAddRowToSecondTable = () => {
    setSecondTableRows((prevRows) => [
      ...prevRows,
      {
        id: prevRows.length + 1,
        quantity: 0,
        unit_id: null,
        subunit_id: null
      }
    ]);
    addStorequantity();
  };

  const addStorequantity = () => {
    setStoreQuantity([...storequantity , ""]);
    setStoreUint([...storeuint , ""]);
    setExpiredate([...expiredate , ""]);
    setProductdate([...productdate , ""]);
    setStore([...store , ""]);
  }

  const mergeStoreQuantity = (storequantity , storeuint , expiredate , productdate , store , purchase ) => {
    var mergedStoreQuantity = [];
    storequantity.map((item , index) => {
      mergedStoreQuantity.push({
        storequantity: item,
        storeunit: storeuint[index],
        expiredate: expiredate[index],
        productdate: productdate[index],
        store: store[index],
        purchase: purchase[index],
      });
    });
    return mergedStoreQuantity;
  }

  const handleDeleteRowFromSecondTable = (id) => {
    setSecondTableRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const getCategories = async () => {
    try {
      const response = await API.post("/category");
      const data = response.data;
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getUnits = async () => {
    try {
      const response = await API.post("/unit");
      const data = response.data;
      setUnits(data);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const getWarehouses = async () => {
    try {
      const response = await API.post("/warehouse");
      const data = response.data;
      setStores(data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const getAllData = async () => {
    await Promise.all([getCategories(), getUnits(), getWarehouses()]);
  };

  // Call getAllData when the component mounts or when needed
  useEffect(() => {
    getAllData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDate = new FormData();
    formDate.append("name", name);
    formDate.append("category_id", itemcategry);
    formDate.append("description", description);
    formDate.append("quantity", quantity);
    formDate.append("has_expiry_date", hasExpiryDate ? 1 : 0);
    formDate.append("code", code);
    formDate.append("details", JSON.stringify(mergeDetails(wholesale , retail , barcode , purchase , mainunit , contain , substoreuint).slice(1 , wholesale.length)));
    formDate.append("units", JSON.stringify(mergeStoreQuantity(storequantity , storeuint , expiredate , productdate , store , purchase).slice(1 , storequantity.length)));
    
    try {
      const response = await API.post("/items/store", formDate , {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.data;
      console.log(data);
      navigate("/items");
    } catch (error) {
      console.error("Error adding warehouse:", error);
      setError(error.response.data.message);
    }
  }

  

  

  const handleBarcode = (id , value) => {
    const updatedBarcode = [...barcode];
    updatedBarcode[id] = value;
    setBarcode(updatedBarcode);
  }

  const handleWholesale = (id , value) => {
    const updatedWholesale = [...wholesale];
    updatedWholesale[id] = value;
    setWholesale(updatedWholesale);
  }

  const handleRetail = (id , value) => {
    const updatedRetail = [...retail];
    updatedRetail[id] = value;
    setRetail(updatedRetail);
  }
 

 const handleStore = (id , value) => {
    const updatedStore = [...store];
    updatedStore[id] = value;
    setStore(updatedStore);
  }

  const handlePurchase = (id , value) => {
    const updatedPurchase = [...purchase];
    updatedPurchase[id] = value;
    setPurchase(updatedPurchase);
  }

  const handleQuantitiy = (id , value) => {
    const updatedStoreQuantity = [...storequantity];
    updatedStoreQuantity[id] = value;
    setStoreQuantity(updatedStoreQuantity);
  }

  const handleStoreUint = (id , value) => {
    const updatedStoreUint = [...storeuint];
    updatedStoreUint[id] = value;
    setStoreUint(updatedStoreUint);
  }

  const handleMainunit = (id , value) => {
    const updatedStoreUint = [...mainunit];
    updatedStoreUint[id] = value;
    setMainunit(updatedStoreUint);
  }

  const handleSubStoreUint = (id , value) => {
    const updatedStoreUint = [...substoreuint];
    updatedStoreUint[id] = value;
    setSubStoreUint(updatedStoreUint);
  }

  const handleStoreWh = (id , value) => {
    const updatedStoreWh = [...storewh];
    updatedStoreWh[id] = value;
    setStoreWh(updatedStoreWh);
  }

  const handleProductionDate = (id , value) => {
    const updatedProductDate = [...productdate];
    updatedProductDate[id] = value;
    setProductdate(updatedProductDate);
  }

  const handleExpirDate = (id , value) =>
  {
    const updatedExpiryDate = [...expiredate];
    updatedExpiryDate[id] = value;
    setExpiredate(updatedExpiryDate);
  }

  return (
    <>
      <Title
        title="إضافة صنف جديد"
        icon={<FontAwesomeIcon icon={faPlus} />}
      />
      <Form className="Additem">
        <div className="form-additem">
          <SelectComponent
            label="التصنيف"
            placeholder="التصنيف"
            containerStyle={{ width: "30%" , marginBottom: "10px" }}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
            value={itemcategry}
            onChange={(e) => setItemCategory(e.value)}
          />
          {error && error.itemcategry && (
            <span className="error-message">{error.itemcategry}</span>
          )}
          <RegisterTextbox
            parentStyle={{ width: "30%" , marginBottom: "10px" }}
            label="اسم الصنف"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && error.name && (
            <span className="error-message">{error.name}</span>
          )}
          <RegisterTextbox
            parentStyle={{ width: "30%" , marginBottom: "10px" }}
            label="كود الصنف"
            type="text"
            disabled={true}
            value={Math.floor(Math.random() * 1000000)} // Random code for demonstration

          />

        </div>
        <div className="form-additem">
          <RegisterTextbox
            parentStyle={{ width: "30%" }}
            label="الحد الأدني"
            type="number"
            value={quantity}
            onChange={(e) => setQuantitiy(e.target.value)}
          />
          {error && error.quantity && (
            <span className="error-message">{error.quantity}</span>
          )}
          <RegisterTextbox
            parentStyle={{ width: "30%" }}
            label="الوصف"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && error.description && (
            <span className="error-message">{error.description}</span>
          )}
          <div className="date-addatem">
            <span className="check-expiry">تاريخ الانتهاء</span>
            <Form.Check
              inline
              label="نعم"
              type="radio"
              name="expiryDate"
              className="createManage-redio"
              onChange={() => setHasExpiryDate(true)}
            />

            <Form.Check
              inline
              label="لا"
              type="radio"
              name="expiryDate"
              className="createManage-redio"
              onChange={() => setHasExpiryDate(false)}
            />

          </div>
        </div>


        <>
          <div className="AddBeneficiary">
            <div className="AddBeneficiaryContainer w-100">
              <div className="add-row additemRow">
                <span onClick={handleAddIllness} className="addrowInvoice">
                  <FontAwesomeIcon icon={faPlus} /> اضافة تفاصيل الصنف
                </span>
              </div>
              <div className="duplicatedContent">
                <table className="vac-custom-table additem-table ">
                  <thead>
                    <tr className="vac-table-header selected-row">
                      <th>سعر الشراء</th>
                      <th>سعر القطاعي</th>
                      <th>سعر الجملة</th>
                      <th>الوحدة</th>
                      <th>تحتوي على</th>
                      <th>وحدة فرعية</th>
                      <th>الباركود</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {illnesses.length > 0 ? (
                      illnesses.map((illness , value) => (
                        <tr key={illness.id} className="selected-row">
                        
                         
                         
                          <td>
                            <RegisterTextbox
                              id={`cost-${illness.id}`}
                              type="number"
                              // stylee={{ width: "100%" }}
                              parentStyle={{ width: "80%", margin: "auto" }}
                              onChange={(e) => handlePurchase(illness.id, e.target.value)}
                            />
                          </td>
                          <td>
                            <RegisterTextbox
                              id={`wholesale-${illness.id}`}
                              type="number"
                              // stylee={{ width: "100%" }}
                              parentStyle={{ width: "80%", margin: "auto" }}
                              onChange={(e) => handleWholesale(illness.id, e.target.value)}
                            />
                          </td>
                          <td>
                            <RegisterTextbox
                              id={`retail-${illness.id}`}
                              type="number"
                              stylee={{ width: "100%" }}
                              parentStyle={{ width: "80%", margin: "auto" }}
                              onChange={(e) => handleRetail(illness.id, e.target.value)}
                            />
                          </td>
                          <td>
                          <SelectComponent
                            placeholder="الوحدة"
                            containerStyle={{ width: "80%", margin: "auto" }}
                            options={units.map((unit) => ({
                              label: unit.name,
                              value: unit.id,
                            }))}
                            onChange={(e) => handleMainunit(illness.id, e.value)}
                          />
                          </td>
                          <td>
                            <RegisterTextbox
                              id={`contain-${illness.id}`}
                              type="number"
                              stylee={{ width: "100%" }}
                              parentStyle={{ width: "80%", margin: "auto" }}
                              onChange={(e) => handleContain(illness.id, e.target.value)}
                            />
                          </td>
                          <td>
                          <SelectComponent
                            placeholder="الوحدة الفرعية"
                            containerStyle={{ width: "80%", margin: "auto" }}
                            options={units.map((unit) => ({
                              label: unit.name,
                              value: unit.id,
                            }))}
                            onChange={(e) => handleSubStoreUint(illness.id, e.value)}
                          />
                          </td>
                          <td>
                            <RegisterTextbox
                              id={`barcode-${illness.id}`}
                              type="text"
                              // stylee={{ width: "100%" }}
                              parentStyle={{ width: "80%", margin: "auto" }}
                              onChange={(e) => handleBarcode(illness.id, e.target.value)}
                            />
                          </td>
                          
                          <td className="dlete-itmm">
                            <FontAwesomeIcon
                              className="clearRowBtn"
                              icon={faTrash}
                              style={{ cursor: "pointer" }}
                              onClick={() => handleDeleteIllness(illness.id)}
                            />
                          </td>
                         
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: "center" }}>
                          لا يوجد
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="form-additem-s w-100">
              <div className="add-row additemRow">
                <span
                  onClick={handleAddRowToSecondTable}
                  className="addrowInvoice"
                >
                  <FontAwesomeIcon icon={faPlus} /> إضافة وحدات الى المخزن
                </span>
              </div>
              <table className="vac-custom-table table-quantity">
                <thead>
                  <tr className="vac-table-header selected-row">
                    <th >الوحدة</th>
                    <th className="quantity">الكمية</th>
                    <th className="store">المخزن</th>
                    {hasExpiryDate && (
                      <>
                    <th> تاريخ الانتاج</th>
                    <th> تاريخ الصلاحية</th>
                    </>)}

                    <th> </th>
                  </tr>
                </thead>
                <tbody>
                  {secondTableRows.length > 0 ? (
                    secondTableRows.map((row, index) => (
                      <tr key={row.id} className="selected-row">
                         <td>
                          <SelectComponent
                            placeholder="الوحدة"
                            containerStyle={{ width: "100%", margin: "auto" }}
                            options={units.map((unit) => ({
                              label: unit.name,
                              value: unit.id,
                            }))}
                            onChange={(e) => handleStoreUint(row.id, e.value)}
                          />
                        </td>
                        <td className="quantity">
                          <RegisterTextbox
                            id={`quantity-${row.id}`}
                            type="text"
                            containerStyle={{ width: "80%" , margin: "auto" }}
                            onChange={(e) => handleQuantitiy(row.id, e.target.value)}
                          />
                        </td>
                        <td>
                          <SelectComponent
                            placeholder="المخزن"
                            containerStyle={{ width: "100%", margin: "auto" }}
                            options={stores.map((store) => ({
                              label: store.name,
                              value: store.id,
                            }))}
                            onChange={(e) => handleStore(row.id, e.value)}
                          />
                        </td>
                        { hasExpiryDate && (
                          <>
                           <td>
                           {/* <RegisterTextbox
                             id={`productdate-${row.id}`}
                             type="date"
                             containerStyle={{ width: "80%" , margin: "auto" }}
                             onChange={(e) => handleProductionDate(row.id, e.target.value)}
                           /> */}
                           <input
                           type="date"
                           id={`productdate-${row.id}`}
                           onChange={(e) => handleProductionDate(row.id, e.target.value)}
                           className="custom-datepicker"
                           />
                         </td>
                         <td>
                           {/* <RegisterTextbox
                             id={`expiredate-${row.id}`}
                             type="date"
                             containerStyle={{ width: "80%" , margin: "auto" }}
                             onChange={(e) => handleExpirDate(row.id, e.target.value)}
                           /> */}
                           <input
                           type="date"
                           id={`expiredate-${row.id}`}
                           onChange={(e) => handleExpirDate(row.id, e.target.value)}
                           className="custom-datepicker"
                           />
                         </td>
                         </>)}
                       
                       
                        
                        <td className="delet-quantity">
                          <FontAwesomeIcon
                            className="clearRowBtn"
                            icon={faTrash}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              handleDeleteRowFromSecondTable(row.id)
                            }
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        لا يوجد اصناف
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="btn-additem">
              <CustomButton text="حفظ" onClick={handleSubmit} />
            </div>
          </div>
        </>
      </Form>
    </>
  );
}

export default Additem;
