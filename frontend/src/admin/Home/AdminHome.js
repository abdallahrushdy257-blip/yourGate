import { useState } from "react";
import Dashboard from "../../Dashboard/Dashboard";
import AdminLayout from "../../layouts/AdminLayouts";
function AdminHome(props) {
  return (
    <>
    <AdminLayout />
      <div className="dashboard">
        <div className="dashcontent">
          <div className="flex20 flex201">
            <div className="con_cards">
              <div className="big_card myShadow">
                <div className="text_big">
                  <span> عدد الجمعيات</span>
                  <span>5</span>
                </div>

                <div className="text_big">
                  <span>الاعلانات</span>
                  <span>5 </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHome;
