import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./addItem.css";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterSelect from "../../components/RegisterSelect";
import CustomButton from "../../components/CustomButton";
import { Form } from "react-bootstrap";

function AddItem() {
  const hadleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <div className="additem">
        <Title
          title="إضافة صنف جديد"
          icon={<FontAwesomeIcon icon={faSquarePlus} />}
        />

        <Form className="additemForm" onSubmit={hadleSubmit}>
          <div className="additemrow">
            <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="name"
              label="إسم المورد"
              type="text"
              stylee={{
                width: "35%",
              }}
            />

            <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="mobnum"
              label="كود الصنف"
              type="number"
              stylee={{
                width: "35%",
              }}
            />
          </div>

          <div className="additemrow">
            <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="name"
              label="تكلفة الشراء"
              type="number"
              stylee={{
                width: "35%",
              }}
            />

            <RegisterTextbox
              parentStyle={{
                width: "40%",
              }}
              id="mobnum"
              label="تكلفة البيع"
              type="number"
              stylee={{
                width: "35%",
              }}
            />
          </div>

          <div className="additemrow">
            <RegisterSelect
              id="costAcc"
              label="حساب التكلفة"
              stylee={{ width: "55%" }}
              parentStyle={{ width: "40%" }}
              options={[
                { value: "إختر حساب", label: "إختر حساب" },
                { value: "111022", label: "111022" },
              ]}
            />

            <RegisterSelect
              id="sellAcc"
              label="حساب البيع"
              stylee={{ width: "55%" }}
              parentStyle={{ width: "40%" }}
              options={[
                { value: "إختر حساب", label: "إختر حساب" },
                { value: "111022", label: "111022" },
              ]}
            />
          </div>

          <div className="salesinvoiceTable additemTable">
            <div className="invoiceTableContainer">
              <table className=" invoicetable">
                <thead className="invoicetable-thead">
                  <tr>
                    <th>الكمية الحالية</th>
                    <th>كود الصنف</th>
                    <th>التكلفة الكلية</th>
                  </tr>
                </thead>
                <tbody className="invoicetable-tbody">
                  <tr>
                    <td>
                      <RegisterTextbox
                        parentStyle={{
                          width: "100%",
                        }}
                        id="quan"
                        type="number"
                        stylee={{
                          width: "35%",
                        }}
                      />
                    </td>
                    <td>
                      <RegisterTextbox
                        parentStyle={{
                          width: "100%",
                        }}
                        id="Itemcode"
                        type="number"
                        stylee={{
                          width: "35%",
                        }}
                      />
                    </td>
                    <td>
                      <RegisterTextbox
                        parentStyle={{
                          width: "100%",
                        }}
                        id="cost"
                        type="number"
                        stylee={{
                          width: "35%",
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <CustomButton text="حفظ" />
        </Form>
      </div>
    </>
  );
}

export default AddItem;
