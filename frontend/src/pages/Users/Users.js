import {
  faFolderOpen,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import TableComponent from "../../components/TableComponent";
import { useNavigate } from "react-router";
import TestPreLoader from "../../pages/TestPreLoader/TestPreLoader";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import API from "../../api/axiosConfig";
function Users() {
  const columns = [
    { name: "الاسم", key: "name" },
    { name: "العنوان", key: "address" },
    { name: "التليفون", key: "phone" },
    { name: "المجموعة", key: "group" },
    { name: "ممثل الجمعية", key: "representative" },
    { name: "", key: "actions" },
  ];
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [representative, setRepresentative] = useState("");
  const [group, setGroup] = useState({});
  const [groupId, setGroupId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const modifyRow = (row) => {
    let newRow = { ...row };
    //newRow.group = newRow.group ? newRow.group.name : '';
    newRow.representative = newRow.representative == 0 ? "لا " : "نعم ";
    return newRow;
  };
  const getGroups = async () => {
    try {
      const res = await API.post(`/permissions`);
      const data = await res;
      if (data.status === 200) {
        setGroup(data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(true);
    }
  };
  React.useEffect(() => {
    getGroups();
  }, []);
  const handleArchive = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("representative", representative);
    formData.append("group", groupId);
    try {
      const res = await API.post(`/orgusers/store`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res;
      if (data.status === 200) {
        setName("");
        setAddress("");
        setPhone("");
        setEmail("");
        setPassword("");
        setRepresentative("");
        setGroupId("");
        setError([]);

        setShowModal(false);
        setIsSubmitting(false);
        setRows(data.data);
        setTableReloadKey(Date.now());
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setError(error.response?.data?.errors || {});
    }
  };
  const dropdownOptions = [
    { label: "تعديل", route: "/useredit/:id" }, //TODO: edit is missing
    {
      label: "حذف",
      action: (id) => {
        if (window.confirm("هل أنت متأكد من حذف هذا المستخدم")) {
          API.get(`/orgusers/${id}/delete`)
            .then((res) => {
              if (res.status === 200) {
                setTableReloadKey(Date.now());
              }
            })
            .catch((error) => {
              alert(error.response?.data?.message || "حدث خطأ ما");
              console.error("There was an error!", error);
            });
        }
      },
    },
  ];

  return loading ? (
    <TestPreLoader />
  ) : (
    <>
      <div className="printcasedata-container">
        <TableComponent
          apiUrl="/orgusers"
          columns={columns}
          title="المستخدمين"
          transformRowFn={modifyRow}
          triggerReload={tableReloadKey}
          dropdownOptions={dropdownOptions}
          headerAction={
            <button
              type="button"
              className="table-header-add-btn"
              onClick={() => setShowModal(true)}
            >
              <span>إضافة</span>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          }
        />
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table small-modall archModal"
        dialogClassName="fit-content-modal"
      >
        <Modal.Header>
          <Modal.Title>إضافة مستخدم</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <RegisterTextbox
              label="اسم المستخدم"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <RegisterTextbox
              label=" البريد الإلكتروني"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <RegisterTextbox
              label="كلمة المرور"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <RegisterTextbox
              label=" العنوان"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <RegisterTextbox
              label=" التليفون"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <RegisterSelect
              label="ممثل الجمعية"
              options={[
                { value: "", label: "اختر ممثل الجمعية" },
                { label: "نعم", value: 1 },
                { label: "لا", value: 0 },
              ]}
              value={representative}
              onChange={(e) => setRepresentative(e.target.value)}
            />
            <RegisterSelect
              label="المجموعة"
              options={[
                { value: "", label: "اختر المجموعة" },
                ...group.map((grp) => ({
                  value: grp.id,
                  label: grp.name,
                })),
              ]}
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إغلاق
          </Button>
          {isSubmitting ? (
            <Button variant="primary" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleArchive}>
              حفظ
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Users;
