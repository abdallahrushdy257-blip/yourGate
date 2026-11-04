import { useState, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTable,
  faClock,
  faHourglassHalf,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import TableComponent from "../../components/TableComponent";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import API from "../../api/axiosConfig";

const EMPTY_FORM = {
  from_minute: "",
  to_minute: "",
  hour: "1",
  type: "day_fraction",
  value: "0.25",
  active: true,
};

const LatePoliciesPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // حالات الواجهة
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("absence_without_permission");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // جلب البيانات من الـ API
  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/late-policies");
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setPolicies(list);
    } catch (err) {
      console.error("Error loading late policies:", err);
      toast.error("فشل في تحميل سياسات التأخير والإضافي والغياب");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies, refreshKey]);

  // تحديث النموذج عند فتح وضع التعديل
  useEffect(() => {
    if (editTarget) {
      setForm({
        from_minute: editTarget.from_minute || "",
        to_minute: editTarget.to_minute || "",
        hour: editTarget.hour || (editTarget.to_minute ? editTarget.to_minute / 60 : "1"),
        type:
          editTarget.type ||
          (editTarget.category === "late" ? "day_fraction" : "fixed_amount"),
        value: editTarget.value ?? "0",
        active: !!editTarget.active,
      });
    } else {
      setForm({
        ...EMPTY_FORM,
        type: filter === "overtime" ? "fixed_amount" : "day_fraction",
        value: filter === "absence_without_permission" ? "1" : "0.25",
      });
    }
  }, [editTarget, filter]);

  const handleChange = (key, value) => {
    if (key !== "value" && Number(value) < 0) return;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // حفظ السياسة (إضافة أو تعديل) عبر API
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const category = filter || "late";
    const payload = {
      category: category,
      type: category === "overtime" ? form.type : "day_fraction",
      value: Number(form.value),
      active: form.active ? 1 : 0,
      from_minute: category === "late" ? Number(form.from_minute) || 0 : 0,
      to_minute: category === "late" ? Number(form.to_minute) || 0 : 0,
      hour: category === "overtime" ? Number(form.hour) || 1 : 0,
    };

    try {
      if (editTarget) {
        payload.id = editTarget.id;
        const res = await API.post("/late-policies/update", payload);
        if (res.data && res.data.success) {
          toast.success(res.data.message || "تم تحديث السياسة بنجاح");
        }
      } else {
        const res = await API.post("/late-policies/store", payload);
        if (res.data && res.data.success) {
          toast.success(res.data.message || "تم إضافة السياسة بنجاح");
        }
      }
      setModalOpen(false);
      setEditTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Error saving policy:", err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حفظ السياسة");
    } finally {
      setSaving(false);
    }
  };

  // حذف السياسة عبر API
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await API.delete(`/late-policies/${deleteTarget.id}`);
      if (res.data && res.data.success) {
        toast.success(res.data.message || "تم حذف السياسة بنجاح");
      }
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Error deleting policy:", err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حذف السياسة");
    } finally {
      setDeleting(false);
    }
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
          id: p.id,
          ...p,
          categoryText: catText,
          hours: p.hour || (p.to_minute ? p.to_minute / 60 : 0),
          valueText:
            p.type === "day_fraction" ? `${p.value} يوم` : `${p.value} ر.س`,
        };
      });
  }, [policies, filter]);

  return (
    <div className="p-4 rounded shadow-sm" dir="rtl">
      {/* تبويبات الفلاتر العليا (Tabs Switcher) */}
      <div className="d-flex justify-content-center mb-4">
        <div
          className="d-flex p-1 rounded-pill"
          style={{
            background: "rgba(194, 154, 100, 0.12)",
            border: "1.5px solid rgba(194, 154, 100, 0.35)",
            maxWidth: "520px",
            width: "100%",
          }}
        >
          <button
            type="button"
            onClick={() => setFilter("absence_without_permission")}
            className="btn d-flex align-items-center justify-content-center gap-2 flex-grow-1 rounded-pill"
            style={{
              background:
                filter === "absence_without_permission"
                  ? "linear-gradient(135deg, #c29a64 0%, #a87e45 100%)"
                  : "transparent",
              color: filter === "absence_without_permission" ? "#fff" : "var(--text-color, #493d2c)",
              fontWeight: filter === "absence_without_permission" ? 700 : 600,
              fontSize: "13.5px",
              padding: "8px 14px",
              border: "none",
              boxShadow:
                filter === "absence_without_permission"
                  ? "0 4px 10px rgba(168, 126, 69, 0.35)"
                  : "none",
              transition: "all 0.25s ease",
              cursor: "pointer",
            }}
          >
            <FontAwesomeIcon icon={faUserSlash} />
            <span>سياسات الغياب بدون إذن</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter("overtime")}
            className="btn d-flex align-items-center justify-content-center gap-2 flex-grow-1 rounded-pill"
            style={{
              background:
                filter === "overtime"
                  ? "linear-gradient(135deg, #c29a64 0%, #a87e45 100%)"
                  : "transparent",
              color: filter === "overtime" ? "#fff" : "var(--text-color, #493d2c)",
              fontWeight: filter === "overtime" ? 700 : 600,
              fontSize: "13.5px",
              padding: "8px 14px",
              border: "none",
              boxShadow:
                filter === "overtime"
                  ? "0 4px 10px rgba(168, 126, 69, 0.35)"
                  : "none",
              transition: "all 0.25s ease",
              cursor: "pointer",
            }}
          >
            <FontAwesomeIcon icon={faClock} />
            <span>سياسات الإضافي</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter("late")}
            className="btn d-flex align-items-center justify-content-center gap-2 flex-grow-1 rounded-pill"
            style={{
              background:
                filter === "late"
                  ? "linear-gradient(135deg, #c29a64 0%, #a87e45 100%)"
                  : "transparent",
              color: filter === "late" ? "#fff" : "var(--text-color, #493d2c)",
              fontWeight: filter === "late" ? 700 : 600,
              fontSize: "13.5px",
              padding: "8px 14px",
              border: "none",
              boxShadow:
                filter === "late"
                  ? "0 4px 10px rgba(168, 126, 69, 0.35)"
                  : "none",
              transition: "all 0.25s ease",
              cursor: "pointer",
            }}
          >
            <FontAwesomeIcon icon={faHourglassHalf} />
            <span>سياسات التأخير</span>
          </button>
        </div>
      </div>

      {/* جدول البيانات الرئيسي */}
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
        triggerReload={refreshKey}
      />

      {/* مودال الإضافة والتعديل */}
      <Modal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        size="md"
        centered
        dir="rtl"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700 }}>
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
          <Modal.Body className="d-flex flex-column gap-3">
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
              <div className="grid grid-cols-2 gap-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", width: "100%" }}>
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
              </div>
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
                  { value: "fixed_amount", label: "مبلغ ثابت (ر.س)" },
                  { value: "day_fraction", label: "كسر يوم" },
                ]}
              />
            )}

            <RegisterTextbox
              id="value"
              label={
                (filter === "overtime" ? form.type : "day_fraction") ===
                "day_fraction"
                  ? "القيمة (كسر اليوم - مثال: 0.25 أو 0.5 أو 1)"
                  : "المبلغ (ر.س)"
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

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              إلغاء
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={saving}
              style={{
                background: "linear-gradient(135deg, #c29a64 0%, #a87e45 100%)",
                border: "none",
                fontWeight: 600,
                padding: "8px 24px",
              }}
            >
              {saving ? "جاري الحفظ..." : editTarget ? "تحديث السياسة" : "حفظ السياسة"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* مودال التأكيد على الحذف */}
      <Modal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        centered
        size="sm"
        dir="rtl"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1.1rem", fontWeight: 700 }}>تأكيد الحذف</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          هل أنت متأكد من حذف هذه السياسة نهائياً؟ <br />
          <small className="text-danger">لا يمكن التراجع عن هذا الإجراء.</small>
        </Modal.Body>
        <Modal.Footer className="justify-content-center gap-2">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? "جاري الحذف..." : "حذف نهائي"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LatePoliciesPage;
