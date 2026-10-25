import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./CaseDetails.css";
import TableComponent from "../../components/TableComponent";
import { useNavigate } from "react-router";
import NewButton from "../../components/NewButton";
import { Modal, Button, Row, Col, Spinner, Form } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import RegisterRadio from "../../components/Radio";
import RegisterTextarea from "../../components/RegisterTextarea";
import UploadInput from "../../components/UploadInput";
import API from "../../api/axiosConfig";
import { toLocal } from "../../Utils/toLocal";

function CaseDetails(props) {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());

  // ── Modal State ──────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  const [name, setName] = useState("");
  const [isAssetsSelected, setIsAssetsSelected] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [numberOfAssets, setNumberOfAssets] = useState(0);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subOptions, setSubOptions] = useState([]);
  const [showOtherTextbox, setShowOtherTextbox] = useState(false);
  const [showOtherTextboxValue, setShowOtherTextboxValue] = useState("");
  const [document, setDocument] = useState("");
  const [postDate, setPostDate] = useState(
    new Date().toISOString().substr(0, 10),
  );
  const [deedlineDate, setDeedlineDate] = useState(
    new Date().toISOString().substr(0, 10),
  );
  const [benf, setBenf] = useState("");
  const [description, setDescription] = useState("");
  const [description2, setDescription2] = useState("");
  const [marketingmethod, setMarketingmethod] = useState(0);
  const [accounttree, setAccounttre] = useState("");
  const [human, setHuman] = useState([]);

  const handleRadioChange = (label) => {
    setIsAssetsSelected(label === "أسهم");
  };

  const calculatePricePerAsset = () => {
    return numberOfAssets > 0 ? (totalCost / numberOfAssets).toFixed(2) : 0;
  };

  const getCaseData = async () => {
    try {
      const res = await API.post("/humancases");
      setHuman(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (showModal) {
      getCaseData();
    }
  }, [showModal]);

  const handleMainCategoryChange = (e) => {
    const selectedValue = e.target.value;
    setMainCategory(selectedValue);
    if (selectedValue === "حالة اغاثة") {
      setSubOptions([
        { value: "صحية", label: "صحية" },
        { value: "طارئة ", label: "طارئة " },
        { value: "إجتماعية", label: "إجتماعية" },
      ]);
      setShowOtherTextbox(false);
    } else if (selectedValue === "حالة تنموية") {
      setSubOptions([
        { value: "دورات تدريبية", label: "دورات تدريبية" },
        { value: "دراسة", label: "دراسة" },
        { value: "إقامة مشاريع استراتيجية", label: "إقامة مشاريع استراتيجية" },
      ]);
      setShowOtherTextbox(false);
    } else if (selectedValue === "أخري") {
      setSubOptions([]);
      setShowOtherTextbox(true);
    } else {
      setSubOptions([]);
      setShowOtherTextbox(false);
    }
  };

  const resetForm = () => {
    setName("");
    setIsAssetsSelected(false);
    setTotalCost(0);
    setNumberOfAssets(0);
    setMainCategory("");
    setSubCategory("");
    setSubOptions([]);
    setShowOtherTextbox(false);
    setShowOtherTextboxValue("");
    setDocument("");
    setPostDate(new Date().toISOString().substr(0, 10));
    setDeedlineDate(new Date().toISOString().substr(0, 10));
    setBenf("");
    setDescription("");
    setDescription2("");
    setMarketingmethod(0);
    setAccounttre("");
    setError({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mForm = new FormData();
    mForm.append("name", name);
    mForm.append("isAssetsSelected", isAssetsSelected);
    mForm.append("numberOfAssets", numberOfAssets);
    mForm.append("totalCost", totalCost);
    mForm.append("mainCategory", mainCategory);
    mForm.append("subCategory", subCategory);
    mForm.append("description", description);
    mForm.append("description2", description2);
    mForm.append("benf", benf);
    mForm.append("postDate", postDate);
    mForm.append("deedlineDate", deedlineDate);
    mForm.append("document", document);
    mForm.append("marketingmethod", marketingmethod);
    mForm.append("accounttree", accounttree);
    mForm.append(
      "othertext",
      showOtherTextboxValue ? showOtherTextboxValue : "",
    );

    try {
      const res = await API.post("/shop/store", mForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) {
        handleClose();
        setTableReloadKey(Date.now());
        // Note: Original code navigated to /casedata/:id.
        // In a report page modal, usually we just reload table,
        // but if the user wants to go to case data page, we can navigate.
        // For now, let's just reload table to keep them on report.
      } else {
        setError(res.data.errors || {});
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      setError(error.response?.data?.errors || {});
    }
  };

  // ── Table Config ─────────────────────────────────────────
  const columns = [
    { name: "إسم الحالة", key: "title" },
    { name: "نوع العملية", key: "status" },
    { name: "تاريخ البدء", key: "dateoflaunch" },
    { name: " آلية التسويق", key: "marketingmethod" },
    { name: "قيمة الحالة", key: "total" },
    { name: "التحصيلات", key: "amount" },
    { name: "", key: "actions" },
  ];

  const dropdownOptions = [
    { label: "طلب تصميم", route: "/senddesignrequestshop/:id" },
    { label: "طلب إدارة", route: "/sendmarketingrequestshop/:id" },
    { label: "عرض التبرعات", route: "/viewdonations/:id" },
    { label: "عرض الحالة", route: "/casedetailschart/:id" },
    { label: "بيانات الحالة", route: "/casedata/:id" },
    {
      label: "سند صرف",
      action: (id, record) => {
        if (record.status == 1) {
          alert("لا يمكن اجراء اي حركات نقدية على الحالة  بعد اكتمالها ");
        } else {
          navigate(`/paymentvoucher/${id}`);
        }
      },
    },
    {
      label: "سند قبض",
      action: (id, record) => {
        if (record.status == 1) {
          alert("لا يمكن اجراء اي حركات نقدية على الحالة  بعد اكتمالها ");
        } else {
          navigate(`/receiptvoucher/${id}`);
        }
      },
    },
    { label: "تعديل", route: "/editcasedetails/:id" },
  ];

  const modifyRow = (row) => {
    let newRow = { ...row };
    newRow.total =toLocal(row.total) + " ريال";
    newRow.amount =toLocal(row.amount) + " ريال";

    if (newRow.status === 0) {
      newRow.status =
        '<span style="background-color:red; color:white; border-radius:5px; padding:2px ">غير مكتمل</span>';
    } else {
      newRow.status =
        '<span style="background-color:green; color:white; border-radius:5px; padding:2px ">مكتمل</span>';
    }
    if (newRow.marketingmethod === 1) {
      newRow.marketingmethod = '<span class="rounded p-1">المانحين</span>';
    } else if (newRow.marketingmethod === 2) {
      newRow.marketingmethod =
        '<span class="rounded p-1">المنصات الحكومية</span>';
    } else if (newRow.marketingmethod === 3) {
      newRow.marketingmethod =
        '<span class="rounded p-1">متاجر الجمعيات</span>';
    } else {
      newRow.marketingmethod = '<span class="rounded p-1">غير معرف</span>';
    }
    return newRow;
  };

  return (
    <>
      <div className="printcasedata-container">
        {/* <NewButton name={"حالة"} onClick={() => setShowModal(true)} /> */}
        <TableComponent
          apiUrl="/shop"
          columns={columns}
          title="تقرير الحالات"
          titleIcon={<FontAwesomeIcon icon={faWarning} />}
          dropdownOptions={dropdownOptions}
          transformRowFn={modifyRow}
          triggerReload={tableReloadKey}
          addBtn={true}
          onAddClick={() => setShowModal(true)}
          addBtnName="حالة"
        />
      </div>

      {/* ── Add Case Modal ── */}
      <Modal
        show={showModal}
        onHide={handleClose}
        className="modal-table archModal donor-modal"
        size="lg"
        centered
      >
        <Modal.Header>
          <Modal.Title>إنشاء حالة جديدة</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ direction: "rtl" }}>
          <Form onSubmit={handleSubmit}>
            <div className="form-section mb-4">
              <h5
                className="section-title mb-3"
                style={{
                  color: "var(--buttonbackground-color)",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "10px",
                }}
              >
                البيانات الأساسية
              </h5>
              <Row className="g-3">
                <Col md={6}>
                  <RegisterTextbox
                    id="case-name"
                    label="مسمى الحالة"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={error.name}
                  />
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id="case-main-cat"
                    label="نوع الحالة"
                    options={[
                      { value: "", label: "إختر الحالة" },
                      { value: "حالة اغاثة", label: "حالة اغاثة" },
                      { value: "حالة تنموية", label: "حالة تنموية" },
                      { value: "أخري", label: "أخري" },
                    ]}
                    value={mainCategory}
                    onChange={handleMainCategoryChange}
                    error={error.mainCategory}
                  />
                </Col>
                <Col md={6}>
                  {subOptions.length > 0 && (
                    <RegisterSelect
                      id="case-sub-cat"
                      label="نوع الحالة الفرعية"
                      options={[
                        { value: "", label: "اختر الحالة الفرعية" },
                        ...subOptions,
                      ]}
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      error={error.subCategory}
                    />
                  )}
                  {showOtherTextbox && (
                    <RegisterTextbox
                      id="case-other-cat"
                      label="أدخل نوع الحالة"
                      type="text"
                      value={showOtherTextboxValue}
                      onChange={(e) => setShowOtherTextboxValue(e.target.value)}
                      error={error.otherCategory}
                    />
                  )}
                </Col>
                <Col md={6}>
                  <RegisterSelect
                    id="case-benf"
                    label="إسم المستفيد"
                    options={[
                      { value: "", label: "إختر المستفيد" },
                      { value: "0", label: "لا يوجد مستفيد" },
                      ...human.map((item) => ({
                        value: item.id,
                        label: item.name,
                      })),
                    ]}
                    value={benf}
                    onChange={(e) => setBenf(e.target.value)}
                    error={error.benf}
                  />
                </Col>
              </Row>
            </div>

            <div className="form-section mb-4">
              <h5
                className="section-title mb-3"
                style={{
                  color: "var(--buttonbackground-color)",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "10px",
                }}
              >
                البيانات المالية والتسويقية
              </h5>
              <Row className="g-3">
                <Col md={6}>
                  <RegisterSelect
                    id="case-marketing"
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
                <Col md={6}>
                  <RegisterSelect
                    id="case-account"
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
                <Col md={12}>
                  <RegisterTextbox
                    id="case-total-cost"
                    label="مبلغ الدعم الكلي"
                    type="number"
                    value={totalCost}
                    onChange={(e) => setTotalCost(Number(e.target.value))}
                    error={error.totalCost}
                  />
                </Col>
              </Row>

              <div
                className="radiodatecon mt-3 p-3"
                style={{
                  backgroundColor: "var(--background-color)",
                  borderRadius: "15px",
                }}
              >
                <div
                  onChange={(e) => handleRadioChange(e.target.value)}
                  className="radioCon"
                >
                  <p className="mb-2 fw-bold">تقسيم المبلغ إلى</p>
                  <div className="d-flex gap-4">
                    <RegisterRadio
                      label="أسهم"
                      value="أسهم"
                      name="assetType"
                      checked={isAssetsSelected}
                    />
                    <RegisterRadio
                      label="قيمة"
                      value="قيمة"
                      name="assetType"
                      checked={!isAssetsSelected}
                    />
                  </div>
                </div>
                {isAssetsSelected && (
                  <div className="assetsCon mt-3">
                    <RegisterTextbox
                      id="case-assets-count"
                      label="عدد الأسهم"
                      type="number"
                      value={numberOfAssets}
                      onChange={(e) =>
                        setNumberOfAssets(Number(e.target.value))
                      }
                    />
                    <div
                      className="mt-2 p-2 text-center"
                      style={{
                        backgroundColor: "var(--surface-color)",
                        borderRadius: "8px",
                        border: "1px dashed var(--border-color)",
                      }}
                    >
                      سعر السهم الواحد:{" "}
                      <span className="fw-bold text-success">
                        {calculatePricePerAsset()} ريال
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-section mb-4">
              <h5
                className="section-title mb-3"
                style={{
                  color: "var(--buttonbackground-color)",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "10px",
                }}
              >
                التوقيت والمرفقات
              </h5>
              <Row className="g-3">
                <Col md={6}>
                  <div className="mb-3">
                    <p className="mb-2" style={{ textAlign: "right" }}>
                      تاريخ النشر
                    </p>
                    <input
                      type="date"
                      className="custom-datepicker w-100"
                      value={postDate}
                      onChange={(e) => setPostDate(e.target.value)}
                    />
                    {error.postDate && (
                      <small className="text-danger">{error.postDate}</small>
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
                      value={deedlineDate}
                      onChange={(e) => setDeedlineDate(e.target.value)}
                    />
                    {error.deedlineDate && (
                      <small className="text-danger">
                        {error.deedlineDate}
                      </small>
                    )}
                  </div>
                </Col>
                <Col md={12}>
                  <UploadInput
                    id="case-doc"
                    label="إرفاق صورة للحالة ان وجد"
                    onChange={(e) => setDocument(e.target.files[0])}
                    error={error.document}
                  />
                </Col>
              </Row>
            </div>

            <div className="form-section mb-4">
              <h5
                className="section-title mb-3"
                style={{
                  color: "var(--buttonbackground-color)",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "10px",
                }}
              >
                الوصف والتفاصيل
              </h5>
              <Row className="g-3">
                <Col md={6}>
                  <RegisterTextarea
                    id="case-desc1"
                    label="وصف الحالة"
                    placeholder="البيانات التي تظهر في كارت الحالة"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={error.description}
                    stylee={{ height: "120px" }}
                  />
                </Col>
                <Col md={6}>
                  <RegisterTextarea
                    id="case-desc2"
                    label="تكملة الوصف"
                    placeholder="البيانات التي لا تظهر في كارت الحالة"
                    value={description2}
                    onChange={(e) => setDescription2(e.target.value)}
                    error={error.description2}
                    stylee={{ height: "120px" }}
                  />
                </Col>
              </Row>
            </div>

            <div className="d-flex justify-content-center mt-4 mb-3">
              {isSubmitting ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <Button
                  variant="primary"
                  type="submit"
                  className="px-5 py-2 fw-bold"
                  style={{ borderRadius: "10px" }}
                >
                  حفظ البيانات
                </Button>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CaseDetails;
