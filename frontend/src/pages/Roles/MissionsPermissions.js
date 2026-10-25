import { useState } from "react";
import CustomButton from "../../components/CustomButton";
import "./roles.css";
import CheckboxComponent from "../../components/CheckboxComponent ";
import PermissionsTabs from "./PermissionsTabs";
import API from "../../api/axiosConfig";
import { useParams } from "react-router-dom";

function MissionsPermissions() {
    const rows = [
        { id: 1, label: " المهام", allowAdd: true, allowEdit: true , roleKey: "mission" , allowView: true , allowDelete: true , allowPrint: false },
       // { id: 3, label: "مهام الموظفين", allowAdd: true, allowEdit: true , roleKey: "missionupdate"},
    ];

    const [permissions, setPermissions] = useState(
        rows.reduce((acc, row) => {
            acc[row.id] = { add: false, edit: false, all: false , view: false , delete: false , print: false };
            return acc;
        }, {})
    );

    const handleChange = (rowId, field) => {
        setPermissions((prev) => {
            const newRow = { ...prev[rowId], [field]: !prev[rowId][field] };

            if (field !== "all") {
                newRow.all = newRow.add && newRow.edit;
            } else {
                newRow.add = !prev[rowId].all;
                newRow.edit = !prev[rowId].all;
                newRow.view = !prev[rowId].all;
                newRow.delete = !prev[rowId].all;
                newRow.print = !prev[rowId].all;
            }

            return { ...prev, [rowId]: newRow };
        });
    };

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { id: groupId } = useParams(); // ✅ الحصول على group ID من الـ URL
    const buildRolesArray = () => {
            const selectedRoles = [];
        
            rows.forEach((row) => {
              const perm = permissions[row.id];
              selectedRoles.push(`${row.roleKey}_view`); // view دائمًا موجود
        
              if (perm.add) selectedRoles.push(`${row.roleKey}_create`);
              if (perm.edit) selectedRoles.push(`${row.roleKey}_update`);
                if (perm.delete) selectedRoles.push(`${row.roleKey}_delete`);
                if (perm.print) selectedRoles.push(`${row.roleKey}_print`);
                if (perm.view) selectedRoles.push(`${row.roleKey}_view`);
            });
        
            return selectedRoles;
          };
        
          // ✅ الحفظ في الباك إند
          const handleSave = async () => {
            const roles = buildRolesArray();
            setLoading(true);
            setMessage("");
        
            try {
              await API.post(`/permissions/${groupId}/roles`, { roles });
              setMessage("✅ تم حفظ صلاحيات الأوقاف بنجاح");
            } catch (error) {
              console.error(error);
              setMessage("❌ حدث خطأ أثناء حفظ الصلاحيات");
            } finally {
              setLoading(false);
            }
          };

    return (
        <div className="permissions-container">
            <PermissionsTabs activeTab="missions" />

            <table className="permissions-main-table">
                <tbody>
                    <tr>
                        <td colSpan="5">
                            <div className="permissions-section">
                                <table className="permissions-table">
                                    <thead>
                                        <tr className="permissions-header">
                                            <th colSpan="4">إدارة المهام</th>
                                        </tr>
                                        <tr className="permissions-subheader">
                                            <th></th>
                                            <th>عرض</th>
                                            <th>إضافة</th>
                                            <th>تعديل</th>
                                            <th>حذف</th>
                                            <th>طباعة</th>
                                            <th>الكل</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row) => (
                                            <tr className="permissions-row" key={row.id}>
                                                <td className="permissions-label">{row.label}</td>
                                                <td>
                                                    {row.allowView && (
                                                        <CheckboxComponent
                                                            checked={permissions[row.id].view}
                                                            onChange={() =>
                                                                handleChange(row.id, "view")
                                                            }
                                                            className="permissions-checkbox"
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    {row.allowAdd && (
                                                        <CheckboxComponent
                                                            checked={permissions[row.id].add}
                                                            onChange={() =>
                                                                handleChange(row.id, "add")
                                                            }
                                                            className="permissions-checkbox"
                                                        />
                                                    )}
                                                </td>

                                                <td>
                                                    {row.allowEdit ? (
                                                        <CheckboxComponent
                                                            checked={permissions[row.id].edit}
                                                            onChange={() =>
                                                                handleChange(row.id, "edit")
                                                            }
                                                            className="permissions-checkbox"
                                                        />
                                                    ) : "-"}
                                                </td>

                                                <td>
                                                    {row.allowDelete ? (
                                                        <CheckboxComponent
                                                            checked={permissions[row.id].delete}
                                                            onChange={() =>
                                                                handleChange(row.id, "delete")
                                                            }
                                                            className="permissions-checkbox"
                                                        />
                                                    ) : "-"}
                                                </td>

                                                <td>
                                                    {row.allowPrint ? (
                                                        <CheckboxComponent
                                                            checked={permissions[row.id].print}
                                                            onChange={() =>
                                                                handleChange(row.id, "print")
                                                            }
                                                            className="permissions-checkbox"
                                                        />
                                                    ) : "-"}
                                                </td>

                                                <td>
                                                    <CheckboxComponent
                                                        checked={permissions[row.id].all}
                                                        onChange={() =>
                                                            handleChange(row.id, "all")
                                                        }
                                                        className="permissions-checkbox"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
             {message && (
        <div className="mt-4 text-center font-semibold">{message}</div>
      )}

            <div className="permissions-button-container">
                <CustomButton
                    text={loading ? "جاري الحفظ..." : "حفظ"}
          onClick={handleSave}
          disabled={loading}
          className="permissions-save-button"
                />
            </div>
        </div>
    );
}

export default MissionsPermissions;
