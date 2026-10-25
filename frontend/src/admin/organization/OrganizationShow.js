import { Link, useNavigate, useParams } from "react-router";
//import "./ShowEmployee.css";
import API from "../../api/axiosConfig";
import { useEffect, useState } from "react";
import TestPreloader from "../../pages/TestPreLoader/TestPreLoader";
import AdminLayout from "../../layouts/AdminLayouts";

function OrganizationShow() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [message, setMessage] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const getEmployee = async () => {
    try {
      const res = await API.get(`/organization/${id}`);
      const data = await res;
      if (data.status === 200) {
        setRows(data?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }
  };
  useEffect(() => {
    getEmployee();
  }, []);
//   const link = `/editemployee/${rows.id}`;
  return loading ? (
    <TestPreloader />
  ) : (
    <>
    <AdminLayout/>
      <div className="OrganizationShow">
        <div className="empPhotoEditContainer">
          <div className="empPhotoContainer">
            <img
              width="70px"
              alt="Employee"
              className="empImg"
              src={rows && rows.photo ? rows.photo : "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?semt=ais_hybrid"}
            />
            <div className="empEmailEditContainer">
              <p className="empName"> {rows && rows.name ? rows.name : ""}</p>
              <span className="empEmail">
                {rows && rows.email ? rows.email : ""}
              </span>
            </div>
          </div>
          {/* <Link to={link} className='EmpEditBtn'>تعديل</Link> */}
        </div>

        <div className="empInfoContainer">
          <div className="empInfoContainerRow">
            <div className="EmpInfoField">
              <span className="infoFeld">الإسم</span>

              <h5 className="infoContent">
                {" "}
                {rows && rows.name ? rows.name : ""}
              </h5>
            </div>
            <div className="EmpInfoField">
              <span className="infoFeld">التخصص</span>

              <h5 className="infoContent">
                {" "}
                {rows && rows.specialization_name ? rows.specialization_name : ""}
              </h5>
            </div>
            
          </div>
          <div className="empInfoContainerRow">
            <div className="EmpInfoField">
              <span className="infoFeld">العنوان</span>

              <h5 className="infoContent">
                {" "}
                {rows && rows.address ? rows.address : ""}
              </h5>
            </div>
            <div className="EmpInfoField">
              <span className="infoFeld">البريد الإلكتروني</span>

              <h5 className="infoContent">
                {rows && rows.email ? rows.email : ""}
              </h5>
            </div>
          </div>
          <div className="empInfoContainerRow">
            <div className="EmpInfoField">
              <span className="infoFeld"> رقم التسجيل</span>

              <h5 className="infoContent">
                {" "}
                {rows && rows.registration_number
                  ? rows.registration_number
                  : ""}{" "}
              </h5>
            </div>
            <div className="EmpInfoField">
              <span className="infoFeld">المنطقة</span>

              <h5 className="infoContent">{rows && rows.region ? rows.region : ""}</h5>
            </div>
          </div>
          <div className="empInfoContainerRow">
            <div className="EmpInfoField">
              <span className="infoFeld">رقم الجوال</span>

              <h5 className="infoContent">
                {rows && rows.phone ? rows.phone : ""}
              </h5>
            </div>
            <div className="EmpInfoField">
              <span className="infoFeld">  الحالة</span>

              <h5 className="infoContent">{rows ? rows.orgstatus : ""}</h5>
            </div>
          </div>
          {showMore && (
            <>
              <div className="empInfoContainerRow">
                <div className="EmpInfoField">
                  <span className="infoFeld">ممثل الجمعية </span>
                  <h5 className="infoContent">{rows  && rows.representatives ? rows.representatives.name : ""}</h5>
                </div>

                <div className="EmpInfoField">
                  <span className="infoFeld">  رقم ممثل الجمعية</span>
                  <h5 className="infoContent">
                   {rows  && rows.representatives ? rows.representatives.phone : ""}
                  </h5>
                </div>
              </div>

              <div className="empInfoContainerRow">
                <div className="EmpInfoField">
                  <span className="infoFeld">اللوجو :</span>
                  <a href={rows?.logo} target="_blank" rel="noopener noreferrer" className="btn btn-primary mx-1">عرض</a>
                </div>
                 <div className="EmpInfoField">
                  <span className="infoFeld"> المرفقات:</span>
                  <a href={rows?.document} target="_blank" rel="noopener noreferrer" className="btn btn-primary mx-1">عرض</a>
                </div>
              </div>

            
            </>
          )}
        </div>
        <button className="more-btn" onClick={() => setShowMore(!showMore)}>
          {showMore ? "عرض اقل" : "عرض المزيد"}
        </button>
      </div>
    </>
  );
}

export default OrganizationShow;
