import React, { useEffect, useState } from "react";
import Title from "../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollar,
  faMoneyBill,
  faPenToSquare,
  faPrint,
  faSackDollar,
  faTag,
  faUser,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import "../CaseData/CaseDate.css";
import RegisterTextarea from "../../components/RegisterTextarea";
import { Button, Form, Modal } from "react-bootstrap";
import CustomButton from "../../components/CustomButton";
import DonutChart from "../../components/DonutChart";
import "./CaseDetailsChart.css";
import { useNavigate, useParams } from "react-router";
import PrintHead from "../../components/PrintHead";
import PrintFooter from "../../components/PrintFooter";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import { color } from "highcharts";
import riyal from "../../sar_symbol_dark.png"

const CaseDetailsChart = (props) => {
  const navigate = useNavigate();
  const handlePaymentView = async (e) => {
    e.preventDefault();
    navigate(`/viewdonations/${id}`);
  };
  const [showModal, setShowModal] = useState(false);

  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caseName, setCaseName] = useState(true);
  const [error, setError] = useState({});
  const [message, setMessage] = useState({});
  console.log(id);
  const handlePrint = () => {
    document.body.classList.add("print-mode");
    window.print();
    document.body.classList.remove("print-mode");
  };

  const handleShowModal = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = (e) => {
    setShowModal(false);
  };

  const handleClose = async (e) => {
    e.preventDefault();
    try {
      const res = await API.get(`/shop/${id}/close`);
      const data = await res;
      console.log(data.data);
      if (data.status === 200) {
        navigate("/casedetails");
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  };
  const getcase = async () => {
    try {
      const res = await API.get(`/shop/${id}`);
      const data = await res;
      console.log(data.data);
      if (data.status === 200) {
        setRows(data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  };

  useEffect(() => {
    getcase();
  }, []);

  useEffect(() => {
    if (rows && (rows.paid || rows.recieved)) {
      setCaseName(rows.paid ? rows.paid.title : rows.recieved.title);
    }
  }, [rows]);

  return loading ? (
    <>
      <TestPreLoader />{" "}
    </>
  ) : (
    <>
      <PrintHead />
      <div className="CaseDetailsChart">
        {(rows.paid ? rows.paid.title : false) ||
        (rows.recieved ? rows.recieved.title : false) ? (
          <>
            <Title
              title={rows.paid ? rows.paid.title : rows.recieved.title}
              stylee={{ color: "var(--text-color)" }}
              icon={<FontAwesomeIcon icon={faPenToSquare} />}
            />

            <Form className="global-form-container">
              <span
                className="chartPrintButton no-print"
                style={{ float: "left" }}
                onClick={handlePrint}
              >
                <FontAwesomeIcon icon={faPrint} />
              </span>
              <div className="case-info mt-4" dir="rtl">
                {/* <RegisterTextarea
                  id="completedescription"
                  label="مسمي الحالة"
                  parentStyle={{
                    width: "20%",
                    marginBottom: "20px",
                    color: "var(--text-color) !important",
                  }}
                  stylee={{
                    height: "100px",
                    color: "var(--text-color) !important",
                  }}
                  rows={5}
                  placeholder=""
                  disabled={true}
                  value={rows.paid ? rows.paid.title : rows.recieved.title}
                />
                <RegisterTextarea
                  id="completedescription"
                  label="نوع الحالة"
                  parentStyle={{
                    width: "20%",
                    marginBottom: "20px",
                    color: "var(--text-color)",
                  }}
                  stylee={{
                    height: "100px",
                    color: "var(--text-color) !important"
                  }}
                  rows={5}
                  placeholder=""
                  disabled={true}
                  value={rows.paid ? (rows.paid.status == 1 ? "مكتمل" : "غير مكتمل") : (rows.recieved.status == 1 ? "مكتمل" : "غير مكتمل")}
                />
                <RegisterTextarea
                  id="completedescription"
                  label="وصف الحالة"
                  parentStyle={{
                    width: "20%",
                    marginBottom: "20px",
                    color: "var(--text-color)",
                  }}
                  stylee={{
                    height: "100px",
                    color: "var(--text-color) !important"
                  }}
                  rows={5}
                  placeholder=""
                  disabled={true}
                  value={rows.paid && rows.paid != null ? rows.paid.description : rows.recieved.description}
                />
                <RegisterTextarea
                  id="completedescription"
                  label="مبلغ الدعم الكلي"
                  parentStyle={{
                    width: "20%",
                    marginBottom: "20px",
                    color: "var(--text-color) !important",
                  }}
                  stylee={{
                    height: "100px",
                    color: "var(--text-color) !important",
                  }}
                  rows={5}
                  placeholder=""
                  disabled={true}
                  value={rows.paid && rows.paid != null ? rows.paid.total : rows.recieved.total}
                /> */}

                <div className="caseinfoseccontainer">
                  <div className="caseinfoSec">
                    <div className="caseinfoRow">
                      <span className="caseinfoSecTitle">مسمي الحالة : </span>
                      <span className="caseinfoval">
                        {rows.paid ? rows.paid.title : rows.recieved.title}
                      </span>
                    </div>

                    <div className="caseinfoRow">
                      <span className="caseinfoSecTitle">وصف الحالة : </span>
                      <span className="caseinfoval">
                        {rows.paid && rows.paid != null
                          ? rows.paid.description
                          : rows.recieved.description}
                      </span>
                    </div>
                  </div>

                  <div className="caseinfoSec">
                    <div className="caseinfoRow">
                      <span className="caseinfoSecTitle">نوع الحالة : </span>
                      {rows.paid
                        ? rows.paid.status == 1
                          ? "مكتمل"
                          : "غير مكتمل"
                        : rows.recieved.status == 1
                          ? "مكتمل"
                          : "غير مكتمل"}
                    </div>

                    <div className="caseinfoRow">
                      <span className="caseinfoSecTitle">
                        مبلغ الدعم الكلي :{" "}
                      </span>
                      <span className="caseinfoval">
                        {/* {rows.paid && rows.paid != null ? rows.paid.total : rows.recieved.total} */}
                        {Number(
                          rows.paid && rows.paid != null
                            ? rows.paid.total
                            : rows.recieved.total,
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="case-info chartContainer">
                <div className="uploadlogo">
                  <DonutChart
                    total={
                      rows.recieved && rows.recieved != null
                        ? rows.recieved.total
                        : rows.paid
                          ? rows.paid.total
                          : 0
                    }
                    paid={
                      rows.recieved && rows.recieved != null
                        ? (rows.recieved.recieved / rows.recieved.total) * 100
                        : 0
                    }
                    remaining={
                      rows.recieved && rows.recieved != null
                        ? (rows.recieved.total /
                            (rows.recieved.total - rows.recieved.recieved)) *
                          100
                        : 0
                    }
                    title="نسبة التبرعات"
                    subtitle="المبلغ المطلوب"
                    name1="التبرعات"
                    name2="التبرعات المطلوبة"
                  />
                </div>
                <div className="payDetails">
                  {/* <div className="payDetailssec">
                <div className="paynums reqpayment">
                  <h3>المبلغ المطلوب</h3>
                  <h4>10000</h4>
                </div>
              </div> */}

                  <div className="payDetailssec">
                    <div className="paynums">
                      <h2>
                        {Number(
                          rows.recieved && rows.recieved != null
                            ? rows.recieved.recieved
                            : 0,
                        ).toLocaleString()}
                      </h2>
                      <p className="paydesc">اجمالي التبرعات </p>
                    </div>
                    <div className="payIcon payIcon1">
                      <img style={{height:"20px",width:"20px"}} src={riyal} alt="riyal" />
                    </div>
                  </div>

                  <div className="payDetailssec">
                    <div className="paynums">
                      <h2>
                        {(rows.recieved && rows.recieved != null
                          ? rows.recieved.total - rows.recieved.recieved
                          : 0
                        ).toLocaleString()}
                      </h2>
                      <p className="paydesc">المتبقي</p>
                    </div>
                    <div className="payIcon payIcon2">
                      <img style={{height:"20px",width:"20px"}} src={riyal} alt="riyal" />
                    </div>
                  </div>

                  <div className="payDetailssecSubmit">
                    {rows && rows.recieved && rows.recieved.status == "0" ? (
                      <CustomButton
                        text="إغلاق الحالة"
                        className="chartButton"
                        onClick={handleShowModal}
                      />
                    ) : (
                      ""
                    )}

                    <CustomButton
                      text="عرض التبرعات"
                      className="chartButton"
                      onClick={handlePaymentView}
                    />
                  </div>
                </div>
              </div>
            </Form>
          </>
        ) : (
          <>
            <Title
              title="بيانات الحالة"
              stylee={{ color: "var(--text-color)" }}
              icon={<FontAwesomeIcon icon={faPenToSquare} />}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "100px",
                backgroundColor: "var(--card--background)",
                borderRadius: "20px",
              }}
            >
              <h2 style={{ color: "red" }}>لا يوجد عرض حاليا</h2>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          centered
          className="modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>هل انت متاكد من اغلاق الحالة</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="confirmation-message">
              <FontAwesomeIcon icon={faWarning} />
              <p>بمجرد الضغط علي نعم فلن تتمكن من اجراء سندات قبض مره اخري</p>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ border: "none" }}>
            <Button variant="secondary" onClick={handleCloseModal}>
              لا
            </Button>
            <Button variant="primary" onClick={handleClose}>
              نعم
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <PrintFooter />
    </>
  );
};

export default CaseDetailsChart;
