import { useState } from "react";
import Title from "../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { faTableColumns } from "@fortawesome/free-solid-svg-icons";
import RegisterSelect from "../../components/RegisterSelect";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Form } from "react-bootstrap";
import "./accountsReport.css";
import "react-datepicker/dist/react-datepicker.css";


function AccountsReport() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedName, setSelectedName] = useState("");

  const tableData = [
    {
      accountNum: "111001",
      accountName: "ترابيزة",
      case: "شراء",
      reference: 111002,
      debtor: "مدين",
      creditor: "-",
      balance: "500 ريال",
      Date: "2024-01-01",
    },
    {
      accountNum: "111003",
      accountName: "كراسي",
      case: "بيع", 
      reference: 111004,
      debtor: "-",
      creditor: "دائن",
      balance: "300 ريال",
      Date: "2024-01-02",
    },
    {
      accountNum: "111005",
      accountName: "أثاث مكتبي",
      case: "رصيد افتتاحي",
      reference: 111006,
      debtor: "-",
      creditor: "دائن",
      balance: "1000 ريال",
      Date: "2024-01-03",
    },
    {
      accountNum: "111007",
      accountName: "مكيفات",
      case: "شراء",
      reference: 111008,
      debtor: "مدين",
      creditor: "-",
      balance: "700 ريال", 
      Date: "2024-01-04",
    },
    {
      accountNum: "111009",
      accountName: "إضاءة",
      case: "بيع",
      reference: 111010,
      debtor: "-",
      creditor: "دائن",
      balance: "400 ريال",
      Date: "2024-01-05",
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

      const isStoreMatch = !selectedName || item.accountName === selectedName;

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
            title="تقرير الحسابات "
            icon={<FontAwesomeIcon icon={faTableColumns} />}
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
                ...[...new Set(tableData.map((item) => item.accountName))].map(
                  (store) => ({
                    value: store,
                    label: store,
                  })
                ),
              ]}
              onChange={(e) => setSelectedName(e.target.value)}
            />
          </div>

          <div className="ReceiptTabelCon inventoryreportTable scrollRepo">
            <table className="receiptTabel">
              <thead className="receiptTabel-thead">
                <tr>
                  <th>إسم الحساب</th>
                  <th>رقم الحساب</th>
                  <th>التاريخ</th>
                  <th>الحالة</th>
                  <th>رقم الفاتورة</th>
                  <th>مدين</th>
                  <th>دائن</th>
                  <th>الرصيد</th>
                </tr>
              </thead>
              <tbody className="receiptTabel-tbody">
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.accountName}</td>
                    <td>{item.accountNum}</td>
                    <td>{dayjs(item.Date).format("YYYY-MM-DD")}</td>
                    <td>{item.case}</td>
                    <td>{item.reference}</td>
                    <td>{item.debtor}</td>
                    <td>{item.creditor}</td>
                    <td>{item.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="print-btn-container">
            <button
              className="btn btn-primary generalPrintRepo"
              onClick={handlePrint}
            >
              طباعة التقرير
            </button>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default AccountsReport;
