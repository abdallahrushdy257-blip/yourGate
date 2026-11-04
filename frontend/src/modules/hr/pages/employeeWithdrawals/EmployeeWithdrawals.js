import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReactToPrint } from "react-to-print";
import {
  faCheckSquare,
  faEye,
  faMoneyBillWave,
  faPrint,
  faReceipt,
  faTrashAlt,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import TableComponent from "../../../../components/TableComponent";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import RegisterSelect from "../../../../components/RegisterSelect";
import PrintHead from "../../../../components/PrintHead";
import PrintFooter from "../../../../components/PrintFooter";
import API from "../../../../api/axiosConfig";

const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(Number(num))) return "0";
  return Number(num).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
};

function EmployeeWithdrawals() {
  const receiptRef = useRef();

  // Dynamic States
  const [employees, setEmployees] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    type: null, // "delete" | "approve"
    row: null,
    payment_account_id: "",
  });

  const [addModalData, setAddModalData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().split(" ")[0].substring(0, 5),
    employee_id: "",
    receiver_account_id: "",
    value: "",
    description: "",
  });

  // Load Dropdowns Data from Real Backend APIs
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [empRes, accRes] = await Promise.all([
          API.post("employees"),
          API.get("/employeewithdrawal/accounts"),
        ]);

        const empList = Array.isArray(empRes.data)
          ? empRes.data
          : empRes.data?.data || [];
        setEmployees(
          empList.map((emp) => ({
            value: emp.id,
            label: `${emp.name}${emp.jobname ? ` (${emp.jobname})` : ""}`,
          }))
        );

        const accList = Array.isArray(accRes.data)
          ? accRes.data
          : accRes.data?.data || [];
        setAccounts(accList);
      } catch (err) {
        console.error("Error loading employees or accounts:", err);
      }
    };

    fetchDropdowns();
  }, []);

  // Modals Actions
  const openDeleteModal = (row) => {
    setConfirmModal({
      show: true,
      type: "delete",
      row,
      payment_account_id: "",
    });
  };

  const openApproveModal = (row) => {
    setConfirmModal({
      show: true,
      type: "approve",
      row,
      payment_account_id: row.account_id || "",
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      show: false,
      type: null,
      row: null,
      payment_account_id: "",
    });
  };

  const openAddModal = () => {
    setAddModalData({
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().split(" ")[0].substring(0, 5),
      employee_id: "",
      receiver_account_id: accounts.length > 0 ? accounts[0].value : "",
      value: "",
      description: "",
    });
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const handleShowReceiptModal = (row) => {
    setSelectedReceipt(row);
    setShowReceiptModal(true);
  };

  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedReceipt(null);
  };

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `سند_صرف_${selectedReceipt?.id || "سحب"}`,
  });

  // Submit Handler for New Withdrawal
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (
      !addModalData.employee_id ||
      !addModalData.receiver_account_id ||
      !addModalData.value
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);
    try {
      await API.post("/employeewithdrawal/store", {
        employee_id: addModalData.employee_id,
        receiver_account_id: addModalData.receiver_account_id,
        amount: Number(addModalData.value),
        date: addModalData.date,
        time: addModalData.time,
        description: addModalData.description || "مسحوبات موظف",
      });

      toast.success("تم حفظ المسحوبات بنجاح");
      closeAddModal();
      setRefreshKey(Date.now());
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حفظ المسحوبات");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Handler for Confirmation (Approve or Delete)
  const handleConfirmAction = async () => {
    setIsSubmitting(true);
    try {
      if (confirmModal.type === "delete") {
        await API.delete(`/employeewithdrawal/${confirmModal.row.id}`);
        toast.success("تم حذف المسحوبات بنجاح");
        closeConfirmModal();
        setRefreshKey(Date.now());
      } else if (confirmModal.type === "approve") {
        if (!confirmModal.payment_account_id) {
          toast.error("يرجى اختيار حساب الدفع");
          setIsSubmitting(false);
          return;
        }

        await API.post("/employeewithdrawal/approve", {
          id: confirmModal.row.id,
          payment_account_id: confirmModal.payment_account_id,
        });

        toast.success("تم اعتماد وصرف المسحوبات بنجاح");
        closeConfirmModal();
        setRefreshKey(Date.now());
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "حدث خطأ أثناء معالجة الطلب"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Row Transformer (formats status badge & numbers)
  const modifyRow = (row) => {
    const isApproved =
      row.status === 1 ||
      row.status === "1" ||
      row.statusText === "معتمد";

    return {
      ...row,
      serialNumber: row.id,
      amountText: formatNumber(row.amount),
      statusBadge: isApproved
        ? '<span style="background: rgba(40, 167, 69, 0.12); color: #28a745; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 13px;">معتمد</span>'
        : '<span style="background: rgba(255, 193, 7, 0.18); color: #b8860b; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 13px;">قيد الانتظار</span>',
    };
  };

  // Columns Configuration (Clean without duplicate 'م')
  const columns = [
    { name: "اسم الموظف", key: "employee" },
    { name: "حساب الخزينة / البنك", key: "account" },
    { name: "قيمة المبلغ", key: "amountText" },
    { name: "تاريخ الطلب", key: "date" },
    { name: "وقت الطلب", key: "time" },
    { name: "تاريخ الصرف", key: "withdrawal_date" },
    { name: "الحالة", key: "statusBadge" },
    { name: "البيان / الوصف", key: "description" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions = [
    {
      label: "عرض السند",
      action: (_id, record) => handleShowReceiptModal(record),
    },
    {
      label: "اعتماد وصرف",
      action: (_id, record) => {
        if (record.status === 1 || record.statusText === "معتمد") {
          toast.info("هذا الطلب معتمد وصُرف بالفعل");
        } else {
          openApproveModal(record);
        }
      },
    },
    {
      label: "حذف",
      action: (_id, record) => openDeleteModal(record),
    },
  ];

  const selectedAccountObj = accounts.find(
    (acc) => acc.value === Number(addModalData.receiver_account_id)
  );

  return (
    <div className="p-4 rounded shadow-sm" style={{ direction: "rtl" }}>
      {/* جدول البيانات الرئيسي المتصل بالـ API */}
      <TableComponent
        key={refreshKey}
        title="تقرير مسحوبات الموظفين"
        titleIcon={<FontAwesomeIcon icon={faTable} />}
        apiUrl="/employeewithdrawal"
        columns={columns}
        addBtn={true}
        addBtnName="سحب موظف"
        onAddClick={openAddModal}
        dropdownOptions={dropdownOptions}
        searchDate={false}
        triggerReload={refreshKey}
        transformRowFn={modifyRow}
      />

      {/* ================= مودال إضافة مسحوبات ================= */}
      <Modal show={showAddModal} onHide={closeAddModal} size="md" centered dir="rtl">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700 }}>
            إضافة مسحوبات موظف
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="grid grid-cols-2 gap-3">
            {/* حساب الدفع */}
            <div className="relative">
              <RegisterSelect
                id="receiver_account_id"
                label="حساب الخزينة / البنك"
                required
                value={addModalData.receiver_account_id}
                onChange={(e) =>
                  setAddModalData((prev) => ({
                    ...prev,
                    receiver_account_id: e.target.value,
                  }))
                }
                parentStyle={{ width: "100%" }}
                stylee={{ width: "100%" }}
                options={[
                  { value: "", label: "اختر حساب الدفع..." },
                  ...accounts.map((acc) => ({
                    value: acc.value,
                    label: acc.label,
                  })),
                ]}
              />
              {selectedAccountObj && (
                <small
                  className="text-success fw-bold d-block mt-1"
                  style={{ fontSize: "12px" }}
                >
                  الرصيد المتاح: {formatNumber(selectedAccountObj.balance)} ر.س
                </small>
              )}
            </div>

            {/* الموظف */}
            <RegisterSelect
              id="employee_id"
              label="الموظف"
              required
              value={addModalData.employee_id}
              onChange={(e) =>
                setAddModalData((prev) => ({
                  ...prev,
                  employee_id: e.target.value,
                }))
              }
              parentStyle={{ width: "100%" }}
              stylee={{ width: "100%" }}
              options={[
                { value: "", label: "اختر الموظف..." },
                ...employees.map((emp) => ({
                  value: emp.value,
                  label: emp.label,
                })),
              ]}
            />

            {/* المبلغ */}
            <RegisterTextbox
              id="amount"
              label="المبلغ"
              type="number"
              required
              placeholder="أدخل قيمة المبلغ المسحوب..."
              value={addModalData.value}
              onChange={(e) =>
                setAddModalData((prev) => ({ ...prev, value: e.target.value }))
              }
              parentStyle={{ width: "100%" }}
              stylee={{ width: "100%" }}
            />

            {/* تاريخ السحب */}
            <Form.Group className="responParent" controlId="withdrawal_date" style={{ width: "100%" }}>
              <Form.Label className="register-label" style={{ direction: "rtl" }}>
                تاريخ السحب <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="date"
                required
                className="register-textbox custom-datepicker"
                style={{
                  width: "100%",
                  height: "45px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                value={addModalData.date}
                onChange={(e) =>
                  setAddModalData((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </Form.Group>

            {/* الوصف */}
            <div className="col-span-2">
              <RegisterTextbox
                id="description"
                label="البيان / الوصف"
                type="text"
                placeholder="مثال: سلفة طارئة للموظف..."
                value={addModalData.description}
                onChange={(e) =>
                  setAddModalData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                parentStyle={{ width: "100%" }}
                stylee={{ width: "100%" }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeAddModal} disabled={isSubmitting}>
              إلغاء
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              style={{
                background: "linear-gradient(135deg, #c29a64 0%, #a87e45 100%)",
                border: "none",
                fontWeight: 600,
              }}
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ السحب"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ================= مودال التأكيد (حذف / اعتماد وصرف) ================= */}
      <Modal
        show={confirmModal.show}
        onHide={closeConfirmModal}
        size="md"
        centered
        dir="rtl"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700 }}>
            {confirmModal.type === "delete"
              ? "تأكيد الحذف"
              : "اعتماد وصرف المسحوبات"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-3">
          {confirmModal.type === "delete" ? (
            <p className="text-center text-danger my-3 font-semibold">
              هل أنت متأكد من رغبتك في حذف هذا السحب؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>
          ) : (
            <>
              <p style={{ margin: 0 }}>
                يرجى اختيار حساب الخزينة أو البنك الذي سيتم صرف المبلغ منه
                لاعتماد طلب السحب:
              </p>
              <RegisterSelect
                id="payment_account_id"
                label="حساب الخزينة / البنك للصرف"
                required
                value={confirmModal.payment_account_id}
                onChange={(e) =>
                  setConfirmModal((prev) => ({
                    ...prev,
                    payment_account_id: e.target.value,
                  }))
                }
                parentStyle={{ width: "100%" }}
                stylee={{ width: "100%" }}
                options={[
                  { value: "", label: "اختر حساب الدفع والصرف..." },
                  ...accounts.map((acc) => ({
                    value: acc.value,
                    label: acc.label,
                  })),
                ]}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirmModal} disabled={isSubmitting}>
            إلغاء
          </Button>
          <Button
            variant={confirmModal.type === "delete" ? "danger" : "success"}
            onClick={handleConfirmAction}
            disabled={isSubmitting}
            style={{ fontWeight: 600 }}
          >
            {isSubmitting
              ? "جاري الحفظ..."
              : confirmModal.type === "delete"
              ? "تأكيد الحذف"
              : "تأكيد الصرف والاعتماد"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ================= مودال عرض السند والطباعة ================= */}
      <Modal
        show={showReceiptModal}
        onHide={handleCloseReceiptModal}
        size="lg"
        centered
        dir="rtl"
      >
        <Modal.Header closeButton className="border-b border-gray-100 pb-3">
          <Modal.Title className="text-lg font-bold text-gray-800">
            سند صرف مسحوبات موظف
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-6">
          {selectedReceipt && (
            <div
              ref={receiptRef}
              dir="rtl"
              className="p-8 rounded-xl space-y-6 shadow-sm print:shadow-none print:border-none print:p-0"
              style={{ background: "#ffffff" }}
            >
              <div className="no-screen print-only">
                <PrintHead title={"سند صرف نقدي"} />
              </div>
              {/* هيدر السند */}
              <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-black mb-1" style={{ color: "#3a2e1d" }}>
                    سند صرف نقدي
                  </h2>
                  <p className="text-sm font-semibold text-amber-700 m-0">
                    مسحوبات وسلف موظفين
                  </p>
                </div>
                <div className="text-left px-4 py-2 rounded-lg border border-gray-200">
                  <span className="block text-xs font-semibold text-gray-500">رقم السند</span>
                  <span className="text-lg font-bold">
                    #{selectedReceipt.id}
                  </span>
                </div>
              </div>

              {/* تفاصيل السند */}
              <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                <div className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <span className="block text-xs text-gray-500 mb-1">تاريخ ووقت الصرف</span>
                  <span className="font-bold">
                    {selectedReceipt.date} — {selectedReceipt.time}
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <span className="block text-xs text-gray-500 mb-1">يُصرف للموظف</span>
                  <span className="font-bold">{selectedReceipt.employee}</span>
                </div>

                <div className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <span className="block text-xs text-gray-500 mb-1">من حساب</span>
                  <span className="font-bold">{selectedReceipt.account}</span>
                </div>

                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50">
                  <span className="block text-xs font-medium text-amber-800 mb-1">
                    المبلغ المدفوع
                  </span>
                  <span className="text-xl font-black text-amber-900">
                    {formatNumber(selectedReceipt.amount)}{" "}
                    <span className="text-xs font-normal">ر.س</span>
                  </span>
                </div>

                <div className="col-span-2 p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <span className="block text-xs text-gray-500 mb-1">البيان / الوصف</span>
                  <p className="font-semibold leading-relaxed m-0">
                    {selectedReceipt.description || "سلفة موظف"}
                  </p>
                </div>
              </div>

              {/* التواقيع */}
              <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-dashed border-gray-300 text-center text-sm">
                <div className="space-y-6">
                  <p className="font-bold">توقيع المستلم (الموظف)</p>
                  <div className="border-b border-gray-300 w-3/4 mx-auto"></div>
                </div>
                <div className="space-y-6">
                  <p className="font-bold">اعتماد الإدارة المالية</p>
                  <div className="border-b border-gray-300 w-3/4 mx-auto"></div>
                </div>
              </div>
              <div className="no-screen print-only">
                <PrintFooter />
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="border-t border-gray-100">
          <Button
            variant="secondary"
            onClick={handleCloseReceiptModal}
            className="px-4"
          >
            إغلاق
          </Button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 text-white font-medium rounded-lg shadow-sm transition-colors text-sm"
            style={{ background: "linear-gradient(135deg, #c29a64 0%, #a87e45 100%)", border: "none" }}
          >
            <FontAwesomeIcon icon={faPrint} />
            <span>طباعة السند</span>
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EmployeeWithdrawals;
