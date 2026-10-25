import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark, faTree } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form } from "react-bootstrap";
import Title from "../../../components/title";
import "./Chartofaccounts.css";
import RegisterTextbox from "../../../components/RegisterTextBox";
import SelectComponent from "../../../components/SelectComponent";
import RegisterTextarea from "../../../components/RegisterTextarea";
import CustomTable from "../../../components/CustomTable";
import API from "../../../api/axiosConfig";
import TestPreLoader from "../../TestPreLoader/TestPreLoader";
import TableComponent from "../../../components/TableComponent";
import RegisterSelect from "../../../components/RegisterSelect";

function Chartofaccounts() {
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = (buttonName, filterFunction) => {
    setActiveButton(buttonName);
    filterFunction();
  };
  const [activeButton, setActiveButton] = useState("showAll");
  const [originsFilter, setOriginsFilter] = useState(false);
  const [commitmentsFilter, setCommitmentsFilter] = useState(false);
  const [copyrightFilter, setCopyrightFilter] = useState(false);
  const [debtFilter, setDebtFilter] = useState(false);
  const [revenuesFilter, setRevenuesFilter] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [filteredData, setFilteredData] = useState(null);
  const [accountsData, setAccountsData] = useState([]);
  const [mainAccounts, setMainAccounts] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [scrap, setScrap] = useState(0);
  const [duration, setDuration] = useState(0);
  const [check, setCheck] = useState("1");

  const showAllAccounts = () => {
    setFilteredData(null);
    setActiveButton("showAll");
  };

  const toggleOriginsFilter = () => {
    const origins = accountsData.filter(
      (account) => account.code && account.code.startsWith("1"),
    );
    setFilteredData(origins);
  };

  const toggleCommitmentsFilter = () => {
    const commitments = accountsData.filter(
      (account) => account.code && account.code.startsWith("2"),
    );
    setFilteredData(commitments);
  };

  const toggleCopyrightFilter = () => {
    const copyright = accountsData.filter(
      (account) => account.code && account.code.startsWith("3"),
    );
    setFilteredData(copyright);
  };

  const toggleRevenuesFilter = () => {
    const revenues = accountsData.filter(
      (account) => account.code && account.code.startsWith("4"),
    );
    setFilteredData(revenues);
  };

  const [selectedNode, setSelectedNode] = useState(null);
  const [showModalacc, setShowModalacc] = useState(false);
  const [open, setOpen] = useState(false);
  const [editableModalData, setEditableModalData] = useState([]);
  const [showEditableModal, setShowEditableModal] = useState(false);
  const [depreciation, setDepreciation] = useState(false);
  const handleRowClick = (node) => {
    if (node.level == 1 || node.is_payable === false) {
      setSelectedNode(node);
      setShowModalacc(true);
      setOpen(true);
    } else {
      setSelectedNode(node);
      setEditableModalData(node);
      setShowEditableModal(true);
    }
  };
  const handleCloseModal = () => {
    setShowModalacc(false);
    setSelectedNode(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;

    setEditableModalData((prev) => {
      if (prev[name] === value) {
        return prev;
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleEditSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editableModalData.name);
    formData.append("balance", editableModalData.balance);
    formData.append("cashflow", editableModalData.cash_flow_type);
    formData.append("description", editableModalData.description);
    formData.append("check", check);
    formData.append("id", editableModalData.id);
    try {
      await API.post("/accounttree/update", formData);
      setShowEditableModal(false);
      getAllAcounts();
    } catch (error) {
      console.error("Error adding supplier:", error);
      //setFormMessage(error.response.data.message);
    }
  };
  const filterTree = (tree, searchTerm) => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    const filterNode = (node) => {
      const nameMatch =
        node.name && node.name.toLowerCase().includes(lowerSearchTerm);

      // إذا كانت العقدة تطابق البحث، نعيدها فقط
      if (nameMatch) {
        return { ...node, children: [] }; // نعيد العقدة بدون الأطفال
      }

      // إذا كانت العقدة لا تطابق البحث، نتجاهلها تمامًا
      return null;
    };

    // نبحث في الشجرة بالكامل (بما في ذلك الأطفال) ونرجع فقط العقد التي تطابق البحث
    const flatFilter = (nodes) => {
      let results = [];
      for (const node of nodes) {
        if (filterNode(node)) {
          results.push(filterNode(node)); // نضيف العقدة المطابقة
        }
        if (node.children) {
          results = results.concat(flatFilter(node.children)); // نبحث في الأطفال
        }
      }
      return results;
    };

    return flatFilter(tree); // نرجع النتائج بعد البحث
  };
  const getFilteredAccounts = () => {
    let dataToFilter = filteredData || accountsData;

    if (searchTerm) {
      dataToFilter = filterTree(dataToFilter, searchTerm);
    }

    return dataToFilter;
  };

  const filteredAccounts = getFilteredAccounts();

  const getAllAcounts = async () => {
    try {
      const response = await API.get("accounttree");

      const fetchedData = (await response.data) || {};
      const dataArray = Object.values(fetchedData);
      setAccountsData(dataArray);
      const fatherAccounts = dataArray;
      setMainAccounts(fatherAccounts);

      const types = dataArray
        .map((account) => account.cash_flow_type)
        .filter(Boolean);
      setAccountTypes([...new Set(types)]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load account data.");
    }
  };
  const renderTreeTable = (nodes, level = 0) => {
    if (!Array.isArray(nodes)) return null;
    return nodes.map((node) => (
      <React.Fragment key={node.id}>
        <tr
          onDoubleClick={() => handleRowClick(node)}
          onMouseEnter={() => setHoveredRow(node.id)}
          onMouseLeave={() => setHoveredRow(null)}
          className="hoverd-account"
        >
          <td
            style={{
              paddingRight: `${node.level * 30}px`,
              paddingLeft: `${level * 30}px`,
              textAlign: "start",
              direction: "rtl",
              fontWeight:
                node.level === 0
                  ? "bold"
                  : node.level === 1
                    ? "bold"
                    : node.level === 2
                      ? "bold"
                      : "normal",
              fontSize:
                node.level === 0 ? "22px" : node.level === 1 ? "20px" : "18px",
            }}
            className="accnumpad"
          >
            {node.code}
          </td>
          <td
            style={{
              fontWeight:
                node.level === 0
                  ? "bold"
                  : node.level === 1
                    ? "bold"
                    : node.level === 2
                      ? "bold"
                      : "normal",
              fontSize:
                node.level === 0 ? "20px" : node.level === 1 ? "18px" : "16px",
              textAlign: "center",
            }}
          >
            {node.name}
          </td>
          <td
            style={{
              direction: "rtl",
              fontWeight:
                node.level === 0
                  ? "bold"
                  : node.level === 1
                    ? "bold"
                    : node.level === 2
                      ? "bold"
                      : "normal",
              fontSize:
                node.level === 0 ? "22px" : node.level === 1 ? "20px" : "18px",
              textAlign: "center",
            }}
          >
            {node.is_payable ? "نعم" : "لا"}
          </td>
          <td
            style={{
              direction: "rtl",
              fontWeight:
                node.level === 0
                  ? "bold"
                  : node.level === 1
                    ? "bold"
                    : node.level === 2
                      ? "bold"
                      : "normal",
              fontSize:
                node.level === 0 ? "22px" : node.level === 1 ? "20px" : "18px",
              textAlign: "center",
            }}
          >
            {node.final_balance}
          </td>
          <td
            style={{
              direction: "rtl",
              textAlign: "center",
              fontWeight:
                node.level === 0
                  ? "bold"
                  : node.level === 1
                    ? "bold"
                    : node.level === 2
                      ? "bold"
                      : "normal",
              fontSize:
                node.level === 0 ? "22px" : node.level === 1 ? "20px" : "18px",
            }}
          >
            {node.cash_flow_type == 0
              ? ""
              : node.cash_flow_type == 1
                ? "تشغيليه"
                : node.cash_flow_type == 2
                  ? "اسثمارية"
                  : "تمويلية"}
          </td>
        </tr>
        {node.children &&
          node.children.length > 0 &&
          renderTreeTable(node.children, level + 1)}
      </React.Fragment>
    ));
  };

  useEffect(() => {
    getAllAcounts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  ////////////////////////////////////////////////////
  const [fatherAccount, setFatherAccount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [formData, setFormData] = useState({
    accountNumber: "",
    accountType: "",
    mainAccount: "",
    subAccount: "",
    subSubAccount: "",
    openingBalance: "",
    description: "",
    calculateDepreciation: "",
    hasUsefulLife: "",
    usefulLife: "",
    cashFlow: "",
  });
  const [subAccounts, setSubAccounts] = useState([]);
  const [subSubAccounts, setSubSubAccounts] = useState([]);
  const [accountid, setAccountid] = useState("");
  const [balance, setBalance] = useState("");
  const [cashflowtype, setcashflowtype] = useState("");
  const [description, setDescription] = useState("");
  const [subAccountssub, setSubAccountssub] = useState([]);
  const [sub2Account, setSub2Account] = useState("");
  const handleMainAccountChange = (selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.target.value : "";
    setFormData({
      ...formData,
      mainAccount: selectedValue,
      subAccount: "",
      subSubAccount: "",
    });

    const selectedAccount = accountsData.filter(
      (account) => account.parent_id === selectedValue,
    );
    console.log(selectedAccount);
    if (selectedAccount) {
      setSubAccounts(selectedAccount);
      setFatherAccount(selectedValue);
    } else {
      setSubAccounts([]);
      setSubSubAccounts([]);
    }
  };
  const handleSubAccountSubChange = (selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.target.value : "";
    setFormData({
      ...formData,
      subSubAccount: selectedValue,
      subAccount: "",
    });
    const selectedSubAccount = accountsData.filter(
      (account) => account.parent_id === selectedValue,
    );
    if (selectedValue === "9e5000ce-acfc-4762-8684-4e7f441a5585") {
      setDepreciation(true);
    } else {
      setDepreciation(false);
    }
    if (selectedSubAccount) {
      setSubAccountssub(selectedSubAccount);
      setAccountid(selectedValue);
    } else {
      setSubAccountssub([]);
    }
  };

  const handleSubAccountChange = (selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.target.value : "";
    setFormData({
      ...formData,
      subAccount: selectedValue,
      subSubAccount: "",
    });

    const selectedSubAccount = accountsData.filter(
      (account) => account.parent_id === selectedValue,
    );
    if (selectedSubAccount) {
      setSubSubAccounts(selectedSubAccount);
    } else {
      setSubSubAccounts([]);
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    const fData = new FormData();
    fData.append("accountname", accountName);
    fData.append("accountid", accountid);
    fData.append("accounttypeid", fatherAccount);
    fData.append("balance", balance);
    fData.append("cashflowtype", cashflowtype);
    fData.append("description", description);
    fData.append("subaccountid", sub2Account);
    fData.append("scrap", scrap);
    fData.append("duration", duration);
    try {
      const response = await API.post("/accounttree/store", fData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.data;
      getAllAcounts();
    } catch (error) {
      console.error("Error adding account:", error);
    }
    setShowModal(false);
  };

  return (
    <div className="Chartofaccounts-container">
      <Title title="شجرة الحسابات" icon={<FontAwesomeIcon icon={faTree} />} />
      {/* ========================================================================== */}
      <div className="buttons-container">
        <button
          onClick={() => handleButtonClick("showAll", showAllAccounts)}
          className={`btntreesersh ${
            activeButton === "showAll" ? "active" : ""
          }`}
        >
          عرض الجميع
        </button>
        <button
          onClick={() => handleButtonClick("origins", toggleOriginsFilter)}
          className={`btntreesersh ${
            activeButton === "origins" ? "active" : ""
          }`}
        >
          الأصول
        </button>
        <button
          onClick={() =>
            handleButtonClick("commitments", toggleCommitmentsFilter)
          }
          className={`btntreesersh ${
            activeButton === "commitments" ? "active" : ""
          }`}
        >
          الإلتزامات
        </button>
        <button
          onClick={() => handleButtonClick("copyright", toggleCopyrightFilter)}
          className={`btntreesersh ${
            activeButton === "copyright" ? "active" : ""
          }`}
        >
          الايرادات
        </button>
        <button
          onClick={() => handleButtonClick("revenues", toggleRevenuesFilter)}
          className={`btntreesersh ${
            activeButton === "revenues" ? "active" : ""
          }`}
        >
          المصروفات
        </button>
      </div>
      {/* ============================================================== */}
      <div className="search-container"></div>

      <div className="table-tree-container">
        <div className="form-tree">
          <div className="addaccount-form mb-3">
            <button
              onClick={() => setShowModal(true)}
              className="addrowInvoice  "
            >
              <FontAwesomeIcon icon={faPlus} /> اصافة حساب
            </button>
          </div>
          <div className="search">
            <RegisterTextbox
              type="text"
              placeholder="البحث"
              className="search-input"
              parentStyle={{ width: "70%" }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <table className="table-tree">
          <thead>
            <tr></tr>
            <tr className="head-Chartofaccounts">
              <th> رقم الحساب </th>
              <th> اسم الحساب </th>
              <th>يمكن الدفع عليه </th>
              <th>الرصيد </th>
              <th>نوع التدفق المالي </th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length > 0 ? (
              renderTreeTable(filteredAccounts)
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  لا يوجد بيانات
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        className="add-subacc-modal"
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
          <Modal.Title className="title-sub">اضافة حساب فرعي</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="form-subaccc">
            <div className="from1-subacc">
              <Form.Group className="sub-inputs">
                <Form.Label> نوع الحساب </Form.Label>
                <RegisterSelect
                  className="mm-sub"
                  options={[
                    { value: "0", label: "اختر نوع الحساب" },
                    {
                      value: "027f1e75-ff52-11ef-9b6b-28924a2a68b3",
                      label: "الأصول",
                    },
                    {
                      value: "027f3315-ff52-11ef-9b6b-28924a2a68b3",
                      label: "الالتزامات",
                    },
                    {
                      value: "1a9c82c8-ff52-11ef-9b6b-28924a2a68b3",
                      label: "المصروفات",
                    },
                    {
                      value: "1a9c9010-ff52-11ef-9b6b-28924a2a68b3",
                      label: "الإيرادات",
                    },
                  ]}
                  onChange={(selectedOption) =>
                    handleMainAccountChange(selectedOption)
                  }
                />
              </Form.Group>
              <Form.Group className="sub-inputs">
                <Form.Label style={{ textAlign: "right" }}>
                  {" "}
                  اسم الحساب{" "}
                </Form.Label>
                <RegisterTextbox
                  className="mm-sub"
                  type="text"
                  name="accountNumber"
                  placeholder="اسم الحساب"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  // placeholder=''
                />
              </Form.Group>
            </div>
            <div className="main-form">
              <div className="from1-subacc">
                <Form.Group className="sub-inputs">
                  <Form.Label> اسم الحساب الفرعي </Form.Label>
                  <RegisterSelect
                    className="mm-sub"
                    placeholder="اسم الحساب الفرعي"
                    options={[
                      { value: "0", label: "اختر اسم الحساب الفرعي" },
                      ...subSubAccounts.map((account) => ({
                        value: account.id,
                        label: account.name,
                      })),
                    ]}
                    onChange={(selectedOption) =>
                      handleSubAccountSubChange(selectedOption)
                    }
                  />
                </Form.Group>

                <Form.Group className="sub-inputs">
                  <Form.Label> اختر الحساب الاب</Form.Label>
                  <RegisterSelect
                    options={[
                      { value: "0", label: "اختر الحساب الاب" },
                      ...subAccounts.map((account) => ({
                        value: account.id,
                        label: account.name,
                      })),
                    ]}
                    className="mm-sub"
                    placeholder="اختر الحساب الاب"
                    onChange={(selectedOption) =>
                      handleSubAccountChange(selectedOption)
                    }
                  />
                </Form.Group>
              </div>
              <div className="from1-subacc">
                <Form.Group className="sub-inputs">
                  <Form.Label> الرصيد </Form.Label>
                  <RegisterTextbox
                    className="opening-blancesub"
                    type="number"
                    name="openingBalance"
                    placeholder="00"
                    onChange={(e) => setBalance(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="sub-inputs">
                  <Form.Label> اختر الحساب الادنى</Form.Label>
                  <RegisterSelect
                    options={[
                      { value: "0", label: "اختر الحساب الادنى" },
                      ...subAccountssub.map((account) => ({
                        value: account.id,
                        label: account.name,
                      })),
                    ]}
                    className="mm-sub"
                    onChange={(e) => setSub2Account(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="from1-subacc">
                <Form.Group className="sub-inputs">
                  <Form.Label> الوصف </Form.Label>
                  <RegisterTextarea
                    className="mm-sub"
                    name="description"
                    placeholder="الوصف"
                    stylee={{ width: "100%" }}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="sub-inputs">
                  <Form.Label> حساب التدفق النقدي </Form.Label>
                  <RegisterSelect
                    className="opening-blancesub"
                    type="text"
                    name="cashFlow"
                    placeholder="حساب التدفق النقدي"
                    options={[
                      { value: "0", label: "اختر حساب التدفق النقدي" },
                      { value: "1", label: "تشغيلية" },
                      { value: "2", label: "استثمارية" },
                      { value: "3", label: "تمويلية" },
                    ]}
                    onChange={(e) => setcashflowtype(e.target.value)}
                  />
                </Form.Group>
              </div>
              {depreciation && (
                <Form.Group className="sub-inputs2">
                  <Form.Label> حساب الخردة </Form.Label>
                  <RegisterTextbox
                    className="opening-blancesub"
                    type="number"
                    name="openingBalance"
                    placeholder="00"
                    onChange={(e) => setScrap(e.target.value)}
                  />
                  <Form.Label>المدة </Form.Label>
                  <RegisterTextbox
                    className="opening-blancesub"
                    type="number"
                    name="openingBalance"
                    placeholder="00"
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </Form.Group>
              )}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            اغلاق
          </Button>
          <Button variant="primary" onClick={handleAddAccount}>
            حفظ
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal className="showacc-modal" show={showModalacc}>
        <Modal.Header>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={handleCloseModal}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
          <Modal.Title> {"تفاصيل الحساب"} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNode && (
            <table className="table-tree trtr">
              <thead>
                <tr className="head-Chartofaccounts">
                  <th>{"النوع"}</th>
                  <th>{"القيمة"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td> {"رقم الحساب"} </td>
                  <td>{selectedNode?.number}</td>
                </tr>
                <tr>
                  <td>{"اسم الحساب"} </td>
                  <td>{selectedNode?.name}</td>
                </tr>
                <tr>
                  <td>{"يمكن الدفع عليه"} </td>
                  <td>{selectedNode?.is_payable === "True" ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td>{"الرصيد"} </td>
                  <td>{selectedNode?.balance || "N/A"}</td>
                </tr>
                <tr>
                  <td>{"نوع التدفق المالي"} </td>
                  <td>{selectedNode?.accountType || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {"اغلاق"}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Account Modal */}
      <Modal
        className="edit-acc-modal"
        show={showEditableModal}
        onHide={() => setShowEditableModal(false)}
        centered
      >
        <Modal.Header>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowEditableModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
          <Modal.Title className="title-sub">تعديل الحساب</Modal.Title>
        </Modal.Header>
        <Modal.Body className="model-subaccaount">
          <Form className="form-subaccc">
            <div className="from1-subacc">
              <Form.Group className="sub-inputs"></Form.Group>
            </div>
            <div className="main-form">
              <div className="from1-subacc">
                <div className="addaccrow">
                  <Form.Group className="sub-inputs">
                    <Form.Label>حالة الحساب</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        type="radio"
                        label="غير فعال"
                        name="calculateDepreciation"
                        value={"0"}
                        onChange={(e) => setCheck(e.target.value)}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="فعال"
                        name="calculateDepreciation"
                        value={"1"}
                        defaultChecked
                        onChange={(e) => setCheck(e.target.value)}
                      />
                    </div>
                  </Form.Group>
                </div>
              </div>
              <div className="from1-subacc">
                <Form.Group className="sub-inputs">
                  <Form.Label>اسم الحساب</Form.Label>
                  <RegisterTextbox
                    className="mm-sub"
                    type="text"
                    name="name"
                    value={editableModalData?.name || [""]}
                    placeholder={"اسم الحساب"}
                    onChange={(e) =>
                      setEditableModalData({
                        ...editableModalData,
                        name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
              <div className="from1-subacc">
                <Form.Group className="sub-inputs">
                  <Form.Label>الرصيد </Form.Label>
                  <RegisterTextbox
                    className="csscscsc"
                    type="number"
                    name="balance"
                    value={editableModalData?.balance || ""}
                    placeholder="00"
                    onChange={(e) =>
                      setEditableModalData({
                        ...editableModalData,
                        balance: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
              <div className="from1-subacc">
                <Form.Group className="sub-inputs">
                  <Form.Label>نوع التدفق المالي</Form.Label>

                  <RegisterSelect
                    id="cashFlow"
                    stylee={{
                      width: "100% !important",
                    }}
                    parentStyle={{
                      width: "100%",
                      marginBottom: "20px",
                    }}
                    name="cashFlow"
                    options={[
                      { value: "0", label: "اختر حساب التدفق النقدي" },
                      { value: "1", label: "تشغيلية" },
                      { value: "2", label: "استثمارية" },
                      { value: "3", label: "تمويلية" },
                    ]}
                    value={editableModalData?.cash_flow_type || ""}
                    onChange={(e) =>
                      setEditableModalData({
                        ...editableModalData,
                        cash_flow_type: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>

              <div className="from1-subacc">
                <Form.Group className="sub-inputs">
                  <Form.Label>الوصف</Form.Label>
                  <RegisterTextarea
                    className="opening-blancesub"
                    name="description"
                    value={editableModalData?.description || ""}
                    placeholder={"الوصف"}
                    onChange={(e) =>
                      setEditableModalData({
                        ...editableModalData,
                        description: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEditableModal(false)}
          >
            اغلاق
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            حفظ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Chartofaccounts;
