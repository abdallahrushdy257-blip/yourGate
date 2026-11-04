import { useState } from "react";
import TableComponent from "../../../components/TableComponent";
import "../hrreports.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import API from "../../../api/axiosConfig";
import DiscountsModal from "../../Discounts/Discounts";

function DeductionReport() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  const columns = [
    { name: "اسم الموظف", key: "name" },
    { name: "النوع", key: "type" },
    { name: "السبب", key: "reason" },
    { name: "التاريخ", key: "date" },
    { name: "نوع القيمة", key: "amounttype" },
    { name: "القيمة", key: "amount" },
    { name: "", key: "actions" },
  ];

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه المعاملة؟")) return;
    try {
      const res = await API.delete(`/salaryactions/${id}`);
      if (res.data?.success || res.status === 200) {
        toast.success("تم حذف المعاملة بنجاح");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error deleting salary action:", err);
      toast.error("فشل في حذف المعاملة");
    }
  };

  const dropdownOptions = [
    {
      label: "حذف",
      action: (id) => handleDelete(id),
    },
  ];

  const handleSuccessAdd = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const modifyRow = (row) => {
    let newRow = { ...row };
    newRow.name = row.name || row.employee?.name || "-";
    newRow.type = row.type == 0 ? "مكافأة" : "خصم";
    newRow.amounttype = row.amounttype == 0 ? "أيام" : "مبلغ مالي";
    newRow.amount =
      row.amounttype == 0
        ? `${row.amount} يوم`
        : `${Number(row.amount || 0).toLocaleString()} ر.س`;
    return newRow;
  };

  return (
    <div className="hrReports-tabel" dir="rtl">
      <TableComponent
        addBtn={true}
        addBtnName="إضافة"
        onAddClick={() => setShowAddModal(true)}
        apiUrl="/salaryactions"
        columns={columns}
        titleIcon={<FontAwesomeIcon icon={faTable} />}
        title="تقارير المكافآت والخصومات"
        dropdownOptions={dropdownOptions}
        search
        searchDate={true}
        transformRowFn={modifyRow}
        triggerReload={refreshKey}
      />

      <DiscountsModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        onSuccess={handleSuccessAdd}
      />
    </div>
  );
}

export default DeductionReport;
