import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faXmark, faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../../../components/TableComponent";
import { toLocal } from "../../../../shared/Utils/toLocal";
import { Modal, Button } from "react-bootstrap";
import API from "../../../../api/axiosConfig";
import TestPreLoader from "../../../common/pages/TestPreLoader/TestPreLoader";
import PrintHead from "../../../../components/PrintHead";
import PrintFooter from "../../../../components/PrintFooter";

function DonationsReport() {
  const columns = [
    { name: "إسم المانح", key: "donor_name" },
    { name: "رقم الجوال", key: "donor_phone" },
    { name: "اجمالي المدفوعات", key: "amount" },
    { name: "", key: "actions" },
  ];

  const [rows, setRows] = useState([]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [receiptLoading, setReceiptLoading] = useState(false);

  const handleDownload = (selectedRows) => {
    const selectedData = rows.filter((row) => selectedRows.includes(row.id));
    if (selectedData.length === 0) {
      alert("الرجاء اختيار صف واحد على الأقل.");
      return;
    }
    const csvHeader = columns
      .filter((col) => col.key !== "actions")
      .map((col) => col.name)
      .join(",");
    const csvRows = selectedData.map((row) =>
      columns
        .filter((col) => col.key !== "actions")
        .map((col) => `"${row[col.key] || ""}"`)
        .join(",")
    );
    const csvContent = `${csvHeader}\n${csvRows.join("\n")}`;
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "donations_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShowReceipt = async (id) => {
    setReceiptLoading(true);
    setShowReceiptModal(true);
    try {
      const res = await API.get(`/shoptransaction/${id}/assembly`);
      setReceiptData(res.data);
    } catch (error) {
      console.error("Failed to load receipt:", error);
      setReceiptData(null);
    } finally {
      setReceiptLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const dropdownOptions = [
    { label: "تفاصيل المدفوعات", route: "/donationdetails/:id" },
    {
      label: "عرض إيصال",
      action: (id) => handleShowReceipt(id),
    },
  ];

  const modifyRow = (row) => ({
    ...row,
    amount: toLocal(row.amount) + " ريال",
  });

  return (
    <>
      <div className="printcasedata-container">
        <TableComponent
          apiUrl="/shoptransaction/case/totalrecieved"
          columns={columns}
          title="تقرير مدفوعات المانحون"
          titleIcon={<FontAwesomeIcon icon={faFileInvoiceDollar} />}
          dropdownOptions={dropdownOptions}
          transformRowFn={modifyRow}
          onDownload={handleDownload}
          searchTextProp={true}
          searchDate={false}
        />
      </div>

      {/* Receipt Modal */}
      <Modal
        show={showReceiptModal}
        onHide={() => setShowReceiptModal(false)}
        className="modal-table archModal"
        centered
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>
            <FontAwesomeIcon icon={faFileInvoiceDollar} className="me-2" />
            إيصال سند قبض
          </Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowReceiptModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body style={{ direction: "rtl" }}>
          {receiptLoading ? (
            <div className="d-flex justify-content-center p-5">
              <TestPreLoader />
            </div>
          ) : receiptData ? (
            <>
              {/* Screen View */}
              <div className="no-print">
                <div className="receipt-modal-content">
                  <div className="text-center mb-4">
                    <PrintHead />
                    <h4 style={{ color: "#8a642e", fontWeight: "800", marginTop: "12px" }}>
                      سند قبض
                    </h4>
                    {receiptData.invoice_number && (
                      <p style={{ color: "#7a6e5d", fontSize: "14px" }}>
                        رقم السند: <strong>{receiptData.invoice_number}</strong>
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      padding: "20px",
                      background: "#faf7f2",
                      borderRadius: "16px",
                      border: "1px solid #ebdccb",
                    }}
                  >
                    <div className="receipt-field">
                      <span style={{ color: "#7a6e5d", fontSize: "13px", fontWeight: "600" }}>
                        المبلغ المستلم
                      </span>
                      <span style={{ color: "#382f22", fontSize: "16px", fontWeight: "800" }}>
                        {toLocal(receiptData.amount)} ريال
                      </span>
                    </div>
                    <div className="receipt-field">
                      <span style={{ color: "#7a6e5d", fontSize: "13px", fontWeight: "600" }}>
                        تاريخ التحويل
                      </span>
                      <span style={{ color: "#382f22", fontSize: "15px", fontWeight: "700" }}>
                        {receiptData.date}
                      </span>
                    </div>
                    <div className="receipt-field">
                      <span style={{ color: "#7a6e5d", fontSize: "13px", fontWeight: "600" }}>
                        طريقة التحويل
                      </span>
                      <span style={{ color: "#382f22", fontSize: "15px", fontWeight: "700" }}>
                        {receiptData.transaction_type_string || "—"}
                      </span>
                    </div>
                    <div className="receipt-field">
                      <span style={{ color: "#7a6e5d", fontSize: "13px", fontWeight: "600" }}>
                        مقابل
                      </span>
                      <span style={{ color: "#382f22", fontSize: "15px", fontWeight: "700" }}>
                        {receiptData.description || "—"}
                      </span>
                    </div>
                    {receiptData.donor_name && (
                      <div className="receipt-field" style={{ gridColumn: "1 / -1" }}>
                        <span style={{ color: "#7a6e5d", fontSize: "13px", fontWeight: "600" }}>
                          إسم المانح
                        </span>
                        <span style={{ color: "#382f22", fontSize: "15px", fontWeight: "700" }}>
                          {receiptData.donor_name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Print Only */}
              <div className="print-only receipt-print-container">
                <div className="receipt-print-box">
                  <div className="receipt-print-header">
                    <h2>سند قبض</h2>
                    <div className="receipt-invoice-num">
                      رقم السند: <span>{receiptData.invoice_number}</span>
                    </div>
                  </div>
                  <div className="receipt-print-grid">
                    <div className="receipt-print-field">
                      <span className="receipt-field-label">المبلغ المستلم</span>
                      <span className="receipt-field-value">
                        {receiptData.amount} ريال
                      </span>
                    </div>
                    <div className="receipt-print-field">
                      <span className="receipt-field-label">تاريخ التحويل</span>
                      <span className="receipt-field-value">{receiptData.date}</span>
                    </div>
                    <div className="receipt-print-field">
                      <span className="receipt-field-label">طريقة التحويل</span>
                      <span className="receipt-field-value">
                        {receiptData.transaction_type_string}
                      </span>
                    </div>
                    <div className="receipt-print-field">
                      <span className="receipt-field-label">مقابل</span>
                      <span className="receipt-field-value">
                        {receiptData.description}
                      </span>
                    </div>
                  </div>
                  <div className="receipt-print-signatures">
                    <div className="receipt-signature-box">
                      <span>توقيع المستلم</span>
                      <div className="receipt-signature-line"></div>
                    </div>
                    <div className="receipt-signature-box">
                      <span>توقيع المسؤول</span>
                      <div className="receipt-signature-line"></div>
                    </div>
                  </div>
                </div>
                <PrintFooter />
              </div>
            </>
          ) : (
            <div className="text-center p-5">
              <p style={{ color: "#c62828" }}>لم يتم العثور على بيانات الإيصال</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="no-print">
          <Button variant="secondary" onClick={() => setShowReceiptModal(false)}>
            إغلاق
          </Button>
          {receiptData && (
            <Button
              variant="primary"
              onClick={handlePrintReceipt}
              style={{
                background: "linear-gradient(135deg, #b89358 0%, #946f36 100%)",
                border: "none",
                borderRadius: "10px",
              }}
            >
              <FontAwesomeIcon icon={faPrint} className="me-2" />
              طباعة الإيصال
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DonationsReport;
