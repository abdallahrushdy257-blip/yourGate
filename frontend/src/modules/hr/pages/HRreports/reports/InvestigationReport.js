import { useState } from "react";
import TableComponent from "../../../../../components/TableComponent";
import "../hrreports.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import API from "../../../../../api/axiosConfig";
import InvestigationsModal from "../../Investigations/Investigations";

function InvestigationReport() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التحقيق الإداري؟")) return;
    try {
      const res = await API.delete(`/investigations/${id}`);
      if (res.data?.success || res.status === 200) {
        toast.success("تم حذف التحقيق بنجاح");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error deleting investigation:", err);
      toast.error("فشل في حذف التحقيق");
    }
  };

  const handleEdit = (record) => {
    setEditingRow(record);
    setShowAddModal(true);
  };

  const columns = [
    { name: "إسم المحقق", key: "investigator" },
    { name: "إسم المحقق معه", key: "name" },
    { name: "السبب", key: "reason" },
    { name: "الوصف", key: "description" },
    { name: "التاريخ", key: "date" },
    { name: "النتيجة", key: "result" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions = [
    {
      label: "تعديل",
      action: (id, record) => handleEdit(record),
    },
    {
      label: "حذف",
      action: (id) => handleDelete(id),
    },
  ];

  const handleSuccessAdd = () => {
    setShowAddModal(false);
    setEditingRow(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingRow(null);
  };

  const modifyRow = (row) => {
    let newRow = { ...row };
    newRow.investigator = row.investigator || "-";
    newRow.name = row.name || row.employee?.name || "-";
    newRow.reason = row.reason || "-";
    newRow.description = row.description || "-";
    newRow.result = row.result || "-";
    newRow.date = row.date ? row.date.substring(0, 10) : "-";
    return newRow;
  };

  return (
    <>
      <div className="hrReports-tabel">
        <TableComponent
          key={refreshKey}
          addBtn={true}
          onAddClick={() => {
            setEditingRow(null);
            setShowAddModal(true);
          }}
          apiUrl="/investigations"
          columns={columns}
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          title="تقارير التحقيقات الادارية"
          dropdownOptions={dropdownOptions}
          transformRowFn={modifyRow}
          search
          searchDate
        />
      </div>

      {/* مودال إضافة وتعديل تحقيق */}
      <InvestigationsModal
        show={showAddModal}
        handleClose={handleCloseModal}
        onSuccess={handleSuccessAdd}
        initialData={editingRow}
      />
    </>
  );
}

export default InvestigationReport;