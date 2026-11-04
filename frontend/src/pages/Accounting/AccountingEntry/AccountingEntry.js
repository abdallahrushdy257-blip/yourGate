import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import {
  faTable,
  faPlus,
  faTrash,
  faXmark,
  faCheckCircle,
  faExclamationTriangle,
  faScaleBalanced,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Spinner } from "react-bootstrap";
import API from "../../../api/axiosConfig";
import TableComponent from "../../../components/TableComponent";
import "./AccountingEntry.css";

const createEmptyRow = () => ({
  id: Math.random().toString(36).substr(2, 9),
  account_id: "",
  debit: "",
  credit: "",
  description: "",
});

function AccountingEntry() {
  const [payable, setPayable] = useState([]);
  const [triggerReload, setTriggerReload] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState([createEmptyRow(), createEmptyRow()]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch leaf payable accounts for dropdowns
  const getAllPayableAccounts = useCallback(async () => {
    setLoadingAccounts(true);
    try {
      const response = await API.get("/accounttree/entry");
      const data = response.data;
      const list = Array.isArray(data) ? data : (data?.data || []);

      const formattedOptions = list.map((acc) => ({
        value: acc.id,
        label: `${acc.code} - ${acc.name}`,
        code: acc.code,
        name: acc.name,
      }));

      setPayable(formattedOptions);
    } catch (error) {
      console.error("Error fetching payable accounts:", error);
    } finally {
      setLoadingAccounts(false);
    }
  }, []);

  useEffect(() => {
    getAllPayableAccounts();
  }, [getAllPayableAccounts]);

  // Live Calculations
  const totalDebit = useMemo(() => {
    return rows.reduce((sum, r) => sum + (parseFloat(r.debit) || 0), 0);
  }, [rows]);

  const totalCredit = useMemo(() => {
    return rows.reduce((sum, r) => sum + (parseFloat(r.credit) || 0), 0);
  }, [rows]);

  const difference = useMemo(() => {
    return Math.abs(totalDebit - totalCredit);
  }, [totalDebit, totalCredit]);

  const isBalanced = useMemo(() => {
    return totalDebit > 0 && difference < 0.001;
  }, [totalDebit, difference]);

  // Row Manipulation
  const handleAddRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  const handleRemoveRow = (index) => {
    if (rows.length <= 2) {
      alert("يجب أن يحتوي القيد المحاسبي على طرفين (سطرين) على الأقل.");
      return;
    }
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRowChange = (index, field, value) => {
    setRows((prev) => {
      const updated = [...prev];
      const targetRow = { ...updated[index] };

      if (field === "debit") {
        targetRow.debit = value;
        if (value && parseFloat(value) > 0) {
          targetRow.credit = "";
        }
      } else if (field === "credit") {
        targetRow.credit = value;
        if (value && parseFloat(value) > 0) {
          targetRow.debit = "";
        }
      } else {
        targetRow[field] = value;
      }

      updated[index] = targetRow;
      return updated;
    });
  };

  // Reset form to blank
  const resetForm = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setDescription("");
    setRows([createEmptyRow(), createEmptyRow()]);
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(false);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  // Submit Create Entry
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (totalDebit === 0 && totalCredit === 0) {
      setErrorMessage("من فضلك أدخل مبالغ المدين والدائن قبل الحفظ.");
      return;
    }

    if (!isBalanced) {
      setErrorMessage(`القيد غير متوازن! يوجد فرق مقداره ${difference.toFixed(2)} ج.م بين المدين والدائن.`);
      return;
    }

    const activeRows = rows.filter(
      (r) => (parseFloat(r.debit) || 0) > 0 || (parseFloat(r.credit) || 0) > 0
    );

    if (activeRows.length < 2) {
      setErrorMessage("يجب تسجيل سطرين على الأقل يحتويان على مبالغ محاسبية.");
      return;
    }

    const invalidAccount = activeRows.some((r) => !r.account_id);
    if (invalidAccount) {
      setErrorMessage("يرجى اختيار الحساب لكل سطر يحتوي على مبلغ مالي.");
      return;
    }

    const payload = {
      date: date,
      description: description || "قيد محاسبي يدوي",
      lines: activeRows.map((r, idx) => ({
        account_id: parseInt(r.account_id, 10),
        debit: parseFloat(r.debit) || 0,
        credit: parseFloat(r.credit) || 0,
        description: r.description || description || `طرف قيد ${idx + 1}`,
      })),
    };

    setIsSubmitting(true);
    try {
      const response = await API.post("/transactions/generalentry", payload);
      const data = response.data;

      if (response.status === 200 || response.status === 201 || data.status === 200 || data.success) {
        setShowModal(false);
        resetForm();
        setTriggerReload((prev) => !prev);
      } else {
        setErrorMessage(data.message || "حدث خطأ أثناء حفظ القيد.");
      }
    } catch (err) {
      console.error("Error creating journal entry:", err);
      const backendMsg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" - ")
          : "تعذر حفظ القيد المحاسبي. يرجى التحقق من صحة البيانات.");
      setErrorMessage(backendMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = async (id, record) => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(false);

    try {
      const res = await API.get(`/transactions/${id}`);
      const entryData = res.data;
      setSelectedEntry(entryData);
      setDate(entryData.date || new Date().toISOString().split("T")[0]);
      setDescription(entryData.description || "");

      if (entryData.lines && entryData.lines.length > 0) {
        setRows(
          entryData.lines.map((l) => ({
            id: l.id || Math.random().toString(36).substr(2, 9),
            account_id: l.account_id || l.account?.id || "",
            debit: l.debit > 0 ? l.debit : "",
            credit: l.credit > 0 ? l.credit : "",
            description: l.description || "",
          }))
        );
      } else {
        setRows([createEmptyRow(), createEmptyRow()]);
      }
      setShowEditModal(true);
    } catch (err) {
      console.error("Error loading entry details:", err);
      alert("تعذر تحميل تفاصيل القيد للتعديل.");
    }
  };

  // Submit Edit
  const handleUpdate = async () => {
    if (!selectedEntry) return;
    setErrorMessage("");
    setSuccessMessage("");

    if (!isBalanced) {
      setErrorMessage(`القيد غير متوازن! يوجد فرق مقداره ${difference.toFixed(2)} ج.م`);
      return;
    }

    const activeRows = rows.filter(
      (r) => (parseFloat(r.debit) || 0) > 0 || (parseFloat(r.credit) || 0) > 0
    );

    if (activeRows.length < 2) {
      setErrorMessage("يجب تسجيل سطرين على الأقل يحتويان على مبالغ محاسبية.");
      return;
    }

    const invalidAccount = activeRows.some((r) => !r.account_id);
    if (invalidAccount) {
      setErrorMessage("يرجى اختيار الحساب لكل سطر يحتوي على مبلغ مالي.");
      return;
    }

    const payload = {
      date: date,
      description: description,
      lines: activeRows.map((r, idx) => ({
        account_id: parseInt(r.account_id, 10),
        debit: parseFloat(r.debit) || 0,
        credit: parseFloat(r.credit) || 0,
        description: r.description || description || `طرف قيد ${idx + 1}`,
      })),
    };

    setIsSubmitting(true);
    try {
      const res = await API.put(`/transactions/${selectedEntry.id}`, payload);
      if (res.status === 200 || res.data?.status === 200 || res.data?.success) {
        setShowEditModal(false);
        resetForm();
        setTriggerReload((prev) => !prev);
      } else {
        setErrorMessage(res.data?.message || "حدث خطأ أثناء تعديل القيد.");
      }
    } catch (err) {
      console.error("Error updating journal entry:", err);
      const backendMsg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" - ")
          : "تعذر تعديل القيد المحاسبي.");
      setErrorMessage(backendMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (id, record) => {
    setSelectedEntry(record || { id });
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!selectedEntry) return;
    try {
      await API.delete(`/transactions/${selectedEntry.id}`);
      setShowDeleteModal(false);
      setSelectedEntry(null);
      setTriggerReload((prev) => !prev);
    } catch (err) {
      console.error("Error deleting entry:", err);
      alert("تعذر حذف القيد المحاسبي.");
    }
  };

  // Table Columns
  const tableColumns = [
    { name: "رقم القيد", key: "entry_number" },
    { name: "التاريخ", key: "date" },
    { name: "البيان / الوصف", key: "description" },
    { name: "إجمالي المدين", key: "formatted_debit" },
    { name: "إجمالي الدائن", key: "formatted_credit" },
    { name: "الحالة", key: "status_badge" },
    { name: "الإجراءات", key: "actions" },
  ];

  const transformRow = (row) => {
    const regNo = row.entry_number || row.registration_number || `#${row.id}`;
    const debitVal = parseFloat(row.total_debit ?? row.debt_amount ?? 0);
    const creditVal = parseFloat(row.total_credit ?? row.credit_amount ?? 0);
    const isPosted = row.status === "posted" || !row.status;

    return {
      ...row,
      entry_number: `<strong>${regNo}</strong>`,
      description: row.description || "—",
      formatted_debit: `<span class="badge bg-light text-dark fw-bold px-2 py-1 border">${debitVal.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م</span>`,
      formatted_credit: `<span class="badge bg-light text-dark fw-bold px-2 py-1 border">${creditVal.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م</span>`,
      status_badge: isPosted
        ? `<span class="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill">مرحل</span>`
        : `<span class="badge bg-warning-subtle text-warning border border-warning px-3 py-2 rounded-pill">مسودة</span>`,
    };
  };

  const dropdownOptions = [
    {
      label: "عرض تفاصيل القيد",
      route: "/accountingentryview/:id",
    },
    {
      label: "تعديل القيد",
      action: (id, record) => handleOpenEdit(id, record),
    },
    {
      label: "حذف القيد",
      action: (id, record) => handleOpenDelete(id, record),
    },
  ];

  // Helper render for Entry Form (used in both Add & Edit modals)
  const renderEntryForm = (isEdit = false) => (
    <div className="accounting-entry-modal-body">
      {/* Top Meta Details */}
      <div className="entry-header-row mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label fw-bold">
              تاريخ القيد <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className="form-control luxury-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="col-md-8">
            <label className="form-label fw-bold">البيان / الوصف العام للقيد</label>
            <input
              type="text"
              className="form-control luxury-input"
              placeholder="مثال: إثبات إيداع رأس المال أو سداد مصروفات..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Rows Table */}
      <div className="table-responsive lines-table-wrapper mb-3">
        <table className="table table-bordered table-hover align-middle lines-table">
          <thead>
            <tr>
              <th style={{ width: "38%" }}>الحساب المحاسبي <span className="text-danger">*</span></th>
              <th style={{ width: "24%" }}>البيان / شرح السطر</th>
              <th style={{ width: "16%" }}>مدين (Debit)</th>
              <th style={{ width: "16%" }}>دائن (Credit)</th>
              <th style={{ width: "6%", textAlign: "center" }}>حذف</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id || index}>
                <td>
                  <select
                    className="form-select luxury-select"
                    value={row.account_id}
                    onChange={(e) => handleRowChange(index, "account_id", e.target.value)}
                  >
                    <option value="">-- اختر الحساب (الرمز - الاسم) --</option>
                    {payable.map((acc) => (
                      <option key={acc.value} value={acc.value}>
                        {acc.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control luxury-input-sm"
                    placeholder="بيان خاص بالسطر..."
                    value={row.description}
                    onChange={(e) => handleRowChange(index, "description", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-control luxury-input-sm text-center fw-bold ${row.debit > 0 ? "border-primary-amount" : ""}`}
                    placeholder="0.00"
                    value={row.debit}
                    onChange={(e) => handleRowChange(index, "debit", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-control luxury-input-sm text-center fw-bold ${row.credit > 0 ? "border-primary-amount" : ""}`}
                    placeholder="0.00"
                    value={row.credit}
                    onChange={(e) => handleRowChange(index, "credit", e.target.value)}
                  />
                </td>
                <td className="text-center">
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm rounded-circle line-delete-btn"
                    title="حذف السطر"
                    onClick={() => handleRemoveRow(index)}
                    disabled={rows.length <= 2}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Row Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          type="button"
          className="btn btn-outline-primary luxury-add-row-btn"
          onClick={handleAddRow}
        >
          <FontAwesomeIcon icon={faPlus} className="ms-2" />
          إضافة طرف / سطر جديد
        </button>
        <span className="text-muted small">
          عدد الأطراف المسجلة: <strong>{rows.length}</strong>
        </span>
      </div>

      {/* Live Financial Balance Indicator Card */}
      <div className="balance-summary-card p-3 rounded-4 shadow-sm mb-3">
        <div className="row text-center align-items-center g-2">
          <div className="col-md-3">
            <div className="balance-box p-2 rounded-3 bg-white border">
              <span className="text-muted small d-block">إجمالي المدين</span>
              <span className="fw-bold fs-5 text-primary">
                {totalDebit.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
              </span>
            </div>
          </div>
          <div className="col-md-3">
            <div className="balance-box p-2 rounded-3 bg-white border">
              <span className="text-muted small d-block">إجمالي الدائن</span>
              <span className="fw-bold fs-5 text-primary">
                {totalCredit.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
              </span>
            </div>
          </div>
          <div className="col-md-3">
            <div className="balance-box p-2 rounded-3 bg-white border">
              <span className="text-muted small d-block">الفرق (التباين)</span>
              <span className={`fw-bold fs-5 ${difference < 0.001 ? "text-success" : "text-danger"}`}>
                {difference.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
              </span>
            </div>
          </div>
          <div className="col-md-3">
            <div className="balance-status-box h-100 d-flex align-items-center justify-content-center">
              {isBalanced ? (
                <div className="alert alert-success d-flex align-items-center mb-0 py-2 px-3 rounded-pill border-0 shadow-sm">
                  <FontAwesomeIcon icon={faCheckCircle} className="ms-2 fs-5" />
                  <strong>القيد متوازن ✅</strong>
                </div>
              ) : (
                <div className="alert alert-danger d-flex align-items-center mb-0 py-2 px-3 rounded-pill border-0 shadow-sm">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="ms-2 fs-5" />
                  <strong>غير متوازن ⚠️</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {errorMessage && (
        <div className="alert alert-danger d-flex align-items-center py-2 px-3 rounded-3 mt-2" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="ms-2" />
          <div>{errorMessage}</div>
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success d-flex align-items-center py-2 px-3 rounded-3 mt-2" role="alert">
          <FontAwesomeIcon icon={faCheckCircle} className="ms-2" />
          <div>{successMessage}</div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Create Journal Entry Modal */}
      <Modal
        className="custom-modal-alt accountingModal luxury-entry-modal"
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="xl"
      >
        <Modal.Header className="modal-header-luxury">
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faScaleBalanced} className="text-primary fs-4" />
            <Modal.Title className="fw-bold fs-5 mb-0">إنشاء قيد محاسبي جديد</Modal.Title>
          </div>
          <button
            type="button"
            className="btn-close luxury-close-btn"
            onClick={() => setShowModal(false)}
            aria-label="Close"
          ></button>
        </Modal.Header>
        <Modal.Body>{renderEntryForm(false)}</Modal.Body>
        <Modal.Footer className="modal-footer-luxury">
          <Button
            variant="primary"
            className="luxury-submit-btn px-4"
            onClick={handleSubmit}
            disabled={!isBalanced || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" animation="border" className="ms-2" />
                جاري الحفظ والترحيل...
              </>
            ) : (
              "حفظ القيد المحاسبي"
            )}
          </Button>
          <Button
            variant="secondary"
            className="luxury-cancel-btn px-4"
            onClick={() => setShowModal(false)}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Journal Entry Modal */}
      <Modal
        className="custom-modal-alt accountingModal luxury-entry-modal"
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        size="xl"
      >
        <Modal.Header className="modal-header-luxury">
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faScaleBalanced} className="text-primary fs-4" />
            <Modal.Title className="fw-bold fs-5 mb-0">
              تعديل القيد المحاسبي (رقم: {selectedEntry?.entry_number || selectedEntry?.registration_number || selectedEntry?.id})
            </Modal.Title>
          </div>
          <button
            type="button"
            className="btn-close luxury-close-btn"
            onClick={() => setShowEditModal(false)}
            aria-label="Close"
          ></button>
        </Modal.Header>
        <Modal.Body>{renderEntryForm(true)}</Modal.Body>
        <Modal.Footer className="modal-footer-luxury">
          <Button
            variant="primary"
            className="luxury-submit-btn px-4"
            onClick={handleUpdate}
            disabled={!isBalanced || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" animation="border" className="ms-2" />
                جاري حفظ التعديلات...
              </>
            ) : (
              "حفظ التعديلات"
            )}
          </Button>
          <Button
            variant="secondary"
            className="luxury-cancel-btn px-4"
            onClick={() => setShowEditModal(false)}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        className="custom-delete-modal accountingModal"
      >
        <Modal.Header className="border-0 justify-content-center pt-4">
          <div className="delete-warning-icon-wrapper rounded-circle p-3 bg-danger-subtle text-danger">
            <FontAwesomeIcon icon={faTrash} size="2x" />
          </div>
        </Modal.Header>
        <Modal.Body className="text-center px-4">
          <h5 className="fw-bold mb-3">تأكيد حذف القيد المحاسبي</h5>
          <p className="text-muted">
            هل أنت متأكد من رغبتك في حذف القيد رقم{" "}
            <strong>
              {selectedEntry?.entry_number || selectedEntry?.registration_number || selectedEntry?.id}
            </strong>
            ؟ سيتم حذف كافة الحركات المالية المرتبطة به.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center pb-4">
          <Button
            variant="danger"
            className="px-4 rounded-pill shadow-sm"
            onClick={handleConfirmDelete}
          >
            نعم، حذف القيد
          </Button>
          <Button
            variant="secondary"
            className="px-4 rounded-pill shadow-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            إلغاء
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Page Body Container */}
      <div className="AccountingEntry-container">
        <div className="form-acc">
          <div className="d-flex align-items-center justify-content-center mb-4">
            <Title
              className="اسم الحساب"
              title="دليل القيود المحاسبية"
              icon={<FontAwesomeIcon icon={faTable} />}
            />
          </div>

          {/* TableComponent with Data */}
          <TableComponent
            apiUrl="/transactions"
            columns={tableColumns}
            addBtn={true}
            addBtnName="قيد محاسبي جديد"
            onAddClick={handleOpenCreate}
            dropdownOptions={dropdownOptions}
            transformRowFn={transformRow}
            triggerReload={triggerReload}
          />
        </div>
      </div>
    </>
  );
}

export default AccountingEntry;
