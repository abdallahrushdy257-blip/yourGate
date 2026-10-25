import React, { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../components/TableComponent";
import AdminLayout from "../../layouts/AdminLayouts";
import RegisterSelect from "../../components/RegisterSelect";
import {
  faFolderOpen,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import RegisterTextarea from "../../components/RegisterTextarea";
import API from "../../api/axiosConfig";

function PendingOrganizations(props) {
  const columns = [
    { name: "إسم الجمعية", key: "name" },
    { name: " رقم التسجيل  ", key: "registration_number" },
    { name: "  العنوان", key: "address" },
    { name: "رقم الجوال", key: "phone" },
    { name: "   البريد الالكتروني", key: "email" },
    { name: "  ممثل الجمعية", key: "representative" },
    { name: "", key: "actions" },
  ];
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const [id, setId] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState("");
  const [decision, setDecision] = useState("");

  const handleDownload = (selectedRows) => {
    const selectedData = rows.filter((row) => selectedRows.includes(row.id));
    if (selectedData.length === 0) {
      alert("Please select at least one row.");
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
        .join(","),
    );

    const csvContent = `${csvHeader}\n${csvRows.join("\n")}`;

    const bom = "\uFEFF";
    const finalContent = bom + csvContent;

    const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "selected_rows_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dropdownOptions = [
    { label: "عرض", route: "/organizationshow/:id" },
    {
      label: "القرار",
      action: (id, record) => {
        setId(id);
        setShowModal(true);
      },
    },
  ];

  const HandleDecision = async () => {
    setIsSubmitting(true);
    try {
      const response = await API.post(`/organization/${id}/update/status`, {
        status: decision,
        note,
      });
      const data = await response;
      if (data.status === 200) {
        setShowModal(false);
        setTableReloadKey(Date.now());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AdminLayout />
      <div className="printcasedata-container">
        <TableComponent
          apiUrl="/organization/pending"
          columns={columns}
          title="تقرير الجمعيات قيد المعالجة"
          titleIcon={<FontAwesomeIcon icon={faReceipt} />}
          dropdownOptions={dropdownOptions}
          searchDate={false}
          placeholderSearch="إسم الجمعية"
          triggerReload={tableReloadKey}
        />
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table small-modall archModal"
        dialogClassName="fit-content-modal"
      >
        <Modal.Header>
          <Modal.Title>إضافة قرار</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <RegisterSelect
            label="نوع القرار"
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            options={[
              { value: "", label: "اختر القرار" },
              { value: "2", label: "استبعاد" },
              { value: "1", label: "قبول" },
            ]}
          />
          <RegisterTextarea
            label="سبب الاستبعاد"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إغلاق
          </Button>
          {isSubmitting ? (
            <Button variant="primary" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button variant="primary" onClick={HandleDecision}>
              حفظ
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PendingOrganizations;
