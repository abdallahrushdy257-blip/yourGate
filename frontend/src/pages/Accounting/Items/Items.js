import { faBoxes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import { Link } from "react-router-dom";
import "./Items.css";
import TableComponent from "../../../components/TableComponent";
import { useState } from "react";




function Items() {



  const columns = [
    { name: "الإسم", key: "name" },
    { name: "سعر الشراء", key: "purchase" },
    { name: "سعر الجملة", key: "wholesale" },
    { name: "سعر القطاعي", key: "retail" },
    { name: "الكمية", key: "count" },
    { name: "الوصف", key: "description" },
    { name: "", key: "actions" },
  ];


  const dropdownOptions = [
    { label: "تفصيل الصنف", route: "/itemdetails/:id" },
  ];


  return (
    <>
      <Title title="الاصناف" icon={<FontAwesomeIcon icon={faBoxes} />} />
      <div className="Items">
        <div className="Items-for">
          <Link to="/newadditem" className="add-row-ta btn btn-secondary">
            <FontAwesomeIcon icon={faPlus} /> اضافة صنف
          </Link>
        </div>

       <TableComponent
          apiUrl="/items/"
          columns={columns}
          search={false}
          refreshData={true}
          addButton={false}
          dropdownOptions = {dropdownOptions}
        />

      </div>
    </>
  );
}

export default Items;
