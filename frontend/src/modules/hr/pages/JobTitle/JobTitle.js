import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../../components/title";
import "./jobTitle.css";
import { faUsers, faPlusCircle, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../../../components/RegisterTextBox";
import { Form, Modal, Spinner } from "react-bootstrap";
import RegisterSelect from "../../../../components/RegisterSelect";
import { useEffect, useState } from "react";
import TableComponent from "../../../../components/TableComponent";
import { toast } from "react-toastify";
import { hrService } from "../../services/hrService";

function Jobtitle() {
  // ── Add Modal State ──
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [mangerjobtitle, setMangerjobtitle] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Edit Modal State ──
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDays, setEditDays] = useState(0);
  const [editHours, setEditHours] = useState(0);
  const [editMangerjobtitle, setEditMangerjobtitle] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editError, setEditError] = useState({});
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [jobtitleOptions, setJobtitleOptions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const getJobtitleOptions = async () => {
    try {
      const res = await hrService.getJobTitles();
      if (res.status === 200) setJobtitleOptions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getJobtitleOptions();
  }, []);

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

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditId(null);
    setEditName("");
    setEditDescription("");
    setEditDays(0);
    setEditHours(0);
    setEditMangerjobtitle("");
    setEditNote("");
    setEditError({});
  };

  const handleOpenEdit = async (id, record) => {
    setEditId(id);
    setShowEditModal(true);
    setIsLoadingDetails(true);
    setEditError({});

    // Pre-populate with table record if available
    if (record) {
      setEditName(record.title || record.name || "");
      setEditDescription(record.description || "");
      setEditDays(record.workdayspermonth || record.days || 0);
      setEditHours(record.workhoursperday || record.hours || 0);
      setEditMangerjobtitle(record.parent_id !== undefined ? String(record.parent_id) : (record.parent?.id ? String(record.parent.id) : ""));
      setEditNote(record.note || "");
    }

    try {
      const res = await hrService.getJobTitle(id);
      if (res.status === 200 && res.data) {
        setEditName(res.data.title || "");
        setEditDescription(res.data.description || "");
        setEditDays(res.data.workdayspermonth || 0);
        setEditHours(res.data.workhoursperday || 0);
        setEditMangerjobtitle(res.data.parent_id !== null && res.data.parent_id !== undefined ? String(res.data.parent_id) : "");
        setEditNote(res.data.note || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("يرجى إدخال اسم المسمى الوظيفي");
      setError({ name: "يرجى إدخال اسم المسمى الوظيفي" });
      return;
    }

    setIsSubmitting(true);
    const mFormData = new FormData();
    mFormData.append("name", name);
    mFormData.append("description", description);
    mFormData.append("days", days);
    mFormData.append("hours", hours);
    mFormData.append("mangerjobtitle", mangerjobtitle);
    mFormData.append("note", note);

    try {
      const res = await hrService.createJobTitle(mFormData);
      if (res.status === 200) {
        toast.success("تم إضافة المسمى الوظيفي بنجاح");
        handleClose();
        setRefreshKey((k) => k + 1);
        getJobtitleOptions();
      }
    } catch (err) {
      setError(err?.response?.data?.errors || {});
      toast.error(err?.response?.data?.message || "حدث خطأ ما");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("يرجى إدخال اسم المسمى الوظيفي");
      setEditError({ name: "يرجى إدخال اسم المسمى الوظيفي" });
      return;
    }

    setIsEditSubmitting(true);
    const mFormData = new FormData();
    mFormData.append("id", editId);
    mFormData.append("name", editName);
    mFormData.append("description", editDescription);
    mFormData.append("days", editDays);
    mFormData.append("hours", editHours);
    mFormData.append("mangerjobtitle", editMangerjobtitle);
    mFormData.append("note", editNote);

    try {
      const res = await hrService.updateJobTitle(mFormData);
      if (res.status === 200) {
        toast.success("تم تعديل المسمى الوظيفي بنجاح");
        handleCloseEdit();
        setRefreshKey((k) => k + 1);
        getJobtitleOptions();
      } else {
        setEditError(res.data?.errors || {});
      }
    } catch (err) {
      setEditError(err?.response?.data?.errors || {});
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تعديل البيانات");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  function prime(num) {
    let isPrime = num % 2 === 0
    if(isPrime){
      return "not a prime"
    }else{
      return "prime"
    }
    
  }

  console.log(prime(5))
  console.log(prime(6))
  console.log(prime(3))

  const columns = [
    { name: "المسمي الوظيفي", key: "title" },
    { name: "الوصف", key: "description" },
    { name: "المهام الوظيفية", key: "note" },
    { name: "المدير المباشر", key: "parent" },
    { name: "عدد ايام العمل", key: "workdayspermonth" },
    { name: "عدد ساعات العمل", key: "workhoursperday" },
    { name: "", key: "actions" },
  ];

  const transformRowFn = (row) => {
    const newRow = { ...row };
    newRow.parent = newRow.parent ? newRow.parent.title : "لا يوجد";
    return newRow;
  };

  return (
    <>
      <div className="jobtitle-page-container">
        <Title
          title="المسميات الوظيفية"
          icon={<FontAwesomeIcon icon={faUsers} />}
          style={{ width: "unset" }}
        />

        <TableComponent
          key={refreshKey}
          apiUrl="/jobtitle"
          columns={columns}
          addBtn={true}
          onAddClick={() => setShowModal(true)}
          transformRowFn={transformRowFn}
          dropdownOptions={[
            {
              label: "تعديل",
              action: (id, record) => handleOpenEdit(id, record),
            },
          ]}
        />
      </div>

      {/* ── مودال إضافة مسمى وظيفي ── */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        size="lg"
        dir="rtl"
        dialogClassName="jobtitle-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faPlusCircle} style={{ color: "var(--primary-color, #b89358)" }} />
            إضافة مسمى وظيفي
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="jobtitle-add-modal-form" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div>
                <RegisterTextbox
                  parentStyle={{ width: "100%" }}
                  id="name"
                  label="اسم المسمى الوظيفي"
                  type="text"
                  stylee={{ width: "100%" }}
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {error?.name && <span className="error">{error.name}</span>}
              </div>

              <div>
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
              </div>

              <div>
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
              </div>

              <div>
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
              </div>

              <div>
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
              </div>

              <div>
                <RegisterTextbox
                  parentStyle={{ width: "100%" }}
                  id="note"
                  label="ملاحظات أخرى (المهام الوظيفية)"
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

        <Modal.Footer>
          <button
            type="button"
            className="jobtitle-btn-cancel"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            إلغاء
          </button>
          <button
            type="submit"
            form="jobtitle-add-modal-form"
            className="jobtitle-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              "حفظ"
            )}
          </button>
        </Modal.Footer>
      </Modal>

      {/* ── مودال تعديل مسمى وظيفي ── */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEdit}
        centered
        size="lg"
        dir="rtl"
        dialogClassName="jobtitle-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faPenToSquare} style={{ color: "var(--primary-color, #b89358)" }} />
            تعديل المسمى الوظيفي
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {isLoadingDetails ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <Spinner animation="border" variant="warning" />
              <span className="ms-2 me-2">جاري تحميل البيانات...</span>
            </div>
          ) : (
            <Form id="jobtitle-edit-modal-form" onSubmit={handleUpdate}>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div>
                  <RegisterTextbox
                    parentStyle={{ width: "100%" }}
                    id="edit-name"
                    label="اسم المسمى الوظيفي"
                    type="text"
                    stylee={{ width: "100%" }}
                    name="name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                  {editError?.name && <span className="error">{editError.name}</span>}
                </div>

                <div>
                  <RegisterTextbox
                    parentStyle={{ width: "100%" }}
                    id="edit-jobDesc"
                    label="وصف المسمى الوظيفي"
                    type="text"
                    stylee={{ width: "100%" }}
                    name="description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  {editError?.description && (
                    <span className="error">{editError.description}</span>
                  )}
                </div>

                <div>
                  <RegisterSelect
                    id="edit-mangerjobtitle"
                    label="الرئيس المباشر"
                    stylee={{ width: "100%" }}
                    parentStyle={{ width: "100%" }}
                    options={[
                      { value: "", label: "اختر المدير المباشر" },
                      { value: "0", label: "لا يوجد" },
                      ...jobtitleOptions
                        .filter((row) => String(row.id) !== String(editId))
                        .map((row) => ({
                          value: row.id,
                          label: row.title,
                        })),
                    ]}
                    name="mangerjobtitle"
                    value={editMangerjobtitle}
                    onChange={(e) => setEditMangerjobtitle(e.target.value)}
                  />
                  {editError?.mangerjobtitle && (
                    <span className="error">{editError.mangerjobtitle}</span>
                  )}
                </div>

                <div>
                  <RegisterTextbox
                    parentStyle={{ width: "100%" }}
                    id="edit-days"
                    label="عدد أيام الدوام في الأسبوع"
                    type="number"
                    stylee={{ width: "100%" }}
                    value={editDays}
                    onChange={(e) => setEditDays(e.target.value)}
                  />
                  {editError?.days && <span className="error">{editError.days}</span>}
                </div>

                <div>
                  <RegisterTextbox
                    parentStyle={{ width: "100%" }}
                    id="edit-hours"
                    label="عدد ساعات العمل اليومية"
                    type="number"
                    stylee={{ width: "100%" }}
                    value={editHours}
                    onChange={(e) => setEditHours(e.target.value)}
                  />
                  {editError?.hours && <span className="error">{editError.hours}</span>}
                </div>

                <div>
                  <RegisterTextbox
                    parentStyle={{ width: "100%" }}
                    id="edit-note"
                    label="ملاحظات أخرى (المهام الوظيفية)"
                    type="text"
                    stylee={{ width: "100%" }}
                    name="note"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                  />
                  {editError?.note && <span className="error">{editError.note}</span>}
                </div>
              </div>
            </Form>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="jobtitle-btn-cancel"
            onClick={handleCloseEdit}
            disabled={isEditSubmitting}
          >
            إلغاء
          </button>
          <button
            type="submit"
            form="jobtitle-edit-modal-form"
            className="jobtitle-submit"
            disabled={isEditSubmitting || isLoadingDetails}
          >
            {isEditSubmitting ? (
              <>
                <Spinner animation="border" size="sm" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              "حفظ التعديلات"
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Jobtitle;


