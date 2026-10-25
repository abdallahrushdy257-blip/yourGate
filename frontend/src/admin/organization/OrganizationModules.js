import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import './archive.css'
import React, { useState } from "react";
import {
  faFolderOpen,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../components/RegisterTextBox";
import Title from "../../components/title";
import UploadInput from "../../components/UploadInput";
import TableComponent from "../../components/TableComponent";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router";
import AdminLayout from "../../layouts/AdminLayouts";
import { useParams } from "react-router";
import RegisterSelect from "../../components/RegisterSelect";

function OrgaminzationModules() {
  const columns = [
    { name: "  اسم المديول", key: "module_name" },
    { name: " من تاريخ ", key: "start_date" },
    { name: "  الى تاريخ ", key: "end_date" },
    { name: "", key: "actions" },
  ];
  const [rows, setRows] = useState([]);
  const [error, setError] = useState([]);
  const [moduleid, setModuleid] = useState("");
  const [from, setFrom] = useState(new Date().toISOString().substr(0, 10));
  const [to, setTo] = useState(new Date().toISOString().substr(0, 10));
  const [modules, setModules] = useState([]);

  const getModulesList = async () => {
    try {
      const res = await API.post("/subscription/modules");
      const data = await res;
      if (data.status === 200) {
        setModules(data.data);
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.errors || {});
    }
  };

  React.useEffect(() => {
    getModulesList();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const navigate = useNavigate();
  const { id } = useParams();

  const handleArchive = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    //formData.append('id', id);
    formData.append("moduleid", moduleid);
    formData.append("from", from);
    formData.append("to", to);

    try {
      const res = await API.post(`organization/${id}/modules/store`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res;
      if (data.status === 200) {
        setModuleid("");
        setFrom("");
        setTo("");
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
    {
      label: "حذف",
      action: (id) => {
        if (window.confirm("هل أنت متأكد من حذف هذا المديول")) {
          API.get(`/organization/modules/${id}/delete`)
            .then((res) => {
              if (res.status === 200) {
                setTableReloadKey(Date.now());
              }
            })
            .catch((error) => {
              console.error("There was an error!", error);
            });
        }
      },
    },
  ];

  return (
    <>
      <AdminLayout />
      <div className="printcasedata-container">
        <div className="archive-report">
          <span
            className="add-row-ta archiveAdd"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> إضافة
          </span>
        </div>

        <TableComponent
          apiUrl={`/organization/${id}/modules`}
          columns={columns}
          title="الموديلات"
          triggerReload={tableReloadKey}
          dropdownOptions={dropdownOptions}
          search={false}
        />
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="modal-table small-modall archModal"
        dialogClassName="fit-content-modal"
      >
        <Modal.Header>
          <Modal.Title>إضافة مديول</Modal.Title>
          <Button
            className="custom-close-button cls-btn"
            variant="link"
            onClick={() => setShowModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="closeModal" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <RegisterSelect
            parentStyle={{
              marginBottom: "20px",
              width: "100%",
            }}
            label="المديول"
            stylee={{
              width: "100%",
            }}
            options={[
              { value: "0", label: "إختر المديول" },
              ...modules.map((account) => ({
                value: account.id,
                label: account.name,
              })),
            ]}
            onChange={(e) => setModuleid(e.target.value)}
          />
          {error && error.store && (
            <div className="alert alert-danger" role="alert">
              {error.store}
            </div>
          )}

          {/* <RegisterTextbox label="  من تاريخ" type="date"  onChange={(e) => setFrom(e.target.value)} /> */}
          <p style={{ textAlign: "right" }}> من تاريخ</p>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="custom-datepicker"
          />
          {error && error.from && (
            <span className="error">{error.from[0]}</span>
          )}
          {/* <RegisterTextbox p=" الى تاريخ" type="date"  onChange={(e) => setTo(e.target.value)} /> */}
          <p style={{ textAlign: "right" }}> الى تاريخ</p>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="custom-datepicker"
          />
          {error && error.to && <span className="error">{error.to[0]}</span>}
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

export default OrgaminzationModules;
