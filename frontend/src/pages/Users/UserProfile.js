import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axiosConfig";
import TestPreLoader from "../TestPreLoader/TestPreLoader";
import "./users.css";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [isEditing, setIsEditing] = useState(false);

  // جلب بيانات المستخدم
  const getUserData = async () => {
    try {
      const response = await API.get(`/user/data`);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, [id]);

  // حفظ التعديلات
  const handleSave = async () => {
    try {
      const fdata = new FormData();
      fdata.append("name", user.name);
      fdata.append("email", user.email);
      fdata.append("phone", user.phone || "");
      await API.post(`/user/update`, fdata);
      setIsEditing(false);
      alert("تم حفظ التغييرات بنجاح!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  // تحديث البيانات
  const handleChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  if (loading) return <TestPreLoader />;
  if (!user) return <div className="error-message">لم يتم العثور على المستخدم</div>;

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="header-background"></div>
        
        <div className="profile-header-content">
        

          {/* معلومات أساسية */}
          <div className="profile-info">
            <h1 className="profile-name">{user.name}</h1>

            <p className="profile-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z" fill="var(--text-color)"/>
</svg>
              {user.email || "مستخدم"}</p>
            <p className="profile-location">
             <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
<path d="M10.0376 5.31617L10.6866 6.4791C11.2723 7.52858 11.0372 8.90532 10.1147 9.8278C10.1147 9.8278 10.1147 9.8278 10.1147 9.8278C10.1146 9.82792 8.99588 10.9468 11.0245 12.9755C13.0525 15.0035 14.1714 13.8861 14.1722 13.8853C14.1722 13.8853 14.1722 13.8853 14.1722 13.8853C15.0947 12.9628 16.4714 12.7277 17.5209 13.3134L18.6838 13.9624C20.2686 14.8468 20.4557 17.0692 19.0628 18.4622C18.2258 19.2992 17.2004 19.9505 16.0669 19.9934C14.1588 20.0658 10.9183 19.5829 7.6677 16.3323C4.41713 13.0817 3.93421 9.84122 4.00655 7.93309C4.04952 6.7996 4.7008 5.77423 5.53781 4.93723C6.93076 3.54428 9.15317 3.73144 10.0376 5.31617Z" fill="var(--text-color)"/>
</svg>
              {user.phone || "غير محدد"}
            </p>
          </div>

          {/* زر التعديل */}
          <div className="profile-actions">
            {!isEditing ? (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                تعديل الملف الشخصي
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn btn-success" onClick={handleSave}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  حفظ
                </button>
                <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  إلغاء
                </button>
              </div>
            )}
          </div>
        </div>

      </div>



      {/* Tab Content */}
      <div className="profile-content">
        {activeTab === "about" && (
          <div className="tab-content about-tab">
            <div className="content-card">
              <h2 className="card-title labelstyled">المعلومات الشخصية</h2>
              <br />
              <div className="info-grid">
                <div className="info-item">
                  <label className="labelstyled">الاسم الكامل</label>
                  {isEditing ? (
                    <input 
                      type="text"
                      value={user.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <p className="labelstyled">{user.name}</p>
                  )}
                </div>

                <div className="info-item">
                  <label className="labelstyled">البريد الإلكتروني</label>
                  {isEditing ? (
                    <input 
                      type="email"
                      value={user.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <p className="labelstyled">{user.email}</p>
                  )}
                </div>

                <div className="info-item">
                  <label className="labelstyled">رقم الهاتف</label>
                  {isEditing ? (
                    <input 
                      type="tel"
                      value={user.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="edit-input "
                    />
                  ) : (
                    <p className="labelstyled">{user.phone || "غير محدد"}</p>
                  )}
                </div>


              </div>
            </div>

           
          </div>
        )}




      </div>
    </div>
  );
};

export default UserProfile;