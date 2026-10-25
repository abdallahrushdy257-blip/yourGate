import { useState } from "react";
import CustomButton from "../../components/CustomButton";
import "./roles.css";
import CheckboxComponent from "../../components/CheckboxComponent ";
import PermissionsTabs from "./PermissionsTabs";
import API from "../../api/axiosConfig";
import { useParams } from "react-router-dom";
import { all } from "axios";

function HrPermissions() {
  const { id: groupId } = useParams(); // /groups/:id

  const rows = [
    {
      id: 1,
      label: "المسمي الوظيفي",
      roleKey: "jobtitle",
      allowAdd: true,
      allowEdit: true,
      allowView: true,
      allowDelete: true,
      allowPrint: false,
    },
    {
      id: 2,
      label: "أوراق التوظيف",
      roleKey: "employeepapers",
      allowAdd: true,
      allowEdit: true,
      allowView: true,
      allowDelete: true,
      allowPrint: false,
    },
    {
      id: 3,
      label: "إضافة موظف جديد",
      roleKey: "employee",
      allowAdd: true,
      allowEdit: true,
      allowView: true,
      allowDelete: true,
      allowPrint: false,
    },
    {
      id: 4,
      label: "طلب إجازة او إذن",
      roleKey: "leaverequests",
      allowAdd: true,
      allowEdit: true,
      allowView: true,
      allowDelete: true,
      allowPrint: false,
    },
    {
      id: 5,
      label: "تقييم الأداء الوظيفي",
      roleKey: "evaluation",
      allowAdd: true,
      allowEdit: true,
      allowView: true,
      allowDelete: true,
      allowPrint: false,
    },
    {
      id: 6,
      label: "الحضور والإنصراف",
      roleKey: "attendance",
      allowAdd: true,
      allowEdit: false,
      allowView: false,
      allowDelete: false,
      allowPrint: false,
    },
    {
      id: 7,
      label: "هيكل الشركة",
      roleKey: "organizationchart",
      allowAdd: false,
      allowEdit: false,
      allowView: true,
      allowDelete: false,
      allowPrint: false,
    },
    {
      id: 8,
      label: " مكافأة او خصم",
      roleKey: "salaryactions",
      allowAdd: true,
      allowEdit: true,
      allowView: true,
      allowDelete: true,
      allowPrint: false,
    },
    {
      id: 9,
      label: "إضافة تحقيق",
      roleKey: "investigations",
      allowAdd: true,
      allowEdit: true,
      allowView: true,
      allowDelete: true,
      allowPrint: false,
    },
    {
      id: 10,
      label: "مستندات التوظيف",
      roleKey: "employeeuploads",
      allowAdd: true,
      allowEdit: true,
      allowView: false,
      allowDelete: false,
      allowPrint: false,
    },
    {
      id: 11,
      label: "مسيرات رواتب الموظفين",
      roleKey: "payroll",
      allowAdd: true,
      allowEdit: false,
      allowView: true,
      allowDelete: false,
      allowPrint: false,
    },
    {
      id: 12,
      label: " رواتب الموظفين",
      roleKey: "employeesalary",
      allowAdd: true,
      allowEdit: true,
      allowView: true,
      allowDelete: true,
      allowPrint: false,
    },
    {
      id: 13,
      label: " طلب إجازة",
      roleKey: "vacationrequests",
      allowAdd: true,
      allowEdit: true,
      allowView: true,
      allowDelete: true,
      allowPrint: false,
    },
  ];

  const [permissions, setPermissions] = useState(
    rows.reduce((acc, row) => {
      acc[row.id] = {
        add: false,
        edit: false,
        all: false,
        view: false,
        delete: false,
        print: false,
      };
      return acc;
    }, {}),
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ تحديث الحالة عند التغيير
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

  // ✅ تجهيز مصفوفة roles للإرسال للباك إند
  const buildRolesArray = () => {
    const selectedRoles = [];

    rows.forEach((row) => {
      const perm = permissions[row.id];

      // view دايمًا موجود
      selectedRoles.push(`${row.roleKey}_view`);

      if (perm.add) selectedRoles.push(`${row.roleKey}_create`);
      if (perm.edit) selectedRoles.push(`${row.roleKey}_update`);
      if (perm.delete) selectedRoles.push(`${row.roleKey}_delete`);
      if (perm.print) selectedRoles.push(`${row.roleKey}_print`);
      if (perm.view) selectedRoles.push(`${row.roleKey}_view`);
    });

    return selectedRoles;
  };

  // ✅ حفظ الصلاحيات
  const handleSave = async () => {
    const roles = buildRolesArray();
    setLoading(true);
    setMessage("");

    try {
      await API.post(`/permissions/${groupId}/roles`, { roles });
      setMessage("✅ تم حفظ الصلاحيات بنجاح");
    } catch (error) {
      console.error(error);
      setMessage("❌ حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="permissions-container">
      <PermissionsTabs activeTab="hr" />

      <table className="permissions-main-table">
        <tbody>
          <tr>
            <td colSpan="5">
              <div className="permissions-section">
                <table className="permissions-table">
                  <thead>
                    <tr className="permissions-header">
                      <th colSpan="4">إدارة الموارد البشرية</th>
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
                          {row.allowView ? (
                            <CheckboxComponent
                              checked={permissions[row.id].view}
                              onChange={() => handleChange(row.id, "view")}
                              className="permissions-checkbox"
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {row.allowAdd ? (
                            <CheckboxComponent
                              checked={permissions[row.id].add}
                              onChange={() => handleChange(row.id, "add")}
                              className="permissions-checkbox"
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {row.allowEdit ? (
                            <CheckboxComponent
                              checked={permissions[row.id].edit}
                              onChange={() => handleChange(row.id, "edit")}
                              className="permissions-checkbox"
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {row.allowDelete ? (
                            <CheckboxComponent
                              checked={permissions[row.id].delete}
                              onChange={() => handleChange(row.id, "delete")}
                              className="permissions-checkbox"
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {row.allowPrint ? (
                            <CheckboxComponent
                              checked={permissions[row.id].print}
                              onChange={() => handleChange(row.id, "print")}
                              className="permissions-checkbox"
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          <CheckboxComponent
                            checked={permissions[row.id].all}
                            onChange={() => handleChange(row.id, "all")}
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

export default HrPermissions;
