import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import Title from "../../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RegisterTextbox from "../../../components/RegisterTextBox";
import CustomButton from "../../../components/CustomButton";
import '../AddSupplier/AddSupplier.css'

function AddClient() {


  return (
    <>
      <Title
        title="إضافة عميل جديد"
        icon={<FontAwesomeIcon icon={faPlusSquare} />}
        style={{ width: "unset" }}
      />
      <div className="AddSupplier mt-5">
        <form className="input-AddSupplier">
          <RegisterTextbox
            parentStyle={{
              width: "30%",
            }}
            id="name"
            label="إسم العميل"
            type="text"
            stylee={{
              width: "30%",
            }}
          />
          <RegisterTextbox
            parentStyle={{
              width: "30%",
            }}
            id="phone"
            label="رقم الجوال"
            type="phone"
            stylee={{
              width: "30%",
            }}
          />
          <RegisterTextbox
            parentStyle={{
              width: "30%",
            }}
            id="email"
            label="البريد الإلكتروني"
            type="email"
            stylee={{
              width: "30%",
            }}
          />
          {/* Balance */}
          <RegisterTextbox
            parentStyle={{
              width: "30%",
            }}
            id="balance"
            label="الرصيد الافتتاحي"
            type="number"
            stylee={{
              width: "30%",
            }}
          />
          <RegisterTextbox
            parentStyle={{
              width: "30%",
            }}
            id="description"
            label="الوصف"
            type="text"

            stylee={{
              width: "30%",
            }}
          />

          <div className="addclint-Button-con">
            <CustomButton
              text="حفظ"
              type="submit"
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default AddClient;
