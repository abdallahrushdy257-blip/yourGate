import { useState } from "react";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons";
import Title from "../../components/title";
import "./InventoryReport.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RegisterSelect from "../../components/RegisterSelect";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Form } from "react-bootstrap";

function InventoryReport() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStore, setSelectedStore] = useState("");

  const tableData = [
    {
      store: "المخزن 1",
      quantity: 10,
      unitCost: 100,
      totalCost: 1000,
      percentage: "20%",
      Date: "2024-01-01",
    },
    {
      store: "المخزن 2",
      quantity: 20,
      unitCost: 200,
      totalCost: 4000,
      percentage: "10%",
      Date: "2024-01-05",
    },
    {
      store: "المخزن 3",
      quantity: 30,
      unitCost: 300,
      totalCost: 9000,
      percentage: "30%",
      Date: "2024-01-10",
    },
    {
      store: "المخزن 3",
      quantity: 30,
      unitCost: 300,
      totalCost: 9000,
      percentage: "30%",
      Date: "2024-06-10",
    },
    {
      store: "المخزن 3",
      quantity: 30,
      unitCost: 300,
      totalCost: 9000,
      percentage: "30%",
      Date: "2024-01-10",
    },
    {
      store: "المخزن 4",
      quantity: 30,
      unitCost: 300,
      totalCost: 9000,
      percentage: "30%",
      Date: "2024-01-10",
    },
  ];

  const filteredData = tableData
    .filter((item) => {
      const itemDate = dayjs(item.Date);
      const isDateInRange =
        (!startDate ||
          itemDate.isAfter(startDate, "day") ||
          itemDate.isSame(startDate, "day")) &&
        (!endDate ||
          itemDate.isBefore(endDate, "day") ||
          itemDate.isSame(endDate, "day"));

      const isStoreMatch = !selectedStore || item.store === selectedStore;

      return isDateInRange && isStoreMatch;
    })
    .sort((a, b) => {
      return dayjs(a.Date).isBefore(dayjs(b.Date)) ? -1 : 1;
    });

  const handlePrint = () => {
    window.print();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="inventoryreport">
        <div className="title-container">
          <Title
            title="تقرير جرد المخزون"
            icon={<FontAwesomeIcon icon={faWarehouse} />}
          />
        </div>
        <div className="inventoryreportCon">
          <div className="inventoryreportInputs">
            <div className="fromToRepo">
              <Form.Label className="register-label">من</Form.Label>
              <DatePicker
                label="DD-MM-YYYY"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="DD-MM-YYYY"
                slotProps={{
                  textField: {
                    style: { flex: "1" },
                  },
                }}
              />
            </div>
            <div className="fromToRepo">
              <Form.Label className="register-label">الي</Form.Label>
              <DatePicker
                label="DD-MM-YYYY"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="DD-MM-YYYY"
                slotProps={{
                  textField: {
                    style: { flex: "1" },
                  },
                }}
              />
            </div>
            <RegisterSelect
              id="name"
              label="إسم المخزن"
              stylee={{ width: "45%" }}
              parentStyle={{ width: "35%", marginBottom: "20px" }}
              options={[
                { value: "", label: "الكل" },
                ...[...new Set(tableData.map((item) => item.store))].map(
                  (store) => ({
                    value: store,
                    label: store,
                  })
                ),
              ]}
              onChange={(e) => setSelectedStore(e.target.value)}
            />
          </div>

          <div className="ReceiptTabelCon inventoryreportTable scrollRepo">
            <table className="receiptTabel">
              <thead className="receiptTabel-thead">
                <tr>
                  <th>الإسم</th>
                  <th>الكمية الموجودة</th>
                  <th>تكلفة الوحدة</th>
                  <th>إجمالي التكلفة</th>
                  <th>النسبة من الأصول</th>
                  <th>التاريخ</th>
                </tr>
              </thead>
              <tbody className="receiptTabel-tbody">
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.store}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitCost}</td>
                    <td>{item.totalCost}</td>
                    <td>{item.percentage}</td>
                    <td>{dayjs(item.Date).format("YYYY-MM-DD")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="print-btn-container">
            <button className="btn btn-primary generalPrintRepo" onClick={handlePrint}>
              طباعة التقرير
            </button>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default InventoryReport;
