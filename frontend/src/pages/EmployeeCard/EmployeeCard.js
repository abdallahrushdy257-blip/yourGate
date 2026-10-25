import './employeeCard.css'
import "../Accounting/WarehouseReport/Warehousereport.css";
import Title from '../../components/title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import CustomTable from '../../components/CustomTable';

function EmployeeCard() {


    const columns = [
        { name: '', key: "id" },
        { name: "الاسم", key: "name" },
        { name: "المسمي الوظيفي", key: "jobTitle" },
        { name: "الرقم الوظيفي", key: "jopNumber" },
        { name: "", key: "actions" },
    ];

    const rows = [
        {
          id: 1,
          name: " محمد",
          jobTitle: "عامل",
          jopNumber: "500123456",
        },
      ];

    const dropdownOptions = [
        { label: "إضافة صورة", route: "/employeeCardPhoto/:id" },
        { label: "عرض الكارت", route: "/showEmployeeCard/:id" },
      ];

    return (
        <>
            <Title
                title="كروت الموظفين"
                icon={<FontAwesomeIcon icon={faUser} />}
            />
            <div className="Warehousereport">
                <CustomTable
                    columns={columns}
                    data={rows}
                    dropdownOptions={dropdownOptions}
                />
            </div>

        </>
    )
}

export default EmployeeCard;