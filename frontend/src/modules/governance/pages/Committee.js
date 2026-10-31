import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsersBetweenLines,
  faXmark,
  faPeopleGroup,
  faUserCheck,
  faShieldHalved,
  faTriangleExclamation,
  faPenToSquare,
  faUser,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback } from "react";
import TableComponent from "../../../components/TableComponent";
import { Modal, Button, Spinner } from "react-bootstrap";
import RegisterTextbox from "../../../components/RegisterTextBox";
import RegisterSelect from "../../../components/RegisterSelect";
import API from "../../../api/axiosConfig";
import "./committee.css";

function Committee() {
  const [tableReloadKey, setTableReloadKey] = useState(Date.now());
  const [stats, setStats] = useState({ total_committees: 0, total_members: 0 });

  // Add Modal State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [boardMembers, setBoardMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSelectedMembers, setEditSelectedMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState({});

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // View Members Modal State
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [viewingCommittee, setViewingCommittee] = useState(null);
  const [committeeMembersList, setCommitteeMembersList] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Fetch KPI Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await API.get("/associationcommittee/stats");
      if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching committee stats:", err);
    }
  }, []);

  // Fetch Assembly Members for Dropdown
  const getBoardMembers = async () => {
    try {
      const res = await API.get("/associationcommittee/components/assemblymembers");
      const data = res.data?.data || res.data;
      setBoardMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching board members:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    getBoardMembers();
  }, [fetchStats]);

  // Reset Add Form
  const resetForm = () => {
    setName("");
    setDescription("");
    setSelectedMembers([]);
    setError({});
  };

  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  // Submit Add Committee
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    setError({});

    try {
      const payload = {
        name,
        description,
        members: selectedMembers,
      };

      const res = await API.post("/associationcommittee/store", payload);
      if (res.status === 200 || res.status === 201) {
        handleClose();
        setTableReloadKey(Date.now());
        fetchStats();
      } else {
        setError(res.data.errors || {});
      }
    } catch (err) {
      console.error("Error storing committee:", err);
      setError(err.response?.data?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = async (committeeId, committeeRecord) => {
    try {
      setEditId(committeeId);
      setEditName(committeeRecord?.name || "");
      setEditDescription(committeeRecord?.description || "");
      setEditError({});

      const res = await API.get(`/associationcommittee/${committeeId}`);
      const data = res.data?.data || res.data;
      if (data) {
        setEditName(data.name || "");
        setEditDescription(data.description || "");
        const mapped = (data.members || []).map((m) => ({
          id: m.assembly_member_id || m.id,
          name: m.name,
          role: m.role || "عضو",
        }));
        setEditSelectedMembers(mapped);
      }
      setShowEditModal(true);
    } catch (err) {
      console.error("Error loading committee details:", err);
    }
  };

  // Submit Edit Committee
  const handleEditSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsEditing(true);
    setEditError({});

    try {
      const payload = {
        name: editName,
        description: editDescription,
        members: editSelectedMembers,
      };

      const res = await API.post(`/associationcommittee/update/${editId}`, payload);
      if (res.status === 200 || res.status === 201) {
        setShowEditModal(false);
        setTableReloadKey(Date.now());
        fetchStats();
      } else {
        setEditError(res.data.errors || {});
      }
    } catch (err) {
      console.error("Error updating committee:", err);
      setEditError(err.response?.data?.errors || {});
    } finally {
      setIsEditing(false);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (committeeId, committeeRecord) => {
    setDeleteId(committeeId);
    setDeleteName(committeeRecord?.name || "هذه اللجنة");
    setShowDeleteModal(true);
  };

  // Submit Delete Committee
  const handleDeleteSubmit = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const res = await API.delete(`/associationcommittee/${deleteId}`);
      if (res.status === 200 || res.status === 204) {
        setShowDeleteModal(false);
        setTableReloadKey(Date.now());
        fetchStats();
      }
    } catch (err) {
      console.error("Error deleting committee:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Open View Members Modal
  const handleOpenMembersModal = async (committeeId, committeeRecord) => {
    setShowMembersModal(true);
    setViewingCommittee({
      id: committeeId,
      name: committeeRecord?.name || "اللجنة",
      description: committeeRecord?.description || "",
      members_count: committeeRecord?.members_count ?? committeeRecord?.members?.length ?? 0,
    });
    setCommitteeMembersList(committeeRecord?.members || []);
    setLoadingMembers(true);

    try {
      const res = await API.get(`/associationcommittee/${committeeId}`);
      const data = res.data?.data || res.data;
      if (data) {
        setViewingCommittee(data);
        setCommitteeMembersList(data.members || []);
      }
    } catch (err) {
      console.error("Error loading committee members:", err);
    } finally {
      setLoadingMembers(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    if (!role) return "badge-role-member";
    if (role.includes("رئيس") && !role.includes("نائب")) return "badge-role-head";
    if (role.includes("نائب")) return "badge-role-deputy";
    if (role.includes("أمين") || role.includes("سر")) return "badge-role-secretary";
    return "badge-role-member";
  };

  const columns = [
    { name: "اسم اللجنة", key: "name" },
    { name: "وصف اللجنة", key: "description" },
    { name: "عدد الأعضاء", key: "members_count_badge" },
    { name: "", key: "actions" },
  ];

  const transformRowFn = (record) => {
    const count = record.members_count ?? record.members?.length ?? 0;
    return {
      ...record,
      description: record.description || "لا يوجد وصف مسجل",
      members_count_badge: `<span class="badge-members-count">${count} عضو</span>`,
    };
  };

  const dropdownOptions = [
    { label: "عرض الأعضاء", action: (id, record) => handleOpenMembersModal(id, record) },
    { label: "تعديل", action: (id, record) => handleOpenEdit(id, record) },
    { label: "حذف اللجنة", action: (id, record) => handleOpenDelete(id, record) },
  ];

  return (
    <div className="committee-page-container">
      {/* ── Top KPI Statistics Cards ── */}
      <div className="committee-stats-grid">
        <div className="committee-stat-card stat-gold">
          <div className="committee-stat-content">
            <div className="committee-stat-info">
              <span className="committee-stat-title">إجمالي اللجان المعتمدة</span>
              <span className="committee-stat-value">{stats.total_committees}</span>
              <span className="committee-stat-sub">اللجان المشكّلة بالجمعية</span>
            </div>
            <div className="committee-stat-icon-wrapper">
              <FontAwesomeIcon icon={faPeopleGroup} />
            </div>
          </div>
        </div>

        <div className="committee-stat-card stat-blue">
          <div className="committee-stat-content">
            <div className="committee-stat-info">
              <span className="committee-stat-title">إجمالي الأعضاء المكلفين</span>
              <span className="committee-stat-value">{stats.total_members}</span>
              <span className="committee-stat-sub">الأعضاء المشاركون باللجان</span>
            </div>
            <div className="committee-stat-icon-wrapper">
              <FontAwesomeIcon icon={faUserCheck} />
            </div>
          </div>
        </div>

        <div className="committee-stat-card stat-green">
          <div className="committee-stat-content">
            <div className="committee-stat-info">
              <span className="committee-stat-title">حالة اللجان</span>
              <span className="committee-stat-value" style={{ fontSize: "20px", color: "#38a169" }}>
                نشطة ومفعلة
              </span>
              <span className="committee-stat-sub">متابعة مستمرة للاجتماعات</span>
            </div>
            <div className="committee-stat-icon-wrapper">
              <FontAwesomeIcon icon={faShieldHalved} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Table Container ── */}
      <TableComponent
        apiUrl="/associationcommittee"
        columns={columns}
        title="تقرير اللجان المشكّلة"
        titleIcon={<FontAwesomeIcon icon={faUsersBetweenLines} />}
        dropdownOptions={dropdownOptions}
        transformRowFn={transformRowFn}
        searchDate={false}
        addBtn={true}
        onAddClick={() => {
          resetForm();
          setShowModal(true);
        }}
        addBtnName="تشكيل لجنة"
        triggerReload={tableReloadKey}
      />

      {/* ── Add Committee Modal ── */}
      <Modal
        show={showModal}
        onHide={handleClose}
        className="modal-table archModal donor-modal committee-modal"
        centered
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>
            <FontAwesomeIcon icon={faPeopleGroup} style={{ color: "var(--primary-color, #b89358)" }} />
            <span>تشكيل لجنة جديدة</span>
          </Modal.Title>
          <Button
            className="custom-close-button"
            variant="link"
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ direction: "rtl" }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <RegisterTextbox
                id="add-committee-name"
                label="اسم اللجنة *"
                type="text"
                placeholder="أدخل اسم اللجنة (مثال: لجنة الاستثمار وتنمية الموارد)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={error.name}
              />
            </div>

            <div className="mb-3">
              <RegisterTextbox
                id="add-committee-desc"
                label="وصف واختصاصات اللجنة"
                type="text"
                placeholder="أدخل نبذة مختصرة عن مهام واختصاصات اللجنة"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={error.description}
              />
            </div>

            <div className="mb-2">
              <label className="register-label">اختيار أعضاء اللجنة من الجمعية العمومية والمجلس</label>
              <div className="committee-members-box">
                {boardMembers.length === 0 ? (
                  <p style={{ margin: "8px", fontSize: "13px", color: "var(--placeholder-color)" }}>
                    لا يوجد أعضاء متاحون للاختيار
                  </p>
                ) : (
                  boardMembers.map((member) => {
                    const isChecked = selectedMembers.some((m) => m.id === member.id);
                    return (
                      <div
                        key={member.id}
                        className={`committee-member-item ${isChecked ? "selected" : ""}`}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id));
                          } else {
                            setSelectedMembers([
                              ...selectedMembers,
                              { id: member.id, name: member.name, role: "عضو" },
                            ]);
                          }
                        }}
                      >
                        <p className="member-item-title">
                          <span>{member.name}</span>
                          {member.membership_serial && (
                            <span className="member-serial-mini">({member.membership_serial})</span>
                          )}
                        </p>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {selectedMembers.length > 0 && (
              <div className="mb-2">
                <label className="register-label">
                  تحديد أدوار الأعضاء المختارين ({selectedMembers.length} أعضاء)
                </label>
                <div className="committee-roles-grid">
                  {selectedMembers.map((member, index) => (
                    <div key={member.id} className="committee-role-card">
                      <div className="role-card-header">
                        <span className="role-card-name">{member.name}</span>
                      </div>
                      <RegisterSelect
                        id={`role-${member.id}`}
                        label="الدور داخل اللجنة"
                        options={[
                          { value: "رئيس اللجنة", label: "رئيس اللجنة" },
                          { value: "نائب رئيس", label: "نائب رئيس" },
                          { value: "عضو", label: "عضو" },
                          { value: "أمين سر اللجنة", label: "أمين سر اللجنة" },
                        ]}
                        value={member.role}
                        onChange={(e) => {
                          const updated = [...selectedMembers];
                          updated[index].role = e.target.value;
                          setSelectedMembers(updated);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            إلغاء
          </Button>
          {isSubmitting ? (
            <Button variant="primary" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              حفظ وتشكيل اللجنة
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* ── Edit Committee Modal ── */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        className="modal-table archModal donor-modal committee-modal"
        centered
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>
            <FontAwesomeIcon icon={faPenToSquare} style={{ color: "var(--primary-color, #b89358)" }} />
            <span>تعديل بيانات اللجنة وأعضائها</span>
          </Modal.Title>
          <Button
            className="custom-close-button"
            variant="link"
            onClick={() => setShowEditModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ direction: "rtl" }}>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-3">
              <RegisterTextbox
                id="edit-committee-name"
                label="اسم اللجنة *"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                error={editError.name}
              />
            </div>

            <div className="mb-3">
              <RegisterTextbox
                id="edit-committee-desc"
                label="وصف واختصاصات اللجنة"
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                error={editError.description}
              />
            </div>

            <div className="mb-2">
              <label className="register-label">أعضاء الجمعية العمومية والمجلس المكلفون</label>
              <div className="committee-members-box">
                {boardMembers.map((member) => {
                  const isChecked = editSelectedMembers.some((m) => m.id === member.id);
                  return (
                    <div
                      key={member.id}
                      className={`committee-member-item ${isChecked ? "selected" : ""}`}
                      onClick={() => {
                        if (isChecked) {
                          setEditSelectedMembers(editSelectedMembers.filter((m) => m.id !== member.id));
                        } else {
                          setEditSelectedMembers([
                            ...editSelectedMembers,
                            { id: member.id, name: member.name, role: "عضو" },
                          ]);
                        }
                      }}
                    >
                      <p className="member-item-title">
                        <span>{member.name}</span>
                        {member.membership_serial && (
                          <span className="member-serial-mini">({member.membership_serial})</span>
                        )}
                      </p>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {editSelectedMembers.length > 0 && (
              <div className="mb-2">
                <label className="register-label">
                  تحديد أدوار الأعضاء المكلفين ({editSelectedMembers.length} أعضاء)
                </label>
                <div className="committee-roles-grid">
                  {editSelectedMembers.map((member, index) => (
                    <div key={member.id} className="committee-role-card">
                      <div className="role-card-header">
                        <span className="role-card-name">{member.name}</span>
                      </div>
                      <RegisterSelect
                        id={`edit-role-${member.id}`}
                        label="الدور داخل اللجنة"
                        options={[
                          { value: "رئيس اللجنة", label: "رئيس اللجنة" },
                          { value: "نائب رئيس", label: "نائب رئيس" },
                          { value: "عضو", label: "عضو" },
                          { value: "أمين سر اللجنة", label: "أمين سر اللجنة" },
                        ]}
                        value={member.role}
                        onChange={(e) => {
                          const updated = [...editSelectedMembers];
                          updated[index].role = e.target.value;
                          setEditSelectedMembers(updated);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            إلغاء
          </Button>
          {isEditing ? (
            <Button variant="primary" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleEditSubmit}>
              حفظ التعديلات
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        className="modal-table archModal donor-modal committee-delete-modal"
        centered
        size="sm"
      >
        <Modal.Header>
          <Modal.Title style={{ color: "#e53e3e" }}>
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>تأكيد حذف اللجنة</span>
          </Modal.Title>
          <Button
            className="custom-close-button"
            variant="link"
            onClick={() => setShowDeleteModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </Modal.Header>
        <Modal.Body style={{ direction: "rtl", textAlign: "center", padding: "24px 20px" }}>
          <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "8px" }}>
            هل أنت متأكد من رغبتك في حذف اللجنة:
          </p>
          <p style={{ fontSize: "16px", fontWeight: "800", color: "#e53e3e" }}>
            "{deleteName}"
          </p>
          <p style={{ fontSize: "12.5px", color: "var(--placeholder-color, #9c8e7c)", margin: 0 }}>
            سيتم حذف بيانات تشكيل هذه اللجنة وأدوار الأعضاء المرتبطين بها نهائياً.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            إلغاء
          </Button>
          {isDeleting ? (
            <Button variant="danger" disabled>
              <Spinner animation="border" size="sm" />
            </Button>
          ) : (
            <Button variant="danger" onClick={handleDeleteSubmit}>
              تأكيد الحذف
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* ── View Committee Members Modal ── */}
      <Modal
        show={showMembersModal}
        onHide={() => setShowMembersModal(false)}
        className="modal-table archModal donor-modal committee-modal committee-members-view-modal"
        centered
        size="lg"
      >
        <Modal.Header>
          <Modal.Title style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <FontAwesomeIcon icon={faUsersBetweenLines} style={{ color: "var(--primary-color, #b89358)" }} />
            <span>تقرير أعضاء اللجنة: {viewingCommittee?.name}</span>
            <span className="badge-members-count-pill">
              {committeeMembersList.length} {committeeMembersList.length === 1 ? "عضو" : "أعضاء"}
            </span>
          </Modal.Title>
          <Button
            className="custom-close-button"
            variant="link"
            onClick={() => setShowMembersModal(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ direction: "rtl", padding: "20px 24px" }}>
          {viewingCommittee?.description && (
            <div className="committee-view-desc-banner">
              <span className="desc-title">وصف اللجنة:</span>
              <span className="desc-text">{viewingCommittee.description}</span>
            </div>
          )}

          {loadingMembers ? (
            <div className="committee-members-loading">
              <Spinner animation="border" size="sm" variant="warning" />
              <span>جاري تحميل قائمة أعضاء اللجنة...</span>
            </div>
          ) : committeeMembersList.length === 0 ? (
            <div className="committee-members-empty">
              <FontAwesomeIcon icon={faPeopleGroup} className="empty-icon" />
              <h6>لا يوجد أعضاء مسجلين في هذه اللجنة حتى الآن</h6>
              <p>يمكنك إضافة أعضاء لهذه اللجنة عبر النقر على زر "تعديل تشكيل اللجنة" بالأسفل.</p>
            </div>
          ) : (
            <div className="committee-members-table-wrapper">
              <table className="committee-view-table">
                <thead>
                  <tr>
                    <th style={{ width: "50px", textAlign: "center" }}>م</th>
                    <th>اسم العضو</th>
                    <th style={{ width: "160px" }}>الدور التكليفي باللجنة</th>
                  </tr>
                </thead>
                <tbody>
                  {committeeMembersList.map((member, idx) => (
                    <tr key={member.id || idx}>
                      <td className="member-index-cell">{idx + 1}</td>
                      <td className="member-name-cell">
                        <div className="member-name-wrapper">
                          <span className="member-avatar-circle">
                            <FontAwesomeIcon icon={faUser} />
                          </span>
                          <span className="member-name-text">{member.name}</span>
                        </div>
                      </td>
                      <td className="member-role-cell">
                        <span className={getRoleBadgeClass(member.role)}>
                          {member.role || "عضو"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer style={{ justifyContent: "space-between" }}>
          <Button
            variant="secondary"
            onClick={() => setShowMembersModal(false)}
          >
            إغلاق
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowMembersModal(false);
              handleOpenEdit(viewingCommittee?.id, viewingCommittee);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} style={{ marginLeft: "8px" }} />
            تعديل تشكيل اللجنة
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Committee;
