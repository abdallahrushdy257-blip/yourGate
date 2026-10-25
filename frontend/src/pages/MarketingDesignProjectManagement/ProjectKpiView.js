import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { useParams } from 'react-router';
import TableComponent from '../../components/TableComponent';
import ConfirmModal from '../../components/ConfirmModal';
import API from '../../api/axiosConfig';
import { useNavigate } from 'react-router';

function ProjectKpiView() {
    const columns = [
        { name: "السؤال", key: "quiz" },
        { name: " الحالة", key: "status" },
        { name: "", key: "actions" },
    ];
    const navigate = useNavigate();
    const { id } = useParams();
    const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  
    // Confirm Modal states
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await API.get(`/projectkpi/${deleteId}/delete`);
            if (res.status === 200) {
                setTableReloadKey(Date.now());
                setShowConfirm(false);
            }
        } catch (error) {
            console.error("There was an error!", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const dropdownOptions = [
        { label: "حذف", action: (id) => handleDeleteClick(id) },
    ];

    return (
        <>
            <div className="printcasedata-container">
                <TableComponent
                    apiUrl={`/projectkpi/${id}`}
                    columns={columns}
                    title=" مؤشرات الاداء"
                    dropdownOptions={dropdownOptions}
                    search={false}
                    triggerReload={tableReloadKey}
                    addBtn={true}
                    onAddClick={() => navigate(`/projectkpis/${id}`)}
                />
            </div>

            <ConfirmModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                onConfirm={confirmDelete}
                isSubmitting={isDeleting}
                title="تأكيد حذف المؤشر"
                message="هل أنت متأكد من حذف هذا المؤشر من المشروع؟"
            />
        </>
    );
}

export default ProjectKpiView;
