import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faXmark,
  faTree,
  faChevronDown,
  faChevronLeft,
  faSearch,
  faFolder,
  faFolderOpen,
  faEye,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
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

  const [activeCategory, setActiveCategory] = useState("all");
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

  const formatMoney = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "0.00";
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleCategorySelect = (categoryCode) => {
    setActiveCategory(String(categoryCode));
    if (categoryCode === "all") {
      setFilteredData(null);
    } else {
      const filtered = accountsData.filter((account) => {
        const code = String(account.code || "");
        return code === String(categoryCode) || code.startsWith(String(categoryCode));
      });
      setFilteredData(filtered);
    }
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

  const filterTree = (tree, search) => {
    const term = search.toLowerCase().trim();
    if (!term) return tree;

    const filterNodes = (nodes) => {
      let results = [];
      for (const node of nodes) {
        const nameMatches = node.name && node.name.toLowerCase().includes(term);
        const codeMatches = node.code && String(node.code).toLowerCase().includes(term);
        const isMatch = nameMatches || codeMatches;

        const matchingChildren = node.children && node.children.length > 0
          ? filterNodes(node.children)
          : [];

        if (isMatch || matchingChildren.length > 0) {
          results.push({
            ...node,
            children: matchingChildren.length > 0 ? matchingChildren : (node.children || []),
          });
        }
      }
      return results;
    };

    return filterNodes(tree);
  };
  const getFilteredAccounts = () => {
    let dataToFilter = filteredData || accountsData;

    if (searchTerm) {
      dataToFilter = filterTree(dataToFilter, searchTerm);
    }

    return dataToFilter;
  };

  const filteredAccounts = getFilteredAccounts();

  const flattenTree = (nodes) => {
    let list = [];
    if (!Array.isArray(nodes)) return list;
    for (const node of nodes) {
      list.push(node);
      if (node.children && node.children.length > 0) {
        list = list.concat(flattenTree(node.children));
      }
    }
    return list;
  };

  const getAllAcounts = async () => {
    try {
      const response = await API.get("accounttree");

      const fetchedData = response.data?.data || response.data || [];
      const dataArray = Array.isArray(fetchedData) ? fetchedData : Object.values(fetchedData);
      setAccountsData(dataArray);
      setMainAccounts(dataArray);

      const flat = flattenTree(dataArray);
      const types = flat
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
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;

      return (
        <React.Fragment key={node.id}>
          <tr
            onDoubleClick={() => handleRowClick(node)}
            onMouseEnter={() => setHoveredRow(node.id)}
            onMouseLeave={() => setHoveredRow(null)}
            className={`account-tree-row level-${node.level ?? level} ${
              node.is_payable ? "is-leaf" : "is-parent"
            } ${hoveredRow === node.id ? "is-hovered" : ""}`}
          >
            <td className="acc-code-cell">
              <span className={`code-pill level-pill-${node.level ?? level}`}>
                {node.code}
              </span>
            </td>

            <td
              className="acc-name-cell"
              style={{
                paddingRight: `${(node.level ?? level) * 24 + 18}px`,
              }}
            >
              <div className="acc-name-wrapper">
                <span
                  className={`acc-name-text ${!node.is_payable ? "fw-bold text-dark" : ""}`}
                  title={node.name}
                >
                  {node.name}
                </span>
              </div>
            </td>

            <td className="acc-type-cell">
              {node.is_payable ? (
                <span className="badge-payable badge-leaf">فرعي (يقبل حركات)</span>
              ) : (
                <span className="badge-payable badge-parent">رئيسي (تجميعي)</span>
              )}
            </td>

            <td className="acc-balance-cell">
              <span
                className={`balance-value ${
                  Number(node.final_balance ?? node.opening_balance ?? 0) < 0
                    ? "negative"
                    : ""
                }`}
              >
                {formatMoney(node.final_balance ?? node.opening_balance ?? 0)}
              </span>
            </td>

            <td className="acc-cashflow-cell">
              {node.cash_flow_type == 1 ? (
                <span className="badge-cashflow operating">تشغيلية</span>
              ) : node.cash_flow_type == 2 ? (
                <span className="badge-cashflow investing">استثمارية</span>
              ) : node.cash_flow_type == 3 ? (
                <span className="badge-cashflow financing">تمويلية</span>
              ) : (
                <span className="badge-cashflow none">-</span>
              )}
            </td>
          </tr>

          {hasChildren && renderTreeTable(node.children, level + 1)}
        </React.Fragment>
      );
    });
  };

  useEffect(() => {
    getAllAcounts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  ////////////////////////////////////////////////////
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const [level4, setLevel4] = useState("");

  const [level2Options, setLevel2Options] = useState([]);
  const [level3Options, setLevel3Options] = useState([]);
  const [level4Options, setLevel4Options] = useState([]);

  const [accountName, setAccountName] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [balance, setBalance] = useState("0");
  const [cashflowtype, setcashflowtype] = useState("0");
  const [isPayable, setIsPayable] = useState("1");
  const [description, setDescription] = useState("");

  const resetModalForm = () => {
    setLevel1("");
    setLevel2("");
    setLevel3("");
    setLevel4("");
    setLevel2Options([]);
    setLevel3Options([]);
    setLevel4Options([]);
    setGeneratedCode("");
    setAccountName("");
    setBalance("0");
    setcashflowtype("0");
    setIsPayable("1");
    setDescription("");
    setScrap(0);
    setDuration(0);
    setDepreciation(false);
  };

  const fetchNextCode = async (parentId) => {
    if (!parentId || parentId === "0") {
      setGeneratedCode("");
      return;
    }
    try {
      const res = await API.get("/accounttree/next-code", { params: { parent_id: parentId } });
      const info = res.data?.data || res.data;
      if (info?.suggested_code) {
        setGeneratedCode(info.suggested_code);
        if (info.cash_flow_type !== undefined) {
          setcashflowtype(String(info.cash_flow_type));
        }
        setDepreciation(Boolean(info.is_depreciable));
      }
    } catch (err) {
      console.error("Error fetching next code:", err);
    }
  };

  const handleLevel1Change = (e) => {
    const val = e?.target ? e.target.value : (e || "");
    setLevel1(val);
    setLevel2("");
    setLevel3("");
    setLevel4("");
    setLevel3Options([]);
    setLevel4Options([]);

    const flat = flattenTree(accountsData);
    const sub = flat.filter((a) => String(a.parent_id) === String(val));
    setLevel2Options(sub);
    fetchNextCode(val);
  };

  const handleLevel2Change = (e) => {
    const val = e?.target ? e.target.value : (e || "");
    setLevel2(val);
    setLevel3("");
    setLevel4("");
    setLevel4Options([]);

    const flat = flattenTree(accountsData);
    const sub = flat.filter((a) => String(a.parent_id) === String(val));
    setLevel3Options(sub);
    fetchNextCode(val && val !== "0" ? val : level1);
  };

  const handleLevel3Change = (e) => {
    const val = e?.target ? e.target.value : (e || "");
    setLevel3(val);
    setLevel4("");

    const flat = flattenTree(accountsData);
    const sub = flat.filter((a) => String(a.parent_id) === String(val));
    setLevel4Options(sub);
    fetchNextCode(val && val !== "0" ? val : level2 || level1);
  };

  const handleLevel4Change = (e) => {
    const val = e?.target ? e.target.value : (e || "");
    setLevel4(val);
    fetchNextCode(val && val !== "0" ? val : level3 || level2 || level1);
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (!accountName.trim()) {
      alert("يرجى إدخال اسم الحساب");
      return;
    }
    const effectiveParentId = (level4 && level4 !== "0")
      ? level4
      : (level3 && level3 !== "0")
        ? level3
        : (level2 && level2 !== "0")
          ? level2
          : (level1 && level1 !== "0")
            ? level1
            : null;

    if (!effectiveParentId) {
      alert("يرجى اختيار نوع أو تصنيف الحساب الأب");
      return;
    }

    const fData = new FormData();
    fData.append("name", accountName);
    fData.append("accountname", accountName);
    fData.append("parent_id", effectiveParentId);
    fData.append("accountid", effectiveParentId);
    fData.append("code", generatedCode);
    fData.append("accountNumber", generatedCode);
    fData.append("opening_balance", balance || 0);
    fData.append("balance", balance || 0);
    fData.append("cash_flow_type", cashflowtype || 0);
    fData.append("cashflowtype", cashflowtype || 0);
    fData.append("is_payable", isPayable === "1" ? "1" : "0");
    fData.append("description", description || "");
    fData.append("scrap_value", scrap || 0);
    fData.append("scrap", scrap || 0);
    fData.append("useful_life", duration || 0);
    fData.append("duration", duration || 0);

    try {
      await API.post("/accounttree/store", fData);
      getAllAcounts();
      setShowModal(false);
      resetModalForm();
    } catch (error) {
      console.error("Error adding account:", error);
    }
  };

  return (
    <div className="Chartofaccounts-container">
      <Title title="شجرة الحسابات" icon={<FontAwesomeIcon icon={faTree} />} />
      {/* شريط تصنيفات الحسابات الرئيسية */}
      <div className="coa-categories-bar">
        <button
          type="button"
          onClick={() => handleCategorySelect("all")}
          className={`coa-cat-btn ${activeCategory === "all" ? "active" : ""}`}
        >
          عرض الجميع
        </button>
        {accountsData.map((root) => (
          <button
            key={root.id || root.code}
            type="button"
            onClick={() => handleCategorySelect(root.code)}
            className={`coa-cat-btn ${activeCategory === String(root.code) ? "active" : ""}`}
          >
            {root.code} - {root.name}
          </button>
        ))}
      </div>

      {/* شريط الإجراءات والبحث */}
      <div className="coa-toolbar">
        <div className="coa-search-box">
          <FontAwesomeIcon icon={faSearch} className="coa-search-icon" />
          <input
            type="text"
            className="coa-search-input"
            placeholder="بحث برقم الحساب أو الاسم..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              type="button"
              className="coa-clear-search"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}
        </div>

        <div className="coa-actions-group">
          <button
            type="button"
            onClick={() => {
              resetModalForm();
              setShowModal(true);
            }}
            className="coa-btn-primary"
          >
            <FontAwesomeIcon icon={faPlus} /> إضافة حساب جديد
          </button>
        </div>
      </div>

      {/* جدول شجرة الحسابات */}
      <div className="coa-table-card">
        <table className="coa-tree-table">
          <thead>
            <tr className="coa-table-header">
              <th style={{ width: "15%" }}>رقم الحساب</th>
              <th style={{ width: "45%" }}>اسم الحساب</th>
              <th style={{ width: "14%" }}>طبيعة الحساب</th>
              <th style={{ width: "13%" }}>الرصيد</th>
              <th style={{ width: "13%" }}>نوع التدفق المالي</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length > 0 ? (
              renderTreeTable(filteredAccounts)
            ) : (
              <tr>
                <td colSpan="5" className="coa-no-data">
                  لا توجد حسابات مطابقة لمعايير البحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        className="add-subacc-modal"
        show={showModal}
        onHide={() => {
          resetModalForm();
          setShowModal(false);
        }}
        centered
      >
        <Modal.Header>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => {
              resetModalForm();
              setShowModal(false);
            }}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
          <Modal.Title className="title-sub">اضافة حساب</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="form-subaccc">
            {/* الصف الأول: المستوى 1 (الرئيسي) والمستوى 2 (العام) */}
            <div className="from1-subacc">
              <Form.Group className="sub-inputs">
                <Form.Label>نوع الحساب (المستوى 1) *</Form.Label>
                <RegisterSelect
                  className="mm-sub"
                  value={level1}
                  options={[
                    { value: "", label: "اختر نوع الحساب" },
                    ...(mainAccounts || []).map((account) => ({
                      value: account.id,
                      label: `${account.code ? account.code + ' - ' : ''}${account.name}`,
                    })),
                  ]}
                  onChange={handleLevel1Change}
                />
              </Form.Group>
              <Form.Group className="sub-inputs">
                <Form.Label>الحساب العام (المستوى 2)</Form.Label>
                <RegisterSelect
                  className="mm-sub"
                  value={level2}
                  disabled={!level1}
                  options={[
                    { value: "", label: level1 ? "اختر الحساب العام (المستوى 2)" : "اختر المستوى الأول أولاً" },
                    ...(level2Options || []).map((account) => ({
                      value: account.id,
                      label: `${account.code ? account.code + ' - ' : ''}${account.name}`,
                    })),
                  ]}
                  onChange={handleLevel2Change}
                />
              </Form.Group>
            </div>

            {/* الصف الثاني: المستوى 3 (الفرعي) والمستوى 4 (التفصيلي) */}
            <div className="from1-subacc">
              <Form.Group className="sub-inputs">
                <Form.Label>الحساب الفرعي (المستوى 3)</Form.Label>
                <RegisterSelect
                  className="mm-sub"
                  value={level3}
                  disabled={!level2}
                  options={[
                    { value: "", label: level2 ? "اختر الحساب الفرعي (المستوى 3 - اختياري)" : "اختر المستوى الثاني أولاً" },
                    ...(level3Options || []).map((account) => ({
                      value: account.id,
                      label: `${account.code ? account.code + ' - ' : ''}${account.name}`,
                    })),
                  ]}
                  onChange={handleLevel3Change}
                />
              </Form.Group>
              <Form.Group className="sub-inputs">
                <Form.Label>الحساب التفصيلي (المستوى 4)</Form.Label>
                <RegisterSelect
                  className="mm-sub"
                  value={level4}
                  disabled={!level3}
                  options={[
                    { value: "", label: level3 ? "اختر الحساب التفصيلي (المستوى 4 - اختياري)" : "اختر المستوى الثالث أولاً" },
                    ...(level4Options || []).map((account) => ({
                      value: account.id,
                      label: `${account.code ? account.code + ' - ' : ''}${account.name}`,
                    })),
                  ]}
                  onChange={handleLevel4Change}
                />
              </Form.Group>
            </div>

            {/* الصف الثالث: اسم الحساب الجديد */}
            <div className="from1-subacc">
              <Form.Group className="sub-inputs" style={{ width: "100%" }}>
                <Form.Label style={{ textAlign: "right" }}>
                  اسم الحساب الجديد *
                </Form.Label>
                <RegisterTextbox
                  className="mm-sub"
                  type="text"
                  name="accountName"
                  placeholder="مثال: بنك الراجحي جاري"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  parentStyle={{ width: "100%" }}
                />
              </Form.Group>
            </div>

            {/* الصف الرابع: الرصيد الافتتاحي وتدفق النقدية */}
            <div className="from1-subacc">
              <Form.Group className="sub-inputs">
                <Form.Label>الرصيد الافتتاحي</Form.Label>
                <RegisterTextbox
                  className="opening-blancesub mm-sub"
                  type="number"
                  name="openingBalance"
                  placeholder="00"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="sub-inputs">
                <Form.Label>حساب التدفق النقدي</Form.Label>
                <RegisterSelect
                  className="opening-blancesub mm-sub"
                  name="cashFlow"
                  value={cashflowtype}
                  options={[
                    { value: "0", label: "غير محدد" },
                    { value: "1", label: "تشغيلية" },
                    { value: "2", label: "استثمارية" },
                    { value: "3", label: "تمويلية" },
                  ]}
                  onChange={(e) => setcashflowtype(e.target.value)}
                />
              </Form.Group>
            </div>

            {/* الصف الخامس: نوع الحساب والوصف */}
            <div className="from1-subacc">
              <Form.Group className="sub-inputs">
                <Form.Label>طبيعة الحساب</Form.Label>
                <RegisterSelect
                  className="mm-sub"
                  value={isPayable}
                  options={[
                    { value: "1", label: "حساب فرعي (يقبل حركات وقيود)" },
                    { value: "0", label: "حساب رئيسي (تجميعي فقط)" },
                  ]}
                  onChange={(e) => setIsPayable(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="sub-inputs">
                <Form.Label>الوصف / ملاحظات</Form.Label>
                <RegisterTextbox
                  className="mm-sub"
                  type="text"
                  name="description"
                  placeholder="الوصف أو الملاحظات"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
            </div>

            {/* الصف السادس (إضافي عند اختيار أصول ثابتة): الإهلاك */}
            {depreciation && (
              <div className="from1-subacc">
                <Form.Group className="sub-inputs">
                  <Form.Label>قيمة الخردة</Form.Label>
                  <RegisterTextbox
                    className="opening-blancesub mm-sub"
                    type="number"
                    name="scrapValue"
                    placeholder="00"
                    value={scrap}
                    onChange={(e) => setScrap(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="sub-inputs">
                  <Form.Label>العمر الإنتاجي (بالسنوات)</Form.Label>
                  <RegisterTextbox
                    className="opening-blancesub mm-sub"
                    type="number"
                    name="usefulLife"
                    placeholder="00"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </Form.Group>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              resetModalForm();
              setShowModal(false);
            }}
          >
            إغلاق
          </Button>
          <Button variant="primary" onClick={handleAddAccount}>
            حفظ
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal className="showacc-modal" show={showModalacc} onHide={handleCloseModal} centered>
        <Modal.Header>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={handleCloseModal}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
          <Modal.Title className="title-sub">تفاصيل الحساب</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNode && (
            <table className="coa-details-table">
              <tbody>
                <tr>
                  <td className="details-label">رقم الحساب</td>
                  <td>
                    <span className="code-pill">{selectedNode?.code}</span>
                  </td>
                </tr>
                <tr>
                  <td className="details-label">اسم الحساب</td>
                  <td><strong>{selectedNode?.name}</strong></td>
                </tr>
                <tr>
                  <td className="details-label">المستوى الشجري</td>
                  <td>المستوى {selectedNode?.level !== undefined ? selectedNode.level : "-"}</td>
                </tr>
                <tr>
                  <td className="details-label">طبيعة الحساب</td>
                  <td>
                    {selectedNode?.is_payable ? (
                      <span className="badge-payable badge-leaf">فرعي (يقبل حركات وقيود)</span>
                    ) : (
                      <span className="badge-payable badge-parent">رئيسي (تجميعي)</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="details-label">الرصيد النهائي</td>
                  <td>
                    <strong>
                      {formatMoney(selectedNode?.final_balance ?? selectedNode?.opening_balance ?? 0)}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td className="details-label">نوع التدفق المالي</td>
                  <td>
                    {selectedNode?.cash_flow_type == 1
                      ? "تشغيلية"
                      : selectedNode?.cash_flow_type == 2
                        ? "استثمارية"
                        : selectedNode?.cash_flow_type == 3
                          ? "تمويلية"
                          : "غير محدد"}
                  </td>
                </tr>
                {selectedNode?.description && (
                  <tr>
                    <td className="details-label">الوصف / ملاحظات</td>
                    <td>{selectedNode.description}</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            إغلاق
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
