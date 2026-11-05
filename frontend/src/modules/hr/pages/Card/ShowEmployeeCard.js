import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./employeeCard.css";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Logo from "../../../../logo-light.svg";
import { useState, useEffect } from "react";
import Title from "../../../../components/title";
import { useParams } from "react-router";
import API from "../../../../api/axiosConfig";
import { QRCodeCanvas } from "qrcode.react";

const TopWave = ({ color }) => (
  <div className="wave-container top-wave">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <path
        d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
        fill={color}
      />
    </svg>
  </div>
);

const BottomWave = ({ color }) => (
  <div className="wave-container bottom-wave">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <path
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
        fill={color}
      />
    </svg>
  </div>
);

function ShowEmployeeCard() {

  const { id } = useParams();
  const [rows, setRows] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEmployee = async () => {
      try {
        const res = await API.get(`/employees/${id}`);
        if (res.status === 200) {
          const item = res.data?.data || res.data || {};
          setRows(item);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getEmployee();
  }, [id]);

  const [waveColor, setWaveColor] = useState(() => {
    return localStorage.getItem("waveColor") || "#c29a64";
  });

  const handleColorChange = (e) => {
    const color = e.target.value;
    setWaveColor(color);
    localStorage.setItem("waveColor", color);
  };

  const resetToDefaultColor = () => {
    const defaultColor = "#c29a64";
    setWaveColor(defaultColor);
    localStorage.setItem("waveColor", defaultColor);
  };

  const defaultAvatar =
    "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?semt=ais_hybrid";

  return (
    <>
      <div className="d-flex justify-content-between align-items-center w-75 mx-auto no-print my-3" dir="rtl">
        <Title title={`${rows?.name || ""} - كارت الموظف`} classname="no-print" icon={<FontAwesomeIcon icon={faUser} />} />
        <a href="/addnewemployee" className="btn btn-outline-secondary btn-sm">
          العودة للموظفين
        </a>
      </div>

      <>
        <div className="card-viewer-container">
          <div className="employee-card">
            <BottomWave color={waveColor} />
            <div className="card-content front-content">
              <img
                src={Logo}
                alt="شعار الشركة"
                className="company-logo-card"
              />
              <h3 className="company-name-card">بوابة يور جيتس</h3>
            </div>
            <TopWave color={waveColor} />
          </div>

          <div className="employee-card">
            <TopWave color={waveColor} />
            <div className="card-content back-content">
              <div className="cardfrist">
                <div className="back-top-section">
                  <img
                    src={rows?.photo || defaultAvatar}
                    alt="صورة الموظف"
                    className="employee-photo"
                  />
                  <h4 className="employee-name">{rows?.name || "اسم الموظف"}</h4>
                </div>
                <div className="cardQR">
                  <QRCodeCanvas
                    value={String(rows?.id || id || "1")}
                    size={80}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                  />
                </div>
              </div>
              <div className="back-bottom-section">
                <div className="employee-details">
                  <p>
                    <strong>المسمى الوظيفي:</strong>{" "}
                    <span>{rows?.jobname || rows?.jobtitle?.title || "غير محدد"}</span>
                  </p>
                  <p>
                    <strong>الرقم الوظيفي / الهوية:</strong>{" "}
                    <span>{rows?.nationalid || rows?.idnumber || `EMP-${rows?.id || ""}`}</span>
                  </p>
                  <p>
                    <strong>رقم الجوال:</strong>{" "}
                    <span dir="ltr">{rows?.phone || "غير محدد"}</span>
                  </p>
                </div>
              </div>
            </div>
            <BottomWave color={waveColor} />
          </div>
        </div>
        <div
          className="color-picker-container no-print"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          <label
            className="fw-bolder fs-5 no-print "
            htmlFor="colorPicker"
            style={{ marginRight: "10px" }}
          >
            تغيير لون الكارت
          </label>
          <input
            type="color"
            id="colorPicker"
            value={waveColor}
            className="no-print"
            onChange={handleColorChange}
          />
          <button
            className="btn btn-sm btn-secondary no-print"
            onClick={resetToDefaultColor}
          >
            إعادة اللون الافتراضي
          </button>
        </div>
        <div className="no-print" style={{ textAlign: "center", margin: "20px 0" }}>
          <button className="btn btn-primary" onClick={() => window.print()}>
            طباعة الكارت
          </button>
        </div>
      </>

    </>
  );
}

export default ShowEmployeeCard;
