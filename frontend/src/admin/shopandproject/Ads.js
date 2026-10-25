import React, { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../components/TableComponent";
import AdminLayout from "../../layouts/AdminLayouts";
import API from "../../api/axiosConfig";


function Ads(props) {
    const [showModal, setShowModal] = useState(false);
    const [id , setId] = useState('');
    const columns = [
        { name: "إسم الجمعية", key: "org_name" },
        { name: "  اسم الحالة  ", key: "name" },
        { name: " المبلغ ", key: "total" },
        { name: " الحالة", key: "ad_approved" },
        { name: "", key: "actions" },
    ];

  
     const dropdownOptions = [
        { label: "قبول/رفض", action : (id, record) => {
            setId(id);
            try{
                const res = API.post(`/organization/ads/status/update`, {
                    id: id,
                    approved: record.approved ? 0 : 1,
                }).then((res) => {
                    alert("تم التحديث بنجاح");
                    window.location.reload();
                }).catch((error) => {
                    console.error("Error updating status:", error);
                    alert("حدث خطأ ما برجاء المحاولة مرة اخرى.");
                });
            }catch(err){
                console.error("Error fetching data:", err);
            }
        } },
        
    ];
   
  

    return (
        <>
        <AdminLayout />
            <div className="printcasedata-container">

                <TableComponent
                    apiUrl="/organization/ads"
                    columns={columns}
                    title="تقرير الاعلانات الممولة"
                    titleIcon={<FontAwesomeIcon icon={faReceipt} />}
                    dropdownOptions={dropdownOptions}
                    searchDate={false}
                />
            </div>
            
        </>
    );
}

export default Ads;
