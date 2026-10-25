import React, { useRef, useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import API from "../../../api/axiosConfig";
import { useParams } from "react-router";
import TestPreLoader from "../../TestPreLoader/TestPreLoader";
import "./VolunteerCertificate.css";

const VolunteerCertificate = () => {
  const certificateRef = useRef();
  const { id } = useParams();
  const [volunteerData, setVolunteerData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getVolunteerData = async () => {
    try {
      const response = await API.get(`/volunteers/${id}`);
      setVolunteerData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getVolunteerData();
  }, [id]);

  const downloadPDF = async () => {
    const element = certificateRef.current;

    const canvas = await html2canvas(element, {
      scale: 3, // جودة أعلى
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");

    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`شهادة_خبرة_${volunteerData.name}.pdf`);
  };

  if (loading) return <TestPreLoader />;
  if (!volunteerData) return <div>لم يتم العثور على البيانات</div>;

  return (
    <div className="certificate-wrapper">
      {/* الشهادة */}
      <div ref={certificateRef} className="certificate">
        {/* الإطار الخارجي */}
        <div className="certificate-border">
          <div className="certificate-inner-border">
            
            {/* الزخارف */}
            <div className="corner-decoration top-left"></div>
            <div className="corner-decoration top-right"></div>
            <div className="corner-decoration bottom-left"></div>
            <div className="corner-decoration bottom-right"></div>

            {/* المحتوى */}
            <div className="certificate-content">
              
              {/* الشعار أو اسم المؤسسة */}
              <div className="certificate-header">
                <div className="organization-logo">
                  <div className="logo-circle">
                    <span>شعار</span>
                  </div>
                </div>
                <h1 className="volunteer-name">شهادة خبرة</h1>
                <div className="title-underline"></div>
              </div>

              {/* النص الرئيسي */}
              <div className="certificate-body">
                <p className="intro-text">
                  تشهد إدارة المؤسسة بأن
                </p>

                <div className="volunteer-name-wrapper">
                  <h2 className="volunteer-name">{volunteerData.name}</h2>
                  <div className="name-underline"></div>
                </div>

                <p className="main-text">
                  قد شارك كمتطوع في أنشطة المؤسسة التطوعية
                  <br />
                  خلال الفترة من
                  <span className="highlight-date"> {volunteerData.dateofhire} </span>
                  إلى
                  <span className="highlight-date"> {volunteerData.dateofretire}</span>&nbsp;
                    بواقع عدد ساعات
                    <span className="highlight-hours"> {volunteerData.work_totalhours} </span> ساعة تطوعية.
                </p>

                <p className="appreciation-text">
                  وأظهر خلال هذه الفترة التزامًا ومهارة عالية في أداء مهامه
                  <br />
                  نشكره على جهوده المبذولة ونتمنى له التوفيق في مسيرته
                </p>
              </div>

              {/* التوقيعات */}
              <div className="certificate-footer">
                <div className="signature-section">
                  <div className="signature-line"></div>
                  <p className="signature-label">المدير التنفيذي</p>
                </div>

                <div className="stamp-section">
                  <div className="official-stamp">
                    <div className="stamp-circle">
                      <span>ختم المؤسسة</span>
                    </div>
                  </div>
                </div>

                <div className="signature-section">
                  <div className="signature-line"></div>
                  <p className="signature-label">التاريخ</p>
                  <p className="date-text">{new Date().toLocaleDateString('ar-EG')}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* زر التحميل */}
      <button onClick={downloadPDF} className="download-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        تحميل الشهادة PDF
      </button>
    </div>
  );
};

export default VolunteerCertificate;