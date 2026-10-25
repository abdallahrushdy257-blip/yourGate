import { Link, useNavigate, useParams } from "react-router";
import "./ShowEmployee.css";
import API from "../../api/axiosConfig";
import { useEffect, useState } from "react";
import TestPreloader from "../TestPreLoader/TestPreLoader";
import { Button } from "react-bootstrap";

function ShowEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [message, setMessage] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const getEmployee = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/employees/${id}`);
      const data = await res;
      if (data.status === 200) {
        setRows(data?.data);
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.errors);
      setMessage(error.response.data.message);
    }finally{
      setLoading(false)
    }
  };
  useEffect(() => {
    getEmployee();
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return "غير محدد";
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const defaultAvatar =
    "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?semt=ais_hybrid";

  const fields = [
    { label: "الإسم", value: rows?.name },
    { label: "المسمى الوظيفي", value: rows?.jobtitle?.title },
    { label: "العنوان", value: rows?.address },
    { label: "البريد الإلكتروني", value: rows?.email },
    { label: "تاريخ الميلاد", value: rows?.dateofbirth?.split("T")[0] },
    { label: "العمر", value: calculateAge(rows?.dateofbirth) },
    { label: "رقم الجوال", value: rows?.phone, dir: "ltr" },
    { label: "تاريخ بدء الخدمة", value: rows?.dateofhire },
  ];

  const extraFields = [
    { label: "الرقم القومي", value: rows?.nationalid },
    { label: "تاريخ انتهاء الهوية", value: rows?.nationalid_expire?.split("T")[0] },
    { label: "الجنسية", value: rows?.nationality },
    { label: "IBAN", value: rows?.ibannumber, dir: "ltr" },
    { label: "المؤهل العلمي", value: rows?.qualification },
    { label: "تاريخ انتهاء العقد", value: rows?.contractexpiration },
  ];

  const displayedFields = showMore ? [...fields, ...extraFields] : fields;
  
  const link = `/editemployee/${rows.id}`;
  return loading ? (
    <TestPreloader />
  ) : (
    <>
      <div dir="rtl" className="max-w-4xl mx-auto p-6 bg-[#fbf9f4] rounded-2xl shadow-sm border border-[#e8e2d5]/60 my-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 mb-6 border-b border-[#e8e2d5]">
        <div className="relative">
          <img
            src={rows?.photo || defaultAvatar}
            alt={rows?.name || "Employee"}
            className="w-20 h-20 rounded-full object-cover border-2 border-[#b8955d] shadow-sm"
          />
        </div>
        <div className="text-center sm:text-right space-y-1">
          <h3 className="text-xl font-bold text-[#3d3832]">
            {rows?.name || "بدون اسم"}
          </h3>
          <p className="text-sm text-[#7c7267]">{rows?.email || "—"}</p>
        </div>
      </div>

      {/* Grid Fields Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        {displayedFields.map((field, index) => (
          <div
            key={index}
            className="flex flex-col justify-center p-3 rounded-xl bg-white/60 border border-[#eee8dc] transition-all hover:bg-white hover:shadow-sm"
          >
            <span className="text-xs font-medium text-[#8c8275] mb-1">
              {field.label}
            </span>
            <span
              dir={field.dir || "auto"}
              className="text-base font-semibold text-[#2c2621] truncate"
            >
              {field.value || "—"}
            </span>
          </div>
        ))}
      </div>

      {/* Toggle Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setShowMore(!showMore)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#a38048] hover:bg-[#8f6e3a] text-white font-medium text-sm transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a38048]/50"
        >
          <span>{showMore ? "عرض أقل" : "عرض المزيد"}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              showMore ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>
    </>
  );
}

export default ShowEmployee;
