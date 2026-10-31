import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form } from "react-bootstrap";
import TableComponent from "../../../components/TableComponent";
import RegisterTextbox from "../../../components/RegisterTextBox";
import RegisterSelect from "../../../components/RegisterSelect";

// 1. بيانات وهمية ابتدائية للسياسات (Mock Data)
const INITIAL_POLICIES = [
  {
    uuid: "1",
    category: "late",
    from_minute: 1,
    to_minute: 15,
    hour: 0,
    type: "day_fraction",
    value: 0.25,
    active: 1,
  },
  {
    uuid: "2",
    category: "late",
    from_minute: 16,
    to_minute: 30,
    hour: 0,
    type: "day_fraction",
    value: 0.5,
    active: 1,
  },
  {
    uuid: "3",
    category: "overtime",
    from_minute: 0,
    to_minute: 0,
    hour: 1,
    type: "fixed_amount",
    value: 100,
    active: 1,
  },
  {
    uuid: "4",
    category: "absence_without_permission",
    from_minute: 0,
    to_minute: 0,
    hour: 0,
    type: "day_fraction",
    value: 1,
    active: 1,
  },
];

const EMPTY_FORM = {
  from_minute: "",
  to_minute: "",
  hour: "1",
  category: "late",
  type: "day_fraction",
  value: "0.25",
  active: true,
};

const LatePoliciesPage = () => {
  // ==========================================
  // STATIC STATE MANAGEMENT (بديل الباك إند)
  // ==========================================
  const [policies, setPolicies] = useState(INITIAL_POLICIES);
  const [loading, setLoading] = useState(false);

  // حالات الواجهة (UI States)
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("absence_without_permission");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // تحديث النموذج عند فتح وضع التعديل
  useEffect(() => {
    if (editTarget) {
      setForm({
        from_minute: editTarget.from_minute || "",
        to_minute: editTarget.to_minute || "",
        hour: editTarget.hour || editTarget.to_minute / 60 || "1",
        type:
          editTarget.type ||
          (editTarget.category === "late" ? "day_fraction" : "fixed_amount"),
        value: editTarget.value || "0",
        active: !!editTarget.active,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editTarget]);

  const handleChange = (key, value) => {
    if (key !== "value" && Number(value) < 0) return;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ==========================================
  // HANDLERS (محاكاة الربط مع API)
  // عند الجاهزية استبدل محتوى العمليات بـ API Calls
  // ==========================================
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const category = filter || "late";
    const payload = {
      uuid: editTarget ? editTarget.uuid : String(Date.now()),
      category: category,
      type: category === "overtime" ? form.type : "day_fraction",
      value: Number(form.value),
      active: form.active ? 1 : 0,
      from_minute: category === "late" ? Number(form.from_minute) || 0 : 0,
      to_minute: category === "late" ? Number(form.to_minute) || 0 : 0,
      hour: category === "overtime" ? Number(form.hour) || 1 : 0,
    };

    setTimeout(() => {
      if (editTarget) {
        // محاكاة التعديل (UPDATE)
        setPolicies((prev) =>
          prev.map((item) => (item.uuid === editTarget.uuid ? payload : item)),
        );
      } else {
        // محاكاة الإضافة (CREATE)
        setPolicies((prev) => [...prev, payload]);
      }
      setSaving(false);
      setModalOpen(false);
      setEditTarget(null);
    }, 400);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    setTimeout(() => {
      // محاكاة الحذف (DELETE)
      setPolicies((prev) => prev.filter((p) => p.uuid !== deleteTarget.uuid));
      setDeleting(false);
      setDeleteTarget(null);
    }, 300);
  };

  // الأعمدة الديناميكية بحسب الفلتر المختار
  const columns = useMemo(() => {
    if (filter === "late") {
      return [
        { name: "النوع", key: "categoryText" },
        { name: "من (دقيقة)", key: "from_minute" },
        { name: "إلى (دقيقة)", key: "to_minute" },
        { name: "القيمة الخصم / الأجر", key: "valueText" },
        { name: "", key: "actions" },
      ];
    } else if (filter === "overtime") {
      return [
        { name: "النوع", key: "categoryText" },
        { name: "عدد الساعات", key: "hours" },
        { name: "القيمة الخصم / الأجر", key: "valueText" },
        { name: "", key: "actions" },
      ];
    } else {
      return [
        { name: "النوع", key: "categoryText" },
        { name: "القيمة الخصم / الأجر", key: "valueText" },
        { name: "", key: "actions" },
      ];
    }
  }, [filter]);

  // خيارات القائمة المنسدلة للإجراءات
  const dropdownOptions = [
    {
      label: "تعديل",
      action: (id, record) => {
        setEditTarget(record);
        setModalOpen(true);
      },
    },
    {
      label: "حذف",
      action: (id, record) => {
        setDeleteTarget(record);
      },
    },
  ];

  // تجهيز البيانات المفلترة للجدول
  const filteredData = useMemo(() => {
    return policies
      .filter((p) => filter === "all" || p.category === filter)
      .map((p) => {
        let catText = "تأخير";
        if (p.category === "overtime") catText = "إضافي";
        if (p.category === "absence_without_permission")
          catText = "غياب بدون إذن";

        return {
          id: p.uuid,
          ...p,
          categoryText: catText,
          hours: p.hour || (p.to_minute ? p.to_minute / 60 : 0),
          valueText:
            p.type === "day_fraction" ? `${p.value} يوم` : `${p.value} ج.م`,
        };
      });
  }, [policies, filter]);

  return (
    <div className="p-4 rounded shadow-sm">
      {/* الفلاتر العليا (Checkboxes) */}
      <div className="d-flex justify-content-center gap-4 mb-4">
        <Form.Check
          type="radio"
          name="policyFilter"
          id="late-checkbox"
          label="سياسات التأخير"
          checked={filter === "late"}
          onChange={() => setFilter("late")}
        />
        <Form.Check
          type="radio"
          name="policyFilter"
          id="overtime-checkbox"
          label="سياسات الإضافي"
          checked={filter === "overtime"}
          onChange={() => setFilter("overtime")}
        />
        <Form.Check
          type="radio"
          name="policyFilter"
          id="absence-checkbox"
          label="سياسات الغياب بدون إذن"
          checked={filter === "absence_without_permission"}
          onChange={() => setFilter("absence_without_permission")}
        />
      </div>

      {/* جدول البيانات الرئيسي من خلال TableComponent */}
      <TableComponent
        title="سياسات التأخير والإضافي والغياب"
        titleIcon={<FontAwesomeIcon icon={faTable} />}
        data={filteredData}
        columns={columns}
        addBtn={true}
        addBtnName="سياسة جديدة"
        onAddClick={() => {
          setEditTarget(null);
          setModalOpen(true);
        }}
        dropdownOptions={dropdownOptions}
        searchDate={false}
      />

      {/* مودال الإضافة والتعديل (Modal Add / Edit) */}
      <Modal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        size="sm"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize:"22px"}}>
            {editTarget
              ? "تعديل السياسة"
              : filter === "late"
                ? "إضافة سياسة تأخير"
                : filter === "overtime"
                  ? "إضافة سياسة إضافي"
                  : "إضافة غياب بدون إذن"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body className="d-flex flex-column gap-3 justify-content-center align-items-center">
            {filter === "overtime" && (
              <RegisterTextbox
                id="hour"
                label="الساعات"
                type="number"
                value={form.hour}
                onChange={(e) => handleChange("hour", e.target.value)}
                parentStyle={{ width: "100%" }}
                stylee={{ width: "100%" }}
                required
              />
            )}

            {filter === "late" && (
              <>
                <RegisterTextbox
                  id="from_minute"
                  label="من دقيقة"
                  type="number"
                  value={form.from_minute}
                  onChange={(e) => handleChange("from_minute", e.target.value)}
                  parentStyle={{ width: "100%" }}
                  stylee={{ width: "100%" }}
                  required
                />

                <RegisterTextbox
                  id="to_minute"
                  label="إلى دقيقة"
                  type="number"
                  value={form.to_minute}
                  onChange={(e) => handleChange("to_minute", e.target.value)}
                  parentStyle={{ width: "100%" }}
                  stylee={{ width: "100%" }}
                  required
                />
              </>
            )}

            {filter === "overtime" && (
              <RegisterSelect
                id="type"
                label="نوع الاحتساب"
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
                parentStyle={{ width: "100%" }}
                stylee={{ width: "100%" }}
                options={[
                  { value: "fixed_amount", label: "مبلغ ثابت" },
                  { value: "day_fraction", label: "كسر يوم" },
                ]}
              />
            )}

            <RegisterTextbox
              id="value"
              label={
                (filter === "overtime" ? form.type : "day_fraction") ===
                "day_fraction"
                  ? "القيمة (كسر اليوم - مثال 0.25)"
                  : "المبلغ (ج.م)"
              }
              type="number"
              step="0.01"
              value={form.value}
              onChange={(e) => handleChange("value", e.target.value)}
              parentStyle={{ width: "100%" }}
              stylee={{ width: "100%" }}
              required
            />
          </Modal.Body>

          <Modal.Footer style={{ display: "flex" }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              إلغاء
            </Button>

            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? "جاري الحفظ..." : editTarget ? "تحديث" : "حفظ"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* مودال التأكيد على الحذف (Delete Confirmation Modal) */}
      <Modal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>تأكيد الحذف</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          هل أنت متأكد من حذف هذه السياسة؟ <br />
          <small className="text-danger">لا يمكن التراجع عن هذا الإجراء.</small>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? "جاري الحذف..." : "حذف"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LatePoliciesPage;
