import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { useParams } from 'react-router';
import TableComponent from '../../components/TableComponent';
import ConfirmModal from '../../components/ConfirmModal';
import { projectService } from '../../modules/projects';
import { useNavigate } from 'react-router';
import ProjectKPI from './ProjectKPI';

function ProjectKpiView() {
    const columns = [
        { name: "المؤشر", key: "quiz" },
        { name: "القيمة المتوقعة", key: "target" },
        { name: "القيمة الحالية", key: "actual" },
        { name: "الحالة", key: "status" },
        { name: "", key: "actions" },
    ];
    const navigate = useNavigate();
    const { id } = useParams();
    const [tableReloadKey, setTableReloadKey] = useState(Date.now());
    const [showKpiModal, setShowKpiModal] = useState(false);
  
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
            const res = await projectService.deleteProjectKpi(deleteId);
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
        { label: "تعديل القيم", action: () => setShowKpiModal(true) },
        { label: "حذف", action: (rowId) => handleDeleteClick(rowId) },
    ];

    const transformRow = (row) => {
        let badgeClass = "badge bg-secondary";
        if (row.status === "ممتاز") badgeClass = "badge bg-success";
        else if (row.status === "تحذير") badgeClass = "badge bg-warning text-dark";
        else if (row.status === "خطر") badgeClass = "badge bg-danger";

        return {
            ...row,
            target: row.target !== null && row.target !== undefined ? row.target : "-",
            actual: row.actual !== null && row.actual !== undefined ? row.actual : "-",
            status: `<span class="${badgeClass} px-3 py-2 fs-6">${row.status || "خطر"}</span>`,
        };
    };

    return (
        <>
            <div className="printcasedata-container">
                <TableComponent
                    apiUrl={`/projectkpi/${id}`}
                    columns={columns}
                    title=" مؤشرات الاداء"
                    dropdownOptions={dropdownOptions}
                    transformRowFn={transformRow}
                    search={false}
                    triggerReload={tableReloadKey}
                    addBtn={true}
                    onAddClick={() => setShowKpiModal(true)}
                />
            </div>

            <ProjectKPI
                show={showKpiModal}
                onHide={() => setShowKpiModal(false)}
                projectId={id}
                onSuccess={() => setTableReloadKey(Date.now())}
            />

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
