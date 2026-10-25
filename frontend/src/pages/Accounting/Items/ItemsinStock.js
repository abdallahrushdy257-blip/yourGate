import { useState, useEffect } from "react";
import API from "../../../api/axiosConfig";
import Title from "../../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectComponent from "../../../components/SelectComponent";
import { faBoxes, faPlus } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../components/RegisterTextBox";
import RegisterSelect from "../../../components/RegisterSelect";
import { useParams , useNavigate } from "react-router-dom";
import CustomButton from "../../../components/CustomButton";

function ItemsinStock() {
  const [items, setItems] = useState([]);
  const { id } = useParams();
  const [warehouses, setWarehouses] = useState([]);
  const [store , setStore] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [productionDate, setProductionDate] = useState(new Date().toISOString().slice(0, 10));
  const [expiryDate, setExpiryDate] = useState(new Date().toISOString().slice(0, 10));
  const [error , setError] = useState([]);
    const navigate = useNavigate();

  const getWarehouses = async () => {
    try {
      const response = await API.post("/warehouse");
      const data = response.data;
      setWarehouses(data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };
  const getItemDetails = async () => {
    try {
      const response = await API.post("/items/details/one", {
        id: id,
      });
      const data = response.data;
      setItems(data);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  useEffect(() => {
    getItemDetails();
    getWarehouses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDate = new FormData();
    formDate.append("itemdetail_id", id);
    formDate.append("store_id", store);
    formDate.append("count", quantity);
    formDate.append("produced_at", productionDate);
    formDate.append("expired_at", expiryDate);
    try {
      const response = await API.post("/items/storedetails", formDate, {
        headers: {
          "Content-Type": "application/json",
        },
        });
        const data = await response.data;
        navigate("/storeinventory");
        console.log(data);
    }catch (error) {
      console.error("Error adding warehouse:", error);
      setError(error.response.data.message);
    }
  }

  return (
    <>
      <div className="container">
        <div className="row" style={{ marginBottom: "50px" }}>
          <div className="col-md-12">
            <Title
              title="الصنف في المخزن"
              icon={<FontAwesomeIcon icon={faBoxes} />}
            />
          </div>
        </div>
        {items.has_expiry == 0 ? (
          <div className="row">
            <div className="col-md-12">
              <RegisterSelect
                        parentStyle={{
                            marginBottom: "20px",
                            width: "100%",
                        }}
                        label="المخزن"
                        stylee={{
                            width: "100%",      
                        }}
                        options={[
                          { value: "0", label: "اختر المخزن" },
                          ...warehouses.map((unit) => ({
                            value: unit.id,
                            label: unit.name,
                          })),
                        ]}
                          onChange={(e) => setStore(e.target.value)}
                          //value={store}
                    />
             {error && error.store && (
                <div className="alert alert-danger" role="alert">
                  {error.store}
                </div>
              )}
              <RegisterTextbox
                parentStyle={{
                  marginBottom: "20px",
                  width: "100%",
                }}
                label=" الكمية"
                type="number"
                stylee={{
                  width: "100%",
                }}
                onChange={(e) => setQuantity(e.target.value)}
                value={quantity}
              />
                {error && error.quantity && (
                <div className="alert alert-danger" role="alert">
                  {error.quantity}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-12">
            <RegisterSelect
                        parentStyle={{
                            marginBottom: "20px",
                            width: "100%",
                        }}
                        label="المخزن"
                        stylee={{
                            width: "100%",      
                        }}
                        options = {warehouses.map((item) => ({
                            value: item.id,
                            label: item.name,
                          }))}
                            onChange={(e) => setStore(e.target.value)}
                    />
                     {error && error.store && (
                <div className="alert alert-danger" role="alert">
                  {error.store}
                </div>
              )}
              <RegisterTextbox
                parentStyle={{
                  marginBottom: "20px",
                  width: "100%",
                }}
                label="الكمية"
                type="number"
                stylee={{
                  width: "100%",
                }}
                onChange={(e) => setQuantity(e.target.value)}
                value={quantity}
              />
                 {error && error.quantity && (
                <div className="alert alert-danger" role="alert">
                  {error.quantity}
                </div>
              )}
              <p style={{ direction: "rtl", marginBottom: "10px" }}>
                تاريخ الانتاج
              </p>
              <input
                type="date"
                className="custom-datepicker"
                style={{
                  width: "100%",
                  marginBottom: "20px",
                }}
                placeholder="تاريخ الانتاج"
                onChange={(e) => setProductionDate(e.target.value)}
                value={productionDate}
              />
              {error && error.production_date && (
                <div className="alert alert-danger" role="alert">
                  {error.production_date}
                </div>
              )}
              <p style={{ direction: "rtl", marginBottom: "10px" }}>
                تاريخ الانتهاء
              </p>
              <input
                type="date"
                className="custom-datepicker"
                style={{
                  width: "100%",
                  marginBottom: "20px",
                }}
                placeholder="تاريخ الانتهاء"
                onChange={(e) => setExpiryDate(e.target.value)}
                value={expiryDate}
              />
                {error && error.expiry_date && (
                <div className="alert alert-danger" role="alert">
                  {error.expiry_date}
                </div>
              )}
             
            </div>
            <div className="btn-additem">
              <CustomButton text="حفظ" onClick={handleSubmit} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ItemsinStock;
