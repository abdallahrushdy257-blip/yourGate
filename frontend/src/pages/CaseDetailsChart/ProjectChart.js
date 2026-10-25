import React, { useEffect, useState } from "react";
import Title from "../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingHeart,
  faPenToSquare,
  faPrint,
  // faTag,
  // faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import "../CaseData/CaseDate.css";
import RegisterTextarea from "../../components/RegisterTextarea";
import { Form } from "react-bootstrap";
import CustomButton from "../../components/CustomButton";
import DonutChart from "../../components/DonutChart";
import "./CaseDetailsChart.css";
import { useNavigate, useParams } from "react-router";
import PrintHead from "../../components/PrintHead";
import PrintFooter from "../../components/PrintFooter";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import { color } from "highcharts";

const ProjectChart = (props) => {
  const navigate = useNavigate();
  const handlePaymentView = async (e) => {
    e.preventDefault();
    navigate(`/viewdonationsproject/${id}`);
  };

  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [message, setMessage] = useState({});
  console.log(id);
  const handlePrint = () => {
    document.body.classList.add("print-mode");
    window.print();
    document.body.classList.remove("print-mode");
  };

  const handleClose = async (e) => {
    e.preventDefault();
    try {
      const res = await API.get(`/projects/${id}/close`);
      const data = await res;
      console.log(data.data);
      if (data.status === 200) {
        navigate("/projectStatus");
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  };
  const getcase = async () => {
    try {
      const res = await API.get(`/shoptransaction/${id}/projects`);
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
  return loading ? (
    <>
      <TestPreLoader />{" "}
    </>
  ) : (
    <>
      <PrintHead />
      <div className="CaseDetailsChart">
        <Title
          title="بيانات المشروع"
          icon={<FontAwesomeIcon icon={faPenToSquare} />}
        />
        {(rows.paid && rows.paid.name) ||
        (rows.recieved && rows.recieved.name) ? (
          <Form>
            <div className="case-info d-flex gap-4 flex-wrap justify-content-center pt-4 mt-4">
              <RegisterTextarea
                id="completedescription"
                label="مسمي المشروع"
                parentStyle={{
                  width: "250px",
                  marginBottom: "20px",
                }}
                stylee={{
                  height: "100px",
                  color: "var(--text-color) !important",
                }}
                rows={5}
                placeholder=""
                disabled={true}
                value={rows.paid ? rows.paid.name : rows.recieved.name}
              />
              <RegisterTextarea
                id="completedescription"
                label="نوع المشروع"
                parentStyle={{
                  width: "250px",
                  marginBottom: "20px",
                }}
                stylee={{
                  height: "100px",
                  color: "var(--text-color) !important",
                }}
                rows={5}
                placeholder=""
                disabled={true}
                value={
                  rows.paid
                    ? rows.paid.status == 1
                      ? "مكتمل"
                      : "غير مكتمل"
                    : rows.recieved.status == 1
                    ? "مكتمل"
                    : "غير مكتمل"
                }
              />
              <RegisterTextarea
                id="completedescription"
                label="وصف المشروع"
                parentStyle={{
                  width: "250px",
                  marginBottom: "20px",
                }}
                stylee={{
                  height: "100px",
                  color: "var(--text-color) !important",
                }}
                rows={5}
                placeholder=""
                disabled={true}
                value={
                  rows.paid ? rows.paid.description : rows.recieved.description
                }
              />
              <RegisterTextarea
                id="completedescription"
                label="مبلغ الدعم الكلي"
                parentStyle={{
                  width: "250px",
                  marginBottom: "20px",
                }}
                stylee={{
                  height: "100px",
                  color: "var(--text-color) !important",
                }}
                rows={5}
                placeholder=""
                disabled={true}
                value={rows.paid ? rows.paid.total : rows.recieved.total}
              />
            </div>
            <div className="case-info chartContainer">
              <div className="uploadlogo">
                <DonutChart
                  total={
                    rows.recieved
                      ? rows.recieved.total
                      : rows.paid
                      ? rows.paid.total
                      : 0
                  }
                  paid={
                    rows.recieved
                      ? (rows.recieved.recieved / rows.recieved.total) * 100
                      : 0
                  }
                  remaining={
                    rows.recieved
                      ? (rows.recieved.total /
                          (rows.recieved.total - rows.recieved.recieved)) *
                        100
                      : rows.recieved.total
                  }
                  name="نسبة التبرعات"
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
                    <h2>{rows.recieved ? rows.recieved.recieved : "0"}</h2>
                    <p className="paydesc">اجمالي التبرعات </p>
                  </div>
                  <div className="payIcon payIcon1">
                    <div className="secpayIcon1">
                      <FontAwesomeIcon
                        icon={faHandHoldingHeart}
                        className="payIconchart1"
                      />
                    </div>
                  </div>
                </div>

                <div className="payDetailssec">
                  <div className="paynums">
                    <h2>
                      {rows.recieved
                        ? rows.recieved.total - rows.recieved.recieved
                        : 0}
                    </h2>
                    <p className="paydesc">المتبقي</p>
                  </div>
                  <div className="payIcon payIcon2">
                    <div className="secpayIcon2">
                      <FontAwesomeIcon
                        icon={faWallet}
                        className="payIconchart2"
                      />
                    </div>
                  </div>
                </div>

                <div className="payDetailssecSubmit">
                  <CustomButton
                    text="إغلاق المشروع"
                    className="chartButton"
                    onClick={handleClose}
                  />
                  <CustomButton
                    text="عرض التبرعات"
                    className="chartButton"
                    onClick={handlePaymentView}
                  />

                  <span
                    className="chartPrintButton"
                    onClick={handlePrint}
                    title="طباعة">
                    <FontAwesomeIcon icon={faPrint} />
                  </span>
                </div>
              </div>
            </div>

            {/* <div className="projectInfoGrid">
    <RegisterTextarea
      id="projectName"
      label="مسمي المشروع"
      parentStyle={{
        width: "220px",
      }}
      stylee={{
        height: "80px",
        color: "var(--text-color) !important",
      }}
      rows={4}
      placeholder=""
      disabled={true}
      value={rows.paid ? rows.paid.name : rows.recieved.name}
    />

    <RegisterTextarea
      id="projectType"
      label="نوع المشروع"
      parentStyle={{
        width: "220px",
      }}
      stylee={{
        height: "80px",
        color: "var(--text-color) !important",
      }}
      rows={4}
      placeholder=""
      disabled={true}
      value={
        rows.paid
          ? rows.paid.status == 1
            ? "مكتمل"
            : "غير مكتمل"
          : rows.recieved.status == 1
          ? "مكتمل"
          : "غير مكتمل"
      }
    />

    <RegisterTextarea
      id="projectDescription"
      label="وصف المشروع"
      parentStyle={{
        width: "220px",
      }}
      stylee={{
        height: "80px",
        color: "var(--text-color) !important",
      }}
      rows={4}
      placeholder=""
      disabled={true}
      value={
        rows.paid ? rows.paid.description : rows.recieved.description
      }
    />

    <RegisterTextarea
      id="projectTotal"
      label="مبلغ الدعم الكلي"
      parentStyle={{
        width: "220px",
      }}
      stylee={{
        height: "80px",
        color: "var(--text-color) !important",
      }}
      rows={4}
      placeholder=""
      disabled={true}
      value={rows.paid ? rows.paid.total : rows.recieved.total}
    />
  </div> */}
          </Form>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "100px",
            }}>
            <h3 style={{ color: "red" }}>
              بيانات المشروع غير مكتملة بعد للظهور
            </h3>
          </div>
        )}
      </div>

      <PrintFooter />
    </>
  );
};

export default ProjectChart;
