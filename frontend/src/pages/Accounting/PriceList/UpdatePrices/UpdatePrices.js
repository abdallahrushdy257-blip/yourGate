import "./updateprices.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../../components/title";
 import SelectComponent from "../../../../components/SelectComponent";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
 import RegisterTextbox from "../../../../components/RegisterTextBox";
function UpdatePrices() {
 

  const priceTypes = [
    { label:"retail", value: "retail" },
    { label: "wholesale", value: "wholesale" },
    { label: "purchase", value: "purchase" },
  ];
 
  return (
    <>
      <Title
        title="تحديث الأسعار"
        icon={<FontAwesomeIcon icon={faReceipt} />}
      />
      <div className="pricelist">
        <div className="pricelist_row">
          <SelectComponent
            label="الإسم"
            placeholder="الإسم"
            options={[]}
            containerStyle={{ width: "200px" }}
          />
          <SelectComponent
            label="الوحدة"
            placeholder="الوحدة"
            options={[]}
            containerStyle={{ width: "200px" }}
          />
          <SelectComponent
            label="السعر"
            placeholder="السعر"
            containerStyle={{ width: "200px" }}
            options={priceTypes}
          />
        </div>
        <div className="over-flow">
          <table className="table-rport pricestable mt-2">
            <thead>
              <tr className="vac-table-header selected-row mm">
                <th>التسلسل</th>
                <th>الكود</th>
                <th>الإسم</th>
                <th>السعر</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <RegisterTextbox
                    placeholder="السعر"
                    type="number"
                    parentStyle={{ width: "50%" , margin:"auto" }}

                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
export default UpdatePrices;
