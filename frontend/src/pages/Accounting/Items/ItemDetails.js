import { faBoxes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../components/title";
import "./Items.css";
import TableComponent from "../../../components/TableComponent";
import { useState } from "react";
import { useParams } from "react-router-dom";




function ItemDetails() {


 const {id} = useParams();
  const columns = [
    { name: "الإسم", key: "name" },
    { name: "سعر الشراء", key: "purchase" },
    { name: "سعر الجملة", key: "wholesale" },
    { name: "سعر القطاعي", key: "selling" },
    { name: "الوحدة", key: "unit" },
    { name: "", key: "actions" },
  ];


  const dropdownOptions = [
    { label: "اضافة الى المخزن", route: "/iteminstock/:id" },
  ];


  return (
    <>
      <Title title="تفصيل الاصناف" icon={<FontAwesomeIcon icon={faBoxes} />} />
      <div className="Items">
       
       <TableComponent
          apiUrl={`/items/details/`}
          id={id}
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

export default ItemDetails;
