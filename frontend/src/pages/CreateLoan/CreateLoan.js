import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Title from '../../components/title';
import './createLoan.css';
import { faFileInvoice, faMoneyBill1Wave, faPlus, faServer, faUser } from '@fortawesome/free-solid-svg-icons';
import RegisterTextbox from '../../components/RegisterTextBox';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Form, Spinner } from 'react-bootstrap';
import 'dayjs/locale/ar';
import RegisterSelect from '../../components/RegisterSelect';
import UploadInput from '../../components/UploadInput';
import RegisterTextarea from '../../components/RegisterTextarea';
import API from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const arabicMonths = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];
function CreateLoan() {
  const tabs = ['request', 'other', 'payment'];
  const [activeTab, setActiveTab] = useState('request');
  const [today, setToday] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [newMonth, setNewMonth] = useState('');
  const [newYear, setNewYear] = useState('');
  const [endDate, setEndDate] = useState(null);
  const [responsedate, setResponsedate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [requestdate, setRequestdate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [agreedate, setAgreedate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [followupdate, setFollowupdate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [humancase, setHumancase] = useState([]);
  const [emp, setEmp] = useState([]);
  const [requesttype, setRequesttype] = useState('');
  const [requestdescription, setRequestdescription] = useState('');
  const [priority, setPriority] = useState('');
  const [requestamount, setRequestamount] = useState(0);
  const [employeeid, setEmployeeid] = useState('');
  const [humancaseid, setHumancaseid] = useState('');
  const [instructions, setInstructions] = useState('');
  const [files, setFiles] = useState('');
  const [filedescription, setFiledescription] = useState('');
  const [error, setError] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitting1, setIsSubmitting1] = useState(false);
  const [isSubmitting2, setIsSubmitting2] = useState(false);
  const [follow, setFollow] = useState('');
  const [myid, setMyid] = useState('');
  const [paymentamount, setPaymentamount] = useState(0);
  const navigate = useNavigate();
  const [warranties, setWarranty] = useState([]);
  const [warrantyId, setWarrantyId] = useState('');
  const [loancount, setLoancount] = useState(0);



  useEffect(() => {
    if (!dueDate || !endDate || !paymentamount) {
      setSchedule([]);
      setMonths(0);
      setErrorMessage('');
      return;
    }

    const startDate = dayjs(dueDate);
    const finishDate = dayjs(endDate);

    if (finishDate.isBefore(startDate)) {
      setErrorMessage('تاريخ نهاية القرض يجب أن يكون بعد تاريخ البداية');
      return;
    }

    const calculatedMonths = finishDate.diff(startDate, 'month') + 1;
    setMonths(calculatedMonths);

    let monthlyAmount = parseFloat((paymentamount / calculatedMonths).toFixed(1));
    let newSchedule = [];

    let totalAmountDistributed = 0;

    for (let i = 0; i < calculatedMonths; i++) {
      const date = startDate.add(i, 'month');
      let currentAmount = monthlyAmount;

      if (i === calculatedMonths - 1) {
        currentAmount = parseFloat((paymentamount - totalAmountDistributed).toFixed(1));
      }

      newSchedule.push({
        id: i,
        month: arabicMonths[date.month()],
        year: date.year(),
        paymentamount: currentAmount,
      });

      totalAmountDistributed += currentAmount;
    }

    setSchedule(newSchedule);
    setErrorMessage('');
  }, [dueDate, endDate, paymentamount]);



  const getHumancase = async () => {
    try {
      const response = await API.post('/humancases');
      const data = await response.data;
      setHumancase(data);
    } catch (error) {
      console.error('Error fetching human case:', error);
    }
  };
  const getUser = async () => {
    try {
      const response = await API.post('/employees');
      const data = await response.data;
      setEmp(data);
    } catch (error) {
      console.error('Error fetching human case:', error);
    }
  };
  const getWarranty = async () => {
    try {
      const response = await API.post('/warrantor');
      const data = await response.data;
      setWarranty(data);
    } catch (error) {
      console.error('Error fetching human case:', error);
    }
  };
  useEffect(() => {
    getHumancase();
    getUser();
    getWarranty();
  }, []);


  const handleEditAmount = (id, newAmount) => {
    let updatedAmount = parseFloat(newAmount) || 0;
    if (updatedAmount < 0) updatedAmount = 0;

    const row = schedule.find((row) => row.id === id);
    const selectedDate = dayjs(`${row.year}-${arabicMonths.indexOf(row.month) + 1}-01`).locale('ar');
    const currentDate = dayjs();

    if (selectedDate.isBefore(currentDate, 'month')) {
      setErrorMessage('لا يمكن تعديل المبلغ لتاريخ ماضي');
      return;
    }

    setSchedule((prevSchedule) =>
      prevSchedule.map((row) =>
        row.id === id ? { ...row, amount: updatedAmount } : row
      )
    );
  };
  const [attachments, setAttachments] = useState([{ id: Date.now() }]);

  const addAttachment = () => {
    setAttachments([...attachments, { id: Date.now() }]);
  };


  const handleDeleteRow = (id) => {
    setSchedule((prevSchedule) => prevSchedule.filter((row) => row.id !== id));
  };

  const handleAddRow = () => {
    if (newMonth && newYear) {
      const selectedDate = dayjs(`${newYear}-${newMonth}-01`).locale('ar');
      const currentDate = dayjs();

      if (selectedDate.isBefore(currentDate, 'month')) {
        setErrorMessage('لا يمكن اختيار تاريخ في الماضي');
        return;
      }

      const isDuplicate = schedule.some(
        (row) => row.month === arabicMonths[selectedDate.month()] && row.year === selectedDate.year()
      );

      if (isDuplicate) {
        setErrorMessage('الشهر والسنة المدخلين موجودين بالفعل');
        return;
      }

      const remainingAmount = calculateRemainingAmount();

      if (remainingAmount > 0) {
        setSchedule((prevSchedule) => [
          ...prevSchedule,
          {
            id: prevSchedule.length + 1,
            month: arabicMonths[selectedDate.month()],
            year: selectedDate.year(),
            amount: 0
          }
        ]);

        setNewMonth('');
        setNewYear('');
      }
    } else {
      setErrorMessage('يجب تحديد الشهر والسنة');
    }
  };



  useEffect(() => {
    const totalInTable = schedule.reduce((sum, row) => sum + row.amount, 0);
    const totalAmount = parseFloat(amount) || 0;
    const remainingAmount = totalAmount - totalInTable;

    if (remainingAmount > 0) {
      setErrorMessage(`يجب إضافة ${remainingAmount} لتغطية المبلغ بالكامل`);
    } else if (remainingAmount < 0) {
      setErrorMessage(`المبلغ المدخل يتجاوز المطلوب بـ ${Math.abs(remainingAmount)}`);
    } else {
      setErrorMessage('');
    }
  }, [schedule, amount]);

  const calculateRemainingAmount = () => {
    const totalInTable = schedule.reduce((sum, row) => sum + row.amount, 0);
    return (parseFloat(amount) || 0) - totalInTable;
  };








  const handleNext = async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    const mForm = new FormData();
    mForm.append('requesttype', requesttype);
    mForm.append('requestdescription', requestdescription);
    mForm.append('priority', priority);
    mForm.append('amount', requestamount);
    mForm.append('user_id', employeeid);
    mForm.append('instructions', instructions);
    mForm.append('attatchment', files);
    mForm.append('requestdate', requestdate);
    mForm.append('responsedate', responsedate);
    mForm.append('approvedate', agreedate);
    mForm.append('humancase_id', humancaseid);
    mForm.append('warranty_id', warrantyId);
    mForm.append('attachment_discription', filedescription);
    mForm.append('loancount', loancount);
    try {
      const response = await API.post('/loans/store', mForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = await response.data;
      setMyid(data.id);
      setPaymentamount(data.amount);
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      }
    } catch (error) {
      console.error('Error creating request:', error);
      setIsSubmitting(false)
      setError(error.response.data.errors);
    }


  };

  const handleNext2 = async (e) => {
    e.preventDefault();
    setIsSubmitting1(true)
    const mForm = new FormData();
    mForm.append('description', follow);
    mForm.append('date', followupdate);
    mForm.append('loan_id', myid);
    try {
      const response = await API.post('/loans/followup/store', mForm, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = await response.data;
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      }
    } catch (error) {
      console.error('Error creating request:', error);
      setIsSubmitting1(false)
      setError(error.response.data.errors);
    }
  }

  // const handleDateChange = (date) => {
  //   const offset = new Date().getTimezoneOffset() * 60000; // Convert offset to milliseconds
  //   const localDate = new Date(date - offset).toISOString().split("T")[0];
  //   date = new Date(localDate);
  //   setDueDate(date.toISOString().split("T")[0]);
  // };

  // const handleDateChange2 = (date) => {
  //   const offset = new Date().getTimezoneOffset() * 60000; // Convert offset to milliseconds
  //   const localDate = new Date(date - offset).toISOString().split("T")[0];
  //   date = new Date(localDate);
  //   setEndDate(date.toISOString().split("T")[0]);
  // };


  const handleDateChange = (e) => {
    const value = e.target.value;
    if (!value) return;

    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset)
      .toISOString()
      .split("T")[0];

    setDueDate(localDate);
  };

  const handleDateChange2 = (e) => {
    const value = e.target.value;
    if (!value) return;

    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset)
      .toISOString()
      .split("T")[0];

    setEndDate(localDate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting2(true)
    const formData = new FormData();
    formData.append('loan_id', myid);
    formData.append('fromdate', dueDate);
    formData.append('todate', endDate);
    try {
      const response = API.post('/loans/payment/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = response.data;

      navigate('/loansData');
    } catch (error) {
      console.error('Error creating payment:', error);
      setIsSubmitting2(false)
      setError(error.response.data.errors);
    }
  };

  const renderContent = () => {
    switch (activeTab) {

      case "request":
        return (
          <>
            <Title
              title="بيانات الطلب"
              icon={<FontAwesomeIcon icon={faFileInvoice} />}
            />
            <div className="loan">
              <div className="loanContent" >
                <div className="loanRow" >
                  <RegisterSelect
                    id="name"
                    label="اسم المستفيد"
                    stylee={{
                      width: "45% !important",
                    }}
                    parentStyle={{
                      width: "30%",
                      marginBottom: "20px",
                    }}
                    options={
                      [
                        { value: "", label: "إختر الإسم" },
                        ...humancase.map((item) => ({
                          value: item.id,
                          label: item.name,
                        })),
                      ]
                    }
                    onChange={(e) => setHumancaseid(e.target.value)}
                    error={error && error.humancase_id}
                  />
                  {/* {error && error.humancase_id && (
                  <div style={{ color: 'red', marginTop: '10px' }}>
                    {error.humancase_id}
                  </div>
                )} */}
                  <RegisterSelect
                    id="name"
                    label="اسم الكفيل"
                    stylee={{
                      width: "45% !important",
                    }}
                    parentStyle={{
                      width: "30%",
                      marginBottom: "20px",
                    }}
                    options={
                      [
                        { value: "", label: "إختر الإسم" },
                        { value: "", label: "لا يوجد كفيل" },
                        ...warranties.map((item) => ({
                          value: item.id,
                          label: item.name,
                        })),
                      ]
                    }
                    onChange={(e) => setWarrantyId(e.target.value)}
                  />
                  {error && error.warranties_id && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      {error.warranties_id}
                    </div>
                  )}
                </div>
                <div className="loanRow">
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="type"
                    label="نوع الطلب"
                    type="text"
                    stylee={{ width: "45%" }}
                    onChange={(e) => setRequesttype(e.target.value)}
                  />

                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="desc"
                    label="وصف الطلب"
                    type="text"
                    stylee={{ width: "45%" }}
                    onChange={(e) => setRequestdescription(e.target.value)}
                  />

                </div>
                <div style={{ display: "flex", justifyContent: "space-between", width: "50%" }}>
                  {error && error.requesttype && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      {error.requesttype}
                    </div>
                  )}
                  {error && error.requestdescription && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      {error.requestdescription}
                    </div>
                  )}
                </div>
                <div className="loanRow">
                  <RegisterSelect
                    id="per"
                    label="الأولوية"
                    stylee={{
                      width: "45% !important",
                    }}
                    parentStyle={{
                      width: "30%",
                      marginBottom: "20px",
                    }}
                    options={[
                      { value: "", label: "إختر الأولوية" },
                      { value: "1", label: "قصوي" },
                      { value: "2", label: "عادية" },
                    ]}
                    onChange={(e) => setPriority(e.target.value)}
                  />

                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="amount"
                    label="المبلغ"
                    type="number"
                    stylee={{ width: "45%" }}
                    onChange={(e) => setRequestamount(e.target.value)}
                  />

                </div>
                <div style={{ display: "flex", justifyContent: "space-between", width: "50%" }}>
                  {error && error.priority && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      {error.priority}
                    </div>
                  )}
                  {error && error.requestamount && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      {error.requestamount}
                    </div>
                  )}
                </div>
                <div className="loanRow">
                  <RegisterSelect
                    id="res"
                    label="المسؤول عن الطلب"
                    stylee={{
                      width: "45% !important",
                    }}
                    parentStyle={{
                      width: "30%",
                      marginBottom: "20px",
                    }}
                    options={[
                      { value: "", label: "إختر الإسم" },
                      ...emp.map((item) => ({
                        value: item.id,
                        label: item.name,
                      })),
                    ]}
                    onChange={(e) => setEmployeeid(e.target.value)}
                  />


                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "right",
                      width: "30%",
                      marginBottom: "20px",
                    }}
                  >
                    <p style={{ marginBottom: "10px" }}>تاريخ تقديم الطلب</p>
                    <input
                      type="date"
                      name="reqdate"
                      className="custom-datepicker"
                      onChange={(e) => setRequestdate(e.target.value)}
                      value={requestdate}
                      style={{ width: "100%" }}
                    />

                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", width: "50%" }}>
                  {error && error.user_id && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      {error.user_id}
                    </div>
                  )}
                  {error && error.requestdate && (
                    <div style={{ color: 'red', width: "50%", marginTop: '10px' }}>
                      {error.requestdate}
                    </div>
                  )}
                </div>

                <div className="loanRow">

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "right",
                      width: "30%",
                      marginBottom: "20px",
                    }}
                  >
                    <p style={{ marginBottom: "10px" }}>
                      تاريخ الإستجابة المتوقع
                    </p>
                    <input
                      type="date"
                      name="resdate"
                      className="custom-datepicker"
                      onChange={(e) => setResponsedate(e.target.value)}
                      value={responsedate}
                      style={{ width: "100%" }}
                    />

                  </div>
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="instructions"
                    label="تعليمات الإدارة"
                    type="text"
                    stylee={{ width: "45%" }}
                    onChange={(e) => setInstructions(e.target.value)}
                  />

                </div>
                <div style={{ display: "flex", justifyContent: "space-between", width: "50%" }}>
                  {error && error.responsedate && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      {error.responsedate}
                    </div>
                  )}
                  {error && error.instructions && (
                    <div style={{ color: 'red', marginTop: '10px', marginRight: "65%" }}>
                      {error.instructions}
                    </div>
                  )}
                </div>
                <div className="loanRow">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "right",
                      width: "30%",
                      marginBottom: "20px",
                    }}
                  >
                    <p style={{ marginBottom: "10px" }}>تاريخ الموافقة</p>
                    <input
                      type="date"
                      name="resdate"
                      className="custom-datepicker"
                      onChange={(e) => setAgreedate(e.target.value)}
                      value={agreedate}
                      style={{ width: "100%" }}
                    />

                  </div>
                  <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id={`files`}
                    label=" وصف المستند"
                    type="text"
                    stylee={{ width: "100%" }}
                    onChange={(e) => setFiledescription(e.target.value)}
                  />

                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {
                    error && error.agreedate && (
                      <div style={{ color: 'red', width: "50%", marginTop: '10px' }}>
                        {error.agreedate}
                      </div>
                    )}
                  {error && error.files && (
                    <div style={{ color: 'red', width: "50%", marginTop: '10px' }}>
                      {error.filedescription}
                    </div>
                  )}
                </div>
                <div className="loanRow">
                  



                    <RegisterTextbox
                      parentStyle={{ width: "30%" }}
                      id={`files`}
                      label=" عدد شهور القرض"
                      type="number"
                      stylee={{ width: "100%" }}
                      onChange={(e) => setLoancount(e.target.value)}
                    />

                  </div>
                  <UploadInput
                    id={`documentUpload`}
                    parentStyle={{
                      marginBottom: "20px",
                      marginTop: "20px",
                      display: "unset",
                    }}
                    label="إرفاق المستند"
                    onChange={(e) => setFiles(e.target.files[0])}
                  />
                  {error && error.files && (
                    <div style={{ color: 'red', width: "50%", marginTop: '10px' }}>
                      {error.files}
                    </div>
                  )}
                </div>
              </div>
            </>
            );

            case "other":
            return (
            <div className="loan">
              <Title
                title="بيانات اخري"
                icon={<FontAwesomeIcon icon={faServer} />}
              />
              <div className="loanContent">


                <RegisterTextarea
                  parentStyle={{ width: "30%" }}
                  id="following"
                  label="المتابعة"
                  type="text"
                  row={12}
                  stylee={{ width: "65%" }}
                  onChange={(e) => setFollow(e.target.value)}
                />
                {error && error.description && (
                  <div style={{ color: 'red', marginTop: '10px' }}>
                    {error.description}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "right",
                    width: "30%",
                    marginBottom: "20px",
                  }}
                >
                  <p style={{ marginBottom: "10px" }}>تاريخ المتابعه</p>
                  <input
                    type="date"
                    name="resdate"
                    className="custom-datepicker"
                    onChange={(e) => setFollowupdate(e.target.value)}
                    value={followupdate}
                    style={{ width: "100%" }}
                  />
                  {error && error.followupdate && (
                    <div style={{ color: 'red', width: "50%", marginTop: '10px' }}>
                      {error.followupdate}
                    </div>
                  )}
                </div>
              </div>
            </div>
            );

            case 'payment':
            return (
            <div className='loan'>
              <Title
                title="بيانات الدفع"
                icon={<FontAwesomeIcon icon={faMoneyBill1Wave} />}
              />
              <div className='loanContent2'>


                <Form.Group className="responParent">
                  <Form.Label className="register-label">تاريخ بداية القرض</Form.Label>


                  <input
                    type="date"
                    className="custom-datepicker"
                    onChange={handleDateChange}
                    style={{ width: "100%" }}
                  />

                  {error && error.dueDate && (
                    <div style={{ color: 'red', width: "50%", marginTop: '10px' }}>
                      {error.dueDate}
                    </div>
                  )}
                </Form.Group>
                <Form.Group className="responParent">
                  <Form.Label className="register-label">تاريخ الإنتهاء من القرض</Form.Label>


                  <input
                    type="date"
                    className="custom-datepicker"
                    onChange={handleDateChange2}
                    style={{ width: "100%" }}
                  />
                  {error && error.endDate && (
                    <div style={{ color: 'red', width: "50%", marginTop: '10px' }}>
                      {error.endDate}
                    </div>
                  )}
                </Form.Group>

                <RegisterTextbox
                  parentStyle={{ width: "200px" }}
                  id="amount"
                  label="المبلغ"
                  type="number"
                  value={paymentamount && paymentamount}
                  //onChange={(e) => setAmount(e.target.value)}
                  stylee={{ width: "30%" }}
                  disabled={true}
                />
                <RegisterTextbox
                  parentStyle={{ width: "200px" }}
                  id="month"
                  label="عدد شهور السداد"
                  type="number"
                  value={months}
                  disabled={true}
                  onChange={(e) => setMonths(e.target.value)}
                  stylee={{ width: "30%" }}
                />
              </div>

              {schedule.length > 0 && (
                <div className="vacations-table-container">
                  <div className="mytable-responsive">
                    <table className="vac-custom-table">
                      <thead>
                        <tr className="vac-table-header selected-row">
                          <th>الشهر</th>
                          <th>السنة</th>
                          <th>المبلغ</th>
                          {/* <th>حذف</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.map((row) => (
                          <tr key={row.id} className='getrows'>
                            <td>{row.month}</td>
                            <td>{row.year}</td>
                            <td>
                              <input
                                type="number"
                                value={row.paymentamount}
                                onChange={(e) => handleEditAmount(row.id, e.target.value)}
                                style={{ width: "80px", textAlign: "center" }}
                              />
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>


                  </div>
                </div>
              )}


              {errorMessage && (
                <div style={{ color: 'red', textAlign: "center", marginTop: '10px' }}>
                  {errorMessage}
                </div>
              )}
            </div>
            );
            default:
            return null;
    }
  };


            return (
            <div className='createloan'>
              <form onSubmit={handleSubmit}>
                <div className='myTabs'>
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      className={`loantab ${activeTab === tab ? 'active' : ''}`}
                      //onClick={() => setActiveTab(tab)}
                      type="button"
                    >
                      {tab === 'request'
                        ? 'بيانات الطلب'
                        : tab === 'other'
                          ? 'بيانات اخري'
                          : 'بيانات الدفع'}
                    </button>
                  ))}
                </div>

                <div className='tabContent'>{renderContent()}</div>

                <div className='navigationButtons'>

                  {
                    (activeTab === 'request') ?
                      isSubmitting ?
                        <Spinner animation="border" variant="primary" style={{ display: "block", margin: "auto" }} />
                        :
                        (
                          <button className=' loanbtn nextButton' onClick={handleNext} disabled={tabs.indexOf(activeTab) === tabs.length - 1} type="button">
                            انتقل الى المتابعة
                          </button>
                        )
                      : (activeTab === 'other') ?
                        isSubmitting1 ?
                          <Spinner animation="border" variant="primary" style={{ display: "block", margin: "auto" }} />
                          :
                          (<button className=' loanbtn nextButton' onClick={handleNext2} disabled={tabs.indexOf(activeTab) === tabs.length - 1} type="button">
                            انتقل الى بيانات الدفع
                          </button>) :
                        (
                          isSubmitting2 ?
                            <Spinner animation="border" variant="primary" style={{ display: "block", margin: "auto" }} />
                            :
                            <button type="submit" className=' loanbtn saveButton'>
                              حفظ
                            </button>
                        )
                  }


                </div>
              </form>
            </div>
            );
}


            export default CreateLoan;