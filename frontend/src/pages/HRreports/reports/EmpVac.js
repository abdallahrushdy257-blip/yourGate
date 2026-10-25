import TableComponent from "../../../components/TableComponent";
import "../hrreports.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import HRreports from "../HRreports";

const EmpVac = () => {
  const columns = [
    { name: "إسم الموظف", key: "name" },
    { name: "نوع الاجازه", key: "vacationname" },
    { name: "عدد ايام الإجازة", key: "total_days" },
    //{ name: "المستحق", key: "" },
    { name: "الاجراءات", key: "actions" },
  ];

  const dropdownOptions = [{ label: "عرض", route: "/showEmpVac" }];

  return (
    <>
      {/* <HRreports activeTab="kpireport" /> */}
      <div className="hrReports-tabel mt-5 pt-4">
        <TableComponent
          apiUrl={"vacationrequests/approved"}
          title="اجازات الموظفين"
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          columns={columns}
          dropdownOptions={dropdownOptions}
          searchDate={false}
        />
      </div>
    </>
  );
};

export default EmpVac;
