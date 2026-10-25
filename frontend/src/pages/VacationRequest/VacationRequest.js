import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHand,
  faPlus,
  faCalendarCheck,
  faClock,
  faTable,
  faFileAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Row, Spinner, Modal, Nav, Button } from "react-bootstrap";
import Title from "../../components/title";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterRadio from "../../components/Radio";
import UploadInput from "../../components/UploadInput";
import CustomButton from "../../components/CustomButton";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import TableComponent from "../../components/TableComponent";
import { toast } from "react-toastify";
import "./VacationRequest.css";

function VacationRequest() {
  const [activeTab, setActiveTab] = useState("vacations");
  const [employees, setEmployees] = useState([]);
  const [vacationTypes, setVacationTypes] = useState([]);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Decision Modal State
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [decisionStatus, setDecisionStatus] = useState("");

  // Form State
  const [selectedRequestType, setSelectedRequestType] = useState("vac");
  const [formData, setFormData] = useState({
    empId: "",
    vacTypeId: "",
    description: "",
    from: new Date().toISOString().substr(0, 10),
    to: new Date().toISOString().substr(0, 10),
    permDate: new Date().toISOString().substr(0, 10),
    permFromTime: "08:00",
    permToTime: "09:00",
    note: "",
  });
  const [upload, setUpload] = useState(null);

  const resetForm = () => {
    setFormData({
      empId: "",
      vacTypeId: "",
      description: "",
      from: new Date().toISOString().substr(0, 10),
      to: new Date().toISOString().substr(0, 10),
      permDate: new Date().toISOString().substr(0, 10),
      permFromTime: "08:00",
      permToTime: "09:00",
      note: "",
    });
    setUpload(null);
    setError({});
  };

  const getInitialData = async () => {
    try {
      const [empRes, vacRes] = await Promise.all([
        API.post("employees"),
        API.post("vacations"),
      ]);
      setEmployees(empRes.data);
      setVacationTypes(vacRes.data);
      loading && setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getInitialData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mForm = new FormData();

    if (selectedRequestType === "vac") {
      mForm.append("name", formData.empId);
      mForm.append("type", formData.vacTypeId);
      mForm.append("description", formData.description);
      mForm.append("from", formData.from);
      mForm.append("to", formData.to);
      if (upload) mForm.append("upload", upload);

      try {
        await API.post("vacationrequests/store", mForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("تم تقديم طلب الإجازة بنجاح");
        setShowModal(false);
        resetForm();
        setRefreshKey(Date.now());
      } catch (err) {
        setError(err.response?.data?.errors || {});
      }
    } else {
      mForm.append("name", formData.empId);
      mForm.append("date", formData.permDate);
      mForm.append("from_time", formData.permFromTime);
      mForm.append("to_time", formData.permToTime);
      mForm.append("note", formData.note);
      if (upload) mForm.append("upload", upload);

      try {
        await API.post("/leaverequests/store", mForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("تم تقديم طلب الإذن بنجاح");
        setShowModal(false);
        resetForm();
        setRefreshKey(Date.now());
      } catch (err) {
        setError(err.response?.data?.errors || {});
      }
    }
    setIsSubmitting(false);
  };

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        activeTab === "vacations"
          ? "/vacationrequests/status/update"
          : "/leaverequests/status/update";

      await API.post(endpoint, {
        id: selectedId,
        status: decisionStatus,
      });

      toast.success("تم تحديث حالة الطلب بنجاح");
      setShowDecisionModal(false);
      setSelectedId(null);
      setRefreshKey(Date.now());
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تحديث الحالة");
    }
  };

  // Table Columns & Options
  const vacationColumns = [
    { name: "إسم الموظف", key: "name" },
    { name: " النوع", key: "vacationname" },
    { name: " من", key: "startdate" },
    { name: " الى", key: "enddate" },
    { name: "حالة الإجازة", key: "status" },
    { name: "", key: "actions" },
  ];

  const permissionColumns = [
    { name: " اسم الموظف", key: "name" },
    { name: " نوع الاذن", key: "type" },
    { name: " التاريخ", key: "date" },
    { name: " عدد الساعات", key: "hours" },
    { name: " حالة الإجازة", key: "status" },
    { name: " ملاحظات", key: "note" },
    { name: "", key: "actions" },
  ];

  const vacationOptions = [
    {
      label: "الرد على الإجازة",
      action: (id) => {
        setSelectedId(id);
        setShowDecisionModal(true);
      },
    },
  ];

  const permissionOptions = [
    {
      label: "الرد على الإذن",
      action: (id) => {
        setSelectedId(id);
        setShowDecisionModal(true);
      },
    },
  ];

  const modifyVacationRow = (row) => {
    let newRow = { ...row };
    newRow.status =
      row.status === 0 ? "قيد الانتظار" : row.status === 1 ? "قبول" : "رفض";
    return newRow;
  };

  const modifyPermissionRow = (row) => {
    let newRow = { ...row };
    const transStatus = (s) =>
      s == "0" ? "قيد الانتظار" : s == "1" ? "موافقة" : "مرفوضة";
    const transType = (t) => {
      const types = {
        1: "أثناء اليوم",
        2: "تأخير",
        3: "انصراف مبكر",
        4: "مراجعة المستشفى",
        5: "مرضي",
        6: "حمل",
        7: "اخرى",
      };
      return types[t] || t;
    };
    newRow.status = transStatus(row.status);
    newRow.type = transType(row.type);
    return newRow;
  };

  const vacationDummyData = [
    {
      id: 1,
      name: "أحمد السالم",
      vacationname: "إجازة سنوية",
      startdate: "2026-07-01",
      enddate: "2026-07-05",
      status: "قيد الانتظار",
    },
    {
      id: 2,
      name: "سارة محمد",
      vacationname: "إجازة مرضية",
      startdate: "2026-07-10",
      enddate: "2026-07-12",
      status: "موافقة",
    },
  ];

  const permissionDummyData = [
    {
      id: 1,
      name: "خالد إبراهيم",
      type: "أثناء اليوم",
      date: "2026-07-20",
      hours: "3",
      status: "موافقة",
      note: "مراجعة مهمة عاجلة",
    },
    {
      id: 2,
      name: "ريم علي",
      type: "تأخير",
      date: "2026-07-22",
      hours: "1",
      status: "قيد الانتظار",
      note: "تأخير بسبب الازدحام",
    },
  ];

  return loading ? (
    <TestPreLoader />
  ) : (
    <div className="vacation-management-page">
      <div className="management-tabs mb-4 no-print">
        <Nav
          variant="pills"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="justify-content-center p-2 rounded-pill"
        >
          <Nav.Item>
            <div
              eventKey="vacations"
              onClick={() => setActiveTab("vacations")}
              className={`${activeTab === "vacations" ? "active" : ""} cursor-pointer px-4 py-2 rounded-pill d-flex align-items-center`}
            >
              <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
              إدارة الإجازات
            </div>
          </Nav.Item>
          <Nav.Item>
            <div
              eventKey="permissions"
              onClick={() => setActiveTab("permissions")}
              className={`${activeTab === "permissions" ? "active" : ""} cursor-pointer px-4 py-2 rounded-pill d-flex align-items-center`}
            >
              <FontAwesomeIcon icon={faClock} className="me-2" />
              إدارة الأذونات
            </div>
          </Nav.Item>
        </Nav>
      </div>

      <div className="hrReports-tabel">
        {activeTab === "vacations" ? (
          <TableComponent
            key={`vac-${refreshKey}`}
            apiUrl="/vacationrequests"
            data={vacationDummyData}
            columns={vacationColumns}
            titleIcon={<FontAwesomeIcon icon={faCalendarCheck} />}
            title="إدارة طلبات الإجازات"
            dropdownOptions={vacationOptions}
            triggerReload={refreshKey}
            transformRowFn={modifyVacationRow}
            addBtn={true}
            addBtnName="اجازه/اذن"
            onAddClick={() => {
              setSelectedRequestType("vac");
              setShowModal(true);
            }}
          />
        ) : (
          <TableComponent
            key={`perm-${refreshKey}`}
            apiUrl="/leaverequests"
            data={permissionDummyData}
            columns={permissionColumns}
            titleIcon={<FontAwesomeIcon icon={faClock} />}
            title="إدارة طلبات الأذونات"
            dropdownOptions={permissionOptions}
            triggerReload={refreshKey}
            transformRowFn={modifyPermissionRow}
            addBtn={true}
            addBtnName="اجازه/اذن"
            onAddClick={() => {
              setSelectedRequestType("per");
              setShowModal(true);
            }}
          />
        )}
      </div>

      {/* Request Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="md"
        centered
        className="vacation-request-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faPlus} className="ms-2 text-primary" />
            اجازه/اذن
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="request-type-toggle mb-4 text-center">
            <h5 className="mb-3">نوع الطلب</h5>
            <div className="d-flex justify-content-center gap-4">
              <RegisterRadio
                label="إجازة"
                value="vac"
                onChange={() => setSelectedRequestType("vac")}
                checked={selectedRequestType === "vac"}
              />
              <RegisterRadio
                label="إذن"
                value="per"
                onChange={() => setSelectedRequestType("per")}
                checked={selectedRequestType === "per"}
              />
            </div>
          </div>

          <Form onSubmit={handleSubmit} className="space-y-6 ltr">
            {/* شبكة المدخلات الرئيسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* اختيار الموظف - يأخذ عرض كامل السطر دائماً لتنسيق أفضل */}
              <div className="">
                <RegisterSelect
                  id="empId"
                  label="إسم الموظف"
                  options={[
                    { value: "", label: "اختر موظفاً" },
                    ...employees.map((emp) => ({
                      value: emp.id,
                      label: emp.name,
                    })),
                  ]}
                  value={formData.empId}
                  onChange={(e) =>
                    setFormData({ ...formData, empId: e.target.value })
                  }
                />
              </div>

              {/* تفاصيل طلب الإجازة أو الإذن */}
              {selectedRequestType === "vac" ? (
                <>
                  <div className="">
                    <RegisterSelect
                      id="vacTypeId"
                      label="نوع الإجازة"
                      options={[
                        { value: "", label: "اختر نوع الإجازة" },
                        ...vacationTypes.map((vac) => ({
                          value: vac.id,
                          label: vac.name,
                        })),
                      ]}
                      value={formData.vacTypeId}
                      onChange={(e) =>
                        setFormData({ ...formData, vacTypeId: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="fromDate"
                      className="text-sm font-medium text-gray-700 text-right"
                    >
                      من تاريخ
                    </label>
                    <input
                      id="fromDate"
                      type="date"
                      className=" custom-datepicker"
                      value={formData.from}
                      onChange={(e) =>
                        setFormData({ ...formData, from: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="toDate"
                      className="text-sm font-medium text-gray-700 text-right"
                    >
                      إلى تاريخ
                    </label>
                    <input
                      id="toDate"
                      type="date"
                      className=" custom-datepicker"
                      value={formData.to}
                      onChange={(e) =>
                        setFormData({ ...formData, to: e.target.value })
                      }
                    />
                  </div>

                  <div className="">
                    <RegisterTextbox
                      id="description"
                      label="وصف الإجازة"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className=" flex flex-col gap-1.5">
                    <label
                      htmlFor="permDate"
                      className="text-sm font-medium text-gray-700 text-right"
                    >
                      التاريخ
                    </label>
                    <input
                      id="permDate"
                      type="date"
                      className=" custom-datepicker"
                      value={formData.permDate}
                      onChange={(e) =>
                        setFormData({ ...formData, permDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="permFromTime"
                      className="text-sm font-medium text-gray-700 text-right"
                    >
                      وقت من
                    </label>
                    <input
                      id="permFromTime"
                      type="time"
                      className=" custom-datepicker"
                      value={formData.permFromTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          permFromTime: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="permToTime"
                      className="text-sm font-medium text-gray-700 text-right"
                    >
                      وقت إلى
                    </label>
                    <input
                      id="permToTime"
                      type="time"
                      className=" custom-datepicker"
                      value={formData.permToTime}
                      onChange={(e) =>
                        setFormData({ ...formData, permToTime: e.target.value })
                      }
                    />
                  </div>

                  <div className="">
                    <RegisterTextbox
                      id="note"
                      label="ملاحظات"
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                    />
                  </div>
                </>
              )}
            </div>

            {/* قسم رفع المستندات */}
            <div className="p-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-300 text-right">
              <p className="text-sm font-semibold mb-3">
                {selectedRequestType === "vac"
                  ? "مستند الإجازة"
                  : "مستند الإذن"}
              </p>
              <div className="flex items-center justify-center">
                <UploadInput
                  id="request-upload"
                  label="اختر ملف المستند"
                  onChange={(e) => setUpload(e.target.files[0])}
                />
              </div>
            </div>

            {/* أزرار التحكم والتحميل */}
            <div className="flex justify-center items-center pt-2">
              {isSubmitting ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    إلغاء
                  </Button>
                  <CustomButton text="تقديم الطلب" type="submit" className="btn btn-primary mb-0"/>
                </div>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Decision Modal */}
      <Modal
        show={showDecisionModal}
        onHide={() => setShowDecisionModal(false)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>اتخاذ قرار بشأن الطلب</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleDecisionSubmit}>
            <div className="form-group mb-4">
              <label className="mb-2">الحالة الجديدة</label>
              <select
                className="form-control"
                value={decisionStatus}
                onChange={(e) => setDecisionStatus(e.target.value)}
                required
              >
                <option value="">اختر قراراً</option>
                <option value="1">موافقة</option>
                <option value="2">رفض</option>
              </select>
            </div>
            <div className="text-center d-flex gap-2 justify-content-center">
              <Button type="submit" variant="primary" className="px-4">
                حفظ القرار
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => setShowDecisionModal(false)}
              >
                إلغاء
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default VacationRequest;
