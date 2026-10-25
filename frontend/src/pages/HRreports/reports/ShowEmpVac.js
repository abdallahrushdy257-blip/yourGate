import TableComponent from "../../../components/TableComponent";
import "../hrreports.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import HRreports from "../HRreports";

const ShowEmpVac = () => {
  const columns = [
    { name: "نوع الاجازه", key: "" },
    { name: "تاريخ الإجازة", key: "" },
  ];

  return (
    <>
      <div className="hrReports-tabel">
        <TableComponent
          apiUrl={"evaluation/kpireport"}
          title="اجازات الموظف"
          titleIcon={<FontAwesomeIcon icon={faTable} />}
          columns={columns}
          searchTextProp={false}
        />
      </div>
    </>
  );
};

export default ShowEmpVac;
