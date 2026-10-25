import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import {
  faTable,
  faTimes,
  faTrash,
  faPlus,
  faXmark,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import "./AccountingEntry.css";
import RegisterTextbox from "../../../components/RegisterTextBox";
import { Button, Modal } from "react-bootstrap";
import "../Chartofaccounts/Chartofaccounts.css";
import SelectComponent from "../../../components/SelectComponent";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RegisterSelect from "../../../components/RegisterSelect";
import API from "../../../api/axiosConfig";
import TableComponent from "../../../components/TableComponent";

function AccountingEntry() {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [accountSelectionError, setAccountSelectionError] = useState("");
  const [emptyMoneyError, setEmptyMoneyError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const [description, setDescription] = useState("");
  const [payable, setPayable] = useState([]);
  const [debit, setDebit] = useState("");
  const [credit, setCredit] = useState("");
  const [accountdebit, setAccountdebit] = useState("");
  const [accountcredit, setAccountcredit] = useState("");

  const [trans, setTrans] = useState([]);

  const [rows, setRows] = useState([
    {
      accountId: "",
      accountNumber: "",
      accountName: "",
      debit: "",
      credit: "",
    },
    {
      accountId: "",
      accountNumber: "",
      accountName: "",
      debit: "",
      credit: "",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const addRow = () => {
    setSuccessMessage("");
    setRows((prevRows) => [
      ...prevRows,
      {
        account_id: "",
        credit: "",
        debit: "",
        account_number: "",
        account_name: "",
      },
    ]);
  };

  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const getAllPayableAccounts = async () => {
    try {
      const response = await API.get("/accounttree/entry");
      const data = response.data;

      const formattedOptions = data.map((acc) => ({
        value: acc.id,
        label: `${acc.code} - ${acc.name}`,
        code: acc.code,
        name: acc.name,
      }));

      setPayable(formattedOptions);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const getTrans = async () => {
  //   try {
  //     const response = await API.get("/transactions");

  //     setTrans(response.data);
  //   } catch (error) {
  //     console.error("Error fetching accounts:", error);
  //   }
  // };

  useEffect(() => {
    // getTrans();
    getAllPayableAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setAccountSelectionError("");
    setEmptyMoneyError("");
    setSuccessMessage("");

    const totalDebit = rows.reduce((s, r) => s + (parseFloat(r.debit) || 0), 0);
    const totalCredit = rows.reduce(
      (s, r) => s + (parseFloat(r.credit) || 0),
      0,
    );

    if (totalDebit === 0 && totalCredit === 0) {
      const msg = "من فضلك أدخل مبالغ المدين و الدائن قبل الحفظ ";
      setEmptyMoneyError(msg);
      window.alert(msg);
      return;
    }

    if (debit !== credit) {
      const msg = `يجب ان يتساوي المدين والدائن`;
      setError(msg);
      window.alert(msg);
      return;
    }

    const formData = new FormData();
    formData.append("debit", debit);
    formData.append("credit", credit);
    formData.append("accountdebit", accountdebit);
    formData.append("accountcredit", accountcredit);
    formData.append("description", description);
    formData.append("date", date);
    try {
      const response = await API.post("/transactions/generalentry", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      if (data.status === 200) {
        setSuccessMessage("تمت الاضافة بنجاح");
        setError("");
        setAccountSelectionError("");
        setEmptyMoneyError("");
        setDebit("");
        setCredit("");
        setAccountdebit("");
        setAccountcredit("");
        setDescription("");
        setDate("");
        setShowModal(false);
      } else if (data.status === 400) {
        setError(error.response.data.errors);
        setSuccessMessage("");
        setAccountSelectionError("");
        setEmptyMoneyError("");
      } else if (data.status === 401) {
        setAccountSelectionError("الرجاء اختيار حسابات صحيحة");
      } else if (data.status === 402) {
        setEmptyMoneyError("الرجاء ادخال قيمة صحيحة");
      }
    } catch (error) {
      setError(error.response.data.errors);
    }
  };

  const columns1 = [
    { name: "رقم القيد", key: "registration_number" },
    // { name: "رقم الفاتورة", key: "invoice_number" },
    { name: "التاريخ", key: "date" },
    { name: "النوع", key: "type_string" },
    { name: "القيمة", key: "debt_amount" },
  ];

  return (
    <>
      <Modal
        className="custom-modal-alt accountingModal"
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header className="haead-big entmodalTitle">
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
          <Modal.Title className="title-sub">القيد المحاسبي</Modal.Title>
        </Modal.Header>
        <Modal.Body className="model-subaccaount test">
          <div className="AccountingEntry AccountingEntrymod ">
            <div className="form-AccountingEntry form-AccountingEntry2">
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                <label>التاريخ</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "20px",
                    borderRadius: "20px",
                    border: "1px solid #ccc",
                    height: "40px",
                  }}
                />
              </div>

              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                label="الوصف"
                type="text"
                stylee={{ width: "30%" }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="table-header addEnt">
              <button onClick={addRow} className="addrowInvoice">
                <FontAwesomeIcon icon={faPlus} />
                إضافة صف
              </button>
            </div>
            <table className="accounting-table tableEntry mt-3 ">
              <thead>
                <tr>
                  <th>رقم الحساب</th>
                  <th>اسم الحساب</th>
                  <th>مدين</th>
                  <th>دائن</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <RegisterSelect
                      parentStyle={{ width: "100%", marginBottom: "20px" }}
                      stylee={{ width: "100% !important" }}
                      options={[
                        { value: "", label: "اختر رقم الحساب" },
                        ...payable.map((acc) => ({
                          value: acc.value,
                          label: acc.code,
                        })),
                      ]}
                      value={rows[0].accountId || ""}
                      onChange={(e) => {
                        const selected = payable.find(
                          (acc) => acc.value == e.target.value,
                        );
                        const updatedRows = [...rows];
                        updatedRows[0].accountId = selected?.value || "";
                        updatedRows[0].accountNumber = selected?.code || "";
                        updatedRows[0].accountName = selected?.name || "";
                        setRows(updatedRows);
                        setAccountdebit(selected?.value || "");
                      }}
                      error={error.accountcredit}
                    />
                  </td>

                  <td>
                    <RegisterSelect
                      parentStyle={{ width: "100%", marginBottom: "20px" }}
                      stylee={{ width: "100% !important" }}
                      options={[
                        { value: "", label: "اختر اسم الحساب" },
                        ...payable.map((acc) => ({
                          value: acc.value,
                          label: acc.name,
                        })),
                      ]}
                      value={rows[0].accountId || ""}
                      onChange={(e) => {
                        const selected = payable.find(
                          (acc) => acc.value == e.target.value,
                        );
                        const updatedRows = [...rows];
                        updatedRows[0].accountId = selected?.value || "";
                        updatedRows[0].accountNumber = selected?.code || "";
                        updatedRows[0].accountName = selected?.name || "";
                        setRows(updatedRows);
                        setAccountdebit(selected?.value || "");
                      }}
                      error={error.accountcredit}
                    />
                  </td>

                  <td>
                    <input
                      className="input21"
                      type="number"
                      value={rows[0].debit || ""}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[0].debit = e.target.value;
                        setRows(updatedRows);
                        setDebit(e.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <FontAwesomeIcon icon={faTimes} className="close-icon" />
                  </td>
                </tr>

                <tr>
                  <td>
                    <RegisterSelect
                      parentStyle={{ width: "100%", marginBottom: "20px" }}
                      stylee={{ width: "100% !important" }}
                      options={[
                        { value: "", label: "اختر رقم الحساب" },
                        ...payable.map((acc) => ({
                          value: acc.value,
                          label: acc.code,
                        })),
                      ]}
                      value={rows[1].accountId || ""}
                      onChange={(e) => {
                        const selected = payable.find(
                          (acc) => acc.value == e.target.value,
                        );
                        const updatedRows = [...rows];
                        updatedRows[1].accountId = selected?.value || "";
                        updatedRows[1].accountNumber = selected?.code || "";
                        updatedRows[1].accountName = selected?.name || "";
                        setRows(updatedRows);
                        setAccountcredit(selected?.value || "");
                      }}
                      error={error.accountdebit}
                    />
                  </td>

                  <td>
                    <RegisterSelect
                      parentStyle={{ width: "100%", marginBottom: "20px" }}
                      stylee={{ width: "100% !important" }}
                      options={[
                        { value: "", label: "اختر اسم الحساب" },
                        ...payable.map((acc) => ({
                          value: acc.value,
                          label: acc.name,
                        })),
                      ]}
                      value={rows[1].accountId || ""}
                      onChange={(e) => {
                        const selected = payable.find(
                          (acc) => acc.value == e.target.value,
                        );
                        const updatedRows = [...rows];
                        updatedRows[1].accountId = selected?.value || "";
                        updatedRows[1].accountNumber = selected?.code || "";
                        updatedRows[1].accountName = selected?.name || "";
                        setRows(updatedRows);
                        setAccountcredit(selected?.value || "");
                      }}
                      error={error.accountdebit}
                    />
                  </td>

                  <td>
                    <FontAwesomeIcon icon={faTimes} className="close-icon" />
                  </td>
                  <td>
                    <input
                      className="input21"
                      type="number"
                      value={rows[1].credit || ""}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[1].credit = e.target.value;
                        setRows(updatedRows);
                        setCredit(e.target.value);
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* {error && <p className="error-message">{error}</p>}
            {accountSelectionError && (
              <p className="error-message">{accountSelectionError}</p>
            )}
            {emptyMoneyError && (
              <p className="error-message">{emptyMoneyError}</p>
            )}
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )} */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSubmit}>
            حفظ
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            اغلاق
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        className="custom-modal-alt accountingModal"
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        size="lg"
      >
        <Modal.Header className="haead-big entmodalTitle">
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowEditModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
          <Modal.Title className="title-sub">
            تعديل القيد المحاسبي (رقم القيد: {selectedEntry?.id})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="model-subaccaount test">
          <div className="AccountingEntry AccountingEntrymod ">
            <div className="form-AccountingEntry form-AccountingEntry2">
              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                label="التاريخ"
                type="date"
                stylee={{ width: "55%" }}
              />

              <RegisterTextbox
                parentStyle={{ width: "30%" }}
                label="الوصف"
                type="text"
                stylee={{ width: "30%" }}
              />
            </div>
            <div className="table-header addEnt">
              <button onClick={addRow} className="addrowInvoice">
                <FontAwesomeIcon icon={faPlus} />
                إضافة صف
              </button>
            </div>

            <table className="accounting-table tableEntry mt-3 ">
              <thead>
                <tr>
                  <th> رقم الحساب </th>
                  <th> اسم الحساب </th>
                  <th> مدين </th>
                  <th> دائن </th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr>
                    <td>
                      <SelectComponent placeholder="رقم الحساب" />
                    </td>
                    <td>
                      <SelectComponent placeholder="اسم الحساب" />
                    </td>
                    <td>
                      {row.credit ? (
                        <div className="closed-field">
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="close-icon"
                          />
                        </div>
                      ) : (
                        <input
                          className="input21"
                          type="text"
                          inputMode="numeric"
                        />
                      )}
                    </td>
                    <td>
                      {row.debit ? (
                        <div className="closed-field">
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="close-icon"
                          />
                        </div>
                      ) : (
                        <input
                          className="input21"
                          type="text"
                          inputMode="numeric"
                        />
                      )}
                    </td>
                    <td>
                      <button
                        className="btn-trash"
                        type="button"
                        onClick={() => removeRow(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {error && <p className="error-message">{error}</p>}
            {accountSelectionError && (
              <p className="error-message">{accountSelectionError}</p>
            )}
            {emptyMoneyError && (
              <p className="error-message">{emptyMoneyError}</p>
            )}
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {}}>
            حفظ التعديلات
          </Button>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            اغلاق
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        className="custom-delete-modal accountingModal"
      >
        <Modal.Header className="border-0 justify-content-center">
          <div className="warning-icon">
            <FontAwesomeIcon icon={faTrash} size="2x" />
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h5 className="delete-title mb-3">تأكيد الحذف</h5>
          <p className="delete-text">
            هل أنت متأكد أنك تريد حذف القيد رقم{" "}
            <strong>{selectedEntry?.id}</strong>؟
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button
            variant="danger"
            className="px-4 rounded-pill shadow-sm"
            onClick={() => {
              setShowDeleteModal(false);
            }}
          >
            نعم، حذف
          </Button>
          <Button
            variant="secondary"
            className="px-4 rounded-pill shadow-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            الغاء
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="AccountingEntry-container">
        <div className="form-acc">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Title
              className="اسم الحساب"
              title="القيد المحاسبي"
              icon={<FontAwesomeIcon icon={faTable} />}
            />
          </div>
          {/* <div className="AccountingEntry">
            <div className="date-accounting-num enthead flex20">


              <div className="table-header">
                <button
                  onClick={() => setShowModal(true)}
                  className="addrowInvoice"
                >
                  <FontAwesomeIcon icon={faPlus} /> اضافة قيد
                </button>
              </div>
              <RegisterTextbox
                parentStyle={{ width: "15%" }}
                type="text"
                placeholder="رقم القيد"
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="من"
                  format="DD-MM-YYYY"
                />

              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="الى"
                  format="DD-MM-YYYY"
                />

              </LocalizationProvider>


            </div>

            <table className="accounting-table tow">
              <thead>
                <tr>
                  <th> رقم القيد </th>
                  <th> رقم الفاتورة </th>
                  <th> التاريخ</th>
                  <th> النوع</th>
                  <th> القيمة</th>
                  <th> الاجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1001</td>
                  <td>INV-2025</td>
                  <td>2025-06-29</td>
                  <td>قيد يدوي</td>
                  <td>5000</td>
                  <td>
                    <button
                      className="btn-action addrowInvoice"
                      onClick={() => {
                        setSelectedEntry({ id: 1001 });
                        setShowEditModal(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>

                    <button
                      className="btn-action addrowInvoice"
                      onClick={() => {
                        setSelectedEntry({ id: 1001 });
                        setShowDeleteModal(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              </tbody>

            </table>


          </div> */}
          {/* <div className="table-header table-header4">
            <button
              onClick={() => setShowModal(true)}
              className="addrowInvoice"
            >
              <FontAwesomeIcon icon={faPlus} /> اضافة قيد
            </button>
          </div> */}
          <TableComponent
            apiUrl="/transactions"
            columns={columns1}
            addBtn={true}
            addBtnName="قيد"
            onAddClick={() => setShowModal(true)}
            // dropdownOptions={dropdownOptions1}
            // search
            // transformRowFn={modifyRow}
          />
        </div>
      </div>
    </>
  );
}

export default AccountingEntry;
