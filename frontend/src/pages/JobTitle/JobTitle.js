import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./jobTitle.css";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
import { Form, Modal, Spinner } from "react-bootstrap";
import RegisterSelect from "../../components/RegisterSelect";
import { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import TableComponent from "../../components/TableComponent";
import { toast } from "react-toastify";

function Jobtitle() {
  // ── Modal state ──
  const [showModal, setShowModal] = useState(false);

  // ── Form state ──
  const [error, setError] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [mangerjobtitle, setMangerjobtitle] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Dropdown options (other job titles for "الرئيس المباشر") ──
  const [jobtitleOptions, setJobtitleOptions] = useState([]);

  // ── Refresh table after add ──
  const [refreshKey, setRefreshKey] = useState(0);

  const getJobtitleOptions = async () => {
    try {
      const res = await API.post("/jobtitle");
      if (res.status === 200) setJobtitleOptions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getJobtitleOptions();
  }, []);

  // ── Reset & close modal ──
  const handleClose = () => {
    setShowModal(false);
    setName("");
    setDescription("");
    setDays(0);
    setHours(0);
    setMangerjobtitle("");
    setNote("");
    setError({});
  };

  // ── Submit add form ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mFormData = new FormData();
    mFormData.append("name", name);
    mFormData.append("description", description);
    mFormData.append("days", days);
    mFormData.append("hours", hours);
    mFormData.append("mangerjobtitle", mangerjobtitle);
    mFormData.append("note", note);
    try {
      const res = await API.post("/jobtitle/store", mFormData);
      if (res.status === 200) {
        toast.success("تم إضافة المسمى الوظيفي بنجاح");
        handleClose();
        setRefreshKey((k) => k + 1);
        getJobtitleOptions();
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.errors || {});
      toast.error(err?.response?.data?.message || "حدث خطأ ما");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Table columns ──
  const columns = [
    { name: "المسمي الوظيفي", key: "title" },
    { name: "الوصف", key: "description" },
    { name: "المهام الوظيفية", key: "note" },
    { name: "المدير المباشر", key: "parent" },
    { name: "عدد ايام العمل", key: "workdayspermonth" },
    { name: "عدد ساعات العمل", key: "workhoursperday" },
    { name: "", key: "actions" },
  ];

  const dummyData = [
    {
      id: 1,
      title: "مدير مالي",
      description: "يشرف على العمليات المالية", 
      note: "إدارة المشتريات والمصاريف",
      parent: { title: "مدير عام" },
      workdayspermonth: 22,
      workhoursperday: 8,
    },
    {
      id: 2,
      title: "موظف دعم",
      description: "يدعم العمليات الإدارية",
      note: "متابعة الطلبات الداخلية",
      parent: { title: "مدير مالي" },
      workdayspermonth: 22,
      workhoursperday: 8,
    },
  ];

  // flatten nested parent object → show title string
  const transformRowFn = (row) => {
    const newRow = { ...row };
    newRow.parent = newRow.parent ? newRow.parent.title : "لا يوجد";
    return newRow;
  };

  return (
    <>
      {/* ── Page ── */}
      <div className="jobtitle-page-container">
        <Title
          title="المسميات الوظيفية"
          icon={<FontAwesomeIcon icon={faUsers} />}
          style={{ width: "unset" }}
        />

        <TableComponent
          key={refreshKey}
          apiUrl="/jobtitle"
          data={dummyData}
          columns={columns}
          addBtn={true}
          onAddClick={() => setShowModal(true)}
          transformRowFn={transformRowFn}
          dropdownOptions={[
            { label: "تعديل", route: "/editjobtitle/:id" },
          ]}
        />
      </div>

      {/* ── Add JobTitle Modal ── */}
      <Modal show={showModal} onHide={handleClose} centered size="md" dir="rtl">
        <Modal.Header closeButton>
          <Modal.Title>إضافة مسمى وظيفي</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="jobtitle-modal-form" onSubmit={handleSubmit}>
            <div className="jobTitle-inputs">

              {/* Row 1 */}
              
                <div className="grid md:grid-cols-2 grid-cols-1 mx-auto gap-4">
                  <RegisterTextbox
                    parentStyle={{ width: "100%" }}
                    id="name"
                    label="اسم المسمى الوظيفي"
                    type="text"
                    stylee={{ width: "100%" }}
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {error?.name && <span className="error">{error.name}</span>}
                  <RegisterTextbox
                    parentStyle={{ width: "100%" }}
                    id="jobDesc"
                    label="وصف المسمى الوظيفي"
                    type="text"
                    stylee={{ width: "100%" }}
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  {error?.description && (
                    <span className="error">{error.description}</span>
                  )}
                  <RegisterSelect
                    id="mangerjobtitle"
                    label="الرئيس المباشر"
                    stylee={{ width: "100%" }}
                    parentStyle={{ width: "100%" }}
                    options={[
                      { value: "", label: "اختر المدير المباشر" },
                      { value: "0", label: "لا يوجد" },
                      ...jobtitleOptions.map((row) => ({
                        value: row.id,
                        label: row.title,
                      })),
                    ]}
                    name="mangerjobtitle"
                    value={mangerjobtitle}
                    onChange={(e) => setMangerjobtitle(e.target.value)}
                  />
                  {error?.mangerjobtitle && (
                    <span className="error">{error.mangerjobtitle}</span>
                  )}

                  <RegisterTextbox
                    parentStyle={{ width: "100%" }}
                    id="days"
                    label="عدد أيام الدوام في الأسبوع"
                    type="number"
                    stylee={{ width: "100%" }}
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                  />
                  {error?.days && <span className="error">{error.days}</span>}

                  <RegisterTextbox
                    parentStyle={{ width: "100%" }}
                    id="hours"
                    label="عدد ساعات العمل اليومية"
                    type="number"
                    stylee={{ width: "100%" }}
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                  {error?.hours && <span className="error">{error.hours}</span>}
                  <RegisterTextbox
                    parentStyle={{ width: "100%" }}
                    id="hours"
                    label="عدد ساعات العمل اليومية"
                    type="number"
                    stylee={{ width: "100%" }}
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                  {error?.hours && <span className="error">{error.hours}</span>}

                  <RegisterTextbox
                    parentStyle={{ width: "100%" }}
                    id="note"
                    label="ملاحظات أخرى"
                    type="text"
                    stylee={{ width: "100%" }}
                    name="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  {error?.note && <span className="error">{error.note}</span>}
                </div>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer className="justify-content-center border-0">
          {isSubmitting ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <button
              type="submit"
              form="jobtitle-modal-form"
              className="jobtitle-submit"
            >
              حفظ
            </button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Jobtitle;
