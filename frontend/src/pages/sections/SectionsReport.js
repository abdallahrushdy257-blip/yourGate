import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import TableComponent from "../../components/TableComponent";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";

// 1. بيانات وهمية ابتدائية لأقسام الشركة (Mock Data)
const INITIAL_DEPARTMENTS = [
  {
    uuid: "dep-101",
    name: "إدارة الموارد البشرية",
    description: "قسم مسئول عن التوظيف وشؤون الموظفين والتطوير.",
    manager: { id: "m-1", name: "أحمد علي" },
  },
  {
    uuid: "dep-102",
    name: "إدارة الحسابات والمالية",
    description: "متابعة الميزانيات، المبيعات، والمصروفات الإدارية.",
    manager: { id: "m-2", name: "سارة محمود" },
  },
  {
    uuid: "dep-103",
    name: "تكنولوجيا المعلومات (IT)",
    description: "الدعم الفني وتطوير الأنظمة والبنية التحتية.",
    manager: { id: "m-3", name: "محمد إبراهيم" },
  },
];

// 2. قائمة وهمية للمدراء الاختيار منهم
const INITIAL_MANAGERS = [
  { value: "m-1", label: "أحمد علي" },
  { value: "m-2", label: "سارة محمود" },
  { value: "m-3", label: "محمد إبراهيم" },
  { value: "m-4", label: "خالد عبد الله" },
];

function SectionsReport() {
  // ==========================================
  // STATIC STATE MANAGEMENT (بديل الباك إند)
  // ==========================================
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [managers] = useState(INITIAL_MANAGERS);

  // حالات التحكم بالمودال والنموذج
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);

  // تنبيهات الرسائل (CustomAlert Replacement)
  const [alertData, setAlertData] = useState({ message: "", type: "" });

  const [departmentData, setDepartmentData] = useState({
    name: "",
    description: "",
    manager_id: "",
  });

  const handleShowModal = () => {
    setEditing(false);
    setEditId(null);
    setDepartmentData({ name: "", description: "", manager_id: "" });
    setValidated(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditing(false);
    setEditId(null);
    setDepartmentData({ name: "", description: "", manager_id: "" });
    setValidated(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (row) => {
    setEditing(true);
    setEditId(row.uuid);
    setDepartmentData({
      name: row.name,
      description: row.description || "",
      manager_id: row.manager ? row.manager.id : "",
    });
    setValidated(false);
    setShowModal(true);
  };

  // ==========================================
  // HANDLERS (محاكاة حفظ وتحديث البيانات)
  // ==========================================
  const handleSubmit = (e) => {
    e.preventDefault();
    setValidated(true);

    // التحقق من الحقول المطلوبة
    if (!departmentData.name.trim() || !departmentData.manager_id) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const selectedManagerObj = managers.find(
        (m) => m.value === departmentData.manager_id,
      );
      const managerData = selectedManagerObj
        ? { id: selectedManagerObj.value, name: selectedManagerObj.label }
        : null;

      if (editing && editId) {
        // محاكاة التعديل (UPDATE)
        setDepartments((prev) =>
          prev.map((dep) =>
            dep.uuid === editId
              ? {
                  ...dep,
                  name: departmentData.name,
                  description: departmentData.description,
                  manager: managerData,
                }
              : dep,
          ),
        );
        showAlert("تم تعديل القسم بنجاح", "success");
      } else {
        // محاكاة الإضافة (CREATE)
        const newDepartment = {
          uuid: `dep-${Date.now()}`,
          name: departmentData.name,
          description: departmentData.description,
          manager: managerData,
        };
        setDepartments((prev) => [...prev, newDepartment]);
        showAlert("تم إضافة القسم بنجاح", "success");
      }

      setIsSubmitting(false);
      handleCloseModal();
    }, 400);
  };

  const showAlert = (message, type) => {
    setAlertData({ message, type });
    setTimeout(() => {
      setAlertData({ message: "", type: "" });
    }, 3000);
  };

  // إعداد البيانات للعرض في الجدول
  const tableData = useMemo(() => {
    return departments.map((dep, index) => ({
      serialNumber: index + 1,
      uuid: dep.uuid,
      name: dep.name,
      managerName: dep.manager ? dep.manager.name : "--",
      description: dep.description || "--",
      original: dep,
    }));
  }, [departments]);

  // أعمدة الجدول
  const columns = [
    { name: "م", key: "serialNumber" },
    { name: "اسم القسم", key: "name" },
    { name: "اسم المدير", key: "managerName" },
    { name: "الوصف", key: "description" },
    { name: "", key: "actions" },
  ];

  // خيارات القائمة المنسدلة للإجراءات
  const dropdownOptions = [
    {
      label: "تعديل",
      action: (id, record) => handleEdit(record.original),
    },
  ];

  return (
    <div className="p-4 rounded shadow-sm position-relative">
      {/* إشعار الرسائل */}
      {alertData.message && (
        <Alert
          variant={alertData.type === "success" ? "success" : "danger"}
          className="position-fixed top-0 start-50 translate-middle-x mt-3 z-3 shadow"
        >
          {alertData.message}
        </Alert>
      )}

      {/* جدول الأقسام */}
      <TableComponent
        title="تقرير الأقسام والإدارات"
        titleIcon={<FontAwesomeIcon icon={faReceipt} />}
        data={tableData}
        columns={columns}
        addBtn={true}
        addBtnName="قسم جديد"
        onAddClick={handleShowModal}
        dropdownOptions={dropdownOptions}
        searchDate={false}
      />

      {/* مودال الإضافة والتعديل */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faFileInvoice} className="text-primary" />
            {editing ? "تعديل قسم" : "إضافة قسم جديد"}
          </Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body className="grid grid-cols-2 gap-2">
            {/* اسم القسم */}
            <RegisterTextbox
              id="name"
              label="اسم القسم"
              type="text"
              required
              value={departmentData.name}
              onChange={handleChange}
              placeholder="أدخل اسم القسم"
              parentStyle={{ width: "100%",marginBottom:"0" }}
              stylee={{ width: "100%" }}
              error={
                validated && !departmentData.name ? "برجاء إدخال اسم القسم" : ""
              }
            />

            {/* اسم المدير */}
            <RegisterSelect
              id="manager_id"
              label="اسم المدير"
              required
              value={departmentData.manager_id}
              onChange={handleChange}
              parentStyle={{ width: "100%",marginBottom:"0" }}
              stylee={{ width: "100%" }}
              options={[
                { value: "", label: "اختر مدير القسم..." },
                ...managers.map((m) => ({
                  value: m.value,
                  label: m.label,
                })),
              ]}
            />

            {/* وصف القسم */}
            <RegisterTextbox
              id="description"
              label="وصف القسم"
              as="textarea"
              rows={3}
              value={departmentData.description}
              onChange={handleChange}
              placeholder="أدخل وصفاً مشروحاً للقسم..."
              parentStyle={{ width: "100%" }}
              stylee={{ width: "100%" }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button  className="my-3" variant="secondary" onClick={handleCloseModal}>
              إلغاء
            </Button>
            <Button  className="my-3" variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : editing ? "تحديث" : "حفظ"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default SectionsReport;
