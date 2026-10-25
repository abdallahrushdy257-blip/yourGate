
import { faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import "./Storeinventory.css";
import RegisterTextbox from "../../../components/RegisterTextBox";
import CustomTable from "../../../components/CustomTable";
import TableComponent from "../../../components/TableComponent";

function Storeinventory() {


  const columns = [
    { name: "الاسم", key: "name" },
    { name: "الوحدة", key: "unit_name" },
    { name: "الكمية", key: "count" },
    { name: "سعر الشراء", key: "purchase" },
    { name: "الاجمالي", key: "total" },
    { name: "المخزن", key: "warehouse" },
  ];





  return (
    <>
      <Title
        title='جرد المخزون'
        icon={<FontAwesomeIcon icon={faWarehouse} />}
      />

      <div className="Items">
        <TableComponent
          apiUrl={`/stock`}
          id={""}
          columns={columns}
          search={true}

          />
      </div>
    </>
  );
}

export default Storeinventory;
