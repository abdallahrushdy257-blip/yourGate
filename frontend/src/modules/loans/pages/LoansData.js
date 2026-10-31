import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import "./paymentData.css";
import { faBagShopping, faFileInvoice, faMoneyBill1Wave, faServer, faXmark } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../../components/TableComponent";
import { useNavigate } from "react-router";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import NewButton from "../../../components/NewButton";
import RegisterTextbox from "../../../components/RegisterTextBox";
import RegisterSelect from "../../../components/RegisterSelect";
import RegisterTextarea from "../../../components/RegisterTextarea";
import UploadInput from "../../../components/UploadInput";
import API from "../../../api/axiosConfig";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import "../../../pages/CreateLoan/createLoan.css";

const arabicMonths = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

function LoansData() {
  const columns = [
    { name: "رقم القرض", key: "serial" },
    { name: "إسم المستفيد", key: "hcname" },
    { name: "قيمة القرض", key: "amount" },
    { name: "تاريخ منح القرض", key: "responsedate" },
    { name: "الأولوية", key: "priority" },
    { name: "حالة القرض", key: "status_string" },
    { name: "عدد شهور القرض", key: "loancount" },
    { name: "", key: "actions" },
  ];
  const navigate = useNavigate();

  // --- Modal & Form State ---
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('request');
  const tabs = ['request', 'other', 'payment'];
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());

  // Form Fields
  const [humancase, setHumancase] = useState([]);
  const [emp, setEmp] = useState([]);
  const [warranties, setWarranty] = useState([]);
  const [humancaseid, setHumancaseid] = useState('');
  const [warrantyId, setWarrantyId] = useState('');
  const [requesttype, setRequesttype] = useState('');
  const [requestdescription, setRequestdescription] = useState('');
  const [priority, setPriority] = useState('');
  const [requestamount, setRequestamount] = useState(0);
  const [employeeid, setEmployeeid] = useState('');
  const [requestdate, setRequestdate] = useState(new Date().toISOString().substr(0, 10));
  const [responsedate, setResponsedate] = useState(new Date().toISOString().substr(0, 10));
  const [instructions, setInstructions] = useState('');
  const [agreedate, setAgreedate] = useState(new Date().toISOString().substr(0, 10));
  const [loancount, setLoancount] = useState(0);
  const [files, setFiles] = useState('');
  const [filedescription, setFiledescription] = useState('');
  const [follow, setFollow] = useState('');
  const [followupdate, setFollowupdate] = useState(new Date().toISOString().substr(0, 10));
  
  // Payment States
  const [myid, setMyid] = useState('');
  const [paymentamount, setPaymentamount] = useState(0);
  const [dueDate, setDueDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [months, setMonths] = useState(0);
  const [schedule, setSchedule] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitting1, setIsSubmitting1] = useState(false);
  const [isSubmitting2, setIsSubmitting2] = useState(false);

  const handleShow = () => {
    setShowModal(true);
    setActiveTab('request');
    resetForm();
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setHumancaseid('');
    setWarrantyId('');
    setRequesttype('');
    setRequestdescription('');
    setPriority('');
    setRequestamount(0);
    setEmployeeid('');
    setRequestdate(new Date().toISOString().substr(0, 10));
    setResponsedate(new Date().toISOString().substr(0, 10));
    setInstructions('');
    setAgreedate(new Date().toISOString().substr(0, 10));
    setLoancount(0);
    setFiles('');
    setFiledescription('');
    setFollow('');
    setFollowupdate(new Date().toISOString().substr(0, 10));
    setMyid('');
    setPaymentamount(0);
    setDueDate(null);
    setEndDate(null);
    setMonths(0);
    setSchedule([]);
    setErrorMessage('');
    setError({});
    setIsSubmitting(false);
    setIsSubmitting1(false);
    setIsSubmitting2(false);
  };

  useEffect(() => {
    if (showModal) {
      const fetchData = async () => {
        try {
          const [hcRes, empRes, warRes] = await Promise.all([
            API.post('/humancases'),
            API.post('/employees'),
            API.post('/warrantor')
          ]);
          setHumancase(hcRes.data);
          setEmp(empRes.data);
          setWarranty(warRes.data);
        } catch (err) {
          console.error("Error fetching form data:", err);
        }
      };
      fetchData();
    }
  }, [showModal]);

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

  const handleEditAmount = (id, newAmount) => {
    let updatedAmount = parseFloat(newAmount) || 0;
    if (updatedAmount < 0) updatedAmount = 0;
    setSchedule((prev) => prev.map((row) => row.id === id ? { ...row, paymentamount: updatedAmount } : row));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mForm = new FormData();
    mForm.append('requesttype', requesttype);
    mForm.append('requestdescription', requestdescription);
    mForm.append('priority', priority);
    mForm.append('amount', requestamount);
    mForm.append('user_id', employeeid);
    mForm.append('instructions', instructions);
    if (files) mForm.append('attatchment', files);
    mForm.append('requestdate', requestdate);
    mForm.append('responsedate', responsedate);
    mForm.append('approvedate', agreedate);
    mForm.append('humancase_id', humancaseid);
    mForm.append('warranty_id', warrantyId);
    mForm.append('attachment_discription', filedescription);
    mForm.append('loancount', loancount);
    
    try {
      const res = await API.post('/loans/store', mForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMyid(res.data.id);
      setPaymentamount(res.data.amount);
      setActiveTab('other');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || {});
      setIsSubmitting(false);
    }
  };

  const handleNext2 = async (e) => {
    e.preventDefault();
    setIsSubmitting1(true);
    const mForm = new FormData();
    mForm.append('description', follow);
    mForm.append('date', followupdate);
    mForm.append('loan_id', myid);
    try {
      await API.post('/loans/followup/store', mForm);
      setActiveTab('payment');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || {});
      setIsSubmitting1(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting2(true);
    const formData = new FormData();
    formData.append('loan_id', myid);
    formData.append('fromdate', dueDate);
    formData.append('todate', endDate);
    
    // If schedule needs to be sent specifically, adapt here. 
    // Usually backend handles the simple range or we send the full list.
    
    try {
      await API.post('/loans/payment/store', formData);
      handleClose();
      setTableReloadKey(Date.now());
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || {});
      setIsSubmitting2(false);
    }
  };

  const dropdownOptions = [
    {
      label: "عرض المدفوعات",
      action: (id, record) => {
        if (record.status !== 1) {
          alert("لا يمكن عرض المدفوعات حتى تتم الموافقة على القرض");
        } else {
          navigate(`/paymentdata/${id}`);
        }
      },
    },
    { label: "دراسة الجدوى", action: (id , record) => {
      if(record.feasibility !== null){
        alert("تم إنشاء دراسة جدوى لهذا القرض مسبقاً");
      }else{ 
        navigate(`/feasibilitystudy/${id}`);
      }
    } },
    { label: "عرض القرض", route: "/loandetails/:id" },
  ];

  const modifyRow = (row) => {
    let newRow = { ...row };
    newRow.amount = Intl.NumberFormat().format(row.amount);
    newRow.priority = row.priority == 1 ? "قصوى" : "عادي";
    return newRow;
  };

  return (
    <>
      <Title
        title="بيانات القروض"
        icon={<FontAwesomeIcon icon={faBagShopping} />}
      />
      <div className="paymentdata">
        <TableComponent
          apiUrl={"/loans"}
          columns={columns}
          dropdownOptions={dropdownOptions}
          transformRowFn={modifyRow}
          triggerReload={tableReloadKey}
          addBtn={true}
          onAddClick={handleShow}
        />
      </div>

      <Modal size="lg" show={showModal} onHide={handleClose} centered scrollable style={{ direction: "rtl" }}>
        <Modal.Header closeButton style={{ direction: "ltr" }}>
          <Modal.Title>إنشاء قرض جديد</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="createloan m-0 p-3">
            <div className="myTabs mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`loantab ${activeTab === tab ? 'active' : ''}`}
                  type="button"
                  disabled={true} // Tabs follow step-by-step
                >
                  {tab === 'request' ? 'بيانات الطلب' : tab === 'other' ? 'بيانات أخرى' : 'بيانات الدفع'}
                </button>
              ))}
            </div>

            <div className="tabContent">
              {activeTab === 'request' && (
                <div className="loan">
                  <div className="loanContent">
                    <div className="loanRow">
                      <RegisterSelect
                        label="اسم المستفيد"
                        parentStyle={{ width: "45%", marginBottom: "20px" }}
                        options={[{ value: "", label: "إختر الإسم" }, ...humancase.map(i => ({ value: i.id, label: i.name }))]}
                        onChange={(e) => setHumancaseid(e.target.value)}
                        value={humancaseid}
                        error={error.humancase_id}
                      />
                      <RegisterSelect
                        label="اسم الكفيل"
                        parentStyle={{ width: "45%", marginBottom: "20px" }}
                        options={[{ value: "", label: "إختر الإسم" }, { value: "0", label: "لا يوجد كفيل" }, ...warranties.map(i => ({ value: i.id, label: i.name }))]}
                        onChange={(e) => setWarrantyId(e.target.value)}
                        value={warrantyId}
                      />
                    </div>
                    <div className="loanRow">
                      <RegisterTextbox
                        label="نوع الطلب"
                        parentStyle={{ width: "45%" }}
                        onChange={(e) => setRequesttype(e.target.value)}
                        value={requesttype}
                        error={error.requesttype}
                      />
                      <RegisterTextbox
                        label="وصف الطلب"
                        parentStyle={{ width: "45%" }}
                        onChange={(e) => setRequestdescription(e.target.value)}
                        value={requestdescription}
                        error={error.requestdescription}
                      />
                    </div>
                    <div className="loanRow">
                      <RegisterSelect
                        label="الأولوية"
                        parentStyle={{ width: "45%", marginBottom: "20px" }}
                        options={[{ value: "", label: "إختر الأولوية" }, { value: "1", label: "قصوي" }, { value: "2", label: "عادية" }]}
                        onChange={(e) => setPriority(e.target.value)}
                        value={priority}
                        error={error.priority}
                      />
                      <RegisterTextbox
                        label="المبلغ"
                        type="number"
                        parentStyle={{ width: "45%" }}
                        onChange={(e) => setRequestamount(e.target.value)}
                        value={requestamount}
                        error={error.amount}
                      />
                    </div>
                    <div className="loanRow">
                      <RegisterSelect
                        label="المسؤول عن الطلب"
                        parentStyle={{ width: "45%", marginBottom: "20px" }}
                        options={[{ value: "", label: "إختر الإسم" }, ...emp.map(i => ({ value: i.id, label: i.name }))]}
                        onChange={(e) => setEmployeeid(e.target.value)}
                        value={employeeid}
                        error={error.user_id}
                      />
                      <div style={{ width: "45%", marginBottom: "20px" }}>
                        <p className="mb-2">تاريخ تقديم الطلب</p>
                        <input type="date" className="custom-datepicker w-100" onChange={(e) => setRequestdate(e.target.value)} value={requestdate} />
                        {error.requestdate && <span className="text-danger small">{error.requestdate}</span>}
                      </div>
                    </div>
                    <div className="loanRow">
                      <div style={{ width: "45%", marginBottom: "20px" }}>
                        <p className="mb-2">تاريخ الاستجابة المتوقع</p>
                        <input type="date" className="custom-datepicker w-100" onChange={(e) => setResponsedate(e.target.value)} value={responsedate} />
                        {error.responsedate && <span className="text-danger small">{error.responsedate}</span>}
                      </div>
                      <RegisterTextbox
                        label="تعليمات الإدارة"
                        parentStyle={{ width: "45%" }}
                        onChange={(e) => setInstructions(e.target.value)}
                        value={instructions}
                        error={error.instructions}
                      />
                    </div>
                    <div className="loanRow">
                      <div style={{ width: "45%", marginBottom: "20px" }}>
                        <p className="mb-2">تاريخ الموافقة</p>
                        <input type="date" className="custom-datepicker w-100" onChange={(e) => setAgreedate(e.target.value)} value={agreedate} />
                        {error.approvedate && <span className="text-danger small">{error.approvedate}</span>}
                      </div>
                      <RegisterTextbox
                        label="وصف المستند"
                        parentStyle={{ width: "45%" }}
                        onChange={(e) => setFiledescription(e.target.value)}
                        value={filedescription}
                      />
                    </div>
                    <div className="loanRow">
                      <RegisterTextbox
                        label="عدد شهور القرض"
                        type="number"
                        parentStyle={{ width: "45%" }}
                        onChange={(e) => setLoancount(e.target.value)}
                        value={loancount}
                      />
                      <UploadInput
                        label="إرفاق المستند"
                        parentStyle={{ width: "45%", marginTop: "20px" }}
                        onChange={(e) => setFiles(e.target.files[0])}
                      />
                    </div>
                  </div>
                  <div className="navigationButtons mt-4">
                    {isSubmitting ? <Spinner animation="border" variant="primary" className="d-block mx-auto" /> :
                      <button className="loanbtn nextButton" onClick={handleNext}>انتقل إلى المتابعة</button>
                    }
                  </div>
                </div>
              )}

              {activeTab === 'other' && (
                <div className="loan">
                  <div className="loanContent">
                    <RegisterTextarea
                      label="المتابعة"
                      parentStyle={{ width: "65%" }}
                      onChange={(e) => setFollow(e.target.value)}
                      value={follow}
                      error={error.description}
                    />
                    <div style={{ width: "45%", marginBottom: "20px" }}>
                      <p className="mb-2">تاريخ المتابعة</p>
                      <input type="date" className="custom-datepicker w-100" onChange={(e) => setFollowupdate(e.target.value)} value={followupdate} />
                      {error.date && <span className="text-danger small">{error.date}</span>}
                    </div>
                  </div>
                  <div className="navigationButtons mt-4">
                    {isSubmitting1 ? <Spinner animation="border" variant="primary" className="d-block mx-auto" /> :
                      <button className="loanbtn nextButton" onClick={handleNext2}>انتقل إلى بيانات الدفع</button>
                    }
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="loan">
                  <div className="loanContent2 d-flex flex-wrap gap-4">
                    <Form.Group className="responParent" style={{ width: "250px" }}>
                      <Form.Label className="register-label">تاريخ بداية القرض</Form.Label>
                      <input type="date" className="custom-datepicker w-100" onChange={(e) => setDueDate(e.target.value)} value={dueDate || ""} />
                      {error.fromdate && <span className="text-danger small">{error.fromdate}</span>}
                    </Form.Group>
                    <Form.Group className="responParent" style={{ width: "250px" }}>
                      <Form.Label className="register-label">تاريخ نهاية القرض</Form.Label>
                      <input type="date" className="custom-datepicker w-100" onChange={(e) => setEndDate(e.target.value)} value={endDate || ""} />
                      {error.todate && <span className="text-danger small">{error.todate}</span>}
                    </Form.Group>
                    <RegisterTextbox
                      label="المبلغ"
                      parentStyle={{ width: "150px" }}
                      value={paymentamount}
                      disabled={true}
                    />
                    <RegisterTextbox
                      label="شهور السداد"
                      parentStyle={{ width: "150px" }}
                      value={months}
                      disabled={true}
                    />
                  </div>

                  {schedule.length > 0 && (
                    <div className="vacations-table-container mt-4">
                      <div className="mytable-responsive">
                        <table className="vac-custom-table">
                          <thead>
                            <tr className="vac-table-header selected-row">
                              <th>الشهر</th>
                              <th>السنة</th>
                              <th>المبلغ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {schedule.map((row) => (
                              <tr key={row.id} className="getrows">
                                <td>{row.month}</td>
                                <td>{row.year}</td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm text-center mx-auto"
                                    style={{ width: "100px" }}
                                    value={row.paymentamount}
                                    onChange={(e) => handleEditAmount(row.id, e.target.value)}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {errorMessage && <div className="text-danger text-center mt-3">{errorMessage}</div>}

                  <div className="navigationButtons mt-4">
                    {isSubmitting2 ? <Spinner animation="border" variant="primary" className="d-block mx-auto" /> :
                      <button className="loanbtn saveButton" onClick={handleSubmit}>حفظ</button>
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default LoansData;
