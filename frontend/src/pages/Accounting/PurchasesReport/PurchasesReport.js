import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import Title from "../../../components/title";

import "./PurchasesReport.css";
import SelectComponent from "../../../components/SelectComponent";
import RegisterTextbox from "../../../components/RegisterTextBox";
import CheckboxComponent from "../../../components/CheckboxComponent ";
import CustomTable from "../../../components/CustomTable";
import { useEffect, useState } from "react";
import API from "../../../api/axiosConfig";

function PurchasesReport() {

  const columns = [
    { name: "رقم الفاتورة", key: "invoicenumber" },
    { name: "نوع المشتريات", key: "type" },
    { name: "التاريخ", key: "date" },
    { name: "اسم المورد", key: "vendorname" },
    { name: "اسم المخزن", key: "warehousename" },
    { name: "الرصيد الحالي", key: "total" },
    { name: "النوع", key: "paymenttype" },
  ];
  const [purchace , setPurchace] = useState([]);
  const [rows, setRows] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("0");
  const [chooseMethod, setChooseMethod] = useState("");
  const [chooseType , setChooseType] = useState("");
  const [chooseVendor, setChooseVendor] = useState("");
  const [chooseWarehouse, setChooseWarehouse] = useState("");

  


  const getAllPurchases = async () => {
    try {
      const response = await API.get(`warehouse/report/purchase`);
      const data = await response;
      setPurchace(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getAllVendor = async () => {
    try {
      const response = await API.get("/vendor/all");
      const data = await response;
      setVendor(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getAllWarwhouses = async () => {
    try {
      const response = await API.post("warehouse/all");
      const data = await response;
      setWarehouse(data.data);
    } catch (error) {
      console.log(error);
    }
  } 

 
 
  useEffect(() => {
    getAllPurchases();
    getAllVendor();
    getAllWarwhouses();
  }, []);


  const handleChooseMethod = (e) => {
    setChooseMethod(e.target.value);
    const selectedPurchace = purchace.filter((item) => item.type == e.target.value);
    setRows(selectedPurchace);
  }

  const handleChooseType = (e) => {
    setChooseType(e.target.value);
    const selectedPurchace = purchace.filter((item) => item.paymenttype == e.target.value);
    setRows(selectedPurchace);
  }

  const handleChooseVendor = (e) => {
    setChooseVendor(e.value);
    const selectedPurchace = purchace.filter((item) => item.vendorname == e.value);
    setRows(selectedPurchace);
  }

  const handleChooseWarehouse = (e) => {
    setChooseWarehouse(e.value);
    const selectedPurchace = purchace.filter((item) => item.warehousename == e.value);
    setRows(selectedPurchace);
  }
 
  return (
    <>
      <Title
        title="تقرير المشتريات"
        icon={<FontAwesomeIcon icon={faReceipt} />}
        style={{ width: "unset" }}
      />
      <div className="PurchasesReport">
        <div className="radio-form-report">
          <div className="paymentMethod">
            <span> النوع </span>
            <div className="paymentMethod1">
              <CheckboxComponent
                label="مشتريات"
                type="checkbox"
                name="reportType"
                value="مشتريات"
                onChange={handleChooseMethod}
              />
              <CheckboxComponent
                label="مردود مشتريات"
                type="checkbox"
                name="reportType2"
                value="مردود مشتريات"
                onChange={handleChooseMethod}
              />
            </div>
          </div>
          <div className="paymentMethod">
            <span> طريقه الدفع  </span>
            <div className="paymentMethod1">
              <CheckboxComponent
                label="كاش"
                type="checkbox"
                name="paymentMethod1"
                value="كاش"
                onChange={handleChooseType}
              />
              <CheckboxComponent
                label="آجل"
                type="checkbox"
                name="paymentMethod2"
                value="اجل"
                onChange={handleChooseType}
              />
            </div>
            
          </div>
        </div>

        <div className="formreport-prush">
          <SelectComponent
            label="اسم المورد"
            placeholder="اختر المورد"

            containerStyle={{ width: "20%" }}
            options={ vendor.map((item) => ({ label: item.name, value: item.name })) }
            onChange={handleChooseVendor}
          />
          <SelectComponent
            className="select-report"
            id="payAcc"
            label="اختر مخزن"
            placeholder="اختر مخزن"
            containerStyle={{ width: "20%" }}
            options={ warehouse.map((item) => ({ label: item.name, value: item.name })) }
            onChange={handleChooseWarehouse}
          />
         
        </div>
      </div>

     { rows.length > 0 ? (
      <div className="PurchasesReport-table">
        <CustomTable columns={columns} data={rows} />
      </div>
     ) : (
      <div className="PurchasesReport-table">
        <p>لا يوجد بيانات</p>
      </div>
     )
     }
    </>
  );
}

export default PurchasesReport;
