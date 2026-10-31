import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faUser,
  faHandshake,
  faInfoCircle,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./LoanDetails.css";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import API from "../../../api/axiosConfig";

const LoanDetails = () => {
    const [loan, setLoan] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchLoanDetails = async () => {
            try {
                const res = await API.get(`/loans/${id}`);
                const data = await res.data;
                setLoan(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLoanDetails();
    }, [id]);
    if (!loan) {
        return <div className="text-center mt-5">❌ لا توجد بيانات لعرضها</div>;
    }

  return (
    <div className="loan-details-container">
      {/* 🟩 بيانات القرض */}
      <Card className="loan-card">
        <Card.Header>
          <FontAwesomeIcon icon={faMoneyBillWave} className="icon" />
          <span>بيانات القرض</span>
        </Card.Header>
        <Card.Body>
          <div className="loan-info">
            <p><strong>الرقم التسلسلي:</strong> {loan.serial}</p>
            <p><strong>المبلغ:</strong> {loan.amount} ريال</p>
            <p><strong>الوصف:</strong> {loan.requestdescription}</p>
            <p><strong>النوع:</strong> {loan.requesttype}</p>
            <p><strong>الأولوية:</strong> {loan.priority_string}</p>
            <p><strong>الحالة:</strong> {loan.status_string}</p>
          </div>
        </Card.Body>
      </Card>

      {/* 👤 بيانات طالب القرض */}
      <Card className="loan-card">
        <Card.Header>
          <FontAwesomeIcon icon={faUser} className="icon" />
          <span>بيانات طالب القرض</span>
        </Card.Header>
        <Card.Body>
          <div className="loan-info">
            <p><strong>الاسم:</strong> {loan.human_case?.name}</p>
            <p><strong>الرقم القومي:</strong> {loan.human_case?.details?.id_number}</p>
            <p><strong>البريد الإلكتروني:</strong> {loan.human_case?.details?.email || "—"}</p>
            <p><strong>الجنس:</strong> {loan.human_case?.gender_string}</p>
            <p><strong>تاريخ الميلاد:</strong> {loan.human_case?.dateofbirth}</p>
          </div>
        </Card.Body>
      </Card>

      {/* 🤝 بيانات الضامن */}
      {loan.warrantor && (
        <Card className="loan-card">
          <Card.Header>
            <FontAwesomeIcon icon={faHandshake} className="icon" />
            <span>بيانات الضامن</span>
          </Card.Header>
          <Card.Body>
            <div className="loan-info">
              <p><strong>الاسم:</strong> {loan.warrantor.name}</p>
              <p><strong>رقم الهوية:</strong> {loan.warrantor.details?.id_number}</p>
              <p><strong>رقم الحساب:</strong> {loan.warrantor.details?.account_number}</p>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* 📅 تفاصيل إضافية */}
      <Card className="loan-card">
        <Card.Header>
          <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
          <span>التواريخ</span>
        </Card.Header>
        <Card.Body>
          <div className="loan-info">
            <p><strong>تاريخ الطلب:</strong> {loan.requestdate}</p>
            <p><strong>تاريخ الموافقة:</strong> {loan.approvedate}</p>
            <p><strong>تاريخ الرد:</strong> {loan.responsedate}</p>
          </div>
        </Card.Body>
      </Card>

      {/* ℹ️ التعليمات */}
      {loan.instructions && (
        <Card className="loan-card">
          <Card.Header>
            <FontAwesomeIcon icon={faInfoCircle} className="icon" />
            <span>تعليمات القرض</span>
          </Card.Header>
          <Card.Body>
            <p>{loan.instructions}</p>
          </Card.Body>
          {/* <Card.Footer>
            <button className="btn btn-primary" > تعديل التعليمات</button>
          </Card.Footer> */}
        </Card>
      )}
    </div>
  );
};

export default LoanDetails;
