import "./pricelist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../../components/title";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import CustomTable from "../../../../components/CustomTable";
import TableComponent from "../../../../components/TableComponent";

function PriceList() {

  



  return (
    <>
      <Title
        title="قائمة الاسعار"
        icon={<FontAwesomeIcon icon={faReceipt} />}
      />
      <div className="pricelist">
       
        <div className="over-flow">
          {/* <CustomTable
            data={[]}
            columns={[
              { key: "id", name: 'التسلسل' },
              { key: "item_code", name: 'الكود' },
              { key: "item_name", name: 'الصنف' },
              { key: "price", name: 'السعر' },
            ]} /> */}

            <TableComponent
            apiUrl={'items/prices'}
            columns={[
              { key: "name", name: 'الصنف' },
              { key: "unit", name: 'الوحدة' },
              { key: "retail", name: ' السعر التجزئة' },
              { key: "wholesale", name: 'السعر الجملة' },
              { key: "price_created_at", name: 'التاريخ' },
              { key: "price_status", name: 'الحالة' },
            ]}
            search={true}
            />

        </div>
      </div>
    </>
  );
}
export default PriceList;
