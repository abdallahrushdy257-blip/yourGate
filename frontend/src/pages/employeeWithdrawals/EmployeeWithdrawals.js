import { useState, useEffect, useMemo, useRef } from "react";
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
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import TableComponent from "../../components/TableComponent";
import SelectComponent from "../../components/SelectComponent";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import PrintHead from "../../components/PrintHead";
import PrintFooter from "../../components/PrintFooter";

// ==========================================
// 📌 1. Static Dummy Data
// ==========================================
const DUMMY_EMPLOYEES = [
  { value: 1, label: "أحمد محمود" },
  { value: 2, label: "محمد علي" },
  { value: 3, label: "سارة حسن" },
];

const DUMMY_ACCOUNTS = [
  { value: 101, label: "الخزينة الرئيسية", balance: 50000 },
  { value: 102, label: "بنك مصر", balance: 120000 },
  { value: 103, label: "الخزينة الفرعية", balance: 15000 },
];

const DUMMY_WITHDRAWALS = [
  {
    uuid: "w1",
    id: 1,
    employee_id: 1,
    employee: "أحمد محمود",
    account: "الخزينة الرئيسية",
    amount: 1500,
    date: "2026-07-15",
    time: "10:30",
    withdrawal_date: "2026-07-15",
    status: 1,
    description: "سلفة طارئة",
  },
  {
    uuid: "w2",
    id: 2,
    employee_id: 2,
    employee: "محمد علي",
    account: "بنك مصر",
    amount: 3000,
    date: "2026-07-20",
    time: "14:15",
    withdrawal_date: "2026-07-20",
    status: 0,
    description: "مسحوبات شخصية",
  },
  {
    uuid: "w3",
    id: 3,
    employee_id: 3,
    employee: "سارة حسن",
    account: "الخزينة الفرعية",
    amount: 800,
    date: "2026-07-22",
    time: "09:00",
    withdrawal_date: "2026-07-22",
    status: 1,
    description: "بدل سفرية",
  },
];

const getStartOfCurrentMonthDate_Safe = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 2)
    .toISOString()
    .split("T")[0];
};

const getEndOfCurrentMonthDate_SuperSafe = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1)
    .toISOString()
    .split("T")[0];
};

const formatNumber = (num) => {
  if (num === null || num === undefined) return "";
  const formatted = Number(num).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
  return formatted;
};

function EmployeeWithdrawals() {
  const receiptRef = useRef();

  // States
  const [withdrawals, setWithdrawals] = useState([]);
  const [employees] = useState(DUMMY_EMPLOYEES);
  const [accounts] = useState(DUMMY_ACCOUNTS);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    employee: null,
    fromDate: getStartOfCurrentMonthDate_Safe(),
    toDate: getEndOfCurrentMonthDate_SuperSafe(),
    fromTime: "",
    toTime: "",
  });

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    type: null, // "delete" | "approve"
    row: null,
    payment_account_id: "",
  });

  const [addModalData, setAddModalData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().split(" ")[0].substring(0, 5),
    employeeName: null,
    receiver_account_id: "",
    value: "",
    description: "",
  });

  // Load Initial Data
  useEffect(() => {
    setLoading(true);
    const formattedData = DUMMY_WITHDRAWALS.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      statusText: item.status === 1 ? "معتمد" : "قيد الانتظار",
    }));
    setWithdrawals(formattedData);
    setLoading(false);
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
      payment_account_id: "",
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

  const openAddModal = () => setShowAddModal(true);

  const closeAddModal = () => {
    setAddModalData({
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().split(" ")[0].substring(0, 5),
      employeeName: null,
      receiver_account_id: "",
      value: "",
      description: "",
    });
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
    documentTitle: `سند_صرف_${selectedReceipt?.serialNumber || "سحب"}`,
  });

  // Submit Handler
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (
      !addModalData.employeeName ||
      !addModalData.receiver_account_id ||
      !addModalData.value
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const selectedAccount = accounts.find(
        (acc) => acc.value === Number(addModalData.receiver_account_id),
      );

      const newEntry = {
        uuid: `w-${Date.now()}`,
        id: withdrawals.length + 1,
        serialNumber: withdrawals.length + 1,
        employee_id: addModalData.employeeName.value,
        employee: addModalData.employeeName.label,
        account: selectedAccount?.label || "--",
        amount: Number(addModalData.value),
        date: addModalData.date,
        time: addModalData.time,
        withdrawal_date: addModalData.date,
        status: 1,
        statusText: "معتمد",
        description: addModalData.description || "مسحوبات شخصية",
      };

      setWithdrawals((prev) => [newEntry, ...prev]);
      toast.success("تم حفظ المسحوبات بنجاح");
      setIsSubmitting(false);
      closeAddModal();
    }, 400);
  };

  const handleConfirmAction = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (confirmModal.type === "delete") {
        setWithdrawals((prev) =>
          prev.filter((item) => item.uuid !== confirmModal.row.uuid),
        );
        toast.success("تم الحذف بنجاح");
      }

      if (confirmModal.type === "approve") {
        if (!confirmModal.payment_account_id) {
          toast.error("يرجى اختيار حساب الدفع");
          setIsSubmitting(false);
          return;
        }

        const selectedAccount = accounts.find(
          (acc) => acc.value === Number(confirmModal.payment_account_id),
        );

        setWithdrawals((prev) =>
          prev.map((item) =>
            item.uuid === confirmModal.row.uuid
              ? {
                  ...item,
                  status: 1,
                  account: selectedAccount?.label || item.account,
                  statusText: "معتمد",
                }
              : item,
          ),
        );
        toast.success("تم اعتماد المسحوبات بنجاح");
      }

      setIsSubmitting(false);
      closeConfirmModal();
    }, 400);
  };

  // Filtered List for Table
  const filteredWithdrawals = useMemo(() => {
    let result = withdrawals;

    if (filters.employee && filters.employee.value !== "all") {
      result = result.filter(
        (item) => item.employee_id === filters.employee.value,
      );
    }

    result = result.filter((item) => {
      const itemDate = item.date;
      const itemTime = item.time || "00:00";
      const itemDateTime = `${itemDate}T${itemTime}`;

      let minDateTime = filters.fromDate;
      if (filters.fromDate && filters.fromTime) {
        minDateTime = `${filters.fromDate}T${filters.fromTime}`;
      } else if (filters.fromDate) {
        minDateTime = `${filters.fromDate}T00:00`;
      }

      let maxDateTime = filters.toDate;
      if (filters.toDate && filters.toTime) {
        maxDateTime = `${filters.toDate}T${filters.toTime}`;
      } else if (filters.toDate) {
        maxDateTime = `${filters.toDate}T23:59`;
      }

      const isAfterFrom = !minDateTime || itemDateTime >= minDateTime;
      const isBeforeTo = !maxDateTime || itemDateTime <= maxDateTime;

      return isAfterFrom && isBeforeTo;
    });

    return result.map((item) => ({
      ...item,
      amountText: formatNumber(item.amount),
    }));
  }, [filters, withdrawals]);

  // Columns Configuration
  const columns = [
    { name: "م", key: "serialNumber" },
    { name: "اسم الموظف", key: "employee" },
    { name: "حساب الخزينة / البنك", key: "account" },
    { name: "قيمة المبلغ", key: "amountText" },
    { name: "تاريخ الطلب", key: "date" },
    { name: "وقت الطلب", key: "time" },
    { name: "تاريخ الصرف", key: "withdrawal_date" },
    { name: "الحالة", key: "statusText" },
    { name: "البيان / الوصف", key: "description" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions = [
    {
      label: "عرض السند",
      action: (id, record) => handleShowReceiptModal(record),
    },
    {
      label: "اعتماد وصرف",
      action: (id, record) => {
        if (record.status === 1) {
          toast.info("هذا الطلب معتمد وصُرف بالفعل");
        } else {
          openApproveModal(record);
        }
      },
    },
    {
      label: "حذف",
      action: (id, record) => openDeleteModal(record),
    },
  ];

  const selectedAccountObj = accounts.find(
    (acc) => acc.value === Number(addModalData.receiver_account_id),
  );

  return (
    <div className="p-4 rounded shadow-sm">
      {/* جدول البيانات الرئيسي */}
      <TableComponent
        title="تقرير مسحوبات الموظفين"
        titleIcon={<FontAwesomeIcon icon={faTable} />}
        data={filteredWithdrawals}
        columns={columns}
        addBtn={true}
        addBtnName="سحب موظف"
        onAddClick={openAddModal}
        dropdownOptions={dropdownOptions}
        searchDate={false}
      />

      {/* ================= مودال إضافة مسحوبات ================= */}
      <Modal show={showAddModal} onHide={closeAddModal} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>إضافة مسحوبات موظف</Modal.Title>
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
                className="text-success fw-bold absolute -bottom-2 left-0 right-0"
                style={{ marginTop: "-10px" }}
              >
                الرصيد الحالي: {formatNumber(selectedAccountObj.balance)} ج.م
              </small>
            )}
            </div>

            {/* الموظف */}
            {/* الموظف */}
<RegisterSelect
  id="employeeName"
  label="الموظف"
  required
  value={addModalData.employeeName?.value || addModalData.employeeName || ""}
  onChange={(e) => {
    // في حال كانت المكون يرجع Event عادي أو Object مباشر
    const selectedVal = e.target ? e.target.value : e;
    const selectedEmp = employees.find((emp) => emp.value === Number(selectedVal) || emp.value === selectedVal);
    
    setAddModalData((prev) => ({
      ...prev,
      employeeName: selectedEmp || selectedVal,
    }));
  }}
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
            {/* <Form.Group>
              <Form.Label style={{ color: "var(--text-color)" }}>الموظف <span className="text-danger">*</span></Form.Label>
              <SelectComponent
                placeholder="اختر الموظف..."
                options={employees}
                value={addModalData.employeeName}
                onChange={(selectedOption) =>
                  setAddModalData((prev) => ({ ...prev, employeeName: selectedOption }))
                }
              />
            </Form.Group> */}

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

            <div className="responParent">
              <p style={{ width: "100%", textAlign: "right" }} className="mb-1">
                تاريخ السحب
              </p>
              <input
                style={{ width: "100%" }}
                type="date"
                className="custom-datepicker mb-3"
                value={addModalData.date}
                onChange={(e) =>
                  setAddModalData({ ...addModalData, date: e.target.value })
                }
              />
            </div>
            {/* الوصف */}
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
          </Modal.Body>
          <Modal.Footer>
            <Button  className="my-3" variant="secondary" onClick={closeAddModal}>
              إلغاء
            </Button>
            <Button  className="my-3" variant="primary" type="submit" disabled={isSubmitting}>
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
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {confirmModal.type === "delete"
              ? "تأكيد الحذف"
              : "اعتماد وصرف المسحوبات"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-3">
          {confirmModal.type === "delete" ? (
            <p className="text-center text-danger my-3">
              هل أنت متأكد من رغبتك في حذف هذا السحب؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>
          ) : (
            <>
              <p>
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
          <Button variant="secondary" onClick={closeConfirmModal}>
            إلغاء
          </Button>
          <Button
            variant={confirmModal.type === "delete" ? "danger" : "success"}
            onClick={handleConfirmAction}
            disabled={isSubmitting}
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
      >
        <Modal.Header closeButton className="border-b border-gray-100 pb-3">
          <Modal.Title className="text-lg font-bold text-gray-800">
            سند صرف مسحوبات موظف
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-6">
          {selectedReceipt && (
            /* هذا الجزء هو الذي سيُطبع فقط عبر الـ Ref */
            <div
              ref={receiptRef}
              dir="rtl"
              className="p-8 rounded-xl space-y-6 shadow-sm print:shadow-none print:border-none print:p-0"
            >
              <div className="no-screen print-only">
                <PrintHead title={"title"} />
              </div>
              {/* هيدر السند */}
              <div className="flex justify-between items-center pb-6">
                <div>
                  <h2 className="text-2xl font-black mb-1">سند صرف نقدي</h2>
                  <p className="text-sm font-medium text-amber-700">
                    مسحوبات موظفين
                  </p>
                </div>
                <div className="text-left  px-4 py-2 rounded-lg border border-gray-100">
                  <span className="block text-xs font-semibold">رقم السند</span>
                  <span className="text-lg font-bold">
                    #{selectedReceipt.serialNumber}
                  </span>
                </div>
              </div>

              {/* تفاصيل السند */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3  rounded-lg border border-gray-100">
                  <span className="block text-xs mb-1">تاريخ ووقت الصرف</span>
                  <span className="font-bold ">
                    {selectedReceipt.date} — {selectedReceipt.time}
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-gray-100">
                  <span className="block text-xs mb-1">يُصرف للموظف</span>
                  <span className="font-bold">{selectedReceipt.employee}</span>
                </div>

                <div className="p-3 rounded-lg border border-gray-100">
                  <span className="block text-xs mb-1">من حساب</span>
                  <span className="font-bold ">{selectedReceipt.account}</span>
                </div>

                <div className="p-3 rounded-lg border border-amber-200/60">
                  <span className="block text-xs font-medium mb-1">
                    المبلغ المدفوع
                  </span>
                  <span className="text-xl font-black text-red-500">
                    {formatNumber(selectedReceipt.amount)}{" "}
                    <span className="text-xs font-normal">ج.م</span>
                  </span>
                </div>

                <div className="col-span-2 p-3 rounded-lg border border-gray-100">
                  <span className="block text-xs mb-1">البيان / الوصف</span>
                  <p className="font-semibold leading-relaxed m-0">
                    {selectedReceipt.description || "بدون بيان"}
                  </p>
                </div>
              </div>

              {/* التواقيع */}
              <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-dashed border-gray-300 text-center text-sm">
                <div className="space-y-8">
                  <p className="font-bold">توقيع المستلم (الموظف)</p>
                  <div className="border-b border-gray-300 w-3/4 mx-auto"></div>
                </div>
                <div className="space-y-8">
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
            className="inline-flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-sm transition-colors text-sm"
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
