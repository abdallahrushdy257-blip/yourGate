import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../../pages/CaseDetails/CaseDetails.css";
import API from "../../../api/axiosConfig";
import TableComponent from "../../../components/TableComponent";
import { Modal, Button, Row, Col, Spinner, Form } from "react-bootstrap";
import NewButton from "../../../components/NewButton";
import RegisterTextbox from "../../../components/RegisterTextBox";

function Warrantors(props) {
    const columns = [
        { name: "إسم الكفيل", key: "name" },
        { name: "العنوان", key: "address" },
        { name: "رقم الجوال", key: "phone" },
        { name: "البريد الالكتروني", key: "email" },
        { name: "جهة عمل الكفيل", key: "type" },
        { name: "", key: "actions" },
    ];

    const [tableReloadKey, setTableReloadKey] = useState(Date.now());
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState({});

    // Form states
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState("");
    const [idnumber, setIdnumber] = useState("");

    const handleClose = () => {
        setShowModal(false);
        resetForm();
    };
    const handleShow = () => setShowModal(true);

    const resetForm = () => {
        setName("");
        setAddress("");
        setPhone("");
        setEmail("");
        setType("");
        setIdnumber("");
        setError({});
        setIsSubmitting(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const mForm = new FormData();
        mForm.append('name', name);
        mForm.append('address', address);
        mForm.append('phone', phone);
        mForm.append('email', email);
        mForm.append('type', type);
        mForm.append('idnumber', idnumber);

        try {
            const res = await API.post('/warrantor/store', mForm);
            if (res.status === 200 || res.status === 201) {
                handleClose();
                setTableReloadKey(Date.now());
            } else {
                setError(res.data.errors || {});
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            setError(error.response?.data?.errors || {});
        }
    };

    const dropdownOptions = [
        { label: "تعديل", route: "/editwarrantor/:id" },
    ];

    return (
        <>
            <div className="printcasedata-container">
                <TableComponent
                    apiUrl="/warrantor"
                    searchDate={false}
                    columns={columns}
                    title="تقرير الكُفَلاءُ"
                    titleIcon={<FontAwesomeIcon icon={faReceipt} />}
                    dropdownOptions={dropdownOptions}
                    triggerReload={tableReloadKey}
                    addBtn={true}
                    addBtnName="كفيل"
                    onAddClick={handleShow}
                />
            </div>

            <Modal size="md" show={showModal} onHide={handleClose} centered style={{ direction: "rtl" }}>
                <Modal.Header closeButton style={{ direction: "ltr" }}>
                    <Modal.Title>إضافة كفيل جديد</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <RegisterTextbox
                                    label='إسم الكفيل'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    error={error.name}
                                />
                            </Col>
                            <Col md={6}>
                                <RegisterTextbox
                                    label='جهة عمل الكفيل'
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    error={error.type}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <RegisterTextbox
                                    label='العنوان'
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    error={error.address}
                                />
                            </Col>
                            <Col md={6}>
                                <RegisterTextbox
                                    label='رقم الجوال'
                                    type="number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    error={error.phone}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <RegisterTextbox
                                    label='البريد الإلكتروني'
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={error.email}
                                />
                            </Col>
                            <Col md={6}>
                                <RegisterTextbox
                                    label='رقم الهوية'
                                    value={idnumber}
                                    onChange={(e) => setIdnumber(e.target.value)}
                                    error={error.idnumber}
                                />
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-center mt-4">
                            {isSubmitting ? <Spinner animation="border" variant="primary" /> :
                                <Button variant="primary" type="submit" className="px-5">حفظ</Button>
                            }
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Warrantors;
