import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faBullhorn,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import "./ProjectStatus.css";
import API from "../../api/axiosConfig";
import TableComponent from "../../components/TableComponent";
import { useNavigate } from "react-router-dom";
import { showError } from "../../components/Toast";
import { Modal, Button, Row, Col, Spinner, Form } from "react-bootstrap";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import NewButton from "../../components/NewButton";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterTextarea from "../../components/RegisterTextarea";

function ProjectStatus() {
  const navigate = useNavigate();
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());

  // ── Progress Modal State ────────────────────────────────
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [id, setId] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  // ── Add Project Modal State ─────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [error, setError] = useState({});

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dateoflaunch, setDateoflaunch] = useState(
    new Date().toISOString().substr(0, 10),
  );
  const [deadline, setDeadline] = useState(
    new Date().toISOString().substr(0, 10),
  );
  const [total, setTotal] = useState(0);
  const [marketingmethod, setMarketingmethod] = useState(0);
  const [accounttree, setAccounttre] = useState("");

  const resetAddForm = () => {
    setName("");
    setDescription("");
    setDateoflaunch(new Date().toISOString().substr(0, 10));
    setDeadline(new Date().toISOString().substr(0, 10));
    setTotal(0);
    setMarketingmethod(0);
    setAccounttre("");
    setError({});
    setIsSubmit(false);
  };

  const handleCloseAddModal = () => {
    resetAddForm();
    setShowAddModal(false);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    const mForm = new FormData();
    mForm.append("name", name);
    mForm.append("description", description);
    mForm.append("dateoflaunch", dateoflaunch);
    mForm.append("deadline", deadline);
    mForm.append("total", total);
    mForm.append("marketingmethod", marketingmethod);
    mForm.append("accounttree", accounttree);

    try {
      const res = await API.post("/projects/store", mForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) {
        handleCloseAddModal();
        setTableReloadKey(Date.now());
      } else {
        setError(res.data.errors || {});
        setIsSubmit(false);
      }
    } catch (error) {
      console.log(error);
      setIsSubmit(false);
      setError(error.response?.data?.errors || {});
    }
  };

  // ── Table Config ─────────────────────────────────────────
  const columns = [
    { name: "إسم المشروع", key: "name" },
    { name: "قيمة المشروع", key: "budget" },
    { name: "قيمة التسويق", key: "marketingmethodstring" },
    { name: "تاريخ البدء", key: "startdate" },
    { name: "تاريخ الانتهاء", key: "deadline" },
    { name: "حالة المشروع", key: "statusstring" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions = [
    { label: "مراحل المشروع ", route: "/projectdetails/:id" },
    { label: "اعضاء المشروع", route: "/projectmembers/:id" },
    { label: " مؤشرات الاداء", route: "/projectkpiview/:id" },
    { label: "المرفقات", route: "/projectattachments/:id" },
    { label: "المخاطر", route: "/projectrisks/:id" },
    { label: "تقرير المخاطر", route: "/riskassessmentreport/:id" },
    { label: "سند صرف", route: "/paymentvoucherproject/:id" },
    {
      label: "سندات الدفع",
      action: (id, record) => {
        if (record.status === 3 || record.status === 2) {
          showError("لا يمكن عرض سندات مشروع ملغي أو مكتمل");
        } else {
          navigate(`/projectpaymentvouchers/${id}`);
        }
      },
    },
    {
      label: "نسبة الانجاز",
      action: (id, record) => {
        if (record.status === 3) {
          return `لا يمكن عرض نسبة انجاز مشروع ملغي`;
        } else if (record.status === 2) {
          return `نسبة انجاز المشروع مكتمل 100%`;
        } else {
          setShowProgressModal(true);
          setId(id);
          const getPercentage = async () => {
            try {
              const response = await API.get(
                `/projectprogress/${id}/percentage`,
              );
              if (response.status === 200) {
                setPercentage(response.data.percentage);
              }
            } catch (error) {
              console.log(error);
            } finally {
              setLoading(false);
            }
          };
          getPercentage();
        }
      },
    },
    {
      label: "تعديل",
      action: (id, record) => {
        if (record.status === 3 || record.status === 2) {
          showError("لا يمكن تعديل مشروع ملغي أو مكتمل");
        } else {
          navigate(`/editproject/${id}`);
        }
      },
    },
    {
      label: "الغاء",
      visibleIf: (record) => record.status !== 3 && record.status !== 2,
      action: (id) => {
        const cancelProject = async () => {
          try {
            const response = await API.get(`/projects/${id}/cancel`);
            if (response.status === 200) {
              setTableReloadKey(Date.now());
            }
          } catch (error) {
            console.log(error);
          }
        };
        cancelProject();
      },
    },
    {
      label: "تفعيل",
      visibleIf: (record) => record.status === 3,
      action: (id) => {
        const activateProject = async () => {
          try {
            const response = await API.get(`/projects/${id}/activate`);
            if (response.status === 200) {
              setTableReloadKey(Date.now());
            }
          } catch (error) {
            console.log(error);
          }
        };
        activateProject();
      },
    },
  ];

  return (
    <>
      <div className="project-status">
        {/* <NewButton name={"مشروع"} onClick={() => setShowAddModal(true)} /> */}
        <TableComponent
          apiUrl="/projects"
          columns={columns}
          title="تقرير المشاريع"
          titleIcon={<FontAwesomeIcon icon={faReceipt} />}
          searchDate={false}
          dropdownOptions={dropdownOptions}
          triggerReload={tableReloadKey}
          addBtn={true}
          onAddClick={() => setShowAddModal(true)}
          addBtnName="مشروع"
        />
      </div>

      {/* ── Progress Modal ── */}
      <Modal
        show={showProgressModal}
        onHide={() => setShowProgressModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>نسبة الانجاز</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ direction: "rtl" }}>
          <p>نسبة انجاز المشروع مكتمل </p>
          <span style={{ direction: "ltr" }}>
            {percentage ? percentage : 0}%
          </span>
          <progress
            value={percentage}
            max="100"
            style={{ width: "100%" }}
          ></progress>
        </Modal.Body>
      </Modal>

      {/* ── Add Project Modal ── */}
      <Modal
        size="md"
        show={showAddModal}
        onHide={handleCloseAddModal}
        className="modal-table archModal donor-modal"
        dialogClassName="fit-content-modal"
        centered
      >
        <Modal.Header>
          <Modal.Title>إنشاء مشروع جديد</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={handleCloseAddModal}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ paddingBottom: "0", direction: "rtl" }}>
          <Form onSubmit={handleAddSubmit}>
            <Row>
              <Col md={6}>
                <RegisterTextbox
                  id="project-name"
                  label="إسم المشروع"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  error={error.name}
                />
              </Col>
              <Col md={6}>
                <RegisterTextbox
                  id="project-total"
                  label="مبلغ الدعم الكلي"
                  type="number"
                  value={total}
                  onChange={(e) => setTotal(Number(e.target.value))}
                  error={error.total}
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <p className="mb-2" style={{ textAlign: "right" }}>
                    تاريخ البدء
                  </p>
                  <input
                    type="date"
                    className="custom-datepicker w-100"
                    value={dateoflaunch}
                    onChange={(e) => setDateoflaunch(e.target.value)}
                  />
                  {error.dateoflaunch && (
                    <small className="text-danger">{error.dateoflaunch}</small>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <p className="mb-2" style={{ textAlign: "right" }}>
                    تاريخ الانتهاء
                  </p>
                  <input
                    type="date"
                    className="custom-datepicker w-100"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                  {error.deadline && (
                    <small className="text-danger">{error.deadline}</small>
                  )}
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <RegisterSelect
                  id="project-account"
                  label="حساب ترحيل الحالة"
                  options={[
                    { value: "0", label: "إختر الحساب" },
                    {
                      value: "9e5000ef-9e80-4388-b368-0b6f3e6710f6",
                      label: "تبرعات وهبات مقيدة – نقدية",
                    },
                    {
                      value: "9e5000f3-4d41-4579-8d16-123c5dcaacca",
                      label: "تبرعات وهبات غير مقيدة – نقدية ",
                    },
                  ]}
                  value={accounttree}
                  onChange={(e) => setAccounttre(e.target.value)}
                  error={error.accounttree}
                />
              </Col>
              <Col md={6}>
                <RegisterSelect
                  id="project-marketing"
                  label="آلية التسويق"
                  options={[
                    { value: "0", label: "إختر الآلية" },
                    { value: "1", label: "المانحون" },
                    { value: "2", label: "المنصات الحكومية" },
                    { value: "3", label: "متاجر الجمعيات" },
                  ]}
                  value={marketingmethod}
                  onChange={(e) => setMarketingmethod(e.target.value)}
                  error={error.marketingmethod}
                />
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <RegisterTextarea
                  id="project-desc"
                  label="نبذة عن المشروع"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={error.description}
                  stylee={{ height: "100px" }}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-center mt-4 mb-3">
              {isSubmit ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <Button variant="primary" type="submit" className="px-5">
                  حفظ
                </Button>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProjectStatus;
